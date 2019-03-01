import React, { Component } from 'react';
import { AsyncStorage, Dimensions, View, Image,Platform, StyleSheet } from 'react-native';

import PushNotification from 'react-native-push-notification';

import { Hoshi } from 'react-native-textinput-effects';
import { PacmanIndicator } from 'react-native-indicators';
// import Spinner from 'react-native-spinkit';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button} from 'react-native-elements'
//import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick'
//import GeoAttendance from './geoattendance.js';

import firebase from '../cloud/firebase.js';
// import {database} from '../cloud/database';

import {GoogleSignin} from 'react-native-google-signin'
import {LoginManager, AccessToken} from 'react-native-fbsdk';

// import { systemWeights, iOSColors } from 'react-native-typography';
import {avenirNextText} from '../constructors/avenirNextText'
// import HomeScreen from './HomeScreen';
// import { SignUpToCreateProfileStack } from '../stackNavigators/signUpToEditProfileStack';

// var provider = new firebase.auth.GoogleAuthProvider();
import {lightGray, treeGreen, highlightGreen, lightGreen} from '../colors'
import { LoadingIndicator } from '../localFunctions/visualFunctions.js';
// import { withNavigation } from 'react-navigation';
// const {width,} = Dimensions.get('window');


//THIS PAGE: 
//Allows user to sign in or sign up and handles the flow specific to standard sign in, or standard sign up, or google sign in, or google sign up.
//Updates products on firebase db by scouring products from each user's list of products.
//Updates each user's chats on firebase db by identifying what rooms they are in (which products they currently want to buy or sell) and attaching the relevant information.


//var database = firebase.database();

var googleAuthProvider = new firebase.auth.GoogleAuthProvider();
var facebookAuthProvider = new firebase.auth.FacebookAuthProvider();

function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);
    return Math.floor(seconds/86400);
    
}

class ViewWithChildAtPosition extends Component { 

    constructor(props){
        super(props);
    }

    render() {
        const {flex} = this.props;

        return (
            <View style={{flex: flex, backgroundColor: this.props.color ? this.props.color : null, paddingHorizontal: 2, justifyContent: 'flex-start', alignItems: 'center'}}>
                {this.props.children}
            </View>
        )
        }
}



//currently no barrier to logging in and signing up
class SignIn extends Component {

    constructor(props) {
      super(props);
      this.state = { products: [], email: '', uid: '', pass: '', loading: false, loggedIn: false, googleIconColor: '#db3236'};
      }

    componentWillMount() {
        this.initializePushNotifications();
        AsyncStorage.getItem('previousEmail').then((data)=> this.setState({email: data ? data : '' }))
        
    }

    componentDidMount() {
        Platform.OS === "ios" ?
            GoogleSignin.configure({
                iosClientId: '791527199565-tcd1e6eak6n5fcis247mg06t37bfig63.apps.googleusercontent.com',
            })
            :
            GoogleSignin.configure()
        

        let i = 0;
        const googleIconColors = ['#3cba54', '#db3236', '#f4c20d', '#4885ed'];
        this.colorRefreshId = setInterval( () => {
            // i = Math.random() > 0.5 ? Math.random() > 0.5 ? Math.random() > 0.5 ? 1 : 2 : 4 : 3
            i++
            // console.log(googleIconColors[i % 4])
            this.setState({googleIconColor: googleIconColors[i % 4]})
        }, 3500)
        // .then( () => {console.log('google sign in is now possible')})

    }

    componentWillUnmount() {
        clearInterval(this.colorRefreshId);
    }

    // saveEmailForFuture = async email => {
    //     try {
    //       await AsyncStorage.setItem('previousEmail', email);
    //     } catch (error) {
    //       // Error retrieving data
    //       console.log(error.message);
    //     }
    //   };

    // getPreviousEmail = async () => {
    //     let email = 'none';
    //     try {
    //       email = await AsyncStorage.getItem('previousEmail');
    //       if (email !== null) {
    //         // We have data!!
    //         console.log(email);
    //         return email;
    //       }

    //       else {
    //           email = 'none';
    //           return email;
    //       }
    //     } catch (error) {
    //       // Error retrieving data
    //       console.log(error.message);
    //     }
        
