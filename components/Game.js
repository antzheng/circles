import React, { PureComponent } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  AsyncStorage,
} from "react-native";
import debounce from "lodash/debounce";
import {
  styles,
  colors,
  colorKeys,
  TimeLeft,
  MovesLeft,
} from "./../styles/Stylesheet";

class Game extends PureComponent {
  // list all possible states for later
  state = {
    dots: null, // grid of dots
    pivots: null, // coordinates for dots
    currentDot: null, // current dot
    path: null, // the path to be removed
    toRemove: null, // list of removable dots not included in path
    shakeAnimation: null, // shake animation value
    playAnim: null, // should the animation play
    score: null, // how many dots have been popped
    possible: null, // are there any possible moves
    freeze: null, // prevent adding if there is a square
    TimeLeft: null, // number of seconds left for Timed mode
    MovesLeft: null, // number of moves left for Moves mode
    mode: null, // Time, Moves, or Endless
  };

  // -------------------- INITIAL SETUP --------------------

  constructor(props) {
    // call super constructor
    super(props);

    // populate the dots grid
    const dots = this.populateGrid([]);

    // set up the state
    this.state = {
      dots: dots,
      pivots: Array(props.gridSize)
        .fill()
        .map(() => Array(props.gridSize).fill(0)),
      currentDot: null,
      path: [],
      toRemove: [],
      shakeAnimation: new Animated.Value(0),
      playAnim: false,
      score: 0,
      possible: true,
      freeze: false,
      TimeLeft: TimeLeft,
      MovesLeft: MovesLeft,
      mode: props.route.params
        ? props.route.params.mode || "Endless"
        : "Endless",
    };
  }

  // -------------------- LIFECYCLE METHODS --------------------

  // on first render
  componentDidMount() {
    // bind necessary methods
    this.navigate = debounce(this.navigate, 500, {
      leading: true,
      trailing: false,
    });
    this.pop = debounce(this.pop, 500, {
      leading: true,
      trailing: false,
    });
    this.popToTop = debounce(this.popToTop, 500, {
      leading: true,
      trailing: false,
    });

    // set up pivots after slight delay
    setTimeout(() => {
      // set up the coordinate system
      for (let i = 0; i < this.props.gridSize; i++) {
        for (let j = 0; j < this.props.gridSize; j++) {
          this.setPivot(i, j);
        }
      }
    }, 500);

    // set up Timer for Timed mode
    this.interval = null;

    if (this.state.mode === "Time") {
      this.interval = setInterval(() => {
        this.setState((state) => {
          if (state.TimeLeft === 1) clearInterval(this.interval);
          return { TimeLeft: state.TimeLeft - 1 };
        });
      }, 1000);
    }
  }

  // on subsequent renders
  async componentDidUpdate() {
    // define game over
    if (
      (this.state.mode === "Time" &&
        !this.state.possible &&
        this.state.TimeLeft <= 2) ||
      this.state.TimeLeft === 0 ||
      this.state.MovesLeft === 0
    ) {
      // clear intervals
      clearInterval(this.interval);

      // get old highscore for this mode
      let highscore = await this.retrieveScore();

      // compare scores
      if (this.state.score > highscore) {
        await this.saveScore();
        highscore = this.state.score;
      }

      // navigate to Game Over page
      this.navigate("GameOver", {
        mode: this.state.mode,
        refresh: this.refresh,
        score: this.state.score,
        highscore: highscore,
      });
    }
    // if not game over, shuffle if need
    else if (!this.state.possible) {
      this.shuffleGrid();
    }

    // define offset and duration of animation
    const offset = 5;
    const duration = 75;

    // specify configs for animation
    const useNativeDriver = true;

    // only plays when necessary, prevents infinite cycle
    if (this.state.playAnim) {
      this.setState({ playAnim: false });
      Animated.sequence([
        Animated.timing(this.state.shakeAnimation, {
          toValue: offset * 2,
          duration: duration,
          useNativeDriver: useNativeDriver,
        }),
        Animated.timing(this.state.shakeAnimation, {
          toValue: -offset * 1.5,
          duration: duration,
          useNativeDriver: useNativeDriver,
        }),
        Animated.timing(this.state.shakeAnimation, {
          toValue: offset,
          duration: duration,
          useNativeDriver: useNativeDriver,
        }),
        Animated.timing(this.state.shakeAnimation, {
          toValue: 0,
          duration: duration,
          useNativeDriver: useNativeDriver,
        }),
      ]).start();
    }
  }

  // when screen unmounts
  componentWillUnmount() {
    // clear intervals
    clearInterval(this.interval);
  }

  // -------------------- NAVIGATION METHODS --------------------

