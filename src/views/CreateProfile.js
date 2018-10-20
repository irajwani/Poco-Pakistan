import React, { Component } from 'react'
import { Dimensions, Text, StyleSheet, View, ScrollView, Platform, Modal, TouchableHighlight } from 'react-native';
import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json
import {Fab} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ButtonGroup, Button, Divider} from 'react-native-elements';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import RNFetchBlob from 'react-native-fetch-blob';
import { Sae, Fumi } from 'react-native-textinput-effects';
import firebase from '../cloud/firebase.js';
import MultipleAddButton from '../components/MultipleAddButton.js';
// import { material } from 'react-native-typography';
import { Eula, TsAndCs, PrivacyPolicy } from '../legal/Documents.js';
import { confirmBlue, rejectRed } from '../colors.js';

const {width} = Dimensions.get('window');

const limeGreen = '#2e770f';

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

class CreateProfile extends Component {
  constructor(props) {
      super(props);
      this.state = {
          email: '',
          pass: '',
          name: '',
          country: '',
          size: 1,
          uri: undefined,
          insta: '',
          fabActive: true,
          modalVisible: false,
          termsModalVisible: false,
          privacyModalVisible: false,
      }
  }

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  }

  createProfile = (email, pass, pictureuri) => {
      firebase.auth().createUserWithEmailAndPassword(email, pass)
                    .then(() => {
                                  firebase.auth().onAuthStateChanged( ( user ) => {
                                      if(user) {
                                        const {uid} = user;
                                        this.updateFirebase(this.state, pictureuri, mime = 'image/jpg', uid );
                                        alert('Your account has been created. Please use your credentials to Sign In.\n');
                                        this.props.navigation.navigate('SignIn'); 
                                      }
                                      else {
                                        alert('Oops, there was an error with account registration!');
                                      }
                                  })
                                    }
                                      )
                    .catch(() => {
                      this.setState({ error: 'You already have a NottMyStyle account. Please use your credentials to Sign In', loading: false });
                      alert(this.state.error)
                    });
  }

//   addToUsersRoom() {
    
//     const CHATKIT_USER_NAME = firebase.auth().currentUser.uid;

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

