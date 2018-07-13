/** 打开tab封装组件 */
GLOBAL.namespace("rh.ui");
/**
* Tab类的常量定义
*/
var Tab = {
	frame:"-tabFrame",
	div:"-tabDiv",
	_div:"tabDiv",
	closeDirect:function (frameId) {//根据frameid,关闭一个tab标签
		var parDivArray = frameId.split("-");
		parDivArray[parDivArray.length -1] = Tab._div;
		var parDiv = parDivArray.join("-");
		jQuery(".ui-icon-close",jQuery("a[href='#" + parDiv +　"']").parent()).mousedown();		
	},
	close:function () {//关闭当前页面的父tab标签
		top.Tab.closeDirect(GLOBAL.getFrameId());	
	},
	/*
	 * 打开一个新tab标签 @param tTitle 必须 tab显示标题 @param url 必须 对应链接
	 * 打开列表：SY_USER.list.do?readOnly=true
	 * 打开卡片：SY_USER.card.do?pkCode=123&readOnly=true
	 * 调后台服务：SY_USER.selfact.do?data={'params1':'test'}
	 * 自定义页面：/sy/home.jsp?readOnly=true @param refreshFlag 每次都刷新当前页面 
	 * @param params 外部公共对象参数，供iframe内部调用 
	 * @param scrollFlag 是否有滚动条 
	 * @param menuFlag 1、显示当前层级 2、全部显示  3、不显示 4、没有对应菜单，但是显示
	 */
	open: function (options) {
		var url = options.url;
		var urlArray = url.split("?data=");
		var preUrl = urlArray[0];
		var preUrlArray = preUrl.split(".");
		var sid = preUrlArray[0];//服务id

		if (sid.charAt(0) == "/"){
			if (sid.indexOf(FireFly.getContextPath()) == 0) {//含虚路径的截取sid
				var len = FireFly.getContextPath().length;
				sid = sid.substr(len + 1);
			} else {
				sid = sid.substr(1);
			}
		}
		var act = preUrlArray[1];//方法
		if (System.getMB("flag") == true) {
			if (act == "list") {
				var urlArray = options.url.split(".do?");
				var servId = sid;
				var pkCode = "";
				var readOnly = false;
				var areaId = "";
				var params = "";
				if (urlArray.length > 1) {
					var last = urlArray[1].split("&");
					jQuery.each(last, function(i, n) {
						var temp = n.split("=");
						if (temp[0] == "pkCode") {
							pkCode = temp[1];
						} else if (temp[0] == "readOnly") {
							readOnly = temp[1];
						} else if (temp[0] == "areaId") {
							areaId = temp[1];
						}
					});
				}
				if (options["params"]) {
					params = options["params"];
				}
				var url = FireFly.getContextPath()
						+ "/sy/base/view/stdListView-mb.jsp?sId=" + servId
						+ "&readOnly=" + readOnly + "&params=" + params;
				window.location.href = url;
			} else if (act == "card") {
				var urlArray = options.url.split(".do?");
				if (urlArray.length > 1) {
					var servId = sid;
					var pkCode = "";
					var readOnly = false;
					var areaId = "";
					var last = urlArray[1].split("&");
					jQuery.each(last, function(i, n) {
						var temp = n.split("=");
						if (temp[0] == "pkCode") {
							pkCode = temp[1];
						} else if (temp[0] == "readOnly") {
							readOnly = temp[1];
						} else if (temp[0] == "areaId") {
							areaId = temp[1];
						}
					});
				}
				var url = FireFly.contextPath
						+ "/sy/base/view/stdCardView-mb.jsp?sId=" + servId
						+ "&readOnly=" + readOnly + "&pkCode=" + pkCode;
				window.location.href = url;
			} else {
				var url = Tools.xdocUrlReplace(options.url);// 替换@XDOC_URL@
				window.location.href = url;
			}
		} else {
		    if (window.self == window.top) {//判断是否顶层
		    	var veiwPage = jQuery("#viewPage").val();
		    	if (veiwPage == "list" || veiwPage == "card") {
		    		options["top"] = true;
		    	}
		    }
			if (act == "list") {
				options["act"] = act;
				options["sId"] = sid;
				if (url.indexOf("extWhere") > 0 || url.indexOf("links") > 0) {
					var subUrl = Tools.rhReplaceId(url);
					if (subUrl.length > 100) {
						subUrl = subUrl.substring(0,100);
					}
					options["id"] = subUrl;
				} else {
					options["id"] = sid;
				}
				var tab = new parent.rh.ui.openTab(options);
				tab.render();
			} else if (act == "card") {
				var repUrl = url;
				if (repUrl.length > 100) {
					repUrl = repUrl.substring(0,100);
				}
				options["id"] = Tools.rhReplaceId(repUrl);
				options["act"] = act;
				options["sId"] = sid;
				var tab = new parent.rh.ui.openTab(options);
				tab.render();
			} else {
				var repUrl = url;
				if (repUrl.length > 100) {
					repUrl = repUrl.substring(0,100);
				}
				options["id"] = Tools.rhReplaceId(repUrl);
				options["sId"] = Tools.rhReplaceId(sid);
				options.url = Tools.xdocUrlReplace(url);// 替换@XDOC_URL@
				var tab = new parent.rh.ui.openTab(options);
				tab.render();
			}
		}
	},
	/*
	 * 设置外层iframe的高度的统一方法setParentFrameHei
	 */
	setFrameHei : function (replaceHei) {
		var docHei = document.documentElement.scrollHeight;
		if (replaceHei) {
			docHei = replaceHei;
		}
		var id = GLOBAL.getFrameId();
		if (id && parent.document.getElementById(id)) {
			parent.jQuery("#" + id).attr("scrolling","no");
			parent.document.getElementById(id).style.height = docHei + "px";
		}
		if (id && id.length > 0) {
			parent.jQuery("#" + id).parent().height("100%");
		}
	},
	/*
	 * 卡片关联自定义tab设定外层滚动条和最外层滚动条高度
	 */
	setCardTabFrameHei : function () {
		var sid = window.name.split("-tabsIframe")[0];//取得当前关联服务code
		var cardHandler = window.parent.jQuery(window.parent.document).data("shareCradViewer");
		if ("" == (cardHandler || "")) {
			return;
		}
		var storeHeight = cardHandler.sonTab[sid]._height;
		var allHei = Mouse.getPageSize()[0];
		// 如果重新计算的高度比保存的高度高时高度加上50像素
		if (!storeHeight || allHei > storeHeight) {
			allHei += 50;
		}
		if (allHei < 500) {// 如果本身的滚动高度太矮时
			cardHandler.winDialog.height(500);
			Tab.setFrameHei(500);
			parent.Tab.setFrameHei(520);
			cardHandler.sonTab[sid]._height = 450;
		} else {
			cardHandler.winDialog.height(allHei);
			Tab.setFrameHei(allHei);
			// 20像素是父页面和本页面留出的空间
			parent.Tab.setFrameHei(allHei + 20);
			cardHandler.sonTab[sid]._height = allHei;
		}
	},
	/**
	 * 首页tab条的浮动方法
	 */
	barRevert : function () {
		// if (Browser.versions().iPad == true) {
		// return true;
		// }
		if (jQuery("#banner:visible").length == 1) {
			jQuery("#homeTabsULFill").hide();
			jQuery("#homeTabs .tabUL").removeClass("rhTabBarFixed--gap").css({
				"position" : "relative",
				"margin-top" : "0px",
				"z-index" : "1"
			});
		} else {
			jQuery("#homeTabsULFill").show();
			jQuery("#homeTabs .tabUL").css({
				"position" : "fixed",
				"margin-top" : "-35px",
				"z-index" : "10000"
			});
		}
	},
	/**
	 * 首页tab条的固定
	 */
	barFixed : function () {
		// if (Browser.versions().iPad == true) {
		// return true;
		// }
		if (jQuery("#banner:visible").length == 1) {
			jQuery("#homeTabsULFill").show();
			jQuery("#homeTabs .tabUL").addClass("rhTabBarFixed--gap").css({
				"position" : "fixed",
				"margin-top" : "-80px",
				"z-index" : "10000",
				"width" : "100%"
			});
		} else {
			jQuery("#homeTabsULFill").show();
			jQuery("#homeTabs .tabUL").css({
				"position" : "fixed",
				"margin-top" : "-35px",
				"z-index" : "10000",
				"width" : "100%"
			});
		}
	},
	/**
	 *卡片按钮条的浮动方法
	 */
	btnBarRevert : function (topFlag) {
		var visibleCard = jQuery("iframe:visible").contents().find(".cardDialog:visible").last();
		if (visibleCard.hasClass("cardDialogMini")) {//迷你卡片直接返回
			return true;
		}
	    if (topFlag) {//顶层页面自动关闭
		    visibleCard = jQuery(".cardDialog:visible").last();
			if (visibleCard.hasClass("cardDialogMini")) {//迷你卡片直接返回
				return true;
			}
	    }
		visibleCard.find(".rhCard-btnBar--instead").hide();
		visibleCard.find(".rhCard-btnBar").css({
			"position" : "relative",
			"top" : "auto",
			"width" : "100%",
			"z-index" : "1"
		});
	},
	/**
	 * 卡片按钮条的固定
	 */
	btnBarFixed : function (top,flag,topFlag) {
	    if (topFlag) {//顶层页面自动关闭
			var visibleCard = jQuery(".cardDialog:visible").last();
			if (visibleCard.hasClass("cardDialogMini")) {//迷你卡片直接返回
				return true;
			}
			visibleCard.find(".rhCard-btnBar--instead").show();
			visibleCard.find(".rhCard-btnBar").css({
				"position" : "fixed",
				"top" : 0,
				"z-index" : "10000",
				"width" : "98%"
			});
		} else {
			var visibleCard = jQuery("iframe:visible").contents().find(".cardDialog:visible").last();
			if (visibleCard.hasClass("cardDialogMini")) {//迷你卡片直接返回
				return true;
			}
			var gap = UIConst.CARD_BTN_GAP || 42;
			var topPos = top - gap;
			if (flag == "hide") {
				topPos = top;
			}			
			visibleCard.find(".rhCard-btnBar--instead").show();
			visibleCard.find(".rhCard-btnBar").css({
				"position" : "fixed",
				"top" : topPos,
				"z-index" : "10000",
				"width" : "98%"
			});
		}
	},
	beforePlatformPageClick: function(url) {
	}
};
/*
 * 左侧菜单的触发选中
 */
