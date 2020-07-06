// import './form-elements.scss'

const textFields = document.querySelectorAll('.text-field:not(.text-field_masked)')
textFields.forEach(textField => textField.placeholder = 'Email')