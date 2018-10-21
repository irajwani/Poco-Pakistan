import React, { Component } from 'react';
import {ScrollView, View, Text, Image, TouchableOpacity, Dimensions, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';

import { withNavigation } from 'react-navigation';
import firebase from '../cloud/firebase';

import CustomCarousel from '../components/CustomCarousel';
import CustomComments from '../components/CustomComments';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import styles from '../styles.js'
import { database } from '../cloud/database';
import { Divider } from 'react-native-elements';

import { material, iOSColors, iOSUIKit } from 'react-native-typography';
import { PacmanIndicator } from 'react-native-indicators';

import Chatkit from "@pusher/chatkit";
import { CHATKIT_INSTANCE_LOCATOR, CHATKIT_TOKEN_PROVIDER_ENDPOINT, CHATKIT_SECRET_KEY } from '../credentials/keys.js';


var {height, width} = Dimensions.get('window');

const limeGreen = '#2e770f';
const profoundPink = '#c64f5f';

class ProductDetails extends Component {

  constructor(props){
    super(props);
    this.state = {
      isGetting: true,
      profile: {
        name: '',
        email: '',
      },
      collectionKeys: [3],
    }
  }

  componentWillMount() {
    const {params} = this.props.navigation.state;

    setTimeout(() => {
      this.getProfile(params.data);
    }, 4);
  }

  removeFalsyValuesFrom(object) {
    const newObject = {};
    Object.keys(object).forEach((property) => {
      if (object[property]) {newObject[property] = object[property]}
    })
    return Object.values(newObject);
  }

  getProfile(data) {
    database.then( (d) => {
      const uid = firebase.auth().currentUser.uid;

      //get profile info of seller of product
      const profile = d.Users[data.uid].profile;

      //get keys of user's products
      var productKeys = d.Users[uid].products ? Object.keys(d.Users[uid].products) : [];

      //get collection keys of current user
      var collection = d.Users[uid].collection ? d.Users[uid].collection : null;
      var rawCollectionKeys = collection ? Object.keys(collection) : []
      var collectionKeys = rawCollectionKeys ? this.removeFalsyValuesFrom(rawCollectionKeys) : ['nothing'] ;  

      var soldProducts = 0;

      //get profile data of seller of product
      for(var p of Object.values(d.Users[data.uid].products)) {
        if(p.sold) {
          soldProducts++
        }
      }
      
      var numberProducts = Object.keys(d.Users[data.uid].products).length

      var comments = d.Users[uid].comments ? d.Users[uid].comments : {a: {text: 'No Reviews have been left for this seller.', name: 'NottMyStyle Team', time: Date.now() } };

      this.setState( {profile, numberProducts, soldProducts, comments, productKeys, collectionKeys} )
    })
    .then( () => {
      this.setState({isGetting: false})
    })
  }

  setSaleTo(soldStatus, uid, productKey) {
    var updates={};
    updates['Users/' + uid + '/products/' + productKey + '/sold/'] = soldStatus;
    firebase.database().ref().update(updates);
    //just alert user this product has been marked as sold, and will show as such on their next visit to the app.
    var status = soldStatus ? 'sold' : 'available for purchase'
    alert(`Product has been marked as ${status}.\n If you wish to see the effects of this change immediately,\n please close and re-open NottMyStyle`)

  }

  navToComments(uid, productKey, text, name, uri) {
    console.log('navigating to Comments section')
    this.props.navigation.navigate('Comments', {likes: text.likes, uid: uid, productKey: productKey, uri: uri, text: text, time: text.time, name: name})
  }

  findRoomId(rooms, desiredRoomsName) {
    for(var room of rooms ) {
      
      if(room.name === desiredRoomsName) {return room.id}
    }
  }

  navToEditItem(item) {
    this.props.navigation.navigate('EditItem', {data: item,});
    alert('Please take brand new pictures');
  }

  navToChat(uid, key) {

    //if you posted this product yourself, then buying it is trivial,
    //and you should see a modal saying 'you own this product already'
    this.setState({navToChatLoading: true});
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
      this.currentUser.joinRoom({
        roomId: 15868783 //Users
      })
      .then(() => {
        console.log('Added user to room')
      })
      .catch(err => {
        console.log(`Couldn't join room because: ${err}`)
      })
      console.log(this.currentUser.rooms);
      var desiredRoomsName = key + '.' + CHATKIT_USER_NAME
      var roomExists = this.currentUser.rooms.filter(room => (room.name == desiredRoomsName));
      //create a new room for specifically for this buyer, seller and product & navigate to the chat room
      //unless the room already exists, in which case, just navigate to it

      if(this.currentUser.rooms.length > 0 && roomExists.length > 0) {
        console.log('no need to create a brand new room');
        this.setState({navToChatLoading: false});
        this.props.navigation.navigate( 'CustomChat', {id: this.findRoomId(this.currentUser.rooms, desiredRoomsName)} )

      }
      else {
        this.currentUser.createRoom({
          //base the room name on the following pattern: sellers uid + dot + product key + dot + buyers uid
          name: desiredRoomsName,
          private: false,
          addUserIds: [uid]
        }).then(room => {
          console.log(`Created room called ${room.name}`)
          this.setState({navToChatLoading: false});
          this.props.navigation.navigate( 'CustomChat', {id: this.findRoomId(this.currentUser.rooms, desiredRoomsName)} )
        })
        .catch(err => {
          console.log(`Error creating room ${err}`)
        })
      }
      
      
    });
  }

  navToOtherUserProfilePage = () => {
    const {profile, numberProducts, soldProducts, comments} = this.state;
    this.props.navigation.navigate('OtherUserProfilePage', {profile: profile, numberProducts: numberProducts, soldProducts: soldProducts, comments: comments});
  }

  render() {
    const { params } = this.props.navigation.state;
    const { data } = params;
    
    const { isGetting, profile, navToChatLoading } = this.state;
    const text = data.text;
    const details = {
      gender: text.gender,
      size: text.size,
      type: text.type,
      condition: text.condition,
      months: text.months,
      original_price: text.original_price
    };
    const description = text.description;
    const {comments} = text;

    console.log("videos: updating")

    if (isGetting) {
      return (
        <View style={{flex: 1}}>
          <PacmanIndicator color='black' />
        </View>
      )
    }

    if(navToChatLoading) {
      return(
        <View style={{flex: 1}}>
          <PacmanIndicator color='#186f87' />
        </View>
      )
    }

    return (

      <ScrollView contentContainerStyle={styles.contentContainer}>

        {/* image carousel */}
        <CustomCarousel data={params.data.uris} />

        {/* product details */}
        <Text style={styles.brandText}> {text.brand.toUpperCase()} </Text>

        <View style={styles.nameAndLikeRow} >
          <Text style={styles.nameText}> {text.name.toUpperCase() } </Text>
          <View style={styles.likesRow}>

              {this.state.collectionKeys.includes(params.data.key) ? 
                  <Icon name="heart" 
                        size={22} 
                        color='#800000'
                        onPress={() => { alert("you've already liked this product"); }}

              /> : <Icon name="heart-outline" 
                        size={22} 
                        color='#800000'
                        onPress={() => {alert('You may like this product directly from the Market')}}

              />}

              <Text style={styles.likes}>{params.data.text.likes}</Text>
            </View> 
        </View>
        
        {text.original_price > 0 ?
          <View style= { styles.headerPriceMagnifyingGlassRow }>
            
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
              <Text style={styles.original_price} >
                £{text.original_price}
              </Text>
              <Text style={styles.price} >
                £{text.price}
              </Text>
            </View>

            {this.state.productKeys.includes(data.key) ?
              
              data.text.sold ? 
              
              <View style={{flexDirection: 'row'}}>
                <Button
                    buttonStyle={{
                        backgroundColor: "#186f87",
                        width: 80,
                        height: 40,
                        
                    }}
                    icon={{name: 'lead-pencil', type: 'material-community'}}
                    title='EDIT'
                    onPress = { () => { 
                        console.log('going to edit item details');
                        //subscribe to room key
                        this.navToEditItem(data);
                        } }

                    />
                <View style={{flexDirection: 'column',}}>
                  <Text style={{color: '#0e4406', fontSize: 8 }}>Reset</Text>
                  <Text style={{color: '#0e4406', fontSize: 8 }}>Sale</Text>
                  <Icon
                      name="check-circle" 
                      size={30}  
                      color={'#0e4406'}
                      onPress = {() => {console.log('setting product status to available for purchase'); this.setSaleTo(false, data.uid, data.key)}}
                  />
                </View>      
              </View>      
                
              
               :

               <View style={{flexDirection: 'row'}}>
                <Button
                    buttonStyle={{
                        backgroundColor: "#186f87",
                        width: 80,
                        height: 40,
                        
                    }}
                    icon={{name: 'lead-pencil', type: 'material-community'}}
                    title='EDIT'
                    onPress = { () => { 
                        console.log('going to edit item details');
                        //subscribe to room key
                        this.navToEditItem(data);
                        } }

                    />
                <View style={{flexDirection: 'column',}}>
                  <Text style={{color: '#0e4406', fontSize: 8 }}>Confirm</Text>
                  <Text style={{color: '#0e4406', fontSize: 8 }}>Sale</Text>
                  <Icon
                    name="check-circle" 
                    size={30}  
                    color={'black'}
                    onPress = {() => {console.log('setting product status to sold'); this.setSaleTo(true, data.uid, data.key)}}
                  />
                </View>      
              </View>   

                    
              :
              <View style={{flexDirection: 'row'}}>
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
                        this.navToChat(data.uid, data.key);
                        } }

                    />

                <Icon
                  name="tooltip-edit" 
                  size={35}  
                  color={'#0e4406'}
                  onPress = { () => { 
                              this.navToComments(data.uid, data.key, data.text, profile.name, data.uris[0]);
                              } }
                />  
              </View> 
          }

            
            

          </View>        
        :
        <View style= { styles.headerPriceMagnifyingGlassRow }>
            
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
              <Text style={styles.price} >
                £{text.price}
              </Text>
            </View>

            {this.state.productKeys.includes(data.key) ?
              
              data.text.sold ? 
              
              <View style={{flexDirection: 'row'}}>
                <Button
                    buttonStyle={{
                        backgroundColor: "#186f87",
                        width: 80,
                        height: 40,
                        
                    }}
                    icon={{name: 'lead-pencil', type: 'material-community'}}
                    title='EDIT'
                    onPress = { () => { 
                        console.log('going to edit item details');
                        //subscribe to room key
                        this.navToEditItem(data);
                        } }

                    />
                <View style={{flexDirection: 'column',}}>
                  <Text style={{color: '#0e4406', fontSize: 8 }}>Reset</Text>
                  <Text style={{color: '#0e4406', fontSize: 8 }}>Sale</Text>
                  <Icon
                      name="check-circle" 
                      size={30}  
                      color={'#0e4406'}
                      onPress = {() => {console.log('setting product status to available for purchase'); this.setSaleTo(false, data.uid, data.key)}}
                  />
                </View>      
              </View>      
                
              
               :

               <View style={{flexDirection: 'row'}}>
                <Button
                    buttonStyle={{
                        backgroundColor: "#186f87",
                        width: 80,
                        height: 40,
                        
                    }}
                    icon={{name: 'lead-pencil', type: 'material-community'}}
                    title='EDIT'
                    onPress = { () => { 
                        console.log('going to edit item details');
                        //subscribe to room key
                        this.navToEditItem(data);
                        } }

                    />
                <View style={{flexDirection: 'column',}}>
                  <Text style={{color: '#0e4406', fontSize: 8 }}>Confirm</Text>
                  <Text style={{color: '#0e4406', fontSize: 8 }}>Sale</Text>
                  <Icon
                    name="check-circle" 
                    size={30}  
                    color={'black'}
                    onPress = {() => {console.log('setting product status to sold'); this.setSaleTo(true, data.uid, data.key)}}
                  />
                </View>      
              </View>   

                    
              :
              <View style={{flexDirection: 'row'}}>
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
                        this.navToChat(data.uid, data.key);
                        } }

                    />

                <Icon
                  name="tooltip-edit" 
                  size={35}  
                  color={'#0e4406'}
                  onPress = { () => { 
                              this.navToComments(data.uid, data.key, data.text, profile.name, data.uris[0]);
                              } }
                />  
              </View> 
          }

            
            

          </View>
        }



        {/* row showing user details */}
        <View style={profileRowStyles.separator}/>
        <View style={profileRowStyles.rowContainer}>
          {/* row containing profile picture, and user details */}
          <TouchableOpacity onPress={() => this.navToOtherUserProfilePage()}>
            <Image source={ {uri: profile.uri }} style={profileRowStyles.profilepic} />
          </TouchableOpacity>
          <View style={profileRowStyles.textContainer}>
            
            <Text onPress={() => this.navToOtherUserProfilePage()} style={profileRowStyles.name}>
              {profile.name}
            </Text>
            <Text style={profileRowStyles.email}>
              {profile.country}
            </Text>
            <Text style={profileRowStyles.insta}>
              @{profile.insta}
            </Text>
            
          </View>
          
          
        </View>
        <View style={ {flexDirection: 'row',} }>
            <Text style={styles.numberProducts}>Products on Sale: {this.state.numberProducts} </Text>
            <Divider style={{  backgroundColor: iOSColors.black, width: 3, height: 20 }} />
            <Text style={styles.soldProducts}> Products Sold: {this.state.soldProducts}</Text>
        </View>
        <View style={profileRowStyles.separator}/>

        
        
        

        {/* more details */}
        
        { Object.keys(details).map( (key) => (
          
            <View style={styles.dalmationContainer}>
              <View style={ styles.keyContainer }>
                  <Text style={styles.keyText}>{key === 'original_price' ? 'RETAIL PRICE' : key.toUpperCase()}</Text>
              </View>
              <View style={ styles.valueContainer }>
                  <Text style={styles.valueText}>{key === 'original_price' ? `£${details[key]}` : details[key]}</Text>
              </View>
            </View>

        )
        ) }

        {/* buy button */}

        {/* comments */}

        <CustomComments comments={comments} currentUsersName={profile.name}/>

      </ScrollView> 
    );
  }
}

