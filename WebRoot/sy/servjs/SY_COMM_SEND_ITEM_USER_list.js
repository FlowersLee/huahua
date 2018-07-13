var _viewer = this;

var addUser = _viewer.getBtn("add_user");

addUser.unbind("click").bind("click", function() {
	// 1.构造树形选择参数
	var configStr = "SY_ORG_DEPT_USER_SUB,{'TYPE':'multi'}";// 此部分参数说明可参照说明文档的【树形选择】配置说明

	var extendTreeSetting = "{'cascadecheck':true,'childOnly':true}";

	var options = {
		"config" : configStr,
		"extendDicSetting" : StrToJson(extendTreeSetting),// 非必须参数，一般用不到
		"replaceCallBack" : function(idArray, nameArray) {// 回调，idArray为选中记录的相应字段的数组集合
			selectCallback(idArray, nameArray);
		}
	};
	// 2.显示树形
	var dictView = new rh.vi.rhDictTreeView(options);
	dictView.show(event);
});

function selectCallback(idArray, nameArray) {
	var param = {};
	param.idArray = idArray.join(",");
	param.nameArray = nameArray.join(",");
	param["ITEM_TYPE"] = "USER";
	param["SEND_ID"] = _viewer.getParHandler().getItem("SEND_ID").getValue();
	FireFly.doAct(_viewer.getParHandler().servId, "saveItem", param, true,
			false, function() {
				_viewer.refreshGridBodyNoResize();
			});
}