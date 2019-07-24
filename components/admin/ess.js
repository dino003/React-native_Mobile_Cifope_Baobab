import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Dimensions,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView
} from 'react-native';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      numColumns:3,
      userSelected:{},
      modalVisible:false,
      data: [
        {id:1,  image:"https://bootdey.com/img/Content/avatar/avatar1.png"}, 
        {id:2,  image:"https://bootdey.com/img/Content/avatar/avatar2.png"}, 
        {id:3,  image:"https://bootdey.com/img/Content/avatar/avatar3.png"}, 
        {id:4,  image:"https://bootdey.com/img/Content/avatar/avatar4.png"}, 
        {id:5,  image:"https://bootdey.com/img/Content/avatar/avatar5.png"}, 
        {id:6,  image:"https://bootdey.com/img/Content/avatar/avatar6.png"}, 
        {id:7,  image:"https://bootdey.com/img/Content/avatar/avatar7.png"}, 
        {id:8,  image:"https://bootdey.com/img/Content/avatar/avatar1.png"}, 
        {id:9,  image:"https://bootdey.com/img/Content/avatar/avatar2.png"}, 
        {id:10, image:"https://bootdey.com/img/Content/avatar/avatar3.png"},
      ]
    };
  }

  clickEventListener = (item) => {
    this.setState({userSelected: item}, () =>{
      this.setModalVisible(true);
    });
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  renderItem = ({item, index}) => {
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    var itemDimension = Dimensions.get('window').width / this.state.numColumns;
    return (
      <TouchableOpacity style={[styles.item, {height: itemDimension}]} onPress={() => {this.clickEventListener(item)}}>
       <View>
       <Text style={{color: 'red'}}>nom a afficher</Text>

       <Image style={{height:itemDimension - 2, width:itemDimension - 2}} source={{uri: item.image}}/>
       </View>
       
      </TouchableOpacity>
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

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.formatRow(this.state.data, this.state.numColumns)}
          keyExtractor= {(item) => {
            return item.id;
          }}
          renderItem={this.renderItem}
          numColumns={this.state.numColumns}/>

        <Modal
          animationType={'fade'}
          transparent={true}
          onRequestClose={() => this.setModalVisible(false)}
          visible={this.state.modalVisible}>

          <View style={styles.popupOverlay}>
            <View style={styles.popup}>
              <View style={styles.popupContent}>
                <ScrollView contentContainerStyle={styles.modalInfo}>
                  <Image style={{width:400, height:400}} source={{uri: this.state.userSelected.image}}/>
                </ScrollView>
              </View>
              <View style={styles.popupButtons}>
                <TouchableOpacity onPress={() => {this.setModalVisible(false) }} style={styles.btnClose}>
                  <Text style={styles.txtClose}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
  },
  item: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },

 /************ modals ************/
  popup: {
    backgroundColor: 'white',
    marginTop: 80,
    marginHorizontal: 20,
    borderRadius: 7,
  },
  popupOverlay: {
    backgroundColor: "#00000057",
    flex: 1,
    marginTop: 20
  },
  popupContent: {
    //alignItems: 'center',
    margin: 5,
    height:500,
  },
  popupHeader: {
    marginBottom: 45
  },
  popupButtons: {
    marginTop: 15,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: "#eee",
    justifyContent:'center'
  },
  popupButton: {
    flex: 1,
    marginVertical: 16
  },
  btnClose:{
    height:20,
    backgroundColor:'#20b2aa',
    padding:20
  },
  modalInfo:{
    alignItems:'center',
    justifyContent:'center',
  }
});