$(() => {
  const $signInButton = $('.js-registration-card__sign-in-button');
  const $registrationCard = $('.js-registration-and-sign-in__registration-card');
  const $signInCard = $('.js-registration-and-sign-in__sign-in-card');
  const registrationHiddenClass = 'registration-and-sign-in__registration-card_hidden';
  const signInHiddenClass = 'registration-and-sign-in__sign-in-card_hidden';

  const showSignInCard = () => {
    $registrationCard.addClass(registrationHiddenClass);
    $signInCard.removeClass(signInHiddenClass);
  };

  const handleSignInButtonClick = () => {
    showSignInCard();
  };

  $signInButton.on('click', handleSignInButtonClick);
});
