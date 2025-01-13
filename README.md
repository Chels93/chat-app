Chat App - React Native App with Navigation

OVERVIEW
The app allows users to communicate through messages, share images, and send their location. It leverages Firebase for real-time data storage, Firestore for chat persistence, and the Gifted Chat library for the chat interface. Accessibility features, including screen reader compatibility, are integrated into the app. This React Native project demonstrates a fully functional chat app with multiple features:

    - Anonymous authentication using Firebase
    - Real-time messaging using Firestore
    - Offline data storage with AsyncStorage
    - Media sharing with support for uploading images via the device's camera or gallery
    - Location sharing using device GPS
    - Screen reader support for accessibility.

KEY FEATURES
- Customizable Chat Room: users can enter their name and choose a background color for the chat interface before joining
- Messaging: real time messaging using Firestore, and media sharing capabilities like image upload and sharing location data
- Offline Capability: users can read stored messages offline and send messages when back online
- Accessibility: designed to be compatible with screen readers for visually impaired users

PROJECT STRUCTURE
- Files and Components:

    - App.js: entry point of the app and manages navigation, Firebase initialization, and user authentication 
    - Start.js: the starting screen where users enter their name and select a background color, and transitions to the chat screen upon setup
    - Chat.js: the main chat interface uisng Gifted Chat, handles real-time messaging, media sharing, and location data display 

- Additional Directories:
    - /assets/: stores images and other static assets used in the app
    - /components/: reusable components for handling chat input, buttons, etc.

INSTALLATION PREREQUISITES:
- Node.js
- Expo CLI
- Firebase Account for database setup

FEATURES AND FUNCTIONALITY:
- Anonymous Authentication: users are authenticated anonymously using Firebase when they join the chat
- Chat Functionality: users can engage in real time messaging by sending/receiving messages instantly using Firestore and can read messages offline and queue messages for later sending 
- Media Sharing: users choose images from the gallery or caputre new photos with the camera, and images are uploaded to Firebaswe Cloud Storage
- Location Sharing: user can share location data with others, display as a map link in the chat 
- Offline Mode: uses AsyncStorage to store chat data locally, allowing users to view previous messages without an internet connection 

TECHNICAL STACK:
- React Native
- Expo
- Firebase for authentication and Firestore
- Gifted Chat for the chat UI
- Firebase Cloud Storage for storing images
- AsyncStorage for offline message storage
- Geolocation for sharing location

SCREENS OVERVIEW:
Start.js - Name Input: A text input field where the user can type their name. - Background Color Selection: A selection of color options is presented as buttons. The chosen color will be applied to the background of the Chat screen. - Navigation: A button navigates the user to the Chat screen, passing along the name and selected background color.
Chat.js - Dynamic Navigation Title: The screen’s navigation title is dynamically set to the user’s name using the useEffect hook. - Personalized Message: Displays a welcome message using the user’s name. - Custom Background Color: The background color of the screen is set to the color selected by the user on the Start screen. - Media and Location Sharing: Users can upload images or send their current location. - Gifted Chat: Displays the chat interface, allowing users to send messages, images, and locations.

FIREBASE SETUP:
- Create a Firebase project
- Add Firebase config within project
- Enable Firebase cloud storage
- Install Firebase in your project using: npm install firebase
- Initialize Firebase

DEPLOYMENT:
- Start the Expo development server using: expo start
- Run on Android/iOS emulator or scan QR code with Expo Go
- GitHub Pages: https://github.com/Chels93/chat-app
