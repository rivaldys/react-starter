import { combineReducers } from 'redux'
import { exampleReducer } from './General'

const reducers = combineReducers({
    example: exampleReducer
})

export default reducers