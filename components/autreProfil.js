
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView
} from 'react-native';
import {connect} from 'react-redux'
import axios from 'axios'

class Profil extends Component {

   
    componentDidMount(){  
     // this.getMoviesFromApiAsync()
        
     }

     getMoviesFromApiAsync() {
       let id = 2
      return fetch('http://127.0.0.1:3000/api/use/' + id, {
        header: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json'
        }
      })
        .then((response) => response.text())
        .then((responseJson) => {
          data = responseJson.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
          tb = JSON.parse(data)
          console.log(tb.name)
         // return responseJson.data;
        })
        .catch((error) => {
          console.error(error);
        });
    }

    fetchData = async () => {
      try {
        let uri = 'http://127.0.0.1:3000/api/aff';
        let response = await fetch(uri);
      
        // const data = await response.json();
        let data = await response.text();
      //  if (Platform.OS === 'android') {
          data = data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
       // }
        data = JSON.parse(data);
        console.log(typeof(data));
      
      } catch (error) {
        console.error(error);
      }
    };

  render() {
    return (
      <ScrollView style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
                <Image style={styles.avatar}
                  source={{uri: 'https://bootdey.com/img/Content/avatar/avatar1.png'}}/>

                <Text style={styles.name}>
                  John Doe
                </Text>
            </View>
          </View>

          <View style={styles.body}>
            <View style={styles.bodyContent}>

              <View style={styles.menuBox}>
                <Image style={styles.icon} source={{uri: 'https://png.icons8.com/facebook-like/color/40/2ecc71'}}/>
                <Text style={styles.info}>Icon</Text>
              </View>

              <View style={styles.menuBox}>
                <Image style={styles.icon} source={{uri: 'https://png.icons8.com/heart/office/40/2ecc71'}}/>
                <Text style={styles.info}>Icon</Text>
              </View>

              <View style={styles.menuBox}>
                <Image style={styles.icon} source={{uri: 'https://png.icons8.com/bar-chart/dusk/50/ffffff'}}/>
                <Text style={styles.info}>Icon</Text>
              </View>

              <View style={styles.menuBox}>
                <Image style={styles.icon} source={{uri: 'https://png.icons8.com/shopping-cart/color/50/ffffff'}}/>
                <Text style={styles.info}>Icon</Text>
              </View>

              <View style={styles.menuBox}>
                <Image style={styles.icon} source={{uri: 'https://png.icons8.com/product/nolan/50/ffffff'}}/>
                <Text style={styles.info}>Icon</Text>
              </View>

              <View style={styles.menuBox}>
                <Image style={styles.icon} source={{uri: 'https://png.icons8.com/shopping-basket/color/50/ffffff'}}/>
                <Text style={styles.info}>Icon</Text>
              </View>

              <View style={styles.menuBox}>
                <Image style={styles.icon} source={{uri: 'https://png.icons8.com/notification/dusk/50/ffffff'}}/>
                <Text style={styles.info}>Icon</Text>
              </View>

              <View style={styles.menuBox}>
                <Image style={styles.icon} source={{uri: 'https://png.icons8.com/profile/color/50/ffffff'}}/>
                <Text style={styles.info}>Icon</Text>
              </View>

              <View style={styles.menuBox}>
                <Image style={styles.icon} source={{uri: 'https://png.icons8.com/friends/color/50/ffffff'}}/>
                <Text style={styles.info}>Iconpoiutegvdh</Text>
              </View>



            </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  header:{
    backgroundColor: "#00BFFF",
  },
  headerContent:{
    padding:30,
    alignItems: 'center',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
  },
  name:{
    fontSize:22,
    color:"#FFFFFF",
    fontWeight:'600',
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding:30,
  },
  textInfo:{
    fontSize:18,
    marginTop:20,
    color: "#696969",
  },
  bodyContent:{
    paddingTop:40,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  menuBox:{
    backgroundColor: "#DCDCDC",
    width:85,
    height:100,
    alignItems: 'center',
    justifyContent: 'center',
    margin:12,
    shadowColor: 'black',
    shadowOpacity: .2,
    shadowOffset: {
      height:2,
      width:-2
    },
    elevation:4,
  },
  icon: {
    width:60,
    height:60,
  },
  info:{
    fontSize:9,
    color: "#696969",
  }
});
  
const mapStateToProps = state => {
  return {
      avatar: state.setAvatar.avatar,
      user: state.setUser.user
  }
}

//export default connect(mapStateToProps)(Profil)
