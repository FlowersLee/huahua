GLOBAL.namespace("rh.ui");
/**
 * @name rh.ui.gridCard
 * @class 构造企信页面
 */
var pictureSource;   // picture source
var destinationType; // sets the format of returned value
rh.ui.gridCard = function(options) {
	var defaults = {
		id : options.id + "--gridCard",
		useFlag : "PC",
		area : "all",
		loadMsg: '数据加载中 ...',
	};	
	this._opts = jQuery.extend(defaults,options);
	this._parHandler = options.parHandler;
	this._pCon = this._opts.pCon;
	this._useFlag = this._opts.useFlag;
	this._area = this._opts.area;
	this._source = this._opts.source;//标识应用环境：app(手机app)
	this._viewHei = document.documentElement.clientHeight; //可是区域高度
	this._nowUser = System.getVar("@USER_CODE@");//当前登录人
	this._platform = this._opts.platform || "";//应用平台
	this._isNativeApp = false;
	this._http = FireFly.getHttpHost() + FireFly.getContextPath();
	this._socketServ = System.getVar("@C_SY_COMM_SOCKET_SERV@");//"http://172.16.0.10:9092";//socket服务器地址
	this._recordAudioTime = "";
	if ((this._source == "app") && (this._platform.length > 0)) {//app&&平台标识
		this._isNativeApp = true;
	}
	this._notiData = {};//通知的存储对象
	/**
     * 组件要放置的外层容器对象
     * @type jQuery()
     * @default jQuery("body")
     */
};
/**
 * 方法的渲染执行
 * @return {void}
 */
rh.ui.gridCard.prototype.render = function() {
	var _self = this;
	this._loader();
	this._container = jQuery("#mbContainer");
	if (this._area == "list") {
		//左侧列表部分
		this._bldHome();
	}
	this._bldSimpleNav();
	//事件的绑定
    this._goDetail();
    if (this._source == "app") {
    	this._bldFooter();
    	//最后执行
    	this._afterLoad();
    	//其它页面渲染
    	this._bldContract();
    	this._bldDiscover();
    	this._bldMe();
    	//同事圈布局预处理
    	this._bldColleague();
    	//功能桌面布局预处理
    	this._bldDesk();
    	jQuery("<a id='end' name='end' ></a>").appendTo(jQuery("body"));
    }
    //socket连接
    this._sokectConnect();
    
};
/**
 * 开始构造首页
 * @return {this._table} 对应的grid对象
 */
rh.ui.gridCard.prototype._bldHome = function() {
	var _self = this;
	var todoData = FireFly.doAct("SY_COMM_TODO","getTodoCount",null,false);
	var dataAll = todoData._DATA_;
	this._allCount = dataAll.TODO_COUNT;//总数量
	this._lastData = dataAll._DATA_;//列表数据集,最后一次的数据
	if (jQuery("#home_ul").length == 0) {//第一次加载时处理
		this._gridSimple = jQuery("#home_con");//jQuery("<div id='rhGridSimple'></div>").addClass("rhGridSimple rhDisplayView");
		this._gridSimpleUL = jQuery("<ul id='home_ul'></ul>")//.appendTo(this._gridSimple);
	} else {
		this._gridSimpleUL.empty();
	}
	var len = 0;
	if (this._lastData) {
		len = this._lastData.length;
	}
	for (var i = 0;i < len;i++) {
		var dataItem = this._lastData[i];
		var item = this._bldHomeItem(dataItem);
		if (i == 0) {
			//item.addClass("rhGridSimple__item--active");
			_self._lastSendTime = dataItem.TODO_SEND_TIME;
			_self._firstBlockTitle = dataItem.TODO_CODE_NAME;//左侧第一个区块的标题
			_self._firstBlockTODOCode = dataItem.TODO_TYPE;//左侧第一个区块的待办类型
		}
		item.appendTo(_self._gridSimpleUL);
	}
	if (jQuery("#home_ul").length == 0) {
		this._gridSimpleUL.appendTo(this._gridSimple);
	} else {
		//事件的绑定
	    this._goDetail();
	}
	//构造最近联系人
	this._refreshAllCount();
	//this._plugAndroidNoBarsOnTouchScreen("rhGridSimple");
};
/**
 * 首页列表项
 */
rh.ui.gridCard.prototype._bldHomeItem = function(item) {
	var liArray = [];
	liArray.push("<li class='rhGridSimple__item'");
	liArray.push(" todotype='" + item.TODO_TYPE + "' ");
	liArray.push(">");
	liArray.push("<div class='rhGridSimple__item__left'>");
	var img = FireFly.getContextPath() + "/sy/comm/desk-mb/img/todo/" + item.TODO_TYPE + ".png";
	if (item.IMG) {
		img = FireFly.getContextPath() + item.IMG;
	}
	var imgDefault = FireFly.getContextPath() + "/sy/comm/desk-mb/img/todo/default.png";
	liArray.push("<img class='' width='40px' height='40px' src='" + img + "' onerror=\"this.src='" + imgDefault + "'\"></img>");
	liArray.push("<span class='rhGridCardCount ");
	var todoCount = item.TODO_COUNT;
	if (todoCount && todoCount > 0) {
		if (todoCount > 9) {
			liArray.push("rhGridCardCount--2 ");
		}
		liArray.push("rhGridCardCount--show'");
		liArray.push(">");
		if (todoCount >= 100) {
			liArray.push("99+");	
	    } else {
	    	liArray.push(todoCount);
	    }
	} else {
		liArray.push("'>");
	}
	liArray.push("</span>");
	liArray.push("<span class='rh_comm_icon rh_comm_icon_home' ucode='" + item.USERCODE + "'></span>");
	liArray.push("</div>");
	liArray.push("<div class='rhGridSimple__item__right'>");
	liArray.push("<h2 class='rhGridSimple__item__title'>" + item.TODO_CODE_NAME + "</h2>");
	liArray.push("<span class='rhGridSimple__item__time'>" + item.TODO_SEND_TIME + "</span>");
	var title = item.TODO_TITLE;
	if (title.length > 18) {
		title = title.substring(0,18) + "..";
	}
	liArray.push("<p>" + title + "</p>");
	liArray.push("</div>");
	liArray.push("</li>");
	return jQuery(liArray.join(""));
};
/**
 * 首页总数量更新
 */
rh.ui.gridCard.prototype._refreshAllCount = function() {
	//总数量更新
	var allCount = this._allCount || 0;
	jQuery("#rhGridSimple__nav__count").html("(" + allCount + ")");
	if ((jQuery("#cochat").length == 1) && this._allCount) {//存在首页图标
		var allCount = this._allCount;
		var cla = "";
		if (allCount && allCount > 0) {
			if (allCount > 9) {
				cla += "rhGridCardCount--2";
			}
			if (allCount > 999) {
				allCount = "999+";	
		    }
		}
		var allCountDom = jQuery("<span class='rhGridCardCount " + cla + " rhGridCardCount--show'>" + allCount + "</span>");
		allCountDom.appendTo(jQuery("#cochat"));
	} else if (this._allCount) {
		jQuery("#cochat").find(".rhGridCardCount").text(this._allCount);
	}
};
/**
 * 开始构造详细列表
 */
rh.ui.gridCard.prototype._bldGridCard = function(todoCode,title,moreFlag) {
	var _self = this;
	var options = {};
	//参数判断
	if (todoCode) {
		this._todoCode = todoCode;
	} else {
		todoCode = this._todoCode;
	}
	if (title) {
		this._todoTitle = title;
	} else {
		title = this._todoTitle;
	}
	options[UIConst.EXT_WHERE] = " and TODO_CODE='" + todoCode + "'";
	if (moreFlag && this._cardPage) {//更多且有分页信息
		options["_PAGE_"] = this._cardPage;
	} else {
		this._cardPage = null;
	}
    //数据获取
	var listData = FireFly.getPageData("SY_COMM_TODO",options) || {};	
	
	var data = listData._DATA_;
	this._cardPage = listData._PAGE_;//分页信息
	if (jQuery(".rhGridCard").length == 0) {
		this._gridCard = jQuery("<div></div>").addClass("rhGridCard rhDisplayView");
		this._gridCard.appendTo(this._container);
		this._gridCardUL = jQuery("<ul></ul>").appendTo(this._gridCard);
	} else if (moreFlag) {
		
	} else {
		this._gridCardUL.empty();
	}
	for (var i = 0;i < data.length;i++) {
		var dataItem = data[i];
		var item = this._bldGridCardItem(dataItem);
		item.appendTo(this._gridCardUL);
		var url = dataItem.TODO_URL;
		var title = dataItem.TODO_CODE_NAME;
		item.bind("click",{"url":url,"title":title},function(event) {
			var innerUrl = event.data.url;
			var title = event.data.title;
			_self._goInToDo(innerUrl,title);
		});
	}
	//更多
	var page = this._cardPage;
	if (page.NOWPAGE < page.PAGES) {//判断是否当前页为最后一页，否的话增加更多区块
		var more = jQuery("<div class='rhGridCard__more'>点击加载更多..</div>");
		more.bind("click",function() {
			_self._bldGridCardMore();
		});
		more.appendTo(this._gridCardUL);
	} else {
		jQuery(".rhGridCard__more").remove();
	}
	//标题
	this._bldCardNav(title);
};
/**
 * 详细列表加载更多
 */
rh.ui.gridCard.prototype._bldGridCardMore = function() {
	if (this._cardPage) {
		var nowPage = this._cardPage.NOWPAGE;
		this._cardPage.NOWPAGE = parseInt(nowPage) + 1;
		jQuery(".rhGridCard__more").remove();
		this._bldGridCard(null,null,true);
	}
};
/**
 * 详细列表项
 */
