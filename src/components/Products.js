import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Dimensions, View, Image, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, TouchableHighlight } from 'react-native';
import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Left, Body } from 'native-base';
import {Button, Divider} from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { material, systemWeights, human, iOSUIKit, iOSColors } from 'react-native-typography'
import firebase from '../cloud/firebase.js';
import {database, p} from '../cloud/database';
import {storage} from '../cloud/storage';
import * as Animatable from 'react-native-animatable';
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';

import Chatkit from "@pusher/chatkit";

const CHATKIT_SECRET_KEY = "9b627f79-3aba-48df-af55-838bbb72222d:Pk9vcGeN/h9UQNGVEv609zhjyiPKtmnd0hlBW2T4Hfw="
const CHATKIT_TOKEN_PROVIDER_ENDPOINT = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/7a5d48bb-1cda-4129-88fc-a7339330f5eb/token";
const CHATKIT_INSTANCE_LOCATOR = "v1:us1:7a5d48bb-1cda-4129-88fc-a7339330f5eb";


var {height, width} = Dimensions.get('window');


class Products extends Component {
  constructor(props) {
      super(props);
      this.state = {
        emptyCollection: false,
        refreshing: false,
        isGetting: true,
        activeSectionL: false,
        activeSectionR: false,
        collapsed: true,
      };
      //this.navToChat = this.navToChat.bind(this);
  }

  componentWillMount() {
    setTimeout(() => {
      this.getPageSpecificProducts();
    }, 4);
  }


  getPageSpecificProducts = () => {
    
    const keys = [];
    database.then( (d) => {
      //Only pull the products that are in this user's collection
        const {showAllProducts, showCollection, showYourProducts} = this.props;

        var productKeys = d.Users[firebase.auth().currentUser.uid].products ? Object.keys(d.Users[firebase.auth().currentUser.uid].products) : [];
        var collectionKeys = d.Users[firebase.auth().currentUser.uid].collection ? Object.keys(d.Users[firebase.auth().currentUser.uid].collection) : [] ;  
        var all = d.Products;

        if(showAllProducts) {
            all = all.sort( (a,b) => { return a.text.likes - b.text.likes } ).reverse();
            var name = d.Users[firebase.auth().currentUser.uid].profile.name;
            var productsl = all.slice(0, (all.length % 2 == 0) ? all.length/2  : Math.floor(all.length/2) + 1 )
            var productsr = all.slice( Math.round(all.length/2) , all.length + 1);
            this.setState({ productsl, productsr, name, collectionKeys });
        }

        if(showCollection) {
            all = all.filter((product) => collectionKeys.includes(product.key) );
            all = all.sort( (a,b) => { return a.text.likes - b.text.likes } ).reverse();
            var name = d.Users[firebase.auth().currentUser.uid].profile.name;
            var productsl = all.slice(0, (all.length % 2 == 0) ? all.length/2  : Math.floor(all.length/2) + 1 )
            var productsr = all.slice( Math.round(all.length/2) , all.length + 1);
            //get goods already in user's collection
            var productsInCollection = d.Users[firebase.auth().currentUser.uid].collection ? Object.keys(d.Users[firebase.auth().currentUser.uid].collection) : [];
            this.setState({ productsl, productsr, name, collectionKeys, productsInCollection });
        }

        if(showYourProducts) {
            all = all.filter((product) => productKeys.includes(product.key) );
            all = all.sort( (a,b) => { return a.text.likes - b.text.likes } ).reverse();
            var name = d.Users[firebase.auth().currentUser.uid].profile.name;
            var productsl = all.slice(0, (all.length % 2 == 0) ? all.length/2  : Math.floor(all.length/2) + 1 )
            var productsr = all.slice( Math.round(all.length/2) , all.length + 1);
            this.setState({ productsl, productsr, name, collectionKeys });
        }

    })
    .then( () => { this.setState( {isGetting: false} );  } )
    .catch( (err) => {console.log(err) })
    
  }

