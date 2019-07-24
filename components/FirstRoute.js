import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  Button,
  Platform,

} from 'react-native';

import axios from 'axios'
import {connect} from 'react-redux'
import ImagePicker from 'react-native-image-picker'
import Avatar from './Avatar'
import { MaterialHeaderButtons, Item } from '../buttons/HeaderButtons'
const options = {
    title: 'Sélectionnez une photo',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
class FirstRoute extends React.Component {

    constructor(props)  {
      super(props);
     this.state = {
        loading: false,
  
      }
    }
    
  componentDidMount(){
    console.log(this.props)
  }
    
  
    onClickListener = () => {
      Alert.alert("Alert", "Button pressed ");
    }
  
    confirmationDeconnexion = () => {
      Alert.alert(
        '! Attention',
        'Déconnexion de L\'application ?',
        [
         // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
          {
            text: 'Annuler',
            onPress: () => {},
            style: 'cancel',
          },
          {text: 'OK', onPress: () => this._signOutAsync()},
        ],
        {cancelable: false},
      );
    }
  
    _avatarClicked = () => {
      ImagePicker.showImagePicker(options, (response) => {
          if(response.didCancel){
              console.log('L\'utilisateur a annulé')
          }else if(response.error){
              console.log('Erreur: ', response.error )
          }else{
              console.log('Photo : ', response)
              let requireSource = {uri: response.uri}
              const action = {type: "SET_AVATAR", value: requireSource}
              this.props.dispatch(action)
             
          }
      })
    }
    
  
     _displayLoading = () => {
        if (this.state.loading) {
          // Si isLoading vaut true, on affiche le chargement à l'écran
          return (
              <ActivityIndicator style={styles.loading_container} size='large' />
          )
        }
      }
  
      _signOutAsync = async () => {
       // await AsyncStorage.clear();
         // let keys = ['userToken', 'user'];
  
        try {
          await AsyncStorage.removeItem('userToken');
          const action = {type: "DECONNEXION", value: {}}
          this.props.dispatch(action)
          this.props.navigation.navigate('Auth');
    
        } catch (error) {
          // Error saving data
          console.log(error)
        }
      };
  
      _displayFloatingActionButton = () => {
        const user = this.props.user
        if (user != undefined && Platform.OS === 'android') { // Uniquement sur Android et lorsque le film est chargé
          return (
            <TouchableOpacity
              style={styles.share_touchable_floatingactionbutton}
              onPress={() => alert('cool')}>
              <Image
                style={styles.share_image}
                source={require('./images/crayon.png')} />
            </TouchableOpacity>
          )
        }
    }
  
  
      _displayUserInfo = () => {
          //console.log(this.state.user)
         // const {user} = this.state
          //console.log(this.user)
          // let user = JSON.parse(this.props.user)
  
        //const user = AsyncStorage.getItem('user')
       // const avatar = AsyncStorage.getItem('avatar')
       // console.warn(user)
       const user = this.props.user
          if(user !== undefined){
              return (
                  <View >
                       <View style={styles.header}>
            <View style={styles.headerContent}>
            <TouchableOpacity
        style={styles.touchableOpacity}
        onPress={this._avatarClicked} >
                <Image style={styles.avatar}
                  source={this.props.avatar}/>
                  </TouchableOpacity>
  
  
                <Text numberOfLines={1} style={styles.name}>{user.prenom} {user.name} </Text>
                <Text style={styles.userInfo}>{user.email} </Text>
                <Text style={styles.userInfo}>Abidjan</Text>
            </View>
          </View>
          <View style={styles.body}>
        
             

            <TouchableOpacity style={styles.item} onPress={this.confirmationDeconnexion} >
            <View style={styles.iconContent}>
                <Image style={styles.icon} source={require('../components/images/ffffff3.png')}/>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.info}>Déconnexion</Text>
              </View>
            </TouchableOpacity>
  
          </View>
                  </View>
              )
         }
      }
      render() {
        return (
          <View style={styles.main_container}>
              {this._displayLoading()}
            {this._displayUserInfo()}
            {this._displayFloatingActionButton()}
            
          </View>
        );
      }
  }

  const styles = StyleSheet.create({
  
    header:{
      backgroundColor: "#DCDCDC",
    },
    headerContent:{
      padding:30,
      alignItems: 'center',
    },
    avatar: {
      width: 130,
      height: 130,
      borderRadius: 63,
      borderWidth: 4,
      borderColor: "white",
      marginBottom:10,
    },
    name:{
      fontSize:15,
      color:"#000000",
      fontWeight:'600',
    },
    userInfo:{
      fontSize:16,
      color:"#778899",
      fontWeight:'600',
    },
    body:{
      backgroundColor: "#778899",
      height:500,
      alignItems:'center',
     // justifyContent: 'center',

    },
    item:{
      flexDirection : 'row',
    },
    infoContent:{
      flex:1,
      alignItems:'flex-start',
      paddingLeft:5,
      marginLeft: 5
    },
    iconContent:{
      flex:1,
      alignItems:'flex-end',
      paddingRight:5,
    },
    icon:{
      width:30,
      height:30,
      marginTop:20,
    },
    info:{
      fontSize:18,
      marginTop:20,
      color: "#FFFFFF",
    },
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
  
  share_touchable_floatingactionbutton: {
    position: 'absolute',
    width: 60,
    height: 60,
    right: 30,
    bottom: 30,
    borderRadius: 30,
    backgroundColor: '#e91e63',
    justifyContent: 'center',
    alignItems: 'center'
  },
  share_image: {
    width: 30,
    height: 30
  }
  });

  const mapStateToProps = state => {
    return {
        avatar: state.setAvatar.avatar,
        user: state.setUser.user
    }
  }
  
  export default connect(mapStateToProps)(FirstRoute)