import { applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import promiseMiddleware from 'redux-promise-middleware'
import history from './history'
import * as auth from 'js/redux/api/auth'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default composeEnhancers(
  applyMiddleware(
    history,
    thunkMiddleware.withExtraArgument({ auth }),
    promiseMiddleware
  )
)
