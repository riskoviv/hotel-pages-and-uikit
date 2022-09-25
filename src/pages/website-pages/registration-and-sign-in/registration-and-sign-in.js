$(() => {
  const [, pageVariant] = window.location.search
    .substring(1)
    .split('=');
  const $registrationCard = $('.js-registration-and-sign-in__registration-card');
  const $signInCard = $('.js-registration-and-sign-in__sign-in-card');
  const registrationHiddenClass = 'registration-and-sign-in__registration-card_hidden';
  const signInHiddenClass = 'registration-and-sign-in__sign-in-card_hidden';

  const showRegistrationCard = () => {
    $signInCard.addClass(signInHiddenClass);
    $registrationCard.removeClass(registrationHiddenClass);
  };

  const showSignInCard = () => {
    $registrationCard.addClass(registrationHiddenClass);
    $signInCard.removeClass(signInHiddenClass);
  };

  switch (pageVariant) {
    case 'sign-in':
      showSignInCard();
      break;
    case 'registration':
      showRegistrationCard();
      break;
    default:
      showRegistrationCard();
  }
});
