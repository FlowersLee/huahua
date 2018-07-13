/** 服务卡片使用的js方法定义：开始 */
var _viewer = this;
var deskIcon = _viewer.form.getItem("DS_ICON").getObj();//获取卡片图标(大)对象

//获取字典信息
var titleMsg ="";//提示信息
var dicList = FireFly.getDict("SY_COMM_DESK");
var dicObjs = dicList[0]["CHILD"];//获取字典信息对象数组
for (var i = 0; i < dicObjs.length; i++) {
	if (dicObjs[i]["ITEM_CODE"] == deskIcon.val()) {
		titleMsg = dicObjs[i]["ITEM_NAME"];
		break;
	}
}

var deskIconDataA = "";//添加图标选择链接
jQuery("#rh-card-desk-img-a").remove();//移除图标链接
deskIconDataA = jQuery("<a href='javascript:void(0);' id='rh-card-desk-img-a' " +
										"style='font-size:14px;float:left;margin-left:5px;padding-top:10px;width:20%;'><font color='blue'>图标选择</font></a>");
deskIconDataA.unbind("click").bind("click", {"dicObjs":dicObjs}, function(event){//给链接绑定事件
	new rh.vi.deskImg({"inpVal":deskIcon.val(), "titleMsg":jQuery("#rh-card-desk-img-msg").html(), "dicObjs":event.data["dicObjs"], "parHandler":_viewer, "callBack":function(callBackObj){
		deskIcon.val(callBackObj["inpVal"]);//回调函数操作
		_viewer.form.getItem("DS_NAME").setValue(callBackObj["titleMsg"]);//获取桌面名称
		jQuery("#rh-card-desk-img-msg").html("[" + callBackObj["titleMsg"] + "]");
	}});
});
deskIcon.parent().css({"float":"left","height":"27px","width":"75%"});//设定样式
deskIcon.parent().parent().css({"overflow":"hidden"}).append(deskIconDataA);
var titleSpan = jQuery("<span style='float:right;color:#999;position:relative;top:-20px;' id='rh-card-desk-img-msg'>[" + ( titleMsg || "无") + "]</span>");//添加悬浮提示信息
titleSpan.appendTo(deskIcon.parent());

//获取卡片图标(小)对象 
var menuIcon =_viewer.form.getItem("MENU_ICON").getObj();
//获取桌面小图标
var menuTitleMsg ="";//提示信息
var menuDicList = FireFly.getDict("SY_COMM_MENU_ICON");
var menuDicObjs = menuDicList[0]["CHILD"];//获取字典信息对象数组
for (var i = 0; i < menuDicObjs.length; i++) {
	if (menuDicObjs[i]["ITEM_CODE"] == menuIcon.val()) {
		menuTitleMsg = menuDicObjs[i]["ITEM_NAME"];
		break;
	}
}

var menuIconDataA = "";//添加图标选择链接
jQuery("#rh-card-menu-img-a").remove();//移除图标链接
menuIconDataA = jQuery("<a href='javascript:void(0);' id='rh-card-menu-img-a' " +
										"style='font-size:14px;float:left;margin-left:5px;padding-top:10px;width:20%;'><font color='blue'>图标选择</font></a>");
menuIconDataA.unbind("click").bind("click", {"dicObjs":menuDicObjs}, function(event){//给链接绑定事件
	new rh.vi.deskImg({"flag":"xiao","inpVal":menuIcon.val(), "titleMsg":jQuery("#rh-card-menu-img-msg").html(), "dicObjs":event.data["dicObjs"], "parHandler":_viewer, "callBack":function(callBackObj){
		menuIcon.val(callBackObj["inpVal"]);//回调函数操作
		jQuery("#rh-card-menu-img-msg").html("[" + callBackObj["titleMsg"] + "]");
	}});
});
menuIcon.parent().css({"float":"left","height":"27px","width":"75%"});//设定样式
menuIcon.parent().parent().css({"overflow":"hidden"}).append(menuIconDataA);
var titleSpan = jQuery("<span style='float:right;color:#999;position:relative;top:-20px;' id='rh-card-menu-img-msg'>[" + ( menuTitleMsg || "无") + "]</span>");//添加悬浮提示信息
titleSpan.appendTo(menuIcon.parent());

