$(() => {
  const $signInButton = $('.js-registration-card__sign-in-button');
  const $registrationCard = $('.registration-and-sign-in__registration-card');
  const $signInCard = $('.registration-and-sign-in__sign-in-card');
  const registrationHiddenClass = 'registration-and-sign-in__registration-card_hidden';
  const signInHiddenClass = 'registration-and-sign-in__sign-in-card_hidden';

  function showSignInCard() {
    $registrationCard.addClass(registrationHiddenClass);
    $signInCard.removeClass(signInHiddenClass);
  }
  
  $signInButton.on('click', function () {
    showSignInCard();
  });
});