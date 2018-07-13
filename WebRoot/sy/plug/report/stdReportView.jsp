<%@page import="com.rh.core.util.JsonUtils"%>
<%@page import="com.rh.core.util.Constant"%>
<%@page import="com.rh.core.serv.ServMgr"%>
<%@page import="com.rh.core.base.Bean"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>报表服务</title>
<%@ include file= "/sy/base/view/inHeader.jsp" %>

<link rel="stylesheet" type="text/css" href="<%=urlPath%>/sy/plug/report/mask/jquery.loadmask.css" />
<script type="text/javascript" src="<%=urlPath%>/sy/plug/report/mask/jquery.loadmask.min.js"></script>
<script type="text/javascript" src="<%=urlPath%>/sy/plug/report/rh.vi.reportView.js"></script>
<script type="text/javascript" src="<%=urlPath%>/sy/plug/report/rh.ui.reportSearch.js"></script>

<%
	String reportCode = request.getParameter("code");
	Bean report = ServMgr.act("SY_PLUG_REPORT", ServMgr.ACT_BYID, new Bean().setId(reportCode));
	String reportJson = JsonUtils.toJson(report, false);
%>

<script type="text/javascript">
	GLOBAL.setFrameId('<%=reportCode%>-show-do-tabsIframe');
	$(document).ready(function(){
		var report = '<%=reportJson%>';
		report = eval('(' + report + ')');
		var cardView = new rh.vi.reportView({
				'REPORT_CODE' : report.SERV_ID,
				'REPORT_NAME' : report.SERV_NAME,
				'REPORT_FILE_NAME' : report.TABLE_VIEW == '' ? report.SERV_ID : report.TABLE_VIEW,
				'REPORT_TYPE' : report.TABLE_ACTION,
				'REPORT_TYPE__NAME' : report.TABLE_ACTION__NAME,
				'PDF_ABLE' : report.SERV_DICT_CACHE,
				'EXCEL_ABLE' : report.SERV_SQL_ORDER,
				'OPEN_TYPE' : report.SERV_PAGE_COUNT
			});
		cardView.show();
	});
</script>
</head>
<body  class="bodyBack bodyBackPad bodyBack-white" style="scroll:yes">


</body>
</html>