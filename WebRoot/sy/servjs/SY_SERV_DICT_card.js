/** 服务卡片使用的js方法定义：开始 */
var _viewer = this;
var inner = jQuery("input", _viewer.getItem("DICT_IS_INNER").obj);
inner.bind("click", function(event) {
	var dictCode = _viewer.getItem("DICT_ID").getValue();
	if (dictCode == "") { //需要先设定字典编码
		_viewer.cardBarTipError("请先设置字典编码！");
		return false;
	}
	var tar = jQuery(event.target);
	if (tar.attr("value") == 1) {//内部字典
	    innerDic();
	} else {
		_viewer.getItem("TABLE_WHERE").show();
	}
});

function innerDic() {
	_viewer.getItem("TABLE_WHERE").hide(); 
	_viewer.getItem("TABLE_ID").setValue("SY_SERV_DICT_ITEM"); 
    _viewer.getItem("DICT_F_ID").setValue("ITEM_CODE");  
    _viewer.getItem("DICT_F_NAME").setValue("ITEM_NAME");  
    _viewer.getItem("DICT_F_FLAG").setValue("ITEM_FLAG");
    var itemOrder = "ITEM_ORDER";
    var dictType = _viewer.getItem("DICT_TYPE").getValue();
    _viewer.getItem("DICT_F_PATH").setValue("");
    _viewer.getItem("DICT_F_LEVEL").setValue("");
	_viewer.getItem("DICT_F_PARENT").setValue("");
    if (dictType == 2) { //树形字典
        _viewer.getItem("DICT_F_PARENT").setValue("ITEM_PCODE");
        _viewer.getItem("DICT_F_PATH").setValue("CODE_PATH");
        _viewer.getItem("DICT_F_LEVEL").setValue("ITEM_LEVEL");
        itemOrder = "ITEM_LEVLE," + itemOrder;
    } else if (dictType == 4) { //叶子字典：处理父字段
    	_viewer.getItem("DICT_F_PARENT").setValue("ITEM_PCODE");
	}
    _viewer.getItem("TABLE_ORDER").setValue(itemOrder);
}  

var dictType = _viewer.getItem("DICT_TYPE").obj;
dictType.bind("change", function(event) { //根据字典类型的变化动态隐藏或者显示需要的字段
	var tar = jQuery(event.target);
	var type = tar.attr("value");
	if (type == 2) {
		_viewer.getItem("DICT_F_PARENT").show();
		_viewer.getItem("DICT_F_PATH").show();
		_viewer.getItem("DICT_F_LEVEL").show();
	} else if (type == 4) {
		_viewer.getItem("DICT_F_PARENT").show();
		_viewer.getItem("DICT_F_PATH").hide();
		_viewer.getItem("DICT_F_LEVEL").hide();
	} else {
		_viewer.getItem("DICT_F_PARENT").hide();
		_viewer.getItem("DICT_F_PATH").hide();
		_viewer.getItem("DICT_F_LEVEL").hide();
	}
});
_viewer.getItem("DICT_TYPE").obj.change();

//预览树形数据
_viewer.getBtn("preview").unbind("click").bind("click",function(event) {
	var dictCode = _viewer.getItem("DICT_ID").getValue(); 
	var configStr = dictCode;
	var extendTreeSetting = {"childOnly":false};
	var options = {"itemCode":"hello","config" : configStr,"hide":"explode","show":"blind",
	"extendDicSetting":extendTreeSetting};
	var dictView = new rh.vi.rhDictTreeView(options);
	dictView.show(event);
});
