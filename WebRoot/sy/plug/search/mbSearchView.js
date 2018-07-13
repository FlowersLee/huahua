/** 列表页面渲染引擎 */
GLOBAL.namespace("mb.vi");
/*待解决问题：
 * 
 * */
mb.vi.search = function(options) {
	var defaults = {
		"id":options.sId + "-mbSearchView",
		"sId":"",//服务ID
		"aId":"", //操作ID
		"pCon":null,
		"pId":null,
		"back":"",//返回的页面
		"linkWhere":"",
		"extWhere":""
	};
	this.opts = jQuery.extend(defaults,options);
	this._id = this.opts.id;;
	this.servId = this.opts.sId;
    this._pCon = this.opts.pCon;
	this._data = null;	
	this._searchWhere = "";//查询条件
	this._originalWhere = "";//服务定义条件
	this._extendWhere = "";//扩展条件
	this._linkWhere = this.opts.linkWhere;//关联功能过滤条件
		
	
	this.nowPage = 1;
	this.keyStr = "";
	
};
/*
 * 渲染列表主方法
 */
mb.vi.search.prototype.show = function( k) {
	//this._initMainData();
	this._layout();
	this._query(k);
	this._bldGrid();
	this._bldPage();
	this._afterLoad();
};
mb.vi.search.prototype._initMainData = function() {
	/*{lastQuery=*:*, _PAGE_=[{NOWPAGE=1, SHOWNUM=10}], filterCache=[]
	, titleKeyWordsContent=公文, STARTTIME=, FILTER=[], KEYWORDS=公文, SELECTED_CATS=[], QUERY=, categoryCache=[{"_PK_":"","id":"SY_COMM_CALENDAR","level":"1","query":"service:SY_COMM_CALENDAR","name":"日程","type":"service"}]
	, ENDTIME=, serv=SY_PLUG_SEARCH, act=query}*/
	this._query();
};
/*
 * 刷新
 */
mb.vi.search.prototype.refresh = function() {
	var _self = this;
	this.input.val("");
	this.btn.click();
};
/*
 * 构建列表页面布局
 */
mb.vi.search.prototype._layout = function() {
	var _self = this;
	this.searchBar = jQuery("<div></div>").addClass("mbTopBar").appendTo(this._pCon);
    this._bldSearchBar();
	this.listContainer = jQuery("<div></div>").addClass("mbSearch-container").appendTo(this._pCon);//列表外容器
};
/*
 * 构建列表页面布局
 */
mb.vi.search.prototype._bldSearchBar = function() {
	var _self = this;
	//默认布局
	this.back = jQuery("<div>返回</div>").addClass("mbTopBar-back mbTopBar-search-back").appendTo(this.searchBar); 
   // this.back.html(UIConst.FONT_STROKE_BACK);
	this.back.bind("click",function() {
		_self.back.addClass("mbTopBar-backActive");
    	//_self.back.html(UIConst.FONT_STROKE_LOAD);
//    	history.go(-1);
		if (_self.opts.back == "doc") {
			window.location.href = FireFly.getContextPath() + "/sy/comm/wenku/mb/mbDocView.jsp";
		} else {
			window.location.href = FireFly.getContextPath() + "/sy/comm/desk-mb/desk-mb.jsp";
		}
    });
    
	//keyword input
	this.input = jQuery("<input type='text' value=''></input>").attr("id","inputTxt").addClass("mbSearch-input mb-bottom-right-radius-6").appendTo(this.searchBar);
	//suggest input
	this.suggest = jQuery("<div style='color:black; width: 640px; z-index: 10; position: absolute; left: 75px; top: 40px; display: none;'></div>").attr("id","suggest").appendTo(this.searchBar);
	this.input.keypress(function(event) {
        if (event.keyCode == '13') {
            _self.btn.click();
            return false;
        }
    });
	this.btn = jQuery("<span>查询</span>").addClass("mbTopBar-blueBtn mbSearch-searchBtn").appendTo(this.searchBar);
    //this.btn.html(UIConst.FONT_REG_QUERY);
	this.btn.unbind("click").bind("click",function() {
		_self._ajaxQuery();
//		var keywords =  _self.input.val();
//		window.location.href="/sy/plug/search/mbSearchResult.jsp?k="+keywords;
	});
};
/**ajax search */
mb.vi.search.prototype._ajaxQuery = function(k){
	var _self = this;
	_self.nowPage = 1;
	_self._query();
	_self._bldGrid();
	_self._bldPage();
	_self._afterLoad();
};
	
