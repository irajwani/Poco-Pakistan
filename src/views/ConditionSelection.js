import React, { Component } from 'react'
import { Text, StyleSheet, View, Keyboard, TouchableHighlight } from 'react-native'
import { Jiro } from 'react-native-textinput-effects';
import { treeGreen, darkGray } from '../colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { avenirNextText } from '../constructors/avenirNextText';
import { GrayLine } from '../localFunctions/visualFunctions';

const generateTypesBasedOnCategory = (category) => {
    var types;
    switch(category) {
        case 
    }
}
const conditions = ["New With Tags", "New Without Tags", "Slightly Used", "Used"];


export default class PriceSelection extends Component {
  constructor(props) {
      super(props);
      this.state = {
      }
  }

  
  navToCreateItem = (condition) => {
      this.props.navigation.navigate('CreateItem', {condition: condition});
  }

  render() {
    const {navigation} = this.props;
    const showProductTypes = navigation.getParam("showProductTypes", false)

    return (
      <View style={styles.mainContainer}>

        <View style={styles.topRow}>
            <View style={[styles.iconContainer, {justifyContent: 'center',alignItems: 'flex-start'}]}>
                <Icon 
                    name="chevron-left"
                    size={40}
                    color='black'
                    onPress={()=>this.props.navigation.goBack()}
                />
            </View>   
        </View>

        <View style={{height: 1, backgroundColor: darkGray}}/>

        <View style={styles.selectionContainer}>

            {showProductTypes ?
            types.map( (t, index) => (
                <View></View>
            ))
            :
            conditions.map( (c, index) => 
            <View key={index} style={styles.conditionRow}>
                <TouchableHighlight underlayColor={'#fff'} onPress={()=>this.navToCreateItem(c)}>
                    <Text style={styles.condition}>{c}</Text>
                </TouchableHighlight>
                <GrayLine/>
            </View>    
            )
            }

        </View>
        
      </View>
    )
  }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        marginTop: 20,
        justifyContent: 'flex-start',
        // paddingVertical: 4,
        paddingHorizontal: 2,
        backgroundColor: '#fff',
    },

    topRow: {
        // backgroundColor: 'yellow',
        flex: 0.09,
        flexDirection: 'row',
        // justifyContent: 'space-between',
    },

    iconContainer: {
        flex: 0.5,
        paddingHorizontal: 2,
        
    },

    // saveText: new avenirNextText('black',22,'400'),

    selectionContainer: {
        // backgroundColor: 'red',
        flex: 0.91,
        paddingHorizontal: 3,
        paddingVertical: 2,
    },

    conditionRow: {
        justifyContent: 'center', paddingLeft: 8, paddingHorizontal: 5, paddingVertical: 3
    },

    condition: {
        fontFamily: 'Avenir Next',
        fontSize: 32,
        fontWeight: '300'
    }


})
