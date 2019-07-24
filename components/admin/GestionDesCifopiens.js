
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TouchableHighlight,
  Alert,
  TextInput,
  Platform,
  FlatList,
  ActivityIndicator
} from 'react-native';
import API2 from '../api/serviceLocal'
import {Image, Avatar, Badge, Icon} from 'react-native-elements'
import {connect} from 'react-redux'
import Congratulation from '../Congrat'
//import Icon from 'react-native-vector-icons/FontAwesome';
import UserItem from './UserItem'





 class GestionDesCifopiens extends React.PureComponent  {

   

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('ami_conversation', 'Retrouver un Cifopi'),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      loading: false,
      term : '',
      isLoading: false,
      selectedFruits: [],
      isSubmit: false,
      publie: false,

    }

  }

 

 onShowUser = (item) => {
   //console.log(item)
   this.props.navigation.navigate("UserProfilPage", {user: item})
 }

 onChangeStatus = id => {
  //item.active = !item.active
 // this.setState({})
 // this.forceUpdate()
  this.setState({users: this.state.users.map(user => {
    if(user.id === id){
      user.active = !user.active
    }

    return user;
  })})
 // API2.get('changer_status_utilisateur/' + item.id)
 }

 onDeleteUser = (item) => {
 
  Alert.alert(
    '! Confirmation',
    'Vraiment supprimer  ' +item.name + ' ?',
    [
     // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
      {
        text: 'Annuler',
        onPress: () => {},
        style: 'cancel',
      },
      {text: 'Oui', onPress: () => {
       // this.state.users.splice(index, 1)
        //this.setState({})
       // this.forceUpdate()
       this.setState({users: [...this.state.users.filter(user => user.id !== item.id)]})
      //  API2.get('supprimer_utilisateur/' + item.id)
      }},
    ],
    {cancelable: false},
  );
 }

  

  _renderItem = ({item}) => (
    <UserItem
      user={item}
      onShowUser={this.onShowUser}
      onChangeStatus={this.onChangeStatus}
      onDeleteUser={this.onDeleteUser}
    />
  );
    
 
  

  onSelectionsChange = (selectedFruits) => {
    // selectedFruits is array of { label, value }
    this.setState({ selectedFruits })
  }

  _elementVide = () => {
    if(!this.state.isLoading && this.state.isSubmit && this.state.term.length > 0 && this.state.users.length == 0){
      return (
        <View style={{flex: 1}}>
          <Text style={{textAlign: 'center'}}>Aucun utilisateur trouvé dans cette recherche</Text>
        </View>
      )
    }
  }

  getUsersByRecherche = async () => {
    if(this.state.term.length > 0){
      this.setState({loading: true, isLoading: true, isSubmit: true})
      await API2.get('/users_by_recherche/' + this.state.term)
       .then((responseJson) => {
           if(typeof responseJson.data === 'string'){
              data = responseJson.data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
              responseFinal = JSON.parse(data)
                   let article_recus = responseFinal
                  // console.log(article_recus)
                   this.setState({
                      loading: false,
                      isLoading: false,
                      users: article_recus
                  })
           
           }else{
               this.setState({
                   loading: false,
                   isLoading: false,
                   users: responseJson.data
               })
  
           }
        
       })
       .catch((error) => {
         console.error(error);
       }); 
    }
     
  }




 

