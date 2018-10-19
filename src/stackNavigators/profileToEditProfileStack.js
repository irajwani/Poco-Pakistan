import { createStackNavigator } from 'react-navigation';
import {Animated, Easing} from 'react-native';
import ProfilePage from '../views/ProfilePage';
import EditProfile from '../views/EditProfile';
import MultiplePictureCamera from '../components/MultiplePictureCamera';
import MultipleAddButton from '../components/MultipleAddButton';
import YourProducts from '../views/YourProducts';
import EditItem from '../views/EditItem';
import Users from '../views/Users';
import UserComments from '../views/UserComments';
import Settings from '../views/Settings';

export const profileToEditProfileStack = createStackNavigator({
    ProfilePage: ProfilePage,
    Settings: Settings,
    EditProfile: EditProfile,
    MultipleAddButton: MultipleAddButton,
    MultiplePictureCamera: MultiplePictureCamera,
    YourProducts: YourProducts,
    EditItem: EditItem,
    Users: Users,
    UserComments: UserComments
},
{   
    initalRouteName: 'ProfilePage',
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

