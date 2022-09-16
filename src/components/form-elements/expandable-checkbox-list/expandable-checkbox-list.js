const expandableCheckboxListsToggles = document.querySelectorAll('.js-expandable-checkbox-list__toggle');
const expandableCheckboxListsToggleHandler = (e) => {
  e.currentTarget.parentNode.classList.toggle('expandable-checkbox-list_opened');
};

expandableCheckboxListsToggles.forEach((toggle) => {
  toggle.addEventListener('click', expandableCheckboxListsToggleHandler);
});
