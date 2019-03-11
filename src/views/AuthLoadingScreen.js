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
