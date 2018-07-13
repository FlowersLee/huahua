<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--syPie3D.jsp首页面-->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<%
    final String CONTEXT_PATH = request.getContextPath();
%>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>3D饼图示例</title>
    <script type="text/javascript" src="<%=CONTEXT_PATH%>/sy/util/chart/FusionCharts.js"></script>
</head>
<body>
<div id="chartdiv" align="center"></div>
</body>
<%
String xmlStr = "<graph caption='某某公司销售情况' subcaption='上半年销售情况' xAxisName='月份' yAxisName='金额' numberPrefix='RMB' decimalPrecision='0'>"
		+ "<set name='1' value='462' color='AFD8F8' />"
		+ "<set name='2' value='857' color='F6BD0F' />"
		+ "<set name='3' value='671' color='8BBA00' />"
		+ "<set name='4' value='494' color='FF8E46'/>"
		+ "<set name='5' value='761' color='008E8E'/>"
		+ "<set name='6' value='960' color='D64646'/>"
		+ "</graph>";
%>
<script type="text/javascript">
   var chart = new FusionCharts("/sy/util/chart/FCF_Column3D.swf", "ChartId", "400", "350");
   chart.addParam("wmode","opaque");
   chart.setDataXML("<%=xmlStr%>");		
   chart.render("chartdiv");
</script>
</html>