import React, { Component } from 'react'
import { Dimensions, Platform, Text, StyleSheet, View, Image, KeyboardAvoidingView, ScrollView, Picker } from 'react-native'
import {withNavigation} from 'react-navigation';
import { Hoshi, Jiro } from 'react-native-textinput-effects';
import { TextField } from 'react-native-material-textfield';
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
import { material, iOSColors } from 'react-native-typography';
import { PacmanIndicator } from 'react-native-indicators';
import { confirmBlue, woodBrown, rejectRed, darkBlue, optionLabelBlue, treeGreen } from '../colors';

const babyBlue='#94c2ed';
const basicBlue = '#2c7dc9'
const darkGreen = '#0d4f10';
const limeGreen = '#2e770f';
// const slimeGreen = '#53b73c';

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
      this.state = {
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
      }
  }

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

updateFirebaseAndNavToProfile = (data, pictureuris, mime = 'image/jpg', uid, imageName) => {
        
    // if(priceIsWrong) {
    //     alert("You must a choose a non-zero positive real number for the selling price/retail price of this product");
    //     return;
    // }
    

    this.setState({isUploading: true});
    // : if request.auth != null;
    var gender;
    switch(data.gender) {
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

    switch(data.size) {
        case 0:
            data.size = 'Extra Small'
            break; 
        case 1:
            data.size = 'Small'
            break;
        case 2:
            data.size = 'Medium'
            break;
        case 3:
            data.size = 'Large'
            break;
        case 4:
            data.size = 'Extra Large'
            break;
        case 5:
            data.size = 'Extra Extra Large'
            break;
        default:
            data.size = 'Medium'
            console.log('no gender was specified')
    }

    var postData = {
        name: data.name,
        brand: data.brand,
        price: data.price,
        original_price: data.original_price ? data.original_price : 'Seller did not list original price',
        type: data.type,
        size: data.size,
        description: data.description ? data.description : 'Seller did not specify a description',
        gender: gender,
        condition: data.condition,
        sold: false,
        likes: 0,
        comments: '',
        time: Date.now(),
        
      };
  
    var newPostKey = firebase.database().ref().child(`Users/${uid}/products`).push().key;
    
    var updates = {};
    updates['/Users/' + uid + '/products/' + newPostKey + '/'] = postData;
    //this.createRoom(newPostKey);
    

    return {database: firebase.database().ref().update(updates),
            storage: this.uploadToStore(pictureuris, uid, newPostKey)}

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
    alert(`Your product ${this.state.name} is being\nuploaded to the market.\nPlease do not resubmit the same product.`);
    this.setState({ uri: undefined,
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
                    isUploading: false, });
    this.props.navigation.navigate('Profile'); 
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
    const {isUploading, price, original_price} = this.state;
    const uid = firebase.auth().currentUser.uid; 
    const {params} = this.props.navigation.state
    const pictureuris = params ? params.pictureuris : 'nothing here'
    //const picturebase64 = params ? params.base64 : 'nothing here'
    //Lenient condition, Array.isArray(pictureuris) && pictureuris.length >= 1
    var conditionMet = (this.state.name) && (this.state.price > 0) && (Array.isArray(pictureuris) && pictureuris.length >= 1)
    //var priceIsWrong = (original_price != '') && ((price == 0) || (price.charAt(0) == 0 ) || (original_price == 0) || (original_price.charAt(0) == 0) )

    //console.log(priceIsWrong);
    //console.log(pictureuri);
    //this.setState({uri: params.uri})
    //this.setState(incrementPrice);
    //const picturebase64 = params.base64;
    //console.log(pictureuri);

    if(isUploading) {
        return (
            <View style={{flex: 1}}>
                <PacmanIndicator color='#800000' />
            </View>
        )
    }

    return (
      
    
        <ScrollView
            
             contentContainerStyle={styles.contentContainer}
        >

            <Divider style={{  backgroundColor: '#fff', height: 12 }} />
        {/* 1. Product Pictures */}
            <Text style={{textAlign: 'center', color: optionLabelBlue}}>Picture(s) of Product:</Text>
            <Divider style={{  backgroundColor: '#fff', height: 8 }} />

            <MultipleAddButton navToComponent = {'CreateItem'} pictureuris={pictureuris}/>

            <Divider style={{  backgroundColor: '#fff', height: 18 }} />

        {/* 0. Gender */}
            <ProductLabel color={optionLabelBlue} title='Product Category'/>
            <ButtonGroup
                onPress={ (index) => {this.setState({gender: index})}}
                selectedIndex={this.state.gender}
                buttons={ ['Men', 'Accessories', 'Women'] }
                containerStyle={styles.buttonGroupContainer}
                buttonStyle={styles.buttonGroup}
                textStyle={styles.buttonGroupText}
                selectedTextStyle={styles.buttonGroupSelectedText}
                selectedButtonStyle={styles.buttonGroupSelectedContainer}
            />
            {/* Type of clothing */}
            

            <View style={styles.modalPicker}>
                <CustomModalPicker subheading={'Product Type:'}>
                    {this.showPicker(this.state.gender)}        
                </CustomModalPicker>
                <Text style={styles.optionSelected}>{this.state.type}</Text>
            </View>    
        
        
            {/* <Image
            style={{width: '25%', height: '25%', opacity: 1.0}} 
            source={ {uri: pictureuri} } />
            <Image
            style={{width: '25%', height: '25%', opacity: 0.7}} 
            source={ require('../images/blank.jpg') } /> */}
        {/* 2. Product Name */}
            <Jiro
                    label={'Name (e.g. Green zip up hoodie)'}
                    value={this.state.name}
                    onChangeText={name => this.setState({ name })}
                    autoCorrect={false}
                    // this is used as active border color
                    borderColor={treeGreen}
                    // this is used to set backgroundColor of label mask.
                    // please pass the backgroundColor of your TextInput container.
                    backgroundColor={'#F9F7F6'}
                    inputStyle={{ color: basicBlue }}
            />

            <Jiro
                    label={'Brand'}
                    value={this.state.brand}
                    onChangeText={brand => this.setState({ brand })}
                    autoCorrect={false}
                    // this is used as active border color
                    borderColor={babyBlue}
                    // this is used to set backgroundColor of label mask.
                    // please pass the backgroundColor of your TextInput container.
                    backgroundColor={'#F9F7F6'}
                    inputStyle={{ color: basicBlue }}
            />

            {/* Product Description/Material */}
            <TextField 
                label="Optional Description (e.g. Great for chilly weather)"
                value={this.state.description}
                onChangeText = { (desc)=>{this.setState({description: desc})}}
                multiline = {true}
                characterRestriction = {180}
                textColor={basicBlue}
                tintColor={darkGreen}
                baseColor={darkBlue}
            />

        {/* 3. Product Price */}

            <Jiro
                    label={'Selling Price (GBP)'}
                    value={this.state.price}
                    onChangeText={price => {
                        this.setState({ price })
                        } }
                    autoCorrect={false}
                    // this is used as active border color
                    borderColor={'#800000'}
                    // this is used to set backgroundColor of label mask.
                    // please pass the backgroundColor of your TextInput container.
                    backgroundColor={'#F9F7F6'}
                    inputStyle={{ color: '#800000' }}
                    keyboardType='numeric'
            />
            <Text>£{this.state.price}</Text>
            {/* Original Price */}
            <Jiro
                    label={'Retail Price (Optional)'}
                    value={this.state.original_price}
                    onChangeText={original_price => this.setState({ original_price })}
                    autoCorrect={false}
                    // this is used as active border color
                    borderColor={'#800000'}
                    // this is used to set backgroundColor of label mask.
                    // please pass the backgroundColor of your TextInput container.
                    backgroundColor={'#F9F7F6'}
                    inputStyle={{ color: '#800000' }}
                    keyboardType='numeric'
            />
            <Text>£{this.state.original_price}</Text>

            {/* Size */}
            <ProductLabel color={optionLabelBlue} title='Select a Size'/> 
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
            {/* product condition */}
            <Divider style={{  backgroundColor: '#fff', height: 12 }} />
            <View style={styles.modalPicker}>
                <CustomModalPicker subheading={'Product Condition:'}>
                    <Picker style={styles.picker} itemStyle={[styles.pickerText, {color: 'black'}]} selectedValue = {this.state.condition} onValueChange={ (condition) => {this.setState({condition})} } >
                        <Picker.Item label = "New With Tags" value = "New With Tags" />
                        <Picker.Item label = "New Without Tags" value = "New Without Tags" />
                        <Picker.Item label = "Slightly Used" value = "Slightly Used" />
                        <Picker.Item label = "Used" value = "Used" />
                    </Picker>
                </CustomModalPicker> 
                <Text style={styles.optionSelected}>{this.state.condition}</Text>
            </View>    
            <Divider style={{  backgroundColor: '#fff', height: 15 }} />
            
            
            <View style={ {alignItems: 'center'} }>
                <Button
                large
                disabled = { conditionMet ? false : true}
                buttonStyle={{
                    backgroundColor: "#22681d",
                    width: 280,
                    height: 80,
                    borderColor: "transparent",
                    borderWidth: 0,
                    borderRadius: 5,
                }}
                icon={{name: 'check-all', type: 'material-community'}}
                title='SUBMIT TO MARKET'
                onPress={() => { 
                    this.updateFirebaseAndNavToProfile(this.state, pictureuris, mime = 'image/jpg', uid , this.state.name);
                    
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
        ...material.subheading,
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
        fontFamily: 'Cochin',
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
        ...material.display1,
        fontWeight: 'bold',
        fontSize: 18,
        color: '#0c5925'
    },

    buttonGroupText: {
        ...material.display1,
        fontFamily: 'Iowan Old Style',
        fontSize: 17,
        fontWeight: '300',
    },

    buttonGroupSelectedText: {
        color: darkGreen
    },

    buttonGroupContainer: {
        height: 40,
        backgroundColor: iOSColors.lightGray
    },
    
    buttonGroupSelectedContainer: {
        backgroundColor: limeGreen
    },
})

export default withNavigation(CreateItem)

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