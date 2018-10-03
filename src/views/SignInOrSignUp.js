import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'
import {Button} from 'react-native-elements'

import styles from '../styles';
import { connect } from 'react-redux';

export default class SignInOrSignUp extends Component {
  render() {
    return (
        <View style={styles.firstContainer}>
            <View style={ { justifyContent: 'center', flexDirection: 'column', flex: 0.45, paddingRight: 40, paddingLeft: 40, paddingTop: 25}}>
                <View style={styles.companyLogoContainer}>
                    <Image source={require('../images/blank.jpg')} style={styles.companyLogo}/>
                </View>
            </View>
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
                containerStyle={{ marginTop: 5, marginBottom: 5 }} 
                onPress={() => { this.props.showSignIn } } />;
            <Button
                title='Sign Up' 
                titleStyle={{ fontWeight: "700" }}
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
                onPress={ () => {console.log('show sign up')}}  />    

        </View>
    )
  }
}


// this feeds the singular store whenever the state changes
const mapStateToProps = (state) => {
    return {
        showSignIn: state.showSignIn,
        // loggedIn: state.loggedIn,
    }
}

//if we want a component to access the store, we need to map actions to the props
const mapDispatchToProps = (dispatch) => {
    return {
        showSignIn: () => dispatch( {type: 'showSignIn' } ),
        //onSignInLoading: () => dispatch( {type: 'onSignInLoading'} )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInOrSignUp)