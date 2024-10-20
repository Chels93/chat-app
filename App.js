// App.js
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNetInfo } from "@react-native-community/netinfo";
import { Alert, LogBox } from "react-native";
import Chat from "./components/Chat";
import Start from "./components/Start";

LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

const Stack = createStackNavigator();

const App = () => {
  const connectionStatus = useNetInfo();

  const firebaseConfig = {
    apiKey: "AIzaSyDauyicK3B2tUFFsdaTY_Js8kPqK_RxvO8",
    authDomain: "chatapp-15bbe.firebaseapp.com",
    projectId: "chatapp-15bbe",
    storageBucket: "chatapp-15bbe.appspot.com",
    messagingSenderId: "681242972614",
    appId: "1:681242972614:web:365b4780ee635c3c43a2c7",
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const auth = initializeAuth(app, { persistence: AsyncStorage });

  useEffect(() => {
    const manageNetwork = async () => {
      try {
        if (connectionStatus.isConnected === false) {
          Alert.alert("Connection Lost!!");
          await disableNetwork(db);
        } else {
          await enableNetwork(db);
        }
      } catch (error) {
        console.error("Error managing Firestore network: ", error);
      }
    };
    manageNetwork();
  }, [connectionStatus.isConnected, db]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen
          name="Chat"
          component={(props) => (
            <Chat
              db={db}
              isConnected={connectionStatus.isConnected}
              storage={storage}
              auth={auth}
              {...props}
            />
          )}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
