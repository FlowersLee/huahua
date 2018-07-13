/** 工作台页面渲染引擎 */
GLOBAL.namespace("rh.vi");
rh.vi.deskView = function(options) {
   var defaults = {
		"id":options.id + "-viDeskView",
		"intervalTime":""
	};
   this.opts = jQuery.extend(defaults,options);
   this.rowAppNum = 8;
   this._intervalTime= this.opts.intervalTime;
   this.s_default_icon = 'oa';  
   this.SCREEN_MAX_APP_NUM = 24;//每页可添加最大数
   this.maskBlockFlag = 1;//1.默认显示无权限区块 2.不显示无权限的图标
   this.toDoAllCount = 0;//待办总数
};
/**
 * 构造所有
 */
rh.vi.deskView.prototype.show = function() {
   this._initMainData();
   this._bldLayout();
   this._bldMoudule();
   this._bldInit();
   this._bldNormal();
   this._afterLoad();
};

/**
 * 准备数据
 */
rh.vi.deskView.prototype._initMainData = function() {
	var _self = this;
	//rh-获取叶子菜单的所有信息
	this.leafMenuModel = parent.Menu.tempLeaf;//全部的叶子服务
	this.deskMenuModel = {};//已显示在桌面上的服务
	this.leftMenuModel = {};//未显示在桌面上的服务
	this.rhTempAlertIconsJson = parent.Menu.alertJson;//设定启用消息提醒的图标
	this.rhTempMinBlockIconsJson = parent.Menu.minBlockJson;//文件夹内的小图标
	//rh-获取当前用户的首页图标定义信息
	var userCode = System.getUser("USER_CODE");
	var data = {};
	data["_NOPAGE_"] = true;
	data["_searchWhere"] = " and S_USER='" + userCode + "'";
	var icons = FireFly.getListData("SY_ORG_USER_DESK_ICON",data);
	var portalIcon = icons._DATA_;
	var iconArray = {};
	this.modules = [];//含分页的图标集合对象
	var leftModules = [];
	var temp = [];
	this.normalUlId = "";//常用图标ul对应的id
	this.normalIcons = "";
	this.normalIconsArray = "";
	if (jQuery.isEmptyObject(portalIcon)) {//初始化时的系统处理
	   var deskShowIcon = parent.Menu.DeskShow;
	   var items = [];
	   var item = {};
	   if(deskShowIcon){
		   var icons = deskShowIcon.split(",");
		   
		   jQuery.each(icons,function(t,y) {
		     if (_self.leafMenuModel[y] != null) {//菜单和首页配置匹配的
		         var temp = _self.leafMenuModel[y];
			     items.push(temp);
			     _self.deskMenuModel[y] = temp;//已显示在桌面上的
		     }
		   });
	   }
	   //含分页的图标集合对象
	   item["items"] = items;
	   _self.modules.push(item);
	} else {   //个性化的系统处理，
		jQuery.each(portalIcon,function(j,m) {//当前用户的首页图标列表数据[常用图标+分页图标]
			var tempIcons = m.PI_SERVS;
			
			var normal = m.PI_NORMAO_ICON;
			if (m.PI_TITLE == "ICONS") {//如果是normal的菜单，获取icon字段
				_self.normalIcons = normal;
				_self.normalUlId = m._PK_;
				tempIcons = m.PI_NORMAO_ICON;
			}
			var icons = tempIcons.split(",");
			var items = [];
			jQuery.each(icons,function(t,y) {
				iconArray[y] = j;
				if (_self.leafMenuModel[y] != null) {//菜单和首页配置匹配的
					var temp = _self.leafMenuModel[y];
					items.push(temp);
					_self.deskMenuModel[y] = temp;//已显示在桌面上的
				}
			});
			if (m.PI_TITLE == "ICONS") {//如果是normal的菜单，不参与分屏显示
				return;
			}
			var item = {};
			item["title"] = m.PI_TITLE;
			item["id"] = m.PI_ID;
			item["items"] = items;
			_self.modules.push(item);//含分页的图标集合对象
		});
	}
	//对没有ICON设置的启用默认常用图标
	if (this.normalUlId.length == 0) {
	    this.normalIcons = parent.Menu.normal;
	    this.normalIconsArray = this.normalIcons.split(",");
	}
	//rh-供页面生成分页的图标集合
	jQuery.each(_self.leafMenuModel,function(i,n) {
		if (_self.deskMenuModel[i] || jQuery.inArray(i, _self.normalIconsArray) > -1) {
			return;
		}
		_self.leftMenuModel[i] = n;//未显示在桌面上的
	});
	var monInterval = 1;
	//获取工作台设置信息
	var setData = FireFly.byId("SY_ORG_USER_DESK",userCode);
	this.deskSetPK = "";
	this.deskImg = "desk_28.jpg";//默认背景图片
	this.selfDeskImg = "";//选中自定义图片
	this.selfDeskImgAll = "";//所有自定义图片
	this.deskScreen = 1; //默认显示屏幕
	this.deskApp = "";//默认应用
	this.deskMsg = 0;//接受消息
	this.deskRing = 0;//接受声音提醒
	if (setData.SD_ID) {
	   this.deskSetPK = setData.SD_ID;
	   // 这块SD_BACK_IMG可能不存在
	   this.deskImg = (setData.SD_BACK_IMG && setData.SD_BACK_IMG.length > 0) ? setData.SD_BACK_IMG:"default.jpg";
	   this.selfDeskImg = setData.SD_SELF_SELECT || "";
	   this.selfDeskImgAll = setData.SD_SELF_DEF;
	   this.deskScreen = (setData.SD_DESK_DEFAULT && setData.SD_DESK_DEFAULT.length > 0) ? setData.SD_DESK_DEFAULT:0;
	   this.deskApp = setData.SD_APP_DEFAULT;
	   this.deskMsg = setData.SD_MSG_FLAG;
	   this.deskRing = setData.SD_RING_FLAG;
	} 
};
/**
 * 创建布局
 */
rh.vi.deskView.prototype._bldLayout = function() {

};
/**
 * 构造桌面图标
 */
rh.vi.deskView.prototype._bldMoudule = function() {

};
/**
 * 构造常用图标
 */
rh.vi.deskView.prototype._bldNormal = function() {
  this._initBottomUse();
};
/**
 * 构造底部码头图标
 */
rh.vi.deskView.prototype._initBottomUse = function() {
	var _self = this;
	var bottomFunc = {};
	var ul = jQuery("<ul></ul>").attr("id",this.normalUlId).addClass("normal-ul").appendTo(jQuery(".normalUse-c"));
	var data = this.normalIcons.split(",");
	jQuery.each(data,function(y,m) {
		var n = _self.leafMenuModel[m];
	    if (n == null) {
	    	return;
	    }
		var li = jQuery("<li></li>").addClass("normal-li").attr("id",n.ID);
		var menuId = n.MENUID;
		var id = n.ID;
		li.attr("type",n.TYPE);
		li.attr("info",n.LEAF);
		li.attr("menu",n.MENU);
		li.attr("menuid",menuId);
		li.attr("title",n.NAME);
		li.attr("icon",n.ICON);
		li.attr("countserv", n.COUNTSERV);
		li.attr("folder", n.FOLDER);
		li.attr("alertserv", n.ALERTSERV);
		if (!menuId) {//无权限时遮罩和显示判断
			if (_self.maskBlockFlag == 2) {
				return;
			}
		}
		var div = jQuery("<div></div>").addClass("img").appendTo(li);;
		var p = jQuery("<p></p>").appendTo(div);
		var img = jQuery("<img src='css/images/app_rh-icons/" + n.ICON + ".png'></img>").appendTo(p);
		var divT = jQuery("<div></div>").addClass("count").appendTo(div);
		divT.attr("id", "count_" + n.ID);
		
	    if (_self.rhTempAlertIconsJson[n.ID]) {//如果当前图标启用消息提醒
	      divT.addClass("countBack"); 
	      divT.attr("liid",n.ID);
	      var countText = 0;
		  var countA = jQuery("<a></a>").addClass("countBack-a");
		  jQuery("<span></span>").addClass("countBack-text").text(countText).appendTo(countA);
	      divT.append(countA);
	    }
		var a = jQuery("<a href='javascript: void(0)'></a>").addClass("icon-text").addClass("normal-a").appendTo(li);
		var span = jQuery("<span></span>").text(n.NAME).appendTo(a);
        //根据menuId来设置无权限的样式
        _self._maskBlock(menuId,li);
		li.appendTo(ul);
	});
	jQuery(".normal-li").unbind("click").bind("click",{"handler":_self},this._portalOpenTab);
};
/**
 * 构造底部码头图标的移动事件
 */
