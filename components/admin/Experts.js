            
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Alert,
  AsyncStorage,
} from 'react-native';
import API from '../api/service'

export default class LoginM extends Component {

  static navigationOptions = {
    title: 'Page de connexion',
  };

  constructor(props) {
    super(props);
    state = {
      email   : '',
      password: '',
      loginIsPressed: false
    }
  }

  onClickListener = (viewId) => {
    Alert.alert("Alert", "Button pressed "+viewId);
  }

  loginUser = async () => {
    if(this.state.email.length > 0 && this.state.password.length > 0){
    this.setState({loginIsPressed: true})
      await API.post('/login', {
        email: this.state.email,
        password: this.state.password
      })
     .then((responseJson) => {
       if(responseJson.status === 200){
       data = responseJson.data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
       responseFinal = JSON.parse(data)
      // console.log( tb.user.name)
            let token = responseFinal.token
            let user = responseFinal.user
              AsyncStorage.setItem('userToken', token)
    
              const action = {type: "CONNEXION", value: user}
              this.props.dispatch(action)
              this.setState({loginIsPressed: false})

              this.props.navigation.navigate('App');

        } // fin if 
        else if(responseJson.status === 401){
          Alert.alert(
            'Erreur',
            'Ces identifiants ne correspondent à aucun  !',
            [
              {text: 'OK', onPress: () => {}},
            ],
            {cancelable: false},
          );
        }
            })
     .catch((error) => {

      // console.error(error);
      this.setState({loginIsPressed: false})
       Alert.alert(
        'Erreur',
        'La connexion a échoué, Vérifiez vos identifiants ',
        [
          {text: 'OK', onPress: () => {}},
        ],
        {cancelable: false},
      );
     });
    }else{
      Alert.alert(
        'Erreur',
        'Veuillez renseigner tous les champs !',
        [
          {text: 'OK', onPress: () => {}},
        ],
        {cancelable: false},
      );
    }
 }

 
 onClickListener = () => {
  Alert.alert("Erreur", "Veuillez renseigner tous les champs ");
}

_loginErreur = () => {
  Alert.alert("Erreur", "Erreur Vérifiez vos identifiants ");
}

_buttonConnexion = () => {
  if(!this.state.loginIsPressed){
    return (
     
      <TouchableHighlight style={[styles.buttonContainer, styles.sendButton]} onPress={this.loginUser} >
          <Text style={styles.buttonText}>Connexion</Text>
      </TouchableHighlight>
    
    )
  }
}

_buttonChargement = () => {
  if(this.state.loginIsPressed){
    return (
          <TouchableHighlight style={[styles.buttonContainer, styles.sendButton]} onPress={this.loginUser} >
              <Text style={styles.buttonText}>Chargement...</Text>
              <Image source={require('../images/loadGif.gif')} />

          </TouchableHighlight>
    )
  }
}

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={require('../images/logoB.png')}/>

        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={require('../images/email.png')}/>
          <TextInput style={styles.inputs}
              keyboardType="email-address"

              placeholder="Adresse email"
              underlineColorAndroid='transparent'
              onChangeText={(email) => this.setState({email})}/>
        </View>
        
        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={require('../images/key.png')}/>
          <TextInput style={styles.inputs}
              secureTextEntry={true}
              placeholder="mot de passe"
              underlineColorAndroid='transparent'
              onChangeText={(password) => this.setState({password})}/>
        </View>

        
        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/speech-bubble/ultraviolet/50'}}/>
          <TextInput style={[ styles.messageInput]}
              placeholder="Message"
              underlineColorAndroid='transparent'
              onChangeText={(password) => this.setState({password})}/>
        </View>

        {this._buttonChargement()}
          {this._buttonConnexion()}

        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
  },
  logo:{
    width:120,
    height:120,
    justifyContent: 'center',
    marginBottom:20,
  },
  inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius:30,
      borderBottomWidth: 1,
      width:300,
      height:45,
      marginBottom:20,
      flexDirection: 'row',
      alignItems:'center'
  },
  inputs:{
      height:45,
      marginLeft:16,
      borderBottomColor: '#FFFFFF',
      flex:1,
  },
  inputIcon:{
    width:30,
    height:30,
    marginLeft:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:200,
    borderRadius:30,
  },
  sendButton: {
    backgroundColor: "blue",
  },
  buttonText: {
    color: 'white',
  }
}); 






