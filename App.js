import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { createStackNavigator } from 'react-navigation'; // Version can be specified in package.json

import GalleryEntry from './src/views/GalleryEntry.js';
import SignIn from './src/views/SignIn.js';
import HomeScreen from './src/views/HomeScreen.js';
import ProfilePage from './src/views/ProfilePage.js';
import AddButton from './src/components/AddButton';
import CreateItem from './src/views/CreateItem.js'
import EditProfile from './src/views/EditProfile.js';
import MarketPlace from './src/views/MarketPlace.js';
import ProductDetails from './src/views/ProductDetails';
import CustomChat from './src/views/CustomChat.js';
import PictureCamera from './src/components/PictureCamera.js';
import Comments from './src/views/Comments.js';
import UserComments from './src/views/UserComments.js';
import Users from './src/views/Users.js';
import MultipleAddButton from './src/components/MultipleAddButton.js';
import MultiplePictureCamera from './src/components/MultiplePictureCamera.js';
import Products from './src/components/Products.js';

////
import PushNotification from 'react-native-push-notification';

////


type Props = {};

const RootStack = createStackNavigator({

  SignIn: SignIn,

  HomeScreen: HomeScreen,

  Gallery: GalleryEntry,

  Profile: ProfilePage,

  AddButton: AddButton,

  PictureCamera: PictureCamera,

  MultipleAddButton: MultipleAddButton,

  MultiplePictureCamera: MultiplePictureCamera,

  CreateItem: CreateItem,

  Products: Products,

  MarketPlace: MarketPlace,

  ProductDetails: ProductDetails,

  Comments: Comments,

  UserComments: UserComments,

  CustomChat: CustomChat,

  EditProfile: EditProfile,

  Users: Users,


},
{
  initialRouteName: 'SignIn',
  // the shared navigationOptions, which we can always override within the component
  navigationOptions: {
    title: 'NottMyStyle',
    headerStyle: {
      backgroundColor: '#37a1e8',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontFamily: 'Verdana'
    },
  },
}


)

export default class App extends Component<Props> {

  componentWillMount() {
    this.initializePushNotifications();
  }

  initializePushNotifications() {
    PushNotification.configure({

      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
          console.log( 'TOKEN:', token );
      },
  
      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
          const {userInteraction} = notification;
          console.log( 'NOTIFICATION:', notification, userInteraction );
          
          //userInteraction ? this.navToEditItem() : console.log('user hasnt pressed notification, so do nothing');
      },
  
      // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications) 
      //senderID: "YOUR GCM SENDER ID",
  
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
          alert: true,
          badge: true,
          sound: true
      },
  
      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
  
      /**
        * (optional) default: true
        * - Specified if permissions (ios) and token (android and ios) will requested or not,
        * - if not, you must call PushNotificationsHandler.requestPermissions() later
        */
      requestPermissions: true,
  });


  
    PushNotification.localNotification({
      /* Android Only Properties */
      // id: '0', // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      // ticker: "My Notification Ticker", // (optional)
      // autoCancel: true, // (optional) default: true
      // largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
      // smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
      // bigText: "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
      // subText: "This is a subText", // (optional) default: none
      // color: "red", // (optional) default: system default
      // vibrate: true, // (optional) default: true
      // vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      // tag: 'some_tag', // (optional) add tag to message
      // group: "group", // (optional) add group to message
      // ongoing: false, // (optional) set whether this is an "ongoing" notification
  
      /* iOS only properties */
      alertAction: 'view',
      //category:  null,
      //userInfo: null,
  
      /* iOS and Android properties */
      title: "My Notification Title", // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
      message: "Nobody has shown interest in ...... for the past ten days.\nPerhaps you should consider a reduction in price.\nTap here to edit item details", // (required)
      playSound: true, // (optional) default: true
      soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
  });

  PushNotification.localNotificationSchedule({
    message: "My first scheduled Notification Message", // (required)
    date: new Date(Date.now() + (10 * 1000)) // in 10 secs
  });


  }

  render() {
    console.disableYellowBox = true;
    console.log('Initializing Application')
    
    return (
      
        <RootStack />
      
    );
  }
}

