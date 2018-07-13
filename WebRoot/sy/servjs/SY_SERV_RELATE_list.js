var _viewer = this;

/**
 * 打开行数据对应的审批单
 */
_viewer.grid.unbindTrdblClick();
_viewer.grid.dblClick(function(value,node) {
	var servId = _viewer.grid.getSelectItemVal("RELATE_SERV_ID");
	var dataId = _viewer.grid.getSelectItemVal("RELATE_DATA_ID");
	var title = _viewer.grid.getSelectItemVal("TITLE");
	var params = {"handlerRefresh":_viewer};
//相关文件中存在父服务，要获取相关文件服务
//	if ("" != (_viewer.grid.getSelectItemVal("RELATE_SERV_ID") || "")) {
//		servId = _viewer.grid.getSelectItemVal("RELATE_SERV_ID");
//	}
//	if ("" != (_viewer.grid.getSelectItemVal("RELATE_DATA_ID") || "")) {
//		dataId = _viewer.grid.getSelectItemVal("RELATE_DATA_ID");
//	}
	var options = {"url":servId + ".card.do?pkCode=" + dataId, "tTitle":title 
				,"menuFlag":3,"params":params};
	Tab.open(options);
},_viewer);

var addrelate = _viewer.getBtn("addrelate");
addrelate.unbind("click").bind("click",function(){
	var cardObj = _viewer.getParHandler().getParams().handler.getParHandler();
	var parHandler = _viewer.getParHandler().getParams().handler.opts.parHandler.form;
	var dataID = cardObj._pkCode;
	var servID = cardObj.servId;
	var servSrcId = parHandler._servSrcId;
	//alert("dataID="+dataID+",servID="+servID+",servSrcId="+servSrcId);
	var options = {
			"cardObj":cardObj,
			"config":"[{'servId':'OA_SY_COMM_ENTITY_QUERY','SOURCE':'ENTITY_ID,ENTITY_CODE,TITLE,SERV_ID,S_ATIME','EXTWHERE':\" and DATA_ID!='" + dataID + "'\",'servName':'综合查询','SHOWITEM':'TITLE','TARGET_SERV_ID_ITEM':'SERV_ID'}]",
			"id":servID+"-GW_RELATE",
			"itemCode":"GW_RELATE",
			"srcServId":"OA_SY_COMM_ENTITY_QUERY",
			"name":servID+"-GW_RELATE",
			"servID":servID,
			"servSrcId":servSrcId,
			"parHandler":parHandler
	};
	var relate = new rh.ui.linkSelect(options);
	relate.open();	
	relate.afterSave = function(){
		_viewer.refresh();
	};
});
