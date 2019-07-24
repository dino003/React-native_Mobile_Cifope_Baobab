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
import API from '../api/serviceLocal'
import {connect} from 'react-redux'





 class GestionArticles extends Component {

  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
};

  constructor(props) {
    super(props);
    this.page = 0
    this.totalPages = 0
    this.state = {
        loading: false,
        articles: [],
        loadingLoad: false,
    
    };
    

  }

  componentDidMount (){
      this.getArticles()
  }

  getArticles = async () => {
    let nextPage = this.page+1
      this.setState({loading: true})
    await API.get('/index_article_admin?page=' + nextPage)
     .then((responseJson) => {
         if(typeof responseJson.data === 'string'){
            data = responseJson.data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
            responseFinal = JSON.parse(data)
           // console.log( tb.user.name)
                 let article_recus = responseFinal.data
                 this.page = responseFinal.current_page

                 this.totalPages = responseFinal.last_page
                 //console.log(this.page, this.totalPages)

                 this.setState({
                    loading: false,
                   // articles: article_recus,
                    articles: [...this.state.articles, ...article_recus],

                })
         
         }else{
          this.page = responseJson.current_page
          this.totalPages = responseJson.last_page
             this.setState({
                 loading: false,
                // articles: responseJson.data.data,
                 articles: [...this.state.articles, ...responseJson.data.data],

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
            source={require('../images/plus24.png')} />
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
    resizeMode='contain'
    placeholderSource={require('../images/icons8-pictures-folder-64.png')}  
    />
     
          )
      }
     
  }

  montrerFichier(fichier, nom){
      if(fichier){
          if(nom){
             fich = <Text numberOfLines={1} style={styles.socialBarLabel}>{nom}</Text>

          }

        return (
            <TouchableOpacity style={styles.socialBarButton} onPress={() => this.props.navigation.navigate("Commentaire") } >
            <Image style={styles.icon} source={require('../images/new-file.png')}
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
     this.props.navigation.navigate("Article", {article: article, titre: article.titre})
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



 changeStatus = item => {
    item.active = !item.active
    this.setState({});
    API.get('changer_status_article/' + item.id)
  }

  confirmationSuppression = (item, index) => {
    Alert.alert(
      '! Confirmation',
      'Vraiment supprimer cet article ?',
      [
       // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
        {
          text: 'Annuler',
          onPress: () => {},
          style: 'cancel',
        },
        {text: 'Oui', onPress: () => {
          this.state.articles.splice(index, 1)
          // item.active = !item.active
           this.setState({});
           API.get('suprimer_article/' + item.id)
        }},
      ],
      {cancelable: false},
    );
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

        
          renderItem={(post, index) => {
            const item = post.item;
            return (
              <View style={styles.card}>
                  
                
                {this.montrerImage(item.lienDoc)}
                <TouchableOpacity style={styles.cardHeader} onPress={() => this._voirDetailArticle(item)}>
                  <View>
                    <Text numberOfLines={1} style={styles.title}>{item.titre}</Text>
                    <Text numberOfLines={5} style={styles.description}>{item.description}</Text>
                    {this.montrerLien(item.lienVideo)}
                    <View style={styles.timeContainer}>
                      <Image style={styles.iconData} source={require('../images/calendar.png')}
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
                      {this.montrerFichier(item.lienTexte, item.nomFichier)}
                    </View>
                    <View style={styles.socialBarSection} >
                      <TouchableOpacity style={styles.socialBarButton} onPress={() => this._voirDetailArticle(item.id)} >
                        <Image style={styles.icon} source={require('../images/comments.png')}
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

                <View style={styles.cardFooter} >
                <View style={styles.socialBarContainer}>
                { 
                              (item.active) ? (
                                <View style={styles.socialBarSection} >

                                <TouchableOpacity style={styles.socialBarButtona} onPress={() => this.changeStatus(item)} >

                                <Image style={styles.icon} source={require('../images/favoN.png')}
                                />
                               <Text style={styles.socialBarLabel}> publié</Text>

                                 </TouchableOpacity>

                                 </View>


                              ) : (
                                <View style={styles.socialBarSection} >

                                
                                <TouchableOpacity style={styles.socialBarButtona} onPress={() => this.changeStatus(item)} >

                                <Image style={styles.icon} source={require('../images/favo.png')}
                                />
                                 <Text style={styles.socialBarLabel}> non publié</Text> 

                                 </TouchableOpacity>

                                 </View>

                              )
                          }
                         <View style={styles.socialBarSection} >

                      <TouchableOpacity style={styles.socialBarButtono} onPress={() => this.confirmationSuppression(item, index)} >

                      <Image style={styles.icon} source={require('../images/supp.png')}
                      />
                      </TouchableOpacity>
                      </View>
                  
                   </View>


                         
                       
                    </View>
              </View>
            )
          }}

          onEndReachedThreshold={0.01}
          onEndReached={() => {
            if ( this.page < this.totalPages) {
              // On appelle la méthode loadFilm du component Search pour charger plus de films
              this.getArticles()
            }
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
    return (
        <View style={styles.main_container}>
                  

            {this._displayLoading()}
            {this._displayArticles()}
            {this._displayFloatingActionButton()}
        </View>
    );
  }
}

const styles = StyleSheet.create({

  loading_containera: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 100,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  
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
    height: 150,
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

  socialBarButtona:{
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  socialBarButtono:{
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
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
}); 

const mapStateToProps = state => {
  return {
      user: state.setUser.user
  }
}

export default connect(mapStateToProps)(GestionArticles)