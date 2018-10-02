import { createStackNavigator } from 'react-navigation';
import MarketPlace from '../views/MarketPlace';
import ProductDetails from '../views/ProductDetails';
import CustomChat from '../views/CustomChat';
import Comments from '../views/Comments';
import YourProducts from '../views/YourProducts';

export const marketToProductDetailsOrChatOrCommentsStack = createStackNavigator({
    MarketPlace: MarketPlace,
    YourProducts: YourProducts,
    ProductDetails: ProductDetails,
    Comments: Comments,
    CustomChat: CustomChat,
},
{
    initialRouteName: 'MarketPlace',
}
)
