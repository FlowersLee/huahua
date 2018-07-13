//隐藏第一列的选择框
var _viewer = this;
//隐藏已经办结的记录对应的radio
jQuery("TBODY > TR").each(
	function(i,item){
		var itemObj = jQuery(item);
		var runningStat = _viewer.grid.getRowItemValue(item.id,"NODE_IF_RUNNING");
		if(runningStat  != "1"){ //节点实例还是活动节点（未结束）
			itemObj.find("input.rowIndex").remove();
		}
		itemObj.find("a.usernameLink").bind("mouseover", function(event) {
			var userCode = jQuery(this).attr("USER_CODE");
			if(userCode && userCode.length > 0){
				new rh.vi.userInfo(event, userCode);
			}
		});
	}
);

//如果不是管理员，则去掉管理员才能操作的按钮
if(!_viewer._listData || !_viewer._listData._IS_WF_MANAGER || _viewer._listData._IS_WF_MANAGER != "1"){
	_viewer.getBtn("wfToNext").hide();
	_viewer.getBtn("stopNodeInst").hide();
	//_viewer.getBtn("cuiban").hide();
}

//隐藏高级查询
_viewer.hideSearchItem();
if (_viewer.getAdvancedSearchBtn()) {
	_viewer.getAdvancedSearchBtn().hide();
}

/**
 *是否选中radioBox 
 */
function _ifCheckRadio(){
	//判断是否选中radio
	if(jQuery("input[type='checkbox'][class='rowIndex']:checked").length == 0){
		alert("请选择流程实例。");
		return;
	}
	return true;
}

//送下一个节点按钮相关操作
if (_viewer.getBtn("wfToNext")) {
_viewer.getBtn("wfToNext").unbind("click").bind("click", function(event){

	if(!_ifCheckRadio()){
		return;
	}
	//弹出对话框
	var temp = new rh.ui.popPrompt({
		title:"送交指定办理人",
		tip:"请选择需要送交的办理节点和办理人。",
		okFunc:function() {
			if(jQuery('#wfToNext_NODE_CODE').val().length==0 
				|| jQuery("#wfToNext_DONE_USER_ID").val().length == 0){
				alert("请选择用户或节点。");
				return;
			}
			
			var param = {};
			param["NI_ID"] = jQuery('#wfToNext_NI_ID').val();
			param["NODE_CODE"] = jQuery('#wfToNext_NODE_CODE').val();
			param["DONE_USER_ID"] = jQuery("#wfToNext_DONE_USER_ID").val();
			FireFly.doAct(_viewer.servId, "wfToNext", param, true);
			temp.closePrompt();
			_viewer.refresh();
		}
	});
	
	var niIDs = _viewer.grid.getSelectPKCodes();
	
	
	var param = {};
	param["NI_ID"] = niIDs[0];
	//param["SERV_ID"] = _viewer.getByIdData("SERV_ID");
	var nodeDefList = FireFly.doAct(_viewer.servId, "reteieveNodeDefList", param, false)._DATA_;
	
	temp._layout(event,undefined,[500,300]);
	var tbl = "<table border='0' class='wp100 mt20'>"
			+ "<tr><td class='wp20 h25 tr p5'>节点名称</td>"
			+ "<td><select id='wfToNext_NODE_CODE' name='NODE_CODE'></select></td>"
			+ "</tr><tr>"
			+ "<td class='wp20 h25 tr pr10'>用户</td>"
			+ "<td><input type='hidden'id='wfToNext_DONE_USER_ID' name='DONE_USER_ID'>"
			+ "<input id='wfToNext_DONE_USER_ID__NAME' name='DONE_USER_NAME' class='wp80'>"
			+ "<span style='text-decoration:underline' class='cp' id='wfToNext_USER_SELECT'>选择</span></td>"
			+ "<input type='hidden' id='wfToNext_NI_ID' name='NI_ID' value='" + param["NI_ID"] + "' >"
			+ "</tr>"
			+ "</table>";
	temp.display(tbl);
	var nodeIDSelect = jQuery("#wfToNext_NODE_CODE");
	nodeIDSelect.append("<option value=''></option>");
	for(var i=0;i<nodeDefList.length;i++){
		var nodeDef = nodeDefList[i];
		nodeIDSelect.append("<option value='" + nodeDef.NODE_CODE + "'>" + nodeDef.NODE_NAME + "(" + nodeDef.NODE_CODE + ")</option>");
	}
	
	//显示用户选择对话框
	jQuery('#wfToNext_USER_SELECT').bind("click",function(){
		var options = {
			"itemCode" : "wfToNext_DONE_USER_ID",
			"rebackCodes" : "wfToNext_DONE_USER_ID",
			"config" : "SY_ORG_DEPT_USER",
			"parHandler" : _viewer
		};
		var dictView = new rh.vi.rhDictTreeView(options);
		dictView.show(event);

	});
});
}

//图形化流程跟踪按钮
var figureBtn = _viewer.getBtn('wfFigure');
figureBtn.bind("click",function() {
	if (!(_viewer.params && _viewer.params.PI_ID)) {
		_viewer.params = _viewer.links;
	}
	var opts = {"tTitle":"图形化流程跟踪","url":"SY_WFE_TRACK_FIGURE.show.do?data=" + encodeURI(JsonToStr(_viewer.params)),"params":_viewer.params,"menuFlag":3};
	Tab.open(opts);
});

if (_viewer.getListData()._EXIST_PROC_DEF_ && _viewer.getListData()._EXIST_PROC_DEF_ == 2) {
	figureBtn.hide();
}

//点击中止按钮
if(_viewer.getBtn('stopNodeInst')){
	_viewer.getBtn('stopNodeInst').unbind("click").bind("click",function() {
		if(!_ifCheckRadio()){
			return;
		}
		var niIDs = _viewer.grid.getSelectPKCodes();
		var param = {};
		param["NI_ID"] = niIDs[0];	
		FireFly.doAct(_viewer.servId, "stopNodeInst", param, true);
		_viewer.refresh();
	});
}

//催办按钮
if (_viewer.getBtn("cuiban")) {
	_viewer.getBtn('cuiban').unbind("click").bind("click",function() {
		if(!_ifCheckRadio()){
			return;
		}
		
		//取得指定列的办理人ID
		var params = {'ACPT_USER':_viewer.grid.getSelectItemVal("TO_USER_ID")};
		var deadLine = _viewer.grid.getSelectItemVal("NODE_LIMIT_TIME");
		if(deadLine){
			params.DEADLINE = deadLine;
		}
		
		var listData = _viewer.getListData();
		params.DATA_ID = listData.DOC_ID;
		params.SERV_ID = listData.SERV_ID;
		
		jQuery.extend(params,_viewer.params);
		var url = "SY_WFE_REMIND.card.do";
		var options = {"url":url, "tTitle":"催办", "params":params};

		Tab.open(options);
	});
};
