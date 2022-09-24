const likeButtons = document.querySelectorAll('.like-button');

const handleLikeButtonClick = (e) => {
  e.currentTarget.classList.toggle('like-button_clicked');
};

[...likeButtons].forEach((likeButton) => {
  likeButton.addEventListener('click', handleLikeButtonClick);
});