/**
 * 图标选择
 */
rh.vi.deskImg = function(backObj) {
	this.inpVal = "";
	this.titleMsg = "";
	this._loadData(backObj);
};

/**
 * 初始化
 */
rh.vi.deskImg.prototype._loadData = function(backObj) {
	var _self = this;
	_self.inpVal = backObj["inpVal"];
	_self.titleMsg = backObj["titleMsg"].replace("[","").replace("]","");
	var dicObjs = backObj["dicObjs"];//获取字典信息
	var htmlVal = jQuery("<div style='background-color:#FFF;height:100%;'></div>");//初始化html
	var ulHtml = jQuery("<ul style='overflow:hidden;background-color:#FFF;'></ul>");
	//var n = 0;
	for (var i = 0; i < dicObjs.length; i++) {
		if (backObj["flag"] == "xiao") {//如果为小图标
			var thisLi =  jQuery("<h3  name='rh-card-menu-h3' class='leftMenu-title ui-accordion-header ui-helper-reset ui-state-default ui-corner-all ui-state-active rh-card-menu-h3'>" +
					 "		<span class='ui-icon ui-icon-triangle-1-e leftMenu-"+ dicObjs[i]["ITEM_CODE"] +"'></span>" +
					 "		<label class='leftMenu-title-label'>" + dicObjs[i]["ITEM_NAME"] + "</label>" +
					 "		<span style='float:right;' class='leftMenu-ui-icon ui-icon-close'></span>" +
					 "</h3>").css({"width":"100px","margin":"5px 5px 5px 5px","float":"left"})
				 	.bind("click",{"inpVal":dicObjs[i]["ITEM_CODE"],"titleMsg":dicObjs[i]["ITEM_NAME"],"flag":backObj["flag"]}, function(event){//绑定单击事件
						_self._onclickicon(this, event.data["inpVal"], event.data["titleMsg"], event.data["flag"]);
					}).bind("dblclick",{"backObj":backObj, "dicObj":dicObjs[i]}, function(event){//绑定双击事件
						 if (event.data["backObj"].callBack) {//回写之后的方法
						        var callBack = event.data["backObj"].callBack;
						        callBack.call(callBack.parHandler,_self._onclickBackData("rh-card-json-desk-img-div"), event.data["dicObj"]["inpVal"],event.data["dicObj"]["titleMsg"]);
						    }
					}).appendTo(ulHtml);
			if (dicObjs[i]["ITEM_CODE"] == backObj["inpVal"]) {//如果输入框有值，则在弹出框此图标处于选中状态
				thisLi.addClass("rh-card-menu-h3-onclick");
			}
		} else {//大图标
			var thisLi = jQuery( "<li  name='rh-card-desk-li' class='rh-card-desk-img-li' title='" + dicObjs[i]["ITEM_NAME"] + "' style='padding:16px 0px 16px 0px;float:left;text-align:center;width:101px;heigth:100px;'> " +
						" 	<div class='img'> " +
						"		<p> " +
						"			<img src='" + FireFly.getContextPath() + "/sy/comm/desk/css/images/app_rh-icons/" + dicObjs[i]["ITEM_CODE"] + ".png'> " +
						"		</p> " +
						"		<div style='display: none;'></div> " +
						"	</div> " +
						"	<span>" + dicObjs[i]["ITEM_NAME"] + "</span> " +
						"</li>").bind("click",{"inpVal":dicObjs[i]["ITEM_CODE"],"titleMsg":dicObjs[i]["ITEM_NAME"]}, function(event){//绑定单击事件
							_self._onclickicon(this, event.data["inpVal"], event.data["titleMsg"]);
						}).bind("dblclick",{"backObj":backObj, "dicObj":dicObjs[i]}, function(event){//绑定双击事件
							 if (event.data["backObj"].callBack) {//回写之后的方法
							        var callBack = event.data["backObj"].callBack;
							        callBack.call(callBack.parHandler,_self._onclickBackData("rh-card-json-desk-img-div"), event.data["dicObj"]["inpVal"],event.data["dicObj"]["titleMsg"]);
							    }
						}).appendTo(ulHtml);
			if (dicObjs[i]["ITEM_CODE"] == backObj["inpVal"]) {//如果输入框有值，则在弹出框此图标处于选中状态
				thisLi.addClass("rh-card-desk-img-onclick").find("span").css({"color":"red","font-weight":"bold"});
			}
		}
	}
	htmlVal.append(ulHtml);
	_self._createDialog(htmlVal, backObj);
};


