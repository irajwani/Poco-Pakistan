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
        case 0:
            types = ["Formal Shirts", "Casual Shirts", "Coats & Jackets", "Suits", "Trousers", "Jeans", "Shoes"];
            break;
        case 1:
            types = ["Coats & Jackets", "Pullovers & Sweaters", "Dresses", "Skirts", "Tops & T-Shirts", "Pants", "Swimwear & Beachwear", "Lingerie"];
            break;
        case 2:
            types = ["Watches", "Bracelets", "Jewellery", "Sunglasses", "Handbags"];
            break;
        default:
            types = ["Formal Shirts", "Casual Shirts", "Coats & Jackets", "Suits", "Trousers", "Jeans", "Shoes"];
            break;
    }
    return types;
}

const conditions = ["New With Tags", "New Without Tags", "Slightly Used", "Used"];


export default class ConditionSelection extends Component {
  constructor(props) {
      super(props);
      this.state = {
      }
  }

  
  navToCreateItem = (detailType, value) => {
      detailType == 'condition' ?
      this.props.navigation.navigate('CreateItem', {condition: value})
      :
      this.props.navigation.navigate('CreateItem', {type: value})

  }

  render() {
    const {navigation} = this.props;
    var showProductTypes = navigation.getParam("showProductTypes", false);
    var gender = navigation.getParam("gender", 0); //For "Men" by default
    
    var types = generateTypesBasedOnCategory(gender);

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
                <View key={index} style={styles.conditionRow}>
                    <TouchableHighlight underlayColor={'#fff'} onPress={()=>this.navToCreateItem('type', t)}>
                        <Text style={styles.condition}>{t}</Text>
                    </TouchableHighlight>
                    <GrayLine/>

                </View>
            ))
            :
            conditions.map( (c, index) => 
            <View key={index} style={styles.conditionRow}>
                <TouchableHighlight underlayColor={'#fff'} onPress={()=>this.navToCreateItem('condition', c)}>
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
