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
  Button,
  ActivityIndicator
} from 'react-native';
import ImageView from 'react-native-image-view';
import {Avatar} from 'react-native-elements'
import API from './api/serviceLocal'



export default class ProductDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
        isImageViewVisible: false,
        numColumns:4,
       

        user_infos: {
            seminaires_user_par_suivre: [],
            seminaires_user_par_suivre_count: undefined
        },
        loading: false


    }
  }

  _displayLoading() {
    if (this.state.loading) {
      // Si isLoading vaut true, on affiche le chargement à l'écran
      return (
          <ActivityIndicator style={styles.loading_container} size='small' style={{alignItems: 'center'}} />
      )
    }
  }

  componentDidMount(){
      this.getUserInfos()
  }

  getUserInfos = async () => {
    this.setState({loading: true})
  await API.get('/user_profil_info_avec_seminaire/' + this.props.navigation.state.params.user.id)
   .then((responseJson) => {
       if(typeof responseJson.data === 'string'){
          data = responseJson.data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
          responseFinal = JSON.parse(data)
         // console.log( tb.user.name)
               let article_recus = responseFinal
               this.setState({
                  loading: false,
                  user_infos: article_recus
              })
       
       }else{
           this.setState({
               loading: false,
               user_infos: responseJson.data
           })

       }
    
   })
   .catch((error) => {
     console.error(error);
   });
}

  retirerSeminaire = (item, index) => {
    const user = this.props.navigation.state.params.user

    Alert.alert(
        '! Confirmation',
        'Vraiment Rétirer  ' + user.prenom + ' ' + user.name + ' du ' +item.code_seminaire + ' ?',
        [
         // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
          {
            text: 'Annuler',
            onPress: () => {},
            style: 'cancel',
          },
          {text: 'Oui', onPress: () => {
              
            this.state.user_infos.seminaires_user_par_suivre.splice(index, 1)
            this.setState({})
           // this.forceUpdate()
           // console.log('rendu' + index)
            //console.log(this.state.user_infos.seminaires_user_par_suivre)

             API.delete('desaffecter_utilisateur/' + user.id + '/' + item.id)
          }},
        ],
        {cancelable: false},
      );
  }

  renderItem = ({item, index}) => {
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
   // var itemDimension = Dimensions.get('window').width / this.state.numColumns;


    return (
        
        <TouchableOpacity onPress={() => this.retirerSeminaire(item, index)} style={styles.btnSize}><Text>{item.code_seminaire}</Text></TouchableOpacity> 
    );
  }
  
  formatRow = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ id: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }
    return data;
  }

  clickEventListener() {
    Alert.alert("Success", "Product has beed added to cart")
  }

  render() {
      const user = this.props.navigation.state.params.user
      const images = [
        {
            source: {
                uri: user.url_photo + user.photo,
            },
            
            title: 'Paris',
            width: 806,
            height: 720,
        },
    ];
    return (
      <View style={styles.container}>
           <ImageView
            images={images}
            imageIndex={0}
            isVisible={this.state.isImageViewVisible}
            onClose={() => this.setState({isImageViewVisible: false})}
            renderFooter={(currentImage) => (<View><Text style={{textAlign: 'center', color: 'red'}}>{user.name}</Text></View>)}
        />
        <ScrollView>
          <View style={{alignItems:'center', marginHorizontal:30}}>
            <Avatar title={user.prenom[0] + user.name[0]}  onPress={() => this.setState({isImageViewVisible: true})} style={styles.productImg} source={{uri: user.url_photo + user.photo}}/>
            <Text numberOfLines={1} style={styles.name}>{user.prenom} {user.name}</Text>
            
                {(!this.state.loading && this.state.user_infos.seminaires_user_par_suivre_count !== undefined)? (
                    <Text style={styles.price}>
                    {this.state.user_infos.seminaires_user_par_suivre.length} séminaires</Text>
                ): (
                    <Text style={styles.price}>
                ..........</Text>
                )}
            {/* 
                 <Text style={styles.description}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. 
              Aenean commodo ligula eget dolor. Aenean massa. Cum sociis 
              natoque penatibus et magnis dis parturient montes, 
              nascetur ridiculus mus. Donec quam felis, ultricies nec
            </Text>
            */}
           
          </View>
        
        
          <View style={styles.contentSize}>
           

            <FlatList
          data={this.state.user_infos.seminaires_user_par_suivre}
          keyExtractor= {(item) => {
            return item.id.toString();
          }}
          extraData={this.state}
          renderItem={this.renderItem}
          numColumns={this.state.numColumns}/>

          {this._displayLoading()}
            
          </View>
          <View style={styles.separator}></View>
          <View style={styles.addToCarContainer}>
            <TouchableOpacity style={styles.shareButton} onPress={()=> this.clickEventListener()}>
              <Text style={styles.shareButtonText}>Supprimer le compte</Text>  
            </TouchableOpacity>
          </View> 
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    marginTop:20,
  },
  productImg:{
    width:200,
    height:200,
  },
  name:{
    fontSize:28,
    color:"#696969",
    fontWeight:'bold'
  },
  price:{
    marginTop:10,
    fontSize:18,
    color:"green",
    fontWeight:'bold'
  },
  description:{
    textAlign:'center',
    marginTop:10,
    color:"#696969",
  },
  star:{
    width:40,
    height:40,
  },
  btnColor: {
    height:30,
    width:30,
    borderRadius:30,
    marginHorizontal:3
  },
  btnSize: {
    height:60,
    width:60,
    borderRadius:60,
    borderColor:'#778899',
    borderWidth:1,
    marginHorizontal:3,
    backgroundColor: "#00BFFF",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starContainer:{
    justifyContent:'center', 
    marginHorizontal:30, 
    flexDirection:'row', 
    marginTop:20
  },
  contentColors:{ 
    justifyContent:'center', 
    marginHorizontal:30, 
    flexDirection:'row', 
    marginTop:20
  },
  contentSize:{ 
    justifyContent:'center', 
    marginHorizontal:30, 
    flexDirection:'row', 
    marginTop:20
  },
  separator:{
    height:2,
    backgroundColor:"#eeeeee",
    marginTop:20,
    marginHorizontal:30
  },
  shareButton: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:30,
    backgroundColor: "red",
  },
  shareButtonText:{
    color: "#FFFFFF",
    fontSize:20,
  },
  addToCarContainer:{
    marginHorizontal:30
  }
});     