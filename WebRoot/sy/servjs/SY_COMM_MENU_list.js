var _viewer = this;
_viewer.onRefreshGridAndTree();
/**
 * 将"菜单定义"导出为json文件
 */
_viewer.getBtn('expMenu').unbind("click").bind("click",function(event) {
	var pkAarry = _viewer.grid.getSelectPKCodes();
	if (jQuery.isEmptyObject(pkAarry)) {
	    alert("请选择记录！");
	} else {
		var menuIds = pkAarry.join(",");
		var data = {};	
		data["menuIds"] = menuIds;
		
		window.open('SY_COMM_MENU.expMenuDef.do?data=' + encodeURI(JsonToStr(data)));
	}
});
/**
 * 上传导入JSON定义文件
 */
_viewer.getBtn('impMenu').unbind("click").bind("click",function(event) {
	var config = {"SERV_ID":_viewer.servId, "FILE_CAT":"JSON_UPLOAD", "FILENUMBER":1, "VALUE":15, "TYPES":"*.zip;", "DESC":"菜单数据"};
	var file = new rh.ui.File({
		"config" : config
	});
	
	var importWin = new rh.ui.popPrompt({
		title:"请选择文件",
		tip:"请选择要导入的zip文件：",
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
			var param = {};
			param["fileId"] = fileId;
			if (_viewer._transferData["MENU_PID"] != null) { //左侧选择父菜单
				param["MENU_PID"] = _viewer._transferData["MENU_PID"];
			}
			//提交  导入 只将fileId传入即可
			rh_processData(_viewer.servId + ".impMenu.do", param, true);
			importWin.closePrompt();
			_viewer.refreshTreeAndGrid();
			
			file.destroy();
		},
		closeFunc:function() {
			file.destroy();
		}
	});
	importWin._layout(event,undefined,[450,230]);
	
	var container = jQuery("#" + importWin.dialogId);
	container.empty();
	importWin.tipBar = jQuery("<div></div>").text(importWin.tip).css({"height":"40px","font-weight":"normal","margin":"15px 15px 0px 15px","color":"red"});
    container.append(importWin.tipBar);
	container.append(file.obj);
	file.obj.css({'margin-left':'5px'});
	file.initUpload();
});

/*
 * 菜单预览
 */
_viewer.grid.getBtn("listPreview").unbind("click").bind("click", function(event) {
	//获取菜单信息
	var  infoVal = jQuery(this).parent().parent().find("input[icode ='MENU_INFO']").val();
	//获取菜单名
	var  nameVal = jQuery(this).parent().parent().find("input[icode ='MENU_NAME']").val();
	//获取菜单类型
	var  selectVal = jQuery(this).parent().parent().find("select[icode ='MENU_TYPE']").find('option:selected').val();
	//获取菜单ID
	var  idVal = jQuery(this).parent().parent().find("td[icode ='MENU_ID']").text();
	if(selectVal == 2){//菜单类型为链接
		if (infoVal.indexOf("http:") != 0) { //处理虚路径
			if (infoVal.indexOf("/") != 0) { //补足路径
				infoVal = "/" + infoVal;
			}
			infoVal = FireFly.contextPath + infoVal;
		}
		Tab.open({"url":infoVal,"tTitle":nameVal,"menuFlag":2,"menuId":idVal});		
	}else if(selectVal == 1){//菜单类型为服务
		Tab.open({"url":infoVal+".list.do","tTitle":nameVal,"menuFlag":2,"menuId":idVal});
	}else if(selectVal == 4){
		_viewer.listBarTipError("节点菜单不能预览");
	}else if(selectVal == 3){//菜单类型为JS
		eval(infoVal);
	}
});