/** 列表页面渲染引擎 */
GLOBAL.namespace("rh.vi");
/*待解决问题：
 * 
 * */
rh.vi.listView = function(options) {
	var defaults = {
		"id":options.sId + "-viListView",
		"sId":"",//服务ID
		"aId":"", //操作IDf
		"pCon":null,
		"cardCon":null, //卡片对应容器
		"pId":null,
		"linkWhere":"",
		"extWhere":"",
		"type":null,//列表单选多选
		"pkHide":false,
		"paramsFlag":false,
		"showSearchFlag":"true", //普通查询显示
		"showTitleBarFlag":"true", //标题条显示
		"showPageFlag":"true", //分页条显示
		//@author chenwenming  是否显示按钮，默认为显示
		"showButtonFlag":"true",
		//@author guoyanhong 是否可以双击进入页面 设置为true时还需要进行权限判断
		"byIdFlag":true,
		//@author chenwenming  是否显示导航树，默认为显示
		"showNavTreeFlag":"true",
		//@author chenwenming  是否支持点击列表标题排序，默认为支持
		"sortGridFlag":"true",
		"reset":true, //重置外层高度
		"cardReset":true,//是否双击打开时，卡片内部也计算高度
		"cardBackBtn":true,//是否双击打开时，卡片显示返回按钮
		"parHandler":null,//主卡片的句柄,
		"batchFlag":true,
		"dataFlag":true,//第一次进入显示列表内容
		"resetHeiWid": "",//覆盖函数
		"_SELECT_":null,//显示的字段
		"_HIDE_":null,//隐藏的字段
		"selectView":false,//查询选择标识
		"readOnly":false,//页面只读标识
		"replaceQueryModel":null,//1:默认为简洁模式；2:平铺模式 3 窗口模式
		"parWhere":"",
		"parVar":"",//
		"params":null,
		"replaceNavItems":null, //替换左侧树导航定义字段
		"title":"",//列表标题
		"servDef":null, //服务定义数据
		"hideAdvancedSearch":false //是否隐藏高级查询
	};
	this.opts = jQuery.extend(defaults,options);
	this.servId = this.opts.sId;
	this._actVar = this.opts.act;
	this.pCon = this.opts.pCon;//外层容器
	this.listHeader = jQuery();
	this.contentMain = jQuery();
	this.contentSlider = jQuery();
	this._data = null;	
	this._treeWhere = "";//树形条件   _treeWhere
	this._searchWhere = "";//查询条件
	this._originalWhere = "";//服务定义条件
	this._extendWhere = "";//扩展条件
	this._readOnly = this.opts.readOnly;
	this._replaceNavItems = this.opts.replaceNavItems;
	this._cardRead = true;
	this._byIdFlag = this.opts.byIdFlag; //是否可以进入卡片查看
	this._linkWhere = this.opts.linkWhere;//关联功能过滤条件
	this._dataFlag = this.opts.dataFlag;//是否第一次进入显示列表内容
	this.selectViewFlag = this.opts.selectView;//查询选择的标识
	this.links = this.opts.links || {};//关联功能过滤条件
    this._transferParams = this.opts.transParams || {};//系统处理的转换的jsp链接过来的参数对象
	this.params = this.opts.params || {};
	if ((this.opts.paramsFlag === "true") || (this.opts.paramsFlag === true)) {
		this.params = parent.System.getTempParams(this.servId);//和paramsFlag配合使用，构造时传入的参数对象，仅用于传递参数
		if (opener) { //如果是弹出新页面的参数取值处理
			this.params = opener.System.getTempParams(this.servId);
		}
		if (this.params && this.params.links) {//外层传递的links参数对象
			this.links = this.params.links;
		}
	}
    if (!jQuery.isEmptyObject(this._transferParams)) {//系统处理的链接参数,可被params对象值覆盖
    	this.params = jQuery.extend(this._transferParams,this.params);
    }
	this._extWhere = (this.opts.extWhere && this.opts.extWhere != "undefined") ?  this.opts.extWhere : "";     
	this._transferData = {};
	this._height = "";
	this._width = "";
	this._batchFlag = this.opts.batchFlag;//外层传递给当前view的标识
	this._transBatchFlag = false;//传递给grid的标识
	this._rowBtns = [];//列表行按钮对象
	this._parWhere = this.opts.parWhere || "";//父传过来的系统条件
	this._parVar = this.opts.parVar || "";//父传过来的系统变量
	this._title = this.opts.title;
	this.setParParams(this._parVar);

	this.LINK_WHERE = UIConst.LINK_WHERE;  
	this.SEARCH_WHERE = UIConst.SEARCH_WHERE;
	this.TREE_WHERE = UIConst.TREE_WHERE;   
	this.EXT_WHERE = UIConst.EXT_WHERE; 
	this.whereData = {};
	this.PAGE = {};   
	
	// 是否显示按钮
	this._showButtonFlag = this.opts.showButtonFlag;
	//是否显示导航树
	this._showNavTreeFlag = this.opts.showNavTreeFlag;
	//查询模式
	this._replaceQueryModel = this.opts.replaceQueryModel;
	
	// 保存之前
	this.beforeSave = function() {};
	// 保存之后
	this.afterSave = function() {};
	// 查询之前
	this.beforeSearch = function(where) {return where;};
};
/*
 * 渲染列表主方法
 */
rh.vi.listView.prototype.show = function() {
	this._beforeLoad();
	this._initMainData();
	this._layout();
	this._bldGrid();
	this._bldSearch();
	this._bldNavTree();
	this._resetHeiWid();
	this._afterLoad();
};
/*
 * 加载之前
 */
rh.vi.listView.prototype._beforeLoad = function() {
	//背景图片
	Tools.rhSetBodyBack();//设置背景
};
/*
 * 构建列表页面布局
 */
rh.vi.listView.prototype._layout = function() {
	var _self = this;
	//头构造
	this._bldHeader();
	//常用查询预定义
	this._normalQuery();
	//默认布局和Tab生成
    this._tabLayout();
    //默认列表的构造
	this.treeFlag = false;
	var navItems = this._data.SERV_NAV_ITEMS;
	if (navItems && navItems.length > 0) {
		this.treeFlag = true;
	}
	var mainP = "wp";
	var navTreeP = "wp0 content-navTreeHide";
	_self.content = jQuery("<div></div>").addClass("content").attr("id",this.servId).addClass("rhList-tabs__con").addClass("rh-bottom-right-radius");//内容区域
	_self._flatSearch();//平铺查询模式构造
	_self._bldBtnBar().appendTo(_self.content);
	if (_self.treeFlag && _self._showNavTreeFlag == "true") {//左右树形和右侧列表宽度设定
		mainP = "wp75";
		navTreeP = "wp25";
		if (_self.selectViewFlag == true) {
			mainP = "wp70";
			navTreeP = "wp30";
		}
	}
	_self.contentMainCont = jQuery("<div></div>").addClass("content-mainCont").addClass("fr").addClass(mainP).appendTo(_self.content);//列表区域
	_self.contentMain = jQuery("<div></div>").addClass("content-main").appendTo(_self.contentMainCont);
	_self.navTreeContainer = jQuery("<div></div>").addClass("content-navTreeCont").addClass("fl").addClass(navTreeP).appendTo(_self.content);//树形区域
	_self.navTree = jQuery("<div></div>").addClass("content-navTree").appendTo(_self.navTreeContainer);/**.addClass("box-shadow-inset")*/
	_self.content.appendTo(_self.pCon);
	
	_self.sonTab[this.servId] = this;

	//this.contentFootr = jQuery("<div></div>").addClass("content-footer").appendTo(pCon);//底部区域，暂时无功能
};
/*
 * 构造头信息
 */
rh.vi.listView.prototype._bldHeader = function() {
	var _self = this;
	if (this.opts.showTitleBarFlag == "true") { //显示标题条
	    this.listHeader = jQuery("<div></div>").addClass("conHeader").appendTo(_self.pCon);//头部：名称信息条等
	} else {
		return true;
	}
	this.titleDiv = jQuery("<div></div>").addClass("conHeaderTitle").addClass("rh-right-radius-head");
	try{
	if (parent.GLOBAL.style.SS_STYLE_BLOCK) {//区块头
		this.titleDiv.addClass(parent.GLOBAL.style.SS_STYLE_BLOCK);
	}
	} catch (e) {}

	//展开-收起
	/*var closeImg = jQuery("<span>&nbsp;</span>").addClass("conHeanderTitle-expand").appendTo(this.titleDiv);
    closeImg.bind("click",function() {
    	if (jQuery(this).hasClass("conHeanderTitle-close")) {
    	  _self.content.show();	
    	  jQuery(this).removeClass("conHeanderTitle-close");
    	} else {
    	  _self.content.hide();	
    	  jQuery(this).addClass("conHeanderTitle-close");
    	}
    });*/
    //返回，模拟关闭当前tab
    this.backImg = jQuery("<span>返回</span>").addClass("conHeanderTitle-refresh").appendTo(this.titleDiv);
    this.backImg.on("mousedown",function() {
	    if (window.self == window.top) {//顶层页面自动关闭
		   var browserName=navigator.appName;  
		   if (browserName=="Netscape"){  
			   window.open('', '_self', '');  
		   } 
		   window.close();
		   return false;
	    }
   	    if (_self.servId) {
   	    	Tab.close();//关闭当前tab
   	    } 
    });
    if (window.self != window.top) {//顶层页面自动关闭
        //刷新
        var refreshImg = jQuery("<span>刷新</span>").addClass("conHeanderTitle-refresh").appendTo(this.titleDiv);
        refreshImg.on("mousedown",function() {
        	_self._clearSearchValue();
        	_self.whereData = {};
        	_self.refresh();
        	_self.listBarTip("刷新成功");
        });
    }
    this.titleDiv.appendTo(this.listHeader);
};
/*
 * 多Tab列表的支持
 */
