import React, { Component } from 'react'
import { Text, StyleSheet, View, Platform } from 'react-native';
import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json
import {ButtonGroup, Button, Divider} from 'react-native-elements';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import RNFetchBlob from 'react-native-fetch-blob';
import { Sae, Fumi } from 'react-native-textinput-effects';
import firebase from '../cloud/firebase.js';
import MultipleAddButton from '../components/MultipleAddButton.js';
import Chatkit from "@pusher/chatkit";

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

class EditProfile extends Component {
  constructor(props) {
      super(props);
      this.state = {
          name: '',
          country: '',
          size: 1,
          uri: undefined,
          insta: ''
      }
  }

  addToUsersRoom() {
    
    const CHATKIT_SECRET_KEY = "9b627f79-3aba-48df-af55-838bbb72222d:Pk9vcGeN/h9UQNGVEv609zhjyiPKtmnd0hlBW2T4Hfw="
    const CHATKIT_TOKEN_PROVIDER_ENDPOINT = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/7a5d48bb-1cda-4129-88fc-a7339330f5eb/token";
    const CHATKIT_INSTANCE_LOCATOR = "v1:us1:7a5d48bb-1cda-4129-88fc-a7339330f5eb";

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
        console.log(this.currentUser);
        var {rooms} = this.currentUser;
        console.log(rooms); 
        this.currentUser.joinRoom({
            roomId: 15868783 //Users
          })
            .then(() => {
              console.log('Added user to room')
            })
        }
    )
    //otherwise this function does nothing;
  }

  updateFirebase(data, uri, mime = 'image/jpg', uid) {
    
    var updates = {};
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
        email: data.country,
        size: data.size,
        insta: data.insta
    }

    updates['/Users/' + uid + '/profile/' + '/'] = postData;

    return {database: firebase.database().ref().update(updates), 
            storage: new Promise((resolve, reject) => {
                const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
                let uploadBlob = null
                const imageRef = firebase.storage().ref().child(`Users/${uid}/profile`);
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
                    
                    //update db with profile picture url
                    var profileupdates = {};
                    profileupdates['/Users/' + uid + '/profile/' + 'uri/'] = url ;
                    firebase.database().ref().update(profileupdates);

                    //create a new user and add him to Users room
                    this.addToUsersRoom();
                    resolve(url)
                })
                .catch((error) => {
                reject(error)
                })
            })
}
  }


  render() {
    const uid = firebase.auth().currentUser.uid;
    const {params} = this.props.navigation.state
    const pictureuris = params ? params.pictureuris : 'nothing here'
    var conditionMet = (this.state.name) && (this.state.email) && (pictureuri !== 'nothing here')

    return (
      <View style={styles.container}>

        <Text style={{textAlign: 'center'}}>Choose Profile Picture:</Text>
        <Divider style={{  backgroundColor: '#fff', height: 8 }} />
        <MultipleAddButton navToComponent = {'EditProfile'} pictureuris={pictureuris} />

        <Sae
            label={'FirstName LastName'}
            iconClass={FontAwesomeIcon}
            iconName={'users'}
            iconColor={'#0a3f93'}
            value={this.state.name}
            onChangeText={name => this.setState({ name })}
            autoCorrect={false}
            inputStyle={{ color: '#0a3f93' }}
        />

        <Sae
            label={'Nottingham, UK'}
            iconClass={FontAwesomeIcon}
            iconName={'city'}
            iconColor={'#0a3f93'}
            value={this.state.country}
            onChangeText={country => this.setState({ country })}
            autoCorrect={false}
            inputStyle={{ color: '#4dcc0e' }}
        />

        <Sae
            label={'@instagram_handle'}
            iconClass={FontAwesomeIcon}
            iconName={'instagram'}
            iconColor={'#0a3f93'}
            value={this.state.insta}
            onChangeText={insta => this.setState({ insta })}
            autoCorrect={false}
            inputStyle={{ color: '#0a3f93' }}
        />

        
        <Text>What size clothes do you wear?</Text>
        <ButtonGroup
            onPress={ (index) => {this.setState({size: index})}}
            selectedIndex={this.state.size}
            buttons={ ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }
                
        />

        <Button
            disabled = { conditionMet ? false : true}
            large
            buttonStyle={{
                backgroundColor: "#5bea94",
                width: 280,
                height: 80,
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 5
            }}
            icon={{name: 'save', type: 'font-awesome'}}
            title='SAVE'
            onPress={() => {
                            this.updateFirebase(this.state, pictureuris[0], mime = 'image/jpg', uid );
                            this.props.navigation.navigate('ProfilePage'); 
                            } } 
        />
        <Divider style={{  backgroundColor: '#fff', height: 8 }} />
      </View>
    )
  }
}

export default withNavigation(EditProfile);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    }
})
