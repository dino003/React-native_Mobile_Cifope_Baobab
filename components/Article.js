import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
  Dimensions,
  TouchableHighlight,
  Share
} from 'react-native';
import moment from 'moment'
import API from '../components/api/service'
import {Icon, Image} from 'react-native-elements'
import {connect} from 'react-redux'




 class Article extends Component {


  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('titre', 'Page des Commentaires'),
      /*
      headerLeft: (
        <TouchableOpacity style={{marginLeft: 15}} onPress={() => navigation.navigate(navigation.state.params.prevRoute)}
        >
           <Image
           source={require('./images/arr3.png')}
        />
        </TouchableOpacity>
       
      ),
      */
      
    };
  };
  
  constructor(props){
    super(props)

    this.state = {
      article: undefined,
      loading: false
    }
  }

  componentDidMount(){
   // this._get_article()
  }

  _get_article = async () => {
    this.setState({loading: true})
    await API.get('/voir_article/' + this.props.navigation.state.params.idArticle)
     .then((responseJson) => {
         if(typeof responseJson.data === 'string'){
            data = responseJson.data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
            responseFinal = JSON.parse(data)
           // console.log( tb.user.name)
                 let article_recu = responseFinal
                 this.setState({
                    loading: false,
                    article: article_recu
                })
         
         }else{
             this.setState({
                 loading: false,
                 article: responseJson.data
             })

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
          <ActivityIndicator style={styles.loading_container} size='large' />
      )
    }
  }

  _voirLesCommentaires = (ArticlePourCommentaire) => {
    // console.log("film id = " + idFilm)
     this.props.navigation.navigate("Commentaire", {idArticlePourCommentaire: ArticlePourCommentaire.id, titre_article: ArticlePourCommentaire.titre})
 }

  _displayCommentaireButton(){
    const article = this.props.navigation.state.params.article
    if(article !== undefined ){
      return (
        <TouchableOpacity
        style={styles.share_touchable_floatingactionbutton}
        onPress={() => this._voirLesCommentaires(article) }
        >
        <Image
          style={styles.share_image}
          source={require('./images/comment24.png')} />
      </TouchableOpacity>
      )
    }
   
  }

  montrerFichier(fichier, nom){
    if(fichier){
        if(nom){
           fich = <Text numberOfLines={1} style={styles.socialBarLabel}>{nom}</Text>

        }

      return (
          <TouchableOpacity style={styles.socialBarButton} onPress={() => this.props.navigation.navigate("Commentaire")} >
          <Image PlaceholderContent={<ActivityIndicator />} style={styles.icon} source={require('./images/new-file.png')}
          />
             {fich}
        </TouchableOpacity>
        )
    }
   
}

montrerLien = (lien) => {
  if(lien){
    return (
       <TouchableHighlight onPress={() => this._lancerLien(lien)}>
      
          <Text style={styles.tags}> {lien}</Text>
     </TouchableHighlight>
      )
  }
 
}

montrerImage(image){
  if(image){
    return (
      <View>
   
    <Image style={{width:200, height:200}}
      source={{ uri: image }}
      resizeMode='contain'

      />
    </View>
 
      )
  }
 
}

_lancerLien = (url) => {
  Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log('Don\'t know how to open URI: ' + url);
      }
    });
}

_partagerArticle(){
  const article = this.props.navigation.state.params.article

  Share.share({
    title: article.titre,
    message: article.description
  })
}

  _displayArticle(){
    const article = this.props.navigation.state.params.article

    if(article !== undefined){
      return (
        <ScrollView>
        <View style={styles.container}>

  
          <View style={styles.postContent}>
              <Text style={styles.postTitle}>
                {article.titre}
              </Text>

  
              <Text style={styles.postDescription}>
                {article.description}
              </Text>
  
             
              {this.montrerLien(article.lienVideo)}
  
              <Text style={styles.date}>
              Dernière modification le {moment(article.updated_at).format('DD/MM/YYYY__HH:mm:ss')}
              </Text>
  
            
                {(this.props.user.id !== article.user.id) ? (
                    <View style={styles.profile}>
                    <Image style={styles.avatar}
                    PlaceholderContent={<ActivityIndicator />}
                      source={{uri: article.user.url_photo + article.user.photo}}/>
      
                    <Text style={styles.name} numberOfLines={1}>
                        {article.user.prenom}
                    </Text>
                  </View>
                ) : null}

              <TouchableOpacity style={styles.shareButton} onPress={() => this._partagerArticle()} >
                <Text style={styles.shareButtonText}>Partager</Text>  
              </TouchableOpacity> 

          </View>
        </View>
      </ScrollView>
      )
    }
   
  }

  render() {
  //  console.log(this.props.navigation.state)
    return (
     <View style={styles.main_container}>
        {this._displayLoading()}
        {this._displayArticle()} 
        {this._displayCommentaireButton()}
     </View>
    );
  }
}

const styles = StyleSheet.create({
 
  container:{
    flex:1,
  },
  header:{
    padding:30,
    alignItems: 'center',
    backgroundColor: "#00BFFF",
  },
  headerTitle:{
    fontSize:30,
    color:"#FFFFFF",
    marginTop:10,
  },
  name:{
    fontSize:22,
    color:"#FFFFFF",
    fontWeight:'600',
  },
  postContent: {
    flex: 1,
    padding:30,
  },
  postTitle:{
    fontSize:26,
    fontWeight:'600',
  },
  postDescription:{
    fontSize:16,
    marginTop:10,
  },
  tags:{
    color: '#00BFFF',
    marginTop:10,
  },
  date:{
    color: '#696969',
    marginTop:10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "#00BFFF",
  },
  profile:{
    flexDirection: 'row',
    marginTop:20
  },
  name:{
    fontSize:22,
    color:"#00BFFF",
    fontWeight:'600',
    alignSelf:'center',
    marginLeft:10
  }, 
  shareButton: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:30,
    backgroundColor: "#00BFFF",
  },
  shareButtonText:{
    color: "#FFFFFF",
    fontSize:20,
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
main_container: {
  flex:1
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

export default connect(mapStateToProps)(Article)
  