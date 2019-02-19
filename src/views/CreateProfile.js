import React, { Component } from 'react'
import { Linking, Dimensions, Text, StyleSheet, View, ScrollView, Platform, Modal, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ButtonGroup, Button} from 'react-native-elements';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
// import RNFetchBlob from 'react-native-fetch-blob';
import RNFetchBlob from 'rn-fetch-blob';
// import { Sae } from 'react-native-textinput-effects';
import firebase from '../cloud/firebase.js';
import MultipleAddButton from '../components/MultipleAddButton.js';
import { iOSColors } from 'react-native-typography';
import { EulaTop, EulaBottom, TsAndCs, PrivacyPolicy, EulaLink } from '../legal/Documents.js';
import { confirmBlue, rejectRed, treeGreen, bobbyBlue, highlightGreen, profoundPink, darkBlue, tealBlue, lightGreen, coolBlack, darkGray, logoGreen, fbBlue, lightGray } from '../colors.js';
import { PacmanIndicator } from 'react-native-indicators';
import {WhiteSpace, GrayLine} from '../localFunctions/visualFunctions';

const {width} = Dimensions.get('window');
const inputHeightBoost = 4;
const info = "In order to sign up, ensure that the values you input meet the following conditions:\n1. Take a profile picture of yourself. If you wish to keep your image a secret, just take a picture of your finger pressed against your camera lens to simulate a dark blank photo.\n2. Use a legitimate email address as other buyers and sellers need a way to contact you if the functionality in NottMyStyle is erroneous for some reason.\n3. Your Password's length must be greater than or equal to 6 characters. To add some security, consider using at least one upper case letter and one symbol like !.\n4. Please limit the length of your name to 40 characters.\n5. An Example answer to the 'city, country abbreviation' field is: 'Nottingham, UK' "
const limeGreen = '#2e770f';

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

const { State: TextInputState } = TextInput;

const CustomTextInput = ({placeholder, onChangeText, value, autoCapitalize}) => (
    <View style={{paddingHorizontal: 7, justifyContent: 'center', alignItems: 'flex-start'}}>
        <TextInput
        style={{height: 50, width: 280, fontFamily: 'Avenir Next', fontSize: 20, fontWeight: "500"}}
        placeholder={placeholder}
        placeholderTextColor={lightGray}
        onChangeText={onChangeText}
        value={value}
        multiline={false}
        maxLength={16}
        autoCorrect={false}
        autoCapitalize={autoCapitalize ? autoCapitalize : 'none'}
        clearButtonMode={'while-editing'}
        underlineColorAndroid={"transparent"}
        />         
    </View>
)

class CreateProfile extends Component {
  constructor(props) {
      super(props);
      var {params} = this.props.navigation.state;
    //   //set values to google account info if they tried to sign up with google 
    //   //(technically they've already signed in to firebase auth but THAT IS IT, 
    //   //now we have to fake the process of them continuing to sign up)
    //   const {user} = params.user ? user : false;
    // If person navigates here to edit their current profile, they should be able to update their profile
      this.editProfileBoolean = this.props.navigation.getParam('editProfileBoolean', false)
      this.state = {
          uid:  this.editProfileBoolean ? firebase.auth().currentUser.uid : '',
          email: params.googleUserBoolean || params.facebookUserBoolean ? params.user.email : '',
          pass: '',
          pass2: '',
          firstName: params.googleUserBoolean || params.facebookUserBoolean ? params.user.displayName.split(" ")[0] : '',
          lastName: params.googleUserBoolean || params.facebookUserBoolean ? params.user.displayName.split(" ")[1] : '',    
          country: '',
        //   size: 1,
          uri: undefined,
          insta: '',
          fabActive: true,
          modalVisible: false,
          termsModalVisible: false,
          privacyModalVisible: false,
          infoModalVisible: false,
          createProfileLoading: false,
          ////EDIT PROFILE STUFF
          editProfileBoolean: false,
          previousUri: false,

          //Keyboard Aware View Stuff
        //   shift: new Animated.Value(0),
      }
  }

//   componentWillMount = () => {
//     this.keyboardDidShowSubscription = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
//     this.keyboardDidHideSubscription = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
//   }

