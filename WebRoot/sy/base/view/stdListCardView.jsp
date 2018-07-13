<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--StdListCardView.jsp列表页面-->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<%@ page import="com.rh.core.util.RequestUtils" %>
<%@ page import="com.rh.core.serv.ServMgr" %>
<%@ page import="com.rh.core.base.Bean" %>
<%@ page import="com.rh.core.util.JsonUtils" %>
<%@ page import="com.rh.core.base.Context" %>
<%@ page import="com.rh.core.util.Constant"%>
<%@ page import="com.rh.core.util.var.VarMgr"%>
<%@ page import="com.rh.core.org.UserBean" %>
<%
	String urlPath = request.getContextPath();
	UserBean userBean = Context.getUserBean(request);
	String frameId = RequestUtils.getStr(request,"frameId");
	String sId = RequestUtils.getStr(request,"sId");
	String extWhere = RequestUtils.getStr(request,"extWhere");
	String parWhere = RequestUtils.getStr(request,"parWhere");
	String type = RequestUtils.getStr(request,"type");
	String source = RequestUtils.getStr(request,"source");//2种：app、web
	String platform = RequestUtils.getStr(request,"platform");//2种：Android、Apple
	String version = RequestUtils.getStr(request,"version");//
	String area = RequestUtils.getStr(request,"area");
	//装载服务定义
%>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title><%=Context.getSyConf("SY_CARD_TITLE","功能卡片页面")%></title>
    <link rel="stylesheet" type="text/css" href="<%=urlPath %>/sy/theme/default/page-mb.css"/>
    <link rel="stylesheet" type="text/css" href="<%=urlPath %>/sy/theme/default/common_mb.css" /> 
	<%
    if (source.equals("note")) {
    %>
     <style type="text/css">
		.rhGridSimple__nav {display:none;}
		.rhGridSimple ul,.rhGridCard ul {margin-top:16px;}
     </style>
	<%
	}
	%>
	<script type="text/javascript">
		var FireFlyContextPath = "<%=urlPath%>";//虚拟路径
	</script>
	<script type="text/javascript" src=""></script>
</head>
<body id="body" class="bodyBack bodyBackPad <%=platform%>">
<!-- 加载图标 -->
<div id='mbLoader' class='mbLoader'><span class='mbLoader-icon'></span></div>
<!-- 头部导航条 -->
<div id="mbContainer" class='rhGridCardContainer' style="width:100%;">
	<div id='home_con' class="rhGridSimple rhDisplayView">
		<div id='home_nav' class='rhGridSimple__nav'>
		   <div class='rhGridSimple__nav__title'>企信<span id='rhGridSimple__nav__count'></span></div>
		   <div id='home_nav_search' style='right:10px;' class='mbDesk-topBar-btn mbDesk-topBar-search'></div>
		</div>
	</div>
</div>
<!-- 底部导航条 -->
<div class='mbBotBar mbCard-btnBar' style="width:100%;">
	<div class='mbBotBar-con' id='CON_cochat'>
		<div class='mbBotBar-node mbBotBar-nodeActive' id='cochat'>
			<div class='mbBotBar-node-icon mb-btn-qichat'></div>
			<div class='mbBotBar-node-text'> 企信 </div>
		</div>
	</div>
	<div class='mbBotBar-con' id='CON_contract'>
		<div class='mbBotBar-node mbBotBar-node-extend' id='contract'>
			<div class='mbBotBar-node-icon mb-btn-contract'></div>
			<div class='mbBotBar-node-text'> 通讯录 </div>
		</div>
	</div>
	<div class='mbBotBar-con' id='CON_discover'>
		<div class='mbBotBar-node' id='discover'>
			<div class='mbBotBar-node-icon mb-btn-discover'></div>
			<div class='mbBotBar-node-text'> 发现 </div>
		</div>
	</div>
	<div class='mbBotBar-con' id='CON_me'>
		<div class='mbBotBar-node' id='me'>
			<div class='mbBotBar-node-icon mb-btn-me'></div>
			<div class='mbBotBar-node-text'> 我  </div>
		</div>
	</div>
