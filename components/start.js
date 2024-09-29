import React, { useState } from "react"; // Importing React and the useState hook for managing component state
import {
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  ImageBackground, 
  TouchableOpacity
} from "react-native"; // Importing necessary UI components from React Native

// Define the Start functional component
const Start = ({ navigation }) => {
  // useState hook to manage the name input state (defaults to an empty string)
  const [name, setName] = useState("");
  
  // useState hook to manage the selected background color (default is white)
  const [bgColor, setBgColor] = useState("#fff");

  // Array of color options that the user can choose from for background selection
  const colors = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];

  return (
    // ImageBackground component to set a background image for the screen
    <ImageBackground
      source={require("../assets/background-image.png")} // Path to the background image asset
      style={styles.background} // Applying background image styles
    >
      {/* Main container for all components on the screen */}
      <View style={styles.container}>
        {/* Title of the screen */}
        <Text style={styles.title}>Hello Screen1!</Text>
        
        {/* Text input for the user to enter their name */}
        <TextInput
          style={styles.textInput} // Style applied to the input field
          value={name} // Binds the input value to the `name` state variable
          onChangeText={setName} // Updates the `name` state when the text input changes
          placeholder="Type your username here." // Placeholder text when input is empty
          placeholderTextColor="#ddd" // Color of the placeholder text
        />
        
        {/* Subtitle for the color selection section */}
        <Text style={styles.subtitle}>Choose Background Color:</Text>

        {/* Row of touchable circles representing the color options */}
        <View style={styles.colorOptions}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color} // Unique key for each color option
              style={[styles.colorCircle, { backgroundColor: color }]} // Apply dynamic background color to each circle
              onPress={() => setBgColor(color)} // Set selected color to bgColor state when pressed
            />
          ))}
        </View>

        {/* Button to navigate to the Chat screen, passing the name and selected background color */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#757083" }]} // Button with background color
          onPress={() => navigation.navigate("Chat", { name, bgColor })} // Navigates to Chat screen with params
        >
          {/* Text inside the button */}
          <Text style={styles.buttonText}>Start Chatting</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

// Define the styles for the components
const styles = StyleSheet.create({
  background: {
    flex: 1, // Ensures the background image takes up the full screen height and width
    resizeMode: "cover", // Cover the entire background without distortion
  },
  container: {
    flex: 1, // Container takes up the full screen space
    justifyContent: "center", // Center items vertically
    alignItems: "center", // Center items horizontally
    padding: 20, // Adds padding inside the container
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background overlay for text clarity
  },
  title: {
    fontSize: 45, // Large font size for the title
    fontWeight: "600", // Semi-bold font for emphasis
    color: "#FFFFFF", // White color for text
    marginBottom: 40, // Margin below the title to separate it from other components
  },
  subtitle: {
    fontSize: 16, // Font size for the subtitle
    fontWeight: "300", // Light font weight
    color: "#FFFFFF", // White text color
    marginBottom: 20, // Margin below the subtitle
  },
  textInput: {
    width: "88%", // Makes the input field take up 88% of the container width
    padding: 15, // Padding inside the input field
    borderWidth: 1, // 1-pixel border around the input field
    borderColor: "#ddd", // Light gray border color
    borderRadius: 8, // Rounded corners for the input field
    marginVertical: 15, // Margin above and below the input field
    color: "#FFFFFF", // White text color inside the input field
    backgroundColor: "#757083", // Background color for the input field
  },
  colorOptions: {
    flexDirection: "row", // Arranges color circles in a row
    marginVertical: 20, // Adds margin above and below the color options
  },
  colorCircle: {
    width: 50, // Width of each color circle
    height: 50, // Height of each color circle (same as width to form a square)
    borderRadius: 25, // Rounds the corners to make the circle shape
    marginHorizontal: 10, // Adds space between the color circles
  },
  button: {
    width: "88%", // Button takes up 88% of the container width
    padding: 15, // Padding inside the button
    borderRadius: 8, // Rounded corners for the button
    justifyContent: "center", // Center text vertically inside the button
    alignItems: "center", // Center text horizontally inside the button
  },
  buttonText: {
    color: "#FFFFFF", // White text color inside the button
    fontSize: 16, // Font size for the button text
    fontWeight: "600", // Semi-bold font weight for the button text
  },
});

export default Start; // Export the Start component as the default export
