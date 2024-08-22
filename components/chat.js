import React, { useEffect } from "react";
import { StyleSheet, View, Text, ImageBackground } from "react-native";

const Screen2 = ({ route, navigation }) => {
  // Extracting the name and background color passed from the previous screen
  const { name, bgColor } = route.params;

  // Set the screen's title to the user's name when the component mounts
  useEffect(() => {
    if (name) {
      navigation.setOptions({ title: name });
    }
  }, [name, navigation]);

  return (
    // Background image for the screen
    <ImageBackground
      source={require("../assets/background-image.png")}
      style={styles.background}
      resizeMode="cover" 
    >
      {/* Container with the chosen background color */}
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        {/* Greeting message displaying the user's name */}
        <Text style={styles.text}>Hello {name}, welcome to Screen2!</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  // Style for the background image
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  // Main container style, including semi-transparent background
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  // Style for the greeting text
  text: {
    color: "#fff",
    fontSize: 24,
  },
});

export default Screen2;
