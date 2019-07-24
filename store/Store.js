
import {createStore} from 'redux'
import toggleFavorite from './reducers/FavoriteReducer'
import setAvatar from './reducers/avatarReducer'
import setUser from './reducers/connexionReducer'
import {persistCombineReducers} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootPersistConfig = {
    key: 'root',
    storage: storage
}


export default createStore(persistCombineReducers(rootPersistConfig, {toggleFavorite, setAvatar, setUser}))
