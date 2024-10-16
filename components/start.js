// Start.js
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from "react-native";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDauyicK3B2tUFFsdaTY_Js8kPqK_RxvO8",
  authDomain: "chatapp-15bbe.firebaseapp.com",
  projectId: "chatapp-15bbe",
  storageBucket: "chatapp-15bbe.appspot.com",
  messagingSenderId: "681242972614",
  appId: "1:681242972614:web:365b4780ee635c3c43a2c7"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase Auth
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

// Define the Start functional component
const Start = ({ navigation }) => {
  const [name, setName] = useState("");
  const [bgColor, setBgColor] = useState("#fff");

  const colors = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('userName');
        const storedBgColor = await AsyncStorage.getItem('bgColor');

        if (storedName) {
          setName(storedName);
        }
        if (storedBgColor) {
          setBgColor(storedBgColor);
        }
      } catch (error) {
        console.error("Failed to load data from AsyncStorage", error);
      }
    };

    loadData();
  }, []);

  const signInUser = async () => {
    if (!name) {
      Alert.alert("Please enter a username");
      return;
    }
    try {
      const result = await signInAnonymously(auth);
      await AsyncStorage.setItem('userName', name);
      await AsyncStorage.setItem('bgColor', bgColor);
      navigation.navigate("Chat", { userID: result.user.uid, name, bgColor });
      Alert.alert("Signed in Successfully!");
    } catch (error) {
      Alert.alert("Unable to sign in, try again later.");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/background-image.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome!</Text>

        <TextInput
          style={styles.textInput}
          value={name}
          onChangeText={setName}
          placeholder="Type your username here."
          placeholderTextColor="#ddd"
        />

        <Text style={styles.subtitle}>Choose Background Color:</Text>

        <View style={styles.colorOptions}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[styles.colorCircle, { backgroundColor: color }]}
              onPress={() => setBgColor(color)}
              activeOpacity={0.7}  // Ensure touch responsiveness
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#757083" }]}
          onPress={signInUser}
          activeOpacity={0.7}  // Ensure touch responsiveness
        >
          <Text style={styles.buttonText}>Start Chatting</Text>
        </TouchableOpacity>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  title: {
    fontSize: 45,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "300",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  textInput: {
    width: "88%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginVertical: 15,
    color: "#FFFFFF",
    backgroundColor: "#757083",
  },
  colorOptions: {
    flexDirection: "row",
    marginVertical: 20,
  },
  colorCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  button: {
    width: "88%",
    padding: 15,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Start;