rh.vi.deskView.prototype._initBottomUseMove = function() {
     var _self = this;
	 var sortFlag = true;
     jQuery("#normalUse ul").sortable({
		items: ".normal-li",
		revert: false,
		sort: function() {
			sortFlag = true;
			jQuery("#normalUse .remove").remove();
		},
	    stop: function(e, ui) {
             jQuery("#normalUse .remove").remove();
 
             if (sortFlag) {
                _self._serializeSlide();
             }
        }
	 });

     jQuery("#normalUse ul li").droppable({
       over: function(event, ui) {
       	   if (ui.draggable.hasClass("normal-li")) {
	   	   	   return false;
	   	   }
           jQuery(this).css("top","-20");
       },
	   out: function(event, ui) {
			jQuery(this).css("background-color","");
			jQuery(this).css("top","0");
	   },
	   drop: function(event, ui) {
	   	   if (ui.draggable.hasClass("normal-li")) {
	   	   	   jQuery(this).css("top","0");
	   	   	   return false;
	   	   }
	   	   sortFlag = false;
	       var temp = ui.draggable.clone().attr("style","").removeClass("block").removeClass("ui-sortable-helper");
	       temp.unbind("click").bind("click",{"handler":_self},_self._portalOpenTab);
	       temp.insertAfter(jQuery(this));
	       temp.addClass("normal-li");
	       temp.find("a.icon-text").addClass("normal-a");
	       //替换图片
           var thisObj = jQuery(this);
           thisObj.css("background-color","");
           thisObj.css("top","0");
           //根据menuId来设置无权限的样式
           _self._maskBlock(temp.attr("menuid"),temp);
           ui.draggable.addClass("remove").hide();
           _self._delModule && _self._delModule(ui.draggable.attr("id"));
           if (jQuery("#normalUse ul li").length == 7) {
	           var aa = _self.leafMenuModel[thisObj.attr("id")];
	           _self._addApp(aa,slideBox.getCursor());
	           thisObj.addClass("remove");
	           thisObj.remove();
           }
           _self._initBottomUseMove();
	   }
	});
     jQuery(".screen .ui-sortable").droppable({
       over: function(event, ui) {
       },
	   out: function(event, ui) {

	   },
	   drop: function(event, ui) {
	   	   if (ui.draggable.hasClass("normal-li")) {
	           var aa = _self.leafMenuModel[ui.draggable.attr("id")];
	           if (_self._addApp(aa,slideBox.getCursor()) == false) {
	        	   return false;
	           };
	           ui.draggable.addClass("remove").hide();
	           var id = ui.draggable.attr("id");
	           jQuery("#" + id,jQuery("#normalUse")).remove();
	   	   	   _self._serializeSlide();
	   	   	   sortFlag = false;
	   	   }
	   }
	});
	
	jQuery("#normalUse ul").droppable({
	   accept: '.normal-li',
       over: function(event, ui) {
       	   if (jQuery("#normalUse ul li").length == 0) {
	   	   	   //jQuery(this).css("background-color","red");
	   	   }
       },
	   out: function(event, ui) {
	   },
	   drop: function(event, ui) {
	   	   if (jQuery("#normalUse ul li").length == 0) {
		       var temp = ui.draggable.clone().attr("style","").removeClass("block").removeClass("ui-sortable-helper");
		       temp.appendTo(jQuery(this));
		       temp.addClass("normal-li");
		       temp.find("a.icon-text").addClass("normal-a");
	           ui.draggable.addClass("remove");
	
	           jQuery(this).css("background-color","");
	           ui.draggable.addClass("remove").hide();
	           _self._delModule && _self._delModule(ui.draggable.attr("id"));	
	           _self._initBottomUseMove();
           }
	   }
	});
	jQuery(".normalUse-c p img").reflect({ height:.5, opacity:.4 });
	//文件夹图标特殊处理
	jQuery(".normal-li").each(function(i,n) {
		var folder = jQuery(n).attr("folder");
		var id = jQuery(n).attr("id");
		if (folder == 1) {//如果是文件加图标
			_self._minBlock(id,jQuery(n));
		}		
	});
};
/**
 * 构造小图片集
 */
rh.vi.deskView.prototype._minBlock = function(id,obj) {
	var _self = this;
	if (obj.find(".minBlock").length == 1) {
		return true;
	}
	var innerImg = jQuery("<div class='minBlock'></div>");
	var deskPKS = _self.leafMenuModel[id].MINBLOCK;//文件夹内含图标
	if(deskPKS == ""){
		return;
	}
	var minBlock = deskPKS.split(",");
	for (var i = 0; i < minBlock.length;i++) {
		if (i > 3) {
			continue;
		}
		var temp = minBlock[i];
		var minBlockImg = _self.rhTempMinBlockIconsJson[temp].ICON;//文件夹内含图标
		jQuery("<img src='css/images/app_rh-icons/" + minBlockImg + ".png'/>").appendTo(innerImg);
	}
	innerImg.appendTo(obj);
};
/**
 * 设置背景图片
 */
rh.vi.deskView.prototype._setDeskBackImg = function(url, imgPath) {
	var _self = this;
	//ie8，ie8以上，chrome，firefox背景图片不拉伸完美解决(*^__^*)
	jQuery(".background").css({
				"background":url,
				"background-size":"100% 100%",
				"-moz-background-size":"100% 100%",
				"-o-background-size":"100% 100%",
				"-webkit-background-size":"100% 100%",
				"background-size":"100% 100%",
				"-moz-border-image":"url('" + imgPath + "') 0",
				"background-repeat":"no-repeat\\9",
				"background-image":"none\\9",
				"filter":"progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + imgPath + "', sizingMethod='scale')\\9"
			});
};
/**
 * 渲染后执行
 */
rh.vi.deskView.prototype._afterLoad = function() {
	var _self = this;
    jQuery(document).ready(function(){
		//设置背景图片
	    if (_self.selfDeskImg.length > 0) {
	        var url = "url(" + FireFly.getContextPath() + "/file/" + _self.selfDeskImg + ")";
	        _self._setDeskBackImg(url, FireFly.getContextPath() + "/file/" + _self.selfDeskImg);
	    } else {
	        var url = "url(css/images/rh-back/" + _self.deskImg + ")";
	        _self._setDeskBackImg(url, "css/images/rh-back/" + _self.deskImg);
	    }
	    //设置显示页数
	    var counts = jQuery(".btn",jQuery(".control-c"));
		jQuery.each(counts,function(y,m) {
			jQuery(m).addClass("rh-slide-num").addClass("rh-slideIndex-" + y).text(y+1);
		});
		jQuery(".screen ul").height(450);//设置可拖动的ul高度
		Tab.setFrameHei(GLOBAL.getDefaultFrameHei());
		//默认屏幕启用
	    jQuery(".rh-slideIndex-" + _self.deskScreen).click();
	    //提醒消息去掉
	    jQuery(".count").hide();
	    if (_self.deskMsg == 1) {
	      _self._getCounts();
	    }
	    //搜索图标去掉
	    _self._searchIcon();
	    //窗口的大小重置触发方法
	    _self._winResize();
	    //默认程序启用
	    jQuery("li[id='" + _self.deskApp + "']").click();    
	    //
	    _self._initBottomUseMove();
	    //safari特殊处理数字显示
	    if (Browser.versions().iPad == true) {
	    	jQuery(".countBack-a").css("background-position","right -27px");
	    }
    });
};
/**
 * 桌面设置和后台的交互
 */
rh.vi.deskView.prototype._rhExcuteDeskSet = function(opts) {
   var flag = false;
   var data = {};
   if (this.deskSetPK) { //修改
	   data[UIConst.PK_KEY] = System.getVar("@USER_CODE@");
   } else { //添加
	   data["SD_ID"] = System.getVar("@USER_CODE@");
	   data["_ADD_"] = "true";
   }
   data = jQuery.extend(data,opts);
   var res = FireFly.doAct("SY_ORG_USER_DESK","save",data,false);
   if (res[UIConst.PK_KEY] && res[UIConst.PK_KEY].length > 0) {
	   	this.deskSetPK = res[UIConst.PK_KEY];
	   	flag = true;
   }
   return flag;
};
/**
 * 序列化桌面上的图标,并且更新
 */
rh.vi.deskView.prototype._serializeSlide = function() {
   var s = "";
   var screenIndex = slideBox.getCursor();
   var temp = [];
   jQuery(jQuery("#container .screen")[screenIndex]).find("li.block").each(function(j, el) {
       temp.push(jQuery(el).attr("id"));
   });
   var flag = false;
   var data = {};
   data[UIConst.PK_KEY] = slideBox.getScreen(screenIndex).attr("id") ? slideBox.getScreen(screenIndex).attr("id"):"";
   data["PI_SERVS"] = temp.join(",");
   //常用操作
   var normalData = {};
   var normal = [];
   jQuery("#normalUse .normal-li").each(function(j, el) {
       normal.push(jQuery(el).attr("id"));
   });
   if (jQuery(".normal-ul").attr("id") && (jQuery(".normal-ul").attr("id").length > 0)) {
	   normalData[UIConst.PK_KEY] = jQuery(".normal-ul").attr("id");  
   }
   normalData["PI_NORMAO_ICON"] = normal.join(",");
   normalData["PI_TITLE"] = "ICONS";
   var datasArray = [];
   datasArray.push(data);
   datasArray.push(normalData);
   	
   var batchData = {};
   batchData["BATCHDATAS"] = datasArray;
   var resultData = FireFly.batchSave("SY_ORG_USER_DESK_ICON",batchData,null,false,false);
   if (resultData[UIConst.RTN_MSG] && resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
   	   	var str = resultData._SAVEIDS_.split(",");
   	   	//常用图标条
   	    if (jQuery(".normal-ul").attr("id")) { 	
   	    } else {
		   	var normalId = str[1];
		   	jQuery(".normal-ul").attr("id",normalId);  	
   	    }
   	    //slide屏幕
        var tempId = data[UIConst.PK_KEY];
   	    if (tempId.length == 0) {
   	    	slideBox.getScreen(screenIndex).attr("id",str[0]);
   	    }
	   flag = true;
   } 
   return flag;
};
/**
 * 排序桌面设置,并且更新后台
 */
