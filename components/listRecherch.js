import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  Alert,
  ScrollView,
  TextInput,
  ListView
} from 'react-native';

export default class ListWithSearchView extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([
        {icon:"https://png.icons8.com/user-folder/color/40/2ecc71", description: "Lorem ipsum dolor sit amet, indu consectetur adipiscing elit"},
        {icon:"https://png.icons8.com/find-user-male/color/100/2ecc71", description: "Lorem ipsum dolor sit amet, indu consectetur adipiscing elit"}, 
        {icon:"https://png.icons8.com/desktop/office/40/2ecc71", description: "Lorem ipsum dolor sit amet, indu consectetur adipiscing elit"}, 
        {icon:"https://png.icons8.com/firefox/color/40/2ecc71", description: "Lorem ipsum dolor sit amet, indu consectetur adipiscing elit"}, 
        {icon:"https://png.icons8.com/pc-on-desk/color/40/2ecc71", description: "Lorem ipsum dolor sit amet, indu consectetur adipiscing elit"}, 
        {icon:"https://png.icons8.com/mandriva/color/40/2ecc71", description: "Lorem ipsum dolor sit amet, indu consectetur adipiscing elit"}, 
        {icon:"https://png.icons8.com/microsoft-access/color/40/2ecc71", description: "Lorem ipsum dolor sit amet, indu consectetur adipiscing elit"}, 
        {icon:"https://png.icons8.com/user-folder/office/40/2ecc71", description: "Lorem ipsum dolor sit amet, indu consectetur adipiscing elit"},
        {icon:"https://png.icons8.com/facebook-messenger/color/40/2ecc71", description: "Lorem ipsum dolor sit amet, indu consectetur adipiscing elit"},
      ]),
    };
  }

  onClickListener = (viewId) => {
    Alert.alert("Alert", "Button pressed "+viewId);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.formContent}>
          <View style={styles.inputContainer}>
            <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/search/androidL/100/2ecc71'}}/>
            <TextInput style={styles.inputs}
                ref={'txtPassword'}
                placeholder="Search"
                underlineColorAndroid='transparent'
                onChangeText={(name_address) => this.setState({name_address})}/>
          </View>

          <TouchableHighlight style={styles.saveButton} onPress={() => this.clickEventListener('search')}>
            <Image style={[styles.icon, styles.iconBtnSearch]} source={{uri: 'https://png.icons8.com/search/androidL/100/ffffff'}}/>
          </TouchableHighlight>
        </View>

        <ListView style={styles.notificationList} enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={(notification) => {
            return (
              <View style={styles.notificationBox}>
                <Image style={styles.image}
                  source={{uri: notification.icon}}/>
                
                <Text style={styles.description}>{notification.description}</Text>
              </View>
            )}}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBEBEB',
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
      height:45,
      flexDirection: 'row',
      alignItems:'center',
      flex:1,
      margin:10,
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
    height:45,
    justifyContent: 'center',
    alignItems: 'center',
    margin:10,
    width:70,
    alignSelf: 'flex-end',
    backgroundColor: '#40E0D0',
    borderRadius:30,
  },
  saveButtonText: {
    color: 'white',
  },
  notificationList:{
    marginTop:20,
    padding:10,
  },
  notificationBox: {
    padding:20,
    marginTop:5,
    marginBottom:5,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderRadius:10,
  },
  image:{
    width:45,
    height:45,
  },
  description:{
    fontSize:18,
    color: "#3498db",
    marginLeft:10,
  },
}); 


import React from 'react'

import {View, StyleSheet, TextInput, Button, FlatList, ActivityIndicator} from 'react-native'
import FilmItem from './filmItems'
import FilmList from './FilmList'
import {getFilm} from './api/tb'
import {connect} from 'react-redux'


class Search extends React.Component{


    constructor(props){
        super(props)
        this.search = ''
        this.page = 0
        this.totalPages = 0
        this.state = {
            films: [],
            isLoading: false
        }

       // this._loadFilms = this._loadFilms.bind(this)
    }

