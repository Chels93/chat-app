import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Start from "./components/Start";
import Chat from "./components/Chat";

// Create the stack navigator for screen navigation
const Stack = createNativeStackNavigator();

const App = () => {
  // State to hold the text input value
  const [text, setText] = useState("");

  // Function to display an alert with the user input (`text` state's value)
  const alertMyText = () => {
    Alert.alert("Alert", text || "No text entered");
  };

  // A custom screen component that includes the UI elements
  const CustomScreen = () => (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust behavior for iOS/Android
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // Offset adjustment for keyboard
    >
      {/* Text input for user to type something */}
      <TextInput
        style={styles.textInput}
        value={text}
        onChangeText={setText}
        placeholder="Type something here."
        placeholderTextColor="#757083" // Placeholder text color
      />
      {/* Display the text entered by the user */}
      <Text style={styles.textDisplay}>You wrote: {text}</Text>
      {/* Button to trigger the alert with the user input */}
      <Button
        onPress={alertMyText}
        title="Press Me"
        color="#757083" // Button color
      />
      {/* Scrollable view to demonstrate scrolling with large content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.scrollText}>
          This text is so big! And so long! You have to scroll!
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  return (
    // Wrap the app with NavigationContainer for screen navigation
    <NavigationContainer>
      {/* Navigator to manage the stack of screens */}
      <Stack.Navigator initialRouteName="Start">
        {/* Define the Start screen */}
        <Stack.Screen
          name="Start"
          component={Start}
          options={{ title: "Welcome to Start" }} // Screen title for Start
        />
        {/* Define the Chat screen */}
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{ title: "Welcome to Chat" }} // Screen title for Chat
        />
        {/* Add the custom screen as another screen in the stack */}
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    width: "88%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    height: 50,
    padding: 10,
    color: "#FFFFFF", // Text color inside input field
    backgroundColor: "#757083", // Background color of input field
  },
  textDisplay: {
    height: 50,
    lineHeight: 50,
    color: "#FFFFFF", // Text color for displayed text
    fontSize: 18, // Font size for displayed text
  },
  scrollContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  scrollText: {
    fontSize: 110,
    color: "#FFFFFF", // Color of the scrollable text
  },
});

export default App;
