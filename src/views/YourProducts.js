import React, { Component } from 'react'
import Products from '../components/Products';
import { withNavigation } from 'react-navigation'; 
import { View } from 'react-native';
import { Button } from 'react-native-elements';

class YourProducts extends Component {
  render() {
    return (
      
        <Products showYourProducts={true} showCollection={false}/>
      
    )
  }
}

export default withNavigation(YourProducts);

////you may navigate to this component from the profile page's sold items button.