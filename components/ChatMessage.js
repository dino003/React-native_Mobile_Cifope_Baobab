import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  TextInput,
  FlatList,
  Button,
  TouchableHighlight
} from 'react-native';
import API from './api/service'
import {connect} from 'react-redux'
import moment from 'moment'

 class ChatMessage extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('ami_conversation', 'Messages'),

      
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [
        {id:1, date:"9:50 am", type:'in',  message: "Lorem ipsum dolor sit amet dtvfyvhbfh vhv uggfu  g ugp  ub   euug ygg ybdfvzp  ggyb gybuy__  yy e  gggeu  ççgyg"},
        {id:2, date:"9:50 am", type:'out', message: "Lorem ipsum dolor sit amet"} ,
        {id:3, date:"9:50 am", type:'in',  message: "Lorem ipsum dolor sit a met"}, 
        {id:4, date:"9:50 am", type:'in',  message: "Lorem ipsum dolor sit a met"}, 
        {id:5, date:"9:50 am", type:'out', message: "Lorem ipsum dolor sit a met"}, 
        {id:6, date:"9:50 am", type:'out', message: "Lorem ipsum dolor sit a met"}, 
        {id:7, date:"9:50 am", type:'in',  message: "Lorem ipsum dolor sit a met"}, 
        {id:8, date:"9:50 am", type:'in',  message: "Lorem ipsum dolor sit a met"},
        {id:9, date:"9:50 am", type:'in',  message: "Lorem ipsum dolor sit a met"},
      ],

      loading: false,
      conversation: [],
      message: '',
      session: {},
      aucunMessage: false
    };
  }

  componentDidMount(){
    this.getConversations();

    this.interval = setInterval(() => {
        this.getConversationsRecharge()         
    }, 3000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  posterMessage = async () => {
    if(this.state.message.length > 0){
      await API.post('/ajouter_message_chat', {
        emmeteur: this.props.user.id,
        receveur : this.props.navigation.state.params.partenaire.id,
        message: this.state.message,
        session: this.props.navigation.state.params.session_id
      })
       .then((responseJson) => {
           if(typeof responseJson.data === 'string'){
              data = responseJson.data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
              responseFinal = JSON.parse(data)
             // console.log( tb.user.name)
                   let article_recus = responseFinal
                 
                  this.setState(() => ({
                    conversation: [
                      article_recus, 
                      ...this.state.conversation

                    ],
                  }))
                  this.setState({message: ''})

           
           }else{
             
               this.setState(() => ({
                conversation: [
                  responseJson.data, 
                  ...this.state.conversation

                ],
              }))
               this.setState({message: ''})

  
           }
        
       })
       .catch((error) => {
         console.error(error);
       });
    }else{
      alert('Veuillez saisir du texte pour ensuite le poster')

    }

   

  }


  getConversations = async () => {
   //const session_id =  this.props.navigation.state.params.session_id
    if(this.props.navigation.state.params.session_id !== undefined){
      this.setState({loading: true})
      await API.get('/messages_session_chat/' + this.props.navigation.state.params.session_id)
       .then((responseJson) => {
           if(typeof responseJson.data === 'string'){
              data = responseJson.data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
              resultats = JSON.parse(data)
             // session = JSON.parse(data.session)
  
             // console.log( tb.user.name)
                   let conversation_recu = resultats.conversations
                   let session_recu = resultats.session
  
                   this.setState({
                      loading: false,
                      conversation: conversation_recu,
                      session: session_recu
                  })
  
           
           }else{
               this.setState({
                   loading: false,
                   conversation: responseJson.data.conversations,
                   session: responseJson.data.session
               })
  
  
  
           }
        
       })
       .catch((error) => {
         console.error(error);
       });
    }else{
      this.setState({aucunMessage: true})
    }
   
  }

  getConversationsRecharge = async () => {
    //const session_id =  this.props.navigation.state.params.session_id
       await API.get('/messages_session_chat/' + this.props.navigation.state.params.session_id)
        .then((responseJson) => {
            if(typeof responseJson.data === 'string'){
               data = responseJson.data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
               resultats = JSON.parse(data)
                       let conversation_recu = resultats.conversations
                    let session_recu = resultats.session
   
                    this.setState({
                       loading: false,
                       conversation: conversation_recu,
                       session: session_recu
                   })
   
            
            }else{
                this.setState({
                    loading: false,
                    conversation: responseJson.data.conversations,
                    session: responseJson.data.session
                })
   
            }
         
        })
        .catch((error) => {
          console.error(error);
        });
     
    
   }

  messageNonConversation(){
    if(this.state.aucunMessage){
      return (
        <View style={styles.containera}>
          <Image style={styles.icona} source={require('../components/images/okMain.png')} />
          <Text style={styles.titlea}>Congratulation, your order is accepted</Text>
          <Text style={styles.descriptiona}>Lorem ipsum dolor sit amet, sed te sumo euismod, doming molestiae consetetur nec ne. Cu quem aeterno labores eos</Text>
          <TouchableHighlight style={[styles.buttonContainera, styles.loginButtona]} onPress={() => this.clickListener('login')}>
            <Text style={styles.buttonTexta}>Continue</Text>
          </TouchableHighlight>
        </View>
      )
    }
 
  }

  renderDate = (date) => {
   // let inMessage = item.emmeteur_du_message.id !== this.props.user.id;

   // let timeStyle = inMessage ? styles.time: styles.time2
    return(
      <Text style={styles.time} numberOfLines={1}>
        {date}
      </Text>
    );
  }

  render() {

    return (
      <View style={styles.container}>
        <FlatList style={styles.list}
          data={this.state.conversation}
          inverted={true}
          keyExtractor= {(item) => {
            return item.id.toString();
          }}
          renderItem={(message) => {
            console.log(item);
            const item = message.item;
            let inMessage = item.emmeteur_du_message.id !== this.props.user.id;
            let itemStyle = inMessage ? styles.itemIn : styles.itemOut;
            return (
              <View style={[styles.item, itemStyle]}>
                <View style={[styles.balloon]}>
                  <Text style={{color: item.emmeteur_du_message.id === this.props.user.id ? '#fff' : 'black'}}>
                  {item.message} </Text>
                </View>
                <View>
                {inMessage && this.renderDate(moment(item.created_at).format('HH:mm'))}
                {!inMessage && this.renderDate(moment(item.created_at).format('HH:mm'))}
                </View>
                

              </View>
            )
          }}/>
        <View style={styles.footer}>
          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
                value={this.state.message}
                placeholder="Ecrivez votre message..."
                underlineColorAndroid='transparent'
                onChangeText={(message) => this.setState({message})}/>
          </View>

            <TouchableOpacity style={styles.btnSend} onPress={() => this.posterMessage()}>
              <Image source={require('./images/envoye-chat.png')} style={styles.iconSend}  />
            </TouchableOpacity>
        </View>
        {this.messageNonConversation()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  list:{
    paddingHorizontal: 17,

  },
  footer:{
    flexDirection: 'row',
    height:60,
    backgroundColor: '#eeeeee',
    paddingHorizontal:10,
    padding:5,
  },
  btnSend:{
    backgroundColor:"#00BFFF",
    width:40,
    height:40,
    borderRadius:360,
    alignItems:'center',
    justifyContent:'center',
  },
  iconSend:{
    width:30,
    height:30,
    alignSelf:'center',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius:30,
    borderBottomWidth: 1,
    height:40,
    flexDirection: 'row',
    alignItems:'center',
    flex:1,
    marginRight:10,
  },
  inputs:{
    height:40,
    marginLeft:16,
    borderBottomColor: '#FFFFFF',
    flex:1,
  },
  balloon: {
    maxWidth: 250,
    padding: 15,
    borderRadius: 10,
    color: '#fff'

  },
  itemIn: {
    alignSelf: 'flex-start',
    backgroundColor:"#eeeeee",

  },
  itemOut: {
    alignSelf: 'flex-end',
    backgroundColor:"#1E7FCB",

  },
  time: {
    alignSelf: 'flex-end',
    margin: 15,
    fontSize:12,
    color:"#808080",
  },

  time2: {
    alignSelf: 'flex-start',
    margin: 15,
    fontSize:12,
    color:"#808080",
  },
  item: {
    marginVertical: 14,
    flex: 1,
    flexDirection: 'row',
    borderRadius:300,
    padding:5,
    width: 300,
  },

  // partie autre quand il n'ya aucun message
  containera: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    paddingTop:50,
  },
  icona:{
    width:200,
    height:200,
  },
  titlea:{
    fontSize:24,
    textAlign: 'center',
    marginTop:22,
    color: "#5F6D7A"
  },
  descriptiona: {
    marginTop:20,
    textAlign: 'center',
    color: "#A9A9A9",
    fontSize:16,
    margin:40,
  },
  buttonContainera: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
  },
  loginButtona: {
    backgroundColor: "#3498db",
  },
  buttonTexta: {
    color: "#FFFFFF",
    fontSize:20,
  }
}); 

const mapStateToProps = state => {
  return {
      avatar: state.setAvatar.avatar,
      user: state.setUser.user
  }
}

export default connect(mapStateToProps)(ChatMessage)