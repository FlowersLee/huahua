/** 浮动消息提示页面渲染引擎 */
GLOBAL.namespace("rh.ui");
rh.ui.floatMenu = function(options) {
	this.layouts = [];
	this.skins = [];
	this.menus = [];
	this.pks = "";//pkCode集合
	this.datas = System.getStyle("style");
	for(var i=0;i < options.length;i++){
		var param = this._bldDsParam(options[i].info);
		if(param == "rh_skin"){
			this.skins.push(options[i]);
			this.pks += "'" + this.getPkCode(options[i].info) + "',";
		}else if(param == "rh_layout"){
			this.layouts.push(options[i]);
		}else {
			this.menus.push(options[i]);
		}
	}
	this.pks = Format.substr(0,this.pks.length-1,this.pks);
	var params = {};
	params["_extWhere"] = " and PT_ID in (" + this.pks + ")";
	if(this.pks != ""){
		this.portalStyles = FireFly.getListData("SY_COMM_TEMPL",params)._DATA_;
	}
	this._show(this.menus);
};
/*
 * 渲染主方法
 */
rh.ui.floatMenu.prototype._show = function(menus) {
	var _self = this;
	jQuery(".float_menu_box").empty();
	jQuery(".float_menu_box").remove();
	this._layout(menus); // 构建布局
};
/*
 * 构建列表页面布局
 */
