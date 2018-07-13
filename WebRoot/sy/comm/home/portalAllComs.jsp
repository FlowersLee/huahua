<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--portalComView.jsp首页面-->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<%
    final String CONTEXT_PATH = request.getContextPath();
	String pcType = RequestUtils.getStr(request, "pcType");
	String areaType = RequestUtils.getStr(request, "areaType");
	String pageNum = RequestUtils.getStr(request, "pageNum");
	String userCode = RequestUtils.getStr(request, "userCode");
	String deptCode = RequestUtils.getStr(request, "deptCode");
	String roleCodes = RequestUtils.getStr(request, "roleCodes");
	String searchValue = RequestUtils.getStr(request, "searchValue");
	if (pageNum.length() == 0) {
		pageNum = "1";
	}
%>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>组件预览</title>
    <%@ include file= "/sy/base/view/inHeader.jsp" %>
</head>
<style type="text/css">
.btnActive {
	background-color:#1d62ad;color:white;
}
</style>
<body class="portalEditBody" style="background-color:#EEEEEE;">
</body>
</html>
<script type="text/javascript">
/*
 * 翻页
 */
function goPage (url) {
	var extUrl = "&userCode=<%=userCode%>&deptCode=<%=deptCode%>&roleCodes=<%=roleCodes%>";
	parent.parent.Tip.showLoad("加载中");
	window.location.href = FireFly.getContextPath() + "/sy/comm/home/portalAllComs.jsp?" +  url + extUrl;
};
/*
 * 添加组件到模版
 */
function bindAddCom (obj,id) {
	obj.bind("click",function(event) {
		parent.portalView._addToModel(id);
		jQuery(this).find(".rh-icon-inner").text("已添加到模版");
		jQuery(this).find(".rh-icon-img").removeClass("btn-add");
		jQuery(this).unbind("click");
	});
};
/*
 * 构造选择组件页面
 */
function bldComsContent(pcType,areaType,searchValue) {
	var _self = this;
	jQuery(".portal-selectComs-container").empty().remove();
	parent.portalView._targetIndex = 0;
	//获取组件定义数据
	var data = {};
    data["_searchWhere"] = "";
	//data["_NOPAGE_"] = true;
	if (typeof pcType == "string" && pcType.length > 0) {//组件类别
		data["_searchWhere"] = " AND PC_TYPE='" + pcType + "'";
	} 
	if (typeof searchValue == "string" && searchValue.length > 0) {
		var array = searchValue.split(",");
		data["_searchWhere"] = data["_searchWhere"] + " AND " + array[0] + " like '%" + array[1] + "%'";
	}
	data["NOWPAGE"] = "<%=pageNum%>";
	data["USER_CODE"] = "<%=userCode%>";
	data["DEPT_CODE"] = "<%=deptCode%>";
	data["ROLE_CODES"] = "<%=roleCodes%>";
	//var comsData = FireFly.getPageData("SY_COMM_TEMPL_COMS",data);
	var comsData = FireFly.doAct("SY_COMM_TEMPL_COMS","queryCms",data);
	var data = comsData._DATA_;
	parent.portalView.coms = {};
	var comsContainer = jQuery("<div></div>").addClass("portal-selectComs-container");
	var i = 0;
	var len = data.length;
	jQuery.each(data,function(i,n) {//构造选择组件页面的每一个组件
		var comData = n;
		var com = jQuery("<div></div>").addClass("portal-selectComs");
		var comView = jQuery("<div></div>").addClass("portal-selectComs-view").appendTo(com);
		var comTip = jQuery("<div></div>").addClass("portal-selectComs-tip").appendTo(com);
		var id = comData.PC_ID;
        try {
			var data = {};
			data["PC_ID"] = comData.PC_ID;//对应文件
			var res = FireFly.doAct("SY_COMM_TEMPL","getPortalArea",data,false);
			if ((res.AREA != null) && (res.AREA != "")) {
				comView.html(res.AREA);
				parent.portalView.coms[id] = res.AREA;
			}
			var name = jQuery("<div class='portal-selectComs-line portal-selectComs-lineBottom' style='font-weight:bold;'>" + comData.PC_NAME + "</div>");
			var tip = jQuery("<div class='portal-selectComs-line portal-selectComs-lineTop portal-selectComs-lineBottom'>说明：" + comData.PC_TIP + "</div>");
			comTip.append(name).append(tip);
			//增加到模版按钮
			var tool = jQuery("<div class='portal-selectComs-line portal-selectComs-lineTop'><div style='float:left'>操作：</div></div>");
			var comLen = parent.jQuery(".portal-target").find(".portal-temp[comid='" + id + "']").length;
	
			addToBtn = jQuery("<a class='rh-icon rhGrid-btnBar-a'><span class='rh-icon-inner'>添加到模版</span><span class='rh-icon-img btn-add'></span></a>").appendTo(tool);
			if (comLen === 0) {
				bindAddCom(addToBtn,id);
			} else if (comLen > 0) {
				addToBtn.find(".rh-icon-inner").text("已添加到模版");
				addToBtn.find(".rh-icon-img").removeClass("btn-add");
			}
			//增加到模版按钮
			var deleteCom = jQuery("<a class='rh-icon rhGrid-btnBar-a'><span class='rh-icon-inner'>从模版中移除</span><span class='rh-icon-img btn-delete'></span></a>").appendTo(tool);
			deleteCom.bind("click",function(event) {
				parent.portalView._deleteCom(id);
				var obj = jQuery(this).prev();
				obj.find(".rh-icon-inner").text("添加到模版");
				obj.find(".rh-icon-img").addClass("btn-add");
				bindAddCom(obj,id);
			});
			comTip.append(tool);
        } catch(e) {
        	comView.html("<span style='color:red;'>前端组件加载有问题[" + id + "]</span>");
        }
		com.appendTo(comsContainer);
	});
	if(len == 0){
		//var com = jQuery("<div></div>").addClass("portal-selectComs");
		//var comView = jQuery("<div></div>").addClass("portal-selectComs-view").appendTo(com);
		//comView.html("<span style='color:red;'>没有找到对应的组件</span>");
		//com.appendTo(comsContainer);
		comsContainer.html("<span style='color:red;margin-left:40%;'><font size='5'>没有找到对应的组件</font></span>");
	}
	//jQuery("<a id='top_href' href='#3' style='margin-left:-1000px;'>&nbsp</a>").appendTo(this.winDialog);
	comsContainer.appendTo(jQuery("body"));
	//分页信息
	var allNum = comsData._PAGE_.ALLNUM; //总记录数
	var showNum = comsData._PAGE_.SHOWNUM;//每页条数
	var nowPage = comsData._PAGE_.NOWPAGE; //当前页
	var pages = comsData._PAGE_.PAGES;//总页数
	var pageDiv = jQuery("<div style='width:90%;text-align:right;margin:20px 0px;height:50px;float:left;'></div>").appendTo(jQuery("body"));
	if(len != 0){
		for (var i = 1; i <= pages; i++) {
			var btn = jQuery("<input type='button' value='" + i + "' style='width:50px;height:30px;' "
			+ "onclick=\"goPage('pcType=" + "<%=pcType%>" 
					+ "&areaType=" + "<%=areaType%>" 
					+ "&pageNum=" + i + "')\"/>").appendTo(pageDiv);
			if (i == nowPage) {
				btn.addClass("btnActive");
			}
		}
	}
	parent.Tip.clearLoad();
};
jQuery(document).ready(function(){
	bldComsContent("<%=pcType%>","<%=areaType%>","<%=searchValue%>");
});
</script>