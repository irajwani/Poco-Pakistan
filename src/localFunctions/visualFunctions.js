import React from 'react';
import { View, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Text } from 'react-native';
import { darkGray } from '../colors';
import Spinner from 'react-native-spinkit';
import { avenirNextText } from '../constructors/avenirNextText';

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

const CustomTouchableO = ({disabled, flex, color, text, textSize, textColor}) => {
    return(
        <TouchableOpacity disabled={disabled} style={{justifyContent: 'center', alignItems: 'center', backgroundColor: color, flex: flex}}>
            <Text style={new avenirNextText(textColor, textSize, "300")}>{text}</Text>
        </TouchableOpacity>
    )
    
}

export {GrayLine, WhiteSpace, LoadingIndicator, DismissKeyboardView, CustomTouchableO}