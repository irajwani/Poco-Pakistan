import React from 'react';
import { View, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Text, TextInput } from 'react-native';
import { darkGray, lightGray } from '../colors';
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

export {GrayLine, WhiteSpace, LoadingIndicator, DismissKeyboardView, CustomTouchableO, CustomTextInput}