import React, { PureComponent } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import debounce from "lodash/debounce";
import { styles, colors } from "./../styles/Stylesheet";

class About extends PureComponent {
  state = {};

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
            About
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
              <Text
                style={{
                  ...styles.smallText,
                  fontFamily: this.props.fontLoaded
                    ? "Chelsea-Market"
                    : "System",
                }}
              >
                Inspired by{" "}
                <Text
                  style={{
                    color: colors.yellow,
                  }}
                >
                  Dots
                </Text>
              </Text>
            </View>
          </View>

          <View style={styles.gameModeRow}>
            <View style={styles.gameModeContainer}>
              <Text
                style={{
                  ...styles.smallText,
                  fontFamily: this.props.fontLoaded
                    ? "Chelsea-Market"
                    : "System",
                }}
              >
                Music:{" "}
                <Text
                  style={{
                    color: colors.green,
                  }}
                >
                  Bensound
                </Text>
              </Text>
            </View>
          </View>

          <View style={styles.gameModeRow}>
            <View style={styles.gameModeContainer}>
              <Text
                style={{
                  ...styles.smallText,
                  fontFamily: this.props.fontLoaded
                    ? "Chelsea-Market"
                    : "System",
                }}
              >
                Icons:{" "}
                <Text
                  style={{
                    color: colors.red,
                  }}
                >
                  material.io
                </Text>
              </Text>
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

export default About;
