/** 手机卡片页面渲染引擎 */
GLOBAL.namespace("mb.vi");
mb.vi.cardView = function(options) {
   var defaults = {
		"id":options.sId + "-mbCardView",
		"act":"",
		"sId":"",
		"pCon":null,
		"pId":"",
		"parHandler":null,
		"readOnly":false,
		"saveReturn":false
	};
   this._pkCode = options[UIConst.PK_KEY] || "";
   this.opts = jQuery.extend(defaults,options);
   this.servId = this.opts.sId;
   this._source = this.opts.source; //是否手机app方式
   this._platform = this.opts.platform; //设备系统平台
   this._pCon = this.opts.pCon;
   this._parHandler = this.opts.parHandler;
   this._actVar = this.opts.act;
   this._height = "";
   this._width = "";
   this._parentRefreshFlag = false;
   this._readOnly = this.opts.readOnly;
   this.dialogId = GLOBAL.getUnId("winDialog",this.opts.sId);
   this.tabsId = GLOBAL.getUnId("winTabs",this.opts.sId);
   this._mainTab = GLOBAL.getUnId("mainTab",this.opts.sId);
   // 卡片上的文件组件数组
   this._cardFile = {};
   this.topTitle = null;
};
/*
 * 显示卡片页面，主方法
 */
mb.vi.cardView.prototype.show = function() {
   this._initMainData();
   this._tabLayout();
   this._bldCardLayout();
   this._afterLoad();
};
mb.vi.cardView.prototype._initMainData = function() {
	if(this.opts.servDef){
		this._data = this.opts.servDef;
		FireFly.setCache(this.servId,FireFly.servMainData,this._data);
	}else{
		this._data = FireFly.getCache(this.servId,FireFly.servMainData);
	}
    this._items = this._data.ITEMS; //字段定义信息
    this._linkServ = this._data.LINKS || {};//关联功能信息
    this.servKeys = this._data.SERV_KEYS;
    this._fileFlag = this._data.SERV_FILE_FLAG || 2;
    this.servName = this._data.SERV_NAME || "";
    this._fileFlag = this._data.SERV_FILE_FLAG || 2;
    this._servCardLoad = this._data.SERV_CARD_LOAD || "";//卡片加载js
};
/*
 * 布局卡片tabs和主功能页
 */
mb.vi.cardView.prototype._tabLayout = function() {
    var _self = this;
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

    this.home = jQuery("<div>主页</div>").addClass("mbTopBar-refresh").appendTo(this.right);	
    //this.home.html(UIConst.FONT_STROKE_HOME);
    this.right.bind("click",function() {
    	left.addClass("mbTopBar-backActive");
    	//_self.home.html(UIConst.FONT_STROKE_LOAD);
    	history.go(-2);
    });
    this.mainContainer = jQuery("<div></div>").addClass("mbCard-container").appendTo(this._pCon);
	if ((this._source == "app") && (this._platform == "Android")) {
		this.home.hide();
		if (this._platform == "Android") {
			this.back.hide();
		}
	} 
};

/*
 * 构建卡片布局，包括form和下方关联的功能
 */
mb.vi.cardView.prototype._bldCardLayout = function() {
	var _self = this;
    this._bldBtnBar();
    this._bldForm();
    if (this._fileFlag == UIConst.YES) {//卡片级文件
    	if (this._data["SERV_SRC_ID"]) {
			this._bldCardFile(this._data["SERV_SRC_ID"]);
    	}
    }

};
/*
 * 构造卡片级文件显示
 */
