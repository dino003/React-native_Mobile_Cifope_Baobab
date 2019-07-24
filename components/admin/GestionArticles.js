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
  RefreshControl,
  ActivityIndicator,
  Linking,
  TouchableHighlight,
  Platform

} from 'react-native';
//import Image from 'react-native-image-progress';
//import ProgressBar from 'react-native-progress/Bar';
import API from '../api/serviceLocal'
import { connect } from 'react-redux'
import ArticleItem from './ArticleItem'
import { Button } from 'react-native-elements'





class GestionArticles extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('articles', 'Liste des articles'),
      
    };
  };

  constructor(props) {
    super(props);
    this.page = 0
    this.totalPages = 0
    this.state = {
      loading: false,
      filter : 'all',
      articles: [],
      loadingLoad: false,
      refreshing: false,


    };


  }

  componentDidMount() {
    this.getArticles()
  }


  _totalArticlesPublies = () => this.state.articles.filter(article => article.active).length  


  _totalArticlesNonPublies = () => this.state.articles.filter(article => !article.active).length 

  _articlesFiltres = () => {
    if(this.state.filter === 'publie'){
      return this.state.articles.filter(article => article.active)
    }else if(this.state.filter === 'non_publie'){
      return this.state.articles.filter(article => !article.active)

    }else{
      return this.state.articles
    }
  }

  /*
  _getButtonStyle = () => {
    const filter = this.state.filter
   if(filter === 'all'){
     let type = 'clear'
   }

   this.state.filter = 'all' ? 'clear' : this.state.filter = 'pu'
  }
  */

 _onRefresh = async () => {
  this.setState({refreshing: true});

 await API.get('/index_article_admin')
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
    this.setState({ loading: true })
    await API.get('/index_article_admin')
      .then((responseJson) => {
        if (typeof responseJson.data === 'string') {
          data = responseJson.data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
          responseFinal = JSON.parse(data)
          // console.log( tb.user.name)
          let article_recus = responseFinal.data
          this.setState({
            loading: false,
            // articles: article_recus,
            articles: article_recus,

          })

        } else {
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






  _voirDetailArticle = (article) => {
    // console.log("film id = " + idFilm)
    this.props.navigation.navigate("Article", { article: article, titre: article.titre, prevRoute: this.props.navigation.state.routeName })
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



  changeStatus = id => {

    this.setState({
      articles: this.state.articles.map(item => {
        if (item.id === id) {
          item.active = !item.active
        }
        return item;
      })
    })
    API.get('changer_status_article/' + id)
  }

  onDeleArticle = (item) => {
    Alert.alert(
      '! Confirmation',
      'Vraiment supprimer cet article ?',
      [
        // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
        {
          text: 'Annuler',
          onPress: () => { },
          style: 'cancel',
        },
        {
          text: 'Oui', onPress: () => {
            this.setState({ articles: [...this.state.articles.filter(article => article.id !== item.id)] })
            API.get('suprimer_article/' + item.id)
          }
        },
      ],
      { cancelable: false },
    );
  }

  montrerImage(article) {
    if (article.lienDoc) {
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

  _renderItem = ({ item }) => (
    <ArticleItem
      item={item}
      voirDetailArticle={this._voirDetailArticle}
      changeStatus={this.changeStatus}
      onDeleArticle={this.onDeleArticle}
      voirDocumentPdf={this.voirDocumentPdf}

    />
  )





  _displayArticles = () => {
    //const articles = this.state.articles
    const articles = this._articlesFiltres()
    if (articles.length > 0) {


      return (
        <View style={styles.container}>

          <FlatList style={styles.list}
            data={articles}
            extraData={this.state}
            keyExtractor={(article) => article.id.toString()}
            ItemSeparatorComponent={() => {
              return (
                <View style={styles.separator} />
              )
            }}


            renderItem={this._renderItem}

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
    } else if (articles.length <= 0 && !this.state.loading) {
      return (
        <View>
          <Text>Aucun Article publié</Text>
        </View>
      )
    }
  }

  showPublie = () => {
   // this.filter = 'publie'
    this.setState({filter: 'publie'})
   // console.log(this.filter)

  }

  showNonPublie = () => {
    this.setState({filter: 'non_publie'})
  }

  showTous = () => {
   // this.filter = 'all'
    this.setState({filter: 'all'})

  }

  voirDocumentPdf = (article) => {
    // console.log("film id = " + idFilm)
   // this.props.navigation.setParams({nom_seminaire: seminaire.id})
  
     this.props.navigation.navigate("VoirDocumentPdfCaumunaute", {fichier: article, nom_document: article.titre})
  }



  render() {

    return (
      <View style={styles.main_container}>

        <View style={{ flexDirection: 'row' }}>
          <Button
            title="Tous      "
            type="outline"
            onPress={this.showTous}

          />

          <Button
            title="Articles publiés"
            type="outline"
            onPress={this.showPublie}

          />

            <Button
            title="Articles non publiés"
            type="outline"
            onPress={this.showNonPublie}

          />
        </View>


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
    flex: 1
  },
  container: {
    flex: 1,
    marginTop: 20,
  },
  list: {
    paddingHorizontal: 17,
    backgroundColor: "#E6E6E6",
  },
  separator: {
    marginTop: 10,
  },
  /******** card **************/
  card: {
    shadowColor: '#00000021',
    shadowOffset: {
      width: 2
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    marginVertical: 8,
    backgroundColor: "white"
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
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
    backgroundColor: "#EEEEEE",
  },
  cardImage: {
    flex: 1,
    height: 150,
    width: null,
  },
  /******** card components **************/
  title: {
    fontSize: 18,
    flex: 1,
    color: 'blue'

  },
  description: {
    fontSize: 15,
    color: "#888",
    flex: 1,
    marginTop: 5,
    marginBottom: 5,
  },
  time: {
    fontSize: 13,
    color: "#808080",
    marginTop: 5
  },
  icon: {
    width: 25,
    height: 25,
  },
  iconData: {
    width: 15,
    height: 15,
    marginTop: 5,
    marginRight: 5
  },
  timeContainer: {
    flexDirection: 'row'
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
  socialBarButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  socialBarButtona: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  socialBarButtono: {
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