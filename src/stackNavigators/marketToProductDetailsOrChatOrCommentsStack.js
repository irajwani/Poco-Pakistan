import { createStackNavigator } from 'react-navigation';
import {Animated, Easing} from 'react-native';
import MarketPlace from '../views/MarketPlace';
import ProductDetails from '../views/ProductDetails';
import CustomChat from '../views/CustomChat';
import YourProducts from '../views/YourProducts';
import OtherUserProfilePage from '../views/OtherUserProfilePage';
import UserComments from '../views/UserComments';
import ProductComments from '../views/ProductComments';
import EditItem from '../views/EditItem';

export const marketToProductDetailsOrChatOrCommentsStack = createStackNavigator({
    MarketPlace: MarketPlace,
    YourProducts: YourProducts,
    ProductDetails: ProductDetails,
    EditItem: EditItem,
    ProductComments: ProductComments,
    OtherUserProfilePage: OtherUserProfilePage,
    UserComments: UserComments,
    CustomChat: CustomChat,
},
{
    initialRouteName: 'MarketPlace',
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
}
)