  // method to navigate to new screen
  navigate = (route, params) => {
    this.props.navigation.navigate(route, params);
  };

  // method to go back one screen
  pop = () => {
    this.props.navigation.pop();
  };

  // method to go to the home screen
  popToTop = () => {
    this.props.playSelectFX();
    this.props.navigation.popToTop();
  };

  // -------------------- STORAGE METHODS --------------------

  // retrieve score from async storage
  retrieveScore = async () => {
    try {
      const key = "@" + this.state.mode + "-highscore";
      const score = await AsyncStorage.getItem(key);
      return JSON.parse(score) || 0;
    } catch (e) {
      return 0;
    }
  };

  // save score to async storage
  saveScore = async () => {
    try {
      const key = "@" + this.state.mode + "-highscore";
      await AsyncStorage.setItem(key, JSON.stringify(this.state.score));
    } catch (e) {}
  };

  // -------------------- PANRESPONDER SETUP --------------------

  // set up panresponder and gesture values
  panResponder = PanResponder.create({
    // set up responder
    onStartShouldSetPanResponder: (event, gestureState) => true,

    // the gesture has started
    onPanResponderGrant: (event, gestureState) =>
      this.handlerTouch(event, gestureState),

    // the gesture is in progress
    onPanResponderMove: (event, gestureState) =>
      this.handlerMove(event, gestureState),

    // the gesture has been released
    onPanResponderRelease: (event, gestureState) =>
      this.handlerRelease(event, gestureState),
  });

  // -------------------- PANRESPONDER HANDLERS --------------------

  // handler for initial touch
  handlerTouch = (event, gestureState) => {
    // store references to hovered pivot and current dot
    const res = this.checkPivot(gestureState, true);
    const currentDot = this.state.currentDot;

    // update dot if user has hovered over new one
    if (this.canAddToPath(res, currentDot)) {
      this.props.playBlopFX(res[0], res[1]);
      this.setState((state) => {
        // change dot styling
        const dots = state.dots;
        dots[res[0]][res[1]].styling = "circleHover";

        // add dot to path
        const newPath = state.path;
        newPath.push(res);

        // set up new state
        return {
          dots: dots,
          path: newPath,
          currentDot: res,
        };
      });
    }
  };

  // handler for movement
  handlerMove = (event, gestureState) => {
    // store references to hovered pivot and current dot
    const res = this.checkPivot(gestureState, false);
    const currentDot = this.state.currentDot;

    // delete dot if user backtracks
    if (this.canRemoveFromPath(res)) {
      this.setState((state) => {
        // store references
        const dots = state.dots;
        const path = state.path;

        // delete dot from path
        const [oldX, oldY] = path.pop();

        let stillInPath = false;
        for (const [x, y] of path) {
          if (oldX === x && oldY === y) {
            stillInPath = true;
            break;
          }
        }

        // change styling
        dots[oldX][oldY].styling = stillInPath ? "circleHover" : "circle";

        for (const [x, y] of state.toRemove) {
          if (dots[x][y].color === dots[oldX][oldY].color) {
            dots[x][y].styling = "circle";
          }
        }

        // set up new state
        return {
          dots: dots,
          path: path,
          currentDot: res,
          freeze: false,
          toRemove: [],
        };
      });
    }
    // otherwise, update dot if user has hovered over new one
    else if (this.canAddToPath(res, currentDot)) {
      this.props.playBlopFX(res[0], res[1]);
      this.setState((state) => {
        // change dot styling
        const dots = state.dots;
        dots[res[0]][res[1]].styling = "circleHover";

        // add dot to path
        const newPath = state.path;
        newPath.push(res);

        // set up new state
        return {
          dots: dots,
          path: newPath,
          currentDot: res,
        };
      });
    }
    // otherwise, highlight all dots of same color if there is square
    else if (this.isSquare(res, currentDot)) {
      this.props.playSquareFX();
      this.setState((state) => {
        // change dot styling and add to toRemove
        const dots = state.dots;
        const toRemove = [];

        for (let i = 0; i < this.props.gridSize; i++) {
          for (let j = 0; j < this.props.gridSize; j++) {
            let exclude = false;
            for (const [x, y] of state.path) {
              if (i === x && j === y) {
                exclude = true;
                break;
              }
            }
            if (!exclude && dots[i][j].color === dots[res[0]][res[1]].color) {
              dots[i][j].styling = "circleHover";
              toRemove.push([i, j]);
            }
          }
        }

        // add dot to path
        const newPath = state.path;
        newPath.push(res);

        // set up new state
        return {
          dots: dots,
          path: newPath,
          currentDot: res,
          toRemove: toRemove,
          freeze: true,
        };
      });
    }
  };

