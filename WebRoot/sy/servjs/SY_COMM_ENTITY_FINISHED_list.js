var _viewer = this;
//对列表上选中行双击查看绑定事件
_viewer.grid.unbindTrdblClick();
_viewer.grid.dblClick(function(value, node) {
	//双击打开该选中行的服务卡片页面
	Todo.openEntity(_viewer);
}, _viewer);