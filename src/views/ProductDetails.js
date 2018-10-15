import React, { Component } from 'react';
import {ScrollView, View, Text, Image, Dimensions, StyleSheet} from 'react-native';
import { withNavigation } from 'react-navigation';
import firebase from '../cloud/firebase';

import CustomCarousel from '../components/CustomCarousel';
import CustomComments from '../components/CustomComments';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import styles from '../styles.js'
import { database } from '../cloud/database';
import { Divider } from 'react-native-elements';

import { iOSColors, iOSUIKit } from 'react-native-typography';
import MoreDetailsListItem from '../components/MoreDetailsListItem';


var {height, width} = Dimensions.get('window');

class ProductDetails extends Component {

  constructor(props){
    super(props);
    this.state = {
      isGetting: true,
      profile: {
        name: '',
        email: '',
      },
      collectionKeys: [3],
    }
  }

  componentWillMount() {
    const {params} = this.props.navigation.state;

    setTimeout(() => {
      this.getProfile(params.data);
    }, 4);
  }

  removeFalsyValuesFrom(object) {
    const newObject = {};
    Object.keys(object).forEach((property) => {
      if (object[property]) {newObject[property] = object[property]}
    })
    return Object.values(newObject);
  }

  getProfile(data) {
    database.then( (d) => {
      const uid = firebase.auth().currentUser.uid;

      //get profile info of seller of product
      const profile = d.Users[data.uid].profile;

      //get collection keys of current user
      var collection = d.Users[uid].collection ? d.Users[uid].collection : null;
      var rawCollectionKeys = collection ? Object.keys(collection) : []
      var collectionKeys = rawCollectionKeys ? this.removeFalsyValuesFrom(rawCollectionKeys) : ['nothing'] ;  

      var soldProducts = 0;

      //get profile data of seller of product
      for(var p of Object.values(d.Users[data.uid].products)) {
        if(p.sold) {
          soldProducts++
        }
      }
      
      var numberProducts = Object.keys(d.Users[data.uid].products).length

      this.setState( {profile, numberProducts, soldProducts, collectionKeys} )
    })
    .then( () => {
      this.setState({isGetting: false})
    })
  }

  // incrementLikes(likes, uid, key) {
  //   //add like to product, and add this product to user's collection; if already in collection, modal shows user
  //   //theyve already liked the product
  //   if(this.state.collectionKeys.includes(key)) {
  //     console.log("you've already liked this product")

  //   } 
    
  //   else {
  //     var userCollectionUpdates = {};
  //     userCollectionUpdates['/Users/' + uid + '/collection/' + key + '/'] = true;
  //     firebase.database().ref().update(updates);

  //     var updates = {};
  //     likes += 1;
  //     var postData = likes;
  //     updates['/Users/' + uid + '/products/' + key + '/likes/'] = postData;
  //     firebase.database().ref().update(updates);

  //   }
    
  // }