function blurSelect(topLi) {
	jQuery(".leftMenu-li-blur").removeClass("leftMenu-li-blur");
	topLi.addClass("leftMenu-li-blur");	
}
/*
 * 插入tab的前置图标
 */
function insertTabIcon(tabObj,topIcon) {
	var iconSpan = jQuery("<span></span>").addClass("tabIcon-span");
	tabObj.prepend(iconSpan);
	iconSpan.addClass("leftMenu-" + topIcon);	
}
var tabColorNum = 1;
/*
 * 打开一个新tab标签
 * @param tTitle 必须  tab显示标题
 * @param url 必须  对应链接
 * 打开列表：SY_USER.list.do?readOnly=true
 * 打开卡片：SY_USER.card.do?pkCode=123&readOnly=true
 * 调后台服务：SY_USER.selfact.do?data={'params1':'test'}
 * 自定义页面：/sy/home.jsp?readOnly=true
 * @param refreshFlag 每次都刷新当前页面
 * @param params 外部公共对象参数，供iframe内部调用
 *        如：{"CAD_ID":auditId,"viewer":_viewer,"links":{"test":"ppp"}}
 *        注：params内的对象"links"为打开的页面传递json格式的对象，和字段表达式，按钮表达式配合使用
 * @param menuFlag  1、显示当前层级 2、全部显示 3、不显示 4、没有对应菜单，但是显示
 */
