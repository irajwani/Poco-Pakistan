import React, { Component } from 'react';
import { TouchableWithoutFeedback, Keyboard, ScrollView, View, Text, TextInput, Image, TouchableHighlight, TouchableOpacity, Modal, Dimensions, StyleSheet, Linking } from 'react-native';
import {Button  as RNButton} from 'react-native';
import {Button} from 'react-native-elements';

import { withNavigation } from 'react-navigation';
import firebase from '../cloud/firebase';

import CustomCarousel from '../components/CustomCarousel';
// import CustomComments from '../components/CustomComments';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import styles from '../styles.js'
// import { database } from '../cloud/database';
// import { Divider } from 'react-native-elements';

import { iOSColors } from 'react-native-typography';
// import { PacmanIndicator } from 'react-native-indicators';

import Chatkit from "@pusher/chatkit-client";
import { CHATKIT_INSTANCE_LOCATOR, CHATKIT_TOKEN_PROVIDER_ENDPOINT, CHATKIT_SECRET_KEY } from '../credentials/keys.js';
import email from 'react-native-email';
import { lightGreen, highlightGreen, treeGreen, graphiteGray, rejectRed, darkBlue, profoundPink, aquaGreen, bobbyBlue } from '../colors';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
// import BackButton from '../components/BackButton';
import { avenirNextText, delOpt, deliveryOptions } from '../constructors/avenirNextText';
import { WhiteSpace, LoadingIndicator, CustomTouchableO } from '../localFunctions/visualFunctions';
import NottLogo from '../../nottLogo/ios/NottLogo.js';

var {height, width} = Dimensions.get('window');

const limeGreen = '#2e770f';
// const profoundPink = '#c64f5f';
const modalAnimationType = "slide";

const chatIcon = {
  title: 'Chat',
  color: 'black',
  type:{name: 'message-text', type: 'material-community'}
}

const addressFields = [
  {key: "fullName", header: "Full Name", placeholder: "e.g. Angelina Capato"},
  {key: "addressOne" , header: "Address Line 1" , placeholder: "e.g. House 133"},
  {key: "addressTwo" , header: "Address Line 2" , placeholder: "e.g. Raleigh Park"},
  {key: "postCode" , header: "Postcode" , placeholder: "e.g. NG71NY"},
  {key: "city" , header: "City" , placeholder: "e.g. Nottingham"},
]


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

