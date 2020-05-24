import React, { Component } from "react";
import { Animated, PanResponder, Text, View, SafeAreaView } from "react-native";
import {
  styles,
  gridSize,
  colors,
  colorKeys,
  dotSize,
} from "./../styles/Stylesheet";

class Game extends Component {
  // list all possible states for later
  state = {
    dots: null,
    pivots: null,
    currentDot: null,
    path: null,
    shakeAnimation: null,
    playAnim: null,
    score: null,
    possible: null,
  };

  constructor() {
    // call super constructor
    super();

    // populate the dots grid
    const dots = this.populateGrid([]);

    // set up the state
    this.state = {
      dots: dots,
      pivots: Array(gridSize)
        .fill()
        .map(() => Array(gridSize).fill(0)),
      currentDot: null,
      path: [],
      shakeAnimation: new Animated.Value(0),
      playAnim: false,
      score: 0,
      possible: true,
    };
  }

  // run animation after render
  componentDidUpdate() {
    // define offset and duration of animation
    const offset = 5;
    const duration = 100;

    // should i play the animation, prevents infinite cycle
    if (this.state.playAnim) {
      Animated.sequence([
        Animated.timing(this.state.shakeAnimation, {
          toValue: offset * 2,
          duration: duration,
        }),
        Animated.timing(this.state.shakeAnimation, {
          toValue: -offset * 1.5,
          duration: duration,
        }),
        Animated.timing(this.state.shakeAnimation, {
          toValue: offset,
          duration: duration,
        }),
        Animated.timing(this.state.shakeAnimation, {
          toValue: 0,
          duration: duration,
        }),
      ]).start(({ finished }) => {
        this.setState({ playAnim: false });
      });
    }
  }

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

  // handler for initial touch
  handlerTouch = (event, gestureState) => {
    // store references to hovered pivot and current dot
    const res = this.checkPivot(gestureState, true);
    const currentDot = this.state.currentDot;

    // update dot if user has hovered over new one
    if (this.canAddToPath(res, currentDot)) {
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

        // change styling
        dots[oldX][oldY].styling = "circle";

        // set up new state
        return {
          dots: dots,
          path: path,
          currentDot: res,
        };
      });
    }
    // update dot if user has hovered over new one
    else if (this.canAddToPath(res, currentDot)) {
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

  // handler for when user releases touch
  handlerRelease = (event, gestureState) => {
    // reset current dot, path, and styling upon release
    this.setState((state) => {
      // store reference to dots and size
      const dots = state.dots;
      const size = dots.length;
      const keys = colorKeys;
      const added = state.path.length;

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
      };
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

  populateGrid = (dots) => {
    // configure size of grid
    const size = gridSize;

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

  // store new pivot information
  setPivot = (i, j) => {
    // store reference to view
    const view = this.refs["dot" + i + j];

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

  render() {
    return (
      <>
        <SafeAreaView style={styles.topBar}>
          <Text style={styles.text}> Score: {this.state.score} </Text>
        </SafeAreaView>
        <View collapsable={false} style={styles.horizontal}>
          {this.state.dots.map((column, i) => (
            <View key={"column " + i} style={styles.column} collapsable={false}>
              {column.map((dot, j) => (
                <Animated.View
                  key={"view " + i + ", " + j}
                  style={{ top: dot.new ? this.state.shakeAnimation : 0 }}
                  {...this.panResponder.panHandlers}
                >
                  <View
                    collapsable={false}
                    key={"dot " + i + ", " + j}
                    ref={"dot" + i + j}
                    onLayout={() => this.setPivot(i, j)}
                    style={{
                      ...styles[dot.styling],
                      backgroundColor: dot.color,
                    }}
                  />
                </Animated.View>
              ))}
            </View>
          ))}
        </View>
        <View style={styles.bottomBar}>
          <Text style={styles.text}>
            Possible: {this.state.possible.toString()}
          </Text>
        </View>
      </>
    );
  }
}

export default Game;
