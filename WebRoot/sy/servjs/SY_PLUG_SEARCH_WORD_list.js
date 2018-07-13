/** 服务卡片使用的js方法定义：开始 */
var _viewer = this;
_viewer.getBtn("impServ").bind("click", function() {
	var table = window.prompt("请输入需要导入的服务及字段名？（格式为：服务.字段名）", "TBL_MSV_TOPIC_WORD.NAME");
	if (table == "" || table == null) {
		alert("没有输入有效的服务字段名！");
	} else {
		var param = {};
		param["SERV_ITEM"] = table;
		FireFly.doAct(_viewer.servId, "impServ", param, true);
		_viewer.refresh();
	}
});