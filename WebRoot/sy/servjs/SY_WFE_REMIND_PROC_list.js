var _viewer = this;
_viewer.getBtn("finish").unbind("click");
_viewer.getBtn("finish").bind("click", function(event) { //绑定finish的act
	//alert(_viewer.servId);
	//alert(_viewer.getParHandler().getPKCode());
	_viewer.doServAct(_viewer.servId,"finish",true);
	//_viewer.getBtn("finish").attr("disabled", true);
	
	//_viewer.getParHandler().refresh();
	_viewer.getParHandler().setRefreshFlag(_viewer.getParHandler().servId, true);
	//_viewer.getParHandler().resetSize();
})