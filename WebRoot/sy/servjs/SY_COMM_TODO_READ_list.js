var _viewer = this;
// 循环查找查找icode=TODO_CODE_NAME的td，如果内容是“分发”则有复选框。
jQuery("td[icode=TODO_CODE]").each(function() {
	// 如果icode=TODO_CODE_NAME的td不是“分发”，则去掉这一行的复选框。
	if (jQuery(this).text() != "SY_COMM_SEND_DETAIL") {
		// 将不是分发类型的待阅去掉选择框，只能选择"分发"类型的待阅，然后点击“签收”按钮。
		jQuery("td.checkTD input", jQuery(this).parent()).remove();
	}
});

var cmQianShou = _viewer.getBtn("cmQianShou");
cmQianShou.bind("click", function() {
	if (!jQuery("td.checkTD input").is(':checked')) {
		if (confirm('点击\"确定\"后将签收所有待阅类型为\"分发\"的文件，否则点\"取消\"')) {
			_viewer.doActReload('readAll');
		}
	}

	else {
		_viewer.doActReload('checkRecipt');
	}

})
