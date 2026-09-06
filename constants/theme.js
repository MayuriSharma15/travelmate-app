import { Platform, StatusBar } from "react-native";
import Colors from "./colors";

export const GlobalStyles = {
  screen: {
    flex: 1,
    backgroundColor: Colors.background, // 👈 APPLIED HERE
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.textLight, // 👈 APPLIED HERE
  },
};
