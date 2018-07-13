<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--activeTest.jsp 浏览器、flash、系统插件测试页面-->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
final String CONTEXT_PATH = request.getContextPath();
out.println("<div id='preLoad' style='background:yellow url(img/load.gif) no-repeat 33% center;width:100%;height:35px;font-size:14px;line-height:36px;text-align:center;color:red;'>正在下载安装文件，请稍后...</div>");
%>	
<html xmlns="http://www.w3.org/1999/xhtml">
<style type="text/css">
body {background-color:yellow;text-align:center;line-height:28px;font-size:14px;padding:0px;margin:0px;}
.ntkoDiv {background-color:green;}
#ntkoTip {background-color:yellow;font-size:14px;line-height:20px;}
</style>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>NTKO提示页面</title>
    <%@ include file= "/sy/base/view/inHeader.jsp" %>
	<%@ include file= "/sy/util/office/include_NTKO.jsp"%>
</head>
<body>
</body>
<script type="text/javascript">
var obj = document.all("TANGER_OCX");
if (obj) {
	if (obj.Caption == "Office") {//正常安装
	    jQuery("body").html("<div style='background-color:green;width:100%;height:20px;font-size:14px;line-height:15px;text-align:center;color:white;'>已经安装并正确设置NTKO系统插件</div>");
	    parent.jQuery("#rh_test_ntko_iframe").css("background-color","green");
	} else {
	    jQuery("body").html("<div style='margin:0px;padding:0px;width:100%;height:20px;font-size:14px;line-height:15px;text-align:center;color:red;'>未正确加载NTKO系统插件</div>");
	}
} else {
    jQuery("body").html("<div style='margin:0px;width:100%;height:20px;font-size:14px;line-height:15px;text-align:center;color:red;'>未正确加载NTKO系统插件</div>");
}
</script>
</html>


