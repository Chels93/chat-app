// Import necessary libraries and components
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

const Chat = ({ db, route, navigation, isConnected }) => {
  const [messages, setMessages] = useState([]);
  const { name, userID, color, backgroundColor } = route.params;

  // Initialize Firebase storage
  const storage = getStorage(); 

  useEffect(() => {
    navigation.setOptions({ title: name });
    let unsubMessages;

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

    return () => unsubMessages && unsubMessages();
  }, [isConnected, db, navigation, name]);

  const loadCachedMessages = async () => {
    try {
      const cachedMessages = await AsyncStorage.getItem("chat_messages");
      setMessages(cachedMessages ? JSON.parse(cachedMessages) : []);
    } catch (error) {
      console.error("Error loading cached messages:", error);
    }
  };

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

  const onSend = async (newMessages) => {
    try {
      await addDoc(collection(db, "messages"), newMessages[0]);
    } catch (error) {
      Alert.alert("Error sending message", error.message);
      console.error("Error sending message:", error);
    }
  };

  const renderInputToolbar = (props) => {
    return isConnected ? <InputToolbar {...props} /> : null;
  };

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
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} />
    </View>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
  },
});

export default Chat;