rh.vi.deskView.prototype._sortSlideDesk = function(arrScreen) {
	var datas = [];
	var flag = false;
	jQuery.each(arrScreen,function(i,n) {
		var screen = slideBox.getScreen(i);
		if (screen.attr("id")) {
			var data = {};
			data[UIConst.PK_KEY] = screen.attr("id");
			data["PI_ORDER"] = i;
			datas.push(data);
		}
	});
	var batchData = {};
	batchData["BATCHDATAS"] = datas;
	var resultData = FireFly.batchSave("SY_ORG_USER_DESK_ICON",batchData,null,false);
    if (resultData[UIConst.RTN_MSG] && resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
	   flag = true;
    } 
	return flag;
};
/**
 * 序列化桌面上的图标,并且更新
 */
rh.vi.deskView.prototype._serializeSlideDesk = function(deskPK) {
	//序列化桌面上的图标,并且更新
   var s = "";
   var screenIndex = slideBox.getCursor();
   var temp = [];
   jQuery(jQuery("#container .screen")[screenIndex]).find("li.block").each(function(j, el) {
       temp.push(jQuery(el).attr("id"));
   });
   var flag = false;

   var data = {};
   if (deskPK) {//删除桌面
   	   data[UIConst.PK_KEY] = deskPK;
	   var resultData = FireFly.doAct("SY_ORG_USER_DESK_ICON","delete",data,false);
	   if (resultData[UIConst.RTN_MSG] && resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
		   flag = true;
	   }    	
   } else {//新增桌面
	   data["PI_TITLE"] = "第" + screenIndex + "页";
	   data["PI_ORDER"] = screenIndex;
	   data["PI_SERVS"] = temp.join(",");
	   var resultData = FireFly.doAct("SY_ORG_USER_DESK_ICON","save",data,false);
	   if (resultData[UIConst.RTN_MSG] && resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
	   	   var pk = resultData[UIConst.PK_KEY];
	   	   slideBox.getScreen(screenIndex).attr("id",pk);
		   flag = true;
	   } 
   }
   return flag;
};
/**
 * 获取提醒消息个数
 */
rh.vi.deskView.prototype._getCounts = function() {
	var _self = this;
	var res = top.Todo.get(_self.toDoAllCount,null,false);
	if (_self.toDoAllCount != res.count) {//数量有变化才去重新构造
		_self.toDoAllCount = res.count;
		_self._addCountToIcon(res);
	}
	//根据_intervalTime设置的值定时获取待办
	window.setTimeout(function() {_self._getCounts();}, this._intervalTime);
};
/**
 * 添加桌面上数量的提醒
 */
rh.vi.deskView.prototype._addCountToIcon = function(data) {
	var _self = this;
	jQuery.each(jQuery(".countBack"), function(i, n) {
		var appId = jQuery(n).attr("liid");
		var e = jQuery("#" + appId)
		var countserv = e.attr("countserv");
		if (countserv == 2) {
			return;
		}
		var info = e.attr("alertserv");
		var count = 0;
		if (info.length > 0) {
		    count = data["count_" + info];
		} else {
			count = data["count_" + 0];
		}
		if (count) {
			jQuery("#count_" + appId).show();
			jQuery("#count_" + appId).find(".countBack-text").text(count);
			if (info.length > 0) {
				e.attr("info", "SY_COMM_TODO");
				e.attr("menuid", System.getUser("CMPY_CODE") + "SY_COMM_TODO");
				e.attr("extWhere",encodeURIComponent("and TODO_CODE = '"+ info + "'"));
			}
		}
	});
};
/**
 * 构造应用设置弹出框
 */
rh.vi.deskView.prototype._bldBoxHtml = function() {
	var appboxHtml = '';
	appboxHtml =    '<div id="portalSetting">';
	appboxHtml +=       '<span id="portalSettingMsg"></span>';    
	appboxHtml +=       '<div id="bar" class="">'; 
	appboxHtml +=         '<span id="btnAppSet" class="rhDesk-btn icon-dialog-desk">桌面应用</span>';
	appboxHtml +=         '<span class="rhDesk-btn-line"></span>';
	appboxHtml +=         '<span id="btnScreenSet" class="rhDesk-btn icon-dialog-screen">分屏设置</span>';
	appboxHtml +=         '<span class="rhDesk-btn-line"></span>';
	appboxHtml +=         '<span id="rhDesk-deskSet" class="rhDesk-btn icon-dialog-defdesk">默认桌面</span>';
	appboxHtml +=         '<span class="rhDesk-btn-line"></span>';
	appboxHtml +=         '<span id="rhDesk-deskAppSet" class="rhDesk-btn icon-dialog-defapp">默认应用</span>';
	appboxHtml +=         '<span class="rhDesk-btn-line"></span>';
	appboxHtml +=         '<span id="rhDesk-systemBack" class="rhDesk-btn icon-dialog-revert">系统还原</span>';
	appboxHtml +=         '<span class="rhDesk-btn-line"></span>';
	appboxHtml +=         '<span id="rhDesk-msgSet" class="rhDesk-btn icon-dialog-msg">通知设置</span>';
	appboxHtml +=         '<span class="rhDesk-btn-line"></span>';
	appboxHtml +=         '<span id="rhDesk-themeSet" class="rhDesk-btn icon-dialog-theme">墙纸设置</span>'; 
	appboxHtml +=         '<span class="rhDesk-btn-line"></span>';   
	appboxHtml +=      '</div>';
	appboxHtml +=      '<div id="appPageAll" class="rh-dialog-con-right" style="">';
	appboxHtml +=         '<div id="appPageDom" class="rh-deskDom appPage" style="display:none;">';
	appboxHtml +=            '<div id="app_list_box">';
	appboxHtml +=               '<div style="color:white;text-align:center;line-height:22px;" class="fb fontHei">单击添加至桌面！</div>';
	appboxHtml +=               '<ul style=""></ul>';
	appboxHtml +=               '<div class="clearfix"></div>';   
	appboxHtml +=            '</div>';
	appboxHtml +=         '</div>';
	appboxHtml +=         '<div id="screenPageDom" class="rh-deskDom">';
	appboxHtml +=            '<div id="screen_list">';
	appboxHtml +=               '<div class="clearfix"></div>';   
	appboxHtml +=               '<ul></ul>';
	appboxHtml +=            '</div>';
	appboxHtml +=         '</div>';
	
	appboxHtml +=         '<div id="rh-deskSetDom" class="rh-deskDom">';
	appboxHtml +=               '<div id="rh-deskSetDom-desk" class="deskContent rh-font-size"></div>';   

	appboxHtml +=         '</div>';
	
	appboxHtml +=         '<div id="rh-deskAppSetDom" class="rh-deskDom">';
	appboxHtml +=               '<div style="color:white;text-align:center;line-height:22px;" class="fb fontHei">单击设置生效！</div>';
	appboxHtml +=               '<div id="rh-deskSetDom-app" class="deskContent"><ul id="rh-deskSetDom-app-ul"></ul></div>';
	appboxHtml +=               '<div class="clearfix"></div>';   
	appboxHtml +=         '</div>';
	
	appboxHtml +=         '<div id="rh-systemBackDom" class="rh-deskDom">';
	appboxHtml +=               '<h3 class="deskTitle">系统程序</h3>';
	appboxHtml +=               '<div class="deskContent rh-font-size"><input id="desk-initApp" type="checkbox" class="rh-checkbox"/>桌面上的图标回复到初始状态</div>';   
	appboxHtml +=               '<h3 class="deskTitle">主题布局</h3>';
	appboxHtml +=               '<div class="deskContent rh-font-size"><p><input id="desk-initTheme" type="checkbox" class="rh-checkbox"/>还原系统默认墙纸</p><p><input id="desk-initDesk" type="checkbox" class="rh-checkbox"/>取消默认桌面</p>';
	appboxHtml +=               '<p style="padding:30px 0px;"><input id="desk-okBtn" type=button value=" 确 定 "/></p>'; 
	appboxHtml +=               '</div>';  
	appboxHtml +=         '</div>';
	
	appboxHtml +=         '<div id="rh-msgSetDom" class="rh-deskDom">';
	appboxHtml +=               '<h3 class="deskTitle">消息</h3>';
	appboxHtml +=               '<div class="deskContent rh-font-size"><input id="desk-msgFlag" type="checkbox" class="rh-checkbox"/>是否接受来自应用的消息提醒</div>';   
	appboxHtml +=               '<h3 class="deskTitle">声音</h3>';
	appboxHtml +=               '<div class="deskContent rh-font-size"><input id="desk-ringFlag" type="checkbox" class="rh-checkbox"/>是否接受来自应用的消息提醒</div>';  
	appboxHtml +=               '<p style="padding:30px 0px 30px 25px;text-align:left;"><input id="desk-msgOKBtn" type=button value=" 确 定 "/></p>'; 
	appboxHtml +=         '</div>';
	
	appboxHtml +=         '<div id="rh-themeSetDom" class="rh-deskDom" style="overflow-y:scroll;height:430px;">';
	appboxHtml +=               '<h3 class="deskTitle">系统墙纸</h3>';
	appboxHtml +=               '<div id="rh-theme-system" class="deskContent rhDesk-theme-div"></div>';   
	appboxHtml +=               '<h3 class="deskTitle" style="display:block;">自定义</h3><input id="pImgBtn" style="display:none;" type="button" value="reset"></input>';
	appboxHtml +=         		'<div id="rh-self-form" style="width:80%;height:40px;margin-left:25px;"><iframe id="imgIframe" src="imgSubmit.jsp" border=0 frameborder=0 height="40" width="300" scrolling=no></iframe></div>';
	appboxHtml +=               '<div id="rh-self-con" class="deskContent"></div>';
	appboxHtml +=         '</div>';
	
	appboxHtml +=      '</div>';
	appboxHtml +=   '</div>';
	return appboxHtml;
};
/*
 * 添加桌面应用 e {"func_id": ,"id": ,"name":} index 为要添加应用的屏幕索引
 */