rh.ui.openTab = function(options) {
	var _self = this;
	var defaults = {
		url:"",  //连接的url
 		tTitle:"",  //tab显示标题
 		menuId:null,  //对应菜单id，用于与菜单对应
 		refreshFlag:false,  //外面进入tab时每次都刷新当前页
 		refreshClickFlag:false,  //每次点击tab都刷新当前页
 		params:null,  //外部公共对象参数，供iframe内部调用
 		menuFlag:1,  //左侧菜单显示标识
 		top:false,//是否顶层页面打开
 		scrollFlag:false,  //是否有滚动条
 		areaId:"",  //portal传过来的区块id
 		extWhere:"",  //extWhere，用于传递关联条件，不放在url里
 		sId:"",  //内部拆分后的服务id
 		act:"",  //内部拆分后的act
 		id:"",   //主id
 		replaceUrl:"",
 		icon:""//前置图标
 	};
    //参数本地转换
 	this.opts = jQuery.extend(defaults,options);
 	this.sId = this.opts.sId;//服务id
 	this.id = this.opts.id;//主id
 	this.act = this.opts.act;
 	this.tTitle= this.opts.tTitle;
 	this.url = this.opts.url;
 	this.refreshFlag = this.opts.refreshFlag;
 	this.refreshClickFlag = this.opts.refreshClickFlag;
 	this.params = this.opts.params;
 	this.menuFlag = this.opts.menuFlag;
 	this.closeFlag = this.opts.closeFlag;//是否显示关闭
 	this.scrollFlag = this.opts.scrollFlag;
 	this.areaId = this.opts.areaId;
 	this.replaceUrl = this.opts.replaceUrl;
 	this.menuId = this.opts.menuId;
 	this._icon = this.opts.icon;
 	this._top = this.opts.top;
 	//tab颜色参数
 	this.tabColorSize = 6;
 	this.tabColorArray = {"1":{"li":"qingLi","a":"qingA"},"2":{"li":"yellowLi","a":"yellowA"},
 	                     "3":{"li":"grayLi","a":"grayA"},"4":{"li":"blueLi","a":"blueA"},"5":{"li":"redLi","a":"redA"},"6":{"li":"lightBlueLi","a":"lightBlueA"}};
 	var tabConf = System.getConf("SY_TAB_COLOR");
 	if (tabConf && tabConf.length > 0) {
 		this.tabColorArray = StrToJson(tabConf);     
 		var array = tabConf.split(":{");
 		this.tabColorSize = array.length;
 	}
	//标题控制
	if (this.tTitle.length > 10) {//对过长标题，进行截串处理
		this.tOrigTitle = this.tTitle; 	
		this.tTitle = this.tTitle.substring(0,6) + ".."; 	
	}
	//传递的url中含有data={}方式的参数
	if (this.url && this.url.length > 0 && (this.url.indexOf("?data=") > 0)) {
		var urlArray = this.url.split("?data=");
		var dataUrl = urlArray[1];
		if (this.params) {
			this.params = jQuery.extend(this.params,StrToJson(dataUrl));
		} else {
			this.params = StrToJson(dataUrl);
		}
	} else if (this.url && this.url.length > 0 && (this.url.indexOf("refreshClickFlag=true") > 0)) {// 每次点击都刷新
		this.refreshClickFlag = true;
	}
	//设置参数对象到临时存储,供其它调用
	this.paramsFlag = false;
	if (this.params) {
		System.setTempParams(this.sId,this.params);
		this.paramsFlag = true;
	}
	
 	//对象id的匹配
	this.frameId = this.id + Tab.frame;
	this.parDiv = this.id + Tab.div;
	this.pkCode = "";
	this._blurUrl = this.url;//与左侧菜单匹配的aId
	if (this.act == "card") {//打开卡片的默认url
		//支持url如：this.url = "SY_SERV.card.do?data={\"test\":\"hello\",\"fff\":\"890\"}&pkCode=SY_SERV";
		var extUrl = _self._parseURL(this.url);
		this.frameId = this.id + "-" + this.pkCode + Tab.frame;
		this.parDiv = this.id + "-" + this.pkCode + Tab.div;	
		this.url = FireFly.contextPath + "/sy/base/view/stdCardView.jsp?frameId=" + this.frameId + "&sId=" +　this.sId 
		+ "&areaId=" + this.areaId + "&paramsFlag=" + this.paramsFlag + "&title=" + encodeURI(this.tTitle) + extUrl;
		if (this.replaceUrl.length > 0) {
			this.url += "&replaceUrl=" + encodeURIComponent(this.replaceUrl);
		}
	} else if (this.act == "list") {//打开列表的默认url
		var extUrl = _self._parseURL(this.url);
		this.url = FireFly.contextPath + "/sy/base/view/stdListView.jsp?frameId=" + this.frameId + "&sId=" +　this.sId 
		            + "&paramsFlag=" + this.paramsFlag + "&title=" + encodeURI(this.tTitle) + extUrl;
	} else if (this.act == "xdoc") {//xdoc调用
		var xdocUrl = System.getVar("@XDOC_URL@");//获取xdoc_url
		var httpUrl = FireFly.getHttpHost();
		var serv_xdocUrl = xdocUrl + "/" + this.sId + ".xdoc?_xdataurl=";
		var serv_locUurl = httpUrl + "/" + this.sId + ".byid.do?_PK_=" + this.pkCode + "&_LINK_=true";
		var extUrl = "&USER_NAME=" + encodeURIComponent(System.getVar("@USER_NAME@"))
		             + "&CMPY_NAME=" + encodeURIComponent(System.getVar("@CMPY_NAME@"))
		             + "&CMPY_FULLNAME=" + encodeURIComponent(System.getVar("@CMPY_FULLNAME@"))
		             + "&DEPT_NAME=" + encodeURIComponent(System.getVar("@DEPT_NAME@"))
		             + "&TDEPT_NAME=" + encodeURIComponent(System.getVar("@TDEPT_NAME@"))
		             + "&LOGO_URL=" + encodeURIComponent(System.getVar("@LOGO_URL@"))
		             + "&ODEPT_NAME=" + encodeURIComponent(System.getVar("@ODEPT_NAME@"));
		var serv_url = "json:" + encodeURIComponent(serv_locUurl);
		this.url = serv_xdocUrl + serv_url + extUrl;
	} else {
		
	}
	//用户匹配左侧菜单的变量
	this.topId = jQuery(".leftMenu-li").find("#" + this.sId).attr("topId");
	this.titId = jQuery(".leftMenu-li").find("#" + this.sId).attr("titId");
	if (this.menuId) {
		this.topId = jQuery("#" + this.menuId).attr("topId");
		this.titId = jQuery("#" + this.menuId).attr("titId");
	}
	if (!this.topId) {
		this.topId = jQuery("a[menuSId='" + this.sId + "']").attr("topId");
	}
	//确定要触发的a的id
	var urlArray = this.url.split(".do?");
	if (_self.menuId) {
		_self._blurId = "#" + _self.menuId;				
	} else if (urlArray.length > 1) {
		_self._blurId = "a[infoId='" + Tools.rhReplaceId(_self._blurUrl) + "']";
	} else {
		_self._blurId = "a[menuSId='" + _self.sId + "']";		
	}
}
/*
 * 渲染入口
 */
