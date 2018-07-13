<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.rh.core.base.Bean,com.rh.core.util.Constant"%>
<%@ page import="com.rh.core.util.JsonUtils"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <%@ include file= "/sy/base/view/inHeader.jsp" %>
	<script type="text/javascript" src="<%=request.getContextPath()%>/sy/base/frame/jquery-1.8.2.min.js"></script>
</head>
<body class="bodyBack" style="overflow-x:hidden">
<div id="viewdiv" align="center"></div>
<script type="text/javascript">
	function loadJS(js) {
		jQuery.ajax({
		    url: "<%=request.getContextPath()%>" + js,
		    type: "GET",
		    dataType: "text",
		    async: false,
		    data: {},
		    success: function(data){
		        var a = document.createElement("script");
		        a.type = "text/javascript" ;
		        a.text = data;
		        document.getElementsByTagName("head")[0].appendChild(a);
		    },
		    error: function(){}
		});
	}
	var data = <%=JsonUtils.toJson((Bean)request.getAttribute(Constant.RTN_DISP_DATA))%>;
	document.title = data.DV_NAME;
	loadJS("/sy/util/chart/highcharts.js");
	loadJS("/sy/comm/dataview/js/hchart.js");
	HChart.render("viewdiv", data);
</script>
</body>
</html>