/** 表格grid组件 */
GLOBAL.namespace("mb.ui");
mb.ui.grid = function(options) {
	var defaults = {
        "id":options.sId + "mbGrid",
        "parHandler":null,
        "type":""
	};	
	this._opts = jQuery.extend(defaults,options);
	this._id = this._opts.id;
	this._parHandler = this._opts.parHandler;
	this._pCon = this._opts.pCon;
    
	//@TODO:将数据获取放到view里
	this._lData =  options.listData._DATA_ || {};
	this._lPage = options.listData._PAGE_ || {};
	this._data = options.mainData || {};
	this._cols = options.listData._COLS_ || {};
	this._items = this._data.ITEMS;
	this._dicts = this._data.DICTS || {};

	//系统变量到临时变量
	this._FITEM_ELEMENT_FILE = UIConst.FITEM_ELEMENT_FILE;  
	//列表的单选、多选
	this._TYPE_SIN = UIConst.TYPE_SINGLE; 	
	this._TYPE_MUL = UIConst.TYPE_MULTI; 
	this.type = this._opts.type; //查询选择列表的单选多选，默认为单选
	this.one = UIConst.STR_YES;
	this.two = UIConst.STR_NO;
    this.lTitle = UIConst.ITEM_MOBILE_LTITLE; 					/* 移动列表标题 */
    this.lItem = UIConst.ITEM_MOBILE_LITEM;    					/* 移动列表项 */
    this.cItem = UIConst.ITEM_MOBILE_CITEM;					    /* 移动卡片项 */
    this.cHidden = UIConst.ITEM_MOBILE_CHIDDEN;    				/* 移动卡隐藏项 */
    this.lTime = UIConst.ITEM_MOBILE_LTIME;					    /* 列表时间项 */
    this.lImg = UIConst.ITEM_MOBILE_LIMG;					    /* 列表图片项 */
    
    this.lData = {};//以pk为key的行数据集合
};
/*
 * 表格渲染方法，入口
 */
mb.ui.grid.prototype.render = function() {
	var _self = this;
	this._bldGrid().appendTo(this._pCon);
	this._bldPage().appendTo(this._pCon);
	this._afterLoad();
};
/*
 * 构建表格，包括标题头和数据表格
 */
mb.ui.grid.prototype._bldGrid = function() {
	this._table = jQuery("<table></table>").attr("id",this._id).addClass("mbGrid mb-shadow-6");
	this._table.append(this._bldBody());

	return this._table;
};
/*
 * 构建表格体
 */
mb.ui.grid.prototype._bldBody = function() {
	var _self = this;
	var preAllNum = parseInt(this._lPage.SHOWNUM)*(parseInt(this._lPage.NOWPAGE)-1);
	var trs = [];

	jQuery.each(this._lData,function(i,n) {
		var nextPageNum = preAllNum + i;
		_self.lData[n._PK_] = n;
		trs.push("<tr class='mbGrid-tr'>");
		trs.push(_self._bldBlock(nextPageNum,i,n));
		trs.push("</tr>");
	});	

	return trs.join("");
};
/*
 * 构建表格体区块
 */