rh.vi.listView.prototype._tabLayout = function() {
	var _self = this;
	if (this._title.length == 0) {//标题
		this._title = this._data.SERV_NAME;
	}
	_self.sonTab = {};//当前列表Tab的句柄存储对象
	//判断tab是否显示
	var listTabFlag = false;
	jQuery.each(this._linkServ,function(i,n) {
		if (n.LINK_SHOW_POSITION == 4) { //列表TAB关联
			listTabFlag = true;
			return false;
		}
	});
	if (listTabFlag) {//显示TAB
		this.mainUL = jQuery("<ul class='rhList-tabs'></ul>").appendTo(this.titleDiv);
		var temp = {};
		temp[this.servId] = {"LINK_SERV_ID":this.servId,"LINK_NAME":this.servName,"LINK_SHOW_POSITION":4,"LINK_WHERE":""};
		var allTabs = jQuery.extend(temp,this._linkServ);
	    jQuery.each(allTabs,function(i,n) {
			  if (n.LINK_SHOW_POSITION == 4) { //列表关联
				  //tab标题的构造
			   	  var tempA = jQuery("<a class='rhList-tabs__li__a'></a>").attr("href","#" + n.LINK_SERV_ID).append(n.LINK_NAME);
			   	  var tempLi = jQuery("<li style='' class='rhList-tabs__li'></li>").attr("sid",n.LINK_SERV_ID).append(tempA);
			   	  tempLi.appendTo(_self.mainUL);
			   	  if (i == _self.servId) {
				   	  tempLi.addClass("rhList-tabs__li--selected");
			   	  }
		   		  tempLi.on("click",function(event) {//tab事件绑定
		   			  var sId = n.LINK_SERV_ID;
		   	  	  	  var readFlag = false;
		   	  	      var linkItem = n.SY_SERV_LINK_ITEM || {};
			   	  	  jQuery.each(linkItem, function(i,m) {//生成子功能过滤条件
					   	  	if ((m.LINK_WHERE_FLAG == 2) && (m.LINK_VALUE_FLAG == 2)) {//非过滤条件 && 主单常量值
				   	  	  	    if (m.LINK_ITEM_CODE.toUpperCase() == "READONLY") {//只读参数设置
				   	  	  	        readFlag = m.ITEM_CODE;
				   	  	  	    }
					   	  	}
			   	  	  });
		   	  	  	  var linkWhereAll = Tools.systemVarReplace(n.LINK_WHERE);
		   			  //点击tab样式的修改
		   			  jQuery(".rhList-tabs__li--selected",_self.pCon).removeClass("rhList-tabs__li--selected");
		   			  jQuery(this).addClass("rhList-tabs__li--selected");
		   			  //点击tab时构造相应服务列表
		   			  if (_self.sonTab[sId]) { //已构造过列表
		   				  jQuery(".rhList-tabs__con",_self.pCon).hide();
		   				  jQuery(".rhList-tabs__con[id='" + sId + "']",_self.pCon).show();
		   				  jQuery(".rh-norQuery").hide();
		   				  _self.sonTab[sId].norQueryDiv.show();
		   				  _self.sonTab[sId]._resetHeiWid();    
		   			  } else { //第一次点击tab
		   				  _self.listBarTipLoad("加载中..");
		   				  setTimeout(function() {
		   					  jQuery(".rhList-tabs__con",_self.pCon).hide();
		   					  var temp = {"sId":sId,"pCon":_self.pCon,"showSearchFlag":"true","showTitleBarFlag":"false",
		   							  "parHandler":_self,"listSonTabFlag":true,"readOnly":readFlag,"linkWhere":linkWhereAll};
		   					  var listView = new rh.vi.listView(temp);
		   					  listView.show();
		   					  _self.sonTab[sId] = listView;
		   				  },10);
		   			  }
					  event.stopPropagation();
					  return false;
			   	  });
			  }
		});
	} else {//标题设置
		jQuery("<span></span>").addClass("conHeaderTitle-span rh-slide-flagYellow").text(this._title).appendTo(this.titleDiv);
	}
};
/*
 * 构造平铺查询区
 */
rh.vi.listView.prototype._flatSearch = function() {
	var _self = this;
	if ((this.opts.showSearchFlag == "false")) {
		return false;
	}
	if (this._queryModel == 2) {//平铺时构造
		var flatSearchCon = jQuery("<div class='content-search'></div>");
    	var treeLink = false;
    	var navItems = _self._data.SERV_NAV_ITEMS;
    	if (navItems.length > 0) {
    		treeLink = true;
    	}
    	_self.advSearch = new rh.ui.search({"id":_self.servId,"data":_self._data,"parHandler":_self,
    		"pCon":flatSearchCon,"treeLink":treeLink,"col":3});
    	_self.advSearch.show();
		flatSearchCon.appendTo(this.content);
		if (_self.advSearch.defaultSetFlag == true) {
			var where = _self.advSearch.getWhere();
			_self.whereData[_self.SEARCH_WHERE] = where;
		}
	}
};
/*
 * 构造常用查询
 */
rh.vi.listView.prototype._normalQuery = function() {
	var _self = this;
	this.norQueryDiv = jQuery("<div></div>").addClass("rh-norQuery");
	if (!jQuery.isEmptyObject(this._querys)) {
		var allQuery = {"ALL_QUERY":{"QUERY_NAME":"全部","QUERY_ID":"ALL_QUERY"}};
		allQuery = jQuery.extend(allQuery, this._querys);
		var queryDefault = 0;
		var count = 0;
		jQuery.each(allQuery,function(i,n) {
			var name = "<span class='rh-norQuery-span'>" + n.QUERY_NAME + "</span>";
			var queryA = jQuery("<a class='rh-norQuery-a' href='javascript:void(0);'></a>").attr("id",i).html(name)
			queryA.appendTo(_self.norQueryDiv);
			queryA.bind("click",function(event) {
				_self._queryId = i;
				if (i == "ALL_QUERY") {
					_self._queryId = "";
				}
				jQuery(".active",_self.norQueryDiv).removeClass("active");
				jQuery(this).addClass("active");
				_self._bldBtnBar();
				var opts = {"_NOPAGEFLAG_":"true"};
				_self.refreshTreeAndGrid(opts);
				_self.listBarTip(n.QUERY_NAME + "已加载！");
			});
			if (n.QUERY_DEFAULT == 1) {//启用此常用查询
				_self._queryId = i;
				queryA.addClass("active");
				queryDefault = i;
			}
			count++;
		});
		//第一个
		this.norQueryDiv.find(".rh-norQuery-a").first().addClass("rh-norQuery-a-left rh-norQuery-borderLeftNone");
		//最后一个
		this.norQueryDiv.find(".rh-norQuery-a").last().addClass("rh-norQuery-a-right rh-norQuery-borderRightNone");
		if (queryDefault == 0) {
			jQuery(".active",_self.norQueryDiv).removeClass("active");
			_self.norQueryDiv.find("#ALL_QUERY").addClass("active");
			_self._queryId = "";
		}
		//构造常用查询
		if (this.titleDiv) {
			this.norQueryDiv.appendTo(this.titleDiv);
		} else if (this.getParHandler() && this.getParHandler().norQueryDiv) {
			this.getParHandler().norQueryDiv.hide(); 
			this.norQueryDiv.appendTo(this.getParHandler().titleDiv);
		}
	}
};
/*
 * 构建查询区域
 */