    //   }


    // Invoked when onSignInPress() AND signInWithGoogle()  are pressed: 
    // that is when user presses Sign In Button, or when they choose to sign up or sign in through Google 
    //The G and F UserBooleans are used only in the attemptSignUp function to determine what data to navigate with to the CreateProfile Screen.
    successfulLoginCallback = (user, googleUserBoolean, facebookUserBoolean) => {
        firebase.database().ref().once('value', (snapshot) => {
            var d = snapshot.val();
            var all = d.Products;
            //If NottMyStyle does not know you yet, prompt them to enter details:
            // - Location
            // - Insta
            // - Show Image

            //retrieve database and list of users and check if this users's uid is in that list of users
            //if the user is a new user (trying to sign up with google
            // or
            // TODO: trying to sign in with google
            // or
            // just doesn't exist in the database yet):
            var {Users} = d
            console.log(`${!Object.keys(Users).includes(user.uid)} that user is NOT in database, and needs to Sign Up`)
            if(!Object.keys(Users).includes(user.uid)) {

                this.attemptSignUp(user, googleUserBoolean, facebookUserBoolean)

            } 
            else {
            //if the user isn't new, then re update their notifications (if any)
                if(d.Users[user.uid].products) {
                    console.log('updating notifications a person should receive based on their products', d.Users[user.uid].products )
                    var productKeys = d.Users[user.uid].products ? Object.keys(d.Users[user.uid].products) : [];
                    var yourProducts = all.filter((product) => productKeys.includes(product.key) );
                    // console.log(yourProducts)
                    const notifications = d.Users[user.uid].notifications ? d.Users[user.uid].notifications : false
                    if(notifications) {
                        this.shouldSendNotifications(user.uid, notifications);
                    }
                    
                }
                
                this.setState({loading: false}, () => {console.log('signed in')});
                this.props.navigation.navigate('HomeScreen');
            }

            
        } )
    }

    //Invoked when user tries to sign in even though they don't exist in the system yet
    attemptSignUp = (user, googleUserBoolean, facebookUserBoolean) => {
        //check if user wishes to sign up through standard process (the former) or through google or through facebook so 3 cases
        //
        console.log('attempting to sign up', user);
        this.setState({loading: false});
        !user ? 
            this.props.navigation.navigate('CreateProfile', {user: false, googleUserBoolean: false, facebookUserBoolean: false})
        :
            googleUserBoolean && !facebookUserBoolean ? 
                this.props.navigation.navigate('CreateProfile', {user, googleUserBoolean: true, facebookUserBoolean: false, pictureuris: [user.photoURL],})
            :
                this.props.navigation.navigate('CreateProfile', {user, googleUserBoolean: false, facebookUserBoolean: true, pictureuris: [user.photoURL],})
                //this.props.navigation.navigate('CreateProfile', {user, googleUserBoolean, pictureuris: [user.photoURL],})
    }

    //onPress Google Icon
    signInWithGoogle = () => {
        !this.state.loading ? this.setState({loading: true, showGoogleLoading: true}) : null;
        console.log('trying to sign with google')
        GoogleSignin.signIn()
        .then((data) => {
            console.log(data);
            var {idToken, accessToken} = data;
            const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
            console.log(credential);

            
            return firebase.auth().signInWithCredential(credential);
            
        })
        .then((currentUser) => {
            this.successfulLoginCallback(currentUser, googleUserBoolean = true, facebookUserBoolean = false);
            console.log('successfully signed in:', currentUser);
            // console.log(JSON.stringify(currentUser.toJSON()))
        })
        .catch( (err) => {console.log(err); this.setState({loading: false})})
    }

