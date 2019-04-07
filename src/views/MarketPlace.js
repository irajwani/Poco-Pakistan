import React, {Component} from 'react';
import Products from '../components/Products';
import {withNavigation} from 'react-navigation';
import { View } from 'react-native';


class MarketPlace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showWishList: false
    }
  }

  render() {
    
    return <Products showYourProducts={false} showCollection={false} showSoldProducts={false}/>

  }
}

export default withNavigation(MarketPlace);
