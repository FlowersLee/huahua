/** 首页portal用到，用户初始化区块、拖动事件、和后台交互等 --开始*/
var blockArray = {};
function getBlockCon(conObj,params) {
	var ajaxUrl ="SY_PORTAL.portalArea.do";
	jQuery.ajax({
        type:"post",
        url:ajaxUrl,
        dataType:"json",
        data:params,
        cache:false,
        async:false,
        timeout:60000,
        success:function(data) {
          conObj.html(data.AREA);
        },
        error:function(err) {

        }
    });
}
function initArea() {
try{
  if (parent.GLOBAL.style.SS_STYLE_BLOCK) {//区块头
		jQuery(".portal-box .portal-box-title").each(function(i,n) {
			jQuery(n).addClass(parent.GLOBAL.style.SS_STYLE_BLOCK);
		});
  }
  } catch (e) {}
  jQuery(".portal-box .portal-box-con .portal-box-dataurl").each(function(i,n) {
	var urlObj = jQuery(n);
    var conObj = urlObj.parent();
    var conObjParent = conObj.parent();
    var dataUrl = urlObj.text();
    dataUrl = jQuery.trim(dataUrl);
    conObj.attr("dataUrl",dataUrl);
    var params = {};
    params["config"] = dataUrl.substring(2,dataUrl.length-2);
	getBlockCon(conObj,params);
	conObj.refresh = function() {//内容增加刷新方法
		getBlockCon(conObj,params);
	};
	parent.Portal.setBlock(conObjParent.attr("id"),conObj);
	jQuery("tr:odd",jQuery(this)).addClass("rhPortal-trOdd");
  });
  jQuery(".portal-box-hideBtn").bind("click",function() {
  	if (jQuery(this).hasClass("hideFlag")) {
 	  	var box = jQuery(this).parent().parent();
	  	box.css("min-height",box.data("min-hei"));
	  	box.find(".portal-box-con").show(); 	
	  	jQuery(this).removeClass("hideFlag");
	  	jQuery(this).removeClass("conHeanderTitle-close");
  	} else {
	  	var box = jQuery(this).parent().parent();
	  	box.data("min-hei",box.css("min-height"));
	  	box.css("min-height",20);

	  	box.find(".portal-box-con").hide();
  		jQuery(this).addClass("hideFlag");
  		jQuery(this).addClass("conHeanderTitle-close");
  	}
  });
}  
function initPortalAreaMove() {
	 var flag = false;
	 var emptyFlag = false;
	 jQuery('.portal-box').draggable({
	    cursor: "auto",
	    revert:true,
	    zIndex: 2700,
		create:function(event, ui) {
			    	
		},
	    start:function(event, ui){
	    	if (flag == false) {
	    		return false;
	    	}
	    },
	    stop:function(event, ui){
	    }
	});
	jQuery(".portal-target").droppable({
		// 	activeClass: "ui-state-default",
	//   accept: '.portal-box',
       over: function(event, ui) {
           if (jQuery(this).html() == "") {
		      var wid = jQuery(this).width()-30;
		      var tem = jQuery("<div id='lineFlag' class='lineFlag'></div>").width(wid);
		      tem.appendTo(jQuery(this));   
		      emptyFlag = true;           	
           }
       },
	   out: function(event, ui) {
	   	   if (emptyFlag) {
		      jQuery("#lineFlag").remove();  	
	       } 
	   },
	   drop: function(event, ui) {
	       if (emptyFlag) {
		      jQuery("#lineFlag").remove();
		   	  ui.draggable.appendTo(jQuery(this));	     
		   	  setPortalHei(); 	
	       } else {
	       	  emptyFlag = false;      
	       }
	   }
	}).sortable({
		items: ".portal-box",
		revert: true,
		sort: function() {
		}
	});
	 jQuery('.portal-box').droppable({
	   over: function(event, ui) {
	      var wid = jQuery(this).parent().width()-30;
	      var tem = jQuery("<div id='lineFlag' class='lineFlag'></div>").width(wid);
	      tem.insertAfter(jQuery(this));    
	   },
	   out: function(event, ui) {
	      jQuery("#lineFlag").remove();
	   },
	   drop: function(event, ui) {
	   	  jQuery("#lineFlag").remove();
	   	  ui.draggable.insertAfter(jQuery(this));
		  setPortalHei();
		  saveTempl();
	   }
	});
	jQuery('.portal-box').bind("mousedown",function(event) {
	 	if (jQuery(event.target).hasClass("portal-box-title")) {
	 		flag = true;
	 	} else {
	 		flag = false;
	 	}
	});	
}
function saveTempl() {
   var hml = jQuery("body").clone();//原始代码
   jQuery(".portal-box-con",hml).each(function(i,n) {//替换组件
       var area = jQuery(n);
       area.parent().attr("style","");
       area.parent().removeClass("ui-draggable-dragging");
	   area.html(area.attr("dataUrl")); 
   });
   var data = {};
   if (jQuery("body").attr("pk")) {
	   data[UIConst.PK_KEY] = jQuery("body").attr("pk");
   }
   data["PT_CONTENT"] = hml.html();
   data["PT_TYPE"] = ptType;//OA
   data["PT_TITLE"] = ptTitle;
   var resultData = FireFly.doAct("SY_COMM_TEMPL","save",data,false);
   if (resultData[UIConst.RTN_MSG] && resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
	   jQuery("body").attr("pk",resultData[UIConst.PK_KEY]);
   } 
}
function setPortalHei() {
   var hei = GLOBAL.defaultFrameHei;
   jQuery(".portal-target").each(function(i,n) {
   	   if (jQuery(n).height() > hei) {
   	   	 hei = jQuery(n).height();
   	   }
   });
   Tab.setFrameHei(hei);
}
/** 首页portal用到，用户初始化区块、拖动事件、和后台交互等 --结束*/
/** ------------办公portal页面自定义处理 --开始--------------*/
/*
 * 进入待办卡片
 * @param sId 服务ID
 * @param sName 服务名称
 * @param dataId 数据主键
 * @param title 提醒标题
 * @param url 提醒标题
 * @param con 提醒标题
 * @param pkCode 待办主键
 * @param ownerCode 待办人
 * @param todoCatalog 1,待办，2,待阅
 * @param areaId 当前区块id,用于刷新区块
 */