rh.ui.gridCard.prototype._bldGridCardItem = function(item) {
	var liArray = [];
	liArray.push("<li class='rhGridCard__item'>");
	liArray.push("<div class='rhGridCard__item__left'>");
	liArray.push("<img class='rhGridCard__imgRadius' width='40px' height='40px' src='" + item.SEND_USER_CODE__IMG + "' userCode='" + item.SEND_USER_CODE + "'></img>");

	liArray.push("</div>");
	liArray.push("<div class='rhGridCard__item__right rhGridCard__itemRadius' title='点击进入详细处理'>");
	var title = item.TODO_TITLE;
	if (title && title.length > 60) {
		title = title.substring(0,60) + "...";
	}
	liArray.push("<h2 class='rhGridCard__item__title'>" + title);
	var emergency = item.S_EMERGENCY;
	if (emergency && (emergency == 20 || emergency == 30)) {//1 一般, 20 紧急, 30 非常紧急
		liArray.push("<span title='需紧急处理' class='rhGridCard__emgRadius rh-slide-flagRed'></span>");
	}
	liArray.push("</h2>");
	
//	var con = item.TODO_TITLE;
//	if (con.length > 60) {
//		con = con.substring(0,60) + "...";
//	}
//	liArray.push("<p>" + con + "</p>");
	liArray.push("<span class='rhGridCard_arrow'></span>");
	liArray.push("<span class='rhGridCard__item__time'>" + item.TODO_SEND_TIME + "</span>");
	liArray.push(" <span class='rhGridCard__item__time'>" + item.SEND_USER_CODE__NAME + "</span>");
	var overTimes = item.TODO_OVERTIME_S;
	if (overTimes) {
		liArray.push("<span class='rhGridCard__item__time' style='margin-left:8px;'>" + overTimes + "</span>");
	}
	liArray.push("</div>");
	liArray.push("</li>");
	return jQuery(liArray.join(""));
};
/**
 * 查看当前类别下的详细
 */
rh.ui.gridCard.prototype._goDetail = function() {
	var _self = this;
	jQuery(".rhGridSimple__item").bind("click",function(event) {
		var type = jQuery(this).attr("todotype");
		var title = jQuery(this).find(".rhGridSimple__item__title").text();
		_self._bldGridCard(type,title);
		jQuery(".mbBotBar").hide();
		//返回按钮特殊处理
		if (_self._source == "app") {
			jQuery(".rhGridSimple").hide();
			jQuery(".rhGridCard").css("width","100%").fadeIn();
		}
	    //下按钮条隐藏
	});
};
/**
 * 返回到总览页面
 */
rh.ui.gridCard.prototype._bldSimpleNav = function() {
	var _self = this;
	var allCount = this._allCount || 0;
	var back = jQuery("#home_nav");
	back.find("#rhGridSimple__nav__count").html("(" + this._allCount + ")");
	var search = jQuery("#home_nav_search");
	search.bind("mousedown",function() {
		   var url = FireFly.getContextPath() + "/sy/plug/search/mbSearchResult.jsp?k=";
		   _self._guideTo(url);    		   
		   return false;
	});
};
/**
 * 返回到总览页面
 */
rh.ui.gridCard.prototype._bldCardNav = function(title) {
	if (jQuery(".rhGridCard__nav").length == 0) {
		var back = jQuery("<div class='rhGridSimple__nav rhGridCard__nav' style=''><a href='#' id='rhGridCard_back' class='mbBack mbTopBar-back  rhGridSimple__nav__back'>返回</a><div class='rhGridSimple__nav__title'>" + title + "</div></div>");
		back.prependTo(jQuery(".rhGridCard"));
		back.find(".mbTopBar-back").bind("click",function(event) {
			jQuery(this).addClass("active");
			jQuery(".rhGridCard").hide();
			jQuery(".rhGridSimple").fadeIn();
		    //下按钮条隐藏
		    jQuery(".mbBotBar").show();
		});
	}
};
rh.ui.gridCard.prototype._showCardPop = function(title) {
	if (title) {
		this._gridCardTitle = title;
	} else {
		title = this._gridCardTitle;
	}
	jQuery(".rhGridCard").find(".rhGridSimple__nav__title").text(title);
};
/*
 * 轮询后台更新app提示和当前列表
 */
rh.ui.gridCard.prototype._getAlertData = function() {
	var _self = this;
	//获取后台数据，和上一次比较看有没有新数据，1 在app头上增加提示，2并更新当前列表新数据
	var todoData = FireFly.doAct("SY_COMM_TODO","getTodoCount",null,false);
	var dataAll = todoData._DATA_ || {};
    var tempData = dataAll._DATA_ || {};
	var len = tempData.length;
	for (var i = 0;i < len;i++) {
		var item = tempData[i];
		if (i == 0) {//判断第一条是否变化，如果变化且日期大于上一次保存的时间
			var sendTime = item.TODO_SEND_TIME;
			var arr = sendTime.replace(/-/g,"/");
			var sendTime = new Date(arr);
			var lastTime = _self._lastSendTime;
			var arr2 = lastTime.replace(/-/g,"/");
			var lastTime = new Date(arr2);
			if (_self._isNativeApp) {//来自平台标识
				if (Date.parse(sendTime) > Date.parse(lastTime)) {
					//增加statusBar提醒
					_self._appMsgAlert(item.TODO_TITLE,"来自：" + item.SEND_USER_CODE__NAME + " 时间:" + item.TODO_SEND_TIME,item.TODO_URL);
				}
			}
		}
	}
	this._allCount = dataAll.TODO_COUNT;//总数量
    this._refreshAllCount();//刷新总数量
	this._lastData = dataAll._DATA_ || [];//列表数据集,最后一次的数据
	this._lastSendTime = "";//最新的一条的时间
	if (this._lastData.length > 0) {
		this._lastSendTime = this._lastData[0].TODO_SEND_TIME;//最新的一条的时间
	}
};
/*
 * 调用外层的消息通讯
 * title:消息
 */
rh.ui.gridCard.prototype._appMsgAlert = function(title,msg,url,func) {
	var _self = this;
	setTimeout(function() {
		if (window.plugins && _self._platform == "Android") {
			window.plugins.statusBarNotification.notify(title, msg,'',function() {
				//_self._goInToDo(url);
				//如果其它页面打开状态，先关闭之
				window.plugins.childBrowser.close();
				_self._changeView("CON_cochat");
				//_self._bldHome();
//				_self._recentFlag = false;
//				_self._bldContractRecent(_self._recentData);
			});
			navigator.notification.beep(1);
		} else if (_self._platform == "iphone") {
		    window.addNotification({
                fireDate        : Math.round(new Date().getTime()/1000 + 5),
                alertBody       : title,
                //repeatInterval  : "daily",
                //soundName       : "beep.caf",
                badge           : 0,
                notificationId  : 123,
                foreground      : function(notificationId){
                	alert("Hello World! This alert was triggered by notification " + notificationId);
                },
                background  : function(notificationId){
                	alert("Hello World! This alert was triggered by notification " + notificationId);
                }           
            });
//		    window.cancelNotification("123", function() {
//		    	alert(124);
//		    });
		}
	},10);
};
rh.ui.gridCard.prototype.refresh = function() {
	//刷新列表
	this._bldGridCard();
	//刷新概览
	this._bldHome();
}
/*
 * 进入待办的具体业务页面
 */
rh.ui.gridCard.prototype._goInToDo = function(url,title) {
	var _self = this;
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
		var url = FireFly.getHostURL() + FireFly.getContextPath() + "/sy/base/view/stdCardView-mb.jsp?sId=" + servId + "&readOnly=" + readOnly + "&pkCode=" + pkCode;
		if (window.plugins) {
			url += "&source=app";
			url += "&platform=" + _self._platform;
			window.plugins.childBrowser.showWebPage(url, { showLocationBar: false });
			window.plugins.childBrowser.onClose= function() {
				//关闭卡片返回时，如果列表页打开状态则刷新，如果概览页面则刷新概览
				//刷新列表
				_self._bldGridCard();
				//刷新概览
				_self._bldHome();
			};
		} else if (this._source == "note") {
			var params = {"handlerRefresh":_self};
			var options = {"url":servId + ".card.do?pkCode=" + pkCode, "tTitle":title, "menuFlag":3,"params":params};
			Tab.open(options);
		} else {
			window.location.href = url;
		}
	}
};
/*
 * 底部导航条:企信
 */
rh.ui.gridCard.prototype._bldCoChat = function() {
};
/*
 * 底部导航条:同事圈
 */
rh.ui.gridCard.prototype._bldColleague = function() {
	var _self = this;
	if (jQuery(".rhColleague").length == 0) {
		var colleague = jQuery("<div class='rhColleague rhDisplayView' style='display:none;'></div>");
		var nav = jQuery("<div class='rhGridSimple__nav' style=''><a href='#' id='rhColleague_back' class='mbBack mbTopBar-back'>返回</a><div class='rhGridSimple__nav__title'>同事圈</div></div>");
		nav.appendTo(colleague);
		nav.find(".mbTopBar-back").bind("click",function(event) {
			jQuery(this).addClass("active");
			_self._changeView("CON_discover");
		    //下按钮条隐藏
		    jQuery(".mbBotBar").show();
		});
		colleague.appendTo(this._pCon);
	}
};
/*
 * 构造同事圈具体内容
 */
rh.ui.gridCard.prototype._bldColleagueCon = function() {
	var _self = this;
	var options = {};
    //数据获取
	var listData = FireFly.getPageData("SY_COMM_ENTITY_RELATION",options) || {};	
	
	var data = listData._DATA_;
	if (jQuery(".rhColleauge__ul").length == 0) {
		this._colleagueListUL = jQuery("<ul class='rhColleauge__ul'></ul>").appendTo(jQuery(".rhColleague"));
	}
	for (var i = 0;i < data.length;i++) {
		var dataItem = data[i];
		var item = this._bldColleagueConItem(dataItem);
		item.appendTo(this._colleagueListUL);
		item.bind("click",{"sId":dataItem.SERV_ID,"pkCode":dataItem.DATA_ID},function(event) {
			var sId = event.data.sId;
			var pkCode = event.data.pkCode;
			_self._openLayer(sId,pkCode);
		});
	}
};
/*
 * 同事圈列表项点击事件
 */
rh.ui.gridCard.prototype._openLayer = function(sId,pkCode) {
	var readOnly = false;
	var url = FireFly.getContextPath() + "/sy/base/view/stdCardView-mb.jsp?sId=" + sId 
	+ "&readOnly=" + readOnly + "&pkCode=" + pkCode;		
	this._guideTo(url);
};
/*
 * 同事圈列表项
 */
