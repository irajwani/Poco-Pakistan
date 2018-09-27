import React, { Component } from 'react';
import styled from "styled-components/native"; // 3.1.6
import Carousel from 'react-native-snap-carousel'; // 3.6.0
import { iOSColors } from 'react-native-typography';

class CustomCarousel extends Component {

  constructor(props){
    super();
    this.state = {
      errors: []
    }
    this.props = props;
    this._carousel = {};
  }

  handleSnapToItem(index){
    console.log("snapped to ", index)
  }

  _renderItem = ( {item, index} ) => {
    console.log("rendering,", index, item)
    return (
      

        <ThumbnailBackgroundView>
          <CurrentVideoTO
             onPress={ () => { 
                console.log("clicked to index", index)
                this._carousel.snapToItem(index);
              }}
          >
            <CurrentVideoImage source={{ uri: item }} />
          </CurrentVideoTO>
            {/*<NextVideoImage source={{ uri: this.state.currentVideo.nextVideoId }}/>*/}
            
        </ThumbnailBackgroundView>
        
       

        

        
    );
  }

  render = () => {
    //const { params } = this.props.navigation.state;
    

    console.log("videos: updating")

    return (

      <CarouselBackgroundView>
        <Carousel
          ref={ (c) => { this._carousel = c; } }
          data={this.props.data}
          renderItem={this._renderItem.bind(this)}
          onSnapToItem={this.handleSnapToItem.bind(this)}
          sliderWidth={300}
          itemWidth={256}
          layout={'default'}
          firstItem={0}
        />
      </CarouselBackgroundView>

    );
  }
}

export default CustomCarousel;


const VideoTitleText = styled.Text`
  color: white;
  top: 28;
  justify-content: center;
`
const CurrentVideoImage = styled.Image`
  top: 5;
  box-shadow: 5px 10px;
  width: 256;
  height: 190;
  border-radius: 0;
  border-width: 5
`;

const ThumbnailBackgroundView = styled.View`
  justify-content: center;
  align-items: center;
  width: 256; 
`;

const CurrentVideoTO = styled.TouchableOpacity`
`
const CarouselBackgroundView = styled.View`
  background-color: #fff;
  height: 200;
  width: 100%;
`
