import React, { Component } from 'react'
import { Text, ScrollView, View, Image, StyleSheet, TouchableHighlight, CameraRoll, PermissionsAndroid } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import ActionSheet from 'react-native-actionsheet'
import { withNavigation } from 'react-navigation';
import { lightGreen, highlightGreen, darkBlue, optionLabelBlue } from '../colors';

class MultipleAddButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraToggle: false, 
      showPhotoGallery: false,
      photoArray: []
    };
  }

  showActionSheet() {
    // console.log('adding Item')
    this.ActionSheet.show()

  }

  cameraOrGallery(index, navToComponent) {
    if (index === 0) {
      this.setState({cameraToggle: true});
      this.launchCamera(navToComponent);

    }

    if (index == 1) {
      Platform.OS == "android" ? this.requestPhotosPermission(navToComponent) : this.launchGallery(navToComponent);
    }
    
    // if (index == 0) {
    //   return null
    // }
  }

  launchCamera(navToComponent) {
    // console.log('launching camera');
    this.props.navigation.navigate('MultiplePictureCamera', {navToComponent: `${navToComponent}` })
    //<MyCustomCamera />
    
  }

  launchGallery(navToComponent) {
    // console.log('opening Photo Library');
    let photoArray;
    
    CameraRoll.getPhotos({ first: 100 })
    .then(res => {
      photoArray = res.edges;
      console.log(photoArray);
      //now navigate to new component which will collect the image uri for usage and then nav back to create profile
      this.props.navigation.navigate('ViewPhotos', {photoArray: photoArray, navToComponent: `${navToComponent}` })
      // this.setState({ showPhotoGallery: true, photoArray: photoArray })
    })
    
    
  }

  requestPhotosPermission = async (navToComponent) => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.launchGallery(navToComponent);
        } else {
          alert('NottMyStyle cannot select a picture(s) from your gallery without your permission to access your gallery.');
        }
    } catch (err) {
      console.warn(err)
    }
  }

  renderMainPictureRow = (pictureuris) => {
    return (
      <View style={styles.mainPictureRow}>
        <TouchableHighlight style={styles.mainPictureTouchContainer} onPress={() => this.showActionSheet()} >
          
            <Image 
            source={
              pictureuris === 'nothing here' ? 
              require('../images/nothing_here.png') 
              :
              {uri: pictureuris[0]} } 
            style={styles.mainPicture} /> 
            
        </TouchableHighlight>        
      </View>
    )
  }

  //Function to display this piece of UI is invoked only if pictureuris length is greater than 1, and of course the check on if whether it's an array or the string: 'nothing here'
  renderOtherPicturesRow = (pictureuris) => {
    // var pictures = pictureuris == 'nothing here' ? 'zero pictures' : pictureuris.slice(1);

    const pictures = pictureuris.slice(1);
    // console.log(pictures)
    return (
      
      <ScrollView horizontal={true} scrollEnabled={pictures.length == 3 ? true : false} style={{flex: 0.3,}} contentContainerStyle={styles.otherPicturesRow}>
        
        {pictures.map( (uri, index) => 
          <TouchableHighlight style={{paddingHorizontal: 3}} onPress={() => this.showActionSheet()} >
            <Image source={{uri: uri}} style={styles.otherPicture} /> 
          </TouchableHighlight>  
          
        )
        }
      </ScrollView>
      
    )
  }

  render() {

    var moreThanOnePicture = Array.isArray(this.props.pictureuris) && this.props.pictureuris.length > 1;
    
    // console.log(moreThanOnePicture);
    // just have one uri and one image placeholder in the case of creating or editing your profile
    if(this.props.navToComponent == 'EditProfile' || this.props.navToComponent == 'CreateProfile') {
      return (
        <View style={styles.mainContainer}>
        
          {this.renderMainPictureRow(this.props.pictureuris)}
        
          <ActionSheet
          ref={o => this.ActionSheet = o}
          title={'Method to Select Picture:'}
          options={['Camera', 'PhotoLibrary', 'cancel']}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          onPress={(index) => { this.cameraOrGallery(index, this.props.navToComponent) }}
          
          />
        
        </View>
      )
    }
    
    return (
      <View style={[styles.mainContainer, {height: moreThanOnePicture ? 270: 140}]}>
        
          {this.renderMainPictureRow(this.props.pictureuris)}
          {moreThanOnePicture ?
            this.renderOtherPicturesRow(this.props.pictureuris)
            :
            null
          }
        
        
          <ActionSheet
          ref={o => this.ActionSheet = o}
          title={'Choose picture selection option'}
          options={['Camera', 'PhotoLibrary', 'cancel']}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          onPress={(index) => { this.cameraOrGallery(index, this.props.navToComponent) }}
          />
        
        
       
        </View>
        
      
      
    )
  }
}

