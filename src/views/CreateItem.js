import React, { Component } from 'react'
import { Dimensions, Platform, Text, TextInput, StyleSheet, View, TouchableHighlight, KeyboardAvoidingView, ScrollView, Picker, TouchableWithoutFeedback, Keyboard } from 'react-native'
import {withNavigation} from 'react-navigation';
import { Jiro } from 'react-native-textinput-effects';
// import NumericInput from 'react-native-numeric-input' 
import {Button, ButtonGroup, Divider} from 'react-native-elements';
import RNFetchBlob from 'react-native-fetch-blob';
import MultipleAddButton from '../components/MultipleAddButton';
import CustomModalPicker from '../components/CustomModalPicker';
import ProductLabel from '../components/ProductLabel.js';
// import {signInContainer} from '../styles.js';
import firebase from '../cloud/firebase.js';
// import Chatkit from "@pusher/chatkit";
// import { CHATKIT_SECRET_KEY, CHATKIT_INSTANCE_LOCATOR, CHATKIT_TOKEN_PROVIDER_ENDPOINT } from '../credentials/keys';
import * as Animatable from 'react-native-animatable';
import { iOSColors } from 'react-native-typography';
import { PacmanIndicator } from 'react-native-indicators';
import { confirmBlue, woodBrown, rejectRed, optionLabelBlue, aquaGreen, treeGreen, avenirNext, darkGray, lightGray, darkBlue, lightGreen, highlightYellow, profoundPink } from '../colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DismissKeyboardView, WhiteSpace, GrayLine } from '../localFunctions/visualFunctions';
import { avenirNextText } from '../constructors/avenirNextText';


const darkGreen = '#0d4f10';
const limeGreen = '#2e770f';
// const slimeGreen = '#53b73c';
const categoryColors = [darkBlue, profoundPink, treeGreen]

const {height, width} = Dimensions.get('window');

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

function incrementPrice(previousState, currentProps) {
    return { uri: previousState.price + 1 } 
}

class CreateItem extends Component {
  constructor(props) {
      super(props);

    //   const {params} = this.props.navigation.state
    //   const pictureuris = params.pictureuris ? params.pictureuris : 'nothing here'
    //Data that navigates to this component from other components:

      this.state = {
          uri: undefined,
          name: '',
          brand: '', //empty or value selected from list of brands
          price: 0,
          original_price: 0,
          size: 2,
          type: 'Trousers',
          gender: 2,
          condition: 'Slightly Used',
          insta: '',
          description: '',
          typing: true,
          isUploading: false,
          pictureuris: 'nothing here'
      }
  }

//   componentDidMount() {
//     const {params} = this.props.navigation.state
//     const pictureuris = params ? params.pictureuris : 'nothing here'
//     this.setState({pictureuris});
//   }

