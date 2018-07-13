/** 列表页面渲染引擎 */
GLOBAL.namespace("rh.vi");
/* 
 * @ author chenwenming
 * 平台扩展的listExpanderView，用于展示列表展开的子列表
 * */
rh.vi.listExpanderView = function(options) {
	var defaults = {
		"id": "viListExpanderView",
		"sId":"",//服务ID
		"pId":null,
		"pCon":null,
		"parHandler":null,//主卡片的句柄,
		"selectView":false,//查询选择标识
		"readOnly":true,//页面只读标识
		"replaceNavItems":null //替换左侧树导航定义字段
	};
	this.opts = jQuery.extend(defaults,options);
	//PK值
	this._pkCode = this.opts[UIConst.PK_KEY] || "";
	this.contentMain = jQuery();
	this._readOnly = this.opts.readOnly;
	//父handler
	this._parHandler = options.parHandler;
	
	//mainData
	this._data = this.opts.mainData;
	//如果未传值mainData，则根据sId去取
	if(!this._data){
		if(this.opts.sId){
			this._data = FireFly.getCache(this.opts.sId,FireFly.servMainData);
		}
	}
	
	//行数据
	this._rowData = this.opts.rowData;
	if(!this._rowData){
		if(this._pkCode){
			this._rowData = FireFly.byId(this._data.SERV_ID,this._pkCode);
		}
	}
	
	//组合ID，保证唯一
	this.id = this._data.SERV_ID+"-"+this._rowData[UIConst.PK_KEY];
	
	//@author chenwenming 关联功能信息
	this._linkServ = this._data.LINKS || {};//关联功能信息
	//@author chenwenming 记录所有的子表
	this._sonTab = {};
};
/*
 * 渲染列表主方法
 */
rh.vi.listExpanderView.prototype.show = function() {
	//整体布局
	this._layout();
	//主体渲染
	this._onRender();
	//渲染后执行
	this._afterLoad();
};
/*
 * 构建列表页面布局
 */
rh.vi.listExpanderView.prototype._layout = function() {
	//默认布局
	var pCon = this.opts.pCon;
	//内容区域
	this.content = jQuery("<div></div>");
	//子ListView渲染区域
	this.contentMain = jQuery("<div></div>").appendTo(this.content);
	this.content.appendTo(pCon);
};

/*
 * 构建子listView
 */