const SelectedOptionBullet = () => (
  <View style={{width: 20, height: 20, borderRadius: 10, backgroundColor: 'black'}}/>
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
      showFullDescription: false,
      productComments: '',
      showReportUserModal: false,
      report: '',
      //Purchase Modal Stuff
      showPurchaseModal: false,
      activeScreen: "initial",
      deliveryOptions: [
        {text: "Collection in person", selected: false, options: ["Contact via Chat", "OR",  "Proceed to Payment"], },
        {text: "Postal Delivery", selected:false}
      ],
      fullName: "",
      addressOne: "",
      addressTwo: "",
      postCode: "",
      city: "",
    }
  }

  componentDidMount() {
    const {params} = this.props.navigation.state;

    setTimeout(() => {
      this.getUserAndProductAndOtherUserData(params.data);
    }, 4);

    setInterval(() => {
      this.getUserAndProductAndOtherUserData(params.data);
    }, 10000);

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

      /////BELIEVE THESE TO BE UNNECESSARY AS OTHER_USER_PROFILE_PAGE LOADS THEM INDEPENDENTLY A PARTICULAR UID.
      //get usersBlocked for current user
      // var rawUsersBlocked = d.Users[uid].usersBlocked ? d.Users[uid].usersBlocked : {};
      // var yourUsersBlocked = removeFalsyValuesFrom(rawUsersBlocked);
      // console.log(yourUsersBlocked);

      //get collection keys of current user
      // var collection = d.Users[uid].collection ? d.Users[uid].collection : null;
      // var rawCollection = collection ? collection : {}
      // var collectionKeys = removeFalsyValuesFrom(rawCollection);  

      // var soldProducts = 0;

      // //get profile data of seller of product
      // for(var p of Object.values(d.Users[data.uid].products)) {
      //   if(p.sold) {
      //     soldProducts++
      //   }
      // }
      
      // var numberProducts = Object.keys(d.Users[data.uid].products).length

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
      
      var addresses = false;
      d.Users[uid].addresses ?
        addresses = d.Users[uid].addresses
        :
        null
      console.log(addresses, typeof addresses);
      this.setState( {yourProfile, uid, otherUserUid, profile, productComments, addresses} )
    })
    .then( () => {
      this.setState({isGetting: false})
    })
  }

  setSaleTo(soldStatus, uid, productKey) {
    var updates={};
    // var postData = {soldStatus: soldStatus, dateSold: Date.now()}
    updates['Users/' + uid + '/products/' + productKey + '/sold/'] = soldStatus;
    updates['Users/' + uid + '/products/' + productKey + '/dateSold/'] = new Date;
    // updates['Users/' + uid + '/products/' + productKey + '/sold/'] = soldStatus;
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
    this.props.navigation.navigate('CreateItem', {data: item, pictureuris: item.uris, editItemBoolean: true});
    // alert('Please take brand new pictures');
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

  navToOtherUserProfilePage = (uid) => {
    this.props.navigation.navigate('OtherUserProfilePage', {uid: uid})
  }

  navToProductComments = (productInformation) => {
    const {yourProfile, profile, productComments, otherUserUid} = this.state;
    this.props.navigation.navigate('ProductComments', {productInformation: productInformation, key: productInformation.key, comments: productComments, yourProfile: yourProfile, theirProfile: profile, uid: productInformation.uid });
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

  renderReportUserModal = () => {
    {/* Modal to input Report about product */}
    return (
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
                    backgroundColor: darkBlue,
                    //#2ac40f
                    width: 90,
                    height: 40,
                    borderColor: "#fff",
                    borderWidth: 1,
                    borderRadius: 20,
                    }}
                    containerStyle={{ marginTop: 0, marginBottom: 0 }}
                    onPress={() => {this.reportItem(this.state.yourProfile, data)}} 
                />
                
                <TouchableHighlight
                    underlayColor={'#fff'}
                    onPress={() => {
                        this.setState( {showReportUserModal: false} )
                    }}>
                    <Text style={styles.hideModal}>Back</Text>
                </TouchableHighlight>
            </View>
          </DismissKeyboardView>
      </Modal>
    )
  }

  onChange = (text, key) => {
    //For address fields in addAddress
    this.state[key] = text;
    this.setState(this.state);
  }

  addAddress = () => {
    const {fullName, addressOne, addressTwo, postCode, city} = this.state;
    var postData = {
      fullName,
      addressOne,
      addressTwo,
      postCode,
      city,
      selected: false
    };
    var updates = {};
    
    updates['/Users/' + this.state.uid + '/addresses/' + Date.now() + '/'] = postData;
    firebase.database().ref().update(updates);
    this.goToPreviousPage();
    // this.getUserAndProductAndOtherUserData();
    // this.setState({isGetting: true});
  }

  proceedToPayment = () => {
    console.log('.....')
  }

  goToNextPage = () => {
    switch(this.state.activeScreen) {
      case "postalDelivery":
        this.setState({activeScreen: "visaCheckoutScreen"});
        break;
      default:
        this.setState({activeScreen: this.state.deliveryOptions[0].selected ? 'collectionInPerson' : 'postalDelivery'});
        break;

    }
    
    // this.props.navigation.navigate()
  }

  goToAddDeliveryAddress = () => {
    this.setState({activeScreen: 'addDeliveryAddress'});
  }

  goToPreviousPage = () => {
    //Depending on the active screen, navigate to the previous page accordingly
    switch(this.state.activeScreen) {
      case ("collectionInPerson" || "postalDelivery"):
        this.setState({activeScreen: "initial"});
        break;
      case "addDeliveryAddress":
        this.setState({activeScreen: "postalDelivery"});
        break;
      default:
        this.setState({activeScreen: "initial"})
    }
  }

  closePurchaseModal = () => {
    //TODO: clear selected options in deliveryOptions
    this.setState({showPurchaseModal: false });
  }

  renderPurchaseModal = () => {
    const {deliveryOptionModal, deliveryOptionHeader, backIconContainer, logoContainer, logo, deliveryOptionBody, deliveryOptionContainer, radioButton } = styles;
    const {activeScreen} = this.state;

    

    if(activeScreen == "initial") {
      return (
        <Modal 
        animationType="slide"
        transparent={false}
        visible={this.state.showPurchaseModal}
        
        >
          <View style={deliveryOptionModal}>
  
            <View style={deliveryOptionHeader}>
  
              
              <FontAwesomeIcon
                name='arrow-left'
                size={28}
                color={'black'}
                onPress = { () => { 
                    // this.setState({showPurchaseModal: false })
                    } }
                />
            
              <Image style={styles.logo} source={require("../images/logo.png")}/>
              
  
              <FontAwesomeIcon
                name='close'
                size={28}
                color={'black'}
                onPress = { () => { 
                    this.setState({showPurchaseModal: false })
                    } }
                />
  
            </View>
  
            <View style={deliveryOptionBody}>
  
                <Text style={new avenirNextText('black', 24, "400")}>
                  Delivery:
                </Text>
  
                <Text style={new avenirNextText(graphiteGray, 24, "200")}>
                  Choose how you would like your product delivered:
                </Text>

                <WhiteSpace height={40}/>
  
                
                  {this.state.deliveryOptions.map( (option, index) => (
                    <View style={deliveryOptionContainer}>
  
                      <View style={styles.radioButtonContainer}>
                        <TouchableOpacity 
                        style={radioButton} 
                        onPress={() => {
                          //Select this option and if another option is selected, deselect it
                          this.state.deliveryOptions[index].selected = !this.state.deliveryOptions[index].selected;
                          if(index == 0) {
                            this.state.deliveryOptions[1].selected == true ?
                              this.state.deliveryOptions[1].selected = false
                              :
                              null
                          }
  
                          else {
                            this.state.deliveryOptions[0].selected == true ?
                              this.state.deliveryOptions[0].selected = false
                              :
                              null
                          }
                          
                          this.setState({deliveryOptions: this.state.deliveryOptions});
                        }}
                        >
                        {option.selected ? <SelectedOptionBullet/> : null}
                        </TouchableOpacity>
                      </View>
                      
                      <View style={styles.deliveryOptionTextContainer}>
                        <Text style={new avenirNextText('black', 20, "400")}>{option.text}</Text>
                      </View>
                    </View>
                  ))}
                
  
            </View>
  
            <CustomTouchableO 
            onPress={this.goToNextPage}
            disabled={this.state.deliveryOptions[0].selected || this.state.deliveryOptions[1].selected ? false : true } 
            flex={0.15} color={treeGreen} text={'Next'} textColor={'#fff'} textSize={25}
            />
            
           
  
           </View>
  
        </Modal>
      )
    }

    else if(activeScreen == "collectionInPerson") {
      return (
        <Modal 
        animationType="slide"
        transparent={false}
        visible={this.state.showPurchaseModal}
        
        >
          <View style={deliveryOptionModal}>
  
            <View style={deliveryOptionHeader}>
  
              
              <FontAwesomeIcon
                name='arrow-left'
                size={28}
                color={'black'}
                onPress = { () => { 
                    this.goToPreviousPage()
                    // this.setState({showPurchaseModal: false })
                    } }
                />
            
              <Image style={styles.logo} source={require("../images/logo.png")}/>
              
              <FontAwesomeIcon
                name='close'
                size={28}
                color={'black'}
                onPress = { () => { 
                  //TODO: clear selected options in deliveryOptions
                    this.setState({showPurchaseModal: false })
                    } }
                />
  
            </View>
  
            <View style={[deliveryOptionBody, {flex: 0.9}]}>
  
                <Text style={new avenirNextText('black', 24, "400")}>
                  Collection in Person
                </Text>
  
                <Text style={new avenirNextText(graphiteGray, 24, "300")}>
                  Let the seller know when and where you will be meeting via chat.
                </Text>

                <WhiteSpace height={30}/>
  
                
                  {this.state.deliveryOptions[0].options.map( (option, index) => (

                    index != 1 ?
                    <View style={styles.collectionInPersonContainer}>

                      <TouchableOpacity style={styles.collectionInPersonButton}>

                        <View style={styles.collectionInPersonOptionsContainer}>

                          <Icon
                            name={index == 0 ? 'message-text-outline' : "credit-card"}
                            size={33}
                            color={chatIcon.color}
                            onPress = { () => { 
                                // console.log('going to chat');
                                //subscribe to room key
                                index == 0 ? 
                                  this.navToChat(this.props.navigation.state.params.data.uid, this.props.navigation.state.params.data.key)
                                  : 
                                  this.proceedToPayment
                                } }

                          />
                          <Text style={new avenirNextText(graphiteGray, 20, "200")}>
                            {option}
                          </Text>
                          
                        </View>

                      </TouchableOpacity>

                    </View>

                    :

                    <View style={styles.collectionInPersonContainer}>

                      <Text style={new avenirNextText(graphiteGray, 28, "300")}>OR</Text>

                    </View>



                  ))}
                
  
            </View>
            
           
  
           </View>
  
        </Modal>
      )
    }

    else if(activeScreen == "postalDelivery") {
      return (
      <Modal 
      animationType={modalAnimationType}
      transparent={false}
      visible={this.state.showPurchaseModal}
      
      >
        <View style={deliveryOptionModal}>

          <View style={deliveryOptionHeader}>

            
            <FontAwesomeIcon
              name='arrow-left'
              size={28}
              color={'black'}
              onPress = { () => { 
                  this.goToPreviousPage()
                  // this.setState({showPurchaseModal: false })
                  } }
              />
          
            <Image style={styles.logo} source={require("../images/logo.png")}/>
            
            <FontAwesomeIcon
              name='close'
              size={28}
              color={'black'}
              onPress = { () => { 
                //TODO: clear selected options in deliveryOptions
                  this.setState({showPurchaseModal: false })
                  } }
              />

          </View>

          <View style={deliveryOptionBody}>

              <View style={{flex: 0.3}}>
                <Text style={new avenirNextText('black', 24, "400")}>
                  Postal Delivery
                </Text>

                <Text style={new avenirNextText(graphiteGray, 24, "300")}>
                  Address:
                </Text>
              </View>  

              
              
              {this.state.addresses ?
                <ScrollView style={{flex: 0.35}} contentContainerStyle={styles.addressesContainer}>
                  {Object.keys(this.state.addresses).map( (key, index) => (
                    <View>
                    <TouchableOpacity 
                    onPress={ () => {
                      Object.keys(this.state.addresses).forEach( (k) => {
                        this.state.addresses[k].selected = false
                      })
                      this.state.addresses[key].selected = !this.state.addresses[key].selected
                      this.setState(this.state); 
                    }}
                    style={styles.addressContainerButton}
                    >
                      <View style={styles.addressContainer}>
                        <View style={styles.radioButton}>
                          {this.state.addresses[key].selected ? <SelectedOptionBullet/> : null}
                        </View>
                        <Text style={styles.addressText}>{this.state.addresses[key].addressOne + ", " + this.state.addresses[key].addressTwo + ", " + this.state.addresses[key].city + ","}</Text>
                        <Text style={styles.addressText}>{this.state.addresses[key].postCode}</Text>
                      </View>
                    </TouchableOpacity>
                    <WhiteSpace height={10}/>
                    </View>
                  ))}
                </ScrollView>
              :
                null
              }

              
              
              <View style={{flex: this.state.addresses ? 0.35 : 0.7, alignItems: 'center'}}>
                <TouchableOpacity onPress={this.goToAddDeliveryAddress} style={styles.addDeliveryAddressButton}>
                    <View style={styles.collectionInPersonOptionsContainer}>

                      <Icon
                        name="plus-circle-outline"
                        size={18}
                        color={"#fff"}
                      />

                      <Text style={new avenirNextText("#fff", 20, "300")}>
                        Add your delivery address
                      </Text>
                      
                    </View>
                </TouchableOpacity>
              </View>
              

          </View>

          <View style={[styles.collectionInPersonContainer, {flex: 0.15}]}>

                <TouchableOpacity 
                onPress={this.proceedToPayment} 
                style={styles.collectionInPersonButton}>

                  <View style={styles.collectionInPersonOptionsContainer}>

                    <Icon
                      name="credit-card"
                      size={33}
                      color={chatIcon.color}

                    />
                    <Text style={new avenirNextText('black', 20, "200")}>
                      Proceed to Payment
                    </Text>
                    
                  </View>

                </TouchableOpacity>

          </View>
          
         

         </View>

      </Modal>
    )

    }

    else if(activeScreen == "addDeliveryAddress") {
      var filledOutAddress = (this.state.fullName && this.state.addressOne && this.state.addressTwo && this.state.city);
      return (
      <Modal 
      animationType={modalAnimationType}
      transparent={false}
      visible={this.state.showPurchaseModal}
      
      >
        <View style={deliveryOptionModal}>

          <View style={deliveryOptionHeader}>

            
            <FontAwesomeIcon
              name='arrow-left'
              size={28}
              color={'black'}
              onPress = { () => { 
                  this.goToPreviousPage()
                  // this.setState({showPurchaseModal: false })
                  } }
            />
          
            <Image style={styles.logo} source={require("../images/logo.png")}/>
            
            <FontAwesomeIcon
              name='close'
              size={28}
              color={'black'}
              onPress={this.closePurchaseModal}
              />

          </View>

          <View style={[deliveryOptionBody, {flex: 0.9}]}>

              <View style={{flex: 0.1}}>
                <Text style={new avenirNextText('black', 17, "400")}>
                  Address:
                </Text>
              </View>

              <WhiteSpace height={10}/>

              <ScrollView style={{flex: 0.25}} contentContainerStyle={styles.addressForm}>
                  {addressFields.map( (field, index) => (
                    <View style={styles.addressField}>
                      <Text style={new avenirNextText("black", 14, "400")}>{field.header}</Text>
                      <TextInput
                      onChangeText={(text) => this.onChange(text, field.key)}
                      value={this.state[field.key]}
                      style={{height: 50, width: 280, fontFamily: 'Avenir Next', fontSize: 13, color: treeGreen}}
                      placeholder={field.placeholder}
                      placeholderTextColor={graphiteGray}
                      multiline={false}
                      maxLength={index == 1 || index == 2 ? 50 : 24}
                      autoCorrect={false}
                      clearButtonMode={'while-editing'}
                      />
                    </View>
                  ))}
              </ScrollView>

              <View style={[styles.collectionInPersonContainer, {flex: 0.65}]}>

                <TouchableOpacity
                disabled={filledOutAddress ? false : true} 
                onPress={this.addAddress} 
                style={styles.collectionInPersonButton}>

                  <View style={[styles.collectionInPersonOptionsContainer, {width: 180}]}>

                    <FontAwesomeIcon
                      name="address-book"
                      size={33}
                      color={'black'}

                    />
                    <Text style={new avenirNextText('black', 20, "200")}>
                      Add Address
                    </Text>
                    
                  </View>

                </TouchableOpacity>

              </View>
                
              

          </View>
          
         

         </View>

      </Modal>
    )

    }
    
    
  }

  render() {
    const { params } = this.props.navigation.state,
    { data, collectionKeys, productKeys } = params,
    
    { isGetting, profile, navToChatLoading, productComments, uid } = this.state,
    {text} = data,
    details = {
      brand: text.brand,
      gender: text.gender,
      size: text.size,
      type: text.type,
      condition: text.condition,
      original_price: text.original_price
    },
    description = text.description;
    // const {comments} = text;

    // console.log(firebase.auth().currentUser.uid == data.uid, firebase.auth().currentUser.uid, data.uid);

    if (isGetting) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <LoadingIndicator isVisible={isGetting} color={profoundPink} type={'Wordpress'}/>
        </View>
      )
    }

    if(navToChatLoading) {
      return(
        <View style={{marginTop: 22, flex: 1, justifyContent: 'center', backgroundColor: '#fff'}}>

          <View style={{height: 200, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
            <LoadingIndicator isVisible={navToChatLoading} color={aquaGreen} type={'Wordpress'}/>
            <Text style={{paddingVertical: 1, paddingHorizontal: 10, fontFamily: 'Avenir Next', fontSize: 18, fontWeight: '500', color: aquaGreen, textAlign: 'center'}}>
              Navigating to Chat regarding purchase of {text.name}, by {text.brand}
            </Text>
          </View>  

        </View>
      )
    }

    return (

      <ScrollView style={styles.mainContainer} contentContainerStyle={styles.contentContainer}>
        
        {/* image carousel in center with back button on its left */}
        <View style={{marginTop: 5, flex: 2, flexDirection: 'row', paddingVertical: 5, paddingRight: 2, paddingLeft: 1 }}>
          <View style={{flex: 0.035, justifyContent: 'flex-start',}}>
              <FontAwesomeIcon
              name='chevron-left'
              size={18}
              color={'#800000'}
              onPress = { () => { 
                  this.props.navigation.goBack();
                  } }

              />
          </View>
          <View style={{flex: 0.965, justifyContent: 'flex-start', alignItems: 'center',  }}>        
            <CustomCarousel data={params.data.uris} />
          </View>
        </View>
          {/* Product Name (Not Brand) and Price Row */}
        <View style={styles.nameAndPriceRow}>
          <View style={styles.nameContainer}>
            <Text style={styles.brandText}>{text.name.toUpperCase()}</Text>
          </View>

          <View style={styles.likesContainer}>
            
            <Icon name={collectionKeys.includes(params.data.key) ? "heart" : "heart-outline" }
            size={37} 
            color='#800000'
            onPress={() => {collectionKeys.includes(params.data.key) ? 
            alert("you've already liked this product, but may unlike it from the Market")
            : 
            alert('You may like this product directly from the Market')}
            }
            />

            <View style={{justifyContent: 'center', position: 'absolute', paddingBottom: 5}}>
              <Text style={[styles.likes, {color: collectionKeys.includes(params.data.key) ? 'black' : rejectRed} ]}>{params.data.text.likes}</Text>
            </View>
          
          </View> 
          
            {text.original_price > 0 ?
              <View style={[styles.priceContainer]}>
                <Text style={[styles.original_price, {color: 'black', textDecorationLine: 'line-through',}]} >
                  £{text.original_price}
                </Text>
                <Text style={[styles.original_price, {color: limeGreen}]} >
                  £{text.price}
                </Text>
              </View>
            :
              <View style={[styles.priceContainer]}>
                <Text style={[styles.original_price, {fontSize: 22, color: limeGreen}]} >
                  £{text.price}
                </Text>
              </View>
            }
          
        </View>

        <View style={{backgroundColor: 'black', height: 1.5}} />
            {/* Profile And Actions Row */}
        <View style={styles.sellerProfileAndActionsRow}>
            
          <TouchableOpacity style={styles.profilePictureContainer} onPress={() => {firebase.auth().currentUser.uid == data.uid ? this.props.navigation.navigate('Profile') : this.navToOtherUserProfilePage(data.uid)}}>
            <Image source={profile.uri ? {uri: profile.uri} : require('../images/blank.jpg')} style={styles.profilePicture} />
          </TouchableOpacity>

          <View style={styles.profileTextContainer}>
            <Text onPress={() => 
            {this.state.uid == data.uid ? this.props.navigation.navigate('Profile') : this.navToOtherUserProfilePage(data.uid)}}
            style={profileRowStyles.name}>
              {profile.name}
            </Text>
            <Text style={profileRowStyles.email}>
              {profile.country}
            </Text>
            {profile.insta ? 
              <Text onPress={()=>Linking.openURL(`https://instagram.com/${profile.insta}`)} style={profileRowStyles.insta}>@{profile.insta}</Text>
             : 
              null
            }
          </View>

          
          <View style={styles.actionIconContainer}>
            {productKeys.includes(data.key) ?
              <Icon
                name='wrench'
                size={50}
                color={'black'}
                onPress = { () => { 
                    // console.log('going to edit item details');
                    //subscribe to room key
                    this.navToEditItem(data);
                    } }
              />
              :
              <Icon
                name='message-text-outline'
                size={50}
                color={chatIcon.color}
                onPress = { () => { 
                    // console.log('going to chat');
                    //subscribe to room key
                    this.navToChat(data.uid, data.key);
                    } }

              />
            }
          </View>
        </View>

        <View style={{backgroundColor: 'black', height: 1.5}} />

        {/* Details and Report Item Row */}

        <View style={styles.detailsAndReportItemRow}>

            <View style={styles.detailsColumn}>
              <Text style={[styles.detailsText, {fontSize: 20, color: 'black', fontWeight: '500'}]}>DETAILS</Text>
              { Object.keys(details).map( (key, index) => ( 
                <Text style={styles.detailsText} key={index}>
                {key === 'original_price' ? 'Retail Price' : key.replace(key.charAt(0), key.charAt(0).toUpperCase())}: {key === 'original_price' ? `£${details[key]}` : details[key]}
                </Text>
              ) ) }
            </View>

            <View style={styles.secondaryActionsColumn}>
            {productKeys.includes(data.key) ?
              data.text.sold ?
                <View style={styles.confirmSaleActionContainer}>
                    <Text style={styles.confirmSaleText}>Reset</Text>
                    <Text style={styles.confirmSaleText}>Sale</Text>
                    <Icon
                        name="check-circle" 
                        size={30}  
                        color={'#0e4406'}
                        onPress = {() => {console.log('setting product status to available for purchase'); this.setSaleTo(false, data.uid, data.key)}}
                    />
                </View>
              :
                <View style={styles.confirmSaleActionContainer}>
                  <Text style={styles.confirmSaleText}>Confirm</Text>
                  <Text style={styles.confirmSaleText}>Sale</Text>
                  <Icon
                    name="check-circle" 
                    size={30}  
                    color={'gray'}
                    onPress = {() => {console.log('setting product status to sold'); this.setSaleTo(true, data.uid, data.key)}}
                  />
                </View> 
            :
              <View style={styles.buyOrReportActionContainer}>
                <TouchableOpacity
                  disabled={data.text.sold ? true : false} 
                  style={styles.purchaseButton}
                  onPress={() => {this.setState({showPurchaseModal: true})}} 
                >
                  <Text style={new avenirNextText("#fff",15,"300")}>Purchase</Text>
                </TouchableOpacity>
                <WhiteSpace height={40}/>
                <Icon
                  name="flag-variant-outline" 
                  size={40}  
                  color={'#800'}
                  onPress = { () => { 
                    this.setState({showReportUserModal: true})
                  } }
                />
              </View>

              
            

            }
              
            </View>
        </View>

        <View style={{backgroundColor: 'black', height: 1.5}} />

        {/* Optional Product Description Row */}

        { text.description !== "Seller did not specify a description" ?
            <View>
            <View style={styles.optionalDescriptionRow}>
                <View style={styles.descriptionHeaderContainer}>
                    <Text style={styles.descriptionHeader}>Description</Text>
                </View>
                <View style={styles.descriptionContainer}>
                  {text.description.length >= 131 ?
                    <Text 
                    onPress={()=>{this.setState({showFullDescription: !this.state.showFullDescription})}} 
                    style={styles.description}>
                    {this.state.showFullDescription ? text.description : text.description.replace(/ +/g, " ").substring(0,124) + "...." + "  " +  "(Show More?)"}
                    </Text>
                  :
                    <Text style={styles.description}>{text.description}</Text>
                  }
                </View>
                <WhiteSpace height={3}/>
              
            </View>
            <View style={{backgroundColor: 'black', height: 1.5}} />
            </View>
          :
          null
        }

        

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
                          <TouchableHighlight 
                            onPress={() => this.state.uid == productComments[comment].uid ? this.props.navigation.navigate('Profile') : this.navToOtherUserProfilePage(productComments[comment].uid)} 
                            style={styles.commentPic}
                          >
                            <Image style= {styles.commentPic} source={ {uri: productComments[comment].uri} }/>
                          </TouchableHighlight>  
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
          

        {this.renderReportUserModal()}

        {this.renderPurchaseModal()}

        {/* {this.r()} */}


      </ScrollView> 
    );
  }
}