rh.ui.openTab.prototype.render = function() {
    if (this._top === true) {//顶层页面用浏览器窗口打开
	    window.open(this.url);
    } else {
    	//构造tab,赋值url
    	this._bldTab();
    	this._after();
    }
};
/*
 * 构造tab
 */
rh.ui.openTab.prototype._bldTab = function() {
    if (document.getElementById(this.frameId) == undefined) {//第一次打开
    	if (this._controlTabCount() == false) {
        	alert("已达到设置的最大数，请关闭一些标签！");
    		return false;
    	}
        this._bldTabFirst();
        this._insertTabIcon();
        this._bindClickTab();
        this._bindContextMenu(); // 增加右键菜单
     } else {
		this._bldTabSecond();
	 }
};
/*
 * 第一次构造执行
 */
rh.ui.openTab.prototype._bldTabFirst = function() {
	 var _self = this;
	 var homeTabs = jQuery("#homeTabs");
	 //获取展开时当前selected的tab
	 this.preSelectId = jQuery(".ui-tabs-selected").attr("pretabid");
	 //构造tab和iframe
	 var tempDiv = jQuery("<div style='float:right;'></div>").height(GLOBAL.getDefaultFrameHei()).addClass("rh-page-right");
	 tempDiv.attr("id",this.parDiv);
	 tempDiv.appendTo(jQuery("#homeTabs"));
	 homeTabs.tabs("add", "#" + this.parDiv ,this.tTitle);

	 var scro = "no";
	 var hei = "100%"
	 if ((this.scrollFlag == true) || (this.url.indexOf("scrollFlag=true") > 0) || (this.act == "link")) {
	 	scro = "auto";
	 	hei = GLOBAL.getDefaultFrameHei();
	 }
	 this.frameObj = jQuery("<iframe name=\"" + this.frameId + "\" border='0' frameborder='0' width='100%' scrolling='" + scro + "'></iframe>").addClass("tabFrame");
	 this.frameObj.appendTo(tempDiv);
	 this.frameObj.attr("id",this.frameId);
	 this.frameObj.attr("height",hei);
	 
	//解决新打开tab页在chrome下滚动时页面出现卡顿现象
	 this.frameObj.css('position','relative');
	 
	 this.rhFlashBugFlag = true;
	 if (this.act == "list") {//打开系统支持页面
	 	 Tip.showLoad("加载中...");
	 	 this.frameObj.attr("src",this.url);
	 } else if (this.act == "card") {
		 Tip.showLoad("加载中...");
		 this.frameObj.attr("src",this.url);		 
	 } else {//打开其它url
		 Tip.showLoad("加载中...",null,null,2000);
		 this.frameObj.attr("src",this.url);
		 this.rhFlashBugFlag = false;
	 } 
	 var tab = jQuery("a[href='#" + this.parDiv +　"']");
	 tab.data("iframeObj",this.frameObj);
	 tab.attr("title",this.tOrigTitle);
	 if (_self.closeFlag == false) {
	 	jQuery("<span></span>").addClass("tab-close").insertAfter(tab);
	 } else {
		 jQuery("<span class='ui-icon ui-icon-close'></span>").addClass("tab-close").insertAfter(tab);
		 tab.addClass("rh-tabs-close-true");//有删除按钮的
	 }
	 //五颜六色的tab
	 var tabLiA = jQuery("a[href='#" + this.parDiv +　"']");
	 var tabLi = tabLiA.parent();
	 tabLi.attr("pretabid",this.parDiv).addClass(_self.tabColorArray[tabColorNum].li);
	 tabLiA.addClass(_self.tabColorArray[tabColorNum].a);
	 tabColorNum++;
	 if (tabColorNum == this.tabColorSize) {
		 tabColorNum = 1;
	 }
	 //模拟点击tab
	 tabLiA.click();
	 //绑定关闭图标操作
	 jQuery(".ui-icon-close",tabLi).on("mousedown", function(event) {
		var index = jQuery("li", homeTabs).index(jQuery(this).parent());
		if (index == -1) {
			return false;
		}
		if (_self.rhFlashBugFlag == true) {
			RHFile.parProSon(_self.frameId);//销毁smartupload对象
		}
		var selectedFlag = tabLi.hasClass("ui-tabs-selected");//当前关闭的tab是否为选中
		if(navigator.userAgent.indexOf("MSIE") > 0) {//判断当前浏览器是否为IE
			_self.destroyIframe(_self.frameId);
			jQuery("#" + _self.frameId).remove();//先移除iframe
			jQuery("#" + _self.frameId).empty();
			jQuery("#" + _self.frameId).parent().empty();
			CollectGarbage();//再清理内存
		}
		jQuery("#homeTabs").tabs("remove", index);
		var tabsMore = jQuery(".rh_tabs_more a.rh_tabs_more_a");
		if (selectedFlag && _self.preSelectId) {//如果当前关闭tab为打开的tab
			var preTab = jQuery("a[href='#" + _self.preSelectId +　"']");
			if ((preTab.length > 0) && (tabsMore.length == 0)) {
				preTab.click();	
			} else if ((preTab.length > 0) && (tabsMore.length > 0)) {
				tabsMore.first().attr("blurOpenTab","false").click();
				preTab.click();	
			} else {
				var selectLi = jQuery(".ui-tabs-selected");
				selectLi.find("a").click();				
			}
		} else if (selectedFlag && _self.preSelectId == undefined 
				&& tabsMore.length > 0) {//当前选中+没有preId+更多里有A
			tabsMore.first().click();
		} else {
			if (tabsMore.length > 0) {//当前未选中+有preId+有更多tab
				tabsMore.first().attr("blurOpenTab","false").click();
			} else {
				var selectLi = jQuery(".ui-tabs-selected");
				selectLi.find("a").click();			
			}
		} 
		_self._resetMoreCount();
		_self._resetMorePosition();
		//关闭时刷新父的refresh方法
		if (_self.paramsFlag === true) {
			if (System.getTempParams(_self.sId) && System.getTempParams(_self.sId).callBackHandler) {//回调关闭tab时有callBackHandler句柄的方法
				if (System.getTempParams(_self.sId).closeCallBackFunc) {
					var servExt = System.getTempParams(_self.sId).closeCallBackFunc;
					servExt.apply(System.getTempParams(_self.sId).callBackHandler);
				}
			}
		}
	 });
};
/*
 * 第二次打开时执行
 */
