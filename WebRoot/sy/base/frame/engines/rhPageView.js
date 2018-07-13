/** 首页页面渲染引擎 */
GLOBAL.namespace("rh.vi");
/*待解决问题：
 * 
 * */
rh.vi.pageView = function(options) {
	var defaults = {
		"id":options.id + "-viPageView",
		"styleDef":""
	};
	this.opts = jQuery.extend(defaults,options);
	this.homeOpts = this.opts.home || null;
	this.defaultTab = StrToJson(this.opts.defaultTab) || null;// 默认打开的tab
	this._mbLink = this.opts.mbLink || false;
	this._tabColor = this.opts.tabColor || "";
	this._pwdFlag = this.opts.pwdFlag || true;//密码修改显示与否
	this._preDeptUser = this.opts.preDeptUser || "";//头部显示用户信息
	this._wbimFlag = this.opts.wbimFlag || "";//即时通讯启用标识
	this._floatMenuFlag = System.getVar("@C_SY_MENU_FLOAT@") || "false";//浮动图标启用标识
	this._extendBanner = System.getVar("@C_SY_BANNER_EXTEND_HTML@");//banner扩展区的配置,对应一个模版组件id
	this._banner = GLOBAL.cookieBanner;
	this._openTodo = this.opts.openTodo || null;//自动打开待办的配置
	this._openTab = this.opts.openTab || null;//自动打开扩展tab
	this.toDoAllCount = 0;
};
/*
 * 渲染主方法
 */
rh.vi.pageView.prototype.show = function() {
	this._initMainData();
	this._layout();
	this._bldMenu();
	this._bldBanner();
	this._bldTabs();
	this._topPannel();
	this._bldBottomPannel();
	this._resetHeiWid();
	this._afterLoad();	
};
/*
 * 准备数据
 */
rh.vi.pageView.prototype._initMainData = function() {
	var _self = this;
	//tab颜色设置信息
	System.setConf("SY_TAB_COLOR",this._tabColor);
	//节假日风格定义优先级高于其它
	var fesl = System.getVar("@C_SY_STYLE_FEST@") || "";
	if (fesl.length > 0) {
		_self._serStyle(StrToJson(fesl));
		return false;
	}
	//获取风格定义信息
	var userCode = System.getUser("USER_CODE");
	var setData = FireFly.byId("SY_ORG_USER_STYLE",userCode, {"_AUTOADD_":true});
	System.setStyle("style",setData);
	if (setData && setData.SS_ID) {//有自定义的
		_self._serStyle(setData);
	} else if (_self.opts.styleDef != "" && _self.opts.styleDef.length > 0) {//用默认的
		_self._serStyle(_self.opts.styleDef);
	}
};
rh.vi.pageView.prototype._serStyle = function(res) {
	var def  =  this.opts.styleDef;
	def = StrToJson(def);
	var temp = {};
	if (res && res.SS_ID) {
		temp["SS_ID"] = res.SS_ID;
	}
	if ((res.SS_STYLE_MENU == "" || res.SS_STYLE_MENU == null) && def) {
		temp["SS_STYLE_MENU"] = def.SS_STYLE_MENU;		
	} else {
		temp["SS_STYLE_MENU"] = res.SS_STYLE_MENU;	
	}
	if ((res.SS_STYLE_BACK == "" || res.SS_STYLE_BACK == null) && def) {
		temp["SS_STYLE_BACK"] = def.SS_STYLE_BACK;		
	} else {
		temp["SS_STYLE_BACK"] = res.SS_STYLE_BACK;	
	}
	if ((res.SS_STYLE_BLOCK == "" || res.SS_STYLE_BLOCK == null) && def) {
		temp["SS_STYLE_BLOCK"] = def.SS_STYLE_BLOCK;		
	} else {
		temp["SS_STYLE_BLOCK"] = res.SS_STYLE_BLOCK;	
	}
	jQuery(".pageBody").addClass(temp.SS_STYLE_MENU);
	GLOBAL.style = temp;
};
/*
 * 构建列表页面布局
 */
rh.vi.pageView.prototype._layout = function() {
	
};
/*
 * 初始化菜单
 */
rh.vi.pageView.prototype._bldMenu = function() {
	var menuFlag = 2;//菜单位置标识
	var menu = new rh.ui.menu();

    var leftMenu = jQuery("<div id='left-homeMenu'></div>").addClass("left-homeMenu");

    var leftMenuDiv = jQuery("<div id='lefMenu-div'></div>").appendTo(leftMenu);
    var homeTabs = jQuery("#homeTabs").addClass("left-homeMenu-homeTabs");
    leftMenu.insertBefore(homeTabs);
	var ulObj = menu.render(menuFlag);
	var childrens = ulObj.children();

    function initLeftMenu (obj) {
    	    obj.appendTo(jQuery("#lefMenu-div"));
			jQuery("#lefMenu-div").accordion({
				autoHeight: false,
				navigation: true
			});
			//处理前置图标
			jQuery(".left-homeMenu .ui-state-default .ui-icon").each(function(i,n) {
			   var icon = jQuery(n).parent().attr("icon");
			   jQuery(n).addClass("leftMenu-" + icon);
			});
			//添加菜单的展开收起图标
			var spanIcon = jQuery("<span style='float:right;'></span>").addClass("leftMenu-ui-icon").addClass("ui-icon-close");
			jQuery("#left-homeMenu").find("h3").append(spanIcon);

            var configCon = jQuery("<div></div>").addClass("configDiv").appendTo(jQuery("#left-homeMenu"));

			var expandBar = jQuery("<a href='javascript:void(0);' title='收起边栏' class='leftMenu-close'>&nbsp;&nbsp;&nbsp;&nbsp;</a>").appendTo(configCon);
			var configBar = jQuery("<a href='javascript:void(0);' title='风格配置' class='leftMenu-config'>&nbsp;&nbsp;&nbsp;&nbsp;</a>").appendTo(configCon);

			var toggled = true; 
			jQuery("ul[aria-expanded='true']").addClass("leftMenu-ul-show");
			expandBar.bind("click", function() {
				if(toggled){
				    var leftWid = jQuery("#left-homeMenu").width();
				    jQuery(".leftMenu-ul-show").hide();			    
				    jQuery("#left-homeMenu").find(".leftMenu-title-label").hide();
					jQuery("#left-homeMenu").find(".leftMenu-ui-icon").hide();
					jQuery(".leftMenu-title--searchInput").addClass("leftMenu-title--searchInput__small");
					jQuery("#left-homeMenu").animate({ width: GLOBAL.defaultLeftMenuWid}, { duration: 0,complete:function() {
							jQuery(".ui-tabs-panel").width(GLOBAL.defaultRightHomeTabsWid);
							jQuery("#left-homeMenu").addClass("left-homeMenu-fix");
							//标题连接删除容差class
							jQuery("#left-homeMenu").find(".leftMenu-only-title .leftMenu-title-label").removeClass("leftMenu-title-label-link");
							//左侧下配置条控制
							expandBar.attr("title","展开边栏");
							jQuery("#left-homeMenu").addClass("leftHide");

							//标题的鼠标触发事件
						    jQuery("#left-homeMenu").find("h3").unbind('click').bind("mousemove",function(event) {
						       var h3 = jQuery(this);
						       var nextUl = jQuery(this).next();
						       jQuery(".leftMenu-ulTitleExtend-show").hide().removeClass("leftMenu-ulTitleExtend-show");

						       nextUl.width(leftWid);
						       var wid = nextUl.width();
						       if (wid == null || wid == 0) {
						           wid = 100;
						       }
						       jQuery("label",jQuery(this)).css("display","").addClass("leftMenu-ulTitleExtend-show").width(wid+19);
				       
						       if (nextUl.hasClass("leftMenu-ulExtend-show")) {
						       	  jQuery(".leftMenu-ulExtend-show").hide();
						       	  nextUl.show();
						       } else {
						       	  jQuery(".leftMenu-ulExtend-show").hide();
						       	  var left = jQuery("#left-homeMenu").width();
						       	  var divMargin = jQuery("#lefMenu-div").css("margin-left");
						       	  if (divMargin) {
						       		  divMargin = divMargin.split("px");
						       		  left = left - divMargin[0];
						       	  }
						          nextUl.addClass("leftMenu-ulExtend-show").css({"left":left});
						       	  nextUl.show();
						       }
						       nextUl.bind("mouseover",function(event) {
						           jQuery(".leftMenu-ulTitleExtend-show",h3).show();
						           h3.addClass("ui-state-hover");
							       nextUl.show();
							   }).bind("mouseout",function(event) {
							       nextUl.hide();
							       jQuery(".leftMenu-ulTitleExtend-show",h3).hide();
							       h3.removeClass("ui-state-hover");
							   });
						    }).bind("mouseleave",function(event) {
							   jQuery(".leftMenu-ulTitleExtend-show").hide();
							   jQuery(".leftMenu-ulExtend-show").hide();
							});
					}});
					jQuery(this).addClass("leftMenu-expand");					
				} else {
					jQuery(".left-topBar").append(jQuery(".left-topUserTip").removeClass("left-topUserTip-intab"));
					jQuery(".leftMenu-title--searchInput").removeClass("leftMenu-title--searchInput__small");
					//标题连接增加容差class
					jQuery("#left-homeMenu").find(".leftMenu-only-title .leftMenu-title-label").addClass("leftMenu-title-label-link");
					jQuery(".ui-tabs-panel").animate({ width: UIConst.PAGE_WID}, { duration: 0,complete:function() {
						    jQuery("#left-homeMenu").removeClass("left-homeMenu-fix");
							//扩展标题控制
					        jQuery(".leftMenu-ulTitleExtend-show").removeClass("leftMenu-ulTitleExtend-show");
					        jQuery(".leftMenu-ulExtend-show").removeClass("leftMenu-ulExtend-show");					        
					        //宽度控制
							jQuery("#left-homeMenu").width(UIConst.MENU_WID);
							jQuery("#left-homeMenu").find(".leftMenu-title-label").show();
					        jQuery("#left-homeMenu").find(".leftMenu-title").not(".leftMenu-only-title").find(".leftMenu-ui-icon").show();
					        //左侧下配置条控制
							expandBar.attr("title","收起边栏");
							jQuery("#left-homeMenu").removeClass("leftHide");
							
						    jQuery("#left-homeMenu").find("h3").unbind('mousemove').unbind("click").bind("click",function(event) {
						       jQuery(".ui-state-active").removeClass("ui-state-active");
						       jQuery(this).addClass("ui-state-active");
						       var nextUl = jQuery(this).next();
						       if (nextUl.hasClass("leftMenu-ul-show")) {
								   jQuery(".leftMenu-ul-show").slideUp("normal");
								   jQuery(".leftMenu-ul-show").removeClass("leftMenu-ul-show");
						       } else {
							   	  jQuery(".leftMenu-ul-show").slideUp("normal");
								  jQuery(".leftMenu-ul-show").removeClass("leftMenu-ul-show");
							   	  nextUl.slideDown("normal").addClass("leftMenu-ul-show");
						       }
						       nextUl.unbind("mouseover").bind("click",function(event) {
							       jQuery(".leftMenu-ul-show").show();
							   }).unbind("mouseout");
						    });
						    //重新设置ul的宽度
						    jQuery(".leftMenu-ul").unbind("mouseout");
						    jQuery(".leftMenu-ul").width(jQuery("#lefMenu-div").width());
						    jQuery(".leftMenu-ul-show").show();
					}});
					expandBar.removeClass("leftMenu-expand");
					expandBar.addClass("leftMenu-close");
				}
			    toggled = !toggled; 
		        return false
			}); 
			//首次绑定h3点击事件aria-selected   aria-expanded
			jQuery("#left-homeMenu").find("h3").unbind("click").bind("click",function(event) {
			   jQuery(".ui-state-active").removeClass("ui-state-active");
			   jQuery(this).addClass("ui-state-active");
			   var nextUl = jQuery(this).next();
			   if (nextUl.hasClass("leftMenu-ul-show")) {
				   jQuery(".leftMenu-ul-show").slideUp("normal");
				   jQuery(".leftMenu-ul-show").removeClass("leftMenu-ul-show");
			   } else {
			   	  jQuery(".leftMenu-ul-show").slideUp("normal");
				  jQuery(".leftMenu-ul-show").removeClass("leftMenu-ul-show");
			   	  nextUl.slideDown("normal").addClass("leftMenu-ul-show");
			   }
			});
    }
    initLeftMenu(childrens); 
};
/*
 * 构造banner
 */
