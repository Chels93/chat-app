// App.js
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  disableNetwork,
  enableNetwork,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { useNetInfo } from "@react-native-community/netinfo";
import { getAuth, initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, LogBox } from "react-native";
import Chat from "./components/Chat";
import Start from "./components/Start";

// Create a stack navigator
const Stack = createStackNavigator();

// Ignore specific log warnings
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

const App = () => {
  const connectionStatus = useNetInfo();

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

  // Initialize Firebase services
  const db = getFirestore(app); // Firestore initialized here
  const storage = getStorage(app); // Initialize Firebase Storage handler
  const auth = initializeAuth(app);

  // Use effect to manage network connectivity and Firestore network settings
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected, db]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => (
            <Chat
              db={db}
              isConnected={connectionStatus.isConnected}
              storage={storage}
              auth={auth} // Pass the auth object to Chat
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
