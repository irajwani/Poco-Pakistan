import React, {Component} from 'react'
import {Dimensions, Keyboard, Text, TextInput, TouchableHighlight, Image, View, ScrollView, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Kohana } from 'react-native-textinput-effects'
import {withNavigation} from 'react-navigation';
import firebase from '../cloud/firebase';
import { material, human, iOSUIKit, iOSColors } from 'react-native-typography'
import { highlightGreen, treeGreen, profoundPink, avenirNext, graphiteGray, darkGray } from '../colors';
import FontAwesomeIcon  from 'react-native-vector-icons/FontAwesome';
//for each comment, use their time of post as the key

const {width, height} = Dimensions.get('window')

class ProductComments extends Component {

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

    componentWillMount() {

        Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this))
        Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this))

        const {params} = this.props.navigation.state;
        const {comments} = params;
        this.setState({comments});

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

    uploadComment(name, comment, uid, uri, productKey ) {
        
        var timeCommentedKey = Date.now();
        var date = (new Date()).getDate();
        var month = (new Date()).getMonth();
        var year = (new Date()).getFullYear();
        var timeCommented = `${year}/${month.toString().length == 2 ? month : '0' + month }/${date}`;
        
        var updates = {}
        var postData = {text: comment, name: name, time: timeCommented, uri: uri }
        this.state.comments[timeCommentedKey] = postData; // --> how to create a new key in the object with certain values, which in this case is another object containing the specific comment being uploaded
        this.setState({ comments : this.state.comments });
        updates['/Users/' + uid + '/products/' + productKey + '/comments/' + timeCommentedKey + '/'] = postData
        //firebase.database().ref('Posts').set({posts: this.state.posts})
        console.log(postData, updates)
        firebase.database().ref().update(updates)
    }

    deleteComment(key, uid, productKey) {
        firebase.database().ref('/Users/' + uid + '/products/' + productKey + '/comments/' + key + '/')
        .remove( () => {
            console.log(`successfully removed product comment: ${this.state.comments[`${key}`]}`);
        })
        .then(() => {
            console.log(this.state.comments)
            delete this.state.comments[`${key}`];

            // TODO: when all comments are deleted, either locally update the state to show it has no reviews,
            // OR rework this component to pull from the cloud every time any changes are made.
            // if(Boolean(Object.keys(this.state.comments)[0])) {
            //     this.state.comments['a'] = {text: 'No Reviews have been left for this product yet.', name: 'NottMyStyle Team', time: `${year}/${month.toString().length == 2 ? month : '0' + month }/${date}`, uri: '' };
            // }
            this.setState({comments: this.state.comments});
        })
        .catch( (e) => {console.log(e)})
    }
    
    render() {

        const {params} = this.props.navigation.state;
        const {productInformation, key, yourProfile, theirProfile, uid} = params;
        const {uris, text} = productInformation //For row containing product Information
        const {name, uri} = yourProfile; //To upload a comment, attach the current Users profile details, in this case their name and profile pic uri
        
        var {comments} = this.state;
        var emptyReviews = Object.keys(comments).length == 1 && Object.keys(comments).includes('a') ? true : false
        var {a, ...restOfTheComments} = comments;
        comments = emptyReviews ? {a} : restOfTheComments;

        return (
            <View style={styles.mainContainer} >
            {/* Row to go back and look at seller info */}
            <View style={styles.backAndSellerRow}>
                <View style={styles.backIconContainer}>
                    <FontAwesomeIcon
                    name='chevron-circle-left'
                    size={40}
                    color={'#76ce1e'}
                    onPress = { () => { 
                        this.props.navigation.goBack();
                        } }

                    />
                </View>

                <View style={styles.sellerNameContainer}>
                    <Text style={styles.sellerName}>{theirProfile.name}</Text>
                </View>

                <View style={styles.sellerImageContainer}>
                    <Image source={ {uri: theirProfile.uri }} style={styles.profilePic} />
                </View>
            </View>

            <View style={{backgroundColor: 'black', height: 1.5}}/>

            {/* Row to view product picture and name */}
            
            <View style={styles.productInfoContainer}>
                {/* row containing picture, and details for product */}
               <View style={styles.productImageContainer}>
                <Image source={ {uri: uris[0] }} style={styles.productPic} />
               </View>
                
               <View style={styles.productTextContainer}>
                 <Text style={styles.name}>
                   {text.name}
                 </Text>
               </View>
               
             </View>

            <View style={{backgroundColor: 'black', height: 1.5}}/>
             
             <ScrollView style={styles.contentContainerStyle} contentContainerStyle={styles.contentContainer}>
             {Object.keys(comments).map(
                  (comment) => (
                  <View key={comment} style={styles.commentContainer}>
                    
                    {
                    comments[comment].uri == uri ?
                        <View style={styles.deleteCommentRow}>
                            <Text
                            onPress={() => this.deleteComment(comment, productInformation.uid, productInformation.key)} 
                            style={styles.deleteComment}>
                                Delete
                            </Text>
                        </View>
                    :
                        null
                    }

                      <View style={styles.commentPicAndTextRow}>

                        {comments[comment].uri ?
                          <Image style= {styles.commentPic} source={ {uri: comments[comment].uri} }/>
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
            </ScrollView>
             
            <View style={{ flexDirection : 'row', bottom : this.height - this.state.visibleHeight}} >
                <Kohana
                    style={{ backgroundColor: '#b5bcc9' }}
                    label={'Comment'}
                    value={this.state.commentString}
                    onChange={this.onCommentTextChanged.bind(this)}
                    iconClass={Icon}
                    iconName={'comment-multiple'}
                    iconColor={treeGreen}
                    labelStyle={{ color: 'black' }}
                    inputStyle={{ color: 'black' }}
                    useNativeDriver
                />

                <View style={{backgroundColor: '#fff', borderRadius: 0}}>
                    <Icon name="send" 
                            size={55} 
                            color={'#37a1e8'}
                            onPress={ () => {this.uploadComment(name, this.state.commentString, uid, uri, key);
                                        this.setState({commentString: ''}); 
                                        }}
                    />
                </View>
                
            </View>
           </View>
        )
    }
}

export default withNavigation(ProductComments)

const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        marginTop: 22,
        flexDirection: 'column',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#fff',
    },

    backAndSellerRow: {
        flexDirection: 'row',
        // flex: 1,
    },

    backIconContainer: {
        flex: 1,
        justifyContent: 'center'
    },

    sellerNameContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },

    sellerName: {
        fontFamily: avenirNext,
        fontSize: 22,
        fontWeight: '300',
        color: graphiteGray
    },

    sellerImageContainer: {
        flex: 0.8,
        padding: 5,
        // backgroundColor: 'red'
    },

    profilePic: {
        width: 50,
        height: 50,
        borderRadius: 25
    },

    productInfoContainer: {
        flexDirection: 'row',
        // flex: 1,
        padding: 5,

    },

    productImageContainer: {
        flex: 1
    },

    productPic: {
        height: 90,
        width: 90,
        borderRadius: 0
    },

    productTextContainer: {
        flex: 3,
        // flexDirection: 'column',
        justifyContent: 'center',
        // alignContent: 'center',
        alignItems: 'center',
        // textAlign: 'center',
        // backgroundColor: 'red',
    },

    name: {
        fontSize: 22,
        fontFamily: avenirNext,
        fontWeight: '500',
    },



    //to hold scrolling list of comments

    contentContainerStyle: {
        
    },
    contentContainer: {
        flexGrow: 1, 
        backgroundColor: '#fff',
        flexDirection: 'column',
        // justifyContent: 'space-evenly',
        padding: 5,
        marginTop: 5,
        marginBottom: 5
      },

    container: {
        flex: 1,
        marginTop: 5,
        marginBottom: 5,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
    },
    wrapper: {
        paddingTop: 10
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

    price: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18
    },

    brand: {
        fontFamily: 'Iowan Old Style',
        fontSize: 22,
        color: 'gray'
    },

    email: {
        ...material.caption,
        fontSize: 18,
        color: '#0394c0',
        fontStyle: 'italic'
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
        fontSize: 25,
        color: darkGray,
    },  

    commentTime: {
        fontSize: 12,
        color: '#1f6010'
    },

    rowContainer: {
        flex: 0.5,
        marginTop: 15,
        flexDirection: 'row',
        padding: 20,
        justifyContent: 'space-evenly',
        alignContent: 'center',
        // backgroundColor: iOSColors.lightGray2
      },

    profilepic: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        borderRadius: 50,
        borderColor: treeGreen,
        borderWidth: 1
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
        paddingTop: 5,
        paddingBottom: 5
      },

    separator: {
        height: 1,
        backgroundColor: 'black'
      },

    commentContainer: {
        
    flexDirection: 'column',
    // backgroundColor: 'blue'
    },

    deleteCommentRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop:5,
        paddingRight:5
        // alignContent: 'flex-end',
        // backgroundColor: 'blue'
    },

    deleteComment: {
        fontFamily: 'Cochin',
        fontSize: 15,
        color: profoundPink,
        // textAlign: 'right'
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
    
    textContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 5,
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

  });

//   <Text style={styles.price}>
//                    Price: £{text.price}
//                  </Text>
//                  <Text style={styles.brand}>
//                    {text.brand.toUpperCase()}
//                  </Text>