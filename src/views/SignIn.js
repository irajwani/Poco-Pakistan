import React, { Component } from 'react';
import { Dimensions, View, Image, } from 'react-native';

import PushNotification from 'react-native-push-notification';

import { Hoshi } from 'react-native-textinput-effects';
import { PacmanIndicator } from 'react-native-indicators';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button} from 'react-native-elements'
//import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick'
import styles from '../styles.js';
//import GeoAttendance from './geoattendance.js';

import firebase from '../cloud/firebase.js';
// import {database} from '../cloud/database';

import {GoogleSignin} from 'react-native-google-signin'

import { systemWeights, iOSColors } from 'react-native-typography';
// import HomeScreen from './HomeScreen';
// import { SignUpToCreateProfileStack } from '../stackNavigators/signUpToEditProfileStack';

// var provider = new firebase.auth.GoogleAuthProvider();
import {bobbyBlue} from '../colors'
import { withNavigation } from 'react-navigation';
const {width,} = Dimensions.get('window');

const googleIconColors = ['#3cba54', '#db3236', '#f4c20d', '#fff']
//THIS PAGE: 
//Allows user to sign in or sign up and handles the flow specific to standard sign in, or standard sign up, or google sign in, or google sign up.
//Updates products on firebase db by scouring products from each user's list of products.
//Updates each user's chats on firebase db by identifying what rooms they are in (which products they currently want to buy or sell) and attaching the relevant information.


//var database = firebase.database();

