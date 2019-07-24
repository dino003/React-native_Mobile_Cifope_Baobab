import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  FlatList,
  RefreshControl ,
  Button,
  ActivityIndicator,
  Linking,
  TouchableHighlight,
  Platform
  
} from 'react-native';
//import Image from 'react-native-image-progress';
//import ProgressBar from 'react-native-progress/Bar';
import ImageLoad from 'react-native-image-placeholder';
import moment from 'moment'
import API from '../components/api/serviceLocal'
import {connect} from 'react-redux'
import FadeIn from '../animations/FadeIn'
//import VoirDocPdf from './VoirDocumentPdf'



 class ListArticle extends Component {

  constructor(props) {
    super(props);
    this.page = 0
    this.totalPages = 0
    this.state = {
        loading: false,
        articles: [],
        refreshing: false,

    
    };
    

  }

  componentDidMount (){
      this.getArticles()
  }

  _onRefresh = async () => {
    this.setState({refreshing: true});

   await API.get('/index_article_visible')
    .then((responseJson) => {
        if(typeof responseJson.data === 'string'){
           data = responseJson.data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
           responseFinal = JSON.parse(data)
          // console.log( tb.user.name)
                let article_recus = responseFinal.data

                this.setState({
                   loading: false,
                   articles: article_recus,
                   refreshing: false

               })
        
        }else{
            this.setState({
                loading: false,
               // articles: responseJson.data.data,
                articles: responseJson.data.data,
                refreshing: false
                

            })
        }
     
    })
    .catch((error) => {
      console.error(error);
    });
  }

  getArticles = async () => {

      this.setState({loading: true})
    await API.get('/index_article_visible')
     .then((responseJson) => {
         if(typeof responseJson.data === 'string'){
            data = responseJson.data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
            responseFinal = JSON.parse(data)
           // console.log( tb.user.name)
                 let article_recus = responseFinal.data
                 this.setState({
                    loading: false,
                    articles: article_recus,
                })
         
         }else{
             this.setState({
                 loading: false,
                // articles: responseJson.data.data,
                 articles: responseJson.data.data,

             })
         }
      
     })
     .catch((error) => {
       console.error(error);
     });
  }

  _displayFloatingActionButton = () => {
    const user = this.props.user
    if (user !== undefined && user.admin && Platform.OS === 'android') { // Uniquement sur Android et lorsque le film est chargé
      return (
        <TouchableOpacity
          style={styles.share_touchable_floatingactionbutton}
          onPress={() => this.props.navigation.navigate("AjoutArticle")}>
          <Image
            style={styles.share_image}
            source={require('./images/add_cool.png')} />
        </TouchableOpacity>
      )
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

  montrerImage(image){
      if(image){
        return (
          //  <Image style={styles.cardImage} source={{uri: image}} />
            <ImageLoad
   // style={{ width: 320, height: 250 }}
   style={styles.cardImage}
   // loadingStyle={{ size: 'large', color: 'blue' }}
    source={{ uri: image }}
    placeholderSource={require('../components/images/icons8-pictures-folder-64.png')}  
    />
     
          )
      }
     
  } 

  voirDocumentPdf = (fichier) => {
    // console.log("film id = " + idFilm)
   // this.props.navigation.setParams({nom_seminaire: seminaire.id})
  
     this.props.navigation.navigate("VoirDocumentPdfCaumunaute", {fichier: fichier, nom_document: fichier.titre}) 
    }

  montrerFichier(item){
      if(item.lienTexte){
          if(item.nomFichier){
             fich = <Text numberOfLines={1} style={styles.socialBarLabel}>{item.nomFichier}</Text>

          }

        return (
            <TouchableOpacity style={styles.socialBarButton} onPress={() => this.voirDocumentPdf(item) } >
            <Image style={styles.icon} source={require('./images/new-file.png')}
            />
               {fich}
          </TouchableOpacity>
          )
      }
     
  }

  montrerLien = (lien) => {
    if(lien){
      return (
         <TouchableHighlight style={styles.timeContainer} onPress={() => this._lancerLien(lien)}>
        
         <Text style={[styles.time, {color: 'blue'}]}>
             {lien}
         </Text>
       </TouchableHighlight>
        )
    }
   
}



  _voirDetailArticle = (article) => {
    // console.log("film id = " + idFilm)
     this.props.navigation.navigate("Article", {article: article, titre: article.titre, prevRoute: this.props.navigation.state.routeName})
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

  _displayArticles(){
      const articles = this.state.articles
      if(articles.length > 0){

     
      return (
        <View style={styles.container}>

        <FlatList style={styles.list}
         
        
          data={articles}
          extraData={this.state}
         keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => {
            return (
              <View style={styles.separator}/>
            )
          }}
          renderItem={(post) => {
            const item = post.item;
            return (
              <FadeIn>
              <View style={styles.card}>
                  
                
                {this.montrerImage(item.lienDoc)}
                <TouchableOpacity style={styles.cardHeader} onPress={() => this._voirDetailArticle(item)}>
                  <View>
                    <Text numberOfLines={1} style={styles.title}>{item.titre}</Text>
                    <Text numberOfLines={5} style={styles.description}>{item.description}</Text>
                    {this.montrerLien(item.lienVideo)}
                    <View style={styles.timeContainer}>
                      <Image style={styles.iconData} source={require('./images/calendar.png')}
                     />
                      <Text style={styles.time}>
                       Dernière modification {moment(item.updated_at).format('DD/MM/YYYY__HH:mm:ss')}
                      </Text>
                      
                    </View>
                    <View style={styles.timeContainer}>
                     
                      <Text style={styles.time} numberOfLines={1}>
                       Article publié par {item.user.prenom} {item.user.name}
                      </Text>
                      
                    </View>
                  </View>
                </TouchableOpacity>
                <View style={styles.cardFooter}>
                  <View style={styles.socialBarContainer}>
                    <View style={styles.socialBarSection}>
                      {this.montrerFichier(item)}
                    </View>
                    <View style={styles.socialBarSection} >
                      <TouchableOpacity style={styles.socialBarButton} onPress={() => this._voirDetailArticle(item)} >
                        <Image style={styles.icon} source={require('./images/comments.png')}
                       />
                        {(item.affichecommentaires_count > 0) ? (
                                    <Text style={styles.socialBarLabel}>{item.affichecommentaires_count} Commentaires</Text>

                                ) : (
                                        <Text style={styles.socialBarLabel}>Aucun Commentaire</Text>

                                    )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              </FadeIn>

            )
          }}
         
         
          />
      </View>
      )
    }else if (articles.length <= 0 && !this.state.loading) {
        return (
            <View>
                <Text>Aucun Article publié</Text>
            </View>
        )
    }
  }

  render() {
   // console.log(this.props.navigation.state.routeName)
    return (
        <View style={styles.main_container}>
                  

            {this._displayLoading()}
            {this._displayArticles()}
        </View>
    );
  }
}

const styles = StyleSheet.create({
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
  },
    main_container: {
        flex:1
    },
  container:{
    flex:1,
    marginTop:20,
  },
  list: {
    paddingHorizontal: 17,
    backgroundColor:"#E6E6E6",
  },
  separator: {
    marginTop: 10,
  },
  /******** card **************/
  card:{
    shadowColor: '#00000021',
    shadowOffset: {
      width: 2
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    marginVertical: 8,
    backgroundColor:"white"
  },
  cardHeader: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  cardFooter:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
    backgroundColor:"#EEEEEE",
  },
  cardImage:{
    flex: 1,
    height: 300,
    width: null,
  },
  /******** card components **************/
  title:{
    fontSize:18,
    flex:1,
    color: 'blue'
  }, 
  description:{
    fontSize:15,
    color:"#888",
    flex:1,
    marginTop:5,
    marginBottom:5,
  },
  time:{
    fontSize:13,
    color: "#808080",
    marginTop: 5
  },
  icon: {
    width:25,
    height:25,
  },
  iconData:{
    width:15,
    height:15,
    marginTop:5,
    marginRight:5
  },
  timeContainer:{
    flexDirection:'row'
  },
  /******** social bar ******************/
  socialBarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1
  },
  socialBarSection: {
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  socialBarlabel: {
    marginLeft: 8,
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  socialBarButton:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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

  loading_containera: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',

},
}); 

const mapStateToProps = state => {
  return {
      user: state.setUser.user
  }
}

export default connect(mapStateToProps)(ListArticle)