import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Button,
  RefreshControl,

  TouchableHighlight,
  Alert,
  TextInput,
  FlatList,
  ActivityIndicator
} from 'react-native';
import API from '../components/api/serviceLocal'
import {connect} from 'react-redux'
import Toast, {DURATION} from 'react-native-easy-toast'
import { Image} from 'react-native-elements'
import CommentaireItem from './CommentaireItem'
import BtnSend from './FormInputRech'


 class Commentaire extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('titre_article', 'Page des Commentaires'),
      /*
      headerLeft: (
        <TouchableOpacity style={{marginLeft: 15}} onPress={() => alert('This is a button!')}
        >
           <Image
           source={require('./images/arr3.png')}
        />
        </TouchableOpacity>
       
      ),
      */
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      commentaires: [],
      loading: false,
      isLoading: false,
      commentaire: '',
      refreshing: false,

    }

    //this.commentaire = ''
  }

 
  componentDidMount(){
    this.getCommentaires()
    /*
    this.interval = setInterval(() => {
        this.getCommentairesRecharge()         
    }, 3000);
    */
  }
/*
  componentWillUnmount() {
   // clearInterval(this.interval);
  }
  */

  _commentaireTextChange(text){
    this.commentaire = text
  }

  _onRefresh = async () => {
    this.setState({refreshing: true}); 

    await API.get('/get_commentaire_by_article/' + this.props.navigation.state.params.idArticlePourCommentaire)
    .then((responseJson) => {
        if(typeof responseJson.data === 'string'){
           data = responseJson.data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
           responseFinal = JSON.parse(data)
          // console.log( tb.user.name)
          console.log(typeof responseFinal)
                let article_recus = responseFinal
                this.setState({
                  refreshing: false,
                   commentaires: article_recus
               })
        
        }else{
            this.setState({
              refreshing: false,
                commentaires: responseJson.data
            })
 
        }
     
    })
    .catch((error) => {
      console.error(error);
    });
  }

  getCommentaires = async () => {
    this.setState({loading: true})
  await API.get('/get_commentaire_by_article/' + this.props.navigation.state.params.idArticlePourCommentaire)
   .then((responseJson) => {
       if(typeof responseJson.data === 'string'){
          data = responseJson.data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
          responseFinal = JSON.parse(data)
         // console.log( tb.user.name)
         console.log(typeof responseFinal)
               let article_recus = responseFinal
               this.setState({
                  loading: false,
                  commentaires: article_recus
              })
       
       }else{
           this.setState({
               loading: false,
               commentaires: responseJson.data
           })

       }
    
   })
   .catch((error) => {
     console.error(error);
   });
}

getCommentairesRecharge = async () => {
await API.get('/get_commentaire_by_article/' + this.props.navigation.state.params.idArticlePourCommentaire)
 .then((responseJson) => {
     if(typeof responseJson.data === 'string'){
        data = responseJson.data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
        responseFinal = JSON.parse(data)
             let article_recus = responseFinal
             this.setState({
                loading: false,
                commentaires: article_recus
            })
     
     }else{
         this.setState({
             loading: false,
             commentaires: responseJson.data
         })

     }
  
 })
 .catch((error) => {
   console.error(error);
 });
}

  _ajouterCommentaire = async () => {
   // console.log(this.commentaire)
    if(this.state.commentaire.length > 0){
       this.setState({isLoading: true})
    await API.post('/ajouter_commentaire', {
      commentaire: this.state.commentaire,
      user_id: this.props.user.id,
      affiche_id: this.props.navigation.state.params.idArticlePourCommentaire
    })
     .then((responseJson) => {
         if(typeof responseJson.data === 'string'){
            data = responseJson.data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
            responseFinal = JSON.parse(data)
                 let article_recus = responseFinal
                this.setState(() => ({
                  commentaires: [
                    article_recus, 
                    ...this.state.commentaires
                  ],
                  isLoading: false
                }))
                
         
         }else{
             this.setState({
                 isLoading: false,
                 commentaires: responseJson.data
             })
  
         }
      
     }).then( () => {
       this.textInput.clear()
       this.refs.toast.show('Commentaire ajouté', 1000, () => {
        // something you want to do at close
       });
      })
     .catch((error) => {
       console.error(error);
     });
    }else{
      alert('Veuillez saisir du texte pour ensuite le poster')
    }
   
  }

_displayLoading() {
  if (this.state.loading) {
    // Si isLoading vaut true, on affiche le chargement à l'écran
    return (
        <ActivityIndicator style={styles.loading_container} size='large' />
    )
  }
}

_displaySendButton = () => {
  //const {comment} = this.props.commentaire
  if( !this.state.isLoading){
    return (
      <TouchableHighlight style={styles.saveButton} onPress={() => this._ajouterCommentaire()}>
      <Image style={[styles.icon, styles.iconBtnSearch]} source={require('./images/filled-sent.png')}/>
    </TouchableHighlight>
    )
  }
}

_displaySWaitButton = () => {
  //const {comment} = this.props.commentaire
  if(this.state.commentaire.length > 1 && this.state.isLoading){
    return (
      <TouchableHighlight style={styles.saveButton} >
      <ActivityIndicator />
    </TouchableHighlight>
    )
   
  }
}

_renderItem = ({ item }) => (
  <CommentaireItem
  commentaire={item}
  user={this.props.user}
   // changeStatus={this.changeStatus}
   // onDeleArticle={this.onDeleArticle}
   // voirDocumentPdf={this.voirDocumentPdf}

  />
)

  displayCommentaires(){
    const commentaires = this.state.commentaires
    if(commentaires.length > 0){
      return (
        <FlatList
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          
        
        style={styles.root}
        data={commentaires}
        extraData={this.state}
        ItemSeparatorComponent={() => {
          return (
            <View style={styles.separator}/>
          )
        }}
        keyExtractor={(item)=>{
          return item.id.toString();
        }}

        renderItem={this._renderItem}

      />
      )
    }else if (commentaires.length <= 0 && !this.state.loading) {
      return (
          <View>
              <Text>Aucun commentaire pour l'instant; merci de poster le premier commentaire</Text>
          </View>
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
                placeholder="Ecrivez votre commentaire ici ..."
                underlineColorAndroid='transparent'
                multiline={true}
                editable = {true}
                onChangeText={(commentaire) => this.setState({commentaire})}

                />
          </View>

          <BtnSend isLoading={this.state.isLoading} ajouterCommentaire={this._ajouterCommentaire} />  
          
        </View>
        {this._displayLoading()}

          {this.displayCommentaires()}
                 <Toast
                    ref="toast"
                    style={{backgroundColor:'#40E0D0'}}
                    position='top'
  
                />

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
    marginTop: -30
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

export default connect(mapStateToProps)(Commentaire)