$(function () {
  // 在初始化时可以创造监听，当然可以不使用,不需要初始化时进行回调可以删除onClickAfter方法
  honeySwitch.init({
    themeColor: '#007bff',
    onClickAfter: function (isOn, $this) {
      console.log(isOn, $this)
    }
  });

  // 已经初始化后也可以创建监听, 第一个参数是jQuery的选择器
  switchEvent("#demo1",function(){
    console.log('开了')
  },function(){
    console.log('关了')
  });
});