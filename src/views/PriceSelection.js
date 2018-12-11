import React, { Component } from 'react'
import { Text, StyleSheet, View, Keyboard } from 'react-native'
import { Jiro } from 'react-native-textinput-effects';
import { treeGreen } from '../colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { avenirNextText } from '../constructors/avenirNextText';

export default class PriceSelection extends Component {
  constructor(props) {
      super(props);
      this.state = {
          price: 0
      }
  }

  componentDidMount() {
    // Keyboard.
  }

  
  navToCreateItem = (selection) => {
      this.props.navigation.navigate('CreateItem', {price: selection})
  }
  render() {
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
            {this.state.price > 0 ?
             <View style={[styles.iconContainer, {justifyContent: 'center', alignItems: 'flex-end'}]}>
                <Text style={styles.saveText} onPress={()=>this.navToCreateItem(this.state.price)}>Save</Text>
             </View> 
            : 
             null}    
        </View>

        <View style={styles.selectionContainer}>
            <Jiro
                label={'Selling Price (GBP)'}
                value={this.state.price}
                maxLength={3}
                onChangeText={price => {
                    this.setState({ price })
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
        </View>
        
      </View>
    )
  }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        marginTop: 20,
        // paddingVertical: 4,
        paddingHorizontal: 2,
        backgroundColor: '#fff'
    },

    topRow: {
        backgroundColor: 'yellow',
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
        backgroundColor: 'red',
        flex: 0.91,
    },
})
