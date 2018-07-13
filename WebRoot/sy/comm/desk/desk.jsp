<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--desk.jsp首页面-->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<%
    final String CONTEXT_PATH = request.getContextPath();
%>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>图标化首页</title>
    <%@ include file= "/sy/base/view/inHeader.jsp" %>
    <link rel="stylesheet" type="text/css" href="<%=CONTEXT_PATH %>/sy/comm/desk/css/style.css" />
    <link rel="stylesheet" type="text/css" href="<%=CONTEXT_PATH %>/sy/comm/desk/css/desk.css" />
    <script type="text/javascript" src="<%=CONTEXT_PATH %>/sy/comm/desk/js/jquery.ui.sortable.min.js"></script>
	<script type="text/javascript" src="<%=CONTEXT_PATH %>/sy/comm/desk/js/lang_js.js"></script>
	<script type="text/javascript" src="<%=CONTEXT_PATH %>/sy/comm/desk/js/jquery.ux.borderlayout.js"></script>
	<script type="text/javascript" src="<%=CONTEXT_PATH %>/sy/comm/desk/js/jquery.ux.slidebox.js"></script>
	<script type="text/javascript" src="<%=CONTEXT_PATH %>/sy/comm/desk/js/jquery.ux.simulatemouse.js"></script>
	<script type="text/javascript" src="<%=CONTEXT_PATH %>/sy/comm/desk/js/reflection.js"></script>
	<script type="text/javascript" src="<%=CONTEXT_PATH %>/sy/comm/desk/js/rhDeskView.js"></script>
</head>
<%
    String intervalTime = Context.getSyConf("SY_DESK_MSG_INTERVAL","300000");//提示间隔获取
%>
<body  style="background:#5a97d6;">
	<div class="slidebox">
	  	<div id="container"></div>
	</div>
	<div id="overlay"></div>

	<div class="background" style=""></div>

	
	<div id="control"> 
      <table align="center">
         <tr>
            <td class="control-l"><a id="openSearch" title="打开搜索框" href="javascript:void(0);" class="rh-slide-search"></a></td>
            <td class="control-c"></td>
            <td class="control-r"><a id="openAppBox" title="打开应用盒子" href="javascript: void(0)" class="cfg"></a> </td>
         </tr>
      </table>
   </div>
	<div class="bottom-normal" id="normalUse" align=center>
      <table align="center">
         <tr align=center>
            <td class="normalUse-l"></td>
            <td class="normalUse-c" align=center></td>
            <td class="normalUse-r"><div id="trash"></div></td>
         </tr>
      </table>
	</div>
<script type="text/javascript">
 var deskView = new rh.vi.deskView({"id":"rh","intervalTime":"<%=intervalTime%>"});
 deskView.show();
</script>
</body>
</html>