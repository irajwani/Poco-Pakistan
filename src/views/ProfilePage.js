import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, ImageBackground } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import {Button, Divider} from 'react-native-elements'
import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json
import firebase from '../cloud/firebase.js';
import {database} from '../cloud/database';
import {storage} from '../cloud/storage';

const resizeMode = 'center';

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      insta: '',
      uri: '',
      numberProducts: 0,
      soldProducts: 0,
      sellItem: false,
      products: [],
      showMarket: false,
    }

  }

  componentWillMount() {
    this.getProducts();
  }

  getProducts() {
    var your_uid = firebase.auth().currentUser.uid;
    const keys = [];
    database.then( (d) => {
      
      var soldProducts = 0;

      for(var p of Object.values(d.Users[your_uid].products)) {
        if(p.sold) {
          soldProducts++
        }
      }
      
      var numberProducts = Object.keys(d.Users[your_uid].products).length
      
      var {email, insta, name, size, uri} = d.Users[your_uid].profile
      // var name = d.Users[your_uid].profile.name;
      // var email = d.Users[your_uid].profile.email;
      // var insta = d.Users[your_uid].profile.insta;

      console.log(name);
      this.setState({ name, email, uri, insta, numberProducts, soldProducts })
    })
    .catch( (err) => {console.log(err) })
    
  }

  render() {

    return (

      <View style={styles.container}>

        <ImageBackground style={styles.headerBackground} source={require('../images/profile_bg.jpg')}>
        <View style={styles.header}>
          <View style={styles.profilepicWrap}>
          {this.state.uri ? <Image style= {styles.profilepic} source={ {uri: this.state.uri} }/>
        : <Image style= {styles.profilepic} source={require('../images/blank.jpg')}/>} 
          </View>

          <Text style={styles.name}>{this.state.name}</Text>
          <Text style={styles.pos}>{this.state.email} </Text>
          <Text style={styles.insta}>@{this.state.insta} </Text>

          <Divider style={{  backgroundColor: 'blue', height: 30 }} />

          <View style={ {flexDirection: 'row',} }>
            <Text style={styles.numberProducts}>Products on Sale: {this.state.numberProducts} </Text>
            <Divider style={{  backgroundColor: '#0394c0', width: 3, height: 20 }} />
            <Text style={styles.soldProducts}> Products Sold: {this.state.soldProducts}</Text>
          </View>
          
          <Divider style={{  backgroundColor: 'blue', height: 30 }} />

          <Icon.Button name="edit" backgroundColor="#3b5998" onPress={() => {this.props.navigation.navigate('EditProfile')}}>
            <Text style={{fontFamily: 'Arial', fontSize: 15}}>Edit Profile</Text>
          </Icon.Button>

          <Icon.Button name="users" backgroundColor="#3b5" onPress={() => {this.props.navigation.navigate('Users')}}>
            <Text style={{fontFamily: 'Arial', fontSize: 15}}>Users</Text>
          </Icon.Button>

        </View>
      </ImageBackground>
        

      </View>


    )


  }

}

export default withNavigation(ProfilePage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    flexDirection: 'column',
    justifyContent: 'space-evenly'
  },

  headerBackground: {
    flex: 1,
    width: null,
    alignSelf: 'stretch',
    justifyContent: 'space-between'
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0, 0.5)',
  },
  profilepicWrap: {
    width: 180,
    height: 180,
    borderRadius: 100,
    borderColor: 'rgba(0,0,0,0.4)',
    borderWidth: 16,
  },
  profilepic: {
    flex: 1,
    width: null,
    alignSelf: 'stretch',
    borderRadius: 100,
    borderColor: '#fff',
    borderWidth: 4
  },
  name: {
    marginTop: 20,
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold'
  },
  numberProducts: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold'
  },
  soldProducts: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold'
  }
  ,
  pos: {
    fontSize: 16,
    color: '#0394c0',
    fontWeight: '600',
    fontStyle: 'italic'
  },
  insta: {
    fontSize: 16,
    color: '#13a34c',
    fontWeight: '600',
    fontStyle: 'normal'
  }

});


