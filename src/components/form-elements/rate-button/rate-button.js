export const setRating = (rateButtonID, rating) => {
  const rateButton = document.querySelector(`.rate-button#${rateButtonID}`)
  const stars = rateButton.querySelectorAll('.rate-button__star')
  for (let i = 0; i < rating; i++) {
    stars[i].textContent = 'star'
  }
}

/*
    For setting rate-button's ratings (count of filled stars) from external script:
*/
// import { setRating } from '../../components/form-elements/rate-button/rate-button'
// setRating('opinion_1', 3)
// setRating('opinion_2', 5)