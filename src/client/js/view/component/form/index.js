import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import * as FORM from 'constant/forms'
import { renderField } from 'helper/create-form-field'

class FormComponent extends Component {
  render () {
  	const {
  		handleSubmit,
  		pristine,
  		submitting,
  		inputs
  	} = this.props

    return (
      <form className='w-50 h-100 justify-content-center align-items-center mx-auto' onSubmit={handleSubmit}>
        {_.map(inputs, (input, index) => {
      		return (
            <Field
          name={input.name || 'field-control'}
          type={input.type || 'text'}
          component={renderField}
          label={input.label || ''}
          key={index}
        />
	          )
      	})}
        <button>Submit</button>
      </form>
    )
  }
}

FormComponent = reduxForm({
  form: FORM.FORM_LOGIN_USER
})(FormComponent)

export default FormComponent
