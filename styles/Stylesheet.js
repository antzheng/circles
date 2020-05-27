import { Dimensions, StyleSheet } from "react-native";

// -------------------- GAMEPLAY CONSTANTS --------------------

// number of seconds for Timed mode
export const TimeLeft = 60;

// number of moves for Moves mode
export const MovesLeft = 30;

// -------------------- STYLING CONSTANTS --------------------

// color palette from Dots
// export const colors = {
//   red: "#db664f",
//   blue: "#93bcf9",
//   green: "#a0e599",
//   yellow: "#e4d950",
//   purple: "#9061b0",
// };

// color palette from Two Dots
export const colors = {
  red: "#e84d60",
  blue: "#718dbf",
  green: "#77c298",
  yellow: "#fecd6c",
  purple: "#a4547d",
};

// menu colors
export const menuColors = {
  red: "#ec5c5d",
  teal: "#50b3a3",
  green: "#88c070",
};

// keys for colors
export const colorKeys = Object.keys(colors);

// -------------------- ELEMENT STYLE SHEET --------------------

// styles for application
export const styles = StyleSheet.create({
  // -------------------- CIRCLE STYLING --------------------

  circle: {
    borderRadius: 100,
  },

  circleHover: {
    borderRadius: 100,
    opacity: 0.3,
  },

  // -------------------- MENU SCREEN --------------------

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
    width: Dimensions.get("window").width / 6.5,
    height: Dimensions.get("window").width / 6.5,
  },

  gameModeText: {
    paddingTop: 10,
    paddingBottom: 10,
    color: "#fff",
    fontSize: Dimensions.get("window").width / 25,
  },

  // -------------------- ICON STYLING --------------------

  smallIcon: {
    width: Dimensions.get("window").width / 13,
    height: Dimensions.get("window").width / 13,
  },

  mediumIcon: {
    width: Dimensions.get("window").width / 8,
    height: Dimensions.get("window").width / 8,
  },

  playAgainIcon: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width * 0.6,
    height: Dimensions.get("window").width / 8,
    backgroundColor: menuColors.teal,
    borderRadius: 100,
  },

  // -------------------- FLEXBOX STYLING --------------------

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
    justifyContent: "center",
    backgroundColor: "#000",
    flex: 3,
  },

  topBar: {
    flexDirection: "row",
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

  // -------------------- TEXT STYLING --------------------

  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: Dimensions.get("window").width / 15,
  },

  titleText: {
    color: "white",
    fontWeight: "bold",
    fontSize: Dimensions.get("window").width / 8,
  },

  scoreText: {
    color: menuColors.teal,
    fontWeight: "bold",
    fontSize: Dimensions.get("window").width / 5,
  },
});
