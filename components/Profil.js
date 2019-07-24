
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  RefreshControl ,
  FlatList,
  Button,
  Platform,
  ActivityIndicator,
  AsyncStorage
} from 'react-native';
import {Avatar} from 'react-native-elements'
import API from './api/serviceLocal'

import { connect } from 'react-redux'
import ImagePicker from 'react-native-image-picker'
import ImageView from 'react-native-image-view';
import RNFetchBlob from 'rn-fetch-blob'


const options = {
  title: 'Modifier la photo de profil',
  cancelButtonTitle: 'Annuler',
  takePhotoButtonTitle: 'Prendre une photo',
  chooseFromLibraryButtonTitle: 'Choisir dans la galérie',
  mediaType: 'photo',
  allowsEditing: true,
  noData: true,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

class Profil extends Component {

  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
        isImageViewVisible: false,
        numColumns:4,
        loading: false,
        refreshing: false,

        seminaires_user_par_suivre: [],
        seminaires_user_par_suivre_count: null,



    }
  }

  componentDidMount(){
     this.getUserSeminaire()
    // console.log('ok')
 }

 _onRefresh = async () => {
  this.setState({refreshing: true});
  // this.setState({loading: true})
  await API.get('/get_user_seminaire_suivre/' + this.props.user.id)
   .then((responseJson) => {
       if(typeof responseJson.data === 'string'){
          data = responseJson.data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
          responseFinal = JSON.parse(data)
         // console.log(responseFinal)

         // console.log( tb.user.name)
               //console.log(seminaires_recus)
               let user = responseFinal

               const action = {type: "CONNEXION", value: user}
              this.props.dispatch(action)
              this.setState({refreshing: false});

              
       }else{

        const action = {type: "CONNEXION", value: responseJson}
        this.props.dispatch(action)
        this.setState({refreshing: false});

       }
    
   })
   .catch((error) => {
     console.error(error);
   });
}

 getUserSeminaire = async () => {
 // this.setState({loading: true})
  await API.get('/get_user_seminaire_suivre/' + this.props.user.id)
   .then((responseJson) => {
       if(typeof responseJson.data === 'string'){
          data = responseJson.data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
          responseFinal = JSON.parse(data)
         // console.log(responseFinal)

         // console.log( tb.user.name)
               //console.log(seminaires_recus)
               let user = responseFinal

               const action = {type: "CONNEXION", value: user}
              this.props.dispatch(action)
              
       }else{

        const action = {type: "CONNEXION", value: responseJson}
        this.props.dispatch(action)
       }
    
   })
   .catch((error) => {
     console.error(error);
   });
}

  _displayLoading() {
    if (this.state.loading) {
      // Si isLoading vaut true, on affiche le chargement à l'écran
      return (
          <ActivityIndicator style={styles.loading_container} size='small' />
      )
    }
  }
  

  _displayFloatingActionButton = () => {
    const user = this.props.user
    if (user !== undefined && user.admin && Platform.OS === 'android') { // Uniquement sur Android et lorsque le film est chargé
      return (
        <TouchableOpacity
          style={styles.share_touchable_floatingactionbutton}
          onPress={() => this.props.navigation.navigate("Administration")}>
          <Image
            style={styles.share_image}
            source={require('./images/menuAdmin.png')} />
        </TouchableOpacity>

        
      )
    }
  }

  _displayDeconnexion = () => {
      return (
        <TouchableOpacity
          style={[styles.share_touchable_deco, {backgroundColor: 'orange'}]}
          onPress={() => this.confirmationDeconnexion()}>
          <Image
            style={styles.share_image}
            source={require('./images/deconn.png')} />
        </TouchableOpacity>

        
      )
    
  }

  


 

  renderItem = ({item, index}) => {
 
    return (
        
        <TouchableOpacity
         onPress={() => this.props.navigation.navigate("DetailSeminaire", {seminaire: item, nom_seminaire: item.nom_seminaire})}
         style={styles.btnSize}>
           <Text>{item.code_seminaire}</Text>
         </TouchableOpacity> 
    );
  }
  


  
  _signOutAsync = async () => {
    // await AsyncStorage.clear();
    // let keys = ['userToken', 'user'];

    try {
      await AsyncStorage.removeItem('userToken');
      const action = { type: "DECONNEXION", value: {} }
      this.props.dispatch(action)
      this.props.navigation.navigate('Auth');

    } catch (error) {
      // Error saving data
      console.log(error)
    }
  };

  clickEventListener() {
    Alert.alert("Success", "Product has beed added to cart")
  }

  confirmationDeconnexion = () => {
    Alert.alert(
      '! Attention',
      'Déconnexion de L\'application ?',
      [
        // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
        {
          text: 'Annuler',
          onPress: () => { },
          style: 'cancel',
        },
        { text: 'OK', onPress: () => this._signOutAsync() },
      ],
      { cancelable: false },
    );
  }

  _avatarClicked =  () => {
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('L\'utilisateur a annulé')
      } else if (response.error) {
        console.log('Erreur: ', response.error)
      } else {
        console.log('Photo : ', response)
        let requireSource = { uri: response.uri }
        const action = { type: "SET_AVATAR", value: requireSource }
        this.props.dispatch(action)
        this.setState({photo_data: response.path},
          () => this.uploadPhoto(response)
            
          
          )

      }
    })
  }

  uploadPhoto = async (response) => {
   await RNFetchBlob
    //.config({timeout: 60000})

  //  .fetch('POST', 'http://127.0.0.1:3000/api/update_photo_profil/' + this.props.user.id, {
      .fetch('POST', 'https://leprojetbaobab.com/api/update_photo_profil/' + this.props.user.id, {

     // Authorization: "Bearer access-token",
     // otherHeader: "foo",
      'Content-Type': 'multipart/form-data',
    }, [

        // custom content type
        { name: 'photo', filename : response.fileName, data: RNFetchBlob.wrap(response.path) },

      ]).then((resp) => {
        // ...
        console.log(resp.data)
      }).catch((err) => {
        // ...
        console.log(err)
      })
  }


  render() {
      const user = this.props.user
      const images = [
        {
            source: {
                uri: user.url_photo + user.photo,
            },
            
            title: 'Paris',
            width: 806,
            height: 720,
        },
    ];
    return (
      <View style={styles.container}>
           <ImageView
            images={images}
            imageIndex={0}
            isVisible={this.state.isImageViewVisible}
            onClose={() => this.setState({isImageViewVisible: false})}
        />
        <ScrollView  
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        
        >
          
          <View style={{alignItems:'center', marginHorizontal:30}}>
           
            <Avatar
               style={styles.productImg}
               title={user.prenom[0] + user.name[0]}
               size="xlarge"
                onPress={() => this.setState({ isImageViewVisible: true })}
                rounded
                source={this.props.avatar}
                editButton={{ name: 'camera', color: 'black', type: 'font-awesome' }}
                onEditPress={this._avatarClicked}
                showEditButton
              />
           
            <Text numberOfLines={1} style={styles.name}>{user.prenom} {user.name}</Text>
            
                {(user.seminaires_user_par_suivre_count > 0)? (
                    <Text style={styles.price}>
                    {user.seminaires_user_par_suivre_count} séminaire (s)</Text>
                ): null}
         
           
          </View>
        
        
          <View style={styles.contentSize}>
           

            <FlatList
          data={user.seminaires_user_par_suivre}
          keyExtractor= {(item) => {
            return item.id.toString();
          }}
          extraData={this.state}
          renderItem={this.renderItem}
          numColumns={this.state.numColumns}/>

            
          </View>
          <View style={styles.separator}></View>
          {(user.seminaires_user_par_suivre.length > 0) ? (
             <TouchableOpacity  style={{alignItems: 'center'}} onPress={() => this.props.navigation.navigate("UserSeminaire")}>
             <Text>Voir tous mes séminaires</Text>
   
             </TouchableOpacity>
          ) : null}
         

        
        </ScrollView>
        {this._displayFloatingActionButton()}
          {this._displayDeconnexion()}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    marginTop:20,
  },
  productImg:{
    width:200,
    height:200,
  },
  name:{
    fontSize:28,
    color:"#696969",
    fontWeight:'bold'
  },
  price:{
    marginTop:10,
    fontSize:18,
    color:"green",
    fontWeight:'bold'
  },
  description:{
    textAlign:'center',
    marginTop:10,
    color:"#696969",
  },
  star:{
    width:40,
    height:40,
  },
  btnColor: {
    height:30,
    width:30,
    borderRadius:30,
    marginHorizontal:3
  },
  btnSize: {
    height:60,
    width:60,
    borderRadius:60,
    borderColor:'#778899',
    borderWidth:1,
    marginHorizontal:3,
    backgroundColor: "#00BFFF",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starContainer:{
    justifyContent:'center', 
    marginHorizontal:30, 
    flexDirection:'row', 
    marginTop:20
  },
  contentColors:{ 
    justifyContent:'center', 
    marginHorizontal:30, 
    flexDirection:'row', 
    marginTop:20
  },
  contentSize:{ 
    justifyContent:'center', 
    marginHorizontal:30, 
    flexDirection:'row', 
    marginTop:20
  },
  separator:{
    height:2,
    backgroundColor:"#eeeeee",
    marginTop:20,
    marginHorizontal:30
  },
  shareButton: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:30,
    backgroundColor: "red",
  },
  shareButtonText:{
    color: "#FFFFFF",
    fontSize:20,
  },
  addToCarContainer:{
    marginHorizontal:30
  },

  share_touchable_deco: {
    position: 'absolute',
    width: 60,
    height: 60,
    right: 30,
    bottom: 100,
    borderRadius: 30,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center'
  },

  share_touchable_floatingactionbutton: {
    position: 'absolute',
    width: 60,
    height: 60,
    right: 30,
    bottom: 30,
    borderRadius: 30,
    backgroundColor: 'green',
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

export default connect(mapStateToProps)(Profil)