  componentDidMount() {
      //If you navigate here for the purpose of editing your profile, 
      //then you should see your current values, be able to edit them and then save your info.
    var editProfileBoolean = this.props.navigation.getParam('editProfileBoolean', false)
    if(editProfileBoolean) {
        this.getProfile(this.state.uid);
    }
    
  }

//   componentWillUnmount = () => {
//     this.keyboardDidShowSub.remove();
//     this.keyboardDidHideSub.remove();
//   }

//   handleKeyboardDidShow = (event) => {
//     const { height: windowHeight } = Dimensions.get('window');
//     const keyboardHeight = event.endCoordinates.height;
//     const currentlyFocusedField = TextInputState.currentlyFocusedField();
//     UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
//       const fieldHeight = height;
//       const fieldTop = pageY;
//       const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
//       if (gap >= 0) {
//         return;
//       }
//       Animated.timing(
//         this.state.shift,
//         {
//           toValue: gap,
//           duration: 1000,
//           useNativeDriver: true,
//         }
//       ).start();
//     });
//   }

//   handleKeyboardDidHide = () => {
//     Animated.timing(
//       this.state.shift,
//       {
//         toValue: 0,
//         duration: 1000,
//         useNativeDriver: true,
//       }
//     ).start();
//   }

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  }
  //Invoked when you 'Accept' EULA as a Google User trying to sign up
  createProfileForGoogleOrFacebookUser = (user, pictureuri) => {
    this.setState({createProfileLoading: true});
    const {email, pass} = this.state
    var credential = firebase.auth.EmailAuthProvider.credential(email, pass);
    console.log(credential);
    firebase.auth().currentUser.linkAndRetrieveDataWithCredential(credential).then( (usercred) => {
        console.log(usercred);
        this.updateFirebase(this.state, pictureuri, mime='image/jpg',user.uid, );
        console.log("Account linking success", usercred.user);
      }, function(error) {
        console.log("Account linking error", error);
      });
    
    
  }

  //Invoked when you 'Accept' EULA as a User trying to sign up through standard process
  createProfile = (email, pass, pictureuri) => {
      this.setState({createProfileLoading: true});
      firebase.auth().createUserWithEmailAndPassword(email, pass)
        .then(() => {
            var unsubscribe = firebase.auth().onAuthStateChanged( ( user ) => {
                unsubscribe();
                if(user) {
                const {uid} = user;
                this.updateFirebase(this.state, pictureuri, mime = 'image/jpg', uid );
                // alert('Your account has been created.\nPlease use your credentials to Sign In.');
                // this.props.navigation.navigate('SignIn'); 
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
    //TODO: size shouldn't be here
    var updates = {};
    var updateEmptyProducts = {};
    // switch(data.size) {
    //     case 0:
    //         data.size = 'Extra Small'
    //         break; 
    //     case 1:
    //         data.size = 'Small'
    //         break;
    //     case 2:
    //         data.size = 'Medium'
    //         break;
    //     case 3:
    //         data.size = 'Large'
    //         break;
    //     case 4:
    //         data.size = 'Extra Large'
    //         break;
    //     case 5:
    //         data.size = 'Extra Extra Large'
    //         break;
    //     default:
    //         data.size = 'Medium'
    //         console.log('no gender was specified')
    // }

    var postData = {
        name: data.firstName + " " + data.lastName, //data.firstName.concat(" ", data.lastName)
        country: data.country,
        // size: data.size,
        insta: data.insta ? data.insta : '',
        //TODO: Add user uid here to make navigation to their profile page easier. 
        //Occam's razor affirms the notion: To have it available to append to any branch later, it must exist for the first time at the source.
    }

    var emptyProductPostData = {
        products: '',
    }

    updates['/Users/' + uid + '/profile/'] = postData; //TODO: The above should be a constructor function that returns a value here

    updateEmptyProducts['/Users/' + uid + '/'] = emptyProductPostData;

    // let promiseToUploadGooglePhoto = new Promise((resolve, reject) => {
                
    //     console.log(`We already have a googlePhoto url: ${uri}, so need for interaction with cloud storage`)
    //     const uploadUri = uri;
    //     // const imageRef = firebase.storage().ref().child(`Users/${uid}/profile`);
    //     var profileUpdates = {};
    //     profileUpdates['/Users/' + uid + '/profile/' + 'uri/'] = uploadUri ;
    //     firebase.database().ref().update(profileUpdates);
    //     resolve(uploadUri);
        
        
    //     }
    // )
    
    let promiseToUploadPhoto = new Promise((resolve, reject) => {

        if(uri.includes('googleusercontent') || uri.includes('facebook')) {
            console.log(`We already have a googlePhoto url: ${uri}, so need for interaction with cloud storage`)
            
            // const imageRef = firebase.storage().ref().child(`Users/${uid}/profile`);
            resolve(uri);
        }
        else {
            console.log('user has chosen picture manually through photo lib or camera.')
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
    
                resolve(url)
                
            })
            .catch((error) => {
            reject(error)
            })
        }
    
        
    
    })
    
    

    return {
        databaseProducts: firebase.database().ref().update(updateEmptyProducts),
        databaseProfile: firebase.database().ref().update(updates), 
        storage: promiseToUploadPhoto.then((url) => {
            //update db with profile picture url
            var profileUpdates = {};
            profileUpdates['/Users/' + uid + '/profile/' + 'uri/'] = url ;
            firebase.database().ref().update(profileUpdates);
            return url
                
            }).then( (url) => {
                if(url.includes('googleusercontent') || url.includes('facebook')) {
                    this.setState({createProfileLoading: false, modalVisible: false}, 
                        () => {
                            // console.log('DONE DONE DONE');
                            this.props.navigation.navigate('SignIn'); 
                        })
                }
                else {
                    this.successfulProfileCreationCallback(url);
                }
                
            })
            
        } 

  }

  successfulProfileCreationCallback = (url) => {
    console.log(url);
    // this.props.navigation.state.params.googleUserBoolean || this.props.navigation.state.params.googleUserBoolean ? alert('Your account has been created.\nPlease enter your credentials to Sign In from now on.\n') : alert('Your account has been created.\nPlease use your credentials to Sign In.\n'); 
    alert('Your account has been created.\nPlease use your credentials to Sign In.\n'); 
    this.setState({createProfileLoading: false});
    this.props.navigation.navigate('SignIn');
  }

  ///////////////////////
  //EDIT PROFILE FUNCTIONS

  getProfile = (uid) => {
      var profile;

      firebase.database().ref().once("value", (snap) => {
        profile = snap.val().Users[uid].profile;

        //pull uri as well and store it in pictureuris, and if there's no uri, MAB doesn't show anything
        var {name, country, insta} = profile;
        this.setState({editProfileBoolean: true, firstName: name.split(" ")[0], lastName: name.split(" ")[1], country, insta, previousUri: profile.uri ? profile.uri : false })


      })
  }

  editProfile(data, uri, mime = 'image/jpg', uid) {
    
    this.setState({createProfileLoading: true});
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
        name: data.firstName + " " + data.lastName, //data.firstName.concat(" ", data.lastName)
        country: data.country,
        size: data.size,
        insta: data.insta
    }

    updates['/Users/' + uid + '/profile/' + '/'] = postData;

    let promiseToUploadPhoto = new Promise((resolve, reject) => {

        if(uri.includes('googleusercontent') || uri.includes('facebook') || uri.includes('firebasestorage')) {
            // console.log(`We already have a url for this image: ${uri}, so need for interaction with cloud storage`)
            
            // const imageRef = firebase.storage().ref().child(`Users/${uid}/profile`);
            resolve(uri);
        }
        else {
            console.log('user has chosen picture manually through photo lib or camera.')
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
    
                resolve(url)
                
            })
            .catch((error) => {
            reject(error)
            })
        }
    
        
    
    })

    return {database: firebase.database().ref().update(updates), 
            storage: promiseToUploadPhoto.then((url) => {
                //update db with profile picture url
                var profileUpdates = {};
                profileUpdates['/Users/' + uid + '/profile/' + 'uri/'] = url ;
                firebase.database().ref().update(profileUpdates);
                return url
                    
                }).then( (url) => {
                    if(url.includes('googleusercontent') || url.includes('facebook')) {
                        this.setState({createProfileLoading: false}, 
                            () => {
                                // console.log('DONE DONE DONE');
                                this.props.navigation.navigate('ProfilePage'); 
                            })
                    }
                    else {
                        alert('Your profile has successfully been updated!'); 
                        this.setState({createProfileLoading: false});
                        this.props.navigation.navigate('ProfilePage');
                    }
                    
                })
}
  }


  ///////////////


  render() {
    const {navigation} = this.props;
    const {params} = navigation.state
    // console.log(params);
    //TODO: navigation.getParam would do wonders here;
    // var googleUserBoolean = params.googleUserBoolean ? params.googleUserBoolean : false;
    var googleUser = params.googleUserBoolean ? true : false
    var facebookUser = params.facebookUserBoolean ? true : false
    //may be reusing booleans here, but this check on isUserGoogleUser? alright logically so far
    
    var user = params.googleUserBoolean || params.facebookUserBoolean ? params.user : null //data for google user
    // var googlePhotoURL = params.user.photoURL ? params.user.photoURL : false ;
    // googleUser && googlePhotoURL ? pictureuris = [googlePhotoURL] : 'nothing here';

    var pictureuris = navigation.getParam('pictureuris', "nothing here");
    // console.log(pictureuris);
    (this.state.previousUri && pictureuris == "nothing here") ? pictureuris = [this.state.previousUri] : null;
    console.log(pictureuris);
    // console.log(pictureuris[0].includes('googleusercontent'))
    // console.log(googleUser, googleUserBoolean, pictureuris);
    var conditionMet = (this.state.firstName) && (this.state.lastName) && (this.state.country) && (Array.isArray(pictureuris) && pictureuris.length == 1) && (this.state.pass == this.state.pass2) && (this.state.pass.length >= 6);
    var passwordConditionMet = (this.state.pass == this.state.pass2) && (this.state.pass.length > 0);
    // var googleUserConditionMet = (this.state.firstName) && (this.state.lastName) && (this.state.country) && (Array.isArray(pictureuris) && pictureuris.length == 1);
    var editProfileConditionMet = (this.state.firstName) && (this.state.lastName) && (this.state.country) && (Array.isArray(pictureuris) && pictureuris.length == 1);
    
    
    if(pictureuris[0].includes('googleusercontent')) {
        googleUserBoolean = true
    }

    if(this.state.createProfileLoading) {
        return (
            <View style={styles.loadingIndicatorContainer}>
                <LoadingIndicator isVisible={this.state.createProfileLoading} color={profoundPink} type={'Wordpress'}/>
            </View>
        )
    }

    return (
        <ScrollView style={styles.mainContainer} contentContainerStyle={styles.container}>
            
            <Text style={{fontFamily: 'Avenir Next', fontWeight: '300', fontSize: 20, textAlign: 'center'}}>Choose Profile Picture:</Text>
            
            <View style={styles.backIconAndMABAndHelpContainer}>
                <View style={{flex: 0.06, justifyContent: 'flex-start',}}>
                    <FontAwesomeIcon
                    name='chevron-left'
                    size={28}
                    color={'black'}
                    onPress = { () => { 
                        this.props.navigation.goBack();
                        } }

                    />
                </View>
                <View style={{flex: 0.88, justifyContent: 'flex-start', alignItems: 'center',  }}>
                    <MultipleAddButton navToComponent = {'CreateProfile'} pictureuris={pictureuris} />
                </View>
                <View style={{flex: 0.06, justifyContent: 'flex-start', alignItems: 'center'}}>
                    <Icon
                    name='information-variant'
                    size={28}
                    color={bobbyBlue}
                    onPress={() => this.setState({infoModalVisible: true}) } 

                    />
                </View>    
            </View>
    
            
            {
                !this.state.editProfileBoolean ?

                <View>

                    

                    <CustomTextInput placeholder={"Email Address"} value={this.state.email} onChangeText={email => this.setState({ email })}/>

                    <WhiteSpace height={inputHeightBoost}/>

                    <GrayLine/>

                    <CustomTextInput 
                    placeholder={"Password"} 
                    value={this.state.pass} 
                    onChangeText={pass => this.setState({ pass })}

                    />

                    <WhiteSpace height={inputHeightBoost}/>

                    <GrayLine/>

                    <CustomTextInput 
                    placeholder={"Retype Password"} 
                    value={this.state.pass2} 
                    onChangeText={pass2 => this.setState({ pass2 })}

                    />

                    <WhiteSpace height={inputHeightBoost}/>

                    <GrayLine/>
                    {/* <Sae
                        labelStyle={{color: 'black'}}
                        label={'Email Address'}
                        iconClass={FontAwesomeIcon}
                        iconName={'envelope'}
                        iconColor={'black'}
                        value={this.state.email}
                        onChangeText={email => this.setState({ email })}
                        autoCorrect={false}
                        inputStyle={{ color: 'black' }}
                    />
            
                    <Sae
                        labelStyle={{color: darkGray}}
                        label={'Password'}
                        iconClass={FontAwesomeIcon}
                        iconName={'user-secret'}
                        iconColor={darkGray}
                        value={this.state.pass}
                        onChangeText={pass => this.setState({ pass })}
                        autoCorrect={false}
                        secureTextEntry
                        inputStyle={{ color: darkGray }}
                    />
                    
            
                    <Sae
                        labelStyle={{color: treeGreen}}
                        label={'Retype Password'}
                        iconClass={FontAwesomeIcon}
                        iconName={'user-secret'}
                        iconColor={treeGreen}
                        value={this.state.pass2}
                        onChangeText={pass2 => this.setState({ pass2 })}
                        autoCorrect={false}
                        secureTextEntry
                        inputStyle={{ color: treeGreen }}
                    /> */}
            
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
                </View>
                :
                null
            }   

            <CustomTextInput 
            placeholder={"First Name"} 
            value={this.state.firstName} 
            onChangeText={firstName => this.setState({ firstName })}

            />

            <WhiteSpace height={inputHeightBoost}/>

            <GrayLine/> 

            <CustomTextInput 
            placeholder={"Last Name"} 
            value={this.state.lastName} 
            onChangeText={lastName => this.setState({ lastName })}

            />

            <WhiteSpace height={inputHeightBoost}/>

            <GrayLine/>

            <CustomTextInput 
            placeholder={"Country"} 
            value={this.state.country} 
            onChangeText={country => this.setState({ country })}

            />

            <WhiteSpace height={inputHeightBoost}/>

            <GrayLine/>

            <CustomTextInput 
            placeholder={"Instagram Handle (w/o @)"} 
            value={this.state.insta} 
            onChangeText={insta => this.setState({ insta })}

            />

            <WhiteSpace height={inputHeightBoost}/>

            <GrayLine/>
            
            {/* <Sae
                labelStyle={{color: 'black'}}
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
                labelStyle={{color: 'gray'}}
                style={styles.nameInput}
                label={'Last Name'}
                iconClass={FontAwesomeIcon}
                iconName={'users'}
                iconColor={'gray'}
                value={this.state.lastName}
                onChangeText={lastName => this.setState({ lastName })}
                autoCorrect={false}
                inputStyle={{ color: 'black' }}
            /> */}
            
    
            {/* <Sae
                labelStyle={{color: highlightGreen}}
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
                labelStyle={{color: profoundPink}}
                label={'Instagram Handle (w/o @)'}
                iconClass={FontAwesomeIcon}
                iconName={'instagram'}
                iconColor={profoundPink}
                value={this.state.insta}
                onChangeText={insta => this.setState({ insta })}
                autoCorrect={false}
                inputStyle={{ color: profoundPink }}
            /> */}

            <WhiteSpace height={15}/>
            
    
            
            
    
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
                        onPress={() => {console.log('Sign Up Initiated') ; googleUser || facebookUser ? this.createProfileForGoogleOrFacebookUser(user, pictureuris[0]) : this.createProfile(this.state.email, this.state.pass, pictureuris[0]) ;}} 
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

            {/* Action Buttons */}
            
            <TouchableOpacity disabled = {this.state.editProfileBoolean ? editProfileConditionMet ? true: false : conditionMet ? true: false} onPress={()=>this.setState({infoModalVisible: true})}>
                <Button
                    disabled = { this.state.editProfileBoolean ? editProfileConditionMet ? false : true : conditionMet ? false: true}
                    containerViewStyle={{paddingVertical: 20, alignItems: 'center', justifyContent: 'center'}}
                    large
                    buttonStyle={{
                        backgroundColor: treeGreen,
                        width: 280,
                        height: 80,
                        borderColor: "transparent",
                        borderWidth: 0,
                        borderRadius: 5,
                    }}
                    icon={{name: 'save', type: 'font-awesome'}}
                    title='Save'
                    onPress={
                        () => {
                        if(this.state.editProfileBoolean) {
                            this.editProfile(this.state, pictureuris[0], mime = 'image/jpg', this.state.uid);
                        }
                        else {
                            this.setModalVisible(true);
                        }
                        
                        }} 
                />
            </TouchableOpacity>
            
        </ScrollView>
        )
      
    

  }
}