rh.ui.gridCard.prototype._bldColleagueConItem = function(item) {
	var liArray = [];

	liArray.push("<li class='rhGridCard__item'>");
	liArray.push("<div class='rhGridCard__item__left'>");
	liArray.push("<img class='rhGridCard__imgRadius' width='40px' height='40px' src='" + item.S_USER__IMG + "' userCode='" + item.SEND_USER_CODE + "'></img>");

	liArray.push("</div>");
	liArray.push("<div class='rhGridCard__item__right rhGridCard__itemRadius' title='点击进入详细处理'>");
	var title = item.TITLE;
	if (title && title.length > 60) {
		title = title.substring(0,60) + "...";
	}
	liArray.push("<h2 class='rhGridCard__item__title'>" + title);
	liArray.push("</h2>");

	liArray.push("<span class='rhGridCard_arrow'></span>");
	liArray.push("<span class='rhGridCard__item__time'>" + item.SERV_NAME + "</span>");
	liArray.push("  <span class='rhGridCard__item__time'>" + item.S_ATIME + "</span>");
	liArray.push("  <span class='rhGridCard__item__time'>" + item.S_USER__NAME + "</span>");
	liArray.push("</div>");
	liArray.push("</li>");
	return jQuery(liArray.join(""));
};
/*
 * 底部导航条:通讯录
 */
rh.ui.gridCard.prototype._bldContract = function() {
	var _self = this;
	if (jQuery(".rhContract").length == 0) {
		var contract = jQuery("<div class='rhContract rhDisplayView' style='display:none;'></div>");
		var nav = jQuery("<div class='rhGridSimple__nav' style=''><div class='rhGridSimple__nav__title'>通讯录</div>" +
				"<div class='mbTopBar-refresh mbTopBar-rightTwo'>刷新</div></div>");//<div class='mbTopBar-refresh mbTopBar-rightAdd'>+</div>
		nav.find(".mbTopBar-rightAdd").bind("click", function(event) {
			var url = FireFly.getContextPath() + "/sy/comm/mb/mbContractSelect.jsp";	
			_self._guideTo(url);
		});
		nav.find(".mbTopBar-rightTwo").bind("click", function(event) {
			_self._loader();
			_self._getUserAllData(true);
			jQuery("#rh_slider_obj").empty();
			jQuery("#rh_slider_obj").remove();
			_self._bldContractCon();
			_self._loader("hide");
		});
		nav.appendTo(contract);
		contract.appendTo(this._pCon);
	}
	this._bldWebChat();
	if (jQuery(".rhContractCard").length == 0) {//构造个人卡片
		var contract = jQuery("<div id='rhContractCard' class='rhContractCard rhDisplayView' style='display:none;'></div>");
		var nav = jQuery("<div class='rhGridSimple__nav' style=''><a href='#' class='mbBack mbTopBar-back'>返回</a><div class='rhGridSimple__nav__title'>详细资料</div></div>");
		nav.find(".mbTopBar-back").bind("click", function(event) {
             _self._changeView("CON_contract");
		});
		nav.appendTo(contract);
		contract.appendTo(this._pCon);
	}
};
/*
 * 构造通讯录具体内容
 */
rh.ui.gridCard.prototype._bldContractCon = function() {
	var _self = this;
	var options = {"_NOPAGE_":true,"_ORDER_":"USER_EN_NAME"};
	var storageFlag = false;
	var srorageTemp = {};
    //数据获取
	var data = {};
	if (window.localStorage && window.localStorage.getItem("rhContract")) {
		var localData = window.localStorage.getItem("rhContract");
		data = JSON.parse(localData);
	} else {
		var listData = FireFly.getPageData("SY_ORG_USER",options) || {};	
		data = listData._DATA_;
		storageFlag = true;
	}
	if (jQuery(".rhContract__ul").length == 0) {
		var demo = jQuery("<div id='rh_slider_obj' class='demo'></div>").appendTo(jQuery(".rhContract"));
		var slider = jQuery("<div id='slider'></div>").appendTo(demo);
		var sliderContent = jQuery("<div class='slider-content' id='slider-content'></div>").appendTo(slider);
		this._contractListUL = jQuery("<ul class='rhContract__ul'></ul>").appendTo(sliderContent);
		this.capitalArray = [];
	}
	jQuery.each(data,function(i,n) {
		var dataItem = n;
		if (storageFlag) {
			srorageTemp[dataItem.USER_CODE] = dataItem;
		}
		var item = _self._bldContractConItem(dataItem);
		item.bind("click",{"userCode":dataItem.USER_CODE,"userName":dataItem.USER_NAME,
			"phone":dataItem.USER_MOBILE,"userImg":dataItem.USER_CODE__IMG,"mail":dataItem.USER_EMAIL,
			"deptName":dataItem.DEPT_CODE__NAME,"userStatus":dataItem.USER_CODE__STATUS},function(event) {
				var data = event.data;
				//在线聊天
//			_self._changeView("CON_webChat");
//			_self._bldWebChatUser(data);
//			jQuery(".rhWebChat").fadeIn();
				
				_self._changeView("CON_rhContractCard");
				jQuery(".rhContractCard_container").remove();
				_self._bldContractCard(data);
				
				//清除通知红点
				jQuery(this).find(".rh_comm_icon").hide();
				delete _self._notiData[data.userCode];
			});
		item.find(".rh_slider_contract_add").bind("click",{"userCode":dataItem.USER_CODE,"userName":dataItem.USER_NAME,"phone":dataItem.USER_MOBILE},function(event) {
			var data = event.data;
			_self._addToLocalAddress(data);
			event.stopPropagation();
			return false;
		});
	});
	//设置高度
	//this._plugSliderNav('slider');
	//this._plugAndroidNoBarsOnTouchScreen("slider-content");
	var height = document.documentElement.clientHeight - 96;//$('.slider-nav', slider).height();
	$('.slider-content, .slider-nav').css('height',height);
	//设置通知
	jQuery.each(_self._notiData,function(i,n) {
		var userCode = n.from;
		if (userCode == "ALL") {
			return true;
		}
		jQuery(".rh_comm_icon[ucode='" + userCode + "']").show();
	});
	//存储数据到本地
	if (storageFlag) {
		//数据构造完后存储到本地
		if (window.localStorage) {
			window.localStorage.setItem("rhContract",JSON.stringify(srorageTemp));
		}
	}
};
/*
 * 构造联系人详细信息
 */
rh.ui.gridCard.prototype._bldContractCard = function(data) {
	var _self = this;
	var card = jQuery("#rhContractCard");
	var header = jQuery(".rhContractCard_header");
	if (header.length == 0) {
		var userName = data.userName;
		var userCode = data.userCode;
		var userImg = data.userImg;
		var deptName = data.deptName;
		var phone = data.phone || "";
		var mail = data.mail || "";
		var status = data.userStatus;
		var statusStr = "";
		if (status == 1) {
			statusStr = "(在线)";
		}
		var container = jQuery("<div class='rhContractCard_container'></div>");
		
		var header = jQuery("<div class='rhContractCard_header' style=''><img src='" + userImg + 
				"' class='userImg'/><span class='userName'>" + userName + "</span><span class='userStatus'>" + statusStr + "</span></div>");
		header.appendTo(container);
		
        var table = jQuery("<div class='rhContractCard_block'></div>").appendTo(container);
        var ul = jQuery("<ul class='rhContractCard_ul'></ul>").appendTo(table);
        var liDept = jQuery("<li><span class='rhContractCard_liLeft'>部门</span><span class='rhContractCard_liRight'>" + deptName + "</span></li>").appendTo(ul);
        var liTip = jQuery("<li><span class='rhContractCard_liLeft'>签名</span><span class='rhContractCard_liRight'></span></li>").appendTo(ul);
        var liPhone = jQuery("<li><span class='rhContractCard_liLeft'>电话</span><a href='tel:" + phone + 
        		"' class='rhContractCard_liRight'>" + phone + "</a><span class='mb-icon-span mb-right-nav'></span></li>").appendTo(ul);
        var mail = jQuery("<li><span class='rhContractCard_liLeft'>邮箱</span><a href='' class='rhContractCard_liRight'>" + mail + "</a></li>").appendTo(ul);
       
        var footer = jQuery("<a id='rhContractCard_footer' href='#' class='myButton_green'>发消息</a>").appendTo(container);
        footer.bind("click",function() {
			_self._changeView("CON_webChat");
			_self._bldWebChatUser(data);
			jQuery(".rhWebChat").fadeIn();
        });
        container.appendTo(card);
	}
};
/*
 * 添加到本地通讯录
 */
rh.ui.gridCard.prototype._addToLocalAddress = function(data) {
	var userCode = data.userCode;
	var userName = data.userName;
	var phone = data.phone;
	var xName = userName.substring(0,1);
	var lName = userName.substring(1);
    // create
    var contact = navigator.contacts.create();
    contact.displayName = userName;
    contact.nickname = userName;
    var name = new ContactName();
    name.givenName = lName; //名字
    name.familyName = xName;//姓氏
    contact.name = name;
    // phoneNumber
    var phoneNumbers = [];
    phoneNumbers[0] = new ContactField('work', '', false);
    phoneNumbers[1] = new ContactField('mobile', phone, true); // preferred number
    phoneNumbers[2] = new ContactField('home', '', false);
    contact.phoneNumbers = phoneNumbers;
    // save
    contact.save(onSaveSuccess,onSaveError);
    function onSaveSuccess(contact) {
        navigator.notification.alert('添加成功!',null,'添加到本地通讯录','确定');
    }
    function onSaveError(contactError) {
        navigator.notification.alert('未添加成功!',null,'添加到本地通讯录','确定');
    }
};

rh.ui.gridCard.prototype._socket = function() {
	var _self = this;
	return {
		sendMessage : function(currentUser,targetUser,message) {
		    var jsonObject = {'@class': 'com.rh.qixin.RhMessage',
		                      from: currentUser, 
		                      to: targetUser,
		                      body: message};
		    _self.socket.json.send(jsonObject);
		    //处理发送消息后当前置顶功能
		    var topData = {from: currentUser, 
                    to: targetUser,
                    body: message,
                    alertFlag: false,
                    time: rhDate.getTime()};
		    _self._socketMsgToTop(topData);
		},
		sendDisconnect :function() {
			_self.socket.disconnect();
		},
		getMsgRecords : function(currentUser,targetUser,preMsgId) {
			_self.socket.emit('msgRecords', {from: currentUser, to: targetUser,preMsgId: preMsgId, count: '10'});
		},
		setMsgReceived :function(targetUser) {
			_self.socket.emit('setMsgReceived', {target: targetUser});
		}
	};
};
/*
 * 通讯socket的连接的建立
 */