rh.ui.openTab.prototype._bldTabSecond = function() {
     jQuery("a[href='#" + this.parDiv +　"']").click();
 	 //if (this.refreshFlag && this.refreshFlag == true) {
        this._refreshTab();
 	 //} 
};
/*
* 设置重置src方法前执行,返回true则默认方式执行，false不执行
*/
rh.ui.openTab.prototype.beforeRefreshTab = function() {
	return true;
};
/*
* 设置重置src方法
*/
rh.ui.openTab.prototype._refreshTab = function() {
	if (this.beforeRefreshTab()) {//返回true则执行
		jQuery("a[href='#" + this.parDiv +　"']").data("iframeObj").attr("src",this.url);
	}
};
/*
 * 组件执行后方法
 */
rh.ui.openTab.prototype._after = function() {
	 var _self = this;
	 //1.更多tab隐藏至更多面板
	 var tabLis = jQuery(".ui-state-default:visible",jQuery("#homeTabs"));
	 var nowTabLen = 0;// 获取可视tab的宽度
	 jQuery.each(tabLis, function(i,n) {
		 nowTabLen += jQuery(n).width();
	 });
	 var bodyWid = jQuery("#homeTabs .tabUL").width() - 360;// 确定可操作tabs的宽度
     if (nowTabLen > bodyWid) {//超出tabs宽度
    	 if (jQuery(".rh_tabs_more").length == 0) {
    		 var moreTab = jQuery("<div></div>").addClass("rh_tabs_more").appendTo(jQuery(".tabUL"));
    		 var moreCount  = jQuery("<div></div>").addClass("rh_tabs_moreCount").appendTo(jQuery(".tabUL"));
    	     moreCount.bind("click",function() {
    	    	 var moreDiv = jQuery(".rh_tabs_more:visible");
    	    	 if (moreDiv.length == 1) {
    	    		 jQuery(".rh_tabs_more").hide();
    	    	 } else {
    	    		 var left = jQuery(this).position().left;
    	    		 jQuery(".rh_tabs_more").css({"left":left,"top":35}).show();
    	    	 }
    	     });
    	 }
    	 //最后一个移动至更多区域
         this._moveToMore();
         this._resetMoreCount();
     }
     this._resetMorePosition();
	 //2.tempTodo:需完善-ljk,控制左侧菜单和右侧面板宽度方法
	 if (this.menuFlag == 3) {//隐藏左侧菜单
	 	 jQuery(".left-homeMenu").hide();
	 	 jQuery("#" + this.parDiv + ".ui-tabs-panel").width("100%");
	 }  else if (this.menuFlag == 4) { //4、没有对应菜单但是显示左侧菜单
		 jQuery(".left-homeMenu").show();
 	     if (jQuery(".left-homeMenu").hasClass("leftHide")) {
    	   jQuery("#" + this.parDiv + ".ui-tabs-panel").width(GLOBAL.defaultRightHomeTabsWid);
         } else {
	       jQuery("#" + this.parDiv + ".ui-tabs-panel").width("rh-page-right");
         }    
	 } else {//显示菜单
		 jQuery(".left-homeMenu").show();
	 	 if (jQuery(".left-homeMenu").hasClass("leftHide")) {
	    	jQuery(".ui-tabs-panel").width(GLOBAL.defaultRightHomeTabsWid);
	     } else {
		    jQuery(".ui-tabs-panel").addClass("rh-page-right");
	     }	
		 //显示当前节点所具备的topId一致的节点
		 jQuery("#lefMenu-div").find("h3").each(function(i) {
	        var tempId = jQuery(this).attr("topId");
	        if ((tempId == _self.topId)) {//当前层级和menuFlag=1则显示
	        	jQuery(this).show();
	        } else {
	        	jQuery(this).hide();
	        	jQuery(this).next("ul").hide();
	        }
		 });

	     //定位当前功能
		 if (!jQuery("#" + _self.titId).hasClass("ui-state-active")) {
			 jQuery("#" + _self.titId).click();
		 }
		 var blurPar = jQuery(".leftMenu-li").find(_self._blurId).parent();
		 if (blurPar.parent().hasClass("leftMenu-nodeUl")) {//第三级的叶子焦点匹配
			 var nodeUlPrev = blurPar.parent().prev();
			 if (nodeUlPrev.find(".leftMenu-moreNav").hasClass("leftMenu-nodeUl-hide") == false) {
				 nodeUlPrev.click();
			 }
		 }
		 blurSelect(blurPar); 	
	 }
	 //tabs条回复到正常
	 Tab.barRevert();
	 //滚动到头部
	 window.scrollTo(0,0);
	 //处理卡片的按钮条
	 setTimeout(function() {
		 Tab.btnBarRevert();
	 },0);
};
/*
 * 计算更多区块的显示个数
 */
