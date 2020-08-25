const pagination = require('paginationjs')


$(() => {
  function simpleTemplating(data) {
      var html = '<ul class="pagination__items-list">'
      $.each(data, function(index, item){
          html += '<li class="pagination__item">'+ item +'</li>'
      })
      html += '</ul>'
      return html
  }

  function addClassesToElements() {
    $('.paginationjs-prev > a').addClass('material-icons')
    $('.paginationjs-next > a').addClass('material-icons')
  }

  let $paginationNumberLastNum
  
  function removeExcessPageNumbers() {
    const $pageNumbers = $('.paginationjs-page:not(.paginationjs-last):not(.paginationjs-first)')
    const $activePage = $('.paginationjs-page.active')
    const $ellipsis = $('.paginationjs-ellipsis')
    for (let pageNumber of $pageNumbers) {
      let activePageNum = $activePage.data('num')
      let pageNumberNum = $(pageNumber).data('num')
      if ((pageNumberNum > activePageNum + 2
        || pageNumberNum < activePageNum - 2)
        && pageNumberNum !== 1
        && pageNumberNum !== $paginationNumberLastNum
      )
        $(pageNumber).css('display', 'none')
    }
    if ($activePage.data('num') === 5)
      $ellipsis.clone().insertAfter('.paginationjs-page[data-num="1"]')
    if ($activePage.data('num') === $paginationNumberLastNum-4)
      $ellipsis.clone().insertBefore($('.paginationjs-page:last'))
  }

  const $paginator = $('.pagination__container')
  
  $paginator.pagination({
    dataSource: function(done){
      let result = []
      for (let i = 1; i <= 175; i++) {
        result.push(i)
      }
      done(result)
    },
    callback: function(data, pagination) {
      // template method of yourself
      var html = simpleTemplating(data)
      $('.pagination__data-container').html(html)
    },
    pageSize: 12,
    autoHidePrevious: true,
    autoHideNext: true,
    prevText: 'arrow_back',
    nextText: 'arrow_forward',
    pageNumber: 1,
    pageRange: 2,
    afterRender: function () {
      addClassesToElements()
      removeExcessPageNumbers()
      const navData = $('.paginationjs-nav').text().split(',')
      if (navData[0] == $paginationNumberLastNum)
        $('.paginationjs-nav')
          .text(`${navData[0] * 12 - 11} - ${navData[1]} из ${navData[1]} вариантов аренды`)
      else
        $('.paginationjs-nav')
          .text(`${navData[0] * 12 - 11} - ${navData[0] * 12} из ${navData[1]} вариантов аренды`)
    },
    formatNavigator: '<%= currentPage %>,<%= totalNumber %>',
    showNavigator: true
  })

  $paginationNumberLastNum = $('.paginationjs-last').data('num')
})