rh.ui.gridCard.prototype._sokectConnect = function() {
	var _self = this;
	var server = this._socketServ;
	var currentUser = this._nowUser;
	var userName = 'user' + Math.floor((Math.random()*1000)+1);
	this.socket =  io.connect(server);
	//connect
	this.socket.on('connect', function() {
	  login();
	  //_self._socket().getMsgRecords(currentUser,targetUser);
	  outputLink('<span class="connect-msg">Client has connected to the server!</span>');
	});
	//login
	function login() {
		_self.socket.emit('login', {userName: currentUser, password: '123456'});
		_self.socket.emit('recentContacts', {from: currentUser});
		_self.socket.emit('notifications', {from: currentUser});
	}	
	//取最近10条记录
	_self.socket.on('msgRecords', function(data) {
		//1 隐藏区域
		//2 第一次加载和更多加载情况
		if (_self._historyMoreFlag) {
			if (data.length == 0) {//没有更多了
				jQuery(".webchat_more").html("所有的都加载了！");
				return false;
			} else {
				jQuery(".webchat_list").hide();
				jQuery(".webchat_more").html("更多...");
			}
		} else {
			jQuery(".webchat_list").hide();
			jQuery(".webchat_list").empty();
		}
		//3 处理记录数据集
	    for(var i=0; i< data.length; i++) {
		    var msg = data[i];
		    if (i == 0) {//记录preMsgId
		    	_self._preMsgId = msg.id;
		    }
		    var from = msg.from;
		    var to = msg.to;
		    var body = msg.body;
		    var time = msg.time;
		    output(msg);
	    }
		//4 构造更多
		if ((jQuery("#webchat_more").length == 0) && data.length == 10) {
			var more = jQuery("<div id='webchat_more' class='webchat_more'>更多...</div>").prependTo(jQuery(".webchat_list"));
			more.bind("click",function(event) {
		    	_self._loader();
				_self._historyMoreFlag = true;
				jQuery(".webchat_history_last").removeClass("webchat_history_last");
				jQuery("#" + _self._preMsgId).addClass("webchat_history_last");
				_self._socket().getMsgRecords(_self._nowUser,_self._chatUserCode,_self._preMsgId);
			});
		}
		//5 显示区域
		jQuery(".webchat_list").show();
		_self._historyMoreFlag = false;
		setTimeout(function() {
			_self._scrollIntoView();
			jQuery("#rhWebChat_nav").css({"position":"fixed","left":"0px","top":"0px"});
		},0);
		_self._loader("hide");

	});
	//消息
	_self.socket.on('message', function(data) {
		if (_self._socketMsgFilter(data)) {
			output(data);
			//window.scrollTo(0,9999); 
		}
	});
	//通知
	_self.socket.on('notifications', function(data) {
		  for(var i=0; i< data.length; i++){
			  var noti = data[i];
			  var from = noti.from;
			  var msgCount = noti.msgCount;
			  if (msgCount == 0) {
				  continue;
			  }
			  _self._notiData[from] = noti;
			  _self._socketMsgToTop(noti);
			  //alert(noti.from + " : " + noti.msgCount);
		  }
//		  if (!jQuery.isEmptyObject(_self._notiData)) {
//			  //jQuery(".rh_comm_icon[ucode='contract']").show();
//			  jQuery(".rh_comm_icon_home[ucode='" + from + "']").show();
//			  
//		  }
	});
	_self.socket.on('recentContacts', function(data) {
         _self._bldContractRecent(data);
         _self._loader("hide");
	});
	_self.socket.on('disconnect', function() {
		outputLink('<span class="disconnect-msg">The client has disconnected!</span>');
	});
	function output(data) {
		//非聊天内容
	    var appendData = [];
	    var temp = {};
	    temp[data.from] = {"id":data.id,"time":data.time,"con":data.body};
        appendData.push(temp);
	    _self._bldWebChatUser(null,appendData,true);
	}
	function outputLink(msg) {
		//jQuery(".webchat_list").append(msg);
	}
};
/*
 * 收到消息的特殊处理，
 * 1 非当前聊天人，消息标红处理
 * 2 当前聊天人，返回true
 */
rh.ui.gridCard.prototype._socketMsgFilter = function(data) {
	var from = data.from;
	if (data.to == "ALL") {
		if (data.to == this._chatUserCode) {
	    	this.socket.emit('setMsgReceived', {target: from});
		    return true;
		} else {
            data.from = "ALL";
	        this._socketMsgToTop(data);//置顶消息人到页面顶部
	    	return false;			
		}
	} else {
	    if (from == this._chatUserCode) {//正在聊天人
	    	this.socket.emit('setMsgReceived', {target: from});
		    return true;
	    } else {//非正在聊天人
	        this._socketMsgToTop(data);//置顶消息人到页面顶部
	        this._notiData[from] = data;//存储消息体到当前view
	    	return false;
	    }		
	}
};
/*
 * 置顶消息
 * {"from":"admin","msgCount":3,}
 */
rh.ui.gridCard.prototype._socketMsgToTop = function(data) {
	var _self = this;
	var from = data.from;
	var to = data.to;
	var msgCount = data.msgCount || 1;
	var alertFlag = true;
	if (data.alertFlag === false) {
		alertFlag = false;
	}
	var body = data.body || "";//消息体
	var time = data.time || "";//时间
	//1.将最新的联系人置顶
	var obj = jQuery(".rhGridSimple__item[todotype='" + from + "']");
	if (!alertFlag) {
		obj = jQuery(".rhGridSimple__item[todotype='" + to + "']");
	}
	if (obj.length == 1) {//home页面存在此人的条目
		//把最新一条的消息体和时间显示出来
		if (body.length > 0) {
			var title = body;
			if (body.length > 18) {
				title = title.substring(0,18) + "..";
			}
			obj.find(".rhGridSimple__item__right p").html(title);
			if (time.length > 0) {
				obj.find(".rhGridSimple__item__right .rhGridSimple__item__time").text(time);
			}
		}
		//把提示数量和外层提醒显示出来
		if (alertFlag) {
			var count = parseInt(msgCount);
			var countObj = obj.find(".rhGridCardCount");
			var text = countObj.text();
			if (text.length > 0) {
				count = parseInt(countObj.text()) + parseInt(msgCount);
			}
			countObj.addClass("rhGridCardCount--show").text(count);
			//新消息提醒到外层消息条
			var name = _self._getUserData(from);
			if (from == "ALL") {
				name = "软虹公司";
			}
			var title = "来自：" + name + "的一条企信消息";
			this._appMsgAlert(title);
		}
	} else {//不存在此人条目
		if (!alertFlag) {
			var contact = {"lastMsg":body,"lastTime":rhDate.getTime(),"contact":to};
			var item = _self._bldContractRecentItem(contact);
			item.prependTo(this._gridSimpleUL);
			return true;
		}
	}
	obj.prependTo(this._gridSimpleUL);
};
/*
 * chat列表页
 */
rh.ui.gridCard.prototype._bldWebChatUser = function(data,appendData,appendFlag,func) {
	var _self = this;
	if (data) {
		this._chatUserCode = data.userCode;
		this._chatUserName = data.userName;
	}
	var userCode = this._chatUserCode;
	var userName = this._chatUserName;
	var nowUser = this._nowUser;//当前登录人
	if (userName == "ALL") {
		userName = "软虹公司";
	}
	jQuery("#rhWebChat__nav__title").html(userName);
	//获取历史聊天记录
	var chatData = [];
	if (appendData) {
		chatData = appendData;
	}
	//构造聊天列表
	var webChatList = jQuery(".webchat_list");
	if (webChatList.length == 0) {
		webChatList = jQuery("<div class='webchat_list' style='display:none;'></div>");
		//this._sokectConnect(nowUser,userCode);
		_self._socket().getMsgRecords(nowUser,userCode);
	} else if (appendFlag == true) {
	} else {
		webChatList.empty();
		this._socket().getMsgRecords(nowUser,userCode);
	}
	
	var len = chatData.length;
	for (var i = 0;i < len;i++) {
		var itemMix = chatData[i];
		var clas = "webchat_box_l";
		var item = {};
		var itemUserCode = "";
		if (userCode == "ALL") {//群聊
			jQuery.each(itemMix,function(i,n) {
				if (i == nowUser) {
					clas = "webchat_box_r";
				}
				item = n;
				itemUserCode = i;
			});
		} else if (itemMix[userCode]) {//对方用户
			item = itemMix[userCode];
			itemUserCode = userCode;
		} else if (itemMix[nowUser]) {//当前登录用户
			clas = "webchat_box_r";
			item = itemMix[nowUser];
			itemUserCode = nowUser;
		}
		var box = jQuery("<div id='" + item.id + "' class='webchat_box " + clas + "'></div>");//区块
		var itemUser = _self._getUserData(itemUserCode);
		var perImg = "/sy/theme/default/images/common/user0.png";
		var showUserName = "";
		if (itemUser) {
			perImg = itemUser.USER_CODE__IMG || "";
			if (userCode == "ALL") {
				showUserName = itemUser.USER_NAME || "";
			}
		}
		var perIcon = jQuery("<img src='" + perImg + "' class='webchat_box_pericon'></img>").appendTo(box);
		//var boxName = jQuery("<span class='webchat_box_name'>系统管理员</span>").appendTo(box);
		var info = jQuery("<div class='webchat_box_info'><span class='webchat_box_date'>" + item.time + " " + showUserName + "</span></div>").appendTo(box);
		var bg = jQuery("<div class='webchat_bg'></div>").appendTo(box);
		var con = jQuery("<div class='webchat_bg_con'></div>").appendTo(bg);
		var itemCon = item.con || "";
		if (item.rimg) {
			var img = jQuery("<img src='" + item.rimg + "' class='webchat_box_img'></img>").appendTo(bg);

		} else if (itemCon.indexOf("img::") == 0) {
			var img = itemCon.split("::");
			var url = "/file/" + img[1];
			var imgObj = jQuery("<img src='" + url + "' class='webchat_box_img'></img>").appendTo(bg);
			imgObj.bind("click",function(event) {//放大预览图片
				var src = jQuery(this).attr("src");
				_self._previewImg(src);
	        	event.stopPropagation();
	            return false;
			});
		} else if (itemCon.indexOf("map::") == 0) {
			var map = itemCon.split("::");
			var url = map[1] || "";
			var pos = map[2] || "";
			var mapObj = jQuery("<img src='" + url + "' class='webchat_box_img'></img>").appendTo(bg);
			if (pos) {
				//jQuery("head").find("script:last").attr("src",pos).appendTo(jQuery("head"));
			}
		} else if (itemCon.indexOf("audio::") == 0) {
			var audio = itemCon.split("::");
			var url = "/file/" + audio[1];
			var timeLong = audio[2] || "";
//			jQuery("<audio src='/file/1cfgDeS5R4yVu8MCmx8qwl.mp3' controls='controls'>Your browser does not support the audio element.</audio>").appendTo(bg);
			var audio =jQuery("<span class='webchat_audio' audiourl='" + url + "'>点击播放 " + timeLong + "</span>").appendTo(bg);
			audio.unbind("click").bind("click",function() {
				var audiourl = jQuery(this).attr("audiourl");
				var url = _self._http + audiourl;
				_self._playAudio(url);
			});
		} else {
			conP = jQuery("<p class='webchat_txt'>" + itemCon + "</p>").appendTo(con);
		}
		if (func) {
			con.bind("click",function() {
				func.call(_self);
			});
		}
		if (item.rtime) {
			jQuery("<div class='webchat_box_preTime'>" + item.rtime + "</div>").appendTo(bg);
		}

		var msgArr = jQuery("<div class='webchat_arr'></div>").appendTo(bg);
		if (_self._historyMoreFlag) {
			jQuery(".webchat_history_last").before(box);
		} else {
			box.appendTo(webChatList);
		}
	}
	if (jQuery(".webchat_list").length == 0) {
		webChatList.appendTo(jQuery(".rhWebChat"));
	} 
	//返回的属性设定
	if (data && data.back) {
		var back = data.back || "";
		jQuery(".rhWebChat").find(".mbTopBar-back").attr("back",back);
	}
};
/*
 * 通讯录列表项
 */
