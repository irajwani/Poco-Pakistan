import React from 'react';
import {View, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { darkGray } from '../colors';

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

export {GrayLine, WhiteSpace, DismissKeyboardView}