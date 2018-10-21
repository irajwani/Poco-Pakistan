import React, { Component } from 'react'
import { Dimensions, Modal, Text, StyleSheet, ScrollView, View, Image, TouchableHighlight } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button, Divider} from 'react-native-elements'
import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json
import firebase from '../cloud/firebase.js';
import { iOSColors } from 'react-native-typography';
import LinearGradient from 'react-native-linear-gradient'
import ReviewsList from '../components/ReviewsList.js';
import { PacmanIndicator } from 'react-native-indicators';
import { bobbyBlue } from '../colors.js';
const {width, height} = Dimensions.get('window');


const resizeMode = 'center';

class OtherUserProfilePage extends Component {

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
      showBlockOrReportModal: false,

    }

  }

  showBlockOrReport = () => {
      this.setState({showBlockOrReportModal: true})
  }

  blockUser = (uid) => {
    var blockUserUpdates = {};
    blockUserUpdates['/Users/' + firebase.auth().currentUser.uid + '/usersBlocked/' + uid + '/'] = true;
    firebase.database().ref().update(blockUserUpdates)  
    alert("This individual may no longer converse with you by choosing to purchase your products on the Market");
  }

  unblockUser = (uid) => {
    var blockUserUpdates = {};
    blockUserUpdates['/Users/' + firebase.auth().currentUser.uid + '/usersBlocked/' + uid + '/'] = false;
    firebase.database().ref().update(blockUserUpdates)  
    alert("This individual may now attempt to purchase your products from the market.");
  }

  reportUser = () => {

  }

  render() {

    const {params} = this.props.navigation.state;
    const {usersBlocked, uid, profile, numberProducts, soldProducts, comments} = params;

    
    const gradientColors = ['#7de853','#0baa26', '#064711'];
    const gradientColors2 = ['#0a968f','#6ee5df', ];

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

            
            {profile.uri ? 
              <Image style= {styles.profilepic} source={ {uri: profile.uri} }/>
              : 
              <Image style= {styles.profilepic} source={require('../images/blank.jpg')}/>
            } 
            

            <Icon name="alert-octagon" 
                  style={styles.users}
                          size={30} 
                          color={'#020002'}
                          onPress={() => {this.showBlockOrReport()}}
            />

          </View>  

          <View style={styles.profileText}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.pos}>{profile.country} </Text>
            <Text style={styles.insta}>@{profile.insta} </Text>
            
          </View>

          

        </View>
      </LinearGradient>
      </View>

      {/* Number of Products on Market and Sold Cards */}
      <View style={styles.midContainer}>
        <View style={ {flexDirection: 'row',} }>
          <View style={styles.numberCard}>
            <Text onPress={() => {}} style={styles.numberProducts}>{numberProducts} </Text>
            <Text style={styles.subText}>ON SALE</Text>
          </View>
          <Divider style={{  backgroundColor: '#47474f', width: 3, height: 60 }} />
          <View style={styles.numberCard}>
            <Text style={styles.numberProducts}>{soldProducts} </Text>
            <Text style={styles.subText}>SOLD</Text>
          </View>    
        </View>
      </View>
      

      
        

      

      <View style={styles.footerContainer} >

        <ScrollView contentContainerStyle={styles.halfPageScroll}>
          <ReviewsList reviews={comments}/>
        </ScrollView> 

      </View>

      {/* Modal to select if whether you wish to block or report user */}
      <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showBlockOrReportModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
       >
          <View style={styles.modal}>
            <Text style={styles.modalHeader}>Block or Report This User</Text>
            <Text style={styles.modalText}>If you block this user, then they cannot initiate a chat with you regarding one of your products.</Text>
            <Text style={styles.modalText}>This will delete all chats you have with this individual, so if you decide to unblock this user later, they will have to initiate new chats with you.</Text>
            <Text style={styles.modalText}>If you feel this user has breached the Terms and Conditions for usage of NottMyStyle (for example, through proliferation of malicious content, or improper language), then please explain this to the NottMyStyle Team by selecting Report User.</Text>
            <View style={styles.documentOpenerContainer}>
                {usersBlocked.includes(uid) ?
                    <Text style={styles.blockUser} onPress={() => {this.unblockUser(uid)}}>
                        Unblock User
                    </Text>
                :
                    <Text style={styles.blockUser} onPress={() => {this.blockUser(uid)}}>
                        Block User
                    </Text>
                }
                
                <Text style={styles.reportUser} onPress={() => {this.reportUser()}}>
                    Report User
                </Text>
            </View>
            <TouchableHighlight
                onPress={() => {
                  this.setState( {showBlockOrReportModal: false} )
                }}>
                <Text style={styles.hideModal}>Hide Modal</Text>
            </TouchableHighlight>
          </View>
       </Modal>  

      </View>
      


    )


  }

}

export default OtherUserProfilePage;

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

} ,

modal: {flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: 30, marginTop: 22},
modalHeader: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Iowan Old Style',
    fontWeight: "bold"
},
modalText: {
    textAlign: 'justify',
    fontSize: 15,
    fontFamily: 'Times New Roman',
    fontWeight: "normal"
},
hideModal: {
    paddingTop: 40,
    fontSize: 20,
    color: 'green',
    fontWeight:'bold'
  },

documentOpenerContainer: {
    height: 100,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 10,
    paddingTop: 20,
    paddingBottom: 15,
    alignItems: 'center'
},
blockUser: {
    color: '#800000',
    fontSize: 25,
    fontFamily: 'Times New Roman'
},
reportUser: {
    color: bobbyBlue,
    fontSize: 25,
    fontFamily: 'Times New Roman',
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