rh.ui.gridCard.prototype._bldContractConItem = function(item) {
	var liArray = [];
	var liInner = [];
	var userName = item.USER_NAME;
	var userCode = item.USER_CODE;
	var userImg = item.USER_CODE__IMG;
	var deptName = item.DEPT_CODE__NAME;
	var enName = item.USER_EN_NAME;
	var capital = null;
	if (enName) {
		capital = enName.substring(0,1);
	}
	if (jQuery.inArray(capital, this.capitalArray) == -1) {
		this.capitalArray.push(capital);
		liArray.push("<li id='" + capital + "'><a name='" + capital + "' class='title'>" + capital + "</a>");
		liInner.push("<ul class='rh_slider_contract_ul'>");//" + userImg + "
		liInner.push("<li class='rh_slider_inner_li'>" +
				"<a href='#'><span class='rh_comm_icon' ucode='" + userCode + "'></span><img class='rh_slider_contract_img'/>" +
				"<span class='rh_slider_contract_name'>" + userName + 
				"<span class='rh_slider_contract_deptL'>(" + deptName + ")</span></span>" +
				"<span class='rh_slider_contract_add'>添加到本地</span></a></li>");
		liInner.push("</ul>");
		liArray.push(liInner.join(""));
		liArray.push("</li>");
		var obj = jQuery(liArray.join(""));
		obj.appendTo(this._contractListUL);
		return obj.find(".rh_slider_inner_li");
	} else {//<span class='rh_slider_contract_dept'>" + deptName + "</span>
		this.capitalArray.push(capital);//capital.toUpperCase();
		var ul = jQuery("#slider").find("#" + capital).find(".rh_slider_contract_ul");//" + userImg + "
		var obj = jQuery("<li class='rh_slider_inner_li'>" +
				"<a href='#'><span class='rh_comm_icon' ucode='" + userCode + "'></span><img class='rh_slider_contract_img'/>" +
			    "<span class='rh_slider_contract_name'>" + userName + 
				"<span class='rh_slider_contract_deptL'>(" + deptName + ")</span></span><span class='rh_slider_contract_add'>添加到本地</span></a></li>").appendTo(ul);
		return obj;
	}
	
//	liArray.push("<li class='rhGridCard__item'>");
//	liArray.push("<div class='rhGridCard__item__left'>");
//	liArray.push("<img class='rhGridCard__imgRadius' width='40px' height='40px' src='" + item.USER_CODE__IMG + "' userCode='" + item.USER_CODE + "'></img>");
//
//	liArray.push("</div>");
//	liArray.push("<div class='rhGridCard__item__right rhGridCard__itemRadius' title='点击进入详细处理'>");
//	var title = item.USER_CODE__NAME;
//	if (title && title.length > 60) {
//		title = title.substring(0,60) + "...";
//	}
//	var status = item.USER_CODE__STATUS;//在线状态
//	if (status == 1) {//在线
//		status = "<label style='color:green;'>[在线]</label>";
//	} else {
//		status = "";
//	}
//	liArray.push("<h2 class='rhGridCard__item__title'>" + title);
//	liArray.push(" " + status);
//	liArray.push("</h2>");
//
//	liArray.push("<span class='rhGridCard_arrow'></span>");
//	liArray.push("<span class='rhGridCard__item__time'>" + item.DEPT_CODE__NAME + "</span>");
//	liArray.push("  <span class='rhGridCard__item__time'>" + item.USER_POST + "</span>");
//	if (item.USER_MOBILE) {
//		liArray.push("<div class='rhGridCard__item__time'>拨打：<a href='tel:" + item.USER_MOBILE + "' style='font-size:12px;line-height:40px;'>" + item.USER_MOBILE + "</a></div>");
//	}
//	liArray.push("</div>");
//	liArray.push("</li>");
	return jQuery(liArray.join(""));
};

/*
 * 录制音频
 */
rh.ui.gridCard.prototype._recordAudio = function() {
	// 录制音频
	this.src = "myrecording.mp3";
	if (this._platform == "iphone") {
		this.src = "myrecording.wav";
	}
	this.mediaRec = new Media(this.src, onSuccess, onError);
	// 开始录制音频
	this.mediaRec.startRecord();
	// 10秒钟后停止录制
	var recTime = 0;
	this.recInterval = setInterval(function() {
		recTime = recTime + 1;
		setAudioPosition(recTime + "'");
	}, 1000);
	jQuery("#rhWebChat_media_start").addClass("rhWebChat_btn_success");
	// 创建Media对象成功后调用的回调函数
	function onSuccess() {
		console.log("recordAudio():Audio Success");
	}
	// 创建Media对象出错后调用的回调函数
	function onError(error) {
		alert('code: '    + error.code    + '\n' + 
			  'message: ' + error.message + '\n');
	}
	// 设置音频播放位置
	function setAudioPosition(position) {
		document.getElementById('rhWebChat_position').innerHTML = position;
	}
};
/*
 * 停止录音
 */
var fileSystem;
rh.ui.gridCard.prototype._stopRecordAudio = function() {
	var _self = this;
	var src = this.src;
	this.mediaRec.stopRecord();
	clearInterval(this.recInterval);
	var rtime = jQuery("#rhWebChat_position").text();
	var appendData = [];
	var temp = {};
	var time = rhDate.getCurentTime();
	temp[this._nowUser] = {"time":time,"con":"audio::temp","rtime":rtime};
	appendData.push(temp);
	
	this._bldWebChatUser(null,appendData,true);
	
	if (this._platform == "iphone") {
		window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, 
				function(fs) {
					fileSystem = fs;
					src = fileSystem.root.fullPath + "/" + src;
					_self._uploadAudio(src);
				}, function(e) {
					alert('failed to get fs');
					alert(JSON.stringify(e));
		});
	} else {
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
				function(fs) {
					fileSystem = fs;
					var src2 = fileSystem.root.fullPath + "/" + src;
					//window.plugins.childBrowser.rhShow(src2);
					_self._uploadAudio(src2);
				}, function(e) {
					alert('failed to get fs');
					alert(JSON.stringify(e));
		});
	}
};
/*
 * 上传音频到服务器
 */
rh.ui.gridCard.prototype._uploadAudio = function(fileURI) {
	var _self = this;
	var reData = {};
	function win(r) {
		reData = jQuery.parseJSON(r.response);
		var pk = reData._DATA_[0]._PK_;
	    console.log("Code = " + r.responseCode);
	    console.log("Response = " + r.response);
	    console.log("Sent = " + r.bytesSent);
	    var imgUrl = "/file/" + pk;
	    //给audio的audiourl增加返回的地址
	    var obj = jQuery(".webchat_audio").last().attr("audiourl",imgUrl);
	    obj.bind("click",function(event) {
			var audiourl = jQuery(this).attr("audiourl");
			var url = _self._http + audiourl;
			_self._playAudio(url,audiourl);
	    });
	    //成功上传后发送消息到消息服务器
	    var timeLong = _self._recordAudioTime;
	    _self._socket().sendMessage(_self._nowUser,_self._chatUserCode,"audio::" + pk + "::" + timeLong);
	}

	function fail(error) {
	    alert("An error has occurred: Code = " + error.code);
	    console.log("upload error source " + error.source);
	    console.log("upload error target " + error.target);
	}
	var uri = encodeURI(this._http + "/file/");
	var options = new FileUploadOptions();
	options.fileKey="file";
	options.fileName= "mbAduioFile.mp3";
	options.mimeType="audio/mpeg";
	if (this._platform == "iphone") {
		options.fileName= "mbAduioFile.wav";
		options.mimeType="audio/x-wav";
	}
//	var params = {};
//	params.FILE_TYPE = "audio/x-wav";
//	options.params = params;
    
	var ft = new FileTransfer();
	ft.upload(fileURI, uri, win, fail, options,true);
};

/*
 * 播放音频
 */
rh.ui.gridCard.prototype._playAudio = function(url,audiourl) {
	//播放音频
	// 播放url指向的音频文件
//	var url = "http://172.16.0.80:9009/aaa.mp3";
	var my_media = new Media(url,
		// 新建Media对象成功后调用的回调函数
	   	function() {
		   	console.log("playAudio():Audio Success");
	   	},
	   	// 新建Media对象出错后调用的回调函数
	   	function(err) {
	   		alert(JsonToStr(err));
		   	console.log("playAudio():Audio Error: "+err);
		}
	);
	// 播放音频
	my_media.play();
//	var mediaTimer = null;
//	function setAudioPosition(position) {
//		jQuery(".webchat_audio[audiourl='" + audiourl + "'").html(position);
//    }
//	
//	if (mediaTimer == null) {
//        mediaTimer = setInterval(function() {
//            // get my_media position
//            my_media.getCurrentPosition(
//                // success callback
//                function(position) {
//                    if (position > -1) {
//                        setAudioPosition((position) + "'");
//                    }
//                },
//                // error callback
//                function(e) {
//                    setAudioPosition("Error: " + e);
//                }
//            );
//        }, 1000);
//    }
	
	// 10秒钟后暂停播放
//	setTimeout(function() {
//	   	my_media.stop();
//	}, 10000);        
};

