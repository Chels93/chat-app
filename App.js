import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  disableNetwork,
  enableNetwork,
} from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNetInfo } from "@react-native-community/netinfo";
import { Alert, LogBox } from "react-native";
import Chat from "./components/Chat";
import Start from "./components/Start";

// Ignore specific warnings that are not relevant to app's functionality
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

const Stack = createStackNavigator(); // Instance created for screen transitions

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyDauyicK3B2tUFFsdaTY_Js8kPqK_RxvO8",
  authDomain: "chatapp-15bbe.firebaseapp.com",
  projectId: "chatapp-15bbe",
  storageBucket: "chatapp-15bbe.appspot.com",
  messagingSenderId: "681242972614",
  appId: "1:681242972614:web:365b4780ee635c3c43a2c7",
};

// Initialize Firebase app with provided config
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore for database handling
const db = getFirestore(app);

// Initialize Firebase Storage for handling file uploads/downloads (i.e. images)
const storage = getStorage(app);

// Initialize Firebase Authentication and set persistent login using AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Main App Component
const App = () => {
  const connectionStatus = useNetInfo(); // Monitor network connection status
  useEffect(() => {
    // Manage Firestore network based on connection status
    const manageNetwork = async () => {
      try {
        if (connectionStatus.isConnected === false) {
          Alert.alert("Connection Lost!!");
          await disableNetwork(db); // Disable Firestore network to avoid errors while offline
        } else {
          await enableNetwork(db); // Enable Firestore network when connection is restored
        }
      } catch (error) {
        console.error("Error managing Firestore network: ", error);
      }
    };
    manageNetwork(); // Execute network management function when connection status changes
  }, [connectionStatus.isConnected]);

  // Return navigation container with two screens (Start and Chat)
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => (
            <Chat
              db={db}
              isConnected={connectionStatus.isConnected}
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