rh.vi.deskView.prototype._addApp = function(e, index) { 
   var _self = this;
   var s = slideBox.getScreen(index); 
   if (s) { 
      var ul = s.find("ul"); 
      if (!ul.length) { 
         ul = jQuery("<ul></ul>");
         s.append(ul); 
          ul.sortable({
            revert: true,
            //delay: 200,
            distance: 10,               //延迟拖拽事件(鼠标移动十像素),便于操作性
            tolerance: 'pointer',       //通过鼠标的位置计算拖动的位置*重要属性*
            connectWith: ".screen ul",
            scroll: false,
            stop: function(e, ui) {
              setTimeout(function() {
                    jQuery(".block.remove").remove();
                    jQuery("#trash").hide();
                    ui.item.live("click",{"handler":_self},_self._portalOpenTab);
                    _sefl._serializeSlide();
              }, 0);
            },
            start: function(e, ui) {
               jQuery("#trash").show();
               ui.item.unbind("click");
            }
         });
      } 
      if (_self._addModule(e, s.find("ul")) == false) {//未添加成功
    	  return false;
      }; 
      _self._initBlock();
   } 
};
/*
 * 获取图标间隔
 */
rh.vi.deskView.prototype._getAppMargin = function (){
      var clientSize = jQuery(document.body).outerWidth(true);
      var appsize = 120 * this.rowAppNum;
      if(clientSize > appsize){
         var _margin = Math.floor((clientSize - appsize - 70*2)/16);     
      }else{
         var _margin = 0;    
      }
      return _margin; 
};
/*
 * 设置图标间隔
 */
rh.vi.deskView.prototype._refixAppPos = function (){
      var _margin = this._getAppMargin() + "px";
      jQuery("#container .screen li.block").css({"margin-left": _margin, "margin-right":_margin})   
};
/*
 * 根据menuid来设置只读样式
 */
rh.vi.deskView.prototype._maskBlock = function (menuId,obj){
	//根据menuId来设置无权限的样式
	if (menuId.length == 0) {
		   if (this.maskBlockFlag == 2) {
			   return false;
		   }
		   if ((obj.attr("folder") == 1) || (obj.parent().attr("folder") == 1)) {//文件夹图标不增加蒙板
		   } else {
			   var maskBlock = jQuery("<div class='maskBlock'></div>");
			   maskBlock.appendTo(obj);
		   }
	}
};
/*
 * 添加模块应用
 */
rh.vi.deskView.prototype._addModule = function (e, el) {
   var _self = this;
   //判断当前页面个数，超出最大数量将提示不能继续添加
   var nowLiNum = jQuery(".screen").eq(slideBox.getCursor()).find("ul li").length;
   if (nowLiNum >= this.SCREEN_MAX_APP_NUM) {
	   alert("当前应用已达最大数，请新加屏幕或在其它屏幕继续添加。");
	   return false;
   }
   el = jQuery(el);
   var countText = 0;
   var _id = e.ICON;
   var id = e.ID;
   var menuId = e.MENUID;
   //alert(JsonToStr(e));
   fixid = this._fixAppImage(_id);
   var li = jQuery("<li class=\"block\"></li>");
   var img = jQuery("<div class='img'><p><img class='block-backImg' src='css/images/app_rh-icons/" + fixid + ".png' /></p></div>");
   var divT = jQuery("<div class=\"count\"></div>");
   li.attr("id", id);
   li.attr("title", e.NAME);
   //li.attr("index", e.func_id);
   li.attr("type", e.TYPE);
   li.attr("info", e.LEAF);
   li.attr("icon", e.ICON);
   li.attr("menu", e.MENU);
   li.attr("menuid", menuId);
   li.attr("countserv", e.COUNTSERV);
   li.attr("extWhere", "");
   li.attr("folder", e.FOLDER);
   li.attr("alertserv", e.ALERTSERV);
   
   if (e.FOLDER == 1) {//如果是文件加图标
	   _self._minBlock(id, img);
   }
   var _margin = this._getAppMargin() + "px";
   li.css({"margin-left": _margin, "margin-right":_margin});
   divT.attr("id", "count_" + e.ID);
   if(_self.rhTempAlertIconsJson[e.ID]) {//如果当前图标启用消息提醒
	  var count = jQuery("#count_"+e.ID).find(".countBack-text");
	  if(count.length>0){
		 countText =  count.text();
	  }
      divT.addClass("countBack"); 
      divT.attr("liid",e.ID);
	  var countA = jQuery("<a></a>").addClass("countBack-a");
	  jQuery("<span></span>").addClass("countBack-text").text(countText).appendTo(countA);
      divT.append(countA);
   }
   var a = jQuery("<a class=\"icon-text\" href=\"javascript: void(0)\"></a>"); 
   var span = jQuery("<span></span>").text(e.NAME); 
   li.append(img.append(divT)).append(a.append(span)); 
   //根据menuId来设置无权限的样式
   if(_self._maskBlock(menuId,img) === false) {
	   return false;
   };
   el.append(li);
   if(countText<1){
 	  jQuery("#count_"+e.ID).hide();
   } else if(countText>=1){
	   jQuery("#count_"+e.ID).show();
	   if(e.LEAF!="SY_COMM_TODO"){
		   li.attr("info", "SY_COMM_TODO");
		   li.attr("menuid", System.getUser("CMPY_CODE")+"SY_COMM_TODO");
		   li.attr("extWhere", encodeURIComponent("and  TODO_CODE = '"+e.COUNTSERV+"'"));
	   }
   }
};
/*
 * 删除模块
 */
rh.vi.deskView.prototype._delModule = function (el){
   var _self = this;
   var pObj = jQuery("#container .screen ul li.block");
   pObj.each(function(){
      var index = jQuery(this).attr("id");
      if(el == index){
         jQuery(this).remove();
         var flag = _self._serializeSlide();
         if (flag == true) {//删除保存成功
         	_self.leftMenuModel[el] = _self.leafMenuModel[el];
         }
      }
   });
};
/*
 * 检查应用图片是否存在
 */
rh.vi.deskView.prototype._fixAppImage = function (e){
      return e;             
};
/*
 * 获取当前屏幕应用的个数
 */
rh.vi.deskView.prototype._getAppNums = function (index){
   var index = (index == "" || typeof(index) == "undefined") ? slideBox.getCursor() : index;  
   var num =  jQuery("#container .screen:eq("+index+") ul li.block").size();
   return num;          
}
/*
 * 初始化模块
 */
rh.vi.deskView.prototype._initModules = function (modules, el) {
   var _self = this;
   window.slideBox = jQuery("#container").slideBox({
      count: (modules.length == 0) ? 1:modules.length,
      cancel: isTouchDevice() ? "" : ".block", 
      obstacle: "200",
      speed: "slow",
      //active: 1,
      touchDevice: isTouchDevice(),
      control: "#control .control-c",
      listeners: {
          afterScroll: function(i) {
          },
          beforeScroll: function(i) {
             jQuery(".background").stop().animate({
                //left: - i * 70   
             }, "normal");
          }
       }
   });
   el = jQuery(el);
   var count = 0;
   jQuery.each(modules || [] , function(i, e) {
      var ul = jQuery("<ul></ul>");
      slideBox.getScreen(i).append(ul);
      slideBox.getScreen(i).attr("id",e.id);
      jQuery.each(e.items || [], function(i, e) {
         _self._addModule(e, ul);
      });
      i++;
   });
};
/*
 * 构造小图标集合框
 */
