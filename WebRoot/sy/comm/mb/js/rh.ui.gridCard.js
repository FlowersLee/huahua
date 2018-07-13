GLOBAL.namespace("rh.ui");
/**
 * @name rh.ui.gridCard
 * @class 构造类似微信的列表卡片页面
 * @example 
 * var gridCard = new rh.ui.gridCard({"id":"SY_TODO"}});
 * gridCard.render();
 */
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
	if ((this._source == "app") && (this._platform.length > 0)) {//app&&平台标识
		this._isNativeApp = true;
	}
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
	this._container = jQuery("<div class='rhGridCardContainer'></div>");
	if (this._area == "list") {
		//左侧列表部分
		this._bldGridSimple();
	} else if (this._area == "listCard") {
		//右侧卡片列表部分
		this._bldGridCard()
	} else {
		//左侧列表部分
		this._bldGridSimple();
		this._gridSimple.css("width","35%");
		//右侧卡片列表部分
		this._bldGridCard(this._firstBlockTODOCode,this._firstBlockTitle);
		this._gridCard.css("display","block");
	}
	this._container.appendTo(this._pCon);
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
    }
};
/**
 * 开始构造统计列表部分
 * @return {this._table} 对应的grid对象
 */
rh.ui.gridCard.prototype._bldGridSimple = function() {
	var _self = this;
	var todoData = FireFly.doAct("SY_COMM_TODO","getTodoCount",null,false);
	var dataAll = todoData._DATA_;
	this._allCount = dataAll.TODO_COUNT;//总数量
	this._lastData = dataAll._DATA_;//列表数据集,最后一次的数据
	if (jQuery(".rhGridSimple").length == 0) {//第一次加载时处理
		this._gridSimple = jQuery("<div></div>").addClass("rhGridSimple rhDisplayView");
		this._gridSimpleUL = jQuery("<ul></ul>").appendTo(this._gridSimple);
	} else {
		this._gridSimpleUL.empty();
	}
	var len = 0;
	if (this._lastData) {
		len = this._lastData.length;
	}
	for (var i = 0;i < len;i++) {
		var dataItem = this._lastData[i];
		var item = this._bldGridSimpleItem(dataItem);
		if (i == 0) {
			//item.addClass("rhGridSimple__item--active");
			_self._lastSendTime = dataItem.TODO_SEND_TIME;
			_self._firstBlockTitle = dataItem.TODO_CODE_NAME;//左侧第一个区块的标题
			_self._firstBlockTODOCode = dataItem.TODO_TYPE;//左侧第一个区块的待办类型
		}
		item.appendTo(_self._gridSimpleUL);
	}
	if (jQuery(".rhGridSimple").length == 0) {
		this._gridSimple.appendTo(this._container);
	} else {
		//事件的绑定
	    this._goDetail();
	}
	this._refreshAllCount();
};
rh.ui.gridCard.prototype._refreshAllCount = function(item) {
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
rh.ui.gridCard.prototype._bldGridSimpleItem = function(item) {
	var liArray = [];
	liArray.push("<li class='rhGridSimple__item'");
	liArray.push(" todotype='" + item.TODO_TYPE + "' ");
	liArray.push(">");
	liArray.push("<div class='rhGridSimple__item__left'>");
	var img = "/sy/comm/desk-mb/img/todo/" + item.TODO_TYPE + ".png";
	var imgDefault = "/sy/comm/desk-mb/img/todo/default.png";
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
 * 开始构造卡片式列表
 * @return {this._table} 对应的grid对象
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
rh.ui.gridCard.prototype._bldGridCardMore = function() {
	if (this._cardPage) {
		var nowPage = this._cardPage.NOWPAGE;
		this._cardPage.NOWPAGE = parseInt(nowPage) + 1;
		jQuery(".rhGridCard__more").remove();
		this._bldGridCard(null,null,true);
	}
};
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
 * 构造分页
 * @return {this._table} 对应的grid对象
 */
rh.ui.gridCard.prototype._bldPage = function() {
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
		}
	} else {
		var si = setInterval(function() {
				_self._getAlertData();
		},6000);
	}
	//数量更新
	this._refreshAllCount();
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
	var back = jQuery("<div class='rhGridSimple__nav' style=''><div class='rhGridSimple__nav__title'>企信<span id='rhGridSimple__nav__count'>(" + this._allCount + ")</span></div></div>");
	var search = jQuery("<div style='right:10px;'></div>").addClass("mbDesk-topBar-btn mbDesk-topBar-search").appendTo(back);
	search.bind("mousedown",function() {
		   var url = FireFly.getContextPath() + "/sy/plug/search/mbSearchResult.jsp?k=";
		   alert(1);
		   _self._guideTo(url);    		   
		   return false;
	});
	back.prependTo(jQuery(".rhGridSimple"));
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
	var dataAll = todoData._DATA_;
    var tempData = dataAll._DATA_;
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
	jQuery("#rhGridSimple__nav__count").html("(" + this._allCount + ")");
	this._lastData = dataAll._DATA_;//列表数据集,最后一次的数据
	this._lastSendTime = this._lastData[0].TODO_SEND_TIME;//最新的一条的时间
};
/*
 * 调用外层的消息通讯
 */
