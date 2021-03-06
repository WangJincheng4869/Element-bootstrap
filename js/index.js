$(function () {

  $('#btn_menu_shrink').on('click', function () {
    let $leftAside = $('aside.left');
    if ($leftAside.hasClass('nav-mini')) {
      $leftAside.removeClass('nav-mini');
      $(this).find('.iconfont').removeClass('icon-zhanKai').addClass('icon-shouQi');
      setTimeout(function () {
        $("aside.left").getNiceScroll().resize();
      }, 300)
    } else {
      $leftAside.addClass('nav-mini');
      $(this).find('.iconfont').removeClass('icon-shouQi').addClass('icon-zhanKai');
      $("aside.left").getNiceScroll().hide();
    }
  });

  $('#menu').metisMenu();

  let $pageTabs = $('nav.page-tabs');

  // tab页切换事件
  $pageTabs.on('click', '.menu-tab', function () {
    let $this = $(this),
      dataId = $this.attr('data-id');
    $this.addClass('active').siblings('.menu-tab').removeClass('active');
    $('main .frame-box iframe[data-id="' + dataId + '"]').removeClass('d-none').siblings('iframe').addClass('d-none');
  });

  // 关闭tab
  $pageTabs.on('click', '.menu-tab i', function () {
    let $menuTab = $(this).parent(),
      dataId = $menuTab.attr('data-id');
    if ($menuTab.hasClass('active')) {
      $menuTab.prev().click();
    }
    $menuTab.remove();
    $('main .frame-box iframe[data-id="' + dataId + '"]').remove();
  });

  // 左侧菜单点击事件，仅带有a_menu类的a标签才会打开页面
  $('nav.sidebar-nav').on('click', '.a_menu', function () {
    let $this = $(this),
      url = $this.attr('href'),
      menuName = $this.text(),
      dataId = $this.attr('data-id'),
      $menuTabs = $('.page-tabs-content .menu-tab'),
      // 是否已存在tab
      hasTab = false;
    $menuTabs.each(function (i, e) {
      if ($(e).attr('data-id') === dataId) {
        if (!$(e).hasClass('active')) {
          $(e).addClass('active').siblings('.menu-tab').removeClass('active');
          $('main .frame-box iframe[data-id="' + dataId + '"]').removeClass('d-none').siblings('iframe').addClass('d-none');
        }
        hasTab = true;
      }
    });
    if (!hasTab) {
      let iframeHtml = '<iframe src="' + url + '" width="100%" height="100%" data-id="' + dataId + '"></iframe>',
        tabHtml = '<a class="menu-tab active" data-id="' + dataId + '"><span>' + menuName + '</span><i class="iconfont icon-close-s"></i></a>';
      $('.frame-box iframe').addClass('d-none');
      $menuTabs.removeClass('active');
      $('.frame-box').append(iframeHtml);
      $('.page-tabs-content').append(tabHtml);
    }
    return false;
  });

  // 初始化菜单滚动条
  $('aside.left').niceScroll({
    cursorcolor: '#000',
    cursoropacitymax: 0.5,
    cursorborder: 0
  });
  // 重置菜单滚动条高度
  $('aside').on('click', function () {
    setTimeout(function () {
      $("aside.left").getNiceScroll().resize();
    }, 300)
  });
});