rh.ui.floatMenu.prototype._layout = function(menus) {
	var _self = this;
	// 最外层容器
	var imBox = jQuery("<div class='float_menu_box' id='float_info_msg'></div>");
	var slideShow = jQuery("<div class='float_menu_box__slideShow'></div>").appendTo(imBox);
	jQuery("<p class='miniNav float_menu_box_nav'><a class='miniNav-navText'><span class='miniNav-navIcon float_menu_box__icon'></span><span class='float_menu_box__text'>门户地图</span></a></p>").appendTo(slideShow);
	this.main = jQuery("<div class='float_menu_box__slideShow__stMore' style='display:none;'></div>").appendTo(slideShow);
	this.mainData = jQuery("<ul class='float_menu_box__slideShow__stMore__ul'></ul>").appendTo(this.main);
	jQuery("<em class='float_menu_box__slideShow__stMoreClose' style='display:none;'><a title='关闭导航'></a></em>").appendTo(slideShow);
	jQuery("<p class='float_menu_box__questionnaire  float_menu_box_nav'><a class='float_menu_box__p__a'><span class='float_menu_box__icon'></span><span class='float_menu_box__text'>问卷调查</span></a></p>").appendTo(imBox);
	jQuery("<p class='float_menu_box__onlineHelp  float_menu_box_nav'><a class='float_menu_box__p__a'><span class='float_menu_box__icon'></span><span class='float_menu_box__text'>在线帮助</span></a></p>").appendTo(imBox);
	var shortCutShow = jQuery("<div class='float_menu_box__shortCutShow'></div>").appendTo(imBox);
	jQuery("<p class='float_menu_box__shortcut  float_menu_box_nav'><a class='float_menu_box__p__a'><span  class='float_menu_box__icon'></span><span class='float_menu_box__text'>快捷功能</span></a></p>").appendTo(shortCutShow);
	var shortCut = jQuery("<div class='float_menu_box__shortcut__stMore' style='display:none;'></div>").appendTo(shortCutShow);
	jQuery("<ul><li class='float_menu_box__slideShow_li'><a class='float_menu_box_slideShow_li_a float_menu_box_design' title='点击进入快捷菜单项'>[&nbsp;设置&nbsp;]</a></li></ul>").appendTo(shortCut);
	this.shortMainData = jQuery("<ul class='float_menu_box__shortcut__stMore__ul'></ul>").appendTo(shortCut);
	var skin = jQuery("<div class='float_menu_box__skinContainer'></div>").appendTo(imBox);
	jQuery("<p class='float_menu_box__skin  float_menu_box_nav'><a class='float_menu_box__p__a'><span class='float_menu_box__icon'></span><span class='float_menu_box__text'>设置换肤</span></a></p>").appendTo(skin);
	this.mainSkin = jQuery("<div class='float_menu_box__skin__stMore' style='display:none;'></div>").appendTo(skin);
	this.mainSkinData = jQuery("<ul class='float_menu_box__skin__stMore__ul'></ul>").appendTo(this.mainSkin);
	var layout = jQuery("<div class='float_menu_box__layoutContainer'></div>").appendTo(imBox);
	jQuery("<p class='float_menu_box__layout  float_menu_box_nav'><a class='float_menu_box__p__a'><span class='float_menu_box__icon'></span><span class='float_menu_box__text'>设置布局</span></a></p>").appendTo(layout);
	this.mainLayout = jQuery("<div class='float_menu_box__layout__stMore' style='display:none;'></div>").appendTo(layout);
	this.mainLayoutData = jQuery("<ul class='float_menu_box__layout__stMore__ul'></ul>").appendTo(this.mainLayout);
	jQuery("<p class='float_menu_box__returnTop  float_menu_box_nav'><a class='float_menu_box__p__a'><span  class='float_menu_box__icon'></span><span class='float_menu_box__text'>回顶部</span></a></p>").appendTo(imBox);
	jQuery(document).ready(function(){
		var setTimeVal;//定时器变量声明
		jQuery(".float_menu_box").bind("mouseenter",function(){
			clearTimeout(setTimeVal);
			jQuery(".float_menu_box").animate({right:0},500);
		}).bind("mouseleave",function(){
			var oc = jQuery(".float_menu_box__slideShow__stMore").css("display");
			var oc1 = jQuery(".float_menu_box__shortcut__stMore").css("display");
			var oc2 = jQuery(".float_menu_box__layout__stMore").css("display");
			var oc3 = jQuery(".float_menu_box__skin__stMore").css("display");
			if(oc == 'none' && oc1 == 'none' && oc2 == 'none' && oc3 == 'none'){
				setTimeVal = setTimeout(function(){
					jQuery(".float_menu_box").animate({right:-72},500);
				},500);
			}
		});
		var setTimeoutVal;//定时器变量声明
		//门户地图绑定单机事件
		jQuery(".miniNav").bind("click",function(){
			clearTimeout(setTimeoutVal);
			var oc = jQuery(".float_menu_box__slideShow__stMore").css("display");
			if(oc == 'none'){
				jQuery(".float_menu_box__slideShow__stMore__ul").empty();
				_self.bldNavContent(menus);
			}else{
				jQuery(".float_menu_box").animate({"top":"35%"},200);
				jQuery(".float_menu_box__slideShow__stMoreClose").css({"display":"none"});
				jQuery(".float_menu_box__slideShow__stMore").hide(300);
				var oc = jQuery(".float_menu_box__shortcut__stMore").css("display");
				setTimeout(function(){
					jQuery(".float_menu_box").animate({right:-72},500);
				},300);
				setTimeoutVal = setTimeout(function(){
					jQuery(".float_menu_box__slideShow__stMore__ul").empty();
				},300);
			}
		});
		//快捷功能绑定单机事件
		jQuery(".float_menu_box__shortcut").bind("click",function(){
			clearTimeout(setTimeoutVal);
			var oc = jQuery(".float_menu_box__shortcut__stMore").css("display");
			if(oc == 'none'){
				_self.bldShortContent();
				
			}else{
				jQuery(".float_menu_box").animate({"top":"35%"},200);
				jQuery(".float_menu_box__shortcut__stMoreClose").css({"display":"none"});
				jQuery(".float_menu_box__shortcut__stMore").hide(300);
				setTimeoutVal = setTimeout(function(){
					jQuery(".float_menu_box__shortcut__stMore__ul").empty();
				},300);
			}
		
		});
		//设置布局注册点击事件 
		jQuery(".float_menu_box__layout").bind("click",function(event){
			clearTimeout(setTimeoutVal);
			var oc = jQuery(".float_menu_box__layout__stMore").css("display");
			if(oc == 'none'){
				_self.bldLayoutContent(_self.layouts);
			}else{
				jQuery(".float_menu_box").animate({"top":"35%"},200);
				jQuery(".float_menu_box__layout__stMore").hide(300);
				setTimeoutVal = setTimeout(function(){
					jQuery(".float_menu_box__layout__stMore__ul").empty();
				},300);
			}
		});
		//设置换肤注册点击事件 
		jQuery(".float_menu_box__skin").bind("click",function(event){
			clearTimeout(setTimeoutVal);
			var oc = jQuery(".float_menu_box__skin__stMore").css("display");
			if(oc == 'none'){
				_self.bldSkinContent(_self.skins);
			}else{
				jQuery(".float_menu_box").animate({"top":"35%"},200);
				jQuery(".float_menu_box__skin__stMore").hide(300);
				setTimeoutVal = setTimeout(function(){
					jQuery(".float_menu_box__skin__stMore__ul").empty();
				},300);
			}
		});
		//返回顶部注册点击事件
		jQuery(".float_menu_box__returnTop").bind("click",function(){
			$('html,body').animate({scrollTop:0},500);
		});
		
		//收起门户地图点击事件
		jQuery(".float_menu_box__slideShow__stMoreClose").bind("click",function(){
			clearTimeout(setTimeoutVal);
			jQuery(".float_menu_box__slideShow__stMore").hide(300);
			jQuery(".float_menu_box__slideShow__stMoreClose").css({"display":"none"});
			jQuery(".float_menu_box").animate({"top":"35%"},300);
			setTimeoutVal = setTimeout(function(){
				jQuery(".float_menu_box__slideShow__stMore__ul").empty();
			},300);
		});
		
		
	});
	imBox.appendTo(jQuery("body"));
};
//获取快捷功能菜单中的数据
rh.ui.floatMenu.prototype._initData = function(){
	return FireFly.byId("SY_ORG_USER_FLOATMENU",System.getVar("@USER_CODE@"));
}
//构建设置布局菜单内容
rh.ui.floatMenu.prototype.bldLayoutContent = function(menus){
	var _self = this;
	jQuery(".float_menu_box").animate({"top":"18%"},300);
	jQuery(_self.shortMainData).empty();
	jQuery(".float_menu_box__slideShow__stMore").hide();
	jQuery(".float_menu_box__slideShow__stMoreClose").hide();
	jQuery(".float_menu_box__shortcut__stMore__ul").empty();
	jQuery(".float_menu_box__shortcut__stMore").hide();
	jQuery(".float_menu_box__skin__stMore__ul").empty();
	jQuery(".float_menu_box__skin__stMore").hide();
	setTimeout(function(){
		jQuery(".float_menu_box__layout__stMore").show();
		for(var i=0;i < menus.length;i++){
			var dsname = menus[i].name;
			var dslength = dsname.length;
			var param = _self._bldDsParam(menus[i].info);
			if(dsname.length > 4) {
				dsname = Format.substr(0,4,dsname);
				dsname += ".."
			}
			var menusItem = jQuery("<li style='padding-left:15px;' class='float_menu_box__slideShow_li'><a class='float_menu_box_layout_li_a' id='"+i+"'>" +dsname + "</a></li>").appendTo(_self.mainLayoutData);
			if(dslength > 4){
				menusItem.attr("title",menus[i].name);
			}
		}
	},100);
	//注册设置布局项点击事件
	jQuery(".float_menu_box_layout_li_a").live("click",function(event){
		var id = jQuery(this).attr('id');
		var pkCode = _self.getPkCode(_self.layouts[id].info);
		var info = _self.layouts[id].info;
		var portalUrl = "SY_COMM_TEMPL.show.do?pkCode=";
		var extendUrl = "&model=edit";
		var url = "";
		if (System.getVar("@USER_PT@").length > 0 && info.indexOf("pt_flag=true") > -1) {
			extendUrl += "&action=copy&type=4&extendType=5";
			url  = portalUrl + System.getVar("@USER_PT@")+extendUrl;
		}else {
			url = _self.layouts[id].info;
		}
		Tab.open({"url":url,"tTitle":menus[id].name,"menuFlag":3,"menuId":menus[id].id});
		event.stopPropagation();
		return false;
	});
}
//构建换肤菜单内容
rh.ui.floatMenu.prototype.bldSkinContent = function(menus){
	var _self = this;
	jQuery(".float_menu_box").animate({"top":"18%"},300);
	jQuery(_self.shortMainData).empty();
	jQuery(".float_menu_box__slideShow__stMore").hide();
	jQuery(".float_menu_box__slideShow__stMoreClose").hide();
	jQuery(".float_menu_box__shortcut__stMore__ul").empty();
	jQuery(".float_menu_box__shortcut__stMore").hide();
	jQuery(".float_menu_box__layout__stMore__ul").empty();
	jQuery(".float_menu_box__layout__stMore").hide();
	setTimeout(function(){
		jQuery(".float_menu_box__skin__stMore").show();
		for(var i=0;i < menus.length;i++){
			var dsname = menus[i].name;
			var dslength = dsname.length;
			var param = _self._bldDsParam(menus[i].info);
			if(dsname.length > 4) {
				dsname = Format.substr(0,4,dsname);
				dsname += ".."
			}
			var menusItem = jQuery("<li style='padding-left:15px;' class='float_menu_box__slideShow_li'><a class='float_menu_box_skin_li_a' id='"+i+"'>" +dsname + "</a></li>").appendTo(_self.mainSkinData);
			if(dslength > 4){
				menusItem.attr("title",menus[i].name);
			}
		}
	},100);
	//注册设置换肤项点击事件
	jQuery(".float_menu_box_skin_li_a").live("click",function(event){
		var id = jQuery(this).attr("id");
		var paramArr = menus[id].info;
		var pkCode = _self.getPkCode(paramArr);
		var aa = _self._bldBoxHtml();
        //调用通用组件
        var temp = new rh.ui.pop({"id":"stylebox","pHandler":_self,"title":"风格定义"});
        temp.render(); 
        _self.dia = temp.display(aa);
        _self._bldBottomPannelLayout(pkCode);
		event.stopPropagation();
		return false;
	});
}
//获得门户pkcode
rh.ui.floatMenu.prototype.getPkCode = function (param){
	var arr = param.split("?")[1].split("&");
	var pkCodes = arr[arr.length-1].split("=");
	return pkCodes[1];
}
//构建快捷功能项菜单内容
rh.ui.floatMenu.prototype.bldShortContent = function(){
	var _self = this;
	var ids = _self._initData();
	if(ids.COMS_ID){
		var comsIds = ids.COMS_ID.split(",");
		var comsNames = ids.COMS_NAME.split(",");
	}
	jQuery(_self.shortMainData).empty();
	jQuery(".float_menu_box__slideShow__stMore").hide();
	jQuery(".float_menu_box__slideShow__stMoreClose").hide();
	jQuery(".float_menu_box__layout__stMore__ul").empty();
	jQuery(".float_menu_box__layout__stMore").hide();
	jQuery(".float_menu_box__skin__stMore__ul").empty();
	jQuery(".float_menu_box__skin__stMore").hide();
	jQuery(".float_menu_box").animate({"top":"18%"},300);
	setTimeout(function(){
		jQuery(".float_menu_box__shortcut__stMore").show();
		if(ids.COMS_ID){
			for(i=0;i<comsIds.length;i++){
				var dsname = comsNames[i];
				var dslength = dsname.length;
				if(dsname.length > 4) {
					dsname = Format.substr(0,4,dsname);
					dsname += ".."
				}
				var menusItem = jQuery("<li class='float_menu_box__slideShow_li'><a class='float_menu_box_shortcut_li_a' name='" + comsNames[i] + "' id='"+comsIds[i]+"'>" +dsname + "</a></li>").appendTo(_self.shortMainData);
				if(dslength > 4){
					menusItem.attr("title",comsNames[i]);
				}	
			}
		}
		//注册菜单点击事件
		jQuery(".float_menu_box__slideShow_li").bind("click",function(){
			var uls = jQuery(this).next(".float_menu_box__slideShow_ul");
			var icon = jQuery(this).children(".float_menu_box_icon");
			if(uls.css("display") == "none"){
				icon.removeClass("float_menu_box_icon_close").addClass("float_menu_box_icon_open");
				uls.show();
			}else{
				icon.removeClass("float_menu_box_icon_open").addClass("float_menu_box_icon_close");
				uls.hide();
			}
		});
		jQuery(".float_menu_box__shortcut__stMoreClose").css({"display":"block"});
	},100);
	//组件列表设置按钮点击事件
	jQuery(".float_menu_box_design").bind("click",function(){
		var comsIds = ids.COMS_ID||"";
		Tab.open({"url":"SY_COMM_TEMPL_COMS_DSLOC.list.do?ids="+comsIds,"tTitle":"组件设置","menuFlag":3});
	});
	//注册快捷功能项点击事件
	jQuery(".float_menu_box_shortcut_li_a").live("click",function(event){
		var pk = jQuery(this).attr('id');
		var name = jQuery(this).attr('name');
		Tab.open({'url':"/sy/comm/home/portalComView.jsp?model=view&id=" + pk,'tTitle':"预览[" + name + "]",'menuFlag':3});
		event.stopPropagation();
		return false;
	});
}
//得到显示参数
rh.ui.floatMenu.prototype._bldDsParam = function(param){
	var pArr = param.split("?");
	if(pArr[1] != undefined){
		pArr = pArr[1].split("&");
		if(pArr[0] != undefined){
			pArr = pArr[0].split("=")[1];
			return pArr;
		}else {
			return "";
		}
	}else {
		return "";
	}
}
//构建门户地图项菜单内容
rh.ui.floatMenu.prototype.bldNavContent = function(menus){
	var _self = this;
	jQuery(".float_menu_box__shortcut__stMore__ul").empty();
	jQuery(".float_menu_box__shortcut__stMore").hide();
	jQuery(".float_menu_box__layout__stMore__ul").empty();
	jQuery(".float_menu_box__layout__stMore").hide();
	jQuery(".float_menu_box__skin__stMore__ul").empty();
	jQuery(".float_menu_box__skin__stMore").hide();
	jQuery(".float_menu_box").animate({"top":"18%"},300);
	setTimeout(function(){
		jQuery(_self.main).show();
		var pids = {};
		for(i=0;i<menus.length;i++){
			var dsname = menus[i].name;
			var dslength = dsname.length;
			if(dsname.length > 4) {
				dsname = Format.substr(0,4,dsname);
				dsname += ".."
			}
			if(menus[i].pid){
				var pmenu = menus[i].pid;
				var pid = pmenu.id;
				if(pids[pid] == 'true'){
					var menusItem = jQuery("<li style='padding-left:15px;' class='float_menu_box__slideShow_li'><a class='float_menu_box_slideShow_li_a' id='"+i+"'>" + dsname + "</a></li>").appendTo("." + pid);
					if(dslength > 4){
						menusItem.attr("title",menus[i].name);
					}
				}else{
					pids[pid] = 'true';
					jQuery("<li class='float_menu_box__slideShow_li'><a id='" + i + "'>" + pmenu.name + "</a><span class='float_menu_box_icon_close float_menu_box_icon'></span></li>").appendTo(_self.mainData);
					var pm = jQuery("<ul class='float_menu_box__slideShow_ul " + pid + "'></ul>").appendTo(_self.mainData);
					var menusItem = jQuery("<li style='padding-left:15px;' class='float_menu_box__slideShow_li'><a class='float_menu_box_slideShow_li_a' id='"+i+"'>" + dsname + "</a></li>").appendTo(pm);
					if(dslength > 4){
						menusItem.attr("title",menus[i].name);
					}
				}
				
			}else{
				var menusItem = jQuery("<li class='float_menu_box__slideShow_li'><a class='float_menu_box_slideShow_li_a' id='"+i+"'>" +dsname + "</a></li>").appendTo(_self.mainData);
				if(dslength > 4){
					menusItem.attr("title",menus[i].name);
				}
			}
			
		}
		//注册菜单点击事件
		jQuery(".float_menu_box__slideShow_li").bind("click",function(){
			var uls = jQuery(this).next(".float_menu_box__slideShow_ul");
			var icon = jQuery(this).children(".float_menu_box_icon");
			if(uls.css("display") == "none"){
				icon.removeClass("float_menu_box_icon_close").addClass("float_menu_box_icon_open");
				uls.show();
			}else{
				icon.removeClass("float_menu_box_icon_open").addClass("float_menu_box_icon_close");
				uls.hide();
			}
		});
		jQuery(".float_menu_box__slideShow__stMoreClose").css({"display":"block"});
	},100);
	//注册菜单项点击事件
	jQuery(".float_menu_box_slideShow_li_a").live("click",function(){
		var id = jQuery(this).attr('id');
		var selectVal = menus[id].type;
		var menu = menus[id].menu;
		if(selectVal == 2){//菜单类型为链接
			if(menu == 1){
				Tab.open({"url":menus[id].info,"tTitle":menus[id].name,"menuFlag":1,"menuId":menus[id].id});	
			}else if(menu == 3){
				Tab.open({"url":menus[id].info,"tTitle":menus[id].name,"menuFlag":3,"menuId":menus[id].id});
			}else if(menu == 5){
				window.open(menus[id].info,menus[id].name);
			}else if(menu == 6){
				window.open(menus[id].info,"maxwindow");
			}
		}else if(selectVal == 1){//菜单类型为服务
			Tab.open({"url":menus[id].info+".list.do","tTitle":menus[id].name,"menuFlag":menu,"menuId":menus[id].id});
		}else if(selectVal == 4){
			_viewer.listBarTipError("节点菜单不能预览");
		}else if(selectVal == 3){//菜单类型为JS
			eval(menus[id].info);
		}
	});
}