{/* <Icon.Button name='plus' onPress={() => this.showActionSheet() }>
          <Text>Add Picture of Item</Text>
        </Icon.Button> */}

const styles = StyleSheet.create( {

  image: {
    width: 100,
    height: 100
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    
  },


  mainPictureRow: {
    flex: 1,
    flexDirection: 'row',
    // backgroundColor: 'yellow'
  },

  mainPictureTouchContainer: {
    // flex: 2,
    // backgroundColor: 'yellow',
    // width: 150,
    // height: 150,
    paddingVertical: 0,
    // paddingHorizontal: 5,
    borderRadius: 0
    // width: null,
    // height: null,
    // resizeMode: 'cover',
    // width: 150,
    // height: 150,
    // borderRadius: 100,
    // borderColor: 'green',
    // borderWidth: 5,
    
  },

  mainPicture: {
    // flex: 1,
    width: 130,
    height: 130,
    // alignSelf: 'stretch',
    // resizeMode: 'cover',
    // alignSelf: 'stretch',
    borderRadius: 10,
    borderColor: optionLabelBlue,
    borderWidth: 0.5,
    
  },

  otherPicturesRow: {
    // height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 5,
    // backgroundColor: 'green',
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },

  otherPictureTouchContainer: {
    flex: 0.3,
    // width: 80,
    // height: 80,
    borderRadius: 0,
    // backgroundColor: 'yellow'
  },

  otherPicture: {
    // width: null,
    // height: null,
    // resizeMode: 'cover',
    width: 110,
    height: 110,
    // alignSelf: 'stretch',
    borderRadius: 5,
    borderColor: optionLabelBlue,
    borderWidth: 1,
  },

  // profilepic: {
  //   flex: 1,
  //   width: null,
  //   height: null,
  //   // width: 60,
  //   // height: 100,
  //   // alignSelf: 'stretch',
  //   resizeMode: 'cover',
  //   borderRadius: 20,
  //   borderWidth: 2,
  //   borderColor: highlightGreen,
  //   padding: 10,
    
  // },

} )

export default withNavigation(MultipleAddButton)


{/* <TouchableHighlight style={styles.profilepicWrap} onPress={() => this.showActionSheet()} >
          {this.props.pictureuris === 'nothing here' ? 
            <Image source={require('../images/nothing_here.png')} style={styles.mainImage} /> : 
            <Image source={{uri: this.props.pictureuris[0]}} style={styles.mainImage} />
            }

        </TouchableHighlight>

        <View
          style={styles.otherPicturesRow}
          
        >
          <TouchableHighlight onPress={() => this.showActionSheet()} >
            {Array.isArray(this.props.pictureuris) && this.props.pictureuris.length >= 2  ?
                <Image source={{uri: this.props.pictureuris[1]}} style={styles.profilepic} /> :
                <Image source={require('../images/nothing_here.png')} style={styles.profilepic} />
            }
          </TouchableHighlight>

          <TouchableHighlight onPress={() => this.showActionSheet()} >  

            {Array.isArray(this.props.pictureuris) && this.props.pictureuris.length >= 3 ?
                <Image source={{uri: this.props.pictureuris[2]}} style={styles.profilepic} /> :
                <Image source={require('../images/nothing_here.png')} style={styles.profilepic} />
            }
          </TouchableHighlight>

            <TouchableHighlight onPress={() => this.showActionSheet()} >
            {Array.isArray(this.props.pictureuris) && this.props.pictureuris.length >= 4 ?
                <Image source={{uri: this.props.pictureuris[3]}} style={styles.profilepic} /> :
                <Image source={require('../images/nothing_here.png')} style={styles.profilepic} />
            }
            </TouchableHighlight>
        
        </View> */}