import * as ROUTES from 'constant/routes'
import { Redirect, Route, Switch, withRouter } from 'react-router'
import React from 'react'
import Login from 'view/page/login'

const Routes = ({ location, history }) =>
  <Switch>
    <Route
      exact
      path={ROUTES.LOGIN}
      component={Login}
    />
    <Redirect to={ROUTES.LOGIN} />
  </Switch>

export default withRouter(Routes)
