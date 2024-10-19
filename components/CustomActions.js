import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Component to provide media and location actions in the chat
const CustomActions = ({
  wrapperStyle,
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
  };

  // Generate a unique reference string for the image
  const generateReference = (uri) => {
    const imageName = uri.split("/").pop();
    const timeStamp = Date.now();
    return `${userID}-${timeStamp}-${imageName}`;
  };

  // Upload image to Firebase storage and send the image URL
  const uploadAndSendImage = async (imageURI) => {
    const uniqueRefString = generateReference(imageURI);
    const newUploadRef = ref(storage, uniqueRefString);
    const response = await fetch(imageURI);
    const blob = await response.blob();

    try {
      const snapshot = await uploadBytes(newUploadRef, blob);
      const imageURL = await getDownloadURL(snapshot.ref);

      console.log("Image uploaded successfully:", imageURL);

      if (imageURL) {
        onSend([{ image: imageURL }]);
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
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

export default CustomActions;
