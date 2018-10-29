import React, { Component } from 'react'
import { Text, ScrollView, View, Image, StyleSheet, TouchableHighlight } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import ActionSheet from 'react-native-actionsheet'
import { withNavigation } from 'react-navigation';

class MultipleAddButton extends Component {
  constructor(props) {
    super(props);
    this.state = {cameraToggle: false};
  }

  showActionSheet() {
    console.log('adding Item')
    this.ActionSheet.show()

  }

  cameraOrGallery(index, navToComponent) {
    if (index === 0) {
      this.setState({cameraToggle: true});
      this.launchCamera(navToComponent);

    }
    else {this.launchGallery();}
  }

  launchCamera(navToComponent) {
    console.log('launching camera');
    this.props.navigation.navigate('MultiplePictureCamera', {navToComponent: `${navToComponent}` })
    //<MyCustomCamera />
    
  }

  launchGallery() {
    console.log('opening Photo Library');
    alert('We are currently working on this feature. Please select the camera option for now');
  }

  render() {
    
    console.log(this.props.pictureuris.length);

    if(this.props.navToComponent == 'EditProfile' || this.props.navToComponent == 'CreateProfile') {
      return (
        <View style={styles.headerBackground}>
        
        <TouchableHighlight style={styles.profilepicWrap} onPress={() => this.showActionSheet()} >
          {this.props.pictureuris === 'nothing here' ? 
            <Image source={require('../images/nothing_here.png')} style={styles.mainImage} /> : 
            <Image source={{uri: this.props.pictureuris[0]}} style={styles.mainImage} />
            }

        </TouchableHighlight>
        
        
          <ActionSheet
          ref={o => this.ActionSheet = o}
          title={'Choose picture selection option'}
          options={['Camera', 'PhotoLibrary', 'cancel']}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          onPress={(index) => { console.log(index); this.cameraOrGallery(index, this.props.navToComponent) }}
          />
        
        
       
        </View>
      )
    }
    
    return (
      <View style={styles.headerBackground}>
        
        <TouchableHighlight style={styles.profilepicWrap} onPress={() => this.showActionSheet()} >
          {this.props.pictureuris === 'nothing here' ? 
            <Image source={require('../images/nothing_here.png')} style={styles.mainImage} /> : 
            <Image source={{uri: this.props.pictureuris[0]}} style={styles.mainImage} />
            }

        </TouchableHighlight>

        <View style={ { 
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              }}
        >

            {Array.isArray(this.props.pictureuris) && this.props.pictureuris.length >= 2  ?
                <Image source={{uri: this.props.pictureuris[1]}} style={styles.profilepic} /> :
                <Image source={require('../images/nothing_here.png')} style={styles.profilepic} />
            }

            {Array.isArray(this.props.pictureuris) && this.props.pictureuris.length >= 3 ?
                <Image source={{uri: this.props.pictureuris[2]}} style={styles.profilepic} /> :
                <Image source={require('../images/nothing_here.png')} style={styles.profilepic} />
            }

            {Array.isArray(this.props.pictureuris) && this.props.pictureuris.length >= 4 ?
                <Image source={{uri: this.props.pictureuris[3]}} style={styles.profilepic} /> :
                <Image source={require('../images/nothing_here.png')} style={styles.profilepic} />
            }
        
        </View>
        
        
        
          <ActionSheet
          ref={o => this.ActionSheet = o}
          title={'Choose picture selection option'}
          options={['Camera', 'PhotoLibrary', 'cancel']}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          onPress={(index) => { console.log(index); this.cameraOrGallery(index, this.props.navToComponent) }}
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
  headerBackground: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5
  },
  profilepicWrap: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderColor: 'green',
    borderWidth: 5,
    
  },

  mainImage: {
    flex: 1,
    width: null,
    alignSelf: 'stretch',
    borderRadius: 65,
    borderColor: '#fff',
    
  },

  profilepic: {
    flex: 1,
    width: 100,
    height: 100,
    alignSelf: 'stretch',
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'green',
    padding: 10,
    
  },

} )

export default withNavigation(MultipleAddButton)