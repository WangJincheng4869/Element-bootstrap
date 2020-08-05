(function ($) {
  let constants = {
      classes: {
        zoomInTopLeaveActive: 'el-zoom-in-top-leave-active',
        zoomInTopEnter: 'el-zoom-in-top-enter',
        zoomInTopEnterActive: 'el-zoom-in-top-enter-active',
        isFocus: 'is-focus',
        cascader: 'cascader',
        elPopper: 'el-popper',
        popperArrow: 'popper__arrow',
        activePath: 'in-active-path',
        active: 'is-active',
        d_block: 'd-block',
      },

      html: {
        toast: function (options, icon) {
          if (!icon) icon = '';
          return '' +
            '<div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-id="' + options.dataId + '">' +
            '  <div class="toast-header">' + icon +
            '    <strong class="mr-auto">' + options.title + '</strong>' +
            '    <small class="text-muted">' + options.subtitle + '</small>' +
            '    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close"><i class="iconfont icon-delete"></i></button>' +
            '  </div>' +
            '  <div class="toast-body">' + options.content + '</div>' +
            '</div>'
        },

        success: '<span class="toast-icon text-success"><i class="iconfont icon-success-r"></i></span>',
        warning: '<span class="toast-icon text-warning"><i class="iconfont icon-warning-r"></i></span>',
        error: '<span class="toast-icon text-danger"><i class="iconfont icon-error-r"></i></span>'
      }
    },
    defaults = {
      // 自动隐藏的时间
      delay: 1500,
      // 标题
      title: '',
      // 副标题
      subtitle: '',
      // 内容
      content: '',
      // 拓展数据使用，比如单击后想做跳转传参可以使用此属性
      dataId: 1,
      // 显示图标的样式，默认无图标
      icon: '',
      onClick: function (event, notify, dataId) {
      },
      /**
       * 关闭后触发，自动关闭也会触发
       * @param event
       */
      onClose: function (event) {
      },
      /**
       * 显示后触发
       * @param event
       */
      onShown: function (event) {
      }
    };

  $.fn.extend({
    'notify': function (options) {
      if ($('.toast-box').length <= 0) {
        $('body').append('<div class="toast-box" aria-live="polite" aria-atomic="true"></div>')
      }
      if (typeof options !== 'object') return this;
      let html = constants.html, config = $.extend({}, defaults, options), icon = '';
      switch (config.icon) {
        case 'success':
          icon = html.success;
          break;
        case 'warning':
          icon = html.warning;
          break;
        case 'error':
          icon = html.error;
          break;
      }
      $('body > .toast-box').append(html.toast(config, icon));
      let $toast = $('.toast:last-child');
      if (options.onClick) {
        $toast.find('.toast-body').css('cursor', 'pointer');
      }
      $toast.toast({delay: config.delay}).toast('show');
      $toast.on('hidden.bs.toast', function (e) {
        config.onClose(e);
        $(this).remove();
      });
      $toast.on('shown.bs.toast', function (e) {
        config.onShown(e);
      });
      $toast.find('.toast-body').on('click', function (e) {
        config.onClick(e, $toast, $toast.attr('data-id'));
        $toast.toast('hide');
      })
    }
  });

})(jQuery);