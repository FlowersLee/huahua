var _viewer = this;
var pServId = _viewer.getParHandler().servId;
var dictId = "SY_ORG_DEPT_USER";
if (pServId.indexOf("_ALL") > 0) {
	dictId = dictId + "_ALL";
	userScope = "ALL";
} else if (pServId.indexOf("_SUB") > 0) {
	dictId = dictId + "_SUB";
	userScope = "SUB";
} else {
	userScope = "IN";
}

_viewer.getBtn("batchAdd").unbind("click").bind("click",function(event) {//选择添加用户按钮
	var configStr = dictId + ",{'TYPE':'multi'}";
	var extendTreeSetting = {'cascadecheck':true,"childOnly":true};
	var options = {"itemCode":"hello","config" : configStr,"hide":"explode","show":"blind",
	"extendDicSetting":extendTreeSetting,
	"replaceCallBack":function(idArray,nameArray) {
		   var roleCode = _viewer.getParHandler().getItem("GROUP_CODE").getValue();
		   if (idArray.length > 0) {
			   var batchData = {};
			   var tempArray = [];
			   jQuery.each(idArray,function(i,n) {
				   var temp = {"GROUP_CODE":roleCode,"USER_CODE":n};
				   tempArray.push(temp);
			   });
			   batchData["BATCHDATAS"] = tempArray;
			   var resultData = FireFly.batchSave(_viewer.servId,batchData,null,_viewer.getNowDom());
			   _viewer.refreshGrid();
		   }
	  }
	};
	var dictView = new rh.vi.rhDictTreeView(options);
	dictView.show(event);
});
	
_viewer.getBtn("copyUser").unbind("click").bind("click",function(event) {//复制群组用户
	var inputName = "groupCodes";
	
	var configStr = pServId + ",{'TARGET':'GROUP_CODE~','SOURCE':'GROUP_CODE~GROUP_NAME~GROUP_TYPE','TYPE':'single'}";
	var options = {"itemCode":inputName,
	"config" :configStr,
	"rebackCodes":inputName,
	"parHandler":this,
	"formHandler":this,
	"replaceCallBack":function(objs){
			copyUser(objs.GROUP_CODE, userScope);
		}
	};
	var queryView = new rh.vi.rhSelectListView(options);
	queryView.show(event);	
});

/**
 * 批量复制群组下用户
 */
function copyUser(groupObjs, userScope) {
	if (groupObjs.length > 0) {
		var data = {};
		data["GROUP_CODE"] = _viewer.getParHandler().getItem("GROUP_CODE").getValue();
		data["USER_SCOPE"] = userScope;
		data["FROM_GROUP_CODE"] = groupObjs;
		var resultData = FireFly.doAct(_viewer.servId, "copyUser", data);
		_viewer.refreshGrid();
	}	
}