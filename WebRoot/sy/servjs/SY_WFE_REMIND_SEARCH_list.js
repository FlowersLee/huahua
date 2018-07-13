var _viewer = this;

/**
 * 打开行数据对应的审批单
 */
_viewer.grid.unbindTrdblClick();
_viewer.grid.dblClick(function(value,node) {
	var servId = "SY_WFE_REMIND";
	var dataId = _viewer.grid.getSelectItemVal("REMD_ID");
	var title = _viewer.grid.getSelectItemVal("REMD_TITLE");
	var params = {"handlerRefresh":_viewer};
	var options = {"url":servId + ".card.do?pkCode=" + dataId, "tTitle":title,"menuFlag":3,"params":params};
	Tab.open(options);
},_viewer);

//添加说明信息
var momeObj = jQuery.parseJSON(System.getVar("@C_SY_LIST_MEMO_CONFIG_OBJ@") || "{}");
var titleStyle = "font-size:12px;margin:0px 10px;color:red;text-align:left;padding:6px;";
if ("" != (momeObj[_viewer.servId] || "")) {
	_viewer.addRedHeader(momeObj[_viewer.servId],titleStyle);
}