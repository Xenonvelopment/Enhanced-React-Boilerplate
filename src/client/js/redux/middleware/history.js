import { routerMiddleware } from 'connected-react-router'

export const history = require('history').createBrowserHistory()

export default routerMiddleware(history)
