var _viewer = this;
_viewer.getBtn("cmpyAcl").bind("click", function() {
	var url = "SY_ORG_ACL.show.do?CMPY_CODE=" + _viewer.getByIdData("CMPY_CODE");
	var options = {"sId":"SY_ORG_ACL-cmpy","url":url,"tTitle":"公司权限管理","menuFlag":3};
	Tab.open(options);
});

/********** 给id为transTo的按钮绑定事件：弹开人员的查询选择，并交互后台 ***********/
_viewer.getBtn("copyMenu").unbind("click").bind("click", function(event) {
//1.构造树形选择参数
var configStr = "SY_COMM_MENU_PUBLIC, {'TYPE':'multi', 'MODEL':'default'}";//此部分参数说明可参照说明文档的【树形选择】配置说明
var extendTreeSetting = "{'rhexpand':false,'expandLevel':2,'cascadecheck':true,'checkParent':true,'childOnly':false}";
var options = {
	"config" :configStr,
	"extendDicSetting":StrToJson(extendTreeSetting),//非必须参数，一般用不到
	"replaceCallBack":function(idArray,nameArray){//回调，idArray为选中记录的相应字段的数组集合
		callBack(idArray, nameArray);
	}
};
//2.显示树形
var dictView = new rh.vi.rhDictTreeView(options);
dictView.show(event);	 
});
/*
 * 回调的方法
 */
function callBack(idArray, nameArray) {
	var param = {};
	param["MENU_ID"] = idArray.join(",");
	param["CMPY_CODE"] = _viewer.getByIdData("CMPY_CODE");
	FireFly.doAct(_viewer.servId, "copyMenu", param, true);
};