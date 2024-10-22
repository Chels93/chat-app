// Import necessary libraries
import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Timestamp } from "firebase/firestore"; // Import Timestamp
import MapView from "react-native-maps"; // Import MapView for location rendering

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
  const generateReference = (uri) => {
    const timeStamp = new Date().getTime();
    const imageName = uri.split("/").pop();
    return `${userID}-${timeStamp}-${imageName}`;
  };

  // Pick image from media library
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled && result.assets && result.assets.length > 0) {
        await uploadAndSendImage(result.assets[0].uri);
      } else {
        Alert.alert("Image selection was canceled.");
      }
    } else {
      Alert.alert("Permissions haven't been granted.");
    }
  };

  // Take a photo using the camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchCameraAsync();
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

  // Upload image and send the message
  const uploadAndSendImage = async (imageURI) => {
    if (!imageURI) {
      Alert.alert("Image URI is undefined.");
      return;
    }

    const uniqueRefString = generateReference(imageURI);
    const newUploadRef = ref(storage, uniqueRefString);

    try {
      const response = await fetch(imageURI);
      const blob = await response.blob();
      const snapshot = await uploadBytes(newUploadRef, blob);
      const imageURL = await getDownloadURL(snapshot.ref);
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
export const renderCustomView = (props) => {
  const { currentMessage } = props;

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
  return null;
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
