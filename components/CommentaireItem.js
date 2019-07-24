import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import moment from 'moment'
import { Image} from 'react-native-elements'
import FadeIn from '../animations/FadeIn'

export default class CommentaireItem extends Component {

    
    render() {
        return (
            <FadeIn>
            <View style={styles.containera}>
              <TouchableOpacity onPress={() => {}}>
                <Image style={styles.image} PlaceholderContent={<ActivityIndicator />} resizeMode='contain' source={{uri: this.props.commentaire.user.url_photo + this.props.commentaire.user.photo}}/>
              </TouchableOpacity>
              <View style={styles.content}>
                <View style={styles.contentHeader}>
                  {(this.props.user.id !== this.props.commentaire.user.id) ? (
                    <Text numberOfLines={1}  style={styles.name}>{this.props.commentaire.user.prenom} {this.props.commentaire.user.name}</Text>

                  ) : (
                    <Text numberOfLines={1}  style={styles.name}>Moi</Text>

                  )}
                  <Text style={styles.time}>
                    {moment(this.props.commentaire.created_at).format('DD/MM/YYYY__HH:mm:ss')}
                  </Text>
                </View>
                <Text rkType='primary3 mediumLine'>{this.props.commentaire.commentaire}</Text>

              </View>
            </View>
            </FadeIn>
        )
    }
}


const styles = StyleSheet.create({

    icon:{
      width:30,
      height:30,
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

    content: {
      marginLeft: 16,
      flex: 1,
    },
    contentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6
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
  

