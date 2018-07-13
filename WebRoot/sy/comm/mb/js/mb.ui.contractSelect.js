GLOBAL.namespace("rh.ui");
/**
 * @name mb.ui.contractSelect
 * @class 构造类似微信的列表卡片页面
 * @example 
 * var gridCard = new mb.ui.contractSelect({"id":"SY_TODO"}});
 * gridCard.render();
 */
mb.ui.contractSelect = function(options) {
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
};
/**
 * 方法的渲染执行
 * @return {void}
 */
mb.ui.contractSelect.prototype.render = function() {
	var _self = this;
	this._container = jQuery("<div class='rhGridCardContainer'></div>");
	this._container.appendTo(this._pCon);
	this._bldContract();
	this._androidBackListen();
};

/*
 * 底部导航条:通讯录
 */
mb.ui.contractSelect.prototype._bldContract = function() {
	var _self = this;
	if (jQuery(".rhContract").length == 0) {
		var contract = jQuery("<div class='rhContract rhDisplayView'></div>");
		var nav = jQuery("<div class='rhGridSimple__nav' style=''><a href='#' class='mbBack mbTopBar-back'>返回</a><div class='rhGridSimple__nav__title'>公司联系人</div></div>");
		nav.find(".mbTopBar-back").bind("click", function(event) {
			window.close();
		});
		nav.appendTo(contract);
		contract.appendTo(this._pCon);
		this._bldContractCon();
	}
	if (jQuery(".rhContractCard").length == 0) {
		var contract = jQuery("<div id='rhContractCard' class='rhContractCard rhDisplayView' style='display:none;'></div>");
		var nav = jQuery("<div class='rhGridSimple__nav' style=''><a href='#' class='mbBack mbTopBar-back'>返回</a><div class='rhGridSimple__nav__title'>详细资料</div></div>");
		nav.find(".mbTopBar-back").bind("click", function(event) {
             _self._changeView("CON_rhContract");
		});
		nav.appendTo(contract);
		contract.appendTo(this._pCon);
	}
};
/*
 * 构造通讯录具体内容
 */
mb.ui.contractSelect.prototype._bldContractCon = function() {
	var _self = this;
	var options = {};
    //数据获取
	var listData = FireFly.getPageData("SY_ORG_USER",options) || {};	
	var data = listData._DATA_;
	if (jQuery(".rhContract__ul").length == 0) {
		var demo = jQuery("<div class='demo'></div>").appendTo(jQuery(".rhContract"));
		var slider = jQuery("<div id='slider'></div>").appendTo(demo);
		var sliderContent = jQuery("<div class='slider-content' id='slider-content' style='overflow:hidden;'></div>").appendTo(slider);
		this._contractListUL = jQuery("<ul class='rhContract__ul'></ul>").appendTo(sliderContent);
		this.capitalArray = [];
	}
	for (var i = 0;i < data.length;i++) {
		var dataItem = data[i];
		var item = this._bldContractConItem(dataItem);
		item.bind("click",{"userCode":dataItem.USER_CODE,"userName":dataItem.USER_CODE__NAME,
			               "phone":dataItem.USER_MOBILE,"userImg":dataItem.USER_CODE__IMG,
			               "deptName":dataItem.DEPT_CODE__NAME,"userStatus":dataItem.USER_CODE__STATUS},function(event) {
			var data = event.data;
			//在线聊天
			_self._changeView("CON_rhContractCard");
			jQuery(".rhContractCard_container").remove();
			_self._bldContractCard(data);
		});
	}
};

mb.ui.contractSelect.prototype._bldContractConItem = function(item) {
	var liArray = [];
	var liInner = [];
	var userName = item.USER_CODE__NAME;
	var userCode = item.USER_CODE;
	var userImg = item.USER_CODE__IMG;
	var deptName = item.DEPT_CODE__NAME;
	
	var capital = userCode.substring(0,1);
	if (jQuery.inArray(capital, this.capitalArray) == -1) {
		this.capitalArray.push(capital);
		liArray.push("<li id='" + capital + "'>");
		liInner.push("<ul class='rh_slider_contract_ul'>");
		liInner.push("<li class='rh_slider_inner_li'>" +
				"<a href='#'><img src='" + userImg + "' class='rh_slider_contract_img'/><span class='rh_slider_contract_name'>" + userName + 
				"</span><span class='rh_slider_contract_deptL'> (" + deptName + ")</span><span class='rh_slider_contract_dept'>添加</span></a></li>");
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
				"</span><span class='rh_slider_contract_deptL'> (" + deptName + ")</span><span class='rh_slider_contract_dept'>添加</span></a></li>").appendTo(ul);
		return obj;
	}
	return jQuery(liArray.join(""));
};
/*
 * 构造联系人详细信息
 */
mb.ui.contractSelect.prototype._bldContractCard = function(data) {
	var card = jQuery("#rhContractCard");
	var header = jQuery(".rhContractCard_header");
	if (header.length == 0) {
		var userName = data.userName;
		var userCode = data.userCode;
		var userImg = data.userImg;
		var deptName = data.deptName;
		var phone = data.phone;
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
        
        var footer = jQuery("<a id='rhContractCard_footer' href='#' class='myButton_green'>添加到通讯录</a>").appendTo(container);
        footer.bind("click",function() {
        	
        });
        
        container.appendTo(card);
	}
};
/*
 * 不同的应用跳转方式的处理
 */
mb.ui.contractSelect.prototype._guideTo = function(url,title) {
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
 * 底部导航条:切换
 */
mb.ui.contractSelect.prototype._changeView = function(conId) {
	jQuery(".rhDisplayView:visible").hide();
	if (conId == "CON_rhContract") {//企信
		jQuery(".rhContract").fadeIn();
	} else if (conId == "CON_rhContractCard") {//同事圈
		jQuery(".rhContractCard").fadeIn();
	}
};
/*
 * android的回退按钮的监听
 */
mb.ui.contractSelect.prototype._androidBackListen = function() {
	var _self = this;
	//BackButton按钮
	function onBackKeyDown() {
		var cardShowFlag = jQuery(".rhContractCard_container:visible").length;
		if(cardShowFlag === 1) {
			_self._changeView("CON_rhContract");
		}  else {
			navigator.app.backHistory();  
		}
	}
    function onDeviceReady() {
    	//添加回退按钮事件
    	document.addEventListener("backbutton",onBackKeyDown,false); 
    }
	document.addEventListener("deviceready", onDeviceReady, false);
};