/*
 * chat页布局处理
 */
rh.ui.gridCard.prototype._bldWebChat = function() {
	var _self = this;
	if (jQuery(".rhWebChat").length == 0) {
		var webChat = jQuery("<div id='rhWebChat' class='rhWebChat rhDisplayView' style='display:none;'></div>");
		var nav = jQuery("<div id='rhWebChat_nav' class='rhGridSimple__nav' style=''><a href='#' class='mbBack mbTopBar-back'>返回</a><div class='rhGridSimple__nav__title'><span id='rhWebChat__nav__title'>聊天</span></div></div>");
		nav.appendTo(webChat);
		nav.find(".mbTopBar-back").bind("click",function(event) {
			jQuery(this).addClass("active");
			jQuery(".rhWebChat").hide();
			var back = jQuery(this).attr("back");
			if (back) {
				jQuery("." + back).fadeIn();
			} else {
				jQuery(".rhContract").fadeIn();
			}
		    //下按钮条隐藏
		    jQuery(".mbBotBar").show();
		    //聊天人置空
            _self._chatUserCode = ""
		    //_self._socket().sendDisconnect();
		    //_self.socket = null;
            event.stopPropagation();
            return false;
		});
		webChat.appendTo(this._pCon);
		//聊天输入区
		var chatArea = jQuery("<div id='rhWebChat__area' class='rhWebChat__area'>" +
				"<input id='rhWebChat_media' type='button' class='rhWebChat_btn' value='语音'/>" +
				"<span id='rhWebChat_more' class='rhWebChat_more'>+</span>" +
				"<input id='rhWebChat_media_start' type='button' class='rhWebChat__displaynone rhWebChat_btn' value='点击开始说话'/>" + 
				"<span id='rhWebChat_position' class='rhWebChat__displaynone'>0'</span>" +		
		        "<input id='rhWebChat__input' x-webkit-speech placeholder='点击开始回复'/>" +
		        "<input id='rhWebChat_send' type='button' class='rhWebChat_btn' value='发送'/>" +
		        "<div id='rhWebChat_moreCon' class='rhWebChat_moreConNoDis' style='float:left;width:100%;height:50px;line-height:40px;'>" +
		        "<span id='getPhoto' style='background-color:white;display:block;text-align:center;margin:5px;float:left;width:40px;height:40px;border:1px gray solid;'>照片</span>" +
		        "<span id='capturePhoto' style='background-color:white;display:block;text-align:center;margin:5px;float:left;width:40px;height:40px;border:1px gray solid;'>拍摄</span>" +
		        "<span id='nowPosition' style='background-color:white;display:block;text-align:center;margin:5px;float:left;width:40px;height:40px;border:1px gray solid;'>位置</span>" +
		"</div></div>");
		chatArea.appendTo(webChat);
		jQuery("#rhWebChat__input").bind("click", function(event) {
			event.stopPropagation();
		});
		
		//切换按钮 
		jQuery("#rhWebChat_media").bind("click",function(event) {
			if (jQuery("#rhWebChat_media_start:visible").length == 0) {
				jQuery("#rhWebChat__input").hide();
				jQuery("#rhWebChat_media_start").show();
				jQuery("#rhWebChat_position").show();
				jQuery("#rhWebChat_media").attr("value","文字");
			} else if (jQuery("#rhWebChat_media_start:visible").length == 1) {
				jQuery("#rhWebChat_media_start").hide();
				jQuery("#rhWebChat_position").hide();
				jQuery("#rhWebChat__input").show();
				jQuery("#rhWebChat_media").attr("value","语音");	
			}
			event.stopPropagation();
		});
        //录音按钮
		jQuery("#rhWebChat_media_start").bind("click",function(event) {
			if (jQuery(this).hasClass("rhWebChat_btn_success")) {
				_self._stopRecordAudio();
				jQuery(this).removeClass("rhWebChat_btn_success");
				jQuery(this).css("color","black").attr("value","点击开始说话");
				_self._recordAudioTime = jQuery("#rhWebChat_position").text();//录制时间
				jQuery("#rhWebChat_position").text("0'");
			} else {
				jQuery(this).removeClass("rhWebChat_btn_success");
				jQuery("#rhWebChat_position").show();
				jQuery(this).css("color","red").attr("value","点击结束录音");
				_self._recordAudio();
			}
			event.stopPropagation();
		});
		//发送事件绑定
	    jQuery("#rhWebChat_send").click(function(event) {
	        	var input = jQuery("#rhWebChat__input");
	        	var text = input.val();
	        	if (text.length == 0) {
	        		return false;
	        	}
	        	var nowUser = _self._nowUser;
	        	var appendData = [];
	        	var data = {};
	        	data[nowUser] = {"time":rhDate.getTime(),"con":text};
	        	appendData.push(data);
	        	_self._bldWebChatUser(null,appendData,true);
	        	_self._socket().sendMessage(nowUser,_self._chatUserCode,text);
	        	input.val("");
	        	setTimeout(function() {
	        		jQuery("#rhWebChat__area").css("bottom","0px");
	        		jQuery(".rhGridSimple__nav").css("top","0px");
	    			//window.scrollTo(0,9999); 
	        		_self._scrollIntoView();
	        	},0);
	        	event.stopPropagation();
	            return false;
	    });
		//更多展开收起事件
	    jQuery("#rhWebChat_more").click(function(event) {
	    	var obj = jQuery("#rhWebChat_moreCon");
	    	if (obj.hasClass("rhWebChat_moreConNoDis")) {
	    		obj.removeClass("rhWebChat_moreConNoDis");
	    	} else {
	    		obj.addClass("rhWebChat_moreConNoDis");
	    	}
	    	event.stopPropagation();
	    });
		//选择图片
	    jQuery("#getPhoto").click(function(event) {
	    	_self._chatGetPhoto(pictureSource.SAVEDPHOTOALBUM);//PHOTOLIBRARY
	    });
		//拍摄照片
	    jQuery("#capturePhoto").click(function(event) {
	    	_self._chatCapturePhoto();
	    });
		//当前位置
	    jQuery("#nowPosition").click(function(event) {
	    	_self._chatMapPosition();
	    });
//		jQuery("#rhWebChat_media_start").bind("mouseup",function() {
//			_self._stopRecordAudio();
//		});
//		if (!('webkitSpeechRecognition' in window)) { 
//			alert("false");
//		} else {
//			alert("ok");
//		}
	    event.stopPropagation();
	}
};
function renderReverse(data) {
	var address = data.result.formatted_address;
	var add = jQuery("<div>" + address + "</div>");
	jQuery(".webchat_bg").last().append(add);
};
/*
 * 选择图片和拍照成功后调用
 */
rh.ui.gridCard.prototype.onMapSuccess = function(position) {
	var lon = position.coords.longitude;
	var lat = position.coords.latitude;
	var nowp = lon + "," + lat;
	var location = lat + "," + lon;
//    alert('Latitude: '          + position.coords.latitude          + '\n' +
//          'Longitude: '         + position.coords.longitude         + '\n' +
//          'Altitude: '          + position.coords.altitude          + '\n' +
//          'Accuracy: '          + position.coords.accuracy          + '\n' +
//          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
//          'Heading: '           + position.coords.heading           + '\n' +
//          'Speed: '             + position.coords.speed             + '\n' +
//          'Timestamp: '         + position.timestamp                + '\n');
	var imageUrl = "http://api.map.baidu.com/staticimage?width=150&height=100&center=&zoom=12&labels=" + nowp +
			"&labelStyles=%E6%B5%8B%E8%AF%95,1,14,0xffffff,0x000fff,1&markers=" + nowp + "&markerStyles=l,";
	var positionName = "http://api.map.baidu.com/geocoder/v2/?ak=75868899752a81c6e4812f016aea2a9f&callback=renderReverse" +
			"&location=" + location + "&output=json&pois=0";
	var nowUser = this._nowUser;
	var appendData = [];
	var data = {};
	//var imageUrl = event.imageUrl;
	var time = rhDate.getCurentTime();
	data[nowUser] = {"time":time,"con":"map::" + imageUrl + "::" + positionName};
	appendData.push(data);
	this._bldWebChatUser(null,appendData,true);	
	
	jQuery("head").find("script:last").attr("src",positionName).appendTo(jQuery("head"));
	this._socket().sendMessage(this._nowUser,this._chatUserCode,"map::" + imageUrl);
};
rh.ui.gridCard.prototype._chatMapPosition = function() {
	navigator.geolocation.getCurrentPosition(onMapSuccess, this.onFail);
};
/*
 * 选择图片和拍照成功后调用
 */
rh.ui.gridCard.prototype.onPhotoURISuccess = function(imageURI) {
	var nowUser = this._nowUser;
	var appendData = [];
	var data = {};
	var time = rhDate.getCurentTime();
	data[nowUser] = {"time":time,"rimg":"/"};
	appendData.push(data);
	this._bldWebChatUser(null,appendData,true);
	this._uploadImg(imageURI);
};
rh.ui.gridCard.prototype.onFail = function(message) {
	alert('Failed because: ' + message);
};

/*
 * 上传图片到服务器
 */
rh.ui.gridCard.prototype._uploadImg = function(fileURI) {
	var _self = this;
	var reData = {};
	function win(r) {
		reData = jQuery.parseJSON(r.response);
		var pk = reData._DATA_[0]._PK_;
	    console.log("Code = " + r.responseCode);
	    console.log("Response = " + r.response);
	    console.log("Sent = " + r.bytesSent);
	    var imgUrl = "/file/" + pk;
	    jQuery(".webchat_box_img").last().attr("src",imgUrl);
	    //成功上传后发送消息到消息服务器
	    _self._socket().sendMessage(_self._nowUser,_self._chatUserCode,"img::" + pk);
	}

	function fail(error) {
	    alert("An error has occurred: Code = " + error.code);
	    console.log("upload error source " + error.source);
	    console.log("upload error target " + error.target);
	}
	var uri = encodeURI(this._http + "/file/");
	var options = new FileUploadOptions();
	options.fileKey="file";
	options.fileName= "mbFile";
	options.mimeType="image/jpeg";
    
	var ft = new FileTransfer();
	ft.upload(fileURI, uri, win, fail, options);
};

