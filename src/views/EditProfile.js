import React, { Component } from 'react'
import { Text, StyleSheet, View, ScrollView, Platform } from 'react-native';
import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json
import {Fab} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ButtonGroup, Button, Divider} from 'react-native-elements';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import RNFetchBlob from 'react-native-fetch-blob';
import { Sae, Fumi } from 'react-native-textinput-effects';
import firebase from '../cloud/firebase.js';
import MultipleAddButton from '../components/MultipleAddButton.js';


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
          insta: '',
          fabActive: true,
      }
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
        country: data.country,
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
                    //this.addToUsersRoom();
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
    var conditionMet = (this.state.name) && (this.state.country) && (pictureuris[0] !== 'nothing here')

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Button
            buttonStyle={{
                backgroundColor: "#0a3f93",
                width: 50,
                height: 40,
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 90,
                marginLeft: 200
            }}
            icon={{name: 'arrow-left', type: 'font-awesome'}}
            onPress={() => {
                            this.props.navigation.goBack(); 
                            } } 
        />
        <Text style={{textAlign: 'center'}}>Choose Profile Picture:</Text>
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
            label={'City, Country Code (UK)'}
            iconClass={FontAwesomeIcon}
            iconName={'globe'}
            iconColor={'#0a3f93'}
            value={this.state.country}
            onChangeText={country => this.setState({ country })}
            autoCorrect={false}
            inputStyle={{ color: '#0b4f1c' }}
        />

        <Sae
            label={'@instagram_handle'}
            iconClass={FontAwesomeIcon}
            iconName={'instagram'}
            iconColor={'#0a3f93'}
            value={this.state.insta}
            onChangeText={insta => this.setState({ insta })}
            autoCorrect={false}
            inputStyle={{ color: '#770d0d' }}
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
                width: 250,
                height: 80,
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 5
            }}
            icon={{name: 'save', type: 'font-awesome'}}
            title='SAVE'
            onPress={() => {
                            this.updateFirebase(this.state, pictureuris[0], mime = 'image/jpg', uid );
                            alert('Close the application, wait a few seconds for changes to take effect, and then reopen the app')
                            this.props.navigation.navigate('ProfilePage'); 
                            } } 
        />
        
      </ScrollView>
    )
  }
}

export default withNavigation(EditProfile);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        //alignItems: 'center',
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,

    }
})
