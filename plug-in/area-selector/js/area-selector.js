/*!
 * area-selector v1.0.3
 *
 * 作者：王金城
 * 日期：2020年4月23日
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
        dropdown: function (targetId) {
          let tabContent =
            '<ul class="nav nav-tabs" role="tablist">' +
            '  <li class="nav-item" id="nav_area_selector_country_' + targetId + '">' +
            '    <a class="nav-link" data-toggle="tab" href="#area_selector_country_' + targetId + '" role="tab" aria-selected="false">请选择</a>' +
            '  </li>' +
            '  <li class="nav-item" id="nav_area_selector_province_' + targetId + '">' +
            '    <a class="nav-link d-none" data-toggle="tab" href="#area_selector_province_' + targetId + '" role="tab" aria-selected="false">请选择</a>' +
            '  </li>' +
            '  <li class="nav-item" id="nav_area_selector_city_' + targetId + '">' +
            '    <a class="nav-link d-none" data-toggle="tab" href="#area_selector_city_' + targetId + '" role="tab" aria-selected="false">请选择</a>' +
            '  </li>' +
            '  <li class="nav-item" id="nav_area_selector_county_' + targetId + '">' +
            '    <a class="nav-link d-none" data-toggle="tab" href="#area_selector_county_' + targetId + '" role="tab" aria-selected="false">请选择</a>' +
            '  </li>' +
            '  <li class="nav-item" id="nav_area_selector_street_' + targetId + '">' +
            '    <a class="nav-link d-none" data-toggle="tab" href="#area_selector_street_' + targetId + '" role="tab" aria-selected="false">请选择</a>' +
            '  </li>' +
            '</ul>' +
            '<div class="tab-content">' +
            '  <div class="tab-pane fade" id="area_selector_country_' + targetId + '" role="tabpanel"><ul></ul></div>' +
            '  <div class="tab-pane fade" id="area_selector_province_' + targetId + '" role="tabpanel"><ul></ul></div>' +
            '  <div class="tab-pane fade" id="area_selector_city_' + targetId + '" role="tabpanel"><ul></ul></div>' +
            '  <div class="tab-pane fade" id="area_selector_county_' + targetId + '" role="tabpanel"><ul></ul></div>' +
            '  <div class="tab-pane fade" id="area_selector_street_' + targetId + '" role="tabpanel"><ul></ul></div>' +
            '</div>';
          return '' +
            '<div class="input-suffix"><i class="iconfont icon-arrow-up"></i></div>' +
            '<div class="area-selector-dropdown el-popper" x-placement="bottom-start">' +
            '  <div class="popper__arrow"></div>' +
            '  <div class="area-selector-panel" id="areaSelector_panel_' + targetId + '">' + tabContent + '</div>' +
            '</div>'
        },

        li: function (id, name) {
          return '<li data-id="' + id + '">' + name + '</li>';
        }
      }
    },
    defaults = {
      // 节点数据中保存唯一标识的属性名称
      idKey: 'id',
      // 节点数据中保存其父节点唯一标识的属性名称，也是请求参数的key
      pIdKey: 'parentId',
      // 用于修正根节点父节点数据，即 pIdKey 指定的属性值
      rootPId: -1,
      // 节点数据保存节点名称的属性名称
      name: 'name',
      // 是否禁用组件
      disabled: false,
      // 选项分隔符
      separator: ' / ',
      // Ajax 的 http 请求模式
      type: 'post',
      // Ajax 获取数据的 URL 地址
      url: '',
      // Ajax 提交参数的数据类型
      contentType: "application/json;charset=utf-8",
      // Ajax 获取的数据类型
      dataType: 'json',
      /**
       * 请求返回数据格式化
       * @param res 返回的数据
       * @returns {Array} 格式化的内容，应当是个对象数组，单一级别的地址内容
       */
      responseHandler: function (res) {
        return res.data;
      },
      /**
       * 初始化加载成功回调
       * @param data 请求回的数据
       */
      success: function (data) {
      },
      /**
       * 单击节点事件回调方法
       * @param event 节点event
       * @param node 节点数据
       */
      onClickNode: function (event, node) {
      }
    },
    // 以targetId为key存储选中节点对象
    checkedNodes = {},
    methods = {
      /**
       * 获取选中的节点对象
       * @returns {Array} 节点对象数组
       */
      getCheckedNodes: function () {
        return checkedNodes[this.targetId] || [];
      }
    };

  $.fn.extend({
    'areaSelector': function (options) {
      $(this).wrap('<div class="area-selector"></div>');
      if (options !== undefined && typeof options !== 'object') return this;
      let $areaSelectorInput = $(this), targetId = $areaSelectorInput.attr('id'),
        classes = constants.classes, nodeObj = {}, param = {},
        html = constants.html, config = $.extend({}, defaults, options),
        // 级联组件对象，其中包含一些常用方法
        treeSelect = {targetId: targetId, config: config};
      $areaSelectorInput.attr(constants.defaultAttrs).after(html.dropdown(targetId));
      if (config.disabled) $areaSelectorInput.attr('disabled', 'disabled');
      let $areaSelector = $areaSelectorInput.parent('.area-selector'),
        $areaSelector_dropdown = $areaSelectorInput.siblings('.area-selector-dropdown');
      param[config.pIdKey] = config.rootPId;
      $.ajax({
        type: config.type,
        data: config.contentType.indexOf('application/json') > -1 ? JSON.stringify(param) : param,
        contentType: config.contentType,
        url: config.url,
        dataType: config.dataType,
        success: function (data) {
          let lis = '', nodes = config.responseHandler(data);
          $.each(nodes, function (i, node) {
            let nodeId = node[config.idKey];
            lis += html.li(nodeId, node[config.name]);
            nodeObj[$.trim(nodeId)] = node;
          });
          $('#area_selector_country_' + targetId + ' ul').html(lis);
          $('#nav_area_selector_country_' + targetId + ' a').tab('show');
          config.success(data);
        }
      });

      /**
       * 文本框单击事件绑定，展开面板操作
       */
      $areaSelectorInput.on('click', function () {
        if ($areaSelectorInput.hasClass('is-invalid')) $areaSelectorInput.removeClass('is-invalid');
        if (!$areaSelector.hasClass(classes.isFocus)) {
          adjustPanelDirection($areaSelectorInput, $areaSelector_dropdown);
          $areaSelector_dropdown.addClass(classes.zoomInTopEnterActive).addClass(classes.zoomInTopEnter);
          $areaSelector.addClass(classes.isFocus);
          setTimeout(function () {
            $areaSelector_dropdown.removeClass(classes.zoomInTopEnter);
          }, 7);
          setTimeout(function () {
            $areaSelector_dropdown.removeClass(classes.zoomInTopEnterActive);
          }, 300);
        } else {
          closePanel($areaSelector, $areaSelector_dropdown);
        }
      });

      $areaSelector_dropdown.on('click', '.tab-content li', function () {
        let $this = $(this), name = $this.text(), node = nodeObj[$.trim($this.attr('data-id'))], nodeId = node[config.idKey];
        $this.addClass('active').siblings().removeClass('active');
        let tabId = $this.parents('.tab-pane').attr('id'), navId = 'nav_' + tabId;
        $('#' + navId + ' .nav-link').text(name);
        config.onClickNode(this, node);
        if (navId === 'nav_area_selector_street_' + targetId) {
          saveValue(targetId, $areaSelectorInput, config, nodeObj);
          closePanel($areaSelector, $areaSelector_dropdown);
        } else {
          param[config.pIdKey] = nodeId;
          $.ajax({
            type: config.type,
            data: config.contentType.indexOf('application/json') > -1 ? JSON.stringify(param) : param,
            contentType: config.contentType,
            url: config.url,
            dataType: config.dataType,
            success: function (data) {
              let lis = '', nodes = config.responseHandler(data), $tab = $('#' + tabId);
              $tab.nextAll().html('<ul></ul>');
              $.each(nodes, function (i, node) {
                let nodeId = node[config.idKey];
                lis += html.li(nodeId, node[config.name]);
                nodeObj[$.trim(nodeId)] = node;
              });
              $tab.next().find('ul').html(lis);
              $('#' + navId + '~ .nav-item .nav-link').addClass('d-none').text('请选择');
              if ($.isEmptyObject(nodes)) {
                saveValue(targetId, $areaSelectorInput, config, nodeObj);
                closePanel($areaSelector, $areaSelector_dropdown);
              } else {
                $('#' + navId + ' + .nav-item .nav-link').removeClass('d-none').click();
              }
            }
          });
        }
      });

      /**
       * 单击空白处关闭面板
       */
      $(document).on('click', function (e) {
        if (!$areaSelector.is(e.target) && $areaSelector.has(e.target).length === 0) {
          if ($areaSelector.hasClass(classes.isFocus)) {
            closePanel($areaSelector, $areaSelector_dropdown);
          }
        }
      });

      /**
       * 文本框父元素滚动监听，用于计算如何显示面板
       */
      $areaSelector.parents().scroll(function () {
        adjustPanelDirection($areaSelectorInput, $areaSelector_dropdown);
      });

      /**
       * 获取或设置值
       * @param val 默认为获取值，设置默认值填idKey的数组
       * @returns {[]|*} idKey的数组
       */
      methods.val = function (val) {
        if (val === undefined) {
          let values = [], config = this.config;
          $.each(checkedNodes[this.targetId], function (i, node) {
            values.push(node[config.idKey]);
          });
          return values;
        } else {
          if (!$.isEmptyObject(val)) {
            // 加入rootId，查询第一层的数据
            val.unshift(config.rootPId);
            for (let i = 0; i < val.length; i++) {
              param[config.pIdKey] = val[i];
              $.ajax({
                type: config.type,
                data: config.contentType.indexOf('application/json') > -1 ? JSON.stringify(param) : param,
                contentType: config.contentType,
                url: config.url,
                dataType: config.dataType,
                success: function (data) {
                  let lis = '', nodes = config.responseHandler(data), nodeId = val[i + 1];
                  $.each(nodes, function (i, node) {
                    let nodeId = node[config.idKey];
                    lis += html.li(nodeId, node[config.name]);
                    nodeObj[$.trim(nodeId)] = node;
                  });
                  $('#areaSelector_panel_' + targetId + ' .tab-content .tab-pane').eq(i).find('ul').html(lis).find('li[data-id=' + nodeId + ']').addClass('active');
                  if ($.isEmptyObject(nodes) || nodeId === undefined) {
                    setTimeout(function () {
                      $('#areaSelector_panel_' + targetId + ' .nav-tabs .nav-item').eq(i - 1).find('.nav-link').tab('show');
                      saveValue(targetId, $areaSelectorInput, config, nodeObj);
                    }, 30);
                  } else {
                    $('#areaSelector_panel_' + targetId + ' .nav-tabs .nav-item').eq(i).find('.nav-link').text(nodeObj[$.trim(nodeId)][config.name]).removeClass('d-none');
                  }
                }
              });
            }
          }
        }
      };
      return $.extend({}, treeSelect, methods);
    }
  });

  /**
   * 调整面板方法
   * @param $this 下来文本框对象
   * @param $areaSelector_dropdown 下来面板对象
   */
  function adjustPanelDirection($this, $areaSelector_dropdown) {
    if ($this && $areaSelector_dropdown && $this.length > 0 && $areaSelector_dropdown.length > 0) {
      let bottom = $(window).height() - ($this.offset().top - $(document).scrollTop());
      if (bottom <= 250) {
        $areaSelector_dropdown.attr('x-placement', 'top-start');
      } else {
        $areaSelector_dropdown.attr('x-placement', 'bottom-start');
      }
    }
  }

  /**
   * 保存选中的值
   * @param targetId 组件id
   * @param $areaSelectorInput 文本框对象
   * @param config 配置信息
   * @param nodeObj 所有节点的对象
   */
  function saveValue(targetId, $areaSelectorInput, config, nodeObj) {
    let names = [], nodes = [];
    $('#areaSelector_panel_' + targetId + ' .tab-content li.active').each(function (i, e) {
      names.push($(e).text());
      nodes.push(nodeObj[$(e).attr('data-id')])
    });
    checkedNodes[targetId] = nodes;
    if ($areaSelectorInput.hasClass('is-invalid')) $areaSelectorInput.removeClass('is-invalid');
    $areaSelectorInput.val(names.join(config.separator));
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
    }
  }


})(jQuery);