import React, { Component } from 'react'
import classnames from 'classnames'
import BeatLoader from 'react-spinners/BeatLoader'

export default class LoaderSpinner extends Component {
  render () {
    return (
      <span>
        <BeatLoader
          sizeUnit='px'
          size={18}
          color='#A59262'
          loading
        />
      </span>
    )
  }
}
