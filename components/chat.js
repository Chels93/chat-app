// Chat.js
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
} from "react-native-gifted-chat"; // Updated imports
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore"; // Firestore imports
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Firestore import

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDauyicK3B2tUFFsdaTY_Js8kPqK_RxvO8",
  authDomain: "chatapp-15bbe.firebaseapp.com",
  projectId: "chatapp-15bbe",
  storageBucket: "chatapp-15bbe.appspot.com",
  messagingSenderId: "681242972614",
  appId: "1:681242972614:web:365b4780ee635c3c43a2c7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore

const Chat = ({ route }) => {
  const { userID, name = "User", bgColor = "#fff" } = route.params; // Destructure parameters

  const [messages, setMessages] = useState([]); // State to hold messages

  // Firestore query to fetch chat messages
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc")); // Query Firestore to order messages by time
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        _id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(), // Convert Firestore timestamp to Date object
      }));

      setMessages(fetchedMessages); // Set fetched messages in state
    });

    return () => unsubscribe(); // Unsubscribe from Firestore when component unmounts
  }, []);

  // Function to handle sending messages
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20} // Adjust offset for Android
    >
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <GiftedChat
          messages={messages} // Pass messages to GiftedChat
          onSend={newMessages => onSend(newMessages)}
          user={{
            _id: userID,
            name: name,
          }}
          renderBubble={(props) => (
            <Bubble
              {...props}
              wrapperStyle={{
                right: { backgroundColor: "#0084ff" }, // Customize bubble color
              }}
            />
          )}
          renderInputToolbar={(props) => <InputToolbar {...props} />}
          renderActions={(props) => <CustomActions {...props} />} // Custom action buttons
          renderSystemMessage={(props) => <SystemMessage {...props} />} // System message for notices
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
