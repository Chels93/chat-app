import React, { useState, useEffect } from "react"; // Importing React and hooks
import { StyleSheet, ImageBackground, KeyboardAvoidingView, Platform } from "react-native"; // Importing necessary components from react-native
import { GiftedChat } from "react-native-gifted-chat"; // Importing the GiftedChat component for chat functionality

// The Chat component receives route (for navigation params) and navigation (for screen options) as props
const Chat = ({ route, navigation }) => {
  // Destructuring params passed from the previous screen with default values if params are undefined
  const { name = "User", bgColor = "#fff" } = route.params || {};

  // State to hold the list of messages displayed in the chat
  const [messages, setMessages] = useState([]);

  // useEffect to handle side effects when the component is mounted
  useEffect(() => {
    // If the name param exists, set the screen title in the navigation bar to the user's name
    if (name) {
      navigation.setOptions({ title: name }); // Setting the title of the screen to the user's name
    }

    // Initialize the chat with a few example messages
    setMessages([
      {
        _id: 1, // Unique ID for the message
        text: "Hello! Welcome to the chat.", // Message content
        createdAt: new Date(), // Timestamp when the message was created
        user: {
          _id: 2, // Unique ID for the chatbot user
          name: "Chatbot", // Display name of the chatbot
          avatar: "https://placeimg.com/140/140/any", // Avatar image for the chatbot
        },
      },
      {
        _id: 2,
        text: "You’ve entered the chat.", // System message indicating the user has entered
        createdAt: new Date(), // Timestamp when the system message was created
        system: true, // Indicates this is a system message, not sent by a user
      },
      {
        _id: 3,
        text: `Hey ${name}, it's great to be here!`, // Message greeting the user by their name
        createdAt: new Date(), // Timestamp when this message was created
        user: {
          _id: 1, // Unique ID for the current user (the one using the app)
          name: name, // Name of the current user
        },
      },
    ]);
  }, [name, navigation]); // The effect runs whenever 'name' or 'navigation' changes

  // Function that handles sending new messages
  const onSend = (newMessages = []) => {
    // Append the new messages to the existing messages array, updating the state
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages) // Using the GiftedChat method to append messages
    );
  };

  return (
    // Image background for the chat screen, loaded from the local assets
    <ImageBackground
      source={require("../assets/background-image.png")} // Background image path
      style={styles.background} // Applying styles to the background image
      resizeMode="cover" // Make the background image cover the entire screen
    >
      {/* A wrapper to adjust the keyboard behavior for iOS/Android */}
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: bgColor }]} // Apply styles and set background color dynamically
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust keyboard behavior based on the platform
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // Offset to prevent the keyboard from covering input fields
      >
        {/* The GiftedChat component to handle chat UI and logic */}
        <GiftedChat
          messages={messages} // Messages to display in the chat window
          onSend={(newMessages) => onSend(newMessages)} // Function to handle sending messages
          user={{
            _id: 1, // ID of the current user, same as in the initial messages
            name: name, // Display the user's name in the chat
          }}
        />
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

// StyleSheet for defining styles used in the component
const styles = StyleSheet.create({
  background: {
    flex: 1, // Ensure the background covers the full height and width of the screen
    resizeMode: "cover", // The image should cover the entire screen without being stretched
  },
  container: {
    flex: 1, // Flexbox to make sure the container occupies the full screen
  },
});

export default Chat; // Export the Chat component as the default export
