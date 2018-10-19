import React, { Component } from 'react'
import { Dimensions, Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import { withNavigation } from 'react-navigation';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { material, iOSUIKit, iOSColors } from 'react-native-typography'

import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';

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
      activeSection: false,
      collapsed: true,
    };
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
            () => { console.log('show selected document') } 
          } style={styles.contentText} animation={isActive ? 'bounceInLeft' : undefined}>
            {setting}
          </Animatable.Text>
        ))}
      </Animatable.View>
    )
  }



  render() {

    const {activeSection} = this.state;
    
    return (
      <View style={styles.container}>
        <Accordion
          activeSection={activeSection}
          sections={settings}
          touchableComponent={TouchableOpacity}
          renderHeader={this.renderHeader}
          renderContent={this.renderContent}
          duration={100}
          onChange={this.setSection}
        />
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
