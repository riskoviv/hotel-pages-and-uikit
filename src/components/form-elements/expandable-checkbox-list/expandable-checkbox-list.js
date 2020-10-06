const expandableCheckboxListsToggles = document.querySelectorAll('.expandable-checkbox-list__toggle');

expandableCheckboxListsToggles.forEach(function (toggle) {
  toggle.addEventListener('click', function () {
    this.parentNode.classList.toggle('expandable-checkbox-list_opened');
  })
});
