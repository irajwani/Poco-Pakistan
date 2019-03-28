import React from 'react';
import { View, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Text, TextInput, Platform } from 'react-native';
import { darkGray, lightGray, rejectRed, almostWhite, flagRed } from '../colors';
import Spinner from 'react-native-spinkit';
import { avenirNextText } from '../constructors/avenirNextText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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

const BadgeIcon = ({name, size, color, unreadCount}) => (
    <View style={{ width: 35, height: 35, margin: 5, justifyContent: 'center', alignItems: 'center' }}>
        <Icon name={name} size={size} color={color}/>
        { unreadCount ? 
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
            <Text style={{color: almostWhite, fontWeight: "800", fontSize: Platform.OS == 'ios' ? 14:10}}>!</Text>
          </View>
        
        :
        null
        }
    </View>
)

export {GrayLine, WhiteSpace, LoadingIndicator, DismissKeyboardView, CustomTouchableO, CustomTextInput, SignInTextInput, BadgeIcon}