  render() {
    const { params } = this.props.navigation.state;
    const { data } = params;
    
    const {profile} = this.state;
    const text = data.text;
    const details = {
      gender: text.gender,
      size: text.size,
      type: text.type,
      condition: text.condition,
      months: text.months,
      original_price: text.original_price
    };
    const description = text.description;
    const {comments} = text;

    console.log("videos: updating")

    if (this.state.isGetting) {
      return (
        <View>
          <Text> Loading... </Text>
        </View>
      )
    }

    return (

      <ScrollView contentContainerStyle={styles.contentContainer}>

        {/* image carousel */}

        <CustomCarousel data={params.data.uris} />

        {/* product details */}
        <Text style={styles.brandText}> {text.brand.toUpperCase()} </Text>

        <View style={styles.nameAndLikeRow} >
          <Text style={styles.nameText}> {text.name.toUpperCase() } </Text>
          <View style={styles.likesRow}>

              {this.state.collectionKeys.includes(params.data.key) ? 
                  <Icon name="heart" 
                        size={22} 
                        color='#800000'
                        onPress={() => { alert("you've already liked this product"); }}

              /> : <Icon name="heart-outline" 
                        size={22} 
                        color='#800000'
                        onPress={() => {alert('You may like this product directly from marketplace page')}}

              />}

              <Text style={styles.likes}>{params.data.text.likes}</Text>
            </View> 
        </View>
        
        <Text style={styles.priceText}> £{text.price} </Text>



        {/* row showing user details */}
        <View style={profileRowStyles.separator}/>
        <View style={profileRowStyles.rowContainer}>
          {/* row containing profile picture, and user details */}
          <Image source={ {uri: profile.uri }} style={profileRowStyles.profilepic} />
          <View style={profileRowStyles.textContainer}>
            
            <Text style={profileRowStyles.name}>
              {profile.name}
            </Text>
            <Text style={profileRowStyles.email}>
              {profile.email}
            </Text>
            <Text style={profileRowStyles.insta}>
              @{profile.insta}
            </Text>
            
          </View>
          
          
        </View>
        <View style={ {flexDirection: 'row',} }>
            <Text style={styles.numberProducts}>Products on Sale: {this.state.numberProducts} </Text>
            <Divider style={{  backgroundColor: iOSColors.black, width: 3, height: 20 }} />
            <Text style={styles.soldProducts}> Products Sold: {this.state.soldProducts}</Text>
        </View>
        <View style={profileRowStyles.separator}/>

        
        
        

        {/* more details */}
        
        { Object.keys(details).map( (key) => (
          
            <View style={styles.dalmationContainer}>
              <View style={ styles.keyContainer }>
                  <Text style={styles.keyText}>{key === 'original_price' ? 'ORIGINAL PRICE' : key.toUpperCase()}</Text>
              </View>
              <View style={ styles.valueContainer }>
                  <Text style={styles.valueText}>{details[key]}</Text>
              </View>
            </View>

        )
        ) }

        {/* buy button */}

        {/* comments */}

        <CustomComments comments={comments} currentUsersName={profile.name}/>

      </ScrollView> 
    );
  }
}

export default withNavigation(ProductDetails);

const styles = StyleSheet.create( {
  contentContainer: {
    flexGrow: 1, 
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    padding: 10,
    marginTop: 5,
    marginBottom: 5
  },

  brandText: {
    fontFamily: 'Courier-Bold',
    fontSize: 35,
    fontWeight: '400'
  },

  priceText: {
    fontFamily: 'Avenir',
    fontSize: 28,
    fontWeight: '400',
    padding: 5,
    color: '#91627b'
    
  },

  nameAndLikeRow: {
    flexDirection: 'row'
  },

  nameText: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 20,
    padding: 10,
  },

  likesRow: {
    flexDirection: 'row',
    backgroundColor: iOSColors.white,
    marginLeft: 60,
  },

  likes: {
    ...iOSUIKit.largeTitleEmphasized,
    fontSize: 20,
    color: '#c61919',
    padding: 2,
    marginLeft: 4,
  },

  numberProducts: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold'
  },
  soldProducts: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold'
  },

  dalmationContainer: {
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'space-evenly'
},

keyContainer: {
    width: (width/2) - 30,
    height: 40,
    padding: 5,
    justifyContent: 'center',
    backgroundColor: iOSColors.customGray
},

valueContainer: {
    width: (width/2),
    height: 40,
    padding: 5,
    justifyContent: 'center',
    backgroundColor: iOSColors.black
},

keyText: {
    color: iOSColors.black,
    fontFamily: 'TrebuchetMS-Bold',
    fontSize: 15,
    fontWeight: '400'

},

valueText: {
    color: iOSColors.white,
    fontFamily: 'Al Nile',
    fontSize: 18,
    fontWeight: '300'

},

} )

const profileRowStyles = StyleSheet.create( {
  rowContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'center'
  },


  profilepic: {
    borderWidth:1,
    borderColor:'#207011',
    alignItems:'center',
    justifyContent:'center',
    width:70,
    height:70,
    backgroundColor:'#fff',
    borderRadius:50,
    borderWidth: 2

},

textContainer: {
  flex: 1,
  flexDirection: 'column',
  alignContent: 'center',
  padding: 5,
},

name: {
  fontSize: 18,
  color: '#207011',
},

email: {
    fontSize: 18,
    color: '#0394c0',
    fontStyle: 'italic'
  },
  
insta: {
    fontSize: 16,
    color: '#13a34c',
    fontWeight: '600',
    fontStyle: 'normal'
  },  

separator: {
  height: 1,
  backgroundColor: 'black',
  padding: 2,
},
} )