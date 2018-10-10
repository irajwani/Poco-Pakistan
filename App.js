import React, { Component } from 'react';
import { SignUpToCreateProfileStack } from './src/stackNavigators/signUpToEditProfileStack';

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


type Props = {};

export default class App extends Component<Props> {

  render() {
    console.disableYellowBox = true;
    console.log('Initializing Application')
    
    return (
      
      
      <SignUpToCreateProfileStack />
      
      
    );
  }
}



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


