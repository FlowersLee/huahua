<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--StdCardView-mb.jsp列表页面-->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>手机选择列表页面</title>
    <%@ include file= "inHeader-mb.jsp" %>
</head>
<%
String dictId = request.getParameter("dictId");

%>
<body class="mbList-body">
</body>
<script type="text/javascript">
(function() {
    jQuery(document).ready(function(){
	    var temp = {"dictId":"<%=dictId%>","pCon":jQuery("body")};
	    var selectView = new mb.vi.selectList(temp);
	    selectView.show();
    });
})();
</script>
</html>