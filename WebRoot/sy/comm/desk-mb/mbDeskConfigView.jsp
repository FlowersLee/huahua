<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--StdCardView-mb.jsp列表页面-->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<%
    final String CONTEXT_PATH = request.getContextPath();
	String source = RequestUtils.getStr(request, "source");//来源是哪
%>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>桌面图标设置页面</title>
    <%@ include file= "/sy/base/view/inHeader-mb.jsp" %>
    <script type="text/javascript" src="<%=CONTEXT_PATH %>/sy/comm/desk-mb/js/mbDeskConfigView.js"></script>
    <script type="text/javascript" src="<%=CONTEXT_PATH %>/sy/comm/desk/js/jquery.ui.sortable.min.js"></script>
    <script type="text/javascript" src="<%=CONTEXT_PATH %>/sy/comm/desk/js/jquery.ux.simulatemouse.js"></script>
</head>
<%
String dictId = request.getParameter("dictId");

%>
<body class="mbDesk-config-body" style="-webkit-touch-callout:none;">
</body>
<script type="text/javascript">
(function() {
    jQuery(document).ready(function(){
	    var temp = {"pCon":jQuery("body"),"source":"<%=source%>"};
	    var configView = new mb.vi.deskConfig(temp);
	    configView.show();
    });
})();
</script>
</html>