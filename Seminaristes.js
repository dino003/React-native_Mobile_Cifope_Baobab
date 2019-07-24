import React, { Component } from 'react';
import {
View,
TouchableOpacity,
Image,
Text,
FlatList
} from 'react-native'
import API from './components/api/service'

class Seminaristes extends Component {

    constructor(props){
        super(props)

        this.state = {
            seminaristes: []
        }
    }

    

    renderItemSeminaristes = ({item}) => {
        const seminaristes = this.state.seminaire.users_seminaires_par_suivre
    
        if(seminaristes.length > 0){
          if(item.etu && !item.prof && !item.admin && item.id !== this.props.user.id){
            return (
              <TouchableOpacity >
                <View style={styles.rowa}>
                <Image source={{uri: item.user_avatar.photo_url}} style={styles.pica} />
                  <View>
                    <View style={styles.nameContainera}>
                      <Text style={styles.nameTxta} numberOfLines={1} ellipsizeMode="tail">{item.prenom} {item.name}</Text>
                      <Text numberOfLines={1} style={styles.mblTxta}>{item.profession ? item.profession : ''}</Text>
                    </View>
                    <View style={styles.msgContainera}>
                      <Text style={styles.msgTxta}>en ligne</Text>
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

    render() {
        return (
            <FlatList 
            extraData={this.state}
            data={this.state.seminaristes}
            keyExtractor = {(item) => {
              return item.id.toString();
            }}
            renderItem={this.renderItemSeminaristes}/>
        );
    }
}

export default Seminaristes;