    signInWithFacebook = () => {
        this.setState({loading: true});

        //Neat Trick: Define two functions (one for success, one for error), with a thenable based on the object returned from the Promise.
        LoginManager.logInWithReadPermissions(['email']).then(
            (result) => {
              console.log("OVER THERE, OVER THERE" +result);  
              if (result.isCancelled) {
                this.setState({loading: false});
              } 
              else {
                AccessToken.getCurrentAccessToken().then( (data) => {
                    console.log("access token retrieved: " + data + data.accessToken);
                    //Credential below throws an error if the associated email address already has an account within firebase auth
                    var credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
                    console.log("the credential is:" + credential)
                    // return firebase.auth().signInAndRetrieveDataWithCredential(credential);
                    firebase.auth().signInWithCredential(credential)
                    .then( () => {
                        console.log("Firebase User Is:" + currentUser);
                    })
                    .catch( err => console.log(err));

                } )
                
                .then( (currentUser) => {
                    console.log("Firebase User Is:" + currentUser)
                    this.successfulLoginCallback(currentUser, googleUserBoolean = false, facebookUserBoolean = true);
                })
                // .catch( (err) => alert('Login failed with error: ' + err))
                // alert('Login was successful with permissions: '
                //   + result.grantedPermissions.toString());
              }
            },
            (error) => {
              alert('Login failed because: ' + error);
            }
          );
    }

    onSignInPress() {
        this.setState({ error: '', loading: true });
        const { email, pass } = this.state;

        if (!email || !pass) {
            alert("You cannot Sign In if your email and/or password fields are blank.");
            this.setState({loading: false});
        }
        else if (!pass.length >= 6) {
            alert("Your password's length must be greater or equal to 6 characters.");
            this.setState({loading: false});
        }
        else {
//now that person has input text, their email and password are here
        firebase.auth().signInWithEmailAndPassword(email, pass)
            .then(() => {
                //This function behaves as an authentication listener for user. 
                //If user signs in, we only use properties about the user to:
                //1. notifications update on cloud & local push notification scheduled notifications 4 days from now for each product that deserves a price reduction.
                firebase.auth().onAuthStateChanged( (user) => {
                    if(user) {
                        console.log(`User's Particular Identification: ${user.uid}`);
                        //could potentially navigate with user properties like uid, name, etc.
                        //TODO: once you sign out and nav back to this page, last entered
                        //password and email are still there

                        // this.saveEmailForFuture(email);
                        AsyncStorage.setItem('previousEmail', email);

                        this.successfulLoginCallback(user, googleUserBoolean = false, facebookUserBoolean = false);
                        
                        // this.setState({loading: false, loggedIn: true})
                        
                    }
                })
                          //this.authChangeListener();
                          //cant do these things:
                          //firebase.database().ref('Users/7j2AnQgioWTXP7vhiJzjwXPOdLC3/').set({name: 'Imad Rajwani', attended: 1});
            })
            .catch( () => {
                let err = 'Authentication failed, please sign up or enter correct credentials.';
                this.setState( { loading: false } );
                alert(err);
            })

            //TODO:unmute
            // .catch( () => {
            //     //if user fails to sign in with email, try to sign them in with google?
            //     this.signInWithGoogle();
            // })

        }

        
            

    }

    arrayToObject(arr, keyField) {
        Object.assign({}, ...arr.map(item => ({[item[keyField]]: item})))
    }

    initializePushNotifications = () => {
        PushNotification.configure({
    
          // (optional) Called when Token is generated (iOS and Android)
          onRegister: function(token) {
              console.log( 'TOKEN:', token );
          },
      
          // (required) Called when a remote or local notification is opened or received
          onNotification: function(notification) {
              const {userInteraction} = notification;
              console.log( 'NOTIFICATION:', notification, userInteraction );
            //   if(userInteraction) {
            //     //this.props.navigation.navigate('YourProducts');
            //     alert("To edit a particular product's details, magnify to show full product details \n Select Edit Item. \n (Be warned, you will have to take new pictures)");
            //   }
              
              //userInteraction ? this.navToEditItem() : console.log('user hasnt pressed notification, so do nothing');
          },
      
          // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications) 
          //senderID: "YOUR GCM SENDER ID",
      
          // IOS ONLY (optional): default: all - Permissions to register.
          permissions: {
              alert: true,
              badge: true,
              sound: true
          },
      
          // Should the initial notification be popped automatically
          // default: true
          popInitialNotification: true,
      
          /**
            * (optional) default: true
            * - Specified if permissions (ios) and token (android and ios) will requested or not,
            * - if not, you must call PushNotificationsHandler.requestPermissions() later
            */
          requestPermissions: true,
      });
    
    
      }

