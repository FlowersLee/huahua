var _viewer = this;

//隐藏“保存”按钮
_viewer.getBtn("save").hide();

//“确认”按钮
_viewer.getBtn("saveFromAgent").unbind("click").bind("click",function(event){
	if(!_viewer.form.validate()) {
		_viewer.cardBarTipError("校验未通过");
    	return false;
    }
	var param = {
		"AGT_ID": _viewer.opts.params.AGT_ID,
		"USER_CODE":System.getVar("@USER_CODE@"),
		"TO_USER_CODE": _viewer.itemValue("TO_USER_CODE"),
		"AGT_TYPE_CODE": _viewer.itemValue("AGT_TYPE_CODE"),
		"MAIN_AGT_STATUS":_viewer.opts.params.MAIN_AGT_STATUS,
		"AGT_BEGIN_DATE": _viewer.opts.params.startDate || "",
		"AGT_END_DATE": _viewer.opts.params.endDate || "",
		"action":"addAgent"
	};
	var result = FireFly.doAct("SY_ORG_USER_TYPE_AGENT", "doAgentAction", param, true, false);
	if (result[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) >= 0) {
		_viewer.getParHandler().refresh();
		_viewer.backClick();
	}
});

//“取消”按钮
_viewer.getBtn("cancel").unbind("click").bind("click",function(event){
	_viewer.backClick();
});

//去掉最小高度
jQuery("#" + _viewer.servId + "-winTabs").css("min-height","auto");

var checkedInputs = 0;
var checkNum = _viewer.getItem("AGT_TYPE_CODE").obj.find("input[type='checkbox']").length - 1;
//全部业务checkbox
var allInput = jQuery("input[value='_ALL_']");
if(allInput.next().text() == "全部业务"){
	jQuery("<br/>").insertAfter(allInput.next());
	allInput.unbind("click").bind("click",function(){
		if(allInput.is(":checked")){
			_viewer.getItem("AGT_TYPE_CODE").obj.find("input[type='checkbox']").attr("checked", true);
			checkedInputs = checkNum;
		}else{
			_viewer.getItem("AGT_TYPE_CODE").obj.find("input[type='checkbox']").attr("checked", false);
			checkedInputs = 0;
		}
	});
	allInput.next().unbind("click");
}

//一般业务
var normalInputs = _viewer.getItem("AGT_TYPE_CODE").obj.find("input[type='checkbox'][value!='_ALL_']");
jQuery.each(normalInputs, function(i,n){
	jQuery(n).unbind("click").bind("click",function(){
		if(jQuery(this).is(":checked")){
			checkedInputs++;
		}else{
			checkedInputs--;
		}
		if(checkedInputs == checkNum){
			allInput.attr("checked", true);
		}else if(checkedInputs == checkNum - 1){
			allInput.attr("checked", false);
		}
	});
	jQuery(n).next().unbind("click");
});

//其它业务checkbox
//var otherInput = jQuery("input[value='_OTHER_']");
//if(otherInput.next().text() == "其它业务"){
//	jQuery("<br/>").insertBefore(otherInput);
//}