//     chatManager.connect().then(currentUser => {
//         this.currentUser = currentUser;
//         console.log(this.currentUser);
//         var {rooms} = this.currentUser;
//         console.log(rooms); 
//         this.currentUser.joinRoom({
//             roomId: 15868783 //Users
//           })
//             .then(() => {
//               console.log('Added user to room')
//             })
//         }
//     )
//     //otherwise this function does nothing;
//   }

  updateFirebase(data, uri, mime = 'image/jpg', uid) {
    
    var updates = {};
    var updateEmptyProducts = {};
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

    var emptyProductPostData = {
        products: '',
    }

    updates['/Users/' + uid + '/profile/'] = postData;

    updateEmptyProducts['/Users/' + uid + '/'] = emptyProductPostData;

    return {databaseProducts: firebase.database().ref().update(updateEmptyProducts),
            databaseProfile: firebase.database().ref().update(updates), 
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

                    
                    
                    resolve(url)
                })
                .catch((error) => {
                reject(error)
                })
            })
}
  }


  render() {
    const {params} = this.props.navigation.state
    const pictureuris = params ? params.pictureuris : 'nothing here'
    var conditionMet = (this.state.name) && (this.state.country) && (Array.isArray(pictureuris) && pictureuris.length == 1)
    console.log(this.state.modalVisible);
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={{textAlign: 'center'}}>Choose Profile Picture:</Text>
        <MultipleAddButton navToComponent = {'CreateProfile'} pictureuris={pictureuris} />

        <Sae
            label={'Email Address'}
            iconClass={FontAwesomeIcon}
            iconName={'envelope'}
            iconColor={'#633d23'}
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
            autoCorrect={false}
            inputStyle={{ color: '#633d23' }}
        />

        <Sae
            label={'Password'}
            iconClass={FontAwesomeIcon}
            iconName={'user-secret'}
            iconColor={'#633d23'}
            value={this.state.pass}
            onChangeText={pass => this.setState({ pass })}
            autoCorrect={false}
            secureTextEntry
            inputStyle={{ color: '#633d23' }}
        />

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

        {/* Modal to show legal docs and agree to them before one can create Profile */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
        >
          <View style={styles.modal}>
            
            <Text style={styles.modalHeader}>End-User License Agreement for NottMyStyle</Text>
            <ScrollView contentContainerStyle={styles.licenseContainer}>
                <Text>{Eula}</Text>
            </ScrollView>
            <View style={styles.documentOpenerContainer}>
                <Text style={styles.documentOpener} onPress={() => {this.setState({modalVisible: false, termsModalVisible: true})}}>
                    Terms & Conditions
                </Text>
                <Text style={styles.documentOpener} onPress={() => {this.setState({modalVisible: false, privacyModalVisible: true})}}>
                    See Privacy Policy
                </Text>
            </View>
            <View style={styles.decisionButtons}>
                <Button
                    title='Reject' 
                    titleStyle={{ fontWeight: "300" }}
                    buttonStyle={{
                    backgroundColor: rejectRed,
                    //#2ac40f
                    width: (width)*0.40,
                    height: 45,
                    borderColor: "#226b13",
                    borderWidth: 0,
                    borderRadius: 10,
                    }}
                    containerStyle={{ marginTop: 0, marginBottom: 0 }}
                    onPress={() => {this.setModalVisible(false); }} 
                />
                <Button
                    title='Accept' 
                    titleStyle={{ fontWeight: "300" }}
                    buttonStyle={{
                    backgroundColor: confirmBlue,
                    //#2ac40f
                    width: (width)*0.40,
                    height: 45,
                    borderColor: "#226b13",
                    borderWidth: 0,
                    borderRadius: 10,
                    }}
                    containerStyle={{ marginTop: 0, marginBottom: 0 }}
                    onPress={() => {this.createProfile(this.state.email, this.state.pass, pictureuris[0]);}} 
                />
            </View>

          </View>
        </Modal>

        {/* Modal to show Terms and Conditions */}
        <Modal
          animationType="fade"
          transparent={false}
          visible={this.state.termsModalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
        >
            <View style={styles.modal}>
                <ScrollView contentContainerStyle={styles.licenseContainer}>
                    <Text>{TsAndCs}</Text>
                </ScrollView>
                <Text onPress={() => { this.setState({modalVisible: true, termsModalVisible: false}) }} style={styles.gotIt}>
                    Got It!
                </Text>
            </View>
        </Modal>

        {/* Modal to show Privacy Policy */}
        <Modal
          animationType="fade"
          transparent={false}
          visible={this.state.privacyModalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
        >
            <View style={styles.modal}>
                <ScrollView contentContainerStyle={styles.licenseContainer}>
                    <Text>{PrivacyPolicy}</Text>
                </ScrollView>
                <Text onPress={() => { this.setState({modalVisible: true, privacyModalVisible: false}) }} style={styles.gotIt}>
                    Got It!
                </Text>
            </View>
        </Modal>

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
                            this.setModalVisible(true);
                            } } 
        />
        
      </ScrollView>
    )
  }
}

export default withNavigation(CreateProfile);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        //alignItems: 'center',
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,

    },
    modal: {flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', padding: 10, marginTop: 22},
    modalHeader: {
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Iowan Old Style',
        fontWeight: "bold"
    },
    acceptText: {
        fontSize: 20,
        color: 'blue'
    },
    rejectText: {
        fontSize: 20,
        color: 'red'
    },
    hideModal: {
      fontSize: 20,
      color: 'green',
      fontWeight:'bold'
    },
    licenseContainer: {
        flexGrow: 0.8, 
        backgroundColor: '#fff',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: 5
    },
    documentOpenerContainer: {
        height: 100,
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 10,
        paddingBottom: 15,
        alignItems: 'center'
    },
    documentOpener: {
        color: limeGreen,
        fontSize: 25,
        fontFamily: 'Times New Roman'
    },
    decisionButtons: {
        width: width - 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    gotIt: {
        fontWeight: "bold",
        color: limeGreen,
        fontSize: 20
    }
})