export default withNavigation(ProductDetails);


{/* <View style={{flex: 2, alignItems: 'center'}}>
          <CustomCarousel data={params.data.uris} />
        </View> */}

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
    paddingHorizontal: 5,
    // marginTop: 5,
    // marginBottom: 5
  },

  nameAndPriceRow: {
    flexDirection: 'row',
    // backgroundColor: 'red',
    padding: 5,
    // margin: 5
  },

  nameContainer: {
    justifyContent: 'flex-start',
    flex: 0.7,
  },

  likesContainer: {flex: 0.15, justifyContent: 'center', alignItems: 'center', 
    // backgroundColor: 'red'
},

  priceContainer: {
    flexDirection: 'column',
    flex: 0.15,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'blue'
  },

  sellerProfileAndActionsRow: {
    height: 90,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 5
  },

  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: 'black',
    borderWidth: 1,
  },

  profilePictureContainer: {
    flex: 1.5,
    padding: 0,
    // height:100,
    // width: 150,
    justifyContent: 'center',
    // backgroundColor: 'yellow'
  },

  profileTextContainer: {
    flex: 2.5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'flex-end',
    alignItems: 'center',
    // backgroundColor: 'red'
  },

  likeIconContainer: {
    padding: 5
  },

  original_price: {
    fontFamily: 'Avenir Next',
    fontSize: 16,
    fontWeight: '500',
  },

  price: {
    fontFamily: 'Avenir Next',
    fontSize: 16,
    
  },

  actionIconContainer: {
    flex: 1.5,
    // backgroundColor: 'brown',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0
  },

  detailsAndReportItemRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },

  detailsColumn: {
    flex: 4,
    flexDirection: 'column',
    paddingBottom: 3,
    paddingTop: 1,
    paddingHorizontal: 0
  },

  detailsText: {
    textAlign: 'left',
    fontSize: 17,
    fontFamily: 'Avenir Next',
    fontWeight: '300',
    color: graphiteGray
  },

  secondaryActionsColumn: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    flexDirection: 'column',
    flex: 2,
    // backgroundColor: 'green'
  },

  confirmSaleActionContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },

  confirmSaleText: {color: '#0e4406', fontSize: 10, textAlign: 'center' },

  infoAndButtonsColumn: {
    flex: 1,
    flexDirection: 'column',
  },

  buyOrReportActionContainer: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  purchaseButton: {
    width: 70,
    height: 30,
    backgroundColor: treeGreen,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
    // borderWidth: 1,
    // borderColor: '#fff',

  },

  brandText: {
    fontFamily: 'Avenir Next',
    fontSize: 22,
  },

  headerPriceMagnifyingGlassRow: {
    flex: 1.5,
    flexDirection: 'row', justifyContent: 'space-between', 
    paddingTop: 2,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 0,
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
    fontSize: 14,
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
    fontFamily: 'Avenir Next',
    fontWeight: "bold",
    paddingBottom: 20,
},

