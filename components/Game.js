import React, { Component } from "react";
import { Animated, PanResponder, Text, View, SafeAreaView } from "react-native";
import { styles, gridSize, colors, colorKeys } from "./../styles/Stylesheet";

class Game extends Component {
  state = {};

  constructor() {
    // call super constructor
    super();

    // configure size of grid
    const size = gridSize;

    // retrieve keys to colors
    const keys = colorKeys;

    // populate the dots grid
    const dots = [];
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

    // set up the state
    this.state = {
      dots: dots,
      pivots: Array(size)
        .fill()
        .map(() => Array(size).fill(0)),
      currentDot: null,
      path: [],
      shakeAnimation: new Animated.Value(0),
      playAnim: false,
      score: 0,
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
          toValue: offset,
          duration: duration,
        }),
        Animated.timing(this.state.shakeAnimation, {
          toValue: -offset,
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
  pan = new Animated.ValueXY();

  panResponder = PanResponder.create({
    // set up responder
    onStartShouldSetPanResponder: (event, gestureState) => true,

    // the gesture has started
    onPanResponderGrant: (event, gestureState) => {
      // store references to hovered pivot and current dot
      const res = this.checkPivot(gestureState);
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

      // set up initial position of gesture
      this.pan.setOffset({
        x: this.pan.x,
        y: this.pan.y,
      });
    },

    // the gesture is in progress
    onPanResponderMove: (event, gestureState) => {
      // store references to hovered pivot and current dot
      const res = this.checkPivot(gestureState);
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
    },

    // the gesture has been released
    onPanResponderRelease: (event, gestureState) => {
      // reset current dot, path, and styling upon release
      this.setState((state) => {
        // store reference to dots and size
        const dots = state.dots;
        const size = dots.length;
        const keys = colorKeys;
        const added = state.path.length;

        // if path contains one dot, do not clear
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
        };
      });

      // flatten offset of distance moved
      this.pan.flattenOffset();
    },
  });

  // check conditions for adding to path
  canAddToPath = (res, curr) => {
    // store reference to grid of dots
    const dots = this.state.dots;

    if (res === null) return false;
    if (curr === null) return true;

    const [newX, newY] = res;
    const [currX, currY] = curr;

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
  checkPivot = (gesture) => {
    // store reference to grid of pivots
    const pivots = this.state.pivots;

    // keep track of the pivot the user hovers over
    let finalPivot = null;

    // find the final pivot
    for (let i = 0; i < pivots.length; i++) {
      for (let j = 0; j < pivots[0].length; j++) {
        const curr = pivots[i][j];
        if (
          gesture.moveX >= curr.x &&
          gesture.moveX <= curr.x + curr.width &&
          gesture.moveY >= curr.y &&
          gesture.moveY <= curr.y + curr.height
        )
          finalPivot = [i, j];
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
          <Text style={styles.text}> Bottom Text </Text>
        </View>
      </>
    );
  }
}

export default Game;