mb.vi.cardView.prototype._bldCardFile = function(sId) {
	var _self = this;
	var fileData = null;
	if (this._actVar == UIConst.ACT_CARD_MODIFY) {
		fileData = FireFly.getCardFile(sId ? sId : this.servId,this._pkCode,"");
	}
	if (fileData) {
	    //var closeHrStr = "<span class='mbCard-hr-close fontomasRegular'>" + UIConst.FONT_STROKE_close + "</span>";
	    var set = jQuery("<div></div>").addClass("mbCard-form-set").appendTo(_self.mainContainer);
	    var hr = jQuery("<div></div>").html("关联文件").addClass("mbCard-form-hr");
	    set.prepend(hr);
//		hr.bind("click",function() {
//			_self.form._bindHrClick(jQuery(this));
//		});
	    var con = jQuery("<div></div>").addClass("mbCard-file-con mb-shadow-3 mb-radius-9").appendTo(set);
	    var ul = jQuery("<ul></ul>").addClass("mbCard-file-ul").appendTo(con);
	    if (jQuery.isEmptyObject(fileData)) {
	    	jQuery("<span>无关联文件！</span>").appendTo(ul);
	    } else {
	    	jQuery.each(fileData,function(i,n) {
	    		// 通过后缀名找到小图标
	    		var name = n.FILE_NAME;
	    		var icon = Icon[Tools.getFileSuffix(name)];
	    		if (!icon) {
	    			icon = Icon["unknown"];
	    		}
	    		//alert(JsonToStr(n));
	    		var span = "<span class='mbCard-file-icon " + icon + "'></span>";
	    		var a = "<a href='/file/" + n.FILE_ID + "' class='mbCard-file-a'>" + name + "</a>";
	    		
	    		var size = "";
	    		if (parseInt(n.FILE_SIZE) != 0) {
	    			size = Math.ceil(parseInt(n.FILE_SIZE) / 1024) + "KB";
	    		}
	    		var size = "<span class='mbCard-file-size'>" + size + "</span>";
	    		var time = "<span class='mbCard-file-time'>" + n.S_MTIME + "</span>";
	    		var li = jQuery("<li></li>").html(span + a).appendTo(ul);
	    		var extend = jQuery("<div></div>").html(size + time).appendTo(li);
	    	});
	    	
	    }
	}
};
/*
 * 页面构造完成后，引擎执行动作
 */
mb.vi.cardView.prototype._afterLoad = function() {
	var _self = this;
	if (this.topTitle == null) {
		this.servName = this._data.SERV_NAME;
		var title = this.servName;
//		if (title.length > 8) {
//			document.title = title;
//			title = title.substring(0,8) + ".";
//		}
		var center = this.top.find(".mbTopBar-center");
		this.topTitle = jQuery("<div></div>").text(title).addClass("mbTopBar-title").appendTo(center);	
		jQuery("<div>" + title + "</div>").addClass("mbTopBar-title-all mbTopBar-title-all-none").appendTo(jQuery(".mbTopBar"));
		this.topTitle.bind("click",function() {
			var all = jQuery(".mbTopBar").find(".mbTopBar-title-all");
			if (all.hasClass("mbTopBar-title-all-none")) {
				all.fadeIn();
				all.removeClass("mbTopBar-title-all-none");
			} else {
				all.fadeOut();
				all.addClass("mbTopBar-title-all-none");
			}
		});
	}
	//工作流控制
	if (typeof(_self.itemValue("S_WF_INST")) != "undefined" && _self.itemValue("S_WF_INST").length >0 ) {
	    var opts = {};
	    opts["sId"] = this.servId;
	    opts[UIConst.PK_KEY] = this._pkCode;
	    opts["parHandler"] = this;
	    this.wfCard = new mb.vi.wfCardView(opts);
	    this.wfCard.render();
	}
	//_self.home.html(UIConst.FONT_STROKE_HOME);
	this._excuteProjectJS();
};

/*
 * 根据动作绑定相应的方法
 * @param aId 动作ID
 */
mb.vi.cardView.prototype._act = function(aId,aObj) {
	var _self = this;
	var taObj = aObj;
	switch(aId) {
		case UIConst.ACT_SAVE://保存
		    taObj.bind("click",function() {
		    	//taObj.addClass("mbBotBar-nodeActive");
		    	taObj.addClass("mbBotBar-activeColor");
		    	//_self.home.html(UIConst.FONT_STROKE_LOAD);
			    setTimeout(function() {
			     	_self._saveForm();
		     	},0);

		    });  
		    break;
		case "test2"://test
		    taObj.bind("click",function(event) {
		    	var options = {"sId":"SY_ORG_USER"};
//		     	var dict = new rh.vi.rhDictTreeView(options);
//		     	dict.show(event);
		     	var select = new rh.vi.rhSelectListView(options);
		     	select.show(event);
		    });  
		    break;
	}	
};
/*
 * 保存form修改的数据
 */
