import React from 'react'

import {StyleSheet, View, Image} from 'react-native'
import LoginForm from './LoginForm'
class Login extends React.Component {

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.loginContainer}>
                    <Image resizeMode="contain" style={styles.logo} 
                    source={require('./images/plogo2.png')} />
                </View>
                <View style={styles.formContainer}>
                    <LoginForm onLoginPress={this.props.envoye} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50'
    },
    formContainer: {
        flex: 1
    },
    loginContainer: {
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
    },
    logo: {
        position: 'absolute',
        width: 600,
        height: 300
    }
})

export default Login