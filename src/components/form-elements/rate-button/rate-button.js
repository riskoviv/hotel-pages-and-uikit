export const setRating = (rateButtonID, rating) => {
  const rateButton = document.querySelector(`.rate-button#${rateButtonID}`)
  const stars = rateButton.querySelectorAll('.rate-button__star')
  for (let i = 0; i < rating; i++) {
    stars[i].textContent = 'star'
  }
}