import { combineReducers } from '@reduxjs/toolkit'
import { exampleReducer } from './General'

const reducers = combineReducers({
    example: exampleReducer
})

export default reducers