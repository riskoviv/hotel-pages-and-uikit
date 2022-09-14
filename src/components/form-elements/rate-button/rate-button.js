/**
 * Function to dynamically set rating for rate-button element.
 * To use it, call somewhere in external script w/ id of rate-button element and raring value.
 * @example
 * window.setRating('rating-746', 3);
 * setRating('rating-042', 5);
 * @param {string} rateButtonID ID of rate button element
 * @param {number} rating number from 0 to 5
 */
function setRating(rateButtonID, rating) {
  const rateButton = document.querySelector(`.rate-button#${rateButtonID}`);
  const stars = rateButton.querySelectorAll('.rate-button__star');
  stars.forEach((starElem, index) => {
    // eslint-disable-next-line no-param-reassign
    starElem.textContent = (index < rating) ? 'star' : 'star_border';
  });
}

window.setRating = setRating;
