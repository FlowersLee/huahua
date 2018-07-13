var _viewer = this;

//获取所有的checkbox
var chkboxs = _viewer.grid.getCheckBox();
//是否是系统管理员
var isSysAdmin = (System.getVar("@ROLE_CODES@").indexOf("RADMIN") >= 0) ;

jQuery(chkboxs).each(function(){
	var chkboxTd = jQuery(this);
	var sPublic = _viewer.grid.getRowItemValueByElement(chkboxTd,"S_PUBLIC");
	if(sPublic == 2){ //如果不是公共数据，表示是自己的数据
		return;
	}
	
	if(!isSysAdmin){ //对于公共数据，如果不是系统管理员则不能查看和修改
		chkboxTd.hide();
		_viewer.grid.getRowByElement(this).unbind("dblclick").bind("dblclick",function(){
			Tip.showAttention("没有权限！",true);
		});
	}
});