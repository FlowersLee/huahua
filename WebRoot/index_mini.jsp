<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--index.jsp 平台登录页面-->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.rh.core.org.mgr.UserMgr" %>
<%@ page import="com.rh.core.util.RequestUtils" %>
<%@ page import="java.util.Map" %>
<%@ page import="com.rh.core.base.Context" %>
<%@ page import="com.rh.core.comm.ConfMgr" %>
<%@ page import="com.rh.core.org.UserBean" %>
<%@ page import="com.rh.core.util.Lang" %>

<%
    final String CONTEXT_PATH = request.getContextPath();
	String computerName = RequestUtils.getStr(request,"computerName");
	String osVersion = RequestUtils.getStr(request,"osVersion");
	String ieVersion = RequestUtils.getStr(request,"ieVersion");
	String desktopVersion = RequestUtils.getStr(request,"desktopVersion");
%>	
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>软虹云平台</title>
    <link rel="apple-touch-icon-precomposed" href="/apple-touch-icon-precompose.png"/>
    <link rel="shortcut icon" href="favicon.ico"/>
    <!-- 引用公用头部资源文件：开始 -->
    <%@ include file= "sy/base/view/inHeader.jsp" %>
    <!-- 引用公用头部资源文件：结束 -->
    <link rel="stylesheet" type="text/css" href="<%=CONTEXT_PATH %>/sy/comm/index/incl-index-mini.css" charset="UTF-8"/>
</head>
<body>
<script type="text/javascript" src="<%=CONTEXT_PATH %>/sy/comm/index/incl-index.js" charset="UTF-8"></script>
<script type="text/javascript">
/** 页面初始化方法：开始 */
$(function(){
    if (self.frameElement && self.frameElement.tagName && self.frameElement.tagName == "IFRAME") {
        //self.parent.window.location.href = FireFly.getContextPath();
        
    } else {
        loginInit();
    }
    var temp = document.documentElement.scrollHeight-151;//设置背景高度SY_ORG_CMPY
    jQuery("#logo").height(temp);
    var imgLink = FireFly.getHttpHost() + FireFly.contextPath + "/file?act=qrCode&value=" + FireFly.getHttpHost() + FireFly.contextPath + "&size=150";
    jQuery("#mb-link-img").attr("src",imgLink);
});

</script>
<%
	if(userBean != null) {
%>
		<script type="text/javascript">
		var homeUrl = "sy/comm/page/page.jsp";
		//设置cookie
		document.cookie="RhClientLogin=true";
		window.location.href = homeUrl;
		</script>	
<%
    } else {
%>
<div id="logo">
    <div id="index_mini" class="index_mini">最小化</div><div id="index_close" class="index_close">关闭</div>
    <div id="msg"></div>
    <div id="form" style="position: relative;" class="radius5">
	     <div class="form-title textShadow radius5">请登录</div>
	     <div class="form-con radius3" style="padding:8px;">
	         <table class="form-table">
	            <tr><td>公<span style="padding:0px 6px;"></span>司:</td>
	                <td><div id="cmpy"><input id="CMPY_CODE" name="CMPY_CODE" type="text" class="ipt-t"/><input id="CMPY_CODE__NAME" name="CMPY_CODE__NAME" type="text" class="ipt-t icon-input-cmpy" onfocus="this.className+=' ipt-t-focus icon-input-cmpy'" onblur="this.className='ipt-t icon-input-cmpy'" value='' size='30'/><span class="dict-cmpy"></span></div></td>
	            </tr>
	            <tr><td>用户名:</td>
	                <td><div id="user"><input id="USER_CODE" name="USER_CODE" type="text" class="ipt-t" onfocus="this.className+=' ipt-t-focus'" onblur="this.className='ipt-t'" /></div>
	                </td>
	            </tr>
	            <tr><td>密<span style="padding:0px 6px;"></span>码:</td>
	                <td><div id="pwd"><input id="USER_PASSWORDS" name="USER_PASSWORDS" type="password" class="ipt-t" onfocus="this.className+=' ipt-t-focus'" onblur="this.className='ipt-t'" /></div>
	                </td>
	            </tr>
	         </table>
		         <div id="submit" style="border:0px red solid;margin-top:0px;"><input type="submit" id="btnLogin" class="submit textShadow" title="登录" value="登录" /></div>
		         <div id="remb" style=""><label class="loginAuto-lb">记住密码</label><input id="LOGIN_AUTO" name="LOGIN_AUTO" type="checkbox" class="loginAuto-check"/></div>
		         <div id="auto" style=""><label class="auto-lb">自动登录</label><input id="AUTO_INPUT" name="AUTO_INPUT" type="checkbox" class="auto-check"/></div>
	     </div>
    </div>
</div>
<input type="hidden" id="rhDevIndex" value="true"/>
<input type="hidden" id="rhClient" value="true"/>
<input type="hidden" id="USER_LAST_CLIENT" value="<%=desktopVersion%>"/>
<input type="hidden" id="USER_LAST_OS" value="<%=osVersion%>"/>
<input type="hidden" id="USER_LAST_PCNAME" value="<%=computerName%>"/>
<input type="hidden" id="USER_LAST_BROWSER" value="<%=ieVersion%>"/>
<%
 }
 %>
</body>
<script type="text/javascript">
$(function(){
    jQuery("#index_mini").bind("click",function() {
    	document.title = "RhClientAction_Minimize";
    });
    jQuery("#index_close").bind("click",function() {
    	document.title = "RhClientAction_Close";
    });
    jQuery("#AUTO_INPUT").bind("click",function(event) {
        if (jQuery(this).prop("checked")) { //选中自动登录
        	document.title = "RhClientAction_AutoLogin_YES";
        } else {
        	document.title = "RhClientAction_AutoLogin_NO";
        }
        event.stopPropagation();
    });
});
</script>
</html>