  showPicker(gender, subheading) {
    if (gender == 0) {
        return ( 
            <Picker style={styles.picker} itemStyle={[styles.pickerText, styles.men]} selectedValue = {this.state.type} onValueChange={ (type) => {this.setState({type})} } >
               <Picker.Item label = "Formal Shirts" value = "Formal Shirts" />
               <Picker.Item label = "Casual Shirts" value = "Casual Shirts" />
               <Picker.Item label = "Jackets" value = "Jackets" />
               <Picker.Item label = "Suits" value = "Suits" />
               <Picker.Item label = "Trousers" value = "Trousers" />
               <Picker.Item label = "Jeans" value = "Jeans" />
               <Picker.Item label = "Shoes" value = "Shoes" />
            </Picker>
        )
    }

    else if (gender == 1) {
        return (
            <Picker style={styles.picker} itemStyle={[styles.pickerText, styles.accessories]} selectedValue = {this.state.type} onValueChange={ (type) => {this.setState({type})} } >
               <Picker.Item label = "Watches" value = "Watches" />
               <Picker.Item label = "Bracelets" value = "Bracelets" />
               <Picker.Item label = "Jewellery" value = "Jewellery" />
               <Picker.Item label = "Sunglasses" value = "Sunglasses" />
               <Picker.Item label = "Handbags" value = "Handbags" />
            </Picker>
        )
    }

    else if (gender == 2) {
        return (
            <Picker style={styles.picker} itemStyle={[styles.pickerText, styles.women]} selectedValue = {this.state.type} onValueChange={ (type) => {this.setState({type})} } >
               <Picker.Item label = "Tops" value = "Tops" />
               <Picker.Item label = "Skirts" value = "Skirts" />
               <Picker.Item label = "Dresses" value = "Dresses" />
               <Picker.Item label = "Jeans" value = "Jeans" />
               <Picker.Item label = "Jackets" value = "Jackets" />
               <Picker.Item label = "Coats" value = "Coats" />
               <Picker.Item label = "Trousers" value = "Trousers" />
            </Picker>
        )
    } 
}

//Nav to Fill In:

//1. Price and Original Price
navToFillPrice = (sellingPriceBoolean) => {
    this.props.navigation.navigate('PriceSelection', {sellingPrice: sellingPriceBoolean})
}

//2. Type and Condition
navToFillConditionOrType = (gender, showProductTypes) => {
    this.props.navigation.navigate('ConditionSelection', {gender: gender, showProductTypes: showProductTypes});
}

helpUserFillDetails = () => {

    // alert(`Please enter details for the following fields:\n${this.state.name ? name}`)
}

updateFirebaseAndNavToProfile = (pictureuris, mime = 'image/jpg', uid) => {
        
    // if(priceIsWrong) {
    //     alert("You must a choose a non-zero positive real number for the selling price/retail price of this product");
    //     return;
    // }

    //Locally stored in this component:
    var {name, brand, type, price, original_price, description, condition, gender, size, } = this.state;

    this.setState({isUploading: true});
    // : if request.auth != null;
    var gender;
    switch(gender) {
        case 0:
            gender = 'Men'
            break; 
        case 1:
            gender = 'Accessories'
            break;
        case 2:
            gender = 'Women'
            break;
        default:
            gender = 'Men'
            console.log('no gender was specified')
    }

    switch(size) {
        case 0:
            size = 'Extra Small'
            break; 
        case 1:
            size = 'Small'
            break;
        case 2:
            size = 'Medium'
            break;
        case 3:
            size = 'Large'
            break;
        case 4:
            size = 'Extra Large'
            break;
        case 5:
            size = 'Extra Extra Large'
            break;
        default:
            size = 'Medium'
            console.log('no gender was specified')
    }

    var postData = {
        name: name,
        brand: brand,
        price: price,
        original_price: original_price ? original_price : 'Seller did not list original price',
        type: type,
        size: size,
        description: description ? description : 'Seller did not specify a description',
        gender: gender,
        condition: condition,
        sold: false,
        likes: 0,
        comments: '',
        time: Date.now(),
        dateSold: ''
      };
  
    var newPostKey = firebase.database().ref().child(`Users/${uid}/products`).push().key;
    
    var updates = {};
    updates['/Users/' + uid + '/products/' + newPostKey + '/'] = postData;
    //this.createRoom(newPostKey);
    

    return {
        database: firebase.database().ref().update(updates),
        storage: this.uploadToStore(pictureuris, uid, newPostKey)
    }

}

