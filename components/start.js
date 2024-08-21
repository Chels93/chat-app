import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

const Screen1 = ({ navigation }) => {
  // State to store the user's name
  const [name, setName] = useState("");
  // State to store the chosen background color
  const [bgColor, setBgColor] = useState("#fff");

  // Array of color options for the background
  const colors = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];

  return (
    // Background image for the screen
    <ImageBackground
      source={require("../assets/background-image.png")}
      style={styles.background}
    >
      {/* Main container with semi-transparent background */}
      <View style={styles.container}>
        {/* Greeting text */}
        <Text style={styles.text}>Hello Screen1!</Text>
        
        {/* Text input for the user to enter their name */}
        <TextInput
          style={styles.textInput}
          value={name}
          onChangeText={setName}
          placeholder="Type your username here."
          placeholderTextColor="#ddd"
        />
        
        {/* Prompt for the user to choose a background color */}
        <Text style={styles.text}>Choose Background Color:</Text>
        
        {/* Displaying color options as clickable circles */}
        <View style={styles.colorOptions}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[styles.colorCircle, { backgroundColor: color }]}
              onPress={() => setBgColor(color)}
            />
          ))}
        </View>

        {/* Button to navigate to Screen2, passing the name and chosen background color */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: bgColor }]}
          onPress={() => navigation.navigate("Screen2", { name, bgColor })}
        >
          <Text style={styles.buttonText}>Go to Screen 2</Text>
        </TouchableOpacity>
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
  // Style for the text elements
  text: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 20,
  },
  // Style for the text input field
  textInput: {
    width: "88%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginTop: 15,
    marginBottom: 15,
  },
  // Container for the color options
  colorOptions: {
    flexDirection: "row",
    marginVertical: 20,
  },
  // Style for each color option circle
  colorCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  // Style for the button to navigate to Screen2
  button: {
    width: "88%",
    padding: 15,
    borderRadius: 8, 
    justifyContent: "center",
    alignItems: "center",
  },
  // Style for the text inside the button
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default Screen1;