// App.js
import React, { useEffect } from "react";
import { useNetInfo } from "@react-native-community/netinfo";
import { Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  getFirestore,
  disableNetwork,
  enableNetwork,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Chat from "./components/Chat";
import Start from "./components/Start";

// Initialize Firebase services (Firestore and Auth)
const db = getFirestore();
const auth = getAuth();

const Stack = createStackNavigator();

const App = () => {
  const connectionStatus = useNetInfo(); // Corrected connectionStatus reference

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start">
          {(props) => <Start {...props} />}
        </Stack.Screen>
        {/* Pass the db instance when navigating to Chat */}
        <Stack.Screen name="Chat">
          {(props) => (
            <Chat isConnected={connectionStatus.isConnected} db={db} {...props} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export { db, auth }; // Export the Firestore and Auth instances
export default App;
