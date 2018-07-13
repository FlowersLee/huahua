/**
 * custom search view 
 */

/** 列表页面渲染引擎 */
GLOBAL.namespace("mb.vi");
/*
 * TODO： 重构代码，精简代码
 * 
 * */
mb.vi.search = function(options) {
	var defaults = {
		"id":options.sId + "-mbSearchView",
		"sId":"",//服务ID
		"aId":"", //操作ID
		"pCon":null,
		"pId":null,
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
mb.vi.search.prototype.show = function() {
	var _self = this;
	//this._initMainData();
	this._layout();
//	this._query(k);
//	this._bldGrid(this._DATA);
//	this._bldMore();
//	this._afterLoad();
	var param ={};
	param["S_USER"] =  System.getUser("USER_CODE");
	
	var resultData = FireFly.doAct("SY_PLUG_SEARCH_CUSTOM", "finds", param);
	jQuery.each(resultData._DATA_, function(index, node){
	var keywords = node.KEYWORD;
	var queryField = node.FIELD;
	var id = node.ID;
	var queryStr = queryField + ":" + keywords;
	var data = _self._query(queryStr, keywords, node.LIMIT);
	
	_self.listContainer = jQuery("<div></div>").addClass("mbSearch-container").appendTo(_self._pCon);//列表外容器
	
	var setbar = jQuery("<div></div>").addClass("rh-cusearch-keyword").appendTo(_self.listContainer);
	jQuery("<span>关键词：" + keywords + "</span>").addClass("rh-set-left").appendTo(setbar);
	
	var setBut = jQuery("<a href='#'><span>设置</span></a>").addClass("rh-set-right").appendTo(setbar);
	setBut.bind("click",function() {
		_self._showSetting(id);
	});
	
//	jQuery("<span>下移</span>").addClass("rh-set-right").appendTo(setbar);
//	jQuery("<span>上移</span>").addClass("rh-set-right").appendTo(setbar);
	
//	_self.listContainer.empty();
	_self._table = jQuery("<table></table>").attr("id",_self._id).addClass("mbSearch-grid").appendTo(_self.listContainer);
	_self._bldTrs(data);
	_self._bldMore(node);
	_self._afterLoad();
	});

	
};
mb.vi.search.prototype._initMainData = function() {
};
/*
 * 刷新
 */
mb.vi.search.prototype.refresh = function() {
	var _self = this;
	_self._pCon.empty();
	_self.show();
};
/*
 * 构建列表页面布局
 */
mb.vi.search.prototype._layout = function() {
	var _self = this;
	this.searchBar = jQuery("<div></div>").addClass("mbTopBar").appendTo(this._pCon);
    this._bldSearchBar();
	//this.listContainer = jQuery("<div></div>").addClass("mbSearch-container").appendTo(this._pCon);//列表外容器
};
/*
 * 构建列表页面布局
 */
mb.vi.search.prototype._bldSearchBar = function() {
	var _self = this;
	//默认布局
	this.back = jQuery("<div><a href='#'>个性化订阅</a></div>").addClass("rh-custom-search").appendTo(this.searchBar); 
   // this.back.html(UIConst.FONT_STROKE_BACK);
	this.back.bind("click",function() {
		
//显示设置UI
	_self._showSetting("");
    });
    
};

mb.vi.search.prototype._showSetting = function (pk) {
	var _self = this;
	var bean = null;
	if (pk) {
		var param ={};
		param["_PK_"] = pk;
		bean = FireFly.doAct("SY_PLUG_SEARCH_CUSTOM", "byid", param);
	}
	
	var dialog = jQuery("<div title='个性化订阅设置'></div>");
	var line1 = jQuery("<div class='inner' style='width:97.5%;max-width:1400px;'></div>").appendTo(dialog);
	jQuery("<span class='left' style='width:17.5%;'>关键词:</span>").appendTo(line1);
	var keywordsSpan = jQuery("<span class='right' style='width:81.5%;' ></span>").appendTo(line1);
	var keywords = jQuery("<input id='keywords' type='text'></input>").appendTo(keywordsSpan);
	if (null != bean && bean.KEYWORD){
		keywords.val(bean.KEYWORD);
	}
	
	var line2 = jQuery("<div class='inner' style='width:97.5%;max-width:1400px;' ></div>").appendTo(dialog);
	jQuery("<span class='left' style='width:17.5%;'>关键词位置:</span>").appendTo(line2);
	var querySpan = jQuery("<span class='right' style='width:81.5%;'></span>").appendTo(line2);
	var queyrField = jQuery("<select id='searchField' ><option value='title'>标题</option><option value='content'>内容</option></select>").appendTo(querySpan);
	if (null != bean && bean.FIELD){
		queyrField.val(bean.FIELD);
	}
	
	var line3 = jQuery("<div class='inner' style='width:97.5%;max-width:1400px;' ></div>").appendTo(dialog);
	jQuery("<input  type='hidden' id='rh-select-serv-id' />").appendTo(line3);
	jQuery("<span class='left' style='width:17.5%;'>限定搜索的数据源:</span>").appendTo(line3);
	var serv = jQuery("<span class='right' style='width:81.5%;'><input id='rh-select-serv' type='text'></input></span>").appendTo(line3);
	serv.bind("click",function() {
		getServ();
	});
	
	var line4 = jQuery("<div class='inner' style='width:97.5%;max-width:1400px;' ></div>").appendTo(dialog);
	jQuery("<span class='left' style='width:17.5%;'>结果排序方式:</span>").appendTo(line4);
	var sortSpan = jQuery("<span class='right' style='width:81.5%;'></span>").appendTo(line4);
	var sort = jQuery("<select id='sort' ><option value='default'>按焦点排序</option><option value='time'>按时间排序</option></select>").appendTo(sortSpan);
	if (null != bean && bean.ORDER_FIELD){
		sort.val(bean.ORDER_FIELD);
	}
	
	var line5 = jQuery("<div class='inner' style='width:97.5%;max-width:1400px;' ></div>").appendTo(dialog);
	jQuery("<span class='left' style='width:17.5%;'>结果显示条数:</span>").appendTo(line5);
	var limitSpan = jQuery("<span class='right' style='width:81.5%;'></span>").appendTo(line5);
	
	var limit = jQuery("<select id='limit' ></select>").appendTo(limitSpan);
	for(i =1; i <= 20; i++) {
		jQuery("<option value='" + i + "'>" + i +"</option>").appendTo(limit);
	}
	if (null != bean && bean.LIMIT){
		limit.val(bean.LIMIT);
	} else {
		limit.val(5);
	}
	
	//删除按钮
	if (null != bean){
		var line6 = jQuery("<div class='inner' style='width:97.5%;max-width:1400px;' ></div>").appendTo(dialog);
		var cancelDiv = jQuery("<div></div>").appendTo(line6);
		var cancel = jQuery("<a href='#'>取消该关键词定制</a>").appendTo(cancelDiv);
		
		cancel.bind("click",function() {
			
			var param ={};
			param["_PK_"] = pk;
			var resultData = FireFly.doAct("SY_PLUG_SEARCH_CUSTOM", "delete", param);
			if (resultData[UIConst.RTN_MSG] && resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
		  		Tip.show("删除成功!");
		  		dialog.remove();
		  		//刷新页面
		  		_self.refresh();
			} else {
		  		Tip.show("返回错误，请检查！" + JsonToStr(resultData), true);
			}
			
		});
	}
	
	dialog.dialog({
		autoOpen: true,
		height: 400,
		width: 400,
		show: "bounce", 
        hide: "puff",
		modal: true,
		resizable: false,
		position: ["center","center"],
		buttons: {
			"保存": function() {
				var data = {};
		    	data["KEYWORD"] = keywords.val();
		    	data["FIELD"] = queyrField.val();
		    	data["LIMIT"] = limit.val();
		    	data["SERVICE"] = jQuery("#rh-select-serv-id").val();
		    	data["ORDER_FIELD"] = sort.val();
		    	if (pk) {
		    	data["_PK_"] = pk;	
		    	}
		    	
				var resultData = FireFly.doAct("SY_PLUG_SEARCH_CUSTOM", "save", data);
				if (resultData[UIConst.RTN_MSG] && resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
			  	//	_self.callback.call(_self._viewer, resultData); // 回调
			  		Tip.show("保存成功!");
			  		dialog.remove();
			  		//刷新页面
			  		_self.refresh();
				} else {
			  		Tip.show("返回错误，请检查！" + JsonToStr(resultData), true);
				}
			},
			"关闭": function() {
				dialog.remove();
			}
		}
	});
	jQuery(".ui-dialog-buttonpane").first().css({"margin-top":"0px","margin-bottom":"0px","padding-top":"0px","padding-bottom":"0px","background-color":"#eee"});
	jQuery(".ui-dialog-titlebar").last().css("display","block");//设置标题显示
	
	//数据加载
	if (null != bean && bean.SERVICE){
		setServ(bean.SERVICE, "");
	}

}
	
mb.vi.search.prototype._query = function(queryStr, k,limit){
	var keywords = "";
	var inputVal = "";
	if (!limit) {
		limit = 5;
	}
	keywords = k;	
	inputVal = keywords;
	keywords = rhEncodeContent(keywords);
	var param = {};
	var page = {};
	page["SHOWNUM"] = limit; 
	//alert(this.nowPage);
	page["NOWPAGE"] = this.nowPage;
	param["QUERY"] = queryStr;

	param["_PAGE_"] = page;
	param["KEYWORDS"] = keywords; 
	param["MBFLAG"] = "true";
	this.data = FireFly.getPageData("SY_PLUG_SEARCH",param);
    this._DATA = this.data._DATA_;
	this._lPage = this.data._PAGE_;
	
	return this.data._DATA_;
	
	
};
/*
 * 构建列表页面布局
 */
mb.vi.search.prototype._bldGrid = function(data) {
	var _self = this;
	this.listContainer.empty();
	this._table = jQuery("<table></table>").attr("id",this._id).addClass("mbSearch-grid").appendTo(this.listContainer);
	this._bldTrs(data);
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
	one.push("<div class='tl'>");//第一行
	two.push("<div>");//第二行
	attList.push("<div>");//附件列表
	var icon = [];
	icon.push("<span class='mb-icon-span mb-right-nav'></span>");
	if (node["title"]) {//标题
		var service = "";
		if (node["service"]) {
			service = "<span class='mbGrid-td-service'>[" + FireFly.getServName(node["service"]) + "]</span>";
		}
		var displayTitle = service + node["title"];
		var id = node["id"];
		var title = node["title"];
		var service = node["service"];
		var tags = id.split(",");
  		var servId = "unknow";
  		var dataId = "unknow";
  		if(tags.length > 1){
  			servId = tags[0];
  			dataId = tags[1];
  		}
		//构造url
		var url = node["url"];
		if (null == url || "" == url) {
  			url = "javascript:var opts={'url':'" + service + ".card.do?pkCode=" + dataId + "','tTitle':'" + title + "','menuFlag':3};Tab.open(opts);";
  		} else {
  			url = "javascript:var opts={'sId':'" + service + "','tTitle':'" + title + "','url':'" + url + "','menuFlag':3};Tab.open(opts);";
  		}
		
		if (startsWith(id, "http://")) {
			one.push(" <a target='_blank' href='" +id + "'  class='rh-res-title' >" + displayTitle + "</a> ");
			} else if (startsWith(url, "javascript:")) {
				one.push(" <a  href='#' onclick=\"" + url + "\"  class='rh-res-title' >" + displayTitle + "</a> ");
			} else {
				one.push(" <a  href=\"" + url + "\"  class='rh-res-title' >" + displayTitle + "</a> ");
			}
		
//		one.push("<a href='#' class='rh-res-title'>");
//		one.push(displayTitle);
//		one.push("</a>");
	} 
	if (node["abstract"]) {//摘要
		two.push("<span class='rh-contentPreview'>");
		two.push(node["abstract"]);
		two.push("</span>");		
	}
	
	//显示附件列表
	jQuery.each(node["attachment"],function(index, att) {
		var attUrl = att["att_path"];
		
		 if (attUrl.substr(0,6) == "/file/") {
			 attUrl = attUrl.substring(6, attUrl.length);
		 }
		
		attUrl = "/file/" + encodeURIComponent(attUrl) + "?act=preview";
		attList.push("<a  target='_blank' class='rhSearch-load-a' href='" + attUrl + "' url='" + attUrl +"' >");
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
		this.url = Tools.xdocUrlReplace(url);		
	} else {
		var readOnly = false;//this.readOnly;
		this.url = "/sy/base/view/stdCardView-mb.jsp?sId=" +　array[0] + "&readOnly=" + readOnly + "&pkCode=" + array[1];		
	}
	window.location.href = this.url;
};

mb.vi.search.prototype._getUnId = function(id) {

};
/*
 * 查看更多
 */
mb.vi.search.prototype._bldMore = function(bean) {
	var _self = this;
	var keywords = bean.KEYWORD;
	var queryField = bean.FIELD;
	var queryStr = queryField + ":" + keywords;
	
	this.more = jQuery("<div></div>").addClass("mbGrid-more");
	this.more.html("<span>查看更多>></span>");
	jQuery("<span></span>").addClass("mbGrid-more-icon mb-down-nav").appendTo(this.more);
	this.more.appendTo(this.listContainer);
	this.listContainer.undelegate( "click" ).delegate(".mbGrid-more","click",function() {
		keywords = encodeURIComponent(keywords);
		var opts = {"sId":"SEARCH-RES","tTitle":"搜索","url":"/SY_PLUG_SEARCH.query.do?data={'KEYWORDS':'" + keywords + "','QUERY':'" + queryStr +"'}","menuFlag":3};
		Tab.open(opts);
		Tab.close();
	});
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


};



//选择服务(类别)触发方法
getServ = function(event) {
	jQuery("#rh-select-serv").empty()
	var options = {"itemCode":"rh-select-serv","config":"SY_SERV_SEARCH,{'extendDicSetting':{'rhexpand':true},'TYPE':'sigle','extendWhere':' AND SERV_SEARCH_FLAG=1','rtnNullFlag':true}","parHandler":null,"hide":"explode","show":"blind",replaceCallBack:function(id,value) {
	   jQuery("#rh-select-serv-id").val(id);
	   jQuery("#rh-select-serv").val(value);
	   //search...
	}};
	var dictView = new rh.vi.rhDictTreeView(options);
	dictView.show(event,[170,150]); 
	var id = jQuery("#rh-select-serv-id").val();
	jQuery(".ui-dialog-title").text("请选择类别");
	
	
	var array = id.split(",");
  	jQuery.each(array,function(index, n) {
  		dictView.tree.checkNode(n);
  		dictView.tree.expandParent(n);
	});
  	
	return false;
};

//初始化已选择的类别
setServ = function(id,value) {
    if (null == value || "" == value) {
    	value = "";
    	var list = id.split(",");
    	jQuery.each(list,function(index, n) {
    		var name =  getServiceName(n);
    		if (name != "") {
    		value += name + ",";
    		}
    	});
    }
    if (endsWith(value,",")) {
		  value = value.substring(0, value.length-1);
	  }
    jQuery("#rh-select-serv-id").val(id);
    jQuery("#rh-select-serv").val(value);
};


/**
 * 获取服务的名称
 * @param sId 服务ID
 */
function getServiceName(sId) {
	var name = getSearchableServName(sId);
	if (name == "") {
	//	name = FireFly.getServName(sId);
	}
	return name;
};

/**
 * 获取可搜索服务的名称
 * @param sId 服务ID
 */
function getSearchableServName(sId) {
	var res = FireFly.getCache("SY_SERV_SEARCH",FireFly.dictData);
	var returnValue = "";
	var len = res.CHILD.length;
	var i = 0;
    for (i;i<len;i++) {
    	if (res.CHILD[i].ID == sId) {
			returnValue = res.CHILD[i].NAME;
			break;
		}
    }
	return returnValue;
};

//+---------------------------------------------------  
//| is ends with ?
//+---------------------------------------------------  
function  endsWith(s1,s2)  
{  
    if(s1.length<s2.length)  
      return   false;  
    if(s1==s2)  
      return   true;  
    if(s1.substring(s1.length-s2.length)==s2)  
        return   true;  
    return   false;  
};


function startsWith(s1,s2)  
{  
	if ( null == s1 || "" == s1) 
		return false;
	  if(s1.length<s2.length)  
	        return   false;  
	      if(s1==s2)  
	        return   true;  
	      if(s1.substring(0,s2.length)==s2)  
	          return   true;  
	      return   false;  
};
