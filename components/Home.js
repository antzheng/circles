import React, { PureComponent } from "react";
import {
  Dimensions,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import { styles, menuColors } from "./../styles/Stylesheet";

class Home extends PureComponent {
  state = {};

  constructor(props) {
    // call super constructor
    super(props);
  }

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
            Circles
          </Text>
        </SafeAreaView>

        <View style={styles.vertical}>
          <View style={styles.gameModeRow}>
            <View style={styles.gameModeContainer}>
              <TouchableOpacity
                style={{
                  ...styles.gameMode,
                  backgroundColor: menuColors.teal,
                }}
                onPress={() =>
                  this.props.navigation.navigate("Game", {
                    offset: I18nManager.isRTL
                      ? -Dimensions.get("window").width
                      : Dimensions.get("window").width,
                  })
                }
              >
                <Image
                  style={styles.gameModeIcon}
                  source={require("./../assets/icons/timed.png")}
                />
              </TouchableOpacity>
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
            </View>

            <View style={styles.gameModeContainer}>
              <TouchableOpacity
                style={{
                  ...styles.gameMode,
                  backgroundColor: menuColors.green,
                }}
                onPress={() =>
                  this.props.navigation.navigate("Game", {
                    offset: I18nManager.isRTL
                      ? -Dimensions.get("window").width
                      : Dimensions.get("window").width,
                  })
                }
              >
                <Image
                  style={styles.gameModeIcon}
                  source={require("./../assets/icons/moves.png")}
                />
              </TouchableOpacity>
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
            </View>
          </View>

          <View style={styles.gameModeRow}>
            <View style={styles.gameModeContainer}>
              <TouchableOpacity
                style={{
                  ...styles.gameMode,
                  backgroundColor: menuColors.red,
                }}
                onPress={() =>
                  this.props.navigation.navigate("Game", {
                    offset: I18nManager.isRTL
                      ? -Dimensions.get("window").width
                      : Dimensions.get("window").width,
                  })
                }
              >
                <Image
                  style={styles.gameModeIcon}
                  source={require("./../assets/icons/endless.png")}
                />
              </TouchableOpacity>
              <View style={styles.gameModeRow}>
                <Text
                  style={{
                    ...styles.gameModeText,
                    fontFamily: this.props.fontLoaded
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
