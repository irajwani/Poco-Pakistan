// import React, { Component } from 'react';
// import {
//   CameraRoll,
//   Image,
//   StyleSheet,
//   TouchableHighlight,
//   View,
// } from 'react-native';

// import ViewPhotos from './ViewPhotos.js';

// class GalleryEntry extends Component {

//   constructor(props){
//     super(props);
//     this.state = {
//       showPhotoGallery: false,
//       photoArray: []
//     }
//   }

//   componentDidMount() {
//     this.timerID = setInterval(
// 			() => this.tick(),
// 			2000
// 		  );
//   }

//   componentWillUnmount() {
//     clearInterval(this.timerID);
//   }

//   tick() {
//     this.setState({
// 		  currentTime: new Date()
// 		});
//   }

//   getPhotosFromGallery() {
//     CameraRoll.getPhotos({ first: 20 })
//       .then(res => {
//         let photoArray = res.edges;
//         this.setState({ showPhotoGallery: true, photoArray: photoArray })
//       })
//   }

//   render() {
//     if (this.state.showPhotoGallery) {
//       return (
//         <ViewPhotos
//           photoArray={this.state.photoArray} />
//       )
//     }
//     return (
//       <View style={styles.container}>

//         <TouchableHighlight
//           onPress={() => this.getPhotosFromGallery()}>
//           <Image
//             source={require('../images/blank.jpg')} />
//         </TouchableHighlight>
//       </View>
//     );
//   }
// }//end of component

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   }
// });

// export default GalleryEntry;

// // import React, { Component } from 'react';
// // import {
// //   Platform,
// //   StyleSheet,
// //   Text,
// //   Button,
// //   Modal,
// //   Dimensions,
// //   View,
// //   ScrollView,
// //   Image,
// //   CameraRoll,
// //   TouchableHighlight
// // } from 'react-native';
// // import ViewPhotos from './ViewPhotos.js'

// // const { width } = Dimensions.get('window')

// // class Profile extends Component {
// //     constructor(props) {
// //         super(props)
// //         this.state = {
// //             modalVisible: false,
// //             blankImage: true,
// //             showPhotos: false,
// //             name: 'nothing here',
// //             photos: [],
// //             index: null,
// //     };
// //     }

// //     selectImage() {

// //         CameraRoll.getPhotos({
// //             first: 20,
// //             assetType: 'All'
// //           })
// //           .then(r => this.setState({ showPhotos: true, photos: r.edges }))
// //         //console.log(Object.keys(this.state.photos))

// //     }

// //     toggleModal = () => {
// //         this.setState({ modalVisible: !this.state.modalVisible });
// //       }

// //     setIndex = (index) => {
// //         if (index === this.state.index) {
// //              index = null
// //         }
// //         this.setState({ index })
// //     }

// //     soe(num) { //sieve of eratosthenes
// //         var primes = [];
// //         for(var i = 0; i <= num; i++) {
// //             primes[i] = true;
// //         }

// //         primes[0] = false;
// //         primes[1] = false;

// //         for (var i = 2; i <= Math.sqrt(num); i++ ) {
// //             for (var j = 2; j*i <= num; j++) {
// //                 primes[i*j] = false //mark all non primes as false by using multiple of each index
// //             }
// //         }
// //         var result = []
// //         for (var i = 0; i < primes.length; i++) {
// //             if (primes[i] == true) result.push(i)
// //         }
// //         console.log(result)
// //         return result;
// //     }

// //     bubbleSort(array) {
// //         for(var i=array.length; i>0; i--) { //first loop starts at the very end of the array and decrements down one below
// //             for(var j = 0; j<i; j++) { //second loop handles stopping one element earlier on each loop through the array
// //                 if (array[j] > array[j+1]) {
// //                     var placeholder = array[j];
// //                     array[j] = array[j+1]
// //                     array[j+1] = placeholder
// //                 }//now just switch neighboring numbers if necessary
// //             }
// //         }
// //         console.log(array)
// //         return array

// //     }

// //     render() {
        
// //         if (this.state.showPhotoGallery) {
// //             return (
// //               <ViewPhotos
// //                 photos={this.state.photos} />
// //             )
// //           }    
        
        
// //         return (
// //                 <View style = {styles.container}>
                    
// //                     <TouchableHighlight onPress={ () => {this.selectImage();}}> 
// //                         <Image source = {require('../images/blank.jpg')} />
// //                     </TouchableHighlight>
                    
                    
                
// //                 </View>
// //             )

        

       
        

        


        
// //     }


// // }

// // export default Profile

// // let styles = StyleSheet.create({

// //     container: {
// //         flex: 1,
// //         justifyContent: 'center',
// //         alignItems: 'center'
// //       },

// //     modalContainer: {
// //         paddingTop: 20,
// //         flex: 1
// //       },
// //       scrollView: {
// //         flexWrap: 'wrap',
// //         flexDirection: 'row'
// //       },


// // })