export default withNavigation(ProductDetails);

const styles = StyleSheet.create( {
  contentContainer: {
    flexGrow: 1, 
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    padding: 10,
    marginTop: 5,
    marginBottom: 5
  },

  brandText: {
    fontFamily: 'Courier-Bold',
    fontSize: 35,
    fontWeight: '400'
  },

  headerPriceMagnifyingGlassRow: {
    flexDirection: 'row', justifyContent: 'space-between', 
    paddingTop: 2,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 0 
  },

  original_price: {
    ...material.display2,
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
    textDecorationLine: 'line-through',
  },

  price: {
    ...material.display3,
    fontSize: 17,
    fontWeight: 'bold',
    color: limeGreen
  },

  nameAndLikeRow: {
    flexDirection: 'row'
  },

  nameText: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 20,
    padding: 10,
  },

  likesRow: {
    flexDirection: 'row',
    backgroundColor: iOSColors.white,
    marginLeft: 0,
  },

  likes: {
    ...iOSUIKit.largeTitleEmphasized,
    fontSize: 20,
    color: '#c61919',
    padding: 2,
    marginLeft: 4,
  },

  numberProducts: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold'
  },
  soldProducts: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold'
  },

  dalmationContainer: {
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'space-evenly'
},

keyContainer: {
    width: (width/2) - 30,
    height: 40,
    padding: 5,
    justifyContent: 'center',
    backgroundColor: iOSColors.customGray
},

