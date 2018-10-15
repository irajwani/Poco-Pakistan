import React, {Component} from 'react'
import {Dimensions, Keyboard, Text, TextInput, Image, TouchableHighlight, View, ScrollView, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Kohana } from 'react-native-textinput-effects'
import { material, systemWeights, human, iOSUIKit } from 'react-native-typography';
import {withNavigation} from 'react-navigation';
import {database} from '../cloud/database';
import firebase from '../cloud/firebase';
import { PacmanIndicator } from 'react-native-indicators';


//for each comment, use their time of post as the key
function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return seconds == 0 ? "Just now" : Math.floor(seconds) + " seconds";
    
}

class Comments extends Component {

    constructor(props) {
        super(props);
        this.state = {
          comments: {},
          commentString: '',
          visibleHeight: Dimensions.get('window').height,
          isGetting: true,
        }
        this.height = this.state.visibleHeight
        
        
    }

    componentWillMount () {
        const {params} = this.props.navigation.state;
        Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this))
        Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this))
        setTimeout(() => {
            this.getComments(params.uid, params.productKey);
          }, 4);
    }

    getComments(uid, productKey) {
        console.log(uid, productKey);
        const keys = [];
        database.then( (d) => {
          //get list of comments for specific product
          //var comments = d.Users[uid]
          var comments = d.Users[uid].products[productKey].comments ? d.Users[uid].products[productKey].comments : {a: {text: 'No Reviews have been left for this product. Be the first to review this good', name: 'NottMyStyle Team', time: Date.now() } };
          this.setState({ comments });
          console.log(comments);
    
        })
        .then( () => { console.log('here');this.setState( {isGetting: false} );  } )
        .catch( (err) => {console.log(err) })
        
    }

    keyboardWillShow (e) {
        let newSize = Dimensions.get('window').height - e.endCoordinates.height
        this.setState({visibleHeight: newSize})
      }

    keyboardWillHide (e) {
       this.setState({visibleHeight: Dimensions.get('window').height})
    }

    onCommentTextChanged(event) {
        this.setState({ commentString: event.nativeEvent.text });
    }

    uploadComment(name, comment, uid, productKey, ) {
        var timeCommented = Date.now();
        var updates = {}
        var postData = {text: comment, name: name, time: timeCommented }
        this.state.comments[timeCommented] = postData;
        this.setState({ comments : this.state.comments });
        updates['/Users/' + uid + '/products/' + productKey + '/comments/' + timeCommented + '/'] = postData
        //firebase.database().ref('Posts').set({posts: this.state.posts})
        firebase.database().ref().update(updates)
    }
    
    render() {

        const {params} = this.props.navigation.state;
        const {comments} = this.state;
        Object.keys(comments).map( (key) => {
            console.log(comments[key].name)
        })

        if(this.state.isGetting) {
            return ( 
                <View style={{flex: 1}}>
                    <PacmanIndicator color='#189fe2' />
                </View>
            )
        }

        return (
            <View style={styles.wrapper} >
            <ScrollView contentContainerStyle={styles.wrapper}>
            <View style={styles.rowContainer}>
                {/* row containing profile picture, and user details */}
               <Image source={ {uri: params.uri }} style={styles.profilepic} />
               <View style={styles.textContainer}>
                 
                 <Text style={styles.name}>
                   {params.text.name}
                 </Text>
                 <Text style={styles.brand}>
                   {params.text.brand}
                 </Text>
                 <Text style={styles.price}>
                   Price: ${params.text.price}
                 </Text>

               </View>
               
             </View>
             <View style={styles.separator}/>

             {Object.keys(comments).map(
                 (comment) => (
                 <View key={comment} style={styles.rowContainer}>
                    <View style={styles.textContainer}>
                        <Text style={ styles.naam }> {comments[comment].name} </Text>
                        <Text style={styles.comment}> {comments[comment].text}  </Text>
                        <Text style={ styles.commentTime }> {timeSince(comments[comment].time)} ago </Text>
                    </View>
                    <View style={styles.separator}/>
                 </View>
            )
                     
             )}
             </ScrollView>
            <View style={{flexDirection : 'row', bottom : this.height - this.state.visibleHeight}} >
                <Kohana
                    style={{ backgroundColor: '#f9f5ed' }}
                    label={'Comment'}
                    value={this.state.commentString}
                    onChange={this.onCommentTextChanged.bind(this)}
                    iconClass={Icon}
                    iconName={'comment-multiple'}
                    iconColor={'#f4d29a'}
                    labelStyle={{ color: '#91627b' }}
                    inputStyle={{ color: '#91627b' }}
                    useNativeDriver
                />
                <Icon name="send" 
                        size={50} 
                        color={'#37a1e8'}
                        onPress={ () => {this.uploadComment(params.name , this.state.commentString, params.uid, params.productKey);
                                        this.setState({commentString: ''}); 
                                        }}
                />
            </View>
           </View>
        )
    }
}

export default withNavigation(Comments)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 5,
        marginBottom: 5,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
    },
    wrapper: {
        flex: 1
      },
    scrollcontainer: {
        padding: 15,
    },
    searchInput: {
        height: 36,
        padding: 4,
        marginRight: 5,
        flex: 1,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#32cd32',
        borderRadius: 8,
        color: '#32cd32'
    },

    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch'
      },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    button: {
        backgroundColor: "#800000",
        width: 100,
        height: 45,
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 5
    },

    name: {
        ...material.headline,
        fontSize: 18,
        color: '#207011',
    },

    brand: {
        ...material.caption,
        fontSize: 18,
        color: '#0394c0',
        fontStyle: 'italic'
      }, 
      
    price: {
        ...material.caption,
        fontSize: 18,
        color: '#800000',
        fontStyle: 'normal'
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
        flexDirection: 'row',
        padding: 20
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
    
    time: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#32cd32'
      },
    
    textContainer: {
        flex: 1,
        flexDirection: 'column',
        alignContent: 'center',
        padding: 5,
      },

    separator: {
        height: 1,
        backgroundColor: 'black'
      },

  });