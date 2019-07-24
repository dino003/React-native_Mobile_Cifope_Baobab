/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, StatusBar} from 'react-native';
import Navigation from './navigation/Navigation'
import {Provider} from 'react-redux'
import Store from './store/Store'
import {persistStore} from 'redux-persist'
import { PersistGate } from 'redux-persist/es/integration/react'
import SplashScreen from 'react-native-splash-screen'


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  constructor(props){
    super(props)
    this.state= {
      isLogin: false
    }
  }

  componentDidMount() {
    // do stuff while splash screen is shown
      // After having done stuff (such as async tasks) hide the splash screen
      SplashScreen.hide();
  }
  
  render() {
    //console.log(this.state)
   // console.log(this.props.navigation)
       // daniel guichard mon vieux

      let persistor = persistStore(Store)
      return (
        <Provider store={Store}>
           <PersistGate persistor={persistor}>
           <StatusBar
      barStyle="light-content"
      backgroundColor="green"
    />
            <Navigation />
          </PersistGate>
        </Provider>
      );
    
   
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
