            
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Alert,
  AsyncStorage,
} from 'react-native';
import API from './api/service'
import {connect} from 'react-redux'


 class LoginM extends Component {

  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
};

  constructor(props) {
    super(props);
    this.state = {
      email   : '',
      password: '',
      loginIsPressed: false,
      TextInputDisableHolder: true,
      hidePassword: true
    }
  }

  managePasswordVisibility = () =>
  {
    // function used to change password visibility
    this.setState({ hidePassword: !this.state.hidePassword });

  }

  onClickListener = (viewId) => {
    Alert.alert("Alert", "Button pressed "+viewId);
  }

  loginUser = async () => {
    if(this.state.email.length > 0 && this.state.password.length > 0){
    this.setState({loginIsPressed: true, TextInputDisableHolder: false})
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
              let requireSource = {uri: user.url_photo + user.photo}
              const action2 = {type: "SET_AVATAR", value: requireSource}
              this.props.dispatch(action2)
              this.setState({loginIsPressed: false, TextInputDisableHolder: true})

              this.props.navigation.navigate('App');

        } // fin if 
        else if(responseJson.status === 401){
          Alert.alert(
            'Erreur',
            'Ces identifiants ne correspondent à aucun compte !',
            [
              {text: 'OK', onPress: () => {}},
            ],
            {cancelable: false},
          );
        }
     })
     .catch((error) => {

      // console.error(error);
      this.setState({loginIsPressed: false, TextInputDisableHolder: true})
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
     
      <TouchableOpacity style={[styles.buttonContainer, styles.sendButton]} onPress={this.loginUser} >
          <Text style={styles.buttonText}>Connexion</Text>
      </TouchableOpacity>
    
    )
  }
}

_buttonChargement = () => {
  if(this.state.loginIsPressed){
    return (
              <ActivityIndicator size="large" color="#0000ff" />


    )
  }
}

  render() {
    return (
      <View style={styles.container}>
       
        <Image style={styles.logo} source={require('./images/logoB.png')}/>


        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={require('./images/email.png')}/>
          <TextInput style={styles.inputs}
              keyboardType="email-address"
              editable={this.state.TextInputDisableHolder}  

              placeholder="Adresse email"
              underlineColorAndroid='transparent'
              onChangeText={(email) => this.setState({email})}/>
        </View>
        
        <View style={styles.inputContainer}>
        <Image style={styles.inputIcon} source={require('./images/password.png')}/>

           <TextInput style={styles.inputs}
            editable={this.state.TextInputDisableHolder}  

              secureTextEntry={ this.state.hidePassword }
              placeholder="mot de passe"
              underlineColorAndroid='transparent'
              onChangeText={(password) => this.setState({password})}/>
            <TouchableOpacity activeOpacity = { 0.8 } style = { styles.inputIcon } onPress = { this.managePasswordVisibility }>
          <Image source = { ( this.state.hidePassword ) ? require('./images/passCache.png') : require('./images/passVoir.png') }  />

          </TouchableOpacity>

        
         
            {/*   <PasswordInputText
                style={styles.inputs}

                    onChangeText={ (password) => this.setState({ password }) }
                /> */}
             
        </View>

        

        {this._buttonChargement()}
          {this._buttonConnexion()}

          <View>
        <Text style={{textAlign: 'center'}}>Interface collaborative des CIFOPIENS</Text>

        </View>

        
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
    width:180,
    height:180,
    justifyContent: 'center',
    marginBottom:-20,
    marginTop:-90,

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
  waitButton: {
    backgroundColor: "green",
  },
  buttonText: {
    color: 'white',
  }
}); 

const mapStateToProps = state => {
  return {
      user: state.setUser.user
  }
}

export default connect(mapStateToProps)(LoginM)

