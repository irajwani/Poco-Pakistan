import { createStackNavigator } from 'react-navigation';
import Chats from '../views/Chats';
import CustomChat from '../views/CustomChat';

export const chatsToCustomChatStack = createStackNavigator({
    Chats: Chats,
    CustomChat: CustomChat,

},{
    initialRouteName: 'Chats'
})
