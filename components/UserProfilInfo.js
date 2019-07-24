import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Picker
} from 'react-native';
import {connect} from 'react-redux'


 class UserProfilInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email   : '',
      password: '',
      state: 'Java'

    }
  }

  onClickListener = (viewId) => {
    Alert.alert("Alert", "Button pressed "+viewId);
  }

  componentDidMount(){
     // console.log(this.props)
  }

  render() {
    return (
        <KeyboardAvoidingView style={styles.container}  enabled>
                    <ScrollView style={styles.scrol}>
                    <Text numberOfLines={1} style={styles.labelText}>Prenoms</Text>

        <View style={styles.inputContainer}>
          <TextInput style={styles.inputs}
          multiline={true}

              placeholder="Prenoms"
              underlineColorAndroid='transparent'
              onChangeText={(email) => this.setState({email})}/>
          <Image style={styles.inputIcon} source={require ('../components/images/circled-user-male-skin-type-3.png')}/>
        </View>
        <Text numberOfLines={1} style={styles.labelText}>Nom de famille</Text>

        <View style={styles.inputContainer}>
          <TextInput style={styles.inputs}
          multiline={true}

              placeholder="Nom"
              underlineColorAndroid='transparent'
              onChangeText={(email) => this.setState({email})}/>
          <Image style={styles.inputIcon} source={require ('../components/images/circled-user-male-skin-type-3.png')}/>
        </View>
        <Text numberOfLines={1} style={styles.labelText}>Numero de telephone</Text>

        <View style={styles.inputContainer}>
          <TextInput style={styles.inputs}
          multiline={true}

              placeholder="Numero de telephone"
              underlineColorAndroid='transparent'
              onChangeText={(email) => this.setState({email})}/>
          <Image style={styles.inputIcon} source={require ('../components/images/circled-user-male-skin-type-3.png')}/>
        </View>

        <Text numberOfLines={1} style={styles.labelText}>Fonction</Text>

            <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
                 multiline={true}

                placeholder="Fonction"
                underlineColorAndroid='transparent'
                onChangeText={(email) => this.setState({email})}/>
            <Image style={styles.inputIcon} source={require ('../components/images/circled-user-male-skin-type-3.png')}/>
            </View>

            <Text numberOfLines={1} style={styles.labelText}>Nom de L'organisme</Text>

                <View style={styles.inputContainer}>
                <TextInput style={styles.inputs}
                          multiline={true}
                    placeholder="Nom de l'organisme"
                    underlineColorAndroid='transparent'
                    onChangeText={(email) => this.setState({email})}/>
                <Image style={styles.inputIcon} source={require ('../components/images/circled-user-male-skin-type-3.png')}/>
                </View>
                <Text numberOfLines={1} style={styles.labelText}>Télécopie</Text>

        <View style={styles.inputContainer}>
          <TextInput style={styles.inputs}
          multiline={true}
              placeholder="Telecopie"
              keyboardType="email-address"
              underlineColorAndroid='transparent'
              onChangeText={(email) => this.setState({email})}/>
          <Image style={styles.inputIcon} source={require('../components/images/secured-letter.png')}/>
        </View>
        <Text numberOfLines={1} style={styles.labelText}>Adresse</Text>

        <View style={styles.inputContainer}>
          <TextInput style={styles.inputs}
          multiline={true}

              placeholder="Adresse"
              secureTextEntry={true}
              underlineColorAndroid='transparent'
              onChangeText={(password) => this.setState({password})}/>
          <Image style={styles.inputIcon} source={require('../components/images/password.png')}/>
        </View>
        <Text numberOfLines={1} style={styles.labelText}>Pays</Text>

        <Picker
            selectedValue={this.state.language}
            style={styles.inputContainer}           
             onValueChange={(lang) => this.setState({language: lang})}
             mode='dropdown'
             >
            <Picker.Item label="Java" value="java" />
            <Picker.Item label="JavaScript" value="js" />
            </Picker>

        <View style={styles.inputContainer}>
          <TextInput style={styles.inputs}
              placeholder="Confirmation"
              secureTextEntry={true}
              underlineColorAndroid='transparent'
              onChangeText={(password) => this.setState({password})}/>
          <Image style={styles.inputIcon} source={require('../components/images/password.png')}/>
        </View>

        

        <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.onClickListener('login')}>
          <Text style={styles.loginText}>Enregistrer</Text>
        </TouchableOpacity>


        </ScrollView>
      </KeyboardAvoidingView>

    );
  }
}

const resizeMode = 'center';

const styles = StyleSheet.create({

    scrol: {
        flex:1,
    
    },
    labelText: {
        alignItems: 'center'
    },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   backgroundColor: '#AFAFAF',
   marginTop: 18
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
    alignItems:'center',

    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
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
    marginRight:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:300,
    borderRadius:30,
    backgroundColor:'transparent'
  },
  btnByRegister: {
    height:15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical:20,
    width:300,
    backgroundColor:'transparent'
  },
  loginButton: {
    backgroundColor: "#00b5ec",

    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.50,
    shadowRadius: 12.35,

    elevation: 19,
  },
  loginText: {
    color: 'white',
  },
  bgImage:{
    flex: 1,
    resizeMode,
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  btnText:{
    color:"white",
    fontWeight:'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  textByRegister:{
    color:"white",
    fontWeight:'bold',
    textAlign:'center',

    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  }
});  

const mapStateToProps = state => {
    return {
        avatar: state.setAvatar.avatar,
        user: state.setUser.user
    }
  }
  
  export default connect(mapStateToProps)(UserProfilInfo)