mb.vi.search.prototype._query = function(k){
	var input = this.input;
	var keywords = "";
	var inputVal = "";
	
	if (k) {
		input.val(k);
	}
	
	if (input) {
		keywords = input.val();	
		inputVal = keywords;
	}
	keywords = encodeURIComponent(keywords);
	var param = {};
	var page = {};
	page["SHOWNUM"] ="10"; 
	//alert(this.nowPage);
	page["NOWPAGE"] = this.nowPage;
//	param["QUERY"] = inputVal;

	param["_PAGE_"] = page;
	param["KEYWORDS"] = keywords; 
	param["MBFLAG"] = "true";
	this.data = FireFly.getPageData("SY_PLUG_SEARCH",param);
    this._DATA = this.data._DATA_;
	this._lPage = this.data._PAGE_;
}
/*
 * 构建列表页面布局
 */
mb.vi.search.prototype._bldGrid = function() {
	var _self = this;
	this.listContainer.empty();
	this._table = jQuery("<table></table>").attr("id",this._id).addClass("mbSearch-grid").appendTo(this.listContainer);
	this._bldTrs(this._DATA);
};
mb.vi.search.prototype._bldTrs = function(data) {
	var _self = this;
    var trs = [];
	//默认布局
	var i = 0;
	for (i; i < data.length;i++) {
		var trData = data[i];
		trs.push(_self._bldTr(trData));
	}
	this.listContainer.find(".mbSearch-grid").append(trs.join(""));
};
mb.vi.search.prototype._bldTr = function(node) {
	var _self = this;
	//默认布局
	var tr = [];
	tr.push("<tr class='mbGrid-tr'>");
	var i = 0;
	var tdLeft = [];
	var tdRight = [];
	tdRight.push("<td class='mbGrid-td-right'");
	
	var one = [];
	var two = [];
	var attList = [];
	one.push("<div>");//第一行
	two.push("<div>");//第二行
	attList.push("<div>");//附件列表
	var icon = [];
	icon.push("<span class='mb-icon-span mb-right-nav'></span>");
	if (node["title"]) {//标题
		var service = "";
		if (node["service"]) {
			service = "<span class='mbGrid-td-service'>[" + FireFly.getServName(node["service"]) + "]</span>";
		}
		one.push("<span class='mbGrid-td-weight'>");
		one.push(service + node["title"]);
		one.push("</span>");
	} 
	if (node["abstract"]) {//摘要
		two.push("<span class='mbGrid-td-span'>");
		two.push(node["abstract"]);
		two.push("</span>");		
	}
	
	//显示附件列表
	jQuery.each(node["attachment"],function(index, att) {
		var attUrl = att["att_path"];
		
		 if (attUrl.substr(0,6) == "/file/") {
			 attUrl = attUrl.substring(6, attUrl.length);
		 }
		
		attUrl = FireFly.getContextPath() + "/file/" + encodeURIComponent(attUrl) + "?act=preview";
		attList.push("<a class='aOpenFile' href='# ' url='" + attUrl +"' >");
		attList.push(att["att_title"]);
		attList.push("</a>");
		attList.push("<br>");
	});
	
	one.push("</div>");
	two.push("</div>");
	attList.push("</div>");
	
	tdRight.push(" uid='");
	tdRight.push(node["id"]);
	tdRight.push("' url='");
	tdRight.push(node["url"]);
	tdRight.push("'>");
	tdRight.push(one.join(""));
	tdRight.push(two.join(""));
	tdRight.push(attList.join(""));
	tdRight.push(icon.join(""));
	tdRight.push("</td>");
	
	tr.push(tdLeft.join(""));
	tr.push(tdRight.join(""));
	tr.push("</tr>");
	return tr.join("");
};
mb.vi.search.prototype._openLayer = function(uid,url) {
	var array = uid.split(",");
	if (url && url.length > 0) {
		this.url = FireFly.getContextPath() + Tools.xdocUrlReplace(url);		
	} else {
		var readOnly = false;//this.readOnly;
		this.url = FireFly.getContextPath() + "/sy/base/view/stdCardView-mb.jsp?sId=" +　array[0] + "&readOnly=" + readOnly + "&pkCode=" + array[1];		
	}
	window.location.href = this.url;
};
/*
 * 构建列表页面布局
 */
