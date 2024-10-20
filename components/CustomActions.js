// Import necessary libraries
import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Component to provide media and location actions in the chat
const CustomActions = ({
  wrapperStyle,
  name,
  iconTextStyle,
  onSend,
  storage,
  userID,
}) => {
  const actionSheet = useActionSheet();

  // Handle action sheet options
  const onActionPress = () => {
    const options = [
      "Choose From Library",
      "Take Picture",
      "Send Location",
      "Cancel",
    ];
    const cancelButtonIndex = options.length - 1;

    actionSheet.showActionSheetWithOptions(
      { options, cancelButtonIndex },
      async (buttonIndex) => {
        try {
          switch (buttonIndex) {
            case 0:
              await pickImage();
              break;
            case 1:
              await takePhoto();
              break;
            case 2:
              await getLocation();
              break;
            default:
              return;
          }
        } catch (error) {
          Alert.alert("An unexpected error occurred.", error.message);
        }
      }
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
        await uploadAndSendImage(result.assets[0].uri);
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
        await uploadAndSendImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo: ", error);
      Alert.alert("An error occurred while taking the photo.");
    }
  };

  // Get the user's current location
  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Location permission denied.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const message = {
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      };
      onSend([message]);
    } catch (error) {
      console.error("Error getting location: ", error);
      Alert.alert("An error occurred while retrieving the location.");
    }
  };

  // Upload image and send the message
  const uploadAndSendImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = uri.substring(uri.lastIndexOf("/") + 1);
      const storageRef = ref(storage, `images/${filename}`);
      
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      const message = {
        text: downloadURL,
        user: {
          _id: userID,
          name,
        },
      };
      onSend([message]);
    } catch (error) {
      console.error("Error uploading image: ", error);
      Alert.alert("An error occurred while uploading the image.");
    }
  };

  return (
    <TouchableOpacity
      accessible={true}
      accessibilityLabel="More options"
      accessibilityHint="Send a photo or your location"
      style={[styles.wrapper, wrapperStyle]}
      onPress={onActionPress}
    >
      <View>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

// Styles for the CustomActions component
const styles = StyleSheet.create({
  wrapper: {
    // Custom styles for the wrapper
  },
  iconText: {
    fontSize: 22,
    color: "#fff",
  },
});

export default CustomActions;
