<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!-- custom search view  -->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.rh.core.plug.search.*"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>软虹搜索-个性化信息</title>
	<%@ include file="/sy/base/view/inHeader.jsp"%>
	
    <script src="cuSearchView.js" type="text/javascript"></script>
    <link rel="stylesheet" type="text/css" href="<%=urlPath%>/search/cuSearchView.css" />
    
</head>
<body class="mbList-body">
</body>

<script type="text/javascript">


(function() {
    jQuery(document).ready(function(){
        var keywords ='<%=request.getParameter("k")%>';
	    var opts = {"sId":"SY_PLUG_SEARCH","pCon":jQuery("body")};
	    var listView = new mb.vi.search(opts);
	    listView.show(keywords);

	    window.addEventListener("load", function() { setTimeout(hideURLbar, 0); }, false);
	    function hideURLbar(){
	      window.scrollTo(0,1);
	    }
    });
})();
</script>
</html>