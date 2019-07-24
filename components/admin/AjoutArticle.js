
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
  ScrollView,
  AsyncStorage,
} from 'react-native';
import API from '../api/serviceLocal'
import { connect } from 'react-redux'
import { Image, CheckBox, Icon, Avatar } from 'react-native-elements'
import ImagePicker from 'react-native-image-picker'
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob'


const options = {
  title: 'Ajouter une image a cet article',
  cancelButtonTitle: 'Annuler',
  takePhotoButtonTitle: 'Prendre une photo',
  chooseFromLibraryButtonTitle: 'Choisir dans la galérie',
  mediaType: 'photo',
  allowsEditing: true,
  noData: true,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

var FileUpload = require('NativeModules').FileUpload;


class AjoutArticle extends Component {

  static navigationOptions = {
    title: 'Ajouter un article',
    headerStyle: {
      backgroundColor: 'green',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };



  constructor(props) {
    super(props);
    this.state = {

      titre: '',
      description: '',
      lien: null,
      fichier: null,
      image: null,
      publie: false,
      nomFichier: null,
      loginIsPressed: false,
      fichier_selected: null,
      nouvel_article: undefined


    }
  }

  onClickListener = (viewId) => {
    Alert.alert("Alert", "Button pressed " + viewId);
  }

  ajouterArticle = async () => {
    if (this.state.titre.length > 0 && this.state.description.length > 0) {
      this.setState({ loginIsPressed: true })
      await API.post('/ajouter_article_text/' + this.props.user.id, {
        titre: this.state.titre,
        description: this.state.description,
        lienVideo: this.state.lien,
        nomFichier: this.state.nomFichier,
        active: this.state.publie

      })
        .then((responseJson) => {
          if (responseJson.status === 201) {
            data = responseJson.data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
            responseFinal = JSON.parse(data)
            // console.log( tb.user.name)
            let article = responseFinal

            this.setState({ loginIsPressed: false, nouvel_article: article },
              () => {
                let nouvel_article = this.state.nouvel_article
                let image = this.state.image
                let fichier = this.state.fichier

                if (nouvel_article !== undefined) {
                  // image
                  if (image !== null) {
                    this.uploadPhoto(image, nouvel_article.id)
                  }

                  // fichier
                  /*
                  if (fichier !== null) {
                    this._uploadFichier(fichier, nouvel_article.id)
                  }
                  */
                  
                }


              }
            )


          } // fin if 
          else if (responseJson.status === 401) {
            Alert.alert(
              'Erreur',
              'Les Champs ne sont pas correctement renseignés !',
              [
                { text: 'OK', onPress: () => { } },
              ],
              { cancelable: false },
            );
          }
        })
        .catch((error) => {

          console.error(error);
          this.setState({ loginIsPressed: false })
          Alert.alert(
            'Erreur',
            'Les Champs ne sont pas correctement renseignés .',
            [
              { text: 'OK', onPress: () => { } },
            ],
            { cancelable: false },
          );
        });
    } else {
      Alert.alert(
        'Erreur',
        'Veuillez renseigner tous les champs !',
        [
          { text: 'OK', onPress: () => { } },
        ],
        { cancelable: false },
      );
    }
  }

  uploadPhoto = async (response, id_article) => {
    await RNFetchBlob
     // .config({ timeout: 60000 })

    //  .fetch('POST', 'http://127.0.0.1:3000/api/ajouter_article_image/' + id_article, {
        .fetch('POST', 'https://leprojetbaobab.com/api/ajouter_article_image/' + id_article, {

        // Authorization: "Bearer access-token",
        // otherHeader: "foo",
        'Content-Type': 'multipart/form-data',
      }, [

          // custom content type
          { name: 'lienDoc', filename: response.fileName, data: RNFetchBlob.wrap(response.path) },

        ]).then((resp) => {
          // ...
          console.log(resp.data)
        }).catch((err) => {
          // ...
          console.log(err)
        })
  }


  onClickListener = () => {
    Alert.alert("Erreur", "Veuillez renseigner tous les champs ");
  }

  _loginErreur = () => {
    Alert.alert("Erreur", "Erreur Vérifiez vos identifiants ");
  }

  _buttonConnexion = () => {
    if (!this.state.loginIsPressed) {
      return (

        <TouchableOpacity style={[styles.buttonContainer, styles.sendButton]} onPress={this.ajouterArticle} >
          <Text style={styles.buttonText}>Enregistrer</Text>
        </TouchableOpacity>

      )
    }
  }

  _buttonChargement = () => {
    if (this.state.loginIsPressed) {
      return (
        <TouchableOpacity style={[styles.buttonContainer, styles.sendButton]} onPress={this.loginUser}>
          <Text style={styles.buttonText}>Chargement...</Text>
          <Image source={require('../images/loadGif.gif')} />

        </TouchableOpacity>
      )
    }
  }

  _choisirImage = () => {
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        // console.log('L\'utilisateur a annulé')
        return
      } else if (response.error) {
        // console.log('Erreur: ', response.error)
        return
      } else {
        // console.log('Photo : ', response)
        // let requireSource = { uri: response.uri }
        this.setState({ image: response })

      }
    })
  }

  _choisirFichier = () => {
    DocumentPicker.show({
      filetype: [DocumentPickerUtil.allFiles()],
    }, (error, res) => {

      this.setState({ fichier_selected: res.fileName, fichier: res })


     // let url = res.uri; //The url you received from the DocumentPicker

      /*
      const split = url.split('/');
      const name = split.pop();
      const inbox = split.pop();
      const realPath = `${RNFS.DocumentDirectoryPath}${url}`;
       RNFS.stat(RNFS.DocumentDirectoryPath + res.uri).then((resp, erro) => {
        console.log(resp)
        console.log(erro)
      })
      */

      // Android
      console.log(
        // res.uri,
        // res.type, // mime type
        // res.fileName,
        // res.fileSize
        res,
      );

    }
    );
  }

  _uploadFichier2 = (response, id_article) => {
    var obj = {
      uploadUrl: 'http://127.0.0.1:3000/api/ajouter_article_fichier/' + id_article,
     // uploadUrl: 'http://leprojetbaobab.com/api/ajouter_article_fichier/' + id_article,

      method: 'POST', // default 'POST',support 'POST' and 'PUT'
      headers: {
        'Accept': 'application/json',
      },
      fields: {
          'hello': 'world',
      },
      files: [
        {
          name: 'lienTexte', // optional, if none then `filename` is used instead
          filename: response.fileName, // require, file name
          filepath: '/xxx/one.w4a', // require, file absoluete path
          filetype: 'audio/x-m4a', // options, if none, will get mimetype from `filepath` extension
        },
      ]
  };

  FileUpload.upload(obj, function(err, result) {
    console.log('upload:', err, result);
  })
  }

  _uploadFichier = (response, id_article) => {
    
  //  let url = response.uri; //The url you received from the DocumentPicker


    // I STRONGLY RECOMMEND ADDING A SMALL SETTIMEOUT before uploading the url you just got.
    /*
    const split = url.split('/');
    const name = split.pop();
    const inbox = split.pop();
    const realPath = `${RNFS.TemporaryDirectoryPath}${inbox}/${name}`;
    */
    /*
    const uploadBegin = (response) => {
      const jobId = response.jobId;
      console.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
    };

    const uploadProgress = (response) => {
      const percentage = Math.floor((response.totalBytesSent / response.totalBytesExpectedToSend) * 100);
      console.log('UPLOAD IS ' + percentage + '% DONE!');
    };
    */

   let uploadUrl = 'http://127.0.0.1:3000/api/ajouter_article_fichier/' + id_article


   const chemin = `file://${RNFetchBlob.fs.dirs.SDCardDir}/${response.fileName}`;


    RNFS.uploadFiles({
      toUrl: uploadUrl,
      files: [{
        name: 'lienTexte',
        filename: response.fileName,
        filepath: chemin,
      }],
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',

      },
     // begin: uploadBegin,
     // beginCallback: uploadBegin, // Don't ask me, only way I made it work as of 1.5.1
     // progressCallback: uploadProgress,
     // progress: uploadProgress
    })
    /*
      .then((response) => {
        console.log(response, "<<< Response");
        if (response.statusCode == 200) { //You might not be getting a statusCode at all. Check
          console.log('FILES UPLOADED!');
        } else {
          console.log('SERVER ERROR');
        }
      })
      */
     /*
      .catch((err) => {
        if (err.description) {
          switch (err.description) {
            case "cancelled":
              console.log("Upload cancelled");
              break;
            case "empty":
              console.log("Empty file");
            default:
            //Unknown
          }
        } else {
          //Weird
        }
        console.log(err);
      });
      */
  }

  retirerImage = () => {
    Alert.alert(
      'Confirmation',
      'Rétirer L\'image ?',
      [
        // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
        {
          text: 'Annuler',
          onPress: () => { },
          style: 'cancel',
        },
        { text: 'Oui', onPress: () => this.setState({ image: null }) },
      ],
      { cancelable: false },
    );
  }

  render() {
    return (
      <ScrollView style={{ backgroundColor: '#DCDCDC' }}>

        <View style={styles.container}>

          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
              multiline={true}
              placeholder="Titre"
              underlineColorAndroid='transparent'
              onChangeText={(titre) => this.setState({ titre })} />
          </View>

          <View style={styles.inputContainero}>
            <TextInput style={styles.inputso}
              multiline={true}
              placeholder="Contenu"

              underlineColorAndroid='transparent'
              onChangeText={(description) => this.setState({ description })} />
          </View>


          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
              multiline={true}
              placeholder="Lien à suivre"
              underlineColorAndroid='transparent'
              onChangeText={(lien) => this.setState({ lien })} />
          </View>
          <View style={styles.inputContainera}>

            <CheckBox
              title='Publication immédiate                       '
              checked={this.state.publie}
              onPress={() => this.setState({ publie: !this.state.publie })}

            />
          </View>

          <View style={styles.inputContainera}>
            <Icon
              raised
              name='camera'
              type='font-awesome'
              color='#414141'
              onPress={() => this._choisirImage()} />

              {/*
               <Icon
              raised
              name='paperclip'
              type='font-awesome'
              color='#414141'
              onPress={() => this._choisirFichier()} />
           
            <Text numberOfLines={1}>{this.state.fichier_selected !== null ? this.state.fichier_selected : null}</Text>
           */}

           
          </View>



          {/*(this.state.fichier_selected !== null) ? (
            <View style={styles.inputContainer}>
              <TextInput style={styles.inputs}
                placeholder="Donnez un nom au fichier"
                underlineColorAndroid='transparent'
                onChangeText={(nomFichier) => this.setState({ nomFichier })} />
            </View>
          ) : null */}




          {(this.state.image !== null) ? (
            <View style={{ marginBottom: 5 }}>
              <Avatar source={{ uri: this.state.image.uri }}
                onLongPress={() => this.retirerImage()}
                style={{ width: 100, height: 100 }} />
            </View>
          ) : null}

          {this._buttonChargement()}
          {this._buttonConnexion()}




        </View>
      </ScrollView >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
  },
  logo: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    marginBottom: -20,
    marginTop: -90,

  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 300,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },

  inputContainera: {
    borderRadius: 30,
    width: 300,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },

  inputContainero: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 300,
    height: 60,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },

  inputso: {
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 200,
    borderRadius: 30,
  },
  sendButton: {
    backgroundColor: "blue",
  },
  buttonText: {
    color: 'white',
  }
});

const mapStateToProps = state => {
  return {
    user: state.setUser.user
  }
}

export default connect(mapStateToProps)(AjoutArticle)