rh.vi.pageView.prototype._bldBanner = function() {
	var _self = this;
	/*
	//用户信息区
	var userTipDiv = jQuery("<span></span>").addClass("left-topUserTip").appendTo(jQuery("#banner"));
	//var userImg = jQuery("<span>&nbsp;</span>").addClass("left-topBar-user").appendTo(userTipDiv);
	//var time = rhDate.getDateTime("hh");
	var preDept = "";
	if (this._preDeptUser && (this._preDeptUser.length > 0)) {//配置了显示用户名变量
		preDept = Tools.systemVarReplace(this._preDeptUser);
		var preDeptTemp = [];
		var array = preDept.split("-");
		var latest = "";
		for (var i = 0;i < array.length;i++) {//重复名称的处理
			if (array[i] == latest) {
				continue;
			} else {
				latest = array[i];
				preDeptTemp.push(array[i]);
			}
		}
		preDept = preDeptTemp.join("-");
	} else {
		preDept = System.getUser("DEPT_NAME") + "&nbsp;&nbsp;&nbsp;&nbsp;" + System.getUser("USER_NAME");
	}
	var userCode = jQuery("<div></div>").html("你好：" + preDept).addClass("left-topBar-user-text").appendTo(userTipDiv);
	if (System.getVar("@JIAN_CODES@").length > 0) {
		var jianGang = jQuery("<div id='jiangang' style='display:inline-block;position:relative;'></div>").html("(<a href='javascript:void(0);'>兼岗</a>)").addClass("left-topBar-jian-text").appendTo(userCode);
		jianGang.bind("click", function() {
			var obj = jQuery(".left-topBar-jian-list");
			if (obj.length == 1) {
				if (jQuery(".left-topBar-jian-list:visible").length == 1) {
					jQuery(".left-topBar-jian-list:visible").hide("normal");
				} else {
					jQuery(".left-topBar-jian-list").show("normal");
				}
			} else {
				var jianList = jQuery("<ul></ul>").addClass("left-topBar-jian-list");
				var data = FireFly.doAct("SY_ORG_LOGIN","getJianUsers",null,false);
				jQuery.each(data._DATA_,function(i,n) {
					var content = jQuery("<a href='#'>" + n.USER_NAME + "  (" + n.TODO_COUNT + "条)" + "</a>");
					content.bind("click",function(event) {
						var result = FireFly.doAct("SY_ORG_LOGIN","changeUser",{"TO_USER_CODE":n.USER_CODE},false);
						if (result[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
							var res = confirm("当前页面将刷新，确定继续吗？");
							if (res === true) {
								_self._refresh();
							}
					    } 
						event.stopPropagation();
					});
					jQuery("<li></li>").append(content).appendTo(jianList);
				});
				jianList.appendTo(jianGang);
				jianList.show("normal");
				jianList.bind("mouseleave",function(event) {
					jianList.hide("slow");
				});
			}
		});
	}
	//密码修改块
	if (this._pwdFlag == true || this._pwdFlag == "true") {//密码修改显示
		var pswdDiv =  jQuery("<span></span>").addClass("left-topPswdTip").appendTo(jQuery("#banner"));
		var pasd = jQuery("<div id='changPswd'></div>").html("(<a href='javascript:void(0);'>密码修改</a>)").addClass("left-topBar-pwd-text").appendTo(pswdDiv);
		jQuery("#changPswd").bind("click", function() {
			var options = {
					"url" : "SY_ORG_USER_PASSWORD.card.do?pkCode=" + System.getUser("USER_CODE"),
					"tTitle" : "修改密码" ,
					"menuFlag":3
			};
			Tab.open(options);
		});
	}
	//日期块
	var date = jQuery("<div></div>").html(System.getVar("@DATE_CN@") + "&nbsp;&nbsp;&nbsp;&nbsp;" + System.getVar("@DATE_WEEK_DAY_CN@")).addClass("left-topBar-date-text").appendTo(userTipDiv);
	//手机版链接块
	if (this._mbLink == true || this._mbLink == "true") {
		var mb = jQuery("<div id='toMb'></div>").html("(<a href='#'>手机版</a>)").addClass("left-topBar-mb-text").appendTo(jQuery("#banner"));
		jQuery("#toMb").bind("click",function() {
			window.location.href = "/index_mb.jsp";
		});
	}*/
	
	//通用连接区
	var cmLinkCon = jQuery("<div></div>").addClass("rh-head-cm");
	//1.获取当前用户权限的门户数据
	var portalUrl = "SY_COMM_TEMPL.show.do?pkCode=";
	var extendUrl = "&model=edit";
	var portalJson = {};
	if (System.getVar("@CMPY_PT@").length > 0) {
		portalJson["CMPY_PT"] = {"url":portalUrl + System.getVar("@CMPY_PT@"),"name":"公司门户"}; 
	}
	if (System.getVar("@ODEPT_PT@").length > 0) {
		portalJson["ODEPT_PT"] = {"url":portalUrl + System.getVar("@ODEPT_PT@"),"name":"机构门户"}; 
	}
	if (System.getVar("@TDEPT_PT@").length > 0) {
		portalJson["TDEPT_PT"] = {"url":portalUrl + System.getVar("@TDEPT_PT@"),"name":"部门门户"}; 
	}
	if (System.getVar("@USER_PT@").length > 0) {
		extendUrl += "&action=copy&type=4&extendType=5";
		portalJson["USER_PT"] = {"url":portalUrl + System.getVar("@USER_PT@"),"name":"用户门户","extendUrl":extendUrl}; 
	}
	//2.获取系统配置的banner门户数据
	var configPortalJsonStr = System.getVar("@C_SY_BANNER_ICON@") || "{}";
	var configPortalJson = jQuery.parseJSON(configPortalJsonStr);
	//3.合并门户和系统配置
	portalJson = jQuery.extend(portalJson,configPortalJson);
	
	jQuery.each(portalJson,function(i,n) {
		var title = n.name;
		var icon = i;
		var url = n.url;
		var extUrl = n.extendUrl;
		var menuStr = n.menuId || "";
		var menuId = Tools.systemVarReplace(menuStr);
		var container = jQuery("<div class='rh-head-cm-container' style='position:relative;' key='" + i + "'></div>").appendTo(cmLinkCon);
		var temp = jQuery("<div class='rh-head-cm-icon'></div>").attr("title",title).addClass("icon_banner_" + icon).appendTo(container);
        //绑定事件
		if (extUrl && extUrl.indexOf("model=edit") >= 0) {
			var edit = jQuery("<span class='icon_banner_edit' title='编辑" + title + "'></span>").appendTo(container);
			edit.bind("click", function(event) {
				var options = {"url":url + extendUrl,"menuFlag":3,"menuId":menuId,"tTitle":title + "(编辑)"};
				Tab.open(options);
				event.stopPropagation();
			});
		}
		container.bind("click", function(event) {
			var options = {"url":url,"menuFlag":3,"menuId":menuId,"tTitle":title};
			Tab.open(options);
		});
	});
	cmLinkCon.appendTo(jQuery("#banner"));
	//全文搜索区
	var bannerSearch = System.getVar("@C_SY_BANNER_SEARCH@") || "";
	if (typeof bannerSearch == "string" && (bannerSearch !== "false")) {
		var seaCon = jQuery("<div></div>").addClass("rh-head-sea");
		var temp = jQuery("<input type='text' class='rh-head-sea-input' value='智能搜索'/>").appendTo(seaCon);
		temp.keypress(function(event) {
			if (event.keyCode == '13') {
				jQuery(".rh-head-sea-icon").click();
			}
		}).focus(function(event) {
			var value = jQuery(this).val();
			if (value == "智能搜索") {
				jQuery(this).val('');
			}
		});
		var seaIcon = jQuery("<div class='rh-head-sea-icon'></div>").appendTo(seaCon);
		seaIcon.bind("click",function(event) {
			var keywords = temp.val();
			if ((jQuery.trim(keywords).length > 0) && (keywords != "智能搜索")) {
				var keyStr = encodeURIComponent(keywords);
				var opts = {"sId":"SEARCH-RES","tTitle":"搜索","url":"/SY_PLUG_SEARCH.query.do?data={'KEYWORDS':'" + keyStr + "'}","menuFlag":3,'scrollFlag':true};
				Tab.open(opts);
			}
		});
		seaCon.appendTo(jQuery("#banner"));	
	}
	//个人、兼岗、委托区
	var perCon = jQuery("<div></div>").addClass("rh-head-per");
	var jianListAbsoluteClass = "rh-head-per-left";
	if (jQuery.isEmptyObject(portalJson)) {//无banner图标则靠右
		perCon.addClass("rh-head-per-right");
		jianListAbsoluteClass = "rh-head-per-right";
	} else {
		perCon.addClass("rh-head-per-left");
	}
	var perConIn = jQuery("<div></div>").addClass("rh-head-per-in").attr("title", System.getUser("ODEPT_NAME")).appendTo(perCon);
	var userSex = System.getVar("@USER_SEX@");
	var perImg = FireFly.getContextPath() + System.getUser("USER_IMG");
	var perDiv = jQuery("<img class='rh-head-per-icon'></img>").attr("src",perImg).appendTo(perConIn);
	var perTip = jQuery("<div class='rh-head-per-tip'><span>" + System.getUser("DEPT_NAME")
			+ "</span><span>" + System.getUser("USER_NAME") + "</span></div>").appendTo(perConIn);
	//委托
	if (false) {
		var perWei = jQuery("<div class='rh-head-per-wei'></div>").appendTo(perConIn);
		jQuery("<div class='rh-head-per-wei-pre'></div>").appendTo(perWei);
		jQuery("<img class='rh-head-per-wei-img'/>").attr("src",FireFly.getContextPath() +"/sy/comm/page/img/jian.png").appendTo(perWei);
	}
	//兼岗
	var jianGangContainer = jQuery("<div class='rh-head-per-jian'></div>").appendTo(perConIn);
	//根据系统配置启用进入个人信息、查看资料完整度功能
	var showUserInfoFlag = System.getVar("@C_SY_HOME_SHOWUSERINFO@");
	if(!showUserInfoFlag || showUserInfoFlag != "false"){
		perDiv.attr("title","进入个人基本信息").addClass("cp");
		//弹出个人基本信息
		perDiv.bind("click", function(event) {
			var options = {"url":"SY_ORG_USER_CENTER.show.do","menuFlag":1,"menuId":"SY_USER_INFO__" + System.getVar("@CMPY_CODE@"),"tTitle":"基本信息"};
			Tab.open(options);
		});
		var userPercent = jQuery("<img src='../../comm/page/img/userPercent.png' class='rh-head-per-jian--percent'/>");
		userPercent.appendTo(jianGangContainer);
		var selfInfo = jQuery("<span title='个人资料完整度' id='rh-head-per--rate' class='rh-head-per--rate'></span>").appendTo(jianGangContainer);
		selfInfo.on("click", function(event) {//弹出个人基本信息
			var options = {"url":"SY_ORG_USER_CENTER.show.do","menuFlag":2,"menuId":"SY_USER_INFO__" + System.getVar("@CMPY_CODE@"),"tTitle":"个人基本资料"};
			Tab.open(options);
		});
	}
	if (System.getVar("@JIAN_CODES@").length > 0) {
		var jianGang = jQuery("<div id='jiangang' title='查看兼岗情况'></div>").html("<a href='javascript:void(0);' class='left-topBar-jian-text-con'></a>").addClass("left-topBar-jian-text");
		jianGang.appendTo(jianGangContainer);
		jianGang.bind("click", function() {
			var obj = jQuery(".left-topBar-jian-list");
			if (obj.length == 1) {
				if (jQuery(".left-topBar-jian-list:visible").length == 1) {
					jQuery(".left-topBar-jian-list:visible").hide("normal");
				} else {
					jQuery(".left-topBar-jian-list").show("normal");
				}
			} else {
				var jianList = jQuery("<ul></ul>").addClass("left-topBar-jian-list").addClass(jianListAbsoluteClass);
				jQuery("<span class='left-top-jian-list--title'>兼岗</span>").appendTo(jianList);
				var data = FireFly.doAct("SY_ORG_LOGIN","getJianUsers",null,false);
				jQuery.each(data._DATA_,function(i,n) {
					var content = jQuery("<a href='#' class='left-top-jian-list--li--a' title='" + n.TDEPT_NAME + "(" + n.USER_NAME + ")'>" + n.ODEPT_NAME + "/" + n.TDEPT_NAME + "/" + n.USER_NAME + "  (<span style='color:red;'>" + n.TODO_COUNT + "条</span>)" + "</a>");
					content.bind("click",function(event) {
						var result = FireFly.doAct("SY_ORG_LOGIN","changeUser",{"TO_USER_CODE":n.USER_CODE},false);
						if (result[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
							var res = confirm("当前页面将刷新，确定继续吗？");
							if (res === true) {
								//_self._refresh();
								window.location.href = FireFly.getContextPath() + "/sy/comm/page/page.jsp";
							}
						} 
						event.stopPropagation();
					});
					var li = jQuery("<li class='left-top-jian-list--li'></li>");
					var aCon = jQuery("<div class='left-top-jian-list--li--aCon'></div>");
					aCon.append(content);
					li.append(aCon)
					li.appendTo(jianList);
				});
				jianList.appendTo(jQuery("#banner"));
				jianList.show("normal");
				jianList.bind("mouseleave",function(event) {
					jianList.hide("slow");
				});
			}
		});
	}
	perCon.appendTo(jQuery("#banner"));
	var serverClusterNodeInfoCon = jQuery("<div style='position:absolute;top:4px;right:4px;'></div>").appendTo(jQuery("#banner"));
	serverClusterNodeInfoCon.text(__SERVER_NAME);
};
/*
 * 构造tabs
 */
rh.vi.pageView.prototype._bldTabs = function() {
	var _self = this;
	//初始化tabs
	jQuery("#homeTabs").tabs({});
	var platformPage = jQuery("#platformPage");
	var platformFrame = jQuery("#platformFrame");
	var tabUL = jQuery(".tabUL");
	jQuery("<a href='javascript:void(0)' id='loginOut' title='退出' class='rh-head-icons'/>").appendTo(tabUL);
	jQuery("<a href='javascript:void(0)' title='收起' class='rh-head-icons rh-head-close'><span class='rh-head-close-span'></span></a>").appendTo(tabUL);
	
	jQuery("#loginOut").on("click", function(event) {//退出
	       var resultData = FireFly.logout();
	       if (resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
	    	   if (_self.opts.rhClient == "true" || _self.opts.rhClient == true) {
	    		   document.title = "RhClientAction_Close";
	    	   } else {
	    		   // 由logout.jsp去决定退出该导向到哪个页面
	    		   Tools.redirect(FireFly.getContextPath() + "/logout.jsp");  
	    	   }
	       }
	       event.stopPropagation();
	       return false;
	});
	jQuery(".rh-head-close").bind("click", function(event) {//展开收起banner方法
	   var expand = jQuery(this);
	   var bannerHei = jQuery("#banner").height();
	   if (expand.hasClass("rh-head-expand")) {
		   jQuery("#banner").show();
		   expand.removeClass("rh-head-expand");
		   if (platformFrame.length > 0) {
			   platformFrame.height(platformFrame.height() - bannerHei);
		   }
		   var leftMenuTop = jQuery("#banner").height() + jQuery("#homeTabs .tabUL").height();
	       jQuery(".left-homeMenu").css("top",leftMenuTop);
	       Cookie.del(_self._banner);
	   } else {
	       jQuery("#banner").hide();
	       expand.addClass("rh-head-expand");
	       if (platformFrame.length > 0) {
	    	   platformFrame.height(platformFrame.height() + bannerHei);
	       }
	       jQuery(".left-homeMenu").data("longtop",jQuery(".left-homeMenu").offset().top);
	       jQuery(".left-homeMenu").css("top",jQuery("#homeTabs .tabUL").height());
	       Cookie.set(_self._banner, "hide", "365");
	   }
	});

	//tab下边框浮动图片
	var bottom = jQuery("<div></div>").addClass("rh-head-bottom");
	bottom.prependTo(jQuery(".ui-widget-header"));
	if (this.homeOpts && this.homeOpts != "null" && (platformPage.length == 0)) {//打开默认home
		Tab.open(this.homeOpts);
	} else {
		if (jQuery.isEmptyObject(this.defaultTab)) {
			var platformFrame = jQuery("<iframe id='platformFrame' name='platformFrame' src='"
					+ FireFly.contextPath + "/sy/comm/desk/desk.jsp' border='0' scrolling=no width=100% height=100% frameborder='0'></iframe>").addClass("tabFrame").appendTo(platformPage);
			//信息平台Tab初始化
			jQuery("a[href='#platformPage']").bind("click",function() {
			    jQuery(".left-homeMenu").hide();
			    jQuery("#platformPage").width("100%");
			    jQuery("#platformPage").height(GLOBAL.getDefaultFrameHei());
			    Tab.barRevert();
			});
			jQuery("a[href='#platformPage']").click();
			insertTabIcon(jQuery("a[href='#platformPage']").find("span"),"xxpt");//增加前置图标
		} else {
			var tabs = this.defaultTab;
			var len = tabs.length;
			for (var i = 0; i < len; i++) {
				var tabId = tabs[i]["TAB_ID"];
				var tabName = tabs[i]["TAB_NAME"];
				var tabUrl = tabs[i]["TAB_URL"];
				tabUrl = Tools.systemVarReplace(tabUrl);//替换系统变量
				var tabIcon = tabs[i]["TAB_ICON"];
				var tabOpen = tabs[i]["TAB_OPEN"];
				var tabRefresh = tabs[i]["TAB_REFRESH"];
				var tabContainer = jQuery("#" + tabId);
				var iframeObj = jQuery("<iframe id='" + tabId + "' name='" + tabId + "' class='tabFrame' border='0' scrolling=no width=100% height=100% frameborder='0'></iframe>").appendTo(tabContainer);
				//信息平台Tab初始化
				(function(iframeObj, tabId, tabUrl, tabRefresh){
					jQuery("a[href='#" + tabId + "']").bind("click",function() {
						Tab.beforePlatformPageClick(tabUrl);
						// 点击之后才加载
						var src = iframeObj.attr("src");
						if ((!src || src.length == 0) || tabRefresh == "true") {
							iframeObj.attr("src", FireFly.contextPath + tabUrl);
						}
						jQuery(".left-homeMenu").hide();
					    jQuery("#" + tabId).width("100%");
					    //jQuery("#" + tabId).height(GLOBAL.getDefaultFrameHei());
					    Tab.setFrameHei();
					    Tab.barRevert();
					});
				})(iframeObj, tabId, tabUrl, tabRefresh);
				if (tabOpen == "true") {
					jQuery("a[href='#" + tabId + "']").click();
				}
				insertTabIcon(jQuery("a[href='#" + tabId + "']").find("span"), tabIcon);//增加前置图标
			}
		}
	}
};
/*
 * 构造下拉面板的主方法
 */
rh.vi.pageView.prototype._topPannel = function(){
	if (this.opts.topPannel === false || this.opts.topPannel === "false") {  //不启动待办提醒
		return true;
	}
	this._preBldTopPannel();  
	this._posBldTopPannel();  
};
/*
 * 构建下拉面板的初始化操作
 */
rh.vi.pageView.prototype._preBldTopPannel = function(){
	var _self = this;
	_self.container = jQuery("#rh-slideMsg");
	_self.con = jQuery("<div id='rh-slideMsg-content'></div>").addClass("rh-slideMsg-content").appendTo(_self.container);
	var topClick = jQuery("<div class='rh-slideMsg-topClick'>系统消息</div>").appendTo(_self.con);
	topClick.bind("mousedown",function() {
		jQuery("#rh-slideMsgBtn").click();
	});
	var alertCountBar = jQuery("<div class='rh-slideMsg-alertCountBar'></div>").appendTo(topClick);
	var banAlert = jQuery("<span class='rh-slideMsg-alertCount0 ul'></span>").appendTo(alertCountBar); 
	banAlert.bind("mousedown",function() {
		Tab.open({
			"url" : "SY_COMM_TODO.list.do",
			"tTitle" : "待办",
			"menuFlag" : 3
		});
		jQuery("#rh-slideMsgBtn").click();
	});
	var yueAlert = jQuery("<span class='rh-slideMsg-alertCount1 ul'></span>").appendTo(alertCountBar); 
	yueAlert.bind("mousedown",function() {
		Tab.open({
			"url" : "SY_COMM_TODO_READ.list.do",
			"tTitle" : "待阅",
			"menuFlag" : 3
		});
		jQuery("#rh-slideMsgBtn").click();
	});
	var xiaoAlert = jQuery("<span class='rh-slideMsg-alertCount2 ul'></span>").appendTo(alertCountBar); 
	xiaoAlert.bind("mousedown",function() {
		Tab.open({
			"url" : "SY_COMM_TODO.list.do?extWhere=" + encodeURIComponent(" and TODO_CATALOG=3"),
			"tTitle" : "提醒",
			"menuFlag" : 3
		});
		jQuery("#rh-slideMsgBtn").click();
	});
	var bar = jQuery("<div></div>").attr("id","rh-slideBar").addClass("rh-slideBar").appendTo(_self.con);
	_self.box = jQuery("<div></div>").attr("id","rh-slideMsg-box").addClass("rh-slideMsg-box").appendTo(_self.con);
	var opner = jQuery("<div></div>").attr("id","rhSlideMsgOpner").addClass("rh-slideMsg-opner").appendTo(_self.con);
	var opnerSpan = jQuery("<span style='position:relative;'>&nbsp;</span>").attr("id","rh-slideMsgBtn").addClass("rh-slideMsgBtn").appendTo(opner);
	//增加数量到头
	var allCountDom = jQuery("<span class='rhGridCardCount ' style='left:45px;'></span>");
	allCountDom.appendTo(opnerSpan);
	var si = setInterval(function(){
         _self._interGetToDo();
	},6000);
	_self._interGetToDo();
    _self.div = null;
	_self.title = null;
	_self.icon = null;
	_self.tit = null;
	_self.closespan = null;
	_self.block = null;
	_self.ul = null;	
};
/*
 * 轮询获取待办条数
 */
rh.vi.pageView.prototype._interGetToDo = function() {
	var _self = this;
	var todoData = FireFly.doAct("SY_COMM_TODO","getTodoCount",null,false);
	var dataAll = todoData._DATA_;
	if (dataAll) {
		var allCount = dataAll.TODO_COUNT;//总数量
		var cla = "";
		if (allCount && allCount > 0) {
			if (allCount > 9) {
				cla += "rhGridCardCount--2";
			}
			if (allCount > 999) {
				allCount = "999+";	
		    }
		}
		jQuery(".rhGridCardCount").addClass("rhGridCardCount--show " + cla).text(allCount);
	}
};
/*
 * 构造消息下拉面板
 */
rh.vi.pageView.prototype._bldTopPannel = function() {
	var _self = this;
	//this.alertDataInsert();
	//var intervalTime = System.getVar("@C_SY_DESK_MSG_INTERVAL@") || "300000"; //系统配置的间隔时间,默认5分钟
	//window.setTimeout(function() {_self._bldTopPannel();},intervalTime); 

};
/*
 * 调用后台获取数据，并增加到下拉面板
 */
rh.vi.pageView.prototype.alertDataInsert = function(){
	var _self = this;
	var res = Todo.get(_self.toDoAllCount,10);//默认取10条记录
	if (_self.toDoAllCount != res.count) {//数量有变化才去重新构造
		_self.toDoAllCount = res.count;
		if(res.data){ //数据为null，则表示不能获取数据
			_self.box.empty();
			var data = res.data._DATA_;
		    jQuery.each(data, function(i,n) {
		    	_self._addAlert(n);
		    });
		    if (res.count > 10) {
		    	_self._addMore();
		    }
        }
	}
	if (res.count_1) {//待办
		jQuery(".rh-slideMsg-alertCount0").html("待办(" + res.count_1 + ")");
	}
	if (res.count_2) {//待阅
		jQuery(".rh-slideMsg-alertCount1").html("待阅(" + res.count_2 + ")");
	}
	if (res.count_3) {//提醒
		jQuery(".rh-slideMsg-alertCount2").html("提醒(" + res.count_3 + ")");
	}
	//待办、待阅
};
/*
 * 下拉面板中添加【更多】链接
 */
rh.vi.pageView.prototype._addMore = function(){
	var _self = this;
	jQuery("#top-pannel-more-a").remove();
	jQuery("<a href='javascript:void(0);'>更多&gt;&gt;</a>").attr( "id","top-pannel-more-a")
		.bind("click",function(){
			Tab.open({
				"url" : "SY_COMM_TODO.list.do",
				"tTitle" : "待办事务",
				"menuFlag" : 3
			});
			jQuery("#rh-slideMsgBtn").click();
	}).addClass("rh-slideMore-a").appendTo(_self.box);
};

/*
 * 下拉面板响应事件操作
 */
rh.vi.pageView.prototype._posBldTopPannel = function(){
	var _self = this;
	_self.con.appendTo(_self.container);
	//绑定事件
	jQuery("#rh-slideMsgBtn").click(function(event) {
		var options = {"url":"/sy/base/view/stdListCardView.jsp?source=note", "tTitle":"消息中心", "menuFlag":3,"scrollFlag":true};
		Tab.open(options);
//	   if (jQuery(".rh-slideMsg-content").hasClass("rh-slideMsg-content-open")) {
//		      jQuery("#rh-slideMsg-box").hide();
//		      jQuery("#rh-slideBar").hide();
//		      jQuery(".rh-slideMsg").animate({height: "0"}, { queue: false, duration: 'slow',complete:function() {
//    	            jQuery("#rhSlideMsgOpner").removeClass("rh-slideMsg-opner-open");
//		            jQuery(".rh-slideMsg-content").removeClass("rh-slideMsg-content-open");
//		            jQuery(".rh-slideMsg-topClick").hide();
//	     	      } 
//	          });
//	    } else {
//		      var hei = 510;//document.documentElement.clientHeight-203;
//		      jQuery(".rh-slideMsg-content").addClass("rh-slideMsg-content-open");	
//		      setTimeout(function() {
//		          jQuery("#rh-slideMsg-box").show();
//			      jQuery("#rh-slideBar").show();	
//			      jQuery(".rh-slideMsg-content-open").show();
//				  jQuery("#rhSlideMsgOpner").addClass("rh-slideMsg-opner-open");
//
//		    	  jQuery(".rh-slideMsg").animate({height: hei}, { queue: false, duration: 'slow',complete:function() {
//		    		  jQuery(".rh-slideMsg-topClick").show();
//		    		  _self._bldTopPannel();
//		    	  }});
//		      },100);
//        }
     });
	 jQuery(".rh-slideMsg-titleClose").bind("click",function() {
	        jQuery(this).addClass("rh-slideMsg-titleClear");
	        jQuery(this).bind("click",function() {
	              jQuery(this).parent().parent().hide();
	        });
	 });

//     jQuery(".rh-slideMsg").bind("mouseleave",function(event) {
//	       jQuery("#rh-slideMsg-box").hide();
//		   jQuery("#rh-slideBar").hide();
//		   jQuery(".rh-slideMsg").animate({height: "0"}, { queue: false, duration: 'slow',complete:function() {
//		        jQuery("#rhSlideMsgOpner").removeClass("rh-slideMsg-opner-open");
//		    	jQuery(".rh-slideMsg-content").removeClass("rh-slideMsg-content-open");
//		    	jQuery(".rh-slideMsg-topClick").hide();
//		        } 
//		   });
//	 });
};

/*
 * 下拉面板增加一条提醒
 */
rh.vi.pageView.prototype._addAlert = function(n) {
	var _self = this;
	var divId = "rh-sid-" + n.TODO_CODE;
    if(jQuery("#" + divId).length == 0){
    	_self.div = jQuery("<div></div>").attr("id",divId).appendTo(_self.box);
    	_self.title = jQuery("<div></div>").addClass("rh-slideTitle").appendTo(_self.div);
    	_self.icon = jQuery("<img></img>").addClass("rh-slideMsg-titleImg").attr("src",FireFly.contextPath + "/sy/comm/desk/css/images/app_rh-icons/gongwen.png").appendTo(_self.title);
    	_self.closespan = jQuery("<span>&nbsp;</span>").addClass("rh-slideMsg-titleClose").appendTo(_self.title);
    	_self.tit = jQuery("<span></span>").text(n.TODO_CODE_NAME).appendTo(_self.title);
    	_self.block = jQuery("<div></div>").addClass("rh-slideBlock").appendTo(_self.div);
    	_self.ul = jQuery("<ul></ul>").addClass("rh-slideUl").appendTo(_self.block);	
    }
    var li = jQuery("<li></li>").addClass("rh-slideLi").appendTo(_self.ul);
	//var liH2 = jQuery("<h2></h2>").addClass("rh-slide-leftPad").appendTo(li).append("请批阅");
	var time = jQuery("<span></span>").addClass("rh-slideTime").text(n.TODO_SEND_TIME).appendTo(li);
	var lip = jQuery("<p></p>").css({"vertical-align": "middle","margin-bottom":"5px"}).appendTo(li);
	var flagClass = "rh-slide-flagRed";
	if (n.S_EMERGENCY == 1) {
    	flagClass = "rh-slide-flagYellow";
    } else if (n.S_EMERGENCY == 20) {
    	flagClass = "rh-slide-flagBlue";
    }
	var flag = jQuery("<span></span>").addClass("rh-slide-flagSpan").addClass(flagClass).appendTo(lip);
	jQuery("<a href='javascript:void(0);'> " + n.TODO_TITLE + "</a>").css({"cursor" : "pointer","color":"#FFF"}).bind("click", function(){
		 _self._goInToDo(n.TODO_CODE,n.TODO_TITLE,n.TODO_URL,n.TODO_OBJECT_ID1);
	}).appendTo(lip);
    //lip.append(jQuery("<a href='javascript:void(0);'></a>")).css({'text-decoration':'underline'}).append(n.TODO_TITLE).css({"cursor" : "pointer"});;
	var h2 = jQuery("<h2></h2>").addClass("rh-slide-leftPad").append("来自:" + n.SEND_USER_CODE__NAME).appendTo(li);
	var timeEnd = jQuery("<span></span>").addClass("rh-slideQiXianTime").text("");
	h2.append(timeEnd);
	
    /*lip.bind("click",function() {
         _self._goInToDo(n.TODO_CODE,n.TODO_TITLE,n.TODO_URL,n.TODO_OBJECT_ID1);
	});*/
};
/*
 * 点击下拉面板某一标题跳转
 */
rh.vi.pageView.prototype._goInToDo = function(sId, title, url, pkCode) {
    if (url.indexOf(".byid.do") > 0) {
		var params = {"from":"todo"};
		var options = {"url":sId + ".card.do?pkCode=" + pkCode, "tTitle":title, "menuFlag":3, "replaceUrl":url,"params":params};
		Tab.open(options);
	} else {
		var params = {"replaceUrl":url, "from":"todo"};
		var options = {"url":url, "tTitle":title, "menuFlag":3, "params":params};
		Tab.open(options);
	}
    jQuery("#rh-slideMsgBtn").click();
};

/**
 * 构造风格样式设置弹出框
 */
rh.vi.pageView.prototype._bldBoxHtml = function() {
	var appboxHtml = '';
	appboxHtml =    '<div id="portalSetting">';
	appboxHtml +=       '<span id="portalSettingMsg"></span>';    
	appboxHtml +=       '<div id="bar" class="" >'; 
	appboxHtml +=         '<span id="btnAllSet" title="设定系统的风格" class="rhDesk-btn icon-dialog-all">整体样式</span>';
	appboxHtml +=         '<span class="rhDesk-btn-line"></span>';
//	appboxHtml +=         '<span id="btnMenuSet" class="rhDesk-btn icon-dialog-menu">菜单</span>';
//	appboxHtml +=         '<span class="rhDesk-btn-line"></span>';
//	appboxHtml +=         '<span id="btnBackSet" class="rhDesk-btn icon-dialog-back">背景</span>';
//	appboxHtml +=         '<span class="rhDesk-btn-line"></span>';
//	appboxHtml +=         '<span id="btnBlockSet" class="rhDesk-btn icon-dialog-block">信息块</span>';
//	appboxHtml +=         '<span class="rhDesk-btn-line"></span>';
	appboxHtml +=         '<span id="btnDefaultSet" title="将当前系统风格恢复到原始风格" class="rhDesk-btn" style="text-decoration: underline;">恢复风格</span>';
	appboxHtml +=      '</div>';
	appboxHtml +=      '<div id="appPageAll" class="rh-dialog-con-right" style="">';
	appboxHtml +=         '<div id="rhStyle-allDom" class="rh-deskDom" style="">';
	appboxHtml +=            '<div id="rhStyle-allDom-div"  class="deskContent" style="height:430px;overflow:auto;"></div>';
	appboxHtml +=         '</div>';
	
	appboxHtml +=         '<div id="rhStyle-menuDom" class="rh-deskDom" style="">';
	appboxHtml +=            '<div id="rhStyle-menuDom-div"  class="deskContent" style=""></div>';
	appboxHtml +=         '</div>';
	
	appboxHtml +=         '<div id="rhStyle-backDom" class="rh-deskDom">';
	appboxHtml +=               '<div id="rhStyle-backDom-div" class="deskContent"></div>';   
	appboxHtml +=         '</div>';
	
	appboxHtml +=         '<div id="rhStyle-blockDom" class="rh-deskDom">';
	appboxHtml +=               '<div id="rhStyle-blockDom-div" class="deskContent"></div>';
	appboxHtml +=         '</div>';
	
	appboxHtml +=      '</div>';
	appboxHtml +=   '</div>';
	return appboxHtml;
};
rh.vi.pageView.prototype._activeTab = function (obj) {
	jQuery(".rh-dialog-con-right").show();
	jQuery(".rhDesk-btnActive").removeClass("rhDesk-btnActive ");
    jQuery(".rhDesk-lineActive").removeClass("rhDesk-lineActive ");
 	obj.addClass("rhDesk-btnActive");
 	obj.next().addClass("rhDesk-lineActive");
};
/*
 * 构造风格定义面板
 */
rh.vi.pageView.prototype._bldBottomPannelLayout = function() {
	var _self = this;
	//初始化内容
	var container = jQuery("#rh-slideStyle-box");
	var rhAllStyle = {"id":"alStyle","title":"整体风格","class":"","sonclass":"rh-slideStyle-all",
			              "chid":[{"title":"高对比蓝色(默认)","name":"rh-slideStyle-allBlue","menu":"pageBody-gray","back":"bodyBack-gray","block":"conHeaderTitle"},
			                    {"title":"浅蓝","name":"rh-slideStyle-allLightBlue","menu":"pageBody-lightBlue","back":"bodyBack-gray","block":"conHeaderTitle-blue"},
			                    {"title":"橙色","name":"rh-slideStyle-allOrange","menu":"pageBody-orange","back":"bodyBack-gray","block":"conHeaderTitle-orange"},
			                    {"title":"天空蓝","name":"rh-slideStyle-allSkyBlue","menu":"pageBody-skyBlue","back":"bodyBack-gray","block":"conHeaderTitle-skyBlue"},
			                    {"title":"清新绿","name":"rh-slideStyle-allGreen","menu":"pageBody-green","back":"bodyBack-gray","block":"conHeaderTitle-green"},
			                    {"title":"墨蓝","name":"rh-slideStyle-allDarkBlue","menu":"pageBody-darkBlue","back":"bodyBack-gray","block":"conHeaderTitle-darkBlue"},
			                    {"title":"浅灰花纹","name":"rh-slideStyle-allLightGray","menu":"pageBody-lightGray","back":"bodyBack-white","block":"conHeaderTitle-flower"},
			                    {"title":"棕色花纹","name":"rh-slideStyle-allGrown","menu":"pageBody-grown","back":"bodyBack-grown","block":"conHeaderTitle-tree"},
			                    {"title":"黑木纹","name":"rh-slideStyle-allDarkWood","menu":"pageBody-darkWood","back":"bodyBack-wood","block":"conHeaderTitle-wood"},
			                    {"title":"红色","name":"rh-slideStyle-allRed","menu":"pageBody-red","back":"bodyBack-gray","block":"conHeaderTitle-red"}
			                    ]};
	var styleDefComs = System.getVar("@C_SY_STYLE_DEF_COMS@");//获取配置定义
	if (styleDefComs) {
		var configStyle = eval(System.getVar("@C_SY_STYLE_DEF_COMS@"));
		rhAllStyle = {"id":"alStyle","title":"整体风格","class":"","sonclass":"rh-slideStyle-all","chid":configStyle};
	}
	var bottomDataMenu = {"id":"menu","title":"菜单","class":"","sonclass":"rh-style-menuImg",
			                       "chid":[{"title":"灰(默认)","color":"#565252","name":"pageBody-gray"},
			                               {"title":"浅蓝","color":"#5D8BB3","name":"pageBody-lightBlue"},
			                               {"title":"橙","color":"#FF8546","name":"pageBody-orange"},
			                               {"title":"天空蓝","color":"#25608A","name":"pageBody-skyBlue"},
			                               {"title":"绿","color":"#42ad52","name":"pageBody-green"},
			                               {"title":"墨蓝","color":"#60788e","name":"pageBody-darkBlue"},
			                               {"title":"浅灰","color":"#8A8888","name":"pageBody-lightGray"},
			                               {"title":"棕色","color":"#b39941","name":"pageBody-grown"}
			                               ]};
	var bottomDataBack = {"id":"bodyback","title":"背景","class":"","sonclass":"rh-style-listImg",
			                       "chid":[{"title":"灰色(默认)","class":"rh-slideStyle-gray","name":"bodyBack-gray"},
			                               {"title":"木纹","class":"rh-slideStyle-backWood","name":"bodyBack-wood"},
			                               {"title":"白花纹","class":"rh-slideStyle-backWhite","name":"bodyBack-white"},
			                               {"title":"绿草","class":"rh-slideStyle-green","name":"bodyBack-green"},
			                               {"title":"黄木纹","class":"rh-slideStyle-grown","name":"bodyBack-grown"},
			                               {"title":"红木纹","class":"rh-slideStyle-redWood","name":"bodyBack-redWood"}
			                               ]};
	var bottomDataBlock =  {"id":"blocktitle","title":"信息块头","class":"","sonclass":"rh-style-blockImg",
			                       "chid":[{"title":"白","class":"rh-slideStyle-blockWhite","name":""},
			                               {"title":"木纹","class":"rh-slideStyle-blockWood","name":"conHeaderTitle-wood"},
			                               {"title":"墨蓝","class":"rh-slideStyle-blockDarkBlue","name":"conHeaderTitle-darkBlue"},
			                               {"title":"绿色","class":"rh-slideStyle-blockGreen","name":"conHeaderTitle-green"},
			                               {"title":"红色","class":"rh-slideStyle-blockRed","name":"conHeaderTitle-red"},
			                               {"title":"天空蓝","class":"rh-slideStyle-blockSkyBlue","name":"conHeaderTitle-skyBlue"},
			                               {"title":"桔色","class":"rh-slideStyle-blockOrange","name":"conHeaderTitle-orange"},
			                               {"title":"花色","class":"rh-slideStyle-blockFlower","name":"conHeaderTitle-flower"},
			                               {"title":"黄色花形","class":"rh-slideStyle-blockTree","name":"conHeaderTitle-tree"},
			                               {"title":"浅蓝色","class":"rh-slideStyle-blockLightBlue","name":"conHeaderTitle-blue"}
			                               ]};
	//整体风格改变
	var sonClass = rhAllStyle.sonclass;
	var div = jQuery("<div></div>").addClass("");
	div.addClass(rhAllStyle["class"]);
	jQuery.each(rhAllStyle.chid,function(y,m) {
		var cont = jQuery("<div class='rh-slideStyle-all-container'></div>").appendTo(div);
		var span = jQuery("<span></span>").addClass("rh-slideStyle-all").addClass(m.name).addClass(sonClass);
		span.attr("menu",m.menu);
		span.attr("back",m.back);
		span.attr("block",m.block);
		span.attr("title","单击设定 " + m.title);
		span.appendTo(cont);
		jQuery("<div class='rh-slideStyle-all-title'>" + m.title + "</div>").appendTo(cont);
	})
	div.appendTo(jQuery("#rhStyle-allDom-div"));
	//菜单
	var sonClass = bottomDataMenu.sonclass;
	var div = jQuery("<div></div>").addClass("");
	div.addClass(bottomDataMenu["class"]);
	jQuery.each(bottomDataMenu.chid,function(y,m) {
		var cla = m["name"];
		var span = jQuery("<span></span>").addClass("rh-slideStyle-img").addClass(sonClass).addClass(cla);
		span.css("background-color",m["color"]);
		span.attr("name",m.name);
		span.attr("title",m.title);
		span.appendTo(div);
	})
	div.appendTo(jQuery("#rhStyle-menuDom-div"));
	//背景
	var sonClass = bottomDataBack.sonclass;
	var div = jQuery("<div></div>").addClass("");
	div.addClass(bottomDataBack["class"]);
	jQuery.each(bottomDataBack.chid,function(y,m) {
		var cla = m["name"];
		var span = jQuery("<span></span>").addClass("rh-slideStyle-img").addClass(sonClass).addClass(cla);
		span.attr("name",m.name);
		span.attr("title",m.title);
		span.appendTo(div);
	})
	div.appendTo(jQuery("#rhStyle-backDom-div"));
	//信息块
	var sonClass = bottomDataBlock.sonclass;
	var div = jQuery("<div></div>").addClass("");
	div.addClass(bottomDataBlock["class"]);
	jQuery.each(bottomDataBlock.chid,function(y,m) {
		var cla = m["class"];
		var span = jQuery("<span></span>").addClass("rh-slideStyle-img").addClass(sonClass).addClass(cla);
		span.attr("name",m.name);
		span.attr("title",m.title);
		span.appendTo(div);
	})
	div.appendTo(jQuery("#rhStyle-blockDom-div"));
	
	//绑定事件
	jQuery("#btnAllSet").click(function(event) {//菜单
         _self._activeTab(jQuery(this));
        var _display = $("#rhStyle-allDom").css("display");
        if(_display == "none"){
           $(".rh-deskDom").hide();
           $("#rhStyle-allDom").show();
        }     
	});
	jQuery("#btnMenuSet").click(function(event) {//菜单
         _self._activeTab(jQuery(this));
        var _display = $("#rhStyle-menuDom").css("display");
        if(_display == "none"){
           $(".rh-deskDom").hide();
           $("#rhStyle-menuDom").show();
        }     
	});
	jQuery("#btnBackSet").click(function(event) {//背景
         _self._activeTab(jQuery(this));
        var _display = $("#rhStyle-backDom").css("display");
        if(_display == "none"){
           $(".rh-deskDom").hide();
           $("#rhStyle-backDom").show();
        }     
	});
	jQuery("#btnBlockSet").click(function(event) {//信息块
         _self._activeTab(jQuery(this));
        var _display = $("#rhStyle-blockDom").css("display");
        if(_display == "none"){
           $(".rh-deskDom").hide();
           $("#rhStyle-blockDom").show();
        }     
	});
	jQuery("#btnDefaultSet").click(function(event) {//恢复默认，删除用户关联的样式设定
	     var res = confirm("页面将会重新加载并应用样式，是否继续?");
	     if (res === true) {
		     _self._styleDelete();
	     }  
	});
	
	jQuery(".rh-slideStyle").bind("mouseleave",function(event) {
	    jQuery(".rh-slideStyle").animate({width: "0"}, { queue: false, duration: 'slow',complete:function() {
		    jQuery(".rh-slideStyle-content").removeClass("rh-slideStyle-content-open");
		    jQuery(".rh-slideStyle-box").hide();
		    jQuery("#rh-slideStyle").hide();
		  } 
		});
	});
	/**
	 * 元素的点击事件绑定
	 */
	jQuery(".rh-slideStyle-all").bind("click",function() {//列表背景
		   var styleMenu = jQuery(this).attr("menu");
		   var styleBack = jQuery(this).attr("back");
		   var styleBlock = jQuery(this).attr("block");
		   //保存样式
		   var data = {"SS_STYLE_MENU":styleMenu, //菜单颜色
				       "SS_STYLE_BACK":styleBack, //背景颜色
				       "SS_STYLE_BLOCK":styleBlock}; //区块条
		   var res = confirm("页面将会重新加载并应用样式，是否继续?");
		   if (res === true) {
			   _self._styleSave(data, true);
		   }
	});
	jQuery(".rh-style-blockImg").bind("click",function() {//区块头
	   var styleBlock = jQuery(this).attr("name");
	   //删除class以conHeaderTitle-开头的
	   jQuery("iframe").contents().find(".conHeaderTitle").removeClass(function() {
	   	  var obj = jQuery(this);
	   	  var classes = jQuery(this).attr("class").split(" ");
	   	  var res = "";
	   	  jQuery.each(classes,function(i,n) {
	   	  	if (n.indexOf("conHeaderTitle-") == 0) {
	   	   	  	res += " ";
	   	   	  	res += n;
	   	  	}
	   	  });
	   	  return res;
	   }).addClass(styleBlock);
	   //删除class以conHeaderTitle-开头的
	   jQuery("iframe").contents().find(".portal-box-title").removeClass(function() {
	   	  var obj = jQuery(this);
	   	  var classes = jQuery(this).attr("class").split(" ");
	   	  var res = "";
	   	  jQuery.each(classes,function(i,n) {
	   	  	if (n.indexOf("conHeaderTitle-") == 0) {
	   	   	  	res += " ";
	   	   	  	res += n;
	   	  	}
	   	  });
	   	  return res;
	   }).addClass(styleBlock);
	   //设置卡片标题头
	   jQuery("iframe").contents().find(".rhCard-tabs .tabUL").removeClass(function() {
	   	  var obj = jQuery(this);
	   	  var classes = jQuery(this).attr("class").split(" ");
	   	  var res = "";
	   	  jQuery.each(classes,function(i,n) {
	   	  	if (n.indexOf("conHeaderTitle-") == 0) {
	   	   	  	res += " ";
	   	   	  	res += n;
	   	  	}
	   	  });
	   	  return res;
	   }).addClass(styleBlock);
	   //保存样式
       var data = {"SS_STYLE_BLOCK":styleBlock};
	   _self._styleSave(data);
	});
	jQuery(".rh-style-menuImg").bind("click",function() {//菜单背景
	   var styleMenu = jQuery(this).attr("name");
	   //删除class以pageBody-开头的
	   jQuery(".pageBody").removeClass(function() {
	   	  var obj = jQuery(this);
	   	  var classes = jQuery(this).attr("class").split(" ");
	   	  var res = "";
	   	  jQuery.each(classes,function(i,n) {
	   	  	if (n.indexOf("pageBody-") == 0) {
	   	   	  	res += " ";
	   	   	  	res += n;
	   	  	}
	   	  });
	   	  return res;
	   }).addClass(styleMenu);
	   //保存样式
	   var data = {"SS_STYLE_MENU":styleMenu};
	   _self._styleSave(data);
	});
	jQuery(".rh-style-listImg").bind("click",function() {//列表背景
	   var styleBack = jQuery(this).attr("name");
	   //删除class以bodyBack-开头的
	   jQuery("iframe").contents().find(".bodyBack").removeClass(function() {
	   	  var obj = jQuery(this);
	   	  var classes = jQuery(this).attr("class").split(" ");
	   	  var res = "";
	   	  jQuery.each(classes,function(i,n) {
	   	  	if (n.indexOf("bodyBack-") == 0) {
	   	   	  	res += " ";
	   	   	  	res += n;
	   	  	}
	   	  });
	   	  return res;
	   }).addClass(styleBack);
	   //保存样式
	   var data = {"SS_STYLE_BACK":styleBack};
	   _self._styleSave(data);
	});
	jQuery("#btnAllSet").click();
};
/*
 * 构造风格定义面板
 */
rh.vi.pageView.prototype._bldBottomPannel = function() {
	var _self = this;
	this.styleFlagOpen = false;
	var aa = _self._bldBoxHtml();
	//绑定事件
	jQuery(".leftMenu-config").click(function(event) {
		    if (_self.styleFlagOpen == false) {
	            //调用通用组件
	            var temp = new rh.ui.pop({"id":"stylebox","pHandler":_self,"title":"风格定义"});
	            temp.render(); 
	            _self.dia = temp.display(aa);
		        _self._bldBottomPannelLayout();
	            _self.styleFlagOpen = true;
		    } else {
		    	_self.dia.display();
		    }
		}
	);	
};
/*
 * 风格样式保存
 */
rh.vi.pageView.prototype._styleSave = function(opts,refreshFlag) {
    var _self = this;
    var data = {};
    if (GLOBAL.style.SS_ID) {
        data["_PK_"] = System.getVar("@USER_CODE@");
    } else {
        data["SS_ID"] = System.getVar("@USER_CODE@");
        data["_ADD_"] = "true";
    }
    data = jQuery.extend(data,opts);
    var res = FireFly.doAct("SY_ORG_USER_STYLE","save",data,false);
    if (res[UIConst.PK_KEY] && res[UIConst.PK_KEY].length > 0) {
    	if (refreshFlag === true) {
    		_self._refresh();
    	} else {
    		_self._serStyle(res);
    	}
    }
};
/*
 * 风格样式删除
 */
rh.vi.pageView.prototype._styleDelete = function() {
    var _self = this;
    var data = {};
    data["_PK_"] = System.getVar("@USER_CODE@");
    var res = FireFly.listDelete("SY_ORG_USER_STYLE",data);
    if (res["_OKCOUNT_"] && res["_OKCOUNT_"] == 1) {
    	_self._refresh();
    }
};
/*
 *修改高度
 */
rh.vi.pageView.prototype._resetHeiWid = function() {
	
};
/*
 * 刷新当前页面
 */
rh.vi.pageView.prototype._refresh = function() {
	window.top.location.reload();
};
/*
 *页面渲染后
 */
rh.vi.pageView.prototype._afterLoad = function() {
	var _self = this;
	//1.banner判断
	var scrollHei = jQuery("#banner").height();
	if (Cookie.get(_self._banner) == "hide") {
	       if (jQuery("#platformFrame").length > 0) {
	    	   jQuery("#banner").hide();
	    	   jQuery(".rh-head-close").addClass("rh-head-expand");
		       jQuery(".left-homeMenu").css("top","36px");
	       }
	       Tab.barFixed();
			//按钮的浮动
			jQuery(window).scroll(function() {
				var top = document.documentElement.scrollTop+document.body.scrollTop;
				if (top < scrollHei) {
					Tab.btnBarRevert();
				} else {
					Tab.btnBarFixed(top,"hide");
				}
			});
	} else {
		//tabs的fixed处理
		jQuery(window).scroll(function() {
			var top = document.documentElement.scrollTop+document.body.scrollTop;
			if (top < scrollHei) {
				Tab.barRevert();
				Tab.btnBarRevert();
			} else {
				Tab.barFixed();
				Tab.btnBarFixed(top);
			}
		});
	}
	//2.加载待办的打开
	if (this._openTodo) {
		var openTodo = this._openTodo;
	    var options = {"url":openTodo.todoServId + ".card.do?pkCode=" + openTodo.servPk,"tTitle":openTodo.todoTitle,"replaceUrl":openTodo.todoUrl,"menuFlag":4};
	    Tab.open(options);
    }
	//3.委托处理
	if(Agent.checkSubStatus() || Agent.checkAgentStatus()){
		Agent.computeAgtStatus(true);
	}
	/*
	var agtFlag = Agent.checkAgentStatus();
	var userCode = System.getUser("USER_CODE");
	setTimeout(function() {
		if (agtFlag && confirm("您的账号处于委托代理状态，是否取消工作委托？")) {
			var param = {"_PK_":"","action":"stopAllAgentByUserCode","USER_CODE":userCode};
			var res = FireFly.doAct("SY_ORG_USER_TYPE_AGENT", "doAgentAction", param, true);
		}
	},1000);
	 */
	//4.个人资料完整的的比例获取
	//var percent = FireFly.doAct("SY_COMM_COMPLETE_DATA","getDeg",{"SRC_SERV_CODE":"USERINFO","DATA_ID":System.getUser("USER_CODE")});
	//if (percent.deg) {
		jQuery("#rh-head-per--rate").text(System.getVar("@USER_CMLE_DEG@") + "%");
	//}
	//5.提示处理
	if (jQuery.browser.version == "7.0") {//ie7下不增加菜单提示，会有显示bug
	} else {
		jQuery("[tip]").colorTip({color:"blue",timeout:0});
	}
	//6.即时通讯的显示
	if (this._wbimFlag && (this._wbimFlag === "true")) {
	    jQuery(document).ready(function(){
	    	var userCode = System.getVar("@USER_CODE@");
	    	if (userCode) {
	    		var imDomain = "@rhim.server";
	    		var jid = userCode + imDomain;  
	    		var temp = {"id":"wbim", "jid":jid, "token":"","domain":imDomain};
	    		var imObj = new rh.vi.wbimView(temp);
	    		imObj.show();
	    		jQuery(document).data("imObj",imObj);
	        }
	    });
	}
	//7.扩展tab的打开，如：http://localhost:9009/sy/comm/page/page.jsp?openTab={'tTitle':'待办事物','url':'SY_COMM_TODO.list.do','menuId':'huaxiaLW_Main'}
	if (this._openTab && (this._openTab.length > 0)) {
		this._openTab = this._openTab.replace(/#/g, '.');
	    var options = StrToJson(this._openTab);
	    Tab.open(options);
	}
	//8.浮动图标快捷方式
	if (this._floatMenuFlag && (this._floatMenuFlag === "true")) {
	    jQuery(document).ready(function(){
	    	window.floatMenu = new rh.ui.floatMenu(Menu.floatShow);
	    });
	}
	//9.处理banner扩展区域的显示，对应模版组件的值
	if (this._extendBanner && this._extendBanner.length > 0) {
		var data = {};
		data["PC_ID"] = this._extendBanner;//对应ID
		var res = FireFly.doAct("SY_COMM_TEMPL","getPortalArea",data,false);
		if ((res.AREA != null) && (res.AREA != "")) {
			jQuery("#banner").append(res.AREA);
		}
	}
};
