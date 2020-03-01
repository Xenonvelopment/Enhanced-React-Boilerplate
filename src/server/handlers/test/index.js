import '@babel/polyfill'
import * as ROUTES from 'constant/routes'
import lambdaExpress from 'helper/lambda-express'
import cacheMiddleware from 'middleware/generic/cache'
import express from 'helper/add-express'
import * as testMiddleware from 'middleware/test'

const app = express()
app.get(ROUTES.TEST, cacheMiddleware(300), testMiddleware.getTest)

export const handler = (event, context) => lambdaExpress(event, context, app)
