/** 列表选择页面渲染引擎 */
GLOBAL.namespace("mb.vi");
/*待解决问题：
 * 
 * */
mb.vi.selectList = function(options) {
	var defaults = {
		"id":options.dictId + "-mbListView",
		"dictId":"",//服务ID
		"pCon":null,
		"linkWhere":"",
		"extWhere":"",
		"showSearchFlag":"true",
		"replaceData":null,
		"replaceCallBack":null,
		"parHandler":null//主卡片的句柄,
	};
	this.opts = jQuery.extend(defaults,options);
    this._pCon = this.opts.pCon;
	this._parHandler = this.opts.parHandler;
	this._replaceData = this.opts.replaceData;
	this._replaceCallBack = this.opts.replaceCallBack;
    this.id = this.opts.id;
    this.title = "字典选择";
	if (this.opts.dictId) {
		this.dictId = this.opts.dictId;
	} else {
	    this.config = this.opts.config;
	    var confArray = this.config.split(",");
	    this.dictId = confArray[0];
		var conf = confArray.slice(1);
		this._confJson = StrToJson(conf.join(","));
	    this.type = this._confJson && (this._confJson.TYPE) ? this._confJson.TYPE:"";
	}
	this._searchWhere = "";//查询条件
	this._extendWhere = "";//扩展条件

	this._extWhere = (this.opts.extWhere && this.opts.extWhere != "undefined") ?  this.opts.extWhere : "";     
	this._height = "";
	this._width = "";
	this._data = null;	
};
/*
 * 渲染列表主方法
 */
mb.vi.selectList.prototype.show = function(event) {
	this._initMainData();
	this._layout();
	this._bldList();
	this._afterLoad();
};
/*
 * 构建表格，包括标题头和数据表格
 */
