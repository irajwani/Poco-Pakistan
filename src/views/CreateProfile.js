import React, { Component } from 'react'
import { Linking, Dimensions, Text, StyleSheet, View, ScrollView, Platform, Modal, TouchableHighlight, TouchableOpacity } from 'react-native';
import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json
import {Fab} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ButtonGroup, Button, Divider} from 'react-native-elements';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import RNFetchBlob from 'react-native-fetch-blob';
import { Sae, Fumi, Kohana } from 'react-native-textinput-effects';
import firebase from '../cloud/firebase.js';
import MultipleAddButton from '../components/MultipleAddButton.js';
import { iOSColors } from 'react-native-typography';
import { EulaTop, EulaBottom, TsAndCs, PrivacyPolicy, EulaLink } from '../legal/Documents.js';
import { confirmBlue, rejectRed, woodBrown, treeGreen, bobbyBlue, highlightGreen, profoundPink, poopBrown, darkBlue, tealBlue } from '../colors.js';
import { PacmanIndicator } from 'react-native-indicators';

const {height, width} = Dimensions.get('window');
const info = "In order to sign up, ensure that the values you input meet the following conditions:\n1. Take a profile picture of yourself. If you wish to keep your image a secret, just take a picture of your finger pressed against your camera lens to simulate a dark blank photo.\n2. Use a legitimate email address as other buyers and sellers need a way to contact you if the functionality in NottMyStyle is erroneous for some reason.\n3. Your Password's length must be greater than or equal to 6 characters. To add some security, consider using at least one upper case letter and one symbol like !.\n4. Please limit the length of your name to 40 characters.\n5. An Example answer to the 'city, country abbreviation' field is: 'Nottingham, UK' "
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
          pass2: '',
          firstName: '',
          lastName: '',
          country: '',
          size: 1,
          uri: undefined,
          insta: '',
          fabActive: true,
          modalVisible: false,
          termsModalVisible: false,
          privacyModalVisible: false,
          infoModalVisible: false,
          createProfileLoading: false,
      }
  }

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  }

  createProfile = (email, pass, pictureuri) => {
      this.setState({createProfileLoading: true});
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
            this.setState({ error: 'You already have a NottMyStyle account. Please use your credentials to Sign In', createProfileLoading: false, email: '', pass: '', pass2: '' });
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
        name: data.firstName + " " + data.lastName, //data.firstName.concat(" ", data.lastName)
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
                    this.setState({createProfileLoading: false});
                    
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
    var conditionMet = (this.state.firstName) && (this.state.lastName) && (this.state.country) && (Array.isArray(pictureuris) && pictureuris.length == 1) && (this.state.pass == this.state.pass2) && (this.state.pass.length >= 6);
    var passwordConditionMet = (this.state.pass == this.state.pass2) && (this.state.pass.length > 0);
    
    if(this.state.createProfileLoading) {
        return (
            <View style={{flex: 1}}>
                <PacmanIndicator color={profoundPink} />
            </View>
        )
    }

    return (
      <ScrollView style={styles.mainContainer} contentContainerStyle={styles.container}>
        <View style={ {flexDirection: 'row', backgroundColor: '#fff', justifyContent: 'space-between', padding: 5 } }>
            <Button  
                buttonStyle={ {
                    backgroundColor: 'black',
                    // width: width/3 +20,
                    // height: height/15,
                    borderRadius: 5,
                }}
                icon={{name: 'chevron-left', type: 'material-community'}}
                title='Back'
                onPress={() => this.props.navigation.navigate('SignIn') } 
            />
            <Button  
                buttonStyle={ {
                    backgroundColor: treeGreen,
                    // width: width/3 +20,
                    // height: height/15,
                    borderRadius: 5,
                }}
                icon={{name: 'help', type: 'material-community'}}
                title='Help'
                onPress={() => this.setState({infoModalVisible: true}) } 
            />
        </View>
        <Text style={{fontFamily: 'Cochin', fontWeight: '800', fontSize: 20, textAlign: 'center'}}>Choose Profile Picture:</Text>
        
        <MultipleAddButton navToComponent = {'CreateProfile'} pictureuris={pictureuris} />

        <Sae
            label={'Email Address'}
            iconClass={FontAwesomeIcon}
            iconName={'envelope'}
            iconColor={'gray'}
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
            autoCorrect={false}
            inputStyle={{ color: 'black' }}
        />

        <Sae
            label={'Password'}
            iconClass={FontAwesomeIcon}
            iconName={'user-secret'}
            iconColor={tealBlue}
            value={this.state.pass}
            onChangeText={pass => this.setState({ pass })}
            autoCorrect={false}
            secureTextEntry
            inputStyle={{ color: tealBlue }}
        />

        <Sae
            label={'Retype Password'}
            iconClass={FontAwesomeIcon}
            iconName={'user-secret'}
            iconColor={darkBlue}
            value={this.state.pass2}
            onChangeText={pass2 => this.setState({ pass2 })}
            autoCorrect={false}
            secureTextEntry
            inputStyle={{ color: darkBlue }}
        />

        {passwordConditionMet ?
        <View style={styles.passwordStatusRow}>
         <Text style={[styles.passwordStatusText, {color: treeGreen}]}>Passwords Match!</Text>
         <Icon 
            name="verified" 
            size={30} 
            color={treeGreen}
         />
        </View> 
        :
        <View style={styles.passwordStatusRow}>
         <Text style={[styles.passwordStatusText, {color: rejectRed}]}>Passwords Don't Match!</Text>
         <Icon 
            name="alert-circle" 
            size={30} 
            color={rejectRed}
         />
        </View> 
        }

        
            <Sae
                style={styles.nameInput}
                label={'First Name'}
                iconClass={Icon}
                iconName={'account'}
                iconColor={'black'}
                value={this.state.firstName}
                onChangeText={firstName => this.setState({ firstName })}
                autoCorrect={false}
                inputStyle={{ color: 'black' }}
            />
            <Sae
                style={styles.nameInput}
                label={'Last Name'}
                iconClass={FontAwesomeIcon}
                iconName={'users'}
                iconColor={'black'}
                value={this.state.lastName}
                onChangeText={lastName => this.setState({ lastName })}
                autoCorrect={false}
                inputStyle={{ color: 'black' }}
            />
        

        <Sae
            label={'City, Country Abbreviation'}
            iconClass={FontAwesomeIcon}
            iconName={'globe'}
            iconColor={highlightGreen}
            value={this.state.country}
            onChangeText={country => this.setState({ country })}
            autoCorrect={false}
            inputStyle={{ color: highlightGreen }}
        />

        <Sae
            label={'@instagram_handle'}
            iconClass={FontAwesomeIcon}
            iconName={'instagram'}
            iconColor={profoundPink}
            value={this.state.insta}
            onChangeText={insta => this.setState({ insta })}
            autoCorrect={false}
            inputStyle={{ color: profoundPink }}
        />

        
        <Text style={{fontFamily: 'Cochin', fontWeight: '800', fontSize: 20, textAlign: 'center', marginTop: 10}}>What size clothes do you wear?</Text>
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
                <Text>{EulaTop}</Text>
                <Text style={{color: bobbyBlue}} onPress={() => Linking.openURL(EulaLink)}>{EulaLink}</Text>
                <Text>{EulaBottom}</Text>
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
                <Text style={styles.modalHeader}>Terms & Conditions of Use</Text>
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
                <Text style={styles.modalHeader}>Privacy Policy of NottMyStyle</Text>
                <ScrollView contentContainerStyle={styles.licenseContainer}>
                    <Text>{PrivacyPolicy}</Text>
                </ScrollView>
                <Text onPress={() => { this.setState({modalVisible: true, privacyModalVisible: false}) }} style={styles.gotIt}>
                    Got It!
                </Text>
            </View>
        </Modal>

        {/* Modal to explicate details required to sign up */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.infoModalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
        >
            <View style={styles.modal}>
                <ScrollView contentContainerStyle={styles.licenseContainer}>
                    <Text style={styles.info}>{info}</Text>
                </ScrollView>
                <Text onPress={() => { this.setState({infoModalVisible: false}) }} style={styles.gotIt}>
                    Got It!
                </Text>
            </View>
        </Modal>
        
        <TouchableOpacity disabled = {conditionMet ? true: false} onPress={()=>this.setState({infoModalVisible: true})}>
            <Button
                disabled = {conditionMet ? false: true}
                large
                buttonStyle={{
                    backgroundColor: treeGreen,
                    width: width - 50,
                    height: 85,
                    borderColor: "transparent",
                    borderWidth: 0,
                    borderRadius: 5
                }}
                icon={{name: 'save', type: 'font-awesome'}}
                title='SAVE'
                onPress={
                    () => {
                    this.setModalVisible(true);
                    }} 
            />
        </TouchableOpacity>
        
      </ScrollView>
    )
  }
}

export default withNavigation(CreateProfile);

const styles = StyleSheet.create({
    mainContainer: {
        marginTop: 22,
        borderTopWidth: 1,
        borderTopColor: treeGreen
    },
    container: {
        flexGrow: 1, 
        flexDirection: 'column',
        justifyContent: 'center',
        paddingBottom: 30,
        //alignItems: 'center'
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: 'white'

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
    },

    passwordStatusRow: {
        flexDirection: 'row',
        width: width - 30,
        height: 40,
        marginTop: 30,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    passwordStatusText: {
        fontSize: 20,
        fontWeight: "bold",
        fontFamily: "Cochin"
    },

    buttonGroupText: {
        fontFamily: 'Iowan Old Style',
        fontSize: 17,
        fontWeight: '300',
    },

    buttonGroupSelectedText: {
        color: 'black'
    },

    buttonGroupContainer: {
        height: 40,
        backgroundColor: iOSColors.lightGray,
        marginBottom: 10,
    },
    
    buttonGroupSelectedContainer: {
        backgroundColor: limeGreen
    },

    info: {
        fontFamily: 'Iowan Old Style',
        fontSize: 15,
        textAlign: 'auto',
        letterSpacing: 1.5
    }
})

