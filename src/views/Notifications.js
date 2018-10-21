import React, { Component } from 'react'
import { Dimensions, Text, Image, View, ScrollView, StyleSheet } from 'react-native'
import firebase from '../cloud/firebase';
import { database } from '../cloud/database';
import { withNavigation } from 'react-navigation';
import { material } from 'react-native-typography';
import { PacmanIndicator } from 'react-native-indicators';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-elements';

import { lightGreen } from '../colors';

const noNotificationsText = "The NottMyStyle team believes your products don't warrant any stats yet 👌, thus you have no notifications"

const {width} = Dimensions.get('window');

class Notifications extends Component {
  constructor(props) {
      super(props);
      this.state={isGetting:true, noNotifications: false};
  }

  componentWillMount() {
    setTimeout(() => {
      this.getNotifications();
    }, 1000);
  }

  navToChats() {
      this.props.navigation.navigate('Chats');
  }

  getNotifications() {
    //get chats for particular user
    database.then( (d) => {
      const uid = firebase.auth().currentUser.uid;
      if(d.Users[uid].notifications) {
        const notifications = d.Users[uid].notifications 
        this.setState({notifications});
      } 
      else {
        this.setState({noNotifications: true})
      }
      
      
    })
    .then( () => { this.setState( {isGetting: false} );  } )
    .catch( (err) => {console.log(err) })
    
  }

  render() {
    const {isGetting, noNotifications, notifications} = this.state;
    console.log(notifications);
    if(isGetting) {
        return (
            <View style={{flex: 1}}>
                <PacmanIndicator color='#0a968f' />
            </View>
        )
    }

    if(noNotifications) {
      return (
        <View style={styles.container}>
          <View style={styles.upperNavTab}>
              <Button 
                buttonStyle={styles.notifsbutton}
                textStyle={{fontSize: 18, color: 'black'}}
                title="Chats"
                onPress={()=>this.navToChats()}
              />
              <Button 
                buttonStyle={styles.chatsbutton}
                textStyle={{fontSize: 18, color: 'black'}}
                title="Notifications"
              />
          </View>
          
          <Text style={{fontFamily: 'Iowan Old Style', fontSize: 30, color: 'green'}}>{noNotificationsText}</Text>
          
        </View>
      )
    }

    return (
      <ScrollView contentContainerStyle={{
        paddingTop: 15,
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
      }}>
        {Object.keys(notifications).map( (productKey) => (
            <View key={productKey} style={{flexDirection: 'column', padding: 5}}>
              <View style={styles.separator}/>
              <View style={styles.rowContainer}>
                <View syle={styles.daysElapsedColumn}>
                    <Text style={styles.daysOnMarket}>Days on market:</Text>
                    <Text style={styles.daysElapsed}>{notifications[productKey].daysElapsed}</Text>
                    <Text>Suggested Price Reduction:</Text>
                    <View style={styles.priceReduction}>
                        <Text>£{notifications[productKey].price}</Text>
                        <Icon
                            name="arrow-right" 
                            size={15}  
                            color={'#800000'}
                        />
                        <Text>£{Math.floor(0.80*notifications[productKey].price)}</Text>
                    </View>
                </View>    

                
                <Image source={ {uri: notifications[productKey].uri }} style={[styles.profilepic, styles.productcolor]} />
                
              </View>
              <View style={styles.separator}/>
            </View>
        ))
        }
          
      </ScrollView>
    )
  }
}

export default withNavigation(Notifications);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginTop: 22,
    backgroundColor: lightGreen
  },
  upperNavTab: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: lightGreen,
  },
  chatsbutton: {
    backgroundColor: lightGreen,
    width: width/2 - 30,
    height: 50,
    borderWidth: 0,
    borderRadius: 0,
    borderColor: "#0c5911"
  },
  notifsbutton: {
    backgroundColor: "#fff",
    width: width/2 - 30,
    height: 50,
    borderWidth: 1,
    borderRadius: 0,
    borderColor: "#0c5911"
  },
    daysElapsedColumn: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5
    },
    daysOnMarket: {
        ...material.display1,
        fontFamily: 'Verdana',
        fontSize: 10,
        color: 'black'
    },
    daysElapsed: {
        ...material.display2,
        fontSize: 16,
        color: '#0d7259',
    },
    priceReduction: {
        flexDirection: 'row',
        padding: 5
    },
    rowContainer: {
      flexDirection: 'row',
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 5,
      paddingRight: 5,
      justifyContent: 'space-evenly',
      alignItems: 'center',
      backgroundColor: '#fff'
    },
    profilepic: {
      borderWidth:1,
      alignItems:'center',
      justifyContent:'center',
      width:70,
      height:70,
      backgroundColor:'#fff',
      borderRadius: 35,
      borderWidth: 2
  
  },
    profilecolor: {
      borderColor: '#187fe0'
    },
    productcolor: {
      borderColor: '#86bb71'
    },
  infoandbuttoncontainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
    paddingBottom: 5
  },
  info: {
    ...material.subheading,
  },  
  productinfo: {
    color: "#800000",
    fontSize: 15
  },
  sellerinfo: {
    fontSize: 12,
    color: "#07686d"
  },
  messagebutton: {
    backgroundColor: "#86bb71",
    width: 75,
    height: 45,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#187fe0"
  },
  separator: {
    backgroundColor: '#86bb71',
    width: width,
    height: 2
  },  
  })
  
  
  