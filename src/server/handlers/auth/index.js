import '@babel/polyfill'
import * as ROUTES from 'constant/routes'
import lambdaExpress from 'helper/lambda-express'
import cacheMiddleware from 'middleware/generic/cache'
import express from 'helper/add-express'
import * as authMiddleware from 'middleware/auth'

const app = express()
app.get(ROUTES.VF_AUTH_LOGIN_REDIRECT)
app.post(ROUTES.VF_AUTH_LOGIN_RESPONSE)

app.get(ROUTES.IS_LOGGED_IN)

app.post(ROUTES.PASSWORD_LOGIN)

export const handler = (event, context) => lambdaExpress(event, context, app)
