import 'paginationjs';

class Pagination {
  lastPageNumber;

  $paginator;

  /**
   * @param {JQuery<HTMLElement>} $paginationTarget target element to init pagination plugin
   */
  constructor($paginationTarget) {
    this.$paginator = $paginationTarget;
    this.init();
    this.lastPageNumber = this.$paginator.find('.paginationjs-last').data('num');
  }

  init() {
    this.$paginator.pagination({
      dataSource(done) {
        const items = [...Array(181).keys()].slice(1);
        done(items);
      },
      callback(data) {
        // template method of yourself
        const html = Pagination.makeHTMLFromData(data);
        $('.js-page-content').html(html);
      },
      pageSize: 12,
      autoHidePrevious: true,
      autoHideNext: true,
      prevText: 'arrow_back',
      nextText: 'arrow_forward',
      pageNumber: 1,
      pageRange: 2,
      afterRender: () => {
        this.removeExcessPageNumbers();
        const $navigationInfo = this.$paginator.find('.J-paginationjs-nav');
        const [currentPage, totalItemsCount] = $navigationInfo.text().split(',');
        const firstItemNumberOnPage = currentPage * 12 - 11;
        if (currentPage === this.lastPageNumber) {
          $navigationInfo.text(
            `${firstItemNumberOnPage} - ${totalItemsCount}
            из ${(totalItemsCount) >= 100 ? '100+' : totalItemsCount}
            вариантов аренды`,
          );
        } else {
          const lastItemNumberOnPage = currentPage * 12;
          $navigationInfo.text(
            `${firstItemNumberOnPage} - ${lastItemNumberOnPage}
            из ${(totalItemsCount) >= 100 ? '100+' : totalItemsCount}
            вариантов аренды`,
          );
        }
      },
      formatNavigator: '<%= currentPage %>,<%= totalNumber %>',
      showNavigator: true,
    });
  }

  static makeHTMLFromData(data) {
    const $pageContent = $('<ul class="pagination__items-list"></ul>');
    const $pageContentElements = data.map(
      (pageItemContent) => `<li class="pagination__item">${pageItemContent}</li>`,
    );
    $pageContent.append($pageContentElements);
    return $pageContent[0].outerHTML;
  }

  removeExcessPageNumbers() {
    const $pageNumbers = this.$paginator.find('.J-paginationjs-page:not(.paginationjs-first):not(.paginationjs-last)');
    const $activePage = this.$paginator.find('.J-paginationjs-page.active');
    const $ellipsis = this.$paginator.find('.paginationjs-ellipsis');

    $pageNumbers.each((i, pageNumber) => {
      const activePageNum = Number($activePage.data('num'));
      const pageNumberNum = Number(pageNumber.dataset.num);
      const isPageNumMoreThan2PagesAwayFromActive = Math.abs(pageNumberNum - activePageNum) > 2;
      const isFirstOrLastNum = [1, this.lastPageNumber].includes(pageNumberNum);
      const isExcessPageNumber = isPageNumMoreThan2PagesAwayFromActive && !isFirstOrLastNum;

      if (isExcessPageNumber) {
        pageNumber.classList.add('paginationjs-page_hidden');
      }
    });

    switch ($activePage.data('num')) {
      case 5: {
        const $firstPageButton = this.$paginator.find('.J-paginationjs-page:first');
        $ellipsis.clone().insertAfter($firstPageButton);
        break;
      }
      case this.lastPageNumber - 4: {
        const $lastPageButton = this.$paginator.find('.J-paginationjs-page:last');
        $ellipsis.clone().insertBefore($lastPageButton);
        break;
      }
      default:
        break;
    }
  }
}

$(() => {
  const $paginationTarget = $('.js-pagination');
  if ($paginationTarget.length === 1) {
    new Pagination($paginationTarget);
  }
});
