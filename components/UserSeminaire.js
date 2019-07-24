import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import SearchInput, { createFilter } from 'react-native-search-filter';
import API from './api/service2'
import {connect} from 'react-redux'


const KEYS_TO_FILTERS = ['code_seminaire', 'nom_seminaire'];


 class UserSeminaire extends Component {

  
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('mes', 'Mes séminaires'),
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

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      seminaires: [],
      loading: false

    };
  }

  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }

  componentDidMount(){
    this.getUserSeminaire()
   // console.log(this.state.seminaires)

  }

  getUserSeminaire = async () => {
    this.setState({loading: true})
    await API.get('/user_seminaire_suivre/' + this.props.user.id)
     .then((responseJson) => {
         if(typeof responseJson.data === 'string'){
            data = responseJson.data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
            responseFinal = JSON.parse(data)
           // console.log( tb.user.name)
                 let article_recus = responseFinal
                 //console.log(article_recus)
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

  _voirDetailSeminaire = (seminaire) => {
    // console.log("film id = " + idFilm)
   // this.props.navigation.setParams({nom_seminaire: seminaire.id})

     this.props.navigation.navigate("DetailSeminaire", {seminaire: seminaire, nom_seminaire: seminaire.nom_seminaire})
 }


  _displaySeminaires = () => {
    const filteredEmails = this.state.seminaires.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))

    const seminaires = this.state.seminaires
    if(seminaires.length > 0){
      return (
        <ScrollView>
        {filteredEmails.map(item => {
          return (
            <TouchableOpacity onPress={()=> this._voirDetailSeminaire(item)} key={item.id.toString()} style={styles.emailItem}>
              
              <View style={styles.row}>
            <Text>{item.code_seminaire}</Text>
        <View>
          <View style={styles.nameContainer}>
            <Text numberOfLines={2} style={styles.nameTxt}>{item.nom_seminaire}</Text>
          </View>
          <View style={styles.end}>
            <Image style={[styles.icon, {marginLeft:15, marginRight:5, width:14, height:14}]} source={{uri:"https://img.icons8.com/small/14/000000/double-tick.png"}}/>
            <Text style={styles.time}>{item.seminaire_annee} {item.lieuSeminaire}</Text>
          </View>
        </View>
      </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
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

  

  render() {
    return(
      <View style={styles.container} >
        <View >
        <SearchInput 
          onChangeText={(term) => { this.searchUpdated(term) }} 
          style={styles.searchInput}
          placeholder="Rechercher (code ou intitulé du séminaire )"
          />
          </View>

         {this._displaySeminaires()}
         {this._displayLoading()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#dcdcdc',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    padding: 10,
    justifyContent: 'space-between',

  },
  pic: {
    borderRadius: 25,
    width: 50,
    height: 50,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 270,
  },
  nameTxt: {
    marginLeft: 15,
    fontWeight: '600',
    color: '#222',
    fontSize: 15,

  },
  mblTxt: {
    fontWeight: '200',
    color: '#777',
    fontSize: 13,
  },
  end: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontWeight: '400',
    color: '#666',
    fontSize: 12,

  },
  icon:{
    height: 28,
    width: 28, 
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start'
  },
  emailItem:{
    borderBottomWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.3)',
    padding: 10
  },
  emailSubject: {
    color: 'rgba(0,0,0,0.5)'
  },
  searchInput:{
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    borderRadius: 30,

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
      avatar: state.setAvatar.avatar,
      user: state.setUser.user
  }
}

export default connect(mapStateToProps)(UserSeminaire)