    _loadFilms = () => {
        if(this.search.length > 0){
            this.setState({isLoading: true})
            getFilm(this.search, this.page+1).then(data => {
                // this._films = data.results
                this.page = data.page
                this.totalPages = data.total_pages
                 this.setState({
                     films: [...this.state.films, ...data.results],
                     isLoading: false
                    })
             });
        }
     

    }
    _searchChange(text){
        this.search = text
    }

    _displayLoading(){
        if(this.state.isLoading){
            return(
                <View style={styles.loading_container}>
                    <ActivityIndicator  size='large' />

                </View>
            )
        }
    }

  

    _searchFilm(){
        this.page = 0
        this.totalPages = 0
        this.setState({
            films: []
        }, () => {
            this._loadFilms()
        })
    }

    render(){
       // console.log(this.props)
        return(
            // ici on rend ce qu'on dois voir a l'ecran
            
            <View style={styles.main_container}>
                <TextInput style={styles.textinput} onChangeText={(text) => this._searchChange(text)} onSubmitEditing={() => this._searchFilm()} placeholder='titre ici ...'/>
                <Button title='Rechercher' onPress={() => {this._searchFilm()}}></Button>

                    <FilmList 
                        films={this.state.films}
                        navigation={this.props.navigation}
                        loadFilms={this._loadFilms}
                        page={this.page}
                        totalPages={this.totalPages}
                        favoriteList={false}
                    />

                     {this._displayLoading()}
            </View>
            
           /*
           <View style={{ flex: 1, backgroundColor: 'yellow' }}>
           <View style={{ flex: 1, backgroundColor: 'red' }}></View>
           <View style={{ flex: 1, backgroundColor: 'green' }}></View>
         </View>
         */
        )
    }
}

const styles = StyleSheet.create({
    textinput: {
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: '#000000',
        borderWidth: 1,
        paddingLeft: 5
    },
    main_container: {
        flex: 1,
    },

    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
      }
})

const mapStateToProps = (state) => {
    return {
      favoriteFilms: state.favoriteFilms
    }
  }

export default connect(mapStateToProps) (Search)










import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList
} from 'react-native';

export default class Comments extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data:[
        {id:1, image: "https://bootdey.com/img/Content/avatar/avatar1.png", name:"Frank Odalthh",    comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:2, image: "https://bootdey.com/img/Content/avatar/avatar6.png", name:"John DoeLink",     comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:3, image: "https://bootdey.com/img/Content/avatar/avatar7.png", name:"March SoulLaComa", comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:4, image: "https://bootdey.com/img/Content/avatar/avatar2.png", name:"Finn DoRemiFaso",  comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:5, image: "https://bootdey.com/img/Content/avatar/avatar3.png", name:"Maria More More",  comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:6, image: "https://bootdey.com/img/Content/avatar/avatar4.png", name:"Clark June Boom!", comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:7, image: "https://bootdey.com/img/Content/avatar/avatar5.png", name:"The googler",      comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
      ]
    }
  }

  render() {
    return (
      
      <FlatList
        style={styles.root}
        data={this.state.data}
        extraData={this.state}
        ItemSeparatorComponent={() => {
          return (
            <View style={styles.separator}/>
          )
        }}
        keyExtractor={(item)=>{
          return item.id.toString();
        }}
        renderItem={(item) => {
          const Notification = item.item;
          return(
            <View style={styles.container}>
              <TouchableOpacity onPress={() => {}}>
                <Image style={styles.image} source={{uri: Notification.image}}/>
              </TouchableOpacity>
              <View style={styles.content}>
                <View style={styles.contentHeader}>
                  <Text  style={styles.name}>{Notification.name}</Text>
                  <Text style={styles.time}>
                    9:58 am
                  </Text>
                </View>
                <Text rkType='primary3 mediumLine'>{Notification.comment}</Text>
              </View>
            </View>
          );
        }}/>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#ffffff",
    marginTop:10,
  },
  container: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start'
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
});  



