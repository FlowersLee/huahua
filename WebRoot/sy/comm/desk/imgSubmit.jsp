<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<%
    final String CONTEXT_PATH = request.getContextPath();
%>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>图标化首页</title>
</head>
<body>
<script type="text/javascript">
function upload() {
   var temp = document.getElementById("rh-self-img").value;
   if (temp.length > 0) {
	 document.getElementById("imgForm").submit();
	 //parent.document.getElementById("imgIframe").style.display = "none";
	 parent.document.getElementById("pImgBtn").click();
   }
}
</script>
<form id="imgForm" name="imgForm" method="post" action="<%=CONTEXT_PATH%>/file" enctype="multipart/form-data">
<input id="rh-self-img" name="rh-self-img" type="file"></input>
<input type="button" id="rh-self-btn" onClick="upload()" value="确定"></input>
</form>

</body>
</html>