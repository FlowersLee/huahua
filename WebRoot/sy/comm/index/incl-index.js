/**
 * 系统登录验证管理类
 * @param {} id
 * @param {} pswds
 */
var LogMgr = function(id, pswds, cmpyCode, cmpyName) {
    var resultMsg = "";
    this.userId = id;
    this.userPasswords = pswds;
    this.checkLogin = function() {
        var msg = "正在进行登录验证，请稍候...";
        jQuery("#msg").html(msg);
        if (cmpyName.length == 0 || cmpyCode.length == 0) {
            jQuery("#CMPY_CODE__NAME").focus();
            msg = "公司不能为空，请输入";
            jQuery("#msg").html(msg);
            return;
        }
        if (id.length == 0) {
            jQuery("#USER_CODE").focus();
            msg = "账号不能为空，请输入";
            jQuery("#msg").html(msg);
            return;
        }
        if (pswds.length == 0) {
            jQuery("#USER_PASSWORDS").focus();
            msg = "密码不能为空，请输入";
            jQuery("#msg").html(msg);
            return;
        }
        //var pswdsBase64 = jQuery.base64.decode(pswds);
        var params = {};
        if (jQuery("#USER_LAST_CLIENT").length == 1) {
        	params["USER_LAST_CLIENT"] = jQuery("#USER_LAST_CLIENT").val();
        	params["USER_LAST_OS"] = jQuery("#USER_LAST_OS").val();
        	params["USER_LAST_PCNAME"] = jQuery("#USER_LAST_PCNAME").val();
        	params["USER_LAST_BROWSER"] = jQuery("#USER_LAST_BROWSER").val();
        }
        var resultData = FireFly.login(id, pswds, cmpyCode,params);
        //如果data中有exception属性，那么说明ajax出错了。
        if (resultData.exception) {
            jQuery.messager.alert("系统登录出错", resultData["msg"]);
        } else {
		       if (resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
		    	    //桌面系统交互
		    	    rhClientLoginCookieSet();
	                msg = "验证通过，正准备进入系统......";
	                //记住用户名和密码
	                remLoginCookie();
	                jQuery("#msg").css("color","green");
	                jQuery("#msg").html(msg);
	                var homeUrl = FireFly.getContextPath() + "/sy/comm/page/page.jsp";
	                if (jQuery("#rhClient").length == 1) {
	                	homeUrl += "?rhClient=true";
	                }
	                var mbIndex = jQuery("#mbIndex");
	                if (mbIndex && mbIndex.val() == "true") {
	                	var redirect = jQuery("#redirect").val();
	                	homeUrl = FireFly.getContextPath() + "/sy/comm/desk-mb/desk-mb.jsp";
	                	if (redirect) {
	                		homeUrl = redirect;
	                	}
	                	Tools.redirect(FireFly.getContextPath() + homeUrl);
	                	return false;
	                }
	                var rhDevIndex = jQuery("#rhDevIndex");
	                if (rhDevIndex && rhDevIndex.val()) {//如果从系统开放登录页登录，则默认进入工作台
	                    var rhDevFlag = rhDevIndex.val();
	                    if (homeUrl.indexOf("?") > 0) {
	                    	homeUrl += "&rhDevFlag=";
	                    } else {
	                    	homeUrl += "?";
	                    	homeUrl += "rhDevFlag=";
	                    }
	                    homeUrl += rhDevFlag;
	                }
	                //判断屏幕可用大小与登录窗口之间的差，如果差值大于100，则打开一个最大化窗口(非最大化窗口存在问题：登录系统后，窗口最大化，页面下方存在大量空白区域)
	                if((window.screen.availWidth - jQuery(window).width()) > 100
	                		&& (window.screen.availHeight-jQuery(window).height()) > 100 && (jQuery("#rhClient").length == 0)){
	                	openMaxedWindow(homeUrl);
	                } else {
	                	setTimeout(function() {
	                		Tools.redirect(homeUrl);
	                	},100);
	                }
			    } else if (resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_ERR) == 0) {
	                var msg = resultData[UIConst.RTN_MSG];
	                msg = msg.substring(6);
	                Cookie.del(id);
	                jQuery("#USER_PASSWORDS").unbind("focus");
	                jQuery("#msg").html(msg);
	                jQuery("#msg").append("  请重新输入!");
	                if (jQuery("#source").val() == "app") {
	                	window.history.go(-1);
	                }
			    } 
        }
    };
};
/**
 * 打开一个最大化窗口
 * @param url
 */
