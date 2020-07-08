import { setRating } from '../../components/form-elements/rate-button/rate-button'

const textFields = document.querySelectorAll('.text-field:not(.text-field_masked)')
textFields.forEach(textField => textField.placeholder = 'Email')

setRating('opinions_1', 4)
setRating('opinions_2', 5)