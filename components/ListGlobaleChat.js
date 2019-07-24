import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TouchableHighlight,
  Alert,
  TextInput,
  FlatList,
  ActivityIndicator
} from 'react-native';
import API2 from '../components/api/serviceLocal'
import moment from 'moment'
import {connect} from 'react-redux'



 class ListGlobaleChat extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('ami_conversation', 'Retrouver un Cifopien'),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      loading: false,
      term : ''

    }

  }

  getUsersByRecherche = async () => {
    this.setState({loading: true})
    await API2.get('/users_by_recherche/' + this.state.term)
     .then((responseJson) => {
         if(typeof responseJson.data === 'string'){
            data = responseJson.data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
            responseFinal = JSON.parse(data)
                 let article_recus = responseFinal
                // console.log(article_recus)
                 this.setState({
                    loading: false,
                    users: article_recus
                })
         
         }else{
             this.setState({
                 loading: false,
                 users: responseJson.data
             })

         }
      
     })
     .catch((error) => {
       console.error(error);
     });    
  }


 _creerSessionEtLancerChat = async(partenaire) => {
  await API2.get('/createSession/' + this.props.user.id + '/' + partenaire.id)
   .then((responseJson) => {
       if(typeof responseJson.data === 'string'){
          data = responseJson.data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
          responseFinal = JSON.parse(data)
               let session_recu = responseFinal
              // console.log(article_recus)
       this.props.navigation.navigate("ChatMessage", {session_id: session_recu.id, partenaire: partenaire, ami_conversation: partenaire.prenom})
       
       }else{
        
           this.props.navigation.navigate("ChatMessage", {session_id: responseJson.data.id, partenaire: partenaire, ami_conversation: partenaire.prenom})


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
      <View style={{flex: 1}}>
        <ActivityIndicator style={styles.loading_container} size='large' />

      </View>
    )
  }
}

_displaySendButton = () => {
  //const {comment} = this.props.commentaire
  if(this.commentaire.length > 0){
    return (
      <TouchableHighlight style={styles.saveButton} onPress={() => this._ajouterCommentaire()}>
      <Image style={[styles.icon, styles.iconBtnSearch]} source={require('./images/filled-sent.png')}/>
    </TouchableHighlight>
    )
  }
}

  displayUsers(){
    const users = this.state.users

    const cifopiens = users.filter(cifop => {
      return cifop.id !== this.props.user.id
  })

    if(cifopiens.length > 0){
      return (
        <FlatList
        style={styles.root}
        data={cifopiens}
        extraData={this.state}
        ItemSeparatorComponent={() => {
          return (
            <View style={styles.separator}/>
          )
        }}
        keyExtractor={(item)=>{
          return item.id.toString();
        }}
        renderItem={(item) => {
         const Notification = item.item;
          return(
            <View style={styles.containera}>
              <TouchableOpacity onPress={() => this._creerSessionEtLancerChat(Notification)}>
                <Image style={styles.image} resizeMode='contain' source={{uri: Notification.url_photo + Notification.photo}}/>
              </TouchableOpacity  >
              <TouchableOpacity style={styles.content} onPress={() => this._creerSessionEtLancerChat(Notification)}>
                <View style={styles.contentHeader}>
                  <Text numberOfLines={1}  style={styles.name}>{Notification.prenom} {Notification.name}</Text>
                
                </View>
              </TouchableOpacity>
            </View>
          );
        }}/>
      )
    }
  
  }



  render() {
    return (
      <View style={styles.container}>
         <View style={styles.formContent}>
         <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
              ref={input => { this.textInput = input }}                
                placeholder="Rechercher un cifopien ..."
                underlineColorAndroid='transparent'
                editable = {true}
                onChangeText={(term) => this.setState({term})}
                />
          </View>
          <TouchableHighlight style={styles.saveButton} onPress={() => this.getUsersByRecherche()}>
      <Image style={[styles.icon, styles.iconBtnSearch]} source={require('./images/2ecc71.png')}/>
    </TouchableHighlight>
          
        </View>
        {this._displayLoading()}

          {this.displayUsers()}
               

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


}); 

const mapStateToProps = state => {
  return {
      user: state.setUser.user
  }
}

export default connect(mapStateToProps)(ListGlobaleChat)