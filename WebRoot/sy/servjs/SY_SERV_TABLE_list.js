/** 服务卡片使用的js方法定义：开始 */
var _viewer = this;

/**
 * [导出数据结构]按钮绑定事件
 * @author hdy
 */
_viewer.getBtn("outputConstruCtion").unbind("click").bind("click",function(){
	//获取主键数组
	var idsAttr = _viewer.grid.getSelectPKCodes();
	//id格式字符串
	var ids = "";
	for (var i = 0; i < idsAttr.length; i++){
		if (idsAttr.length == 0) {
			break;
		}
		ids += "'" + idsAttr[i] + "',";
	}
	if (ids.lastIndexOf(",") == (ids.length - 1)) {
		ids = ids.substring(0,ids.length - 1);
	}
	var data = {"filePath":"sy/xdoc/data_construction.xdoc","fileName":"导出数据结构","format":"doc","ids":ids};
	FireFly.doFormAct(_viewer.servId, "getOutputXdocFile", data);
});