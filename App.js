import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
} from "react-native";
import Screen1 from "./components/Screen1";
import Screen2 from "./components/Screen2";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Create the navigator for screen navigation
const Stack = createNativeStackNavigator();

const App = () => {
  // State to hold the text input value
  const [text, setText] = useState("");

  // Function to alert the user input (`text` state's value)
  const alertMyText = () => {
    Alert.alert(text);
  };

  // A custom screen component that includes the UI elements
  const CustomScreen = () => (
    <View style={styles.container}>
      {/* Text input for user to type something */}
      <TextInput
        style={styles.textInput}
        value={text}
        onChangeText={setText}
        placeholder="Type something here."
      />
      {/* Display the text entered by the user */}
      <Text style={styles.textDisplay}>You wrote: {text}</Text>
      {/* Button to trigger the alert with the user input */}
      <Button
        onPress={() => {
          alertMyText();
        }}
        title="Press Me"
      />
      {/* Scrollable view to demonstrate scrolling with large content */}
      <ScrollView>
        <Text style={{ fontSize: 110 }}>
          This text is so big! And so long! You have to scroll!
        </Text>
      </ScrollView>
    </View>
  );

  return (
    // Wrap the app with NavigationContainer for screen navigation
    <NavigationContainer>
      {/* Navigator to manage the stack of screens */}
      <Stack.Navigator initialRouteName="Screen1">
        {/* Define the first screen in the stack */}
        <Stack.Screen name="Screen1" component={Screen1} />
        {/* Define the second screen in the stack */}
        <Stack.Screen name="Screen2" component={Screen2} />
        {/* Add the custom screen as another screen in the stack */}
        <Stack.Screen name="CustomScreen" component={CustomScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    width: "88%",
    borderWidth: 1,
    height: 50,
    padding: 10,
  },
  textDisplay: {
    height: 50,
    lineHeight: 50,
  },
});

export default App;