mb.vi.cardView.prototype._saveForm = function() {
	var _self = this;
	var changeData = _self.form.getModifyData();
    if (jQuery.isEmptyObject(changeData)) {
    	_self.clearActive();
    	this.showTipError("没有修改数据，未做提交！");
    	return false;
    } else { // 有修改才做校验
    }
    if (_self._actVar == UIConst.ACT_CARD_MODIFY) {//修改
     	   changeData[UIConst.PK_KEY] = this._pkCode;	
     	   if (_self.itemValue("S_MTIME")) {
     		   changeData["S_MTIME"] = _self.itemValue("S_MTIME");	
     	   }
     	   var resultData = FireFly.cardModify(_self.servId,changeData);
     	   if (resultData[UIConst.RTN_MSG] && resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
     		   _self.showTip("已保存！");
     	   	   _self._pkCode = resultData[_self.servKeys];
               _self.refresh();
     	   } 
     } else if (_self._actVar == UIConst.ACT_CARD_ADD) {//添加
    	   var resultData = FireFly.cardAdd(_self.opts.sId,changeData);
     	   if (resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
     	   	  _self._pkCode = resultData[_self.servKeys];
     	   	  _self.opts.act = UIConst.ACT_CARD_MODIFY;
     	   	  _self.refresh();
     	   }
     }
     this.clearActive();
 	return true;
};
mb.vi.cardView.prototype.clearActive = function() {
	var _self = this;
    setTimeout(function() {
    	jQuery(".mbBotBar-activeColor").removeClass("mbBotBar-activeColor");
    	//_self.home.html(UIConst.FONT_STROKE_HOME);
    },100);
}
mb.vi.cardView.prototype.showTip = function(msg) {
	 var _self = this;
     var tip = jQuery("<div></div>").text(msg).addClass("mbTopBar-tip mb-radius-9").appendTo(jQuery("body"));
     setTimeout(function() {
    	 tip.remove();
     },4000);
};
mb.vi.cardView.prototype.showTipError = function(msg) {
	var _self = this;
    var tip = jQuery("<div></div>").text(msg).addClass("mbTopBar-tip-error mb-radius-9").appendTo(jQuery("body"));
    setTimeout(function() {
   	    tip.remove();
    },4000);
};
/*
 * 卡片页面与后台交互方法，公用方法
 * @param act 动作ID
 * @param codes 需传递到后台的字段编号，多个以逗号分隔；没有codes，则默认传递所有字段
 * @parem async 是否异步
 */
