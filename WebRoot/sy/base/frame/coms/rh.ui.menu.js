GLOBAL.namespace("rh.ui");
/**
 *  菜单系统变量对象
 */
var Menu = {
    tempLeaf : {},//所有工作台图标的对象集合
    _normalArray : [],//码头图标数组
	normal : "",//码头图标的字符串形式
    _deskShowArray : [],//第一次打开桌面的常用图标
    deskShow : "",//第一次打开桌面的常用图标的字符串形式
    alertJson : {},//启用提醒的图标
    _folderJson : {},//文件夹图标 
    minBlockJson : {},//文件夹内小图标
    floatShow:[],//浮动图标关系对象集合
    /**
     * 浮动菜单关系的存储格式
     * 例:{"id":{"id":"","name":"","type":"","info","","dsname","","pid",{"id":"","name":"","type":"","info":"","dsname":"","pid":{...}}}}
     */
    floatMenus : {},
    /**
     * 收起左侧菜单
     */
    closeLeftMenu : function() {
    	var obj = parent.jQuery(".leftMenu-close");
    	if (!obj.hasClass("leftMenu-expand")) {
    		parent.jQuery(".leftMenu-close").click();
    	}
    },
    /**
     * 展开左侧菜单
     */
    expandLeftMenu : function() {
    	var obj = parent.jQuery(".leftMenu-close");
    	if (obj.hasClass("leftMenu-expand")) {
    		parent.jQuery(".leftMenu-close").click();
    	}
    },
    /**
     * 链接类菜单的点击
     * @param menuItem 菜单对象
     */
    linkNodeClick : function(menuItem) {
    	var url = Tools.systemVarReplace(menuItem.INFO);
        if (url.indexOf("http://") == 0) {// 外部链接打开
        	if (url.indexOf("target=blank") > 0 || menuItem.MENU == 6) {//浏览器新tab打开
        		window.open(url,"maxwindow");
        	} else if (menuItem.MENU == 5) {// 5为新浏览器页面打开
        		RHWindow.openWindow(url);
        	}
        } else {
    		if (menuItem.MENU == 5) {// 新页面打开
    			if (url.indexOf("/") == 0) {// 以"/"开头
    				url = FireFly.getHttpHost() + FireFly.contextPath + url;
    			} else {
    				url = FireFly.getHttpHost() + FireFly.contextPath + "/" + url;
    			}
    			RHWindow.openWindow(url);
    		} else {// Tab页打开
    	        	url = FireFly.getContextPath() + "/" + url;//内部链接
    	        	var opts = {"url":url,"tTitle":menuItem.NAME,"menuId":menuItem.ID,"act":"link","menuFlag":menuItem.MENU};
    	        	Tab.open(opts);
    		}
        	
		}
    }
};
/**
 *  菜单组件 
 */
rh.ui.menu = function(options) {
	var defaults = {
		"id":"",
		"pCon":null,
		"pId":"",
		"menuData":""
	};
	this._opts = jQuery.extend(defaults,options);	
	this.topFlag = "1";
	this.noTopFlag = "2";
};
/*
 * 渲染菜单主方法
 */
rh.ui.menu.prototype.render = function(menuFlag) {
	var datas = FireFly.getMenu().TOPMENU;
	if (menuFlag == 1) {//顶部菜单
		//return this._init(datas,this.topFlag);		
	} else if (menuFlag == 2) {//左侧菜单
		if (datas) {
			return this._initLeftMenu(datas,this.topFlag);		
		} 
	}
};
/*
 * 定位菜单并高亮
 * @param topLi 菜单的li对象
 */
rh.ui.menu.prototype._blurSelect = function(topLi) {
	var _self = this;
	blurSelect(topLi);
};
/*
 * 初始化左侧菜单递归方法
 * @param datas 菜单数据
 * @param topFlag 顶级菜单标识
 */