function openMaxedWindow(url){
    var screenWidth = screen.availWidth, screenHeight = screen.availHeight;
    var args = "width="+screenWidth+",height="+screenHeight+"toolbar=no, menubar=no, scrollbars=yes,resizable=yes,location=no, status=no";       
    //打开全屏的新窗口
    var win = window.open(url,"_blank",args);
    if(win){
    	win.moveTo(0,0);
        win.outerWidth = screenWidth;
        win.outerHeight = screenHeight;
    }
    //关闭父窗口
    window.opener = null;
    window.open('','_self');
    window.close();
}
/**
 * 初始化登录页面
 */
function loginInit() {
    //
    jQuery("#USER_CODE").val("");
    jQuery("#USER_PASSWORDS").val("");
    var curDate = new Date();
    //
    jQuery("#USER_CODE").keypress(function(e){
        if (e.keyCode == "13") {
            jQuery("#USER_PASSWORDS").focus();
        }
    });
    jQuery("#USER_PASSWORDS").keypress(function(e){
        if (e.keyCode == "13") {
            doLogin();
            e.preventDefault();
        }
    });
    //给按钮绑定事件
    jQuery("#btnLogin").bind("click", doLogin);
    jQuery("#btnCancel").bind("click", doCancel);
    jQuery("#USER_CODE").focus(function(){//用户名获取焦点
    	if (isMbLogin(jQuery(this))) {
    		return true;
    	}
	   showLoginuser();
	});
	jQuery("#USER_CODE").blur(function(){//失去焦点时
		if (isMbLogin(jQuery(this))) {
    		return true;
    	}
      fillLoginpsd();
      jQuery("#loginUserList").fadeOut("fast");
	});
	jQuery("#USER_CODE").keyup(function(event) {//键盘按键up时
		if (isMbLogin(jQuery(this))) {
    		return true;
    	}
	   if ((event.keyCode != "40") && (event.keyCode != "38")) {
         showLoginuser(jQuery(this).val());
       }
	});
    jQuery("#USER_PASSWORDS").focus(function(){//密码框获取焦点时
    	if (isMbLogin(jQuery(this))) {
    		return true;
    	}
	    fillLoginpsd();
	});
	//鼠标焦点定位到用户账号输入框
	//jQuery("#USER_CODE").focus();
	//默认填充第一个用户名和密码
	defaultFill();
	//绑定公司选择页面
	cmpySelect();
	//记住密码的点击事件
	remLabelClick();
	//判断浏览器类型和版本（如果是IE6（或以下）不支持）
	browserCheck();
}
/**
 * 初始化登录页面
 */
function loginInit_mb(autoLogin,userCode,pwd,cmpyCode,cmpyName) {
    //给按钮绑定事件
    jQuery("#btnLogin").bind("click", doLogin);
    jQuery("#btnCancel").bind("click", doCancel);
	//默认填充第一个用户名和密码
	defaultFill();
	//绑定公司选择页面
	cmpySelectMb();
	//记住密码的点击事件
	remLabelClick();
	
	//自动登录
	if (autoLogin && autoLogin === "true") {
		//填充公司、用户、密码
	    jQuery("#CMPY_CODE").val(cmpyCode); 
		jQuery("#USER_CODE").val(userCode); 
		jQuery("#USER_PASSWORDS").val(pwd); 
		jQuery("#CMPY_CODE__NAME").val(cmpyName);
		if ((jQuery("#USER_CODE").val().length > 0) && (jQuery("#USER_PASSWORDS").val().length > 0)) {
			jQuery("#btnLogin").click();
		}
	}
}
/**
 * 记住密码的label点击事件
 */
function remLabelClick() {
	jQuery(".loginAuto-lb").bind("click",function() {
		jQuery("#LOGIN_AUTO").click();
	});
}
/**
 * 初始化页面时默认填充用户名、密码和公司编码
 */
