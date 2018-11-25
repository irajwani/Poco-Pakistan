import React, { Component } from 'react'
import { Dimensions, Text, Modal, StyleSheet, ScrollView, View, TouchableOpacity, TouchableHighlight } from 'react-native'
import { withNavigation } from 'react-navigation';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { material, iOSUIKit, iOSColors } from 'react-native-typography'

import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';



import {EulaTop, EulaLink, EulaBottom, TsAndCs, PrivacyPolicy, ContactUs} from '../legal/Documents.js';
import BackButton from '../components/BackButton';

const {width} = Dimensions.get('window');

const limeGreen = '#2e770f';
const profoundPink = '#c64f5f';

const settings = [ 
  {
    header: 'Personalization',
    settings: ['Edit Personal Details']
  }, 
  {
    header: 'Support',
    settings: ['End User License Agreement', 'Terms & Conditions', 'Privacy Policy', 'Contact Us'] 
  }
]

class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeDocument: 'End User License Agreement',
      activeSection: false,
      collapsed: true,
      modalVisible: false,
    };
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  //switch between collapsed and expanded states
  toggleExpanded = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  setSection = section => {
    this.setState({ activeSection: section });
  };

  renderHeader = (section, _, isActive) => {
    return (
      <Animatable.View
        duration={400}
        style={[styles.headerCard, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor"
      >

        <Text style={styles.headerText}>
          {section.header}
        </Text>
        {isActive? 
          <Icon name="chevron-up" 
                size={30} 
                color='black'
          />
        :
          <Icon name="chevron-down" 
                size={30} 
                color='black'
          />
        }
      </Animatable.View>
    )
  }

  renderContent = (section, _, isActive) => {
    return (
      <Animatable.View
        duration={400}
        style={[section.settings.length == 1 ? styles.shortContentCard : styles.contentCard, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor"
      >
        {section.settings.map( (setting) => (
          <Animatable.Text onPress={ section.settings.length == 1 ? 
            () => {this.props.navigation.navigate('EditProfile')}
            :
            () => { this.setState({ activeDocument: setting, modalVisible: true }) } 
          } style={styles.contentText} animation={isActive ? 'bounceInLeft' : undefined}>
            {setting}
          </Animatable.Text>
        ))}
      </Animatable.View>
    )
  }



  render() {

    const {activeSection, activeDocument} = this.state;

    var selectedDocument;
    switch(activeDocument) {
      case 'End User License Agreement':
        selectedDocument = EulaTop + EulaLink + EulaBottom;
        break;
      case 'Terms & Conditions':
        selectedDocument = TsAndCs;
        break;
      case 'Privacy Policy':
        selectedDocument = PrivacyPolicy;
        break;
      case 'Contact Us':
        selectedDocument = ContactUs;
        break;
      default:
        selectedDocument = EulaTop + EulaLink + EulaBottom;
        break;  
    }
    
    return (
      <View style={styles.container}>

        <BackButton action={()=>this.props.navigation.goBack()} />

        <Accordion
          activeSection={activeSection}
          sections={settings}
          touchableComponent={TouchableOpacity}
          renderHeader={this.renderHeader}
          renderContent={this.renderContent}
          duration={100}
          onChange={this.setSection}
        />

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
        >
          <ScrollView contentContainerStyle={styles.licenseContainer}>
            <Text>{selectedDocument}</Text>
            <TouchableHighlight
              onPress={() => {
                this.setModalVisible(!this.state.modalVisible);
              }}>
              <Text style={styles.hideModal}>Back</Text>
            </TouchableHighlight>
          </ScrollView>
        </Modal>

      </View>
    )
  }
}

export default withNavigation(Settings);

const styles = StyleSheet.create({

    container: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      padding: 10,
      marginTop: 20
    },

    licenseContainer: {
      marginTop: 22,
      flexGrow: 0.8, 
      backgroundColor: '#fff',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 10
  },

    modal: {flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', padding: 10, marginTop: 22},
    hideModal: {
      ...material.display1,
      fontSize: 20,
      color: 'green',
      fontWeight:'bold'
    },

    headerCard: {
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      paddingTop: 2,
      paddingLeft: 5,
      paddingRight: 5,
      paddingBottom: 0, 
      height: 40
    },

    shortContentCard: {
      height: 30,
      paddingBottom: 10
    },
    contentCard: {
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      height: 200,
      padding: 10,
    },
    headerText: {
      ...material.headline,
      fontSize: 20
    },
    contentText: {
      ...material.body1,
      color: limeGreen,
      fontSize: 20
    },
    active: {
      backgroundColor: '#fff'
    },
    inactive: {
      backgroundColor: '#fff'
    },
})
