<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--mbContractSelectView.jsp列表页面-->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<%@ page import="com.rh.core.serv.ServMgr" %>
<%@ page import="com.rh.core.base.Bean" %>
<%@ page import="com.rh.core.util.JsonUtils" %>
<%@ page import="com.rh.core.base.Context" %>
<%
	String frameId = RequestUtils.getStr(request,"frameId");
	String sId = RequestUtils.getStr(request,"sId");
	String extWhere = RequestUtils.getStr(request,"extWhere");
	String parWhere = RequestUtils.getStr(request,"parWhere");
	String type = RequestUtils.getStr(request,"type");
	String source = RequestUtils.getStr(request,"source");//2种：app、web
	String platform = RequestUtils.getStr(request,"platform");//2种：Android、Apple
	String area = RequestUtils.getStr(request,"area");
	//装载服务定义
%>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title><%=Context.getSyConf("SY_CARD_TITLE","功能卡片页面")%></title>
    <%@ include file= "/sy/base/view/inHeader-mb.jsp" %>
    <link rel="stylesheet" type="text/css" href="<%=urlPath %>/sy/theme/default/page-mb.css"/>
    <link rel="stylesheet" type="text/css" href="<%=urlPath %>/sy/theme/default/common_mb.css" /> 
    <%
    if (source.equals("app") && (platform.length() > 0)) {
    %>
    
	<%
	}
	%>
	<script type="text/javascript" src="js/mb.ui.contractSelect.js"></script>
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
</head>
<body class="bodyBack bodyBackPad <%=platform%>" style="background-color:#EFEFEF;">
</body>
<input type="hidden" id="viewPage" value="list"/>
<script type="text/javascript">
<%
if(userBean != null) {
%>
try{
} catch (e) {}
(function() {
    jQuery(document).ready(function(){
      var temp = {"pCon":jQuery("body"),"source":"<%=source%>","platform":"<%=platform%>"};
      if ("<%=source%>" == "app") {
    	  temp["area"] = "list";
      }
      //初始化列表view
      var select = new mb.ui.contractSelect(temp);
      select.render();
    });
})();
<%
} else {
%>
    FireFly.jumpToIndex();
<%
}
%>
</script>
</html>