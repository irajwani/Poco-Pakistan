import React, { Component } from 'react';
import {
  Image,
  View,
  ScrollView,
  ListView,
  StyleSheet,
  Text,
  TouchableHighlight

} from 'react-native';
import { Button } from 'react-native-elements';
import { treeGreen, highlightGreen } from '../colors';

// import SelectedPhoto from './SelectedPhoto';

class ViewPhotos extends Component {
  state = {

    ds: new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    }),

    showSelectedPhoto: false,
    //uri of photo you're considering
    uri: '',
    //uri of photo you have chosen
    pictureuris: [],

  }


  renderRow(rowData) {
    const { uri } = rowData.node.image;
    return (
      <TouchableHighlight
        onPress={() => this.setState({ showSelectedPhoto: true, uri: uri })}>
        <Image
          source={{ uri: rowData.node.image.uri }}
          style={styles.image} />
      </TouchableHighlight>
    )
  }

  render() {
    const { showSelectedPhoto, uri } = this.state;
    const {params} = this.props.navigation.state;
    const {navToComponent, photoArray} = params;

    if (showSelectedPhoto) {
      return (

        <View style={styles.selectedPhotoContainer}>
            <Image
                source={{uri: uri}}
                style={styles.selectedPhotoImage}/>
            <View style={styles.buttonsColumn}>
                <Button  
                buttonStyle={[styles.ModalButtonStyle, {backgroundColor: 'black'}]}
                icon={{name: 'chevron-left', type: 'material-community'}}
                title='Back'
                onPress={() => {
                    this.setState( {showSelectedPhoto: false} );
                    }}
                />
                <Button  
                buttonStyle={[styles.ModalButtonStyle, {backgroundColor: highlightGreen}]}
                icon={{name: 'emoticon', type: 'material-community'}}
                title='Satisfied'
                onPress={() => {
                    this.state.pictureuris.push(uri)
                    this.props.navigation.navigate(`${navToComponent}`, {pictureuris: this.state.pictureuris} )
                    }}
                />
            </View>    
        </View>
        
      )
    }
    return (
      <ScrollView style={{ backgroundColor: '#fff', flex: 1 }} contentContainerStyle={styles.contentContainerStyle}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 22 }}>
            <Button  
                buttonStyle={[styles.ModalButtonStyle, {backgroundColor: 'black'}]}
                icon={{name: 'chevron-left', type: 'material-community'}}
                title='Back'
                onPress={() => {
                    this.props.navigation.navigate(`${navToComponent}`);
                    }}
                />
          <Text style={{ fontSize: 20, fontWeight: '600' }}>Pick A Profile Pictcha</Text>
        </View>
        <ListView
          contentContainerStyle={styles.list}
          dataSource={this.state.ds.cloneWithRows(photoArray)}
          renderRow={(rowData) => this.renderRow(rowData)}
          enableEmptySections={true} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({

  contentContainerStyle: {
    flexGrow: 4,
    flexDirection: 'column'   
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // paddingTop: 20,
        },

  list: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },

  image: {
    width: 140,
    height: 150,
    marginLeft: 10,
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#979797'
  },

  selectedPhotoContainer: {
      backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    marginTop: 22,
    alignItems: 'center'
  },
  selectedPhotoImage: {
    flex: 2,
    margin: 10,
    height: 200,
    width: 200,
    borderColor: treeGreen,
    borderWidth: 3,
    
  },

  buttonsColumn: {
      flex: 2,
      flexDirection: "column",
      flex: 1,
      margin: 10
  },

  ModalButtonStyle : {
    // backgroundColor: 'black',
    // width: width/3 + 20,
    // height: height/15,
    borderRadius: 20,
    // justifyContent: 'center',
    // alignItems:'center',
    // alignContent: 'center',
  
  }
})

export default ViewPhotos;