rh.ui.gridCard.prototype._chatGetPhoto = function(source) {
    // Retrieve image file location from specified source
	if (this._platform == "iphone") { //cordova2.8 bug
		navigator.camera.getPicture(onPhotoURISuccess, this.onFail, { quality: 20,
			destinationType: destinationType.NATIVE_URI,
			sourceType: pictureSource.SAVEDPHOTOALBUM });
	} else {
		navigator.camera.getPicture(onPhotoURISuccess, this.onFail, { quality: 50,
			destinationType: destinationType.FILE_URI,
			sourceType: pictureSource.SAVEDPHOTOALBUM });
	}
};
rh.ui.gridCard.prototype._chatCapturePhoto = function(source) {
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoURISuccessFix, this.onFail, { quality: 20,
      destinationType: destinationType.FILE_URI});
};
/*
 * 底部导航条:发现
 */
rh.ui.gridCard.prototype._bldDiscover = function() {
	var _self = this;
	if (jQuery(".rhDiscover").length == 0) {
		var discover = jQuery("<div class='rhDiscover rhDisplayView' style='display:none;width:100%;'></div>");//height:" + _self._viewHei + "px;
		var nav = jQuery("<div class='rhGridSimple__nav' style=''><div class='rhGridSimple__nav__title'>发现</div></div>");
		nav.appendTo(discover);
		//朋友圈
		var blockColleague = jQuery("<div class='rh_block rh_block--marginTop'></div>");
		jQuery("<span class='rh_block_img rh_block_img__colleague'></span>").appendTo(blockColleague);
        jQuery("<span class='rh_block_title'>同事圈</span>").appendTo(blockColleague);
        jQuery("<span class='mb-icon-span mb-right-nav'></span>").appendTo(blockColleague);

        blockColleague.bind("mousedown",function(event) {
        	_self._changeView("CON_colleague");
			return false;
		});
        blockColleague.appendTo(discover);
		//功能桌面
		var blockDesk = jQuery("<div class='rh_block'></div>");
		jQuery("<span class='rh_block_img rh_block_img__desk'></span>").appendTo(blockDesk);
        jQuery("<span class='rh_block_title'>功能桌面</span>").appendTo(blockDesk);
        jQuery("<span class='mb-icon-span mb-right-nav'></span>").appendTo(blockDesk);

        blockDesk.bind("mousedown",function(event) {
        	_self._changeView("CON_desk");
			return false;
		});
        blockDesk.appendTo(discover);
		//扫一扫
		var blockScan = jQuery("<div class='rh_block'></div>");
		jQuery("<span class='rh_block_img rh_block_img__scan'></span>").appendTo(blockScan);
        jQuery("<span class='rh_block_title'>扫一扫</span>").appendTo(blockScan);
        jQuery("<span class='mb-icon-span mb-right-nav'></span>").appendTo(blockScan);
        blockScan.bind("mousedown",function(event) {
			return false;
		});
        blockScan.appendTo(discover);
		
		discover.appendTo(this._pCon);
	}
};
/*
 * 底部导航条:我
 */
rh.ui.gridCard.prototype._bldMe = function() {
	var _self = this;
	if (jQuery(".rhMe").length == 0) {
		//标题
		var me = jQuery("<div class='rhMe rhDisplayView' style='display:none;'></div>");
		var nav = jQuery("<div class='rhGridSimple__nav' style=''><div class='rhGridSimple__nav__title'>我</div></div>");
		nav.appendTo(me);
		//个人
		var block = jQuery("<div class='rh_block rh_block--marginTop'></div>");
		var img = jQuery("<img style='display:inline-block;float:left;' class='rhGridCard__imgRadius' width='40px' height='40px' src='" + System.getVar("@USER_IMG@") + "' ></img>");
        img.appendTo(block);
        jQuery("<span class='rh_block_title'>" + System.getVar("@DEPT_NAME@") + "   " + System.getVar("@USER_NAME@") + "</span>").appendTo(block);
		block.appendTo(me);
		//桌面设置
		var blockDeskSet = jQuery("<div class='rh_block'></div>");
		jQuery("<span class='rh_block_img rh_block_img__set'></span>").appendTo(blockDeskSet);
        jQuery("<span class='rh_block_title'>桌面设置</span>").appendTo(blockDeskSet);
        jQuery("<span class='mb-icon-span mb-right-nav'></span>").appendTo(blockDeskSet);

        blockDeskSet.bind("mousedown",function(event) {
			var url = FireFly.getContextPath() + "/sy/comm/desk-mb/mbDeskConfigView.jsp?";		
			_self._guideTo(url);
			return false;
		});
        blockDeskSet.appendTo(me);
		//我的收藏
		var blockFavor = jQuery("<div class='rh_block'></div>");
		jQuery("<span class='rh_block_img rh_block_img__favor'></span>").appendTo(blockFavor);
        jQuery("<span class='rh_block_title'>我的收藏</span>").appendTo(blockFavor);
        jQuery("<span class='mb-icon-span mb-right-nav'></span>").appendTo(blockFavor);
        blockFavor.bind("mousedown",function(event) {
			return false;
		});
        blockFavor.appendTo(me);
		//退出
		//var exit = jQuery("<input id='rh_app_exit' type='button' style='width:90%;height:50px;margin:20px 5% 0px 5%;' value='退出登录'>");
		var exit = jQuery("<a id='rh_app_exit' href='#' class='myButton'>退出登录</a>");
        exit.bind("click",function() {
        	//history.go(-1);
        	//跳转到app的登陆页
        	//window.localStorage.getItem(sName);
        	window.history.go(-(history.length - 1));
		});
		exit.appendTo(me);
		me.appendTo(this._pCon);
	}
};
/*
 * 功能桌面布局预处理
 */
rh.ui.gridCard.prototype._bldDesk = function() {
	var _self = this;
	if (jQuery(".rhFuncDesk").length == 0) {
		var funcDesk = jQuery("<div class='rhFuncDesk rhDisplayView' style='display:none;height:" + _self._viewHei + "px;'></div>");
		var nav = jQuery("<div class='rhGridSimple__nav' style=''><a href='#' id='rhFuncDesk_back' class='mbBack mbTopBar-back'>返回</a><div class='rhGridSimple__nav__title'>功能桌面</div></div>");
		nav.appendTo(funcDesk);
		nav.find(".mbTopBar-back").bind("click",function(event) {
			jQuery(this).addClass("active");
			_self._changeView("CON_discover");
		    //下按钮条隐藏
		    jQuery(".mbBotBar").show();
		});
		funcDesk.appendTo(this._pCon);
	}
};
/*
 * 功能桌面实际数据处理
 */
rh.ui.gridCard.prototype._bldDeskData = function() {
	var _self = this;
	if (jQuery(".mbDesk-container").length == 0) {
		var deskView = new mb.vi.deskView({"id":"rh_desk_app","topBarFlag":false,"pCon":jQuery(".rhFuncDesk")});
		deskView.show();
    }
};
/*
 * 底部导航条:切换
 */
rh.ui.gridCard.prototype._changeView = function(conId) {
	jQuery(".rhDisplayView:visible").hide();
	if (conId == "CON_cochat") {//企信
		jQuery(".mbBotBar").show();
		jQuery(".rhGridSimple").fadeIn();
	} else if (conId == "CON_colleague") {//同事圈
		jQuery(".mbBotBar").hide();
		if (jQuery(".rhColleauge__ul").length == 0) {
			this._bldColleagueCon();
		}
		jQuery(".rhColleague").fadeIn();
	} else if (conId == "CON_contract") {//通讯录
		jQuery(".mbBotBar").show();
		if (jQuery(".rhContract__ul").length == 0) {
			this._bldContractCon();
		}
		jQuery(".rhContract").fadeIn();
	} else if (conId == "CON_webChat") {//在线聊天
		jQuery(".mbBotBar").hide();
	} else if (conId == "CON_discover") {//发现
		jQuery(".mbBotBar").show();
		jQuery(".rhDiscover").fadeIn();
	} else if (conId == "CON_me") {//我
		jQuery(".mbBotBar").show();
		jQuery(".rhMe").fadeIn();
	} else if (conId == "CON_desk") {//功能桌面
		jQuery(".mbBotBar").hide();
		this._bldDeskData();
		jQuery(".rhFuncDesk").fadeIn();
	} else if (conId == "CON_rhContractCard") {//个人卡片
		jQuery(".rhContractCard").fadeIn();
	}
};
/*
 * 图片的预览
 */
rh.ui.gridCard.prototype._previewImg = function(src) {
	var url = this._http + "/sy/comm/mb/mbPreviewImg.jsp?src=" + src;
	var ref = window.open(url, '_blank', 'location=no');//新打开，隐藏地址栏
	ref.addEventListener('loadstart', function(event) {
		//alert('start: ' + event.url); 
	});
	ref.addEventListener('exit', function(event) {
		//alert(event.type); 
    });
};
/*
 * 不同的应用跳转方式的处理
 */
rh.ui.gridCard.prototype._guideTo = function(url,title) {
	if ((this._source == "app")) {
		url = FireFly.getHostURL() + FireFly.getContextPath() + url;
		if (url.indexOf("?") > 0) {
			url += "&source=app";
		} else {
			url += "?source=app";
		}
		url += "&platform=" + this._platform;
		var ref = window.open(url, '_blank', 'location=no');//新打开，隐藏地址栏
		ref.addEventListener('loadstart', function(event) {
			//alert('start: ' + event.url); 
		});
		ref.addEventListener('exit', function(event) {
			//alert(event.type); 
	    });
//		window.plugins.childBrowser.showWebPage(url, { showLocationBar: false });
//		window.plugins.childBrowser.onClose= function(data) {
//			//alert(JsonToStr(data));
//		};
	} else if (this._source == "note") {
		var options = {"url":url, "tTitle":title, "menuFlag":3};
		Tab.open(options);
	} else {
		window.location.href = url;
	}
};
/*
 * 检查网络连接情况
 */
rh.ui.gridCard.prototype._checkNetwork = function() {
	if ((this._source == "app") && window.plugins) {
		var networkState = navigator.connection.type;
		var states = {};  
		states[Connection.UNKNOWN]  = 'Unknown connection';//未知连接  
		states[Connection.ETHERNET] = 'Ethernet connection';//以太网  
		states[Connection.WIFI]     = 'WiFi connection';//wifi    
		states[Connection.CELL_2G]  = 'Cell 2G connection';//2G  
		states[Connection.CELL_3G]  = 'Cell 3G connection';//3G  
		states[Connection.CELL_4G]  = 'Cell 4G connection';//4G  
		states[Connection.CELL]     = 'Cell generic connection';//蜂窝网络  
		states[Connection.NONE]     = 'No network connection';  
		if (networkState == Connection.NONE) {
			return false;
		} else {
			return true;
		}
	} else {
		return true;
	}
};
/*
 * android的回退按钮的监听
 */
