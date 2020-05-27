import React, { Component } from "react";
import { YellowBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Audio } from "expo-av";
import * as Font from "expo-font";
import Home from "./components/Home";
import Game from "./components/Game";
import GameOver from "./components/GameOver";
import Shuffling from "./components/Shuffling";

// -------------------- NAVIGATOR SETUP --------------------

// create StackNavigator
const Stack = createStackNavigator();

// ignore warnings
YellowBox.ignoreWarnings([
  "Non-serializable values were found in the navigation state",
]);

class App extends Component {
  state = {
    fontLoaded: false, // has the font loaded
    soundsLoaded: false, // have the sounds loaded
    soundPref: true, // sound on/off
    musicPref: true, // music on/off
    gridSize: 6, // grid size 4, 5, or 6
  };

  // -------------------- LIFECYCLE METHODS --------------------

  // on first render
  async componentDidMount() {
    // set the font once it loads
    await Font.loadAsync({
      "Chelsea-Market": require("./assets/fonts/ChelseaMarket-Regular.ttf"),
    });

    // get preferences from storage
    const soundPref = await this.retrieveSoundPref();
    const musicPref = await this.retrieveMusicPref();
    const gridSize = await this.retrieveGridSize();

    // set up the music and soundFX
    this.backgroundMusic = new Audio.Sound();
    this.selectFX = new Audio.Sound();
    this.blopFX = Array(this.state.gridSize)
      .fill()
      .map(() =>
        Array(this.state.gridSize)
          .fill()
          .map(() => new Audio.Sound())
      );
    this.squareFX = new Audio.Sound();

    // configure all of the sounds
    try {
      // connect background music
      await this.backgroundMusic.loadAsync(
        require("./assets/sounds/backgroundMusic.mp3")
      );

      // connect select soundFX
      await this.selectFX.loadAsync(require("./assets/sounds/select.wav"));

      for (let i = 0; i < this.state.gridSize; i++) {
        for (let j = 0; j < this.state.gridSize; j++) {
          // connect blop soundFX
          await this.blopFX[i][j].loadAsync(
            require("./assets/sounds/blop.wav")
          );
        }
      }

      // connect square soundFX
      await this.squareFX.loadAsync(require("./assets/sounds/square.wav"));

      // set the background music to loop
      await this.backgroundMusic.setIsLoopingAsync(true);

      // update the state when everything has loaded
      this.setState({
        fontLoaded: true,
        soundsLoaded: true,
        soundPref: soundPref,
        musicPref: musicPref,
        gridSize: gridSize,
      });

      // play the music
      if (musicPref) this.playMusic();
    } catch (error) {}
  }

  // when screen unmounts
  componentWillUnmount() {
    // unload all sounds
    this.backgroundMusic.unloadAsync();
    for (let i = 0; i < this.state.gridSize; i++) {
      for (let j = 0; j < this.state.gridSize; j++) {
        this.blopFX[i][j].unloadAsync();
      }
    }
    this.selectFX.unloadAsync();
    this.squareFX.unloadAsync();
  }

  // -------------------- SOUNDFX METHODS --------------------

  // stop background music
  stopMusic = () => {
    this.backgroundMusic.stopAsync();
  };

  // play background music
  playMusic = async () => {
    if (this.state.soundsLoaded) await this.backgroundMusic.replayAsync();
  };

  // play select soundFX
  playSelectFX = async () => {
    if (this.state.soundPref && this.state.soundsLoaded)
      await this.selectFX.replayAsync();
  };

  // play blop soundFX
  playBlopFX = async (i, j) => {
    if (this.state.soundPref && this.state.soundsLoaded)
      await this.blopFX[i][j].replayAsync();
  };

  // play square soundFX
  playSquareFX = async () => {
    if (this.state.soundPref && this.state.soundsLoaded)
      await this.squareFX.replayAsync();
  };

  // -------------------- STORAGE METHODS --------------------

  // retrieve soundFX preferences from async storage
  retrieveSoundPref = async () => {
    try {
      const key = "@sound-preferences";
      const pref = await AsyncStorage.getItem(key);
      if (pref === null) return true;
      return JSON.parse(pref);
    } catch (e) {
      return true;
    }
  };

  // retrieve music preferences from async storage
  retrieveMusicPref = async () => {
    try {
      const key = "@music-preferences";
      const pref = await AsyncStorage.getItem(key);
      if (pref === null) return true;
      return JSON.parse(pref);
    } catch (e) {
      return true;
    }
  };

  // retrieve gridSize preferences from async storage
  retrieveGridSize = async () => {
    try {
      const key = "@grid-size";
      const pref = await AsyncStorage.getItem(key);
      if (pref === null) return 6;
      return JSON.parse(pref);
    } catch (e) {
      return 6;
    }
  };

  // save soundFX preferences to async storage
  saveSoundPref = async (boolean) => {
    try {
      const key = "@sound-preferences";
      await AsyncStorage.setItem(key, JSON.stringify(boolean));
    } catch (e) {}
  };

  // save soundFX preferences to async storage
  saveMusicPref = async (boolean) => {
    try {
      const key = "@music-preferences";
      await AsyncStorage.setItem(key, JSON.stringify(boolean));
    } catch (e) {}
  };

  // save gridSize preferences to async storage
  saveGridSize = async (number) => {
    try {
      const key = "@grid-size";
      await AsyncStorage.setItem(key, JSON.stringify(number));
    } catch (e) {}
  };

  // -------------------- JSX SCREEN LAYOUT --------------------

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            animationEnabled: false,
            gestureEnabled: false,
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home">
            {(props) => (
              <Home
                {...props}
                fontLoaded={this.state.fontLoaded}
                soundsLoaded={this.state.soundsLoaded}
                playSelectFX={this.playSelectFX}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="Game">
            {(props) => (
              <Game
                {...props}
                gridSize={this.state.gridSize}
                fontLoaded={this.state.fontLoaded}
                playSelectFX={this.playSelectFX}
                playBlopFX={this.playBlopFX}
                playSquareFX={this.playSquareFX}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="GameOver">
            {(props) => (
              <GameOver
                {...props}
                fontLoaded={this.state.fontLoaded}
                playSelectFX={this.playSelectFX}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="Shuffling">
            {(props) => (
              <Shuffling {...props} fontLoaded={this.state.fontLoaded} />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
