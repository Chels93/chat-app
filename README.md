Chat App - React Native App with Navigation

This README file provides a comprehensive guide for setting up and running the React Native chat-app, which allows users to communicate via messages, share images, and send their location. The app uses Firebase for real-time data storage, Firestore for chat persistence, and the Gifted Chat library for the chat interface. The app also includes basic text input handling and a demonstration of a scrollable view, and demonstrates the use of navigation between two screens.

OVERVIEW
This React Native project demonstrates a fully functional chat app with multiple features:

- Anonymous authentication using Firebase
- Real-time messaging using Firestore
- Offline data storage with AsyncStorage
- Media sharing with support for uploading images via the device's camera or gallery
- Location sharing using device GPS
- Screen reader support for accessibility.

KEY FEATURESCustomizable Chat Room:

- Users can enter their name and choose a background color for the chat interface before joining.
- Messaging: Users can send text messages, images, and location data to other users.
- Offline Capability: Users can read stored messages offline and send messages when back online.
- Accessibility: The app is designed to be compatible with screen readers for visually impaired users.

PROJECT STRUCTURE
The project contains the following files and components:

- App.js: The entry point of the app. Sets up navigation between the Start and Chat screens. Initializes Firebase and manages user authentication and real-time chat.
- Start.js: The start screen where users enter their name and select a background color. Users are navigated to the chat screen after choosing these settings.
- Chat.js: Displays the chat interface using Gifted Chat. Handles real-time messaging, image sharing, and location data. The background color and navigation title are customized based on user input.
- Additional folders include:
  /assets/: Stores images and other static assets used in the app.
  /components/: Reusable components for handling chat input, buttons, etc.

INSTALLATION PREREQUISITES

- Node.js
- Expo CLI
- Firebase Account for database setup

USAGE
Once the Expo server is running, you can run the app on an iOS or Android simulator, or scan the QR code with the Expo Go app on your mobile device.

FEATURES AND FUNCTIONALITY

- Anonymous Authentication: Users are authenticated anonymously using Firebase when they join the chat.
- Chat Functionality
  Real-time Messaging: Users can send and receive messages in real time, with messages stored in Firestore.
  Offline Support: Messages can be read offline, and new messages are stored locally when the device is offline.
- Media Sharing
  Image Sharing: Users can choose images from their gallery or take new photos using the camera. These images are uploaded to Firebase Cloud Storage.
- Location Sharing
  Location Data: Users can share their current location with others. The location is displayed in the chat as a map link.
- Offline Mode
  AsyncStorage: Chat data is stored locally when offline, and users can read their previous messages even without an internet connection.
- Technical Requirements
  React Native
  Expo
  Firebase for authentication and Firestore
  Gifted Chat for the chat UI
  Firebase Cloud Storage for storing images
  AsyncStorage for offline message storage
  Geolocation for sharing location

SCREENS OVERVIEW
Start.js - Name Input: A text input field where the user can type their name. - Background Color Selection: A selection of color options is presented as buttons. The chosen color will be applied to the background of the Chat screen. - Navigation: A button navigates the user to the Chat screen, passing along the name and selected background color.
Chat.js - Dynamic Navigation Title: The screen’s navigation title is dynamically set to the user’s name using the useEffect hook. - Personalized Message: Displays a welcome message using the user’s name. - Custom Background Color: The background color of the screen is set to the color selected by the user on the Start screen. - Media and Location Sharing: Users can upload images or send their current location. - Gifted Chat: Displays the chat interface, allowing users to send messages, images, and locations.

FIREBASE SETUP

- Create a Firebase project
- Add Firebase config within project
- Enable Firebase cloud storage
- Install Firebase in your project
- Initialize Firebase

RUNNING THE APP

- Start the Expo development server using: expo start
- Run on Android/iOS
