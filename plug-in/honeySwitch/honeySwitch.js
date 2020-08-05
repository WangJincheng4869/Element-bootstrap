var honeySwitch = {};
honeySwitch.themeColor = "rgb(100, 189, 99)";
honeySwitch.init = function(e) {
  if (typeof e === "object" ) {
    for (let i in e) {
      if (typeof e[i] === 'string') {
        honeySwitch[i] = e[i];
      }
    }
  }
	var s = "<span class='slider'></span>";
	$("[class^=switch]").append(s);
	$("[class^=switch]").on('click', function() {
		if ($(this).hasClass("switch-disabled")) {
			return;
		}
		if ($(this).hasClass("switch-on")) {
			$(this).removeClass("switch-on").addClass("switch-off");
			$(".switch-off").css({
				'border-color' : '#dfdfdf',
				'box-shadow' : 'rgb(223, 223, 223) 0px 0px 0px 0px inset',
				'background-color' : 'rgb(255, 255, 255)'
			});
		} else {
			$(this).removeClass("switch-off").addClass("switch-on");
			if (honeySwitch.themeColor) {
				var c = honeySwitch.themeColor;
				$(this).css({
					'border-color' : c,
					'box-shadow' : c + ' 0px 0px 0px 16px inset',
					'background-color' : c
				});
			}
			if ($(this).attr('themeColor')) {
				var c2 = $(this).attr('themeColor');
				$(this).css({
					'border-color' : c2,
					'box-shadow' : c2 + ' 0px 0px 0px 16px inset',
					'background-color' : c2
				});
			}
		}
		// 初始化switch的回调方法 参数1-单击后开关的状态 参数2当前元素
		if (e && e.onClickAfter) {
			e.onClickAfter($(this).hasClass("switch-on"), $(this));
		}
	});
	window.switchEvent = function(ele, on, off) {
		$(ele).click(function() {
			if ($(this).hasClass("switch-disabled")) {
				return;
			}
			if ($(this).hasClass('switch-on')) {
				if ( typeof on == 'function') {
					on();
				}
			} else {
				if ( typeof off == 'function') {
					off();
				}
			}
		});
	};
	if (this.themeColor) {
    let c = this.themeColor;
    $(".switch-on").css({
			'border-color' : c,
			'box-shadow' : c + ' 0px 0px 0px 16px inset',
			'background-color' : c
		});
		$(".switch-off").css({
			'border-color' : '#dfdfdf',
			'box-shadow' : 'rgb(223, 223, 223) 0px 0px 0px 0px inset',
			'background-color' : 'rgb(255, 255, 255)'
		});
	}
	if ($('[themeColor]').length > 0) {
		$('[themeColor]').each(function() {
      let c = $(this).attr('themeColor') || honeySwitch.themeColor;
      if ($(this).hasClass("switch-on")) {
				$(this).css({
					'border-color' : c,
					'box-shadow' : c + ' 0px 0px 0px 16px inset',
					'background-color' : c
				});
			} else {
				$(".switch-off").css({
					'border-color' : '#dfdfdf',
					'box-shadow' : 'rgb(223, 223, 223) 0px 0px 0px 0px inset',
					'background-color' : 'rgb(255, 255, 255)'
				});
			}
		});
	}
};
honeySwitch.showOn = function(ele) {
	$(ele).removeClass("switch-off").addClass("switch-on");
	if(honeySwitch.themeColor){
    let c = honeySwitch.themeColor;
    $(ele).css({
			'border-color' : c,
			'box-shadow' : c + ' 0px 0px 0px 16px inset',
			'background-color' : c
		});
	}
	if ($(ele).attr('themeColor')) {
    let c2 = $(ele).attr('themeColor');
    $(ele).css({
			'border-color' : c2,
			'box-shadow' : c2 + ' 0px 0px 0px 16px inset',
			'background-color' : c2
		});
	}
};
honeySwitch.showOff = function(ele) {
	$(ele).removeClass("switch-on").addClass("switch-off");
	$(".switch-off").css({
		'border-color' : '#dfdfdf',
		'box-shadow' : 'rgb(223, 223, 223) 0px 0px 0px 0px inset',
		'background-color' : 'rgb(255, 255, 255)'
	});
};