</div>
</body>
<input type="hidden" id="viewPage" value="list"/>
<!-- 后置js加载区 -->
<script type="text/javascript" src="<%=urlPath %>/sy/base/frame/jquery-1.8.2.min.js"></script>

<script type="text/javascript" src="<%=urlPath %>/sy/base/frame/platform.js"></script>
<script type="text/javascript" src="<%=urlPath %>/sy/base/frame/tools.js"></script>
<script type="text/javascript" src="<%=urlPath %>/sy/base/frame/constant.js"></script>
<%
if (source.equals("app") && (platform.length() > 0)) {
  	if (platform != null && platform.equals("iphone")) {
  	   if (version.equals("7.0")) {
  	   %>
  		<script type="text/javascript" charset="utf-8" src="<%=urlPath %>/sy/comm/mb/js/phonegap3.1_iphone.js"></script>
  	   <%
  	   } else {
  	   %>
  		<script type="text/javascript" charset="utf-8" src="<%=urlPath %>/sy/comm/desk-mb/js/cordova2.8_iphone.js"></script>
  		<script type="text/javascript" charset="utf-8" src="<%=urlPath %>/sy/comm/desk-mb/js/cordova.LocalNotification_iphone.js"></script>
  	<%   
  	   }
  	} else {
  	%>
  		<script type="text/javascript" charset="utf-8" src="<%=urlPath %>/sy/comm/desk-mb/js/cordova.js"></script>
   		<script type="text/javascript" charset="utf-8" src="<%=urlPath %>/sy/comm/desk-mb/js/statusbarnotification.js"></script>
   		<script type="text/javascript" charset="utf-8" src="<%=urlPath %>/sy/comm/desk-mb/js/childbrowser.js"></script>
  	<%	
   	}
}
%>
<script type="text/javascript" src="<%=urlPath %>/sy/base/frame/coms/rh.ui.gridCard.js"></script>
<script type="text/javascript" src="<%=urlPath %>/sy/comm/mb/js/socket.io/socket.io.js"></script>
<script type="text/javascript" src="<%=urlPath %>/sy/comm/mb/js/socket.io/moment.min.js"></script>
<script type="text/javascript">
<%
if(userBean != null) {
%>
try{
	<%
	//用户相关信息、系统配置信息、日期相关信息
    String sysParams = JsonUtils.mapsToJson(VarMgr.getOrgMap(), VarMgr.getConfMap(), VarMgr.getDateMap());
	%>
	var sysVarParasStr = <%=sysParams%>;
	var loginName = "<%=userBean.getLoginName()%>";
	
	System.setVars(sysVarParasStr);
} catch (e) {}
(function() {
    jQuery(document).ready(function(){
      var temp = {"pCon":jQuery("body"),"source":"<%=source%>","platform":"<%=platform%>"};
      if ("<%=source%>" == "app") {
    	  temp["area"] = "list";
      }
      var area = "<%=area%>";
      if (area.length > 0) {
    	  temp["area"] = area;
      }
      //初始化列表view
      var gridCardView = new rh.ui.gridCard(temp);
      gridCardView.render();
      window.gridCardView = gridCardView;
  	  window.onload=function(){
  		setTimeout(function() {
  			window.scrollTo(0, 1);
  		}, 0);
  	  };
    });
})();
<%
} else {
%>
    FireFly.jumpToIndex();
<%
}
%>
function onPhotoURISuccess(imageURI) {
	gridCardView.onPhotoURISuccess(imageURI);
};
function onPhotoDataSuccess(imageData) {
	var src = "data:image/jpeg;base64," + imageData;
	gridCardView.onPhotoURISuccess(src);
};
var fixNum = 0;
function onPhotoURISuccessFix(imageURI) {
	if (fixNum == 0) {
		fixNum++;
		gridCardView.onPhotoURISuccess(imageURI);
	} else if (fixNum == 1) {
		fixNum = 0;
		return true;
	}
};
function onMapSuccess(pos) {
	gridCardView.onMapSuccess(pos);
};
</script>
<script type="text/javascript" src="<%=urlPath %>/sy/comm/desk-mb/js/mbDeskView.js"></script>
</html>