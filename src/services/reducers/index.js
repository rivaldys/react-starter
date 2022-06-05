import { combineReducers } from 'redux'
import { loginReducer } from './auth'

const reducers = combineReducers({
    login: loginReducer
})

export default reducers