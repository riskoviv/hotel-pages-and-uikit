import 'air-datepicker';

class DateDropdown {
  $datepickerTarget;

  $date1Input;

  $date2Input;

  isFilter;

  datepickerInstance;

  $calendarClearButton;

  $calendarNavTitle;

  savedDates = [];

  savedDatesFilter = '';

  $applyButton;

  constructor(datepickerTarget) {
    this.$datepickerTarget = $(datepickerTarget);
    this.$date1Input = this.$datepickerTarget;
    this.$date2Input = this.$date1Input.closest('.js-date-dropdown').find('.js-date-dropdown__input[data-date="2"]');
    this.isFilter = this.$datepickerTarget.hasClass('js-date-dropdown_type_filter__input');
    this.init();
    this.datepickerInstance = this.$datepickerTarget.data('datepicker');
    const { $buttonsContainer } = this.datepickerInstance.nav;
    this.$calendarClearButton = $buttonsContainer.children();
    this.setCustomOptions();
    this.$applyButton = $('<button class="button button_type_link">Применить</button>');
    $buttonsContainer.append(this.$applyButton);
    this.bindEventListenersToButtonsAndDate2Input();
  }

  bindEventListenersToButtonsAndDate2Input() {
    this.$calendarClearButton.on('click', this.handleClearButtonClick);
    this.$applyButton.on('click', this.handleApplyButtonClick);
    if (this.$date2Input.length > 0) {
      this.$date2Input.on('click', this.handleDate2InputClick);
      this.$date2Input[0].addEventListener('pointerdown', this.handleDate2InputClick);
    }
  }

  handleClearButtonClick = () => {
    this.hideClearButton();
  };

  handleApplyButtonClick = () => {
    this.printDates();
    this.datepickerInstance.hide();
  };

  handleDate2InputClick = () => {
    this.datepickerInstance.show();
  };

  moveToLeftEdgeIfMobileS() {
    const mobileSMediaQuery = window.matchMedia('(max-width: 320px)');
    if (mobileSMediaQuery.matches) {
      this.$datepickerTarget.data('datepicker').$datepicker.css('left', '0');
    }
  }

  showClearButton() {
    this.$calendarClearButton.removeClass('button_hidden');
  }

  hideClearButton() {
    this.$calendarClearButton.addClass('button_hidden');
  }

  customizeNavTitle() {
    this.$calendarNavTitle = this.datepickerInstance.$nav.find('.datepicker--nav-title');
    this.$calendarNavTitle.prop('disabled', true);
    this.$calendarNavTitle.addClass('heading-2');
  }

  setCustomOptions() {
    this.customizeNavTitle();
    this.$calendarClearButton.addClass('button button_type_link button_type_clear');
  }

  saveDates = (selectedDates) => {
    if (this.isFilter) {
      this.savedDatesFilter = this.$datepickerTarget.val();
    } else {
      this.savedDates = selectedDates.split(',');
    }
  };

  printDates() {
    if (this.isFilter) {
      this.$date1Input.val(this.savedDatesFilter);
    } else {
      this.$date1Input.val(this.savedDates[0] || '');
      this.$date2Input.val(this.savedDates[1] || '');
    }
  }

  init() {
    let onSelectCounter = 0;
    this.$datepickerTarget.datepicker({
      inline: false,
      range: true,
      clearButton: true,
      prevHtml: 'arrow_back',
      nextHtml: 'arrow_forward',
      offset: 5,
      navTitles: {
        days: 'MM yyyy',
      },
      onChangeMonth: () => {
        this.setCustomOptions();
        this.moveToLeftEdgeIfMobileS();
      },
      onSelect: (formattedDate) => {
        onSelectCounter += 1;
        this.saveDates(formattedDate);
        const isDateSelectedManually = (
          this.$datepickerTarget.data('selectDate') !== undefined
          && onSelectCounter > 2
        ) || this.$datepickerTarget.data('selectDate') === undefined;
        if (isDateSelectedManually) {
          this.$datepickerTarget.val('');
          if (!this.isFilter) this.$date2Input.val('');
        } else {
          this.printDates();
        }

        this.setCustomOptions();
        if (formattedDate === '') {
          this.hideClearButton();
        } else {
          this.showClearButton();
        }
      },
      onShow: (inst) => {
        const datesSelectedButNotSaved = inst.selectedDates.length > 0
          && this.$date1Input.val() === ''
          && this.$date2Input.val() === '';
        if (datesSelectedButNotSaved) {
          inst.clear();
        }
        this.setCustomOptions();
        this.moveToLeftEdgeIfMobileS();
        if (this.$datepickerTarget.val() === '') {
          this.hideClearButton();
        } else {
          this.showClearButton();
        }
      },
      onHide: (inst) => {
        if (inst.selectedDates.length === 1) inst.clear();
      },
    });
  }

  static getSelectedDates() {
    const landingFormDataString = window.location.search;
    if (landingFormDataString === '') return '';

    const dates = landingFormDataString
      .substring(1)
      .split('&')
      .filter((entry) => entry.startsWith('date'))
      .map((date) => date.split('=')[1]);
    const haveTwoValidDates = dates.length === 2
      && dates.every((date) => /\d{2}\.\d{2}\.\d{4}/.test(date));
    if (!haveTwoValidDates) return '';

    const [date1, date2] = dates.map(
      (date) => (date.split('.')
        .map((datePart) => parseInt(datePart, 10))
        .reverse()),
    );
    return `[[${date1}],[${date2}]]`;
  }

  static setSelectedDates(datepicker) {
    const selectedDates = DateDropdown.getSelectedDates();
    if (selectedDates !== '') {
      $(datepicker).attr('data-select-date', selectedDates);
    }
  }
}

$(() => {
  const $datepickerTargets = $('.js-date-dropdown__input[data-date="1"], .js-date-dropdown_type_filter__input, .js-datepicker-init-element');
  if ($datepickerTargets.length === 1) {
    DateDropdown.setSelectedDates($datepickerTargets[0]);
  }

  $datepickerTargets.each(function performDatePickersInits() {
    const { datepickerInstance } = new DateDropdown(this);
    const dates = $(this).data('selectDate');
    if (dates !== undefined) {
      const dateArray = dates.map((date) => new Date(date));
      datepickerInstance.selectDate(dateArray);
    }
  });
});
