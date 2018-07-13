var _viewer = this;

//去掉最小高度
jQuery("#" + _viewer.servId + "-winTabs").css("min-height","auto");

//“确认（转办）”按钮
_viewer.getBtn("save").unbind("click").bind("click",function(event){
	var param = {
		"RE_AGT_ID":_viewer.itemValue("RE_AGT_ID"),
		"AGT_ID":_viewer.itemValue("AGT_ID"),
		"USER_CODE":_viewer.itemValue("USER_CODE"),
		"TO_USER_CODE":_viewer.itemValue("TO_USER_CODE"),
		"AGT_TYPE_CODE":_viewer.itemValue("AGT_TYPE_CODE"),
		"AGT_USER_PATH":_viewer.itemValue("AGT_USER_PATH"),
		"SRC_AGT_ID":_viewer.itemValue("SRC_AGT_ID"),
		"REAGT_ID_PATH":_viewer.itemValue("REAGT_ID_PATH"),
		"MAIN_AGT_STATUS":_viewer.opts.params.MAIN_AGT_STATUS,
		"AGT_BEGIN_DATE": _viewer.opts.params.MAIN_AGT_BEGIN_DATE,
		"AGT_END_DATE": _viewer.opts.params.MAIN_AGT_END_DATE,
		"VALID_BEGIN_DATE": _viewer.itemValue("VALID_BEGIN_DATE"),
		"VALID_END_DATE": _viewer.itemValue("VALID_END_DATE"),
		"action":"addAgent"
	}
	var result = FireFly.doAct("SY_ORG_USER_TYPE_AGENT", "doAgentAction", param, true, false);
	if (result[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) >= 0) {
		_viewer.getParHandler().refresh();
		_viewer.backClick();
	}
});

//“取消”按钮
_viewer.getBtn("cancel").unbind("click").bind("click",function(event){
	_viewer.backClick();
});