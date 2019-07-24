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
  Modal,

} from 'react-native';
import SearchInput, { createFilter } from 'react-native-search-filter';
import API from '../api/service'
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import {connect} from 'react-redux'
import Swipeout from 'react-native-swipeout';




const KEYS_TO_FILTERS = ['name', 'prenom'];

var swipeoutBtns = [
  {
    text: 'Button'
  }
]
 class GestionDesUtilisateurs extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('nom_seminaire', 'Gestion des Utilisateurs'),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
     
      searchTerm: '',
      loading: false,

      utilisateurs: [],
      searchTermAdmin: '',
      searchTermExpert: '',
      searchTermSeminariste: ''

    };
  }

  
 
  searchUpdatedSeminariste(term) {
    this.setState({ searchTermSeminariste: term })
  }

  searchUpdatedExpert(term) {
    this.setState({ searchTermExpert: term })
  }

  searchUpdatedAdmin(term) {
    this.setState({ searchTermAdmin: term })
  }

  componentDidMount(){
   // console.log('salut')
   this.getUtilisateurs()
  // console.log(this.props.navigation.params)

  }

  getUtilisateurs = async () => {
    this.setState({loading: true})
    await API.get('/voir_users')
     .then((responseJson) => {
         if(typeof responseJson.data === 'string'){
            data = responseJson.data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
            responseFinal = JSON.parse(data)
           // console.log(responseFinal)

           // console.log( tb.user.name)
                 let article_recus = responseFinal.data
                // console.log(article_recus)
                 this.setState({
                    loading: false,
                    utilisateurs: article_recus
                })
         
         }else{
             this.setState({
                 loading: false,
                 utilisateurs: responseJson.data.data
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

  // partie seminaristes

  _showSeminariste = () => {
    if(this.state.utilisateurs.length > 0){
        const seminaristes = this.state.utilisateurs.filter(semi => {
            return semi.etu && !semi.prof && !semi.admin
        })

        if(seminaristes.length > 0){
            const filtreSeminaristes = seminaristes.filter(createFilter(this.state.searchTermSeminariste, KEYS_TO_FILTERS))

            return (
                <ScrollView>
                {filtreSeminaristes.map(item => {
                  return (

                    <TouchableOpacity onPress={()=> {}} key={item.id.toString()} style={styles.emailItem}>
                                          <Swipeout left={swipeoutBtns}>

                      <View style={styles.row}>
                      <Image source={{uri: item.url_photo + item.photo}} style={styles.pica} />
                <View>
                  <View style={styles.nameContainer}>
                  <Text style={styles.nameTxta} numberOfLines={1} ellipsizeMode="tail">{item.prenom} {item.name}</Text>
                 <Text numberOfLines={1} style={styles.mblTxta}>{item.profession ? item.profession : ''}</Text>  
                  </View>
                  <View style={styles.end}>
                    <Text style={styles.msgTxta}>en ligne</Text>
                  </View>
                </View>
              </View>
              </Swipeout>

                    </TouchableOpacity>


                  )
                })}
              </ScrollView>
              )
        }
    }

  }

  // fin seminaristes

  // partie experts

  _showExperts = () => {
    if(this.state.utilisateurs.length > 0){
        const experts = this.state.utilisateurs.filter(semi =>  semi.prof )

        if(experts.length > 0){
            const filtreExperts = experts.filter(createFilter(this.state.searchTermExpert, KEYS_TO_FILTERS))

            return (
                <ScrollView>
                {filtreExperts.map(item => {
                  return (
                    <TouchableOpacity onPress={()=> {}} key={item.id.toString()} style={styles.emailItem}>
                      
                      <View style={styles.row}>
                      <Image source={{uri: item.url_photo + item.photo}} style={styles.pica} />
                <View>
                  <View style={styles.nameContainer}>
                  <Text style={styles.nameTxta} numberOfLines={1} ellipsizeMode="tail">{item.prenom} {item.name}</Text>
                 <Text numberOfLines={1} style={styles.mblTxta}>{item.profession ? item.profession : ''}</Text>  
                  </View>
                  <View style={styles.end}>
                    <Text style={styles.msgTxta}>en ligne</Text>
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

  }

  // fin experts

  // partie admin

  _showAdmins = () => {
    if(this.state.utilisateurs.length > 0){
        const admin = this.state.utilisateurs.filter(semi =>  semi.admin )

        if(admin.length > 0){
            const filtreAdmin = admin.filter(createFilter(this.state.searchTermAdmin, KEYS_TO_FILTERS))

            return (
                <ScrollView>
                {filtreAdmin.map(item => {
                  return (
                    <TouchableOpacity onPress={()=> {}} key={item.id.toString()} style={styles.emailItem}>
                      
                      <View style={styles.row}>
                      <Image source={{uri: item.url_photo + item.photo}} style={styles.pica} />
                <View>
                  <View style={styles.nameContainer}>
                  <Text style={styles.nameTxta} numberOfLines={1} ellipsizeMode="tail">{item.prenom} {item.name}</Text>
                 <Text numberOfLines={1} style={styles.mblTxta}>{item.profession ? item.profession : ''}</Text>  
                  </View>
                  <View style={styles.end}>
                    <Text style={styles.msgTxta}>en ligne</Text>
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

  }
// fin admin

  render() {

    return (
     <ScrollableTabView
    style={{marginTop: 20, }}
    initialPage={0}
    tabBarBackgroundColor='green'
    tabBarInactiveTextColor='black'
    tabBarActiveTextColor='white'
    renderTabBar={() => <ScrollableTabBar />}
  >
  <View style={styles.container} tabLabel="Seminaristes">
        <View >
        <SearchInput 
          onChangeText={(term) => { this.searchUpdatedSeminariste(term) }} 
          style={styles.searchInput}
          placeholder="Taper pour rechercher "
          />
          </View>
            {this._showSeminariste()}
            {this._displayLoading()}

      </View>
   <View style={{ flex: 1 }} tabLabel="Experts">
         <View >
        <SearchInput 
          onChangeText={(term) => { this.searchUpdatedExpert(term) }} 
          style={styles.searchInput}
          placeholder="Taper pour rechercher "
          />
          </View>
            {this._showExperts()}
      </View>

      <View style={{ flex: 1 }} tabLabel="Administrateurs">
      <View >
        <SearchInput 
          onChangeText={(term) => { this.searchUpdatedAdmin(term) }} 
          style={styles.searchInput}
          placeholder="Taper pour rechercher "
          />
          </View>
            {this._showAdmins()}
          
      </View>
  </ScrollableTabView>
  )
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

rowa: {
  flexDirection: 'row',
  alignItems: 'center',
  borderColor: '#DCDCDC',
  backgroundColor: '#fff',
  borderBottomWidth: 1,
  padding: 10,
},
pica: {
  borderRadius: 30,
  width: 60,
  height: 60,
},
nameContainera: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: 280,
},
nameTxta: {
  marginLeft: 15,
  fontWeight: '600',
  color: '#222',
  fontSize: 18,
  width:170,
},
mblTxta: {
  fontWeight: '200',
  color: '#777',
  fontSize: 13,
},
msgContainera: {
  flexDirection: 'row',
  alignItems: 'center',
},
msgTxta: {
  fontWeight: '400',
  color: '#008B8B',
  fontSize: 12,
  marginLeft: 15,
},

}); 


const mapStateToProps = state => {
  return {
      avatar: state.setAvatar.avatar,
      user: state.setUser.user
  }
}

export default connect(mapStateToProps)(GestionDesUtilisateurs)