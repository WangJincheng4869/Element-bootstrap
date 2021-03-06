layer.config({
  offset: '100px',
  resize: false
});

$('#btn_success').on('click', function () {
  layer.msg('恭喜你，这是一条成功消息', {
    skin: 'layer-success',
  });
});
$('#btn_warning').on('click', function () {
  layer.msg('警告哦，这是一条警告消息', {
    skin: 'layer-warning',
  });
});
$('#btn_msg').on('click', function () {
  layer.msg('这是一条消息提示');
});
$('#btn_error').on('click', function () {
  layer.msg('错了哦，这是一条错误消息', {
    skin: 'layer-error',
  });
});


$('#btn_alert').on('click', function () {
  layer.alert('我是一个alert');
});
$('#btn_confirm').on('click', function () {
  layer.confirm('您是如何看待前端开发？', {
    btn: ['重要', '奇葩'] //按钮
  }, function () {
    layer.msg('的确很重要', {
      offset: '100px'
    });
  }, function () {
    layer.msg('也可以这样', {
      time: 20000, //20s后自动关闭
      btn: ['明白了', '知道了']
    });
  });
});
$('#btn_open').on('click', function (e) {
  layer.open({
    type: 1,
    btn: ['按钮一', '按钮二', '按钮三'],
    content: '内容这里也可以写<b>html</b><br><i>要将允许拉伸关掉哦！</i>',
    success: function () {
      e.target.blur();
    }
  });
});

laydate.render({
  elem: '#inputDate',
  change: function (value, date) { //监听日期被切换
    lay('#testView').html(value);
  }
});

laydate.render({
  elem: '#inputDate_1',
  type: 'datetime',
  range: true //或 range: '~' 来自定义分割字符
});

let ticks = [], ticks_labels = [];
for (let i = 1; i <= 12; i++) {
  ticks.push(i);
  ticks_labels.push('<span>' + i + '</span>');
}

$('#input_range').slider({
  min: 1,
  max: 12,
  step: 1,
  value: 1,
  ticks: ticks,
  ticks_labels: ticks_labels
});

$('select').selectpicker();

