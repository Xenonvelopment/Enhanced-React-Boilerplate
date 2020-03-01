import React, { Component } from 'react'
import FormComponent from 'view/component/form'
import LoginJSON from 'json/login'
import { DataTables } from 'firemind-react-datatables'
import { data } from 'data/data'
import { columns1 } from 'data/columns'
import { options1 } from 'data/options'

class Login extends Component {
  handleLoginResults (values) {
    console.log('Form Results', values)
  }

  render () {
    return (
      <div>
        {/* <FormComponent
          onSubmit={this.handleLoginResults}
          inputs={LoginJSON.FORM}
        /> */}
        <DataTables
          data={data}
          columns={columns1}
          options={options1}
        />
      </div>
    )
  }
}

export default Login
