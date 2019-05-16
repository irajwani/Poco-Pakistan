import React from 'react';
import { View, StyleSheet, Image } from "react-native";
import { lightPurple, logoGreen } from "../colors";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const StandardHeader = ({navigation}) => (
    <View style={styles.headerContainer}>
        
        <FontAwesomeIcon
        name='arrow-left'
        size={28}
        color={"#ffff"}
        onPress={()=>navigation.goBack()}
        />

        <Image style={styles.logo} source={require("../images/poco/logopocov4.png")}/>
              
        <FontAwesomeIcon
        name='close'
        size={28}
        color={lightPurple}
        />
          
    </View>
)

export {StandardHeader}

const styles = StyleSheet.create({
    headerContainer: {
        flex: 0.1,
        backgroundColor: logoGreen,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 12,
    },

    logo: {
        width: 50,
        height: 50,
    }
})