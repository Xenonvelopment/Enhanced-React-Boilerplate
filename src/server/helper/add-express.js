import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
// import session from 'middleware/generic/session'
// import AWSXRay from 'aws-xray-sdk'

export default () => {
  let app = express()
  app.use(bodyParser.json())
  app.use(cookieParser())
  // app.use(AWSXRay.express.openSegment('APS-V2-API'))
  // app.use(session)
  app = addHelmet(app)
  return app
}

const addHelmet = (app) => {
  app.use(helmet())
  return app
}