function openTODOCard(sId,sName,dataId,title,url,con,pkCode,ownerCode,todoCatalog,areaId) {
    if (todoCatalog == '2') { //待阅，将其状态改成已办
		var data = {};
		data[UIConst.PK_KEY] = pkCode;
		data["TODO_ID"] = pkCode;
		var res = FireFly.doAct("SY_COMM_TODO","endReadCon",data,false);
		if (res[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
			var con = jQuery("#SY_COMM_TODO_YUE .portal-box-con");
			var params = {};
			var dataUrl = con.attr("dataUrl");
			params["config"] = dataUrl.substring(2,dataUrl.length-2);
			
			getBlockCon(con,params);	
		}
	}

	if (url.indexOf(".showDialog.do") > 0) {
		showRHDialog(title,con,function exeToDo() {
			var data = {};
			data[UIConst.PK_KEY] = pkCode;
			data["TODO_ID"] = pkCode;
			var res = FireFly.doAct("SY_COMM_TODO","endReadCon",data,false);

			if (res[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
				var con = jQuery("#SY_COMM_TODO_REMIND .portal-box-con");
				var params = {};
				var dataUrl = con.attr("dataUrl");
			    params["config"] = dataUrl.substring(2,dataUrl.length-2);
				
				getBlockCon(con,params);
			}
        },this);
	} else if (url.indexOf(".byid.do") > 0) {
	    if(System.getUser("USER_CODE") != ownerCode) { //当前人不是待办人，就是委托的，
		    url = url.substring(0,url.length-1); 
			url += ",_AGENT_USER_:" + ownerCode + "}";
		}
	
		var isProxyUser = false;
		if (System.getUser("USER_CODE") != ownerCode) { // 委托代理
			isProxyUser = true;
		}
		
		var params = {"from":"todo","todo_id":pkCode,"isProxyUser":isProxyUser};
		var options = {"url":sId + ".card.do?pkCode=" + dataId,"tTitle":title,"replaceUrl":url,"areaId":areaId,"menuFlag":4,"params":params};
		Tab.open(options);
	} else {
		var options = {"url":url,"tTitle":title,"replaceUrl":url,"areaId":areaId};
		Tab.open(options);
	}
}

/**
 * 待办1/待阅2，更多
 */
function openMoreTodoListPage(todoCatlog) {
	var strWhere = "";
	var tTitle = "";
	if (todoCatlog == "1") {
	    strWhere = " and (TODO_CATALOG =0 or TODO_CATALOG =1) and (OWNER_CODE='@USER_CODE@' and OWNER_TYPE=1)  or (OWNER_CODE in (@ROLE_CODES@) and OWNER_TYPE=2)";	
		tTitle = "个人待办";
	} else {
	    strWhere = " and TODO_CATALOG =2 and (OWNER_CODE='@USER_CODE@' and OWNER_TYPE=1)  or (OWNER_CODE in (@ROLE_CODES@) and OWNER_TYPE=2)";		
		tTitle = "个人待阅";
	}

	var params = {"extWhere":strWhere};
	
	var opts = {"url":"SY_COMM_TODO.list.do", "tTitle":tTitle, "menuFlag":4, "params":params};
	Tab.open(opts);
}


/**
 * 主办，更多
 */
function openMoreZhubanListPage() {
	var strWhere = " and (OWNER_CODE='@USER_CODE@' and OWNER_TYPE=1)  or (OWNER_CODE in (@ROLE_CODES@) and OWNER_TYPE=2)";
	
	var params = {"extWhere":strWhere};
	
	var opts = {"url":"SY_COMM_ENTITY.list.do", "tTitle":"个人主办", "menuFlag":4, "params":params}
	Tab.open(opts);
}

/**
 * 新闻，更多
 */
function openMoreNews() {
	var opts = {'url':'CM_NEWS_CHNLNEWS.list.do','tTitle':'新闻浏览','menuFlag':4};
	Tab.open(opts);
}

/**
 * 消息提醒，更多
 */
function openMoreRemind() {
	var opts = {'url':'SY_COMM_TODO_REMIND.list.do','tTitle':'消息提醒','menuFlag':4};
	Tab.open(opts);
}

/** ------------办公portal页面自定义处理 --结束--------------*/
	