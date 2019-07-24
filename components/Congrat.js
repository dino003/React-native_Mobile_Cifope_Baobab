import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  ListView,
  TouchableOpacity,
  View,
  Image,
  Text,
  TouchableHighlight
} from 'react-native';

export default class Congratulation extends Component {

  render() {
    return (
      <View style={styles.container}>
       {/* <Image style={styles.icon} source={require('../components/images/okMain.png')} />*/} 
        <Text style={styles.description}>Pour retrouver un CIFOPIEN, commencez par 
        écrire des caractères qui correspondent au "nom" et/ou au "prenom" du Cifopien recherché puis 
        appuyez sur le bouton de recherche (fond noir) pour obtenir les résultats. 
        Pour ajouter un nouveau Cifopien appuye sur le bouton (fond vert) en bas à droite.    </Text>
       
        {/*
         <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.clickListener('login')}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableHighlight>
        
        */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    paddingTop:50,
  },
  icon:{
    width:200,
    height:200,
  },
  title:{
    fontSize:24,
    textAlign: 'center',
    marginTop:22,
    color: "#5F6D7A"
  },
  description: {
    marginTop:20,
    textAlign: 'center',
    color: "#A9A9A9",
    fontSize:16,
    margin:40,
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
  },
  loginButton: {
    backgroundColor: "#3498db",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize:20,
  }
});