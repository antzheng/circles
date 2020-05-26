import React, { Component } from "react";
import { YellowBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
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
  state = { fontLoaded: false };

  // -------------------- LIFECYCLE METHODS --------------------

  // on first render
  async componentDidMount() {
    // set the font once it loads
    await Font.loadAsync({
      "Chelsea-Market": require("./assets/fonts/ChelseaMarket-Regular.ttf"),
    });

    this.setState({ fontLoaded: true });
  }

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
            {(props) => <Home {...props} fontLoaded={this.state.fontLoaded} />}
          </Stack.Screen>

          <Stack.Screen name="Game">
            {(props) => <Game {...props} fontLoaded={this.state.fontLoaded} />}
          </Stack.Screen>

          <Stack.Screen name="GameOver">
            {(props) => (
              <GameOver {...props} fontLoaded={this.state.fontLoaded} />
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
