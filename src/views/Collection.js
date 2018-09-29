import React, { Component } from 'react';
import {withNavigation} from 'react-navigation';
import Products from '../components/Products';

class Collection extends Component {
  render() {
    return (
      <Products showCollection={true} showAllProducts={false} showYourProducts={true} />
    )
  }
}

export default withNavigation(Collection);