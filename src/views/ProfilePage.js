import React, { Component } from 'react'
import { Dimensions, Text, StyleSheet, ScrollView, View, Image, TouchableHighlight } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button, Divider} from 'react-native-elements'
import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json
import firebase from '../cloud/firebase.js';
import {database} from '../cloud/database';
import { iOSColors, iOSUIKit, human } from 'react-native-typography';
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
      // var insaanKaNaam = d.Users[firebase.auth().currentUser.uid].profile.name;  
      // console.log(insaanKaNaam);
      //get list of comments for specific product
      var comments = d.Users[uid].comments ? d.Users[uid].comments : {a: {text: 'No Reviews have been left for this seller.', name: 'NottMyStyle Team', time: Date.now() } };
      console.log(comments);
      this.setState({ comments });
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

         <View style={styles.gearAndPicColumn}>
          <View style={styles.gearRow}>
            <Icon name="settings" 
                  style={ styles.gear }
                          size={30} 
                          color={iOSColors.gray}
                          onPress={() => this.props.navigation.navigate('Settings')}

            />
          </View>  

          <View style={styles.picRow}>
            {this.state.uri ? 
              <Image style= {styles.profilepic} source={ {uri: this.state.uri} }/>
              : 
              <Image style= {styles.profilepic} source={require('../images/blank.jpg')}/>
            } 
          </View>  
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
      
      {/* User Reviews */}
      <View style={styles.footerContainer} >

        <ScrollView contentContainerStyle={styles.halfPageScroll}>
          <View style={ {backgroundColor: '#fff'} }>
          <Text style={styles.reviewsHeader}>REVIEWS</Text>
          {Object.keys(comments).map(
                  (comment) => (
                  <View key={comment} style={styles.rowContainer}>
                      
                      <View style={styles.textContainer}>
                          <Text style={ styles.naam }> {comments[comment].name} </Text>
                          <Text style={styles.comment}> {comments[comment].text}  </Text>
                          <Text style={ styles.commentTime }> { comments[comment].time } </Text>
                      </View>
                      <View style={styles.separator}/>   
                      
                  </View>
                  
              )
                      
              )}
          </View>
        </ScrollView> 

      </View>

      </View>
      


    )


  }

}

export default ProfilePage;

// line 143 <Icon name="account-multiple" 
// style={styles.users}
// size={30} 
// color={'#189fe2'}
// onPress={() => this.props.navigation.navigate('Users')}

// />

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
    fontSize: 18,
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

  gearRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
  },

  picRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    // alignItems: 'flex-start',
  },
  gearAndPicColumn: {
    flexDirection: 'column',
    // flex: 1.4,
    // flexDirection: 'row',
    // justifyContent: 'space-evenly',
    // alignItems: 'center',
    paddingTop:10,
    width: width - 40,
    // paddingRight: 0,
    
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
    fontSize: 24,
    color: '#fff',
    fontWeight: 'normal'
  },
  numberProducts: {
    fontFamily: 'Arial',
    fontSize: 32,
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
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    fontStyle: 'italic'
  },
  insta: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    fontStyle: 'italic'
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

}, 
naam: {
  ...iOSUIKit.caption2,
  fontSize: 11,
  color: '#37a1e8'

},

title: {
  ...human.headline,
  fontSize: 20,
  color: '#656565'
},

comment: {
  ...iOSUIKit.bodyEmphasized,
  fontSize: 25,
  color: 'black',
},  

commentTime: {
  fontSize: 12,
  color: '#1f6010'
},

rowContainer: {
  flexDirection: 'column',
  padding: 14
},

textContainer: {
flex: 1,
flexDirection: 'column',
alignContent: 'center',
padding: 5,
},

separator: {
width: width,
height: 2,
backgroundColor: '#111110'
},  

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