    shouldSendNotifications(your_uid, notificationsObj) {
        // var tasks = Object.keys(notificationsObj)
        // tasks.forEach
        var message;
        var notificationData;
        if(notificationsObj.priceReductions) {
            for(var specificNotification of Object.values(notificationsObj.priceReductions)) {
                var month = new Date().getMonth() + 1;
                var date= new Date().getDate();
                var year = new Date().getFullYear();
                
                //send notification four days after NottMyStyle recognizes this product warrants a price reduction.
                notificationDate = new Date( `${date + 4 > 31 ? month + 1 > 12 ? 1 : month + 1 : month}/${date + 4 > 31 ? 1 : date + 4}/${date + 4 > 31 && month + 1 > 12 ? year + 1 : year}`)
                
                // console.log(month, date)

                //TODO: in 20 minutes, if user's app is active (maybe it works otherwise too?), they will receive a notification
                // var specificNotificatimessage = `Nobody has initiated a chat about, ${specificNotification.name} from ${specificNotification.brand} yet, since its submission on the market ${specificNotification.daysElapsed} days ago 🤔. Consider a price reduction from £${specificNotification.price} \u2192 £${Math.floor(0.80*specificNotification.price)}?`;
                // console.log(message);
                PushNotification.localNotificationSchedule({
                    message: specificNotification.message,// (required)
                    date: notificationDate,
                    vibrate: false,
                });
            }
        }

        if(notificationsObj.purchaseReceipts) {
            for(var specificNotification of Object.values(notificationsObj.purchaseReceipts)) {
                
                
                //send notification 1 hour later
                notificationDate = new Date();
                notificationDate.setHours(notificationDate.getHours() + 1); 
                
                // console.log(month, date)

                //TODO: in 20 minutes, if user's app is active (maybe it works otherwise too?), they will receive a notification
                // var specificNotificatimessage = `Nobody has initiated a chat about, ${specificNotification.name} from ${specificNotification.brand} yet, since its submission on the market ${specificNotification.daysElapsed} days ago 🤔. Consider a price reduction from £${specificNotification.price} \u2192 £${Math.floor(0.80*specificNotification.price)}?`;
                // console.log(message);
                message = `Your product: ${specificNotification.name} is being posted over by ${specificNotification.sellerName}. Please contact us at nottmystyle.help@gmail.com if it does not arrive in 2 weeks.`
                PushNotification.localNotificationSchedule({
                    message: message,// (required)
                    date: notificationDate,
                    vibrate: false,
                });
            }
        }

        if(notificationsObj.itemsSold) {
            for(var specificNotification of Object.values(notificationsObj.itemsSold)) {
                notificationDate = new Date();
                notificationDate.setHours(notificationDate.getHours() + 1); 
                
                // console.log(month, date)

                //TODO: in 20 minutes, if user's app is active (maybe it works otherwise too?), they will receive a notification
                // var specificNotificatimessage = `Nobody has initiated a chat about, ${specificNotification.name} from ${specificNotification.brand} yet, since its submission on the market ${specificNotification.daysElapsed} days ago 🤔. Consider a price reduction from £${specificNotification.price} \u2192 £${Math.floor(0.80*specificNotification.price)}?`;
                // console.log(message);
                message = `Please deliver ${specificNotification.name} to ${specificNotification.buyerName} so we may transfer funds to your PayPal account.`
                PushNotification.localNotificationSchedule({
                    message: message,// (required)
                    date: notificationDate,
                    vibrate: false,
                });
            }
        }

        // for(var product of arrayOfProducts) {
        //     if(product.shouldReducePrice) {
        //         console.log('should reduce price');

        //         var month = new Date().getMonth() + 1;
        //         var date= new Date().getDate();
        //         var year = new Date().getFullYear();
                
        //         //send notification four days after NottMyStyle recognizes this product warrants a price reduction.
        //         var notificationDate = new Date( `${date + 4 > 31 ? month + 1 > 12 ? 1 : month + 1 : month}/${date + 4 > 31 ? 1 : date + 4}/${date + 4 > 31 && month + 1 > 12 ? year + 1 : year}`)
                
        //         // console.log(month, date)

        //         //TODO: in 20 minutes, if user's app is active (maybe it works otherwise too?), they will receive a notification
        //         var message = `Nobody has initiated a chat about, ${product.text.name} from ${product.text.brand} yet, since its submission on the market ${product.daysElapsed} days ago 🤔. Consider a price reduction from £${product.text.price} \u2192 £${Math.floor(0.80*product.text.price)}?`;
        //         // console.log(message);
        //         PushNotification.localNotificationSchedule({
        //             message: message,// (required)
        //             date: notificationDate,
        //             vibrate: false,
        //         });

        //         // var postData = {
        //         //     name: product.text.name,
        //         //     price: product.text.price,
        //         //     uri: product.uris[0],
        //         //     daysElapsed: product.daysElapsed,
        //         //     message: message,
        //         //     date: notificationDate,
        //         // }
        //         // var notificationUpdates = {};
        //         // notificationUpdates['/Users/' + your_uid + '/notifications/' + product.key + '/'] = postData;
        //         // firebase.database().ref().update(notificationUpdates);
        //     }
        // }


    }