hideModal: {
  paddingTop: 40,
  fontSize: 20,
  color: 'green',
  fontWeight:'bold'
},

reportInput: {width: 200, height: 160, marginBottom: 50, borderColor: darkBlue, borderWidth: 2},


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

optionalDescriptionRow: {
  // alignItems: 'center'
  paddingVertical: 5,
  paddingHorizontal: 5
},

descriptionHeaderContainer: {flex: 0.2,justifyContent: 'center', alignItems: 'flex-start', paddingHorizontal: 0},

descriptionHeader: new avenirNextText('black', 24, "500") ,

descriptionContainer: {
  justifyContent: 'flex-start'
},

description: {textAlign: 'justify', ...new avenirNextText(graphiteGray, 18, "300") },

////Purchase Modal Stuff


///////////////////////////
///////////////////////////
///////////////////////////
//Initial Screen


////////////
////////////
///////////
///////////
///////////

deliveryOptionModal: {
  backgroundColor: "#fff",
  flex: 1,
  marginTop: 22
},

deliveryOptionHeader: {
  flex: 0.1,
  //TODO: find nottGreen hex code
  backgroundColor: lightGreen,
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'row',
  paddingHorizontal: 12,
},

backIconContainer: {
  flex: 0.4,
  // justifyContent: 'flex-start',
  // alignItems: 'center'
},

