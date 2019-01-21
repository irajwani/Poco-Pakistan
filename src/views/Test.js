import React, { Component } from 'react'
import { Text, View, Modal, TouchableOpacity, WebView, StyleSheet } from 'react-native'
// const uri = "http://localhost:5000"
const uri = "https://calm-coast-12842.herokuapp.com";
export default class Test extends Component {
    state = {
        showModal: false,
        status: "pending",
    }

    handleResponse = (data) => {
        if(data.title == "success") {
            this.setState({showModal: false, status: "complete"});
        }

        else if(data.title == "cancel") {
            this.setState({showModal: false, status: "canceled"});
        }
        else {
            return;
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Modal visible={this.state.showModal} onRequestClose={() => this.setState({showModal: false})}>
                    <WebView 
                    source={{uri: uri}} 
                    onNavigationStateChange={data => this.handleResponse(data)}
                    injectedJavaScript={`document.f1.submit()`}/>
                </Modal>
                <TouchableOpacity style={styles.button} onPress={() => this.setState({showModal: true})}>
                    <Text>Pay with PayPal</Text>
                </TouchableOpacity>
                <Text>Payment Status: {this.state.status}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 22,
    },
    button: {
        width: 300,
        height: 100
    }

})



// Test for ListView from scratch

// import React, { Component } from 'react'
// import { ScrollView, Text, StyleSheet, View, TouchableOpacity, Image, ListView, TouchableHighlight } from 'react-native'
// import Accordion from 'react-native-collapsible/Accordion';
// import * as Animatable from 'react-native-animatable';
// import { splitArrayIntoArraysOfSuccessiveElements } from '../localFunctions/arrayFunctions';
// const cardWidth = 145;
// const cardHeight = 190;


// export default class Test extends Component {

//     constructor(props) {
//         super(props);

//         this.state = {

//             ds: new ListView.DataSource({
//               rowHasChanged: (r1, r2) => r1 !== r2
//             }),

//             photoArray: [
//                 {
//                     uri: "https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Users%2FAjiaKr1XkCgfhWm3zdR8TKKiLno2%2F-LPbRhbEqd-wNNk13xn2%2F0?alt=media&token=b4f93c88-babd-4d92-af09-6ffa92fd2a32",
//                     isActive: false
//                 },
//                 {
//                     uri: "https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Users%2FAjiaKr1XkCgfhWm3zdR8TKKiLno2%2F-LPbRhbEqd-wNNk13xn2%2F0?alt=media&token=b4f93c88-babd-4d92-af09-6ffa92fd2a32",
//                     isActive: false
//                 },
//                 {
//                     uri: "https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Users%2FAjiaKr1XkCgfhWm3zdR8TKKiLno2%2F-LPbRhbEqd-wNNk13xn2%2F0?alt=media&token=b4f93c88-babd-4d92-af09-6ffa92fd2a32",
//                     isActive: false
//                 },
//                 {
//                     uri: "https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Users%2FAjiaKr1XkCgfhWm3zdR8TKKiLno2%2F-LPbRhbEqd-wNNk13xn2%2F0?alt=media&token=b4f93c88-babd-4d92-af09-6ffa92fd2a32",
//                     isActive: false
//                 },
//             ],

//             first: [
//                 {
//                     uri: "https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Users%2FAjiaKr1XkCgfhWm3zdR8TKKiLno2%2F-LPbRhbEqd-wNNk13xn2%2F0?alt=media&token=b4f93c88-babd-4d92-af09-6ffa92fd2a32",
//                     isActive: false
//                 },
//                 {
//                     uri: "https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Users%2FAjiaKr1XkCgfhWm3zdR8TKKiLno2%2F-LPbRhbEqd-wNNk13xn2%2F0?alt=media&token=b4f93c88-babd-4d92-af09-6ffa92fd2a32",
//                     isActive: false
//                 },
//             ],
//             second: [
//                 {
//                     uri: "https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Users%2FAjiaKr1XkCgfhWm3zdR8TKKiLno2%2F-LOt8UrRxuOyc3RKZnsa%2F1?alt=media&token=3f5fd76a-5b10-446d-b383-c8aa688842c3",
//                     isActive: false
//                 },
//                 {
//                     uri: "https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Users%2FAjiaKr1XkCgfhWm3zdR8TKKiLno2%2F-LOt8UrRxuOyc3RKZnsa%2F1?alt=media&token=3f5fd76a-5b10-446d-b383-c8aa688842c3",
//                     isActive: false
//                 },
//             ]
//         }
        
//     }

//     renderRow = (section, expandFunction) => {
//         return(
//         <View style={{}}>
//             <TouchableHighlight 
//                 onPress={expandFunction}
//                 style={styles.card}
//             >
//                 <View style={styles.card}>
//                     <Image 
//                         style={styles.productImage} 
//                         source={{uri: section.uri}}