rh.ui.openTab.prototype._resetMoreCount = function() {
	if (jQuery(".rh_tabs_more .rh_tabs_more_a").length > 0) {
		jQuery(".rh_tabs_moreCount").html("<span class='rh_tabs_moreCount__nav'></span><span class='rh_tabs_moreCount__num'>" 
				+ jQuery(".rh_tabs_more .rh_tabs_more_a").length + "</span>");	
		jQuery("body").bind("click",function(event) {
			var tar = jQuery(event.target);
			if (tar.hasClass("rh_tabs_moreCount") || tar.parent().hasClass("rh_tabs_moreCount")) {
				return false;
			}
			jQuery(".rh_tabs_more").hide();
		});
	} else {
		jQuery(".rh_tabs_more").remove();
		jQuery(".rh_tabs_moreCount").remove();
	}
};
/*
 * 重置更多的显示位置
 */
rh.ui.openTab.prototype._resetMorePosition = function() {
	if (jQuery(".rh_tabs_more .rh_tabs_more_a").length > 0) {
		jQuery(".rh_tabs_moreCount").appendTo(jQuery(".tabUL"));
	}
};
/*
 * 将当前的tab的最后一个方法更多区块中
 */
rh.ui.openTab.prototype._moveToMore = function() {
	 var _self = this;
	 var visibleTabs = jQuery(".ui-state-default:visible",jQuery("#homeTabs"));
	 this._lastVisibleTab = visibleTabs.eq(visibleTabs.length - 2);//可视的最后一个tab
	 var temp = this._lastVisibleTab.find("a").clone();
	 temp.addClass("rh_tabs_more_a").appendTo(jQuery(".rh_tabs_more"));
	 temp.bind("click",function() {
		 var obj = jQuery(this);
		 var nowClickFlag = obj.attr("blurOpenTab");//
         if (nowClickFlag == undefined) {
        	 _self._moveToMore();
         }
		 var href = obj.attr("href");
		 var tabA = jQuery(".ui-state-default",jQuery("#homeTabs")).find("a[href='" + href + "']");
		 tabA.parent().show();
		 if (nowClickFlag != "false") {
			 tabA.click();
		 }
		 obj.hide();
		 obj.remove();
		 window.scrollTo(0,0);
         
         //隐藏更多内容，moreCount增加隐藏class
		 jQuery(".rh_tabs_more").hide();
		 return false;
	 });
	 //增加关闭链接
	 jQuery(".rh_tab_more_closeAll").remove();
	 var closeAll = jQuery("<a href='#'>关闭全部</a>").addClass("rh_tab_more_closeAll rh_tabs_more_a_close").appendTo(jQuery(".rh_tabs_more"));
	 closeAll.bind("click", function(event) {
		 _self._closeAllTab();
	 });
	 this._lastVisibleTab.hide();
};
/*
 * 插入前置图标
 */
