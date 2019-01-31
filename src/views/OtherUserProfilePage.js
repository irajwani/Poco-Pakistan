import React, { Component } from 'react'
import { Dimensions, Modal, Text, StyleSheet, ScrollView, View, Image, TextInput, TouchableHighlight, TouchableWithoutFeedback, Keyboard } from 'react-native'
import email from 'react-native-email'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {Button, Divider} from 'react-native-elements'
// import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json
import firebase from '../cloud/firebase.js';
import { iOSColors, iOSUIKit, human,  } from 'react-native-typography';
import LinearGradient from 'react-native-linear-gradient'
// import ReviewsList from '../components/ReviewsList.js';
import { PacmanIndicator } from 'react-native-indicators';
import { bobbyBlue, lightGreen, highlightGreen, graphiteGray, flashOrange, avenirNext, coolBlack } from '../colors.js';

import {removeFalsyValuesFrom} from '../localFunctions/arrayFunctions.js'
// import { Hoshi, Sae } from 'react-native-textinput-effects';
// import { TextField } from 'react-native-material-textfield';
const {width, height} = Dimensions.get('window');

const resizeMode = 'center';

const DismissKeyboardView = ({children}) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
)

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
      report: '',
      showReportUserModal: false,
      isGetting: true,
      uid: firebase.auth().currentUser.uid

    }

  }

  componentWillMount() {
    //Whenever someone navigates to this page, load the relevant data to render this page.
    //We need the current user's uid to extract information about blocked users.
    setTimeout(() => {
      this.loadRelevantData(this.state.uid, this.props.navigation.state.params.uid)  
    }, 500);
    
  }

  componentDidMount() {

    setInterval(() => {
      this.loadRelevantData(this.state.uid, this.props.navigation.state.params.uid)  
    }, 30000);
  }

  loadRelevantData = (yourUid, otherUserUid) => {
    this.setState({isGetting: true})
    firebase.database().ref().once('value', (snap) => {
      var d = snap.val();

      const yourProfile = d.Users[yourUid].profile;

      var rawUsersBlocked = d.Users[yourUid].usersBlocked ? d.Users[yourUid].usersBlocked : {};
      var yourUsersBlocked = removeFalsyValuesFrom(rawUsersBlocked);
      console.log(yourUsersBlocked);

      const profile = d.Users[otherUserUid].profile;
      const {name, country, insta, uri} = profile;

      //get collection keys of current user
      // var collection = d.Users[uid].collection ? d.Users[uid].collection : null;
      // var rawCollection = collection ? collection : {}
      // var collectionKeys = removeFalsyValuesFrom(rawCollection);  

      var soldProducts = 0;

      //get profile data of seller of product
      for(var p of Object.values(d.Users[otherUserUid].products)) {
        if(p.sold) {
          soldProducts++
        }
      }
      
      var numberProducts = Object.keys(d.Users[otherUserUid].products).length

      var date = (new Date()).getDate();
      var month = (new Date()).getMonth();
      var year = (new Date()).getFullYear();

      var comments;
      if(d.Users[otherUserUid].comments) {
        comments = d.Users[otherUserUid].comments;
      }
      else {
        comments = {a: {text: 'Write a review for this seller using the comment field below.', name: 'NottMyStyle Team', time: `${year}/${month.toString().length == 2 ? month : '0' + month }/${date}`, uri: '' } };
      }

      this.setState({yourProfile, usersBlocked: yourUsersBlocked, yourUid: yourUid, otherUserUid: otherUserUid, profile, name, country, insta, uri, soldProducts, numberProducts, comments, isGetting: false})
    })
  }

  showBlockOrReport = () => {
      this.setState({showBlockOrReportModal: true})
  }

  blockUser = (uid) => {
    var blockUserUpdates = {};
    blockUserUpdates['/Users/' + firebase.auth().currentUser.uid + '/usersBlocked/' + uid + '/'] = true;
    firebase.database().ref().update(blockUserUpdates)  
    alert("This individual may no longer converse with you by choosing to purchase your products on the Market.\nGo Back.");
    // this.setState({showBlockOrReportModal: false});
  }

  unblockUser = (uid) => {
    var blockUserUpdates = {};
    blockUserUpdates['/Users/' + firebase.auth().currentUser.uid + '/usersBlocked/' + uid + '/'] = false;
    firebase.database().ref().update(blockUserUpdates)  
    alert("This individual may now attempt to purchase your products from the market.\nGo back.");
    // this.setState({showBlockOrReportModal: false});
  }

  reportUser = () => {
    this.setState({showBlockOrReportModal: false, showReportUserModal: true});
  }

  sendReport = (uid, report) => {
    const recipients = ['nottmystyle.help@gmail.com'] // string or array of email addresses
    email(recipients, {
        // Optional additional arguments
        //cc: ['bazzy@moo.com', 'doooo@daaa.com'], // string or array of email addresses
        //bcc: 'mee@mee.com', // string or array of email addresses
        subject: `Report regarding User: ${uid}` ,
        body: report
    })
    .catch(console.error)
  }

  navToOtherUserProfilePage = (uid) => {
    this.props.navigation.navigate('OtherUserProfilePage', {uid: uid})
  }

  navToUserComments = () => {
    // const {params} = this.props.navigation.state;
    const {otherUserUid, comments, profile, yourProfile} = this.state;
    this.props.navigation.navigate('UserComments', {yourProfile: yourProfile, profile: profile, comments: comments, uid: otherUserUid})
  }

  render() {

    const {report, name, country, insta, uri, usersBlocked, soldProducts, numberProducts, comments, yourUid, otherUserUid} = this.state;
    // const {params} = this.props.navigation.state;
    // const {uid} = params; //otherUserUid
    // console.log(usersBlocked, uid, usersBlocked.includes(uid));

    
    const gradientColors = ['#7de853','#0baa26', '#064711'];
    // const gradientColors2 = ['#0a968f','#6ee5df', ];

    if(this.state.isGetting) {
      return (
        <View style={{marginTop: 22, flex: 1, justifyContent: 'center', backgroundColor: '#fff'}}>
            <View style={{height: 200, justifyContent: 'center', alignContent: 'center'}}>
                <PacmanIndicator color={coolBlack} />
                <Text style={{paddingVertical: 1, paddingHorizontal: 10, fontFamily: 'Avenir Next', fontSize: 18, fontWeight: '500', color: coolBlack, textAlign: 'center'}}>
                    Loading Profile...
                </Text>
            </View>
            
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
              <Icon 
                  name="arrow-left"   
                  size={30} 
                  color={iOSColors.black}
                  onPress={() => this.props.navigation.goBack()}

              />
              <Icon name="account-alert" 
                  
                  size={30} 
                  color={'#020002'}
                  onPress={() => {this.showBlockOrReport()}}
              />
            </View>  

            <View style={styles.picRow}>
              {uri ? 
                <Image style= {styles.profilepic} source={ {uri: uri} }/>
                : 
                <Image style= {styles.profilepic} source={require('../images/blank.jpg')}/>
              } 
            </View>


          </View>  

          <View style={styles.profileTextColumn}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.pos}>{country}</Text>
            {insta ? 
              <Text style={styles.insta}>@{insta}</Text>
             : 
              null
            }
          </View>

          

        </View>
      </LinearGradient>
      </View>

      {/* Number of Products on Market and Sold Cards */}
      <View style={styles.midContainer}>
        
          <View style={styles.numberCard}>
            <Text style={styles.numberProducts}>{numberProducts} </Text>
            <Text style={styles.subText}>ON SALE</Text>
          </View>

          <Divider style={{  flex: 1, backgroundColor: graphiteGray, height: 80, marginVertical: 3 }} />

          <View style={styles.numberCard}>
            <Text style={styles.numberProducts}>{soldProducts} </Text>
            <Text style={styles.subText}>SOLD</Text>
          </View>    
        
      </View>
      

      
        

      
          {/* Other User's Reviews */}
      <View style={styles.footerContainer} >

        <ScrollView contentContainerStyle={styles.halfPageScroll}>
          <View style={ {backgroundColor: '#fff'} }>

          <View style={styles.reviewsHeaderContainer}>
            <Text style={styles.reviewsHeader}>REVIEWS</Text>
            <FontAwesomeIcon 
              name="edit" 
              style={styles.users}
              size={35} 
              color={iOSColors.black}
              onPress={() => {this.navToUserComments()}}
            /> 
          </View>  
          {comments['a'] ? null : Object.keys(comments).map(
                  (comment) => (
                  <View key={comment} style={styles.commentContainer}>

                      <View style={styles.commentPicAndTextRow}>

                        {comments[comment].uri ?
                        <TouchableHighlight style={styles.commentPic} onPress={
                          ()=>{yourUid == comments[comment].uid ? this.props.navigation.navigate('Profile') : this.loadRelevantData(yourUid, comments[comment].uid)} }
                        >
                          <Image style= {styles.commentPic} source={ {uri: comments[comment].uri} }/>
                        </TouchableHighlight>  
                        :
                          <Image style= {styles.commentPic} source={ require('../images/companyLogo2.jpg') }/>
                        }
                          
                        <View style={styles.textContainer}>
                            <Text style={ styles.commentName }> {comments[comment].name} </Text>
                            <Text style={styles.comment}> {comments[comment].text}  </Text>
                        </View>

                      </View>

                      <View style={styles.commentTimeRow}>

                        <Text style={ styles.commentTime }> {comments[comment].time} </Text>

                      </View>

                      {comments[comment].uri ? <View style={styles.separator}/> : null}
                      
                  </View>
                  
              )
                      
              )}
          </View>
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
            <Text style={styles.modalText}>If you believe this user has breached the Terms and Conditions for usage of NottMyStyle (for example, through proliferation of malicious content, or improper language), then please explain this to the NottMyStyle Team through email by selecting Report User.</Text>
            <View style={styles.documentOpenerContainer}>
                {usersBlocked.includes(otherUserUid) ?
                    <Text style={styles.blockUser} 
                    onPress={() => {
                      this.unblockUser(otherUserUid); 
                      //this.setState({showBlockOrReportModal: false});
                      }}>
                        Unblock User
                    </Text>
                :
                    <Text style={styles.blockUser} 
                    onPress={() => {
                      this.blockUser(otherUserUid);
                      //this.setState({showBlockOrReportModal: false});
                      }}>
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
                <Text style={styles.hideModal}>Back</Text>
            </TouchableHighlight>
          </View>
       </Modal>

       {/* Modal to input Report to User */}
       <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showReportUserModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
       >
        <DismissKeyboardView>
            <View style={styles.reportModal}>
                <Text style={styles.reportModalHeader}>Please Explain What You Wish To Report About This User</Text>
                <TextInput
                    style={styles.reportInput}
                    onChangeText={(report) => this.setState({report})}
                    value={this.state.report}
                    multiline={true}
                    numberOfLines={4}
                />
                <Button
                    title='Send' 
                    titleStyle={{ fontWeight: "300" }}
                    buttonStyle={{
                    backgroundColor: bobbyBlue,
                    //#2ac40f
                    width: (width)*0.40,
                    height: 40,
                    borderColor: "#226b13",
                    borderWidth: 0,
                    borderRadius: 20,
                    
                    }}
                    containerStyle={{ marginTop: 0, marginBottom: 0 }}
                    onPress={() => {this.sendReport(otherUserUid, report);}} 
                />
                
                <TouchableHighlight
                    onPress={() => {
                        this.setState( {showReportUserModal: false} )
                    }}>
                    <Text style={styles.hideModal}>Back</Text>
                </TouchableHighlight>
            </View>
          </DismissKeyboardView>
        </Modal>  

      </View>
        
      


    )


  }

}

