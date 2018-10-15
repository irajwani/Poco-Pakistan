import { createStackNavigator } from 'react-navigation';
import {Animated, Easing} from 'react-native';
import Collection from '../views/Collection';
import ProductDetails from '../views/ProductDetails';
import CustomChat from '../views/CustomChat';
import Comments from '../views/Comments';
import YourProducts from '../views/YourProducts';

export const wishListToProductDetailsOrChatOrCommentsStack = createStackNavigator({
    Collection: Collection,
    YourProducts: YourProducts,
    ProductDetails: ProductDetails,
    Comments: Comments,
    CustomChat: CustomChat,
},
{
    initialRouteName: 'Collection',
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