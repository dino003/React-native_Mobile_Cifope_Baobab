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
} from 'react-native';
import SearchInput, { createFilter } from 'react-native-search-filter';


const KEYS_TO_FILTERS = ['name'];


export default class ChatList extends Component {

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
      searchTerm: ''
    };
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
    const filteredEmails = this.state.calls.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))

    const calls = this.state.calls
    if(calls.length > 0){
    
      return (
        <ScrollView>
        {filteredEmails.map(item => {
          return (
            <TouchableOpacity onPress={()=> {}} key={item.id.toString()} style={styles.emailItem}>
              
              <View style={styles.row}>
              <Image source={{ uri: item.image }} style={styles.pic} />
        <View>
          <View style={styles.nameContainer}>
            <Text numberOfLines={2} style={styles.nameTxt}>{item.name}</Text>
          </View>
          <View style={styles.end}>
            <Image style={[styles.icon, {marginLeft:15, marginRight:5, width:14, height:14}]} source={{uri:"https://img.icons8.com/small/14/000000/double-tick.png"}}/>
            <Text style={styles.time}>15.00 Abidjan</Text>
          </View>
        </View>
           {this.showIconAppel(item)}

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

  renderItem = ({item}) => {

    var callIcon = "https://img.icons8.com/color/48/000000/phone.png";
    if(item.video == true) {
      callIcon = "https://img.icons8.com/color/48/000000/video-call.png";
    }
    return (
      <View style={styles.container} >
      <SearchInput 
      onChangeText={(term) => { this.searchUpdated(term) }} 
      style={styles.searchInput}
      placeholder="Rechercher (code ou intitulé du séminaire )"
      />
      <TouchableOpacity>
        <View style={styles.row}>
          <Image source={{ uri: item.image }} style={styles.pic} />
          <View>
            <View style={styles.nameContainer}>
              <Text style={styles.nameTxt}>{item.name}</Text>
            </View>
            <View style={styles.end}>
              <Image style={[styles.icon, {marginLeft:15, marginRight:5, width:14, height:14}]} source={{uri:"https://img.icons8.com/small/14/000000/double-tick.png"}}/>
              <Text style={styles.time}>{item.date} {item.time}</Text>
            </View>
          </View>
          <Image style={[styles.icon, { marginRight: 50 }]} source={{uri: callIcon}}/>
        </View>
      </TouchableOpacity>
            </View>

    );
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

       {this.displayUserChats()}
       {this._displayLoading()}
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
  searchInput:{
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    borderRadius: 30,

  },
}); 