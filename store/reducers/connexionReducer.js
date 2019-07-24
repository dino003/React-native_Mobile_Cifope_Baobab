const initialState = {
    user: {} 
   // isLog: !!AsyncStorage.getItem('userToken') 
}

function setUser(state = initialState, action){
    let nextState
    switch (action.type) {
        case 'CONNEXION':
            nextState = {
                ...state,
                user: action.value
               // isLog: action.bool,
            }
            return nextState 

        case 'DECONNEXION':
            nextState = {
                ...state,
                user: {}
            } 
            case 'MODIF_PROFIL':
                    nextState = {
                        ...state,
                        user: action.value
                    }    
        default:
            return state;
    }
}
export default setUser