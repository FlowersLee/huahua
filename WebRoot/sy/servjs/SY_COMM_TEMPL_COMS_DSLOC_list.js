var _viewer = this;
var coms = FireFly.byId("SY_ORG_USER_FLOATMENU",System.getVar("@USER_CODE@")).COMS_ID;
var comsIds = "";
if(coms){
	comsIds = coms.split(",");
}
var rows = jQuery(".rowIndex");
for(i=0;i<rows.length;i++){
	var rowData = jQuery(rows[i]).attr('id');
	var rowId = Format.substr(5,rowData.length,rowData);
	for(j=0;j<comsIds.length;j++){
		if(rowId == comsIds[j]){
			jQuery(rows[i]).attr("checked",true);
			jQuery(rows[i]).parent().parent().addClass("tBody-selectTr");
			break;
		}
	}
}
//加入浮动按钮按钮事件绑定
_viewer.getBtn('addFloatMenu').unbind("click").bind("click", function(event) {
    var datas = _viewer.grid.getSelectPKCodes()+"";
    var names = "";
    var ids = datas.split(",");
    for(i=0;i < ids.length;i++){
	   names += (_viewer.grid.getRowItemValue(ids[i],"PC_NAME")+",");
    }
    names = Format.substr(0,names.length-1,names);
    if (datas == null) {
    	_viewer.listBarTipError("请选择相应记录！");
    } else {
  	  //判断列表如果需要校验，对列表进行校验
    	  if(_viewer.grid.needValidate() && !_viewer.grid.validate()) {
    		   _viewer.listBarTipError("校验未通过");
    	       return false;
    	   }
  	  	   _viewer.listBarTipLoad("提交中...");
    	   setTimeout(function() {
    		   _viewer.beforeSave.call(_viewer, datas);
        	   var batchData = {};
        	   var userCode = System.getVar("@USER_CODE@");
        	   var userFlag = FireFly.byId("SY_ORG_USER_FLOATMENU",userCode);
        	   if(userFlag._PK_){
        		   batchData["_PK_"] = userCode;
        	   }
        	   batchData["USER_CODE"] = System.getVar("@USER_CODE@");
        	   batchData["COMS_ID"] = datas;
        	   batchData["COMS_NAME"] = names;
        	   var resultData = FireFly.doAct("SY_ORG_USER_FLOATMENU","save",batchData,true);
        	   // 保存之后
        	   _viewer.afterSave.call(_viewer, datas);
        	   _viewer.refreshGrid();
		       parent.floatMenu.bldShortContent();
    	   },0);
    }
    
});
