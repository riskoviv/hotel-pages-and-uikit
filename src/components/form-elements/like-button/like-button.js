const likeButtons = document.querySelectorAll('.js-like-button');

const handleLikeButtonClick = (e) => {
  e.currentTarget.classList.toggle('like-button_clicked');
};

[...likeButtons].forEach((likeButton) => {
  likeButton.addEventListener('click', handleLikeButtonClick);
});
