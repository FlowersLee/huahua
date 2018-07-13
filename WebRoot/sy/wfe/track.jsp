<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ page import="com.rh.core.base.Bean"%>
<%@ page import="com.rh.core.serv.OutBean"%>
<%@ page import="com.rh.core.util.Constant"%>
<%@ include file="../../sy/base/view/inHeader.jsp"%>
<title>图形化流程跟踪</title>
<%
	OutBean outBean = (OutBean) request.getAttribute(Constant.RTN_DISP_DATA);
	String wfXMLStr = outBean.getStr("WF_XML");
%>
<body>
<table border="0" cellspacing="1" cellpadding="0" width="100%" height="100%">
    <tr>
        <td width="100%" height=500 align="center">
			<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
					id="workFlow"   width="96%" height="100%"
					codebase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab">
					<param name="movie" value="<%=urlPath%>/sy/wfe/codebase/workFlow.swf" />
					<param name="quality" value="high" />
					<param name="bgcolor" value="#869ca7" />
					<param name="allowScriptAccess" value="sameDomain" />
					<param name="allowFullScreen" value="true" />
					<embed id="workFlow"  src="<%=urlPath%>/sy/wfe/codebase/workFlow.swf" quality="high" bgcolor="#869ca7"
						width="96%" height="100%" name="workFlow" align="middle"
						play="true"
						loop="false"
						quality="high"
						allowScriptAccess="sameDomain"
						type="application/x-shockwave-flash"
						pluginspage="http://www.adobe.com/go/getflashplayer">
					</embed>			
			</object>
        </td>
    </tr>
    <tr>
		<td valign="top" align="center" width="90%">
		    <div id="userListDiv" border="1" style="margin-right:10px"></div>
		</td>
    </tr>
    <tr>
        <%  wfXMLStr.replaceAll("\"", "\\\""); %>
       <!--  <td colspan=2><textArea id=wf_xml_str name=wf_xml_str ><%= wfXMLStr %></textArea></td>--> 
    </tr>
</table>

<br>

<SCRIPT language=JavaScript event="onreadystatechange()" for=document>
            window.setTimeout("doWfFigure()", 10);
            window.status=document.readyState;
            Tab.setFrameHei(700);
</SCRIPT>
<Script>
function doWfFigure(){
	//WorkFlowFigure.LoadXmlString(document.all.wf_xml_str.value);
	//alert(document.all.wf_xml_str.value):
}

function getXml() {
<% 
  wfXMLStr=wfXMLStr.replaceAll("\r", "");
  wfXMLStr=wfXMLStr.replaceAll("\n", "");
  wfXMLStr=wfXMLStr.replaceAll("\"", "'");
%>
  var xml="<%= wfXMLStr %>";

  return xml;
}

function getMode(){
	   return 2;
}


function showPanelDetail(userStr){
	showClickedNodeUsers(StrToJson(userStr)); 
}
	
/**
 * 显示所点击的节点， 走过的人的列表
 */ 
var usersObj="{userList:[]}";//"{userList:[{'SendDept':'deptname','SendUser':'username','BeginTime':'BeginTime','EndTime':'EndTime','DoneDept':'deptname','DoneUser':'username'},{'SendDept':'deptname','SendUser':'username','BeginTime':'BeginTime','EndTime':'EndTime','DoneDept':'deptname','DoneUser':'username'}]}"; 
showClickedNodeUsers(StrToJson(usersObj)); 
function showClickedNodeUsers(usersObj) {
    jQuery("#userListTable").remove();

	var userListDiv = jQuery("#userListDiv");
    var userTable = jQuery("<table class= 'rhGrid' id='userListTable'></table>").appendTo(userListDiv);
	var userTableTh = jQuery("<thead class='rhGrid-thead'></thead>").appendTo(userTable);
	
	var newTr = jQuery("<tr></tr>").appendTo(userTableTh);
	//jQuery("<th class='rhGrid-thead-th'>发送部门</th>").appendTo(newTr);
	jQuery("<th class='rhGrid-thead-th'>发送人</th>").appendTo(newTr);
	jQuery("<th class='rhGrid-thead-th'>发送时间</th>").appendTo(newTr);
	//jQuery("<th class='rhGrid-thead-th'>办理部门</th>").appendTo(newTr);
	jQuery("<th class='rhGrid-thead-th'>办理人</th>").appendTo(newTr);
	jQuery("<th class='rhGrid-thead-th'>办理时间</th>").appendTo(newTr);	

	var userTbody = jQuery("<tbody class='rhGrid-tbody'></tbody>").appendTo(userTable);
	jQuery.each(usersObj.userList,function(i,userItem) {
		var newTr = jQuery("<tr class='tBody-tr'></tr>").appendTo(userTbody);
		//jQuery("<td class='rhGrid-td-left'>"+userItem.SendDept+"</td>").appendTo(newTr);
		jQuery("<td class='rhGrid-td-left'>"+userItem.SendUser+"</td>").appendTo(newTr);	
		jQuery("<td class='rhGrid-td-left'>"+userItem.BeginTime+"</td>").appendTo(newTr);
		//jQuery("<td class='rhGrid-td-left'>"+userItem.DoneDept+"</td>").appendTo(newTr);
		jQuery("<td class='rhGrid-td-left'>"+userItem.DoneUser+"</td>").appendTo(newTr);
		jQuery("<td class='rhGrid-td-left'>"+userItem.EndTime+"</td>").appendTo(newTr);		
	});
}

//页面关闭前，移除Flash对象，避免出现错误提示。
$(window).unload( function () {
	removeFlashObject("workFlow");
} ); 
</Script>
</body>
	