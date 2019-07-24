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

export default class Calls extends Component {

  constructor(props) {
    super(props);
    this.state = {
      calls: [
        {id:1,  name: "Gestion des utilisateurs",   route:"GestionDesCifopiens", time:'11:14 am', video:false, image:"https://bootdey.com/img/Content/avatar/avatar7.png"},
        {id:4,  name: "Affectation des utilisateurs", route:"GestionDesAffectations", time:'08:32 am', video:false, image:"https://bootdey.com/img/Content/avatar/avatar4.png"} ,
        {id:6,  name: "Gestions des articles",   route:"GestionArticles", time:'09:54 am', video:false, image:"https://bootdey.com/img/Content/avatar/avatar2.png"} ,
        /*
        {id:2,  name: "Affectation séminaristes / séminaire",  route:"GestionDesFormations", time:'15:58 am', video:false, image:"https://bootdey.com/img/Content/avatar/avatar6.png"} ,
        {id:3,  name: "Affectation experts / séminaire", route:"AffectationExpert", time:'12:45 am', video:true,  image:"https://bootdey.com/img/Content/avatar/avatar5.png"} ,
        {id:5,  name: "Gestion des séminaires",   route:"ess", time:'07:45 am', video:true,  image:"https://bootdey.com/img/Content/avatar/avatar3.png"} ,
       */
      ]
    };
  }

 

  renderItem = ({item}) => {
    var callIcon = "https://img.icons8.com/color/48/000000/phone.png";
    if(item.video == true) {
      callIcon = "https://img.icons8.com/color/48/000000/video-call.png";
    }
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate(item.route)}>
        <View style={styles.row}>
          <View>
            <View style={styles.nameContainer}>
              <Text numberOfLines={1} style={styles.nameTxt}>{item.name}</Text>
            </View>
           
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return(
      <View style={{ flex: 1, marginTop: 20 }} >
        <FlatList 
          extraData={this.state}
          data={this.state.calls}
          keyExtractor = {(item) => {
            return item.id.toString();
          }}
          renderItem={this.renderItem}/>
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
    fontWeight: '800',
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
  }
}); 