rh.vi.deskView.prototype._bldMinBlock = function (event,id,name) {
	var _self = this;
	var deskPKS = _self.leafMenuModel[id].MINBLOCK;//文件夹内含图标
	var x = event.clientX;
	var y = event.clientY;
	var unitId = "rh-minBlock-" + id;
	if (jQuery("#" + unitId).length == 1) {
		jQuery("#" + unitId).dialog("destroy");
		jQuery("#" + unitId).empty().remove();
	} else {
		var div = jQuery("<div class='rh-minBlock-container'></div>");
		jQuery("<div class='rh-minBlock-tit'>&nbsp;&nbsp;&nbsp;" + name + "</div>").appendTo(div);
		jQuery("#" + id).css("z-index","1002");
		var array = deskPKS.split(",");
		for (var i = 0;i < array.length;i++) {
			var str = array[i];
			var item = _self.rhTempMinBlockIconsJson[str];
			_self._addModule(item,div);
		}
		var winDialog = jQuery("<div></div>").addClass("rh-minBlock-dialog").attr("id",unitId).attr("title","");
		winDialog.appendTo(jQuery("body"));
		var hei = 245;
	    var wid = 350;
	    var posArray = [100,100];
		jQuery("#" + unitId).dialog({
			autoOpen: false,
			width:465,
			modal: true,
			resizable:false
		});
		var close = jQuery("<div class='rh-minBlock-close'>关闭</div>").addClass("dialog-title-text-right").appendTo(div);
		close.bind("mousedown",function() {
			jQuery("#" + unitId).dialog("destroy");
			jQuery("#" + unitId).empty().remove();
		});

		div.appendTo(winDialog);
		div.find(".block").unbind("click").bind("click",_self._portalOpenTab);
	    jQuery("#" + unitId).dialog("open");
	}
};
/*
 * 打开tab事件
 */
rh.vi.deskView.prototype._portalOpenTab = function (event) {
	var _self = this;
    var type = jQuery(this).attr("type");
    var name = jQuery(this).attr("title");
    var info = jQuery(this).attr("info");
    var menu = jQuery(this).attr("menu");
    var menuId = jQuery(this).attr("menuid");
    var extWhere =  jQuery(this).attr("extWhere");
    var id = jQuery(this).attr("id");
    var folder = jQuery(this).attr("folder");
    if (folder == 1) {//文件夹图标
    	event.data.handler._bldMinBlock(event,id,name);
    	return true;
    }
    if (info) {
	    if (type == 1) { //服务
	    	var opts = {"url":info + ".list.do?extWhere=" + extWhere,"tTitle":name,"menuId":menuId};
	        if (menu) {
	        	opts = {"url":info + ".list.do?extWhere=" + extWhere,"tTitle":name,"menuFlag":menu,"menuId":menuId};
	        }
			Tab.open(opts);
	    } else if (type == 2) {//链接
	    	var menuItem = {"ID":menuId,"NAME":name,"INFO":info,"MENU":menu};
	    		Menu.linkNodeClick(menuItem);
	    } else if(type == 3) { //JS代码
	    	eval(info);
	    }
    } else if (info.length == 0 && menuId.length == 0) {
    	alert("进入受限，请检查工作台管理 ,没有设定关联菜单\n(注意：关联的菜单必须是叶子菜单项)!");
    } else if (info.length == 0 && menuId.length > 0) {
    		alert("进入受限\n" +
    				"1、请检查工作台管理  (注意：关联的菜单必须是叶子菜单项)!\n" +
    				"2、请检查权限设定！");
    }
};
/*
 * 显示消息在对话框头
 */
rh.vi.deskView.prototype._portalMessage = function (msg) {
	//显示消息 @para msg 要显示的提示文字
	    if(!msg) return;
	    msgObj = jQuery("#portalSettingMsg");
	    msgObj.html(msg).show();
	    setTimeout(function(){msgObj.empty().hide()},5000);

};
/*
 * 构造自定义图片
 */
rh.vi.deskView.prototype._buildSelfImg = function (imgUrl) {   debugger;
	var _self = this;
	var img = jQuery("<img class='rhDesk-theme-self rhDesk-theme-img'></img>")
		     .attr("src", FireFly.getContextPath() + "/file/" + imgUrl)
		     .attr("selfImg",imgUrl);
	img.bind("click",function() {
		var url = "url(" + FireFly.getContextPath() + "/file/" + imgUrl + ")";
		_self._setDeskBackImg(url, FireFly.getContextPath() + "/file/" + imgUrl);
		var selfAll = [];
		jQuery.each(jQuery(".rhDesk-theme-self"),function(i,n) {
			selfAll.push(jQuery(n).attr("selfImg"));
		});
        var opts = {"SD_SELF_SELECT":imgUrl,"SD_SELF_DEF":selfAll.join(","),"SD_BACK_IMG":""};
	    if(_self._rhExcuteDeskSet(opts) == true) {
	    	_self._portalMessage(td_lang.rh.msg_101);
	    	jQuery(".rhDesk-theme-systemSelect").removeClass("rhDesk-theme-systemSelect");
	    	jQuery(this).addClass("rhDesk-theme-systemSelect");
	    };
	});	
	return img;
};
/*
 * 上传后获取返回的图片主键
 */
rh.vi.deskView.prototype._readImgPK = function () {
	var _self = this;
	//获取上传返回的主键信息
	jQuery("#rh-self-form").prepend(jQuery("<span>上传中...</span>"));
	var si = setInterval(function(){
		var doc = document.getElementById("imgIframe").contentDocument;
		var con = doc.body.innerHTML;
		if (con.indexOf("PK") > 0) {
			clearInterval(si);
			var obj = StrToJson(con);
			var pk = obj._DATA_[0]._PK_;
			jQuery("#rh-self-form").empty();
			jQuery("#rh-self-con").prepend(_self._buildSelfImg(pk));
			var temp = jQuery("<iframe id='imgIframe' src='imgSubmit.jsp' border=0 frameborder=0 height='50' width='400'></iframe>");
			jQuery("#rh-self-form").append(temp);
			var selfAll = [];
			jQuery.each(jQuery(".rhDesk-theme-self"),function(i,n) {
				if (i < 4) {
					selfAll.push(jQuery(n).attr("selfImg"));
				} else {
					jQuery(n).remove();
				}
			});
			var opts = {"SD_SELF_DEF":selfAll.join(",")};
		    if(_self._rhExcuteDeskSet(opts) == true) {
	    		_self._portalMessage(td_lang.rh.msg_106);		    	
		    }
		}
	},200);
};
/*
 * 垃圾箱构造  
 */
rh.vi.deskView.prototype._initTrash = function () {
	var _self = this;
	jQuery("#trash").droppable({
	    over: function() {
	       jQuery("#trash").addClass("hover");
	    },
	    out: function() {
	       jQuery("#trash").removeClass("hover");
	    },
	    drop: function(event, ui) {
	       ui.draggable.addClass("remove").hide();
	       var id = ui.draggable.attr("id");
	       _self._delModule && _self._delModule(ui.draggable.attr("id"));
	       jQuery(".ui-sortable-placeholder").animate({
	          width: "0"
	       }, "normal", function() {
	       });
	       jQuery("#trash").removeClass("hover");
	       //添加到选择列表里
	       _self._addOneAppToListBox(id);
	    }
	});  
};
/*
 * 构造桌面设置->桌面已存在图标
 */
rh.vi.deskView.prototype._appBuildingDeskHave = function () {
	var _self = this;
	var html = menu_id = '';
	var _len = _self.deskMenuModel.length;
	jQuery.each(_self.deskMenuModel,function(i,n) {
	    var menuId = n.ID;
	    var menuName = n.NAME;
	    var menuIcon = n.ICON;
	    var menuInfo = n.LEAF;
	    var menuType = n.TYPE;
	
	    var image = !(menuIcon.length > 0) ? 'default' : menuIcon;
	    html += '<li appid ="'+ menuId +'"><a id="' + menu_id + '" appid ="'+ menuId +'" apptitle="'+menuName+'" appicon="'
	    +image+'" appinfo ="'+menuInfo+'" apptype="'+ menuType + '" href="javascript:;" hidefocus="hidefocus" title="'
	    + menuName +'"><img width="48" height="48" src="css/images/app_rh-icons/' + image + '.png" align="absMiddle" /><span class="lleft"><span class="lright">' + menuName + '</span></span></a></li>';    	
	});

    return html; 
};
rh.vi.deskView.prototype._activeTab = function (obj) {
	jQuery(".rhDesk-btnActive").removeClass("rhDesk-btnActive ");
    jQuery(".rhDesk-lineActive").removeClass("rhDesk-lineActive ");
 	obj.addClass("rhDesk-btnActive");
 	obj.next().addClass("rhDesk-lineActive");
};

/*
 * 初始化弹出框的tab点击事件  
 */
