import '@babel/polyfill'
import lambdaExpress from 'helper/lambda-express'
import * as authMiddleware from 'middleware/generic/auth'
import * as ROUTES from 'constant/routes'
import cacheMiddleware from 'middleware/generic/cache'
import * as userMiddleware from 'middleware/user'
import express from 'helper/add-express'

const app = express()

// User Management
app.get(`/api${ROUTES.GET_ALL_USERS}`, cacheMiddleware(3600), authMiddleware.isAdmin, userMiddleware.getAllUsers)
app.get(`/api${ROUTES.GET_USER}`, cacheMiddleware(25), userMiddleware.getUser)
app.post(`/api${ROUTES.ADD_NEW_USER}`, cacheMiddleware(0), authMiddleware.isAdmin, userMiddleware.addNewUser)
app.post(`/api${ROUTES.UPDATE_USER}`, cacheMiddleware(0), userMiddleware.updateUser)

// Roles
app.post(`/api${ROUTES.ADD_ROLE_TO_USER}`, cacheMiddleware(0), authMiddleware.isAdmin, userMiddleware.addRoleToUser)
app.post(`/api${ROUTES.REMOVE_ROLE_FROM_USER}`, cacheMiddleware(0), authMiddleware.isAdmin, userMiddleware.removeRoleFromUser)
app.get(`/api${ROUTES.GET_USER_ROLES}`, cacheMiddleware(86400), userMiddleware.getUserRoles)
app.get(`/api${ROUTES.GET_ROLE_FOR_USER}`, cacheMiddleware(600), userMiddleware.getRoleForUser)

app.get(`/api${ROUTES.GET_LOGINS_FOR_USER}`, cacheMiddleware(650), userMiddleware.getLoginsForUser)
app.get(`/api${ROUTES.IS_LOGGED_IN}`, cacheMiddleware(0), userMiddleware.isLoggedIn)

export const handler = (event, context) => lambdaExpress(event, context, app)