  incrementLikes(likes, uid, key) {
    //add like to product, and add this product to user's collection; if already in collection, modal shows user
    //theyve already liked the product
      //add to current users WishList
      var userCollectionUpdates = {};
      userCollectionUpdates['/Users/' + firebase.auth().currentUser.uid + '/collection/' + key + '/'] = true;
      firebase.database().ref().update(userCollectionUpdates);
      //add a like to the sellers likes count for this particular product
      //unless users already liked this product, in which case, dont do anything
      if(this.state.collectionKeys.includes(key)) {
        console.log('show modal that users already liked this product')
      } 
      else {
        var updates = {};
        likes += 1;
        var postData = likes;
        updates['/Users/' + uid + '/products/' + key + '/likes/'] = postData;
        firebase.database().ref().update(updates);
      }
      
       
      

    
    
  }

  navToComments(uid, productKey, text, name, uri) {
    console.log('navigating to Comments section')
    this.props.navigation.navigate('Comments', {likes: text.likes, uid: uid, productKey: productKey, uri: uri, text: text, time: text.time, name: name})
  }

  navToProductDetails(data) {
      this.props.navigation.navigate('ProductDetails', {data: data})
  }

  findRoom(rooms, desiredRoomsName) {
    for(var room of rooms ) {
      
      if(room.name === desiredRoomsName) {return room.id}
    }
  }

  navToChat(uid, key) {

    //if you posted this product yourself, then buying it is trivial,
    //and you should see a modal saying 'you own this product already'

    console.log(key);
    //create separate Chats branch
    const CHATKIT_USER_NAME = firebase.auth().currentUser.uid;
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
  
    chatManager.connect().then(currentUser => {
      
      this.currentUser = currentUser;
      console.log(this.currentUser.rooms);
      var desiredRoomsName = key + '.' + CHATKIT_USER_NAME
      var roomExists = this.currentUser.rooms.filter(room => (room.name == desiredRoomsName));
      //create a new room for specifically for this buyer, seller and product & navigate to the chat room
      //unless the room already exists, in which case, just navigate to it

      if(this.currentUser.rooms.length > 0 && roomExists.length > 0) {
        console.log('no need to create a brand new room');
        this.props.navigation.navigate( 'CustomChat', {id: this.findRoom(this.currentUser.rooms, desiredRoomsName)} )

      }
      else {
        this.currentUser.createRoom({
          //base the room name on the following pattern: sellers uid + dot + product key + dot + buyers uid
          name: desiredRoomsName,
          private: false,
          addUserIds: [uid]
        }).then(room => {
          console.log(`Created room called ${room.name}`)
          this.props.navigation.navigate( 'CustomChat', {id: this.findRoom(this.currentUser.rooms, desiredRoomsName)} )
        })
        .catch(err => {
          console.log(`Error creating room ${err}`)
        })
      }

        
      
      

      
      

      // if(this.currentUser.rooms.length > 0 && roomExists.length > 0 ) {
      //   //first check if you've already subscribed to this room
      //   for(var room of this.currentUser.rooms) {
      //     var {name} = room;
      //     console.log(name);
      //     if(name === key) { 
      //       console.log('navigating to room')
            
      //       this.props.navigation.navigate( 'CustomChat', {key: key, id: this.findRoom(this.currentUser.rooms, key)} )
      //                     }
  
      //   }
  
      //   //subscribe to room and navigate to it
        
      // } else {
      //   //subscribe to at least the room for this product
      //   console.log('subscribe to your very first product chat room')
      //   this.currentUser.getJoinableRooms().then( (rooms) => {  
          
      //     this.currentUser.joinRoom( {
      //       roomId: this.findRoom(rooms, key)
      //     })
      //     setTimeout(() => {
      //       this.props.navigation.navigate( 'CustomChat', {key: key, id: this.findRoom(rooms, key)} )
      //     }, 1000);
      //     //this.setState({id: this.findRoom(rooms, key) });  
  
      //   }  )
        
        
        
  
      // }
      
      
    });
  }