rh.ui.gridCard.prototype._androidBackListen = function() {
	var _self = this;
	//BackButton按钮
	function onBackKeyDown() {
		var cardShowFlag = jQuery(".rhGridCard:visible").length;
		var gridShowFlag = jQuery(".rhGridSimple:visible").length;
		if(cardShowFlag === 1) {
			//navigator.app.exitApp();
			jQuery("#rhGridCard_back").click();
		} else if (jQuery(".rhFuncDesk:visible").length == 1) {
			_self._changeView("CON_discover");
		} else if (jQuery(".rhColleague:visible").length == 1) {
			_self._changeView("CON_discover");
		} else if (jQuery(".rhWebChat:visible").length == 1) {
			var backObj = jQuery(".rhWebChat").find(".mbTopBar-back");
			var back = backObj.attr("back");
			if (back) {
				backObj.click();
			} else {
				_self._changeView("CON_contract");
			}
			
		} else if (jQuery(".rhContractCard:visible").length == 1) {
			_self._changeView("CON_contract");
		} else {
			navigator.app.backHistory();  
		}
	}
    function onDeviceReady() {
    	//添加回退按钮事件
    	document.addEventListener("backbutton",onBackKeyDown,false); 
    	pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
    }
	document.addEventListener("deviceready", onDeviceReady, false);
};
/*
 * 底部导航条:企信、同事圈、发现、我
 */
rh.ui.gridCard.prototype._bldFooter = function() {
	var _self = this;
    jQuery(".mbBotBar-con").bind("click", function(event) {
		var node = jQuery(this);
		jQuery(".mbBotBar-nodeActive").removeClass("mbBotBar-nodeActive");
		var conId = node.attr("id");
        _self._changeView(conId);
        //标红的处理
        jQuery(this).find(".rh_comm_icon").hide();
	});
};
/**
 * 最后执行
 */
rh.ui.gridCard.prototype._afterLoad = function() {
	var _self = this;
	jQuery(".rhGridCard__imgRadius").unbind("mouseover").bind("mouseover",function(event){
		var user_code = jQuery(this).attr("userCode");
		new rh.vi.userInfo(event, user_code);//event，事件对象；user_code，用户编码
	});
	//app应用
	if (this._isNativeApp) {
		var si = setInterval(function() {
			if (_self._checkNetwork() == true) {
				_self._getAlertData();
			} else {
				jQuery("#rhGridSimple__nav__count").html("(未连接)");
			}
		},6000);
		if (this._platform == "Android") {
			this._androidBackListen();
		} else if (this._platform == "iphone") {
		    function onDeviceReady() {
		    	//添加回退按钮事件
		    	pictureSource=navigator.camera.PictureSourceType;
		        destinationType=navigator.camera.DestinationType;
		    }
			document.addEventListener("deviceready", onDeviceReady, false);
		}
	} else {
		var si = setInterval(function() {
				_self._getAlertData();
		},60000);
	}
	//数量更新
	this._refreshAllCount();
};
/**
 * 通讯录英文字母滑动组件
 */
rh.ui.gridCard.prototype._plugSliderNav = function(id) {
	var defaults = { items: ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"], debug: false, height: null, arrows: true};
	var opts = $.extend(defaults, {}); var o = $.meta ? $.extend({}, opts, $$.data()) : opts; var slider = $("#" +id); $(slider).addClass('slider');
	$('.slider-content li:first', slider).addClass('selected');
	$(slider).append('<div class="slider-nav"><ul></ul></div>');
	for(var i in o.items) $('.slider-nav ul', slider).append("<li><a alt='#"+o.items[i]+"'>"+o.items[i]+"</a></li>");
	var height = document.documentElement.clientHeight - 93;//$('.slider-nav', slider).height();
	if(o.height) height = o.height;
	$('.slider-content, .slider-nav', slider).css('height',height);
	if(o.debug) $(slider).append('<div id="debug">Scroll Offset: <span>0</span></div>');
	$('.slider-nav a', slider).click(function(event){
		var target = $(this).attr('alt');
		var cOffset = $('.slider-content', slider).offset().top;
		var tOffset = $('.slider-content '+target, slider).offset().top;
		var height = $('.slider-nav', slider).height(); if(o.height) height = o.height;
		var pScroll = (tOffset - cOffset) - height/8;
		$('.slider-content li', slider).removeClass('selected');
		$(target).addClass('selected');
		$('.slider-content', slider).stop().animate({scrollTop: '+=' + pScroll + 'px'});
		if(o.debug) $('#debug span', slider).html(tOffset);
	});
//	if(o.arrows){
//		$('.slider-nav',slider).css('top','0px');
//		$(slider).prepend('<div class="slide-up end"><span class="arrow up"></span></div>');
//		$(slider).append('<div class="slide-down"><span class="arrow down"></span></div>');
//		$('.slide-down',slider).click(function(){
//			$('.slider-content',slider).animate({scrollTop : "+="+height+"px"}, 500);
//		});
//		$('.slide-up',slider).click(function(){
//			$('.slider-content',slider).animate({scrollTop : "-="+height+"px"}, 500);
//		});
//	}
};
/**
 * android下2.3div滚动bug
 */
rh.ui.gridCard.prototype._plugAndroidNoBarsOnTouchScreen = function(arg) {
	  var elem, tx, ty;
	  if('ontouchstart' in document.documentElement ) {
	          if (elem = document.getElementById(arg)) {
	              elem.style.overflow = 'hidden';
	              elem.ontouchstart = ts;
	              elem.ontouchmove = tm;
	          }
	  }
	  function ts( e ) {
	    var tch;
	    if(e.touches.length == 1 ) {
	      e.stopPropagation();
	      tch = e.touches[ 0 ];
	      tx = tch.pageX;
	      ty = tch.pageY;
	    }
	  }
	  function tm( e ) {
	    var tch;
	    if(  e.touches.length == 1 ) {
	      e.preventDefault();
	      e.stopPropagation();
	      tch = e.touches[ 0 ];
	      this.scrollTop +=  ty - tch.pageY;
	      ty = tch.pageY;
	    }
	  }	
};
/**
 * 本地存放最近联系人信息
 */
rh.ui.gridCard.prototype._storageContractRecent = function(data) {
	if (window.localStorage) {
//		var localData = window.localStorage.getItem("rhContractRecent");
//		var userData = JSON.parse(localData);
//		window.localStorage.setItem("rhContractRecent",JSON.stringify(data));
	}
};
/**
 * 构造最近联系人
 */
rh.ui.gridCard.prototype._bldContractRecent = function(data) {
	var _self = this;
	if (this._recentFlag) {
		return true;
	}
    for(var i=0; i< data.length; i++){
        var contact = data[i];
        _self._bldContractRecentItem(contact);
    }
    this._recentData = data;
    this._recentFlag = true;
};
/**
 * 构造最近联系人项
 * {"latMsg":"最后一条消息","lastTime":"最后事件","contact":"联系人"}
 */
rh.ui.gridCard.prototype._bldContractRecentItem = function(contact) {
	var _self = this;
	//建立socket之后获取最近联系人信息
	var userData = {};
	userData = this._getUserAllData();
    var lastMsg = contact.lastMsg;
    if (lastMsg.indexOf("audio::") == 0) {
    	lastMsg = "[语音]";
    } else if (lastMsg.indexOf("img::") == 0) {
    	lastMsg = "[图片]";
    }
    var lastTime = contact.lastTime;
    var user = contact.contact;
    var userName = user;
    var img = "";
    if (userData[user]) {
    	userName = userData[user].USER_NAME;
    	img = userData[user].USER_CODE__IMG;
    }
    if (user == "ALL") {
    	userName = "软虹公司";
    }
	var temp = {"IMG":img,"TODO_TYPE":user,"TODO_CODE_NAME":userName,"TODO_SEND_TIME":lastTime,"USERCODE":user,"TODO_TITLE":lastMsg};
	var item = this._bldHomeItem(temp);
	item.bind("click",{"userCode":user,"userName":userName,"back":"rhGridSimple"},function(event) {
		_self._loader();
		var data = event.data;
		_self._changeView("CON_webChat");
		_self._bldWebChatUser(data);
		jQuery(".rhWebChat").fadeIn();
		jQuery(this).find(".rhGridCardCount").removeClass("rhGridCardCount--show").text("");
		delete _self._notiData[data.userCode];
	});
	item.appendTo(this._gridSimpleUL);
	return item;
};
/**
 * 根据用户id返回缓存中的用户名
 */
rh.ui.gridCard.prototype._getUserData = function(userCode) {
	var userData = {};
	if (window.localStorage && window.localStorage.getItem("rhContract")) {
		var localData = window.localStorage.getItem("rhContract");
		userData = JSON.parse(localData);
		return userData[userCode];
	}
};
/**
 * 返回缓存中的所有用户数据，reloadFlag参数是否重新后台加载
 */
rh.ui.gridCard.prototype._getUserAllData = function(reloadFlag) {
	var userData = {};
	if (window.localStorage && window.localStorage.getItem("rhContract") && !reloadFlag) {
	} else {
		var srorageTemp = {};
		var listData = FireFly.getPageData("SY_ORG_USER",{"_NOPAGE_":true,"_ORDER_":"USER_EN_NAME"}) || {};	
		data = listData._DATA_ || {};
		jQuery.each(data,function(i,n) {
			var dataItem = n;
			srorageTemp[dataItem.USER_CODE] = dataItem;
		});
		if (window.localStorage) {
			window.localStorage.setItem("rhContract",JSON.stringify(srorageTemp));
		}
	}
	var localData = window.localStorage.getItem("rhContract");
	userData = JSON.parse(localData);
	return userData;
};
/**
 * 加载层提示,flag：hide隐藏加载的层
 */
rh.ui.gridCard.prototype._loader = function(flag) {
	if (flag == "hide") {
		setTimeout(function() {
			jQuery("#mbLoader").hide();
		},100);
	} else {
		jQuery("#mbLoader").show();
	}
};
/**
 * 视图显示到区域
 */
rh.ui.gridCard.prototype._scrollIntoView = function() {
	document.getElementById("end").scrollIntoView();
};
