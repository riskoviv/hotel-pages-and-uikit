const likeButton = document.querySelector('.like-button')
const likeButtonHeart = likeButton.querySelector('.like-button__heart')
const likeButtonCount = likeButton.querySelector('.like-button__count')

likeButton.addEventListener('click', function () {
  likeButton.classList.toggle('like-button_clicked')
  let likesCount = parseInt(likeButtonCount.textContent)
  if (likeButtonHeart.textContent === 'favorite') {
    likeButtonHeart.textContent = 'favorite_border'
    likeButtonCount.textContent = (--likesCount).toString()
  } else {
    likeButtonHeart.textContent = 'favorite'
    likeButtonCount.textContent = (++likesCount).toString()
  }
  
})