rh.vi.deskView.prototype._initDialogTabs = function () {
	var _self = this;
     //应用设置
     $("#btnAppSet").live("mousedown",function(event){
        _self._activeTab(jQuery(this));
        var _display = $("#appPageDom").css("display");
        if(_display == "none"){
	        //显示待添加的应用
	        var appIds = _self._returnSTmenu();
	        var apphtml = _self._appBuilding(appIds);
	        $("#app_list_box ul").html(apphtml);
            $(".rh-deskDom").hide();
            $("#appPageDom").show();
        }
        event.stopPropagation();
        return false;
     });
     //屏幕设置
     $("#btnScreenSet").live("mousedown",function(event){
        _self._activeTab(jQuery(this));
        var _display = $("#screenPageDom").css("display");
        if(_display == "none"){
            $(".rh-deskDom").hide();
           $("#screenPageDom").show();
        }
        event.stopPropagation();
        return false;
     });
     //默认桌面
     jQuery("#rhDesk-deskSet").live("mousedown",function(event){
        _self._activeTab(jQuery(this));
        jQuery(".rh-deskDom").hide();
        jQuery("#rh-deskSetDom").show();
        if (jQuery(".rh-deskSetDom-show").length > 0) {
        	return false;
        }
        jQuery("#rh-deskSetDom-desk").empty();
        //默认屏幕
        jQuery.each(jQuery("#container .screen"),function(i,n) {
	         var span = jQuery("<span style='margin:0px 10px;'></span>");
	         var radio = jQuery("<input type='radio' class='rh-radiobox' name='desk'></input>").appendTo(span);
	         var count = i + 1;
	         var text = jQuery("<label></label>").text("第" + count + "屏桌面").appendTo(span);
	         radio.bind("click",function() {
	         	var opts = {"SD_DESK_DEFAULT":i};
	         	if(_self._rhExcuteDeskSet(opts) == true) {
        	    	_self._portalMessage(td_lang.rh.msg_102);
        	    };
	         });
	         if (_self.deskScreen == i) {//设置屏幕选中
	         	radio.attr("checked",true);
	         }
	         jQuery("#rh-deskSetDom-desk").append(span);
        });
        event.stopPropagation();
        return false;
     });
     //默认应用
     jQuery("#rhDesk-deskAppSet").live("mousedown",function(event){
        _self._activeTab(jQuery(this));

        jQuery(".rh-deskDom").hide();
        jQuery("#rh-deskAppSetDom").show();
        if (jQuery(".rh-deskSetDom-show").length > 0) {
        	return false;
        }
        //默认应用
        jQuery("#rh-deskSetDom-app-ul").addClass("rh-deskSetDom-show").append(_self._appBuildingDeskHave());
        jQuery("#rh-deskSetDom-app-ul li").bind("click",function() {
        	var appid = jQuery(this).attr("appid");
        	var opts = {"SD_APP_DEFAULT":appid};
        	if (jQuery(this).hasClass("select")) {
        		jQuery(".select").removeClass("select");
        		opts = {"SD_APP_DEFAULT":""};
        	} else {
        		jQuery(".select").removeClass("select");
        		jQuery(this).addClass("select");
        	}
    		if(_self._rhExcuteDeskSet(opts) == true) {
    	    	_self._portalMessage(td_lang.rh.msg_103);
    	    };
        });
        jQuery("li[appid='" + _self.deskApp + "']").addClass("select");
        event.stopPropagation();
        return false;
     });
     //系统还原
     jQuery("#rhDesk-systemBack").live("mousedown",function(event){
        _self._activeTab(jQuery(this));
  
        jQuery(".rh-deskDom").hide();
        jQuery("#rh-systemBackDom").show();
        

        jQuery("#desk-okBtn").bind("click",function() {
			var initApp = jQuery("#desk-initApp").attr("checked");
			var initTheme = jQuery("#desk-initTheme").attr("checked");
			var initDesk = jQuery("#desk-initDesk").attr("checked");

		    if (initApp || initTheme || initDesk) {
		    	 var res = confirm("系统将还原桌面设置为初始值，并将刷新当前系统页面。");
	    		 if (res == true) {
	    		 	var opts = {}
	    		 	if (initTheme == "checked") {//默认主题
	    		 		initTheme = 1;
	    		 		opts["SD_INIT_THEME"] = initTheme;
	    		 		opts["SD_BACK_IMG"] = "";
	    		 	} else {
	    		 		opts["SD_INIT_THEME"] = 0;
	    		 	}
	    		 	if (initDesk == "checked") {//默认桌面设置
	    		 		initDesk = 1;
	    		 		opts["SD_INIT_DESK"] = initDesk;
	    		 		opts["SD_DESK_DEFAULT"] = "";
	    		 		opts["SD_APP_DEFAULT"] = "";
	    		 	} else {
	    		 		opts["SD_INIT_DESK"] = 0;
	    		 	}
	    		 	if (initApp == "checked") {//初始化程序
	    		 		initApp = 1;
	    		 		opts["SD_INIT_APP"] = initApp;
	    		 	} else {
	    		 		opts["SD_INIT_APP"] = 0;
	    		 	}
	        	    if(_self._rhExcuteDeskSet(opts) == true) {
	        	    	if (initApp == 1) {
			    		 	var temp = [];
			    		 	jQuery.each(jQuery("#container .screen"),function(i,n) {
								temp.push(jQuery(this).attr("id"));
		        			});
		        			temp.push(_self.normalUlId);
		        			var pkData = {};
				    		pkData[UIConst.PK_KEY]=temp.join(",");
				    		var resultData = FireFly.listDelete("SY_ORG_USER_DESK_ICON",pkData,false);
	        	    	}
	        	    	_self._portalMessage(td_lang.rh.msg_104);
	        	    };	
	        	    parent.window.location.href = parent.window.location.href;
	    		 } else {
	    		 	return false;
	    		 }
		    }
        });
        event.stopPropagation();
        return false;
     });
     //通知设置
     jQuery("#rhDesk-msgSet").live("mousedown",function(event){
        _self._activeTab(jQuery(this));
  
        jQuery(".rh-deskDom").hide();
        jQuery("#rh-msgSetDom").show();
        
        if (jQuery(this).hasClass("openFlagTrue")) {
        	return false;
        }
        if (_self.deskMsg == 1) {
        	jQuery("#desk-msgFlag").click();
        }
        if (_self.deskRing == 1) {
        	jQuery("#desk-ringFlag").click();
        }
        jQuery("#desk-msgOKBtn").bind("click",function() {
			var msgFlag = jQuery("#desk-msgFlag").attr("checked");
			var ringFlag = jQuery("#desk-ringFlag").attr("checked");

	    	var res = confirm("系统将还原桌面设置为初始值，并将刷新当前系统页面。");
    		if (res == true) {
    		 	if (msgFlag == "checked") {
    		 		msgFlag = 1;
    		 	} else {
    		 		msgFlag = 0;
    		 	}
    		 	if (ringFlag == "checked") {
    		 		ringFlag = 1;
    		 	} else {
    		 		ringFlag = 0;
    		 	}
	            var opts = {"SD_MSG_FLAG":msgFlag,"SD_RING_FLAG":ringFlag};
        	    if(_self._rhExcuteDeskSet(opts) == true) {
        	    	_self._portalMessage(td_lang.rh.msg_105);
        	    };
        	    parent.window.location.href = parent.window.location.href;	
    		} else {
    		 	return false;
    		}
        });
        jQuery(this).addClass("openFlagTrue");
        event.stopPropagation();
        return false;
     });
     //通知设置
     jQuery("#rhDesk-mbLink").live("mousedown",function(event){
        _self._activeTab(jQuery(this));
  
        jQuery(".rh-deskDom").hide();
        jQuery("#rh-mbLinkDom").show();
        
        if (jQuery(this).hasClass("openFlagTrue")) {
        	return false;
        }
        event.stopPropagation();
        return false;
     });
     //主题设置
     jQuery("#rhDesk-themeSet").live("mouseup",function(event){
        _self._activeTab(jQuery(this));
  
        jQuery(".rh-deskDom").hide();
        jQuery("#rh-themeSetDom").show();
        if (jQuery(".rhDesk-theme-system").length > 0) {
        	return false;
        }
        var data = {"1":{"img":"desk_1.jpg"},"2":{"img":"desk_2.jpg"},"3":{"img":"desk_3.jpg"},"4":{"img":"desk_4.jpg"},
        "5":{"img":"desk_5.jpg"},"6":{"img":"desk_6.jpg"},"7":{"img":"desk_7.jpg"},"8":{"img":"desk_8.jpg"},
        "9":{"img":"desk_9.jpg"},"10":{"img":"desk_10.jpg"},"11":{"img":"desk_11.jpg"},"12":{"img":"desk_12.jpg"},
        "13":{"img":"desk_13.jpg"},"14":{"img":"desk_14.jpg"},"15":{"img":"desk_15.jpg"},"16":{"img":"desk_16.jpg"},
        "17":{"img":"desk_17.jpg"},"18":{"img":"desk_18.jpg"},"19":{"img":"desk_19.jpg"},"20":{"img":"desk_20.jpg"},
        "21":{"img":"desk_21.jpg"},"22":{"img":"desk_22.jpg"},"23":{"img":"desk_23.jpg"},"24":{"img":"desk_24.jpg"},
        "25":{"img":"desk_25.jpg"},"26":{"img":"desk_26.jpg"},"27":{"img":"desk_27.jpg"},"28":{"img":"desk_28.jpg"},
        "29":{"img":"desk_29.jpg"},"30":{"img":"desk_30.jpg"},"31":{"img":"desk_31.jpg"},"32":{"img":"desk_32.jpg"},
        "33":{"img":"desk_33.jpg"},"34":{"img":"desk_34.jpg"},"35":{"img":"desk_35.jpg"},"36":{"img":"desk_36.jpg"},
        "37":{"img":"desk_37.jpg"},"38":{"img":"desk_38.jpg"},"39":{"img":"desk_39.jpg"},"40":{"img":"desk_40.jpg"},
        "41":{"img":"desk_41.jpg"},"42":{"img":"desk_42.jpg"},"43":{"img":"desk_43.jpg"},"44":{"img":"desk_44.jpg"},
        "45":{"img":"desk_45.jpg"},"46":{"img":"desk_46.jpg"},"47":{"img":"desk_47.jpg"},"48":{"img":"desk_48.jpg"}
        };
        
        jQuery.each(data,function(i,n) {//绑定背景图片点击
        	var systemBlock = jQuery("<div></div>").addClass("rhDesk-theme-system").attr("deskImg",n.img).appendTo(jQuery("#rh-theme-system"));
        	systemBlock.on("mousedown",function(event) {
        		var url = "url(css/images/rh-back/" + n.img + ")";
				_self._setDeskBackImg(url, "css/images/rh-back/" + n.img);
        		var opts = {"SD_BACK_IMG":n.img,"SD_SELF_SELECT":""};
        	    if(_self._rhExcuteDeskSet(opts) == true) {
        	    	_self._portalMessage(td_lang.rh.msg_101);
        	    	jQuery(".rhDesk-theme-systemSelect").removeClass("rhDesk-theme-systemSelect");
        	    	jQuery(this).addClass("rhDesk-theme-systemSelect");
        	    };
                event.stopPropagation();
                return false;
        	});
        	if (n.img == _self.deskImg) {
        		systemBlock.addClass("rhDesk-theme-systemSelect");
        	}
        	jQuery("<img></img>").addClass("rhDesk-theme-img").attr("src","css/images/rh-back/desk_small_" + i + ".jpg").appendTo(systemBlock);
        	//jQuery("<span></span>").addClass("rhDesk-theme-text").text(n.title).appendTo(systemBlock);
        });
        //自定义区域rh-self-con

	    if (_self.selfDeskImgAll != "") {
	        var array = _self.selfDeskImgAll.split(",");
	        jQuery.each(array,function(i,n) {//绑定背景图片点击
	            var img  = _self._buildSelfImg(n);
	            img.appendTo(jQuery("#rh-self-con"));
	            if (n == _self.selfDeskImg) {
	                jQuery(".rhDesk-theme-systemSelect").removeClass("rhDesk-theme-systemSelect");
	                img.addClass("rhDesk-theme-systemSelect");

	            }
	        });
	    }
        jQuery("#pImgBtn").bind("click",function() {
              _self._readImgPK();
        });
        event.stopPropagation();
        return false;
     }); 
     //默认触发点击
     $("#btnAppSet").mousedown();
};
/*
 * 初始化tab里内容的事件
 */
