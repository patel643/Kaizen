$(function() {
  //console.log('local.js ready');
  $('.tabsControl li').click(function() {
    $(this).addClass('is-active').siblings().removeClass('is-active');
  });
});
