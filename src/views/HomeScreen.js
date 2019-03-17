import React, {Component} from 'react';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { withNavigation, TabNavigator, TabBarBottom } from 'react-navigation'; // Version can be specified in package.json

import { profileToEditProfileStack } from '../stackNavigators/profileToEditProfileStack';
import { marketToProductDetailsOrChatOrCommentsStack } from '../stackNavigators/marketToProductDetailsOrChatOrCommentsStack';
import { multipleAddButtonToMultiplePictureCameraToCreateItemStack } from '../stackNavigators/createItemToPictureCameraStack';
import { wishListToProductDetailsOrChatOrCommentsStack } from '../stackNavigators/wishListToProductDetailsOrChatOrCommentsStack';
import { ChatsToCustomChatStack } from '../stackNavigators/chatsToCustomChatStack';
import { highlightGreen } from '../colors';
import { BadgeIcon } from '../localFunctions/visualFunctions';

const HomeScreen = TabNavigator(
            {

              
              Profile: profileToEditProfileStack,
              
              Market: marketToProductDetailsOrChatOrCommentsStack,
              
              Sell: multipleAddButtonToMultiplePictureCameraToCreateItemStack,
              
              Chats: ChatsToCustomChatStack,
              
              WishList: wishListToProductDetailsOrChatOrCommentsStack,
              
            },
            {
              navigationOptions: ({ navigation }) => ({
                
                tabBarIcon: ({ focused, tintColor }) => {
                  const { routeName } = navigation.state;
                  let unreadCount = navigation.getParam('unreadCount', false);
                  let iconName;
                  let iconSize = 25;
                  if (routeName === 'Profile') {
                    iconName = 'account-circle';
                  } else if (routeName === 'Market') {
                    iconName = 'shopping';
                  } else if (routeName === 'Sell') {
                      iconName = 'plus-circle-outline';
                      // iconSize = 30;
                    }

                    else if (routeName === 'Chats') {
                      iconName = 'forum';
                      // IconComponent = BadgeIcon;
                      return <BadgeIcon name={iconName} size={iconSize} color={tintColor} unreadCount={unreadCount} />;
                    }

                    else if (routeName === 'WishList') {
                      iconName = 'basket';
                    }
          
                  // You can return any component that you like here! We usually use an
                  // icon component from react-native-vector-icons
                  return <BadgeIcon name={iconName} size={iconSize} color={tintColor} unreadCount={unreadCount} />;
                  // return 
                },
              }),
              tabBarComponent: TabBarBottom,
              tabBarPosition: 'bottom',
              tabBarOptions: {
                activeTintColor: highlightGreen,
                inactiveTintColor: 'black',
              },
              animationEnabled: false,
              swipeEnabled: false,
            }
          ); 
        
    
export default HomeScreen;