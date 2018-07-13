var _viewer = this;

/**
 * 打开行数据对应的审批单
 */
_viewer.grid.unbindTrdblClick();
_viewer.grid.dblClick(function(value,node) {
	var servId = _viewer.grid.getSelectItemVal("SERV_ID");
	var dataId = _viewer.grid.getSelectItemVal("DATA_ID");
	var title = _viewer.grid.getSelectItemVal("TITLE");
	var params = {};
	
	var options = {"url":servId + ".card.do?pkCode=" + dataId, "tTitle":title 
				,"menuFlag":3,"params":params};

	Tab.open(options);
},_viewer);

/**
 * 查看明细的行按钮
 */
_viewer.grid.getBtn("DISPLAY_DTL").unbind("click").bind("click", function(event) {
	var btnObj = jQuery(this); //按钮对象
	//取得按钮对象对应的数据
	var servId = _viewer.grid.getRowItemValueByElement(btnObj,"SERV_ID"); 
	var dataId = _viewer.grid.getRowItemValueByElement(btnObj,"DATA_ID");
	var title = _viewer.grid.getRowItemValueByElement(btnObj,"TITLE");
	
	var params = {SERV_ID:servId,DATA_ID:dataId
			,_extWhere:" and SERV_ID ='" + servId  + "' and DATA_ID = '" + dataId + "'"};

	var opts = {
		"url" : "SY_COMM_SEND_DETAIL.list.do",
		"tTitle" : "明细:" + title,
		"params" : params,
		"menuFlag" : 3
	};
	
	Tab.open(opts);
});