/** 服务卡片使用的js方法定义：开始 */
var _viewer = this;
_viewer._parentRefreshFlag = true;

// set default value
if ("" == _viewer.getItem("SEND_NUM").getValue()) {
	_viewer.getItem("SEND_NUM").setValue(_viewer.getDefaultData("SEND_NUM"));
}

if ("" == _viewer.getItem("SEND_FLAG").getValue()) {
	_viewer.getItem("SEND_FLAG").setValue(_viewer.getDefaultData("SEND_FLAG"));
}

if ("" == _viewer.getItem("SEND_TYPE").getValue()) {
	_viewer.getItem("SEND_TYPE").setValue(_viewer.getDefaultData("SEND_TYPE"));
}

var scope = _viewer.getByIdData("SCOPE");
if(scope == ""){ //未定义级别则显示全系统用户
	_viewer.getItem("TARGET_USERS").hide();
	_viewer.getItem("TARGET_DEPTS").hide();
}else if(scope == "ODEPT"){ //本单位
	_viewer.getItem("ALL_TARGET_USERS").hide();
	_viewer.getItem("ALL_TARGET_DEPTS").hide();
}

// load scheme
var btn = _viewer.getBtn("loadScheme");
btn.bind("click",function(event) {
	var inputName = "SEND_ID~SEND_NAME~SEND_MEMO";
	var configStr = "SY_COMM_SEND_SELECT,{'TARGET':'"
			+ inputName
			+ "','SOURCE':'SEND_ID~SEND_NAME~SEND_MEMO','PKHIDE':true,'EXTWHERE':' and 1=1 and S_FLAG = 1 and (S_USER = ^@USER_CODE@^ or S_PUBLIC = 1)','ADDBTN':false}";
	var callback = function(value) {
		// 来源于方案
		var sendObj = _viewer.form.getItemsValues();
		
		sendObj["fromScheme"] = "yes";
		sendObj["ifFirst"] = "yes";
		//分发方案ID
		sendObj["SEND_ID"] = value.SEND_ID;
		
		sendObj._extWhere = " and DATA_ID = '"
				+ _viewer.getItem("DATA_ID").getValue() + "'";
		var url = "SY_COMM_SEND_SHOW_USERS.list.do";
		var opts = {
			"url" : url,
			"tTitle" : "待分发人员列表",
			"params" : sendObj,
			"menuFlag" : 4
		};
		Tab.open(opts);
	}
	var options = {
		"itemCode" : inputName,
		"config" : configStr,
		"rebackCodes" : inputName,
		"parHandler" : this,
		"formHandler" : this,
		"replaceCallBack" : callback
	};
	var queryView = new rh.vi.rhSelectListView(options);
	queryView.show(event);
});

// 进入待分发人员列表
var send = _viewer.getBtn("fenfa");
send.bind("click", function(event) {
	var sendObj = _viewer.form.getItemsValues();
	sendObj._extWhere = " and DATA_ID = '"
			+ _viewer.getItem("DATA_ID").getValue() + "'";
	sendObj.ifFirst = "yes";
	var url = "SY_COMM_SEND_SHOW_USERS.list.do";
	var opts = {
		"url" : url,
		"tTitle" : "待分发人员列表",
		"params" : sendObj,
		"menuFlag" : 4,
	};
	Tab.open(opts);
});

// saveToScheme
var saveToScheme = _viewer.getBtn("saveToScheme");
saveToScheme
		.bind(
				"click",
				function(event) {

					// 保存方案弹出匡
					jQuery("#scheme").dialog("destroy");
					var winDialog = jQuery(
							"<div style='margin:10px 0px 0px 10px'></div>")
							.addClass("selectDialog").attr("id", "scheme")
							.attr("title", "另存为方案");

					// 方案必要属性
					var ul = jQuery("<ul></ul>").appendTo(winDialog);
					jQuery("<li  class='left' style='width: 30%'></li>")
							.append("名称").appendTo(ul);
					var inputNameLi = jQuery("<li class='right'></li>");
					var inputName = jQuery(
							"<INPUT class='ui-text-default' type='text' style='width: 200px;' id='SCHEME_NAME_INPUT' name ='SCHEME_NAME_INPUT'  />")
							.appendTo(inputNameLi);
					inputNameLi.appendTo(ul);

					var memo = jQuery("<ul></ul>").appendTo(winDialog);
					jQuery("<li  class='left' style='width: 30%'></li>")
							.append("备注").appendTo(memo);
					var memoLi = jQuery("<li class='right'></li>");
					jQuery(
							"<INPUT class='ui-text-default' type='text' style='width: 200px;'  id ='SCHEME_MEMO_INPUT' name ='SCHEME_MEMO_INPUT'  />")
							.appendTo(memoLi);
					memoLi.appendTo(memo);
					jQuery("<BR/>").appendTo(winDialog);
					jQuery("<BR/>").appendTo(winDialog);
					jQuery("<BR/>").appendTo(winDialog);
					// 按钮-保存
					var okBtn = jQuery(
							"<a><span class='rh-icon rh-icon-inner'>保存<span class='rh-icon-img btn-save'></span></span></a>")
							.appendTo(winDialog);
					okBtn.bind("click", function() {
						var namestr = jQuery("#SCHEME_NAME_INPUT").val();
						var memostr = jQuery("#SCHEME_MEMO_INPUT").val();
						_viewer.getItem("SCHEME_NAME").setValue(namestr);
						_viewer.getItem("SCHEME_MEMO").setValue(memostr);

						var res = FireFly.doAct("SY_SERV_SEND", "save",
								_viewer.form.getItemsValues());
						winDialog.remove();
					});

					jQuery("<span>&nbsp;&nbsp;&nbsp;</span>").appendTo(
							winDialog);
					// 按钮-取消
					var cancelBtn = jQuery(
							"<a><span class='rh-icon rh-icon-inner'>取消<span class='rh-icon-img btn-clear'></span></span></a>")
							.appendTo(winDialog);
					cancelBtn.bind("click", function() {
						winDialog.remove();
					});

					var posArray = [];
					if (event) {
						var cy = event.clientY;
						posArray[0] = "";
						posArray[1] = cy - 120;
					}
					winDialog.appendTo(jQuery("body"));
					jQuery("#scheme").dialog({
						autoOpen : false,
						width : 400,
						height : 260,
						modal : true,
						resizable : false,
						position : posArray,
						open : function() {

						},
						close : function() {
							winDialog.remove();
						}
					});
					jQuery("#scheme").dialog("open");
					jQuery(".ui-dialog-titlebar").last()
							.css("display", "block");// 设置标题显示

				});
