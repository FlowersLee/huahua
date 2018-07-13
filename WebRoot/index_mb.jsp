<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--index_mb.jsp 平台手机登录页面-->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.rh.core.org.mgr.UserMgr" %>
<%@ page import="com.rh.core.util.RequestUtils" %>
<%-- <%@ page import="com.ruaho.sso.cas.client.PrincipalInfoService" %>--%>
<%@ page import="java.util.Map" %>
<%@ page import="com.rh.core.base.Context" %>
<%@ page import="com.rh.core.comm.ConfMgr" %>
<%@ page import="com.rh.core.org.UserBean" %>
<%
    final String CONTEXT_PATH = request.getContextPath();
	String userCode = RequestUtils.getStr(request, "userCode");//用户编码
	String userAppCode = RequestUtils.getStr(request, "userAppCode");//用户编码
	String cmpyCode = RequestUtils.getStr(request, "cmpyCode");//公司编码
	String cmpyName = RequestUtils.getStr(request, "cmpyName");//公司名称
	String pwd = RequestUtils.getStr(request, "pwd");//用户密码
	String source = RequestUtils.getStr(request, "source");//来源是哪
	String platform = RequestUtils.getStr(request, "platform");//应用平台
	String autoLogin = RequestUtils.getStr(request, "autoLogin");//是否根据本地存储自动登录
%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"/>
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <title>软虹云平台</title>
    <link rel="apple-touch-icon-precomposed" href="/apple-touch-icon-precompose.png"/>
    <link rel="apple-touch-startup-image" href="/apple-touch-startup-image-320x460.png"/>
    <!-- 引用公用头部资源文件：开始 -->
    <%@ include file= "sy/base/view/inHeader-mb.jsp" %>
    <!-- 引用公用头部资源文件：结束 -->
    <link rel="stylesheet" type="text/css" href="<%=CONTEXT_PATH %>/sy/comm/index/incl-index-mb.css" charset="UTF-8"/>
	<script type="text/javascript" src="<%=CONTEXT_PATH %>/sy/comm/index/incl-index.js" charset="UTF-8"></script>
</head>
<body class="<%=autoLogin%>">
<div class="bodyCon">
<%
	boolean flag = (userCode.length() > 1) ? true:false;
    if (flag){
    	userBean = UserMgr.getUser(userCode);
		if(userBean != null) {
			Context.setOnlineUser(request, userBean);
%>
		<script type="text/javascript">
		var homeUrl = "sy/comm/desk-mb/desk-mb.jsp";
		window.location.href = homeUrl;
		</script>	
<%
    	}
	}
%>
<div class="top_logo"></div>
<div id="mbLogin-con" class="mbLogin-con">
     <div id="msg" class="mbLogin-line"></div>
 	 <div id="cmpy" class="mbLogin-line mbLogin-cmpy"><input id="CMPY_CODE" name="CMPY_CODE" type="hidden" class="ipt-t" value=""/>
 	 <input id="CMPY_CODE__NAME" name="CMPY_CODE__NAME" placeholder="公司" type="text" style="background-color:white;font-size:16px;" class="user-input mbLogin-line-div mb-radius-1em mb-box-shadow-inset mb-shadow-5" value='' />
 	 </div>
     <div id="user" class="mbLogin-line mbLogin-user">
        <input id="USER_CODE" name="USER_CODE" placeholder="用户名" class="mbLogin user-input mbLogin-line-div mb-radius-1em mb-box-shadow-inset mb-shadow-5" type="text" value=""/>
     </div>
     <div id="pwd" class="mbLogin-line mbLogin-pwd">
        <span class="pwd_con">
        <input id="USER_PASSWORDS" name="USER_PASSWORDS" placeholder="密码" class="mbLogin pwd-input mbLogin-line-div mb-radius-1em mb-box-shadow-inset mb-shadow-5" type="password" value=""/>
        <span class="pwd_span"></span>
        </span>
     </div>
     <div id="remb" class="mbLogin-line mbLogin-remb" align=center>
        <div class="mbLogin-remb-div mbLogin-line-div mb-radius-1em mb-shadow-5">
	        <label class="loginAuto-lb">记住密码</label>
	        <input id="LOGIN_AUTO" name="LOGIN_AUTO" checked="true" type="checkbox" class="loginAuto-check"/>
        </div>
     </div>
     <div id="submit" class="mbLogin-line mbLogin-submit" align=center>
    	<div class="mbLogin-submit-div mbLogin-line-div">
        	<div id="btnLogin" class="submit">登录</div>
        </div>
     </div>
</div>
<input type="text" id="mbIndex" style="display:none;" value="true"/>
<input type="hidden" id="source" value="<%=source %>"/>

	<div id="mb-taizi" class="mb-taizi">
	</div>
	<div class="footer">
	</div>
</div>
</body>
<script type="text/javascript">
//<input type="hidden" id="redirect" value="sy/base/view/stdListCardView.jsp?source=app&platform=<%=platform%>"/>
    $(function(){
    	var autoLogin = false;
    	if ("<%=autoLogin%>" == "true") {
    		autoLogin = "true";
    	}
        loginInit_mb(autoLogin,"<%=userAppCode%>","<%=pwd%>","<%=cmpyCode%>","<%=cmpyName%>");
    });
</script>
</html>