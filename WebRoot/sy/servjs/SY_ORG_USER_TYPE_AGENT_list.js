var _viewer = this;
var _bldBtn = function(pkCode, actCode, actName, imgClass, func, obj){
	return jQuery('<a class="rh-icon rhGrid-btnBar-a" id="SY_ORG_USER_TYPE_AGENT-' + actCode 
			+ '" actcode="' + actCode + '"><span class="rh-icon-inner">' 
			+ actName + '</span><span class="rh-icon-img btn-' + imgClass + '"></span></a>').unbind("click").bind("click",{"id":pkCode,"trObj":obj},func);
};

//返回后刷新
var mainCardRefresh = function(result){
	_viewer.refresh();
	_viewer.listBarTip(result[UIConst.RTN_MSG]);
};

//删除委托计划
var delPlan = function(event){
	if(!confirm("是否删除委托计划？")){
		return;
	}
	var param = {
		"_PK_":event.data.id,
		"AGT_STATUS": 0,
		"action":"delPlan"
	};
	FireFly.doAct("SY_ORG_USER_TYPE_AGENT", "doAgentAction", param, true, false, mainCardRefresh);
};

//终止委托计划
var stopPlan = function(event){
	if(!confirm("确认后您将不再处于委托状态？")){
		return;
	}
	var param = {
		"_PK_":event.data.id,
		"AGT_STATUS": 1,
		"action":"stopAllAgent"
	};
	var result = FireFly.doAct("SY_ORG_USER_TYPE_AGENT", "doAgentAction", param, true, false);
	if (result[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) >= 0) {
		_viewer.refresh();
	}
};

//查看委办情况
var findDetail = function(event){
	var trObj = event.data.trObj;
	var toUserCode = jQuery('td[icode="TO_USER_CODE"]',trObj).text();
	var toUserName = jQuery('td[icode="TO_USER_CODE__NAME"]',trObj).text();
	var beginDate = jQuery('td[icode="AGT_BEGIN_DATE"]',trObj).text();
	var realEndDate = jQuery('td[icode="REAL_END_DATE"]',trObj).text();
	var param = {	
		"agentFlag": true,
		"hisFlag": true,
		"ownerCode": System.getVar("@USER_CODE@"),
		"beginDate":beginDate,
		"realEndDate":realEndDate
	};
	var options = {
		"url":"SY_COMM_TODO_HIS_AGENT.list.do",
		"tTitle":"委托办理情况",
		"params":param,
		"menuFlag":3
	};
	Tab.open(options);
};

jQuery.each(_viewer.grid.getBodyTr(),function(i,n){
	//生成行按钮
	var grid = _viewer.grid;
	var sFlag = grid.getRowItemValue(n.id, "S_FLAG");
	//if(sFlag==1){
		var status = grid.getRowItemValue(n.id, "AGT_STATUS");
		var optTdObj = jQuery(n).find('td[icode="OPERATION_S"]');
		if(status == 0){
			_bldBtn(n.id,"delPlan","删除","delete",delPlan,n).appendTo(optTdObj);
		}
		if(status == 1){
			_bldBtn(n.id,"stopPlan","终止委托计划","clear",stopPlan,n).appendTo(optTdObj);
		}
		if(status != 0){
			_bldBtn(n.id,"findDetail","查看委办情况","search",findDetail,n).appendTo(optTdObj);
		}
	//}
	//有效并启动状态下标识未开始与超期
	var agtStatus = grid.getRowItemValue(n.id, "AGT_STATUS");
	if(sFlag==1 && agtStatus==1){
		var statusTd = jQuery(n).find('td[icode="AGT_STATUS__NAME"]');
		var currDate = System.getVar("@DATE@");
		var validBeginDate = grid.getRowItemValue(n.id, "AGT_BEGIN_DATE");
		var validEndDate = grid.getRowItemValue(n.id, "AGT_END_DATE");
		if(rhDate.doDateDiff("D", currDate, validBeginDate, 0) > 0) {
			statusTd.text("已启动(未开始)").css("background-color","yellow");
		} else if(rhDate.doDateDiff("D", validEndDate, currDate, 0) > 0) {
			statusTd.text("已启动(超期)").css("background-color","red");
		} else {
			//
		}
	}
});