logoContainer: {
  flex: 0.6,
  // justifyContent: 'flex-start',
  // alignItems: 'center',
  // backgroundColor: 'red'
  // width: 40,
  // height: 40
},

logo: {
  width: 45,
  height: 45,
},

deliveryOptionBody: {
  flex: 0.75,
  padding: 10,
  // alignItems: 'center'
  // backgroundColor: ''
},

deliveryOptionContainer: {
  flexDirection: 'row',
  
  padding: 10
},

radioButtonContainer: {
  paddingHorizontal: 10,
  // justifyContent: 'space',
  alignItems: 'center',
},

radioButton: {
  width: 30,
  height: 30,
  borderRadius: 15,
  borderWidth: 0.5,
  borderColor: 'black',
  backgroundColor: '#fff',
  justifyContent: 'center',
  alignItems: 'center'
},

deliveryOptionTextContainer: {
  paddingHorizontal: 10,
  alignItems: 'flex-start'
},


///////////////////////////
///////////////////////////
///////////////////////////
//collectionInPerson Screen


////////////
////////////
///////////
///////////
///////////

///////////////////////////
///////////////////////////
///////////////////////////
//postalDeliveryScreen

collectionInPersonContainer: {
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 10
},

collectionInPersonButton: {
  width: 270,
  height: 60,
  borderRadius: 15,
  backgroundColor: lightGreen,
  justifyContent: 'center',
  // alignItems: 'center'
},

