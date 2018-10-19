import React, { Component } from 'react'
import { Dimensions, Text, StyleSheet, ScrollView, View, Image, TouchableHighlight } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button, Divider} from 'react-native-elements'
import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json
import firebase from '../cloud/firebase.js';
import {database} from '../cloud/database';
import { iOSColors } from 'react-native-typography';
import LinearGradient from 'react-native-linear-gradient'
import ReviewsList from '../components/ReviewsList.js';
import { PacmanIndicator } from 'react-native-indicators';
const {width, height} = Dimensions.get('window');


const resizeMode = 'center';

class ProfilePage extends Component {

  static navigationOptions = {
    header: null
    // headerTitle: 'ProfileMyStyle',
    // headerStyle: {
    //   backgroundColor: 'red',
    // },
    // headerTintColor: '#fff',
    // headerTitleStyle: {
    //   fontWeight: 'bold',
    //   fontFamily: 'Verdana'
    // },
  };

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
      isGetting: true,

    }

  }

  componentWillMount() {
    setTimeout(() => {
      const uid = firebase.auth().currentUser.uid;
      this.getProducts(uid);
      this.getComments(uid);
    }, 1000);
    
  }

  getProducts(your_uid) {
    console.log(your_uid);
    const keys = [];
    database.then( (d) => {
      
      var soldProducts = 0;
      //relies on fact that when user profile was initially created,
      //we appended a products: '' entry under a particular uid's branch
      for(var p of Object.values(d.Users[your_uid].products)) {
        if(p.sold) {
          soldProducts++
        }
      }
      
      var numberProducts = Object.keys(d.Users[your_uid].products).length
      
      var {country, insta, name, size, uri} = d.Users[your_uid].profile
      // var name = d.Users[your_uid].profile.name;
      // var email = d.Users[your_uid].profile.email;
      // var insta = d.Users[your_uid].profile.insta;

      console.log(name);
      this.setState({ name, country, uri, insta, numberProducts, soldProducts })
    })
    .catch( (err) => {console.log(err) })
    
  }

  getComments(uid) {
    console.log(uid);
    const keys = [];
    database.then( (d) => {
      //get name of current user to track who left comments on this persons UserComments component  
      var insaanKaNaam = d.Users[firebase.auth().currentUser.uid].profile.name;  
      console.log(insaanKaNaam);
      //get list of comments for specific product
      var comments = d.Users[uid].comments ? d.Users[uid].comments : {a: {text: 'No Reviews have been left for this seller.', name: 'NottMyStyle Team', time: Date.now() } };
      console.log(comments);
      this.setState({ comments, name: insaanKaNaam });
      console.log(comments);

    })
    .then( () => { console.log('here');this.setState( {isGetting: false} );  } )
    .catch( (err) => {console.log(err) })
    
}

  render() {
    var {isGetting, comments} = this.state;
    console.log(comments)
    const gradientColors = ['#7de853','#0baa26', '#064711'];
    const gradientColors2 = ['#0a968f','#6ee5df', ];

    if(isGetting){
      return(
        <View style={{flex: 1}}>
          <PacmanIndicator color='#28a526' />
        </View>
      )
    }
 

    return (
      <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>

        <LinearGradient style={styles.linearGradient} colors={gradientColors} >
        <View style={styles.header}>
          <View style={styles.gearAndPicRow}>
            <Icon name="settings" 
                  style={ styles.gear }
                          size={30} 
                          color={iOSColors.gray}
                          onPress={() => this.props.navigation.navigate('Settings')}

            />

            
            {this.state.uri ? 
              <Image style= {styles.profilepic} source={ {uri: this.state.uri} }/>
              : 
              <Image style= {styles.profilepic} source={require('../images/blank.jpg')}/>
            } 
            

            <Icon name="account-multiple" 
                  style={styles.users}
                          size={30} 
                          color={'#189fe2'}
                          onPress={() => this.props.navigation.navigate('Users')}

            />

          </View>  

          <View style={styles.profileText}>
            <Text style={styles.name}>{this.state.name}</Text>
            <Text style={styles.pos}>{this.state.country} </Text>
            <Text style={styles.insta}>@{this.state.insta} </Text>
            
          </View>

          

        </View>
      </LinearGradient>
      </View>

      {/* Number of Products on Market and Sold Cards */}
      <View style={styles.midContainer}>
        <View style={ {flexDirection: 'row',} }>
          <View style={styles.numberCard}>
            <Text onPress={() => {this.props.navigation.navigate('YourProducts')}} style={styles.numberProducts}>{this.state.numberProducts} </Text>
            <Text style={styles.subText}>ON SALE</Text>
          </View>
          <Divider style={{  backgroundColor: '#47474f', width: 3, height: 60 }} />
          <View style={styles.numberCard}>
            <Text style={styles.numberProducts}>{this.state.soldProducts} </Text>
            <Text style={styles.subText}>SOLD</Text>
          </View>    
        </View>
      </View>
      

      
        

      

      <View style={styles.footerContainer} >

        <ScrollView contentContainerStyle={styles.halfPageScroll}>
          <ReviewsList reviews={comments}/>
        </ScrollView> 

      </View>

      </View>
      


    )


  }

}

