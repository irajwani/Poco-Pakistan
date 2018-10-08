import React, {Component} from 'react';
import { StyleSheet } from 'react-native';
import {Segment, Button} from 'native-base'; 
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
    const {showWishList} = this.state;
    
    <View style={styles.container}>
      <Segment>
        <Button first active onPress={() => {this.setState({showWishList: false})}}><Text>All</Text></Button>
        <Button last onPress={() => {this.setState({showWishList: true})}}><Text>Wishlist</Text></Button>
      </Segment>
    {showWishList ?
      <Products showAllProducts={true}/>
      :
      <Products showCollection={true} showAllProducts={false} showYourProducts={true} />
    }   
    </View>


  }
}

export default withNavigation(MarketPlace);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
})