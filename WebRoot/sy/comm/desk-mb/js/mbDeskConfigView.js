/** 工作台页面渲染引擎 */
GLOBAL.namespace("mb.vi");
mb.vi.deskConfig = function(options) {
   var defaults = {
		"id":options.id + "-miDeskConfigView"
	};
   this.opts = jQuery.extend(defaults,options);
   this._source = this.opts.source || "";
   this.iconData = {};
   this._pCon = this.opts.pCon;
};
/*
 * 构造所有
 */
mb.vi.deskConfig.prototype.show = function() {
   this._initMainData();
   this._bldLayout();
   this._afterLoad();
};

mb.vi.deskConfig.prototype._initMainData = function() {
	var _self = this;
	var datas = FireFly.getMenu().TOPMENU;
	if (datas) {
		var i = 0;
		var len = datas.length;
	    for (i; i < len; i++) {
	    	this._getLeafData(datas[i]);
	    }
	}
	//临时增加一些图标
//	_self.iconData["jianbao"] = {"ID":"jianbao","DSICON":"jianbao","INFO":"","NAME":"简报","AREA":"4"};
//	_self.iconData["anjian"] = {"ID":"anjian","DSICON":"anjian","INFO":"","NAME":"案件","AREA":"4"};
//	_self.iconData["bangongjianbao"] = {"ID":"bangongjianbao","DSICON":"bangongjianbao","INFO":"","NAME":"办公简报","AREA":"4"};
//	_self.iconData["banwenbanshi"] = {"ID":"banwenbanshi","DSICON":"banwenbanshi","INFO":"","NAME":"办文办事","AREA":"4"};
//	_self.iconData["chuanzhen"] = {"ID":"chuanzhen","DSICON":"chuanzhen","INFO":"","NAME":"传真","AREA":"4"};
//	_self.iconData["cuidu"] = {"ID":"cuidu","DSICON":"cuidu","INFO":"","NAME":"催督办","AREA":"4"};
//	_self.iconData["dashiji"] = {"ID":"dashiji","DSICON":"dashiji","INFO":"","NAME":"大事记","AREA":"4"};
//	_self.iconData["diaoyan"] = {"ID":"diaoyan","DSICON":"diaoyan","INFO":"","NAME":"调研","AREA":"4"};
//	_self.iconData["feiyong"] = {"ID":"feiyong","DSICON":"feiyong","INFO":"","NAME":"费用","AREA":"4"};
//	_self.iconData["genzong"] = {"ID":"genzong","DSICON":"genzong","INFO":"","NAME":"动态跟踪","AREA":"4"};
//	_self.iconData["gongwei"] = {"ID":"gongwei","DSICON":"gongwei","INFO":"","NAME":"工位","AREA":"4"};
//	_self.iconData["gongwen"] = {"ID":"gongwen","DSICON":"gongwen","INFO":"","NAME":"公文","AREA":"4"};
//	_self.iconData["guanhuai"] = {"ID":"guanhuai","DSICON":"guanhuai","INFO":"","NAME":"企业关怀","AREA":"4"};
//	_self.iconData["xiangmu"] = {"ID":"xiangmu","DSICON":"xiangmu","INFO":"","NAME":"项目管理","AREA":"4"};
//	_self.iconData["xinfang"] = {"ID":"xinfang","DSICON":"xinfang","INFO":"","NAME":"信访","AREA":"4"};
//	_self.iconData["xinwen"] = {"ID":"xinwen","DSICON":"xinwen","INFO":"","NAME":"新闻","AREA":"4"};
//	_self.iconData["yinpin"] = {"ID":"yinpin","DSICON":"yinpin","INFO":"","NAME":"音频管理","AREA":"4"};
//	_self.iconData["yinzhang"] = {"ID":"yinzhang","DSICON":"yinzhang","INFO":"","NAME":"印章管理","AREA":"4"};
//	_self.iconData["zongwu"] = {"ID":"zongwu","DSICON":"zongwu","INFO":"","NAME":"总务","AREA":"4"};
	_self.iconData["doc"] = {"ID":"doc","DSICON":"wenku","INFO":"SY_PLUG_DOC","NAME":"文档中心","DSNAME":"文档中心","AREA":"4"};
	_self.iconData["zhidao"] = {"ID":"zhidao","DSICON":"zhidao","INFO":"SY_PLUG_ZHIDAO","NAME":"软虹知道","DSNAME":"软虹知道","AREA":"4"};	
	
	
	
	
	//获取个性化的设置
	var userCode = System.getUser("USER_CODE");
	_self.deskApps = null;
	var desk = {};
	desk["_NOPAGE_"] = true;
	desk["_searchWhere"] = " and S_USER='" + userCode + "'"
	var icons = FireFly.getListData("SY_ORG_USER_DESK_MB",desk);
	if (icons._DATA_[0]) {
		this.deskSetPK = icons._DATA_[0].SD_ID;
		var apps = icons._DATA_[0].SD_APPS;
		var backImg = icons._DATA_[0].SD_BACK_IMG;
		if (jQuery.trim(apps).length > 0) {
			_self.deskApps = jQuery.trim(apps).split(",");
		}
		if (jQuery.trim(backImg).length > 0) {
			_self.backImg = jQuery.trim(backImg);
		}
	}
};
mb.vi.deskConfig.prototype._bldLayout = function() {
	var _self = this;
	//默认布局
	this.top = jQuery("<div></div>").addClass("mbTopBar").appendTo(this._pCon);
	
	var table = jQuery("<table class='mbTopBar-table'></table>").appendTo(this.top);
    var tr = jQuery("<tr></tr>").appendTo(table);
	var left = jQuery("<td class='mbTopBar-left'></td>").appendTo(tr);
	var center = jQuery("<td class='mbTopBar-center'></td>").appendTo(tr);
	this.right = jQuery("<td class='mbTopBar-right'></td>").appendTo(tr);
	if (this._source != "app") {
		this.back = jQuery("<div>返回</div>").addClass("mbTopBar-back").appendTo(left); 
		left.bind("click",function() {
			var url = FireFly.getContextPath() + "/sy/comm/desk-mb/desk-mb.jsp";		
			window.location.href = url;
		});
	}
    jQuery("<div></div>").text("添加桌面应用").addClass("mbTopBar-title").appendTo(center);
    this._refresh = jQuery("<div>保存</div>").addClass("mbTopBar-refresh").appendTo(this.right);	
    this.right.bind("click",function() {
    	_self._save();
    });
    this.bottom = jQuery("<div></div>").addClass("mbBotBar mbCard-btnBar").appendTo(this._pCon);
    
    var nodeCon = jQuery("<div></div>").addClass("mbBotBar-con").addClass("mbConfig-con").appendTo(this.bottom);
	var node = jQuery("<div></div>").addClass("mbBotBar-node").addClass("mbConfig-node mbConfig-node-active").appendTo(nodeCon);
	var iconStr = "mb-btn-default";
	var icon = jQuery("<div></div>").addClass("mbBotBar-node-icon " + iconStr).appendTo(node);
	var tex = jQuery("<div></div>").addClass("mbBotBar-node-text").appendTo(node);
	tex.text("添加桌面应用");
	nodeCon.bind("mousedown",function() {
		jQuery(".mbTopBar-title").text("添加桌面应用");
		_self._deskAppSet();
	});
	//桌面背景设置按钮
	var deskNodeCon = jQuery("<div></div>").addClass("mbBotBar-con").addClass("mbConfig-con").appendTo(this.bottom);
	var deskNode = jQuery("<div></div>").addClass("mbBotBar-node").addClass("mbConfig-node").appendTo(deskNodeCon);
	var deskSet = jQuery("<div></div>").addClass("mbBotBar-node-icon " + iconStr).appendTo(deskNode);
	var deskSetText = jQuery("<div></div>").addClass("mbBotBar-node-text").appendTo(deskNode);
	deskSetText.text("桌面背景设置");
	deskNodeCon.bind("mousedown",function() {
		jQuery(".mbConfig-node-active").removeClass("mbConfig-node-active");
		jQuery(".mbTopBar-title").text("设置桌面背景");
		_self._deskBackSet();
	});
	//
    _self._deskAppSet();
};
mb.vi.deskConfig.prototype._getLeafData = function(data) {
	var _self = this;
	var child = data.CHILD;
	if (child) {
		var i = 0;
		var len = child.length;
	    for (i; i < len; i++) {
	    	_self._getLeafData(child[i]);
	    }
	} else {
		var id = data.ID;
		var name = data.NAME;
		var area = data.AREA || "";
		if (area.indexOf('4') >= 0) {//手机显示
			_self.iconData[id] = data;
		}
	}
	
};
mb.vi.deskConfig.prototype._deskAppSet = function() {
	var _self = this;
	jQuery(".mbDesk-config-backCon").hide();
	if (jQuery(".mbDesk-config-appCon").length == 1) {
		jQuery(".mbDesk-config-appCon").show();
		return true;
	}
    var container = jQuery("<div></div>").addClass("mbDesk-container mbDesk-config-appCon");
    var i = 0;
    var selfMenu = _self.deskApps;//自定义的应用

	jQuery.each(_self.iconData,function(i,n) {
		var item = n;
		_self._bldOneApp(item).appendTo(container);    		
	});

    container.appendTo(jQuery("body"));
    
    jQuery(".mbDesk-config-appCon").sortable({
		items: ".mbDesk-block",
		revert: false,
		sort: function() {
		},
	    stop: function(e, ui) {
        }
	 });
};
/*
 * 根据item组合一个app
 */
