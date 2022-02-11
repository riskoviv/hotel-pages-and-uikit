const expandableCheckboxListsToggles = document.querySelectorAll('.expandable-checkbox-list__toggle');

expandableCheckboxListsToggles.forEach((toggle) => {
  toggle.addEventListener('click', (e) => {
    e.currentTarget.parentNode.classList.toggle('expandable-checkbox-list_opened');
  });
});
