<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--page.jsp 平台page页面-->
<%@ page import="com.rh.core.base.Context" %>
<%@ page import="com.rh.core.util.Lang" %>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
	    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
	    <title>智能平台系统</title>
	    <%@ include file= "/sy/base/view/inHeader.jsp" %>
	</head>

<%
  if (request.getQueryString() != null) {
  		request.getSession().setAttribute("GOTO_URL", request.getRequestURI().toString() + "?" + request.getQueryString());
  } else {
	  	request.getSession().setAttribute("GOTO_URL", request.getRequestURI().toString());
  }
  // 如果没有登录则导向首页去登录
  if(userBean == null) {
	 String loginUrl = Context.getSyConf("SY_LOGIN_URL","/");
		 RequestUtils.sendDisp(request, response, loginUrl);
  }
  
  String param = RequestUtils.getStr(request,"param");//扩展打开的tab参数
  param = new String(Lang.hexToStr(param));
%>  
	
	<body>
	</body>	
	<script type="text/javascript">
		var thisHandler = this;
		
		jQuery(document).ready(function(){
	    	//初始化参数
			var param = "<%=param%>";
			var paramObj;
			if(param.length > 0){
				param = param.replace(/#/g, '.');
			    paramObj = StrToJson(param);
			}
			paramObj.servId = paramObj.servId || "";
			paramObj._PK_ = paramObj._PK_ || "";

			if(paramObj.servId.length > 0 && paramObj._PK_.length > 0){
				//获取TODO数据
				var para = {};
				para[UIConst.PK_KEY] = paramObj._PK_;
				thisHandler.res = FireFly.doAct(paramObj.servId,"byid",para,false);
				var todoBean = thisHandler.res;

				//构造页面
				if (todoBean.TODO_ID.length > 0) {
					
				    //弹出确认窗口
					showConfirmDialog(todoBean.TODO_TITLE,todoBean.TODO_CONTENT,function exeToDo() {
						
						var data = {};
						data[UIConst.PK_KEY] = todoBean.TODO_ID;
						data["TODO_ID"] = todoBean.TODO_ID;
						var res = FireFly.doAct("SY_COMM_TODO","endReadCon",data,false);
						//if (res[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
						this.location.href = FireFly.getContextPath() + "/sy/comm/page/page.jsp";
						//}
						
			        }, thisHandler);
				}else{
					alert("错误");
					return false;
				}
			}
	    });

		function showConfirmDialog(title, content, func, handler) {
			jQuery("#TEMP_RH_DIALOG").dialog("destroy");
			// 构造dialog
			var hei = 300;
			var wid = 650;

			if ((title.length > 16) && (wid == 350)) {
				title = title.substring(0, 16) + "..";
			} else if ((title.length > 10) && (wid < 350)) {
				title = title.substring(0, 10) + "..";
			}
			var winDialog = jQuery("<div></div>").addClass("showRHDialog").attr("id",
					"TEMP_RH_DIALOG").attr("title", title);
			winDialog.appendTo(jQuery("body"));

			var posArray = [];
			jQuery("#TEMP_RH_DIALOG").dialog({
				autoOpen : false,
				height : hei,
				width : wid,
				modal : true,
				resizable : false,
				position : posArray,
				open : function() {

				},
				close : function() {
					winDialog.remove();
					handler.location.href = FireFly.getContextPath() + "/sy/comm/page/page.jsp";
				},
				buttons : {
					确定 : function() {
						jQuery(this).dialog("close");
						if (func && handler) {
							func.apply(handler);
						}
						//添加刷新父页面
						if (("" != (areaId || "")) && ("" != (portalHandler || ""))) {
							portalHandler.refreshBlock(areaId);
						}
					},
					取消 : function() {
						winDialog.remove();
						handler.location.href = FireFly.getContextPath() + "/sy/comm/page/page.jsp";
					}
				}
			});
			// 打开dialog
			var dialogObj = jQuery("#TEMP_RH_DIALOG");
			dialogObj.dialog("open");

			dialogObj.focus();
			jQuery(".ui-dialog-titlebar").last().css("display", "block");// 设置标题显示
			dialogObj.parent().addClass("rh-bottom-right-radius rhSelectWidget-content");
			Tip.showLoad("努力加载中...", null, jQuery(".ui-dialog-title", winDialog).last());
			var btns = jQuery(".ui-dialog-buttonpane button",dialogObj.parent()).attr("onfocus","this.blur()");
			btns.first().addClass("rh-small-dialog-ok");
			dialogObj.parent().addClass("rh-small-dialog").addClass("rh-bottom-right-radius");
			dialogObj.css({"background-color":"#FFF"});
			jQuery("<div></div>").addClass("showRHDialog-con").html(content).appendTo(
					winDialog);
		};					    
	</script>
</html>