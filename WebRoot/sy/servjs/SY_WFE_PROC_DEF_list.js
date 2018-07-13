/** 服务卡片使用的js方法定义：开始 */
var _viewer = this;

/**
 * 删除该版本流程
 */
_viewer.getBtn('deleteProcDefOfSpecVersion').unbind("click").bind("click",function() {
	deleteProcDef("deleteProcDefOfSpecVersion");
});


/**
 * 删除指定流程的所有版本
 */
_viewer.getBtn('deleteProcDef').unbind("click").bind("click",function() {
	deleteProcDef("deleteProcDef");
});

/**
 * 删除流程
 * @param url
 */
function deleteProcDef(url){
	var pkAarry = _viewer.grid.getSelectPKCodes();
	if (jQuery.isEmptyObject(pkAarry)) {
	    alert("请选择记录！");
	} else {
		var res = confirm("删除流程定义，不会删除已运行的流程记录。您确定要删除吗？");
		 if (res == true) {
			 var procIds = pkAarry.join(",");
			
			 var data = {};	
			 data["procIds"] = procIds;	
			
			 var result = rh_processData("SY_WFE_PROC_DEF." + url + ".do", data);
			
			 if(result.rtnstr == 'success'){
				 Tip.show("删除成功");
				 _viewer._refreshGridBody();
			 }
		 }
	}
}


/**
 * 将“流程”导出为json文件
 */
_viewer.getBtn('export').unbind("click").bind("click",function(event) {

	var pkAarry = _viewer.grid.getSelectPKCodes();
	if (jQuery.isEmptyObject(pkAarry)) {
	    alert("请选择记录！");
	} else {
		var procIds = pkAarry.join(",");
		
		var data = {};	
		data["procIds"] = procIds;
		
		window.open('SY_WFE_PROC_DEF.export.do?data=' + encodeURI(JsonToStr(data)));
	}
});


/**
 * 导入
 */
_viewer.getBtn('importProcDef').unbind("click").bind("click",function(event) {
	var importWin = new rh.ui.popPrompt({
		title:"请选择文件",
		tip:"请选择要导入的文件，导入单个流程可以选择json文件或zip文件，导入多个文件选择zip文件。",
		okFunc:function() {
			var fileData = file.getFileData();
			
			if (jQuery.isEmptyObject(fileData)) {
				alert("请选择文件上传");
				return;
			}
			
			var fileId = null;
			for (var key in fileData) {
				fileId = key;
			}
			
			if (fileId == null){
				alert("请选择文件上传");
				return;
			}
			//提交  导入 只将fileId传入即可
			rh_processData("SY_WFE_PROC_DEF.importProcDef.do",{"fileId" : fileId}, true);
			importWin.closePrompt();
			_viewer.refresh();
			file.destroy();
		},
		closeFunc:function() {
			file.destroy();
		}
	});
	importWin._layout(event,undefined,[450,230]);
    
    var config = {"SERV_ID":_viewer.servId, "FILE_CAT":"WFE_IMPORT", "FILENUMBER":1, "VALUE":15, "TYPES":"*.zip;*.json;", "DESC":"流程配置"};
	var file = new rh.ui.File({
		"config" : config
	});
	
	var container = jQuery("#" + importWin.dialogId);
	container.empty();
	importWin.tipBar = jQuery("<div></div>").text(importWin.tip).css({"height":"40px","font-weight":"normal","margin":"15px 15px 0px 15px","color":"red"});
    container.append(importWin.tipBar);
	container.append(file.obj);
	file.obj.css('margin-left', '5px');
	file.initUpload();
});
