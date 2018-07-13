<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.rh.core.base.BeanUtils"%>
<%@ page import="com.rh.core.util.RequestUtils"%>
<%@ page import="org.apache.commons.io.FilenameUtils"%>
<%@ page import="java.text.DecimalFormat"%>
<%@ include file="/sy/base/view/inHeader.jsp"%>
<script type="text/javascript" src="<%=urlPath%>/sy/base/frame/coms/file/swfupload.js"></script>
<script type="text/javascript" src="<%=urlPath%>/sy/base/frame/coms/file/js/swfupload.queue.js"></script>
<script type="text/javascript" src="<%=urlPath%>/sy/base/frame/coms/file/js/fileprogress.js"></script>
<script type="text/javascript" src="<%=urlPath%>/sy/base/frame/coms/file/js/handlers.js"></script>
<script type="text/javascript" src="<%=urlPath%>/sy/servjs/SY_COMM_ATTACH.js"></script>
<% 
Bean datas = (Bean) request.getAttribute(Constant.RTN_DISP_DATA);
String dataId = datas.getStr("dataId");
String servId = datas.getStr("servId");
%>
<body style="background-color: #fdfdfd;">
	<div class="ui-form-default" style="background-color: #fdfdfd;">
		<div id="fileDiv" class="formContent ml30" style="background-color: #fdfdfd;"></div>
	</div>
	<script>
		var _viewer = parent.jQuery(parent.document).data("shareCradViewer");
		if (!_viewer) {
			var servId = "<%=servId %>";
			var servDef = FireFly.getServMainData(servId);
	        var pkCode = "<%=dataId %>";
		    var temp = {"act":"MODIFY","replaceUrl":"","sId":servId,"parHandler":null,"parTabClose":"true",
		                "paramsFlag":"false","readOnly":"true","areaId":""
		                ,"servDef":servDef};
		    temp[UIConst.PK_KEY] = pkCode;
		    _viewer = new rh.vi.cardView(temp);
		}
		var _wfCardView = _viewer.wfCard;
		var pCon = jQuery("#fileDiv");
		var param = {
			"viewer" : _viewer,
			"id" : "rh.vi.attach",
			"servId" : _viewer.servId,
			"dataId" : _viewer._pkCode,
			"wfCard" : _wfCardView,
			"pCon" : pCon
		};
		var attach = new rh.vi.attach(param);
		attach.render();
		jQuery(document).ready(function() {
			setTimeout(function() {//第一次加载
				Tab.setCardTabFrameHei();
			}, 10);
		});
	</script>
</body>
