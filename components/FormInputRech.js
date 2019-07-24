import React, { Component } from 'react'
import {
    TouchableOpacity,
    StyleSheet,
  
    TouchableHighlight,
    ActivityIndicator
  } from 'react-native';
  import { Image} from 'react-native-elements'

export default class FormInputRech extends Component {
    render() {
        return (
           
                (!this.props.isLoading) ? 
               ( <TouchableOpacity style={styles.saveButton} onPress={() => this.props.ajouterCommentaire()}>
               <Image style={[styles.icon, styles.iconBtnSearch]} source={require('./images/filled-sent.png')}/>
             </TouchableOpacity>
             ) : (<TouchableHighlight style={styles.saveButton} >
               <ActivityIndicator />
             </TouchableHighlight>)
           
   
              
        )
    }
}


const styles = StyleSheet.create({
  
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
   
  
  
  }); 
