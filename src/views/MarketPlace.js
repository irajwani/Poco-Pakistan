import React, {Component} from 'react';
import Products from '../components/Products';
import {withNavigation} from 'react-navigation';

class MarketPlace extends Component {
  render() {
    return ( <Products showAllProducts={true}/> )
  }
}

export default withNavigation(MarketPlace);