mb.vi.search.prototype.morePend = function(options) {
	var _self = this;
	this.nowPage = parseInt(this.nowPage) + 1;
	this._query();
	this._bldTrs(this._DATA);
	this._afterLoad();
};

mb.vi.search.prototype._getUnId = function(id) {

};
/*
 * 构建翻页
 */
mb.vi.search.prototype._bldPage = function() {
	var _self = this;
	this.more = jQuery("<div></div>").addClass("mbGrid-more");
	this.more.html("<span>查看更多</span>");
	jQuery("<span></span>").addClass("mbGrid-more-icon mb-down-nav").appendTo(this.more);
	this.more.appendTo(this.listContainer);
	this.listContainer.undelegate( "click" ).delegate(".mbGrid-more","click",function() {
		_self.morePend();
		return false;
	});
};

/*
 * 加载完毕提示
 */
mb.vi.search.prototype._recordOverTip = function() {
	var _self = this;
	this.overTip = jQuery("<div></div>").addClass("mbGrid-overTip mb-radius-bottom-20 mb-shadow-down-6");
	this.overTip.text("全部数据已加载！");
	var toTop = jQuery("<span>回到顶部</span>").addClass("mbGrid-toTop").appendTo(this.overTip);
	this.overTip.appendTo(this.listContainer);
	this.listContainer.delegate(".mbGrid-toTop","click",function() {
		window.scrollTo(0,0);
	});
};
/*
 * 加载完毕提示
 */
mb.vi.search.prototype._replaceKey = function(allValue) {
	var _self = this;
	var value = this.input.val();
	if (value.length > 0) {
		//value = eval("allValue.replace(/" + value + "/g,\"<label class='mbSearch-redKey'>" + value + "</label>");
		//alert(value);
		return value;
	} else {
		return "";
	}
};
/*
 * 构建翻页
 */
mb.vi.search.prototype.getBlocks = function() {
	var _self = this;
	return _self.listContainer.find(".mbGrid-td-right");
};
/*
 * 构建翻页
 */
mb.vi.search.prototype.trClick = function() {
	var _self = this;
	_self.listContainer.delegate(".mbGrid-td-right","mousedown",function(event) {
		var node = jQuery(this);
    	if ((node.attr("class") != "rowIndex") && (node.attr("class") != "checkTD")) {
    		var uid = node.attr("uid");
    		var url = node.attr("url");
			_self._openLayer(uid,url);
			
			var index = uid.indexOf(",");
			var service = uid.substr(0,index);
			
		    return false; 
    	}
	});
};
/*
 * 加载后执行
 */
mb.vi.search.prototype._afterLoad = function() {
	var _self = this;
    var nowPage = this._lPage.NOWPAGE;
    var pages = this._lPage.PAGES;
    if (nowPage == pages) {
    	_self.listContainer.find(".mbGrid-more").hide();
    	_self._recordOverTip();
    }
    this.trClick();
    //匹配高亮
    var value = this.input.val()
    if (value.length > 0) {
    	jQuery(".mbSearch-container").textSearch(value,{markColor: "red"});
    }
    
    //附件
    jQuery(".aOpenFile").each(function(i,n) {
    	var url = jQuery(n).attr("url");
    	jQuery(n).bind("mousedown",function(event) {
    		event.stopPropagation();
    		window.open(url);
    		
    	});
    });

};


