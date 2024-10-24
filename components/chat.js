import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView from "react-native-maps";
import CustomActions from "./CustomActions";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

// Chat Component
const Chat = ({ db, route, navigation, isConnected }) => {
  // State to hold chat messages
  const [messages, setMessages] = useState([]);

  // Destructure paramters passed via route from Start Screen
  const { name, userID, color } = route.params;

  // Initialize Firebase storage for media upload
  const storage = getStorage();

  // Handle navigation options and data syncing (online/offline)
  useEffect(() => {
    // Set navigation title to user's name
    navigation.setOptions({ title: name });

    let unsubMessages; // Unsubscribe function for Firestore snapshot listener

    // Check if the user is online
    if (isConnected) {
      // Query Firestore for messages, ordered by creation data (descending)
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

      // Listen for real-time updates to messages collection
      unsubMessages = onSnapshot(q, (snapshot) => {
        // Map Firestore documents to message objects and update the state
        const newMessages = snapshot.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis()),
        }));
        // Cache the messages locally for offline use
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else {
      // Load cached messages if the user is offline
      loadCachedMessages();
    }

    // Cleanup function to unsubscribe from the snapshot listener when the component unmounts
    return () => unsubMessages && unsubMessages();
  }, [isConnected, db, navigation, name]);

  // Function to load cached messages from AsyncStorage when offline
  const loadCachedMessages = async () => {
    try {
      const cachedMessages = await AsyncStorage.getItem("chat_messages");
      setMessages(cachedMessages ? JSON.parse(cachedMessages) : []);
    } catch (error) {
      console.error("Error loading cached messages:", error);
    }
  };

  // Function to cache messages in AsyncStorage for offline access
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem(
        "chat_messages",
        JSON.stringify(messagesToCache)
      );
    } catch (error) {
      console.error("Error caching messages:", error);
    }
  };

  // Function to handle sending messages and storing them in Firestore
  const onSend = async (newMessages) => {
    try {
      // Add the first message from newMessages array to Firestore
      await addDoc(collection(db, "messages"), newMessages[0]);
    } catch (error) {
      // Show an alert and log the error if message sending fails
      Alert.alert("Error sending message", error.message);
      console.error("Error sending message:", error);
    }
  };

  // Function to conditionally render the input toolbar (only when offline)
  const renderInputToolbar = (props) => {
    return isConnected ? <InputToolbar {...props} /> : null;
  };

  // Customizing the appearance of the chat bubbles (sender and receiver)
  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: "#000" },
        left: { backgroundColor: "#FFF" },
      }}
    />
  );

  // Render the custom actions component for media and location sharing
  const renderCustomActions = (props) => (
    <CustomActions
      onSend={onSend}
      storage={storage} // Pass Firebase Storage to CustomActions
      userID={userID}
      {...props}
    />
  );

  // Custom rendering for showing a map when location data is sent in a message
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage?.location) {
      const { latitude, longitude } = currentMessage.location;
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  // Main return block to render Chat interface
  return (
    <View style={[styles.chatContainer, { backgroundColor: color }]}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{ _id: userID }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderCustomView={renderCustomView}
        renderActions={renderCustomActions} // Use the custom actions for media and location sharing
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      />
    </View>
  );
};

// Styles for Chat screen container
const styles = StyleSheet.create({
  chatContainer: {
    flex: 1, // Ensures the chat container takes up the full screen
  },
});

export default Chat;
