import awsServerlessExpress from 'aws-serverless-express'
// import AWSXRay from 'aws-xray-sdk'
import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware'
// import { teardown } from 'middleware/generic/teardown'

export default (event, context, app) => {
  app.use(awsServerlessExpressMiddleware.eventContext())
  // app.use(AWSXRay.express.closeSegment())
  // app.use(teardown())
  const server = awsServerlessExpress.createServer(app)
  return awsServerlessExpress.proxy(server, event, context)
}
