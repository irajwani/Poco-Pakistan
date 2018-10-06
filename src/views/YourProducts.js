import React, { Component } from 'react'
import Products from '../components/Products';
import { withNavigation } from 'react-navigation'; 
import { View } from 'react-native';
import { Button } from 'react-native-elements';

class YourProducts extends Component {
  render() {
    return (
      <View style={ {flex: 1, paddingTop: 20,} }>
        <Button
            buttonStyle={{
                backgroundColor: "#0a3f93",
                width: 50,
                height: 40,
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 90,
                marginLeft: 200
            }}
            icon={{name: 'arrow-left', type: 'font-awesome'}}
            onPress={() => {
                            this.props.navigation.popToTop(); 
                            } } 
        />
        <Products showAllProducts={false} showYourProducts={true} showCollection={false}/>
      </View>
    )
  }
}

export default withNavigation(YourProducts);

////you may navigate to this component from the profile page's sold items button.