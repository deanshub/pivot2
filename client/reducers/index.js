
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import board from '../ducks/board'

export default combineReducers({
  routing,
  board,
})
