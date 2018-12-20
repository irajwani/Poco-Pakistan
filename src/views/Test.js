import React, { Component } from 'react'
import { ScrollView, Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native'
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';
const cardWidth = 145;
const cardHeight = 190;
export default class Test extends Component {
  constructor(props) {
      super(props);
      this.state = {
        activeSection: false,
        collapsed: true,
      }
  }

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
    style={styles.card}
    transition="backgroundColor"
    >
    
        <Image style={{width: cardWidth, height: cardHeight}} 
        source={{uri: "https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Users%2FAjiaKr1XkCgfhWm3zdR8TKKiLno2%2F-LPbRhbEqd-wNNk13xn2%2F0?alt=media&token=b4f93c88-babd-4d92-af09-6ffa92fd2a32"}}/>

    </Animatable.View>

    )
  }

  renderContent = (section, _, isActive) => {
      return (
    <Animatable.View
    duration={400}
    style={styles.card}
    transition="backgroundColor"
    >
    
        <Image style={{width: cardWidth, height: cardHeight}} 
        source={{uri: "https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Users%2FAjiaKr1XkCgfhWm3zdR8TKKiLno2%2F-LPbRhbEqd-wNNk13xn2%2F0?alt=media&token=b4f93c88-babd-4d92-af09-6ffa92fd2a32"}}/>

    </Animatable.View>

      )
      
  }

  render() {
    return (
      <View style={{flex: 1, marginTop: 22}}>
        <ScrollView style={{flex: 1}} contentContainerStyle={{flexGrow: 4, flexDirection: 'column'}}>
            <Accordion
                activeSection={this.state.activeSection}
                sections={[1,2,3,4]}
                touchableComponent={TouchableOpacity}
                renderHeader={this.renderHeader}
                renderContent={this.renderContent}
                duration={200}
                onChange={this.setSection}
                containerStyle={{flexDirection: 'row', flexWrap: 'wrap'}}
            />
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        width: cardWidth,
        //width/2 - 0
        height: cardHeight,
        //200
        //marginLeft: 2,
        //marginRight: 2,
        marginTop: 2,
        padding: 0,
        // justifyContent: 'space-between'
      } ,
})
