import React, { PureComponent } from "react";
import { Text, SafeAreaView } from "react-native";
import debounce from "lodash/debounce";
import { styles } from "./../styles/Stylesheet";

class Shuffling extends PureComponent {
  state = { message: "Shuffling" };

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

    // animate the shuffling message
    this.interval = setInterval(() => {
      this.setState((state) => {
        if (state.message === "Shuffling...") {
          clearInterval(this.interval);
          this.pop();
          return { message: "Shuffling" };
        }
        return { message: state.message + "." };
      });
    }, 200);
  }

  // when screen unmounts
  componentWillUnmount() {
    // clear animation
    clearInterval(this.interval);
  }

  // -------------------- NAVIGATION METHODS --------------------

  // method to navigate to new screen
  navigate = (route, params) => {
    this.props.navigation.navigate(route, params);
  };

  // method to go back one screen
  pop = () => {
    this.props.navigation.pop();
  };

  // method to go to the home screen
  popToTop = () => {
    this.props.navigation.popToTop();
  };

  // -------------------- JSX SCREEN LAYOUT --------------------

  render() {
    return (
      <SafeAreaView style={styles.horizontal}>
        <Text
          style={{
            ...styles.titleText,
            fontFamily: this.props.fontLoaded ? "Chelsea-Market" : "System",
          }}
        >
          {this.state.message}
        </Text>
      </SafeAreaView>
    );
  }
}

export default Shuffling;