// let i = 0;

        // setInterval( () => {
        //     i++ > 3 ? i = 0 : i++
        //     console.log(googleIconColors[i])
        //     this.setState({googleIconColor: googleIconColors[i]})
        // }, 2000)

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
            <View style={{flex: flex, backgroundColor: this.props.color ? this.props.color : null, paddingHorizontal: 2, justifyContent: 'center', alignContent: 'center'}}>
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
        //this.updateProducts();
    }

    componentDidMount() {
        GoogleSignin.configure({
            iosClientId: '791527199565-tcd1e6eak6n5fcis247mg06t37bfig63.apps.googleusercontent.com',
        })
        // .then( () => {console.log('google sign in is now possible')})

    }

    // Invoked when onSignInPress() AND signInWithGoogle()  are pressed: 
    // that is when user presses Sign In Button, or when they choose to sign up or sign in through Google 
    successfulLoginCallback = (user, googleUserBoolean) => {
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
            if(!Object.keys(Users).includes(user.uid)) {

                this.attemptSignUp(user, googleUserBoolean)

            } 
            else {
            //if the user isn't new, then re update their notifications (if any)
                if(d.Users[user.uid].products) {
                    console.log('here 155', d.Users[user.uid].products )
                    var productKeys = d.Users[user.uid].products ? Object.keys(d.Users[user.uid].products) : [];
                    var yourProducts = all.filter((product) => productKeys.includes(product.key) );
                    // console.log(yourProducts)
                    this.shouldSendNotifications(yourProducts,user.uid)
                }
                
                this.setState({loading: false}, () => {console.log('signed in')});
                this.props.navigation.navigate('HomeScreen');
            }

            
        } )
    }

    //Invoked when user tries to sign in even though they don't exist in the system yet
    attemptSignUp = (user, googleUserBoolean) => {
        //check if user wishes to sign up through standard process (the former) or through google
        console.log('attempting to sign up');
        !user ? 
        this.props.navigation.navigate('CreateProfile', {user: false, googleUserBoolean})
        :
        this.props.navigation.navigate('CreateProfile', {user, googleUserBoolean})
        
    }

    //onPress Google Icon
    signInWithGoogle = () => {
        !this.state.loading ? this.setState({loading: true}) : null;
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
            this.successfulLoginCallback(currentUser, googleUserBoolean = true);
            console.log('successfully signed in:', currentUser);
            // console.log(JSON.stringify(currentUser.toJSON()))
        })
        .catch( (err) => console.log(err))
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
              if(userInteraction) {
                //this.props.navigation.navigate('YourProducts');
                alert("To edit a particular product's details, magnify to show full product details \n Select Edit Item. \n (Be warned, you will have to take new pictures)");
              }
              
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

    shouldSendNotifications(arrayOfProducts, your_uid) {
        for(var product of arrayOfProducts) {
            if(product.shouldReducePrice) {
                console.log('should reduce price');

                var month = new Date().getMonth() + 1;
                var date= new Date().getDate();
                var year = new Date().getFullYear();
                
                //send notification four days after NottMyStyle recognizes this product warrants a price reduction.
                var notificationDate = new Date( `${date + 4 > 31 ? month + 1 > 12 ? 1 : month + 1 : month}/${date + 4 > 31 ? 1 : date + 4}/${date + 4 > 31 && month + 1 > 12 ? year + 1 : year}`)
                
                console.log(month, date)

                // in 20 minutes, if user's app is active (maybe it works otherwise too?), they will receive a notification
                var message = `Nobody has initiated a chat about, ${product.text.name} from ${product.text.brand} yet, since its submission on the market ${product.daysElapsed} days ago 🤔. Consider a price reduction from £${product.text.price} \u2192 £${Math.floor(0.80*product.text.price)}?`;
                console.log(message);
                PushNotification.localNotificationSchedule({
                    message: message,// (required)
                    date: notificationDate,
                    vibrate: false,
                });

                var postData = {
                    name: product.text.name,
                    price: product.text.price,
                    uri: product.uris[0],
                    daysElapsed: product.daysElapsed,
                    message: message,
                    date: notificationDate,
                }
                var notificationUpdates = {};
                notificationUpdates['/Users/' + your_uid + '/notifications/' + product.key + '/'] = postData;
                firebase.database().ref().update(notificationUpdates);
            }
        }
    }
    /////////
    ///////// Hello world for Login/Signup Email Authentication
    onSignInPress() {
        this.setState({ error: '', loading: true });
        const { email, pass } = this.state;

        if (!email || !pass) {
            alert("You cannot Sign In if your email and/or password fields are blank.")
        }
        else if (!pass.length >= 6) {
            alert("Your password's length must be greater or equal to 6 characters.")
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
                        this.successfulLoginCallback(user, googleUserBoolean = false);
                        
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

    // onSignUpPress() {
    //     this.setState({ error: '', loading: true });
    //     const { email, pass } = this.state;
    //     firebase.auth().createUserWithEmailAndPassword(email, pass)
    //                 .then(() => {
    //                               firebase.auth().onAuthStateChanged( (user) => {
    //                                 if (user) {
    //                                     //give the user a new branch on the firebase realtime DB
    //                                     var updates = {};
    //                                     var postData = {products: ''}
    //                                     updates['/Users/' + user.uid + '/'] = postData;
    //                                     firebase.database().ref().update(updates);
                        
    //                                     this.setState({loading: false, });
    //                                     this.props.navigation.navigate('CreateProfile');
                                    
                                        
    //                                 } else {
    //                                     alert('Oops, there was an error with account registration!');
    //                                 }
                        
                        
    //                             } )
    //                                 }
    //                                   )
    //                 .catch(() => {
    //                   this.setState({ error: 'You already have a NottMyStyle account. Please use your credentials to Sign In', loading: false });
    //                   alert(this.state.error)
    //                 });
    // }

    // getData(snapshot) {
    //     details = {
    //         name: 'the many faced God',
    //         shirt: 'never'
    //     };
        
    //     details.name = snapshot.val().name
    //     details.shirt = snapshot.val().shirt
    //     //console.log(details);
    //     this.setState({details, isGetting: false});
    // }

    // getDB(snapshot) {
    //     this.setState({data: snapshot.val()});
    //     console.log(this.state.data);
    // }

    // updateProducts() {

    //     database.then( (d) => {
    //         var uids = Object.keys(d.Users);
    //         console.log(uids)
    //         var keys = [];
    //         //get all keys for each product iteratively across each user
    //         for(uid of uids) {
    //             if(Object.keys(d.Users[uid]).includes('products') ) {
    //             Object.keys(d.Users[uid].products).forEach( (key) => keys.push(key));
    //             }
    //         }
    //         console.log(keys);
    //         var products = [];
    //         var updates;
    //         var chatUpdates = {};
    //         var postData;
    //         var i = 1;
    //         //go through all products in each user's branch and update the Products section of the database
    //         for(const uid of uids) {
    //             for(const key of keys) {

    //             if(Object.keys(d.Users[uid]).includes('products') ) {

    //                 if( Object.keys(d.Users[uid].products).includes(key)  ) {
                        
    //                     var daysElapsed;
    //                     daysElapsed = timeSince(d.Users[uid].products[key].time);
                            
    //                     postData = {
    //                         key: key, uid: uid, uris: d.Users[uid].products[key].uris, 
    //                         text: d.Users[uid].products[key], daysElapsed: daysElapsed, 
    //                         shouldReducePrice: (daysElapsed >= 10) && (d.Users[uid].products[key].sold == false) ? true : false
    //                     }
                            
                            
    //                     updates = {};    
    //                     updates['/Products/' + i + '/'] = postData;
    //                     firebase.database().ref().update(updates);
    //                     i++;
    //                     console.log(i);

                        

    //                 }
                
    //             }

                
                
    //             }
    //         }
            
            
            
    //     })
    //     .then( () => {
    //         console.log(this.state.products)
            
    //     })
    //     .catch( (err) => console.log(err))
                

    // }


    // authChangeListener() {
        
    //     firebase.auth().onAuthStateChanged( (user) => {
    //         if (user) {

    //             this.setState({uid: user.uid, loggedIn: true, isGetting: false});
            
                
    //         } else {
    //           alert('no user found');
    //         }


    //     } )


    //               }


    ///////////////////
    //////////////////

    render() {

        const {loading} = this.state;
    
        
        
        return (
                
            <View style={styles.signInContainer}>

                <View style={ { justifyContent: 'center', flexDirection: 'column', flex: 0.65, paddingRight: 40, paddingLeft: 40, paddingTop: 5}}>
                    <View style={styles.companyLogoContainer}>
                        <Image source={require('../images/companyLogo2.jpg')} style={styles.companyLogo}/>
                    </View>
                    
                    <Hoshi
                        label={'Email Address'}
                        labelStyle={ {color: iOSColors.gray, ...systemWeights.regular} }
                        value={this.state.email}
                        onChangeText={email => this.setState({ email })}
                        autoCorrect={false}
                        // this is used as active border color
                        borderColor={'#122021'}
                        // this is used to set backgroundColor of label mask.
                        // please pass the backgroundColor of your TextInput container.
                        backgroundColor={'#122021'}
                        inputStyle={{ color: '#0d7018' }}
                    />
                    <Hoshi
                        label={'Password'}
                        labelStyle={ {color: iOSColors.gray, ...systemWeights.regular} }
                        value={this.state.pass}
                        onChangeText={pass => this.setState({ pass })}
                        autoCorrect={false}
                        secureTextEntry
                        // this is used as active border color
                        borderColor={'#122021'}
                        // this is used to set backgroundColor of label mask.
                        backgroundColor={'#122021'}
                        // please pass the backgroundColor of your TextInput container.
                        inputStyle={{ color: '#0d7018' }}
                    />
                </View>
                {loading ? 
                    <View style={{flex: 0.5}}>
                        <PacmanIndicator color='#28a526' />
                    </View>
                    :
                    
                        
                        <View style={{ flexDirection: 'row', padding: 5, justifyContent: 'space-evenly'}}>

                            <ViewWithChildAtPosition flex={1}  >
                                <Icon
                                    name="google" 
                                    size={30} 
                                    color={ Math.random() > 0.5 ? '#db3236' : '#3cba54'}
                                    color={this.state.googleIconColor}
                                    onPress={() => this.signInWithGoogle()}
                                />
                            </ViewWithChildAtPosition>

                            <View style={{flex: 5, flexDirection: 'column', padding: 5, margin: 5, justifyContent: 'space-between'}}>
                                
                                    <View style={{ padding: 5 }}>
                                    <Button
                                        title='Sign In' 
                                        titleStyle={{ fontWeight: "700" }}
                                        buttonStyle={{
                                        backgroundColor: "#16994f",
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

                                    <View style={{ padding:5 }}>
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
                                                this.attemptSignUp(user = false, googleUserBoolean = false)
                                                } 
                                            }
                                    />
                                    </View>
                                
                            </View>

                            <ViewWithChildAtPosition flex={1} >
                                <Icon
                                    name="facebook-box" 
                                    size={30} 
                                    color={'#3b5998'}
                                    onPress={() => this.signInWithGoogle()}
                                />
                            </ViewWithChildAtPosition>

                    </View>
                }
                    
                    

                    
                    
            
            </View>
                    )


                    

            
        }

}

export default SignIn;

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