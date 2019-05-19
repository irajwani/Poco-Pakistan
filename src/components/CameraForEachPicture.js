import React, { Component } from 'react'
import { Text, ScrollView, SafeAreaView, View, Image, StyleSheet, Platform, FlatList, TouchableOpacity } from 'react-native'

import { StandardHeader } from '../stylesheets/view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ImagePicker from 'react-native-image-picker';
import { avenirNext, lightPurple, lightGray } from '../colors';


const placeholderColor = 'black'


export default class CameraForEachPicture extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pictures: [
                {uri: false}, {uri: false}, {uri: false}, {uri: false}, 
            ]
        };
    }

    openCamera = (index) => {
        console.log('opening camera')


        const options = {
            title: null,
            cancelButtonTitle: null,
            takePhotoButtonTitle: null,
            chooseFromLibraryButtonTitle: null,
            cameraType: 'back',
            mediaType: 'photo',
        }

        ImagePicker.launchCamera(options, (response) => {
            const picture = [response.uri];
            console.log(picture)
            const {...state} = this.state;
            state.pictures[index].uri = picture;
            this.setState(state);
        })
    }

    confirmSelection = () => {
        let pictureuris = [];
        this.state.pictures.forEach((picture) => {
            if(picture.uri){
                pictureuris.push(picture.uri);
            }
            
        })
        this.props.navigation.navigate(`${this.props.navigation.state.params.navToComponent}`, {pictureuris: this.state.pictures} );
    }
    

    _renderItem = (picture, index) => {
        return (
            <TouchableOpacity key={index} style={styles.pictureContainer} onPress={() => this.openCamera(index)}>
                {picture.uri ? 
                    <Image src={{uri: picture.uri}} style={styles.picture}/>
                    :
                    <Icon name={'plus'} size={70} color={placeholderColor} />
                }
            </TouchableOpacity>
        )
    }

    _renderSaveButton = () => {
        let conditionSatisfied = false;
        this.state.pictures.forEach( (obj) => {
            if(obj.uri != false) {
                conditionSatisfied = true;
            }
        } )

        return(
        <TouchableOpacity 
        disabled={conditionSatisfied ? false : true}
        onPress={this.confirmSelection}
        style={[styles.saveButton, {backgroundColor: conditionSatisfied ? lightPurple : lightGray}]}>
            <Text style={{fontFamily: 'Avenir Next', fontWeight: '300', fontSize: 20, color: '#fff'}}>Save</Text>
        </TouchableOpacity>
        )
    }

    render() {
        return (
            <SafeAreaView style={[styles.mainContainer, {marginTop: Platform.OS == "ios" ? 22 : 0}]}>

                <StandardHeader navigation={this.props.navigation}/>

                <ScrollView style={{flex: 0.8}} contentContainerStyle={styles.picturesContainer}>
                    {this.state.pictures.map( (picture, index) => this._renderItem(picture,index))}
                    {/* <FlatList 
                        keyExtractor={(picture, index) => index}
                        data={this.state.pictures}
                        renderItem={(picture, index) => this._renderItem(picture, index)}
                    /> */}
                </ScrollView>

                {this._renderSaveButton()}
                
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff'

    },

    picturesContainer: {
        flexGrow: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        // backgroundColor: 'green',
        justifyContent: 'space-evenly',
        // alignItems: 'flex-start'
    },

    pictureContainer: {
        width: 120,
        height: 120,
        margin: 10,
        borderColor: placeholderColor,
        borderRadius: 10,
        borderWidth: 3,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'yellow'
    },

    picture: {width: 90, height: 90},

    saveButton: {
        flex: 0.1,
        alignItems: 'center',
        justifyContent: 'center',
    }
})