rh.ui.openTab.prototype._bindClickTab = function() {
	 var _self = this;
	 jQuery("a[href='#" + this.parDiv +　"']").bind("click",function() {
	 		_self._after();
	 		if (_self.refreshClickFlag == true) {//每次点击都刷新
	 			_self._refreshTab();
	 		}
	 });
};
/*
 * 右键菜单的展示
 */
rh.ui.openTab.prototype._bindContextMenu = function() {
	 var _self = this;
   	 jQuery("a[href='#" + this.parDiv +　"']").parent().contextmenu({
   			items : [{
   				text :'关闭此选项卡',
   				icon :'',
   				action: function(target,obj) {//target最底层dom触发对象，obj当前绑定的li对象
   					jQuery(".ui-icon-close",obj).mousedown();
   				}
   			},{
                   text :'关闭全部',
                   icon :'',
                   action: function(target,obj){
                   	_self._closeAllTab();
                   }
               },{
                   text :'关闭其它',
                   icon :'',
                   action: function(target,obj){
                   	_self._closeAllTabExcept(jQuery("a",obj).first());
                   }
               }]
   	 });	
};
/*
 * 插入前置图标
 */
rh.ui.openTab.prototype._insertTabIcon = function() {
	 //填充新打开tab的前置图标
	 var topIcon = jQuery("#" + this.titId).attr("icon");
     var tabSpan = jQuery("a[href='#" + this.parDiv +　"']").find("span");
     if (topIcon == undefined || topIcon == "") {
     	topIcon = "normal";
     }
     if (this._icon.length > 0) {//有传递的参数优先级高
    	 topIcon = this._icon;
     }
     //插入前置图标
     insertTabIcon(tabSpan,topIcon);
};
/*
 * 控制标签的打开个数
 */