valueContainer: {
    width: (width/2),
    height: 40,
    padding: 5,
    justifyContent: 'center',
    backgroundColor: iOSColors.black
},

keyText: {
    color: iOSColors.black,
    fontFamily: 'TrebuchetMS-Bold',
    fontSize: 15,
    fontWeight: '400'

},

valueText: {
    color: iOSColors.white,
    fontFamily: 'Al Nile',
    fontSize: 18,
    fontWeight: '300'

},

} )

const profileRowStyles = StyleSheet.create( {
  rowContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'center'
  },


  profilepic: {
    borderWidth:1,
    borderColor:'#207011',
    alignItems:'center',
    justifyContent:'center',
    width:70,
    height:70,
    backgroundColor:'#fff',
    borderRadius:20,
    borderWidth: 2

},

textContainer: {
  flex: 1,
  flexDirection: 'column',
  alignContent: 'center',
  padding: 5,
},

name: {
  fontSize: 18,
  color: '#207011',
},

email: {
    fontSize: 18,
    color: '#0394c0',
    fontStyle: 'italic'
  },
  
insta: {
    fontSize: 16,
    color: '#13a34c',
    fontWeight: '600',
    fontStyle: 'normal'
  },  

separator: {
  height: 1,
  backgroundColor: 'black',
  padding: 2,
},
} )