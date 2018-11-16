import React from 'react';
import {
  Image,
  View,
  StyleSheet,
  
} from 'react-native';

const SelectedPhoto = (props) => {
  const { uri } = props;
  return (
    <View style={styles.selectedPhotoContainer}>
      <Image
        source={{uri: uri}}
        style={styles.selectedPhotoImage}/>
    </View>
  );
};

const styles = StyleSheet.create({
  
});

export default SelectedPhoto;
