import React, { PureComponent } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import debounce from "lodash/debounce";
import { styles } from "./../styles/Stylesheet";

class GameOver extends PureComponent {
  state = {};

  // bind necessary methods
  componentDidMount() {
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
  }

  // method to navigate to new screen
  navigate = (route, params) => {
    this.props.navigation.navigate(route, params);
  };

  // method to go back one screen
  pop = (refresh) => {
    if (refresh) this.props.route.params.refresh();
    this.props.navigation.pop();
  };

  // method to go to the home screen
  popToTop = () => {
    this.props.navigation.popToTop();
  };

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
            Scores
          </Text>
        </SafeAreaView>

        <View
          style={{
            ...styles.vertical,
            flex: 2,
            justifyContent: "space-between",
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
                  Score
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
                  {this.props.route.params
                    ? this.props.route.params.score || 0
                    : 0}
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
                  Best
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
                  {this.props.route.params
                    ? this.props.route.params.highscore || 0
                    : 0}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.gameModeRow}>
            <View style={styles.gameModeContainer}>
              <View style={styles.gameModeRow}>
                <TouchableOpacity
                  style={styles.playAgainIcon}
                  onPress={() => this.pop(true)}
                >
                  <Text
                    style={{
                      ...styles.text,
                      fontFamily: this.props.fontLoaded
                        ? "Chelsea-Market"
                        : "System",
                    }}
                  >
                    Play Again
                  </Text>
                </TouchableOpacity>
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
