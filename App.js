// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Chat from "./components/Chat"; 
import Start from "./components/Start"; 

// Initialize Firebase services (Firestore and Auth)
const db = getFirestore(); // Firestore will be initialized in Chat.js
const auth = getAuth(); // Initialize Firebase Authentication

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start">
          {props => <Start {...props} />}
        </Stack.Screen>
        {/* Pass the db instance when navigating to Chat */}
        <Stack.Screen name="Chat">
          {props => <Chat {...props} db={db} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export { db, auth }; // Export the Firestore and Auth instances
export default App;