mb.vi.deskConfig.prototype._bldOneApp = function(item) {
   var _self = this;
   var id = item.ID;
   var name = item.DSNAME;
   if (name.length > 4) {
	   name = name.substring(0,4) + ".";
   }
   var block = jQuery("<div align=center></div>").addClass("mbDesk-block");
   block.attr("sid",item.INFO);
   block.attr("info",item.INFO);
   var icon = item.DSICON;
   if (icon.length == 0) {
	   icon = "default";
   }
   jQuery("<img></img>").addClass("mbDesk-block-img").attr("src",FireFly.getContextPath() + "/sy/comm/desk-mb/img/" + icon + ".png").appendTo(block);
   jQuery("<div></div>").addClass("mbDesk-block-text").text(name).appendTo(block);   
   var sel = jQuery("<div></div>").attr("iconid",id).addClass("mbDesk-config-select").appendTo(block);
   if (_self.deskApps && (_self.deskApps.length > 0) && (jQuery.inArray(id, _self.deskApps) > -1)) {//有个性设置
	   sel.addClass("mbDesk-block-select");
   } else if (_self.deskApps == null) {
	   sel.addClass("mbDesk-block-select");
   }
   block.bind("click",function() {
	   var obj = jQuery(this).find(".mbDesk-config-select");
	   if (obj.hasClass("mbDesk-block-select")) {
		   obj.removeClass("mbDesk-block-select");
	   } else {
		   obj.addClass("mbDesk-block-select");
	   }
   });
   return block;
};
mb.vi.deskConfig.prototype._deskBackSet = function() {
	var _self = this;
	jQuery(".mbDesk-config-appCon").hide();
	if (jQuery(".mbDesk-config-backCon").length == 1) {
		jQuery(".mbDesk-config-backCon").show();
		return true;
	}
	var contianer = jQuery("<div></div>").addClass("mbDesk-container mbDesk-config-backCon");
	var tempData = [{"id":"mbDesk-back-red"},{"id":"mbDesk-back-blue"},{"id":"mbDesk-back-gray"},{"id":"mbDesk-back-black"},{"id":"mbDesk-back-green"},
	                {"id":"mbDesk-back-yellow"},{"id":"mbDesk-back-snowGray"},{"id":"mbDesk-back-snowQing"},{"id":"mbDesk-back-snowRed"},
	                {"id":"mbDesk-back-lineBlue"},{"id":"mbDesk-back-lineYellow"},{"id":"mbDesk-back-snowNav"},{"id":"mbDesk-back-snowPurple"}];
	jQuery.each(tempData,function(i,n) {
		var block = jQuery("<div></div>").addClass("mbDesk-config-back " + n.id).appendTo(contianer);
 	    var obj = jQuery("<div></div>").addClass("mbDesk-config-select").appendTo(block);
 	    obj.addClass("mbDesk-back-select");
 	    obj.attr("backclass",n.id);
 	    block.bind("mousedown",function(event) {
 	    	jQuery(".mbDesk-back-select").not(jQuery("." + n.id)).removeClass("mbDesk-back-selectFlag");
 	    	jQuery(".mbDesk-back-select").not(jQuery("." + n.id)).hide();
 	    	var select = block.find(".mbDesk-back-select");
 	    	if (select.hasClass("mbDesk-back-selectFlag")) {
 	    		select.hide();
 	    		select.removeClass("mbDesk-back-selectFlag");
 	    	} else {
 	    		select.show();
 	    		select.addClass("mbDesk-back-selectFlag");
 	    	}
 	    });
	});
	contianer.appendTo(jQuery("body"));
	jQuery("." + _self.backImg).find(".mbDesk-config-select").show().addClass("mbDesk-back-selectFlag");
};
mb.vi.deskConfig.prototype._afterLoad = function() {
	
};
mb.vi.deskConfig.prototype._save = function() {
	var _self = this;
	var flag = false;
	var data = {};
	data[UIConst.PK_KEY] = this.deskSetPK;
	if (jQuery(".mbDesk-config-appCon:visible").length == 1) {
		var icons = jQuery(".mbDesk-block-select");
		var array = [];
		jQuery.each(icons,function(i,n) {
			var iconid = jQuery(n).attr("iconid");
			array.push(iconid);
		});
		data["SD_APPS"] = array.join(",");
	} else if (jQuery(".mbDesk-config-backCon:visible").length == 1) {
		var icons = jQuery(".mbDesk-back-select:visible");
		var backclass = icons.attr("backclass");
		data["SD_BACK_IMG"] = backclass;
	}
    var res = FireFly.doAct("SY_ORG_USER_DESK_MB","save",data,false);    
    if (res[UIConst.PK_KEY] && res[UIConst.PK_KEY].length > 0) {
	   	this.deskSetPK = res[UIConst.PK_KEY];
	   	flag = true;
    }
    var tip = res[UIConst.RTN_MSG];
    if (tip.indexOf(UIConst.RTN_OK) == 0) {
    	if (tip == UIConst.RTN_OK) {
            tip = "操作成功！";
    	} else {
    		tip = tip.substring(3);
    	}
	   	_self.showTip(tip);
    } else if (tip.indexOf(UIConst.RTN_ERR) == 0) {
    	if (tip == UIConst.RTN_ERR) {
            tip = "操作错误！";
    	} else {
    		tip = tip.substring(6);
    	}
    	_self.showTipError(tip);
    } 
    return flag;
	
};
mb.vi.deskConfig.prototype.showTip = function(msg) {
	 var _self = this;
    var tip = jQuery("<div></div>").text(msg).addClass("mbTopBar-tip mb-radius-9").appendTo(jQuery("body"));
    setTimeout(function() {
   	 tip.remove();
    },4000);
};
mb.vi.deskConfig.prototype.showTipError = function(msg) {
	var _self = this;
   var tip = jQuery("<div></div>").text(msg).addClass("mbTopBar-tip-error mb-radius-9").appendTo(jQuery("body"));
   setTimeout(function() {
  	    tip.remove();
   },4000);
};