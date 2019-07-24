import React from 'react'
import {StyleSheet, Image } from 'react-native'
import {createSwitchNavigator, createStackNavigator,
 createAppContainer, createBottomTabNavigator,
  createDrawerNavigator} from 'react-navigation'

import VoirDocumentPdf from '../components/VoirDocumentPdf'
import VoirDocumentPdfCaumunaute from '../components/VoirDocumentPdfCaumunaute'

import DetailSeminaire from '../components/DetailSeminaire'
import UserSeminaire from '../components/UserSeminaire'
import FirstRoute from '../components/FirstRoute'
import ChatList from '../components/ChatList'
import Profil from '../components/Profil'
import UserProfilPage from '../components/UserProfilPage'

import LoginM from '../components/LoginM'
import UserProfilInfo from '../components/UserProfilInfo'
import UserIdentifiants from '../components/UserIdentifiants'
import RegisterC from '../components/RegisterC'
import AuthLoading from '../components/AuthLoading'
import Menu from '../components/Menu'
//import UserSeminaire from '../components/UserSeminaire'
import Article from '../components/Article'
import ChatMessage from '../components/ChatMessage'
import Test4 from '../components/Test4'
import ListGlobaleChat from '../components/ListGlobaleChat'

import ListArticle from '../components/ListArticle'
import Commentaire from '../components/Commentaire'
import GestionDesCifopiens from '../components/admin/GestionDesCifopiens'
import GestionDesFormations from '../components/admin/GestionDesFormations'
import GestionDesAffectations from '../components/admin/GestionDesAffectations'
import Affectations from '../components/admin/Affectations'
import AffecDomaine from '../components/admin/AffecDomaine'

import AjoutUtilisateur from '../components/admin/AjoutUtilisateur'
import AjoutArticle from '../components/admin/AjoutArticle'
import GestionArticles from '../components/admin/GestionArticles'


import Administration from '../components/admin/Administration'
import Experts from '../components/admin/Experts'
import ess from '../components/admin/ess'






  
const userSeminaireStackNavigator = createStackNavigator({
    UserSeminaire: {
        screen: UserSeminaire,
        navigationOptions: {
            title: 'Mes Séminaires'
        }
    },

   
})

const ChatStackNavigator = createStackNavigator({
    ChatList:{
        screen: ChatList
    }
})

const MenuStackNavigator = createStackNavigator({
  Menu: {
      screen: Menu,
      navigationOptions: {
          title: 'Menu'
      }
  },

  Test4: {
    screen: Test4,
    navigationOptions: {
        title: 'Menu'
    }
},

ChatList: {
    screen: ChatList,
   
},

ChatMessage: {
    screen: ChatMessage,
   
},

ListGlobaleChat: {
    screen: ListGlobaleChat,
   
},


},
{
  initialRouteName: 'Menu',
  /* The header config from HomeScreen is now here */
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: 'green',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
})

const CommunauteDePratiqueStackNavigator = createStackNavigator({
  ListArticle: {
      screen: ListArticle,
      navigationOptions: {
          title: 'Articles récemment postés'
      }
  },

  VoirDocumentPdfCaumunaute : {
    screen: VoirDocumentPdfCaumunaute
},


  Article: {
    screen: Article,
   
},
Commentaire: {
  screen: Commentaire,
 
}


},{
  initialRouteName: 'ListArticle',
  /* The header config from HomeScreen is now here */
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: 'green',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
})



const ProfilStackNavigator = createStackNavigator({
    Profil: {
        screen: Profil,
        navigationOptions: { 
            title: "Profil"
        }
    },

    UserSeminaire: {
      screen: UserSeminaire,
     
  },

  DetailSeminaire : {
    screen: DetailSeminaire
},
VoirDocumentPdf : {
    screen: VoirDocumentPdf
},

  UserProfilInfo: {
    screen: UserProfilInfo,
    navigationOptions: {
      title: 'Détail de L\' article'
  }, 
},

UserIdentifiants: {
  screen: UserIdentifiants,
  navigationOptions: {
    title: 'Détail de L\' article'
}, 
},

GestionDesCifopiens: {
    screen: GestionDesCifopiens,
    navigationOptions: {
      title: 'Trouver un Cifopien'
  }, 
  },

  UserProfilPage: {
    screen: UserProfilPage,
   
  },

  AjoutUtilisateur: {
    screen: AjoutUtilisateur,
    navigationOptions: {
      title: 'Ajouter un Utilisateur'
  }, 
  },

  GestionDesFormations: {
    screen: GestionDesFormations,
   
  },

  GestionDesAffectations: {
    screen: GestionDesAffectations,
   
  },

  Affectations: {
    screen: Affectations,
   
  },

  GestionArticles: {
    screen: GestionArticles,
   
  },

  AjoutArticle: {
    screen: AjoutArticle,
   
},

  UserProfilPage: {
    screen: UserProfilPage,
   
  },

  

  ess: {
    screen: ess,
   
  },

  
  AffecDomaine: {
    screen: AffecDomaine,
    navigationOptions: {
        title: 'Sélection du domaine'
    },
   
  },

  Administration: {
    screen: Administration,
    navigationOptions: {
      title: 'Menu d\'administration '
  }, 
  },

  Experts: {
    screen: Experts,
    navigationOptions: {
      title: 'Experts'
  }, 
  },

    

},
{
  initialRouteName: 'Profil',
  /* The header config from HomeScreen is now here */
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: 'green',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
}
)


// app bottom tab
const AppStack = createBottomTabNavigator({
 
    Profil: {
        screen: ProfilStackNavigator,
        navigationOptions: {
            title: "Accueil",
            tabBarIcon: () => {
                return <Image 
                    source={require('../components/images/homeP.png')}
                    style={styles.icon}
                />
            },
          
        }
     },

     ListAvecModal: {
      screen: CommunauteDePratiqueStackNavigator,
      navigationOptions: {
          title: "Communauté de pratiques",
          tabBarIcon: () => {
              return <Image 
                  source={require('../components/images/communaute.png')}
                  style={styles.icon}
              />
          },
        
      }
   },

  /*
    UserSeminaire: {
        screen: userSeminaireStackNavigator,
        navigationOptions: {
            title: "Mes Séminaires",
            tabBarIcon: () => {
                return <Image 
                    source={require('../components/images/books.png')}
                    style={styles.icon}
                />
            }
        }
    },

  

    Menu: {
      screen: MenuStackNavigator,
      navigationOptions: {
          title: "Menu",
          tabBarIcon: () => {
              return <Image 
                  source={require('../components/images/menu22.png')}
                  style={styles.icon}
              />
          }
      }
  }
  */
    
},

    { 
        tabBarOptions: {
        activeBackgroundColor: '#DDDDDD',
        inactiveBackgroundColor: '#FFFFFF',
        showLabel: true,
        showIcon: true
        }
    }
)

//const AppStack = createStackNavigator({ Profil: Profil, Congrat: Congrat });
//const AppStack = movieTabNavigator({ Profil: Profil, Congrat: Congrat });


const AuthStack = createStackNavigator({ LoginM: LoginM, RegisterC: RegisterC });

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoading,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));

const styles = StyleSheet.create({
    icon: {
        width: 30,
        height: 30
    }
})

//export default createAppContainer(DrawerNavigatorExample)