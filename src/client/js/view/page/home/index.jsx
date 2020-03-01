import { connect } from 'react-redux'
import React, { Component } from 'react'
import styles from './index.scss'

class Home extends Component {
  render () {
    const { history } = this.props
    return (
      <div className={styles.page_wrapper}>
        <div className=''>
          <div>
            <h1>HELLO WORLD</h1>
          </div>
          <div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(Home)
