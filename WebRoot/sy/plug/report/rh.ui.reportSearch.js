/*
 * 报表查询组件
 */
GLOBAL.namespace("rh.ui");
rh.ui.reportSearch = function(options) {
	rh.ui.search.call(this,options);
};
//设定原型链对象，继承高级查询的属性和方法
rh.ui.reportSearch.prototype = new rh.ui.search();
/*
 * 报表查询参数
 */
rh.ui.reportSearch.prototype.assembleParams = function() {
	var _self = this;
	var res = jQuery(".rh-advSearch-val",this.table);
	var temp = "";
	_self.reportParams = {};
	jQuery.each(res,function(i,n) {
		var obj = jQuery(n);
		//字段编码
		var itemCode = obj.data("itemcode");
		var va = "";
		if (obj.data("itemtype") == UIConst.FITEM_ELEMENT_CHECKBOX) {
			var checks = obj.find("input:checked");
			var array = [];
			jQuery.each(checks, function(i,n) {
				array.push(jQuery(n).attr("value"));
			});
			va = array.join(",");
		} else {
			va = jQuery.trim(obj.val());
		}
		if (obj.data("itemmode") && obj.data("itemmode") == UIConst.FITEM_INPUT_DATE) {//日期特殊处理
			//报表参数初始化
			_self.reportParams[itemCode] = null;
			var symbolSelect = obj.data("symbolSelect");
			//日期为区间查询，如果没有选择过滤符号，第一个日期框默认为">="
			var symbol = symbolSelect ? symbolSelect.val() : ">=";
			if(va && va.length > 0){
				_self.reportParams[itemCode] = va;
				temp += " and ";
				temp += obj.data("itemcode");
				temp += (" " + symbol + " '");
				temp += va;
				temp += "'";
			}
			//判断是否是区间查询
			var nextInp = obj.data("nextInp");
			if(nextInp){
				//报表参数初始化
				_self.reportParams[itemCode+"__SECOND"] = null;
			}
			var nextVal = nextInp ? nextInp.val() : null;
			if (nextVal && nextVal.length > 0) {
				_self.reportParams[itemCode+"__SECOND"] = nextVal;
				symbolSelect = nextInp.data("symbolSelect");
				//日期为区间查询，如果没有选择过滤符号，第二个日期框默认为"<="
				symbol = symbolSelect ? symbolSelect.val() : "<=";
				temp += " and ";
				temp += obj.data("itemcode");
				temp += (" " + symbol + " '");
				temp += nextVal;
				temp += "'";
			}
		} else if ((obj.data("itemmode") == UIConst.FITEM_INPUT_DICT) //字典
				     || (obj.data("itemmode") == UIConst.FITEM_INPUT_QUERY) //查询选择
				     || (obj.data("itemtype") == UIConst.FITEM_ELEMENT_SELECT) //下拉框
				     || (obj.data("itemtype") == UIConst.FITEM_ELEMENT_CHECKBOX)) { //多选框
			//报表参数初始化
			_self.reportParams[itemCode] = va;
			//如果没有输入查询项，则返回
			if(!va || va.length <= 0){
				return true;
			}
			var array = va.split(",");
			if (array.length > 1) {
				var codesArray = [];
				for (var i = 0; i < array.length;i++) {
					var codes = "";
					codes += "'";
					codes += array[i];
					codes += "'";
					codesArray.push(codes);
				}
				temp += " and ";
				temp += jQuery(n).data("itemcode");
				temp += " in (";
				temp += codesArray.join(",");
				temp += ")";
			} else {
				temp += " and ";
				temp += jQuery(n).data("itemcode");
				temp += " = '";
				temp += va;
				temp += "'";
			}
		} else if(obj.data("datatype") == UIConst.DATA_TYPE_NUM){
			//报表参数初始化
			_self.reportParams[itemCode] = null;
			var symbolSelect = obj.data("symbolSelect");
			//如果没有选择过滤符号，默认为"="
			var symbol = symbolSelect ? symbolSelect.val() : "=";
			if(va && va.length > 0 && va != _self._numberInputTipMsg){
				_self.reportParams[itemCode] = va;
				temp += " and ";
				temp += obj.data("itemcode");
				temp += (" " + symbol + " '");
				temp += va;
				temp += "'";
			}
			//判断是否是区间查询
			var nextInp = obj.data("nextInp");
			if(nextInp){
				//报表参数初始化
				_self.reportParams[itemCode+"__SECOND"] = null;
			}
			var nextVal = nextInp ? nextInp.val() : null;
			if (nextVal && nextVal.length > 0 && nextVal != _self._numberInputTipMsg) {
				_self.reportParams[itemCode+"__SECOND"] = nextVal;
				symbolSelect = nextInp.data("symbolSelect");
				symbol = symbolSelect ? symbolSelect.val() : "=";
				temp += " and ";
				temp += obj.data("itemcode");
				temp += (" " + symbol + " '");
				temp += nextVal;
				temp += "'";
			}
		} else {
			//报表参数初始化
			_self.reportParams[itemCode] = va;
			//如果没有输入查询项，则返回
			if(!va || va.length <= 0){
				return true;
			}
			var symbolSelect = obj.data("symbolSelect");
			//如果没有选择过滤符号，默认为"like"
			var symbol = symbolSelect ? symbolSelect.val() : "like";
			if(symbol == '='){
				temp += " and ";
				temp += jQuery(n).data("itemcode");
				temp += " "+symbol+" '";
				temp += va;
				temp += "'";
				temp = temp;
			}else{
				temp += " and ";
				temp += jQuery(n).data("itemcode");
				temp += " "+symbol+" '%";
				temp += va;
				temp += "%'";
				temp = temp;
			}
		}
	});
	//设定WHERE条件
	_self._WHERE_ = temp;
	return temp;
}