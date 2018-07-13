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

if(!_viewer.params || !_viewer.params.transFlag){
	_viewer.grid.getBtn("tranAgent").hide();
	
	//查看我代他人办理情况
	var findDetail = function(event){
		var trObj = event.data.trObj;
		var userCode = jQuery('td[icode="USER_CODE"]',trObj).text();
		var userName = jQuery('td[icode="USER_CODE__NAME"]',trObj).text();
		var agtTypeCode = jQuery('td[icode="AGT_TYPE_CODE"]',trObj).text();
		var agtTypeName = jQuery('td[icode="AGT_TYPE_CODE__NAME"]',trObj).text();
		var beginDate = jQuery('td[icode="VALID_BEGIN_DATE"]',trObj).text();
		var realEndDate = jQuery('td[icode="REAL_END_DATE"]',trObj).text();
		var param = {	
			"agentFlag": true,
			"hisFlag": true,
			"ownerCode": userCode,
			"toUserCode": System.getVar("@USER_CODE@"),
			"agtTypeCode": agtTypeCode,
			"beginDate": beginDate,
			"realEndDate":realEndDate
		};
		var options = {
			"url":"SY_COMM_TODO_HIS_AGENT.list.do",
			"tTitle": "代" + userName + "办理" + agtTypeName + "业务情况",
			"params":param,
			"menuFlag":3
		};
		Tab.open(options);
//		getDialog(event,"todo_agent-dial", "我代" + userName + "办理" + agtTypeName + "业务情况",_viewer._width-100,_viewer._height-100);
//		var params = {
//			"sId":"SY_COMM_TODO_HIS_AGENT",
//			"pCon":jQuery("#todo_agent-dial"),
//			"batchFlag":false,
//			"showTitleBarFlag":"false",
//			"showSearchFlag": "false",
//		    "_SELECT_":"",
//		    "type":_viewer.type,
//		    "selectView":false,
//	        "resetHeiWid":_viewer._resetHeiWid,
//	        "parHandler":_viewer,
//	        "extWhere":"",
//	        "dataFlag":_viewer._dataFlag,
//	        "replaceQueryModel":1,
//	        "params":{
//				"agentFlag": true,
//				"hisFlag": true,
//				"ownerCode": userCode,
//				"agtTypeCode": agtTypeCode,
//				"toUserCode": System.getVar("@USER_CODE@"),
//				"beginDate":beginDate,
//				"realEndDate":realEndDate
//				
//			}
//	    };
//		this.listView = new rh.vi.listView(params);
//		this.listView.show();
	};
	
	jQuery.each(_viewer.grid.getBodyTr(),function(i,n){
		var optTdObj = jQuery(n).find('td[icode="OPERATION_S"]');
		_bldBtn(n.id,"findDetail","查看代办情况","search",findDetail,n).appendTo(optTdObj);
		//有效并启动状态下标识未开始与超期
		var grid = _viewer.grid;
		var sFlag = grid.getRowItemValue(n.id, "S_FLAG");
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
	
} else {
	jQuery.each(_viewer.grid.getBodyTr(),function(i,n){
		//有效并启动状态下标识未开始与超期
		var grid = _viewer.grid;
		var sFlag = grid.getRowItemValue(n.id, "S_FLAG");
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
	
	//列表行按钮-转 交委托按钮
	_viewer.grid.getBtn("tranAgent").unbind("click").bind("click",function(event){
		var pkCode = jQuery(this).attr("rowPk");
		var temp = {
			"sId":_viewer.servId,
			"act":UIConst.ACT_CARD_MODIFY,
			"_PK_":pkCode,
			"parHandler":_viewer,
			"widHeiArray":[500,250],
			"xyArray":[200,100],
			"params":{
				"handlerRefresh":_viewer,
				"MAIN_AGT_STATUS":_viewer.params.MAIN_AGT_STATUS,
				"MAIN_AGT_BEGIN_DATE":_viewer.params.MAIN_AGT_BEGIN_DATE,
				"MAIN_AGT_END_DATE":_viewer.params.MAIN_AGT_END_DATE
			}
		};
		var cardView = new rh.vi.cardView(temp);
		cardView.show();
		cardView.getItem("TO_USER_CODE").clear();
		cardView.getItem("AGT_ID").setValue(_viewer.params.AGT_ID);
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