let options = [
  {
    id: 0,
    parentId: -1,
    name: "北京",
    level: 1,
    index: 0
  }, {
    id: 18,
    parentId: -1,
    name: "黑龙江省",
    level: 1,
    index: 1
  }, {
    id: 19,
    parentId: 18,
    name: "哈尔滨市",
    level: 2,
    index: 0
  }, {
    id: 1,
    parentId: 0,
    name: "丰台区",
    level: 2,
    index: 0
  }, {
    id: 10,
    parentId: 0,
    name: "海淀区",
    level: 2,
    index: 1
  }, {
    id: 50,
    parentId: 18,
    name: "绥化市",
    level: 2,
    index: 1
  }, {
    id: 11,
    parentId: 10,
    name: "三环以内",
    level: 3,
    index: 0
  }, {
    id: 2,
    parentId: 1,
    name: "四环到五环之间",
    level: 3,
    index: 0
  }, {
    id: 20,
    parentId: 19,
    name: "南岗区",
    level: 3,
    index: 0
  }, {
    id: 201,
    parentId: 20,
    name: "南岗区街道",
    level: 4,
    index: 0
  }, {
    id: 4,
    parentId: 1,
    name: "二环到三环",
    level: 3,
    index: 1
  }, {
    id: 12,
    parentId: 10,
    name: "三环到四环之间",
    level: 3,
    index: 1
  }, {
    id: 49,
    parentId: 19,
    name: "香坊区",
    level: 3,
    index: 1
  }, {
    id: 13,
    parentId: 10,
    name: "四环到五环之间",
    level: 3,
    index: 2
  }, {
    id: 5,
    parentId: 1,
    name: "三环到四环之间",
    level: 3,
    index: 2
  }, {
    id: 6,
    parentId: 1,
    name: "五环到六环之间",
    level: 3,
    index: 3
  }, {
    id: 14,
    parentId: 10,
    name: "五环到六环之间",
    level: 3,
    index: 3
  }, {
    id: 15,
    parentId: 10,
    name: "六环以外",
    level: 3,
    index: 4
  }, {
    id: 7,
    parentId: 1,
    name: "六环之外",
    level: 3,
    index: 4
  }, {
    id: 8,
    parentId: 1,
    name: "大红门街道",
    level: 3,
    index: 5
  }, {
    id: 16,
    parentId: 10,
    name: "西三旗街道",
    level: 3,
    index: 5
  }, {
    id: 17,
    parentId: 10,
    name: "西二旗",
    level: 3,
    index: 6
  }, {
    id: 9,
    parentId: 1,
    name: "东高地街道",
    level: 3,
    index: 6
  }, {
    id: 21,
    parentId: 10,
    name: "八里庄街道",
    level: 3,
    index: 7
  }, {
    id: 22,
    parentId: 10,
    name: "北太平庄街道",
    level: 3,
    index: 8
  }, {
    id: 23,
    parentId: 10,
    name: "北下关街道",
    level: 3,
    index: 9
  }, {
    id: 24,
    parentId: 10,
    name: "东升镇",
    level: 3,
    index: 10
  }, {
    id: 25,
    parentId: 10,
    name: "甘家口街道",
    level: 3,
    index: 11
  }, {
    id: 26,
    parentId: 10,
    name: "海淀街道",
    level: 3,
    index: 12
  }, {
    id: 27,
    parentId: 10,
    name: "花园路街道",
    level: 3,
    index: 13
  }, {
    id: 28,
    parentId: 10,
    name: "马连洼街道",
    level: 3,
    index: 14
  }, {
    id: 29,
    parentId: 10,
    name: "青龙桥街道",
    level: 3,
    index: 15
  }, {
    id: 30,
    parentId: 10,
    name: "清河街道",
    level: 3,
    index: 16
  }, {
    id: 31,
    parentId: 10,
    name: "清华园街道",
    level: 3,
    index: 17
  }, {
    id: 32,
    parentId: 10,
    name: "上地街道",
    level: 3,
    index: 18
  }, {
    id: 33,
    parentId: 10,
    name: "上庄镇",
    level: 3,
    index: 19
  }, {
    id: 34,
    parentId: 10,
    name: "曙光街道",
    level: 3,
    index: 20
  }, {
    id: 35,
    parentId: 10,
    name: "四季青镇",
    level: 3,
    index: 21
  }, {
    id: 36,
    parentId: 10,
    name: "苏家坨镇",
    level: 3,
    index: 22
  }, {
    id: 37,
    parentId: 10,
    name: "田村路街道",
    level: 3,
    index: 23
  }, {
    id: 38,
    parentId: 10,
    name: "万柳地区",
    level: 3,
    index: 24
  }, {
    id: 39,
    parentId: 10,
    name: "万寿路街道",
    level: 3,
    index: 25
  }, {
    id: 40,
    parentId: 10,
    name: "温泉镇",
    level: 3,
    index: 26
  }, {
    id: 41,
    parentId: 10,
    name: "西北旺镇",
    level: 3,
    index: 27
  }, {
    id: 42,
    parentId: 10,
    name: "香山街道",
    level: 3,
    index: 28
  }, {
    id: 43,
    parentId: 10,
    name: "学院路街道",
    level: 3,
    index: 29
  }, {
    id: 44,
    parentId: 10,
    name: "燕园街道",
    level: 3,
    index: 30
  }, {
    id: 45,
    parentId: 10,
    name: "羊坊店街道",
    level: 3,
    index: 31
  }, {
    id: 46,
    parentId: 10,
    name: "永定路街道",
    level: 3,
    index: 32
  }, {
    id: 47,
    parentId: 10,
    name: "中关村街道",
    level: 3,
    index: 33
  }, {
    id: 48,
    parentId: 10,
    name: "紫竹院街道",
    level: 3,
    index: 34
  }
];

let test_cascader = $('#test_cascader').cascader({
  pIdKey: 'parentId',
  disabled: false,
  separator: ' / ',
  onClickNode: function (e) {
    console.log(e);
  }
}, options);

$('#btn_getCascaderVal').on('click', function () {
  console.log(test_cascader.val());
  console.log(test_cascader.getCheckedNodes());
  console.log(test_cascader.getCheckedNodes(true));
});

