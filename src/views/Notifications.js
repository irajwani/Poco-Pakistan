import React, { Component } from 'react'
import { Dimensions, Text, Image, View, ScrollView, StyleSheet } from 'react-native'
import firebase from '../cloud/firebase';
import { database } from '../cloud/database';
import { withNavigation } from 'react-navigation';
import { material } from 'react-native-typography';
import { PacmanIndicator } from 'react-native-indicators';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-elements';

const {width} = Dimensions.get('window');

class Notifications extends Component {
  constructor(props) {
      super(props);
      this.state={isGetting:true};
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
      const notifications = d.Users[uid].notifications
      this.setState({notifications});
      
    })
    .then( () => { this.setState( {isGetting: false} );  } )
    .catch( (err) => {console.log(err) })
    
  }

  render() {
    const {isGetting, notifications} = this.state;
    console.log(notifications);
    if(isGetting) {
        return (
            <View style={{flex: 1}}>
                <PacmanIndicator color='#0a968f' />
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
        <Button 
                buttonStyle={styles.notifsbutton}
                title="Chats"
                onPress={()=>this.navToChats()}
        />  
      </ScrollView>
    )
  }
}

export default withNavigation(Notifications);

const styles = StyleSheet.create({
    notifsbutton: {
        backgroundColor: "#20b590",
        width: 200,
        height: 50,
        borderWidth: 2,
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
  
  
  