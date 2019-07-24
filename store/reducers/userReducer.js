const initialState = {user: {}}

function setUser(state = initialState, action){
    let nextState
    switch (action.type) {
        case 'SET_USER':
            nextState = {
                ...state,
                user: action.value
            }
            return nextState || state
        default:
            return state;
    }
}
export default setUser