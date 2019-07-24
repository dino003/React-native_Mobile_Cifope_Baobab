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
  Platform,
  ActivityIndicator
} from 'react-native';
import {connect} from 'react-redux'
import SearchInput, { createFilter } from 'react-native-search-filter';
import moment from 'moment'
import API from './api/service'


const KEYS_TO_FILTERS = ['name'];

 class ChatList extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('ami_conversation', 'Discussions'),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      calls: [
        {id:1,  name: "Mark Doe",   date:"12 jan", time:'11:14 am', video:false, image:"https://bootdey.com/img/Content/avatar/avatar7.png"},
        {id:2,  name: "Clark Man",  date:"12 jul", time:'15:58 am', video:false, image:"https://bootdey.com/img/Content/avatar/avatar6.png"} ,
        {id:3,  name: "Jaden Boor", date:"12 aug", time:'12:45 am', video:true,  image:"https://bootdey.com/img/Content/avatar/avatar5.png"} ,
        {id:4,  name: "Srick Tree", date:"12 feb", time:'08:32 am', video:false, image:"https://bootdey.com/img/Content/avatar/avatar4.png"} ,
        {id:5,  name: "John Doe",   date:"12 oct", time:'07:45 am', video:true,  image:"https://bootdey.com/img/Content/avatar/avatar3.png"} ,
        {id:6,  name: "John Doe",   date:"12 jan", time:'09:54 am', video:false, image:"https://bootdey.com/img/Content/avatar/avatar2.png"} ,
        {id:8,  name: "John Doe",   date:"12 jul", time:'11:22 am', video:true,  image:"https://bootdey.com/img/Content/avatar/avatar1.png"} ,
        {id:9,  name: "John Doe",   date:"12 aug", time:'13:33 am', video:false, image:"https://bootdey.com/img/Content/avatar/avatar4.png"} ,
        {id:10, name: "John Doe",   date:"12 oct", time:'11:58 am', video:true,  image:"https://bootdey.com/img/Content/avatar/avatar7.png"} ,
        {id:11, name: "John Doe",   date:"12 jan", time:'09:28 am', video:false, image:"https://bootdey.com/img/Content/avatar/avatar1.png"},
      ],
      searchTerm: '',
      sessions : [],
      loading: false
    };
  }

  componentDidMount () {
    this.getUserSessions()

    this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.forceUpdate();
      }
    );
  }

  getUserSessions = async () => {
    this.setState({loading: true})
    await API.get('/user_sessions_chat/' + this.props.user.id)
     .then((responseJson) => {
         if(typeof responseJson.data === 'string'){
            data = responseJson.data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
            responseFinal = JSON.parse(data)
           // console.log( tb.user.name)
                 let article_recus = responseFinal
                 this.setState({
                    loading: false,
                    sessions: article_recus
                })
         
         }else{
             this.setState({
                 loading: false,
                 sessions: responseJson.data
             })

         }
      
     })
     .catch((error) => {
       console.error(error);
     });
  }

  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }

  showIconAppel(item){
    if(!item.video){
      return <Image style={[styles.icon, { marginRight: 50 }]} source={{uri: 'https://img.icons8.com/color/48/000000/phone.png'}}/>

    }
    else {
    return <Image style={[styles.icon, { marginRight: 50 }]} source={{uri: 'https://img.icons8.com/color/48/000000/video-call.png'}}/>

    }

  }

  displayUserChats = () => {
    const sessions = this.state.sessions
    if(sessions.length > 0){
      const filtreSessions = sessions.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
    
      return (
        <ScrollView>
        {filtreSessions.map(item => {
          return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate("ChatMessage", {session_id: item.id, partenaire: item.premier_utilisateur_session.id !== this.props.user.id ? item.premier_utilisateur_session : item.deuxieme_utilisateur_session, ami_conversation:  item.premier_utilisateur_session.id !== this.props.user.id ? item.premier_utilisateur_session.prenom : item.deuxieme_utilisateur_session.prenom})} key={item.id.toString()} style={styles.emailItem}>
              
              <View style={styles.row}>
              <Image source={{ uri: item.premier_utilisateur_session.id !== this.props.user.id ? item.premier_utilisateur_session.url_photo + item.premier_utilisateur_session.photo : item.deuxieme_utilisateur_session.url_photo + item.deuxieme_utilisateur_session.photo }} style={styles.pic} />
        <View>
          <View style={styles.nameContainer}>
            <Text numberOfLines={1} style={styles.nameTxt}>{ item.premier_utilisateur_session.id !== this.props.user.id ? item.premier_utilisateur_session.prenom : item.deuxieme_utilisateur_session.prenom} { item.premier_utilisateur_session.id !== this.props.user.id ? item.premier_utilisateur_session.name : item.deuxieme_utilisateur_session.name}</Text>
          </View>
          <View style={styles.end}>
            <Text style={styles.tima} numberOfLines={1}>{item.dernier_message_dela_session.message}</Text>
          </View>
          <View style={styles.end}>
            <Image style={[styles.icon, {marginLeft:15, marginRight:5, width:14, height:14}]} source={{uri:"https://img.icons8.com/small/14/000000/double-tick.png"}}/>
            <Text style={styles.time}>{moment(item.dernier_message_dela_session.created_at).format('DD/MM/YYYY__HH:mm:ss')}</Text>
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

  _displayFloatingActionButton = () => {
    const user = this.props.user
    if (user !== undefined && Platform.OS === 'android') { // Uniquement sur Android et lorsque le film est chargé
      return (
        <TouchableOpacity
          style={styles.share_touchable_floatingactionbutton}
          onPress={() => this.props.navigation.navigate("ListGlobaleChat")}>
          <Image
            style={styles.share_image}
            source={require('./images/flloatComment.png')} />
        </TouchableOpacity>
      )
    }
}

  _displayLoading() {
    if (this.state.loading) {
      // Si isLoading vaut true, on affiche le chargement à l'écran
      return (
        <View style={{flex: 1}}>
        <ActivityIndicator style={styles.loading_container} size='large' />

        <Text style={{textAlign: 'center'}}>Chargement de vos conversations...</Text>
      </View>      
      )
    }
  }

  _showChampDeRecherche = () => {
    if(this.state.loading === false && this.state.sessions.length > 0){
      return (
        <View >
        <SearchInput 
          onChangeText={(term) => { this.searchUpdated(term) }} 
          style={styles.searchInput}
          placeholder="Rechercher ou démarrer une nouvelle discussion"
          />
          </View>
      )
    }else{
      return (
        <View style={{flex: 1}}>
          <Text style={{textAlign: 'center'}}>
            Vous N'avez aucune discussion enregistrée
          </Text>
        </View>
      )
    }
  }



  render() {
    return(
      <View style={styles.container} >
        {this._showChampDeRecherche()}

       {this.displayUserChats()}
       {this._displayLoading()}
        {this._displayFloatingActionButton()}
    </View>
    );
  }
}

const styles = StyleSheet.create({
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
  enda: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  time: {
    fontWeight: '400',
    color: '#666',
    fontSize: 9,

  },

  tima: {
    fontWeight: '400',
    color: '#666',
    fontSize: 16,

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
  searchInput:{
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    borderRadius: 30,

  },

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
  }
}); 

const mapStateToProps = state => {
  return {
      avatar: state.setAvatar.avatar,
      user: state.setUser.user
  }
}

export default connect(mapStateToProps)(ChatList)