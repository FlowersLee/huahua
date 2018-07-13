<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.rh.core.base.BeanUtils"%>
<%@ page import="com.rh.core.util.RequestUtils"%>
<%@ page import="com.rh.core.serv.ParamBean"%>
<%@ page import="com.rh.core.serv.OutBean"%>
<%@ page import="com.rh.core.serv.ServMgr"%>
<%@ include file="/sy/base/view/inHeader.jsp"%>

<%
	ParamBean paramBean = RequestUtils.transParam(request);
	String dataId = paramBean.getStr("DATA_ID");
	OutBean outBean = ServMgr.act(ServMgr.SY_COMM_MIND, "displayMindTitle", paramBean);
%>
<div class="ui-form-default" style="width:90%;margin:0 auto;">
	<div id="document_comment"></div>
</div>
<script type="text/javascript">
	var _dataId = "<%=dataId%>";
	var _servId = "<%=paramBean.getStr("SERV_ID")%>";
	jQuery(window).load(function() {
		var opts = {
			"DATA_ID" : _dataId,
			"SERV_ID" : _servId,
			"SHOWNUM" : 10,
			"NOWPAGE" : 1,
			"pCon" : jQuery("#document_comment")
		};
		var listView = new rh.vi.comment(opts);
		listView.show();
		
		jQuery("body").css({"background-color":"#fdfdfd"});
		jQuery(".inner").css({"margin":"10px 0 5px -11px","float":"left"});
		jQuery(".left").css({"float":"left","display":"inline-block","max-width":"120px"});
		jQuery(".right").css({"float":"left","display":"inline-block"});
		jQuery("select").css({"border":"1px solid #BBB"});
		//重置图片大小 @author hdy
		jQuery(".quote_content").find("img").each(function(){
			 //var hei= parseInt(this.height || this.style.height || this.offsetHeight);
			 var wid = jQuery(this).width();//parseInt(this.width || this.style.width || this.offsetWidth);
			//如果评论内容中有很大的图片
			if ("" != (jQuery(this).attr("title") || "")) {
				//当前屏幕分辨率大于 1024 * 768的，则显示适合屏幕的大小
				if (screen.width <= 1024 && screen.height == 768) {
					if (wid >= 580) {
						jQuery(this).before("<br/>").css({"max-width":"580px"});
					}
				//若为其他分辨率，则显示适合大小的图片宽度
				} else {
					if (wid >= 820) {
						jQuery(this).before("<br/>").css({"max-width":"820px"});
					}
				}
			}
		});
		Tab.setCardTabFrameHei();
	});
</script>
