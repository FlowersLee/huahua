var _viewer = this;

function openKMList(CHNL_ID,title) {
        var strwhere =" AND CHNL_ID ='"+CHNL_ID+"' ";
        var params = {"_extWhere":strwhere};
       
		var opts = {"tTitle":title,"url":"CM_INFOS_VIEWMORE.list.do","params":params,"menuFlag":3};
		Tab.open(opts);
}
_viewer.grid.unbindTrdblClick();
_viewer.grid.unbindIndexTDClick();
_viewer.grid.dblClick(function(id, node) {
	var title = _viewer.grid.getRowItemValue(id,"CHNL_NAME");
	openKMList(id,title);
		}, _viewer);
