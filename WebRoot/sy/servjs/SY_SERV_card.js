/** 服务卡片使用的js方法定义：开始 */
var _viewer = this;
_viewer.getBtn("copyOf").unbind("click").bind("click", function() {
	var fromServId = window.prompt("请输入需要从哪个服务主键中复制定义信息？", "");
	if (fromServId == "" || fromServId == null) {
		alert("没有输入有效的服务主键！");
	} else {
		var param = {};
		param["FROM_SERV_ID"] = fromServId;
		param["SERV_ID"] = _viewer.getByIdData("SERV_ID");
		FireFly.doAct(_viewer.servId, "copyOf", param, true);
		_viewer.refresh();
	}
});

var searchFlag = _viewer.form.getItem("SERV_SEARCH_FLAG");
if (searchFlag.getValue() == 1) {
	var setSearch = jQuery(" <a href='#'>【设置全文检索】</a>").appendTo(searchFlag.obj.find("div").first());
	setSearch.bind("click", function() {
		var options = {"url":"SY_SERV_SEARCH.card.do?pkCode=" + _viewer.getByIdData("SERV_ID"),"tTitle":'设置全文检索'};
		Tab.open(options);
	});
};
var falseDel = _viewer.form.getItem("SERV_DELETE_FLAG"); //假删除
falseDel.getObj().unbind("click").bind("click", function(event) {
	var dataTitle = _viewer.getItem("SERV_DATA_TITLE").getValue();
	var tar = jQuery(event.target);
	if (tar.attr("value") == 1 && dataTitle == "") { //启用假删除需要先设定字典编码
		_viewer.cardBarTipError("请先设置标题格式！");
		return false;
	}
});


