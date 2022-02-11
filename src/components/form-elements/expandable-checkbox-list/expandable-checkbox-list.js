const expandableCheckboxListsToggles = document.querySelectorAll('.expandable-checkbox-list__toggle');

  toggle.addEventListener('click', function () {
    this.parentNode.classList.toggle('expandable-checkbox-list_opened');
  })
expandableCheckboxListsToggles.forEach((toggle) => {
});