import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Alert,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList
} from 'react-native';

export default class Commentaire extends Component {

  constructor(props) {
    super(props);
    //const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
    
      data:[
        {id:1, image: "https://bootdey.com/img/Content/avatar/avatar1.png", name:"Frank Odalthh",    comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:2, image: "https://bootdey.com/img/Content/avatar/avatar6.png", name:"John DoeLink",     comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:3, image: "https://bootdey.com/img/Content/avatar/avatar7.png", name:"March SoulLaComa", comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:4, image: "https://bootdey.com/img/Content/avatar/avatar2.png", name:"Finn DoRemiFaso",  comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:5, image: "https://bootdey.com/img/Content/avatar/avatar3.png", name:"Maria More More",  comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:6, image: "https://bootdey.com/img/Content/avatar/avatar4.png", name:"Clark June Boom!", comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
        {id:7, image: "https://bootdey.com/img/Content/avatar/avatar5.png", name:"The googler",      comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
      ]
    };
  }

  onClickListener = (viewId) => {
    Alert.alert("Alert", "Button pressed "+viewId);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.formContent}>
          <View style={styles.inputContainer}>
            <Image style={[styles.icon, styles.inputIcon]} source={{uri: 'https://png.icons8.com/search/androidL/100/2ecc71'}}/>
            <TextInput style={styles.inputs}
                ref={'txtPassword'}
                placeholder="Search"
                underlineColorAndroid='transparent'
                onChangeText={(name_address) => this.setState({name_address})}/>
          </View>

          <TouchableHighlight style={styles.saveButton} onPress={() => this.clickEventListener('search')}>
            <Image style={[styles.icon, styles.iconBtnSearch]} source={{uri: 'https://png.icons8.com/search/androidL/100/ffffff'}}/>
          </TouchableHighlight>
        </View>

        <FlatList
        style={styles.root}
        data={this.state.data}
        extraData={this.state}
        ItemSeparatorComponent={() => {
          return (
            <View style={styles.separator}/>
          )
        }}
        keyExtractor={(item)=>{
          return item.id.toString();
        }}
        renderItem={(item) => {
          const Notification = item.item;
          return(
            <View style={styles.container}>
              <TouchableOpacity onPress={() => {}}>
                <Image style={styles.image} source={{uri: Notification.image}}/>
              </TouchableOpacity>
              <View style={styles.content}>
                <View style={styles.contentHeader}>
                  <Text  style={styles.name}>{Notification.name}</Text>
                  <Text style={styles.time}>
                    9:58 am
                  </Text>
                </View>
                <Text rkType='primary3 mediumLine'>{Notification.comment}</Text>
              </View>
            </View>
          );
        }}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  root: {
    backgroundColor: "#ffffff",
    marginTop:10,
  },
  container: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
   // flex: 1,
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
  /*
  container: {
    flex: 1,
    backgroundColor: '#EBEBEB',
  },
  */
  formContent:{
    flexDirection: 'row',
    marginTop:30,
  },
  inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius:30,
      borderBottomWidth: 1,
      height:45,
      flexDirection: 'row',
      alignItems:'center',
      flex:1,
      margin:10,
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
    height:45,
    justifyContent: 'center',
    alignItems: 'center',
    margin:10,
    width:70,
    alignSelf: 'flex-end',
    backgroundColor: '#40E0D0',
    borderRadius:30,
  },
  saveButtonText: {
    color: 'white',
  },
  notificationList:{
    marginTop:20,
    padding:10,
  },
  notificationBox: {
    padding:20,
    marginTop:5,
    marginBottom:5,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderRadius:10,
  },
  /*
  image:{
    width:45,
    height:45,
  },
  */
  description:{
    fontSize:18,
    color: "#3498db",
    marginLeft:10,
  },
}); 