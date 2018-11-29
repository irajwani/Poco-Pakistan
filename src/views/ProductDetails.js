import React, { Component } from 'react';
import {TouchableWithoutFeedback, Keyboard, ScrollView, View, Text, TextInput, Image, TouchableHighlight, TouchableOpacity, Modal, Dimensions, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';

import { withNavigation } from 'react-navigation';
import firebase from '../cloud/firebase';

import CustomCarousel from '../components/CustomCarousel';
// import CustomComments from '../components/CustomComments';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import styles from '../styles.js'
// import { database } from '../cloud/database';
import { Divider } from 'react-native-elements';

import { material, iOSColors, iOSUIKit } from 'react-native-typography';
import { PacmanIndicator } from 'react-native-indicators';

import Chatkit from "@pusher/chatkit";
import { CHATKIT_INSTANCE_LOCATOR, CHATKIT_TOKEN_PROVIDER_ENDPOINT, CHATKIT_SECRET_KEY } from '../credentials/keys.js';
import email from 'react-native-email';
import { bobbyBlue, woodBrown, highlightGreen, treeGreen } from '../colors';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import BackButton from '../components/BackButton';

var {height, width} = Dimensions.get('window');

const limeGreen = '#2e770f';
// const profoundPink = '#c64f5f';

const chatIcon = {
  title: 'Chat',
  color: 'gray',
  type:{name: 'message-text', type: 'material-community'}
}

function removeFalsyValuesFrom(object) {
  const newObject = {};
  Object.keys(object).forEach((property) => {
    if (object[property]) {newObject[property] = object[property]}
  })
  return Object.keys(newObject);
}

const DismissKeyboardView = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
  </TouchableWithoutFeedback>
)

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
      productComments: '',
      showReportUserModal: false,
      report: '',
    }
  }

  componentWillMount() {
    const {params} = this.props.navigation.state;

    setTimeout(() => {
      this.getUserAndProductAndOtherUserData(params.data);
    }, 4);
  }

  getUserAndProductAndOtherUserData(data) {
    firebase.database().ref().once("value", (snapshot) => {
      var d = snapshot.val();
      const uid = firebase.auth().currentUser.uid;
      const otherUserUid = data.uid;

      //get current user's profile info
      const yourProfile = d.Users[uid].profile;

      //get profile info of seller of product
      const profile = d.Users[data.uid].profile;

      //get keys of current user's products
      // var productKeys = d.Users[uid].products ? Object.keys(d.Users[uid].products) : [];

      //get usersBlocked for current user
      var rawUsersBlocked = d.Users[uid].usersBlocked ? d.Users[uid].usersBlocked : {};
      var yourUsersBlocked = removeFalsyValuesFrom(rawUsersBlocked);
      console.log(yourUsersBlocked);

      //get collection keys of current user
      // var collection = d.Users[uid].collection ? d.Users[uid].collection : null;
      // var rawCollection = collection ? collection : {}
      // var collectionKeys = removeFalsyValuesFrom(rawCollection);  

      var soldProducts = 0;

      //get profile data of seller of product
      for(var p of Object.values(d.Users[data.uid].products)) {
        if(p.sold) {
          soldProducts++
        }
      }
      
      var numberProducts = Object.keys(d.Users[data.uid].products).length

      var date = (new Date()).getDate();
      var month = (new Date()).getMonth();
      var year = (new Date()).getFullYear();

      var comments;
      if(d.Users[data.uid].comments) {
        comments = d.Users[data.uid].comments;
      }
      else {
        comments = {a: {text: 'Write a review for this seller using the comment field below.', name: 'NottMyStyle Team', time: `${year}/${month.toString().length == 2 ? month : '0' + month }/${date}`, uri: '' } };
      }


      //  = d.Users[data.uid].comments ? d.Users[data.uid].comments : {a: {text: 'No Reviews have been left for this seller.', name: 'NottMyStyle Team', time: `${year}/${month.toString().length == 2 ? month : '0' + month }/${date}`, uri: '' } };
      
      var productComments = d.Users[data.uid].products[data.key].comments ? d.Users[data.uid].products[data.key].comments : {a: {text: 'No Reviews have been left for this product yet.', name: 'NottMyStyle Team', time: `${year}/${month.toString().length == 2 ? month : '0' + month }/${date}`, uri: '' } };
      
      this.setState( {yourProfile, yourUsersBlocked, uid, otherUserUid, profile, numberProducts, soldProducts, comments, productComments,} )
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
    alert(`Product has been marked as ${status}.\n If you wish to see the effects of this change immediately,\n please go back to the Market`)

  }

  // navToComments(uid, productKey, text, name, uri) {
  //   console.log('navigating to Comments section')
  //   this.props.navigation.navigate('Comments', {likes: text.likes, uid: uid, productKey: productKey, uri: uri, text: text, time: text.time, name: name})
  // }

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
          //base the room name on the following pattern: product key + dot + buyers uid
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
    //Since we already perform some data retrieval on this page,
    //extract information for: the UI on next page AND the uid of the user to be able to block them from sending messages.
    const {yourProfile, yourUsersBlocked, otherUserUid, profile, numberProducts, soldProducts, noComments, comments} = this.state;
    this.props.navigation.navigate('OtherUserProfilePage', {yourProfile: yourProfile, usersBlocked: yourUsersBlocked, uid: otherUserUid, profile: profile, numberProducts: numberProducts, soldProducts: soldProducts, comments: comments});
  }

  navToProductComments = (productInformation) => {
    const {yourProfile, productComments, otherUserUid} = this.state;
    this.props.navigation.navigate('ProductComments', {productInformation: productInformation, key: productInformation.key, comments: productComments, yourProfile: yourProfile, uid: otherUserUid });
  }



  reportItem = (yourInformation, productInformation) => {
    const recipients = ['nottmystyle.help@gmail.com'] // string or array of email addresses
    const {report} = this.state
    const {uid, key, text,} = productInformation
    const {name} = text
    email(recipients, {
        // Optional additional arguments
        //cc: ['bazzy@moo.com', 'doooo@daaa.com'], // string or array of email addresses
        //bcc: 'mee@mee.com', // string or array of email addresses
        subject: `Report regarding product: ${key} from User: ${uid}` ,
        body: report + '\n' + 'Cheers!\n' + yourInformation.name
    })
    .catch(console.error)
  }

  render() {
    const { params } = this.props.navigation.state;
    const { data, collectionKeys, productKeys } = params;
    
    const { isGetting, profile, navToChatLoading, productComments, uid } = this.state;
    const text = data.text;
    const details = {
      gender: text.gender,
      size: text.size,
      type: text.type,
      condition: text.condition,
      original_price: text.original_price
    };
    const description = text.description;
    const {comments} = text;

    // console.log(firebase.auth().currentUser.uid == data.uid, firebase.auth().currentUser.uid, data.uid);

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

      <ScrollView style={styles.mainContainer} contentContainerStyle={styles.contentContainer}>
        <BackButton action={()=>this.props.navigation.goBack()}/>
        {/* image carousel */}
        <View style={{flex: 2, alignItems: 'center'}}>
          <CustomCarousel data={params.data.uris} />
        </View>
          {/* Product Name and Price Row */}
        <View style={styles.nameAndPriceRow}>
          <View style={styles.nameContainer}>
            <Text style={styles.brandText}>{text.brand.toUpperCase()}, {text.name.toUpperCase()}</Text>
          </View>
          
            {text.original_price > 0 ?
              <View style={[styles.priceContainer]}>
                <Text style={styles.original_price} >
                  £{text.original_price}
                </Text>
                <Text style={styles.price} >
                  £{text.price}
                </Text>
              </View>
            :
              <View style={[styles.priceContainer]}>
                <Text style={styles.price} >
                  £{text.price}
                </Text>
              </View>
            }
          
        </View>

        <View style={{backgroundColor: 'black', height: 1}} />
            {/* Profile And Actions Row */}
        <View style={styles.sellerProfileAndActionsRow}>
            
          <TouchableOpacity style={styles.profilePictureContainer} onPress={() => {firebase.auth().currentUser.uid == data.uid ? this.props.navigation.navigate('Profile') : this.navToOtherUserProfilePage()}}>
            <Image source={ {uri: profile.uri }} style={profileRowStyles.profilepic} />
          </TouchableOpacity>

          <View style={styles.profileTextContainer}>
            <Text onPress={() => 
            {firebase.auth().currentUser.uid == data.uid ? this.props.navigation.navigate('Profile') : this.navToOtherUserProfilePage()}}
            style={profileRowStyles.name}>
              {profile.name}
            </Text>
            <Text style={profileRowStyles.email}>
              {profile.country}
            </Text>
            {profile.insta ? 
              <Text style={profileRowStyles.insta}>@{profile.insta}</Text>
             : 
              null
            }
          </View>

          <View style={styles.likeIconContainer}>
            {collectionKeys.includes(params.data.key) ? 
              <Icon name="heart" 
                    size={22} 
                    color='#800000'
                    onPress={() => { alert("you've already liked this product, but may unlike it from the Market"); }}
              /> 
              : 
              <Icon name="heart-outline" 
                    size={22} 
                    color='#800000'
                    onPress={() => {alert('You may like this product directly from the Market')}}
              />
            }
            <Text style={styles.likes}>{text.likes}</Text>
          </View>
          <View style={styles.actionIconContainer}>
            {productKeys.includes(data.key) ?
              <Button
                buttonStyle={{
                    backgroundColor: "#186f87",
                    width: 80,
                    
                    
                }}
                icon={{name: 'lead-pencil', type: 'material-community'}}
                title='EDIT'
                onPress = { () => { 
                    console.log('going to edit item details');
                    //subscribe to room key
                    this.navToEditItem(data);
                    } }
              />
              :
              <Icon
                name='message-text'
                size={22}
                color={chatIcon.color}
                onPress = { () => { 
                    console.log('going to chat');
                    //subscribe to room key
                    this.navToChat(data.uid, data.key);
                    } }

              />
            }
          </View>
        </View>

        <View style={{backgroundColor: 'black', height: 1}} />

        {/* Details and Report Item Row */}


        
        <View style={styles.infoAndButtonsColumn}>
        {/* product details */}
        <View style={{flex: 1}}>
          <Text style={styles.brandText}>{text.brand.toUpperCase()}</Text>
        </View>

        <View style={styles.nameAndLikeRow} >
          <Text style={styles.nameText}>{text.name.toUpperCase()}</Text>
          <View style={styles.likesRow}>
  {/* Boolean Row for ability to either like or unlike this product */}
              {collectionKeys.includes(params.data.key) ? 
                  <Icon name="heart" 
                        size={22} 
                        color='#800000'
                        onPress={() => { alert("you've already liked this product, but may unlike it from the Market"); }}

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
            
            <View style={styles.priceRow}>
              <Text style={styles.original_price} >
                £{text.original_price}
              </Text>
              <Text style={styles.price} >
                £{text.price}
              </Text>
            </View>
            {/* ownership product --> 2 things, edit item, confirm sale or unconfirm sale
                when youre an interested buyer --> 3 things, buy item, review item, report item */}
            {productKeys.includes(data.key) ?
              
              data.text.sold ? 
              
              <View style={styles.buttonsRow}>
                <Button
                    buttonStyle={{
                        backgroundColor: "#186f87",
                        width: 80,
                        
                        
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

               <View style={styles.buttonsRow}>
                <Button
                    buttonStyle={{
                        backgroundColor: "#186f87",
                        width: 80,
                        
                        
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
                    color={'gray'}
                    onPress = {() => {console.log('setting product status to sold'); this.setSaleTo(true, data.uid, data.key)}}
                  />
                </View>      
              </View>   

                    
              :
              <View style={styles.buttonsRow}>
                <Button
                    buttonStyle={{
                        backgroundColor: chatIcon.color,
                        width: 80,
                      
                        
                    }}
                    icon={chatIcon.type}
                    title={chatIcon.title}
                    onPress = { () => { 
                        console.log('going to chat');
                        //subscribe to room key
                        this.navToChat(data.uid, data.key);
                        } }

                    />

                <Icon
                  name="alert" 
                  size={40}  
                  color={'#800'}
                  onPress = { () => { 
                              this.setState({showReportUserModal: true})
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

            {productKeys.includes(data.key) ?
              
              data.text.sold ? 
              
              <View style={styles.buttonsRow}>
                <Button
                    buttonStyle={{
                        backgroundColor: "#186f87",
                        width: 80,
                        
                        
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

               <View style={styles.buttonsRow}>
                <Button
                    buttonStyle={{
                        backgroundColor: "#186f87",
                        width: 80,
                        
                        
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
              <View style={styles.buttonsRow}>
                <Button
                    buttonStyle={{
                        backgroundColor: chatIcon.color,
                        width: 80,
                        
                        
                    }}
                    icon={chatIcon.type}
                    title={chatIcon.title}
                    onPress = { () => { 
                        console.log('going to chat');
                        //subscribe to room key
                        this.navToChat(data.uid, data.key);
                        } }

                    />

                <Icon
                  name="alert" 
                  size={40}  
                  color={'#800'}
                  onPress = { () => { 
                              this.setState({showReportUserModal: true})
                              } }
                />  
              </View> 
          }

            
            

          </View>
        }
        </View>


        {/* row showing user details */}
        <View style={profileRowStyles.separator}/>

        <View style={profileRowStyles.rowContainer}>
          {/* row containing profile picture, and user details */}
          <TouchableOpacity onPress={() => {firebase.auth().currentUser.uid == data.uid ? this.props.navigation.navigate('Profile') : this.navToOtherUserProfilePage()}}>
            <Image source={ {uri: profile.uri }} style={profileRowStyles.profilepic} />
          </TouchableOpacity>
          <View style={profileRowStyles.textContainer}>
            
            <Text onPress={() => 
            {firebase.auth().currentUser.uid == data.uid ? this.props.navigation.navigate('Profile') : this.navToOtherUserProfilePage()}}
            style={profileRowStyles.name}>
              {profile.name}
            </Text>
            <Text style={profileRowStyles.email}>
              {profile.country}
            </Text>
            {profile.insta ? 
              <Text style={profileRowStyles.insta}>@{profile.insta}</Text>
             : 
              null
            }
            
          </View>
          
          
        </View>

        <View style={styles.numberOfProductsSoldRow}>
            <Text style={styles.numberProducts}>Products on Sale: {this.state.numberProducts} </Text>
            <Text style={styles.soldProducts}> Products Sold: {this.state.soldProducts}</Text>
        </View>

        <View style={profileRowStyles.separator}/>

        
        
        

        {/* more details */}
        
        { Object.keys(details).map( (key, index) => (
          
            <View style={styles.dalmationContainer}>
              <View style={ [styles.keyContainer, {backgroundColor: index % 2 == 0 ? bobbyBlue : iOSColors.lightGray2}] }>
                  <Text style={styles.keyText}>{key === 'original_price' ? 'RETAIL PRICE' : key.toUpperCase()}</Text>
              </View>
              <View style={ [styles.valueContainer, {backgroundColor: index % 2 == 0 ? highlightGreen : iOSColors.black} ] }>
                  <Text style={styles.valueText}>{key === 'original_price' ? `£${details[key]}` : details[key]}</Text>
              </View>
            </View>

        )
        ) }

        {/* comments */}
        

          
          <View style={styles.reviewsHeaderContainer}>
            <Text style={styles.reviewsHeader}>REVIEWS</Text>
            <FontAwesomeIcon 
              name="edit" 
              style={styles.users}
              size={35} 
              color={iOSColors.black}
              onPress={() => {this.navToProductComments(data)}}
            /> 
          </View>
          
          {productComments['a'] ? null : Object.keys(productComments).map(
                  (comment) => (
                  <View key={comment} style={styles.commentContainer}>

                      <View style={styles.commentPicAndTextRow}>

                        {productComments[comment].uri ?
                          <Image style= {styles.commentPic} source={ {uri: productComments[comment].uri} }/>
                        :
                          <Image style= {styles.commentPic} source={ require('../images/companyLogo2.jpg') }/>
                        }
                          
                        <View style={styles.textContainer}>
                            <Text style={ styles.commentName }> {productComments[comment].name} </Text>
                            <Text style={styles.comment}> {productComments[comment].text}  </Text>
                        </View>

                      </View>

                      <View style={styles.commentTimeRow}>

                        <Text style={ styles.commentTime }> {productComments[comment].time} </Text>

                      </View>

                      {productComments[comment].uri ? <View style={styles.separator}/> : null}
                      
                  </View>
                  
              )
                      
              )}
          
        

        

        {/* Modal to input Report about product */}
       <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showReportUserModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
       >
        <DismissKeyboardView>
            <View style={styles.reportModal}>
                <Text style={styles.reportModalHeader}>Please Explain What You Wish To Report About This Product</Text>
                <TextInput
                    style={styles.reportInput}
                    onChangeText={(report) => this.setState({report})}
                    value={this.state.report}
                    multiline={true}
                    numberOfLines={4}
                />
                <Button
                    title='Send' 
                    titleStyle={{ fontWeight: "300" }}
                    buttonStyle={{
                    backgroundColor: bobbyBlue,
                    //#2ac40f
                    width: (width)*0.40,
                    height: 40,
                    borderColor: "#226b13",
                    borderWidth: 0,
                    borderRadius: 20,
                    }}
                    containerStyle={{ marginTop: 0, marginBottom: 0 }}
                    onPress={() => {this.reportItem(this.state.yourProfile, data)}} 
                />
                
                <TouchableHighlight
                    onPress={() => {
                        this.setState( {showReportUserModal: false} )
                    }}>
                    <Text style={styles.hideModal}>Back</Text>
                </TouchableHighlight>
            </View>
          </DismissKeyboardView>
        </Modal>

      </ScrollView> 
    );
  }
}

export default withNavigation(ProductDetails);

const styles = StyleSheet.create( {
  mainContainer: {
    marginTop: 20,
    marginBottom: 3
  },
  contentContainer: {
    
    flexGrow: 1, 
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    padding: 10,
    // marginTop: 5,
    // marginBottom: 5
  },

  nameAndPriceRow: {
    flexDirection: 'row',
    backgroundColor: 'red'
  },

  nameContainer: {
    flex: 3,
  },

  priceContainer: {
    flexDirection: 'row',
    flex: 1,
    padding: 5,
    justifyContent: 'flex-end',
    backgroundColor: 'blue'
  },

  sellerProfileAndActionsRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 5
  },

  profilePictureContainer: {
    flex: 1,
    padding: 0
  },

  profileTextContainer: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'flex-start'
  },

  likeIconContainer: {
    padding: 5
  },

  actionIconContainer: {
    padding: 5
  },

  infoAndButtonsColumn: {
    flex: 1,
    flexDirection: 'column',
  },

  brandText: {
    fontFamily: 'Avenir Next',
    fontSize: 18,
  },

  headerPriceMagnifyingGlassRow: {
    flex: 1.5,
    flexDirection: 'row', justifyContent: 'space-between', 
    paddingTop: 2,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 0,
  },

  original_price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    textDecorationLine: 'line-through',
  },

  price: {
    fontSize: 22,
    
    color: limeGreen
  },

  nameAndLikeRow: {
    flex: 1,
    flexDirection: 'row'
  },

  nameText: {
    flex: 2,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 20,
    padding: 10,
    // backgroundColor: 'red'
  },

  likesRow: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 5,
    // backgroundColor: iOSColors.white,
    marginLeft: 0,
    // backgroundColor: 'blue'
  },

  likes: {
    ...iOSUIKit.largeTitleEmphasized,
    fontSize: 20,
    color: '#c61919',
    padding: 2,
    marginLeft: 4,
  },

  priceRow: { flex: 1, flexDirection: 'row', justifyContent: 'flex-start', },

  buttonsRow: {flex: 4, flexDirection: 'row', paddingRight: 10, justifyContent: 'flex-end', },

  numberProducts: {
    flex: 5,
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold'
  },
  soldProducts: {
    flex: 5,
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
},

valueContainer: {
    width: (width/2),
    height: 40,
    padding: 5,
    justifyContent: 'center',
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

reportModal: {flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: 25, marginTop: 22},
reportModalHeader: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Iowan Old Style',
    fontWeight: "bold",
    paddingBottom: 20,
},

hideModal: {
  paddingTop: 40,
  fontSize: 20,
  color: 'green',
  fontWeight:'bold'
},

reportInput: {width: width - 40, height: 120, marginBottom: 50, borderColor: bobbyBlue, borderWidth: 1},


halfPageScroll: {
    
},

reviewsHeaderContainer: {
  flexDirection: 'row',
  paddingTop: 5,
  width: width-15,
  justifyContent: 'space-between'
},

users: {
  flex: 0,
  paddingLeft: 60,
  paddingRight: 0,
  marginLeft: 0
},

reviewsHeader: {
  fontFamily: 'Iowan Old Style',
  fontSize: 24,
  fontWeight: "normal",
  paddingLeft: 10
},

commentContainer: {
  flexDirection: 'column',
},

commentPicAndTextRow: {
  flexDirection: 'row',
  width: width - 20,
  padding: 10
},

commentPic: {
  //flex: 1,
  width: 70,
  height: 70,
  alignSelf: 'center',
  borderRadius: 35,
  borderColor: '#fff',
  borderWidth: 0
},

textContainer: {
  flex: 1,
  flexDirection: 'column',
  padding: 5,
  },

commentName: {
  color: highlightGreen,
  fontSize: 16,
  fontWeight: "500",
  textAlign: "left"
},

comment: {
  fontSize: 16,
  color: 'black',
  textAlign: "center",
},  

commentTimeRow: {
  justifyContent: 'flex-end',
  alignContent: 'flex-end',
  alignItems: 'flex-end',
},

commentTime: {
  textAlign: "right",
  fontSize: 16,
  color: iOSColors.black
},

numberOfProductsSoldRow: {
  flex: 1,
  flexDirection: 'row'
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