collectionInPersonOptionsContainer: {
  flexDirection: 'row',
  padding: 5,
  justifyContent: 'space-evenly',
  alignItems: 'center'
},

addressesContainer: {
  paddingHorizontal: 10,
  justifyContent: 'space-evenly',
},

addressContainerButton: {
  width: 260,
  height: 50,
  backgroundColor: bobbyBlue,
  borderRadius: 5,
},

addressContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 10,
},

addressText: new avenirNextText("black", 18, "300"),

addDeliveryAddressButton: {
  width: 270,
  height: 40,
  borderRadius: 15,
  backgroundColor: treeGreen,
},

addressForm: {
  paddingHorizontal: 10,
  // justifyContent: '',
  

},

addressField: {
  alignItems: 'flex-start',
},
////////////
////////////
///////////
///////////
///////////



} )


/////////////////

const profileRowStyles = StyleSheet.create( {
  rowContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'center'
  },


  profilepic: {
    borderWidth:0,
    // borderColor:'#207011',
    // alignItems:'center',
    // justifyContent:'center',
    // width:70,
    height:80,
    backgroundColor:'#fff',
    borderRadius:80/2,

},

textContainer: {
  flex: 1,
  flexDirection: 'column',
  alignContent: 'center',
  padding: 5,
},

name: {
  fontSize: 18,
  fontFamily: 'Avenir Next',
  fontWeight: '400'
},

email: {
  //actually this is for your country location value
    fontSize: 18,
    fontFamily: 'Avenir Next',
    fontWeight: '200',
    fontStyle: 'italic'
  },
  
insta: {
    fontSize: 14,
    fontFamily: 'Avenir Next',
    color: '#800000',
    fontWeight: '600',
    fontStyle: 'normal'
  },  

separator: {
  height: 1,
  backgroundColor: 'black',
  padding: 2,
},

} )
