import { createStackNavigator } from 'react-navigation';
import {Animated, Easing} from 'react-native';
import ProfilePage from '../views/ProfilePage';
import EditProfile from '../views/EditProfile';
import MultiplePictureCamera from '../components/MultiplePictureCamera';
import MultipleAddButton from '../components/MultipleAddButton';
import YourProducts from '../views/YourProducts';
import EditItem from '../views/EditItem';
// import Users from '../views/Users';
import UserComments from '../views/UserComments';
import Settings from '../views/Settings';
import ViewPhotos from '../views/ViewPhotos';
import OtherUserProfilePage from '../views/OtherUserProfilePage';

export const profileToEditProfileStack = createStackNavigator({
    ProfilePage: ProfilePage,
    Settings: Settings,
    EditProfile: EditProfile,
    MultipleAddButton: MultipleAddButton,
    MultiplePictureCamera: MultiplePictureCamera,
    ViewPhotos: ViewPhotos,
    YourProducts: YourProducts,
    EditItem: EditItem,
    UserComments: UserComments,
    OtherUserProfilePage: OtherUserProfilePage
},
{   
    initialRouteName: 'ProfilePage',
    headerMode: 'none',
    mode: 'modal',
    navigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      },
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps;
        const { index } = scene;

        const height = layout.initHeight;
        const translateY = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [height, 0, 0],
        });

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1],
        });

        return { opacity, transform: [{ translateY }] };
      },
    }),
  })

