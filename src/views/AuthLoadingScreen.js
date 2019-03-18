import React, { Component } from 'react'
import { Text, StyleSheet, View, Platform } from 'react-native'
import { LoadingIndicator } from '../localFunctions/visualFunctions';
import { lightGreen } from '../colors';
import firebase from '../cloud/firebase';

export default class AuthLoadingScreen extends Component {
  constructor(props) {
      super(props);
      this.showAppOrAuth();
  }

  showAppOrAuth = () => {
    var unsubscribe = firebase.auth().onAuthStateChanged( ( user ) => {
        unsubscribe();
        this.props.navigation.navigate(user ? 'AppStack' : 'AuthStack');
        // if(user) {
          
        //   var unreadCount = false
          
        //   firebase.database().ref(`/Users/${user.uid}/`).once('value', (snap) => {
        //     var d = snap.val();

        //     if(d.notifications.priceReductions) {
        //       console.log("Notifications length: " + Object.keys(d.notifications.priceReductions).length)
        //       // unreadCount = Object.keys(d.notifications.priceReductions).length; 
        //       Object.values(d.notifications.priceReductions).forEach( (n) => {
        //         if(n.unreadCount) {
        //           unreadCount = true //in this case we only care if whether at least one notification has this property
        //         }
        //       })
              
        //     }

        //   })
        //   .then(() => {
        //     this.props.navigation.navigate('Profile', {unreadCount: unreadCount});
        //   })
        //   .catch( (e) => {
        //     console.log(e);
        //   })
          
        // }

        // else {
        //   this.props.navigation.navigate('AuthStack');
        // }
    })
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff', marginTop: Platform.OS == 'ios' ? 22 : 0, justifyContent: 'center', alignItems: 'center'}}>
        <LoadingIndicator isVisible={true} color={lightGreen} type={'Wordpress'} />
      </View>
    )
  }
}

const styles = StyleSheet.create({

})
