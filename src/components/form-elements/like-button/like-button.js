const checkLike = (likeButton) => {
  const likeButtonHeart = likeButton.querySelector('.like-button__heart');
  const likeButtonCount = likeButton.querySelector('.like-button__count');
  let likesCount = parseInt(likeButtonCount.textContent, 10);
  if (likeButton.classList.contains('like-button_clicked')) {
    likeButtonHeart.textContent = 'favorite';
    likeButtonCount.textContent = (likesCount += 1).toString();
  }
};

const setLike = (likeButton) => {
  likeButton.classList.toggle('like-button_clicked');
  const likeButtonHeart = likeButton.querySelector('.like-button__heart');
  const likeButtonCount = likeButton.querySelector('.like-button__count');
  let likesCount = parseInt(likeButtonCount.textContent, 10);
  if (likeButtonHeart.textContent === 'favorite') {
    likeButtonHeart.textContent = 'favorite_border';
    likeButtonCount.textContent = (likesCount -= 1).toString();
  } else {
    likeButtonHeart.textContent = 'favorite';
    likeButtonCount.textContent = (likesCount += 1).toString();
  }
};

const likeButtons = document.querySelectorAll('.like-button');

[...likeButtons].forEach((likeButton) => {
  // запустить проверку на лайк
  checkLike(likeButton);
  likeButton.addEventListener('click', (e) => {
    setLike(e.currentTarget);
  });
});
