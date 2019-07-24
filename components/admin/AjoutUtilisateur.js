import React, { Component } from 'react';
import {View, StyleSheet, TextInput, Text, TouchableHighlight, ScrollView, KeyboardAvoidingView} from 'react-native'
import { Image, CheckBox   } from 'react-native-elements'
import API2 from '../api/serviceLocal'
import Toast, {DURATION} from 'react-native-easy-toast'


class AjoutUtilisateur extends Component {

    constructor(props){
        super(props)

        this.state = {
            name: '',
            prenom: '',
            email: '',
           // profession: '',
            admin: false,
            prof: false,
            etu: true,
            loginIsPressed: false,
            message: undefined
        }
    }

    _buttonConnexion = () => {
        if(!this.state.loginIsPressed){
          return (
           
            <TouchableHighlight style={[styles.buttonContainer, styles.sendButton]}
             onPress={this.enregistrerUtilisateur} >
                <Text style={styles.buttonText}>Enregistrer</Text>
            </TouchableHighlight>
          
          )
        }
      }
      
      _buttonChargement = () => {
        if(this.state.loginIsPressed){
          return (
                <TouchableHighlight style={[styles.buttonContainer, styles.sendButton]} onPress={() => {}} >
                    <Text style={styles.buttonText}>Merci de patienter...</Text>
                    <Image source={require('../images/loadGif.gif')} />
      
                </TouchableHighlight>
          )
        }
      }

      enregistrerUtilisateur = async () => {
        if(!this.state.name.length == 0 && !this.state.prenom.length  == 0 && !this.state.email.length  == 0 ){
            this.setState({loginIsPressed: true})
            await API2.post('/ajouter_utilisateur', {
                name: this.state.name,
                prenom: this.state.prenom,
                email: this.state.email,
               // profession: this.state.profession,
                admin: this.state.admin,
                prof: this.state.prof,
                etu: this.state.etu
            })
            .then((responseJson) => {
                if(typeof responseJson.data === 'string'){
                   data = responseJson.data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
                   responseFinal = JSON.parse(data)
                        let article_recus = responseFinal
                      this.setState({
                          loginIsPressed: false,
                          message: responseFinal
                      }) 
                      this.refs.toast.show(this.state.message.message, 10000, () => {
                        // something you want to do at close
                       });
                
                }else{
                    this.setState({
                        loginIsPressed: false
                    })
                    this.refs.toast.show(this.state.message.message, 10000, () => {
                        // something you want to do at close
                       });
         
                }
             
            }).then( () => {
              this.setState({
                name: '',
                prenom: '',
                email: '',
               // profession: '',
                admin: false,
                prof: false,
                etu: true,
                loginIsPressed: false,
                message: undefined
              }
              )
             
             })
             .catch((error) => {
                console.error(error);
              });
        }else{
          // () => {alert('Certains champs ne sont pas renseignés')}
          }
      }

    render() {
     // console.log(this.props.navigation)
        return (
            <ScrollView style={{ backgroundColor: '#DCDCDC' }}>
            <View style={styles.container}>
            <Image style={styles.logo} source={require('../images/logoB.png')}/>
    
            <View style={styles.inputContainer}>
              <Image style={styles.inputIcon} source={require('../images/circled-user-male-skin-type-3.png')}/>
              <TextInput style={styles.inputs}    
                  placeholder="prenoms"
                  underlineColorAndroid='transparent'
                  onChangeText={(prenom) => this.setState({prenom})}/>
            </View>

            <View style={styles.inputContainer}>
              <Image style={styles.inputIcon} source={require('../images/circled-user-male-skin-type-3.png')}/>
              <TextInput style={styles.inputs}    
                  placeholder="Nom"
                  underlineColorAndroid='transparent'
                  onChangeText={(name) => this.setState({name})}/>
            </View>

            
            <View style={styles.inputContainer}>
              <Image style={styles.inputIcon} source={require('../images/email.png')}/>
              <TextInput style={styles.inputs}
                  keyboardType="email-address"
    
                  placeholder="Adresse email"
                  underlineColorAndroid='transparent'
                  onChangeText={(email) => this.setState({email})}/>
            </View>

    

            <View style={styles.inputContainera}>

              <CheckBox
                  title='Séminariste                                    '
                  checked={this.state.etu}
                  onPress={() => this.setState({etu: !this.state.etu})}

                  />
              </View>
    
            <View style={styles.inputContainera}>

            <CheckBox
                title='Expert                                              '
                checked={this.state.expert}
                onPress={() => this.setState({expert: !this.state.expert})}

                />
            </View>
            <View style={styles.inputContainera}>

            <CheckBox
                title='Administrateur                               '
                checked={this.state.admin}
                onPress={() => this.setState({admin: !this.state.admin})}

                />
            </View>


                  {!this.state.loginIsPressed && 

                  <TouchableHighlight style={[styles.buttonContainer, styles.sendButton]}
                  onPress={this.enregistrerUtilisateur} >
                    <Text style={styles.buttonText}>Enregistrer</Text>
                  </TouchableHighlight>
              }

           
              <Toast
                    ref="toast"
                    style={{backgroundColor:'#40E0D0'}}
                    position='top'
  
                />
            
          </View>
          </ScrollView>
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

    
  inputContainera: {
    borderRadius: 30,
    width: 300,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center'
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
    

export default AjoutUtilisateur;