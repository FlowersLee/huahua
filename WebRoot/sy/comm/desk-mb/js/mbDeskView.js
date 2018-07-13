/** 工作台页面渲染引擎 */
GLOBAL.namespace("mb.vi");
mb.vi.deskView = function(options) {
   var defaults = {
		"id":options.id + "-miDeskView",
		"topBarFlag":true,
		"source":null,
		"pCon":null
	};
   this.opts = jQuery.extend(defaults,options);
   this._pCon = this.opts.pCon || jQuery("body");
   this._topBarFlag = this.opts.topBarFlag;
   this._source = this.opts.source;//app:客户端应用
   this._outNetData = [];//外网提醒地址
   this.trNum = 4;
   this.iconData = {};
};
/*
 * 构造所有
 */
mb.vi.deskView.prototype.show = function() {
    this._initMainData();
    this._bldLayout();
    this._afterLoad();
};
mb.vi.deskView.prototype._getLeafData = function(data) {
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
mb.vi.deskView.prototype._initMainData = function() {
//	var params = {"_extWhere":" and MENU_AREA='3' or  MENU_AREA='4'"};
//	var res = FireFly.doAct("SY_COMM_MENU","finds",params,false);
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
	_self.iconData["doc"] = {"ID":"SY_COMM_TODO_DEADLINE","DSICON":"wenku","INFO":"SY_COMM_TODO_DEADLINE","NAME":"文档中心","DSNAME":"文档中心","AREA":"4"};
	_self.iconData["zhidao"] = {"ID":"zhidao","DSICON":"zhidao","INFO":"SY_PLUG_ZHIDAO","NAME":"软虹知道","DSNAME":"软虹知道","AREA":"4"};	
	
	//增加搜索按钮
	var searchIcon = {"ID":"SY_PLUG_SEARCH","DSICON":"sousuo","INFO":"SY_PLUG_SEARCH","NAME":"智能搜索","DSNAME":"智能搜索","AREA":"4"};
	_self.iconData["SY_PLUG_SEARCH"] = searchIcon;
	if (this._source == null) {
		//增加退出按钮
		var exitIcon = {"ID":"EXIT","DSICON":"exit","INFO":"MB_EXIT","NAME":"退出","DSNAME":"退出","AREA":"4"};
		_self.iconData["EXIT"] = exitIcon;
	}
	//获取个性化的设置
	var userCode = System.getUser("USER_CODE");
	var desk = {};
	desk["_NOPAGE_"] = true;
	desk["_searchWhere"] = " and S_USER='" + userCode + "'"
	var icons = FireFly.getListData("SY_ORG_USER_DESK_MB",desk);
	_self.backImg = null;
	_self.deskApps = null;
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
mb.vi.deskView.prototype._bldLayout = function() {
	var _self = this;
    //构造头信息
	if (this._topBarFlag === true) {
		var topCon = jQuery("<div></div>").addClass("mbDesk-topCon");
		var top = jQuery("<div></div>").addClass("mbDesk-topBar").appendTo(topCon);
		var logo = jQuery("<div></div>").addClass("mbDesk-topBar-logo").appendTo(top);
		var config = jQuery("<div></div>").addClass("mbDesk-topBar-btn mbDesk-topBar-config").appendTo(top);
		config.bind("mousedown",function() {
			var url = FireFly.getContextPath() + "/sy/comm/desk-mb/mbDeskConfigView.jsp";		
			window.location.href = url;
		});
		var search = jQuery("<div></div>").addClass("mbDesk-topBar-btn mbDesk-topBar-search").appendTo(top);
		search.bind("mousedown",function() {
			jQuery("div[sid='SY_PLUG_SEARCH']").mousedown();
		});
		var pull = jQuery("<div></div>").addClass("mbDesk-topBar-pull").appendTo(topCon);
		var downIcon = jQuery("<div></div>").addClass("mbDesk-topBar-pull-down").appendTo(pull);
		this.pullList = jQuery("<div></div>").addClass("mbDesk-topBar-pullList").appendTo(pull);
		//var pullIconCon = jQuery("<div></div>").addClass("mbDesk-topBar-pullIconCon").appendTo(pull);
		//var pullIcon = jQuery("<div></div>").addClass("mbDesk-topBar-pullIcon").appendTo(pullIconCon);
		downIcon.bind("mousedown",function(event) {
			if (downIcon.hasClass("mbDesk-topBar-pullIconUp")) {
				_self.pullList.animate({height: "0"}, { queue: false, duration: 'slow',complete:function() {
					downIcon.removeClass("mbDesk-topBar-pullIconUp");
					pull.removeClass("mbDesk-topBar-pullHide");
					_self.pullList.hide();
				} 
				});
			} else {
				_self.pullList.show();
				_self.pullList.animate({height: "290"}, { queue: false, duration: 'slow',complete:function() {
					downIcon.addClass("mbDesk-topBar-pullIconUp");
					pull.addClass("mbDesk-topBar-pullHide");
				} 
				});
			}
		});
		topCon.appendTo(this._pCon);
	}
	//
    var container = jQuery("<div></div>").addClass("mbDesk-container")
    var i = 0;
    var selfMenu = _self.deskApps;//自定义的应用
    if (selfMenu) {
    	var len = selfMenu.length;
    	for (i;i < len;i++) {
    		var selfAppId = selfMenu[i];
    		var item = _self.iconData[selfAppId];
    		if (item) {
    			_self._bldOneApp(item).appendTo(container);
    		}
    	}
    } else {
    	jQuery.each(_self.iconData,function(i,n) {
    		var item = n;
    		_self._bldOneApp(item).appendTo(container);    		
    	});
    }
    _self._bldOneApp(_self.iconData["SY_PLUG_SEARCH"]).appendTo(container);//搜索app
    if (_self.iconData["EXIT"]) {
    	_self._bldOneApp(_self.iconData["EXIT"]).appendTo(container);//退出app
    }
    container.appendTo(this._pCon);
};
/*
 * 根据item组合一个app
 */
mb.vi.deskView.prototype._bldOneApp = function(item) {
   var _self = this;
   if (item == null) {
	   return;
   }
   var id = item.ID;
   var block = jQuery("<div align=center></div>").addClass("mbDesk-block");
   var sid = item.INFO.split(".")[0];//截取正确的服务id
   block.attr("sid",sid);
   block.attr("info",item.INFO);
   var icon = item.DSICON;
   if (icon.length == 0) {
	   icon = "default";
   }
   jQuery("<img></img>").addClass("mbDesk-block-img mbDesk-blockRadius mbDesk-blockShadow").attr("src",FireFly.getContextPath() + "/sy/comm/desk-mb/img/" + icon + ".png").appendTo(block);
   jQuery("<div></div>").addClass("mbDesk-block-text").text(item.DSNAME).appendTo(block);   
   block.bind("mousedown",function() {
	   var info = jQuery(this).attr("info");
	   if (info == "MB_EXIT") {
		   window.location.href = FireFly.getContextPath() + "/index_mb.jsp";	    
		   return false;
	   }
	   if (info == "SY_PLUG_SEARCH") {
		   var url = FireFly.getContextPath() + "/sy/plug/search/mbSearchResult.jsp?k=";	
		   _self._guideTo(url);    		   
		   return false;
	   }
	   if (info == "SY_PLUG_DOC") {
			var url = FireFly.getContextPath() + "/km/wenku/mb/mbDocView.jsp";	
			_self._guideTo(url); 
		   return false;
	   }
	   if (info == "SY_PLUG_ZHIDAO") {
			var url = FireFly.getContextPath() + "/km/zhidao/mb/mbZDView.jsp";	
			_self._guideTo(url);    		   
		   return false;
	   }
	   if ((info.indexOf("?") > 0) || (info.toUpperCase().indexOf("HTTP://") == 0)) {
		   _self._guideTo(info); 
		   return false;
	   }
	   //打开一个dialog
	   var sid = jQuery(this).attr("sid");
	   var extWhere = "";
	   if (jQuery(this).attr("extWhere")) {
		   extWhere = jQuery(this).attr("extWhere");
	   }
	   if (jQuery(this).attr("countServ")) {
		   sid = jQuery(this).attr("countServ");
	   }
	   var opts = {"sId":sid,"extWhere":extWhere};
	   _self._openLayer(opts);
   });
   if ((item.INFO == "SY_COMM_TODO") || (item.ALERT && item.ALERT.length > 0)) {
	   var tmpInfo = item.INFO;
	   var alertType = item.ALERT || "";
	   if ((alertType.length > 0) && (alertType.indexOf("com.") == 0)) {//存储外网提醒类型
		  _self._outNetData.push(item.ID);
		  tmpInfo = item.ID;
	   } 
	   var count = jQuery("<div></div>").attr("countserv",tmpInfo).addClass("mbDesk-count").appendTo(block);
   }
   return block;
};
mb.vi.deskView.prototype._openLayer = function(opts) {
	var readOnly = false;//this.readOnly;
	this.servId = opts.sId;
	var extWhere = opts.extWhere;
	this.url = FireFly.getContextPath() + "/sy/base/view/stdListView-mb.jsp?sId=" +　this.servId + "&readOnly=" + readOnly + "&extWhere=" + extWhere;	
	this._guideTo(this.url);
};
/**
 * 获取提醒消息个数
 */
mb.vi.deskView.prototype._getCounts = function() {
	var _self = this;
	var params = {};
	if (this._outNetData.length > 0) {
		params["I_MENU_IDS"] = this._outNetData.join(",");
	}
	   var count;
	   var ajaxUrl ="SY_COMM_TODO.getTodoCount.do";
       jQuery.ajax({
         type: 'post',
         url: ajaxUrl,
         dataType:"json",
		 data : params,
         cache:false,
         async:false,
         timeout:60000,
         success:function(data) { 
					if (data) {
						var innerData = data._DATA_;
						jQuery.each(jQuery(".mbDesk-count"), function(i, n) {
						        var countserv = jQuery(n).attr("countserv");
								var count = 0;
								if (countserv != "SY_COMM_TODO") {//非待办
								    count = innerData[countserv];
								    var obj = jQuery(".mbDesk-count[countserv='" + countserv + "']");
								    if (count && count > 0) {
								    	obj.show();
								    	obj.text(_self._count(count));	
								    	obj.parent().attr("extWhere",encodeURIComponent("and TODO_CODE = '"+ countserv + "'"));	    	
								    	obj.parent().attr("countServ","SY_COMM_TODO");
								    }
								} else {//待办
									 count = innerData[0];
				        			 var obj = jQuery(".mbDesk-count[countserv='SY_COMM_TODO']");
				        			 obj.show();
				        			 obj.text(_self._count(count));	
								}
								obj.addClass(_self._countImg(count));
						});
					}
	         },
	         error:function(err) {

	         } 
	   });
    //每5分钟 定期刷新,时间有误差，用setTimeout方法压力小些，适合函数的调用需要繁重的计算以及很长的处 理时间
    window.setTimeout(function(){_self._getCounts();},200000);  
};
mb.vi.deskView.prototype._countImg = function(count) {
	var img = "mbDesk-count";
	if (9 < count && count < 100) {
		img = "mbDesk-count2";
	} else if (99 < count) {
		img = "mbDesk-count3";
	}
	return img;
};
mb.vi.deskView.prototype._count = function(count) {
    if (99 < count) {
    	count = "99+";
	}
    return count;
};
mb.vi.deskView.prototype._afterLoad = function() {
	var _self = this;
	//
	if (_self.backImg) {
		this._pCon.addClass(_self.backImg);
	} else {
		this._pCon.addClass("mbDesk-body");
	}
	if (this._topBarFlag === true) {
		//获取数量
		this._getCounts();
		//获取顶部下拉的数据
		this._getAlertData();
	}
};
/*
 * 打开配置页面
 */
mb.vi.deskView.prototype._config = function() {
	
};
/*
 * 打开顶部下拉内容
 */
mb.vi.deskView.prototype._getAlertData = function() {
	var _self = this;
	//获取顶部下拉的数据
	var data = Todo.getData(2);
	var innerData = data._DATA_;
	jQuery.each(innerData,function(j,m) {
		_self._addAlert(m);
	});
};
/*
 * 下拉面板增加一条提醒
 */
mb.vi.deskView.prototype._addAlert = function(data) {
	var _self = this;
	var node = data;
	var boxId = "mbDesk_listBox_" + node.TODO_CODE;
	var conId = "mbDesk_listCon_" + node.TODO_CODE;
	var recordId = "mbDesk_listRec_" + node.TODO_OBJECT_ID1;
    if (jQuery("#" + recordId,_self.pullList).length > 0) {
    	return true;
    }
	
	if (jQuery("#" + boxId).length == 0) {
		var box =  jQuery("<div></div>").attr("id",boxId).addClass("mbDesk-list-box").appendTo(_self.pullList);
		var tBar = jQuery("<div></div>").addClass("mbDesk-list-tBar").appendTo(box);
		var icon = jQuery(".mbDesk-block[sid='" + node.TODO_CODE + "'] .mbDesk-block-img").attr("src");
		if (icon == null) {
			icon = FireFly.getContextPath() + "/sy/comm/desk-mb/img/file.png";
		}
		var img = jQuery("<img></img>").addClass("mbDesk-list-img").attr("src",icon);
		tBar.append(img);
		var title = node.TODO_TITLE;
		if (title.length > 15) {
			title = title.substring(0,15) + "..";
		}
		var text = jQuery("<div></div>").addClass("mbDesk-list-imgText").text(title);
		tBar.append(text);
		var clear = jQuery("<span></span>").addClass("mbDesk-list-clear").appendTo(tBar);
		clear.bind("mousedown",function() {
			if (clear.hasClass("mbDesk-list-delete")) {
				box.remove();
			} else {
				clear.addClass("mbDesk-list-delete");
			}
		});
		var con = jQuery("<div></div>").attr("id",conId).addClass("mbDesk-list-con").appendTo(box);
		bldRecord(node).appendTo(con);
	} else {
		bldRecord(node).appendTo(jQuery("#" + conId));
	}

	this._appMsgAlert(node.TODO_TITLE,"来自：" + node.SEND_USER_CODE + " 时间:" + node.TODO_SEND_TIME,node.TODO_URL);

	function bldRecord(node) {
		var record = jQuery("<div></div>").addClass("mbDesk-list-record").attr("id","mbDesk_listRec_" + node.TODO_ID);
		record.bind("click",function() {
            _self._goInToDo(node.TODO_URL);
		});
		var icon = jQuery("<div></div>").addClass("mbDesk-list-icon").appendTo(record);
		var right = jQuery("<div></div>").addClass("mbDesk-list-right").appendTo(record);
		var title = jQuery("<div></div>").addClass("mbDesk-list-title").appendTo(right);
		var titleSpan = jQuery("<span></span>").addClass("mbDesk-list-titleSpan").appendTo(title);
		var from = jQuery("<div></div>").addClass("mbDesk-list-from").appendTo(right);
		var fromSpan = jQuery("<span></span>").addClass("mbDesk-list-fromSpan").appendTo(from);
		var timeSpan = jQuery("<span></span>").addClass("mbDesk-list-timeSpan").appendTo(from);
		var flagClass = "mb-slide-flagRed";
        if (node.S_EMERGENCY == 1) {
        	flagClass = "mb-slide-flagYellow";
        } else if (node.S_EMERGENCY == 20) {
        	flagClass = "mb-slide-flagBlue";
        }
		var flag = jQuery("<span></span>").addClass("mbDesk-list-flagSpan").addClass(flagClass);
		icon.append(flag);
		titleSpan.text(node.TODO_TITLE);
		fromSpan.text("来自：" + node.SEND_USER_CODE);
		timeSpan.text(node.TODO_SEND_TIME);
		return record;
	}
};

/*
 * 进入代办的具体业务页面
 */
mb.vi.deskView.prototype._goInToDo = function(url) {
	if (url.indexOf(".byid.do") > 0) {
		var readOnly = false;//this.readOnly;
		var servArray = url.split(".byid.");
		var servId = servArray[0];
		var dataArray = url.split("data=");
		
		var pkCode = "";
		var data = dataArray[1];
		data = data.substring(1,data.length -1);
		var array = data.split(",");
		for (var i = 0;i < array.length;i++) {
			var temp = array[i].split(":");
			if (temp[0] == "_PK_") {
				pkCode = temp[1];
			}
		}
		this.url = FireFly.getContextPath() + "/sy/base/view/stdCardView-mb.jsp?sId=" +　servId + "&readOnly=" + readOnly + "&pkCode=" + pkCode;		
		window.location.href = this.url;
	}
};
/*
 * 调用外层的消息通讯
 */
mb.vi.deskView.prototype._appMsgAlert = function(title,msg,url,func) {
	var _self = this;
	setTimeout(function() {
		if (window.plugins) {
			window.plugins.statusBarNotification.notify(title, msg,'',function() {
				_self._goInToDo(url);
			});
			navigator.notification.beep(1);
		}
	},10);
};
/*
 * 不同的应用跳转方式的处理
 */
mb.vi.deskView.prototype._guideTo = function(url) {
	if ((this._source == "app") && window.plugins) {
		url = FireFly.getHostURL() + FireFly.getContextPath() + url;
		url += "&source=app";
		window.plugins.childBrowser.showWebPage(url, { showLocationBar: false });
		window.plugins.childBrowser.onClose= function() {
		};
	} else {
		window.location.href = url;
	}
};
