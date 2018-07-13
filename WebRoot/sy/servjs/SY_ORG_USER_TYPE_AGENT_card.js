var _viewer = this;

var saveBtn = _viewer.getBtn("save");
var startAgentBtn = _viewer.getBtn("startAgent");
var stopAgentBtn = _viewer.getBtn("stopAgent");

if (_viewer.itemValue("AGT_STATUS") == 1) {
	_viewer.getItem("AGT_STATUS").obj.css({"background-color":"green","color":"black"});
	_viewer.getItem("AGT_STATUS").obj.parent().css({"background-color":"green","color":"black"});
}
if (_viewer.itemValue("AGT_STATUS") == 2) {
	_viewer.getItem("AGT_STATUS").obj.css({"background-color":"red","color":"black"});
	_viewer.getItem("AGT_STATUS").obj.parent().css({"background-color":"red","color":"black"});
}
if (saveBtn && (_viewer.itemValue("AGT_STATUS") == 1 || _viewer.itemValue("AGT_STATUS") == 2)) {
	saveBtn.hide();
}
if (startAgentBtn && (_viewer.itemValue("AGT_STATUS") == 1 || _viewer.getPKCode() == "" || _viewer.itemValue("AGT_STATUS") == 2)) {
	startAgentBtn.hide();
}
if (stopAgentBtn && (_viewer.itemValue("AGT_STATUS") != 1)){
	stopAgentBtn.hide();
}

//按钮：启动所有委托
startAgentBtn.unbind("click").bind("click",function(event){
	if(!jQuery.isEmptyObject(_viewer.getChangeData())){
		alert("请先保存");
		return;
	}
	if(!checkValid()){
		//_viewer.refresh();
		return;
	}
	if(!confirm("确认后您将处于委托状态？")){
		return;
	}
	var param = {
			"_PK_":_viewer.getPKCode(),
			"USER_CODE": _viewer.itemValue("USER_CODE"),
			"TO_USER_CODE": _viewer.itemValue("TO_USER_CODE"),
			"AGT_BEGIN_DATE": _viewer.itemValue("AGT_BEGIN_DATE"),
			"AGT_END_DATE": _viewer.itemValue("AGT_END_DATE"),
			"AGT_END_TYPE": _viewer.itemValue("AGT_END_TYPE"),
			"AGT_CURRTODO_FLAG": _viewer.itemValue("AGT_CURRTODO_FLAG"),
			"AGT_MEMO": _viewer.itemValue("AGT_MEMO"),
			"AGT_STATUS": _viewer.itemValue("AGT_STATUS"),
			"action":"startAllAgent"
		};
	var result = FireFly.doAct("SY_ORG_USER_TYPE_AGENT", "doAgentAction", param, true, false);
	_viewer.refresh();
	_viewer.setParentRefresh();
	if(result[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) >= 0){
		_viewer.cardBarTip(result[UIConst.RTN_MSG]);
	}else{
		_viewer.cardBarTipError(result[UIConst.RTN_MSG]);
	}
});

//按钮：停止所有委托
stopAgentBtn.unbind("click").bind("click",function(event){
	if(!confirm("确认后您将不再处于委托状态？")){
		return;
	}
	var param = {
		"_PK_":_viewer.getPKCode(),
		"AGT_STATUS": 1,
		"action":"stopAllAgent"
	};
	var result = FireFly.doAct("SY_ORG_USER_TYPE_AGENT", "doAgentAction", param, true, false);
	_viewer.refresh();
	_viewer.setParentRefresh();
	_viewer.cardBarTip(result[UIConst.RTN_MSG]);
});

//检查提交表单有效性
function checkValid(){
	var agtStatus = _viewer.itemValue("AGT_STATUS");
	if(agtStatus == 2){
		alert("委托已结束");
		return false;
	}
	if(rhDate.doDateDiff("D", System.getVar("@DATE@"), _viewer.itemValue("AGT_BEGIN_DATE"), 0) < 0) {
		alert("开始日期必须大于当前日期！");
		return false;
	}
	if(rhDate.doDateDiff("D", _viewer.itemValue("AGT_BEGIN_DATE"), _viewer.itemValue("AGT_END_DATE"), 0) < 0) {
		alert("结束日期不能小于开始日期！");
		return false;
	}
	if(_viewer.sonTab && _viewer.sonTab.SY_ORG_USER_TYPE_AGENT_FROM){
		var listData = _viewer.sonTab.SY_ORG_USER_TYPE_AGENT_FROM.getListData();
		if(listData._DATA_.length == 0){
			alert("请先设定委托业务");
			return false;
		}
	}
	return true;
}

//保存按钮前监听
_viewer.beforeSave = function() {
	if(!checkValid()){
		//_viewer.refresh();
		jQuery('.rh-barTip').remove();
		return false;
	}
	//结束委托方式字段绑定事件
	var endType = _viewer.itemValue("AGT_END_TYPE");
	if(endType == 1){
		_viewer.getItem("AGT_END_DATE").setValue("2099-12-31");
	}else if(endType == 2){
		var endDate = _viewer.itemValue("AGT_END_DATE");
		if(endDate == ""){
			alert("自动结束委托方式请选择截止日期");
			return false;
		}
	}
};

//有效并启动状态下标识未开始与超期
var agtStatus = _viewer.itemValue("AGT_STATUS");
var sFlag = _viewer.itemValue("S_FLAG");
if(sFlag==1 && agtStatus==1){
	var statusInput = _viewer.getItem("AGT_STATUS").obj;
	var currDate = System.getVar("@DATE@");
	var beginDate = _viewer.itemValue("AGT_BEGIN_DATE");
	var endDate = _viewer.itemValue("AGT_END_DATE");
	if(rhDate.doDateDiff("D", currDate, beginDate, 0) > 0) {
		statusInput.val("已启动(未开始)").css("background-color","yellow");
		statusInput.parent().css("background-color","yellow");
	} else if(rhDate.doDateDiff("D", endDate, currDate, 0) > 0) {
		statusInput.val("已启动(超期)").css("background-color","red");
		statusInput.parent().css("background-color","red");
	} else {
		//
	}
}