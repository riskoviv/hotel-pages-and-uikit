const likeButtons = document.querySelectorAll('.like-button')

for (likeButton of likeButtons) {
  // запустить проверку нажатости
  checkLike(likeButton)
  likeButton.addEventListener('click', function () {
    this.classList.toggle('like-button_clicked')
    setLike(this)
  })
}

const setLike = (likeButton) => {
  const likeButtonHeart = likeButton.querySelector('.like-button__heart')
  const likeButtonCount = likeButton.querySelector('.like-button__count')
  let likesCount = parseInt(likeButtonCount.textContent)
  if (likeButtonHeart.textContent === 'favorite') {
    likeButtonHeart.textContent = 'favorite_border'
    likeButtonCount.textContent = (--likesCount).toString()
  } else {
    likeButtonHeart.textContent = 'favorite'
    likeButtonCount.textContent = (++likesCount).toString()
  }
}

function checkLike(likeButton) {
  const likeButtonHeart = likeButton.querySelector('.like-button__heart')
  const likeButtonCount = likeButton.querySelector('.like-button__count')
  let likesCount = parseInt(likeButtonCount.textContent)
  if (likeButton.classList.contains('like-button_clicked')) {
    likeButtonHeart.textContent = 'favorite'
    likeButtonCount.textContent = (++likesCount).toString()
  }
}

