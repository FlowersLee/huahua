var _viewer = this;
_viewer.grid.unbindTrClick();
_viewer.grid.click(function(value, node) {
	var sid = node["TODO_CODE"];
	var url = node["TODO_URL"];
	var objectID1 = node["TODO_OBJECT_ID1"];
	var title = node["TODO_TITLE"];
	//alert(sid + url + title);
	openTODOCardX(sid, title, url, "", objectID1, "");
}, _viewer);


/**
 * '${content.TODO_CODE}','${content.TODO_CODE_NAME}','${content.TODO_OBJECT_ID1}','待办-${content.TODO_TITLE}','${content.TODO_URL!}','${content.TODO_CONTENT!}','${content.TODO_ID!}','SY_COMM_TODO,SY_COMM_TODO_YUE'
 */ 
function openTODOCardX(sId, title, url, con, pkCode, areaId) {
	if (url.indexOf(".showDialog.do") > 0) {
		showRHDialog(title,con,function exeToDo() {
			var data = {};
			data[UIConst.PK_KEY] = pkCode;
			data["TODO_ID"] = pkCode;
			var res = FireFly.doAct("SY_COMM_TODO","endReadCon",data,false);
			if (res[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
				var con = jQuery("#SY_COMM_TODO .portal-box-con");
				var params = {};
				var dataUrl = con.attr("dataUrl");
			    params["config"] = dataUrl.substring(2,dataUrl.length-2);
				getBlockCon(con,params);
			}
        }, this,[200,260]);
	} else if (url.indexOf(".byid.do") > 0) {
		var params = {"replaceUrl":url, "areaId":areaId};
		var options = {"url":sId + ".card.do?pkCode=" + pkCode, "tTitle":title, "menuFlag":2, "params":params};
		Tab.open(options);
	} else {
		var params = {"replaceUrl":url, "areaId":areaId};
		var options = {"url":url, "tTitle":title, "params":params};
		Tab.open(options);
	}
}