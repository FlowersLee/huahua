/** 服务卡片使用的js方法定义：开始 */
var _viewer = this;
var actCss = _viewer.form.getItem("ACT_CSS").obj;
var actCssDataA = "";
jQuery("#rh-card-but-img-a").remove();
actCssDataA = jQuery("<a href='javascript:void(0);' id='rh-card-but-img-a' " +
										"style='font-size:14px;float:left;margin-left:5px;padding-top:10px;'><font color='blue'>图标选择</font></a>");
actCssDataA.unbind("click").bind("click", function(){
	new rh.vi.butImg({"selectVal":actCss.val(),"parHandler":_viewer,"callBack":function(selectObj){
		var count=actCss.get(0).options.length;
		for(var i=0;i<count;i++){
			if(actCss.get(0).options[i].value == selectObj.text)
			{
				actCss.get(0).options[i].selected = true;
				break;  
			}  
		}
	}});
});
//actCss.css({"float":"left"});
actCss.parent().css({"float":"left"});
actCss.parent().parent().css({"overflow":"auto"}).append(actCssDataA);


/**
 * 图标选择
 */
rh.vi.butImg = function(backObj) {
	this.select = 0;
	this.text = "";
	this._loadData(backObj);
};

/**
 * 初始化
 */
rh.vi.butImg.prototype._loadData = function(backObj) {
	var _self = this;
	var dicList = FireFly.getDict("SY_ACT_ICONS");
	var dicObjs = dicList[0]["CHILD"];
	var htmlVal = jQuery("<div></div>");
	var n = 0;
	for (var i = 0; i < dicObjs.length; i++) {
		n += 1;
		var aObj = "";
		if (dicObjs[i]["ITEM_CODE"] == backObj["selectVal"]) {
			_self.text = backObj["selectVal"];
			aObj =  jQuery("<a class='rh-icon rhGrid-btnBar-a' name='rh-icon-a' style='margin: 5px 0px 5px 5px;' href='javascript:void(0);' </a>");
			aObj.css({"color":"blue","font-weight":"bold"});
		} else {
			aObj =  jQuery("<a class='rh-icon rhGrid-btnBar-a' name='rh-icon-a' style='margin: 5px 0px 5px 5px' href='javascript:void(0);' </a>");
		}
		aObj.bind("click",{"n":n,"self":aObj,"text":dicObjs[i]["ITEM_CODE"]},function(event){
			_self._onclickicon(event.data.self,event.data.n,event.data.text);
		});
		aObj.bind("dblclick",{"backObj":backObj,"n":n,"text":dicObjs[i]["ITEM_CODE"]},function(event){
			_self.select = event.data.n;
			_self.text = event.data.text;
			 if (backObj.callBack) {//回写之后的方法
			        var callBack = backObj.callBack;
			        callBack.call(callBack.parHandler,_self._onclickBackData("rh-card-json-but-img-div"));
			    }
		});
		aObj.append("<span class='rh-icon-inner'> " +dicObjs[i]["ITEM_NAME"] +" </span><span class='rh-icon-img btn-" + dicObjs[i]["ITEM_CODE"] + "'></span>");
		htmlVal.append(aObj);
	}
	_self._createDialog(htmlVal, backObj);
};


/*
 * 初始化dialog
 */
rh.vi.butImg.prototype._createDialog = function(htmlVal,backObj){
		var _self = this;
		jQuery("#rh-card-json-but-img-div").remove();
		var dialogId = "rh-card-json-but-img-div"; // 设置Dialog的id
		var winDialog = jQuery("<div style='padding: 5px 5px 5px 5px;'></div>").attr("id", dialogId).attr("title","按钮选择");
		winDialog.appendTo(jQuery("body"));
		var bodyWid = jQuery("body").width();
		var hei = GLOBAL.getDefaultFrameHei() - 200;
		var wid = bodyWid / 2;
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
rh.vi.butImg.prototype._onclickicon = function(obj,n,text){
	var _self = this;
	jQuery("a[name='rh-icon-a']").css({"color":"","font-weight":""});
	obj.css({"color":"blue","font-weight":"bold"});
	_self.select = n;
	_self.text = text;
};

/**
 * 点击回调函数
 */
rh.vi.butImg.prototype._onclickBackData = function(dialogId){
	var _self = this;
	jQuery("#" + dialogId).remove();
	return {"select":_self.select,"text":_self.text};
};