<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.rh.core.plug.search.*"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>手机搜索页面</title>
	<%@ include file="/sy/base/view/inHeader-mb.jsp"%>
	
    <script src="mbSearchView.js" type="text/javascript"></script>
    <script src="<%=urlPath %>/sy/plug/search/suggest.js" type=text/javascript></script>
    <style type="text/css">
#suggest {
	position: absolute;
	background-color: #FFFFFF;
	border: 1px solid #CCCCFF;
	width: 404;
}

#suggest div {
	padding: 5px;
	display: block;
	width: 404;
	FONT: 15px arial;
	overflow: hidden;
	white-space: nowrap;
}

#suggest div.select {
	color: #FFFFFF;
	background-color: #3366FF;
}

#suggest div.over {
	background-color: #99CCFF;
}
</style>
    
</head>
<body class="mbList-body">
 <%String suggestServer = SearchServ.getSuggestionUri();%>
</body>
<script type="text/javascript">

//suggestion
function startSuggest(){
	var server = "<%=suggestServer%>";
    var list = [""];
    new Suggest.Local("inputTxt", // input element id.
        "suggest", // suggestion area id.
        server + "?rtn=js&w=",
		 list, {
            dispMax: 10,
            interval: 10
    }); // options
}

(function() {
    jQuery(document).ready(function(){
        var keywords ='<%=request.getParameter("k")%>';
        var back ='<%=request.getParameter("back")%>';
	    var temp = {"sId":"SY_PLUG_SEARCH","pCon":jQuery("body"),"back":back};
	    var listView = new mb.vi.search(temp);
	    listView.show(keywords);

	    //load suggesstion
	    window.addEventListener ? window.addEventListener('load', startSuggest, false) : window.attachEvent('onload', startSuggest);
	    
	    window.addEventListener("load", function() { setTimeout(hideURLbar, 0); }, false);
	    function hideURLbar(){
	      window.scrollTo(0,1);
	    }
    });
})();
</script>
</html>