// Import necessary libraries and components
import React, { useEffect, useState } from "react"; // React and hooks for state and effects
import {
  StyleSheet,
  View,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from "react-native"; // For styling and layout
import {
  GiftedChat, // Chat interface component
  Bubble,
  InputToolbar,
} from "react-native-gifted-chat"; // Chat UI library
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore"; // Firestore methods for messages
import AsyncStorage from "@react-native-async-storage/async-storage"; // For local message caching
import MapView from "react-native-maps"; // For rendering location messages on a map
import CustomActions from "./CustomActions"; // Component for custom actions

// Chat component to handle messaging functionality
const Chat = ({ db, route, navigation, isConnected, storage }) => {
  const [messages, setMessages] = useState([]); // State to hold messages
  const { name, userID, color } = route.params; // Extract route parameters

  let unsubMessages; // Store the unsubscribe function for Firestore snapshot

  // Load messages when the component mounts or isConnected changes
  useEffect(() => {
    navigation.setOptions({ title: name });

    if (isConnected) {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubMessages = onSnapshot(q, (snapshot) => {
        const newMessages = snapshot.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis()),
        }));
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else {
      loadCachedMessages();
    }

    // Cleanup on component unmount
    return () => unsubMessages && unsubMessages();
  }, [isConnected]);

  // Function to load cached messages from AsyncStorage
  const loadCachedMessages = async () => {
    try {
      const cachedMessages = await AsyncStorage.getItem("chat_messages");
      setMessages(cachedMessages ? JSON.parse(cachedMessages) : []);
    } catch (error) {
      console.error("Error loading cached messages:", error);
    }
  };

  // Function to cache messages to AsyncStorage
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

  // Function to send new messages
  const onSend = async (newMessages = []) => {
    const messageToSend = newMessages[0];
  
    // Validate user data and message before sending
    const { user, location } = messageToSend;
  
    // Check for undefined values
    if (!user || !user.name || !user._id || (!messageToSend.text && !location)) {
      Alert.alert("Error", "User or message data is missing");
      return;
    }
  
    try {
      // Prepare message data
      const messageData = {
        ...messageToSend,
        createdAt: new Date(),
        // Add location if it exists
        ...(location ? { location } : {}),
      };
  
      // Send message to Firestore
      await addDoc(collection(db, "messages"), messageData);
    } catch (error) {
      console.error("Error sending message: ", error);
      Alert.alert("Error", "Could not send message. Please try again.");
    }
  };  

  // Custom input toolbar rendering based on connection status
  const renderInputToolbar = (props) => {
    return isConnected ? <InputToolbar {...props} /> : null;
  };

  // Render a custom message bubble with optional MapView for location messages
  const renderBubble = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100 }}
          initialRegion={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: { backgroundColor: currentMessage.color || "#FFF" },
          right: { backgroundColor: currentMessage.color || "#007AFF" },
        }}
      />
    );
  };

  // Render custom actions (e.g., for sending images or locations)
  const renderCustomActions = (props) => (
    <CustomActions userID={userID} storage={storage} onSend={onSend} {...props} />
  );

  // Handle custom views (e.g., displaying location)
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  // Render the main chat interface inside a view with background color
  return (
    <View style={[styles.container, { backgroundColor: color || "#fff" }]}>
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        renderActions={renderCustomActions}
        renderBubble={renderBubble}
        renderCustomView={renderCustomView}
        renderInputToolbar={renderInputToolbar}
        user={{ _id: userID, name }}
      />
      {Platform.OS === "android" && (
        <KeyboardAvoidingView behavior="height" />
      )}
    </View>
  );
};

// Styles for the Chat component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