rh.ui.gridCard.prototype._appMsgAlert = function(title,msg,url,func) {
	var _self = this;
	setTimeout(function() {
		if (window.plugins) {
			window.plugins.statusBarNotification.notify(title, msg,'',function() {
				//_self._goInToDo(url);
				//如果其它页面打开状态，先关闭之
				window.plugins.childBrowser.close();
				_self._changeView("CON_cochat");
				_self._bldGridSimple();
			});
			navigator.notification.beep(1);
		}
	},10);
};
rh.ui.gridCard.prototype.refresh = function() {
	//刷新列表
	this._bldGridCard();
	//刷新概览
	this._bldGridSimple();
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
		var url = FireFly.getHostURL() + FireFly.getContextPath() + "/sy/base/view/stdCardView-mb.jsp?sId=" +　servId + "&readOnly=" + readOnly + "&pkCode=" + pkCode;		
		if (window.plugins) {
			url += "&source=app";
			url += "&platform=" + _self._platform;
			window.plugins.childBrowser.showWebPage(url, { showLocationBar: false });
			window.plugins.childBrowser.onClose= function() {
				//关闭卡片返回时，如果列表页打开状态则刷新，如果概览页面则刷新概览
				//刷新列表
				_self._bldGridCard();
				//刷新概览
				_self._bldGridSimple();
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
			_self._changeView("CON_contract");
		} else {
			navigator.app.backHistory();  
		}
	}
    function onDeviceReady() {
    	//添加回退按钮事件
    	document.addEventListener("backbutton",onBackKeyDown,false); 
    }
	document.addEventListener("deviceready", onDeviceReady, false);
};
/*
 * 底部导航条:企信、同事圈、发现、我
 */
