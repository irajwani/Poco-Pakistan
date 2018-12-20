import { createStackNavigator } from 'react-navigation';
import {Animated, Easing} from 'react-native';
import CreateProfile from '../views/CreateProfile';
import SignIn from '../views/SignIn';
import MultiplePictureCamera from '../components/MultiplePictureCamera';
import MultipleAddButton from '../components/MultipleAddButton';
import HomeScreen from '../views/HomeScreen';
import ViewPhotos from '../views/ViewPhotos';

export const SignUpToCreateProfileStack = createStackNavigator({
    //Initail Stack of 5 views that an unaunthenticated user sees
    SignIn: SignIn,
    CreateProfile: CreateProfile,
    MultipleAddButton: MultipleAddButton,
    MultiplePictureCamera: MultiplePictureCamera,
    ViewPhotos: ViewPhotos,

    //bottomTabNavigator, which is a collection of the remaining 5 stackNavigators that complete the application
    HomeScreen: HomeScreen,
},
{   
    initialRouteName: 'SignIn',
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

