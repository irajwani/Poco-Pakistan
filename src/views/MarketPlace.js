import React, {Component} from 'react';
import Products from '../components/Products';
import {withNavigation} from 'react-navigation';


class MarketPlace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showWishList: false
    }
  }
  render() {
    
    return <Products showAllProducts={true}/>
          
    

    
    
    

  }
}

export default withNavigation(MarketPlace);
