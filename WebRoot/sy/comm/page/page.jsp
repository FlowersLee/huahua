<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--page.jsp 平台page页面-->
<%@ page import="com.rh.core.base.Context" %>
<%@ page import="com.rh.core.util.Lang" %>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>集成平台</title>
    <%@ include file= "/sy/base/view/inHeader.jsp" %>
    <script type="text/javascript" src="<%=urlPath%>/sy/base/frame/engines/rhPageView.js"></script>
    <script type="text/javascript" src="<%=urlPath %>/sy/base/frame/coms/rh.ui.floatMenu.js"></script>
</head>
<%
  if (request.getQueryString() != null) {
	  request.getSession().setAttribute("GOTO_URL", request.getRequestURI().toString() + "?" + request.getQueryString());
  } else {
	  request.getSession().setAttribute("GOTO_URL", request.getRequestURI().toString());
  }
  // 如果没有登录则导向首页去登录
  if(userBean == null) {
	 String loginUrl = Context.getSyConf("SY_LOGIN_URL","/");
	 RequestUtils.sendDisp(request, response, loginUrl);
  }
  String func = RequestUtils.getStr(request,"func");
  String todoServId = RequestUtils.getStr(request,"todoServId");
  String todoUrl = RequestUtils.getStr(request,"todoUrl");
  String todoTitle = RequestUtils.getStr(request,"todoTitle");
  String servPk = RequestUtils.getStr(request,"servPk");
  String openTab = RequestUtils.getStr(request,"openTab");//扩展打开的tab参数
  if (openTab.indexOf("nohex") == -1) {
	  openTab = new String(Lang.hexToStr(openTab));
  }
  String rhClient = RequestUtils.getStr(request,"rhClient");//是否小桌面跳转
  
  String rhDevFlag = request.getParameter("rhDevFlag");
  String homeConfig = null;
  if (rhDevFlag != null && rhDevFlag.equalsIgnoreCase("true")) { 
  } else {
	  homeConfig = Context.getSyConf("SY_HOME_CONFIG",null);//首页的参数定义信息
  }
  
  String bannerConfig = Context.getSyConf("SY_BANNER_CONFIG","");//banner的配置信息
  boolean wbimFlag = Context.getSyConf("SY_WBIM_FLAG", false);//即时通讯是否启用
  Bean homeTabColorBean = JsonUtils.toBean(Context.getSyConf("SY_TAB_COLOR","{'1':{'li':'lightBlueLi','a':'lightBlueA'}}")).getBean("1");//默认tab颜色配置
  Bean bannerBean = JsonUtils.toBean(bannerConfig);
  String banner = urlPath + bannerBean.get("banner","");
  String bannerBack = urlPath + bannerBean.get("bannerBack","");
  String bannerTabBack = urlPath + bannerBean.get("bannerTabBack","");
  
  // 取得默认打开的Tab
  String defaultTab =  Context.getSyConf("SY_DEFAULT_TAB","");
  List<Bean> tabList = JsonUtils.toBeanList(defaultTab);
%>  
<%
if (wbimFlag) {//即时通讯模块所需文件引用%>
    <script src='<%=urlPath%>/sy/plug/webim/scripts/strophe.js'></script>
    <script src='<%=urlPath%>/sy/plug/webim/scripts/flXHR.js'></script>
    <script src='<%=urlPath%>/sy/plug/webim/scripts/strophe.flxhr.js'></script>
    
    <script src='<%=urlPath%>/sy/plug/webim/scripts/iso8601_support.js'></script>
    <script src='<%=urlPath%>/sy/plug/webim/scripts/strophe.rsm.js'></script>
    <script src='<%=urlPath%>/sy/plug/webim/scripts/strophe.archive.js'></script>
    <script src='<%=urlPath%>/sy/plug/webim/scripts/strophe.hismsg.js'></script>
    <script src='<%=urlPath%>/sy/plug/webim/scripts/strophe.recentcontact.js'></script>
  
  <!-- suport file upload -->  
  <script type="text/javascript" src="<%=urlPath%>/sy/base/frame/coms/file/swfupload.js"></script>
  <script type="text/javascript" src="<%=urlPath%>/sy/base/frame/coms/file/js/swfupload.queue.js"></script>
  <script type="text/javascript" src="<%=urlPath%>/sy/base/frame/coms/file/js/fileprogress.js"></script>
  <script type="text/javascript" src="<%=urlPath%>/sy/base/frame/coms/file/js/handlers.js"></script>
  <link rel="stylesheet" type="text/css" href="<%=urlPath%>/sy/plug/webim/chat/webim.css"/>
  <script type="text/javascript" src="<%=urlPath%>/sy/plug/webim/chat/rhWbimView.js"></script>
<%}%>
<%
if ((bannerTabBack.length() > 0) && (!bannerTabBack.equals(urlPath))) {%>
<style type="text/css">
#homeTabs .ui-widget-header {background:white url(<%=bannerTabBack %>) left top repeat-x;}
</style>
<%}%>
<style type="text/css">
#banner {background:url(<%=bannerBack %>) left top;}
.banner-logo {background:url(<%=banner %>) left top no-repeat;}
</style>
<body class="pageBody">
<div id="pageBody-container" class="pageBody-container">
<div id="banner" style="text-align:center;height:45px;">
 <div id="logo" class="banner-logo" style="width:100%;height:45px;float:left;"></div>
 <div id="rh-slideMsg" class="rh-slideMsg"></div><!-- 消息下拉面板 -->
