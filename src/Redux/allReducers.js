import mainReducer from './mainReducer'
import { combineReducers } from 'redux'

export const allReducers = combineReducers({
    user: mainReducer
})