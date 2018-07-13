/** 列表页面渲染引擎 */
GLOBAL.namespace("mb.vi");
/*待解决问题：
 * 
 * */
mb.vi.listView = function(options) {
	var defaults = {
		"id":options.sId + "-mbListView",
		"sId":"",//服务ID
		"aId":"", //操作ID
		"pCon":null,
		"pId":null,
		"linkWhere":"",
		"extWhere":"",
		"source":null,
		"type":null,
		"pkHide":false,
		"paramsFlag":false,
		"showSearchFlag":"true",
		"servDef":null, //服务定义数据
		"parHandler":null,//主卡片的句柄,
		"resetHeiWid": "",//覆盖函数
		"_SELECT_":null,//显示的字段
		"selectView":false,//查询选择标识
		"readOnly":false//页面只读标识
	};
	this.opts = jQuery.extend(defaults,options);
	this.servId = this.opts.sId;
    this._pCon = this.opts.pCon;
	this._data = null;	
	this._searchWhere = "";//查询条件
	this._originalWhere = "";//服务定义条件
	this._extendWhere = this.opts.extWhere;//扩展条件
	this._readOnly = this.opts.readOnly;
	this._cardRead = true;
	this._linkWhere = this.opts.linkWhere;//关联功能过滤条件
	this._params = this.opts.params || "";
	this._source = this.opts.source || "";//应用容器标识
	this._platform = this.opts.platform || "";//设备系统平台
	this._topBarFlag = this.opts.topBarFlag || "true";

	this._extWhere = (this.opts.extWhere && this.opts.extWhere != "undefined") ?  this.opts.extWhere : "";     
	this._transferData = {};
	this._height = "";
	this._width = "";


	this.LINK_WHERE = UIConst.LINK_WHERE;  
	this.SEARCH_WHERE = UIConst.SEARCH_WHERE;
	this.TREE_WHERE = UIConst.TREE_WHERE;   
	this.EXT_WHERE = UIConst.EXT_WHERE; 
	this.whereData = {};
	this.PAGE = {};   
};
/*
 * 渲染列表主方法
 */
mb.vi.listView.prototype.show = function() {
	this._initMainData();
	this._layout();
	this._bldGrid();
	//this._bldHeader();
	//this._bldSearch();
	this._afterLoad();
};
mb.vi.listView.prototype._initMainData = function() {
	if(this.opts.servDef){
		this._data = this.opts.servDef;
		FireFly.setCache(this.servId,FireFly.servMainData,this._data);
	}else{
		this._data = FireFly.getCache(this.servId,FireFly.servMainData);
	}
	this.servName = this._data.SERV_NAME;//服务名称
};
/*
 * 刷新
 */
mb.vi.listView.prototype.refresh = function() {
	var _self = this;
	this.gridContainer.empty();
	this._bldGrid();
	setTimeout(function() {
		//_self._refresh.html(UIConst.FONT_STROKE_REFRESH);
		_self.right.removeClass("mbTopBar-backActive");
	},500);
};
/*
 * 构建列表页面布局
 */
mb.vi.listView.prototype._layout = function() {
	var _self = this;
	if (this._topBarFlag === "true") {
		//默认布局
		this.top = jQuery("<div></div>").addClass("mbTopBar").appendTo(this._pCon);
		
		var table = jQuery("<table class='mbTopBar-table'></table>").appendTo(this.top);
	    var tr = jQuery("<tr></tr>").appendTo(table);
		var left = jQuery("<td class='mbTopBar-left'></td>").appendTo(tr);
		var center = jQuery("<td class='mbTopBar-center'></td>").appendTo(tr);
		this.right = jQuery("<td class='mbTopBar-right'></td>").appendTo(tr);
		
		this.back = jQuery("<div>返回</div>").addClass("mbTopBar-back").appendTo(left); 
	   // this.back.html(UIConst.FONT_STROKE_BACK);
	    left.bind("click",function() {
	    	left.addClass("mbTopBar-backActive");
	    	//_self.back.html(UIConst.FONT_STROKE_LOAD);
	    	history.go(-1);
	    });
		if ((_self._source == "app") && (_self.platform == "Android")) {
			this.back.hide();
		} 
	    this._refresh = jQuery("<div>刷新</div>").addClass("mbTopBar-refresh").appendTo(this.right);	
	    //this._refresh.html(UIConst.FONT_STROKE_REFRESH);
	    this.right.bind("click",function() {
	    	_self.right.addClass("mbTopBar-backActive");
	    	//_self._refresh.html(UIConst.FONT_STROKE_LOAD);
	    	_self.refresh();
	    });	
	}

	var listContainer = jQuery("<div></div>").addClass("mbList-container");
	var top = jQuery("<div></div>").addClass("mbList-container-top").appendTo(listContainer);//头部
	this.con = jQuery("<div></div>").addClass("mbList-container-con").appendTo(listContainer);//主内容区
	this._bldBtnBar();
	this.gridContainer = jQuery("<div></div>").addClass("mbList-container-con-grid").appendTo(listContainer);//列表外容器

	listContainer.appendTo(this._pCon);
};

