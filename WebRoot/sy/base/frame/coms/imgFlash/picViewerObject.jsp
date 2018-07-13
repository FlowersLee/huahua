<%@ page import="java.net.URLEncoder"%>
<%
	String fileId = request.getParameter("fileId");
	String url = "/download/com.rh.seal.use.servlet.DownLoadFileServlet?func=outputSealImg&FILE_ID="
			+ fileId + "&now=" + System.currentTimeMillis();
	url = URLEncoder.encode(url, "GB18030");
	String parms = "imgUrl="
			+ url
			+ "&textContent=%E4%BA%BA%E5%AF%BF%E7%94%B5%E5%AD%90%E5%8D%B0%E7%AB%A0&isEncryptImg=true";
%>
<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	id="PicViewer" width="180" height="180">
	<param name="movie"	value="PicViewer.swf?<%=parms %>" />
	<param name="quality" value="high" />
	<param name="bgcolor" value="#ffffff" />
	<param name="allowScriptAccess" value="sameDomain" />
	<param name="wmode" value="opaque" />
	<embed src="PicViewer.swf" quality="high" bgcolor="#ffffff"
		width="100%" height="100%" name="PicViewer" align="middle" play="true"
		loop="false" quality="high" allowScriptAccess="sameDomain"
		type="application/x-shockwave-flash">
	</embed>
</object>

