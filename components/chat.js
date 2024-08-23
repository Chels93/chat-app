import React, { useEffect } from "react";
import { StyleSheet, View, Text, ImageBackground } from "react-native";

const Chat = ({ route, navigation }) => {
  const { name, bgColor } = route.params || {}; // Default to empty object if params are undefined

  useEffect(() => {
    if (name) {
      navigation.setOptions({ title: name });
    }
  }, [name, navigation]);

  return (
    <ImageBackground
      source={require("../assets/background-image.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={[styles.container, { backgroundColor: bgColor || "#fff" }]}>
        <Text style={styles.text}>Hello {name || "Guest"}, welcome to Screen 2!</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // Removed semi-transparent background color to ensure background color from route params is visible
  },
  text: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "400",
  },
});

export default Chat;