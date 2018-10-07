import React, { Component } from 'react'
import {  StyleSheet, ScrollView, View, TouchableHighlight } from 'react-native'
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Icon, Left, Body, Right } from 'native-base'
import {Button} from 'react-native-elements';

import {database} from '../cloud/database'
import firebase from '../cloud/firebase';
import { withNavigation } from 'react-navigation';
import Chatkit from '@pusher/chatkit';
import { CHATKIT_TOKEN_PROVIDER_ENDPOINT, CHATKIT_INSTANCE_LOCATOR } from '../credentials/keys';

const noChatsText = "You have not initiated any chats. You may initiate a conversation with a seller by choosing to 'Buy' a product from the marketplace";



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
    //get chats for particular user
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
      //perform the following process across all rooms currentUser is a part of except for the common Users Room
      for(let i = 1; i < this.currentUser.rooms.length; i++) {
          
          var {createdByUserId, name, id} = this.currentUser.rooms[i]
          var product;
          
          d.Products.forEach( (prod) => {
              console.log(prod.key, name);
              //given the current Room Name, we need the product key to match some part of the room name
              //to obtain the product text
              if(name.includes(prod.key)) { product = prod.text; console.log(product); }
          })
          console.log(product);
          var users = this.currentUser.rooms[i].users

          
          
          var obj;
          var chatUpdates = {};
          var buyer = users[0,0].name;
          var seller = users[0,1].name;
          obj = { product: product, createdByUserId: createdByUserId, name: name, id: id, seller: seller, buyer: buyer};
          chats.push(obj);
          chatUpdates['/Users/' + CHATKIT_USER_NAME + '/chats/' + i + '/'] = obj;
          firebase.database().ref().update(chatUpdates);
          

      

      }
      console.log(chats);
      this.setState({chats});
      })


    })
    .then( () => { this.setState( {isGetting: false} );  } )
    .catch( (err) => {console.log(err) })
    
  }

  navToChat(id) {
    this.props.navigation.navigate('CustomChat', {id: id})
  }

  
  render() {
    const {chats} = this.state
    if(this.state.isGetting) {
      return ( 
        <View>
          <Text>Loading...</Text>
        </View>
      )
    }

    if(this.state.noChats) {
      return (
        <View>
          <Text>{noChatsText}</Text>
        </View>
      )
    }
    
    return (
      <ScrollView 
        contentContainerStyle={{
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
             
        {chats.map( (chat) => {
          return(
            <View key={chat.name}>
              
              
              <Card>
                <CardItem bordered>
                  <Body>

                    <Text> {chat.product.name} being sold by {chat.seller} </Text>
                    
                    

                  </Body>
                  
                  
                    
                      
                  
                </CardItem>
                <CardItem footer bordered>
                    <Button
                        small
                        buttonStyle={{
                            backgroundColor: "#5db2dd",
                            width: 100,
                            height: 40,
                            borderColor: "transparent",
                            borderWidth: 0,
                            borderRadius: 5
                        }}
                        icon={{name: 'envelope', type: 'font-awesome'}}
                        title='Message'
                        onPress={() => { this.navToChat(chat.id) } } 
                        />
                  </CardItem>
              </Card>

            </View>
          )
            
          })}

      </ScrollView>
    )
  }
}

export default withNavigation(Chats)

const styles = StyleSheet.create({})


