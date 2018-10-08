import React, { Component } from 'react';
import { Dimensions, View, Image, KeyboardAvoidingView } from 'react-native';
import {connect} from 'react-redux';

import { Hoshi } from 'react-native-textinput-effects';
import { PacmanIndicator } from 'react-native-indicators';
import {Button} from 'react-native-elements'
//import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick'
import styles from '../styles.js';
//import GeoAttendance from './geoattendance.js';

import firebase from '../cloud/firebase.js';
import {database} from '../cloud/database';

import { systemWeights, iOSColors } from 'react-native-typography';


const {width,} = Dimensions.get('window');
//THIS PAGE: 
//Allows user to sign in or sign up
//Updates products on firebase db by scouring products from each user's list of products.
//Updates each user's chats on firebase db by identifying what rooms they are in (which products they currently want to buy or sell) and attaching the relevant information.


//var database = firebase.database();

function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);
    return Math.floor(seconds/86400);;
    
}


//currently no barrier to logging in and signing up
class SignIn extends Component {

    constructor(props) {
      super(props);
      this.state = { products: [], email: '', uid: '', pass: '',};
      }

    componentWillMount() {
        this.updateProducts();
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
                          //this.authChangeListener();
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
                        
                                        this.props.navigation.navigate('CreateProfile')
                                        //this.setState({uid: user.uid, loggedIn: true, isGetting: false});
                                    
                                        
                                    } else {
                                        alert('Oops, there was an error with account registration!');
                                    }
                        
                        
                                } )
                                    }
                                      )
                    .catch(() => {
                      
                      this.setState({ error: 'Authentication failed, booo hooo.', loading: false });
                    });
    }

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
                            daysElapsed = timeSince(d.Users[uid].products[key].time);
                            (daysElapsed >= 10) && (d.Users[uid].products[key].sold == false) ? 
                                postData = {key: key, uid: uid, uris: d.Users[uid].products[key].uris, text: d.Users[uid].products[key], daysElapsed: daysElapsed, shouldReducePrice: true }
                                :
                                postData = {key: key, uid: uid, uris: d.Users[uid].products[key].uris, text: d.Users[uid].products[key], daysElapsed: daysElapsed, shouldReducePrice: false };
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
        if (this.props.loading) {
            return <View style={{flex: 1}}>
                        <PacmanIndicator color='#28a526' />
                   </View>
        }
        return (
            <View>
                <Button
                    title='Sign In' 
                    titleStyle={{ fontWeight: "700" }}
                    buttonStyle={{
                    backgroundColor: "#16994f",
                    //#2ac40f
                    //#45bc53
                    //#16994f
                    width: (width)*0.70,
                    height: 45,
                    borderColor: "#37a1e8",
                    borderWidth: 0,
                    borderRadius: 5
                    }}
                    containerStyle={{ marginTop: 5, marginBottom: 5 }} onPress={() => {this.props.onSignInPress(this.state.email, this.state.pass)} } />;
            </View> 
            )
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

        //  {
        //   console.log(this.state.uid); 
        //   return ( <ProfilePage uid={this.state.uid} /> ) 
        //  }
    return (
            
          <View style={styles.signInContainer}>

            <View style={ { justifyContent: 'center', flexDirection: 'column', flex: 0.65, paddingRight: 40, paddingLeft: 40, paddingTop: 5}}>
                <View style={styles.companyLogoContainer}>
                    <Image source={require('../images/companyLogo.jpg')} style={styles.companyLogo}/>
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
            {this.props.loading ? 
                <View style={{flex: 1}}>
                    <PacmanIndicator color='#28a526' />
                </View>
                :
                <View style={{ padding: 20, alignContent: 'center'}}>
                    <Button
                        title='Sign In' 
                        titleStyle={{ fontWeight: "700" }}
                        buttonStyle={{
                        backgroundColor: "#16994f",
                        //#2ac40f
                        //#45bc53
                        //#16994f
                        width: (width)*0.70,
                        height: 45,
                        borderColor: "#37a1e8",
                        borderWidth: 0,
                        borderRadius: 5,
                        
                        }}
                        containerStyle={{ padding: 10, marginTop: 5, marginBottom: 5 }} 
                        onPress={() => {this.props.onSignInPress(this.state.email, this.state.pass)} } 
                    />
                    <Button
                        title='Create New Account' 
                        titleStyle={{ fontWeight: "bold" }}
                        buttonStyle={{
                        backgroundColor: '#368c93',
                        //#2ac40f
                        width: (width)*0.70,
                        height: 45,
                        borderColor: "#226b13",
                        borderWidth: 0,
                        borderRadius: 5
                        }}
                        containerStyle={{ marginTop: 5, marginBottom: 5 }} 
                        onPress={ () => {this.onSignUpPress()} } />     
             </View>}
                  
                

                 
                
          
          </View>
                  )


                

        
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

// this feeds the singular store whenever the state changes
const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        loggedIn: state.loggedIn,
    }
}

//if we want a component to access the store, we need to map actions to the props
const mapDispatchToProps = (dispatch) => {
    return {
        onSignInPress: (email, pass) => dispatch( {type: 'onSignInPress', email: email, pass: pass } ),
        //onSignInLoading: () => dispatch( {type: 'onSignInLoading'} )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
