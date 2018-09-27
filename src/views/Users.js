import React, { Component } from 'react'
import { Text, ScrollView, View, Image, StyleSheet, TouchableHighlight } from 'react-native'
import { material } from 'react-native-typography'
import { withNavigation } from 'react-navigation';
import { database } from '../cloud/database';
import firebase from '../cloud/firebase';

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isGetting: true,
        };
    }

    componentWillMount() {
        setTimeout(() => {
            this.getUsers();
        }, 4);
    }

    getUsers() {
        database.then( (d) => {
            this.setState( {users: d.Users, } )
        })
        .then( () => { this.setState({isGetting: false})})
        .catch( (err) => console.log(err))
    }

    navToReview(name, email, uri, users) {
        //var uid = Object.keys(users)[0];
        //get uid of user whose profile you're visiting by cross-referencing it against his profile pic url
        var uid;
        Object.keys(users).forEach( (user) => {
            if(users[user].profile.uri == uri) {
                console.log(user)
                uid = user;
            }
        });
        console.log(uid);    
        
        this.props.navigation.navigate('UserComments', {name: name, email: email, uri: uri, uid: uid});
    }

    render() {
        const {users} = this.state
        if(this.state.isGetting) {
            return (
                <View>
                    <Text>Loading...</Text>
                </View>
            )
        }

        return (
            <ScrollView
                contentContainerStyle={styles.contentContainer}>

                {Object.keys(users).map( (key) => 
                    <View style={styles.rowContainer}>
                        <TouchableHighlight style={styles.profilepicWrap} onPress={() => {this.navToReview(users[key].profile.name, users[key].profile.email, users[key].profile.uri, users )} } >
                            <Image source={ {uri: users[key].profile.uri }} style={styles.profilepic} />
                        </TouchableHighlight>
                        <View style={styles.textContainer} />
                            <Text style={styles.name}>{users[key].profile.name}</Text>
                            <Text style={styles.pos}>{users[key].profile.email} </Text>
                            <Text style={styles.insta}>@{users[key].profile.insta} </Text>
                        <View style={styles.textContainer} />
                        <View style={styles.separator}/>
                    </View>
                )}

            </ScrollView>
        )
  }
}

const styles = StyleSheet.create({
    contentContainer: {
        flexGrow: 1, 
        backgroundColor: '#fff',
        flexDirection: 'column',
          
    },
    imageadder: {
        flexDirection: 'row'
    },

    separator: {
        height: 1,
        backgroundColor: 'black'
      },

    promptText: {fontSize: 12, fontStyle: 'normal', textAlign: 'center'},

    rowContainer: {
        flexDirection: 'column',
        padding: 10,
        alignContent: 'center',
        justifyContent: 'center'
      },

    profilepicWrap: {
        width: 150,
        height: 150,
        borderRadius: 100,
        borderColor: 'blue',
        borderWidth: 5,
        
    },

    profilepic: {
        flex: 1,
        width: null,
        alignSelf: 'stretch',
        borderRadius: 65,
        borderColor: '#fff',
        
    },  
    
    time: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#32cd32'
      },
    
    textContainer: {
        flexDirection: 'column',
      },
    
    name: {
        ...material.title,
        fontSize: 18,
        color: 'black',
      },

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
      },  

    separator: {
        height: 1,
        backgroundColor: 'black'
      },

})
export default withNavigation(Users);