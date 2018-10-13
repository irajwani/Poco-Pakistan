import React, { Component } from 'react'
import { Platform, Text, StyleSheet, View, Image, KeyboardAvoidingView, ScrollView, Picker } from 'react-native'
import {withNavigation} from 'react-navigation';
import { Hoshi, Jiro } from 'react-native-textinput-effects';
import { TextField } from 'react-native-material-textfield';
import NumericInput from 'react-native-numeric-input'
import {Button, ButtonGroup, Divider} from 'react-native-elements';
import CustomModalPicker from '../components/CustomModalPicker';
import RNFetchBlob from 'react-native-fetch-blob';
import MultipleAddButton from '../components/MultipleAddButton';
import accounting from 'accounting'
import ProductLabel from '../components/ProductLabel.js';
import { material } from 'react-native-typography';
import firebase from '../cloud/firebase.js';
import Chatkit from "@pusher/chatkit";
import { CHATKIT_TOKEN_PROVIDER_ENDPOINT, CHATKIT_INSTANCE_LOCATOR, CHATKIT_SECRET_KEY } from '../credentials/keys';


const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

function incrementPrice(previousState, currentProps) {
    return { uri: previousState.price + 1 } 
}

class EditItem extends Component {
  constructor(props) {
      super(props);
      const {params} = this.props.navigation.state;
      const {text} = params.data;
      const postKey = params.data.key;
      const {name, brand, price, months} = text;
      switch(text.gender) {
        case 'Men':
            var gender = 0
            break; 
        case 'Accessories':
            var gender = 1
            break;
        case 'Women':
            var gender = 2
            break;
        default:
            var gender = 0
    }

    switch(text.size) {
        case 'Extra Small':
            text.size = 0
            break; 
        case 'Small':
            text.size = 1
            break;
        case 'Medium':
            text.size = 2
            break;
        case 'Large':
            text.size = 3
            break;
        case 'Extra Large':
            text.size = 4
            break;
        case 'Extra Extra Large':
            text.size = 5
            break;
        default:
            text.size = 2
    }

      this.state = {
          uri: undefined,
          name: name,
          brand: brand,
          price: price,
          original_price: text.original_price ? text.original_price : 0,
          size: text.size,
          type: text.type ? text.type : 'Trousers',
          gender: gender,
          condition: text.condition ? text.condition : 'Good',
          months: months,
          description: text.description ? text.description : '',
          typing: true,
          postKey: postKey,
      }
  }

