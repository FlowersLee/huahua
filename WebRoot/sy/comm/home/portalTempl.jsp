<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--portalTempl.jsp首页面-->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<%@ page import="com.rh.core.serv.CommonServ" %>
<%@ page import="com.rh.core.serv.ServDao" %>
<%@ page import="com.rh.core.serv.OutBean" %>
<%@ page import="com.rh.core.base.Bean" %>
<%@ page import="com.rh.core.serv.ParamBean" %>
<%@ page import="com.rh.core.util.JsonUtils" %>
<%
	final String CONTEXT_PATH = request.getContextPath();
	OutBean outData = (OutBean)request.getAttribute(Constant.RTN_DISP_DATA);
	Bean outBean = outData.getBean("_PT_PARAM_");
	String sid = outBean.getStr("serv");
    String model = outBean.get("model","view");
    String pkCode = outBean.getStr("pkCode");
    String action = outBean.getStr("action");//方法
    String type = outBean.getStr("type");//类别(规则)
    String extendType = outBean.getStr("extendType");//类别
    outBean.remove("serv");
    outBean.remove("model");
    outBean.remove("pkCode");
    outBean.remove("act");
%>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>办公首页</title>
    <%@ include file= "/sy/base/view/inHeader.jsp" %>
    <script type="text/javascript" src="<%=CONTEXT_PATH %>/sy/base/frame/coms/file/swfupload.js"></script>
	<script type="text/javascript" src="<%=CONTEXT_PATH %>/sy/base/frame/coms/file/js/swfupload.queue.js"></script>
	<script type="text/javascript" src="<%=CONTEXT_PATH %>/sy/base/frame/coms/file/js/fileprogress.js"></script>
	<script type="text/javascript" src="<%=CONTEXT_PATH %>/sy/base/frame/coms/file/js/handlers.js"></script>
    <script type="text/javascript" src="<%=CONTEXT_PATH %>/sy/base/frame/engines/rhPortalView.js" charset="UTF-8"></script>
    <%
    	//取得个性化引入公共css和js文件
    	    CommonServ commServ = new CommonServ();

    	    Bean resBean = new Bean();
    	    if (pkCode.length() > 0) {
    		    ParamBean bean = new ParamBean(sid);
    		    bean.set("_PK_", pkCode);
    		    resBean = commServ.byid(bean);//取得服务中配置的模版布局定义	 
    		    
                //获取PT_TYPE类型值并取得默认模版
                //Bean tempBean = new Bean();
                //tempBean.set(Constant.PARAM_WHERE, " and PT_TYPE='" + type + "' and PT_TYPE_DEFAULT='1' ");
                //List<Bean> defList = ServDao.finds("SY_COMM_TEMPL", tempBean);
                //if (defList.size() > 0) {
                //	resBean = defList.get(0);
                //}
    	    }
    	    String strHtml = "";
    	    String strTheme = "";
    	    Bean themeBean = new Bean();
    	    if(resBean != null && resBean.isNotEmpty("PT_INCL_CSSJS")){
    	        strHtml = resBean.getStr("PT_INCL_CSSJS");
    	        strHtml = strHtml.replaceAll("@urlPath@", urlPath);
    	        out.println(strHtml);
    	    }
    	    if(resBean != null && resBean.isNotEmpty("PT_PARAM")){
    	    	themeBean = JsonUtils.toBean(resBean.getStr("PT_PARAM"));
    	    	strTheme = themeBean.get("THEME", "");
    	    }
    	    outBean.putAll(resBean);
    	    String paramBean = JsonUtils.toJson(outBean,false);//模版定义Bean+额外参数
    %>
</head>
<body class="portalBody portalEditBody <%=strTheme%>">
</body>
</html>
<script type="text/javascript">
(function() {
    jQuery(document).ready(function(){
      if ("<%=model%>" == "view") {
	  try{
    	  if (parent.GLOBAL.style.SS_STYLE_MENU && System.getVar("@C_SY_PJ_CSS@")) {//有外层风格设定
    		  jQuery("body").addClass(parent.GLOBAL.style.SS_STYLE_MENU);
    	  }
    	  jQuery("body").removeClass("portalEditBody");
		  } catch (e) {}
      }
      var temp = {"sId":"<%=sid%>","pkCode":"<%=pkCode%>","model":"<%=model%>","action":"<%=action%>","type":"<%=type%>",
    		  "paramBean":<%=paramBean%>,"extendType":"<%=extendType%>"};
      var portalView = new rh.vi.portalView(temp);
      portalView.show();
      window.portalView = portalView;
      //Tab.setCardTabFrameHei();
    });
})();
</script>
<script type="text/javascript" src="<%=CONTEXT_PATH %>/sy/comm/home/js/incl-templ.js" charset="UTF-8"></script>