rh.ui.gridCard.prototype._bldFooter = function() {
	var _self = this;
	var botNav = jQuery("<div class='mbBotBar mbCard-btnBar'></div>");
	var data = [{"id":"cochat","name":" 企信 ","icon":"mb-btn-qichat","cla":"mbBotBar-nodeActive"},
	            {"id":"contract","name":" 通讯录 ","icon":"mb-btn-contract"},
	            {"id":"discover","name":" 发现 ","icon":"mb-btn-discover"},
	            {"id":"me","name":" 我  ","icon":"mb-btn-me"}];
	for (var i = 0,len = data.length;i < len;i++) {
		var item = data[i];
		var nodeClass = item.cla || "";
		var con = jQuery("<div class='mbBotBar-con' id='CON_" + item.id + "'></div>");
		var node = jQuery("<div class='mbBotBar-node " + nodeClass + "' id='" + item.id + "'></div>").appendTo(con);
		jQuery("<div class='mbBotBar-node-icon " + item.icon + "'></div>").appendTo(node);
		jQuery("<div class='mbBotBar-node-text'>" + item.name + "</div>").appendTo(node);
		con.bind("click", function(event) {
			var node = jQuery(this);
			jQuery(".mbBotBar-nodeActive").removeClass("mbBotBar-nodeActive");
			//node.addClass("mbBotBar-nodeActive");
			var conId = node.attr("id");
            _self._changeView(conId);
		});
		con.appendTo(botNav);
	}
	botNav.appendTo(this._pCon);
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
	if (jQuery(".rhColleague").length == 0) {
		var colleague = jQuery("<div class='rhColleague rhDisplayView' style='display:none;'></div>");
		var nav = jQuery("<div class='rhGridSimple__nav' style=''><div class='rhGridSimple__nav__title'>同事圈</div></div>");
		nav.appendTo(colleague);
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
rh.ui.gridCard.prototype._openLayer = function(sId,pkCode) {
	var readOnly = false;
	var url = FireFly.getContextPath() + "/sy/base/view/stdCardView-mb.jsp?sId=" + sId 
	+ "&readOnly=" + readOnly + "&pkCode=" + pkCode;		
	this._guideTo(url);
};
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
	if (jQuery(".rhContract").length == 0) {
		var contract = jQuery("<div class='rhContract rhDisplayView' style='display:none;'></div>");
		var nav = jQuery("<div class='rhGridSimple__nav' style=''><div class='rhGridSimple__nav__title'>通讯录</div>" +
				"<div class='mbTopBar-refresh mbTopBar-rightAdd'>+</div></div>");
		nav.find(".mbTopBar-rightAdd").bind("click", function(event) {
			var url = "";
			_self._guideTo(url);
		});
		nav.appendTo(contract);
		contract.appendTo(this._pCon);
	}
	this._bldWebChat();
};
/*
 * 构造通讯录具体内容
 */
rh.ui.gridCard.prototype._bldContractCon = function() {
	var _self = this;
	var options = {};
    //数据获取
	var listData = FireFly.getPageData("SY_ORG_USER",options) || {};	
	
	var data = listData._DATA_;
	if (jQuery(".rhContract__ul").length == 0) {
		var demo = jQuery("<div class='demo'></div>").appendTo(jQuery(".rhContract"));
		var slider = jQuery("<div id='slider'></div>").appendTo(demo);
		var sliderContent = jQuery("<div class='slider-content' id='slider-content'></div>").appendTo(slider);
		this._contractListUL = jQuery("<ul class='rhContract__ul'></ul>").appendTo(sliderContent);
		this.capitalArray = [];
	}
	for (var i = 0;i < data.length;i++) {
		var dataItem = data[i];
		var item = this._bldContractConItem(dataItem);
		
		item.bind("click",{"userCode":dataItem.USER_CODE,"userName":dataItem.USER_CODE__NAME,"phone":dataItem.USER_MOBILE},function(event) {
			var data = event.data;
			//在线聊天
			_self._changeView("CON_webChat");
			_self._bldWebChatUser(data);
			jQuery(".rhWebChat").fadeIn();
		});
	}
	//设置高度
	$('#slider').sliderNav();
	jQuery("#slider-content").noBarsOnTouchScreen("slider-content");
};
/*
 * 实时通讯
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
	jQuery("#rhWebChat__nav__title").html(userName);
	//获取历史聊天记录
	var chatData = [{"liyanwei":{"time":"2013-09-03","con":"liyanwei历史聊天记录"}},
	                {"liyanwei":{"time":"2013-09-03","con":"liyanwei历史聊天记录"}},
	                {"admin":{"time":"2013-09-03","con":"admin历史聊天记录"}},
	                {"admin":{"time":"2013-09-03","con":"admin历史聊天记录"}},
	                {"admin":{"time":"2013-09-03","con":"admin历史聊天记录"}},
	                {"admin":{"time":"2013-09-03","con":"admin历史聊天记录"}},
	                {"admin":{"time":"2013-09-03","con":"admin历史聊天记录"}},
	                {"liyanwei":{"time":"2013-09-03","con":"liyanwei历史聊天记录"}}];
	if (appendData) {
		chatData = appendData;
	}
	//构造聊天列表
	var webChatList = jQuery(".webchat_list");
	if (webChatList.length == 0) {
		webChatList = jQuery("<div class='webchat_list'></div>");
	} else if (appendFlag == true) {
	} else {
		webChatList.empty();
	}
	
	var len = chatData.length;
	for (var i = 0;i < len;i++) {
		var itemMix =  chatData[i];
		var clas = "webchat_box_l";
		var item = {};
		if (itemMix[userCode]) {//对方用户
			item = itemMix[userCode];

		} else if (itemMix[nowUser]) {//当前登录用户
			clas = "webchat_box_r";
			item = itemMix[nowUser];
		}
		var box = jQuery("<div class='webchat_box " + clas + "'></div>");//区块
		var info = jQuery("<div class='webchat_box_info'><span class='webchat_box_date'>" + item.time + "</span></div>").appendTo(box);
		var bg = jQuery("<div class='webchat_bg'></div>").appendTo(box);
		var con = jQuery("<div class='webchat_bg_con'></div>").appendTo(bg);
		var conP = jQuery("<p class='webchat_txt'>" + item.con + "</p>").appendTo(con);
		if (func) {
			con.bind("click",function() {
				func.call(_self);
			});
		}
		if (item.rtime) {
			jQuery("<div class='webchat_box_preTime'>" + item.rtime + "</div>").appendTo(bg);
		}
		var msgArr = jQuery("<div class='webchat_arr'></div>").appendTo(bg);
		box.appendTo(webChatList);
	}
	webChatList.appendTo(jQuery(".rhWebChat"));
	window.scrollTo(0, 99999);
	//聊天输入区
};
rh.ui.gridCard.prototype._bldContractConItem = function(item) {
	var liArray = [];
	var liInner = [];
	var userName = item.USER_CODE__NAME;
	var userCode = item.USER_CODE;
	var userImg = item.USER_CODE__IMG;
	var deptName = item.DEPT_CODE__NAME;
	
	var capital = userCode.substring(0,1);
	if (jQuery.inArray(capital, this.capitalArray) == -1) {
		this.capitalArray.push(capital);
		liArray.push("<li id='" + capital + "'><a name='" + capital + "' class='title'>" + capital + "</a>");
		liInner.push("<ul class='rh_slider_contract_ul'>");
		liInner.push("<li class='rh_slider_inner_li'>" +
				"<a href='#'><img src='" + userImg + "' class='rh_slider_contract_img'/><span class='rh_slider_contract_name'>" + userName + 
				"</span><span class='rh_slider_contract_dept'>" + deptName + "</span></a></li>");
		liInner.push("</ul>");
		liArray.push(liInner.join(""));
		liArray.push("</li>");
		var obj = jQuery(liArray.join(""));
		obj.appendTo(this._contractListUL);
		return obj.find(".rh_slider_inner_li");
	} else {
		this.capitalArray.push(capital);//capital.toUpperCase();
		var ul = jQuery("#slider").find("#" + capital).find(".rh_slider_contract_ul");
		var obj = jQuery("<li class='rh_slider_inner_li'><a href='#'><img src='" + userImg + "' class='rh_slider_contract_img'/><span class='rh_slider_contract_name'>" + userName + 
				"</span><span class='rh_slider_contract_dept'>" + deptName + "</span></a></li>").appendTo(ul);
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
	var src = "myrecording.mp3";
	this.mediaRec = new Media(src, onSuccess, onError);
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
rh.ui.gridCard.prototype._stopRecordAudio = function() {
	var _self = this;
	this.mediaRec.stopRecord();
	clearInterval(this.recInterval);
	var rtime = jQuery("#rhWebChat_position").text();
	var appendData = [{"admin":{"time":"2013-09-03","con":"音频文件","rtime":rtime}}];
	this._bldWebChatUser(null,appendData,true,function() {
		_self._playAudio("myrecording.mp3");
	});
};

/*
 * 播放音频
 */
rh.ui.gridCard.prototype._playAudio = function(url) {
	//播放音频
	// 播放url指向的音频文件
	var my_media = new Media(url,
		// 新建Media对象成功后调用的回调函数
	   	function() {
		   	console.log("playAudio():Audio Success");
	   	},
	   	// 新建Media对象出错后调用的回调函数
	   	function(err) {
		   	console.log("playAudio():Audio Error: "+err);
		}
	);
	// 播放音频
	my_media.play();

	// 10秒钟后暂停播放
//	setTimeout(function() {
//	   	my_media.stop();
//	}, 10000);        
};

/*
 * 实时通讯布局处理
 */
rh.ui.gridCard.prototype._bldWebChat = function() {
	var _self = this;
	if (jQuery(".rhWebChat").length == 0) {
		var webChat = jQuery("<div class='rhWebChat rhDisplayView' style='display:none;'></div>");
		var nav = jQuery("<div class='rhGridSimple__nav' style=''><a href='#' class='mbBack mbTopBar-back'>返回</a><div class='rhGridSimple__nav__title'><span id='rhWebChat__nav__title'>聊天</span></div></div>");
		nav.appendTo(webChat);
		nav.find(".mbTopBar-back").bind("click",function(event) {
			jQuery(this).addClass("active");
			jQuery(".rhWebChat").hide();
			jQuery(".rhContract").fadeIn();
		    //下按钮条隐藏
		    jQuery(".mbBotBar").show();
		});
		webChat.appendTo(this._pCon);
		//聊天输入区
		var chatArea = jQuery("<div class='rhWebChat__area'>" +
				"<input id='rhWebChat_media' type='button' class='rhWebChat_btn' value='语音'/>" +
				"<input id='rhWebChat_media_start' type='button' class='rhWebChat__displaynone rhWebChat_btn' value='点击开始说话'/>" + 
				"<span id='rhWebChat_position' class='rhWebChat__displaynone'>0'</span>" +		
		        "<input id='rhWebChat__input' x-webkit-speech placeholder='点击开始回复'/></div>");
		chatArea.appendTo(webChat);
		//切换按钮
		jQuery("#rhWebChat_media").bind("click",function() {
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
		});
        //录音按钮
		jQuery("#rhWebChat_media_start").bind("click",function() {
			if (jQuery(this).hasClass("rhWebChat_btn_success")) {
				_self._stopRecordAudio();
				jQuery(this).removeClass("rhWebChat_btn_success");
				jQuery(this).css("color","black").attr("value","点击开始说话");
				jQuery("#rhWebChat_position").text("0'");
			} else {
				jQuery(this).removeClass("rhWebChat_btn_success");
				jQuery("#rhWebChat_position").show();
				jQuery(this).css("color","red").attr("value","点击结束录音");
				_self._recordAudio();
			}
		});
		//回复事件绑定
	    jQuery("#rhWebChat__input").keypress(function(event) {
	        if (event.keyCode == '13') {
	        	var input = jQuery("#rhWebChat__input");
	        	var text = input.val();
	        	var nowUser = _self._nowUser;
	        	var appendData = [];
	        	var data = {};
	        	data[nowUser] = {"time":"2013-09-03","con":text};
	        	appendData.push(data);
	        	_self._bldWebChatUser(null,appendData,true);
	        	input.val("");
	            return false;
	        }
	    });
//		jQuery("#rhWebChat_media_start").bind("mouseup",function() {
//			_self._stopRecordAudio();
//		});
//		if (!('webkitSpeechRecognition' in window)) { 
//			alert("false");
//		} else {
//			alert("ok");
//		}
	}
};


/*
 * 底部导航条:发现
 */
rh.ui.gridCard.prototype._bldDiscover = function() {
	var _self = this;
	if (jQuery(".rhDiscover").length == 0) {
		var discover = jQuery("<div class='rhDiscover rhDisplayView' style='display:none;width:100%;height:" + _self._viewHei + "px;'></div>");
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
		var exit = jQuery("<input id='rh_app_exit' type='button' style='width:90%;height:50px;margin:20px 5% 0px 5%;' value='退出登录'>");
		exit.bind("click",function() {
			window.location.href = "/index_mb.jsp?source=app&platform=" + _self._platform;
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
		var nav = jQuery("<div class='rhGridSimple__nav' style=''><div class='rhGridSimple__nav__title'>功能桌面</div></div>");
		nav.appendTo(funcDesk);
		funcDesk.appendTo(this._pCon);
	}
};
/*
 * 功能桌面实际数据处理
 */
rh.ui.gridCard.prototype._bldDeskData = function() {
	var _self = this;
	if (jQuery(".mbDesk-container").length == 0) {
		var deskView = new mb.vi.deskView({"id":"rh_desk_app","topBarFlag":false,"pCon":jQuery(".rhFuncDesk"),"source":"app"});
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
	}
};
/*
 * 不同的应用跳转方式的处理
 */
rh.ui.gridCard.prototype._guideTo = function(url,title) {
	if ((this._source == "app") && window.plugins) {
		url = FireFly.getHostURL() + FireFly.getContextPath() + url;
		url += "&source=app";
		url += "&platform=" + this._platform;
		//window.plugins.childBrowser.showWebPage(url, { showLocationBar: false });
		var ref = window.open(url, '_blank', 'location=no');//新打开，隐藏地址栏
		ref.addEventListener('loadstart', function(event) { alert('start: ' + event.url); });
		ref.addEventListener('exit', function(event) { alert(event.type); });
//		window.plugins.childBrowser.onClose= function(data) {
//			alert(JsonToStr(data));
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
$.fn.sliderNav = function(options) {
	var defaults = { items: ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"], debug: false, height: null, arrows: true};
	var opts = $.extend(defaults, options); var o = $.meta ? $.extend({}, opts, $$.data()) : opts; var slider = $(this); $(slider).addClass('slider');
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
$.fn.noBarsOnTouchScreen = function(arg) {
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
