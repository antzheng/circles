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

// size of dots
export const dotSize = Dimensions.get("window").width / (gridSize * 2.1);

// keys for colors
export const colorKeys = Object.keys(colors);

// styles for application
export const styles = StyleSheet.create({
  circle: {
    height: dotSize,
    width: dotSize,
    borderRadius: 100,
  },

  circleHover: {
    height: dotSize,
    width: dotSize,
    borderRadius: 100,
    opacity: 0.3,
  },

  gameMode: {
    height: Dimensions.get("window").width / 3.5,
    width: Dimensions.get("window").width / 3.5,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  gameModeRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#000",
  },

  gameModeContainer: {
    flexDirection: "column",
  },

  gameModeIcon: {
    width: Dimensions.get("window").width / 6,
    height: Dimensions.get("window").width / 6,
  },

  smallIcon: {
    width: Dimensions.get("window").width / 10,
    height: Dimensions.get("window").width / 10,
  },

  gameModeText: {
    paddingTop: 10,
    paddingBottom: 10,
    color: "#fff",
    fontSize: Dimensions.get("window").width / 30,
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
    flex: 3,
    backgroundColor: "#000",
  },

  vertical: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    backgroundColor: "#000",
    flex: 3,
  },

  topBar: {
    alignItems: "center",
    justifyContent: "space-around",
    flex: 1,
    backgroundColor: "#000",
  },

  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    flex: 1,
    backgroundColor: "#000",
  },

  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: Dimensions.get("window").width / 15,
  },
});
