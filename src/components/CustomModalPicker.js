import React, { Component } from 'react'
import { Text, View, Modal, TouchableHighlight, StyleSheet } from 'react-native'

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
                <Text>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        
        <TouchableHighlight
          onPress={() => {
            this.setModalVisible(true);
          }}>
          <Text>Option Selected:</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    modal: {flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', padding: 30, marginTop: 22}
})