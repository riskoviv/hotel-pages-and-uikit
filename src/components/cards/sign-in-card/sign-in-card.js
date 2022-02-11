$(() => {
  const $registrationButton = $('.js-sign-in-card__registration-button');
  const $registrationCard = $('.registration-and-sign-in__registration-card');
  const $signInCard = $('.registration-and-sign-in__sign-in-card');
  const registrationHiddenClass = 'registration-and-sign-in__registration-card_hidden';
  const signInHiddenClass = 'registration-and-sign-in__sign-in-card_hidden';

  function showRegistrationCard() {
    $signInCard.addClass(signInHiddenClass);
    $registrationCard.removeClass(registrationHiddenClass);
  }

  $registrationButton.on('click', function () {
    showRegistrationCard();
  });
});