rh.vi.listExpanderView.prototype._onRender = function() {
	var _self = this;
    //第一个子表的标签链接
	_self.sonFirstA = null;
    var tempUL = null;
    
    /* 
     * 遍历关联服务
     */
	jQuery.each(this._linkServ,function(i,n) {
	  //判断是否列表动态展开，如果为“是”，则渲染，否则跳过
	  if (n.LINK_MAIN_LIST != "1") {
		  return;
	  }
	  
	  var sonTabId = GLOBAL.getUnId(_self.id,n.LINK_SERV_ID);
	  //渲染关联服务的tab区域
   	  var tempA = jQuery("<a></a>").attr("href","#" + sonTabId).append(n.LINK_NAME);
   	  var tempLi = jQuery("<li></li>").attr("sid",n.LINK_SERV_ID).append(tempA);
   	  var tempCon = jQuery("<div></div>").attr("id",sonTabId).addClass("rhCard-sonTab");
   	  //判断明细区是否已加入ul标签
  	  if (_self.contentMain.children() == null || _self.contentMain.children().length < 1) {//第一个
  	  	  tempUL = jQuery("<ul></ul>").addClass("tabUL tabUL-bottom").appendTo(_self.contentMain);
  	  	  //覆盖.rhCard-tabs .ui-tabs-nav下的padding-left:10px属性
  	  	  tempUL.css({ "padding-left": "0px"})
  	  	  _self.sonFirstA = tempA;
  	  } 
  	  tempLi.addClass("rhCard-tabs-bottomLi").appendTo(tempUL);
  	  tempA.attr("childTabFlag","true");
  	  _self.contentMain.append(tempCon);   	
   	  
  	  //为关联服务的tab绑定单击事件
   	  tempA.bind("click",function() {
          if (_self._sonTab[sonTabId+"-FLAG"]) {
        	  if (n.LINK_REFRESH == 1) {//强制刷新
        		  _self._sonTab[sonTabId].refresh();
        	  }
        	  //重新计算parhandler[rhlistView]高度
		      _self._parHandler._resetHeiWid();
          	  return false;
          }
   	  	  //关联功能构造
   	  	  var linkItem = n.SY_SERV_LINK_ITEM || {};
   	  	  var linkWhere = [];
   	  	  var links = {};
   	  	  var parVal = {};//关联字段值转换成系统变量,供子调用
   	  	  var _readOnly = _self._readOnly;//外层只读设置到局部变量
   	  	  jQuery.each(linkItem, function(i,n) {//生成子功能过滤条件
   	  	  	if (n.LINK_WHERE_FLAG == 1) {
   	  	  		linkWhere.push(" and ");
   	  	  		linkWhere.push(n.LINK_ITEM_CODE);
   	  	  		linkWhere.push("='");
   	  	  		var value = _self._getRowItemValue(n.ITEM_CODE);
   	  	  		if (n.LINK_VALUE_FLAG == 2) {//主单常量值
   	  	  		    value = n.ITEM_CODE;
   	  	  		}
   	  	  		linkWhere.push(value);
   	  	  		linkWhere.push("' ");
   	  	  	}
   	  	  	if (n.LINK_VALUE_FLAG == 1) {//主单数据项值
  	  	    	var value = _self._getRowItemValue(n.ITEM_CODE);
  	  	    	//如果页面上没有，则去links里找一下
  	  	    	if (value == null || value==undefined) {
  	  	    		value = _self._data.LINKS[n.ITEM_CODE];
  	  	    	}
  	  	    	links[n.LINK_ITEM_CODE] = value;
  	  	    	if (_self.form && _self.form.getItem(n.ITEM_CODE) && _self.form.getItem(n.ITEM_CODE).type == "DictChoose") {//字典类型传递关联值处理
  	  	    		links[n.LINK_ITEM_CODE + "__NAME"] = _self.form.getItem(n.ITEM_CODE).getText()
  	  	    	}
  	  	    	var parValId = "@" + n.LINK_ITEM_CODE + "@";
  	  	    	parVal[parValId] = value;
   	  	  	}
   	  	  	if ((n.LINK_WHERE_FLAG == 2) && (n.LINK_VALUE_FLAG == 2)) {//非过滤条件 && 主单常量值
   	  	  		if (n.LINK_ITEM_CODE.toUpperCase() == "READONLY") { //只读参数设置
   	  	  		    _readOnly = n.ITEM_CODE;  //如果有设置则覆盖系统默认值
   	  	  		}
   	  	  	}
   	  	  });

   	  	  //关联服务定义里的过滤条件处理
   	  	  var itemLinkWhere = Tools.itemVarReplace(n.LINK_WHERE,_self._rowData);
   	  	  var linkWhereAll = linkWhere.join("")+ itemLinkWhere;;
   	  	  if (n.LINK_SHOW_TYPE == 3) {//自定义url
   	  		  linkWhereAll = Tools.xdocUrlReplace(linkWhereAll);//如果有doc则替换
   	  	      var frame = _self._bldURLTab({"tabSid":sonTabId,"tabUrl":linkWhereAll,"pCon":tempCon});
		   	  _self._sonTab[sonTabId] = frame;	   	  	  	
   	  	  } else {
   	  		  //必须设定sonTabFlag为"true"，保证正确的重新计算高宽
		   	  var temp = {"sId":n.LINK_SERV_ID,"pCon":tempCon,"showSearchFlag":"false","showTitleBarFlag":"false",
		   	  "linkWhere":linkWhereAll,"linkServQuery":n.LINK_SERV_QUERY,"links":links,"parHandler":_self,"readOnly":_readOnly,"parVar":parVal,
		   	  "showNavTreeFlag" : "false","sortGridFlag":"true","showButtonFlag":"true","sonTabFlag":"true"};
		   	  
		   	  //渲染子listView组件
		      var listView = new rh.vi.listView(temp);
		      listView.show();
		      
		      _self._sonTab[sonTabId] = listView;
   	  	  }
	   	  _self._sonTab[sonTabId+ "-FLAG"] = true;
	   	  //重新计算rhlistView高度
	      _self._parHandler._resetHeiWid();
	   	  return false;
   	  });
   	  
   });
};

/*
 * 页面构造完成后，引擎执行动作
 */
rh.vi.listExpanderView.prototype._afterLoad = function() {
	var _self = this;
	//构建tab
    _self.contentMain.tabs({});
    //覆盖.ui-tabs的min-height:500px属性
    _self.contentMain.css({"min-height":"0px"});
    //默认激活第一个tab
    if(_self.sonFirstA){
    	_self.sonFirstA.click();
    }else{
    	_self.contentMain.append(jQuery("<span>无关联服务</span>"));
    }
}

/*
 * 重置当前页面的高度
 */
rh.vi.listExpanderView.prototype._resetHeiWid = function() {
	var _self = this;
	if (jQuery.isFunction(this.opts.resetHeiWid)) {
		_self.opts.resetHeiWid.call(_self.opts.parHandler);
	} else {
	    jQuery(document).ready(function(){
	    	setTimeout(function() {
	    		if (_self.opts.parHandler) {
	    			//调用rhListView的方法
	    			_self.opts.parHandler._resetHeiWid();
	    		}
	    	},0);
	    });
	}
};

/*
 * 构造tab的关联自定义url
 */
rh.vi.listExpanderView.prototype._bldURLTab = function(opts) {
   var tabSid = opts.tabSid;
   var tabUrl = opts.tabUrl;
   var tabPCon = opts.pCon;
   var frame = jQuery("<iframe border='0' frameborder='0'></iframe>").attr("id",tabSid + "-tabsIframe").attr("width","100%")
	.attr("height",600).attr("src",tabUrl);
   frame.appendTo(tabPCon);
   return frame;
};

/**
 * @author chenwenming
 * 获取某条记录的某个字段值
 * @param itemCode 字段名
 */
rh.vi.listExpanderView.prototype._getRowItemValue = function(itemCode) {
  	var iText = "";
	if(!iText){
		iText = this._rowData[itemCode];
	}
    return iText;
};

/*
 * 获取父句柄
 */
rh.vi.listExpanderView.prototype.getParHandler = function() {
    return this._parHandler;
};