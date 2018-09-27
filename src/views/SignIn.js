import React, { Component } from 'react';
import { Dimensions, View, Text, Image, TouchableHighlight, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { Hoshi, Jiro } from 'react-native-textinput-effects';
import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json
import { PacmanIndicator } from 'react-native-indicators';
import {Button} from 'react-native-elements'
//import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick'
import styles from '../styles.js';
//import GeoAttendance from './geoattendance.js';
import ProfilePage from './ProfilePage';
import HomeScreen from './HomeScreen.js';
import firebase from '../cloud/firebase.js';
import {database} from '../cloud/database';
import {storage} from '../cloud/storage';
import { systemWeights, iOSColors } from 'react-native-typography';


const CHATKIT_SECRET_KEY = "9b627f79-3aba-48df-af55-838bbb72222d:Pk9vcGeN/h9UQNGVEv609zhjyiPKtmnd0hlBW2T4Hfw="

const {width, height} = Dimensions.get('window');
//THIS PAGE: 
//Allows user to sign in or sign up
//Updates products on firebase db by scouring products from each user's list of products.
//Updates each user's chats on firebase db by identifying what rooms they are in (which products they currently want to buy or sell) and attaching the relevant information.


//var database = firebase.database();

function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);
    return Math.floor(seconds/86400);
    
}


//currently no barrier to logging in and signing up
class SignIn extends Component {

    constructor(props) {
      super(props);
      this.state = { products: [], data: { imad: {age: 22, height: 510}, k: {age: 22, height: 510}}, test: 3, email: '', uid: '', pass: '', error: '', loading: false, loggedIn: false, isGetting: true};
      }

