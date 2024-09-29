import React, { useState } from "react"; // Importing React and useState hook
import {
  StyleSheet, // StyleSheet for defining component styles
  View, // View is a container component for layout
  Text, // Text component to display text
  TextInput, // TextInput for user input
  Button, // Button for user interaction
  Alert, // Alert for displaying alerts/dialogs
  ScrollView, // ScrollView for scrollable content
  KeyboardAvoidingView, // A view to manage keyboard display issues
  Platform, // Platform to determine the OS (iOS or Android)
} from "react-native";

import { NavigationContainer } from "@react-navigation/native"; // Container for navigation functionality
import { createNativeStackNavigator } from "@react-navigation/native-stack"; // Stack navigator for screen transitions
import Start from "./components/Start"; // Importing Start screen component
import Chat from "./components/Chat"; // Importing Chat screen component

// Create the stack navigator for handling screen navigation
const Stack = createNativeStackNavigator();

const App = () => {
  // State hook to manage the text input value
  const [text, setText] = useState("");

  // Function to trigger an alert showing the current text input value
  const alertMyText = () => {
    Alert.alert("Alert", text || "No text entered"); // If text is empty, show 'No text entered'
  };

  // A custom screen component that includes text input, a button, and a scrollable text block
  const CustomScreen = () => (
    <KeyboardAvoidingView
      style={styles.container} // Apply custom styles from StyleSheet
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjusts layout for the keyboard on iOS/Android
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // Offset for proper display when keyboard is visible
    >
      <TextInput
        style={styles.textInput} // Apply custom styles for the TextInput
        value={text} // Controlled component: value is synced with `text` state
        onChangeText={setText} // Update `text` state as user types
        placeholder="Type something here." // Placeholder text
        placeholderTextColor="#757083" // Color of the placeholder text
      />
      <Text style={styles.textDisplay}>You wrote: {text}</Text>
      <Button
        onPress={alertMyText} // When pressed, call the alertMyText function
        title="Press Me" // Button label
        color="#757083" // Custom button color
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.scrollText}>
          This text is so big! And so long! You have to scroll!
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  return (
    // Wrap the entire app in the navigation container to manage screen transitions
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">  
        <Stack.Screen
          name="Start"
          component={Start}
          options={{ title: "Welcome to Start" }} // Screen title for the Start screen
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{ title: "Welcome to Chat" }} // Screen title for the Chat screen
        />
        <Stack.Screen
          name="CustomScreen"
          component={CustomScreen}
          options={{ title: "Custom Screen" }} // Screen title for CustomScreen
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Styles for various components in the app
const styles = StyleSheet.create({
  container: {
    flex: 1, // Flexbox: container takes up the entire screen
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  textInput: {
    width: "88%", // TextInput width is 88% of the screen width
    borderWidth: 1, // Border width for the input field
    borderColor: "#ddd", // Light grey border color
    borderRadius: 8, // Rounded corners for the input field
    height: 50, // Height of the input field
    padding: 10, // Padding inside the input field
    color: "#FFFFFF", // Text color inside the input field
    backgroundColor: "#757083", // Background color for the input field
  },
  textDisplay: {
    height: 50, // Fixed height for the displayed text
    lineHeight: 50, // Ensure text is vertically centered
    color: "#FFFFFF", // White text color
    fontSize: 18, // Font size of the displayed text
  },
  scrollContainer: {
    alignItems: "center", // Center content horizontally within the ScrollView
    justifyContent: "center", // Center content vertically within the ScrollView
    padding: 20, // Padding around the content
  },
  scrollText: {
    fontSize: 110, // Large font size to create the scrolling effect
    color: "#FFFFFF", // White text color for the scrollable text
  },
});

export default App; // Export the App component as the default export