// this feeds the singular store whenever the state changes
const mapStateToProps = (state) => {
  return {
      loggedIn: state.loggedIn,
  }
}

  //if we want a component to access the store, we need to map actions to the props
const mapDispatchToProps = (dispatch) => {
  return {
      //just a func to handle authentication, change the application state and store the UID
      signOut: () => dispatch( {type: 'signOut'} )
      // onSignInPress: (email, pass) => dispatch( {type: 'onSignInPress', email: email, pass: pass } ),
      // showSignIn: () => dispatch( {type: 'showSignIn' } ),
  }
}

export default ProfilePage;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  halfPageScroll: {
    
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 0
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly'
  },

  profileText: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 10,

  },

  numberCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#cdcdd6',
    width: (width/2) - 20,
    height: 60,
    //55
    padding: 5,
    borderWidth: 0,
    borderColor: '#020202',
    borderRadius: 0,
  },

  subText: {
    fontFamily: 'Iowan Old Style',
    fontSize: 16,
    fontWeight: '400'
  },

  midContainer: {
    //0.2
    padding: 0,
  },

  footerContainer: {
    flex: 0.5,
    flexDirection: 'column',
    padding: 2
  },

  headerBackground: {
    flex: 1,
    width: null,
    alignSelf: 'stretch',
    justifyContent: 'space-between'
  },
  header: {
    flex: 1.4,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    //backgroundColor: 'black'
  },

  gear: {
    flex: 0,
    paddingRight: 60
  },
  users: {
    flex: 0,
    paddingLeft: 60,
    paddingRight: 0,
    marginLeft: 0
  },
  gearAndPicRow: {
    flex: 1.4,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingTop:20,
    paddingRight: 0,
  },
  profilepicWrap: {
    backgroundColor: 'black',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderColor: 'rgba(0,0,0,0.4)',
    borderWidth: 0,
  },
  profilepic: {
    //flex: 1,
    width: 130,
    height: 130,
    alignSelf: 'center',
    borderRadius: 65,
    borderColor: '#fff',
    borderWidth: 0
  },
  name: {
    marginTop: 5,
    fontSize: 27,
    color: '#fff',
    fontWeight: 'normal'
  },
  numberProducts: {
    fontFamily: 'Arial',
    fontSize: 25,
    color: 'black',
    fontWeight: 'bold'
  },
  soldProducts: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold'
  }
  ,
  pos: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    fontStyle: 'italic'
  },
  insta: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    fontStyle: 'normal'
  },

  companyLogoContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#122021',
  },
  companyLogo: {
    //resizeMode: 'container',
    borderWidth:1,
    borderColor:'#207011',
    alignItems:'center',
    justifyContent:'center',
    width:40,
    height:40,
    backgroundColor:'#fff',
    borderRadius:0,
    borderWidth: 2,
    marginLeft: (width/4)-10,
    paddingLeft: 25,
    paddingRight: 25

}

});

{/* <TouchableHighlight onPress={() => {firebase.auth().signOut()
                          .then(() => {console.log('sccessfully signed out'); this.props.signOut })
                          .catch((err) => console.log(err)); }}>
              <View>
              <Icon name="exit-to-app" 
                    style={ styles.gear }
                            size={20} 
                            color={'#800000'}

              />
              <Text>Sign Out</Text>
              </View>
            </TouchableHighlight> */}


