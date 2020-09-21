const checkLike = (likeButton) => {
  const likeButtonHeart = likeButton.querySelector('.button_like__heart');
  const likeButtonCount = likeButton.querySelector('.button_like__count');
  let likesCount = parseInt(likeButtonCount.textContent);
  if (likeButton.classList.contains('button_like_clicked')) {
    likeButtonHeart.textContent = 'favorite';
    likeButtonCount.textContent = (++likesCount).toString();
  }
}

const setLike = (likeButton) => {
  likeButton.classList.toggle('button_like_clicked');
  const likeButtonHeart = likeButton.querySelector('.button_like__heart');
  const likeButtonCount = likeButton.querySelector('.button_like__count');
  let likesCount = parseInt(likeButtonCount.textContent);
  if (likeButtonHeart.textContent === 'favorite') {
    likeButtonHeart.textContent = 'favorite_border';
    likeButtonCount.textContent = (--likesCount).toString();
  } else {
    likeButtonHeart.textContent = 'favorite';
    likeButtonCount.textContent = (++likesCount).toString();
  }
}

const likeButtons = document.querySelectorAll('.button_like');


for (likeButton of likeButtons) {
  // запустить проверку нажатости
  checkLike(likeButton);
  likeButton.addEventListener('click', function () {
    setLike(this);
  })
}
