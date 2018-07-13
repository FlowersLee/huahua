var _viewer = this;
//对列表上数据双击查看绑定事件
_viewer.grid.unbindTrdblClick();
_viewer.grid.dblClick(function(value, node) {
	//双击打开该数据的服务卡片页面
	Todo.openEntity(_viewer);
}, _viewer);

//添加说明信息
var momeObj = jQuery.parseJSON(System.getVar("@C_SY_LIST_MEMO_CONFIG_OBJ@") || "{}");
var titleStyle = "font-size:12px;margin:0px 10px;color:red;text-align:left;padding:6px;";
if ("" != (momeObj[_viewer.servId] || "")) {
	_viewer.addRedHeader(momeObj[_viewer.servId],titleStyle);
}