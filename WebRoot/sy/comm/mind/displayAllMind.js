jQuery(document).ready(function(){
	//绑定意见显示方式按钮的click事件
	jQuery(".mindSortClick").bind("click",function(){
		var obj = jQuery(this);
		rh.vi.mindDis.loadMindContentByType(obj);
	});
	//绑定机构名称连接的click事件
	jQuery(".mindOdpt").bind("click",function(){
		var obj = jQuery(this);
		rh.vi.mindDis.toggleMindContent(obj);
	});
});

rh.vi.mindDis = {
	/**
	 * 显示指定机构的意见列表
	 */
	"displayMindContent" : function(odeptCode){
		var mindContentObj = jQuery("#mindContent" + odeptCode);
		mindContentObj.removeClass("none");
	}
	/**
	 * 显示或隐藏意见内容，如果意见内容没有装载则首先装载意见内容
	 */
	,"toggleMindContent" : function(obj){
		var odeptCode = obj.attr("deptCode");
		var mindContentObj = jQuery("#mindContent" + odeptCode);
		if(mindContentObj.contents().length == 0){ // 没有意见内容，则重新装载
			this.loadMindContentByType(obj);
		} else if (mindContentObj.hasClass("none")) {
			mindContentObj.removeClass("none");
		} else {
			mindContentObj.addClass("none");
		}
	}
	/**
	 * 
	 */
	,"loadMindContentByType" : function(obj){
		var sortType =  obj.attr("sortType")?obj.attr("sortType"):"TYPE";
		var odeptCode = obj.attr("deptCode");
		this._displayMindList(odeptCode,sortType);
		obj.parent().find(".mindSortClick").removeClass("mindTypeSelected");
		var sortType =  obj.attr("sortType")?obj.attr("sortType"):"TYPE";
		obj.parent().find("[sortType=" + sortType + "]").addClass("mindTypeSelected");
	}
	/**
	 * 从服务器端装载意见列表并显示
	 */
	,"_displayMindList" : function(odeptCode,sortType){
		var reqData = {};
		reqData["_NOPAGE_"] = "YES";
		reqData["DATA_ID"] =  _dataId;
		reqData["_extWhere"] = " AND S_FLAG=1";
		reqData["ODEPT_CODE"] = odeptCode;
	  	if (sortType) {
	  		reqData["SORT_TYPE"] = sortType;
	  	}
		
	  	jQuery("#mindContent" + odeptCode).contents().remove();
	  	var res = FireFly.doAct("SY_COMM_MIND", "displayMindList", reqData, false);
	  	jQuery("#mindContent" + odeptCode).append(res.MIND_LIST);
	  	this.displayMindContent(odeptCode);
	}
}