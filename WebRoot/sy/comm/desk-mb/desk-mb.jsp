<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--PortalDesk.jsp首页面-->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<%
    final String CONTEXT_PATH = request.getContextPath();
	String source = RequestUtils.getStr(request, "source");//来源是哪
%>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>图标化首页</title>
    <%@ include file= "/sy/base/view/inHeader-mb.jsp" %>
    <script type="text/javascript" src="<%=CONTEXT_PATH %>/sy/comm/desk-mb/js/mbDeskView.js"></script>
    <%
    if (source.equals("app")) {
    %>
    <script type="text/javascript" charset="utf-8" src="<%=CONTEXT_PATH %>/sy/comm/desk-mb/js/cordova.js"></script>
    <script type="text/javascript" charset="utf-8" src="<%=CONTEXT_PATH %>/sy/comm/desk-mb/js/statusbarnotification.js"></script>
	<%
		}
	%>
</head>
<body id="mbDesk-body">

</body>

<script type="text/javascript">
 var deskView = new mb.vi.deskView({"id":"rh","topBarFlag":true});
 deskView.show();
 if (Browser.versions().mobile) {
	 window.addEventListener("load", function() { setTimeout(hideURLbar, 0); }, false);
	 function hideURLbar(){
	 window.scrollTo(0,1);
	 }
 }
 </script>
</html> 