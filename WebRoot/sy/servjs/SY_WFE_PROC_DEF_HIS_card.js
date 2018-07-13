/** 服务卡片使用的js方法定义：开始 */
var _viewer = this;

/**
 * 点击保存按钮
 */
_viewer.getBtn('saveWf').bind("click",function() {
	saveProcDef("saveWf");
});


/**
 * 点击“另存为新版本”按钮
 */
_viewer.getBtn('saveWfAsNewVersion').bind("click",function() {
	saveProcDef("saveWfAsNewVersion");
});


/**
 * 提交流程
 * @returns
 */
function saveProcDef(act){
	//取得定义页面上的
	var wfResStr = frames[_viewer.opts.sId + "-_WF_IFRAME"].showWorkflowDefXml();
	var data = _viewer.form.getItemsValues();	
	data["xmlStr"] = encodeURI(wfResStr).replace(/\+/g, '%2B');
	data["PROC_TYPE"] = "1";
	
	var result = rh_processData(_viewer.opts.sId + "." + act + ".do",data);
	if (result[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
		Tip.show("保存成功");
		
		_viewer._parentRefreshFlag = true;
		_viewer._pkCode = result["_DATA_"]["PROC_CODE"];
		_viewer._actVar = UIConst.ACT_CARD_MODIFY;
		
		_viewer.getItem("PROC_CODE").setValue(result["_DATA_"]["PROC_CODE"]);
		
		if(result["_DATA_"]["PROC_VERSION"]){
			_viewer.getItem("PROC_VERSION").setValue(result["_DATA_"]["PROC_VERSION"]);
			_viewer.refresh();
		}
	}
	
	return result;
}


var _oldProcDefFrameHeight = 0;

/**
 * 点击放大按钮
 */
_viewer.getBtn("fullScreen").bind("click",function() {
	var iframeElem = jQuery("#SY_WFE_PROC_DEF-_WF_IFRAME");
	if(iframeElem.hasClass("pa")){
		expandLeftMenu();
		//缩小
		iframeElem.removeClass();
		_viewer.getBtn("fullScreen").find("span.rh-icon-inner").text("放大");
		//iframeElem.resizable();
		iframeElem.height(_oldProcDefFrameHeight);
	}else{
		_oldProcDefFrameHeight = iframeElem.height();
		//放大
		Menu.closeLeftMenu();
		var pageHeight = jQuery(document).height();
		var siblings = iframeElem.siblings();
		var pos = { top: 10, left: 30 };
		if(siblings.length > 0){
			pos = siblings.offset();
		}
		iframeElem.addClass("pa ");
		iframeElem.offset(pos);
		iframeElem.height(pageHeight - 120);
		_viewer.getBtn("fullScreen").find("span.rh-icon-inner").text("缩小");
	}
});