  uploadToStore = (pictureuris, uid, newPostKey) => {
    //sequentially add each image to cloud storage (pay attention to .child() method) 
    //and then retrieve url to upload on realtime db
    var picturesProcessed = 0;  
    pictureuris.forEach( (uri, index, array) => {
        
        var storageUpdates = {};
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
        let uploadBlob = null
        const imageRef = firebase.storage().ref().child(`Users/${uid}/${newPostKey}/${index}`);
        fs.readFile(uploadUri, 'base64')
        .then((data) => {
        return Blob.build(data, { type: `${mime};BASE64` })
        })
        .then((blob) => {
        console.log('got to blob')
        uploadBlob = blob
        return imageRef.put(blob, { contentType: mime })
        })
        .then(() => {
        uploadBlob.close()
        return imageRef.getDownloadURL()
        })
        .then((url) => {
            console.log(url);
            storageUpdates['/Users/' + uid + '/products/' + newPostKey + '/uris/' + index + '/'] = url;
            firebase.database().ref().update(storageUpdates);
            picturesProcessed++;
            if(picturesProcessed == array.length) {
                this.callBackForProductUploadCompletion();
            }
        })

    } )

    // for(const uri of pictureuris) {
    //     var i = 0;
    //     console.log(i);
        
    //     const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
    //     let uploadBlob = null
    //     const imageRef = firebase.storage().ref().child(`Users/${uid}/${newPostKey}/${i}`);
    //     fs.readFile(uploadUri, 'base64')
    //     .then((data) => {
    //     return Blob.build(data, { type: `${mime};BASE64` })
    //     })
    //     .then((blob) => {
    //     console.log('got to blob')
    //     i++;
    //     uploadBlob = blob
    //     return imageRef.put(blob, { contentType: mime })
    //     })
    //     .then(() => {
    //     uploadBlob.close()
    //     return imageRef.getDownloadURL()
    //     })
    //     .then((url) => {
    //         console.log(url);
    //     })
        
        
    // }
  }

  callBackForProductUploadCompletion = () => {
    alert(`Product named ${this.state.name} successfully uploaded to Market!`)
    // alert(`Your product ${this.state.name} is being\nuploaded to the market.\nPlease do not resubmit the same product.`);
    //TODO: example of how in this instance we needed to remove pictureuris if its sitting in the navigation params
    this.props.navigation.setParams({pictureuris: 'nothing here'});
    
    this.setState({ 
        uri: undefined,
        name: '',
        brand: '',
        price: 0,
        original_price: 0,
        size: 2,
        type: 'Trousers',
        gender: 2,
        condition: 'Slightly Used',
        insta: '',
        description: '',
        typing: true,
        isUploading: false,
                 });
    this.props.navigation.navigate('Profile'); 
  }

  getColorFor = (c) => {
      var color;
      switch(c) {
          case "New With Tags":
            color = 'black';
            break;
          case "New Without Tags":
            color = 'black';
            break;
          case "Slightly Used":
            color = 'black';
            break;
          case "Used":
            color = 'black'
            break;
          default:
            color = 'black'
      }
      return color;
  }

//   createRoom(key) {
//     //create a new room with product id, and add buyer as member of room.  
//     const CHATKIT_USER_NAME = firebase.auth().currentUser.uid;
//     // This will create a `tokenProvider` object. This object will be later used to make a Chatkit Manager instance.
//     const tokenProvider = new Chatkit.TokenProvider({
//         url: CHATKIT_TOKEN_PROVIDER_ENDPOINT
//       });
  
//     // This will instantiate a `chatManager` object. This object can be used to subscribe to any number of rooms and users and corresponding messages.
//     // For the purpose of this example we will use single room-user pair.
//     const chatManager = new Chatkit.ChatManager({
//     instanceLocator: CHATKIT_INSTANCE_LOCATOR,
//     userId: CHATKIT_USER_NAME,
//     tokenProvider: tokenProvider
//     });

    
//     //In order to subscribe to the messages this user is receiving in this room, we need to `connect()` the `chatManager` and have a hook on `onNewMessage`. There are several other hooks that you can use for various scenarios. A comprehensive list can be found [here](https://docs.pusher.com/chatkit/reference/javascript#connection-hooks).
//     chatManager.connect().then(currentUser => { 
//         this.currentUser = currentUser;
//         this.currentUser.createRoom({
//             name: key,
//             private: false,
//             addUserIds: null
//           }).then(room => {
//             console.log(`Created room called ${room.name}`)
//           })
//           .catch(err => {
//             console.log(`Error creating room ${err}`)
//           })
//     })
//   }