rh.vi.deskView.prototype._initTabConBind = function () {
	 var _self = this;
     
     //根据个人屏幕设置生成
     var screenHtml = _self._returnScreen();
     $("#screenPageDom #screen_list ul").html(screenHtml);
     $("#screenPageDom #screen_list ul").append("<li id='btnAddScreen' class='no-draggable-holder' title="+td_lang.inc.msg_76+"></li>");//'添加屏幕'
     
     //高亮显示当前屏幕 Todo
     var currentScreen = slideBox.getCursor();
     $("#screenPageDom #screen_list ul li.minscreenceil").eq(currentScreen).addClass("current");
     
     //移动屏幕
     $("#screenPageDom #screen_list ul").sortable({
           cursor: 'move', 
           tolerance: 'pointer',
           cancel: '#btnAddScreen',
           stop: function(){
              var arrScreen = new Array();
              $(this).find("li").each(function(){
                 arrScreen.push($(this).attr("index"));
              });
              slideBox.sortScreen(arrScreen);
              $(this).find("li").each(function(i){
                 $(this).attr("index",i);
              });
              var flag = _self._sortSlideDesk(arrScreen);
              if(flag)   _self._portalMessage(td_lang.inc.msg_77);      //"桌面顺序已设置成功！"
           }
     });
     
     //添加屏幕
     $("#btnAddScreen").on("mousedown",function(event){
        slideBox.addScreen();
        slideBox.scroll(slideBox.getCount() - 1);
        var screenlist = $("#screenPageDom #screen_list ul");
        var _max = 0;
        screenlist.find("li.minscreenceil").each(function(){
           _max = _max > parseInt($(this).attr("index")) ? _max : parseInt($(this).attr("index"));      
        });
        //screenlist.find("#btnAddScreen").remove();
        var maxScreen = 8;
        if(maxScreen>_max){
        	if(_max >= 7){
        		screenlist.find("#btnAddScreen").hide();
        	}
	        screenlist.find("#btnAddScreen").before("<li class='minscreenceil' index='"+ (_max+1) +"'>"+(_max+2)+"</li>");//'添加屏幕'
	        var flag = _self._serializeSlideDesk();
	        //填充页码
	        jQuery(".control-c a.btn").last().addClass("rh-slide-num").text(slideBox.getCount());
	        if(flag) _self._portalMessage(td_lang.inc.msg_78);      //"屏幕添加成功！"
	        event.stopPropagation();
        };
        
        return false;
     });
     
     //鼠标滑过屏幕样式
     $("#screenPageDom #screen_list ul li.minscreenceil").live('mouseenter', function(){
        $(this).css({"font-size":"60px"});
        if($('span.closebtn', this).length <= 0)
           $(this).append("<span class='closebtn' title="+td_lang.inc.msg_79+"></span>");//'移除此屏'
        $('span.closebtn', this).show();
     });
     
     $("#screenPageDom #screen_list ul li.minscreenceil").live('mouseleave', function(){
        $(this).css({"font-size":""});
        $('span.closebtn', this).hide();
     });
     
     //删除屏幕
     $("#screenPageDom #screen_list ul li.minscreenceil span").live("click",function(){
        if(confirm(td_lang.inc.msg_80)){//"删除桌面，将删除桌面全部应用模块，确定要删除吗？"
        	var screenlist = $("#screenPageDom #screen_list ul");
            var _max = 0;
            screenlist.find("li.minscreenceil").each(function(){
               _max = _max > parseInt($(this).attr("index")) ? _max : parseInt($(this).attr("index"));      
            });
        	if(_max >= 7){
        		screenlist.find("#btnAddScreen").show();
        	}
           var currentDom = $(this).parent("li");
           var index = currentDom.index("li.minscreenceil");
           var deskPK = slideBox.getScreen(index).attr("id");
           slideBox.removeScreen(currentDom.index("li.minscreenceil"));
           var flag = _self._serializeSlideDesk(deskPK);
           if(flag)
           {
              _self._portalMessage(td_lang.inc.msg_81);//"桌面删除成功！"
              currentDom.remove();
              _self._reSortMinScreen();
           }
        }   
     });

     
     //绑定右侧应用,点击事件,live方法用于再次加入时也能触发
     $("#app_list_box ul li").live("mouseup",function(event){
        var obj = $(this).find("a");
        if (obj.attr("state") == "yes") { //已点击的标识
        	return;
        }
        var state = obj.attr("state","yes");
        var appid = obj.attr("appid");
        //var appEid = obj.attr("appEid");
        var appIcon = obj.attr("appicon");
        var apptitle = obj.attr("apptitle");
        var appInfo = obj.attr("appinfo");
        var appType = obj.attr("apptype");
        var appmenu = obj.attr("appmenu");
        var countserv = obj.attr("appcountserv");
        var alertserv = obj.attr("appalertserv");
        var menuid = obj.attr("appmenuid");
        
        //rh-toodo 添加桌面图标事件
        _self._addApp({"ID":appid,"ICON":appIcon, "NAME":apptitle,"TYPE":appType,"LEAF":appInfo,
                "MENU":appmenu,"MENUID":menuid,"COUNTSERV":countserv,"ALERTSERV":alertserv},slideBox.getCursor());
        var flag = _self._serializeSlide();

        if(flag){
           $(this).fadeOut(2000,function(){$(this).remove();});
           _self._portalMessage(td_lang.inc.msg_82);//"应用已添加到当前桌面！"
           _self.leftMenuModel[appid] = undefined;
        }else{
           _self._portalMessage(td_lang.inc.msg_83);      //"应用添加错误！"
        }
        event.stopPropagation();
        return false;
     });
};
/*
 * 修正点击按钮出现屏幕小按钮width为0的现象
 */
rh.vi.deskView.prototype._refixminScreenbtn = function () {
	jQuery('#control').width(window.document.documentElement.clientWidth);   	
};
/*
 * 绑定桌面图标的点击事件
 */
rh.vi.deskView.prototype._initBlock = function () {
	var _self = this;
	jQuery('#container .screen ul li.block').unbind("click").bind("click",{"handler":_self},_self._portalOpenTab);
};
/*
 * 初始化屏幕
 */
