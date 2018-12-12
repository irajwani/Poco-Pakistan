import React, { Component } from 'react'
import { Text, StyleSheet, View, Keyboard } from 'react-native'
import { Jiro } from 'react-native-textinput-effects';
import { treeGreen, darkGray } from '../colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { avenirNextText } from '../constructors/avenirNextText';

export default class PriceSelection extends Component {
  constructor(props) {
      super(props);
      this.state = {
          price: 0,
          original_price: 0,
      }
  }

  
  navToCreateItem = (sellingPriceBoolean) => {
      const {original_price, price} = this.state
      sellingPriceBoolean ? this.props.navigation.navigate('CreateItem', {price: price}) : this.props.navigation.navigate('CreateItem', {original_price: original_price});
  }

  render() {
    const {navigation} = this.props;
    const sellingPriceBoolean = navigation.getParam('sellingPrice', true);
    console.log(( (this.state.price > 0) && (Number.isFinite(this.state.price)) ) || ( (this.state.original_price > 0) && (Number.isFinite(this.state.original_price)) ));

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
            {( (this.state.price > 0) && (Number.isFinite(this.state.price)) ) || ( (this.state.original_price > 0) && (Number.isFinite(this.state.original_price)) ) ?
             <View style={[styles.iconContainer, {justifyContent: 'center', alignItems: 'flex-end'}]}>
                <Text style={styles.saveText} onPress={()=>this.navToCreateItem(sellingPriceBoolean)}>Save</Text>
             </View> 
            : 
             null}    
        </View>

        <View style={{height: 1, backgroundColor: darkGray}}/>

        <View style={styles.selectionContainer}>
        {sellingPriceBoolean ?
            <Jiro
                label={'Selling Price (GBP)'}
                value={this.state.price}
                maxLength={3}
                onChangeText={price => {
                    this.setState({ price: Number(price) });
                    } }
                autoCorrect={false}
                // this is used as active border color
                borderColor={treeGreen}
                // this is used to set backgroundColor of label mask.
                // please pass the backgroundColor of your TextInput container.
                backgroundColor={'#F9F7F6'}
                inputStyle={{ fontFamily: 'Avenir Next', color: 'black' }}
                keyboardType='numeric'
            />
        :
            <Jiro
                label={'Original price of this item (£)'}
                value={this.state.original_price}
                maxLength={3}
                onChangeText={original_price => this.setState({ original_price: Number(original_price) })}
                autoCorrect={false}
                // this is used as active border color
                borderColor={'#800000'}
                // this is used to set backgroundColor of label mask.
                // please pass the backgroundColor of your TextInput container.
                backgroundColor={'#F9F7F6'}
                inputStyle={{ fontFamily: 'Avenir Next', color: 'black' }}
                keyboardType='numeric'
        /> 
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

    saveText: new avenirNextText('black',22,'400'),

    selectionContainer: {
        // backgroundColor: 'red',
        flex: 0.91,
        paddingHorizontal: 3,
        paddingVertical: 2,
    },
})
