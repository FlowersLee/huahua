<!--平台级的jsp文件  reference:rs1.5b/public-html/msv/include/include_client.jsp -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--StdListView.jsp列表页面-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.rh.core.base.*" %>
<%@ page import="com.rh.core.serv.*" %>
<%@ page import="com.rh.core.util.*" %>
<%@ page import="com.rh.core.comm.*" %>

<% String pageTitle="正在处理文件"; %>
<%@ include file="/sy/util/stylus/ZotnClientLib.jsp" %>
<%

//test code
/*	
	String gwId = "1GBaBQRjV5WVjYO5eLbo49";
	String servId = "servId";
	String dataId = "dataId";
	String history ="3vzZAIk81feWOTzzadk2o2.doc";
*/
    String gwId =  (String) request.getParameter("gwId");
	String servId =  (String) request.getParameter("servId");
	String dataId =  gwId;
	String source = (String) request.getParameter("source");
	String target = (String) request.getParameter("target");
    String contextPath = request.getContextPath();
%>
<script LANGUAGE="JavaScript" src="<%=contextPath%>/sy/util/office/fileOperator.js"></script>
<SCRIPT LANGUAGE="JavaScript">

    function showStartMsg(){
        document.write("<center><div id=dangdang style='width:468px;height:60px;z-index: 1'><img src='<%=contextPath%>/sy/util/office/waiting.gif' width=468 height=60></div></center>");
        return 0;
    }

    function showStatus(msg){
        window.status = msg;
    }

    function showEndMsg(){
        dangdang.innerHTML = "<center><font  style=\"font-size:18px; font-weight: bold; line-height:24px\" >处理文件结束,请手工调整!</font></center>";
    }

</SCRIPT>

<SCRIPT  LANGUAGE="JavaScript">
var redHead = new RedHead();
function insertdata(){
    showStatus("正在生成文件正文,请等待....");
 
}
/**
 *扫描文件，并将其上传为正文
 *
 **/
function scanPDF( gwID , ifEncrypt )
{
        var UploadURL   = "";
        //UploadURL=encodeURI(UploadURL);
        try{
            ZotnClient.ScanPDF(UploadURL,ifEncrypt);
        }catch(e){
            alert(e.message);
            return;
        }
       // window.location.reload();
       alert("done!");
}


</script>

<script LANGUAGE=javascript>
    showStartMsg();
  //  insertdata();
    setTimeout("insertdata()",4000);
</script>