/*
 * 初始化dialog
 */
rh.vi.deskImg.prototype._createDialog = function(htmlVal,backObj){
		var _self = this;
		jQuery("#rh-card-json-desk-img-div").remove();
		var dialogId = "rh-card-json-desk-img-div"; // 设置Dialog的id
		var winDialog = jQuery("<div style='padding: 5px 5px 5px 5px;'></div>").attr("id", dialogId).attr("title","图标选择[可双击回显]");
		winDialog.appendTo(jQuery("body"));
		var bodyWid = jQuery("body").width();
		var hei = GLOBAL.getDefaultFrameHei() - 100;
		var wid = bodyWid / 2 + 85;
		if (backObj["flag"] == "xiao") {//如果为小图标
			hei = GLOBAL.getDefaultFrameHei() - 300;
		}
		var posArray = [ 100, 30 ];
		jQuery("#" + dialogId).dialog({
			autoOpen : false,height : hei,width : wid,modal : true,show:"blud",hide:"blue",draggable:true,
			resizable : false,position : posArray,
			buttons: {
				"确认": function() {
					 if (backObj.callBack) {//回写之后的方法
					        var callBack = backObj.callBack;
					        callBack.call(callBack.parHandler,_self._onclickBackData(dialogId));
					    }
				},
				"关闭": function() {
					jQuery("#" + dialogId).remove();
				}
		},
			open : function() {},
			close : function() {jQuery("#" + dialogId).remove();}
		});
		// 打开dialog
		var dialogObj = jQuery("#" + dialogId);
		dialogObj.dialog("open");
		dialogObj.focus();
		jQuery(".ui-dialog-titlebar").last().css("display", "block");// 设置标题显示
		dialogObj.parent().addClass("rh-bottom-right-radius rhSelectWidget-content");
		Tip.showLoad("努力加载中...", null, jQuery(".ui-dialog-title", winDialog).last());
		var btns = jQuery(".ui-dialog-buttonpane button",dialogObj.parent()).attr("onfocus","this.blur()");
		btns.first().addClass("rh-small-dialog-ok");
		btns.last().addClass("rh-small-dialog-close");
		dialogObj.parent().addClass("rh-small-dialog").addClass("rh-bottom-right-radius");
	    jQuery(".ui-dialog-titlebar").last().css("display","block");//设置标题显示
	    dialogObj.append(htmlVal);
};

/**
 * 单击事件
 */
rh.vi.deskImg.prototype._onclickicon = function(obj, inpVal, titleMsg,flag){
	var _self = this;
	if (!flag) {
		jQuery("li[name='rh-card-desk-li']").removeClass("rh-card-desk-img-onclick").find("span").css({"color":"","font-weight":""});
		jQuery(obj).addClass("rh-card-desk-img-onclick").find("span").css({"color":"red","font-weight":"bold"});
	}else {
		jQuery("h3[name='rh-card-menu-h3']").removeClass("rh-card-menu-h3-onclick").addClass("rh-card-menu-h3");
		jQuery(obj).removeClass("rh-card-menu-h3").addClass("rh-card-menu-h3-onclick");
	}
	_self.inpVal = inpVal;
	_self.titleMsg = titleMsg;
};

/**
 * 点击回调函数
 */
rh.vi.deskImg.prototype._onclickBackData = function(dialogId, inpVal, titleMsg){
	var _self = this;
	jQuery("#" + dialogId).remove();
	if ((inpVal || "") != "" || (titleMsg || "") != "")  {
		_self.inpVal = inpVal;
		_self.titleMsg = titleMsg;
	}
	return {"inpVal":_self.inpVal,"titleMsg":_self.titleMsg};
};