rh.vi.listView.prototype._bldSearch = function() {
	var _self = this;
	if ((this.opts.showSearchFlag == "false") || (this._queryModel == 2) || (this._queryModel == 3)) {
		return false;
	}
	var temp = {"id":this.opts.id,"pid":this.opts.pId,"gridData":this._data};
	var tempDiv = jQuery("<table></table>").addClass("searchDiv");
	var tr = jQuery("<tr></tr>").appendTo(tempDiv);
	var td1 = jQuery("<td></td>").appendTo(tr);
	var td2 = jQuery("<td></td>").appendTo(tr);
	var td3 = jQuery("<td text-valign=middle></td>").appendTo(tr);
	var td4 = jQuery("<td></td>").appendTo(tr);
    this._searchSel =jQuery("<select></select>").addClass("rhSearch-select").appendTo(td1);
    this._searchText = jQuery("<input type='text' onfocus=\"this.value=''\" value='输入条件'/>").addClass("rhSearch-input").appendTo(td2);
    this._searchText.keypress(function(event) {
        if (event.keyCode == '13') {
            _self._searchBtn.click();
            return false;
        }
    });
    this._searchBtn = jQuery("<div class='rhSearch-button'><div class='rhSearch-inner'>查询</div></div>").addClass("rhSearch-button").append("").appendTo(td3);
    this._searchBtn.bind("click",function() {
    	_self.listBarTipLoad("结果加载中..");
    	setTimeout(function() {//延迟0秒执行
    		var searcCode = _self._getSearchValue();
    		var searcItemType = _self._getSearchItemType();
    		var where = "";
    		var seaValue = jQuery.trim(_self._searchText.val().replace(/\'/g,""));
    		if ((seaValue.length > 0) && (seaValue != "输入条件")) {//TODO：完善
    			if ((seaValue.indexOf("\"") >= 0) || ((seaValue.indexOf("\“") >= 0))) {
    				if ((seaValue.indexOf("\"") == 0) || (seaValue.indexOf("\“") == 0)) {
    					seaValue = seaValue.substring(1);
    				}
    				if ((seaValue.indexOf("\"") > 0) || (seaValue.indexOf("\”") > 0)) {
    					seaValue = seaValue.substring(0,seaValue.length - 1);
    				}
    				where += " and ";
    				if (searcItemType && searcItemType == "dict") {
    					where += "@@" + searcCode + "@" + seaValue + "@@";
    				} else {
    					where += searcCode + "='" + seaValue + "'";
    				}
    			} else {
    				where += " and ";
    				//字典条件替换
    				if (searcItemType && searcItemType == "dict") {
    					if (seaValue.indexOf("\%") >= 0) {
    						where += "@@" + searcCode + "@" + seaValue + "@@";
    					} else {
    						where += "@@" + searcCode + "@%" + seaValue + "%@@";
    					}
    				} else {
    					if (seaValue.indexOf("\%") >= 0) {
    						where += searcCode + " like '" + seaValue + "'";	
    					} else {
    						where += searcCode + " like '%" + seaValue + "%'";	
    					}
    				}
    			}
    		}
    		if (_self.advSearch) {
    			_self.advSearch.des();
    		}
    		_self.setSearchWhereAndRefresh(where,true);
    		return false;
    	},0);
    });
    
    
    //高级查询
    this._advancedSearchBtn = jQuery("<div class='rhSearch-advancedButton'><div class='rhSearch-advancedButton-inner'>高级</div></div>").addClass("").append().appendTo(td4);
    this._advancedSearchBtn.unbind("click").bind("click",function() {
    	var treeLink = false;
    	var navItems = _self._data.SERV_NAV_ITEMS;
    	if (navItems.length > 0) {
    		treeLink = true;
    	}
    	_self.advSearch = new rh.ui.search({"id":_self.servId,"data":_self._data,"parHandler":_self,"treeLink":treeLink,"cols":1});
    	_self.advSearch.show();
    });
	//_self.searchLevel = this._advancedSearchBtn;//获取高级查询对象
	this.searchLevel = this._advancedSearchBtn;//获取高级查询对象
	//如果要隐藏高级查询按钮，则
	if(this.opts.hideAdvancedSearch){
		this._advancedSearchBtn.hide();
	}
	tempDiv.appendTo(this._btnBar);
};
/*
 * 设置查询对象值，查询和高级查询用到
 */
rh.vi.listView.prototype.setSearchWhereAndRefresh = function(where,treeLink) {
	where = this.beforeSearch(where);
	this.whereData[this.SEARCH_WHERE] = where;
	this.whereData["_NOPAGEFLAG_"] = "true";
	if (treeLink == true) {//关联左侧导航树条件
		this.refresh(this.whereData);
	} else {//不关联左侧树条件
		this.whereData[this.TREE_WHERE] = "";
		this.refresh(this.whereData);
		this._refreshNavTree();
	}
};
/*
 *获取查询输入框对象
 */
rh.vi.listView.prototype.getSearchText = function(){
	var _self = this;
	return _self._searchText;
};
/*
 * 获取查询下拉框
 */
rh.vi.listView.prototype.getSearchSel = function(){
	var _self = this;
	return _self._searchSel;
};
/*
 * 获取查询按钮
 */
rh.vi.listView.prototype.getSearchBtn = function(){
	var _self = this;
	return _self._searchBtn;
	
};

/**
 * 隐藏查询区域
 * */
rh.vi.listView.prototype.hideSearchItem = function(){
	if (this.getSearchText()) {
		this.getSearchText().hide();
	}
	if (this.getSearchSel()) {
		this.getSearchSel().hide();
	}
	if (this.getSearchBtn()) {
		this.getSearchBtn().hide();
	}
}
/*
 * 获取高级查询按钮
 */
rh.vi.listView.prototype.getAdvancedSearchBtn = function(){
	var _self = this;
	return 	_self._advancedSearchBtn;
};

/*
 * 获取查询值
 */
rh.vi.listView.prototype._getSearchValue = function() {
	return this._searchSel.val();// + this._searchSel.text());
};
/*
 * 获取查询字段的类型
 */
rh.vi.listView.prototype._getSearchItemType = function() {
	return this._searchSel.find("option:selected").attr("itemtype");// + this._searchSel.text());
};
/*
 * 清空查询值
 */
rh.vi.listView.prototype._clearSearchValue = function() {
	if (this._searchText) {
		this._searchText.val("");
	}
};
/*
 * 获取列表查询按钮对象
 */
rh.vi.listView.prototype.getSearchBtn = function() {
	return this._searchBtn;
};

/*
 * 构建列表(rh.ui.grid)，包括按钮、数据表格、分页条
 */
rh.vi.listView.prototype._bldGrid = function() {
	var _self = this;
	//@TODO：考虑listdata在最后加载
	var options = {};
	if (this._linkWhere.length > 0) {
		options[_self.LINK_WHERE] = this._linkWhere;
		_self.whereData[_self.LINK_WHERE] = this._linkWhere;
		options["_linkServQuery"] = this.opts.linkServQuery || "";
	}
	if (this._extWhere.length > 0) {
		options[_self.EXT_WHERE] = this._extWhere;
		_self.whereData[_self.EXT_WHERE] = this._extWhere;
	}
	if (this._parWhere.length > 0) {//父传过来的条件
		if (_self._extWhere.length > 0) {
			_self.whereData[_self.EXT_WHERE] = _self._extWhere + Tools.parVarReplace(_self._parWhere);		
		} else {
			_self.whereData[_self.EXT_WHERE] = Tools.parVarReplace(_self._parWhere);		
		}
		options[_self.EXT_WHERE] = _self.whereData[_self.EXT_WHERE];
	}
	if (_self.whereData[_self.SEARCH_WHERE] && _self.whereData[_self.SEARCH_WHERE].length > 0) {//查询的条件
		options[_self.SEARCH_WHERE] = _self.whereData[_self.SEARCH_WHERE];
	}

	if (_self._batchFlag == false) {
		_self._transBatchFlag = false;
	}
	if (this.opts._SELECT_) {//列信息
		options["_SELECT_"] = this.opts._SELECT_;
	}
	if (this.opts._HIDE_) {//需隐藏的列
		options["_HIDE_"] = this.opts._HIDE_;
	}
	
	options = jQuery.extend(options,this.slimParams());
	if ((this._dataFlag === false) || (this._dataFlag === "false")) {
		options[_self.EXT_WHERE] = " and 1=2 ";
		this._dataFlag == true;
	}
	//构造常用查询的_queryId
	if (this._queryId && (this._queryId.length > 0)) {
		options["_queryId"] = this._queryId;
	}
	this._listData =  FireFly.getPageData(this.opts.sId,options) || {};	
	if (this.selectViewFlag == true || this.selectViewFlag == "true") {//查询选择取消行按钮显示
		//_self._rowBtns = null;
	}
	var temp = {"id":this.opts.id,"mainData":this._data,"rowBtns":_self._rowBtns,"byIdFlag":_self._byIdFlag,
	            "parHandler":this,"pCon":this.contentMain,"batchFlag":_self._transBatchFlag,"type":this.opts.type,"pkHide":this.opts.pkHide,
	            "sortGridFlag":_self.opts.sortGridFlag,"buildPageFlag":this.opts.showPageFlag};
	temp["listData"] = this._listData;
	this.grid = new rh.ui.grid(temp);
	this.grid.render();	
	//增加底部按钮条
	//this._bldBtnBarBottom();
};
/*
 * 打开卡片页面
 * @param act 动作act
 * @param paramData 自定义传递的参数，供卡片获取
 */
rh.vi.listView.prototype._openCardView = function(act,pkCode,servId,readOnly,paramData) {
    this.listBarTipLoad("卡片打开中...");

	var _act = UIConst.ACT_CARD_MODIFY;
	if (act && act == UIConst.ACT_CARD_ADD) {
	    _act = act;	
	}
	var sId = this.opts.sId;
	if (servId) {
		sId = servId;
    }
    var readFlag = this._cardRead;
    if ((this._readOnly === true) || (this._readOnly === "true")) {//只读关联功能
  	    readFlag = true;
    }
    if (readOnly) {
    	readFlag = readOnly;
    }
    backBtn = this.opts.cardBackBtn;
    //打开小卡片条件
    var widHeiArray = null;
    if (window.self == window.top) {//最外层的打开显示
        var miniCardWid = jQuery("body").width() - 300;
        widHeiArray = [miniCardWid,500];
    	backBtn = true;
    }
    this.cardView = null;
    var temp = {"act":_act,"sId":sId,"parHandler":this,"transferData":this._transferData,"readOnly":readFlag,"title":this._title,
    		    "paramData":paramData,"links":this.links,"pCon":this.opts.cardCon,"reset":this.opts.cardReset,
    		    "backBtn":backBtn,"widHeiArray":widHeiArray};
    temp[UIConst.PK_KEY] = pkCode;
    this.cardView = new rh.vi.cardView(temp);
    this.cardView.show();
    //RHFile.bldDestroyBase(this.cardView);
};
/*
 * 获取服务和id的合并值(服务-ID)
 * @param id ID值
 */
rh.vi.listView.prototype._getUnId = function(id) {
    var sId = this.opts.sId;
    return sId + "-" + id;
};
/*
 * 根据动作绑定相应的方法
 * @param aId 动作ID
 */
rh.vi.listView.prototype._act = function(aId,aObj) {
	var _self = this;
	var taObj = aObj;
	switch(aId) {
		case UIConst.ACT_ADD://添加
			taObj.bind("click",function(event) {
               _self._openCardView(UIConst.ACT_CARD_ADD);
               event.stopPropagation();
               return false;
			});	
			break;
		case UIConst.ACT_BATCH_SAVE://保存
		    taObj.bind("click",function() {
		    	  var datas = _self.grid.getModifyTrDatas();     
	              if (datas == null) {
	              	   _self.listBarTipError("请选择相应记录！");
	              } else {
	            	  //判断列表如果需要校验，对列表进行校验
	            	  if(_self.grid.needValidate() && !_self.grid.validate()) {
		          	       _self.listBarTipError("校验未通过");
		          	       return false;
		          	   }
	              	   _self.listBarTipLoad("提交中...");
	              	   setTimeout(function() {
	              		   // 保存之前
	              		   _self.beforeSave.call(_self, datas);
	              		   
		              	   var batchData = {};
		              	   batchData["BATCHDATAS"] = datas;
						   var resultData = FireFly.batchSave(_self.opts.sId,batchData,null,_self.getNowDom());
						   
						   // 保存之后
						   _self.afterSave.call(_self, datas);
						   
					       _self.refreshGrid();
	              	   },0);
	              }
		    });  
		    break;
	    case UIConst.ACT_DELETE://删除
		    taObj.bind("click",function() {
                var pkArray = _self.grid.getSelectPKCodes();
		    	if (jQuery.isEmptyObject(pkArray)) {
		    		 _self.listBarTipError("请选择相应记录！");
		    	} else {
		    		 var res = confirm("您确定要删除该数据么？");
		    		 if (res == true) {
			    		_self.listBarTipLoad("提交中...");
			    		setTimeout(function() {
			    			if(!_self.beforeDelete(pkArray)){
			    				return false;
			    			}
				    		var strs = pkArray.join(",");
				    		var temp = {};
				    		temp[UIConst.PK_KEY]=strs;
				    		var resultData = FireFly.listDelete(_self.opts.sId,temp,_self.getNowDom());
					        _self.refreshGrid();
					        _self.afterDelete();
			    		},0);	
		    		 } else {
		    		 	return false;
		    		 }
		    	}
		    }); 
		    break;
	    case UIConst.ACT_EXPORT://导出Excel
		    taObj.bind("click",function() {
		    	var select = _self.grid.getSelectPKCodes();
		    	var data = {"_PK_":select.join(",")};
		    	data = jQuery.extend(data,_self.whereData);
		    	var param = jQuery(this).attr("param"); //如果按钮设定存在参数
		    	if (param) { //合并上按钮设定中的参数
		    		data = jQuery.extend(data, jQuery.parseJSON(param));
		    	}
		    	window.open(FireFly.getContextPath() + '/' + _self.opts.sId + '.exp.do?data=' + 
		    		encodeURIComponent(jQuery.toJSON(data)));
		    }); 
		    break;
	    case UIConst.ACT_IMPORT://导入Excel
		    taObj.bind("click",function(event) {
		    	var config = {"SERV_ID":_self.opts.sId, "FILE_CAT":"EXCEL_UPLOAD", "FILENUMBER":1, 
		    		"VALUE":15, "TYPES":"*.xls;*.xlsx", "DESC":"导入Excel文件"};
		    	var file = new rh.ui.File({
		    		"config" : config
		    	});
		    	
		    	var importWin = new rh.ui.popPrompt({
		    		title:"请选择文件",
		    		tip:"请选择要导入的Excel文件：",
		    		okFunc:function() {
		    			var fileData = file.getFileData();
		    			if (jQuery.isEmptyObject(fileData)) {
		    				alert("请选择文件上传");
		    				return;
		    			}
		    			var fileId = null;
		    			for (var key in fileData) {
		    				fileId = key;
		    			}
		    			if (fileId == null){
		    				alert("请选择文件上传");
		    				return;
		    			}
		    			var param = {};
		    			param["fileId"] = fileId;
		    			//提交  导入 只将fileId传入即可
		    			rh_processData(_self.opts.sId + ".imp.do", param, true);
		    			importWin.closePrompt();
				        _self.refreshGrid();
		    			file.destroy();
		    		},
		    		closeFunc:function() {
		    			file.destroy();
		    		}
		    	});
		    	importWin._layout(event,undefined,[450,230]);
		    	
		    	var container = jQuery("#" + importWin.dialogId);
		    	container.empty();
		    	importWin.tipBar = jQuery("<div></div>").text(importWin.tip).css({"height":"40px","font-weight":"normal","margin":"15px 15px 0px 15px","color":"red"});
		        container.append(importWin.tipBar);
		    	container.append(file.obj);
		    	file.obj.css({'margin-left':'5px'});
		    	file.initUpload();
		    }); 
		    break;
	    case UIConst.ACT_EXPORT_ZIP://批量导出zip
		    taObj.bind("click",function() {
		    	var select = _self.grid.getSelectPKCodes();
		    	var data = {"_PK_":select.join(",")};
		    	data = jQuery.extend(data,_self.whereData);
		    	window.open(FireFly.getContextPath() + '/' + _self.opts.sId + '.expZip.do?data=' + 
		    		encodeURIComponent(jQuery.toJSON(data)));
		    }); 
		    break;
	    case UIConst.ACT_IMPORT_ZIP://批量导导入zip
		    taObj.bind("click",function(event) {
		    	var config = {"SERV_ID":_self.opts.sId, "FILE_CAT":"JSON_UPLOAD", "FILENUMBER":1, 
		    		"VALUE":15, "TYPES":"*.zip;", "DESC":"导入压缩数据"};
		    	var file = new rh.ui.File({
		    		"config" : config
		    	});
		    	
		    	var importWin = new rh.ui.popPrompt({
		    		title:"请选择文件",
		    		tip:"请选择要导入的zip文件：",
		    		okFunc:function() {
		    			var fileData = file.getFileData();
	
		    			if (jQuery.isEmptyObject(fileData)) {
		    				alert("请选择文件上传");
		    				return;
		    			}
		    			
		    			var fileId = null;
		    			for (var key in fileData) {
		    				fileId = key;
		    			}
		    			
		    			if (fileId == null){
		    				alert("请选择文件上传");
		    				return;
		    			}
		    			var param = {};
		    			param["fileId"] = fileId;
		    			//提交  导入 只将fileId传入即可
		    			rh_processData(_self.opts.sId + ".impZip.do", param, true);
		    			importWin.closePrompt();
				        _self.refreshGrid();
		    			file.destroy();
		    		},
		    		closeFunc:function() {
		    			file.destroy();
		    		}
		    	});
		    	importWin._layout(event,undefined,[450,230]);
		    	
		    	var container = jQuery("#" + importWin.dialogId);
		    	container.empty();
		    	importWin.tipBar = jQuery("<div></div>").text(importWin.tip).css({"height":"40px","font-weight":"normal","margin":"15px 15px 0px 15px","color":"red"});
		        container.append(importWin.tipBar);
		    	container.append(file.obj);
		    	file.obj.css({'margin-left':'5px'});
		    	file.initUpload();
		    }); 
		    break;
	    case "back"://返回按钮绑定
		    taObj.bind("click",function() {
                  _self.backImg.mousedown();
		    }); 
		    break;
	    case "test"://测试
		    taObj.bind("click",function() {
                  //_self.grid.addNewTrs();
		    }); 
		    break;
	}
};
/*
 * 加载的提示信息
 * @param msg 消息
 */
rh.vi.listView.prototype.listBarTipLoad = function(msg,areaFlag) {
	var flag = true;
 	if (areaFlag) {
 		flag = areaFlag;
 	}
	Tip.showLoad(msg,flag);
};
/*
 * 成功的提示信息
 * @param msg 提示内容
 */
rh.vi.listView.prototype.listBarTip = function(msg,areaFlag) {
	var flag = true;
 	if (areaFlag) {
 		flag = areaFlag;
 	}
	Tip.show(msg,flag);
};
/*
 * 错误的提示信息
 * @param msg 提示内容
 */
rh.vi.listView.prototype.listBarTipError = function(msg,areaFlag) {
	var flag = true;
 	if (areaFlag) {
 		flag = areaFlag;
 	}
	Tip.showError(msg,flag);
};
/*
 * 警告的提示信息
 * @param msg 提示内容
 */
rh.vi.listView.prototype.listBarTipAttention= function(msg,areaFlag) {
	var flag = true;
 	if (areaFlag) {
 		flag = areaFlag;
 	}
	Tip.showAttention(msg,flag);
};
/*
 * 清除加载提示信息
 */
rh.vi.listView.prototype.listClearTipLoad = function() {
    Tip.clearLoad();
};
/*
 * 区分列表还是卡片
 */
rh.vi.listView.prototype.getNowDom = function() {
	var _self = this;
	if (this.opts.parHandler && _self.opts.bottomTabFlag && (_self.opts.bottomTabFlag == true)) {
	    return "listBottom";
	} else if (this.opts.parHandler) {
		return null;
	} else {
		return "list";
	}
};
/*
 * 列表页面与后台交互方法，公用方法
 * @param act 动作ID
 * @param async 是否异步
 */
rh.vi.listView.prototype.doAct = function(act,reload,async) {
	var _self = this;
	var pkArray = _self.grid.getSelectPKCodes();
	var strs = pkArray.join(",");
	var datas = {};
	datas[UIConst.PK_KEY]=strs;
	datas = jQuery.extend(datas,this.links);
	
	if(async) {// 异步
	    FireFly.doAct(this.opts.sId, act, datas, true, true, function(result){
			if (result[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0 || result[UIConst.RTN_MSG].indexOf(UIConst.RTN_WARN) == 0) {
		   	    if (reload && reload == true) {
		   	    	_self._refreshGridBody();
		   	    }
		    }
		});
	} else {
		var result = FireFly.doAct(this.opts.sId, act, datas,_self.getNowDom());
	    if (result[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0 || result[UIConst.RTN_MSG].indexOf(UIConst.RTN_WARN) == 0) {
	   	    if (reload && reload == true) {
	   	    	_self._refreshGridBody();
	   	    }
	    }
	}
  
};
/*
 * 列表页面与后台交互方法，公用方法,传递servId的方法act
 * @param act 动作ID
 */
rh.vi.listView.prototype.doServAct = function(servId,act,reload) {
	var _self = this;
	var pkArray = _self.grid.getSelectPKCodes();
	var strs = pkArray.join(",");
	var datas = {};
	datas[UIConst.PK_KEY]=strs;
	datas = jQuery.extend(datas,this.links);
    var result = FireFly.doAct(servId, act, datas);
    if (result[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
   	    if (reload && reload == true) {
   	    	_self._refreshGridBody();
   	    }
    } 
};
/*
 * 列表页面与后台交互方法，公用方法,成功后刷新页面
 * @param act 动作ID
 */
rh.vi.listView.prototype.doActReload = function(act) {
	var _self = this;
    this.doAct(act,true);
};

/*
 * 删除前方法执行
 */
rh.vi.listView.prototype.beforeDelete= function(pkArray) {
	return true;
};
/*
 * 删除后方法执行
 */
rh.vi.listView.prototype.afterDelete = function() {
};
/*
 * 根据过滤条件查询出需要数据
 */
rh.vi.listView.prototype.queryData = function() {
	//根据过滤条件查询出需要数据
	
};
/*
 * 构建按钮条
 */
rh.vi.listView.prototype._bldBtnBar = function() {
	var _self = this;
	if (typeof this._btnBar != "object") {//第一次构造
		this._btnBar = jQuery("<div></div>").addClass("rhGrid-btnBar");
	} else {
		this._btnBar.find(".rhGrid-btnBar-a").remove();
	}
	this.btns = {};
	var tempData = this._data.BTNS;
	var oneVar = UIConst.STR_YES;
	
	//是否可以双击进入页面
	if(_self._byIdFlag !== false || _self._byIdFlag !== 'false'){
		//是否配置了byId方法并且有权限操作
		var byIdActFlag = false;
		jQuery.each(tempData,function(i,n) {
			if ((n.ACT_CODE == UIConst.ACT_BYID) && (n.ACT_TYPE == UIConst.ACT_TYPE_NOBTN)) {//非按钮&&查看
				byIdActFlag = true;
				return;
			}
		});
		_self._byIdFlag = byIdActFlag;
	}else{
		_self._byIdFlag = false;
	}
	
	//是否有列表按钮显示
	var listButtonFlag = false;
	//根据参数判断是否显示按钮
	if(_self._showButtonFlag == "true"){
		_self._rowBtns = []; //列表行按钮数组		
		jQuery.each(tempData,function(i,n) {
			var showFlag = true;//按钮的只读开关
	        if ((_self._readOnly === true || _self._readOnly === "true") && (n.ACT_GROUP == oneVar)) {//页面只读&&非编辑组
	        	showFlag = false;
	        }     
			if ((n.ACT_TYPE == UIConst.ACT_TYPE_LIST) && showFlag) {
				var temp = jQuery("<a></a>").addClass("rh-icon").addClass("rhGrid-btnBar-a");
				temp.attr("id",_self._getUnId(n.ACT_CODE));
				temp.attr("actcode",n.ACT_CODE);
				temp.attr("title",n.ACT_TIP);
				if (n.ACT_MEMO.length > 0 && (n.ACT_MEMO.indexOf("@") == 0)) {
					temp.attr("param", n.ACT_MEMO.substr(1));
				}
				_self._act(n.ACT_CODE,temp);
				var labelName = jQuery("<span></span>").addClass("rh-icon-inner").text(n.ACT_NAME);
				temp.append(labelName);
				var icon = jQuery("<span></span>").addClass("rh-icon-img").addClass("btn-" + n.ACT_CSS);
				temp.append(icon);
				if (n.ACT_MEMO.length > 0 && (n.ACT_MEMO.indexOf("@") != 0)) { //非参数项
					temp.bind("click",function() {
						var _funcExt = new Function(n.ACT_MEMO);
	                    _funcExt.apply(_self);
					});
				}
				_self.btns[n.ACT_CODE] = temp;
				if (n.ACT_CODE == UIConst.ACT_BATCH_SAVE) {//批量编辑的标志
					_self._transBatchFlag = true;
				} 
				if ((n.ACT_EXPRESSION.length > 0) && _self._excuteActExp(n.ACT_EXPRESSION) == false) {//判断操作表达式
					temp.hide();
					_self._btnBar.append(temp);
				} else {
					_self._btnBar.append(temp);
					listButtonFlag = true;
				}
				if (n.ACT_CODE == UIConst.ACT_ADD) {//没有添加按钮则只读卡片
					_self._cardRead = false;
				}
			} else if ((n.ACT_TYPE == UIConst.ACT_TYPE_LISTROW) && showFlag) {//列表行按钮
				_self._rowBtns.push(n);
			}
		});
	} 
	
	// 没有列表按钮显示时，并且也不显示简洁查询时， 将原来的按钮条加上spacer样式，减少间距
	if(!listButtonFlag && (this.opts.showSearchFlag == 'false' || this._queryModel != '1')){
		_self._btnBar.addClass("rhGrid-btnBar__spacer").appendTo(this.content);
	}
	
	return this._btnBar;
};
/*
 * 构建按钮条
 */
rh.vi.listView.prototype._bldBtnBarBottom = function() {
	var _self = this;
	if (this.opts.parHandler) {
		return false;
	}
	var btns = this._btnBar.find(".rhGrid-btnBar-a");
	var _btnBar = jQuery("<div></div>").addClass("rhGrid-btnBar-bottom");
	jQuery.each(btns,function(i,n) {
		var a = jQuery(n).clone();
		a.bind("click",function() {
			var code = a.attr("actcode");
			_self.btns[code].click();
		});
		a.appendTo(_btnBar);
	});
	_btnBar.appendTo(this.contentMain);
};
/*
 * 获取列表是否含有显示按钮
 */
rh.vi.listView.prototype._isHaveShowBtn = function() {
	var _self = this;
	var btns =  this._btnBar.find(".rhGrid-btnBar-a");
	if (btns.length == 0) {
		return false;
	} else {
		return true;
	}
};
/*
 * 隐藏多选框列
 */
rh.vi.listView.prototype.hideCheckBox = function() {
	var _self = this;
	if (_self.grid && this.selectViewFlag === false) {//非查询选择
		if (this._isHaveShowBtn() === false) {
			this.grid.hideCheckBoxColum();
		}
	}
};
/*
 * 添加新的一行表格，不含数据
 */
rh.vi.listView.prototype._addNewTr = function() {
	var _self = this;
	this.grid.addNewTr();
};
/*
 * 构建树形导航区
 */
rh.vi.listView.prototype._bldNavTree = function() {
	var _self = this;
	_self.nvaTreeArray = [];
	_self.navTreeWhere = {};
	_self.navTreeWhereExt = {};
	var _defaultHei = GLOBAL.defaultFrameHei;
	function replaceId (str) {
		return str.replace(/[^\w]/gi, "_");
	};
    //jQuery(document).ready(function(){
    	//setTimeout(function() {
			if (_self.navTreeContainer.hasClass("wp0")) {
				return false;
			}
			if (_self.contentMainCont.height() > _defaultHei) {
				_defaultHei = _self.contentMainCont.height();	
			}
			//_self.contentMainCont.height(_defaultHei);
		    _self.navTree.height(_defaultHei-10);
		    var items = _self._data.ITEMS;
		    var navItems = _self._data.SERV_NAV_ITEMS;
		    if (_self._replaceNavItems && _self._replaceNavItems.length > 0) {//替换左侧导航定义
		    	navItems = _self._replaceNavItems;
		    }
		    var itemArray = navItems.split(",");
		    var countTree = 0;
		    jQuery.each(itemArray,function(i,n) {
		    	var itemCode = n;
		    	var dictId = items[n].DICT_ID;
		    	var config = items[n].ITEM_INPUT_CONFIG;

				var confArray = config.split(",");
				var dictId = confArray[0];
				var conf = confArray.slice(1);
				var confJson = StrToJson(conf.join(","));
				var configExtendDicSetting = confJson && (confJson.extendDicSetting) ? confJson.extendDicSetting:null;
				var extWhere = confJson && (confJson.EXTWHERE) ? confJson.EXTWHERE:null;
				//如果外层有替换的extWhere条件，则替换默认配置，[字典编号__EXTWHERE]
				if (_self.slimParams()[dictId + "__EXTWHERE"]) {
					extWhere = _self.slimParams()[dictId + "__EXTWHERE"];
				}
				var dictSubs = confJson && (confJson.DICT_SUBS) ? confJson.DICT_SUBS:null;//是否查询当前点的所有子
				var pId = confJson && (confJson.PID) ? confJson.PID:null;
                var expandLevelParam = 1;
				var setting = {
						rhexpand: false,
						expandLevel:expandLevelParam,
				    	showcheck: false,   
				    	url: "SY_COMM_INFO.dict.do", 
				        theme: "bbit-tree-no-lines", //bbit-tree-lines ,bbit-tree-no-lines,bbit-tree-arrows
				        rhItemCode:itemCode,
				        rhBeforeOnNodeClick: function (item,id) {//点击添加选中状态之前
				        	var nodeObj = jQuery("#" + id + "_" + replaceId(item.ID),_self.navTree);
				        	if (nodeObj.hasClass("bbit-tree-selected")) {//节点取消选中
				        		nodeObj.addClass("rh-bbit-tree-selected");
				        	}
				        },
				        onnodeclick: function(item,id) {//节点点击
				        	_self.listBarTipLoad("加载中..");
				        	//var where = " and " + item.rhItemCode + "='" + item.ID + "'";
				        	var nodeObj = jQuery("#" + id + "_" + replaceId(item.ID),_self.navTree);
				        	if (nodeObj.hasClass("rh-bbit-tree-selected")) {//节点取消选中
				        		nodeObj.removeClass("bbit-tree-selected");
				        		nodeObj.removeClass("rh-bbit-tree-selected");
				        		delete _self.navTreeWhere[item.rhItemCode];//删除条件
				        		//重置传递参数对象的值
				        		_self._transferData[item.rhItemCode] = "";
						    	_self._transferData[item.rhItemCode + "__NAME"] = "";
				        	} else if (item.ID == dictId) {
				        		delete _self.navTreeWhere[item.rhItemCode];//删除条件
				        	} else {
				        		_self.navTreeWhere[item.rhItemCode] = item.ID;//保存点击条件
				        		_self.navTreeWhereExt[item.rhItemCode] = dictSubs;//扩展传递条件
				        		//增加传递参数对象值
				        		_self._transferData[item.rhItemCode] = item.ID;
						    	_self._transferData[item.rhItemCode + "__NAME"] = item.NAME;
				        	}
				        	if (item.ID == dictId) {//如果点击的是根节点，@TODO:多个根节点的点击，
				        		nodeObj.css("background","none");
				        	}
					    	_self.whereData[_self.TREE_WHERE] = _self.getNavTreeWhereStr();
					    	_self.beforeTreeNodeClickLoad(item,id,dictId);
					    	var opts = {};
					    	opts._NOPAGEFLAG_ = "true";
						    _self.refresh(opts);
						    _self.afterTreeNodeClick(item,id,dictId);
					    	return false;
						}
				    };
					setting.rhLeafIcon = Tools.getTreeLeafClass(dictId);//系统默认提供
	                if (configExtendDicSetting) {
	                		setting = jQuery.extend(setting,configExtendDicSetting);//合并扩展的树形设置信息    	
	                }
	                // 0为加载所有，这个应该是可以配置的//加PID
	                var params = null;
	                if (jQuery.isEmptyObject(System.getParParams()) == false) {
	                		params = JsonToStr(System.getParParams());
	                }
	                // 字典额外参数配置，用于传到后台字典处理类做特殊处理
	                if(confJson && !jQuery.isEmptyObject(confJson.params)) {
	                		params = jQuery.extend({}, params, confJson.params);
	                		setting.url += "?" + jQuery.param(confJson.params);
	                }
	                extWhere = Tools.parVarReplace(extWhere);
	                extWhere = Tools.systemVarReplace(extWhere);
	                extWhere = Tools.itemVarReplace(extWhere,_self.links);
					setting.data = FireFly.getDict(dictId,pId,Tools.parVarReplace(extWhere),null,null,params);//s_menuData.TOPMENU;//// 设置树的初始化数据
					var child = setting.data[0].CHILD;
				    if (child.length == 1) {
				    	setting.data = child;
				    }
				    // 异步加载条件
				    setting.dictId = dictId;
					setting.extWhere = Tools.parVarReplace(extWhere);
				    //setting.data[0]["NAME"] = n.ITEM_NAME;
				    var tree = new rh.ui.Tree(setting);
				    _self.nvaTreeArray[dictId] = tree;
					_self.navTree.append(tree.obj);
					countTree++;
					if (countTree < itemArray.length) {
						var lineSplit = jQuery("<div></div>").addClass("content-navTree-line");
						_self.navTree.append(lineSplit);
						
					}
		    });
		    //展开收起的功能实现
	       _self.navTreeContainer.hover(
	    	   function(event) {
		    	   if (jQuery(".content-navTree-close").length == 0) {
		    		   var close = jQuery("<div></div>").addClass("content-navTree-close").appendTo(jQuery(this));
		    		   close.bind("click",function(event) {
		    			   if (jQuery(".content-navTree-close").hasClass("content-navTree-expand")) {
		    				   _self.navTreeContainer.width(_self.navTreeContainer.data("orWid")-1);
		    				   _self.contentMainCont.width(_self.contentMainCont.data("orWid"));
		    				   jQuery(".content-navTree-close").removeClass("content-navTree-expand");	 
		    				   jQuery(".content-navTree-pannel").remove();
		    			   } else {
		    				   _self.navTreeContainer.data("orWid",_self.navTreeContainer.width());
		    				   _self.contentMainCont.data("orWid",_self.contentMainCont.width());
		    				   _self.navTreeContainer.width("2%");
		    				   _self.contentMainCont.width("98%");
		    				   var pannel = jQuery("<div></div>").addClass("content-navTree-pannel").appendTo(_self.navTreeContainer);
		    				   jQuery(".content-navTree-close").addClass("content-navTree-expand");
		    			   }
		    		   });
		    	   }
			   },
			   function(event) {
	               if (jQuery(".content-navTree-expand").length == 1) {
	               } else {
	            	   jQuery(".content-navTree-close").remove();
	               }
			   }
		  );
    	//},0);
    //});
};
/*
* 业务可覆盖此方法，在导航树的点击事件加载前
*/
rh.vi.listView.prototype.beforeTreeNodeClickLoad = function(item,id,dictId) {
	
};
/*
* 业务可覆盖此方法，在导航树的点击事件执行后
*/
rh.vi.listView.prototype.afterTreeNodeClick = function(item,id,dictId) {
	
};
/*
* 获取树形组合条件
*/
rh.vi.listView.prototype.getNavTreeWhereStr = function() {
	var _self = this;
	var where = [];
	jQuery.each(_self.navTreeWhere,function(i,n) {
		var temp = {};
		temp["DICT_ITEM"] = i;
		temp["DICT_VALUE"] = n; 
		if (_self.navTreeWhereExt[i]) {//扩展配置传递
			temp["DICT_SUBS"] = _self.navTreeWhereExt[i];
		}
		where.push(temp);
	});
	return where;
};
/*
* 获取导航树对象
* dictId:字典编码
*/
rh.vi.listView.prototype.getNavTreeObj = function(dictId) {
	var _self = this;
	return _self.nvaTreeArray[dictId];
};
/*
 * 内部刷新左侧导航树方法
 */
rh.vi.listView.prototype._refreshNavTree = function() {
	if (this.navTree.hasClass("wp0")) {
		return true;
	}
	this.navTree.empty();
	this._bldNavTree();
};
/*
 * 初始化服务主数据，包括服务定义、字段、按钮等
 */
rh.vi.listView.prototype._initMainData = function() {
	if(this.opts.servDef){
		this._data = this.opts.servDef;
		FireFly.setCache(this.opts.sId,FireFly.servMainData,this._data);
	}else{
		this._data = FireFly.getCache(this.opts.sId,FireFly.servMainData);
	}
    //服务定义的标签script和css文件
    var servJS = this._data.SERV_JS;
    if (servJS.length > 0) {
	    var servStyle = GLOBAL.servStyle[this.servId];
	    if (!servStyle) {
	    	servJS += "";
	    	servJS = servJS.replace(/@urlPath@/i, FireFly.getContextPath());
		    jQuery(servJS).appendTo(jQuery("head"));
		    GLOBAL.servStyle[this.servId] = "true";
	    }
    }
    this.servName = this._data.SERV_NAME;//服务名称
	this._linkServ = this._data.LINKS || {};//关联功能信息
	this._itemData = this._data.ITEMS;
	this._querys = this._data.QUERIES;//常用查询
	this._queryModel = this._data.SERV_QUERY_MODE || 1;//查询模式
	if (this._replaceQueryModel) {
		this._queryModel = this._replaceQueryModel;
	}
};
/*
 * 获取列表的数据记录
 */
rh.vi.listView.prototype.getListData = function() {
	return this._listData;
};
/*
 * 重置当前页面的高度(对外方法)
 */
rh.vi.listView.prototype.resetSize = function() {
	this._resetHeiWid();
};
/*
 * 重置当前页面的高度，初始化时、从卡片返回列表时
 */
rh.vi.listView.prototype._resetHeiWid = function() {
	var _self = this;
	if ((this.opts.reset == false) || (this.opts.reset == "false")) {
		return true;
	}
	if (jQuery.isFunction(this.opts.resetHeiWid)) {
		_self.opts.resetHeiWid.call(_self.opts.parHandler);
	} else {
		clearTimeout(_self._resetTimer);
	    jQuery(document).ready(function(){
	    	_self._resetTimer = setTimeout(function() {
	    		var _default = GLOBAL.getDefaultFrameHei();
				_self._height = _self.content.height() + _self.listHeader.height();
				_self._width = _self.content.width();
				if (_self._height < _default) {
					_self._height = _default;
				}
				if (_self.opts.parHandler) {//关联功能的list执行
					var parHandler = _self.opts.parHandler;
				    if (_self.opts.bottomTabFlag == true) {//主单下列表
				    	var diffHei = _self._height + 70;//列表内容高度+外层tab条高度
				    	var mainHei = _self.contentMainCont.height();//列表实际高度
				    	if ((diffHei - mainHei) > 200) {
				    		diffHei = 500;
				    	}
				    	parHandler._resetHeiWid(diffHei);//调用rhCardView的方法
				    	_self._height = diffHei;//列表实际高度
				    } else if(_self.opts.sonTabFlag == true || _self.opts.sonTabFlag == "true"){//rhListExpanderView 卡片子列表
				    	parHandler._resetHeiWid();//调用rhCardView的方法
				    } else if (_self.opts.listSonTabFlag == true || _self.opts.listSonTabFlag == "true") {//列表子列表
				    	_self._height = _self._height + parHandler.listHeader.height(); //当前content高度加上父的头高度
						Tab.setFrameHei(_self._height+20);	
				    } else {
						_self._height += 20;
						parHandler._changeTabHeiWid(_self._height);
				    }
				} else {
					if (_self._height == _default) {//如果主列表页面内容小于默认值
						_self._height = _default-20;
					}
					Tab.setFrameHei(_self._height+20);	//TODO:临时处理，增加列表下面间隙
				}
	    	},0);
	    });
	}
};
/*
 * 提供外部调用刷新列表方法
 */
rh.vi.listView.prototype.refresh = function(options) {
	this.destroyUI();
	this._refreshGridBody(options);
    //查询选择的加载后事件执行
	if (this.selectViewFlag == true) {
		this.getParHandler()._afterLoad();
	}
};
/*
 * 销毁组件
 */
rh.vi.listView.prototype.destroyUI = function() {
};
/*
 * 提供外部调用刷新列表和树方法
 */
rh.vi.listView.prototype.refreshTreeAndGrid = function(options) {
	this._refreshNavTree();
	this._refreshGridBody(options);
};
/*
 * 刷新列表体不重置页面大小
 */
rh.vi.listView.prototype.refreshGridBodyNoResize = function(options) {
	var _self = this;
	if (this._linkWhere.length > 0) {
		_self.whereData[_self.LINK_WHERE] = this._linkWhere;
		_self.whereData["_linkServQuery"] = this.opts.linkServQuery || "";//关联功能过滤规则标识
	}
	if (this._extWhere.length > 0) {
		_self.whereData[_self.EXT_WHERE] = this._extWhere;
	}
	if (this._parWhere.length > 0) {//父传过来的条件
		if (_self._extWhere.length > 0) {
			_self.whereData[_self.EXT_WHERE] = _self._extWhere + Tools.parVarReplace(_self._parWhere);		
		} else {
			_self.whereData[_self.EXT_WHERE] = Tools.parVarReplace(_self._parWhere);		
		}
	}
	if (options && options._PAGE_) {
		_self.PAGE["_PAGE_"] = options._PAGE_;
	}
	var data = jQuery.extend({},_self.whereData,options);//合并条件
	data = jQuery.extend({},_self.PAGE,data);//合并分页信息
	
	if (this.opts._SELECT_) {//查询选择的话会显示不一样的列信息
		data["_SELECT_"] = this.opts._SELECT_;
	}
	if (this.opts._HIDE_) {//需隐藏的列
		options["_HIDE_"] = this.opts._HIDE_;
	}
	if (options && options._NOPAGEFLAG_ && (options._NOPAGEFLAG_ == "true")) {//删除分页信息
		delete data._PAGE_;
		delete data._NOPAGEFLAG_;
	}
	data = jQuery.extend(data,this.slimParams());
	//构造常用查询的_queryId
	if (this._queryId && (this._queryId.length > 0)) {
		data["_queryId"] = this._queryId;
	}
	this._listData =  FireFly.getPageData(this.opts.sId,data);
	this.grid.refresh(this._listData);	
	//执行工程级js方法
	this._excuteProjectJS();
	//没有按钮则自动隐藏多选框
	this.hideCheckBox();
	//处理工作流活动节点用户状态字段S_WF_USER_STATE的值。
	this._loadWfUserState();
	//加载公司领导意见
	this._loadLeaderMind();
	this._loadEmergency();
	//清除提示加载信息
	this.listClearTipLoad();	
};
/*
 * 内部刷新列表数据方法
 */
rh.vi.listView.prototype._refreshGridBody = function(options) {
	this.refreshGridBodyNoResize(options);
	//清除复选框的选中
	var headBox = this.grid.getHeadCheckBox();
	if (headBox.attr("checked")) {
		headBox.removeAttr("checked");
	}
	//重算高度
	this._resetHeiWid();
};
/*
 * 对外刷新列表数据方法
 */
rh.vi.listView.prototype.refreshGrid = function(options) {
	this._refreshGridBody();
};
/*
 * 重置刷新方法(增加刷新树形的方法)
 */
rh.vi.listView.prototype.onRefreshGridAndTree = function() {
	var _self = this;
	this.refreshGrid = function() {
		_self._refreshGridBody();
		_self._refreshNavTree();
	};
};
/*
 * 引擎最后执行
 */
rh.vi.listView.prototype._afterLoad = function() {
	//var stopWatch = new Stopwatch();
	//stopWatch.start();
	var _self = this;
	//1.填充普通查询数据
	this._fillSearchList();
	// 处理tab的表达式
	this._bldLinkServExp();
	//2.执行执行工程级js方法
	this._excuteProjectJS();	
	//3.没有按钮则自动隐藏多选框
	this.hideCheckBox();
	//4.重算高度
	this._resetHeiWid();
	//5.处理工作流活动节点用户状态字段S_WF_USER_STATE的值。
	this._loadWfUserState();
	//6.加载公司领导意见
	this._loadLeaderMind();
	//隐藏一些有优先级但不要显示的紧急程度值。
	this._loadEmergency();
	//显示返回按钮，默认隐藏
	this._btnBarBackBtn();
	//7.清空加载信息提示
	Tip.clearLoad();
	//console.log(stopWatch.time() + "毫秒");
};

/**
 * 处理工作流活动节点用户状态字段S_WF_USER_STATE的值。格式如：[{"D":"稽核部总经理","U":"c180c0c718f36e8e0118f36ec6f100bc","N":"周有扣","O":"N"}] 
 */
rh.vi.listView.prototype._loadWfUserState = function() {
	var colDef = this.grid.getColumnDef("S_WF_USER_STATE");
	//如果字段不存在则返回
	if(!colDef){
		return;
	}
	if(colDef.ITEM_LIST_FLAG != "1"){ //如果该字段不显示则返回
		return;
	}
	//取得整个列的所有行数据
	var userStateCells = this.grid.getTdItems("S_WF_USER_STATE");	
	RHWF.loadWfUserState(userStateCells, this.grid._table, "S_WF_USER_STATE");
};
/**zzx增加--2013.1.31
 * 列表页判断列表页是否存在S_HAS_PS_MIND列值，如果存在列值，则将已经签署领导意见的列用“对钩”样子的小图片替换
 * 当鼠标放到图片上后，查询出领导的意见。
 */
rh.vi.listView.prototype._loadLeaderMind = function() {
	var _viewer = this ;
	var grid = _viewer.grid;
	RHWF.showLeaderMind(grid);	
};

/**
 * 处理紧急字段
 */
rh.vi.listView.prototype._loadEmergency = function(){
	var colDef = this.grid.getColumnDef("S_EMERGENCY__NAME");
	//如果字段不存在则返回
	if(colDef){
		if(colDef.ITEM_LIST_FLAG != "1"){ //如果该字段不显示则返回
			return;
		}
		
		this.grid.getTdItems("S_EMERGENCY__NAME").each(function(){
			var cellObj = jQuery(this);
			if(jQuery.isNumeric(cellObj.text())){
				cellObj.text("");
			}
			RHWF.figuredEmergency(cellObj, true); //图片化
		});
		return;
	}
	colDef = this.grid.getColumnDef("S_EMERGENCY");
	if(colDef){
		if(colDef.ITEM_LIST_FLAG != "1"){ //如果该字段不显示则返回
			return;
		}
		
		this.grid.getTdItems("S_EMERGENCY").each(function(){
			var cellObj = jQuery(this);
			if(jQuery.isNumeric(cellObj.text())){
				cellObj.text("");
			}
			RHWF.figuredEmergency(cellObj, false); //图片化
		});
		
	}
};

/*
 * 填充普通查询的下拉列表
 */
rh.vi.listView.prototype._fillSearchList = function() {
    var _self = this;
    var selects = [];
    var hides = [];
    if (_self.selectViewFlag == true) {
    	selects = _self.opts._SELECT_.split(",");//查询选择的字段
    	hides = _self.opts._HIDE_.split(",");//查询选择的隐藏字段
    }
	jQuery.each(this._itemData,function(i,n) {
		if (_self.selectViewFlag == true) {//查询选择
			if ((jQuery.inArray(n.ITEM_CODE,selects) > -1) && (jQuery.inArray(n.ITEM_CODE,hides) == -1)) {
				var temp = jQuery("<option value='" + n.ITEM_CODE + "'>" + n.ITEM_NAME + "</option>").appendTo(_self._searchSel);
				if ((n.ITEM_INPUT_MODE == UIConst.FITEM_INPUT_DICT) 
						|| (n.ITEM_INPUT_TYPE == UIConst.FITEM_ELEMENT_SELECT)
						|| (n.ITEM_INPUT_TYPE == UIConst.FITEM_ELEMENT_RADIO)
						|| (n.ITEM_INPUT_TYPE == UIConst.FITEM_ELEMENT_CHECKBOX)) {//字典
					temp.attr("itemtype","dict");
				}
			}			
		} else { //默认情况
			if (n.ITEM_LIST_FLAG == UIConst.STR_YES) {
				var temp = jQuery("<option value='" + n.ITEM_CODE + "'>" + n.ITEM_NAME + "</option>").appendTo(_self._searchSel);
				if ((n.ITEM_INPUT_MODE == UIConst.FITEM_INPUT_DICT) 
						|| (n.ITEM_INPUT_TYPE == UIConst.FITEM_ELEMENT_SELECT)
						|| (n.ITEM_INPUT_TYPE == UIConst.FITEM_ELEMENT_RADIO)
						|| (n.ITEM_INPUT_TYPE == UIConst.FITEM_ELEMENT_CHECKBOX)) {//字典
					temp.attr("itemtype","dict");
				}
			}
		}
	});
};
/*
 * 获取按钮对象
 */
rh.vi.listView.prototype.getBtn = function(actCode) {
    var _self = this;
    if (this.btns[actCode]) {
    	return this.btns[actCode];
    } else {
    	return jQuery();
    }
};
/*
 * 列表加载后执行工程级js方法
 */
rh.vi.listView.prototype._excuteProjectJS = function() {
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
	    var jsFileUrl = FireFly.getContextPath() + "/" + lowerFolder + "/servjs/" + value + "_list.js";
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
 * 解析操作表达式
 */
rh.vi.listView.prototype._excuteActExp = function(tmpExp) {
	var _self = this;
    //替换系统变量
	if (tmpExp.indexOf(";") > 0) {//如果有显示控制和后台操作表达式一起控制
		var expArray = tmpExp.split(";");
		tmpExp = expArray[0];
	}  
    tmpExp = Tools.systemVarReplace(tmpExp);
	tmpExp = Tools.itemVarReplace(tmpExp,_self.links);//关联定义的变量替换
	if (typeof this._queryId == "string") {//常用查询的替换变量 #系统#
		var normalData = {};
		normalData[UIConst.QUERY_ID] = _self._queryId;
		tmpExp = Tools.itemVarReplace(tmpExp,normalData);
	}
    //表达式是否为true
    var actExp = eval(tmpExp);
    return actExp;
};
rh.vi.listView.prototype._locHref = function(target) {
	window.location.hash = "href-" + target;
};
/*
 * 获取当前页面的父句柄
 */
rh.vi.listView.prototype.getParHandler = function() {
	return this.opts.parHandler;
};
/*
 * 给列表增加红头文字
 */
rh.vi.listView.prototype.addRedHeader = function(text, style) {
	jQuery(".redHeader", this.content).remove();
	jQuery("<div class='redHeader' style='" + (style ? style : "") + "'>" + text + "</div>")
		.insertBefore(this._btnBar);
};
/*
 * 让当前页面处于屏蔽状态
 */
rh.vi.listView.prototype.shield = function() {
	this.loadBar = new rh.ui.loadbar();
	this.loadBar.show();
};
/*
 * 让当前页面取消屏蔽状态
 */
rh.vi.listView.prototype.shieldHide = function() {
	this.loadBar.hide();
};
/*
 * 设置父关联参数对象
 */
rh.vi.listView.prototype.setParParams = function(data) {
	this._parVar = data;
	System.setParParams(data);
};
/*

 * 获取参数对象，过滤掉含有句柄对象的结果
 */
rh.vi.listView.prototype.slimParams = function() {
	var params = {};
	if (!jQuery.isEmptyObject(this.params)) {
		jQuery.each(this.params,function(i,n) {
			if (i == "handler" || i == "viewer" || i == "callBackHandler" || i == "closeCallBackFunc") {
			} else {
				params[i] = n;
			}
		});
	}
	jQuery.each(this.links,function(i,n) {//关联参数
		params[i] = n;
	});
	return params;
};
/*
 * 获取参数对象
 */
rh.vi.listView.prototype.getParams = function() {
	return this.params;
};
/*
 * 扩展_extWhere参数设置
 */
rh.vi.listView.prototype.setExtWhere = function(extWhere) {
	this._extWhere = extWhere;
};
/*
 * 设置列表标题
 */
rh.vi.listView.prototype.setTitle = function(title) {
    this.listHeader.find(".conHeaderTitle-span").text(title);
};

/*
 * 返回查询ID
 */
rh.vi.listView.prototype.getQueryId = function() {
    return this._queryId;
};
/**
 * 关联服务打开卡片后返回按钮设定
 */
rh.vi.listView.prototype._btnBarBackBtn = function(){
	if ((System.getVar("@C_SY_PJ_BACKBTN@") == "true") && (this.getParHandler() == null)) {//顶层页面自动关闭
		var actCode = "back";
		var temp = jQuery("<a></a>").addClass("rh-icon").addClass("rhGrid-btnBar-a");
		temp.attr("id",GLOBAL.getUnId(actCode,this.servId));
		temp.attr("actcode","back");
		temp.attr("title","返回");
		this._act(actCode,temp);
		var labelName = jQuery("<span></span>").addClass("rh-icon-inner").text("返回");
		temp.append(labelName);
		var icon = jQuery("<span></span>").addClass("rh-icon-img").addClass("btn-back");
		temp.append(icon);
		this._btnBar.append(temp);
	} else {
		if (this.backImg) {
			this.backImg.show();
		}
	}
};
/*
 * 执行关联服务定义的操作表式
 */
rh.vi.listView.prototype._bldLinkServExp = function() {
	var _self = this;
	   jQuery.each(_self._linkServ,function(i,n) {
			if (n.LINK_SHOW_POSITION == 4) { //列表TAB关联
				  var exp = n.LINK_EXPRESSION;
				  var sid = n.LINK_SERV_ID;
				  if (exp && exp.length > 0) {
					  var flag = _self._excuteActExp(exp);
					  if (flag == false) {
						  _self.tabHide(sid);
					  }
				  }
			}
	   });
};
/*
 * 设置子tab的触发
 */
rh.vi.listView.prototype.tabFocus = function(sid) {
	var _self = this;
	setTimeout(function() {
		var topObj = jQuery("li.rhList-tabs__li[sid='" + sid + "']",_self.mainUL);
		if (topObj.length == 1) {//头部关联
			topObj.click();
		}
	},500);
};
/*
 * 设置列表tab的隐藏
 */
rh.vi.listView.prototype.tabHide = function(sid) {
	var _self = this;
	var topObj = jQuery("li.rhList-tabs__li[sid='" + sid + "']",_self.mainUL);
	if (topObj.length == 1) {//头部关联
		  var index = jQuery(".rhList-tabs__liLi",_self.mainUL).index(topObj);
		  topObj.hide();
	}
};
