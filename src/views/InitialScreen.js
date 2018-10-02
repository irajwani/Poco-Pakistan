import React, { Component } from 'react'
import { Text, View } from 'react-native'
import SignIn from './SignIn';
import HomeScreen from './HomeScreen';
import firebase from '../cloud/firebase';



export default class InitialScreen extends Component {
  constructor(props) {
      super(props);
      this.state = {
        currentComponent: <SignIn/>,
      };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged( user => {
        this.setState({loggedIn: user?true:false});
        //this.setState({ currentComponent: user.uid ? <HomeScreen/> : <SignIn/> })
    })
  }
  componentDidUpdate() {

  }

  render() {
      var {loggedIn} = this.state;
      if(loggedIn) {
          return <HomeScreen/>
      }
      else {
          return <SignIn/>
      }
    
    
    
  }
}