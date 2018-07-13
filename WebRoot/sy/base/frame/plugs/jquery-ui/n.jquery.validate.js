(function($){ $.fn.validate = function(reg, val, msg){// 该校验方法不能连缀，传进val是因为展示错误信息的标签和被校验的标签有可能不是同一个
	if(new RegExp(reg).test(val)) {
		$(this).showOk();
		return true;
	} else {
		$(this).showError(msg);
		return false;
	}
}})(jQuery);

(function($){ $.fn.showError = function(msg){// 显示错误信息
	$(this).attr("validate_msg", msg).removeClass("correctbox").addClass("blankError").addClass("errorbox").simpletooltip();
	if ($(this).parent() && $(this).parent().parent()) {
		var name = $(this).parent().parent().find(".name");
		if (!$.isEmptyObject(name)) {
			name.addClass("error");
			if (name.find(".errorImg").length == 0) {//增加前置图片
				name.prepend(jQuery("<span class='errorImg'></span>"));
			}
		}
	}
}})(jQuery);

(function($){ $.fn.showOk = function(){// 显示错误信息
	$(this).removeAttr("validate_msg").addClass("correctbox").removeClass("blankError").removeClass("errorbox");
	if ($(this).parent() && $(this).parent().parent()) {
		var name = $(this).parent().parent().find(".name");
		if (!$.isEmptyObject(name)) {
			name.removeClass("error");
			name.find(".errorImg").remove();
		}
	}
}})(jQuery);

(function($){ $.fn.simpletooltip = function(){
	return this.each(function() {
		var text = $(this).attr("validate_msg");
		if(text != undefined) {
			$(this).hover(function(e){
				text = $(this).attr("validate_msg");
				if(!text){
					return;
				}
				var tipX = e.pageX + 12;
				var tipY = e.pageY + 12;
				$("body").append("<div id='simpleTooltip' class='validate_msg' style='position: absolute; z-index: 2000; display: none;'>" + text + "</div>");
				if($.browser.msie) var tipWidth = $("#simpleTooltip").outerWidth(true)
				else var tipWidth = $("#simpleTooltip").width()
				$("#simpleTooltip").width(tipWidth);
				$("#simpleTooltip").css("left", tipX).css("top", tipY).fadeIn("medium");
			}, function(){
				$("#simpleTooltip").remove();
			});
			$(this).mousemove(function(e){
				var tipX = e.pageX + 12;
				var tipY = e.pageY + 12;
				var tipWidth = $("#simpleTooltip").outerWidth(true);
				var tipHeight = $("#simpleTooltip").outerHeight(true);
				if(tipX + tipWidth > $(window).scrollLeft() + $(window).width()) tipX = e.pageX - tipWidth;
				if($(window).height()+$(window).scrollTop() < tipY + tipHeight) tipY = e.pageY - tipHeight;
				$("#simpleTooltip").css("left", tipX).css("top", tipY).fadeIn("medium");
			});
		}
	});
}})(jQuery);