import React, { PureComponent } from "react";
import {
  Dimensions,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import SwitchSelector from "react-native-switch-selector";
import debounce from "lodash/debounce";
import { styles, colors } from "./../styles/Stylesheet";

class Settings extends PureComponent {
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

  // -------------------- TOGGLE METHODS --------------------

  toggleSound = (pref) => {
    if (this.props.soundPref === pref) return;
    this.props.saveSoundPref(pref);
  };

  toggleMusic = (pref) => {
    if (this.props.musicPref === pref) return;
    this.props.saveMusicPref(pref);
    if (pref === true) this.props.playMusic();
    else this.props.stopMusic();
  };

  toggleGridSize = (size) => {
    if (this.props.gridSize === size) return;
    this.props.saveGridSize(size);
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
            Settings
          </Text>
        </SafeAreaView>

        <View
          style={{
            ...styles.vertical,
            justifyContent: "space-evenly",
          }}
        >
          <View style={styles.gameModeRow}>
            <View style={styles.gameModeContainer}>
              <View style={{ ...styles.gameModeRow, padding: 15 }}>
                <Text
                  style={{
                    ...styles.smallText,
                    fontFamily: this.props.fontLoaded
                      ? "Chelsea-Market"
                      : "System",
                  }}
                >
                  Sound:
                </Text>
              </View>

              <View style={styles.gameModeRow}>
                <SwitchSelector
                  initial={this.props.soundPref ? 1 : 0}
                  onPress={(value) => this.toggleSound(value)}
                  style={{ width: "75%" }}
                  height={Dimensions.get("window").width / 10}
                  backgroundColor={"black"}
                  buttonColor={colors.green}
                  borderColor={colors.green}
                  hasPadding={true}
                  textStyle={{
                    ...styles.text,
                    fontFamily: this.props.fontLoaded
                      ? "Chelsea-Market"
                      : "System",
                  }}
                  selectedTextStyle={{
                    ...styles.text,
                    fontFamily: this.props.fontLoaded
                      ? "Chelsea-Market"
                      : "System",
                    color: "black",
                  }}
                  options={[
                    { label: "Off", value: false },
                    { label: "On", value: true },
                  ]}
                />
              </View>
            </View>
          </View>

          <View style={styles.gameModeRow}>
            <View style={styles.gameModeContainer}>
              <View style={{ ...styles.gameModeRow, padding: 15 }}>
                <Text
                  style={{
                    ...styles.smallText,
                    fontFamily: this.props.fontLoaded
                      ? "Chelsea-Market"
                      : "System",
                  }}
                >
                  Music:
                </Text>
              </View>

              <View style={styles.gameModeRow}>
                <SwitchSelector
                  initial={this.props.musicPref ? 1 : 0}
                  onPress={(value) => this.toggleMusic(value)}
                  style={{ width: "75%" }}
                  height={Dimensions.get("window").width / 10}
                  backgroundColor={"black"}
                  buttonColor={colors.green}
                  borderColor={colors.green}
                  hasPadding={true}
                  textStyle={{
                    ...styles.text,
                    fontFamily: this.props.fontLoaded
                      ? "Chelsea-Market"
                      : "System",
                  }}
                  selectedTextStyle={{
                    ...styles.text,
                    fontFamily: this.props.fontLoaded
                      ? "Chelsea-Market"
                      : "System",
                    color: "black",
                  }}
                  options={[
                    { label: "Off", value: false },
                    { label: "On", value: true },
                  ]}
                />
              </View>
            </View>
          </View>

          <View style={styles.gameModeRow}>
            <View style={styles.gameModeContainer}>
              <View style={{ ...styles.gameModeRow, padding: 15 }}>
                <Text
                  style={{
                    ...styles.smallText,
                    fontFamily: this.props.fontLoaded
                      ? "Chelsea-Market"
                      : "System",
                  }}
                >
                  Grid Size:
                </Text>
              </View>

              <View style={styles.gameModeRow}>
                <SwitchSelector
                  initial={this.props.gridSize - 4}
                  onPress={(value) => this.toggleGridSize(value)}
                  style={{ width: "75%" }}
                  height={Dimensions.get("window").width / 10}
                  backgroundColor={"black"}
                  buttonColor={colors.green}
                  borderColor={colors.green}
                  hasPadding={true}
                  textStyle={{
                    ...styles.text,
                    fontFamily: this.props.fontLoaded
                      ? "Chelsea-Market"
                      : "System",
                  }}
                  selectedTextStyle={{
                    ...styles.text,
                    fontFamily: this.props.fontLoaded
                      ? "Chelsea-Market"
                      : "System",
                    color: "black",
                  }}
                  options={[
                    { label: "4", value: 4 },
                    { label: "5", value: 5 },
                    { label: "6", value: 6 },
                  ]}
                />
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

export default Settings;
