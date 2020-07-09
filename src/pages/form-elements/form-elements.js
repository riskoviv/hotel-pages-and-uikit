import { setRating } from '../../components/form-elements/rate-button/rate-button'

const textFields = document.querySelectorAll('.text-field:not(.text-field_masked)')
textFields.forEach(textField => textField.placeholder = 'Email')

// setRating('opinion_1', 3)
// setRating('opinion_2', 5)