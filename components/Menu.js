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

export default class Menu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [
        {id:1, title: "Messages", route: "ChatList",  color:"#FF4500", members:8,  image: require('../components/images/name.png')},
        {id:1, title: "Profil 2", route: "UserProfilInfo",     color:"#87CEEB", members:6,  image: require('../components/images/home-page.png')},
        {id:2, title: "Page3", route: "",     color:"#4682B4", members:12, image: require('../components/images/two-hearts.png')} ,
        {id:3, title: "Page4", route: "",   color:"#6A5ACD", members:5,  image: require('../components/images/family.png')} ,
        {id:4, title: "Page5", route: "",  color:"#FF69B4", members:6,  image: require('../components/images/groups.png')} ,
        {id:5, title: "School", route: "",   color:"#00BFFF", members:7,  image: require('../components/images/classroom.png')} ,
        {id:6, title: "Things", route: "",   color:"#00FFFF", members:8,  image: require('../components/images/checklist.png')} ,
        {id:8, title: "World", route: "",    color:"#20B2AA", members:23, image: require('../components/images/globe-earth.png')} ,
        {id:9, title: "Remember", route: "", color:"#191970", members:45, image: require('../components/images/to-do.png')} ,
        {id:9, title: "Game", route: "",     color:"#008080", members:13, image: require('../components/images/basketball.png')} ,
      ]
    };
  }

  clickEventListener(item) {
    Alert.Alert(item.title)
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList style={styles.list}
          contentContainerStyle={styles.listContainer}
          data={this.state.data}
          horizontal={false}
          numColumns={2}
          keyExtractor= {(item) => {
            return item.id;
          }}
          renderItem={({item}) => {
            return (
              <TouchableOpacity style={[styles.card, {backgroundColor:item.color}]} onPress={() => this.props.navigation.navigate(item.route)}>
                <View style={styles.cardHeader}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Image style={styles.icon} source={require('../components/images/settings.png')}/>
                </View>
                <Image style={styles.cardImage} source={item.image}/>
                <View style={styles.cardFooter}>
                  <Text style={styles.subTitle}>{item.members} members</Text>
                </View>
              </TouchableOpacity>
            )
          }}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    marginTop:20,
  },
  list: {
    //paddingHorizontal: 5,
    backgroundColor:"#E6E6E6",
  },
  listContainer:{
    alignItems:'center'
  },
  /******** card **************/
  card:{
    marginHorizontal:2,
    marginVertical:2,
    flexBasis: '48%',
  },
  cardHeader: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: 'row',
    alignItems:"center", 
    justifyContent:"center"
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  cardFooter:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  cardImage:{
    height: 70,
    width: 70,
    alignSelf:'center'
  },
  title:{
    fontSize:16,
    flex:1,
    color:"#FFFFFF",
    fontWeight:'bold'
  },
  subTitle:{
    fontSize:12,
    flex:1,
    color:"#FFFFFF",
  },
  icon:{
    height: 20,
    width: 20, 
  }
});     