function cmpySelect() {
	jQuery("#CMPY_CODE__NAME").click(function(event) {
		var options = {"itemCode":"CMPY_CODE","config":"SY_ORG_CMPY,{'extendDicSetting':{'rhexpand':false}}","parHandler":null,"hide":"explode","show":"blind",replaceCallBack:function(id,value) {
		   jQuery("#CMPY_CODE").val(id); 
		   jQuery("#CMPY_CODE__NAME").val(value); 
		}};
		var dictView = new rh.vi.rhDictTreeView(options);
		dictView.show(event,[event.clientX+110,event.clientY-260]);
		var id = jQuery("#CMPY_CODE").val();
		jQuery(".ui-dialog-title").text("请选择单位");
		dictView.tree.selectNodes([id]);
		dictView.tree.expandParent(id);
		return false;
	});
};
/**
 * 初始化页面时手机版公司绑定处理
 */
function cmpySelectMb() {
	jQuery("#CMPY_CODE__NAME").click(function(event) {
		this.setValue = function(id,name) {
			jQuery("#CMPY_CODE").val(id);
			jQuery("#CMPY_CODE__NAME").val(name);
		};
	    var temp = {"dictId":"SY_ORG_CMPY","pCon":jQuery("body"),"parHandler":this};
	    var selectView = new mb.vi.selectList(temp);
	    selectView._bldWin(event);
	    selectView.show();
		return false;
	});
};
/**
 * 初始化页面时默认填充用户名、密码和公司编码
 */
function defaultFill() {
	//获取用户名
	var userCode = Cookie.get("rhLoginUsers");
	var cmpyCode = Cookie.get("rhCmpyCode");
	var cmpyName = Cookie.get("rhCmpyName");
	if (cmpyCode && cmpyName) {
        jQuery("#CMPY_CODE").val(cmpyCode); 
        jQuery("#CMPY_CODE__NAME").val(cmpyName); 
	}
    if (userCode) { 
	  var temp = userCode.split(",");
	  for (var i = 0; i < temp.length;i++) {
	  	var code = temp[i];
	  	if (code.length > 0) {
		    jQuery("#USER_CODE").val(code); 
		    var pname = "rh_" + code;
  		    var pwd = Cookie.get(pname); 	//获取密码
		    if(pwd){
		    	var pwdBase64 = jQuery.base64.decode(pwd);
		        jQuery("#USER_PASSWORDS").val(pwdBase64); 
		        jQuery("#LOGIN_AUTO").attr("checked","true");
		        jQuery(".pwd_span").text("");
		    }
		    break;
	  	}
	  }
    }
}

/**
 * 登录页面登录按钮click方法
 */
function doLogin() {
	//获取页面上的
	var pwd = jQuery("#USER_PASSWORDS").val();
    var logMgr = new LogMgr(jQuery("#USER_CODE").val(), pwd, jQuery("#CMPY_CODE").val(),jQuery("#CMPY_CODE__NAME").val());
    logMgr.checkLogin();
}

/**
 * 登录页面取消按钮click方法
 */
function doCancel() {
    jQuery("#USER_CODE").val("");
    jQuery("#USER_PASSWORDS").val("");
    jQuery("#msg").empty();
}
//成功登陆后记住用户名、密码
function remLoginCookie(obj) {
  var name = jQuery("#USER_CODE").val();
  var pwd = jQuery("#USER_PASSWORDS").val();
  var pwdBase64 =  jQuery.base64.encode(pwd); 
  var cmpyCode = jQuery("#CMPY_CODE").val();
  var cmpyName = jQuery("#CMPY_CODE__NAME").val();
  var expires = "365";//一年
  var userCode = Cookie.get("rhLoginUsers");
  var cName = name + ",";
  if (userCode) {
	  if (userCode.indexOf(cName) < 0) { //不存在的用户
		  userCode = cName + userCode;
	  } else {
		  userCode = cName + userCode.replace(cName, "");
	  }
  } else {
	  userCode = cName;
  }

  var pname = "rh_" + name;
  Cookie.set("rhLoginUser", name, expires); //保存用户信息
  Cookie.set("rhLoginUsers", userCode, expires); //保存用户信息
  Cookie.set("rhCmpyCode", cmpyCode, expires); //保存用户信息
  Cookie.set("rhCmpyName", cmpyName, expires); //保存用户名称信息
  Cookie.set("rhLoginOK", name, expires); //保存成功登录信息
  if (jQuery("#LOGIN_AUTO").prop("checked")) { //选中自动登录，则保存密码及自动登录标志
	  Cookie.set(pname, pwdBase64, expires);
  } else { //清除密码设置
	  Cookie.set(pname, "", expires);
  }
} 

