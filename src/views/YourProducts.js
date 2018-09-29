import React, { Component } from 'react'
import Products from '../components/Products';
import { withNavigation } from 'react-navigation'; 


class YourProducts extends Component {
  render() {
    return (
      <Products showAllProducts={false} showYourProducts={true} />
    )
  }
}

export default withNavigation(YourProducts);

////this component is to be used within your profile page