/*
 * 构建列表页面布局
 */
mb.vi.listView.prototype._bldGrid = function() {
	//默认布局
	var options = {};
	if (this._params.length > 0) {
		var temp = StrToJson(this._params);
		options = jQuery.extend(options,temp);
	}
	if (this._extendWhere.length > 0) {
		options[this.EXT_WHERE] = this._extendWhere;
	}
	this._listData =  FireFly.getPageData(this.servId,options) || {};	

	var temp = {"id":this.servId,"mainData":this._data,"parHandler":this,"pCon":this.gridContainer,"parHandler":this};
	temp["listData"] = this._listData;
	this.servName = this._data.SERV_NAME;
	this.grid = new mb.ui.grid(temp);
	this.grid.render();
	this.grid.click(this._openLayer, this);
//	this.grid.getBlocks().longPress(500,function(event){
//		var obj = jQuery(event.target).parent();
//		obj.find(".mb-right-nav").hide();
//		obj.data("inFlag",false);
//		var delBtn = jQuery("<div>删除</div>").addClass("mb-btn-span mbTopBar-blueBtn").appendTo(obj);
//		event.stopPropagation();
//		return false;
//	}); 
};
mb.vi.listView.prototype._openLayer = function(pkCode,node) {
	var readOnly = false;//this.readOnly;
	this.url = FireFly.getContextPath() + "/sy/base/view/stdCardView-mb.jsp?sId=" +　this.servId + "&readOnly=" + readOnly + "&pkCode=" + pkCode;		
	this._guideTo(this.url);
};
/*
 * 构建列表页面布局
 */
mb.vi.listView.prototype.morePend = function(options) {
	var _self = this;
	//_self._refresh.html(UIConst.FONT_STROKE_LOAD);
	if (options && options._PAGE_) {
		_self.PAGE["_PAGE_"] = options._PAGE_;
	}
	var data = {};
	data = jQuery.extend({},_self.PAGE,data);//合并分页信息
	if (options && options._NOPAGEFLAG_ && (options._NOPAGEFLAG_ == "true")) {//删除分页信息
		delete data._PAGE_;
		delete data._NOPAGEFLAG_;
	}
	this._listData = FireFly.getPageData(this.servId,data);
	this.grid._morePend(this._listData);
	this.grid.click(this._openLayer, this);
	this._afterLoad();
	setTimeout(function() {
		//_self._refresh.html(UIConst.FONT_STROKE_REFRESH);
	},500);
};
/*
 * 构建按钮条
 */
