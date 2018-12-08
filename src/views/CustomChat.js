import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, TouchableHighlight } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import {withNavigation} from 'react-navigation';
import firebase from '../cloud/firebase';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

// import emojiUtils from 'emoji-utils';

import Chatkit from "@pusher/chatkit";
import { CHATKIT_SECRET_KEY, CHATKIT_INSTANCE_LOCATOR, CHATKIT_TOKEN_PROVIDER_ENDPOINT } from '../credentials/keys';
import { treeGreen } from '../colors';



//#86bb71
//#94c2ed
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
      url: CHATKIT_TOKEN_PROVIDER_ENDPOINT,
      query: {
        user_id: CHATKIT_USER_NAME
      }
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
      // this.currentUser.setReadCursor({
      //   roomId: id,
      //   position: ,
      // })
      // const cursor = this.currentUser.readCursor({
      //   roomId: id
      // })
      // console.log(cursor); 
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

  // componentWillUnmount() {
  //   const {params} = this.props.navigation.state;
  //   const id = params ? params.id : null;
  //   // this.currentUser.setReadCursor({
  //   //     roomId: id,
  //   //     position: this.state.newestReadMessageId,
  //   // })
  //   // .then(() => {
  //   //   console.log('Success!')
  //   // })
  //   // .catch(err => {
  //   //   console.log(`Error setting cursor: ${err}`)
  //   // })
  // }

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
      messages: GiftedChat.append(previousState.messages, incomingMessage),
    }));
  }
  /////////////////

  onSend([message], id) {
    this.currentUser.sendMessage({
      text: message.text,
      roomId: id,
    });
    
  }

  navToOtherUserProfilePage = (uid) => {
    this.props.navigation.navigate('OtherUserProfilePage', {uid: uid})
  }

  render() {

    const {params} = this.props.navigation.state;
    const id = params ? params.id : null 
    const buyer = params.buyer ? params.buyer : false
    const seller = params.seller ? params.seller : false
    const buyerAvatar = params.buyerAvatar ? params.buyerAvatar : false
    const sellerAvatar = params.sellerAvatar ? params.sellerAvatar : false
    const sellerIdentification = params.sellerIdentification ? params.sellerIdentification : false;
    const buyerIdentification = params.buyerIdentification ? params.buyerIdentification : false;

    const CHATKIT_USER_NAME = firebase.auth().currentUser.uid;

    //determine who it is you're chatting with to display their info in topRow
    var chattingWithPersonIdentification = params.buyerIdentification && params.sellerIdentification ? sellerIdentification == CHATKIT_USER_NAME ? buyerIdentification : sellerIdentification : false
    var chattingWithPersonNamed = buyer && seller ? sellerIdentification == CHATKIT_USER_NAME ? buyer : seller : false
    var chattingWithPersonThatLooksLike = buyer && seller ? sellerIdentification == CHATKIT_USER_NAME ? buyerAvatar : sellerAvatar : false

    console.log(this.state.messages);
    
    return (
      <View style={styles.mainContainer}>

        <View style={[styles.topRow, {backgroundColor: '#fff'}]}>

          <View style={styles.backIconContainer}>
            <FontAwesomeIcon
              name='chevron-circle-left'
              size={45}
              color={'#76ce1e'}
              onPress = { () => { 
                this.props.navigation.goBack();
                  } }

            />
          </View>

          {chattingWithPersonNamed ? 
          <View style={styles.chatInfoContainer}>
            <Text style={styles.chatInfoText}>{(chattingWithPersonNamed.split(' '))[0]}</Text>
          </View>
          :
          null
          }

          {
            chattingWithPersonThatLooksLike ?
            <TouchableHighlight 
            onPress={()=>this.navToOtherUserProfilePage(chattingWithPersonIdentification)}
            style={styles.profilePic} underlayColor={'#fff'} >
              <Image source={ {uri: chattingWithPersonThatLooksLike }} style={styles.profilePic} />
            </TouchableHighlight>
            :
            null
          }



        </View>

        <View style={{backgroundColor: 'black', height: 1.5}}/>
        
        <View style={{flex: 1}}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages, id)}
          user={{
            _id: CHATKIT_USER_NAME
          }}
          //renderMessage={this.renderMessage}
          //renderBubble={this.renderBubble}
          showUserAvatar={true}
          showAvatarForEveryMessage={false}
          renderAvatarOnTop={true}
          loadEarlier={false}
            
          
        />
        </View>

      </View>
    )
  }
}

export default withNavigation(CustomChat);

const styles = StyleSheet.create({
  mainContainer: {flex: 1, marginTop: 22},

  topRow: { flex: 0.2, flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', justifyContent: 'space-evenly' },
  
  backIconContainer: {
    flex: 0.3,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  chatInfoContainer: {
    flex: 0.5,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  chatInfoText: {
    fontFamily: 'Avenir Next',
    fontSize: 19,
    textAlign: 'left',
    fontWeight: 'bold',
  },

  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25
},

})

{/* <Text style={styles.chatInfoText}>{(seller.split(' '))[0]} & {(buyer.split(' '))[0]}</Text> */}

// this.currentUser keys => ["setReadCursor", "readCursor", "isTypingIn", "createRoom", "getJoinableRooms", 
// "joinRoom", "leaveRoom", "addUserToRoom", "removeUserFromRoom", "sendMessage", "fetchMessages", 
// "subscribeToRoom", "fetchAttachment", "updateRoom", "deleteRoom", "setReadCursorRequest", 
// "uploadDataAttachment", "isMemberOf", "decorateMessage", "establishUserSubscription", 
// "establishPresenceSubscription", "establishCursorSubscription", "initializeUserStore", "disconnect", 
// "hooks", "id", "encodedId", "apiInstance", "filesInstance", "cursorsInstance", "connectionTimeout", 
// "presenceInstance", "logger", "presenceStore", "userStore", "roomStore", "cursorStore", "typingIndicators", 
// "roomSubscriptions", "readCursorBuffer", "userSubscription", "presenceSubscription", "cursorSubscription", 
// "avatarURL", "createdAt", "customData", "name", "updatedAt"]