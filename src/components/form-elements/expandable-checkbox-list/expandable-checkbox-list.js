const expandableCheckboxListsToggles = document.querySelectorAll('.expandable-checkbox-list__toggle');

for (let toggle of expandableCheckboxListsToggles) {
  toggle.addEventListener('click', function() {
    this.parentNode.classList.toggle('expandable-checkbox-list_opened');
  })
}
