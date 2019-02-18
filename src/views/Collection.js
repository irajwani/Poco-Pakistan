import React, { Component } from 'react';
import {withNavigation} from 'react-navigation';
import Products from '../components/Products';
import { View } from 'react-native';

class Collection extends Component {
  render() {
    return (
      <Products showCollection={true} showYourProducts={false} />
    )
  }
}

export default withNavigation(Collection);