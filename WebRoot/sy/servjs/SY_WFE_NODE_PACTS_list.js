var _viewer = this;
_viewer.getBtn("addWfButtons").unbind("click").bind("click",function openWfeButtonDialog() {
	var inputName = "WF_BUTTONS";
	var servCode = _viewer.getParHandler().getItem("PROC_CODE").getValue();
	var configStr = "SY_WFE_PROC_DEF_ACT,{'TARGET':'"+inputName+"~','SOURCE':'ACT_CODE~ACT_NAME'," +
			"'EXTWHERE':' and ACT_CODE NOT IN (SELECT ACT_CODE FROM SY_WFE_NODE_PACTS WHERE PROC_CODE = \\'"+servCode+"\\' AND ACT_TYPE=1)' " +
			",'TYPE':'multi'}";
	
		var options = {
				"itemCode":inputName,
				"config" :configStr,
				"rebackCodes":inputName,
				"parHandler":this,
				"formHandler":this,
				"replaceCallBack":function(result){ 
					callBackWfButtons(result);
												   },
				"hideAdvancedSearch":true
				};
	var queryView = new rh.vi.rhSelectListView(options);
	queryView.show(null,[50,0]);
});

_viewer.getBtn("addFormButtons").unbind("click").bind("click",function  openButtonDialog() { 
	var inputName="FORM_BUTTONS";
	var formTableName = _viewer.getParHandler().getItem("SERV_ID").getValue();
	//var pTableName = _viewer.getParHandler().getItem("PROC_CODE").getValue();
	var configStr = "SY_SERV_ACT_QUERY,{'TARGET':'"+inputName+"~','SOURCE':'ACT_CODE~ACT_NAME','TYPE':'multi'}";
	
		var options = 
		{
				"itemCode":inputName,
				"config" :configStr,
				"rebackCodes":inputName,
				"parHandler":this,
				"formHandler":this,
				"replaceCallBack":function(result){
					callBackFormButtons(result);						
												   },
				"hideAdvancedSearch":true,"params":{"SRC_SERV_ID":formTableName}};

	var queryView = new rh.vi.rhSelectListView(options);
	queryView.show(null,[50,0]);
});

/**
 * 流程按钮回调函数
 * @param result
 */
function callBackWfButtons(result){
	var params = {};
	params.ACT_TYPE = 1; 
	params.PROC_CODE = _viewer.getParHandler().getItem("PROC_CODE").getValue();
	params.ACT_CODE = result["ACT_CODE"];
	params.ACT_NAME = result["ACT_NAME"];
	FireFly.doAct("SY_WFE_NODE_PACTS","addPublicButtons",params);
	_viewer.refresh();
}

/**
 * 审批单按钮回调函数
 * @param result
 */
function callBackFormButtons(result){
	var params = {} ; 
	params.ACT_TYPE = 2; 
	params.PROC_CODE = _viewer.getParHandler().getItem("PROC_CODE").getValue();
	params["ACT_CODE"] = result["ACT_CODE"];
	params["ACT_NAME"] = result["ACT_NAME"];
	FireFly.doAct("SY_WFE_NODE_PACTS","addPublicButtons",params);
	_viewer.refresh();
}