const pagination = require('paginationjs')


$(() => {
  function simpleTemplating(data) {
      var html = '<ul class="pagination__items-list">';
      $.each(data, function(index, item){
          html += '<li class="pagination__item">'+ item +'</li>';
      });
      html += '</ul>';
      return html;
  }

  function addClassesToElements() {
    $('.paginationjs-prev > a').addClass('material-icons')
    $('.paginationjs-next > a').addClass('material-icons')
  }

  const $paginator = $('.pagination__container')
  
  $paginator.pagination({
    dataSource: function(done){
      let result = [];
      for (let i = 1; i <= 180; i++) {
        result.push(i);
      }
      done(result);
    },
    callback: function(data, pagination) {
      // template method of yourself
      var html = simpleTemplating(data);
      $('.pagination__data-container').html(html);
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
      const navData = $('.paginationjs-nav').text().split(',')
      $('.paginationjs-nav')
        .text(`${navData[0] * 12 - 11} - ${navData[0] * 12} из ${navData[1]} вариантов аренды`)
    },
    formatNavigator: '<%= currentPage %>,<%= totalNumber %>',
    showNavigator: true,
  })

  

})