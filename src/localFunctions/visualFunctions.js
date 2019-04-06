import React from 'react';
import { View, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Text, TextInput, Platform } from 'react-native';
import { darkGray, lightGray, rejectRed, almostWhite, flagRed } from '../colors';
import Spinner from 'react-native-spinkit';
import { avenirNextText } from '../constructors/avenirNextText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from '../cloud/firebase';

const GrayLine = () => (
    <View style={{backgroundColor: darkGray, height: 0.5}}/>
)

const WhiteSpace = ({height}) => (
    <View style={{backgroundColor: '#fff', height: height}}/>
)

const DismissKeyboardView = ({children}) => (
    <TouchableWithoutFeedback 
    onPress={() => {
        Keyboard.dismiss();
        console.log('dismiss keyboard');
        }}>
        {children}
    </TouchableWithoutFeedback>
  )

const LoadingIndicator = ({isVisible, type, color}) => (
    <Spinner style={{}} isVisible={isVisible} size={50} type={type} color={color}/>    
) 

const CustomTouchableO = ({onPress, disabled, flex, color, text, textSize, textColor, extraStyles}) => {
    return(
        <TouchableOpacity onPress={onPress} disabled={disabled} style={[{justifyContent: 'center', alignItems: 'center', backgroundColor: color, flex: flex}, extraStyles]}>
            <Text style={new avenirNextText(textColor, textSize, "300")}>{text}</Text>
        </TouchableOpacity>
    )
    
}

const CustomTextInput = ({placeholder, onChangeText, value, autoCapitalize, maxLength, secureTextEntry, keyboardType}) => (
    <View style={{paddingHorizontal: 7, justifyContent: 'center', alignItems: 'flex-start'}}>
        <TextInput
        secureTextEntry={secureTextEntry ? true : false}
        style={{height: 50, width: 280, fontFamily: 'Avenir Next', fontSize: 20, fontWeight: "500"}}
        placeholder={placeholder}
        placeholderTextColor={lightGray}
        onChangeText={onChangeText}
        value={value}
        multiline={false}
        maxLength={maxLength}
        autoCorrect={false}
        autoCapitalize={autoCapitalize ? autoCapitalize : 'none'}
        clearButtonMode={'while-editing'}
        underlineColorAndroid={"transparent"}
        keyboardType={keyboardType ? 'default' : 'number-pad'}
        />         
    </View>
)

const SignInTextInput = ({placeholder, onChangeText, value, secureTextEntry, keyboardType}) => (
    <View style={{paddingHorizontal: 7, justifyContent: 'center', alignItems: 'flex-start'}}>
        <View style={{position: 'absolute', flex: 1, justifyContent: 'center'}}>
            <Text style={new avenirNextText('#fff', 20, "200")}>{placeholder}</Text>
        </View>
        <TextInput
        secureTextEntry={secureTextEntry ? true : false}
        style={{height: 50, width: 280, fontFamily: 'Avenir Next', fontSize: 20, fontWeight: "500"}}
        placeholder={''}
        placeholderTextColor={'#fff'}
        onChangeText={onChangeText}
        value={value}
        multiline={false}
        
        autoCorrect={false}
        
        clearButtonMode={'while-editing'}
        underlineColorAndroid={"transparent"}
        keyboardType={keyboardType ? 'email-address' : 'default'}
        />         
    </View>
)

class BadgeIcon extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            uid: false,
            unreadCount: false,
            isGetting: true
        }
    }

    componentWillMount = () => {
        if(this.props.unreadCount) {
            setTimeout(() => {
                
                this.setState({uid: firebase.auth().currentUser.uid}, () => {
                    this.getNotificationsCount(this.state.uid);
                });
                
                
            }, 1);
        }
        
    }

    // componentDidMount = () => {
    //     this.getNotificationsCountInterval = setInterval(() => {
    //         this.getNotificationsCount(this.state.uid);
    //     }, 20000);
    // }

    componentWillUnmount = () => {
        // clearInterval(this.getNotificationsCountInterval);
    }

    getNotificationsCount = (uid) => {
        this.setState({isGetting: true});
        firebase.database().ref(`/Users/${uid}`).once("value", (snapshot) => {
          var d = snapshot.val();
          let unreadCount = 0
  
          if(d.notifications) {
            if(d.notifications.priceReductions) {
            
              Object.values(d.notifications.priceReductions).forEach( n => {
                if(n.unreadCount) {
                  unreadCount += 1
                }
              })
            
            }
          
            if(d.notifications.itemsSold) {
              
              Object.values(d.notifications.itemsSold).forEach( n => {
                if(n.unreadCount) {
                  unreadCount += 1
                }
              })
              
            }
  
            if(d.notifications.purchaseReceipts) {
              
              Object.values(d.notifications.purchaseReceipts).forEach( n => {
                if(n.unreadCount) {
                  unreadCount += 1
                }
              })
              
            }}
  
          this.setState({unreadCount, isGetting: false})
          
          
          
        })
        .catch( (err) => {console.log(err); return false })
        
      }

    render() {
        return (
            <View style={{ width: 35, height: 35, margin: 5, justifyContent: 'center', alignItems: 'center' }}>
                <Icon name={this.props.name} size={this.props.size} color={this.props.color}/>
                {/* Now just for chats icon */}
                { this.state.unreadCount > 0 ?
                    
                  <View style={Platform.OS == 'ios' ? {
                    
                    position: 'absolute',
                    right: -4,
                    top: -3,
                    backgroundColor: flagRed,
                    borderRadius: 9,
                    width: 18,
                    height: 18,
                    // borderWidth: 1,
                    // borderColor: almostWhite,
                    padding: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                  } : {
                    
                    position: 'absolute',
                    right: 3,
                    top: 2,
                    backgroundColor: flagRed,
                    borderRadius: 6,
                    width: 12,
                    height: 12,
                    // borderWidth: 1,
                    // borderColor: almostWhite,
                    padding: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    {this.state.isGetting ?
                        <LoadingIndicator isVisible={this.state.isGetting} type={'Circle'} color={'#fff'}/>
                        :
                        <Text style={{color: almostWhite, fontWeight: "300", fontSize: Platform.OS == 'ios' ? 12:8}}>{this.state.unreadCount}</Text>
                    }
                  </View>
                
                :
                null
                }
            </View>
        )
    } 
}



export {GrayLine, WhiteSpace, LoadingIndicator, DismissKeyboardView, CustomTouchableO, CustomTextInput, SignInTextInput, BadgeIcon}