import React, { Component } from 'react'
import { Text, StyleSheet, View, ActivityIndicator, TouchableHighlight, Image } from 'react-native'
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { withNavigation } from 'react-navigation';
import { material } from 'react-native-typography';


class MultiplePictureCamera extends Component {
  

  constructor(props) {
      super(props);
      this.state = {
        navToComponent: 'HomeScreen',
        isLoading: false,
        type: RNCamera.Constants.Type.back,
        flashMode: false,
        front: false,
        //pictureuri: null,
        pictureuris: [],
        confirmDisabled: true,
        
    }
  }
  
  takePicture(navToComponent) {
    console.log(navToComponent);
    this.setState({isLoading: true});
    let self = this;
    console.log('first')
    const options = { quality: 0.5, base64: true };
    this.camera.takePictureAsync(options).then((image64) => {
        this.state.pictureuris.push( image64.uri );
        this.setState({isLoading: false, confirmDisabled: false});
        //if the user was previously on the EditProfile Page, then send user back there, else assume
        //the user is creating an item and let them take up to 4 pictures
        if(navToComponent == 'EditProfile' || navToComponent == 'CreateProfile') {this.confirmSelection(navToComponent)};
        if(this.state.pictureuris.length == 4) {
          this.confirmSelection(navToComponent);
        }
        console.log(this.state.pictureuris);
        // this.setState({
        //     isLoading: false, pictureuri: image64.uri, picturebase64: image64.base64, pictureWidth: image64.width, pictureHeight: image64.height
        // });
        // this.props.navigation.navigate( `${navToComponent}`, {uri: this.state.pictureuri, base64: this.state.picturebase64, width: this.state.pictureWidth, height: this.state.pictureHeight})

    }).catch(err => console.error(err))

  }

  confirmSelection(navToComponent) {
    console.log('prssed')
    //if its going back to EditItem, will it skim over the details?
    this.props.navigation.navigate(`${navToComponent}`, {pictureuris: this.state.pictureuris} )
  }
  
  render() {
    const {params} = this.props.navigation.state;
    var {navToComponent} = params;

    return (
        <View style={styles.container}>

        <RNCamera
            ref={ref => {
              this.camera = ref;
            }}

            style = {styles.preview}
            type={this.state.front ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
            flashMode={this.state.flashMode ? RNCamera.Constants.FlashMode.on : RNCamera.Constants.FlashMode.off}
            permissionDialogTitle={'Permission to use camera'}
            permissionDialogMessage={'We need your permission to use your camera phone'}
        >
        <View style = { { flexDirection: 'row', justifyContent: 'space-between'} }>
        {/* confirm button */}
          <View style={styles.confirmButton}>
            <TouchableHighlight disabled={this.state.confirmDisabled} onPress={ () => { this.confirmSelection(navToComponent) }}>
              {!this.state.confirmDisabled ? <Icon size={48} color='green' type='material-community' name='check-circle' /> 
                                  : <Icon size={48} color='gray' type='material-community' name='check-circle' />
               }
            </TouchableHighlight>  
          </View>
        {/* camera button */}
        
            {!this.state.isLoading ? <TouchableHighlight onPress={this.takePicture.bind(this, navToComponent) } >
                
              <Icon size={58} type='material-community' name='camera' color='#008000' />

            </TouchableHighlight>  
            :    
            <ActivityIndicator animating={this.state.isLoading} color='#0040ff' size='large'/>
            }   
          
              {/* toggle flash mode */}
          <View style={styles.flashButton}>
            <TouchableHighlight onPress={ () => {this.setState({flashMode: !this.state.flashMode})}}>
              {this.state.flashMode ? <Icon size={48} type='material-community' name='flashlight' /> : <Icon size={48} color='white' type='material-community' name='flashlight-off' />
               }
            </TouchableHighlight>  
          </View>
                {/* toggle front camera */}
          <View style={styles.frontButton}>
            <TouchableHighlight onPress={ () => {this.setState({front: !this.state.front})}}>
              {this.state.front ? <Icon size={40} color='#800000' type='material-community' name='camera-switch' /> 
                                  : <Icon size={40} color='#3db6e2' type='material-community' name='camera-switch' />
               }
            </TouchableHighlight>  
          </View>
        </View>

        </RNCamera>

      </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black'
      },
      preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
      },
      cambuttons: {
        flexDirection: 'row',
        justifyContent: 'center'
      },
      capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20
      },
      confirmButton: {
        margin:5,
        flex:0,
        borderRadius:40,
        width:50,
        height:50,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#fff'
      },

      button: {
        margin:5,
        flex:0,
        borderRadius:20,
        width:50,
        height:50,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#fff'
      },

      flashButton: {
        margin:5,
        flex:0,
        borderRadius:20,
        width:50,
        height:50,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#ac7339'
      },

      frontButton: {
        margin:5,
        flex:0,
        borderRadius:20,
        width:50,
        height:50,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#fff'
      },
})
export default withNavigation(MultiplePictureCamera)