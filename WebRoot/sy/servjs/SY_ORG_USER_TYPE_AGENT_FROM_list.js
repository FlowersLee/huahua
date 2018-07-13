var _viewer = this;

var _bldBtn = function(pkCode, actCode, actName, imgClass, func, obj){
	return jQuery('<a class="rh-icon rhGrid-btnBar-a" id="SY_ORG_USER_TYPE_AGENT_FROM-' + actCode 
			+ '" actcode="' + actCode + '"><span class="rh-icon-inner">' 
			+ actName + '</span><span class="rh-icon-img btn-' + imgClass + '"></span></a>').unbind("click").bind("click",{"id":pkCode,"trObj":obj},func);
};

//返回后刷新
var mainCardRefresh = function(result){
	_viewer.getParHandler().refresh();
	_viewer.getParHandler().cardBarTip(result[UIConst.RTN_MSG]);
};

//查看被委托人委办情况
var findDetail = function(event){
	var trObj = event.data.trObj;
	var toUserCode = jQuery('td[icode="TO_USER_CODE"]',trObj).text();
	var toUserName = jQuery('td[icode="TO_USER_CODE__NAME"]',trObj).text();
	var agtTypeCode = jQuery('td[icode="AGT_TYPE_CODE"]',trObj).text();
	var agtTypeName = jQuery('td[icode="AGT_TYPE_CODE__NAME"]',trObj).text();
	var beginDate = jQuery('td[icode="VALID_BEGIN_DATE"]',trObj).text();
	var realEndDate = jQuery('td[icode="REAL_END_DATE"]',trObj).text();
	var param = {	
		"agentFlag": true,
		"hisFlag": true,
		"ownerCode": System.getVar("@USER_CODE@"),
		"toUserCode": toUserCode,
		"agtTypeCode": agtTypeCode,
		"beginDate": beginDate,
		"realEndDate":realEndDate
	};
	var options = {
		"url":"SY_COMM_TODO_HIS_AGENT.list.do",
		"tTitle": agtTypeName + "委托办理情况",
		"params":param,
		"menuFlag":3
	};
	Tab.open(options);
	/*
	getDialog(event,"todo_agent-dial",toUserName + "代我办理" + agtTypeName + "业务情况",_viewer._width-100,_viewer._height-100);
	var params = {
		"sId":"SY_COMM_TODO_HIS_AGENT",
		"pCon":jQuery("#todo_agent-dial"),
		"batchFlag":false,
		"showTitleBarFlag":"false",
		"showSearchFlag": "false",
	    "_SELECT_":"",
	    "type":_viewer.type,
	    "selectView":false,
        "resetHeiWid":_viewer._resetHeiWid,
        "parHandler":_viewer,
        "extWhere":"",
        "dataFlag":_viewer._dataFlag,
        "replaceQueryModel":1,
        "params":{
			"agentFlag": true,
			"hisFlag": true,
			"ownerCode": System.getVar("@USER_CODE@"),
			"agtTypeCode": agtTypeCode,
			"toUserCode": toUserCode,
			"beginDate":beginDate,
			"realEndDate":realEndDate
			
		}
    };
	this.listView = new rh.vi.listView(params);
	this.listView.show();
	*/
};