    render() {

        const {loading} = this.state;
        // console.log("Hello Sign In Page");
        // AsyncStorage.getItem('previousEmail').then((d)=>console.log(d + 'getItem'))
        
        
        return (
                
            <View style={styles.signInContainer}>

                
                    <View style={styles.companyLogoContainer}>
                        <Image source={Platform.OS == 'ios' ? require('../images/companyLogo2.jpg') : {uri: 'asset:/companyLogo2.jpg'}} style={styles.companyLogo}/>
                    </View>
                    
                    <View style={styles.twoTextInputsContainer}>
                        <View style={{paddingVertical: 2}}>
                            <Hoshi
                                label={'Email Address'}
                                labelStyle={ new avenirNextText(lightGray, 15, "500") }
                                value={this.state.email}
                                onChangeText={email => this.setState({ email })}
                                autoCorrect={false}
                                // this is used as active border color
                                borderColor={'#122021'}
                                // this is used to set backgroundColor of label mask.
                                // please pass the backgroundColor of your TextInput container.
                                // maskColor={"#120221"}
                                inputStyle={new avenirNextText(lightGreen, 19, "300")}
                            />
                        </View>    
                        <View style={{paddingVertical: 2}}>
                            <Hoshi
                                label={'Password'}
                                labelStyle={ new avenirNextText(lightGray, 15, "500") }
                                value={this.state.pass}
                                onChangeText={pass => this.setState({ pass })}
                                autoCorrect={false}
                                secureTextEntry
                                // this is used as active border color
                                borderColor={'#122021'}
                                // this is used to set backgroundColor of label mask.
                                // maskColor={"#120221"}
                                // please pass the backgroundColor of your TextInput container.
                                inputStyle={new avenirNextText('#fff', 19, "300")}
                            />
                        </View>
                    </View>
                
                {loading ? 
                    <View style={styles.allAuthButtonsContainer}>
                        <LoadingIndicator isVisible={loading} color={lightGreen} type={'Wordpress'}/>
                    </View>
                :
                    
                        
                <View style={styles.allAuthButtonsContainer}>

                    <ViewWithChildAtPosition flex={1}  >
                        <Icon
                            name="google" 
                            size={30} 
                            color={this.state.googleIconColor}
                            onPress={() => this.signInWithGoogle()}
                        />
                    </ViewWithChildAtPosition>

                    <View style={styles.twoAuthButtonsContainer}>
                        
                            <View style={{ paddingVertical: 10 }}>
                            <Button
                                title='Sign In' 
                                titleStyle={{ fontWeight: "700" }}
                                buttonStyle={{
                                backgroundColor: lightGreen,
                                //#2ac40f
                                //#45bc53
                                //#16994f
                                borderColor: "#37a1e8",
                                borderWidth: 0,
                                borderRadius: 5,
                                
                                }}
                                
                                onPress={() => {this.onSignInPress()} } 
                            />
                            </View>

                            <View style={{ paddingVertical:10 }}>
                            <Button
                                title='Create Account' 
                                titleStyle={styles.authButtonText}
                                buttonStyle={{
                                backgroundColor: '#368c93',
                                //#2ac40f
                                borderColor: "#226b13",
                                borderWidth: 0,
                                borderRadius: 5
                                }}
                                
                                onPress={
                                    () => {
                                        // this.props.navigation.navigate('CreateProfile')
                                        this.attemptSignUp(user = false, googleUserBoolean = false, facebookUserBoolean = false)
                                        } 
                                    }
                            />
                            </View>
                        
                    </View>

                    <ViewWithChildAtPosition flex={1} >
                        <Icon
                            name="facebook-box" 
                            size={33} 
                            color={'#3b5998'}
                            onPress={() => this.signInWithFacebook()}
                        />
                    </ViewWithChildAtPosition>

                </View>
                }
                    
                    

                    
                    
            
            </View>
                    )


                    

            
        }

}

