import React, { useState, useEffect } from "react";
import { StyleSheet, ImageBackground, KeyboardAvoidingView, Platform } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

const Chat = ({ route, navigation }) => {
  const { name = "User", bgColor = "#fff" } = route.params || {}; // Default values if no params provided
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Set the chat title to the user's name in the navigation bar
    if (name) {
      navigation.setOptions({ title: name });
    }

    // Set initial messages when the component mounts
    setMessages([
      {
        _id: 1,
        text: "Hello! Welcome to the chat.",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Chatbot",
          avatar: "https://placeimg.com/140/140/any", // Random avatar image for the chatbot
        },
      },
      {
        _id: 2,
        text: "You’ve entered the chat.",
        createdAt: new Date(),
        system: true, // System message
      },
      {
        _id: 3,
        text: `Hey ${name}, it's great to be here!`,
        createdAt: new Date(),
        user: {
          _id: 1, // Message from the current user
          name: name,
        },
      },
    ]);
  }, [name, navigation]);

  const onSend = (newMessages = []) => {
    // Append the new messages to the existing list of messages
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  };

  return (
    <ImageBackground
      source={require("../assets/background-image.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: bgColor }]} // Set the chosen background color
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <GiftedChat
          messages={messages} // Messages to display
          onSend={(newMessages) => onSend(newMessages)} // Handle sending new messages
          user={{
            _id: 1, // Current user's ID
            name: name, // Display the user's name in the chat
          }}
        />
      </KeyboardAvoidingView>
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
  },
});

export default Chat;