//是否是从关联服务进入还是直接菜单进入
if(!_viewer.links.LINK_TYPE_FLAG){
	_viewer.getBtn("doAgtByType").hide();
	_viewer.getBtn("showAgentToMe").hide();
	//jQuery("[icode='OPERATION_S']",this._table).css("display","none");
	
	var currUserCode = System.getVar("@USER_CODE@");
	jQuery.each(_viewer.grid.getBodyTr(),function(i,n){
		//标识转办
		var userId = jQuery(this).find("td[icode='USER_CODE']").text();
		if(userId != currUserCode){
			jQuery(this).find("td[icode='USER_CODE__NAME']").css("background-color","orange");
		}
		//生成行按钮
		var grid = _viewer.grid;
		var sFlag = grid.getRowItemValue(n.id, "S_FLAG");
		var userCode = grid.getRowItemValue(n.id, "USER_CODE");
		var status = grid.getRowItemValue(n.id, "AGT_STATUS");
		var optTdObj = jQuery(n).find('td[icode="OPERATION_S"]');
		if(userCode == currUserCode){
			_bldBtn(n.id,"findDetail","查看委办情况","search",findDetail,n).appendTo(optTdObj);
		}			
		//有效并启动状态下标识未开始与超期
		var agtStatus = grid.getRowItemValue(n.id, "AGT_STATUS");
		if(sFlag==1 && agtStatus==1){
			var statusTd = jQuery(n).find('td[icode="AGT_STATUS__NAME"]');
			var currDate = System.getVar("@DATE@");
			var validBeginDate = grid.getRowItemValue(n.id, "VALID_BEGIN_DATE");
			var validEndDate = grid.getRowItemValue(n.id, "VALID_END_DATE");
			if(rhDate.doDateDiff("D", currDate, validBeginDate, 0) > 0) {
				statusTd.text("已启动(未开始)").css("background-color","yellow");
			} else if(rhDate.doDateDiff("D", validEndDate, currDate, 0) > 0) {
				statusTd.text("已启动(超期)").css("background-color","red");
			} else {
				//
			}
		}
	});
}else{
	var mainStatus = _viewer.getParHandler().itemValue("AGT_STATUS");
	jQuery("[icode='S_FLAG__NAME']",this._table).css("display","none");
	//“按业务委托”按钮
	if (mainStatus == 2) {
		_viewer.getBtn("doAgtByType").hide();
	} else {
		_viewer.getBtn("doAgtByType").unbind("click").bind("click",function(event){	
			var temp = {
				"act":UIConst.ACT_CARD_ADD,
				"sId":_viewer.servId,
				"parHandler":_viewer,
				"widHeiArray":[600,350],
				"xyArray":[200,100],
				"links":_viewer.opts.links,
				"extWhere":" and S_FLAG = 1",
				"params":{
					"handlerRefresh":_viewer,
					"AGT_ID":_viewer.getParHandler().itemValue("AGT_ID"),
					"MAIN_AGT_STATUS":mainStatus,
					"startDate":_viewer.getParHandler().itemValue("AGT_BEGIN_DATE"),
					"endDate":_viewer.getParHandler().itemValue("AGT_END_DATE"),
				}
			};
			var cardView = new rh.vi.cardView(temp);
			cardView.show();
		});
	}
	
	//“转办委托”按钮
	if (mainStatus == mainStatus) {
		_viewer.getBtn("showAgentToMe").hide(); // 暂时屏蔽
	} else {
		_viewer.getBtn("showAgentToMe").unbind("click").bind("click",function(event){
			getDialog(event,"type_agent-dial","转办委托列表",_viewer._width-100,_viewer._height-100);
			var params = {
				"sId":"SY_ORG_USER_TYPE_AGENT_TO",
				"pCon":jQuery("#type_agent-dial"),
				"batchFlag":false,
				"showTitleBarFlag":"false",
			    "_SELECT_":"",
			    "type":_viewer.type,
			    "selectView":false,
		        "resetHeiWid":_viewer._resetHeiWid,
		        "parHandler":_viewer,
		        "extWhere":" and S_FLAG = 1 and AGT_STATUS = 1",
		        "dataFlag":_viewer._dataFlag,
		        "replaceQueryModel":1,
		        "params":{
					"AGT_ID":_viewer.getParHandler().getPKCode(),
					"MAIN_AGT_STATUS":mainStatus,
					"MAIN_AGT_BEGIN_DATE":_viewer.getParHandler().itemValue("AGT_BEGIN_DATE"),
					"MAIN_AGT_END_DATE":_viewer.getParHandler().itemValue("AGT_END_DATE"),
					"transFlag":true
				}
		    };
			this.listView = new rh.vi.listView(params);
			this.listView.show();
		});
	}
	
	//假删除
	var delAgent = function(event){
		if(!confirm("是否删除委托？")){
			return;
		}
		var param = {"_PK_":event.data.id,"action":"delAgent"};
		FireFly.doAct("SY_ORG_USER_TYPE_AGENT", "doAgentAction", param, true, false, mainCardRefresh);
	};
	
	//取消from
	var stopAgent = function(event){
		if(!confirm("是否终止委托？")){
			return;
		}
		var param = {"_PK_":event.data.id,"action":"stopAgent"};
		FireFly.doAct("SY_ORG_USER_TYPE_AGENT", "doAgentAction", param, true, false, mainCardRefresh);
	};
	
	//重启
	var restartAgent = function(event){
		if(!confirm("是否恢复委托？")){
			return;
		}
		var param = {"_PK_":event.data.id,"action":"modifyAgent","nextStatus":"1"};
		FireFly.doAct("SY_ORG_USER_TYPE_AGENT", "doAgentAction", param, true, false, mainCardRefresh);
	};
	
	//重启转办
	var restartZhuban = function(event){
		if(!confirm("是否恢复转办？")){
			return;
		}
		var param = {"_PK_":event.data.id,"action":"modifyAgent","nextStatus":"1"};
		FireFly.doAct("SY_ORG_USER_TYPE_AGENT", "doAgentAction", param, true, false, mainCardRefresh);
	};
	
	//修改（未启动或已停止状态）
	var changeAgent = function(event){
		var param = {"_PK_":event.data.id,"action":"modifyAgent","nextStatus":event.data.trObj.status};
		alert("暂时不支持");
		//FireFly.doAct("SY_ORG_USER_TYPE_AGENT", "doAgentAction", param, true, false, mainCardRefresh);
	};
	
	//取消转办
	var cancelSingleTrans = function(event){
		if(!confirm("确认后转办将被删除？")){
			return;
		}
		var param = {"_PK_":event.data.id,"action":"stopAgent"};
		FireFly.doAct("SY_ORG_USER_TYPE_AGENT", "doAgentAction", param, true, false, mainCardRefresh);
	};
	
	//
	var currUserCode = System.getVar("@USER_CODE@");
	jQuery.each(_viewer.grid.getBodyTr(),function(i,n){
		//标识转办
		var userId = jQuery(this).find("td[icode='USER_CODE']").text();
		if(userId != currUserCode){
			jQuery(this).find("td[icode='USER_CODE__NAME']").css("background-color","orange");
		}
		//生成行按钮
		var grid = _viewer.grid;
		var sFlag = grid.getRowItemValue(n.id, "S_FLAG");
		if(sFlag==1){
			var userCode = grid.getRowItemValue(n.id, "USER_CODE");
			var status = grid.getRowItemValue(n.id, "AGT_STATUS");
			var optTdObj = jQuery(n).find('td[icode="OPERATION_S"]');
			if(status != 2){
				_bldBtn(n.id,"delAgent","删除业务委托","delete",delAgent,n).appendTo(optTdObj);
			}
//			if(status == 1 && userCode == currUserCode){
//				_bldBtn(n.id,"stopAgent","终止委托","stop",stopAgent,n).appendTo(optTdObj);
//			}
//			if(status != 1){
				n["status"] = status;
//				_bldBtn(n.id,"changeAgent","修改","change",changeAgent,n).appendTo(optTdObj);
//			}
//			if((status == 0) && mainStatus ==1 && userCode == currUserCode){
//				_bldBtn(n.id,"restartAgent","启动委托","begin",restartAgent,n).appendTo(optTdObj);
//			}
//			if((status == 2) && mainStatus ==1 && userCode == currUserCode){
//				_bldBtn(n.id,"restartAgent","恢复委托","begin",restartAgent,n).appendTo(optTdObj);
//			}
//			if((status == 2) && mainStatus ==1 && userCode != currUserCode){
//				_bldBtn(n.id,"restartZhuban","恢复转办","begin",restartZhuban,n).appendTo(optTdObj);
//			}
//			if(status == 1 && userCode != currUserCode){
//				_bldBtn(n.id,"cancelSingleTrans","取消转办","zhuanfa",cancelSingleTrans,n).appendTo(optTdObj);
//			}
			if(status != 0 && userCode == currUserCode){
				_bldBtn(n.id,"findDetail","查看委办情况","search",findDetail,n).appendTo(optTdObj);
			}
			
		}
		//有效并启动状态下标识未开始与超期
		var agtStatus = grid.getRowItemValue(n.id, "AGT_STATUS");
		if(sFlag==1 && agtStatus==1){
			var statusTd = jQuery(n).find('td[icode="AGT_STATUS__NAME"]');
			var currDate = System.getVar("@DATE@");
			var validBeginDate = grid.getRowItemValue(n.id, "VALID_BEGIN_DATE");
			var validEndDate = grid.getRowItemValue(n.id, "VALID_END_DATE");
			if(rhDate.doDateDiff("D", currDate, validBeginDate, 0) > 0) {
				statusTd.text("已启动(未开始)").css("background-color","yellow");
			} else if(rhDate.doDateDiff("D", validEndDate, currDate, 0) > 0) {
				statusTd.text("已启动(超期)").css("background-color","red");
			} else {
				//
			}
		}
	});
}

