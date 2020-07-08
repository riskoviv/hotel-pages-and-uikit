const likeButton = document.querySelector('.like-button')
const likeButtonHeart = likeButton.querySelector('.like-button__heart')
const likeButtonCount = likeButton.querySelector('.like-button__count')

likeButton.addEventListener('click', function () {
  likeButton.classList.toggle('like-button_clicked')
  let count = parseInt(likeButtonCount.textContent)
  if (likeButtonHeart.textContent === 'favorite') {
    likeButtonHeart.textContent = 'favorite_border'
    count--
    likeButtonCount.textContent = count.toString()
  } else {
    likeButtonHeart.textContent = 'favorite'
    count++
    likeButtonCount.textContent = count.toString()
  }
  
})