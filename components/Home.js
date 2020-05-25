import React, { Component } from "react";
import { Animated, Text, View, SafeAreaView, Image } from "react-native";
import { styles } from "./../styles/Stylesheet";
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
              ...styles.text,
              fontFamily: this.state.fontLoaded ? "Chelsea-Market" : "System",
            }}
          >
            Circles
          </Text>
        </SafeAreaView>

        <View style={styles.vertical}>
          <View style={styles.gameModeRow}>
            <View style={styles.gameModeContainer}>
              <View style={{ ...styles.gameMode, backgroundColor: "#db664f" }}>
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
              <View style={{ ...styles.gameMode, backgroundColor: "#a0e599" }}>
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
              <View style={{ ...styles.gameMode, backgroundColor: "#93bcf9" }}>
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

            <View style={styles.gameModeContainer}>
              <View style={{ ...styles.gameMode, backgroundColor: "#9061b0" }}>
                <Image
                  style={styles.gameModeIcon}
                  source={require("./../assets/icons/settings.png")}
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
                  Settings
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
        </View>
      </>
    );
  }
}

export default Home;
