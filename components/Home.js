import React, { Component } from "react";
import { Animated, Text, View, SafeAreaView, Image } from "react-native";
import { styles, menuColors } from "./../styles/Stylesheet";
import * as Font from "expo-font";

class Home extends Component {
  state = { fontLoaded: false };

  async componentDidMount() {
    await Font.loadAsync({
      "Chelsea-Market": require("./../assets/fonts/ChelseaMarket-Regular.ttf"),
    });

    this.setState({ fontLoaded: true });
  }

  render() {
    return (
      <>
        <SafeAreaView style={styles.topBar}>
          <Text
            style={{
              ...styles.titleText,
              fontFamily: this.state.fontLoaded ? "Chelsea-Market" : "System",
            }}
          >
            Circles
          </Text>
        </SafeAreaView>

        <View style={styles.vertical}>
          <View style={styles.gameModeRow}>
            <View style={styles.gameModeContainer}>
              <View
                style={{
                  ...styles.gameMode,
                  backgroundColor: menuColors.teal,
                }}
              >
                <Image
                  style={styles.gameModeIcon}
                  source={require("./../assets/icons/timed.png")}
                />
              </View>
              <View style={styles.gameModeRow}>
                <Text
                  style={{
                    ...styles.gameModeText,
                    fontFamily: this.state.fontLoaded
                      ? "Chelsea-Market"
                      : "System",
                  }}
                >
                  Timed
                </Text>
              </View>
            </View>

            <View style={styles.gameModeContainer}>
              <View
                style={{
                  ...styles.gameMode,
                  backgroundColor: menuColors.green,
                }}
              >
                <Image
                  style={styles.gameModeIcon}
                  source={require("./../assets/icons/moves.png")}
                />
              </View>
              <View style={styles.gameModeRow}>
                <Text
                  style={{
                    ...styles.gameModeText,
                    fontFamily: this.state.fontLoaded
                      ? "Chelsea-Market"
                      : "System",
                  }}
                >
                  Moves
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.gameModeRow}>
            <View style={styles.gameModeContainer}>
              <View
                style={{
                  ...styles.gameMode,
                  backgroundColor: menuColors.red,
                }}
              >
                <Image
                  style={styles.gameModeIcon}
                  source={require("./../assets/icons/endless.png")}
                />
              </View>
              <View style={styles.gameModeRow}>
                <Text
                  style={{
                    ...styles.gameModeText,
                    fontFamily: this.state.fontLoaded
                      ? "Chelsea-Market"
                      : "System",
                  }}
                >
                  Endless
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomBar}>
          <Image
            style={styles.smallIcon}
            source={require("./../assets/icons/about.png")}
          />
          <Image
            style={styles.smallIcon}
            source={require("./../assets/icons/leaderboard.png")}
          />
          <Image
            style={styles.smallIcon}
            source={require("./../assets/icons/settings.png")}
          />
        </View>
      </>
    );
  }
}

export default Home;
