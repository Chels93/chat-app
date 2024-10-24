import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Timestamp } from "firebase/firestore";
import MapView from "react-native-maps";

// Component to provide media and location actions in the chat
const CustomActions = ({
  wrapperStyle,
  iconTextStyle,
  onSend,
  storage,
  userID,
}) => {
  const actionSheet = useActionSheet();

  // Handle action sheet options when "+" button is pressed
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

  // Generate a unique reference for each media file
  // URI will be used to name the file, appending userID and timestamp for uniqueness
  const generateReference = (uri) => {
    const timeStamp = new Date().getTime();
    const imageName = uri.split("/").pop(); // Extract the image name from URI
    return `${userID}-${timeStamp}-${imageName}`; // Return a unique file name for Firebase storage
  };

  // Pick image from media library
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync();
      // If the user selects an image, proceed with upload
      if (!result.canceled && result.assets && result.assets.length > 0) {
        await uploadAndSendImage(result.assets[0].uri);
      } else {
        Alert.alert("Image selection was canceled.");
      }
    } else {
      Alert.alert("Permissions haven't been granted.");
    }
  };

  // Take a photo using the device's camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchCameraAsync();
      // If the user takes a picture, proceed with upload
      if (!result.canceled && result.assets && result.assets.length > 0) {
        await uploadAndSendImage(result.assets[0].uri);
      } else {
        Alert.alert("Camera usage was canceled.");
      }
    } else {
      Alert.alert(
        "Permissions haven't been granted. Please enable them in settings."
      );
    }
  };

  // Get the user's current location
  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      try {
        const location = await Location.getCurrentPositionAsync({});
        // If the location is successfully retrieved, send the message with location
        if (location) {
          onSend([
            {
              createdAt: Timestamp.now(),
              user: { _id: userID },
              location: {
                longitude: location.coords.longitude,
                latitude: location.coords.latitude,
              },
            },
          ]);
        } else {
          Alert.alert("Error occurred while fetching location.");
        }
      } catch (error) {
        Alert.alert("Unable to retrieve location. Please check your settings.");
      }
    } else {
      Alert.alert("Location permissions haven't been granted.");
    }
  };

  // Upload image to Firebase storage and send the message with the image URL
  const uploadAndSendImage = async (imageURI) => {
    if (!imageURI) {
      Alert.alert("Image URI is undefined."); // Alert if image URI is invalid
      return;
    }

    const uniqueRefString = generateReference(imageURI); // Generate unique reference for the image
    const newUploadRef = ref(storage, uniqueRefString); // Create Firebase storage reference

    try {
      const response = await fetch(imageURI);
      const blob = await response.blob(); // Convert the image to a Blob object
      const snapshot = await uploadBytes(newUploadRef, blob); // Upload the Blob to Firebase storage
      const imageURL = await getDownloadURL(snapshot.ref); // Get the URL for the uploaded image
      // Send the message with image URL
      onSend([
        {
          createdAt: Timestamp.now(),
          user: { _id: userID },
          image: imageURL,
        },
      ]);
    } catch (error) {
      Alert.alert("Failed to upload image.", error.message);
    }
  };

  return (
    // Touchable button for selection actions (image or location)
    <TouchableOpacity
      accessible={true}
      accessibilityLabel="Select optional actions"
      accessibilityHint="Choose to send an image or your location."
      accessibilityRole="button"
      style={styles.container}
      onPress={onActionPress}
    >
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

// Custom render function for showing the MapView when a location is sent
// Props: currentMessage contains message details, including location data
export const renderCustomView = (props) => {
  const { currentMessage } = props;

  // If the message contains location data, render the MapView
  if (currentMessage.location) {
    return (
      <MapView
        style={styles.mapView}
        initialRegion={{
          latitude: currentMessage.location.latitude,
          longitude: currentMessage.location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
    );
  }
  return null; // If no location data, return nothing
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
  mapView: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
  },
});

export default CustomActions;
