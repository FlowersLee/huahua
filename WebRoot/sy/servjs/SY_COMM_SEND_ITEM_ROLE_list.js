var _viewer = this;

var addRole = _viewer.getBtn("add_role");

jQuery("tr.tBody-tr", _viewer.grid._table).each(function(i, n) {

	var obj = jQuery(n).find("td[icode='DEPT_NAMES']");
	
	var deptCode = jQuery(n).find("td[icode='DEPT_CODES']");
	
	var span = jQuery("<span style='color:red'>【选择部门】</span>").appendTo(obj);

	span.unbind("click").bind("click", function() {
		selectDept(n.id,deptCode.text());
	});

	// obj.html(obj.text() + "&nbsp;&nbsp;" + str);
});

addRole.unbind("click").bind("click", function() {
	// 1.构造树形选择参数
	var configStr = "SY_ORG_ROLE,{'TYPE':'multi'}";// 此部分参数说明可参照说明文档的【树形选择】配置说明

	var extendTreeSetting = "{'cascadecheck':true,'childOnly':false}";

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

function selectDept(itemId,text) {
	// 1.构造树形选择参数
	var configStr = "SY_ORG_DEPT_ALL,{'TYPE':'multi'}";// 此部分参数说明可参照说明文档的【树形选择】配置说明

	var extendTreeSetting = "{'cascadecheck':false,'childOnly':false}";

	var options = {
		"config" : configStr,
		"extendDicSetting" : StrToJson(extendTreeSetting),// 非必须参数，一般用不到
		"replaceCallBack" : function(idArray, nameArray) {// 回调，idArray为选中记录的相应字段的数组集合
			selectDeptCallback(idArray, nameArray, itemId);
		}
	};
	// 2.显示树形
	var dictView = new rh.vi.rhDictTreeView(options);
	dictView.show(event);
	dictView.tree.selectNodes(text.split(","));
}

function selectDeptCallback(idArray, nameArray, itemId) {
	var param = {};
	param["DEPT_CODES"] = idArray.join(",");
	param["DEPT_NAMES"] = nameArray.join(",");
	param["ITEM_ID"] = itemId;
	FireFly.doAct(_viewer.getParHandler().servId, "saveRoleDept", param, true,
			false, function() {
				_viewer.refreshGridBodyNoResize();
			});
}

function selectCallback(idArray, nameArray) {
	var param = {};
	param.idArray = idArray.join(",");
	param.nameArray = nameArray.join(",");
	param["ITEM_TYPE"] = "ROLE";
	param["SEND_ID"] = _viewer.getParHandler().getItem("SEND_ID").getValue();
	FireFly.doAct(_viewer.getParHandler().servId, "saveItem", param, true,
			false, function() {
				_viewer.refreshGridBodyNoResize();
			});
}