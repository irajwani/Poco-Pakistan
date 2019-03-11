import React, { Component } from 'react';
import { SignUpToCreateProfileStack } from './src/stackNavigators/signUpToCreateProfileStack';
import Test from './src/views/Test';
import AuthOrAppSwitch from './src/switchNavigators/AuthOrAppSwitch';

export default class App extends Component {

  render() {
    console.disableYellowBox = true;
    console.log('Initializing Application')
    
    return (
      
      <AuthOrAppSwitch />

    );
  }
}

//Android crash fix followed thus far: https://medium.com/@impaachu/react-native-android-release-build-crash-on-device-14f2c9eacf18:

// react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

// import {Provider} from 'react-redux'
// import {createStore} from 'redux'
// import reducer from './src/store/reducer.js'

// import GalleryEntry from './src/views/GalleryEntry.js';
// import HomeScreen from './src/views/HomeScreen.js';
// import ProfilePage from './src/views/ProfilePage.js';
// import AddButton from './src/components/AddButton';
// import CreateItem from './src/views/CreateItem.js'
// import EditProfile from './src/views/EditProfile.js';
// import MarketPlace from './src/views/MarketPlace.js';
// import ProductDetails from './src/views/ProductDetails';
// import CustomChat from './src/views/CustomChat.js';
// import PictureCamera from './src/components/PictureCamera.js';
// import Comments from './src/views/Comments.js';
// import UserComments from './src/views/UserComments.js';
// import Users from './src/views/Users.js';
// import MultipleAddButton from './src/components/MultipleAddButton.js';
// import MultiplePictureCamera from './src/components/MultiplePictureCamera.js';
// import Products from './src/components/Products.js';
// import YourProducts from './src/views/YourProducts.js';
// import EditItem from './src/views/EditItem.js';





// const RootStack = createStackNavigator({

//   SignIn: SignIn,

//   HomeScreen: HomeScreen,

//   Gallery: GalleryEntry,

//   Profile: ProfilePage,

//   AddButton: AddButton,

//   PictureCamera: PictureCamera,

//   MultipleAddButton: MultipleAddButton,

//   MultiplePictureCamera: MultiplePictureCamera,

//   CreateItem: CreateItem,

//   Products: Products,

//   MarketPlace: MarketPlace,

//   YourProducts: YourProducts,

//   ProductDetails: ProductDetails,

//   Comments: Comments,

//   UserComments: UserComments,

//   CustomChat: CustomChat,

//   EditItem: EditItem,

//   EditProfile: EditProfile,

//   Users: Users,


// },
// {
//   initialRouteName: 'SignIn',
//   // the shared navigationOptions, which we can always override within the component
//   navigationOptions: {
//     title: 'NottMyStyle',
//     headerStyle: {
//       backgroundColor: '#37a1e8',
//     },
//     headerTintColor: '#fff',
//     headerTitleStyle: {
//       fontWeight: 'bold',
//       fontFamily: 'Verdana'
//     },
//   },
// }


// )


