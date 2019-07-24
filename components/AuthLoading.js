import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    try {
        const userToken = await AsyncStorage.getItem('userToken');
        this.props.navigation.navigate(userToken ? 'App' : 'Auth');
      
    } catch (error) {
      // Error retrieving data
    }
  };



  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.loading_container}>
        <ActivityIndicator size='large' />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

styles = StyleSheet.create({
    main_container: {
        flex:1
    },
    
    loading_container: {
        flex: 1,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    
    },
})