import React from 'react';
import { StyleSheet, Dimensions, View, Text } from 'react-native';
 
import Pdf from 'react-native-pdf';
 
export default class VoirDocumentPdfCaumunaute extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            totalPage: undefined,
            pageCourante: undefined

        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
          title: navigation.getParam('nom_document', 'Fichier PDF'),
        };
      };

    render() {
       // const source = {uri:'http://samples.leanpub.com/thereactnativebook-sample.pdf',cache:true};
      // const ur = 'https://leprojetbaobab.com/uploads/docs/'
        const source2 = {
            uri: this.props.navigation.state.params.fichier.lienTexte,
            cache: true
         }
        //const source = require('./test.pdf');  // ios only
        //const source = {uri:'bundle-assets://test.pdf'};
 
        //const source = {uri:'file:///sdcard/test.pdf'};
        //const source = {uri:"data:application/pdf;base64,..."};
 
        return (
            <View style={styles.container} >

           
            {(this.state.pageCourante !== undefined && this.state.totalPage !== undefined) ? (
                 <View style={{flex: 0.5}}>
                 <Text style={{color: 'red'}}>page  {this.state.pageCourante} sur {this.state.totalPage} au total</Text>
             </View>
            ): null}

            <Pdf
            
        source={source2}
        onLoadComplete={(numberOfPages,filePath)=>{
           // console.log(`number of pages: ${numberOfPages}`);
           this.setState({totalPage: numberOfPages})
        }}
        onPageChanged={(page,numberOfPages)=>{
           // console.log(`current page: ${page}`);
           this.setState({pageCourante: page})

        }}
        onError={(error)=>{
           // console.log(error);
        }}
        style={styles.pdf}/> 
        </View>
        )
  }
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex:9,
        width:Dimensions.get('window').width,
    },
    share_touchable_floatingactionbutton: {
        position: 'absolute',
        width: 60,
        height: 60,
        right: 30,
        bottom: 30,
        borderRadius: 30,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center'
      },
});