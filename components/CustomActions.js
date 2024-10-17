import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Component to provide media and location actions in the chat
const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {
  const actionSheet = useActionSheet();

  // Handle action sheet options
  const onActionPress = () => {
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    actionSheet.showActionSheetWithOptions(
      { options, cancelButtonIndex },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            await pickImage(); // User chose to pick an image from the library
            break;
          case 1:
            await takePhoto(); // User chose to take a picture using the camera
            break;
          case 2:
            await getLocation(); // User chose to send their current location
            break;
          default:
            return; // If "Cancel" is selected, do nothing
        }
      },
    );
  };

  // Pick image from media library
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access media library denied.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (!result.canceled && result.assets.length > 0) {
        await uploadAndSendImage(result.assets[0].uri); // Use the URI of the picked image
      }
    } catch (error) {
      console.error("Error picking image: ", error);
      Alert.alert("An error occurred while picking the image.");
    }
  };

  // Take a photo using the camera
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Camera permission denied.");
        return;
      }
      const result = await ImagePicker.launchCameraAsync();
      if (!result.canceled && result.assets.length > 0) {
        await uploadAndSendImage(result.assets[0].uri); // Use the URI of the captured image
      }
    } catch (error) {
      console.error("Error taking photo: ", error);
      Alert.alert("An error occurred while taking the photo.");
    }
  };

  // Get the user's current location
  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync();
    if (permissions?.granted) {
      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        onSend({
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
        });
      } else {
        Alert.alert("Error occurred while fetching location");
      }
    } else {
      Alert.alert("Permissions haven't been granted.");
    }
  }

  // Generate a unique reference string for the image
  const generateReference = (uri) => {
    // This will get the file name from the URI
    const imageName = uri.split("/").pop(); // Simplified to get the last part of the URI
    const timeStamp = Date.now();
    return `${userID}-${timeStamp}-${imageName}`;
  }

  // Upload image to Firebase storage and send the image URL
  const uploadAndSendImage = async (imageURI) => {
    const uniqueRefString = generateReference(imageURI);
    const newUploadRef = ref(storage, uniqueRefString);
    const response = await fetch(imageURI);
    const blob = await response.blob();
    
    try {
        const snapshot = await uploadBytes(newUploadRef, blob);
        const imageURL = await getDownloadURL(snapshot.ref);
        
        console.log("Image uploaded successfully:", imageURL); // Log the image URL
        
        if (imageURL) {
            onSend([{ image: imageURL }]); // Send the image URL in an array
        } else {
            console.error("Image URL is undefined");
        }
    } catch (error) {
        console.error("Error uploading image: ", error);
        Alert.alert("An error occurred while uploading the image.");
    }
};


  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onActionPress} 
      accessibilityLabel="Action Menu" 
      accessibilityRole="button"
    >
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 50, // Increased for better touchability
    height: 50,
    marginLeft: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    borderRadius: 25, // Circular border for the action button
    borderColor: "#b2b2b2",
    borderWidth: 2,
    backgroundColor: "#ffffff", // Added background color for visibility
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 28, // Increased font size for better visibility
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

export default CustomActions; // Export the CustomActions component