rh.ui.openTab.prototype._controlTabCount = function(closeFlag) {
    var tabLis = jQuery(".ui-state-default",jQuery("#homeTabs"));
    if (tabLis.length >= System.getVar("@C_SY_TAB_MAX@")) {//根据系统配置来限制标签打开的个数
    	return false;
    }
    return true;
};
/*
 * 删除所有打开tab
 */
rh.ui.openTab.prototype._closeAllTab = function() {
    var homeTab = jQuery("#homeTabs");
	var closeTabs = jQuery(".rh-tabs-close-true", homeTab);
    jQuery.each(closeTabs, function(i, n) {
    	var tabDivId = jQuery(n).attr("href");
    	tabDivId = tabDivId.substring(1);
    	jQuery("#" + tabDivId).remove();
    	jQuery(n).parent().remove();
    });
    jQuery(".rh_tabs_more").remove();
    jQuery(".rh_tabs_moreCount").remove();
    jQuery(".tabUL li a").first().click();
};
/*
 * 关闭其它tab,exceptAId:非关闭的A标签的对象
 */
rh.ui.openTab.prototype._closeAllTabExcept = function(exceptAObj) {
    var homeTab = jQuery("#homeTabs");
	var closeTabs = jQuery(".rh-tabs-close-true", homeTab);
    jQuery.each(closeTabs, function(i, n) {
    	var tabDivId = jQuery(n).attr("href");
    	if (exceptAObj && (tabDivId == exceptAObj.attr("href"))) {
    		return;
    	}
    	tabDivId = tabDivId.substring(1);
    	jQuery("#" + tabDivId).remove();
    	jQuery(n).parent().remove();
    });
    jQuery(".rh_tabs_more").remove();
    jQuery(".rh_tabs_moreCount").remove();
    jQuery(exceptAObj).click();
};
/*
 * 解析含data={"SITE_ID":"SY_SM"}和如：SY_COMM_TEST.list.do?SITE_ID=SY_SM
 * 返回&型url
 */
rh.ui.openTab.prototype._parseURL = function(url) {
	var _self = this;
	var extUrl = "";
	var urlArray = url.split(".do?");
	if (urlArray.length > 1) {
		var last = urlArray[1].split("&");
		jQuery.each(last,function(i,n) {
			var temp = n.split("=");
			if (temp[0] == "data") {//data=类型参数处理
				var str = n.substring(5);
				var strObj = jQuery.parseJSON(str);
				var strParam = jQuery.param(strObj);
				extUrl += "&";
				extUrl += strParam;
				return true;
			}
			if (temp[0] == "pkCode") {
				_self.pkCode = temp[1];
			}
			extUrl += "&";
			extUrl += temp[0];
			extUrl += "=";
			extUrl += temp[1];
		});
	}
	return extUrl;
};
/*
 * 清除iframe内存占用
 */
rh.ui.openTab.prototype.destroyIframe = function(id) {
    var el = document.getElementById(id);
    var iframe = el.contentWindow;
    if(el){
        el.src="";  
        el.parentNode.removeChild(el);  
        try{
            iframe.document.write('');
        }catch(e){};
    }
};