mb.vi.selectList.prototype._bldWin = function(event) {
	var _self = this;
	jQuery("#" + this.id).empty();
	jQuery("#" + this.id).dialog("destroy");
	//1.构造dialog
	this.winDialog = jQuery("<div></div>").addClass("mbDialog").attr("id",this.id).attr("title",this.title);
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
	jQuery("#" + this.id).dialog({
		autoOpen: false,
		height: _self.hei,
		width: _self.wid,
		modal: true,
		resizable:false
	});
    jQuery("#" + this.id).dialog("open");
    this.winDialog.parent().css("z-index",9999);//设置为最上层
    jQuery(".ui-dialog-titlebar").last().css("display","block");//设置标题显示
    var obj = jQuery("#" + this.id);
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
mb.vi.selectList.prototype._initMainData = function() {
	var tempData = {};
	if (this._replaceData) {
	    this._name = "选择";
	    this._data = this._replaceData;
	} else {
		tempData = FireFly.getDict(this.dictId);//设置树的初始化数据
	    this._name = tempData[0].NAME;
	    this._data = tempData[0].CHILD;
	}
};
/*
 * 刷新
 */
mb.vi.selectList.prototype.refresh = function() {
	var _self = this;
};
/*
 * 构建列表页面布局
 */
mb.vi.selectList.prototype._layout = function() {
	var _self = this;

	var listContainer = jQuery("<div></div>").addClass("mbSelectList-container");
	var top = jQuery("<div></div>").addClass("mbSelectList-container-top").appendTo(listContainer);//头部
	this.con = jQuery("<div></div>").addClass("mbSelectList-container-con").appendTo(listContainer);//主内容区
	if(this.type == UIConst.TYPE_MULTI){
		var bottom = jQuery("<div></div>").addClass("mbSelectList-container-bottom").insertAfter(jQuery(".mbDialog"));//底部
		var okBtn = jQuery("<button>确定</button>").addClass("mb-select-ok");
	 	jQuery(okBtn).appendTo(bottom);	
		jQuery(okBtn).bind("click",function(){		
			if (_self._replaceCallBack) { //有替换的回调函数
				var codeArr = [];
				var valueArr = [];
		 		var checkboxes = jQuery(".mbDialog-node-checkedbox");
		 		if(checkboxes.length == 0){
					_self.showTipWarn("请选择数据");
					return false;
				}
		 		jQuery(checkboxes).each(function(i){
		 			codeArr.push(jQuery(this).attr("code"));
		 			valueArr.push(jQuery(this).attr("value"));
		 		});
		        var backFunc = _self._replaceCallBack;
		        backFunc.call(_self.opts.parHandler,codeArr,valueArr);
			} else {
				var codes = "";
				var values = "";
		 		var checkboxes = jQuery(".mbDialog-node-checkedbox");
		 		if(checkboxes.length == 0){
					_self.showTipWarn("请选择数据");
					return false;
				}
		 		jQuery(checkboxes).each(function(i){
		 			codes += jQuery(this).attr("code")+",";
		 			values += jQuery(this).attr("value")+",";
		 		});
		 		codes = Format.substr(0,codes.length-1,codes);
		 		values = Format.substr(0,values.length-1,values);
		 		_self._parHandler.setValue(codes, values);
			}
	 		_self._close();
	 	});
	}
	var clearBtn = jQuery("<button>清空</button>").addClass("mb-select-clear");
 	jQuery(clearBtn).appendTo(bottom);
 	jQuery(clearBtn).bind("click",function(){
 		var checkboxes = jQuery(".mbDialog-node-checkedbox");
 		jQuery(checkboxes).each(function(i){
 			 jQuery(this).removeClass("mbDialog-node-checkedbox");
 		});
 		//_self._close();
 	});
	
	listContainer.appendTo(this.winDialog);
};

mb.vi.selectList.prototype._bldList = function() {
	var _self = this;
    this.ul = jQuery("<ul></ul>").addClass("mbDialog-ul");
	//替换标题
    var obj = jQuery("#" + this.id);
    obj.parent().find(".ui-dialog-title").text(this._name);
    for(var i=0;i<this._data.length;i++){
	    var root = this._data[i];
	    //this.title = root.NAME;	    
	    var li = this._bldListLi(root);
	    li.appendTo(this.ul);
    }
    this.ul.appendTo(this.con);
    var hei = this.ul.height() + 150;
    jQuery("#" + this.id).height(hei);

};
mb.vi.selectList.prototype._bldListLi = function(data) {
	var _self = this;
	var id = data.ID;
	var name = data.NAME;
	var child = data.CHILD;
	var pId = data.PID;
	var marginLeft = "mbDialog-marginLeft-1";
	var text = jQuery("<span class='mbDialog-node-text'>" + name + "</span>");
	var checkcon = jQuery("<div class='mbDialog-node-checkcon'></div>");
	if(this.type == UIConst.TYPE_MULTI){
		var checkbox = jQuery("<div class='mbDialog-node-checkbox'></div>");
		checkbox.appendTo(checkcon);
	}
	text.appendTo(checkcon);
	if (child) {
		var folder = jQuery("<span class='mbDialog-node-folder mb-icon-folder'></span>");
		var li = jQuery("<li></li>").addClass("mbDialog-li mbDialog-node " + marginLeft);
		var div = jQuery("<div></div>").attr("id",id);
		folder.appendTo(div);
		checkcon.appendTo(div);
		li.html(div);
		if(child.length > 0){
			folder.removeClass("mb-icon-folder").addClass("mb-icon-folder-close");
			var ullevel = jQuery("<ul></ul>").addClass("mbDialog-ul");
			ullevel.appendTo(li);
			for(var i=0;i<child.length;i++){
				var lilevel = _self._bldListLi(child[i]);
				lilevel.appendTo(ullevel);
			}
		}
		checkcon.bind("click",function(){
			_self._setcheckbox(this,id,name);
		});
		folder.bind("click",function() {
			var pardiv = jQuery(this).parent("div"); //得到当前的父句柄
			var count = pardiv.next().length;
			if(count == 0){
				var id = pardiv.attr("id");
				pardiv.next().empty();
				var ul = jQuery("<ul></ul>").addClass("mbDialog-ul");
				ul.appendTo(pardiv.parent("li"));
				var tempData = FireFly.getDict(_self.dictId,id,'',1)[0].CHILD;
				for(var i=0;i<tempData.length;i++){
					var lilevel = _self._bldListLi(tempData[i]);
					lilevel.appendTo(ul);
				}
				ul.show();
				folder.removeClass("mb-icon-folder").addClass("mb-icon-folder-close");
			}else {
				var u = pardiv.next("ul");
				if(u.css("display") == 'none'){
					u.show();
					folder.removeClass("mb-icon-folder").addClass("mb-icon-folder-close");
				}else{
					u.hide();
					folder.removeClass("mb-icon-folder-close").addClass("mb-icon-folder");
				}
			}
			var hei = _self.ul.height() + 150;
		    jQuery("#" + _self.id).height(hei);
		    
		});
		return li;
	} else {
		var leaf = jQuery("<span class='mbDialog-node-folder mb-icon-leaf'></span>") ;
		var li = jQuery("<li></li>").addClass("mbDialog-li mbDialog-leaf " + marginLeft);
		leaf.appendTo(li);
		checkcon.appendTo(li);
		checkcon.bind("click",function(event){
			_self._setcheckbox(this,id,name);
		});
		li.bind("click",function(event) {
			if (_self.type != UIConst.TYPE_MULTI) { //不是多选
				if (_self._replaceCallBack) { //有替换的回调函数
					var ids = [];
				    ids.push(id);
				    var names = [];
				    names.push(name);
			        var backFunc = _self._replaceCallBack;
			        backFunc.call(_self.opts.parHandler,ids,names);
				} else {
					_self._parHandler.setValue(id,name);
				}	  
				_self._close();
		    } else {
		    	var et = event.target || event.srcElement;
		    	if (jQuery(et).hasClass("mbDialog-node-checkcon") || jQuery(et).hasClass("mbDialog-node-checkbox") || jQuery(et).hasClass("mbDialog-node-text")) {
		    		return;
		    	}
		    	_self._setcheckbox(checkcon,id,name);
		    }			
		});
		return li;
	}
};
mb.vi.selectList.prototype._setcheckbox = function(checkcon,id,name){
	_self = this;
	var check = jQuery(checkcon).find(".mbDialog-node-checkbox");
	if(this.type != UIConst.TYPE_MULTI){
		if(!id || id.length == 0){
			_self.showTipWarn("请选择数据");
			return false;
		}
		if(_self._replaceCallBack){
			var ids = [];
		    ids.push(id);
		    var names = [];
		    names.push(name);
	        var backFunc = _self._replaceCallBack;
	        backFunc.call(_self.opts.parHandler,ids,names);
		} else {
			_self._parHandler.setValue(id,name);	    	
		}
		_self._close();
	}else{
		if(!check.hasClass("mbDialog-node-checkedbox")){
			check.addClass("mbDialog-node-checkedbox");
			check.attr("code",id);
			check.attr("value",name);
		}else{
			check.removeClass("mbDialog-node-checkedbox");
		}
	}
};
mb.vi.selectList.prototype._openLayer = function(pkCode) {

};
/*
 * 构建列表页面布局
 */
mb.vi.selectList.prototype.morePend = function(options) {
	var _self = this;

};
/*
 * 构建按钮条
 */
mb.vi.selectList.prototype._bldBtnBar = function() {
	var _self = this;

};

/*
 * 构建列表页面布局
 */
mb.vi.selectList.prototype._afterLoad = function() {


};
mb.vi.selectList.prototype._getUnId = function(id) {
    var dictId = this._dictId;
    return dictId + "-dictList-" + id;
};
/*
 * 加载后执行
 */
mb.vi.selectList.prototype._close = function() {
	var _self = this;
	if (this._parHandler) {
		//this._parHandler.setActive();
	}
	jQuery("#" + _self.id).empty();
	jQuery("#" + _self.id).dialog("destroy");
	_self.winDialog.remove();
};

mb.vi.selectList.prototype.showTip = function(msg) {
	 var _self = this;
    var tip = jQuery("<div style='z-index:10000'></div>").text(msg).addClass("mbTopBar-tip mb-radius-9").appendTo(jQuery("body"));
    setTimeout(function() {
   	 tip.remove();
    },1000);
};
mb.vi.selectList.prototype.showTipWarn = function(msg) {
	var _self = this;
   var tip = jQuery("<div style='z-index:10000'></div>").text(msg).addClass("mbTopBar-tip-warn mb-radius-9").appendTo(jQuery("body"));
   setTimeout(function() {
  	    tip.remove();
   },1000);
};
mb.vi.selectList.prototype.showTipError = function(msg) {
	var _self = this;
   var tip = jQuery("<div style='z-index:10000'></div>").text(msg).addClass("mbTopBar-tip-error mb-radius-9").appendTo(jQuery("body"));
   setTimeout(function() {
  	    tip.remove();
   },1000);
};