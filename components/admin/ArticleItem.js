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
  import moment from 'moment';
  import FadeIn from '../../animations/FadeIn'


class ArticleItem extends Component {

montrerFichier(item){
    if(item.lienTexte){
        if(item.nomFichier){
           fich = <Text numberOfLines={1} style={styles.socialBarLabel}>{item.nomFichier}</Text>

        }

      return (
          <TouchableOpacity style={styles.socialBarButton} onPress={this.props.voirDocumentPdf.bind(this, item)} >
          <Image style={styles.icon} source={require('../images/new-file.png')}
          />
             {fich}
        </TouchableOpacity>
        )
    }
   
}

voirDocumentPdf = (article) => {
  // console.log("film id = " + idFilm)
 // this.props.navigation.setParams({nom_seminaire: seminaire.id})

   this.props.voirDocumentPdf.bind(this, article)
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
    render() {
        const item = this.props.item
        return (
          <FadeIn>
            <View style={styles.card}>


                {(item.lienDoc) ? (
                           <Image
                           // style={{ width: 320, height: 250 }}
                           style={styles.cardImage}
                           // loadingStyle={{ size: 'large', color: 'blue' }}
                            source={{ uri: item.lienDoc }}
                            resizeMode='contain'
                            />
                ): null}

                <TouchableOpacity style={styles.cardHeader} onPress={ this.props.voirDetailArticle.bind(this, item)}>
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
                            {this.montrerFichier(item)}
                        </View>
                        <View style={styles.socialBarSection} >
                            <TouchableOpacity style={styles.socialBarButton}  >
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

                                    <TouchableOpacity style={styles.socialBarButtona} onPress={this.props.changeStatus.bind(this, item.id)} >

                                        <Image style={styles.icon} source={require('../images/favoN.png')}
                                        />
                                        <Text style={styles.socialBarLabel}> publié</Text>

                                    </TouchableOpacity>

                                </View>


                            ) : (
                                    <View style={styles.socialBarSection} >


                                        <TouchableOpacity style={styles.socialBarButtona} onPress={this.props.changeStatus.bind(this, item.id)} >

                                            <Image style={styles.icon} source={require('../images/favo.png')}
                                            />
                                            <Text style={styles.socialBarLabel}> non publié</Text>

                                        </TouchableOpacity>

                                    </View>

                                )
                        }
                        <View style={styles.socialBarSection} >

                            <TouchableOpacity style={styles.socialBarButtono} onPress={this.props.onDeleArticle.bind(this, item)} >

                                <Image style={styles.icon} source={require('../images/supp.png')}
                                />
                            </TouchableOpacity>
                        </View>

                    </View>




                </View>
            </View>
            </FadeIn>
        );
    }
}


const styles = StyleSheet.create({

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
  
  }); 

export default ArticleItem;