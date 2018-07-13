<%@ page language="java" contentType="text/html; UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.rh.core.wfe.def.MigrateProcData"%>
<%@ page import="com.rh.core.util.RequestUtils"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; UTF-8">
<title>整理流程数据</title>
</head>
<body>
	<table border="0" width="50%">
		<form action="MigrateWfe.jsp" method="post" target="_self">
		<tr>
			<td>公司ID</td>
			<td><input type="text" size="50" name="cmpyID" value="huaxia"></td>
		</tr>
		<tr>
			<td>流程编号</td>
			<td><input type="text" size="50" name="procCode" value=""></td>
		</tr>
		<tr>
			<td>&nbsp;</td>
			<td><input type="submit" value="确定"></td>
		</tr>
		</form>
	</table>
	<%
	    String cmpyID = RequestUtils.getStr(request, "cmpyID");
	    String procCode = RequestUtils.getStr(request, "procCode");
	    if (cmpyID.length() > 0 && procCode.length() > 0) {
	        out.println("<hr width='100%'>");
	        try {
	            MigrateProcData proc = new MigrateProcData();
	            proc.migrate("huaxia", procCode + "@" + cmpyID);
	            
	            out.println("OK");
	        } catch (Exception e) {
	            out.println("Error:" + e.getMessage());
	        }
	    }
	%>
</body>
</html>