rh.ui.menu.prototype._initLeftMenu = function(datas,topFlag) {
	var _self = this;
	var mainUl = jQuery("<ul></ul>").addClass("leftMenu-ul");
	jQuery.each(datas,function(i,n) {
		if (n.CHILD) {//法务管理
	    	if (n.TYPE == 4) {//节点
	    		if(n.AREA.indexOf("3") >= 0){
	    			_self._addDeskIcons(n);
	    		}
	    	    var topId = n.ID;
			    jQuery.each(n.CHILD,function(t,m) {  //构造标题
			    	if (m.VIRTUAL == 1) {
			    		return true;
			    	}
		    	    if (m.CHILD) {
		    	    	//增加工作台图标至系统变量
		    	    	_self._addDeskIcons(m);
						var h3 = jQuery("<h3></h3>").attr("id",m.ID).attr("topId",topId).attr("icon",m.ICON);
				    	var temp = jQuery("<label></label>").addClass("leftMenu-title-label").append(m.NAME);
				    	h3.addClass("leftMenu-title").append(temp);
				    	h3.appendTo(mainUl);
				       	mainUl.append(_self._initTitleNextUL(m,topId));
		    	    } else {
						var h3 = jQuery("<h3></h3>").attr("id",m.ID).attr("topId",topId).attr("titId",m.ID).attr("icon",m.ICON);
						var temp = jQuery("<label></label>").addClass("leftMenu-title-label").addClass("leftMenu-title-label-link").append(m.NAME);
						if (m.TYPE == 1) {//服务
					    	temp.bind("click",function() {
						    	var opts = {"url":m.INFO + ".list.do","tTitle":m.NAME,"menuId":m.ID};
						    	Tab.open(opts);
					    	});
					    	n["TOPID"] = n.ID;	 
				    	} else if (m.TYPE == 2) {//链接
				    		temp.bind("click",function() {
				    			Menu.linkNodeClick(m);	
					    	});	
					    	m["TOPID"] = n.ID;	 
				    	} else if (m.TYPE == 3) {//js
				    		temp.bind("click",function() {
				    			var js = m.INFO;
				    			eval(js);
				    			return false;
				    		});
				    	} else if (m.TYPE == 5) {//搜索框
				    		temp = jQuery("<input class='leftMenu-title--searchInput' type='text' id='" + n.ID + "'></input>");
				    		temp.keydown(function(event) {
				    			 if (event.keyCode == '13') {
				    				var servIds = m.INFO;
				    				var filterStr = "[";
				    				var servArray = servIds.split(",");
				    				jQuery.each(servArray,function(i, n) {
				    					var filter ={};
				    					filter["id"]= "service";
				    					filter["data"]= n;
				    					filterStr += jQuery.toJSON(filter) + ",";
				    				});
				    				filterStr += "]";
				    				var keywords = jQuery(this).val();
				    				keywords = encodeURIComponent(keywords);
				    				var opts = {"sId":"SEARCH-RES","tTitle":"搜索","url":"/SY_PLUG_SEARCH.query.do?data={'KEYWORDS':'" + keywords + "','FILTER':" + filterStr +"}","menuFlag":3};
				    				Tab.open(opts);
				    			}
				    			event.stopPropagation();
				    			return false;
				    	    });
					    	h3.addClass("leftMenu-title--search");
				    	}
				    	h3.addClass("leftMenu-title").addClass("leftMenu-only-title").append(temp);
				    	h3.appendTo(mainUl); 
				    	mainUl.append(jQuery("<ul></ul>").addClass("leftMenu-ul").addClass("leftMenu-ul-title"));	
				    	//增加工作台图标至系统变量
				    	_self._addDeskIcons(m);
	    	        }
		    	});
	    	} 
	    } 
	});	
	return mainUl;
};
rh.ui.menu.prototype._initTitleNextUL = function(m,topId) {//构造标题的下面ul
	var _self = this;
	var mainUl = jQuery("<ul></ul>").addClass("leftMenu-ul");
    if (m.CHILD) {
    	 jQuery.each(m.CHILD,function(i,f) {  
	    	if (f.VIRTUAL == 1) {
	    		return true;
	    	}
    		_self._bldNodeLi(f,topId,m.ID,mainUl);
    	});	
    }
    return mainUl;
};
/*
 * 构造二级及三级的节点
 * @param n 节点返回数据
 * @param topId 顶级菜单的id
 * @param titId 次顶级菜单id
 * @param mainUl 外出的UL对象
 */
rh.ui.menu.prototype._bldNodeLi = function(n,topId,titId,mainUl) {
	var _self = this;
	var topLi = jQuery("<li></li>").addClass("leftMenu-li");
	if (mainUl) {
		topLi.appendTo(mainUl);
	} else {
		topLi.addClass("leftMenu-li-leafli");
	}
    var servMenu = [];
    var tempA = jQuery("<a></a>").attr("id",n.ID).attr("infoId",Tools.rhReplaceId(n.INFO)).attr("topId",topId).attr("titId",titId).attr("menuSId",n.INFO.split(".")[0]).append(n.NAME);
    tempA.appendTo(topLi);
    if (n.TYPE == 1) {//服务
    	topLi.bind("click",function() {
	    	var opts = {"url":n.INFO + ".list.do","tTitle":n.NAME,"menuId":n.ID};
	    	Tab.open(opts);
    		_self._blurSelect(topLi);
    	});
    	n["TOPID"] = topId;	 
    	topLi.attr("tip",n.TIP);
    	//增加工作台图标至系统变量
    	_self._addDeskIcons(n);
	} else if (n.TYPE == 2) {//链接
		topLi.bind("click",function() {
			Menu.linkNodeClick(n);
    	});	
    	n["TOPID"] = topId;	 
    	topLi.attr("tip",n.TIP);
    	//增加工作台图标至系统变量
    	_self._addDeskIcons(n);
	} else if (n.TYPE == 3) {//js
		topLi.bind("click",function() {
			var js = n.INFO;
			eval(js);
			return false;
		});
	} else if (n.TYPE == 4) {//节点
    	//增加工作台图标至系统变量
    	_self._addDeskIcons(n);
		topLi.addClass("leftMenu-nodeLi");	
		jQuery("<span class='leftMenu-moreNav'>&nbsp;&nbsp;</span>").appendTo(topLi);
		topLi.bind("click",function() {
			var nodeUl = jQuery(this).next().first();
			var span = jQuery(this).find(".leftMenu-moreNav");
			if (span.hasClass("leftMenu-nodeUl-hide")) {
				nodeUl.hide();
				span.removeClass("leftMenu-nodeUl-hide");
			} else {
				nodeUl.show();
				span.addClass("leftMenu-nodeUl-hide");
			}
    	});	
    	if (n.CHILD) {
    		var leafUl = jQuery("<ul></ul>").addClass("leftMenu-ul").appendTo(mainUl);
    		leafUl.addClass("leftMenu-nodeUl");
			leafUl.addClass("leftMenu-nodeUl-hide");
			leafUl.hide();
    		jQuery.each(n.CHILD,function(t,p) {
	    		leafUl.append(_self._bldNodeLi(p,topId,titId));
    		})
    	} else {
    		var leafUl = jQuery("<ul></ul>").addClass("leftMenu-ul").appendTo(mainUl);
    		leafUl.addClass("leftMenu-nodeUl");
			leafUl.addClass("leftMenu-nodeUl-hide");
			leafUl.hide();
    	}
	}
	return topLi;
};
/*
 * 添加一个工作台菜单至工作台图标
 * @param menuItem 菜单对象
 */
