import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ImageBackground } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

const Chat = ({ route, navigation }) => {
  const { name, bgColor } = route.params || {}; // Default to empty object if params are undefined
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (name) {
      navigation.setOptions({ title: name });
    }

    // Set initial message
    setMessages([
      {
        _id: 1,
        text: "Hello! Welcome to the chat.",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Chatbot",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
  }, [name, navigation]);

  const onSend = (newMessages = []) => {
    // Append new messages to the existing list
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
      <View style={[styles.container, { backgroundColor: bgColor || "#fff" }]}>
      <GiftedChat 
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{
            _id: 1, 
        }}
        />
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
  },
});

export default Chat;
