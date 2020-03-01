import { combineReducers } from 'redux'
import router from './router'
import auth from './auth'
import { history } from 'js/redux/middleware/history'
import { reducer as formReducer } from 'redux-form'

export default combineReducers({
  auth: auth,
  form: formReducer,
  router: router(history)
})
