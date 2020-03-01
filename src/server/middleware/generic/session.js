import { getSession } from 'service/dynamodb/session'
import { getUser as getUserFromRDS } from 'service/mysql/user'
// import getUserRolesService from 'service/user/get-user-roles'
import _ from 'lodash'

export default async (req, res, next) => {
  const error401GeneralMessage = 'Unauthorised'
  const error401DisabledMessage = 'Unauthorised. User has been disabled'
  const error501Message = 'Premier League Server Error'

  try {
    const authToken = _.get(req.cookies, 'session')

    if (!authToken) {
      console.info('No Auth Token')
      return res.status(401).json({ message: error401GeneralMessage })
      // return next()
    }

    console.log({ authToken })

    const [session] = await Promise.all([
      getSession(authToken)
    ])

    console.log({ session })

    if (!session) {
      console.info('No session')
      return res.status(401).json({ message: error401GeneralMessage })
      // return next()
    }

    const {
      user: {
        email
      }
    } = session

    const {
      enabled
    } = await getUserFromRDS(email)

    if (!enabled) {
      res.clearCookie('session')
      return res.status(401).json({ message: error401DisabledMessage })
    }

    req.session = session
    next()
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: error501Message })
    // next()
  }
}
