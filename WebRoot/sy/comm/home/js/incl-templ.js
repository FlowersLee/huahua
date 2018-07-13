/** ------------办公portal页面自定义处理 --开始--------------*/
/*
 * 进入待办卡片
 * @param sId 服务ID
 * @param sName 服务名称
 * @param dataId 数据主键
 * @param title 提醒标题
 * @param url tab打开的url
 * @param con 提醒标题
 * @param pkCode 待办主键
 * @param ownerCode 待办人
 * @param todoCatalog 1,待办，2,待阅
 * @param areaId 当前区块id,用于刷新区块
 */
function openTODOCard(sId,sName,dataId,title,url,con,pkCode,ownerCode,todoCatalog,areaId) {
//    if (todoCatalog == '2') { //待阅，将其状态改成已办
//		var data = {};
//		data[UIConst.PK_KEY] = pkCode;
//		data["TODO_ID"] = pkCode;
//		var res = FireFly.doAct("SY_COMM_TODO","endReadCon",data,false);
//		if (res[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
//			var con = jQuery("#SY_COMM_TODO_YUE .portal-box-con");
//			var params = {};
//			var dataUrl = con.attr("dataUrl");
//			params["config"] = dataUrl.substring(2,dataUrl.length-2);
//			
//			//getBlockCon(con,params);	
//		}
//	}

//	if (url.indexOf(".showDialog.do") > 0) {
//		showRHDialog(title,con,function exeToDo() {
//			var data = {};
//			data[UIConst.PK_KEY] = pkCode;
//			data["TODO_ID"] = pkCode;
//			var res = FireFly.doAct("SY_COMM_TODO","endReadCon",data,false);
//
//			if (res[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
//				var con = jQuery("#SY_COMM_TODO_REMIND .portal-box-con");
//				var params = {};
//				var dataUrl = con.attr("dataUrl");
//			    params["config"] = dataUrl.substring(2,dataUrl.length-2);
//				
//				//getBlockCon(con,params);
//			}
//        },this);
//	} else 
	if (url.indexOf(".byid.do") > 0) {
	    if(System.getUser("USER_CODE") != ownerCode) { //当前人不是待办人，就是委托的，
		    url = url.substring(0,url.length-1); 
			url += ",_AGENT_USER_:" + ownerCode + "}";
		}
		var isProxyUser = false;
		if (System.getUser("USER_CODE") != ownerCode) { // 委托代理
			isProxyUser = true;
		}
		var params = {"from":"todo","todo_id":pkCode,"isProxyUser":isProxyUser,"portalHandler":portalView};
		var options = {"url":sId + ".card.do?pkCode=" + dataId,"tTitle":title,"replaceUrl":url,"areaId":areaId,"menuFlag":4,"params":params};
		Tab.open(options);
	} else {
		var options = {"url":url,"tTitle":title,"replaceUrl":url,"areaId":areaId};
		Tab.open(options);
	}
}


/**
 * 
 */
/**
 * 待办1/待阅2，更多
 * 增加自定义过滤条件: var strWhere = ...  var params = {"_extWhere":strWhere}; opts.params = params;
 */
function openMoreTodoListPage(todoCatlog) {	
	if (todoCatlog == "1") {
		var opts = {"url": "SY_COMM_TODO.list.do", "tTitle": "个人待办", "menuFlag": 4};
		Tab.open(opts);	
	} else {
		var opts = {"url":"SY_COMM_TODO_READ.list.do", "tTitle":"个人待阅", "menuFlag":4};
		Tab.open(opts);
	}
}


/**
 * 主办，更多
 */
function openMoreZhubanListPage() {
	var strWhere = " and (OWNER_CODE='@USER_CODE@' and OWNER_TYPE=1)  or (OWNER_CODE in (@ROLE_CODES@) and OWNER_TYPE=2)";
	
	var params = {"extWhere":strWhere};
	
	var opts = {"url":"SY_COMM_ENTITY.list.do", "tTitle":"个人主办", "menuFlag":4, "params":params}
	Tab.open(opts);
}

/** ------------办公portal页面自定义处理 --结束--------------*/
	