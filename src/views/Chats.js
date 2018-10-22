import React, { Component } from 'react'
import { Dimensions, StyleSheet, ScrollView, View, Image } from 'react-native'
import {Text} from 'native-base'
import {Button} from 'react-native-elements';

import {database} from '../cloud/database'
import firebase from '../cloud/firebase';
import { withNavigation } from 'react-navigation';
import Chatkit from '@pusher/chatkit';
import { CHATKIT_TOKEN_PROVIDER_ENDPOINT, CHATKIT_INSTANCE_LOCATOR } from '../credentials/keys';
import {material} from 'react-native-typography';
import { PacmanIndicator } from 'react-native-indicators';

import { lightGreen } from '../colors';

const noChatsText = "You have not initiated any chats 😳. Converse with a seller by choosing to 'Buy' a product from the Marketplace";

const {width} = Dimensions.get('window')

function removeFalsyValuesFrom(object) {
  const newObject = {};
  Object.keys(object).forEach((property) => {
    if (object[property]) {newObject[property] = object[property]}
  })
  return Object.keys(newObject);
}

class Chats extends Component {

  constructor(props) {
    super(props);
    this.state = { chats: [], isGetting: true, noChats: false };
  }

  componentWillMount() {
    setTimeout(() => {
      this.getChats();
    }, 1000);
  }

  getChats() {
    //first generate, and then retrieve chats for particular user
    database.then( (d) => {
      var chats = [];
      
      //if a uid has a userId with pusher chat kit account
      var CHATKIT_USER_NAME = firebase.auth().currentUser.uid;
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

      chatManager.connect()
      .then( (currentUser) => {

      this.currentUser = currentUser;
      
      ////////
      ///// leave the rooms for which you've blocked Users
      ///// use the removeFalsyValues function because some uid keys could have falsy values if one decides to unblock user.
      var rawUsersBlocked = d.Users[firebase.auth().currentUser.uid].usersBlocked ? d.Users[firebase.auth().currentUser.uid].usersBlocked : {};
      var usersBlocked = removeFalsyValuesFrom(rawUsersBlocked);
      console.log(usersBlocked);
      ///////

      console.log(currentUser.rooms.length, this.currentUser.rooms.length);

      if(this.currentUser.rooms.length>1) {
        //if any room name has a blockedUser name in it, leave that room
        for(let i = 1; i < this.currentUser.rooms.length; i++) { 
          
          var {users, id} = this.currentUser.rooms[i];
          var buyer = users[0,1].id;
          var seller = users[0,0].id;
          console.log(buyer);
          if(usersBlocked.includes(buyer) || usersBlocked.includes(seller)) {
            this.currentUser.leaveRoom({
              roomId: id
            })
            .then( () => console.log(`user successfully removed from room with ID: ${id}`))
            .catch( (err) => console.log(err))
          }
        }

      }

      console.log(currentUser.rooms.length, this.currentUser.rooms.length);

      if(this.currentUser.rooms.length>1) {

        //perform the following process across all rooms currentUser is a part of except for the common Users Room
        for(let i = 1; i < this.currentUser.rooms.length; i++) {
            
          var {createdByUserId, name, id} = this.currentUser.rooms[i]
          var productText, productImageURL;
          
          d.Products.forEach( (prod) => {
              //given the current Room Name, we need the product key to match some part of the room name
              //to obtain the correct product's properties
              if(name.includes(prod.key)) { productText = prod.text; productImageURL = prod.uris[0]; }
          })
          var users = this.currentUser.rooms[i].users
          console.log(users);
          
          
          var obj;
          var chatUpdates = {};
          var buyer = users[0,1].name;
          var buyerAvatar = users[0,1].avatarURL ? users[0,1].avatarURL : '';
          var seller = users[0,0].name;
          var sellerAvatar = users[0,0].avatarURL ? users[0,0].avatarURL : '';
          obj = { 
            productText: productText, productImageURL: productImageURL, 
            createdByUserId: createdByUserId, name: name, id: id, 
            seller: seller, sellerAvatar: sellerAvatar, 
            buyer: buyer, buyerAvatar: buyerAvatar
          };
          chats.push(obj);
          chatUpdates['/Users/' + CHATKIT_USER_NAME + '/chats/' + i + '/'] = obj;
          firebase.database().ref().update(chatUpdates);
          

      

      }
      console.log(chats);
      this.setState({chats});
      }

      else {
        console.log('NO CHATS');
        this.setState({noChats: true})
      }
      
      })


    })
    .then( () => { this.setState( {isGetting: false} );  } )
    .catch( (err) => {console.log(err) })
    
  }

  navToChat(id) {
    this.props.navigation.navigate('CustomChat', {id: id})
  }

