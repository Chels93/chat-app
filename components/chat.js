import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import {
  GiftedChat,
  InputToolbar,
  Bubble,
  Actions as CustomActions,
  SystemMessage,
} from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore"; // Firestore imports
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ db, route, isConnected }) => {
  const { userID, name = "User", bgColor = "#fff" } = route.params;

  const [messages, setMessages] = useState([]); // State to hold messages

  // Load stored messages from AsyncStorage
  const loadStoredMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem("chat_messages");
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error("Error loading stored messages:", error);
    }
  };

  // Cache messages in AsyncStorage
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem(
        "chat_messages",
        JSON.stringify(messagesToCache)
      );
    } catch (error) {
      console.error("Error saving messages to storage:", error);
    }
  };

  // Load cached messages when offline
  const loadCachedMessages = async () => {
    const cachedMessages =
      (await AsyncStorage.getItem("chat_messages")) || "[]";
    setMessages(JSON.parse(cachedMessages));
  };

  // Firestore query to fetch and sync chat messages
  useEffect(() => {
    let unsubMessages;
    if (isConnected) {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

      unsubMessages = onSnapshot(q, (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
        }));

        setMessages(fetchedMessages);
        cacheMessages(fetchedMessages); // Cache messages
      });
    } else {
      loadCachedMessages(); // Load cached messages if offline
    }

    return () => {
      if (unsubMessages) {
        unsubMessages(); // Unsubscribe from Firestore listener
        unsubMessages = null;
      }
    };
  }, [isConnected]);

  // Handle sending messages
  const onSend = async (newMessages = []) => {
    if (newMessages.length > 0) {
      const { text } = newMessages[0];
      if (text.trim()) {
        const message = {
          text,
          createdAt: new Date(),
          user: {
            _id: userID,
            name: name,
          },
        };
        try {
          await addDoc(collection(db, "messages"), message); // Add message to Firestore
        } catch (error) {
          console.error("Error sending message:", error);
          Alert.alert("Message could not be sent.");
        }
      } else {
        Alert.alert("Please enter a message."); // Alert if message is empty
      }
    }
  };

  // Conditionally render InputToolbar
  const renderInputToolbar = (props) => {
    if (isConnected) {
      return <InputToolbar {...props} />;
    } else {
      return null; // Don't render input toolbar when offline
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <GiftedChat
          messages={messages}
          user={{ _id: userID, name: name }}
          renderBubble={(props) => (
            <Bubble
              {...props}
              wrapperStyle={{ right: { backgroundColor: "#0084ff" } }}
            />
          )}
          renderInputToolbar={renderInputToolbar}
          renderActions={(props) => <CustomActions {...props} />}
          renderSystemMessage={(props) => <SystemMessage {...props} />}
          onSend={onSend}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default Chat;
