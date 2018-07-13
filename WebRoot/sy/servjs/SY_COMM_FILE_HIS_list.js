var _viewer = this;



//恢复文件
var recover =  _viewer.grid.getBtn("recover");
recover.bind("click",function(){	
	 var PKCode = jQuery(this).attr("rowpk");
	 var serId = _viewer.servId;
	 var content = FireFly.byId(serId,PKCode);
	 FireFly.doAct(serId,"recoverHisFile",content,true,false);
	 _viewer.refresh();
	 _viewer.getParHandler().refresh();	
});

// 查看历史文件
_viewer.grid.unbindTrdblClick();
//_viewer.grid.dblClick(function(value, node) {
//	
//}, _viewer);
	//点击文件标题  查看历史文件
	jQuery("td[icode='FILE_NAME']").bind("click",function(){		
		var pk = jQuery(this).parent().attr("id");		
		var fileId = _viewer.grid.getRowItemValue(pk, "FILE_ID");
		var fileName = _viewer.grid.getRowItemValue(pk, "FILE_NAME");
		var file = new rh.ui.File();
		file.viewFile(fileId, fileName);		
	});
	
	//点击文件标题  查看历史文件
	jQuery("td[icode='HISTFILE_SIZE']").bind("click",function(){		
		var pk = jQuery(this).parent().attr("id");		
		var fileId = _viewer.grid.getRowItemValue(pk, "FILE_ID");
		var fileName = _viewer.grid.getRowItemValue(pk, "FILE_NAME");
		var file = new rh.ui.File();
		file.viewFile(fileId, fileName);		
	});
	
	//点击文件大小  查看历史文件
	jQuery("td[icode='HISTFILE_VERSION']").bind("click",function(){		
		var pk = jQuery(this).parent().attr("id");		
		var fileId = _viewer.grid.getRowItemValue(pk, "FILE_ID");
		var fileName = _viewer.grid.getRowItemValue(pk, "FILE_NAME");
		var file = new rh.ui.File();
		file.viewFile(fileId, fileName);		
	});
	
	//点击操作时间  查看历史文件
	jQuery("td[icode='S_MTIME']").bind("click",function(){		
		var pk = jQuery(this).parent().attr("id");		
		var fileId = _viewer.grid.getRowItemValue(pk, "FILE_ID");
		var fileName = _viewer.grid.getRowItemValue(pk, "FILE_NAME");
		var file = new rh.ui.File();
		file.viewFile(fileId, fileName);		
	});
	