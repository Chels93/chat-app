// Import necessary libraries and components
import React, { useEffect, useState, useRef } from "react"; // React and hooks for state and effects
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
  InputToolbar, // Message bubble component
} from "react-native-gifted-chat"; // Chat UI library
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore"; // Firestore methods for handling messages
import AsyncStorage from "@react-native-async-storage/async-storage"; // For local message caching
import MapView from "react-native-maps"; // For rendering location messages on a map
import CustomActions from "./CustomActions"; // Component for custom actions like sending images or location

// Chat component to handle messaging functionality
const Chat = ({ db, route, navigation, isConnected, storage }) => {
  // State to hold messages
  const [messages, setMessages] = useState([]);
  const { name, userID, color } = route.params; // Get user details and selected color from route parameters

  let unsubMessages;

  useEffect(() => {
    navigation.setOptions({ title: name });

    if (isConnected === true) {
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubMessages = onSnapshot(q, (docs) => {
        let newMessages = [];
        docs.forEach((doc) => {
          newMessages.push({
            id: doc.id,
            _id: doc.id, // Ensure _id is set
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          });
        });
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else {
      loadCachedMessages();
    }

    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, [isConnected]);

  // Function to load cached messages from AsyncStorage
  const loadCachedMessages = async () => {
    try {
      const cachedMessages = await AsyncStorage.getItem("chat_messages"); // Retrieve cached messages
      setMessages(cachedMessages ? JSON.parse(cachedMessages) : []); // Parse and set messages or set to empty array
    } catch (error) {
      console.error("Error loading cached messages:", error); // Log any errors
    }
  };

  // Function to cache messages to AsyncStorage
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem(
        "chat_messages",
        JSON.stringify(messagesToCache)
      ); // Save messages as string
    } catch (error) {
      console.error("Error caching messages:", error); // Log any errors
    }
  };

  const onSend = (newMessages) => {
    console.log("New messages to send:", newMessages); // Log the new messages
    
    newMessages.forEach(message => {
        // Ensure the message object has the correct structure
        const messageData = {
            _id: message._id || Date.now().toString(),
            text: message.text || '', // Default to empty string if text is undefined
            createdAt: new Date(),
            user: {
                _id: userID,
                name: name,
                color: color || 'defaultColor', // Ensure color is defined
            },
            image: message.image || null, // Handle image property
        };

        // Ensure the messageData object is valid before sending
        if (messageData.text || messageData.image) {
            addDoc(collection(db, "messages"), messageData)
                .then(() => {
                    console.log("Message sent successfully");
                })
                .catch((error) => {
                    console.error("Error sending message:", error);
                });
        } else {
            console.error("Message data is invalid:", messageData);
        }
    });
};


  const renderInputToolbar = (props) => {
    if (isConnected === true) return <InputToolbar {...props} />;
    else return null;
  };

  // Custom message bubble rendering to display map view for location messages
  const renderBubble = (props) => {
    if (props.currentMessage.location) {
      return (
        <Bubble {...props}>
          <MapView
            style={{ width: 150, height: 100 }}
            initialRegion={{
              latitude: props.currentMessage.location.latitude,
              longitude: props.currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        </Bubble>
      );
    }
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: { backgroundColor: props.currentMessage.color || "#FFF" }, // Use the color property for background
          right: { backgroundColor: props.currentMessage.color || "#007AFF" },
        }}
      />
    );
  };

  const renderCustomActions = (props) => {
    return <CustomActions userID={userID} storage={storage} {...props} />;
  };

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
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
  }

  // KeyboardAvoidingView to manage keyboard behavior
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.container, { backgroundColor: color || "#fff" }]}>
        <GiftedChat
          messages={messages}
          onSend={(newMessages) => onSend(newMessages)}
          renderActions={(props) => (
            <CustomActions
              {...props}
              onSend={onSend}
              userID={userID}
              storage={storage}
            />
          )}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          user={{
            _id: userID,
            name: name,
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

// Styles for the Chat component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat; // Export the Chat component