  render() {
    const {navigation} = this.props;
    const {isUploading} = this.state;
    const uid = firebase.auth().currentUser.uid; 
    

    // List of values we navigate to CreateItem from other components:
    var pictureuris = navigation.getParam('pictureuris', 'nothing here');
    var price = navigation.getParam('price', 0);
    var original_price = navigation.getParam('original_price', 0);
    var condition = navigation.getParam('condition', false); 
    var type = navigation.getParam('type', false); 
    // console.log(condition);
    ////

    ///
    ///If there is a change in this.state.gender, remove the product type value

    ///

    //When the condition to submit a product has partially been satisfied:
    var partialConditionMet = (this.state.name) || (this.state.brand) || ( (Number.isFinite(price)) && (price > 0) && (price < 1001) ) || ( (Array.isArray(pictureuris) && pictureuris.length >= 1) );
    //The full condition for when a user is allowed to upload a product to the market
    var conditionMet = (this.state.name) && (this.state.brand) && (Number.isFinite(price)) && (price > 0) && (price < 1001) && (Array.isArray(pictureuris) && pictureuris.length >= 1)
    //var priceIsWrong = (original_price != '') && ((price == 0) || (price.charAt(0) == 0 ) || (original_price == 0) || (original_price.charAt(0) == 0) )

    //console.log(priceIsWrong);
    //console.log(pictureuri);
    //this.setState({uri: params.uri})
    //this.setState(incrementPrice);
    //const picturebase64 = params.base64;
    //console.log(pictureuri);

    if(isUploading) {
        return (
            <View style={{marginTop: 22, flex: 1, justifyContent: 'center', backgroundColor: '#fff'}}>
                <View style={{height: 200, justifyContent: 'center', alignContent: 'center'}}>
                    <PacmanIndicator color='#800000' />
                    <Text style={{paddingVertical: 1, paddingHorizontal: 10, fontFamily: 'Avenir Next', fontSize: 18, fontWeight: '500', color: '#800000', textAlign: 'center'}}>
                        Your product {this.state.name} is being uploaded to the market. Please do not resubmit the same product.
                    </Text>
                </View>
                
            </View>
        )
    }

    return (
      
    
        <ScrollView
            
             contentContainerStyle={styles.contentContainer}
        >

            <Divider style={{  backgroundColor: '#fff', height: 12 }} />
        {/* 1. Product Pictures */}
            <Text style={{fontFamily: avenirNext, textAlign: 'center', color: optionLabelBlue}}>Picture(s) of Product:</Text>
            <Divider style={{  backgroundColor: '#fff', height: 8 }} />

            <MultipleAddButton navToComponent = {'CreateItem'} pictureuris={pictureuris}/>

            <WhiteSpace height={10}/>
            
        {/* 0. Gender */}
            <ProductLabel size={15} color={'black'} title='Category'/>
            <ButtonGroup
                onPress={ (index) => {
                    if(index != this.state.gender) {
                        navigation.setParams({type: false});
                        // type = '';
                        this.setState({gender: index});
                    }
                    
                    }}
                selectedIndex={this.state.gender}
                buttons={ ['Men', 'Women', 'Accessories'] }
                containerStyle={styles.buttonGroupContainer}
                buttonStyle={styles.buttonGroup}
                textStyle={styles.buttonGroupText}
                selectedTextStyle={styles.buttonGroupSelectedText}
                selectedButtonStyle={styles.buttonGroupSelectedContainer}
            />
            {/* Type of clothing */}
            

            <TouchableHighlight underlayColor={'#fff'} style={styles.navToFillDetailRow} onPress={() => this.navToFillConditionOrType(this.state.gender, showProductTypes = true)}>
            <View style={styles.navToFillDetailRow}>
                
                <View style={[styles.detailHeaderContainer, {flex: type ? 0.35 : 0.8}]}>
                    <Text style={styles.detailHeader}>Type</Text>
                </View>

                {type?
                <View style={[styles.displayedPriceContainer, {flex: 0.45}]}>
                    <Text style={[styles.displayedCondition, {color: categoryColors[this.state.gender], fontWeight: "300"}]}>{type}</Text>
                </View>
                :
                null
                }

                <View style={[styles.navToFillDetailIcon, {flex: 0.2 }]}>
                    <Icon 
                    name="chevron-right"
                    size={40}
                    color='black'
                    />
                </View>

            </View>
            </TouchableHighlight>

            <GrayLine/>

            
        
        
            {/* <Image
            style={{width: '25%', height: '25%', opacity: 1.0}} 
            source={ {uri: pictureuri} } />
            <Image
            style={{width: '25%', height: '25%', opacity: 0.7}} 
            source={ require('../images/blank.jpg') } /> */}
        {/* 2. Product Name */}

        {/* TODO: Somehow prevent the user from having to scroll lower to see their input */}
            <View style={{paddingHorizontal: 7, justifyContent: 'center', alignItems: 'flex-start'}}>
                <TextInput
                style={{height: 50, width: 280, fontFamily: 'Avenir Next', fontSize: 20}}
                placeholder={"Name (e.g. zip-up hoodie)"}
                placeholderTextColor={lightGray}
                onChangeText={(name) => this.setState({name})}
                value={this.state.name}
                multiline={false}
                maxLength={16}
                autoCorrect={false}
                autoCapitalize={'words'}
                clearButtonMode={'while-editing'}
                />         
            </View>

            <WhiteSpace height={4}/>

            {/* Product Description/Material */}
            
            <GrayLine/>


            <DismissKeyboardView>

            <View style={styles.descriptionContainer}>

                <View style={styles.descriptionHeaderContainer}>
                    <Text style={styles.descriptionHeader}>Description</Text>
                </View>

                <WhiteSpace height={1}/>

                <View style={styles.descriptionInputContainer}>

                    <TextInput
                        style={styles.descriptionInput}
                        placeholder={"(Optional) For Example, This product has a few flaws which should be evident in the item's pictures"}
                        placeholderTextColor={lightGray}
                        onChangeText={(description) => this.setState({description})}
                        value={this.state.description}
                        multiline={true}
                        numberOfLines={4}
                        scrollEnabled={true}
                    />

                </View>

                

            </View>

            </DismissKeyboardView>

            <WhiteSpace height={1.5}/>

            <GrayLine/>

            {/* Original Price */}
            <TouchableHighlight underlayColor={'#fff'} style={styles.navToFillDetailRow} onPress={() => this.navToFillPrice(false)}>
            <View style={styles.navToFillDetailRow}>
                
                <View style={[styles.detailHeaderContainer, {flex: original_price > 0 ? 0.5 : 0.8}]}>
                    <Text style={styles.detailHeader}>Retail price (Optional)</Text>
                </View>

                {original_price > 0 ?
                <View style={[styles.displayedPriceContainer, {flex: 0.3}]}>
                    <Text style={styles.displayedPrice}>£{original_price}</Text>
                </View>
                :
                null
                }

                <View style={[styles.navToFillDetailIcon, {flex: original_price > 0 ? 0.2 : 0.2 }]}>
                    <Icon 
                    name="chevron-right"
                    size={40}
                    color='black'
                    />
                </View>

            </View>
            </TouchableHighlight>

            <GrayLine/>

        {/* Product Price.  */}


            <TouchableHighlight underlayColor={'#fff'} style={styles.navToFillDetailRow} onPress={() => this.navToFillPrice(true)}>
            <View style={styles.navToFillDetailRow}>
                
                <View style={[styles.detailHeaderContainer, {flex: price > 0 ? 0.5 : 0.8}]}>
                    <Text style={styles.detailHeader}>Selling price</Text>
                </View>

                {price > 0 ?
                <View style={[styles.displayedPriceContainer, {flex: 0.3}]}>
                    <Text style={[styles.displayedPrice, {color: treeGreen}]}>£{price}</Text>
                </View>
                :
                null
                }

                <View style={[styles.navToFillDetailIcon, {flex: price > 0 ? 0.2 : 0.2 }]}>
                    <Icon 
                    name="chevron-right"
                    size={40}
                    color='black'
                    />
                </View>

            </View>
            </TouchableHighlight>

            <GrayLine/>
                
            {/* Brand */}
            <View style={{paddingHorizontal: 7, justifyContent: 'center', alignItems: 'flex-start'}}>
                <TextInput
                style={{height: 50, width: 280, fontFamily: 'Avenir Next', fontSize: 20, fontWeight: "500"}}
                placeholder={"Brand (e.g. Hollister Co.)"}
                placeholderTextColor={lightGray}
                onChangeText={(brand) => this.setState({brand})}
                value={this.state.brand}
                multiline={false}
                maxLength={12}
                autoCorrect={false}
                autoCapitalize={'words'}
                clearButtonMode={'while-editing'}
                />         
            </View>

            

            <GrayLine/>

            <WhiteSpace height={8}/>

            {/* Size */}
            <ProductLabel color={'black'} title='Select a Size'/> 
            <ButtonGroup
                onPress={ (index) => {this.setState({size: index})}}
                selectedIndex={this.state.size}
                buttons={ ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }
                containerStyle={styles.buttonGroupContainer}
                buttonStyle={styles.buttonGroup}
                textStyle={styles.buttonGroupText}
                selectedTextStyle={styles.buttonGroupSelectedText}
                selectedButtonStyle={styles.buttonGroupSelectedContainer}
            />

            <WhiteSpace height={5}/>

            <GrayLine/>


            <TouchableHighlight underlayColor={'#fff'} style={styles.navToFillDetailRow} onPress={() => this.navToFillConditionOrType(this.state.gender, false)}>
            <View style={styles.navToFillDetailRow}>
                
                <View style={[styles.detailHeaderContainer, {flex: condition ? 0.35 : 0.8}]}>
                    <Text style={styles.detailHeader}>Condition</Text>
                </View>

                {condition?
                <View style={[styles.displayedPriceContainer, {flex: 0.45}]}>
                    <Text style={[styles.displayedCondition, { fontWeight: "200"}]}>{condition}</Text>
                </View>
                :
                null
                }

                <View style={[styles.navToFillDetailIcon, {flex: 0.2 }]}>
                    <Icon 
                    name="chevron-right"
                    size={40}
                    color='black'
                    />
                </View>

            </View>
            </TouchableHighlight>

            <GrayLine/>

            <WhiteSpace height={15} />       
            
            <View style={ {alignItems: 'center'} }>
                <Button
                large
                disabled = { partialConditionMet ? false : true}
                buttonStyle={{
                    backgroundColor: conditionMet ? "#22681d" : highlightYellow,
                    width: 280,
                    height: 80,
                    borderColor: "transparent",
                    borderWidth: 0,
                    borderRadius: 5,
                }}
                icon={{name: 'check-all', type: 'material-community'}}
                title='SUBMIT TO MARKET'
                onPress={() => {
                    conditionMet ?  
                    this.updateFirebaseAndNavToProfile(pictureuris, mime = 'image/jpg', uid)
                    :
                    this.helpUserFillDetails()
                                } } 
                />
            </View>

            <Divider style={{  backgroundColor: '#fff', height: 10 }} />
            
            

         </ScrollView>
         
         
        
      
    )
  }
}

