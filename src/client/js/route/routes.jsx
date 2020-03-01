import React from 'react'
import { connect } from 'react-redux'
import { dispatchLogin } from 'action/auth'
import { Route, Switch, withRouter } from 'react-router'
import { bindActionCreators } from 'redux'
import * as ROUTES from 'constant/routes'
import classnames from 'classnames'
import Spinner from 'view/component/spinner'
import AuthedRoutes from './authed-routes'
import UnauthedRoutes from './unauthed-routes'

class Routes extends React.Component {
  componentDidMount () {
    // this.props.autoLoginCheck()
  }

  render () {
    const {
      autoLoginCheckCompleted,
      currentUsers
    } = this.props

    return (
      <div className={classnames('routes-container')}>
        {/* autoLoginCheckCompleted */ true
          ? (
            <Switch>
              <Route>
                {currentUsers
                  ? <AuthedRoutes />
                  : <UnauthedRoutes />}
              </Route>
            </Switch>
          )
          : <Spinner />}
      </div>
    )
  }
}

export default withRouter(
  connect(
    (state) => ({
      autoLoginCheckCompleted: state.auth.autoLoginCheckCompleted,
      currentUsers: state.auth.currentUsers
    }),
    (dispatch) => ({
      // autoLoginCheck: bindActionCreators(autoLoginCheck, dispatch)
    })
  )(Routes)
)
