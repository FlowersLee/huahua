/** 弹出框组件 */
GLOBAL.namespace("mb.ui");
mb.ui.dialog = function(options) {
	var defaults = {
        "id":options.id + "-mbDialog",
        "data":null,
        "title":"",
        "parHandler":null

	};	
	this._opts = jQuery.extend(defaults,options);
	this.dialogId = this._opts.id;
	this._parHandler = this._opts.parHandler;
    this._data = this._opts.data;
    this._parHandler = this._opts.parHandler;
    this.title = this._opts.title;
    
	this._TYPE_SIN = UIConst.TYPE_SINGLE; 	
	this._TYPE_MUL = UIConst.TYPE_MULTI; 
	
	this.one = UIConst.STR_YES;
	this.two = UIConst.STR_NO;
};
/*
 * 表格渲染方法，入口
 */
mb.ui.dialog.prototype.render = function(event) {
	var _self = this;
	this._bldWin();
	this._bldCon(event);
	this._afterLoad();
};
/*
 * 构建表格，包括标题头和数据表格
 */
mb.ui.dialog.prototype._bldWin = function(event) {
	var _self = this;
	jQuery("#" + this.dialogId).empty();
	jQuery("#" + this.dialogId).dialog("destroy");
	//1.构造dialog
	this.winDialog = jQuery("<div></div>").addClass("mbDialog").attr("id",this.dialogId).attr("title",this.title);
	this.winDialog.appendTo(jQuery("body"));
	//@TODO:显示位置处理
	this.hei = 500;
    this.wid = "80%";
    var posArray = [];
    if (event) {
	    var cy = event.clientY;
	    posArray[0] = "";
	    posArray[1] = cy-100;
    }

	jQuery("#" + this.dialogId).dialog({
		autoOpen: false,
		height: _self.hei,
		width: _self.wid,
		modal: true,
		resizable:false,
		position:posArray
	});
    jQuery("#" + this.dialogId).dialog("open");
    jQuery(".ui-dialog-titlebar").last().css("display","block");//设置标题显示
    var obj = jQuery("#" + this.dialogId);
    obj.parent().find(".ui-dialog-titlebar-close").hide();
    var mbClose = jQuery("<a></a>").addClass("mbClose mb-radius-1em");
    var inner = jQuery("<span></span>").addClass("mbClose-inner").appendTo(mbClose);
    var text = jQuery("<span>关闭</span>").addClass("mbClose-text").appendTo(inner);
    var icon = jQuery("<span>&nbsp;</span>").addClass("mbClose-icon mb-icon-close mb-radius-18").appendTo(inner);
    mbClose.bind("click",function() {
    	_self._close();
    });
    mbClose.appendTo(obj.parent().find(".ui-dialog-titlebar"));
};
/*
 * 构建表格体
 */
mb.ui.dialog.prototype._bldCon = function() {
	var _self = this;
	var obj = jQuery("#" + this.dialogId);
    var ul = jQuery("<ul></ul>").addClass("mbDialog-ul");
    jQuery.each(this._data,function(i,n) {
    	var id = n.ID;
    	var name = n.NAME;
    	var li = jQuery("<li></li>").addClass("mbDialog-li");
    	li.text(name);
    	li.bind("click",function() {
    		_self._parHandler.setValue(id,name);
    		_self._close();
    	});
    	li.appendTo(ul);
     });
    ul.appendTo(obj);
    var hei = ul.height() + 150;
    jQuery("#" + this.dialogId).height(hei);

};
/*
 * 构建表格体区块
 */
mb.ui.dialog.prototype._bldBlock = function(nextPageNum,index,trData) {
	var _self = this;

};
/*
 * 构建翻页
 */
mb.ui.dialog.prototype.getBlocks = function() {
	var _self = this;
	return this._table.find(".mdGrid-td");
};
/*
 * 构建翻页
 */
mb.ui.dialog.prototype.click = function(func,parSelf) {
	var _self = this;
    this.getBlocks().unbind("click").bind("click",function(event) {
		var node = jQuery(this);
    	if ((node.attr("class") != "rowIndex") && (node.attr("class") != "checkTD")) {
    		var pkCode = node.attr("pk");
			func.call(parSelf,pkCode);
		    return false; 
    	}
	});
};
/*
 * 构建翻页
 */
mb.ui.dialog.prototype._bldPage = function() {
	var _self = this;
	
};
/*
 * 加载后执行
 */
mb.ui.dialog.prototype._afterLoad = function() {
	var _self = this;
	
};
/*
 * 加载后执行
 */
mb.ui.dialog.prototype._close = function() {
	var _self = this;
	if (this._parHandler) {
		this._parHandler.setActive();
	}
	jQuery("#" + _self.dialogId).empty();
	jQuery("#" + _self.dialogId).dialog("destroy");
	_self.winDialog.remove();
};

