$('#btn_setCascaderVal').on('click', function () {
  test_cascader.val([0, 10, 31])
});
let setting = {
    view: {
      showIcon: false
    },
    data: {
      simpleData: {
        enable: true
      }
    },
    check: {
      enable: true
    }
  },
  zNodes = [
    {id: 1, pId: 0, name: "父节点1 - 展开", open: true},
    {id: 11, pId: 1, name: "父节点11 - 折叠", chkDisabled: true},
    {id: 111, pId: 11, name: "叶子节点111"},
    {id: 112, pId: 11, name: "叶子节点112"},
    {id: 113, pId: 11, name: "叶子节点113", checked: true, chkDisabled: true},
    {id: 114, pId: 11, name: "叶子节点114", chkDisabled: true},
    {id: 12, pId: 1, name: "父节点12 - 折叠"},
    {id: 121, pId: 12, name: "叶子节点121"},
    {id: 122, pId: 12, name: "叶子节点122"},
    {id: 123, pId: 12, name: "叶子节点123"},
    {id: 124, pId: 12, name: "叶子节点124"},
    {id: 13, pId: 1, name: "父节点13 - 没有子节点", isParent: true},
    {id: 2, pId: 0, name: "父节点2 - 折叠"},
    {id: 21, pId: 2, name: "父节点21 - 展开", open: true},
    {id: 211, pId: 21, name: "叶子节点211"},
    {id: 212, pId: 21, name: "叶子节点212"},
    {id: 213, pId: 21, name: "叶子节点213"},
    {id: 214, pId: 21, name: "叶子节点214"},
    {id: 22, pId: 2, name: "父节点22 - 折叠"}, {id: 221, pId: 22, name: "叶子节点221"},
    {id: 222, pId: 22, name: "叶子节点222"},
    {id: 223, pId: 22, name: "叶子节点223"},
    {id: 224, pId: 22, name: "叶子节点224"},
    {id: 23, pId: 2, name: "父节点23 - 折叠"},
    {id: 231, pId: 23, name: "叶子节点231"},
    {id: 232, pId: 23, name: "叶子节点232"},
    {id: 233, pId: 23, name: "叶子节点233"},
    {id: 234, pId: 23, name: "叶子节点234"},
    {id: 3, pId: 0, name: "父节点3 - 没有子节点", isParent: true}
  ];

$.fn.zTree.init($("#treeDemo"), setting, zNodes);
setting.check.chkStyle = 'radio';
$.fn.zTree.init($("#treeDemoRadio"), setting, zNodes);

let treeSelect = $('#treeSelect').treeSelect({
  pIdKey: 'pId',
  rootPId: 0,
  disabled: false,
  onlySelectOne: false,
  separator: ' / '
}, zNodes);


$('#btn_getTreeSelectVal').on('click', function () {
  console.log(treeSelect.val());
  console.log(treeSelect.getCheckedNodes());
});

$('#btn_setTreeSelectVal').on('click', function () {
  // treeSelect.val(124);
  treeSelect.val([234, 224, 124]);
});

$('#btn_getTreeSelectObj').on('click', function () {
  console.log($.fn.tree_select.getTreeSelectObj('treeSelect'));
});

$('#btn_zTreeObj').on('click', function () {
  console.log(treeSelect.getZTreeObj());
});

let test_area_selector = $('#test_area_selector').areaSelector({
  url: 'area.json',
  type: 'get',
  disabled: false,
  responseHandler: function (res) {
    return res;
  }
});

$('#btn_getAreaVal').on('click', function () {
  console.log(test_area_selector.val());
  console.log(test_area_selector.getCheckedNodes());
});

$('#btn_setAreaVal').on('click', function () {
  test_area_selector.val([-1, 0, 0, 10, 17]);
});

$('#btn_notify_auto_close').on('click', function () {
  $.fn.notify({
    delay: 20000,
    title: 'Bootstrap',
    content: 'Heads up, toasts will stack automatically',
    onClick: function (e) {
      layer.msg('点我干啥？？？')
    }
  });
});

$('#btn_notify_success').on('click', function () {
  $.fn.notify({
    delay: 20000,
    title: 'Bootstrap',
    content: 'Heads up, toasts will stack automatically',
    icon: 'success',
    onClick: function (e) {
      layer.msg('点我干啥？？？')
    }
  });
});

$('#btn_notify_warning').on('click', function () {
  $.fn.notify({
    delay: 20000,
    title: 'Bootstrap',
    content: 'Heads up, toasts will stack automatically',
    icon: 'warning',
    onClick: function (e) {
      layer.msg('点我干啥？？？')
    }
  });
});

$('#btn_notify_danger').on('click', function () {
  $.fn.notify({
    delay: 20000,
    title: 'Bootstrap',
    content: 'Heads up, toasts will stack automatically',
    icon: 'error',
    onClick: function (e) {
      layer.msg('点我干啥？？？')
    }
  });
});


$('#table').bootstrapTable({
  classes: 'table',
  singleSelect: true, // 启用单选模式
  pagination: true, // 开启分页
  paginationLoop: false, // 分页循环
  paginationPreText: '上一页',
  paginationNextText: '下一页',
  data: options,
  columns: [{
    checkbox: true,
  }, {
    field: 'id',
    title: 'Item ID',
    sortable: true
  }, {
    field: 'name',
    title: 'Item Name',
    sortable: true
  }, {
    field: 'level',
    title: 'Item Price',
    sortable: true
  }]
});
let autocompleteData = [];
for (let i = 0; i < 20; i++) {
  autocompleteData.push({
    name: '选项' + i,
    value: '选项' + i
  })
}

$('#exampleFormControlInput1').autocomplete(autocompleteData);