//                         />
//                 </View>
//             </TouchableHighlight>    
//             {   section.isActive?
//                 <View>
//                     <Text style={{fontSize: 34}}>BIG TEXT</Text>
//                 </View>
//                 :
//                 null
//             }
            
//         </View>
//         )
        
//     }

//     render() {
//       var {first, second} = splitArrayIntoArraysOfSuccessiveElements(this.state.photoArray);
//       return (
//         <View style={{marginTop: 22, flex: 1}}>
        
//             <ScrollView style={{flex:1, backgroundColor: 'red'}} contentContainerStyle={styles.cc}>
//                 <ListView
//                     contentContainerStyle={styles.list}
//                     dataSource={this.state.ds.cloneWithRows(this.state.first)}
//                     renderRow={(rowData) => this.renderRow(rowData, () => {
//                     // let photoArray;
//                     // section.isActive = !section.isActive;
//                     let index = this.state.first.indexOf(rowData);
//                     this.state.first[index].isActive = !this.state.first[index].isActive;
//                     this.setState({first: this.state.first});
//                 })}
//                     enableEmptySections={true}
//                 />
//                 <ListView
//                     contentContainerStyle={styles.list}
//                     dataSource={this.state.ds.cloneWithRows(this.state.second)}
//                     renderRow={(rowData) => this.renderRow(rowData, () => {
//                     // let photoArray;
//                     // section.isActive = !section.isActive;
//                     let index = this.state.second.indexOf(rowData);
//                     this.state.second[index].isActive = !this.state.second[index].isActive;
//                     this.setState({second: this.state.second});
//                 })}
//                     enableEmptySections={true}
//                 />
//           </ScrollView>
//         </View>
//       )
//     }
//   }

// const styles = StyleSheet.create({

//     cc: {flexGrow: 4, flexDirection: 'row'},
//     card: {
//         // flexDirection: 'row',
//         // flexWrap: 'wrap',
//         backgroundColor: '#fff',
//         width: cardWidth,
//         //width/2 - 0
//         height: cardHeight,
//         //200
//         //marginLeft: 2,
//         //marginRight: 2,
//         marginTop: 2,
//         padding: 0,
//         // justifyContent: 'space-between'
//       } ,

//       productImage: {width: cardWidth, height: cardHeight},

//       list: {flexDirection: 'row', flexWrap: 'wrap'}
// })

// class TTest extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//           activeSection: false,
//           collapsed: true,
//         }
//     }
  
//     toggleExpanded = () => {
//       this.setState({ collapsed: !this.state.collapsed });
//     };
  
//     setSection = section => {
//       this.setState({ activeSection: section });
//     };
  
//     renderHeader = (section, _, isActive) => {
//       return (
//       <View
      
      
      
//       >
      
//           <Image style={styles.productImage} 
//           source={{uri: "https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Users%2FAjiaKr1XkCgfhWm3zdR8TKKiLno2%2F-LPbRhbEqd-wNNk13xn2%2F0?alt=media&token=b4f93c88-babd-4d92-af09-6ffa92fd2a32"}}/>
  
//           <Text style={{fontSize: 4}}>BIG TEXT</Text>
  
          
  
//       </View>
  
//       )
//     }
  
//     renderContent = (section, _, isActive) => {
//         return (
//       <View
      
      
      
//       >
      
//           <Image style={styles.productImage} 
//           source={{uri: "https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Users%2FAjiaKr1XkCgfhWm3zdR8TKKiLno2%2F-LPbRhbEqd-wNNk13xn2%2F0?alt=media&token=b4f93c88-babd-4d92-af09-6ffa92fd2a32"}}/>
  
//       </View>
  
//         )
        
//     }
  
//     render() {
//       return (
//         <View style={{flex: 1, marginTop: 22}}>
//           <ScrollView style={{}} contentContainerStyle={styles.cc}>
  
//               <View style={{flex: 0.2, flexDirection: 'row', flexWrap: 'wrap', backgroundColor: 'green', padding: 10, alignItems: 'center'}}>
//               <Text style={{fontSize: 24}}>BIG TEXT</Text>
//               <Text style={{fontSize: 24}}>BIG TEXT</Text>
//               <Text style={{fontSize: 24}}>BIG TEXT</Text>
//               <Text style={{fontSize: 24}}>BIG TEXT</Text>
//               </View>
  
//               <View style={{flex: 0.8, flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#fff'}}>
//                   <Text style={{fontSize: 10}}>BIG TEXT</Text>
                  
//                   <Accordion
//                       activeSection={this.state.activeSection}
//                       sections={[1,2,3,4]}
//                       touchableComponent={TouchableOpacity}
//                       renderHeader={this.renderHeader}
//                       renderContent={this.renderContent}
//                       duration={200}
//                       onChange={this.setSection}
//                       sectionContainerStyle={{flexDirection: 'column', padding: 5}}
//                       containerStyle={styles.list}
//                   />
//               </View>
//           </ScrollView>
//         </View>
//       )
//     }
//   }
