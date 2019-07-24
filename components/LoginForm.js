import React, { Component } from 'react';
import {StyleSheet, View, Text, TextInput, Alert, TouchableOpacity, Button, StatusBar} from 'react-native'
class LoginForm extends Component {

    _onButtonPress(){
        console.log('clik')
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput style={styles.input} 
                    autoCapitalize="none"
                    onSubmitEditing={() => this.passwordInput.focus()}
                    autoCorrect={false}
                    keyboardType='email-address'
                    returnKeyType="next"
                    placeholder="Email ou Numero"
                    placeholderTextColor="rgba(225,225,225,0.7)"
                />

                <TextInput style={styles.input} 
                    ref={(input) => this.passwordInput = input}
                    returnKeyType="go"
                    placeholder="Mot de passe"
                    placeholderTextColor="rgba(225,225,225,0.7)"
                    secureTextEntry
                />

                <TouchableOpacity style={styles.buttonContainer} onPress={this.props.onLoginPress} >
                    <Text style={styles.buttonText}>CONNEXION</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container:{
        padding: 20,
        flex: 1
    },
    input: {
       // flex: 3,
        height: 40,
        backgroundColor: 'rgba(225,225,225,0.2)',
        marginBottom: 10,
        padding: 10,
        color: '#fff',
        width: 300
    },
    buttonContainer: {
        backgroundColor: '#2980b6',
        paddingVertical: 15
    },

    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '700'
    }
})
export default LoginForm;