export default CreateProfile;

const styles = StyleSheet.create({

    LoadingIndicatorContainer: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, backgroundColor: '#fff'},

    mainContainer: {
        marginTop: 22,
        backgroundColor: "#fff",
        flex: 1,
        height: '100%',
        // justifyContent: 'space-around',
        left: 0,
        position: 'absolute',
        top: 0,
        width: '100%'
    },
    // mainContainer: {
    //     marginTop: 22,
    //     // borderTopWidth: 1,
    //     // borderTopColor: treeGreen,
    //     paddingTop: 5,
    // },
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

    backIconAndMABAndHelpContainer: {marginTop: 5, flexDirection: 'row', paddingVertical: 5, paddingRight: 2, paddingLeft: 1 },
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
        marginTop: 7,
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

{/* <View style={ {flexDirection: 'row', backgroundColor: '#fff', justifyContent: 'space-between', padding: 5 } }>
                <Button  
                    buttonStyle={ {
                        backgroundColor: 'black',
                        // width: width/3 +20,
                        // height: height/15,
                        borderRadius: 5,
                    }}
                    icon={{name: 'chevron-left', type: 'material-community'}}
                    title='Back'
                    onPress={() => this.props.navigation.goBack() } 
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
            </View> */}

// if(googleUserBoolean) {
//     return (
//         <ScrollView style={styles.mainContainer} contentContainerStyle={styles.container}>
//           <View style={ {flexDirection: 'row', backgroundColor: '#fff', justifyContent: 'space-between', padding: 5 } }>
//               <Button  
//                   buttonStyle={ {
//                       backgroundColor: 'black',
//                       // width: width/3 +20,
//                       // height: height/15,
//                       borderRadius: 5,
//                   }}
//                   icon={{name: 'chevron-left', type: 'material-community'}}
//                   title='Back'
//                   onPress={() => this.props.navigation.navigate('SignIn') } 
//               />
//               <Button  
//                   buttonStyle={ {
//                       backgroundColor: treeGreen,
//                       // width: width/3 +20,
//                       // height: height/15,
//                       borderRadius: 5,
//                   }}
//                   icon={{name: 'help', type: 'material-community'}}
//                   title='Help'
//                   onPress={() => this.setState({infoModalVisible: true}) } 
//               />
//           </View>
//           <Text style={{fontFamily: 'Cochin', fontWeight: '800', fontSize: 20, textAlign: 'center'}}>Choose Profile Picture:</Text>
          
//           <MultipleAddButton navToComponent = {'CreateProfile'} pictureuris={pictureuris} />
  
//           <Sae
//                 style={styles.nameInput}
//                 label={'First Name'}
//                 iconClass={Icon}
//                 iconName={'account'}
//                 iconColor={'black'}
//                 value={this.state.firstName}
//                 onChangeText={firstName => this.setState({ firstName })}
//                 autoCorrect={false}
//                 inputStyle={{ color: 'black' }}
//           />

//           <Sae
//                 style={styles.nameInput}
//                 label={'Last Name'}
//                 iconClass={FontAwesomeIcon}
//                 iconName={'users'}
//                 iconColor={'black'}
//                 value={this.state.lastName}
//                 onChangeText={lastName => this.setState({ lastName })}
//                 autoCorrect={false}
//                 inputStyle={{ color: 'black' }}
//            />
          
//           <Sae
//               label={'City, Country Abbreviation'}
//               iconClass={FontAwesomeIcon}
//               iconName={'globe'}
//               iconColor={highlightGreen}
//               value={this.state.country}
//               onChangeText={country => this.setState({ country })}
//               autoCorrect={false}
//               inputStyle={{ color: highlightGreen }}
//           />
  
//           <Sae
//               label={'@instagram_handle'}
//               iconClass={FontAwesomeIcon}
//               iconName={'instagram'}
//               iconColor={profoundPink}
//               value={this.state.insta}
//               onChangeText={insta => this.setState({ insta })}
//               autoCorrect={false}
//               inputStyle={{ color: profoundPink }}
//           />
  
          
//           <Text style={{fontFamily: 'Cochin', fontWeight: '800', fontSize: 20, textAlign: 'center', marginTop: 10}}>What size clothes do you wear?</Text>
//           <ButtonGroup
//               onPress={ (index) => {this.setState({size: index})}}
//               selectedIndex={this.state.size}
//               buttons={ ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }
//               containerStyle={styles.buttonGroupContainer}
//               buttonStyle={styles.buttonGroup}
//               textStyle={styles.buttonGroupText}
//               selectedTextStyle={styles.buttonGroupSelectedText}
//               selectedButtonStyle={styles.buttonGroupSelectedContainer}
//           />
  
//           {/* Modal to show legal docs and agree to them before one can create Profile */}
//           <Modal
//             animationType="slide"
//             transparent={false}
//             visible={this.state.modalVisible}
//             onRequestClose={() => {
//               Alert.alert('Modal has been closed.');
//             }}
//           >
//             <View style={styles.modal}>
              
//               <Text style={styles.modalHeader}>End-User License Agreement for NottMyStyle</Text>
//               <ScrollView contentContainerStyle={styles.licenseContainer}>
//                   <Text style={{fontFamily: 'Avenir Next'}}>{EulaTop}</Text>
//                   <Text style={{color: bobbyBlue}} onPress={() => Linking.openURL(EulaLink)}>{EulaLink}</Text>
//                   <Text style={{fontFamily: 'Avenir Next'}}>{EulaBottom}</Text>
//               </ScrollView>
//               <View style={styles.documentOpenerContainer}>
//                   <Text style={styles.documentOpener} onPress={() => {this.setState({modalVisible: false, termsModalVisible: true})}}>
//                       Terms & Conditions
//                   </Text>
//                   <Text style={styles.documentOpener} onPress={() => {this.setState({modalVisible: false, privacyModalVisible: true})}}>
//                       See Privacy Policy
//                   </Text>
//               </View>
//               <View style={styles.decisionButtons}>
//                   <Button
//                       title='Reject' 
//                       titleStyle={{ fontWeight: "300" }}
//                       buttonStyle={{
//                       backgroundColor: rejectRed,
//                       //#2ac40f
//                       width: (width)*0.40,
//                       height: 45,
//                       borderColor: "#226b13",
//                       borderWidth: 0,
//                       borderRadius: 10,
//                       }}
//                       containerStyle={{ marginTop: 0, marginBottom: 0 }}
//                       onPress={() => {this.setModalVisible(false); }} 
//                   />
//                   <Button
//                       title='Accept' 
//                       titleStyle={{ fontWeight: "300" }}
//                       buttonStyle={{
//                       backgroundColor: confirmBlue,
//                       //#2ac40f
//                       width: (width)*0.40,
//                       height: 45,
//                       borderColor: "#226b13",
//                       borderWidth: 0,
//                       borderRadius: 10,
//                       }}
//                       containerStyle={{ marginTop: 0, marginBottom: 0 }}
//                       onPress={() => {console.log('Sign Up Initiated'); googleUser ? this.createProfileForGoogleUser(user, pictureuris[0]) : this.createProfile(this.state.email, this.state.pass, pictureuris[0]) ;}} 
//                   />
//               </View>
  
//             </View>
//           </Modal>
  
//           {/* Modal to show Terms and Conditions */}
//           <Modal
//             animationType="fade"
//             transparent={false}
//             visible={this.state.termsModalVisible}
//             onRequestClose={() => {
//               Alert.alert('Modal has been closed.');
//             }}
//           >
//               <View style={styles.modal}>
//                   <Text style={styles.modalHeader}>Terms & Conditions of Use</Text>
//                   <ScrollView contentContainerStyle={styles.licenseContainer}>
//                       <Text>{TsAndCs}</Text>
//                   </ScrollView>
//                   <Text onPress={() => { this.setState({modalVisible: true, termsModalVisible: false}) }} style={styles.gotIt}>
//                       Got It!
//                   </Text>
//               </View>
//           </Modal>
  
//           {/* Modal to show Privacy Policy */}
//           <Modal
//             animationType="fade"
//             transparent={false}
//             visible={this.state.privacyModalVisible}
//             onRequestClose={() => {
//               Alert.alert('Modal has been closed.');
//             }}
//           >
//               <View style={styles.modal}>
//                   <Text style={styles.modalHeader}>Privacy Policy of NottMyStyle</Text>
//                   <ScrollView contentContainerStyle={styles.licenseContainer}>
//                       <Text>{PrivacyPolicy}</Text>
//                   </ScrollView>
//                   <Text onPress={() => { this.setState({modalVisible: true, privacyModalVisible: false}) }} style={styles.gotIt}>
//                       Got It!
//                   </Text>
//               </View>
//           </Modal>
  
//           {/* Modal to explicate details required to sign up */}
//           <Modal
//             animationType="slide"
//             transparent={false}
//             visible={this.state.infoModalVisible}
//             onRequestClose={() => {
//               Alert.alert('Modal has been closed.');
//             }}
//           >
//               <View style={styles.modal}>
//                   <ScrollView contentContainerStyle={styles.licenseContainer}>
//                       <Text style={styles.info}>{info}</Text>
//                   </ScrollView>
//                   <Text onPress={() => { this.setState({infoModalVisible: false}) }} style={styles.gotIt}>
//                       Got It!
//                   </Text>
//               </View>
//           </Modal>
          
//           <TouchableOpacity disabled = {googleUserConditionMet ? true: false} onPress={()=>this.setState({infoModalVisible: true})}>
//               <Button
//                   disabled = {googleUserConditionMet ? false: true}
//                   large
//                   buttonStyle={{
//                       backgroundColor: treeGreen,
//                       width: width - 50,
//                       height: 85,
//                       borderColor: "transparent",
//                       borderWidth: 0,
//                       borderRadius: 5
//                   }}
//                   icon={{name: 'save', type: 'font-awesome'}}
//                   title='SAVE'
//                   onPress={
//                       () => {
//                       this.setModalVisible(true);
//                       }} 
//               />
//           </TouchableOpacity>
          
//         </ScrollView>
//       )

// }

