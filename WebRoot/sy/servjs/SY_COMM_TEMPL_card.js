var _viewer = this;
_viewer.getBtn("selectOne").unbind("click").bind("click", function(event) {//选择一个现有模版
	//2.构造查询选择参数
	var configStr = "SY_COMM_TEMPL,{'TARGET':'~PT_TITLE~PT_CONTENT~PT_PARAM~PT_INCL_CSSJS','SOURCE':'PT_ID~PT_TITLE~PT_CONTENT~PT_PARAM~PT_INCL_CSSJS','TYPE':'single','HTMLITEM':'PT_CONTENT,PT_INCL_CSSJS'}";
	var options = {
		"config" :configStr,
		"parHandler":_viewer,
		"formHandler":_viewer.form,
	    "replaceCallBack":function(idArray) {//回调，idArray为选中记录的相应字段的数组集合
	    	callBack(idArray);
		}
	};
	//3.用系统的查询选择组件 rh.vi.rhSelectListView()
	var queryView = new rh.vi.rhSelectListView(options);
	queryView.show(event);
});
/*
 * 回调的方法
 */
function callBack(idArray) {
	var title = idArray["PT_TITLE"] + "【新建】";
    _viewer.getItem("PT_TITLE").setValue(title);
    _viewer.getItem("PT_CONTENT").setValue(idArray["PT_CONTENT"]);
    _viewer.getItem("PT_PARAM").setValue(idArray["PT_PARAM"]);
    _viewer.getItem("PT_INCL_CSSJS").setValue(idArray["PT_INCL_CSSJS"]);
};