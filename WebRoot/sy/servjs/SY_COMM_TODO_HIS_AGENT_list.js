var _viewer = this;

_viewer.grid.unbindTrdblClick();
_viewer.grid.dblClick(function(value, node) {
	Todo.dbClickGrid(_viewer,_viewer.grid);
}, _viewer);