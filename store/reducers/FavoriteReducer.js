
const initialState = {favoriteFilms: []}

function toggleFavorite(state = initialState, action){
    let nextstate
    switch (action.type) {
        case 'TOGGLE_FAVORITE':
            const filmIndex = state.favoriteFilms.findIndex(item => item.id === action.value.id)
            if(filmIndex !== -1){
                nextstate = {
                    ...state,
                    favoriteFilms: state.favoriteFilms.filter((item, index) => index !== filmIndex)
                }
            }else{
                nextstate = {
                    ...state,
                    favoriteFilms: [...state.favoriteFilms, action.value]
                }
            }
            return nextstate || state
        default:
            return state;
    }
}

export default toggleFavorite