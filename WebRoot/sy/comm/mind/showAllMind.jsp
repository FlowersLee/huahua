<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<%@ include file= "/sy/base/view/inHeader.jsp" %>
<%
	//手动获取一下这样在线程中就有了UserBean
	Context.getUserBean(request);
	// 获取DATA_ID
	String dataId = request.getParameter("DATA_ID");// 服务ID
%>
<head>
	<script type="text/javascript">
		// 默认意见排序方式
		var defaultSortType = "TYPE";
		// 当前意见排序方式
		var sortType = defaultSortType;
		// 获取意见
		function getMind(odept, type) {
			var data = {};
		  	data["_NOPAGE_"] = "YES";
		  	data["DATA_ID"] =  "<%=dataId%>";
		  	data["_extWhere"] = " AND S_FLAG=1";
		  	
			data["SORT_TYPE"] = sortType;
			
			var actName = "displayMindTitle";
			if (type && type == "listMind") {
				actName = "displayMindList";
				data["ODEPT_CODE"] = odept;
				return FireFly.doAct("SY_COMM_MIND", actName, data, false).MIND_LIST;
			} else {
				var mindData = FireFly.doAct("SY_COMM_MIND", actName, data, false);
				jQuery("#mindContainer").append(mindData.MIND_TITLE);
				return mindData.MIND_LIST;
			}
		}
	
		// 显示意见
		function showMind(odept, type) {
			if (getMind(odept, type)) {
				jQuery("#mindTable" + odept).remove();
				jQuery("#mindContent" + odept).append(getMind(odept, type)).removeClass("none");
			} else if (jQuery("#mindContainer").find("*").length == 0) {
				jQuery("#mindContainer").append("<div class='noneMind' style='margin-top:15px;color:red;font-size:14px;'>没有意见！</div>");
			}
			Tab.setCardTabFrameHei();
		}
		
		jQuery(function(){
			showMind();
			
			// 绑定意见显示方式按钮的click事件
			jQuery(".mindSortClick").bind("click",function(){
				var $this = jQuery(this);
				var odept = $this.attr("deptCode");
				sortType =  $this.attr("sortType")?$this.attr("sortType"):defaultSortType;
				showMind(odept, "listMind");
				$this.parent().find(".mindSortClick").removeClass("mindTypeSelected");
				$this.parent().find("[sortType=" + sortType + "]").addClass("mindTypeSelected");
				Tab.setCardTabFrameHei();
			});
			
			// 绑定机构名称连接的click事件
			jQuery(".mindOdpt").bind("click",function(){
				var $this = jQuery(this);
				var odept =  $this.attr("deptCode");
				var $mindContent = jQuery("#mindContent" + odept);
				if($mindContent.contents().length == 0){// 没有意见内容，则重新装载
					sortType =  $this.attr("sortType")?$this.attr("sortType"):defaultSortType;
					showMind(odept, "listMind");
					$this.parent().find(".mindSortClick").removeClass("mindTypeSelected");
					$this.parent().find("[sortType=" + sortType + "]").addClass("mindTypeSelected");
				} else if ($mindContent.hasClass("none")) {
					$mindContent.removeClass("none");
				} else {
					$mindContent.addClass("none");
				}
				Tab.setCardTabFrameHei();
			}); 
		});
	</script>
</head>
<body style="background-color:white">
	<div id="mindContainer" style="width:96%;margin:auto;padding:auto;"></div>
</body>
</html>