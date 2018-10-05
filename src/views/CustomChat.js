import React, {Component} from 'react';
import {Platform} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import {withNavigation} from 'react-navigation';
import firebase from '../cloud/firebase';

import Message from '../components/SlackMessage';

import emojiUtils from 'emoji-utils';

import Chatkit from "@pusher/chatkit";

const CHATKIT_SECRET_KEY = "9b627f79-3aba-48df-af55-838bbb72222d:Pk9vcGeN/h9UQNGVEv609zhjyiPKtmnd0hlBW2T4Hfw="
const CHATKIT_TOKEN_PROVIDER_ENDPOINT = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/7a5d48bb-1cda-4129-88fc-a7339330f5eb/token";
const CHATKIT_INSTANCE_LOCATOR = "v1:us1:7a5d48bb-1cda-4129-88fc-a7339330f5eb";

class CustomChat extends Component {
  static navigationOptions = {
    header: null
  }
    
  state = {
    messages: [],
  }

  componentWillMount() {

    const CHATKIT_USER_NAME = firebase.auth().currentUser.uid;
    const {params} = this.props.navigation.state;
    
    const id = params ? params.id : null;

    // This will create a `tokenProvider` object. This object will be later used to make a Chatkit Manager instance.
    const tokenProvider = new Chatkit.TokenProvider({
      url: CHATKIT_TOKEN_PROVIDER_ENDPOINT
    });

    // This will instantiate a `chatManager` object. This object can be used to subscribe to any number of rooms and users and corresponding messages.
    // For the purpose of this example we will use single room-user pair.
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: CHATKIT_INSTANCE_LOCATOR,
      userId: CHATKIT_USER_NAME,
      tokenProvider: tokenProvider
    });

    // In order to subscribe to the messages this user is receiving in this room, we need to `connect()` the `chatManager` and have a hook on `onNewMessage`. There are several other hooks that you can use for various scenarios. A comprehensive list can be found [here](https://docs.pusher.com/chatkit/reference/javascript#connection-hooks).
    chatManager.connect().then(currentUser => {
      this.currentUser = currentUser;
      this.currentUser.subscribeToRoom({
        //roomId: this.currentUser.rooms[0].id,
        roomId: id,
        hooks: {
          onNewMessage: this.onReceive.bind(this)
        }
      });
    });
  

    // const {params} = this.props.navigation.state
    // const his_uid = params.uid
    
    // this.setState({
    //   messages: [
    //     {
    //       _id: 1,
    //       text: "Hi, If you would like to purchase this product, let me know what place works for you and we'll arrange a meetup",
    //       createdAt: new Date(),
    //       user: {
    //         _id: 1,
    //         name: 'React Native',
    //         avatar: 'https://placeimg.com/140/140/any',
    //       },
    //     },
    //   ],
    // })

  }

  //onReceive function not supposed to be here?
  //Think he's using renderMessage to produce the UI which receives the messages as props
  onReceive(data) {
    console.log(data);
    //...
    const { id, senderId, text, createdAt, sender } = data;
    const {avatarURL, name} = sender;
    const incomingMessage = {
      _id: id,
      text: text,
      createdAt: new Date(createdAt),
      user: {
        _id: senderId,
        name: name,
        avatar: avatarURL,
      }
    };

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, incomingMessage)
    }));
  }
  /////////////////

  onSend([message], id) {
    this.currentUser.sendMessage({
      text: message.text,
      roomId: id,
    });
    
  }

  renderMessage(props) {
    const { currentMessage: { text: currText } } = props;

    let messageTextStyle;

    // Make "pure emoji" messages much bigger than plain text.
    if (currText && emojiUtils.isPureEmojiString(currText)) {
      messageTextStyle = {
        fontSize: 28,
        // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
        lineHeight: Platform.OS === 'android' ? 34 : 30,
      };
    }

    return (
      <Message {...props} messageTextStyle={messageTextStyle} />
    );
  }

  render() {

    const {params} = this.props.navigation.state;
    const id = params ? params.id : null    

    const CHATKIT_USER_NAME = firebase.auth().currentUser.uid;
    
    console.log(this.state.messages);
    
    return (

      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages, id)}
        user={{
          _id: CHATKIT_USER_NAME
        }}
        renderMessage={this.renderMessage}
        showUserAvatar={true}
        showAvatarForEveryMessage={true}
        renderAvatarOnTop={true}
        loadEarlier={true}
        isLoadingEarlier={true}
          
        
      />
    )
  }
}

export default withNavigation(CustomChat);

// this.currentUser keys => ["setReadCursor", "readCursor", "isTypingIn", "createRoom", "getJoinableRooms", 
// "joinRoom", "leaveRoom", "addUserToRoom", "removeUserFromRoom", "sendMessage", "fetchMessages", 
// "subscribeToRoom", "fetchAttachment", "updateRoom", "deleteRoom", "setReadCursorRequest", 
// "uploadDataAttachment", "isMemberOf", "decorateMessage", "establishUserSubscription", 
// "establishPresenceSubscription", "establishCursorSubscription", "initializeUserStore", "disconnect", 
// "hooks", "id", "encodedId", "apiInstance", "filesInstance", "cursorsInstance", "connectionTimeout", 
// "presenceInstance", "logger", "presenceStore", "userStore", "roomStore", "cursorStore", "typingIndicators", 
// "roomSubscriptions", "readCursorBuffer", "userSubscription", "presenceSubscription", "cursorSubscription", 
// "avatarURL", "createdAt", "customData", "name", "updatedAt"]