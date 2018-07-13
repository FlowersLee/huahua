var _viewer = this;
var params = _viewer.getParams();
if (params) {
	var typecode = params.TYPE_CODE;
	if(typecode!=""&&typecode!=null){
	    _viewer.getItem("TYPE_CODE").setValue(params.TYPE_CODE); //给TYPE_CODE字段设值
	}
}
