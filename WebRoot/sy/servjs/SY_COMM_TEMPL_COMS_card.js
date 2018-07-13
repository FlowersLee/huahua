var _viewer = this;
var dataUrl = encodeURIComponent(_viewer.getItem("PC_DATA").getValue().replace(/\\/g, "\\\\"));
var id = _viewer.getItem("PC_ID").getValue();
var ftl = _viewer.getItem("PC_CON").getValue();
var name = _viewer.getItem("PC_NAME").getValue();
var preview = _viewer.getBtn("preview");
preview.unbind("click").bind("click", function(event) {
	Tab.open({'url':FireFly.getContextPath() + "/sy/comm/home/portalComView.jsp?id=" + id,'tTitle':"组件预览",'name':name,'menuFlag':3});
});

var select = _viewer.getBtn("selectOne");
select.unbind("click").bind("click", function(event) {
	//1.构造查询选择参数
	var configStr = "SY_COMM_TEMPL_COMS,{'TARGET':'~PC_NAME~PC_CON~PC_DATA~PC_SELF_PARAM~PC_PARAM','SOURCE':'PC_ID~PC_NAME~PC_CON~PC_DATA~PC_SELF_PARAM~PC_PARAM','TYPE':'single'}";
	var options = {
		"config" :configStr,
		"parHandler":_viewer,
		"formHandler":_viewer.form,
	    "replaceCallBack":function(idArray) {//回调，idArray为选中记录的相应字段的数组集合
	    	callBack(idArray);
		}
	};
	//2.用系统的查询选择组件 rh.vi.rhSelectListView()
	var queryView = new rh.vi.rhSelectListView(options);
	queryView.show(event);
});
/*
 * 回调的方法
 */
function callBack(idArray) {
	var title = idArray["PC_NAME"] + "【新建】";
    _viewer.getItem("PC_NAME").setValue(title);
    _viewer.getItem("PC_CON").setValue(idArray["PC_CON"]);
    _viewer.getItem("PC_DATA").setValue(idArray["PC_DATA"]);
    _viewer.getItem("PC_SELF_PARAM").setValue(idArray["PC_SELF_PARAM"]);
    _viewer.getItem("PC_PARAM").setValue(idArray["PC_PARAM"]);
};