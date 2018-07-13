<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--StdListView.jsp列表页面-->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.rh.core.base.*" %>
<%@ page import="com.rh.core.util.*" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>功能列表页面</title> 
   <%@ include file= "/sy/base/view/inHeader.jsp" %>
    <script type="text/javascript" src="<%=urlPath%>/sy/base/frame/coms/all/ui.all.js"></script>
 	<link rel="stylesheet" type="text/css" href="<%=urlPath%>/sy/base/frame/coms/all/style.css" />
</head>
<%
String sId = "SY_COMM_SEND_SHOW_CARD";
Bean outBean = (Bean) request.getAttribute(Constant.RTN_DISP_DATA);
Bean bean = outBean.getBean("PARAM_BEAN");
String data = JsonUtils.toJson(bean);
String servId = bean.getStr("SERV_ID");
String dataId = bean.getStr("DATA_ID");
String schemeId = bean.getStr("SCHEME_ID");
String pkCode = servId + dataId;
%>
<body>
<script type="text/javascript">
(function() {
    jQuery(document).ready(function(){
//        var act = UIConst.ACT_CARD_ADD;
//        if ("<%=schemeId%>") {
          act = UIConst.ACT_CARD_MODIFY;
//        }
    	//ACT_LIST_MODIFY   
	    var temp = {"act":act,"sId":"<%=sId%>","replaceUrl":'<%=sId%>.byid.do?data=<%=data%>',"parHandler":null,"parTabClose":"true"};
	    temp[UIConst.PK_KEY] = "<%=pkCode%>";
	    var cardView = new rh.vi.cardView(temp);
	    cardView.show();  
    });
})();
</script>
</body>
</html>