mb.ui.grid.prototype._bldBlock = function(nextPageNum,index,trData) {
	var _self = this;
	var tdLeft = [];
	var left = [];

	var tdRight = [];
	
	var one = [];
	var two = [];
	var icon = [];
	var checkes = []; //复选框按钮
	one.push("<div>");//第一行
	two.push("<div>");//第二行
	if(_self.type == _self._TYPE_MUL){
		checkes.push("<span class='mb-icon-check'></span>");
	}
	icon.push("<span class='mb-icon-span mb-right-nav'></span>");
	var pkCode = trData._PK_;
	jQuery.each(this._cols,function(i,m) {
        var itemCode = m.ITEM_CODE;
        var itemWeight = m.ITEM_WEIGHT;
        var listFlag = m.ITEM_LIST_FLAG;
        var value = trData[itemCode];
        if (listFlag == 1) {
        	//通过item获取cols的详细信息
        	var tempN = null;
        	var code = itemCode;
        	var _code = "";
        	if (itemCode.indexOf("__NAME") > 0) {
        		var code = itemCode.substring(0,itemCode.indexOf("__NAME"));
        		_code = code;
        	}
        	if (itemCode.indexOf("__IMG") > 0) {
        		return true;
        	}
        	tempN = _self._items[code];	
        	var mbType = tempN.ITEM_MOBILE_TYPE;
        	if (mbType == _self.lTitle) {//标题项
        		one.push("<span class='mbGrid-td-weight mbGrid-td-title'");
        		if (code.length > 0) {
            		one.push(" code='");
            		one.push(code);
            		one.push("'");
        		}
        		one.push(">");
        		//value = Tools.systemVarReplace(value);//替换系统变量
        		one.push(value);
        		one.push("</span>");
        	} else if (mbType == _self.lItem) {//列表项
        		two.push("<span class='mbGrid-td-span'");
        		if (code.length > 0) {
        			two.push(" code='");
            		two.push(code);
            		two.push("'");
        		}
        		two.push(">");
        		two.push(value);
        		two.push("</span>");
        	}  else if (mbType == _self.lTime) {//时间差项
    			value = _self._timeDiff(value);
        		two.push("<span class='mbGrid-td-span mbGrid-td-time'");
        		two.push(">");
        		two.push(value);
        		two.push("</span>");
    		} else if (mbType == _self.lImg) {//图片显示项
    			if (itemCode.indexOf("__NAME") > 0) {
    				var temp = trData[code + "__IMG"];
    				var array = temp.split(";");
    				var node = array[0].split(",");
    				var imgId = node[0];
    				var imgName = node[2];
    				var src = FireFly.getContextPath() + "/file/" + imgId;
    				if (imgId.length == 0) {
    					src = FireFly.getContextPath() + "/sy/theme/default/images/mb/default.png";
    				}
    				left.push("<img class='mbGrid-td-img mb-bottom-right-radius-6' src='");
    				left.push(src);
    				left.push("'/>");
    				left.push("<div class='mbGrid-td-img-title'>");
    				left.push(value);
    				left.push("</div>");    				
    			}  else {
    				var temp = trData[code];
    				var array = temp.split(";");
    				var node = array[0].split(",");
    				var imgId = node[0];
    				var imgName = node[2];
    				var src = FireFly.getContextPath() + "/file/" + imgId;
    				if (imgId.length == 0) {
    					src = FireFly.getContextPath() + "/sy/theme/default/images/mb/default.png";
    				}
    				left.push("<img class='mbGrid-td-img mb-bottom-right-radius-6' src='");
    				left.push(src);
    				left.push("'/>");
    			}
    		}
        }
	});

	if (left.length > 0) {
		tdLeft.push("<td  class='mbGrid-td-left'>");
		tdLeft.push(left.join(""));
		//tdLeft.push("<img class='mbGrid-td-img mb-bottom-right-radius-6' src='/file/1lJZrnzChcNVPZV3b5_oqZ.jpg'/>");
		//tdLeft.push("<div class='mbGrid-td-img-title'>李延伟</div>");
		tdLeft.push("</td>");
	}
	
	one.push("</div>");
	two.push("</div>");
	
	tdRight.push("<td class='mbGrid-td-right'");
	tdRight.push("  pk='");
	tdRight.push(pkCode);
	tdRight.push("'>");
	tdRight.push(checkes.join(""));
	tdRight.push(one.join(""));
	tdRight.push(two.join(""));
	tdRight.push(icon.join(""));
	tdRight.push("</td>");

	return tdLeft.join("") + tdRight.join("");
};
/*
 * 构建翻页
 */
mb.ui.grid.prototype.getBlocks = function() {
	var _self = this;
	return this._table.find(".mbGrid-td-right");
};
/*
 * 行点击事件,供外部调用
 */
mb.ui.grid.prototype.click = function(func,parSelf) {
	var _self = this;
    this.getBlocks().unbind("click").bind("click",function(event) {
		var node = jQuery(this);
//		var inFlag = node.data("inFlag");
//    	if ((node.attr("class") != "rowIndex") && (node.attr("class") != "checkTD") && (inFlag != false)) {
//    		var pkCode = node.attr("pk");
//			func.call(parSelf,pkCode,_self.lData[pkCode]);
//		    return false; 
//    	}
    	if ((node.attr("class") != "rowIndex") && (node.attr("class") != "checkTD")) {
    		var pkCode = node.attr("pk");
			func.call(parSelf,pkCode,_self.lData[pkCode],jQuery(this));
		    return false; 
    	}
	});
};
/*
 * 构建翻页
 */
mb.ui.grid.prototype._bldPage = function() {
	var _self = this;
	this.more = jQuery("<div></div>").addClass("mbGrid-more");
	this.more.html("<span>查看更多</span>");
	this.more.bind("click",function() {
		_self._nextPage();
	});
	jQuery("<span></span>").addClass("mbGrid-more-icon mb-down-nav").appendTo(this.more);
	return this.more;
};
/*
 * 加载完毕提示
 */
