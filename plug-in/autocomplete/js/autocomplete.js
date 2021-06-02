/*!
 * 文本框自动填充 autocomplete v1.0.0
 *
 * 作者：王金城
 * 日期：2021年5月27日
 */
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
        dropdown: function (targetId, scrollbarWidth, scrollbarHeight) {
          let panel =
            '<div class="autocomplete-menu-wrap el-scrollbar__wrap" style="margin-right:' + scrollbarWidth + ';margin-bottom:' + scrollbarHeight + ';">' +
            '  <ul class="el-scrollbar__view autocomplete" id="autocomplete_' + targetId + '"></ul>' +
            '</div>' +
            '<div class="el-scrollbar__bar is-horizontal"><div class="el-scrollbar__thumb"></div></div>' +
            '<div class="el-scrollbar__bar is-vertical"><div class="el-scrollbar__thumb"></div></div>';
          return '' +
            '<div class="autocomplete-dropdown el-popper" x-placement="bottom-start">' +
            '  <div class="popper__arrow"></div>' +
            '  <div class="autocomplete-panel el-scrollbar" id="autocomplete_panel_' + targetId + '">' + panel + '</div>' +
            '</div>'
        },

        li: function (data) {
          let html = '';
          $.each(data, function (i, n) {
            html += '<li data-value="' + n.value + '">' + n.name + '</li>'
          })
          return html;
        }
      }
    };

  $.fn.extend({
    'autocomplete': function (data) {
      if (typeof data !== 'object') return this;
      if ($.isEmptyObject(data)) return this;
      $(this).wrap('<div class="autocomplete-box"></div>');
      let $autocompleteInput = $(this), targetId = $autocompleteInput.attr('id'),
        classes = constants.classes,
        html = constants.html,
        scrollbarWidthAndHeight = getScrollBarWidthAndHeight(),
        scrollbarWidth = scrollbarWidthAndHeight[0],
        scrollbarHeight = scrollbarWidthAndHeight[1];
      $autocompleteInput.after(html.dropdown(targetId, -scrollbarWidth + 'px', -scrollbarHeight + 'px'));
      let $autocompleteView = $('#autocomplete_' + targetId);
      $autocompleteView.html(html.li(data));
      if (data.length > 8) $autocompleteView.parent().addClass('max-height');
      let $autocomplete = $autocompleteInput.parent('.autocomplete-box'),
        $autocomplete_dropdown = $autocompleteInput.siblings('.autocomplete-dropdown'),
        $scrollbar__wrap = $('#autocomplete_panel_' + targetId + ' .el-scrollbar__wrap'),
        $scrollbar__thumb = $('#autocomplete_panel_' + targetId + ' .el-scrollbar__bar.is-vertical .el-scrollbar__thumb'),
        wrapHeight = $scrollbar__wrap.height() - scrollbarHeight;
      initScrollbar(targetId, $scrollbar__wrap, $scrollbar__thumb, scrollbarHeight, wrapHeight);
      // 滚动条事件
      $scrollbar__wrap.on('scroll', function () {
        $scrollbar__thumb.css('transform', 'translateY(' + ($(this).scrollTop() / wrapHeight * 100) + '%)');
      });

      /**
       * 文本框单击事件绑定，展开面板操作
       */
      $autocompleteInput.on('focus', function () {
        if (!$autocomplete.hasClass(classes.isFocus)) {
          adjustPanelDirection($autocompleteInput, $autocomplete_dropdown);
          $autocomplete_dropdown.addClass(classes.zoomInTopEnterActive).addClass(classes.zoomInTopEnter);
          $autocomplete.addClass(classes.isFocus);
          setTimeout(function () {
            $autocomplete_dropdown.removeClass(classes.zoomInTopEnter);
          }, 7);
          setTimeout(function () {
            $autocomplete_dropdown.removeClass(classes.zoomInTopEnterActive);
          }, 300);
          $autocompleteInput.keyup();
        }
      }).on('keyup', function () {
        let searchKey = $.trim($(this).val()),
          $autocomplete_li = $('#autocomplete_' + targetId + ' li');
        if (searchKey) {
          $autocomplete_li.addClass('d-none').filter(':contains("' + searchKey + '")').removeClass('d-none');
        } else {
          $autocomplete_li.removeClass('d-none');
        }
        let showLiLength = $('#autocomplete_' + targetId + ' li:not(.d-none)').length;
        if (showLiLength === 0) {
          closePanel($autocomplete, $autocomplete_dropdown);
          return;
        } else {
          $autocompleteInput.focus();
        }
        // 判断是否添加最大高度
        if (showLiLength > 8) {
          $('#autocomplete_' + targetId).parent().addClass('max-height');
        } else {
          $('#autocomplete_' + targetId).parent().removeClass('max-height');
        }
      });

      /**
       * 选中值事件
       */
      $autocompleteView.on('click', 'li', function () {
        let value = $.trim($(this).attr('data-value'));
        if (!value) $.trim($(this).text());
        $autocompleteInput.val(value);
        closePanel($autocomplete, $autocomplete_dropdown);
      })

      /**
       * 单击空白处关闭面板
       */
      $(document).on('click', function (e) {
        if (!$autocomplete.is(e.target) && $autocomplete.has(e.target).length === 0) {
          if ($autocomplete.hasClass(classes.isFocus)) {
            closePanel($autocomplete, $autocomplete_dropdown);
          }
        }
      });

      /**
       * 文本框父元素滚动监听，用于计算如何显示面板
       */
      $(document).scroll(function () {
        adjustPanelDirection($autocompleteInput, $autocompleteInput.siblings('.autocomplete-dropdown'));
      });
      return $autocompleteInput;
    }
  });

  /**
   * 调整面板方法
   * @param $this 下来文本框对象
   * @param $cascader_dropdown 下来面板对象
   */
  function adjustPanelDirection($this, $cascader_dropdown) {
    if ($this && $cascader_dropdown && $this.length > 0 && $cascader_dropdown.length > 0) {
      let bottom = $(window).height() - ($this.offset().top - $(document).scrollTop());
      if (bottom <= 250) {
        $cascader_dropdown.attr('x-placement', 'top-start');
      } else {
        $cascader_dropdown.attr('x-placement', 'bottom-start');
      }
    }
  }

  /**
   * 关闭面板
   * @param $autocomplete 组件最外级对象
   * @param $autocomplete_dropdown 下来面板对象
   */
  function closePanel($autocomplete, $autocomplete_dropdown) {
    if ($autocomplete && $autocomplete_dropdown && $autocomplete.length > 0 && $autocomplete_dropdown.length > 0) {
      let classes = constants.classes;
      $autocomplete_dropdown.addClass(classes.zoomInTopLeaveActive).addClass(classes.d_block);
      $autocomplete.removeClass(classes.isFocus);
      setTimeout(function () {
        $autocomplete_dropdown.removeClass(constants.classes.zoomInTopLeaveActive).removeClass(classes.d_block);
      }, 300);
    }
  }

  /**
   * 初始化滚动条
   * @param targetId 级联组件id
   * @param $scrollbar__wrap 内容包裹对象
   * @param $scrollbar__thumb 竖向滚动条把手
   * @param scrollbarHeight 横向滚动条的高度
   * @param wrapHeight 包裹内容面板的高度，真实的高度是去除横向滚动条的高度；因为设置了margin-bottom=负的滚动条的高度
   */
  function initScrollbar(targetId, $scrollbar__wrap, $scrollbar__thumb, scrollbarHeight, wrapHeight) {
    let $scrollbar__view = $('#autocomplete_panel_' + targetId + ' .el-scrollbar__view');
    if ($scrollbar__view.length === 0) return false;
    // 内容的高度
    let viewHeight = $scrollbar__view[0].scrollHeight;
    if (wrapHeight < viewHeight) {
      $scrollbar__thumb.css('height', (wrapHeight / viewHeight * 100) + '%');
    } else {
      $scrollbar__thumb.css('height', 0);
    }
    setTimeout(function () {
      initScrollbar(targetId, $scrollbar__wrap, $scrollbar__thumb, scrollbarHeight, wrapHeight)
    }, 100)
  }

  /**
   * 获取滚动条宽度和高度
   * @returns {[number, number]} 0位：竖向滚动条宽度，1位：横向滚动条高度
   */
  function getScrollBarWidthAndHeight() {
    let el = document.createElement("p"),
      styles = {
        width: "100px",
        height: "100px",
        overflow: "scroll"
      };
    for (let i in styles) {
      el.style[i] = styles[i];
    }
    document.body.appendChild(el);
    let scrollBarWidth = el.offsetWidth - el.clientWidth,
      scrollBarHeight = el.offsetHeight - el.clientHeight;
    el.remove();
    return [scrollBarWidth, scrollBarHeight];
  }
})(jQuery);