import React, { PureComponent } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  AsyncStorage,
} from "react-native";
import debounce from "lodash/debounce";
import { styles } from "./../styles/Stylesheet";

class GameOver extends PureComponent {
  state = { bestTimed: 0, bestMoves: 0 };

  // -------------------- LIFECYCLE METHODS --------------------

  // on first render
  async componentDidMount() {
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

    // retrieve the scores
    const bestTimed = await this.retrieveScore("Time");
    const bestMoves = await this.retrieveScore("Moves");

    // update state
    this.setState({ bestTimed: bestTimed, bestMoves: bestMoves });
  }

  // -------------------- NAVIGATION METHODS --------------------

  // method to navigate to new screen
  navigate = (route, params) => {
    this.props.navigation.navigate(route, params);
  };

  // method to go back one screen
  pop = () => {
    this.props.playSelectFX();
    this.props.navigation.pop();
  };

  // method to go to the home screen
  popToTop = () => {
    this.props.playSelectFX();
    this.props.navigation.popToTop();
  };

  // -------------------- STORAGE METHODS --------------------

  // retrieve score from async storage
  retrieveScore = async (mode) => {
    try {
      const key = "@" + mode + "-highscore";
      const score = await AsyncStorage.getItem(key);
      return JSON.parse(score) || 0;
    } catch (e) {
      return 0;
    }
  };

  // -------------------- JSX SCREEN LAYOUT --------------------

  render() {
    return (
      <>
        <SafeAreaView style={styles.topBar}>
          <Text
            style={{
              ...styles.titleText,
              fontFamily: this.props.fontLoaded ? "Chelsea-Market" : "System",
            }}
          >
            Best Scores
          </Text>
        </SafeAreaView>

        <View
          style={{
            ...styles.vertical,
            flex: 1,
            justifyContent: "space-evenly",
          }}
        >
          <View style={styles.gameModeRow}>
            <View style={styles.gameModeContainer}>
              <View style={styles.gameModeRow}>
                <Text
                  style={{
                    ...styles.gameModeText,
                    fontFamily: this.props.fontLoaded
                      ? "Chelsea-Market"
                      : "System",
                  }}
                >
                  Timed
                </Text>
              </View>
              <View style={styles.gameModeRow}>
                <Text
                  style={{
                    ...styles.scoreText,
                    fontFamily: this.props.fontLoaded
                      ? "Chelsea-Market"
                      : "System",
                  }}
                >
                  {this.state.bestTimed}
                </Text>
              </View>
            </View>

            <View style={styles.gameModeContainer}>
              <View style={styles.gameModeRow}>
                <Text
                  style={{
                    ...styles.gameModeText,
                    fontFamily: this.props.fontLoaded
                      ? "Chelsea-Market"
                      : "System",
                  }}
                >
                  Moves
                </Text>
              </View>
              <View style={styles.gameModeRow}>
                <Text
                  style={{
                    ...styles.scoreText,
                    fontFamily: this.props.fontLoaded
                      ? "Chelsea-Market"
                      : "System",
                  }}
                >
                  {this.state.bestMoves}
                </Text>
              </View>
            </View>
          </View>
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

export default GameOver;