const styles = StyleSheet.create({
    contentContainer: {
        flexGrow: 1, 
        backgroundColor: '#fff',
        flexDirection: 'column',
        justifyContent: 'space-between',
        // alignContent:'center',
        // alignItems: 'center',
        paddingTop: 15
          
    },

    descriptionContainer: {paddingVertical: 4, paddingHorizontal: 3},

    descriptionHeaderContainer: {flex: 0.2,justifyContent: 'center', alignItems: 'flex-start', paddingHorizontal: 6},

    descriptionHeader: {fontFamily: 'Avenir Next', fontSize: 18, color: darkGray},

    descriptionInputContainer: {flex: 0.8, justifyContent: 'center', alignItems: 'flex-start', paddingVertical: 2, paddingHorizontal: 6,},

    descriptionInput: {width: 260, height: 60, marginBottom: 10, borderColor: treeGreen, borderWidth: 0},

    navToFillDetailRow: {
        // backgroundColor: 'red',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 4,
        paddingHorizontal: 4
        // height: 
    },

    navToFillDetailIcon: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },

    detailHeaderContainer: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingVertical: 3
    },

    detailHeader: {
        fontFamily: 'Avenir Next',
        fontWeight: '400',
        fontSize: 22,
    },

    displayedPriceContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end'
    },

    displayedPrice: {
        fontFamily: avenirNext,
        fontSize: 21,
        fontWeight: '600',
        color: darkGray

    },

    displayedCondition: new avenirNextText('#800000', 16, "200"),

    imageadder: {
        flexDirection: 'row'
    },

    promptText: {fontSize: 12, fontStyle: 'normal', textAlign: 'center'},

    modalPicker: {
        flexDirection: 'column',
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    subHeading: {
        fontFamily: avenirNext,
        color: '#0c5759',
        fontSize: 15,
        textDecorationLine: 'underline',
    },

    picker: {
        width: 280,
        // justifyContent: 'center',
        // alignContent: 'center',
        //alignItems: 'center'
        // height: height/2
    },

    pickerText: {
        fontFamily: avenirNext,
        fontSize: 22,
        fontWeight: 'bold'
    },

    men: {
        color: confirmBlue
    },

    accessories: {
        color: woodBrown
    },

    women: {
        color: rejectRed
    },

    optionSelected: {
        fontFamily: avenirNext,
        fontWeight: 'bold',
        fontSize: 18,
        color: '#0c5925'
    },

    buttonGroupText: {
        fontFamily: 'Avenir Next',
        fontSize: 14,
        fontWeight: '300',
    },

    buttonGroupSelectedText: {
        color: 'black'
    },

    buttonGroupContainer: {
        height: 40,
        backgroundColor: iOSColors.lightGray
    },
    
    buttonGroupSelectedContainer: {
        backgroundColor: aquaGreen
    },
})