rh.vi.deskView.prototype._initScreenSort = function () {
	var _self = this;  
    $(".screen ul").sortable({
        revert: true,
        //delay: 200,
        //distance: 10,               //延迟拖拽事件(鼠标移动十像素),便于操作性
        tolerance: 'pointer',       //通过鼠标的位置计算拖动的位置*重要属性*
        connectWith: ".screen ul",
        scroll: false,
        stop: function(e, ui) {
           if (jQuery("#normalUse ul li").length > 0) {//码头不为空的时候
           	 jQuery("#normalUse ul").droppable({"accept":".normal-li"});
           }
           setTimeout(function() {
                $(".block.remove").remove();
                $("#trash").hide();
                ui.item.unbind("click").bind("click",{"handler":_self},_self._portalOpenTab);
                _self._serializeSlide();
           }, 0);
        },
        start: function(e, ui) {
           if (jQuery("#normalUse ul li").length == 0) {//码头为空的时候
           	 jQuery("#normalUse ul").droppable({"accept":".block"});
           }
           $("#trash").show();
           _self._refixminScreenbtn();
           ui.item.unbind("click");
        }
    });
};
/*
 * 打开搜索框
 */
rh.vi.deskView.prototype._bindSearchBtn = function () {
	$("#openSearch").click(function(e){
		var options = {"url":"SY_PLUG_SEARCH.show.do","tTitle":"智能搜索","menuFlag":3};
		Tab.open(options);
    });
};

/*
 * 生成顶级菜单下属的所有服务功能
 */
rh.vi.deskView.prototype._returnSTmenu = function () {
	var _self = this;
	var topMenu = _self.leftMenuModel;
	var curList = [];
	jQuery.each(topMenu,function(i,n) {
		if (n) {//过滤掉内容为undefined的对象
			curList.push(n);
		}
	});
	return curList;
};
/*
 * 构造一级菜单下所有除桌面已有菜单的图标
 */
rh.vi.deskView.prototype._appBuilding = function (appids) {
	var _self = this;
    var html = menu_id = '';
    var _len = appids.length;
    for(var i=0; i< _len; i++) {
	     var menuId = appids[i].ID;
	     var menuName = appids[i].NAME;
	     var menuIcon = appids[i].ICON;
	     var menuInfo = appids[i].LEAF;
	     var menuType = appids[i].TYPE;
	     var countserv = appids[i].COUNTSERV;
	     var alertserv = appids[i].ALERTSERV;
	     var menuid = appids[i].MENUID || "";
	     var menu = appids[i].MENU;
         var image = !(menuIcon.length > 0) ? 'default' : menuIcon;
         html += '<li class="appBlock">'; 
    	 if (!menuid) {//没权限则加遮罩
    		 if (_self.maskBlockFlag == 2) {//不显示无权限区块
    			 continue
    		 } 
    		 html += '<div class="maskBlock"></div>';
    	 }
         html += '<a id="' + menu_id + '" appid ="'+ menuId +'" apptitle="'+menuName+'" appicon="'
         +image+'" appinfo ="'+menuInfo+'" apptype="'+ menuType + '" appalertserv="' + alertserv 
         + '" appmenu="' + menu + '" appcountserv="' + countserv + '" appmenuid="' + menuid + '" href="javascript:;" hidefocus="hidefocus" title="'
         + menuName +'"><img width="48" height="48" src="css/images/app_rh-icons/' + image + '.png" align="absMiddle" /><span class="lleft"><span class="lright">' + menuName + '</span></span></a></li>';   
   }
   return html;
};
/*
 * 增加一个应用图标至选择图标列表里
 */
rh.vi.deskView.prototype._addOneAppToListBox = function (appid) {
	var _self = this;
	var topMenu = _self.leftMenuModel;
	var curList = [];
	curList.push(_self.leftMenuModel[appid]);
	var apphtml = this._appBuilding(curList);
	jQuery("#app_list_box ul").append(jQuery(apphtml));
};
/*
 * 构造屏幕设置html结构
 */
rh.vi.deskView.prototype._returnScreen = function () {
	var _self = this;
    var html = '';
    var _len = slideBox.getCount();
    for(var i=0; i< _len; i++) {
         html += '<li class="minscreenceil" index='+i+'>' + (i+1) +'</li>';
    }
    return html;
};
/*
 * 重置分屏设置的顺序文本
 */
rh.vi.deskView.prototype._reSortMinScreen = function () {
    $("#screenPageDom #screen_list ul li.minscreenceil").each(function(i){
      $(this).text(i+1);
      $(this).attr("index",i);      
    }); 
};
/*
 * 桌面resize的绑定方法
 */
rh.vi.deskView.prototype._winResize = function () {
	var _self = this;
    jQuery(window).resize(function(){
      _self._refixAppPos();   
      $('#overlay').height(window.document.documentElement.scrollHeight);
      _self._refixminScreenbtn();
    });
};
/*
 * 桌面的搜索图标显示设置
 */
rh.vi.deskView.prototype._searchIcon = function () {
	var _self = this;
	if (System.getVar("@C_SY_DESK_SEARCHICON@") == "false") {
		jQuery("#openSearch").hide();
		jQuery("#openSearch").parent().css("width","15px");
	}
};
/*
 * 扩展对话框
 */
rh.vi.deskView.prototype._rhExtDialog = function () {
	var _self = this;
    jQuery.extend({
      tExtDialog: function (options) {
         var defaults = {
            width:1200,
            height: 400,
            parent: $("body"),
            title: ''
         };
         
         var options = $.extend(true, defaults, options);
         var width = options.width;
         var height = options.height;
         var id = options.id;
         var title = options.title;
         var parent = options.parent;
         var src = options.src;
         var icon = options.icon;
         var content = options.content;
        
         if(!$('#dialog_' + id).length) {         
            _self._createDialog(id, title, parent);
            $('#dialog_' + id).draggable("destroy");
            $('#dialog_' + id).addClass('extDialog');
            $('#dialog_' + id + ' .dialog tr.head').css("cursor","");
            $('#dialog_' + id).css({"width" : width +"px","height" : height +"px"});
            $('#dialog_' + id + ' > .dialog').css({"width":"100%"});
            $("div.msg-content", $('#dialog_' + id)).css({"height":(height - 48) + "px"})
            if(icon){
               $('#dialog_' + id + ' .dialog .head .center .title').prepend("<img src = '"+icon+"' style='margin-right:5px' width='16' height='16' />");
            }
            if(src){
               $("#dialog_content_"+id).html("<iframe name='iframe' src='" + src +"' width='100%' height='100%' border='0' frameborder='0' marginwidth='0' marginheight='0'></iframe>");
            }else{
               $("#dialog_content_"+id).html(content);   
            }
         }
         function display() {
            var wWidth = (window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth));
            var hHeight = (window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight));
            
            var top = left = 0;
            var bst = document.body.scrollTop || document.documentElement.scrollTop;
            top = Math.round((hHeight - height)/2 + bst) + "px";
            mleft = "-" + Math.round(width/2) + "px";
            top = top < 0 ? top = 0 : top;

            $('#dialog_' + id).css({"top":top,"left":"50%","margin-left":mleft});
            $('#dialog_' + id).show();
            $('#overlay').height(window.document.documentElement.scrollHeight);
            $('#overlay').show();
            if (jQuery(".rhDesk-btnActive").length == 0) {//设置选中tab样式，第一次打开时执行
	            jQuery("#btnAppSet").addClass("rhDesk-btnActive");
            }
         }
         return {
            display: display   
         }
      }
    });
};
/*
 * 构造dom后初始化图标，弹出框等
 */
rh.vi.deskView.prototype._bldInit = function () {
   var _self = this;
   jQuery(document).ready(function(jQuery){
      jQuery("body").focus();
      jQuery('#overlay').height(window.document.documentElement.scrollHeight);
      //初始化图标
      _self._initModules(_self.modules);
      //初始化图标间距
      _self._refixAppPos();
      //模块点击事件
      _self._initBlock();
      //构造垃圾箱
      _self._initTrash();
      //初始化屏幕
	  _self._initScreenSort();
      //打开搜索框
	  _self._bindSearchBtn();
      //lp 绑定“界面设置”事件   
      var d = '';
      jQuery("#openAppBox").bind("mousedown",function(event){
         _self._refixminScreenbtn();
         if(!d){
         	//调用通用组件
            var temp = new rh.ui.pop({"id":"appbox","pHandler":_self,"title":"设&nbsp;置"});
            temp.render(); 
            d = temp.display(_self._bldBoxHtml());
         }else{ 
            jQuery('#overlay').css("display","block");
            d.display();
            jQuery("#screenPageDom #screen_list ul li.minscreenceil").each(function(i){
               jQuery(this).html(i+1);
            });
            //如果已经创建过那么就显示且退出
            event.stopPropagation();
            return;   
         }
         //构造tab的点击事件
         _self._initDialogTabs();
         //构造tab的内容事件
         _self._initTabConBind();
         event.stopPropagation();
      });
   });
};     
