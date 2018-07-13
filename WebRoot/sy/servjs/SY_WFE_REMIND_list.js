var _viewer = this;

//添加说明信息
var momeObj = jQuery.parseJSON(System.getVar("@C_SY_LIST_MEMO_CONFIG_OBJ@") || "{}");
var titleStyle = "font-size:12px;margin:0px 10px;color:red;text-align:left;padding:6px;";
if ("" != (momeObj[_viewer.servId] || "")) {
	_viewer.addRedHeader(momeObj[_viewer.servId],titleStyle);
}