mb.ui.grid.prototype._recordOverTip = function() {
	var _self = this;
	this.overTip = jQuery("<div></div>").addClass("mbGrid-overTip");//mb-radius-bottom-20 
	var dataLen = this._lData.length || 0;
	var tipText = "全部数据已加载！";
	if (dataLen == 0) {
		tipText = "无相关记录！";
	}
	this.overTip.text(tipText);
	var toTop = jQuery("<span>回到顶部</span>").addClass("mbGrid-toTop").appendTo(this.overTip);
	toTop.bind("click",function() {
		window.scrollTo(0,0);
	});
	return this.overTip.appendTo(this._pCon);
};
/*
 * 下一页
 */
mb.ui.grid.prototype._nextPage = function() {
	var nextPage = parseInt(this._lPage.NOWPAGE) + 1;
	var pages = parseInt(this._lPage.PAGES);
	this._lPage.NOWPAGE = "" + ((nextPage > pages) ? pages:nextPage);
	var data = {"_PAGE_":this._lPage};
    this._parHandler.morePend(data);
};
/*
 * 将更多添加到列表
 */
mb.ui.grid.prototype._morePend = function(listData) {
	this._lData =  listData._DATA_ || {};
	this._lPage = listData._PAGE_ || {};
	this._table.append(this._bldBody());
	this._afterLoad();
};
/*
 * 获取时间差
 */
mb.ui.grid.prototype._timeDiff = function(time) {
	var res = "";
	var myDate = new Date();

	res = -rhDate.dateDiff("d",time);
    if (res == 0) {//当天
    	res = -rhDate.dateDiff("h",time);
    	if (res == 0) {//当小时
    		res = -rhDate.dateDiff("n",time);
    		if (res == 0) {//当分钟
    			res = -rhDate.dateDiff("s",time) + "秒种前";
    		} else {
            	res += "分钟前";
            }
    	} else {
        	res += "小时前";
        }
    } else if (res <= 2){
    	res += "天前";
    } else {
    	res  = time;
    }			
	return res;
};
/*
 * 加载后执行
 */
mb.ui.grid.prototype._afterLoad = function() {
	var _self = this;
    var nowPage = this._lPage.NOWPAGE;
    var pages = this._lPage.PAGES;
    if (nowPage == pages) {
    	_self.more.hide();
    	_self._recordOverTip();
    }
};
mb.ui.grid.prototype.unbindTrClick = function() {
	var _self = this;
	this.getBlocks().unbind("click");
};
/*
 * 获取选中行的某字段值，如：[22,33,44]
 */
mb.ui.grid.prototype.getSelectItemValues = function(itemCode,html) {
	var _self = this;
	var temp = [];
    var sels = this.getCheckBox();
    jQuery.each(sels,function(i,n) {
      	if(jQuery(n).hasClass("mb-icon-checked")) {
      		var iText = "";
      		var iObj = jQuery("span[code='" + itemCode + "']",jQuery(n).parent());
      		if(iObj.attr("ifile")) {
      		  iText = iObj.attr("ifile");
      		} else if(iObj.attr("title")) {//如果服务定义中某字段设置了列表格式参数，则获取构造完的tr标签中的'title'属性值作为未格式化前的原始数据
			  iText = iObj.attr("title");
      		} else {
      		  if (html) {
      			  iText = iObj.html();
      		  } else {
      			  iText = iObj.text();
      		  }
      		}
      		temp.push(iText);
      	}
    });
    return temp;
};
/*
 * 获取checkbox复选框对象
 */
mb.ui.grid.prototype.getCheckBox = function(){
	return jQuery(".mb-icon-check");
};
/*
 * 获取某行的某个字段值
 * @param pkCode 记录ID
 * @param itemCode 字段名
 */
mb.ui.grid.prototype.getRowItemValue = function(pkCode,itemCode) {
  	var iText = "";
  	var iObj = this.getRowItem(pkCode,itemCode);
	if(iObj.attr("ifile")) {
	  iText = iObj.attr("ifile");
	} else if (iObj.find(".batchModify").length > 0) {//批量编辑获取batchModify里的值
	  iText = iObj.find(".batchModify").val();
	} else {
	  iText = iObj.text();
	}
    return iText;
};
/*
 * 获取某行的某个字段TD对象
 * @param pkCode 记录ID
 * @param itemCode 字段名
 */
mb.ui.grid.prototype.getRowItem = function(pkCode,itemCode) {
	return this._bldGrid().find("td[pk='" + pkCode + "']").find("span[code='" + itemCode + "']");
};
















