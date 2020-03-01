import * as ROUTES from 'constant/routes'
import { Redirect, Route, Switch, withRouter } from 'react-router'
import React from 'react'
import Home from 'view/page/home'

const Routes = ({ location, history }) =>
  <Switch>
    <Route
      exact
      path={ROUTES.HOME}
      component={Home}
    />
    <Redirect to={ROUTES.HOME} />
  </Switch>

export default withRouter(Routes)
