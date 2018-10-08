import React, { Component } from 'react'
import { Text, View, Modal, TouchableHighlight, StyleSheet } from 'react-native'
import { material } from 'react-native-typography';

export default class CustomModalPicker extends Component {
    state = {
        modalVisible: false,
    };

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

  render() {
    return (
        <View style={{marginTop: 22}}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          
          <View style={styles.modal}>
            <View>
              {this.props.children}

              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text style={styles.hideModal}>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        
        <TouchableHighlight
          onPress={() => {
            this.setModalVisible(true);
          }}>
          <Text style={styles.selectedOption}>Option Selected:</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    modal: {flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', padding: 30, marginTop: 22},
    hideModal: {
      ...material.display1,
      fontSize: 20,
      color: 'green',
      fontWeight:'bold'
    },
    selectedOption: {
      ...material.display1,
      fontSize: 16,
      color: 'gray'
    }
})