/**
 * 构造风格样式设置弹出框
 */
rh.ui.floatMenu.prototype._bldBoxHtml = function() {
	var appboxHtml = '';
	appboxHtml =    '<div id="portalSetting">';
	appboxHtml +=       '<span id="portalSettingMsg"></span>';    
	appboxHtml +=       '<div id="bar" class="" >'; 
	appboxHtml +=         '<span id="btnAllSet" title="设定系统的风格" class="rhDesk-btn icon-dialog-all">门户样式</span>';
	appboxHtml +=         '<span class="rhDesk-btn-line"></span>';
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

/*
 * 构造风格定义面板
 */
rh.ui.floatMenu.prototype._bldBottomPannelLayout = function(pkCode) {
	var _self = this;
	//初始化内容
	var container = jQuery("#rh-slideStyle-box");
	jQuery("#rhStyle-allDom-div").empty();
	var portal = "";
	for(var i=0;i<_self.portalStyles.length;i++){
		if(pkCode == _self.portalStyles[i].PT_ID){
			portal = _self.portalStyles[i];
			break;
		}
	}
	var portalAll = {
			"sonclass":"rh-slideStyle-all"
	};
	var ptArr = portal.PT_STYLE.split(",");
	var ptStyleArr = portal.PT_STYLE__NAME.split(",");
	var chidArr = [];
	if(portal.PT_STYLE != ""){
		for(var i =0;i<ptArr.length;i++){
			var temp = {};
			temp["title"] = ptStyleArr[i];
			temp["portalStyle"] = ptArr[i];
			chidArr.push(temp);
		}
	}
	portalAll["chid"] = chidArr;
	if(typeof portalAll != undefined){
		var sonClass = portalAll.sonclass;
		var div = jQuery("<div></div>").addClass("");
		jQuery.each(portalAll.chid,function(y,m) {
			var cont = jQuery("<div class='rh-slideStyle-all-container'></div>").appendTo(div);
			var span = jQuery("<span></span>").addClass("rh-slideStyle-all").addClass(sonClass);
			span.attr("portalStyle",m.portalStyle);
			span.attr("title","单击设定 " + m.title);
			span.appendTo(cont);
			jQuery("<img width='330px' height='200px' src='" + FireFly.getContextPath() + "/sy/theme/default/images/body/thumbnail/"+m.portalStyle+".png'/>").appendTo(span);
			jQuery("<div class='rh-slideStyle-all-title'>" + m.title + "</div>").appendTo(cont);
		})
		div.appendTo(jQuery("#rhStyle-allDom-div"));
	}
	//绑定事件
	jQuery("#btnAllSet").click(function(event) {//整体风格
         _self._activeTab(jQuery(this));
        var _display = $("#rhStyle-allDom").css("display");
        if(_display == "none"){
           $(".rh-deskDom").hide();
           $("#rhStyle-allDom").show();
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
		   var stylePortal = jQuery(this).attr("portalStyle");
		   var portals = StrToJson(_self.datas.SS_STYLE_PORTAL);
		   if(typeof portals == 'undefined'){
			   portals = {};
		   }
		   portals[pkCode] = stylePortal;
		   _self.datas.SS_STYLE_PORTAL = JsonToStr(portals);
		   var data = {"SS_STYLE_PORTAL":_self.datas.SS_STYLE_PORTAL}//菜单颜色
		   var res = confirm("页面将会重新加载并应用样式，是否继续?");
		   if (res === true) {
			   _self._styleSave(data, true);
			   $("#homeTabs").find("li>a").attr("pkCode",pkCode);
			   $("#homeTabs").find("li>a").click();
		   }
	});
	jQuery("#btnAllSet").click();
};
rh.ui.floatMenu.prototype._activeTab = function (obj) {
	jQuery(".rh-dialog-con-right").show();
	jQuery(".rhDesk-btnActive").removeClass("rhDesk-btnActive ");
    jQuery(".rhDesk-lineActive").removeClass("rhDesk-lineActive ");
 	obj.addClass("rhDesk-btnActive");
 	obj.next().addClass("rhDesk-lineActive");
};
/*
 * 风格样式保存
 */
rh.ui.floatMenu.prototype._styleSave = function(opts,refreshFlag) {
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
};
