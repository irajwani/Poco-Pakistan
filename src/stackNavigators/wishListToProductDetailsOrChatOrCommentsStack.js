import { createStackNavigator } from 'react-navigation';
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
}
)
