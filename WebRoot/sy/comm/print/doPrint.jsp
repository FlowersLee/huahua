<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ page import="java.io.File"%>
<%@ page import="com.rh.core.serv.*" %>
<%@ page import="com.rh.core.base.*" %>
<%@ page import="com.rh.core.util.freemarker.*" %>
<%@ page import="com.rh.core.comm.mind.*" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="com.rh.core.util.Constant" %>
<%
	request.setCharacterEncoding("UTF-8");

	// 手动获取一下这样在线程中就有了UserBean
	Context.getUserBean(request);

	/**
	 * 这四个参数必须确保都传递了，代码不做检查，默认认为都传了
	*/
	String servId = request.getParameter("servId");// 服务ID
    System.out.print(servId);
	//String servSrcId = request.getParameter("servSrcId");// 引用自服务ID
	String dataId = request.getParameter("dataId");// 数据ID
	String ftlFile = request.getParameter("ftlFile");// 模板文件名
	
	// 取得服务定义信息
	Bean servBean = ServUtils.getServDef(servId);
	
	// 审签单数据
	ParamBean queryBean = new ParamBean().set(Constant.PARAM_SERV_ID, servId).set(Constant.KEY_ID, dataId);
	
	Bean dataBean =  new CommonServ().byid(queryBean);
	
	// 查询出所有附件
	//List<Bean> fileBean = (List<Bean>) ServDao.finds(ServMgr.SY_COMM_FILE, new Bean().set("SERV_ID", servSrcId).set("DATA_ID", dataId));
	
	// 其它数据Bean
	Bean printBean = (Bean) ServMgr.act(servId, "getPrintData", queryBean).get("PRINT_BEAN");
	
	/*
	* 取得意见数据
	*/
	//UserMind userMind = new UserMind(Context.getUserBean());
	//userMind.query(servId, dataId);
	//List<Bean> mindTypeList = userMind.getMindTypeList();
	
	Bean bean = new Bean();
    bean.set("userBean", Context.getUserBean());
    bean.set("servBean", servBean);
    bean.set("dataBean", dataBean);
   // bean.set("fileBean", fileBean);
   // bean.set("printBean", printBean);
   // bean.set("mindTypeList", mindTypeList);
    //bean.set("userMind", userMind);
	//bean.set("systemVars", ServUtils.getSysVars());
    
	// 取得服务CODE的前缀
    String servPrefix = servId.substring(0, servId.indexOf("_")).toLowerCase();
    // String servPrefix =
	// 拼出模板全路径
	String ftl  = Context.appStr(Context.APP.SYSPATH) + "/oa/gw/print/ftl/" + ftlFile;
	
	// 如果模板不存在则调用错误页面模板
	boolean ftlExist = new File(ftl).exists();
	if (!ftlExist) {
		bean.set("ftlPath", "/" + servPrefix + "/ftl/print/" + ftlFile);
		ftl = Context.appStr(Context.APP.SYSPATH) + "/sy/print/ERROR.ftl";
	}
	
	String htmlStr = FreeMarkerUtils.parseText(ftl, bean);
%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<title>通用打印</title>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/sy/print/style.css" />
<style type="text/css">
	html, body {
		margin:0 0;
		padding:0 0 20px 0; 
	}
	
	._center_ {
		margin:0 auto;
	}

	#_container_ {		
		width:100%;
		height:100%;
	}
	
	#_print_ {
		margin-top:5px;
		margin-bottom:5px;
	}
	
	._btn_ {
		width:80px;
		height:25px;
		margin-left:5px;
	}
	
	#_content_ {
	}
</style>
<script type="text/javascript" src="<%=request.getContextPath()%>/sy/base/frame/jquery-1.8.2.min.js"></script>
<script type="text/javascript">
	/**
	 * WebBrowser.ExecWB(1, 1)  打开 
	 * WebBrowser.ExecWB(2, 1)  关闭现在所有的IE窗口，并打开一个新窗口 
	 * WebBrowser.ExecWB(4, 1)  保存网页 
	 * WebBrowser.ExecWB(6, 1)  打印 
	 * WebBrowser.ExecWB(7, 1)  打印预览 
	 * WebBrowser.ExecWB(8, 1)  打印页面设置 
	 * WebBrowser.ExecWB(10, 1) 查看页面属性 
	 * WebBrowser.ExecWB(15, 1) 好像是撤销，有待确认 
	 * WebBrowser.ExecWB(17, 1) 全选 
	 * WebBrowser.ExecWB(22, 1) 刷新 
	 * WebBrowser.ExecWB(45, 1) 关闭窗体无提示  
	*/

	// 打印设置
	function PageSetup() {
		WebBrowser.ExecWB(8, 1, 0, 2);
	}

	// 打印预览
	function printView() {
		var print = $("#_print_");
		print.hide();
		WebBrowser.ExecWB(7, 1);
		print.show();
	}
	
	// 打印
	function doPrint() {
		var print = $("#_print_");
		print.hide();
		WebBrowser.ExecWB(6, 6);
		print.show();
	}
</script>
</head>
<body>
	<object id="WebBrowser" width="0" height="0" classid="CLSID:8856F961-340A-11D0-A96B-00C04FD705A2"></object>
	<div id="_container_" class="_center_">
	  
		<%if (ftlExist) { %>
		<div id="_print_">
			<input class="_btn_" id="_setupBtn_" type="button" value="页面设置" onclick="javascript:PageSetup();" />
			<input class="_btn_" id="_viewBtn_" type="button" value="打印预览" onclick="javascript:printView();" />
			<input class="_btn_" id="_printBtn_" type="button" value="打  印" onclick="javascript:doPrint();" />
		    <input class="_btn_" id="_closeBtn_" type="button" value="关  闭" onclick="window.close();" />
		</div>
		<%}%>
		<div id="_content_" class="_center_">
			<%out.println(htmlStr);%>
		</div>
	</div>
</body>
</html>