mb.vi.cardView.prototype.doAct = function(act,codes,reload,extendData,async) {
	var _self = this;
	var datas = {};
	if (codes) {
		datas = this.itemValue(codes);
    }
	datas[UIConst.PK_KEY] = this._pkCode;
	if (extendData) {
		datas = jQuery.extend(datas,extendData);
	}
	
	if(async) {// 异步
		FireFly.doAct(this.opts.sId, act, datas, true, true, function(result){
			if (result[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
		   	    if (reload && reload == true) {
		   	    	_self.refresh();
		   	    }
		    } 
		});
	} else {
	    var result = FireFly.doAct(this.opts.sId, act, datas);
	    if (result[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
	   	    if (reload && reload == true) {
	   	    	_self.showTip(result[UIConst.RTN_MSG].substring(3));
	   	    	_self.refresh();
	   	    }
	    } 
	}
};
mb.vi.cardView.prototype.doActReload = function(act,codes) {
    this.doAct(act,codes,true);
};

/*
 * 构建卡片按钮条
 */
mb.vi.cardView.prototype._bldBtnBar = function() {
    var _self = this;
    this.countBtn = 3;
    this.btns = {};
    this.btnBar = jQuery("<div></div>").addClass("mbBotBar mbCard-btnBar");
    var oneVar = UIConst.STR_YES;
    this.moreBar = jQuery("<div></div>").addClass("mbBotBar-more");
    var moreBtns = {};
    
    var tempData = this._data.BTNS;
	jQuery.each(tempData,function(i,n) {
		if ((n.ACT_TYPE == UIConst.ACT_TYPE_CARD) && n.S_FLAG == oneVar) {//卡片按钮 && 启用
			    var nodeCon = jQuery("<div></div>").addClass("mbBotBar-con");
	        	var node = jQuery("<div></div>").addClass("mbBotBar-node").appendTo(nodeCon);
	        	node.attr("id",GLOBAL.getUnId(n.ACT_CODE,_self.servId));
	        	var iconCss = n.ACT_CSS;
	        	if (iconCss.length == 0) {
	        		iconCss = "default";
	        	}
        		var iconStr = "mb-btn-" + iconCss;
        		var icon = jQuery("<div></div>").addClass("mbBotBar-node-icon " + iconStr).appendTo(node);
        		var tex = jQuery("<div></div>").addClass("mbBotBar-node-text").appendTo(node);
        		tex.text(n.ACT_NAME);
        		_self._act(n.ACT_CODE,node);
        		_self.btns[n.ACT_CODE] = node;
        		if (n.ACT_MEMO.length > 0) {//暂支持少数按钮
        			node.bind("click",function() {
        				var _funcExt = new Function(n.ACT_MEMO);
        				_funcExt.apply(_self);
        			});
        		}
        		_self.addBtn(nodeCon);
		}
	});
    _self.btnBar.appendTo(this.mainContainer);
    _self.moreBar.appendTo(this.mainContainer);
};
/*
 * 下按钮条增加按钮
 */
mb.vi.cardView.prototype.addBtn = function(nodeCon) {
    var _self = this;
    var count = this.btnBar.find(".mbBotBar-node").length;
	if (count < this.countBtn) {
		nodeCon.appendTo(_self.btnBar);
	} else if (count == this.countBtn) {
		var nodeMoreCon = jQuery("<div></div>").addClass("mbBotBar-con");
    	var nodeMore = jQuery("<div></div>").addClass("mbBotBar-node").appendTo(nodeMoreCon);
    	nodeMore.attr("id",GLOBAL.getUnId("more",_self.servId));
    	var icon = jQuery("<div></div>").addClass("mbBotBar-node-icon mb-btn-more").appendTo(nodeMore);
    	var tex = jQuery("<div></div>").addClass("mbBotBar-node-text").appendTo(nodeMore);
    	tex.text("更多");
    	nodeMoreCon.appendTo(_self.btnBar);
    	nodeMore.bind("click",function() {
			jQuery(".mbBotBar-more").show();
		});
    	nodeCon.find(".mbBotBar-node").addClass("mbBotBar-con-more");
    	nodeCon.appendTo(_self.moreBar);
    	var cancel = jQuery("<div>取消</div>").addClass("mbBotBar-more-cancel").appendTo(_self.moreBar);
    	cancel.bind("click",function() {
    		jQuery(".mbBotBar-more").hide();
    	});
	} else {
		nodeCon.find(".mbBotBar-node").addClass("mbBotBar-con-more");
		nodeCon.appendTo(_self.moreBar);
	}
};


/*
 * 构建卡片form，调用mb.ui.form组件
 */
mb.vi.cardView.prototype._bldForm = function() {
    var _self = this;
    //构造Form
    this.formCon = jQuery("<div class='mbCard-formContainer'></div>");
	var opts = {
		"pId":_self.servId + "-form",
		"sId":_self.servId,
		data : this._data,
		"parHandler":_self,
		"readOnly":this._readOnly,
		"pCon":_self.mainContainer 
	}
	this.form = new mb.ui.card(opts);
    this.form.render();
    if (this._actVar == UIConst.ACT_CARD_MODIFY) {
    	var data = FireFly.byId(_self.servId,_self._pkCode);
    	this.form.fillData(data);
    	_self.byIdData = data;
    }
    this.form.afterRender();
};
/*
 * 刷新卡片页面
 */
mb.vi.cardView.prototype.refresh = function() {
	this.mainContainer.empty();
	this._bldCardLayout();
	this._afterLoad();
};


/*
 * 卡片加载后执行工程级js方法
 */
mb.vi.cardView.prototype._excuteProjectJS = function() {
	var _self = this;
	var _self = this;	
    this._servPId = this._data.SERV_PID || "";//父服务ID
    var loadArray = this._data.SERV_CARD_LOAD_NAMES.split(",");
    for (var i = 0;i < loadArray.length;i++) {
    	if (loadArray[i] == "") {
    		return;
    	}
    	load(loadArray[i]);
    }
	function load(value) {
		var pathFolder = value.split("_");
		var lowerFolder = pathFolder[0].toLowerCase();
	    var jsFileUrl = FireFly.getContextPath() + "/" + lowerFolder + "/servjs/" + value + "_card_mb.js";
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
 * 加载的提示信息
 * @param msg 消息
 */
mb.vi.cardView.prototype.cardBarTipLoad = function(msg) {
	Tip.showLoad(msg,null,null,null,this.getNowDom());
};
/*
 * 成功的提示信息
 * @param msg 提示内容
 */
mb.vi.cardView.prototype.cardBarTip = function(msg) {
	this.showTip(msg);
};
/*
 * 错误的提示信息
 * @param msg 提示内容
 */
mb.vi.cardView.prototype.cardBarTipError = function(msg) {
	this.showTipError(msg)
};
/*
 * 清除加载提示信息
 */
mb.vi.cardView.prototype.cardClearTipLoad = function() {
    Tip.clearLoad();
};
/*
 * 区分列表还是卡片
 */
mb.vi.cardView.prototype.getNowDom = function() {
	var _self = this;
    return this.mainUL;
};	
/*
 * 区分列表还是卡片
 */
mb.vi.cardView.prototype.itemValue = function(itemCode) {
	var _self = this;
    return this.form.itemValue(itemCode);
};	
/**
 * 取得SERV_SRC_ID的值
 */
mb.vi.cardView.prototype.getServSrcId = function(){
	var result = this._data.SERV_SRC_ID;
	return result || "";
};
/*
 * 获取业务数据，修改时获取的是业务数据，添加的时候获取的是默认值
 */
mb.vi.cardView.prototype.getByIdData = function(itemCode) {
    var _self = this;
    if (_self._actVar == UIConst.ACT_CARD_MODIFY) {//修改
      return _self.byIdData[itemCode] || "";
    } else if (_self._actVar == UIConst.ACT_CARD_ADD) {//添加
      return _self.byIdData[itemCode] || "";
    }
};
/**
 * 是否存在这样一个关联子服务
 */
mb.vi.cardView.prototype.existSubServ = function() {
	var _self = this;
	var rtnVal = false;
    return rtnVal;
};
/*
 * 重置当前卡片页面的高度，初始化时
 * @bottomHei：列表高度-系统默认列表高度。（当主单下列表的tab切换时调用）
 */
mb.vi.cardView.prototype._resetHeiWid = function() {
	var _self = this;
    return true;
};
/**
 * 设置点击是否刷新主卡片
 * @param servId 服务ID
 * @param bool 布尔值
 */
mb.vi.cardView.prototype.setRefreshFlag = function(servId, bool) {
};
/*
 * 获取字段 中 的 配置 mind中用到
 * @param itemCode 字段编码
 */
mb.vi.cardView.prototype.getItemConfig = function(itemCode) {
    var _self = this;
    var itemConfig = _self._data.ITEMS[itemCode].ITEM_INPUT_CONFIG;
    return itemConfig;
};