mb.vi.listView.prototype._bldBtnBar = function() {
	var _self = this;

    this.countBtn = 3;
    this.btns = {};
    var btnBar = jQuery("<div></div>").addClass("mbBotBar mbList-nav");
    var oneVar = UIConst.STR_YES;
    
    this._linkServ = this._data.LINKS || {};//关联功能信息
    var tempData = this._data.BTNS;
	//判断tab是否显示
	var listTabFlag = false;
	var len = 1;
	jQuery.each(this._linkServ,function(i,n) {
		if (n.LINK_SHOW_POSITION == 4) { //列表TAB关联
			listTabFlag = true;
			len++;
		}
	});
	if (listTabFlag) {//显示TAB
		//增加body样式
		jQuery("body").addClass("mbTabList");
		//组织关联功能
		var temp = {};
		temp[this.servId] = {"LINK_SERV_ID":this.servId,"LINK_NAME":this.servName,"LINK_SHOW_POSITION":4,"LINK_WHERE":""};
		var allTabs = jQuery.extend(temp,this._linkServ);
	    //计算宽度
		var css = "100%";
		if (len > 1) {
			css = Math.floor((1/len)*10000)/100 + "%";
		}
		jQuery.each(allTabs,function(i,n) {
			if (n.LINK_SHOW_POSITION == 4) { //列表关联
				    var nodeCon = jQuery("<div style='width:" + css + ";'></div>").addClass("mbBotBar-con");
				    if (i == _self.servId) {
				    	nodeCon.addClass("mbBotBar-con--active");
				    }
		        	var node = jQuery("<div></div>").addClass("mbBotBar-node").appendTo(nodeCon);
		        	node.attr("id",GLOBAL.getUnId(n.LINK_SERV_ID,_self.servId));
		        	var iconCss = "";
		        	if (iconCss.length == 0) {
		        		iconCss = "default";
		        	}
	        		var iconStr = "mb-btn-" + n.LINK_SERV_ID;
	        		var icon = jQuery("<div></div>").addClass("mbBotBar-node-icon " + iconStr).appendTo(node);
	        		var tex = jQuery("<div></div>").addClass("mbBotBar-node-text").appendTo(node);
	        		tex.text(n.LINK_NAME);
	        		nodeCon.bind("click",function() {
	        			jQuery(".mbBotBar-con--active").removeClass("mbBotBar-con--active");
	        			jQuery(this).addClass("mbBotBar-con--active");
	  	   			    var sId = n.LINK_SERV_ID;
	  	   			    jQuery(".mbList-container").hide();
		  	   		    var temp = {"sId":sId,"source":_self._source,"platform":_self._platform,"topBarFlag":"false","pCon":jQuery("body")};
			  		    var listView = new mb.vi.listView(temp);
			  		    listView.show();
					    event.stopPropagation();
					    return false;
	        		});
	                nodeCon.appendTo(btnBar);
			}
		});
		btnBar.appendTo(jQuery("body"));
	}
};

/*
 * 构建列表页面布局
 */
mb.vi.listView.prototype._afterLoad = function() {
	if (jQuery(".mbTopBar-title").length == 0) {
		jQuery("<div></div>").text(this.servName).addClass("mbTopBar-title").appendTo(this.top.find(".mbTopBar-center"));
	}
    //执行功能级js
    this._excuteProjectJS();
};
mb.vi.listView.prototype._getUnId = function(id) {
    var sId = this.servId;
    return sId + "-listbtn-" + id;
};
/*
 * 列表加载后执行工程级js方法
 */
mb.vi.listView.prototype._excuteProjectJS = function() {
	var _self = this;	
    this._servPId = this._data.SERV_PID || "";//父服务ID
    var loadArray = this._data.SERV_LIST_LOAD_NAMES.split(",");
    for (var i = 0;i < loadArray.length;i++) {
    	if (loadArray[i] == "") {
    		return;
    	}
    	load(loadArray[i]);
    }
	function load(value) {
		var pathFolder = value.split("_");
		var lowerFolder = pathFolder[0].toLowerCase();
	    var jsFileUrl = FireFly.getContextPath() + "/" + lowerFolder + "/servjs/" + value + "_list_mb.js";
	    jQuery.ajax({
	        url: jsFileUrl,
	        type: "GET",
	        dataType: "text",
	        async: false,
	        data: {},
	        success: function(data){
	            try {
	                var servExt = new Function(data);
	                servExt.apply(_self);
	            } catch(e){}
	        },
	        error: function(){;}
	    });			
	};
};
/*
 * 不同的应用跳转方式的处理
 */
mb.vi.listView.prototype._guideTo = function(url) {
	if ((this._source == "app")) {
//		url = FireFly.getHostURL() + FireFly.getContextPath() + url;
		url += "&source=app";
		window.location.href = url;
//		window.plugins.childBrowser.showWebPage(url, { showLocationBar: false });
//		window.plugins.childBrowser.onClose= function() {
//		};
	} else {
		window.location.href = url;
	}
};