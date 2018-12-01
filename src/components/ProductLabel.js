import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'

export default class ProductLabel extends Component {
  render() {
    return (
        <Text style={{fontFamily: 'Avenir Next', fontSize: 12, fontWeight: 'bold', textAlign: 'center', color: this.props.color}}>
        {this.props.title}
        </Text>
    )
  }
}

const styles = StyleSheet.create({})