  // handler for when user releases touch
  handlerRelease = (event, gestureState) => {
    // if for some reason no dots are selected
    if (this.state.path.length === 0) return;

    // reset current dot, path, and styling upon release
    this.setState((state) => {
      // store reference to dots and size
      const dots = state.dots;
      const size = dots.length;
      const keys = colorKeys;
      const added = state.path.length + state.toRemove.length;

      // if path contains one dot, reset but do not clear
      if (state.path.length === 1) {
        const [x, y] = state.path[0];
        dots[x][y].styling = "circle";

        // set up new state
        return {
          dots: dots,
          path: [],
          currentDot: null,
        };
      }

      // clear the path
      for (let i = 0; i < size; i++) {
        const newColumn = [];
        for (let j = 0; j < size; j++) {
          let exclude = false;
          for (const [x, y] of state.path) {
            if (i === x && j === y) {
              exclude = true;
              break;
            }
          }
          for (const [x, y] of state.toRemove) {
            if (i === x && j === y) {
              exclude = true;
              break;
            }
          }
          if (!exclude) {
            dots[i][j].new = false;
            newColumn.push(dots[i][j]);
          }
        }
        for (let index = newColumn.length; index < size; index++) {
          newColumn[index] = {
            color: colors[keys[(Math.random() * keys.length) << 0]],
            styling: "circle",
            new: true,
          };
        }
        dots[i] = newColumn;
      }

      // set up new state
      return {
        dots: dots,
        path: [],
        currentDot: null,
        playAnim: true,
        score: state.score + added,
        possible: this.checkGrid(dots),
        freeze: false,
        toRemove: [],
        MovesLeft:
          state.mode === "Moves" ? state.MovesLeft - 1 : state.MovesLeft,
      };
    });
  };

  // -------------------- GRID HELPER METHODS --------------------

  // refresh the state when game board is loaded from game over
  refresh = () => {
    // reset state
    this.setState({
      dots: this.populateGrid([]),
      currentDot: null,
      path: [],
      toRemove: [],
      shakeAnimation: new Animated.Value(0),
      playAnim: false,
      score: 0,
      possible: true,
      freeze: false,
      TimeLeft: TimeLeft,
      MovesLeft: MovesLeft,
    });

    // set up Timer for Timed mode
    if (this.state.mode === "Time") {
      this.interval = setInterval(() => {
        this.setState((state) => {
          if (state.TimeLeft === 1) clearInterval(this.interval);
          return { TimeLeft: state.TimeLeft - 1 };
        });
      }, 1000);
    }
  };

  // shuffle the grid
  shuffleGrid = () => {
    // navigate to shuffling
    this.navigate("Shuffling");

    // reset state
    this.setState({
      dots: this.populateGrid([]),
      currentDot: null,
      path: [],
      toRemove: [],
      shakeAnimation: new Animated.Value(0),
      playAnim: false,
      freeze: false,
      shufflingBoolean: true,
      possible: true,
    });
  };