      componentWillMount() {
          this.updateProducts();
      }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
			position => {
			  var JSONData = JSON.stringify(position);
			  var ParsedData = JSON.parse(JSONData);
              console.log(ParsedData);
              //const initialPosition = ParsedData.coords.latitude;
			  
			  //this.setState({ initialPosition });
			},
			error => console.log(error.message),
			{
			  enableHighAccuracy: true,
			  timeout: 5000,
			  distanceFilter: 2,
			}
          );
        this.watchID = navigator.geolocation.watchPosition(position => {
			const JSONData = JSON.stringify(position);
			var ParsedData = JSON.parse(JSONData);
			console.log(ParsedData);
		  });  
    }
    
    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

    arrayToObject(arr, keyField) {
        Object.assign({}, ...arr.map(item => ({[item[keyField]]: item})))
    }
    /////////
    ///////// Hello world for Login/Signup Email Authentication
    onSignInPress() {
        this.setState({ error: '', loading: true });
        const { email, pass } = this.state; //now that person has input text, their email and password are here
        firebase.auth().signInWithEmailAndPassword(email, pass)
            .then(() => { this.setState({ error: '', loading: false });
                          this.authChangeListener();
                          //cant do these things:
                          //firebase.database().ref('Users/7j2AnQgioWTXP7vhiJzjwXPOdLC3/').set({name: 'Imad Rajwani', attended: 1});
                          })
            .catch( () => {
                this.setState( {error: 'Authentication failed, please sign up or enter correct credentials.', loading: false } );
                alert(this.state.error);
            }

            )

    }

    onSignUpPress() {
        this.setState({ error: '', loading: true });
        const { email, pass } = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, pass)
                    .then(() => { this.setState({ error: '', loading: false });
                                  firebase.auth().onAuthStateChanged( (user) => {
                                    if (user) {
                                        //give the user a new branch on the firebase realtime DB
                                        var updates = {};
                                        var postData = {products: '', profile: ''}
                                        updates['/Users/' + user.uid + '/'] = postData;
                                        firebase.database().ref().update(updates);
                        
                                        this.props.navigation.navigate('EditProfile')
                                        //this.setState({uid: user.uid, loggedIn: true, isGetting: false});
                                    
                                        
                                    } else {
                                        alert('no user found');
                                    }
                        
                        
                                } )
                                    }
                                      )
                    .catch(() => {
                      
                      this.setState({ error: 'Authentication failed, booo hooo.', loading: false });
                    });
    }

    getData(snapshot) {
        details = {
            name: 'the many faced God',
            shirt: 'never'
        };
        
        details.name = snapshot.val().name
        details.shirt = snapshot.val().shirt
        //console.log(details);
        this.setState({details, isGetting: false});
    }

    getDB(snapshot) {
        this.setState({data: snapshot.val()});
        console.log(this.state.data);
    }

    updateProducts() {

        database.then( (d) => {
            var uids = Object.keys(d.Users);
            console.log(uids)
            var keys = [];
            //get all keys for each product iteratively across each user
            for(uid of uids) {
                if(Object.keys(d.Users[uid]).includes('products') ) {
                Object.keys(d.Users[uid].products).forEach( (key) => keys.push(key));
                }
            }
            console.log(keys);
            var products = [];
            var updates = {};
            var chatUpdates = {};
            var postData;
            var i = 0;
            //go through all products in each user's branch and update the Products section of the database
            for(const uid of uids) {
                for(const key of keys) {

                if(Object.keys(d.Users[uid]).includes('products') ) {

                    if( Object.keys(d.Users[uid].products).includes(key)  ) {
                        
                            var daysElapsed;
                            daysElapsed = timeSince( d.Users[uid].products[key].time);
                            postData = {key: key, uid: uid, uris: d.Users[uid].products[key].uris, text: d.Users[uid].products[key], daysElapsed: daysElapsed };
                            updates['/Products/' + i + '/'] = postData;
                            firebase.database().ref().update(updates);
                            i++;


                        

                    }
                
                }

                
                
                }
            }
            
            
            
        })
        .then( () => {
            console.log(this.state.products)
            
        })
        .catch( (err) => console.log(err))
                

    }


    authChangeListener() {

        firebase.auth().onAuthStateChanged( (user) => {
            if (user) {

                this.setState({uid: user.uid, loggedIn: true, isGetting: false});
            
                
            } else {
              alert('no user found');
            }


        } )


                  }



    renderButtonOrLoading() {
        if (this.state.loading) {
            return <View style={{flex: 1}}>
                        <PacmanIndicator color='#28a526' />
                   </View>
        }
        return (
            <View style={ {padding: 15,} }>
                <Button
                    title='Sign In' 
                    titleStyle={{ fontWeight: "700" }}
                    buttonStyle={{
                    backgroundColor: "#45bc53",
                    //#2ac40f
                    //#45bc53
                    width: (width)*0.70,
                    height: 45,
                    borderColor: "#37a1e8",
                    borderWidth: 3,
                    borderRadius: 5
                    }}
                    containerStyle={{ marginTop: 5, marginBottom: 5 }} onPress={this.onSignInPress.bind(this)} />;
                <Button
                    title='Sign Up' 
                    titleStyle={{ fontWeight: "700" }}
                    buttonStyle={{
                    backgroundColor: "#2ac40f",
                    //#2ac40f
                    width: (width)*0.70,
                    height: 45,
                    borderColor: "#226b13",
                    borderWidth: 3,
                    borderRadius: 5
                    }}
                    containerStyle={{ marginTop: 5, marginBottom: 5 }} onPress={this.onSignUpPress.bind(this)} />;
        </View> )
    }


    ///////////////////
    //////////////////

    render() 
     {    
    //     var promise = new Promise(function(resolve, reject) {
    //     var snapshot;
    //     snapshot = firebase.database().ref('Users/' + this.state.userid + '/').once('value')

    //     if (snapshot) {
    //       resolve("Stuff worked!");
    //     }
    //     else {
    //       reject(Error("It broke"));
    //     }
    //   });
    //   var snapshot;
    //   snapshot = firebase.database().ref('Users/' + this.state.userid + '/').once('value')
    //   //snapshot.then( result => return console.log(result.val().name) );
    //   console.log(snapshot);
    
    if(this.state.isGetting == false) 
        { return (this.props.navigation.navigate('HomeScreen')) }

        //  {
        //   console.log(this.state.uid); 
        //   return ( <ProfilePage uid={this.state.uid} /> ) 
        //  }
    else {return (
            
          <KeyboardAvoidingView behavior='padding'
          style={styles.signInContainer}>

            <View style={ { justifyContent: 'center', flexDirection: 'column', flex: 0.45, paddingRight: 40, paddingLeft: 40, paddingTop: 5}}>
                <View style={styles.companyLogoContainer}>
                    <Image source={require('../images/blank.jpg')} style={styles.companyLogo}/>
                </View>
                  
                <Hoshi
                    label={'Email Address'}
                    labelStyle={ {color: iOSColors.gray, ...systemWeights.regular} }
                    value={this.state.email}
                    onChangeText={email => this.setState({ email })}
                    autoCorrect={false}
                    // this is used as active border color
                    borderColor={'#071223'}
                    // this is used to set backgroundColor of label mask.
                    // please pass the backgroundColor of your TextInput container.
                    backgroundColor={'#071223'}
                    inputStyle={{ color: '#0d7018' }}
                />
                <Hoshi
                    label={'Password'}
                    value={this.state.pass}
                    onChangeText={pass => this.setState({ pass })}
                    autoCorrect={false}
                    secureTextEntry
                    // this is used as active border color
                    
                    // this is used to set backgroundColor of label mask.
                    backgroundColor={'#071223'}
                    // please pass the backgroundColor of your TextInput container.
                    inputStyle={{ color: '#0d7018' }}
                />
            </View>
                  {this.renderButtonOrLoading()}
                  
                

                 
                
          
          </KeyboardAvoidingView>
                  )


                }

        
    }



    ////////////////////////
    ////////////////////////

    // render() 
    //  {    
    // //     var promise = new Promise(function(resolve, reject) {
    // //     var snapshot;
    // //     snapshot = firebase.database().ref('Users/' + this.state.userid + '/').once('value')

    // //     if (snapshot) {
    // //       resolve("Stuff worked!");
    // //     }
    // //     else {
    // //       reject(Error("It broke"));
    // //     }
    // //   });
    // //   var snapshot;
    // //   snapshot = firebase.database().ref('Users/' + this.state.userid + '/').once('value')
    // //   //snapshot.then( result => return console.log(result.val().name) );
    // //   console.log(snapshot);
    //   if (this.state.loggedIn) {
    //     //console.log(this.state.uid);
    //     if (this.state.isGetting) {

    //       return (

    //       <View style={[styles.horizontal, styles.aicontainer]}>
    //                     <ActivityIndicator size="large" color="#0000ff"/>
    //                </View>

    //     );  } else { return ( <View><Text>What up</Text></View> ) }

    //      } else {
    //       return (
    //       <View>
    //               <TextInputField
    //                   label='Email Address'
    //                   placeholder='youremailaddress@bates.edu'
    //                   value={this.state.email}
    //                   onChangeText={email => this.setState({ email })}
    //                   autoCorrect={false}
    //               />
    //               <TextInputField
    //                   label='Password'
    //                   autoCorrect={false}
    //                   placeholder='Your Password'
    //                   secureTextEntry
    //                   value={this.state.pass}
    //                   onChangeText={pass => this.setState({ pass })}
    //               />
    //               <Text>{this.state.error}</Text>
    //               {this.renderButtonOrLoading()}
    //       </View>
    //               )




    //     }
    // }
}
export default withNavigation(SignIn);