export default OtherUserProfilePage;

const styles = StyleSheet.create({
  halfPageScroll: {
    
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 0
  },
  headerContainer: {
    flex: 4,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    // backgroundColor: 'pink'
  },

  linearGradient: {
    flex: 1,
  },

  header: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    padding: 20, //maybe not enough padding to lower gear Icon row into view, but that solution would be bad practice
    // backgroundColor: 'white',
    height: height/1.8,
  },

  gearAndPicColumn: {
    flex: 3,
    flexDirection: 'column',
    // flex: 1.0,
    // flexDirection: 'row',
    // justifyContent: 'space-evenly',
    // alignItems: 'center',
    marginTop:10,
    // width: width - 40,
    // paddingRight: 0,
    // backgroundColor: 'blue',
    // width: width
  },

  gearRow: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'flex-start',
    margin: 2
    // backgroundColor: 'white'
  },

  picRow: {
    width: 250,
    // flex: 3.5,
    // flexDirection: 'row',
    justifyContent: 'center',
    // alignContent: 'flex-start',
    // height: height/5,
    // backgroundColor: 'yellow'
    // alignItems: 'flex-start',
  },

  profileTextColumn: {
    flex: 1.4,
    flexDirection: 'column',
    alignItems: 'center',
    // paddingTop: 15,
    // backgroundColor: 'red'

  },

  midContainer: {
    flex: 1,
    flexDirection: 'row',
    // width: width,
    // height: height/7.5,
    backgroundColor: '#cdcdd6',
    justifyContent: 'center'
  },

  numberCard: {
    flex: 79.5,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    // width: width/2 - 20,
    // height: 60,
    //55
    // paddingTop: 20,
    // paddingBottom: 5,
    // paddingLeft: 30,
    // paddingRight: 30,
    borderWidth: 0,
    borderColor: '#020202',
    borderRadius: 0,
  },

  subText: {
    fontFamily: 'Avenir Next',
    fontSize: 18,
    fontWeight: '400',
    color: graphiteGray,
  },

  footerContainer: {
    flex: 2,
    flexDirection: 'column',
    padding: 2,
    backgroundColor: '#fff'
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
    fontFamily: avenirNext,
    marginTop: 5,
    fontSize: 24,
    color: '#fff',
    fontWeight: 'normal'
  },
  numberProducts: {
    fontFamily: avenirNext,
    fontSize: 28,
    color: graphiteGray,
    fontWeight: 'normal'
  },
  soldProducts: {
    fontFamily: avenirNext,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold'
  }
  ,
  pos: {
    fontFamily: avenirNext,
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    fontStyle: 'italic'
  },
  insta: {
    fontFamily: avenirNext,
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

reviewsHeaderContainer: {
  flexDirection: 'row',
  paddingTop: 5,
  width: width-15,
  justifyContent: 'space-between'
},

reviewsHeader: {
  fontFamily: 'Avenir Next',
  fontSize: 24,
  fontWeight: "normal",
  paddingLeft: 10
},

commentContainer: {
  flexDirection: 'column',
},

commentPicAndTextRow: {
  flexDirection: 'row',
  width: width - 20,
  padding: 10
},

commentPic: {
  //flex: 1,
  width: 70,
  height: 70,
  alignSelf: 'center',
  borderRadius: 35,
  borderColor: '#fff',
  borderWidth: 0
},

commentName: {
  color: highlightGreen,
  fontSize: 16,
  fontWeight: "500",
  textAlign: "left"
},

comment: {
  fontSize: 16,
  color: 'black',
  textAlign: "center",
},  

commentTimeRow: {
  justifyContent: 'flex-end',
  alignContent: 'flex-end',
  alignItems: 'flex-end',
},

commentTime: {
  textAlign: "right",
  fontSize: 16,
  color: iOSColors.black
},

rowContainer: {
  flexDirection: 'column',
  padding: 14
},

textContainer: {
flex: 1,
flexDirection: 'column',
padding: 5,
},

separator: {
width: width,
height: 2,
backgroundColor: '#111110'
},  

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
    height: 130,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 10,
    paddingTop: 20,
    paddingBottom: 15,
    alignItems: 'center'
},
blockUser: {
    color: 'black',
    fontSize: 25,
    fontFamily: 'Times New Roman'
},
reportUser: {
    color: 'black',
    fontSize: 25,
    fontFamily: 'Times New Roman',
},

reportModal: {flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: 25, marginTop: 22},
reportModalHeader: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Iowan Old Style',
    fontWeight: "bold",
    paddingBottom: 20,
},

reportInput: {width: width - 40, height: 120, marginBottom: 50, borderColor: bobbyBlue, borderWidth: 1}

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


