
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
 
} from 'react-native';
import {Image, Avatar, Badge, Icon} from 'react-native-elements'
import FadeIn from '../../animations/FadeIn'



export default class MyListItem extends Component {
  
    render() {

        const user = this.props.user
      return (
        <FadeIn>

            <View style={styles.containera}>
  
            <TouchableOpacity onPress={this.props.onChangeStatus.bind(this, user.id)}>
              <Avatar style={styles.image}
               resizeMode='contain' 
               rounded
               title={user.prenom[0] + user.name[0]}
              source={{uri: user.url_photo + user.photo}}
              />
                {
                  (user.active) ? (
                    <Badge
              
                    status="primary"
                    containerStyle={{ position: 'absolute', top: -4, right: -4 }}
                  />
                  ) : (
                    <Badge
              
                    status="error"
                    containerStyle={{ position: 'absolute', top: -4, right: -4 }}
                  />
                  )
                }
             
            </TouchableOpacity >
  
            <View style={styles.content} >
              <TouchableOpacity onPress={this.props.onShowUser.bind(this, user)}  style={styles.contentHeader}>
                <Text numberOfLines={1}  style={styles.name}>{user.prenom} {user.name}</Text>

              
              </TouchableOpacity >
              <Text numberOfLines={1}  style={{color: 'green'}}>{user.email} </Text>

             
  
            </View>
            <TouchableOpacity style={{alignItems: 'flex-end'}} onPress={this.props.onDeleteUser.bind(this, user )}>
              <Image style={[styles.icona, { }]} source={require('../images/supp.png')}/>
  
              </TouchableOpacity>
  
            </View>
            </FadeIn>

      );
    }
  }

  
const styles = StyleSheet.create({
 
    icona:{
      width:20,
      height:20,
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
  
  
  
  }); 