  //switch between collapsed and expanded states
  toggleExpanded = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  setSectionL = section => {
    this.setState({ activeSectionL: section });
  };

  setSectionR = section => {
    this.setState({ activeSectionR: section });
  };

  renderHeader = (section, _, isActive) => {
    return (
      <Animatable.View
        duration={400}
        style={[styles.card, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor"
      >

        <View style={{ flex: 1, position: 'relative' }}>
            <View style={styles.likesRow}>

              {this.state.collectionKeys.includes(section.key) ? <Icon name="heart" 
                        size={25} 
                        color='#800000'
                        onPress={() => {this.incrementLikes(section.text.likes, section.uid, section.key)}}

              /> : <Icon name="heart-outline" 
                        size={25} 
                        color={iOSColors.white}
                        onPress={() => {this.incrementLikes(section.text.likes, section.uid, section.key)}}

              />}

              <Text style={styles.likes}>{section.text.likes}</Text>
            </View>  
            <Image 
            source={{uri: section.uris[0]}}
            style={{ height: 190, width: (width/2 - 18), zIndex: -1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, resizeMode: 'cover' }} 
            />
        </View>        

                

      </Animatable.View>
    );
  };

  renderContent = (section, _, isActive) => {
    return (
      <Animatable.View
        duration={400}
        style={[styles.card, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor"
      >
          
        <View style= { styles.priceMagnifyingGlassRow } >
            <Animatable.Text style={styles.price} animation={isActive ? 'bounceInRight' : undefined}>
            ${section.text.price}
            </Animatable.Text>
            <Icon name="magnify" 
                  size={22} 
                  color='#082b8c'
                  onPress={ () => { 
                      console.log('navigating to full details');
                      this.navToProductDetails(section); 
                      }}  
            />
        </View>
            
        

        <Animatable.Text style={styles.brand} animation={isActive ? 'lightSpeedIn' : undefined}>
          {section.text.brand}
        </Animatable.Text>
        
        <Animatable.Text style={styles.size} animation={isActive ? 'slideInLeft' : undefined}>
          {section.text.size}
        </Animatable.Text>
        
        <View style={ styles.buyReviewRow }  >
            <Button
                    buttonStyle={{
                        backgroundColor: "#186f87",
                        width: 80,
                        height: 40,
                        
                    }}
                    icon={{name: 'credit-card', type: 'font-awesome'}}
                    title='BUY'
                    onPress = { () => { 
                        console.log('going to chat');
                        //subscribe to room key
                        this.navToChat(section.uid, section.key);
                        } }

                    />
            <Icon
                name="lead-pencil" 
                size={20}  
                color={'#0e4406'}
                onPress = { () => { 
                            this.navToComments(section.uid, section.key, section.text, this.state.name, section.uris[0]);
                            } }
            />
        </View>

        {/* <Button
                  
                  buttonStyle={{
                      backgroundColor: "#156a87",
                      width: 100,
                      height: 40,
                      borderColor: "transparent",
                      borderWidth: 0,
                      borderRadius: 5
                  }}
                  icon={{name: 'pencil', type: 'font-awesome'}}
                  title='WRITE A REVIEW'
                  onPress = { () => { 
                    this.navToComments(section.uid, section.key, section.text, this.state.name);
                    } }

                  />            */}

        
        
      </Animatable.View>
    );
  }

  // componentWillMount() {
  //   var products = this.getProducts();
  //   return products;
  // }
  


  render() {

    var {isGetting, emptyCollection} = this.state;

    if(isGetting) {
      return ( 
        <View>
          <Text>Loading...</Text>
        </View>
      )
    }

    if(emptyCollection) {
        return (
            <View>
                <Text>You haven't liked any items on the marketplace yet.</Text>
            </View>
        )
    }
    
    return (

      
      <ScrollView
             contentContainerStyle={styles.contentContainerStyle}
      >
        
        <Accordion
          activeSection={this.state.activeSectionL}
          sections={this.state.productsl}
          touchableComponent={TouchableOpacity}
          renderHeader={this.renderHeader}
          renderContent={this.renderContent}
          duration={400}
          onChange={this.setSectionL}
        />

        <Accordion
          activeSection={this.state.activeSectionR}
          sections={this.state.productsr}
          touchableComponent={TouchableOpacity}
          renderHeader={this.renderHeader}
          renderContent={this.renderContent}
          duration={400}
          onChange={this.setSectionR}
        />

      </ScrollView> 
            
    )
  
  }
}

Products.PropTypes = {
    showAllProducts: PropTypes.bool,
    showCollection: PropTypes.bool,
    showAllProducts: PropTypes.bool,
}

Products.defaultProps = {
    showAllProducts: true,
    showCollection: false,
    showAllProducts: false,
}

export default withNavigation(Products);

const styles = StyleSheet.create({

  contentContainerStyle: {
    flexGrow: 4,   
    flexDirection: 'row',
    flexWrap: 'wrap'
      },

  priceMagnifyingGlassRow: {
    flexDirection: 'row', justifyContent: 'space-between', padding: 10 
  },    

  likesRow: {
    flexDirection: 'row',
    backgroundColor: iOSColors.lightGray2,
    marginLeft: 95,
  },
  
  buyReviewRow: {
    flexDirection: 'row', justifyContent: 'space-between', padding: 5, marginRight: 30
  },

  boldText: {fontFamily: 'verdana', fontSize: 9, fontWeight: 'bold', color: 'blue'},    

  likes: {
    ...iOSUIKit.largeTitleEmphasized,
    color: '#c61919',
    padding: 2,
    marginLeft: 4,
  },
  
  mainContainer:{
    marginTop:15,
    marginLeft:20,
    marginRight:20
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 20,
  },
  header: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    width: (width / 2) - 10,
    height: 200,
    marginLeft: 2,
    marginRight: 2,
    marginTop: 2,
    padding: 5,
    justifyContent: 'space-between'
  } ,
  //controls the color of the collapsible card when activated
  active: {
    backgroundColor: '#96764c',
    //#f4d29a
    //#b78b3e
    //#7c5d34
    //#c99f68
  },
  inactive: {
    backgroundColor: '#fff',
  },
  selectors: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selector: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  activeSelector: {
    fontWeight: 'bold',
  },
  selectTitle: {
    fontSize: 14,
    fontWeight: '500',
    padding: 10,
  },

  price: {
    ...material.display3,
    fontSize: 35,
    fontWeight: 'bold',
    color: 'black'
  },

  brand: {
      ...material.display1,
      fontFamily: 'AmericanTypewriter-Condensed',
      fontSize: 25,
      fontStyle: 'normal',
      color: iOSColors.lightGray
  },

  size: {
      ...material.display2,
      fontStyle: 'normal',
      fontSize: 20,
      color: iOSColors.midGray
  },
});


{/* <Image
            
            style={{width: 150, height: 150}}
            source={ {uri: product.uri} }/> */}

            // refreshControl = {
            //   <RefreshControl 
            //     refreshing={this.state.refreshing} 
            //     onRefresh={() => {this.getProducts();}}

            //     />}
            // <Button
            
            // buttonStyle={{
            //     backgroundColor: "#000",
            //     width: 100,
            //     height: 40,
            //     borderColor: "transparent",
            //     borderWidth: 0,
            //     borderRadius: 5
            // }}
            // icon={{name: 'credit-card', type: 'font-awesome'}}
            // title='BUY'
            // onPress = { () => { navigate('CustomChat', {key: '-LLEL8jZIaK_AmjuXhUb'}) } }
            // />