<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>



<%@ include file= "../../sy/base/view/inHeader.jsp" %>
<script type="text/javascript" src="<%=urlPath %>/sy/wfe/procDefJs.js"></script>
<div id="div_wf_object"  style="margin-left:1%;width:98%;height:500px">
	<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
			id="workFlow"   width="100%" height="99%"
			codebase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab">
			<param name="movie" value="codebase/workFlow.swf" />
			<param name="quality" value="high" />
			<param name="bgcolor" value="#869ca7" />
			<param name="allowScriptAccess" value="sameDomain" />
			<param name="allowFullScreen" value="true" />
            <embed id="workFlow"  src="codebase/workFlow.swf" quality="high" bgcolor="#869ca7"
				width="96%" height="100%" name="workFlow" align="middle"
				play="true"
				loop="false"
				quality="high"
				allowScriptAccess="sameDomain"
				type="application/x-shockwave-flash"
				pluginspage="http://www.adobe.com/go/getflashplayer">
			</embed>			
	</object>
</div>

<script language="Javascript" event="doubleClickNode(node)" for="WorkflowDesigner" >
		openNodeDefDlg(node);
</script>

<script language="Javascript" event="doubleClickLine(line)" for="WorkflowDesigner" >
		openLineDefDlg(line);
</script>

<div style="display:none">
<form method="post"  id="fileSelectForm" action="" enctype="multipart/form-data">
<input type="file" onpropertychange="readFileContent()" id="slectFileId">
</form>
</div>

<input type="hidden" id="SERV_ID" name="SERV_ID" value="">
<input type="hidden" id="SERV_PID" name="SERV_PID" value="">
