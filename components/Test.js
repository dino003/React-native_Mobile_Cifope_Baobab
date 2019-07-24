import React from 'react'

import {Platform, StyleSheet, View, Text, Animated,
  ActivityIndicator, Easing, PanResponder, Dimensions} from 'react-native'
import login from './api/tb'
import axios from 'axios'
class Test extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            topPosition: 0,
            leftPosition: 0,
            user: {},
            loading: false
        }

        var {height, width} = Dimensions.get('window');
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderMove: (evt, gestureState) => {
                let touches = evt.nativeEvent.touches;
                if (touches.length == 1) {
                    this.setState({
                      topPosition: touches[0].pageY - height/2,
                      leftPosition: touches[0].pageX - width/2
                    })
                }
            }
        })
    }

  


    async fetchCoins() {
      const URI = 'http://localhost:8000';

      try {
              let response = await fetch(URI + '/api/users');
              let responseJsonData = await response.json();
              return responseJsonData;
          }
      catch(e) {
          console.log(e)
      }
  }
    

    render(){
     // console.log(this.state.user)
        return (
            <View style={styles.main_container}>
              
                <View 
                {...this.panResponder.panHandlers}
                style={[styles.subview_container, {top: this.state.topPosition, left: this.state.leftPosition}]}>
                </View>
                
                
             </View>
        )
    }


    
}

const styles = StyleSheet.create({
    main_container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    subview_container: {
        ...Platform.select({
            ios: {
              backgroundColor: 'red',
              height: 100,
              width: 50
            },
            android: {
              backgroundColor: 'blue',
              height: 50,
              width: 100
            }
          })
    },
    loading_container: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'

  },
  })

export default Test




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

export default class Contacts extends Component {

  constructor(props) {
    super(props);
    this.state = {
      calls: [
        {id:1,  name: "Mark Doe",    status:"active", image:"https://bootdey.com/img/Content/avatar/avatar7.png"},
        {id:2,  name: "Clark Man",   status:"active", image:"https://bootdey.com/img/Content/avatar/avatar6.png"} ,
        {id:3,  name: "Jaden Boor",  status:"active", image:"https://bootdey.com/img/Content/avatar/avatar5.png"} ,
        {id:4,  name: "Srick Tree",  status:"active", image:"https://bootdey.com/img/Content/avatar/avatar4.png"} ,
        {id:5,  name: "Erick Doe",   status:"active", image:"https://bootdey.com/img/Content/avatar/avatar3.png"} ,
        {id:6,  name: "Francis Doe", status:"active", image:"https://bootdey.com/img/Content/avatar/avatar2.png"} ,
        {id:8,  name: "Matilde Doe", status:"active", image:"https://bootdey.com/img/Content/avatar/avatar1.png"} ,
        {id:9,  name: "John Doe",    status:"active", image:"https://bootdey.com/img/Content/avatar/avatar4.png"} ,
        {id:10, name: "Fermod Doe",  status:"active", image:"https://bootdey.com/img/Content/avatar/avatar7.png"} ,
        {id:11, name: "Danny Doe",   status:"active", image:"https://bootdey.com/img/Content/avatar/avatar1.png"},
      ]
    };
  }

  renderItem = ({item}) => {
    return (
      <TouchableOpacity>
        <View style={styles.row}>
          <Image source={{ uri: item.image }} style={styles.pic} />
          <View>
            <View style={styles.nameContainer}>
              <Text style={styles.nameTxt} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
              <Text style={styles.mblTxt}>Mobile</Text>
            </View>
            <View style={styles.msgContainer}>
              <Text style={styles.msgTxt}>{item.status}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return(
      <View style={{ flex: 1 }} >
        <FlatList 
          extraData={this.state}
          data={this.state.calls}
          keyExtractor = {(item) => {
            return item.id;
          }}
          renderItem={this.renderItem}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirectiona: 'row',
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
})




