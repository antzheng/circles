import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import * as Font from "expo-font";
import Home from "./components/Home";
import Game from "./components/Game";

// create StackNavigator
const Stack = createStackNavigator();

// set up config for transition animation
const config = {
  animation: "spring",
  config: {
    stiffness: 1000,
    damping: 50,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

class App extends Component {
  state = { fontLoaded: false };

  // load the font and pass it to children when ready
  async componentDidMount() {
    await Font.loadAsync({
      "Chelsea-Market": require("./assets/fonts/ChelseaMarket-Regular.ttf"),
    });

    this.setState({ fontLoaded: true });
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            gestureEnabled: true,
            gestureDirection: "horizontal",
            headerShown: false,
            ...TransitionPresets.SlideFromRightIOS,
            transitionSpec: {
              open: config,
              close: config,
            },
          }}
        >
          <Stack.Screen name="Home">
            {(props) => <Home {...props} fontLoaded={this.state.fontLoaded} />}
          </Stack.Screen>

          <Stack.Screen
            name="Game"
            options={{
              gestureEnabled: false,
            }}
          >
            {(props) => <Game {...props} fontLoaded={this.state.fontLoaded} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