//填充密码框的值
function fillLoginpsd(){ 
    var name = jQuery("#USER_CODE").val();
    var pname = "rh_" + name;
    var pwd = Cookie.get(pname); 
    if(pwd){ 
    	var pwdBase64 = jQuery.base64.decode(pwd);
        jQuery("#USER_PASSWORDS").val(pwdBase64); 
        jQuery("#LOGIN_AUTO").attr("checked","true");
    } else {
    	jQuery("#USER_PASSWORDS").val(""); 
    	jQuery("#LOGIN_AUTO").removeAttr("checked");
    }
}

//登录用户名列表
function showLoginuser(selVar){ 
  if (selVar == "") {selVar = undefined;}
  var userCode = Cookie.get("rhLoginUsers");
  if(userCode){ 
	  var temp = userCode.split(",");
	  var userDiv = jQuery();
	  if (jQuery("#loginUserList").length == 1) {
	    userDiv = jQuery("#loginUserList").empty();
	  } else {
	    userDiv = jQuery("<div id='loginUserList'></div>");
	  }
	  
	  jQuery.each(temp,function(i,n) {
	    if (selVar && (n.indexOf(selVar) == 0)) { //过滤用户列表
	        var replStr = n.replace(selVar,"<strong>" + selVar + "</strong>");
	        var divT = jQuery("<div></div>").html(replStr).click(function() {
		        jQuery("#USER_CODE").val(n);
		        jQuery(this).parent().fadeOut("fast"); 
		        fillLoginpsd();
	        });
	        divT.appendTo(userDiv);
	    } else if ((selVar == undefined) && (n != "")) { //所有用户列表
	        var divT = jQuery("<div></div>").html(n).click(function() {
	        jQuery("#USER_CODE").val(n);
	        jQuery(this).parent().fadeOut("fast"); 
	        fillLoginpsd();
	      });
	      divT.appendTo(userDiv);
	    }
	  });
	  userDiv.appendTo("#user");
	  userDiv.fadeIn("fast");
	  var hoverD = "";
	  hoverD = jQuery("#loginUserList div").first();
	  jQuery(document).keyup(function(event) {//键盘按键down时 
	       if ((event.keyCode == "40")) {
	           if (jQuery(".divHover").length == 1) {
	             var nowDiv = jQuery(".divHover");
	             var nextDiv = nowDiv.next();
	             if (nextDiv.is("div")) {
	                 nowDiv.removeClass("divHover");
	                 nextDiv.addClass("divHover");
	             }
	           } else {
	             hoverD.addClass("divHover");
	           }
	       }
	       if ((event.keyCode == "38")) {//键盘按键up时 
	           if (jQuery(".divHover")) {
	             var nowDiv = jQuery(".divHover");
	             if (nowDiv.prev().is("div")) {
		             nowDiv.removeClass("divHover");
		             nowDiv.prev().addClass("divHover");
	             }
	           }
	       }
	  });
	  jQuery(document).keydown(function(event) {//选中用户回车 
	       if ((event.keyCode == '13')) {
	            jQuery(".divHover").click();
	       }
	  });
  } 
} 
/**
 * 判断是否是手机登录页面
 */
function isMbLogin(node) {
    if (node.hasClass("mbLogin")) {
  	    return true;
    } else {
    	return false;
    }
}
/**
 * 判断浏览器版本,ie6自动跳转到插件测试页面
 */
function browserCheck() {
	if (jQuery.browser.msie) {//ie系列
		var vers = new Number(jqbrowser.version);
	    if (vers < 7) {
	    	var testUrl = "/sy/index/activeTest.jsp";
            Tools.redirect(testUrl);
	    }
	}
}
/**
 * rh桌面调用登录
 */
function rhClientLogin(cmpyCode,id,pswds) {
    var logMgr = new LogMgr(id, jQuery.base64.decode(pswds),cmpyCode,jQuery("#CMPY_CODE__NAME").val());
    logMgr.checkLogin();
};
/**
 * rh桌面调用登录成功后对cookie的操作
 */
function rhClientLoginCookieSet() {
	document.title = "RhClientLoginOk";
    document.cookie="RhClientLogin=true";
    if (jQuery("#rhClient").length == 1) {
    	jQuery("#logo").hide();
    }
};