/** 服务卡片使用的js方法定义：开始 */
var _viewer = this;
var inpMode = _viewer.form.getItem("ITEM_INPUT_MODE").obj;
var json1 =[
			 { "code": "SY_SERV", "name":"服务编码", "notNull":"true","isVisualHand":"true",
				 "confBean":{"sid":"SY_SERV","TARGET":"~","SOURCE":"SERV_ID~SERV_NAME", "TYPE":"single"}
			 },
			 { "code": "SOURCE", "name":"显示字段","notNull":"true",
            	 "confBean":{"sid":"SY_SERV_ITEM","TARGET":"~","SOURCE":"ITEM_CODE~ITEM_NAME","EXTWHERE":" and SERV_ID = '$SY_SERV_ITEM$'", "TYPE":"multi"}
			 },
             { "code": "TARGET", "name":"目标字段","notNull":"true","isTarget":"true",
				 "confBean":{"sid":"SY_SERV_ITEM","TARGET":"~","SOURCE":"ITEM_CODE~ITEM_NAME","EXTWHERE":" and SERV_ID = '$SY_SERV_ITEM$'","TYPE":"multi"}
			 },
             { "code": "EXTWHERE", "name":"过滤条件", "type": "textarea" },
             { "code": "SEARCHEXTWHERE", "name":"高级查询", "type": "textarea" },
             { "code": "SEARCHHIDE", "name":"高级查询显示?", "type": "radio","value":"true,false", "show":"是,否"},
             { "code": "TYPE", "name":"选择类型?", "type": "radio","value":"single,multi", "show":"单选,多选"},
             { "code": "DATAFLAG", "name":"列表数据?", "type": "radio","value":"true,false", "show":"是,否"},
             { "code": "SEARCHTYPE", "name":"高级查询显示多选?", "type": "radio","value":"true,false", "show":"是,否"}
	     ];
var json2 =[
            { "code": "SY_SERV_ITEM", "name":"字典编码", "notNull":"true","isVisualHand":"true",
				 "confBean":{"sid":"SY_SERV_DICT","TARGET":"~","SOURCE":"DICT_ID~DICT_NAME","TYPE":"single"}
			 },
			{ "code": "PID", "name":"顶级节点"},
			{ "code": "LEVEL", "name":"获取层级"},
	        { "code": "EXTWHERE", "name":"过滤条件", "type": "textarea" },
            { "code": "extendDicSetting", "name":"扩展设置", "type": "textarea" },
            { "code": "TYPE", "name":"选择类型?", "type": "radio","value":"single,multi", "show":"单选,多选"},
            { "code": "rtnLeaf", "name":"只获取叶子节点?", "type": "radio","value":"true,false", "show":"是,否"},
            { "code": "SEARCHHIDE", "name":"高级查询显示?", "type": "radio","value":"true,false", "show":"是,否"},
            { "code": "SEARCHTYPE", "name":"高级查询显示多选?", "type": "radio","value":"true,false", "show":"是,否"}
	     ];
if (inpMode.val() == 2 || inpMode.val() == 3) {
	bindVisualJson(inpMode, json1, json2);
}
inpMode.unbind("change").bind("change",function(){
	if (inpMode.val() == 2 || inpMode.val() == 3) {
		bindVisualJson(inpMode, json1, json2);
	} else {
		jQuery("#rh-card-json-deploy-a").remove();
		_viewer.form.getItem("ITEM_INPUT_CONFIG").obj.parent().removeClass("rh-card-visualJson-hide");
	}
});

/**
 * 绑定可视化元素
 */
function bindVisualJson(inpMode, json1, json2) {
	jQuery("#rh-card-json-deploy-a").remove();
	var deployDataA = jQuery("<a href='javascript:void(0);' class='rh-card-visualJson-a' id='rh-card-json-deploy-a'><font color='blue'>辅助设计</font></a>");
	deployDataA.unbind("click").bind("click", function(){
		if (inpMode.val() == 2) {
			new rh.vi.visualJson({"col":"1","json":json1,"sourceVal":_viewer.form.getItem("ITEM_INPUT_CONFIG").getValue(),
				"parHandler":_viewer,"dialogWid":"","dialogHei":"","callBack":function(jsonStr){
				_viewer.form.getItem("ITEM_INPUT_CONFIG").setValue(jsonStr);
			}});
		} else if (inpMode.val() == 3) {
			new rh.vi.visualJson({"col":"2","json":json2,"sourceVal":_viewer.form.getItem("ITEM_INPUT_CONFIG").getValue(),
				"parHandler":_viewer,"dialogWid":"1000","dialogHei":"350","callBack":function(jsonStr){
				_viewer.form.getItem("ITEM_INPUT_CONFIG").setValue(jsonStr);
			}});
		}	
	});
	_viewer.form.getItem("ITEM_INPUT_CONFIG").obj.parent().addClass("rh-card-visualJson-hide").parent().append(deployDataA);
}