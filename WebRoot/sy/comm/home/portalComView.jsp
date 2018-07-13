<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--portalComView.jsp首页面-->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<%
    final String CONTEXT_PATH = request.getContextPath();
	String id = RequestUtils.getStr(request, "id");
	String model = RequestUtils.getStr(request, "model");
%>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>组件预览</title>
    <%@ include file= "/sy/base/view/inHeader.jsp" %>
</head>
<body class="portalEditBody" style="background-color:#EEEEEE;">
<div  style="width:100%;text-align:center">
<%if (model.equals("view")) {
} else {%>
<input type="button" name="refresh" onclick="window.location.href = window.location.href;" value="刷新当前页面" width="60px" style="cursor:pointer;margin:10px;font-size:14px;"/>
<input type="button" name="close" onclick="Tab.close();" value="关闭预览" width="60px" style="cursor:pointer;margin:10px;font-size:14px;"/>
<%
}
%>
</div>
</body>
</html>
<script type="text/javascript">
(function() {
    jQuery(document).ready(function(){
    	if ("<%=id%>" == "") {
    		return;
    	}
		var data = {};
		data["PC_ID"] = "<%=id%>";//对应ID
		var res = FireFly.doAct("SY_COMM_TEMPL","getPortalArea",data,false);
		if ((res.AREA != null) && (res.AREA != "")) {
			jQuery("body").append(res.AREA);
		}
    });
})();
</script>