  formatMoney(value) {
    return accounting.formatMoney(parseFloat(value));
  }

//   updateFirebaseStorage = (uri, mime = 'application/octet-stream', uid, name) => {
//     return (dispatch) => {
//         return new Promise((resolve, reject) => {
//             console.log('entered promise')
//             const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
//             const sessionId = new Date().getTime();
//             let uploadBlob = null;
//             const imageRef = firebase.storage().ref(`${uid}`).child(name);

//             fs.readFile(uploadUri, 'base64')
//             .then( (data) => {
//                 return Blob.build(data, {type: `${mime};BASE64`})
//             })
//             .then( (blob) => {
//                 uploadBlob = blob;
//                 return imageRef.put(blob, {contentType: mime })
//             })
//             .then( () => {
//                 uploadBlob.close();
//                 return imageRef.getDownloadURL();
//             })
//             .then( (url) => {resolve(url); console.log('done');} )
//             .catch( (err) => {reject(err); })
//         }
//     )
//     }
//   }

// updateFirebaseStorage(uri, mime = 'application/octet-stream', uid, name) {
    
        
//             console.log(uid + uri);
//             const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
//             //const uploadUri = uri;
//             const sessionId = new Date().getTime();
//             let uploadBlob = null;
//             const imageRef = firebase.storage().ref(`Users/${uid}`).child(name);

//             fs.readFile(uploadUri, 'base64')
//             .then( (data) => {
//                 console.log('got to data');
//                 return Blob.build(data, {type: `${mime};BASE64`})
//             })
//             .then( (blob) => {
//                 console.log('got to blob');
//                 uploadBlob = blob;
//                 return imageRef.put(blob, {contentType: mime })
//             })
//             .then( () => {
//                 uploadBlob.close();
//                 return imageRef.getDownloadURL();
//             })
            
        
    
//    }

showPicker(gender) {
    if (gender == 0) {
        return ( 
            <Picker selectedValue = {this.state.type} onValueChange={ (type) => {this.setState({type})} } >
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
            <Picker selectedValue = {this.state.type} onValueChange={ (type) => {this.setState({type})} } >
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
            <Picker selectedValue = {this.state.type} onValueChange={ (type) => {this.setState({type})} } >
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

updateFirebase = (data, pictureuris, mime = 'image/jpg', uid, imageName, postKey) => {
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
        months: data.months,
        sold: false,
        likes: 0,
        comments: '',
        time: Date.now(),
        
      };
  
    //var newPostKey = firebase.database().ref().child(`Users/${uid}/products`).push().key;
    
    var updates = {};
    updates['/Users/' + uid + '/products/' + postKey + '/'] = postData;
    //this.createRoom(newPostKey);
    

    return {
        database: firebase.database().ref().update(updates),
        storage: this.uploadToStore(pictureuris, uid, postKey)
           }

}

  uploadToStore = (pictureuris, uid, postKey) => {
    console.log(pictureuris);
    var storageUpdates;  
    pictureuris.forEach( (uri, index) => {
        
        storageUpdates = {};

        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
        //const uploadUri = uri
        let uploadBlob = null
        const imageRef = firebase.storage().ref().child(`Users/${uid}/${postKey}/${index}`);
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
            storageUpdates['/Users/' + uid + '/products/' + postKey + '/uris/' + index + '/'] = url;
            firebase.database().ref().update(storageUpdates);  
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

  deleteProduct(uid, key) {
    firebase.database().ref('/Users/' + uid + '/products/' + key + '/').remove( 
        ()=>{
        alert('Your product has been successfully deleted.\n Please restart the app and wait a few seconds for these changes to take effect.')
        this.props.navigation.navigate('ProfilePage');
    })
    .then( () => {
        console.log('product has been successfully removed')
    })
    .catch( (err)=> {
        console.log(err);
    });

  }

  createRoom(key) {
    //create a new room with product id, and add buyer as member of room.  

    const CHATKIT_USER_NAME = firebase.auth().currentUser.uid;
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

    
    //In order to subscribe to the messages this user is receiving in this room, we need to `connect()` the `chatManager` and have a hook on `onNewMessage`. There are several other hooks that you can use for various scenarios. A comprehensive list can be found [here](https://docs.pusher.com/chatkit/reference/javascript#connection-hooks).
    chatManager.connect().then(currentUser => { 
        this.currentUser = currentUser;
        this.currentUser.createRoom({
            name: key,
            private: false,
            addUserIds: null
          }).then(room => {
            console.log(`Created room called ${room.name}`)
          })
          .catch(err => {
            console.log(`Error creating room ${err}`)
          })
    })
  }


  render() {
    const uid = firebase.auth().currentUser.uid; 
    const {params} = this.props.navigation.state
    const pictureuris = params.pictureuris ? params.pictureuris : 'nothing here'
    console.log(pictureuris);
    //const picturebase64 = params ? params.base64 : 'nothing here'
    //Lenient condition, Array.isArray(pictureuris) && pictureuris.length >= 1
    var conditionMet = (this.state.name) && (this.state.months > 0) && (this.state.price > 0) && (Array.isArray(pictureuris) && pictureuris.length >= 1)
    console.log(conditionMet);
    //console.log(pictureuri);
    //this.setState({uri: params.uri})
    //this.setState(incrementPrice);
    //const picturebase64 = params.base64;
    //console.log(pictureuri);
    return (
      
    
        <ScrollView
            
             contentContainerStyle={styles.contentContainer}
        >

            <Divider style={{  backgroundColor: '#fff', height: 12 }} />
        {/* 1. Product Pictures */}
            <Text style={{textAlign: 'center'}}>Picture(s) of Product:</Text>
            <Divider style={{  backgroundColor: '#fff', height: 8 }} />

            <MultipleAddButton navToComponent = {'EditItem'} pictureuris={pictureuris}/>

            <Divider style={{  backgroundColor: '#fff', height: 12 }} />

        {/* 0. Gender */}
        
            <ButtonGroup
                onPress={ (index) => {this.setState({gender: index})}}
                selectedIndex={this.state.gender}
                buttons={ ['Men', 'Accessories', 'Women'] }
                
            />
            {/* Type of clothing */}
            <Divider style={{  backgroundColor: '#fff', height: 12 }} />

            <View style={styles.modalPicker}>
                <Text style={styles.subHeading}>Product Type</Text>
                <CustomModalPicker>
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
                    label={'Product Name'}
                    value={this.state.name}
                    onChangeText={name => this.setState({ name })}
                    autoCorrect={false}
                    // this is used as active border color
                    borderColor={'#800000'}
                    // this is used to set backgroundColor of label mask.
                    // please pass the backgroundColor of your TextInput container.
                    backgroundColor={'#F9F7F6'}
                    inputStyle={{ color: '#800000' }}
            />
            <Text>{this.state.name}</Text>

            <Jiro
                    label={'Product Brand'}
                    value={this.state.brand}
                    onChangeText={brand => this.setState({ brand })}
                    autoCorrect={false}
                    // this is used as active border color
                    borderColor={'#800000'}
                    // this is used to set backgroundColor of label mask.
                    // please pass the backgroundColor of your TextInput container.
                    backgroundColor={'#F9F7F6'}
                    inputStyle={{ color: '#800000' }}
            />
            <Text>{this.state.brand}</Text>

        {/* 3. Product Price */}

            <Jiro
                    label={'Selling Price (GBP)'}
                    value={this.state.price}
                    onChangeText={price => this.setState({ price })}
                    autoCorrect={false}
                    // this is used as active border color
                    borderColor={'#800000'}
                    // this is used to set backgroundColor of label mask.
                    // please pass the backgroundColor of your TextInput container.
                    backgroundColor={'#F9F7F6'}
                    inputStyle={{ color: '#800000' }}
            />
            <Text>{this.formatMoney(this.state.price)}</Text>
            {/* Original Price */}
            <Jiro
                    label={'Original Price (GBP)'}
                    value={this.state.original_price}
                    onChangeText={original_price => this.setState({ original_price })}
                    autoCorrect={false}
                    // this is used as active border color
                    borderColor={'#800000'}
                    // this is used to set backgroundColor of label mask.
                    // please pass the backgroundColor of your TextInput container.
                    backgroundColor={'#F9F7F6'}
                    inputStyle={{ color: '#800000' }}
            />
            <Text>{this.formatMoney(this.state.original_price)}</Text>

            {/* Size */}
            <ProductLabel color='#1271b5' title='Select a Size'/> 
            <ButtonGroup
            onPress={ (index) => {this.setState({size: index})}}
            selectedIndex={this.state.size}
            buttons={ ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }
                
            />
            {/* product condition */}
            <Divider style={{  backgroundColor: '#fff', height: 12 }} />
            <View style={styles.modalPicker}>
                <Text style={styles.subHeading}>Product Condition</Text>
                <CustomModalPicker>
                    <Picker selectedValue = {this.state.condition} onValueChange={ (condition) => {this.setState({condition})} } >
                        <Picker.Item label = "New with tags" value = "New with tags" />
                        <Picker.Item label = "New" value = "New" />
                        <Picker.Item label = "Very good" value = "Very good" />
                        <Picker.Item label = "Good" value = "Good" />
                        <Picker.Item label = "Satisfactory" value = "Satisfactory" />
                    </Picker>
                </CustomModalPicker> 
                <Text style={styles.optionSelected}>{this.state.condition}</Text>
            </View>    

            {/* product age (months) */}
            <View style = { {alignItems: 'center', flexDirection: 'column'} } >
             <NumericInput 
                value={this.state.months} 
                onChange={months => this.setState({months})} 
                type='plus-minus'
                initValue={0}
                minValue={0}
                maxValue={200}
                totalWidth={240} 
                totalHeight={50} 
                iconSize={25}
                valueType='real'
                rounded 
                textColor='#B0228C' 
                iconStyle={{ color: 'white' }} 
                upDownButtonsBackgroundColor='#E56B70'
                rightButtonBackgroundColor='#EA3788' 
                leftButtonBackgroundColor='#E56B70'
                containerStyle={ {justifyContent: 'space-evenly', padding: 10,} }    
                />
             <Text> Months since you bought the product </Text>
            </View>
            <Divider style={{  backgroundColor: '#fff', height: 15 }} />
            {/* Product Description/Material */}
            <KeyboardAvoidingView behavior='padding' enabled={this.state.typing}
                 >
            <Button
                 
                title='Press if done typing in description'
                onPress = {() => {this.setState( { typing: false } )}}
                buttonStyle={{
                backgroundColor: "#3b5998",
                width: 280,
                height: 40,
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 5
            }}
            />     
            <TextField 
                label="Brief description of product"
                value={this.state.description}
                onChangeText = { (desc)=>{this.setState({description: desc})}}
                multiline = {true}
                characterRestriction = {180}
                textColor={'rgb(15, 63, 140)'}
                tintColor={'rgb(15, 63, 140)'}
                baseColor={'rgb(59, 169, 186)'}
            />
            
            </KeyboardAvoidingView>
            {/* RESUBMIT EDITED PRODUCT */}
            <Button
            disabled = { conditionMet ? false : true}
            buttonStyle={{
                backgroundColor: "#22681d",
                width: 280,
                height: 80,
                borderColor: "transparent",
                borderWidth: 2,
                borderRadius: 25,
                padding: 10,
            }}
            icon={{name: 'check-all', type: 'material-community'}}
            title='(RE)SUBMIT TO MARKET'
            onPress={() => { 
                this.updateFirebase(this.state, pictureuris, mime = 'image/jpg', uid , this.state.name, this.state.postKey);
                alert('Your product has been revised and resubmitted to Market.\nPlease close NottMyStyle and re-log in to refresh the Market');
                this.props.navigation.navigate('ProfilePage'); 
                  } }

            />
            {/* DELETE PRODUCT */}
            <Button
            buttonStyle={{
                backgroundColor: "#800000",
                width: 280,
                height: 60,
                borderColor: "transparent",
                borderWidth: 3,
                borderRadius: 25,
                borderColor: 'white'
            }}
            icon={{name: 'delete-empty', type: 'material-community'}}
            title='DELETE PRODUCT'
            onPress={() => { 
                this.deleteProduct(uid, this.state.postKey);
                alert('Your product has been successfully deleted. Please close NottMyStyle and re-log in to see changes');
                this.props.navigation.navigate('ProfilePage');
                  } }

            />

            <Divider style={{  backgroundColor: '#fff', height: 10 }} />
            
            

         </ScrollView>
         
         
        
      
    )
  }
}

export default withNavigation(EditItem)

const styles = StyleSheet.create({
    contentContainer: {
        flexGrow: 1, 
        backgroundColor: '#fff',
        flexDirection: 'column',
        justifyContent: 'space-between',
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
        alignItems: 'center',
    },

    subHeading: {
        ...material.subheading,
        color: '#0c5759',
        fontSize: 15,
        textDecorationLine: 'underline',
    },

    optionSelected: {
        ...material.display1,
        fontWeight: 'bold',
        fontSize: 18,
        color: '#0c5925'
    },
})

