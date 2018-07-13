var _viewer = this;
// 对列表上选中行双击查看绑定事件
_viewer.grid.unbindTrdblClick();
_viewer.grid.dblClick(function(value, node) {
	// 双击打开该选中行的服务卡片页面
	Todo.openEntity(_viewer);
}, _viewer);

/*var colDef = this.grid.getColumnDef("S_WF_USER_STATE");
//如果字段存在且为显示
if(colDef && colDef.ITEM_LIST_FLAG == "1"){
	var titleStr = System.getVar("@C_SY_LIST_PROMPT_CONFIG@") || "";
	var titleStyle = "font-size:12px;margin:0px 10px;color:red;text-align:left;padding:6px;";
	_viewer.addRedHeader(titleStr,titleStyle);
}*/

//添加说明信息
var momeObj = jQuery.parseJSON(System.getVar("@C_SY_LIST_MEMO_CONFIG_OBJ@") || "{}");
var titleStyle = "font-size:12px;margin:0px 10px;color:red;text-align:left;padding:6px;";
if ("" != (momeObj[(_viewer.servId == "SY_COMM_ENTITY_ATTENTION" ? _viewer.servId : "")] || "")) {
	_viewer.addRedHeader(momeObj[_viewer.servId],titleStyle);
}