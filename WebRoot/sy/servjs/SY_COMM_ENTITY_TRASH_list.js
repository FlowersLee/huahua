var _viewer = this;
//对列表上选中行双击查看绑定事件
_viewer.grid.unbindTrdblClick();
_viewer.grid.dblClick(function(value, node) {
	//双击打开该选中行的服务卡片页面
	Todo.openEntity(_viewer);
}, _viewer);

//彻底删除
_viewer.getBtn("thoroughDelete").unbind("click").bind("click",function(){
	var servIDArry = _viewer.grid.getSelectItemValues("SERV_ID");
	var dataIDArry = _viewer.grid.getSelectItemValues("DATA_ID");
	var servIDs = "";
	var dataIDs = "";
	for (var i = 0; i < servIDArry.length; i++) {
		if ("" != (servIDArry[i] || "")) {
			servIDs += servIDArry[i] + ",";
		}
	}
	for (var i = 0; i < dataIDArry.length; i++) {
		if ("" != (dataIDArry[i] || "")) {
			dataIDs += dataIDArry[i] + ",";
		}
	}
	/*if (servIDs.lastIndexOf(",") == (servIDs.length - 1)) {
		servIDs = servIDs.substring(0, servIDs.length - 1);
	}
	if (dataIDs.lastIndexOf(",") == (dataIDs.length - 1)) {
		dataIDs = dataIDs.substring(0, dataIDs.length - 1);
	}*/
	var outObj = FireFly.doAct(_viewer.servId,"thoroughDelete",{"servIds":servIDs,"dataIds":dataIDs});
	if (outObj["MSG"] == "OK") {
		_viewer.refresh();
		_viewer.listBarTip("有" + outObj["COUNT"] + "条数据删除成功");
	}
});

//添加说明信息
var momeObj = jQuery.parseJSON(System.getVar("@C_SY_LIST_MEMO_CONFIG_OBJ@") || "{}");
var titleStyle = "font-size:12px;margin:0px 10px;color:red;text-align:left;padding:6px;";
if ("" != (momeObj[_viewer.servId] || "")) {
	_viewer.addRedHeader(momeObj[_viewer.servId],titleStyle);
}