/**内部函数--构建弹出框页面布局*/
function getDialog(event,dialogId,title,wid,hei) {
	//设置jqueryUi的dialog参数
	if(title == null){
		title = ""
	}
	var winDialog = jQuery("<div></div>").addClass("selectDialog").attr("id",dialogId).attr("title",title);
	winDialog.appendTo(jQuery("body"));
	if(hei == null || wid == null || hei == "" || wid == ""){
		wid = jQuery("body").width() - 500;
		hei = GLOBAL.getDefaultFrameHei()-550;	
	}
	var posArray = [30,30];
	if (event) {
		var cy = event.clientY;
	    posArray[0] = "";
	    posArray[1] = cy-300;
	}
  
  //生成jqueryUi的dialog
	jQuery("#" + dialogId).dialog({
		autoOpen: false,
		height: hei,
		width: wid,
		modal: true,
		resizable:false,
		position:posArray,
		open: function() { 

		},
		close: function() {
			jQuery("#" + dialogId).remove();
			_viewer.refresh();
		}
	});
	
	//手动打开dialog
	var dialogObj = jQuery("#" + dialogId);
	dialogObj.dialog("open");
	dialogObj.focus();
  jQuery(".ui-dialog-titlebar").last().css("display","block");//设置标题显示
  dialogObj.parent().addClass("rh-bottom-right-radius rhSelectWidget-content");
  Tip.show("努力加载中...",null,jQuery(".ui-dialog-title",winDialog).last());
}