export default withNavigation(CreateItem)

{/* <View style={styles.modalPicker}>
                <CustomModalPicker subheading={'Product Condition:'}>
                    <Picker style={styles.picker} itemStyle={[styles.pickerText, {color: 'black'}]} selectedValue = {this.state.condition} onValueChange={ (condition) => {this.setState({condition})} } >
                        <Picker.Item label = "New With Tags" value = "New With Tags" />
                        <Picker.Item label = "New Without Tags" value = "New Without Tags" />
                        <Picker.Item label = "Slightly Used" value = "Slightly Used" />
                        <Picker.Item label = "Used" value = "Used" />
                    </Picker>
                </CustomModalPicker> 
                <Text style={styles.optionSelected}>{this.state.condition}</Text>
            </View> */}

{/* <TextField 
                label="Optional Description (e.g. Great for chilly weather)"
                value={this.state.description}
                onChangeText = { (desc)=>{this.setState({description: desc})}}
                multiline = {true}
                characterRestriction = {180}
                textColor={basicBlue}
                tintColor={darkGreen}
                baseColor={darkBlue}
            /> */}


// <View style={styles.modalPicker}>
//     <CustomModalPicker subheading={'Product Type:'}>
//         {this.showPicker(this.state.gender)}        
//     </CustomModalPicker>
//     <Text style={styles.optionSelected}>{this.state.type}</Text>
// </View> 
// {/* product age (months) */}
// <View style = { {alignItems: 'center', flexDirection: 'column'} } >
// <NumericInput 
//    value={this.state.months} 
//    onChange={months => this.setState({months})} 
//    type='plus-minus'
//    initValue={0}
//    minValue={0}
//    maxValue={200}
//    totalWidth={240} 
//    totalHeight={50} 
//    iconSize={25}
//    valueType='real'
//    rounded 
//    textColor='black' 
//    iconStyle={{ color: 'white' }} 
//    upDownButtonsBackgroundColor='#E56B70'
//    rightButtonBackgroundColor={limeGreen} 
//    leftButtonBackgroundColor={darkGreen}
//    containerStyle={ {justifyContent: 'space-evenly', padding: 10,} }    
//    />
// <Text> Months since you bought the product </Text>
// </View>


{/* <Jiro
                    label={'Name (e.g. )'}
                    value={this.state.name}
                    onChangeText={name => this.setState({ name })}
                    maxLength={16}
                    autoCorrect={false}
                    autoCapitalize={'words'}
                    
                    // this is used as active border color
                    borderColor={treeGreen}
                    // this is used to set backgroundColor of label mask.
                    // please pass the backgroundColor of your TextInput container.
                    backgroundColor={'#F9F7F6'}
                    inputStyle={{ color: 'black' }}
                /> */}
