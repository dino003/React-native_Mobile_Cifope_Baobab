import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  //Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Modal,
  Dimensions,
  Platform,
  PermissionsAndroid 

} from 'react-native';
import SearchInput, { createFilter } from 'react-native-search-filter';
import API from './api/service2'
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import {connect} from 'react-redux'
import RNFS from 'react-native-fs';
import { Image  } from 'react-native-elements'
import moment from 'moment'


import FileViewer from 'react-native-file-viewer';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';



const KEYS_TO_FILTERS = ['titre_fichier'];


 class DetailSeminaire extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('nom_seminaire', 'Détail séminaire'),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
     
      searchTerm: '',
      seminaire: {
        documents_du_seminaire: [],
        users_seminaires_par_suivre: []
      },
      loading: false

    };
  }

  
 getLocalPath (url) {
  const filename = url.split('/').pop();
  // feel free to change main path according to your requirements
  return `${RNFS.DocumentDirectoryPath}/${filename}`;
   //return RNFS.DocumentDirectoryPath + '/' + filename
}

voirDocumentPdf = (fichier) => {
  // console.log("film id = " + idFilm)
 // this.props.navigation.setParams({nom_seminaire: seminaire.id})

   this.props.navigation.navigate("VoirDocumentPdf", {fichier: fichier, nom_document: fichier.titre_fichier})
}




  _telecharger_et_ouvrir = async (url) => {
    const localFile = this.getLocalPath(url);

    const options = {
      fromUrl: url,
      toFile: localFile,
      connectionTimeout: 60 * 1000,
      readTimeout: 120 * 1000
    };

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'CIFOPE BAOBAB',
          message:
            'CIFOPE BAOBAB Voudrais acceder a vos fichiers  ' +
            'Ainsi vous pourrez sauvegarder vos documents.',
          buttonNegative: 'Refuser',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        RNFS.downloadFile(options).promise
        .then(() => FileViewer.open(localFile))
        .then(() => {
          // success
        })
        .catch(error => {
          // error
        });
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
    //const url = 'https://www.adobe.com/content/dam/Adobe/en/devnet/pdf/pdfs/PDF32000_2008.pdf';


    
  }

  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }

  componentDidMount(){
   // console.log('salut')
   this.getSeminaire()
   console.log(this.props.navigation.params)

  }

  getSeminaire = async () => {
    this.setState({loading: true})
    await API.get('/voir_seminaire/' + this.props.navigation.state.params.seminaire.id)
     .then((responseJson) => {
         if(typeof responseJson.data === 'string'){
            data = responseJson.data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
            responseFinal = JSON.parse(data)
           // console.log(responseFinal)

           // console.log( tb.user.name)
                 let article_recus = responseFinal
                // console.log(article_recus)
                 this.setState({
                    loading: false,
                    seminaire: article_recus
                })
         
         }else{
             this.setState({
                 loading: false,
                 seminaire: responseJson.data
             })

         }
      
     })
     .catch((error) => {
       console.error(error);
     });
  }

  _showIconeFichier(item){
    if(item.type_document === 'Adobe Acrobat Document'){
      return (
        <Image source={require('./images/type_fichiers/pdfi.png')} style={styles.pic} />

      )
    }
    else if(item.type_document === 'Document Microsoft Excel'){
      return (
        <Image source={require('./images/type_fichiers/Excel.png')} style={styles.pic} />

      )
    }
    else if(item.type_document === 'Document Microsoft Word'){
      return (
        <Image source={require('./images/type_fichiers/word.png')} style={styles.pic} />

      )
    }
    else if(item.type_document === 'Archive winrar zip'){
      return (
        <Image source={require('./images/type_fichiers/zip.png')} style={styles.pic} />

      )
    }
    else if(item.type_document === 'Document Microsoft PowerPoint'){
      return (
        <Image source={require('./images/type_fichiers/point.png')} style={styles.pic} />

      )
    }
    else if(item.type_document === 'Document Microsoft MS Projet'){
      return (
        <Image source={require('./images/type_fichiers/projet.png')} style={styles.pic} />

      )
    }else{
      return (
        <Image source={require('./images/type_fichiers/Contract.png')} style={styles.pic} />

      )
    }

  }

  testFile(){
    // get a list of files and directories in the main bundle
RNFS.readDir(RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
.then((result) => {
  console.log('GOT RESULT', result);

  // stat the first file
  return Promise.all([RNFS.stat(result[0].path), result[0].path]);
})
.then((statResult) => {
  if (statResult[0].isFile()) {
    // if we have a file, read it
    return RNFS.readFile(statResult[1], 'utf8');
  }

  return 'no file';
})
.then((contents) => {
  // log the file contents
  console.log(contents);
})
.catch((err) => {
  console.log(err.message, err.code);
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

  _showSeminaire = () => {

    const documents = this.state.seminaire
   // console.log(seminaire)

    if(documents.documents_du_seminaire.length > 0){
      const filteredEmails = documents.documents_du_seminaire.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))

    return (
      <ScrollView>
      {filteredEmails.map(item => {
        return (
          <TouchableOpacity onPress={()=> this.voirDocumentPdf(item)} key={item.id.toString()} style={styles.emailItem}>
            
            <View style={styles.row}>
          {this._showIconeFichier(item)}
      <View>
        <View style={styles.nameContainer}>
          <Text numberOfLines={2} style={styles.nameTxt}>{item.titre_fichier ? item.titre_fichier : item.nom_fichier}</Text>
        </View>
        <View style={styles.end}>
          <Text style={styles.time} numberOfLines={1}>{moment(item.created_at).format('DD/MM/YYYY')} par {item.user.prenom} {item.user.name} </Text>
        </View>
      </View>
    </View>
          </TouchableOpacity>
        )
      })}
    </ScrollView>
    )
  }else if(documents.documents_du_seminaire.length < 0 && !this.state.loading){
    return (
      <View style={{flex: 1}}><Text style={{textAlign: 'center', color: 'blue'}}> Aucun Document enregistré dans cette section</Text></View>
    )
  }
  }

 

  showVideoIcon(item){
    if(!item.video){
       callIcon = "https://img.icons8.com/color/48/000000/phone.png";

    }else {
      callIcon = "https://img.icons8.com/color/48/000000/video-call.png";
    }

    return (
      <Image style={[styles.icon, { marginRight: 50 }]} source={{uri: callIcon}}/>

    )
  }

  // les functions partie seminaristes
  renderItemSeminaristes = ({item}) => {
    const seminaristes = this.state.seminaire.users_seminaires_par_suivre

    if(seminaristes.length > 0){
      if(item.etu && !item.prof && !item.admin ){
        return (

          
          <TouchableOpacity >
            <View style={styles.rowa}>
            <Image source={{uri: item.url_photo + item.photo}} style={styles.pica}  PlaceholderContent={<ActivityIndicator />} />
              <View>
                <View style={styles.nameContainera}>
                  <Text style={styles.nameTxta} numberOfLines={1} ellipsizeMode="tail">{item.prenom} {item.name}</Text>
                  <Text numberOfLines={1} style={styles.mblTxta}>{item.profession ? item.profession : ''}</Text>
                </View>
                 
                <View style={styles.msgContainera}>
                  <Text numberOfLines={1} style={styles.msgTxta}>{item.email}</Text> 
                </View>
                
              </View>
            </View>
          </TouchableOpacity>
        );
      }
    }else{
      return (
        <View style={{flex: 1}}><Text style={{textAlign: 'center', color: 'blue'}}> Aucun Séminariste dans cette section</Text></View>
      )
    } 
   
  }

 

  // fin functions partie seminaristes

   // les functions partie experts
   renderItemExperts = ({item}) => {
    const seminaristes = this.state.seminaire.users_seminaires_par_suivre

    if(seminaristes.length > 0){
      if(item.prof){
        return (
          <TouchableOpacity>
            <View style={styles.rowa}>
              <Image source={{uri: item.url_photo + item.photo}} style={styles.pica} />
              <View>
                <View style={styles.nameContainera}>
                  <Text style={styles.nameTxta} numberOfLines={1} ellipsizeMode="tail">{item.prenom} {item.name}</Text>
                  <Text numberOfLines={1} style={styles.mblTxta}>{item.profession ? item.profession : ''}</Text>
                </View>
                <View style={styles.msgContainera}>
                <Text numberOfLines={1} style={styles.msgTxta}>{item.email}</Text> 

                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      }
    }else{
      return (
        <View style={{flex: 1}}><Text style={{textAlign: 'center', color: 'blue'}}> Aucun Séminariste dans cette section</Text></View>
      )
    }

  
   
  }


  // fin functions partie experts

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
  <View style={styles.container} tabLabel="Documents">
        <View >
        <SearchInput 
          onChangeText={(term) => { this.searchUpdated(term) }} 
          style={styles.searchInput}
          placeholder="Taper pour rechercher "
          />
          </View>
            {this._showSeminaire()}
            {this._displayLoading()}

      </View>
   <View style={{ flex: 1 }} tabLabel="Séminaristes">
        <FlatList 
          extraData={this.state}
          data={this.state.seminaire.users_seminaires_par_suivre}
          keyExtractor = {(item) => {
            return item.id.toString();
          }}
          renderItem={this.renderItemSeminaristes}/>
      </View>

      <View style={{ flex: 1 }} tabLabel="Experts">
        <FlatList 
          extraData={this.state}
          data={this.state.seminaire.users_seminaires_par_suivre}
          keyExtractor = {(item) => {
            return item.id.toString();
          }}
          renderItem={this.renderItemExperts}/>
          
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

export default connect(mapStateToProps)(DetailSeminaire)