export default SignIn;


const styles = StyleSheet.create({

  //SIGNIN OR SIGNUP Page
    firstContainer: {
      flex: 1,
      // marginTop: 5,
      //marginBottom: 5,
      padding: 40,
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      //alignContent
      backgroundColor: '#122021',
      //#fff
    },

  //SIGN IN PAGE
    signInContainer: {
      flex: 1,
      marginTop: 20,
      //marginBottom: 5,
      padding: 15,
      flexDirection: 'column',
      // justifyContent: 'space-between',
      // alignContent: 'center',
      backgroundColor: '#122021',
      //#fff
    },
    companyLogoContainer: {
      flex: 0.25,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#122021',
      paddingBottom: 10
    },
    companyLogo: {
      //resizeMode: 'container',
      borderColor:'#207011',
      // alignItems:'center',
      // justifyContent:'center',
      width:90,
      height:100,
      backgroundColor:'#122021',
      borderRadius:45,
      borderWidth: 1,
      //marginLeft: (width/4)-10,
      // paddingLeft: 25,
      // paddingRight: 25
  
  },

  twoTextInputsContainer: {
    flex: 0.40,
    justifyContent: 'flex-start',
    // alignItems: 'center',
    // paddingHorizontal: 10
  },

  allAuthButtonsContainer: {
    flex: 0.35,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    // backgroundColor: 'yellow'
  },

  twoAuthButtonsContainer: {
    flex: 5,
    // backgroundColor: 'white',
    // justifyContent: 'flex-end',
    // alignItems: 'center'
  },

    authButtonText: { fontWeight: "bold" },
    container: {
      alignItems: 'stretch',
      flex: 1
    },
    body: {
      flex: 9,
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'center',
      backgroundColor: '#F5FCFF',
    },
    inputStyle: {
         paddingRight: 5,
         paddingLeft: 5,
         paddingBottom: 2,
         color: 'blue',
         fontSize: 18,
         fontWeight: '200',
         flex: 2,
         height: 100,
         width: 300,
         borderColor: 'gray',
         borderWidth: 1,
  },
  
  
     containerStyle: {
         height: 45,
         flexDirection: 'column',
          alignItems: 'flex-start',
          width: '75%',
          borderColor: 'gray',
         borderBottomWidth: 1,
     },
    aicontainer: {
      flex: 1,
      justifyContent: 'center'
    }
    ,
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10
    }
    ,
    toolbar: {
          height: 56,
      backgroundColor: '#e9eaed',
    },
    textInput: {
      height: 40,
      width: 200,
      borderColor: 'red',
      borderWidth: 1
    },
    transparentButton: {
      marginTop: 10,
      padding: 15
    },
    transparentButtonText: {
      color: '#0485A9',
      textAlign: 'center',
      fontSize: 16
    },
    primaryButton: {
      margin: 10,
      padding: 15,
      backgroundColor: '#529ecc'
    },
    primaryButtonText: {
      color: '#FFF',
      textAlign: 'center',
      fontSize: 18
    },
    image: {
      width: 100,
      height: 100
    },


    





  });
// if(loggedIn) {
//     return <HomeScreen/>
// }

//TODO:unmute
{/* <GoogleSigninButton
                            style={{ width: 200, height: 48 }}
                            size={GoogleSigninButton.Size.Standard}
                            color={GoogleSigninButton.Color.Light}
                            onPress={ () => this.signInWithGoogle() }

                        /> */}