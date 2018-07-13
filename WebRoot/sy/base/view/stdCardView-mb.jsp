<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--StdCardView-mb.jsp列表页面-->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.rh.core.serv.ServMgr" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>手机功能卡片页面</title>
    <%@ include file= "inHeader-mb.jsp" %>
    <script type="text/javascript" src="/sy/base/frame/coms/DatePicker/WdatePicker.js"></script>
</head>
<%
String sId = request.getParameter("sId");
String pkCode = request.getParameter("pkCode");
if (pkCode == null) {
	pkCode = "";
}
String readOnly = request.getParameter("readOnly");
if (readOnly == null) {
	readOnly = "";
}
String source = request.getParameter("source");
if (source == null) {
	source = "";
}
String platform = RequestUtils.getStr(request,"platform");
//装载服务定义
Bean servBean = ServMgr.servDef(sId);
String servDef = JsonUtils.toJson(servBean,false);
%>
<body class="mbCard-body">
</body>
<script type="text/javascript">
var __serv_def = <%=servDef%>;
(function() {
    jQuery(document).ready(function(){
        var act = UIConst.ACT_CARD_MODIFY;
        var pkCode = "<%=pkCode%>";
        if (pkCode == null || (pkCode == "null") || (pkCode.length == 0)) {
	        act = UIConst.ACT_CARD_ADD;
	        pkCode = "";
        }
	    var temp = {"act":act,"sId":"<%=sId%>","readOnly":"<%=readOnly%>","pCon":jQuery("body"),
	    		"source":"<%=source%>","platform":"<%=platform%>","servDef":__serv_def};
	    temp[UIConst.PK_KEY] = pkCode;
	    System.setMB("mobile",true);
	    var cardView = new mb.vi.cardView(temp);
	    cardView.show();
	    if (Browser.versions().mobile) {
		    window.addEventListener("load", function() { setTimeout(hideURLbar, 0); }, false);
		    function hideURLbar(){
		      window.scrollTo(0,1);
		    }
	    }
    });
})();
</script>
</html>