
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TouchableHighlight,
  Alert,
  TextInput,
  Platform,
  FlatList,
  ActivityIndicator
} from 'react-native';
import API2 from '../api/serviceLocal'
import {Image} from 'react-native-elements'
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast, {DURATION} from 'react-native-easy-toast'
import FadeIn from '../../animations/FadeIn'





class MyListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    const textColor = this.props.selected ? 'orange' : null;
    return (
      <FadeIn>
          <View style={[styles.containera, {backgroundColor: textColor}]}>

          <TouchableOpacity onPress={this._onPress}  style={styles.content}>
              
              <View >
            <Text style={styles.name}>{this.props.seminaire.code_seminaire}</Text>
        <View>
          <View style={styles.contentHeader}>
            <Text numberOfLines={2} style={styles.name}>{this.props.seminaire.nom_seminaire}</Text>
          </View>
         
        </View>
      </View>
            </TouchableOpacity>

              {
                (this.props.selected) ? (
                  <TouchableHighlight
                  style={{
                      backgroundColor: this.props.selected ? 'black' : '#ecf0f1',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 20,
                      width: 20,
                      borderRadius: 20
                  }}
                   >
                     <Icon name='check'
                      size={20}
                      color='#fff'
                      />
                      
                    
                 
              </TouchableHighlight>
                ) : (
                  <TouchableHighlight
                  style={{
                      backgroundColor: this.props.selected ? 'black' : '#ecf0f1',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 1,
                      width: 1,
                      borderRadius: 1
                  }}
                   >
                    
                       <Icon name='check'
                      size={1}
                      />
                    
                    
                 
              </TouchableHighlight>
                )
              }

         


          </View>
          </FadeIn>
    );
  }
}


 class Affectations extends React.PureComponent  {

   

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('nom_domaine', 'Gestion des affectations'),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      seminaires: [],
      loading: false,
      term : '',
      isLoading: false,
      selectedFruits: [],
      isSubmit: false,
      publie: false,
      selected: (new Map(): Map<string, boolean>),
      message: undefined    

    }

  }

  componentDidMount (){
    this.getSeminaireByDomaine()
  }

  _onPressItem = (id: string) => {
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
     // console.log({selected})

      return {selected};
    });

    let objeSelectionne = this.state.seminaires.find(x => x.id === id)
    let isObjetInArray = this.state.selectedFruits.includes(objeSelectionne);
    if(isObjetInArray) {
         var index = this.state.selectedFruits.indexOf(objeSelectionne);
        if (index > -1) {
          this.state.selectedFruits.splice(index, 1);
        }
    }else{
      this.state.selectedFruits.push(objeSelectionne)
    }

    
  };

  

  _renderItem = ({item}) => (
    <MyListItem
      id={item.id}
      onPressItem={this._onPressItem}
      selected={!!this.state.selected.get(item.id)}
      seminaire={item}
    />
  );
    
 
  

  onSelectionsChange = (selectedFruits) => {
    // selectedFruits is array of { label, value }
    this.setState({ selectedFruits })
  }

  _elementVide = () => {
    if(!this.state.isLoading && this.state.isSubmit && this.state.term.length > 0 && this.state.users.length == 0){
      return (
        <View style={{flex: 1}}>
          <Text style={{textAlign: 'center'}}>Aucun utilisateur trouvé dans cette recherche</Text>
        </View>
      )
    }
  }

  getSeminaireByDomaine = async () => {
      this.setState({loading: true})
      await API2.get('/get_seminaires_by_domaine/' + this.props.navigation.state.params.domaine.id)
       .then((responseJson) => {
           if(typeof responseJson.data === 'string'){
              data = responseJson.data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
              responseFinal = JSON.parse(data)
                   let article_recus = responseFinal
                  // console.log(article_recus)
                   this.setState({
                      loading: false,
                      seminaires: article_recus
                  })
           
           }else{
               this.setState({
                   loading: false,
                   seminaires: responseJson.data
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
      <View style={{flex: 1}}>
        <ActivityIndicator style={styles.loading_container} size='large' />

      </View>
    )
  }
}



  displaySeminaires(){
    const seminaires = this.state.seminaires

 

    if(seminaires.length > 0){
      
      return (

        <FlatList
        style={styles.root}

        data={seminaires}
        extraData={this.state}
        ItemSeparatorComponent={() => {
          return (
            <View style={styles.separator}/>
          )
        }}
        keyExtractor={(item, index)=>{
          return item.id.toString();
        }}       
         renderItem={this._renderItem}
      />
      )
    }
  
  }

  _allerAuDomaine = () => {
    const utilisateurs = this.state.selectedFruits
  // console.log("film id = " + idFilm)
 // this.props.navigation.setParams({nom_seminaire: seminaire.id})

   this.props.navigation.navigate("AffecDomaine", {utilisateur_a_affecter: utilisateurs})
}

_affecterLesUtilisateurs = async () => {
    this.setState({loading: true})

  // console.log(this.props.navigation.state.params.utilisateursAff[0])
  var tabUsers = []
  var tabSeminaires = []
   this.props.navigation.state.params.utilisateursAff.forEach(element => {
       //console.log(element)
       tabUsers.push(element.id)
   });

   this.state.selectedFruits.forEach(element => {
    //console.log(element)
    tabSeminaires.push(element.id)
});


  // console.log(this.state.selectedFruits)

   //console.log(tabUsers)
    // console.log('utilisateurs:' + typeof( this.props.navigation.state.params.utilisateursAff) + '=> seminaires:'  + this.state.selectedFruits)

    await API2.post('/affectation_utilisateur', {
        seminaires: tabSeminaires,
        users: tabUsers
    })
     .then((responseJson) => {
         if(typeof responseJson.data === 'string'){
            data = responseJson.data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
            responseFinal = JSON.parse(data)
                 this.setState({
                    loading: false,
                    message: responseFinal

                })

                this.refs.toast.show(this.state.message.success, 2000, () => {
                    this.props.navigation.navigate("GestionDesAffectations")
                });
         
         }else{
             this.setState({
                 loading: false,
             })

             this.refs.toast.show(this.state.message.success, 2000, () => {
                this.props.navigation.navigate("GestionDesAffectations")
            });


         }
      
     })
     .catch((error) => {
       console.error(error);
     }); 
  
}

  _displayFloatingActionButton = () => {
    const user = this.props.user
    if (user !== undefined && user.admin && this.state.selectedFruits.length > 0 && Platform.OS === 'android') { // Uniquement sur Android et lorsque le film est chargé
      return (
        <TouchableOpacity
          style={styles.share_touchable_floatingactionbutton}
          onPress={() => this._affecterLesUtilisateurs()}>
          <Image
            style={styles.share_image}
            source={require('../images/filled-sent.png')}
            
             />
          
        </TouchableOpacity>
      )
    }
}

_displaySendButton = () => {
  //const {comment} = this.props.commentaire
  if( !this.state.isLoading){
    return (

    <TouchableHighlight style={styles.saveButton} onPress={() => this.getUsersByRecherche()}>
    <Image style={[styles.icon, styles.iconBtnSearch]} source={require('../images/2ecc71.png')}/>
    </TouchableHighlight>
    )
  }
}

_displaySWaitButton = () => {
  //const {comment} = this.props.commentaire
  if(this.state.term.length > 0 && this.state.isLoading){
    return (
      <TouchableHighlight style={styles.saveButton}>
        <ActivityIndicator />
    </TouchableHighlight>
    )
   
  }
}



  render() {
    return (
      <View style={styles.container}>
           {/*
         <View style={styles.formContent}>
             
                   <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
                placeholder="Rechercher un cifopien ..."
                underlineColorAndroid='transparent'
                editable = {true}
                onChangeText={(term) => this.setState({term})}
                onSubmitEditing={this.getUsersByRecherche}
                />
              
                
          </View>
           {this._displaySendButton()}
          {this._displaySWaitButton()}
           
        </View>
         */}
        {this._displayLoading()}

          {this.displaySeminaires()}
          {this._displayFloatingActionButton()}
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
    width: 40,
    height: 40
  }


}); 

const mapStateToProps = state => {
  return {
      user: state.setUser.user
  }
}

export default connect(mapStateToProps)(Affectations)