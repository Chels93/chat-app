// Start.js
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Platform, // Import Platform here
  KeyboardAvoidingView, // Import KeyboardAvoidingView for proper functionality
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, signInAnonymously } from "firebase/auth";

// Define the Start component, which receives navigation as a prop
const Start = ({ navigation }) => {
  // State to hold the user's name and selected background color
  const [name, setName] = useState("");
  const auth = getAuth();
  const [bgColor, setBgColor] = useState("#fff");
  const colors = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];

  // Function to log in the user anonymously and navigate to the Chat screen
  const loginUser = () => {
    signInAnonymously(auth)
      .then((result) => {
        navigation.navigate("Chat", {
          userID: result.user.uid,
          name,
          color: bgColor,
        });
        Alert.alert("Successfully Signed In");
      })
      .catch((error) => {
        Alert.alert("Unable to Login, try later again.");
      });
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
            />
          ))}
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#757083" }]}
          onPress={loginUser}
        >
          <Text style={styles.buttonText}>Start Chatting</Text>
        </TouchableOpacity>
      </View>
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView behavior="padding" />
      ) : null}
    </ImageBackground>
  );
};

// Styles for the component
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

// Export the Start component
export default Start;
