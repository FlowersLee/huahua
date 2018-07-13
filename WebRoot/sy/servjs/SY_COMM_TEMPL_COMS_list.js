var _viewer = this;
var preview = _viewer.grid.getBtn("listPreview");
preview.unbind("click").bind("click", function(event) {
	var pk = jQuery(this).attr("rowpk");
	var name = _viewer.grid.getRowItemValue(pk, 'PC_NAME');
	Tab.open({'url': FireFly.getContextPath() + "/sy/comm/home/portalComView.jsp?id=" + pk,'tTitle':"预览[" + name + "]",'menuFlag':3});
	event.stopPropagation();
	return false;
});