(function(_viewer){
	// 下载
	_viewer.grid.getBtn("download").unbind("click").bind("click", function(event) {
		var filePath = jQuery("td[icode='FILE_PATH']", jQuery(this).parent().parent()).html();
		var fileName = jQuery("td[icode='FILE_NAME']", jQuery(this).parent().parent()).html();
		var data = {"FILE_PATH":filePath,"FILE_NAME":fileName};
		window.open(FireFly.getContextPath() + "/" + _viewer.servId + ".download.do?data=" + encodeURIComponent(jQuery.toJSON(data)));
		event.stopPropagation();
		return false;
	});
})(this);