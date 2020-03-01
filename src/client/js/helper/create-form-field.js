import React from 'react'

export const renderField = ({ input, label, type, meta: { touched, error, warning } }) => {
  console.log('label', label)
  console.log('type', type)
  return (
    <div>
      <label className='field-label'>{label}</label>
      <div>
        <input {...input} placeholder={label} type={type} className='form-control' />
        {touched && ((error && <span className='text-danger'>{error}</span>) || (warning && <span>{warning}</span>))}
      </div>
    </div>
  )
}
