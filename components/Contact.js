import React, { Component } from 'react';
import {StyleSheet, View, Text, Button, ScrollView, FlatList, PermissionsAndroid} from 'react-native'
import Contacts from 'react-native-contacts'


class Contact extends Component {

    constructor(props){
        super(props)

        this.state = {
            contacts: null
        }
    }

    componentDidMount(){
        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
                title: 'Contacts',
                message: 'Cette Application voudrais acceder à vos contacts.'
            }
        ).then(() => {
            Contacts.getAll((err, contacts) => {
                if(err === 'denied'){

                }else{
                    this.setState({contacts})
                }
            })
        })
    }

    render() {
        //console.log(this.state.contacts)
        return (
            <View style={styles.container}>
                <FlatList 
                    data={this.state.contacts}
                    renderItem={({item}) => (
                        <View>
                        <Text style={styles.contact_details}>
                          Nom: {`${item.givenName} `} Prenom: {item.familyName} 
                        </Text>
                        {item.phoneNumbers.map(phone => (
                          <Text style={styles.phones}>{phone.label} : {phone.number}</Text>
                        ))}
                      </View>
                    )}

                      //Setting the number of column
                     numColumns={1}
                    keyExtractor={(item) => item.rawContactId.toString()}

                />
                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        marginTop:30,
      },
      phones: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
      },
      contact_details: {
        textAlign: 'center',
        color: 'red',
        margin: 10,
      },
})

export default Contact;