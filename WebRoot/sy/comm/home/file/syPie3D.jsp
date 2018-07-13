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
String xmlStr = "<graph caption='软虹科技' subcaption='某某项目消费情况' xAxisName='分类' yAxisName='金额' numberPrefix='RMB' decimalPrecision='0'>"
		+ "<set name='服务器' value='174400' />"
		+ "<set name='软件资源' value='128100' />"
		+ "<set name='人力情况' value='221800' />"
		+ "<set name='其它' value='232800' /></graph>";
%>
<script type="text/javascript">
   var chart = new FusionCharts("/sy/util/chart/FCF_Pie3D.swf", "ChartId", "400", "350");
   chart.addParam("wmode","opaque");
   chart.setDataXML("<%=xmlStr%>");		
   chart.render("chartdiv");
</script>
</html>