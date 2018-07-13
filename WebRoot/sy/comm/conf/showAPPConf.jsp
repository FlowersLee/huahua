<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ page import="com.rh.core.base.Bean"%>
<%@ page import="com.rh.core.serv.OutBean"%>
<%@ page import="com.rh.core.util.Constant"%>
<%@ page import="com.rh.core.util.JsonUtils"%>
<%@ include file="/sy/base/view/inHeader.jsp"%>

<%
	OutBean outBean = (OutBean)request.getAttribute(Constant.RTN_DISP_DATA);
	Bean data = (Bean) outBean.getData();
%>
<div class="ui-form-default" style="width:100%;margin:0 auto;">
	<table align="center">
	<%for (Object key : data.keySet()) { %>
	<tr><td><%=key%></td><td><input type="text" id="appConf" name="<%=key%>" value="<%=data.getStr(key)%>" size=100></td></tr>
	<%}%>
	<tr><td colspan=2 align="center"><input id="saveConf" type=button value=" 保存 "></td></tr>
	</table>
</div>
<script type="text/javascript">
	jQuery(window).load(function() {
		Tab.setCardTabFrameHei();
	});
	
    jQuery("#saveConf").click(function() { // 保存系统配置参数
    	var data = {};
    	var conf = {};
    	$.each($("input:text"), function (i, val) {
    		conf[val.name] = val.value;
    	});
    	data["APP_BEAN"] = conf;
    	FireFly.doActObject("SY_COMM_CONFIG", "changeAPPConf", data, null, true);
    });
</script>
