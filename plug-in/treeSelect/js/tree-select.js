/*!
 * treeSelect v1.0.3
 *
 * 作者：王金城
 * 日期：2019年11月12日
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

      defaultAttrs: {
        'type': 'text',
        'autocomplete': 'off',
        'readonly': 'readonly'
      },
      html: {
        dropdown: function (targetId, scrollbarWidth, scrollbarHeight) {
          let panel =
            '<div class="tree-select-menu-wrap el-scrollbar__wrap" style="margin-right:' + scrollbarWidth + ';margin-bottom:' + scrollbarHeight + ';">' +
            '  <ul class="el-scrollbar__view ztree" id="treeSelect_' + targetId + '"></ul>' +
            '</div>' +
            '<div class="el-scrollbar__bar is-horizontal"><div class="el-scrollbar__thumb"></div></div>' +
            '<div class="el-scrollbar__bar is-vertical"><div class="el-scrollbar__thumb"></div></div>';
          return '' +
            '<div class="input-suffix"><i class="iconfont icon-arrow-up"></i></div>' +
            '<div class="tree-select-dropdown el-popper" x-placement="bottom-start">' +
            '  <div class="popper__arrow"></div>' +
            '  <div class="tree-select-panel el-scrollbar" id="treeSelect_panel_' + targetId + '">' + panel + '</div>' +
            '</div>'
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
      // 节点数据保存节点名称的属性名称
      name: 'name',
      // 是否禁用组件
      disabled: false,
      // 仅能选择一个
      onlySelectOne: true,
      // 勾选 checkbox 对于父子节点的关联关系
      chkboxType: {"Y": "s", "N": "s"},
      // 设置 zTree 是否显示节点的图标
      showIcon: false,
      // 选项分隔符
      separator: ' / ',
      // zTree的回调方法
      callback: {},
      // zTree setting中的view
      view: {
        showIcon: false
      },
      beforeClick: function (treeId, treeNode, clickFlag) {
      },
      onClick: function (event, treeId, treeNode) {
      },
      onCheck: function (event, treeId, treeNode) {
      }
    },
    // 以targetId为key存储选中节点对象
    checkedNodes = {},
    // 以targetId为key存储treeSelect对象
    treeSelectObjs = {},
    methods = {
      /**
       * 获取或设置值
       * @param val 默认为获取值，单选时填入idKey的值，多选为idKey的数组
       * @returns {[]|*} 单选时填入idKey的值，多选为idKey的数组
       */
      val: function (val) {
        if (val === undefined) {
          let values = [], config = this.config;
          if ($.isEmptyObject(checkedNodes[this.targetId])) return config.onlySelectOne ? null : [];
          if (config.onlySelectOne) return checkedNodes[this.targetId][config.idKey];
          $.each(checkedNodes[this.targetId], function (i, node) {
            values.push(node[config.idKey]);
          });
          return values;
        } else {
          let targetId = this.targetId, config = this.config,
            $treeSelectInput = $('#' + targetId),
            treeObj = $.fn.zTree.getZTreeObj('treeSelect_' + targetId),
            placeholder = $treeSelectInput.attr('data-placeholder'),
            title = $treeSelectInput.attr('data-title');
          treeObj.checkAllNodes(false);
          checkedNodes = {};
          if (placeholder) $treeSelectInput.attr('placeholder', placeholder);
          if (title) $treeSelectInput.attr('title', title);
          if (!$.isEmptyObject(val) && !config.onlySelectOne) {
            let valLength = val.length;
            for (let i = 0; i < valLength; i++) {
              let node = treeObj.getNodeByParam(config.idKey, val[i]);
              treeObj.checkNode(node, true, true, true);
              treeObj.selectNode(node);
            }
          } else if (val !== null && val !== '' && config.onlySelectOne) {
            let node = treeObj.getNodeByParam(config.idKey, val);
            treeObj.selectNode(node);
            $treeSelectInput.attr('placeholder', node[config.name]);
          }
        }
      },

      /**
       * 获取选中的节点对象
       * @returns {Object|Array} 单选为节点对象，多选为节点对象数组
       */
      getCheckedNodes: function () {
        if (this.config.onlySelectOne) {
          return checkedNodes[this.targetId] || {};
        }
        return checkedNodes[this.targetId] || [];
      },

      /**
       * zTree v3.x 专门提供的根据 treeId 获取 zTree 对象的方法。
       * 必须在初始化 zTree 以后才可以使用此方法。
       * 有了这个方法，用户不再需要自己设定全局变量来保存 zTree 初始化后得到的对象了，而且在所有回调函数中全都会返回 treeId 属性，用户可以随时使用此方法获取需要进行操作的 zTree 对象
       */
      getZTreeObj: function () {
        return $.fn.zTree.getZTreeObj('treeSelect_' + this.targetId);
      },

      /**
       * 重载tree数据
       * @param data 重新载入的数据
       */
      reload: function (data) {
        let targetId = this.targetId, zTreeObj = this.getZTreeObj(), setting = this.zTreeSetting;
        zTreeObj.destroy();
        $.fn.zTree.init($('#treeSelect_' + targetId), setting, data);
      }
    };

  $.fn.extend({
    'treeSelect': function (options, data) {
      $(this).wrap('<div class="tree-select"></div>');
      if (typeof options !== 'object') return this;
      let $treeSelectInput = $(this), targetId = $treeSelectInput.attr('id'),
        classes = constants.classes,
        placeholder = $treeSelectInput.attr('placeholder'),
        title = $treeSelectInput.attr('title'),
        html = constants.html, config = $.extend({}, defaults, options),
        // 级联组件对象，其中包含一些常用方法
        treeSelect = {targetId: targetId, config: config},
        scrollbarWidthAndHeight = getScrollBarWidthAndHeight(),
        scrollbarWidth = scrollbarWidthAndHeight[0],
        scrollbarHeight = scrollbarWidthAndHeight[1];
      if (placeholder) $treeSelectInput.attr('data-placeholder', placeholder);
      if (title) $treeSelectInput.attr('data-title', title);
      $treeSelectInput.attr(constants.defaultAttrs).after(html.dropdown(targetId, -scrollbarWidth + 'px', -scrollbarHeight + 'px'));
      if (config.disabled) $treeSelectInput.attr('disabled', 'disabled');
      let $treeSelect = $treeSelectInput.parent('.tree-select'),
        $treeSelect_dropdown = $treeSelectInput.siblings('.tree-select-dropdown'), $input_suffix = $treeSelectInput.next('.input-suffix'),
        setting = {
          view: config.view,
          data: {
            simpleData: {
              enable: true,
              idKey: config.idKey,
              pIdKey: config.pIdKey,
              rootPId: config.rootPId
            },
            key: {
              name: config.name
            }
          },
          check: {
            enable: !config.onlySelectOne,
            chkboxType: config.chkboxType
          },
          callback: config.callback
        };
      // 勾选时的事件
      setting.callback.onCheck = function (event, treeId, treeNode) {
        let treeObj = $.fn.zTree.getZTreeObj(treeId),
          nodes = treeObj.getNodesByParam('checked', true), namesAry = [];
        checkedNodes[targetId] = nodes;
        $.each(nodes, function (i, node) {
          namesAry.push(node[config.name]);
        });
        let names = namesAry.join(config.separator);
        $treeSelectInput.attr('placeholder', names).attr('title', names);
        config.onCheck(event, treeId, treeNode);
      };
      // 单击节点前的事件
      setting.callback.beforeClick = function (treeId, treeNode, clickFlag) {
        let treeObj = $.fn.zTree.getZTreeObj(treeId),
          nodes = treeObj.getSelectedNodes();
        $.each(nodes, function (i, node) {
          treeObj.cancelSelectedNode(node);
        });
        config.beforeClick(treeId, treeNode, clickFlag)
      };
      // 单击时的事件
      setting.callback.onClick = function (event, treeId, treeNode) {
        if (config.onlySelectOne) {
          $treeSelectInput.attr('placeholder', treeNode[config.name]);
          checkedNodes[targetId] = treeNode;
          closePanel($treeSelect, $treeSelect_dropdown);
        }
        config.onClick(event, treeId, treeNode);
      };
      treeSelect['zTreeSetting'] = setting;
      let treeSelectObj = $.fn.zTree.init($('#treeSelect_' + targetId), setting, data),
        $scrollbar__wrap = $('#treeSelect_panel_' + targetId + ' .el-scrollbar__wrap'),
        $scrollbar__thumb = $('#treeSelect_panel_' + targetId + ' .el-scrollbar__bar.is-vertical .el-scrollbar__thumb'),
        wrapHeight = $scrollbar__wrap.height() - scrollbarHeight;
      initScrollbar(targetId, $scrollbar__wrap, $scrollbar__thumb, scrollbarHeight, wrapHeight);
      // 滚动条事件
      $scrollbar__wrap.on('scroll', function () {
        $scrollbar__thumb.css('transform', 'translateY(' + ($(this).scrollTop() / wrapHeight * 100) + '%)');
      });

      $input_suffix.on('click', function () {
        if ($treeSelect.hasClass(classes.isFocus)) {
          closePanel($treeSelect, $treeSelect_dropdown);
        } else {
          $treeSelectInput.click();
        }
      });

      /**
       * 文本框单击事件绑定，展开面板操作
       */
      $treeSelectInput.on('click', function () {
        if (!$treeSelect.hasClass(classes.isFocus)) {
          adjustPanelDirection($treeSelectInput, $treeSelect_dropdown);
          $treeSelect_dropdown.addClass(classes.zoomInTopEnterActive).addClass(classes.zoomInTopEnter);
          $treeSelect.addClass(classes.isFocus);
          setTimeout(function () {
            $treeSelect_dropdown.removeClass(classes.zoomInTopEnter);
          }, 7);
          setTimeout(function () {
            $treeSelect_dropdown.removeClass(classes.zoomInTopEnterActive);
          }, 300);
          $treeSelectInput.removeAttr('readonly');
          treeSelectObj.showNodes(treeSelectObj.getNodesByParam('isHidden', true));
        }
      }).on('keyup', function () {
        let searchKey = $.trim($(this).val());
        if (searchKey) {
          treeSelectObj.expandAll(true);
          let showNodes = treeSelectObj.getNodesByParam('isHidden', false),
            nodes = treeSelectObj.getNodesByParamFuzzy(config.name, searchKey), hideParentNodes = [];
          treeSelectObj.hideNodes(showNodes);
          $.each(nodes, function (i, node) {
            findHideParentNodes(hideParentNodes, node);
          });
          treeSelectObj.showNodes(hideParentNodes);
          treeSelectObj.showNodes(nodes);
        } else {
          let hideNodes = treeSelectObj.getNodesByParam('isHidden', true);
          treeSelectObj.showNodes(hideNodes);
        }
      });

      /**
       * 单击空白处关闭面板
       */
      $(document).on('click', function (e) {
        if (!$treeSelect.is(e.target) && $treeSelect.has(e.target).length === 0) {
          if ($treeSelect.hasClass(classes.isFocus)) {
            closePanel($treeSelect, $treeSelect_dropdown);
          }
        }
      });

      /**
       * 文本框父元素滚动监听，用于计算如何显示面板
       */
      $(document).scroll(function () {
        adjustPanelDirection($treeSelectInput, $treeSelectInput.siblings('.tree-select-dropdown'));
      });
      treeSelectObjs[targetId] = $.extend({}, treeSelect, methods);
      return treeSelectObjs[targetId];
    }
  });

  $.fn.tree_select = {
    /**
     * 获取TreeSelect对象
     * @param treeSelectId TreeSelect的id
     * @returns {*} TreeSelect对象
     */
    getTreeSelectObj: function (treeSelectId) {
      let o = treeSelectObjs[treeSelectId];
      return o ? o : null;
    }
  }

  /**
   * 查找子节点显示，其父节点却隐藏的父节点
   * @param nodes 空的数组，用于返回结果集
   * @param node 显示的节点对象
   */
  function findHideParentNodes(nodes, node) {
    let pNode = node.getParentNode();
    if (pNode) {
      if (pNode.isHidden) {
        nodes.push(pNode);
      }
      findHideParentNodes(nodes, pNode);
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
   * @param $treeSelect 组件最外级对象
   * @param $treeSelect_dropdown 下来面板对象
   */
  function closePanel($treeSelect, $treeSelect_dropdown) {
    if ($treeSelect && $treeSelect_dropdown && $treeSelect.length > 0 && $treeSelect_dropdown.length > 0) {
      let classes = constants.classes;
      $treeSelect_dropdown.addClass(classes.zoomInTopLeaveActive).addClass(classes.d_block);
      $treeSelect.removeClass(classes.isFocus);
      setTimeout(function () {
        $treeSelect_dropdown.removeClass(constants.classes.zoomInTopLeaveActive).removeClass(classes.d_block);
      }, 300);
      $treeSelect.find('input').val('').attr('readonly', 'readonly');
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
    let $scrollbar__view = $('#treeSelect_panel_' + targetId + ' .el-scrollbar__view');
    if ($scrollbar__view.length === 0) return false;
    // 内容的高度
    let viewHeight = $scrollbar__view[0].scrollHeight;
    if (wrapHeight < viewHeight) $scrollbar__thumb.css('height', (wrapHeight / viewHeight * 100) + '%');
    setTimeout(function () {
      initScrollbar(targetId, $scrollbar__wrap, $scrollbar__thumb, scrollbarHeight, wrapHeight)
    }, 10)
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