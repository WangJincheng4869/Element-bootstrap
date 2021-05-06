/*!
 * cascader v1.0.5
 *
 * 作者：王金城
 * 日期：2021年4月28日
 */
(function ($) {
  let constants = {
      icons: {
        inputSuffix: '<i class="iconfont icon-arrow-up input-suffix"></i>',
        nodePostfix: '<i class="iconfont icon-arrow-up cascader-node-postfix"></i>',
        nodePrefix: '<i class="iconfont icon-check cascader-node-prefix"></i>',
      },

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
        is_disabled: 'is-disabled',
      },

      defaultAttrs: {
        'type': 'text',
        'autocomplete': 'off',
        'readonly': 'readonly'
      },
      html: {
        dropdown: function (targetId) {
          return '' +
            '<div class="input-suffix"><i class="iconfont icon-arrow-up"></i></div>' +
            '<div class="cascader-dropdown el-popper" x-placement="bottom-start">' +
            '  <div class="popper__arrow"></div>' +
            '  <div class="cascader-panel" id="cascader_panel_' + targetId + '"></div>' +
            '</div>'
        },

        menu: function (menuitemHtml, level, targetId, scrollbarWidth, scrollbarHeight) {
          return '' +
            '<div class="el-scrollbar cascader-menu" role="menu" id="cascader_menu_' + targetId + '_' + level + '">' +
            '  <div class="cascader-menu-wrap el-scrollbar__wrap" style="margin-right:' + scrollbarWidth + ';margin-bottom:' + scrollbarHeight + ';">' +
            '    <ul class="el-scrollbar__view cascader-menu-list">' + menuitemHtml + '</ul>' +
            '  </div>' +
            '  <div class="el-scrollbar__bar is-horizontal"><div class="el-scrollbar__thumb"></div></div>' +
            '  <div class="el-scrollbar__bar is-vertical"><div class="el-scrollbar__thumb"></div></div>' +
            '</div>'
        },

        node: function (option, config) {
          let menuitem =
            '<li class="cascader-node ' + (option.isDisabled === 1 ? 'is-disabled' : '') + '" role="menuitem" data-id="' + option[config.idKey] + '" data-level="' + option.level + '">' +
            '<span class="cascader-node-label">' + option[config.name] + '</span>';
          if (option.isParent) {
            menuitem += constants.icons.nodePostfix;
          } else {
            menuitem += constants.icons.nodePrefix;
          }
          menuitem += '</li>';
          return menuitem;
        }
      }
    },
    defaults = {
      // 节点数据中保存唯一标识的属性名称
      idKey: 'id',
      // 节点数据中保存其父节点唯一标识的属性名称
      pIdKey: 'pId',
      // 用于修正根节点父节点数据，即 pIdKey 指定的属性值
      rootPId: -1,
      // 节点数据排序字段Key
      sortKey: '',
      // 节点数据保存节点名称的属性名称
      name: 'name',
      // 是否禁用组件
      disabled: false,
      // 选项分隔符
      separator: ' / ',
      /**
       * 单击节点事件回调方法
       * @param event 节点event
       * @param node 节点数据
       */
      onClickNode: function (event, node) {
      }
    },
    // 以targetId为key存储选中节点的值
    checkedNodes = {},
    // 以targetId为key存储cascader对象
    cascaderObjs = {},
    methods = {
      /**
       * 获取或设置值
       * @param val 默认为获取值，单选时填入idKey的值，多选为idKey的数组
       * @returns {[]|*} 单选时填入idKey的值，多选为idKey的数组
       */
      val: function (val) {
        if (val === undefined) {
          let values = [], config = this.config;
          $.each(checkedNodes[this.targetId], function (i, node) {
            values.push(node[config.idKey]);
          });
          return values;
        } else if (!$.isEmptyObject(val)) {
          let targetId = this.targetId, disabledClass = constants.classes.is_disabled;
          $('#' + targetId).siblings('.cascader-dropdown').css({'opacity': 0, 'display': 'block'});
          for (let i = 0; i < val.length; i++) {
            let $node = $('#cascader_panel_' + targetId).find('.cascader-node[data-id=' + val[i] + ']'),
              is_disabled = $node.hasClass(disabledClass);
            if ($node.index() > 5) {
              $node.parents('.el-scrollbar__wrap').animate({scrollTop: 35 * ($node.index() - 3)}, 20);
            }
            if (is_disabled) $node.removeClass(disabledClass);
            $node.click();
            if (is_disabled) $node.addClass(disabledClass);
          }
          setTimeout(function () {
            $('#' + targetId).siblings('.cascader-dropdown').css({'opacity': '', 'display': ''});
          }, 300)
        }
      },

      /**
       * 获取选中的节点数组
       * @param leafOnly  是否只是叶子节点，默认值为 false
       * @returns {Object|Array}
       */
      getCheckedNodes: function (leafOnly) {
        let nodes = checkedNodes[this.targetId];
        if (leafOnly === undefined || leafOnly === false) {
          return nodes || [];
        }
        if (!$.isEmptyObject(nodes)) {
          for (let i = nodes.length - 1; i >= 0; i--) {
            let node = nodes[i];
            if (!node.isParent) return node;
          }
        }
        return {};
      }
    };

  $.fn.extend({
    'cascader': function (options, data) {
      $(this).wrap('<div class="cascader"></div>');
      if (typeof options !== 'object') return this;
      let $cascaderInput = $(this), targetId = $cascaderInput.attr('id'),
        classes = constants.classes,
        // key:nodeId val:此节点的子节点的对象集合{nodeId: node}
        optionIdsObj = {},
        // key:nodeId val:此节点的对象
        optionObj = {},
        html = constants.html, config = $.extend({}, defaults, options),
        // 级联组件对象，其中包含一些常用方法
        cascader = {targetId: targetId, config: config},
        scrollbarWidthAndHeight = getScrollBarWidthAndHeight(),
        scrollbarWidth = scrollbarWidthAndHeight[0],
        scrollbarHeight = scrollbarWidthAndHeight[1];
      $cascaderInput.attr(constants.defaultAttrs).after(html.dropdown(targetId));
      if (config.disabled) $cascaderInput.attr('disabled', 'disabled');
      let $cascader = $cascaderInput.parent('.cascader'),
        $cascader_dropdown = $cascaderInput.siblings('.cascader-dropdown'),
        $cascader_panel = $('#cascader_panel_' + targetId);
      $.each(data, function (i, option) {
        let id = $.trim(option[config.idKey]), pId = $.trim(option[config.pIdKey]);
        optionObj[id] = option;
        if ($.isEmptyObject(optionIdsObj[pId])) {
          optionIdsObj[pId] = {};
        }
        optionIdsObj[pId][id] = option;
      });
      let nodeHtml = [];
      $.each(optionIdsObj[config.rootPId], function (i, option) {
        option.isParent = !$.isEmptyObject(optionIdsObj[option[config.idKey]]);
        if (option.level === undefined || option.level === null) option.level = 1;
        let index = config.sortKey ? option[config.sortKey] : i;
        nodeHtml[index] = html.node(option, config);
      });
      $cascader_panel.append(html.menu(nodeHtml.join(''), 1, targetId, -scrollbarWidth + 'px', -scrollbarHeight + 'px'));
      /**
       * 文本框单击事件绑定，展开关闭面板
       */
      $cascaderInput.on('click', function () {
        if ($cascaderInput.hasClass('is-invalid')) $cascaderInput.removeClass('is-invalid');
        if ($cascader.hasClass(classes.isFocus)) {
          closePanel($cascader, $cascader_dropdown)
        } else {
          adjustPanelDirection($cascaderInput, $cascader_dropdown);
          $cascader_dropdown.addClass(classes.zoomInTopEnterActive).addClass(classes.zoomInTopEnter);
          $cascader.addClass(classes.isFocus);
          setTimeout(function () {
            $cascader_dropdown.removeClass(classes.zoomInTopEnter);
          }, 7);
          setTimeout(function () {
            $cascader_dropdown.removeClass(classes.zoomInTopEnterActive);
            initScrollbar(targetId, 1, scrollbarHeight);
          }, 300);
        }
      });
      // 清空按钮相关事件
      $cascaderInput.parent().on('mouseover', function () {
        if ($cascaderInput.val()) {
          $cascaderInput.next('.input-suffix').addClass('event-auto').children('.iconfont').removeClass('icon-arrow-up').addClass('icon-close-s')
        }
      }).on('mouseout', function () {
        $cascaderInput.next('.input-suffix').removeClass('event-auto').children('.iconfont').removeClass('icon-close-s').addClass('icon-arrow-up')
      }).on('click', '.input-suffix', function () {
        closePanel($cascader, $cascader_dropdown);
        $cascader_dropdown.find('.is-active').removeClass('is-active');
        checkedNodes[targetId] = [];
        $cascaderInput.val('');
      });

      /**
       * 选项单击事件
       */
      $cascader_dropdown.on('click', '.cascader-node', function () {
        let $this = $(this), id = $.trim($this.attr('data-id')),
          level = parseInt($this.attr('data-level')), nextLevel = level + 1,
          $menu_list = $(this).parent('.cascader-menu-list'),
          menuListWidth = 180,
          right = $(document).width() - $menu_list.offset().left - menuListWidth,
          dropdownPositionLeft = $cascader_dropdown.position().left,
          $popper__arrow = $cascader_dropdown.children('.popper__arrow'),
          arrowLeft = $popper__arrow.position().left;
        config.onClickNode(this, optionObj[id]);
        if ($this.hasClass('is-disabled')) return;
        let nodeHtml = [];
        $.each(optionIdsObj[id], function (i, option) {
          option.isParent = !$.isEmptyObject(optionIdsObj[option[config.idKey]]);
          if (option.level === undefined || option.level === null) option.level = nextLevel;
          let index = config.sortKey ? option[config.sortKey] : i;
          nodeHtml[index] = html.node(option, config);
        });
        // 判断是否为父级选项，而改变图标形态；是否需要加载下一级
        if ($.isEmptyObject(optionIdsObj[id])) {
          // 当前条件代表面板有位移，且右侧有空间
          if (right > 1 && dropdownPositionLeft < 0) {
            // 小于一个面板的宽度，则归位
            if (dropdownPositionLeft * -1 < menuListWidth) {
              $cascader_dropdown.removeAttr('style');
              $popper__arrow.removeAttr('style');
            } else {
              // 大于面板宽度，计算有多少个面板宽度
              let leftMinus = menuListWidth * (right / menuListWidth);
              // 计算居左大于0，则归位
              if (dropdownPositionLeft + leftMinus > 0) {
                $cascader_dropdown.removeAttr('style');
                $popper__arrow.removeAttr('style');
              } else {
                $cascader_dropdown.css('left', dropdownPositionLeft + leftMinus);
                $popper__arrow.css('left', arrowLeft + leftMinus);
              }
            }
          }
          $this.addClass(classes.active).siblings().removeClass(classes.active).removeClass(classes.activePath);
          $('#cascader_menu_' + targetId + '_' + level).nextAll().remove();
          let valNames = '', nodes = [];
          // 获取所有选中的子节点
          $('#cascader_panel_' + targetId).find('.cascader-node.in-active-path').each(function (i, node) {
            let id = $.trim($(node).attr('data-id'));
            valNames += $(node).children('.cascader-node-label').text() + config.separator;
            nodes.push(optionObj[id]);
          });
          nodes.push(optionObj[id]);
          checkedNodes[targetId] = nodes;
          $cascaderInput.val(valNames + $this.children('.cascader-node-label').text());
          if ($cascaderInput.hasClass('is-invalid')) $cascaderInput.removeClass('is-invalid');
          closePanel($cascader, $cascader_dropdown);
        } else {
          $this.addClass(classes.activePath).siblings().removeClass(classes.activePath).removeClass(classes.active);
          let $cascader_menu = $('#cascader_menu_' + targetId + '_' + nextLevel);
          if ($cascader_menu.length > 0) {
            $('#cascader_menu_' + targetId + '_' + nextLevel + ' .cascader-menu-list').html(nodeHtml.join(''));
          } else {
            $cascader_panel.append(html.menu(nodeHtml.join(''), nextLevel, targetId, -scrollbarWidth + 'px', -scrollbarHeight + 'px'));
          }
          $cascader_menu.nextAll().remove();
          initScrollbar(targetId, nextLevel, scrollbarHeight);
          // 如果距右距离小于一个面板的宽度，则面板整体向左移动
          if (right < menuListWidth) {
            let left = $cascader_dropdown.position().left - (menuListWidth - right),
              arrowLeft = $popper__arrow.position().left + (menuListWidth - right)
            $cascader_dropdown.css('left', left);
            $popper__arrow.css('left', arrowLeft);
          } else if (right > menuListWidth) {
            if (dropdownPositionLeft === 0) return;
            // 如果小于一个面板宽度，那么可以直接归位
            if (dropdownPositionLeft * -1 < menuListWidth) {
              $cascader_dropdown.removeAttr('style');
              $popper__arrow.removeAttr('style');
            } else {
              // 大于面板宽度，计算有多少个面板宽度
              let leftMinus = menuListWidth * (right / menuListWidth - 1);
              // 计算居左大于0，则归位
              if (dropdownPositionLeft + leftMinus > 0) {
                $cascader_dropdown.removeAttr('style');
                $popper__arrow.removeAttr('style');
                return;
              }
              $cascader_dropdown.css('left', dropdownPositionLeft + leftMinus);
              $popper__arrow.css('left', arrowLeft + leftMinus);
            }
          }
        }
      });

      /**
       * 单击空白处关闭面板
       */
      $(document).on('click', function (e) {
        if (!$cascader.is(e.target) && $cascader.has(e.target).length === 0) {
          if ($cascader.hasClass(classes.isFocus)) {
            closePanel($cascader, $cascader_dropdown);
          }
        }
      });

      /**
       * 文本框父元素滚动监听，用于计算如何显示面板
       */
      $cascader.parents().scroll(function () {
        adjustPanelDirection($cascaderInput, $cascaderInput.siblings('.cascader-dropdown'));
      });
      cascaderObjs[targetId] = $.extend({}, cascader, methods);
      return cascaderObjs[targetId];
    }
  });


  $.fn.sp_cascader = {
    /**
     * 获取cascader对象
     * @param cascaderId cascader的id
     * @returns {*} cascader对象
     */
    getCascaderObj: function (cascaderId) {
      let o = cascaderObjs[cascaderId];
      return o ? o : null;
    }
  }

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
   * @param $cascader 组件最外级对象
   * @param $cascader_dropdown 下来面板对象
   */
  function closePanel($cascader, $cascader_dropdown) {
    if ($cascader && $cascader_dropdown && $cascader.length > 0 && $cascader_dropdown.length > 0) {
      let classes = constants.classes;
      $cascader_dropdown.addClass(classes.zoomInTopLeaveActive).addClass(classes.d_block);
      $cascader.removeClass(classes.isFocus);
      setTimeout(function () {
        $cascader_dropdown.removeClass(classes.zoomInTopLeaveActive).removeClass(classes.d_block);
      }, 300);
    }
  }

  /**
   * 初始化滚动条
   * @param targetId 级联组件id
   * @param level 初始化第几级别的面板
   * @param scrollbarHeight 横向滚动条的高度
   */
  function initScrollbar(targetId, level, scrollbarHeight) {
    let $scrollbar__wrap = $('#cascader_menu_' + targetId + '_' + level + ' .el-scrollbar__wrap'),
      $scrollbar__thumb = $('#cascader_menu_' + targetId + '_' + level + ' .el-scrollbar__bar.is-vertical .el-scrollbar__thumb'),
      // 包裹内容面板的高度，真实的高度是去除横向滚动条的高度；因为设置了margin-bottom=负的滚动条的高度
      wrapHeight = $scrollbar__wrap.height() - scrollbarHeight,
      // 内容的高度
      viewHeight = $('#cascader_menu_' + targetId + '_' + level + ' .el-scrollbar__view')[0].scrollHeight;
    if (wrapHeight < viewHeight) {
      $scrollbar__thumb.css('height', (wrapHeight / viewHeight * 100) + '%');
    }
    // 滚动条事件
    $scrollbar__wrap.off('scroll');
    $scrollbar__wrap.on('scroll', function () {
      $scrollbar__thumb.css('transform', 'translateY(' + ($(this).scrollTop() / wrapHeight * 100) + '%)');
    });
    $scrollbar__thumb.off('mousedown');
    $scrollbar__thumb.on('mousedown', function (e) {
      if (e.button === 0) {
        let gapY = e.clientY;
        console.log(gapY);
      }
      $(document).on('mousemove', function (e) {

      });
      $(document).on('mouseup', function () {
        $(document).off('mousemove');
      })
    })
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