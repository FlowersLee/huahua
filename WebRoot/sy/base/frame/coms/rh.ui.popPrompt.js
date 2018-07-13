/** 自定义的弹出框组件 */
GLOBAL.namespace("rh.ui");
rh.ui.popPrompt = function(options) {
	var defaults = {
		"id":"",
		"pCon":null,
		"pHandler":null,
		"title":"请输入",
		"tip":"请输入"
	};
	this._opts = jQuery.extend(defaults,options);	
	this._pHandler = this._opts.pHandler;
	this.okFunc = this._opts.okFunc?this._opts.okFunc:function(){};
	this.closeFunc = this._opts.closeFunc?this._opts.closeFunc:function(){};
	this.tip = this._opts.tip;
	this.dialogId = GLOBAL.getUnId("promptDialog",this._opts.id);
};
/*
 * 渲染主方法
 */
rh.ui.popPrompt.prototype.render = function(event,replacePosArray,widHeiArray) {
   this._layout(event,replacePosArray,widHeiArray);
   this.display();
};
rh.ui.popPrompt.prototype._layout = function(event,replacePosArray,widHeiArray) {
	var _self = this;
	jQuery("#" + this.dialogId).empty();
	jQuery("#" + this.dialogId).dialog("destroy");
	//1.构造dialog
	this.winDialog = jQuery("<div></div>").addClass("dictDialog").attr("id",this.dialogId).attr("title",_self._opts.title);
	this.winDialog.appendTo(jQuery("body"));
	//@TODO:显示位置处理
	var hei = 180;
    var wid = 280;
    var posArray = [];
    if (event) {
	    var cy = event.clientY;
	    posArray[0] = "";
	    posArray[1] = cy-100;
    }
    if (replacePosArray) {
    	posArray = replacePosArray;
    }
    if (widHeiArray) {
    	wid = widHeiArray[0];
    	hei = widHeiArray[1];
    }

	jQuery("#" + this.dialogId).dialog({
		autoOpen: false,
		height: hei,
		width: wid,
		modal: true,
		position:posArray,
		buttons: {
				"确认": function() {
					_self.okFunc();
				},
				"关闭": function() {
					_self.closeFunc();
					jQuery("#" + _self.dialogId).dialog("close");
				}
		},
		open: function() { 

		},
		close: function() {
			_self.closeFunc();
			jQuery("#" + _self.dialogId).empty();
			jQuery("#" + _self.dialogId).dialog("destroy");
			_self.winDialog.remove();
		}
	});
	var dialogObj = jQuery("#" + this.dialogId);
	dialogObj.dialog("open");
	var btns = jQuery(".ui-dialog-buttonpane button",dialogObj.parent()).attr("onfocus","this.blur()");
	btns.first().addClass("rh-small-dialog-ok");
	btns.last().addClass("rh-small-dialog-close");
	dialogObj.parent().addClass("rh-small-dialog").addClass("rh-bottom-right-radius");
    jQuery(".ui-dialog-titlebar").last().css("display","block");//设置标题显示
};
rh.ui.popPrompt.prototype.display = function (html) {
	var _self = this;
	jQuery("#" + _self.dialogId).empty();	
    if (html) {
    	_self.obj = jQuery("<div></div>").append(html);
    	jQuery("#" + _self.dialogId).append(_self.obj);	
    } else {
    	_self.obj = jQuery("<input></input>").css({"height":"20px","width":"230px","margin":"20px 15px 8px 15px"});
    	jQuery("#" + _self.dialogId).append(_self.obj);	
    	this.tipBar = jQuery("<div></div>").text(this.tip).css({"height":"40px","width":"230px","font-weight":"normal","margin":"0px 15px 0px 15px","color":"red"});
        jQuery("#" + _self.dialogId).append(this.tipBar);	
    }


};
rh.ui.popPrompt.prototype.closePrompt = function () {
	var _self = this;
	jQuery("#" + _self.dialogId).dialog("close");
};


