rh.ui.menu.prototype._addDeskIcons = function(menuItem) {
	var _self = this;
	var area = menuItem.AREA;//显示类型：只有显示类型含桌面的才会在桌面图标导航中显示
	var type = menuItem.TYPE;
	if (area.indexOf("2") >= 0) {//1.普通菜单 2.桌面图标 3.浮动图标 4.手机图标
		var temp = {};
		temp["ID"] = menuItem.ID;//菜单ID
		temp["ICON"] = menuItem.DSICON || 'xitong'; //显示图标
		temp["NAME"] = menuItem.DSNAME; //显示名称
		temp["MENU"] = menuItem.MENU;//打开带菜单?
		temp["COUNTSERV"] = menuItem.TODO;//启用提醒?
		temp["MENUID"] = menuItem.ID; //菜单的id
		temp["LEAF"] = menuItem.INFO; //菜单info
		temp["TYPE"] = menuItem.TYPE;//菜单类型 1:服务 2:链接 3:js 4:节点
		temp["FOLDER"] = menuItem.FOLDER;//是否文件夹集合图标
		temp["MINBLOCK"] = "";//文件夹下的子图标
		temp["ALERTSERV"] = menuItem.ALERT;//提醒对应的服务
		if (temp["FOLDER"] == 1) {//启用文件夹图标
			Menu._folderJson[menuItem.ID] = menuItem.ID;
		} else if (menuItem.PID && Menu._folderJson[menuItem.PID]) {//文件夹内小图标
			var str = jQuery.trim(Menu.tempLeaf[menuItem.PID]["MINBLOCK"]);
			if (str.length > 0) {
				var minBlock = str.split(",");
				minBlock.push(menuItem.ID);
				Menu.tempLeaf[menuItem.PID]["MINBLOCK"] = minBlock.join(",");
			} else {//第一次
				Menu.tempLeaf[menuItem.PID]["MINBLOCK"] = menuItem.ID;
			}
			Menu.minBlockJson[menuItem.ID] = temp;//文件夹内小图标单独存放
			return;
		}
		if (menuItem.NORMAL == 1) {//码头图标，1:启用
			Menu._normalArray.push(menuItem.ID);
			Menu.normal = Menu._normalArray.join(",");
		} else if (menuItem.NORMAL == 3) {//第一次的桌面显示图标
			Menu._deskShowArray.push(menuItem.ID);
			Menu.DeskShow = Menu._deskShowArray.join(",");			
		}
		if (menuItem.TODO == 1) {//启用提醒，1:启用
			Menu.alertJson[menuItem.ID] = menuItem.ID;
		}
		Menu.tempLeaf[menuItem.ID] = temp; //所有的叶子节点-文件夹内小图标
	}
	if(area.indexOf("3") >= 0){
		var temp = {};
		if(type == 4) {
			temp["id"] = menuItem.ID;
			temp["pid"] = menuItem.PID;
			temp["type"] = menuItem.TYPE;//菜单类型
			temp["info"] = menuItem.INFO;//获取菜单信息
			temp["name"] = menuItem.NAME; //获取菜单名
			temp["dsname"] = menuItem.DSNAME;//浮动显示名称
			temp["menu"] = menuItem.MENU;//打开带菜单
			Menu.floatMenus[menuItem.ID] = temp;
		}else {
			temp["id"] = menuItem.ID;
			temp["type"] = menuItem.TYPE;//菜单类型
			temp["info"] = menuItem.INFO;//获取菜单信息
			temp["name"] = menuItem.NAME; //获取菜单名
			temp["dsname"] = menuItem.DSNAME;//浮动显示名称
			temp["menu"] = menuItem.MENU;//打开带菜单
			if(Menu.floatMenus[menuItem.PID]){
				temp["pid"] = Menu.floatMenus[menuItem.PID];
			}
			Menu.floatShow.push(temp);
		}
	}
};