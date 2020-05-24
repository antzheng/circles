import { Dimensions, StyleSheet } from "react-native";

// size of grid
export const gridSize = 6;

// colors of dots
export const colors = {
  red: "#db664f",
  blue: "#93bcf9",
  green: "#a0e599",
  yellow: "#e4d950",
  purple: "#9061b0",
};

// keys for colors
export const colorKeys = Object.keys(colors);

// styles for application
export const styles = StyleSheet.create({
  circle: {
    height: Dimensions.get("window").width / (gridSize * 2.5),
    width: Dimensions.get("window").width / (gridSize * 2.5),
    borderRadius: 100,
  },

  circleHover: {
    height: Dimensions.get("window").width / (gridSize * 2.5),
    width: Dimensions.get("window").width / (gridSize * 2.5),
    borderRadius: 100,
    opacity: 0.3,
  },

  column: {
    flexDirection: "column-reverse",
    justifyContent: "space-evenly",
    height: Dimensions.get("window").width * 0.9,
  },

  horizontal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingLeft: "5%",
    paddingRight: "5%",
    backgroundColor: "#000",
  },

  topBar: {
    alignItems: "center",
    justifyContent: "space-around",
    flex: 1,
    backgroundColor: "#000",
  },

  bottomBar: {
    alignItems: "center",
    justifyContent: "space-around",
    flex: 1,
    backgroundColor: "#000",
  },

  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 25,
  },
});