  navToNotifications() {
    this.props.navigation.navigate('Notifications')
  }

  
  render() {
    const {chats} = this.state
    if(this.state.isGetting) {
      return ( 
        <View style={{flex: 1}}>
          <PacmanIndicator color='#189fe2' />
        </View>
      )
    }

    if(this.state.noChats) {
      return (
        <View style={styles.container}>
          <View style={styles.upperNavTab}>
            <Button 
              buttonStyle={styles.chatsbutton}
              textStyle={{fontSize: 18, color: 'black'}}
              title="Chats"
              
            />
            <Button 
              buttonStyle={styles.notifsbutton}
              textStyle={{fontSize: 18, color: 'black'}}
              title="Notifications"
              onPress={()=>this.navToNotifications()}
            />
          </View>
          <View style={{flex: 1, alignItems: 'center', padding: 10, justifyContent: 'space-between'}}>
            <Text style={{fontFamily: 'Iowan Old Style', fontSize: 30, color: 'blue'}}>{noChatsText}</Text> 
          </View>
        </View>
      )
    }
    
    return (
      <View style={styles.container}>
        <View style={styles.upperNavTab}>
          <Button 
            buttonStyle={styles.chatsbutton}
            textStyle={{fontSize: 18, color: 'black'}}
            title="Chats"
            
          />
          <Button 
            buttonStyle={styles.notifsbutton}
            textStyle={{fontSize: 18, color: 'black'}}
            title="Notifications"
            onPress={()=>this.navToNotifications()}
          />
        </View>
        <ScrollView 
          contentContainerStyle={{
            paddingTop: 0,
            flexDirection: 'column',
            flexGrow: 1,
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
              
          {chats.map( (chat) => {
            return(
              <View key={chat.name} style={{flexDirection: 'column', padding: 5}}>
                <View style={styles.separator}/>
                <View style={styles.rowContainer}>
                  
                  <Image source={ {uri: chat.productImageURL }} style={[styles.productprofilepic, styles.productcolor]} />
                  
                  <View style={styles.infoandbuttoncontainer}>
                    <Text style={[styles.info, styles.productinfo]}>Chat Between:</Text>
                    <Text style={[styles.info, styles.sellerinfo]}>{(chat.seller.split(' '))[0]} & {(chat.buyer.split(' '))[0]}</Text>
                    <View style={styles.membersRow}>
                      {chat.sellerAvatar ?
                        <Image source={ {uri: chat.sellerAvatar } } style={[styles.profilepic, styles.profilecolor]} />
                        :
                        <Image source={ require('../images/blank.jpg') } style={[styles.profilepic, styles.profilecolor]} />
                      }
                      {chat.buyerAvatar ?
                        <Image source={ {uri: chat.buyerAvatar } } style={[styles.profilepic, styles.profilecolor]} />
                        :
                        <Image source={ require('../images/blank.jpg') } style={[styles.profilepic, styles.profilecolor]} />
                      }
                    </View>   
                  </View>

                  <Button
                        small
                        buttonStyle={styles.messagebutton}
                        icon={{name: 'forum', type: 'material-community'}}
                        title="TALK"
                        onPress={() => { this.navToChat(chat.id) } } 
                  />  
                    

                </View>
                <View style={styles.separator}/>
              </View>
              
            )
              
            })}
            
        </ScrollView>
      </View>
    )
  }
}

export default withNavigation(Chats)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginTop: 22,
    backgroundColor: lightGreen
  },
  upperNavTab: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: lightGreen,
  },
  chatsbutton: {
    backgroundColor: lightGreen,
    width: width/2 - 30,
    height: 50,
    borderWidth: 0,
    borderRadius: 0,
    borderColor: "#0c5911"
  },
  notifsbutton: {
    backgroundColor: "#fff",
    width: width/2 - 30,
    height: 50,
    borderWidth: 1,
    borderRadius: 0,
    borderColor: "#0c5911"
  },
  rowContainer: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  membersRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  productprofilepic: {
    borderWidth:1,
    alignItems:'center',
    justifyContent:'center',
    width:95,
    height:95,
    backgroundColor:'#fff',
    borderRadius: 48,
    borderWidth: 2
  },
  profilepic: {
    borderWidth:1,
    alignItems:'center',
    justifyContent:'center',
    width:35,
    height:35,
    backgroundColor:'#fff',
    borderRadius: 18,
    borderWidth: 0.4

},
  profilecolor: {
    borderColor: '#187fe0'
  },
  productcolor: {
    borderColor: '#86bb71'
  },
infoandbuttoncontainer: {
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'space-around',
  padding: 10,
  //paddingTop: 5,
  //paddingBottom: 5,
},
info: {
  ...material.subheading,
},  
productinfo: {
  color: "black",
  fontSize: 11,
  fontFamily: 'Iowan Old Style',
},
sellerinfo: {
  fontSize: 13,
  color: "#185b10",
  fontFamily: 'Times New Roman'
},
messagebutton: {
  backgroundColor: "#185b10",
  width: 75,
  height: 45,
  borderWidth: 2,
  borderRadius: 5,
  borderColor: "#185b10"
},
separator: {
  backgroundColor: 'black',
  width: width,
  height: 4
},  
})


{/* <View style={styles.infoandbuttoncontainer}>
                    <Text style={[styles.info, styles.productinfo]}>{chat.productText.name}</Text>
                    <Text style={[styles.info, styles.sellerinfo]}>From: {(chat.seller.split(' '))[0]}</Text>
                    <Button
                      small
                      buttonStyle={styles.messagebutton}
                      icon={{name: 'email', type: 'material-community'}}
                      title="TALK"
                      onPress={() => { this.navToChat(chat.id) } } 
                    />
                  </View>

                {chat.sellerAvatar ?
                  <Image source={ {uri: chat.sellerAvatar } } style={[styles.profilepic, styles.profilecolor]} />
                  :
                  <Image source={ require('../images/blank.jpg') } style={[styles.profilepic, styles.profilecolor]} />
                }   */}