</div>
<div id="homeTabsULFill" class="homeTabsULFill"></div>
<div id="homeTabs"><!--Begin homeTabs -->
    <%
      if (homeConfig != null) {%>
      	<ul class="tabUL">
		</ul>
    <%
      } else {%>
		<ul class="tabUL">
		<%
			int size = tabList.size();
			if (size > 0) {
				for (int i = 0; i < size; i++) {
					Bean tab = tabList.get(i);
					String tabId = tab.getStr("TAB_ID");
					String tabName = tab.getStr("TAB_NAME");
			%>
				<li class="<%=homeTabColorBean.getStr("li") %> replaceLi platformPage" pretabid="<%=tabId%>"><a class="<%=homeTabColorBean.getStr("a") %> rh-open-default" title="<%=tabName%>" href='#<%=tabId%>'><span><%=tabName%></span></a></li>
			<%					
				}
			%>
			</ul> 
			<%
				for (int j = 0; j < size; j++) {
					Bean tab = tabList.get(j);
					String tabId = tab.getStr("TAB_ID");
			%>
			<div id='<%=tabId%>'></div>
			<%
				}
			} else {
			%>
			<li class="<%=homeTabColorBean.getStr("li") %> replaceLi platformPage" pretabid='platformPage'><a class="<%=homeTabColorBean.getStr("a") %> rh-open-default" title="信息平台" href='#platformPage'><span>信息平台</span></a></li>
			</ul>
			<div id='platformPage'></div>	
			<%
			}
			%>
    <%      
      }
    %>
</div><!-- End homeTabs -->  
<div id="homeMenu" style="display:none;"></div>
<div id="rh-slideStyle" class="rh-slideStyle"><!--Begin 风格面板 -->
	  <div class="rh-slideStyle-content" style="">
	     <div id="rh-slideStyle-box" class="rh-slideStyle-box"></div>
	  </div>
</div><!-- End 风格面板 -->
</div>
</body>
<script type="text/javascript">
//设置cookie
document.cookie="RhClientLogin=true";
//设置参数
var topAlert = System.getVar("@C_SY_TOP_ALERT@") || "false";//顶部消息面板是否启用
var styleDef = System.getVar("@C_SY_STYLE_DEF@") || "";//样式默认定义
var pageTitle = System.getVar("@C_SY_PAGE_TITLE@") || System.getVar("@CMPY_NAME@") + "集成平台";//页面的浏览器标题
var mbLink = System.getVar("@C_SY_MB_LINK@") || "false";//banner的配置信息
var pwdFlag = System.getVar("@C_SY_PWD_SHOW@") || "true";//密码修改是否显示
var preDeptUser = System.getVar("@C_SY_PRE_DEPT_USER@") || "";//用户名前缀显示的部门
var tabColor = System.getVar("@C_SY_TAB_COLOR@") || "";//tab的颜色配置信息
var wbimFlag = System.getVar("@C_SY_WBIM_FLAG@") || "false";//即时通讯是否启用
document.title = pageTitle;
var opts = {"id":"rhHome","styleDef":styleDef,"topPannel":topAlert,"wbimFlag":wbimFlag,"rhClient":"<%=rhClient%>",
		"mbLink": mbLink,"tabColor":tabColor,"pwdFlag":pwdFlag,"preDeptUser":preDeptUser};
if (<%=homeConfig%> != null) {//首页的配置
	opts["home"] = <%=homeConfig%>;
}
if ("<%=func%>" === "openTodo") {//自动进入待办的配置
    opts["openTodo"] = {"todoServId":"<%=todoServId%>","todoUrl":"<%=todoUrl%>","todoTitle":"<%=todoTitle%>","servPk":"<%=servPk%>"};
}
opts["openTab"] = "<%=openTab%>";
opts["defaultTab"] = "<%=defaultTab%>";
var pageView = new rh.vi.pageView(opts);
pageView.show();
//外部rh桌面调用
function client_pageFunc () {
	jQuery("#rh-slideMsgBtn").click();
};
//外部rh桌面调用取代办数量
function client_TodoCount () {
	var res = Todo.getCount();
	if (res) {
	    return res;
	} else {
		return "";
	}
};
</script>
</html>