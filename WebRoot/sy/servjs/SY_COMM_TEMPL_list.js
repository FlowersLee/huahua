var _viewer = this;
_viewer.grid.getBtn("preview").unbind("click").bind("click", function(event) {
	var pk = jQuery(this).attr("rowpk");
	Tab.open({'url':'SY_COMM_TEMPL.show.do?model=view&pkCode=' + pk,'tTitle':_viewer.grid.getRowItemValue(pk, 'PT_TITLE'),'menuFlag':3});
	event.stopPropagation();
	return false;
});