  // check grid to see if any moves are possible
  checkGrid = (grid) => {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        const surroundings = [
          [i - 1, j],
          [i + 1, j],
          [i, j - 1],
          [i, j + 1],
        ];
        for (const [x, y] of surroundings) {
          if (
            x >= 0 &&
            x < grid.length &&
            y >= 0 &&
            y < grid[0].length &&
            grid[x][y].color === grid[i][j].color
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // populate the grid with dots
  populateGrid = (dots) => {
    // configure size of grid
    const size = this.props.gridSize;

    // retrieve keys to colors
    const keys = colorKeys;

    do {
      // fill grid
      for (let i = 0; i < size; i++) {
        dots[i] = [];
        for (let j = 0; j < size; j++) {
          dots[i][j] = {
            color: colors[keys[(Math.random() * keys.length) << 0]],
            styling: "circle",
            new: false,
          };
        }
      }
    } while (!this.checkGrid(dots));

    return dots;
  };

  // check conditions for adding to path
  canAddToPath = (res, curr) => {
    // store reference to grid of dots
    const dots = this.state.dots;

    if (res === null) return false;
    if (this.state.freeze) return false;
    if (curr === null) return true;

    const [newX, newY] = res;
    const [currX, currY] = curr;

    // check if the dot already exists
    for (const [x, y] of this.state.path) {
      if (newX === x && newY === y) {
        return false;
      }
    }

    return (
      dots[currX][currY].color === dots[newX][newY].color &&
      ((newX === currX - 1 && newY === currY) ||
        (newX === currX + 1 && newY === currY) ||
        (newX === currX && newY === currY - 1) ||
        (newX === currX && newY === currY + 1))
    );
  };

  // remove from path if user backtracks
  canRemoveFromPath = (res) => {
    // store reference to path
    const path = this.state.path;

    // if not on a dot
    if (res === null) return false;

    // if path is too short
    if (path.length < 2) return false;

    const [newX, newY] = res;
    const [checkX, checkY] = path[path.length - 2];

    return checkX === newX && checkY === newY;
  };

  // check if there is a square
  isSquare = (res, curr) => {
    // store reference to grid of dots
    const dots = this.state.dots;

    if (res === null || curr === null || this.state.freeze) return false;

    const [newX, newY] = res;
    const [currX, currY] = curr;

    let isInPath = false;

    // check if the dot already exists
    for (const [x, y] of this.state.path) {
      if (newX === x && newY === y) {
        isInPath = true;
        break;
      }
    }

    return (
      dots[currX][currY].color === dots[newX][newY].color &&
      isInPath &&
      ((newX === currX - 1 && newY === currY) ||
        (newX === currX + 1 && newY === currY) ||
        (newX === currX && newY === currY - 1) ||
        (newX === currX && newY === currY + 1))
    );
  };

  // -------------------- PIVOT METHODS --------------------

  // store new pivot information
  setPivot = (i, j) => {
    // store reference to view
    const view = this.refs["dots" + i + j];

    // if it doesn't exist, i guess break the game?
    if (!view) return;

    view.measure((x, y, width, height, pageX, pageY) => {
      // store layout information
      const layout = {
        width: width,
        height: height,
        x: pageX,
        y: pageY,
      };

      this.setState((state) => {
        // set up new pivot point
        const newPivots = state.pivots;
        newPivots[i][j] = layout;

        // set new state
        return {
          pivots: newPivots,
        };
      });
    });
  };

  // check if hovering over pivot
  checkPivot = (gesture, firstTouch) => {
    // store reference to grid of pivots
    const pivots = this.state.pivots;

    // store the gesture information to compare
    const gestureX = firstTouch ? gesture.x0 : gesture.moveX;
    const gestureY = firstTouch ? gesture.y0 : gesture.moveY;

    // keep track of the pivot the user hovers over
    let finalPivot = null;

    // set a range where player can still tap dot without precision
    const dotSize =
      Dimensions.get("window").width / (this.props.gridSize * 2.1);
    const offset = dotSize / 2;

    // find the final pivot
    for (let i = 0; i < pivots.length; i++) {
      for (let j = 0; j < pivots[0].length; j++) {
        const curr = pivots[i][j];
        if (
          gestureX >= curr.x - offset &&
          gestureX <= curr.x + curr.width + offset &&
          gestureY >= curr.y - offset &&
          gestureY <= curr.y + curr.height + offset
        ) {
          finalPivot = [i, j];
          return finalPivot;
        }
      }
    }
    return finalPivot;
  };

  // -------------------- JSX SCREEN LAYOUT --------------------

  render() {
    const dotSize =
      Dimensions.get("window").width / (this.props.gridSize * 2.1);
    return (
      <>
        <SafeAreaView style={styles.topBar}>
          {this.state.mode !== "Endless" ? (
            <Text
              style={{
                ...styles.text,
                fontFamily: this.props.fontLoaded ? "Chelsea-Market" : "System",
              }}
            >
              {this.state.mode}: {this.state[this.state.mode + "Left"]}
            </Text>
          ) : (
            <></>
          )}
          <Text
            style={{
              ...styles.text,
              fontFamily: this.props.fontLoaded ? "Chelsea-Market" : "System",
            }}
          >
            Score: {this.state.score}
          </Text>
        </SafeAreaView>
        <View collapsable={false} style={styles.horizontal}>
          {this.state.dots.map((column, i) => (
            <View key={"column " + i} style={styles.column} collapsable={false}>
              {column.map((dot, j) => (
                <Animated.View
                  key={"view " + i + ", " + j}
                  style={{
                    transform: [
                      {
                        translateY: dot.new ? this.state.shakeAnimation : 0,
                      },
                    ],
                  }}
                  {...this.panResponder.panHandlers}
                >
                  <View
                    collapsable={false}
                    key={"dot " + i + ", " + j}
                    ref={"dots" + i + j}
                    style={{
                      ...styles[dot.styling],
                      height: dotSize,
                      width: dotSize,
                      backgroundColor: dot.color,
                    }}
                  />
                </Animated.View>
              ))}
            </View>
          ))}
        </View>
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={() => this.popToTop()}>
            <Image
              style={styles.mediumIcon}
              source={require("./../assets/icons/exit.png")}
            />
          </TouchableOpacity>
        </View>
      </>
    );
  }
}

export default Game;
