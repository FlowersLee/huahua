var _viewer = this;


_viewer.grid.unbindTrdblClick();
/**
 * 绑定打开行记录对应审批单的界面。
 */
_viewer.grid.dblClick(function(value,node) {
	var servId = _viewer.grid.getSelectItemVal("SERV_ID");
	var dataId = _viewer.grid.getSelectItemVal("DATA_ID");
	var title = _viewer.grid.getSelectItemVal("TITLE");
	var sendId = _viewer.grid.getSelectItemVal("SEND_ID");
	var params = {"SEND_ID":sendId,"handlerRefresh":_viewer};
	var options = {"url":servId + ".card.do?pkCode=" + dataId, "tTitle":title 
				,"menuFlag":3,"params":params};

	Tab.open(options);
},_viewer);


_viewer.grid.getCheckBox().each(function(){
	var chkboxObj = jQuery(this);
	var status = _viewer.grid.getRowItemValueByElement(chkboxObj,"SEND_STATUS");
	if(status != "2"){
		chkboxObj.hide();
	}
});

/**
 * 签收按钮
 */
_viewer.getBtn('receivedBy').unbind("click").bind("click",function(event) {
	var param = {"entityIds":_viewer.grid.getSelectItemValues("DATA_ID").join(",")};
	var result = FireFly.doAct(_viewer.servId, "qianShou", param, true);
    if (result[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {//成功后刷新列表
    	_viewer.refreshGridBodyNoResize();
    }
});

//添加说明信息
var momeObj = jQuery.parseJSON(System.getVar("@C_SY_LIST_MEMO_CONFIG_OBJ@") || "{}");
var titleStyle = "font-size:12px;margin:0px 10px;color:red;text-align:left;padding:6px;";
if ("" != (momeObj[_viewer.servId] || "")) {
	_viewer.addRedHeader(momeObj[_viewer.servId],titleStyle);
}