_displayLoading() {
  if (this.state.loading) {
    // Si isLoading vaut true, on affiche le chargement à l'écran
    return (
      <View style={{flex: 1}}>
        <ActivityIndicator style={styles.loading_container} size='large' />

      </View>
    )
  }
}



  displayUsers(){
    const users = this.state.users

    const cifopiens = users.filter(cifop => {
      return cifop.id !== this.props.user.id
  })

   // if(cifopiens.length > 0){
      
      return (

        <FlatList
        style={styles.root}
        ListEmptyComponent={ <Congratulation />}
        data={cifopiens}
        extraData={this.state}
        ItemSeparatorComponent={() => {
          return (
            <View style={styles.separator}/>
          )
        }}
        keyExtractor={(item, index)=>{
          return item.id.toString();
        }}       
         renderItem={this._renderItem}
      />
      )
   // }
  
  }

  _displayFloatingActionButton = () => {
    const user = this.props.user
    if (user !== undefined && user.admin && Platform.OS === 'android') { // Uniquement sur Android et lorsque le film est chargé
      return (
        <TouchableOpacity
          style={styles.share_touchable_floatingactionbutton}
          onPress={() => this.props.navigation.navigate("AjoutUtilisateur")}>
          <Image
            style={styles.share_image}
            source={require('../images/plus24.png')}
            
             />
          
        </TouchableOpacity>
      )
    }
}

_displaySendButton = () => {
  //const {comment} = this.props.commentaire
  if( !this.state.isLoading){
    return (

    <TouchableHighlight style={styles.saveButton} onPress={() => this.getUsersByRecherche()}>
    <Image style={[styles.icon, styles.iconBtnSearch]} source={require('../images/2ecc71.png')}/>
    </TouchableHighlight>
    )
  }
}

_displaySWaitButton = () => {
  //const {comment} = this.props.commentaire
  if(this.state.term.length > 0 && this.state.isLoading){
    return (
      <TouchableHighlight style={styles.saveButton}>
        <ActivityIndicator />
    </TouchableHighlight>
    )
   
  }
}



  render() {
    return (
      <View style={styles.container}>
         <View style={styles.formContent}>
         <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
                placeholder="Rechercher un cifopien ..."
                underlineColorAndroid='transparent'
                editable = {true}
                onChangeText={(term) => this.setState({term})}
                onSubmitEditing={this.getUsersByRecherche}
                />
               
                
          </View>
          {this._displaySendButton()}
          {this._displaySWaitButton()}
          
        </View>
        {this._displayLoading()}

          {this.displayUsers()}
          {this._elementVide()}
          {this._displayFloatingActionButton()}
               

        </View>
    );
  }
}

const styles = StyleSheet.create({
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
  formContent:{
    flexDirection: 'row',
    marginTop:30,
  },
  inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius:30,
      borderBottomWidth: 1,
      height:65,
      flexDirection: 'row',
      alignItems:'center',
      flex:1,
      margin:10,
      marginTop: -20
  },
  icon:{
    width:30,
    height:30,
  },
  icona:{
    width:20,
    height:20,
  },
  iconBtnSearch:{
    alignSelf:'center'
  },
  inputs:{
      height:45,
      marginLeft:16,
      borderBottomColor: '#FFFFFF',
      flex:1,
  },
  inputIcon:{
    marginLeft:15,
    justifyContent: 'center'
  },
  saveButton: {
    height:60,
    justifyContent: 'center',
    alignItems: 'center',
    margin:10,
    width:60,
    alignSelf: 'flex-end',
    backgroundColor: 'black',
    borderRadius:30,
    marginTop: -40
  },
  saveButtonText: {
    color: 'white',
  },
  root: {
    backgroundColor: "#ffffff",
    marginTop:10,
  },
  containera: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    //flex: 1,
    //backgroundColor: '#EBEBEB',
  },
  container: {
    flex: 1,
    backgroundColor: '#EBEBEB',
  },
  content: {
    marginLeft: 16,
    flex: 1,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  separator: {
    height: 1,
    backgroundColor: "#CCCCCC"
  },
  image:{
    width:45,
    height:45,
    borderRadius:20,
    marginLeft:20
  },
  time:{
    fontSize:11,
    color:"#808080",
  },
  name:{
    fontSize:16,
    fontWeight:"bold",
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
    width: 20,
    height: 20
  }


}); 

const mapStateToProps = state => {
  return {
      user: state.setUser.user
  }
}

export default connect(mapStateToProps)(GestionDesCifopiens)