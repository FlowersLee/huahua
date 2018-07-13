
<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>

<% String pageTitle="正在处理模板文件"; %>
<%@ include file="/sy/util/stylus/ZotnClientLib.jsp" %>
<%@ include file= "/sy/base/view/inHeader.jsp" %>
<%
    String tmplId = (String) request.getParameter("tmplFileId");
    String contextPath = request.getContextPath();
%>
<SCRIPT LANGUAGE="JavaScript" src="<%=contextPath%>/sy/util/office/redHeadAuth.js"></script>
<script LANGUAGE="JavaScript" src="<%=contextPath%>/sy/util/office/zotnClientLib_NTKO.js"></script>
<script LANGUAGE="JavaScript" src="<%=contextPath%>/sy/util/office/fileOperator.js"></script>
<center>
    <div id="dangdang" style='width:468px;height:60px;z-index: 1'>
        正在生成授权书...
    </div>
</center>


<SCRIPT  LANGUAGE="JavaScript">
var redHead = new RedHead();

var fileListObj = window.dialogArguments;

cycleDoFile();
function cycleDoFile() {
    var sleepValue = 1;
	jQuery.each(fileListObj,function(i, fileItem) {
	    insertdata(fileItem);
	});
	
	alert("完成");
	
	
	window.close();
}


function insertdata(fileItem){
    var UploadURL;
    var TempDownloadURL;

    UploadURL   =  "/file/"+fileItem.targetId+"?data={'SERV_ID':'LW_AUTH_FILE','DATA_ID':'"+fileItem.FILE_ID+"','SOURCE_ID':'123','FILE_CAT':'AUTHFILE','DIS_NAME':'"+fileItem.FILE_CODE_NUM+"'}";

	UploadURL = getHostURL() + encodeURI(UploadURL);
	//alert(UploadURL);
	
    TempDownloadURL = getHostURL() + "/file/<%=tmplId%>";
    
	var tempFileName = ZotnClient.DownloadFile(TempDownloadURL, "demo_file.doc" ,false,false,true,false);
	
	var barCodeImgName = getHostURL() + "/tmp/" + fileItem.FILE_ID + ".png";
	var barCodeImg = ZotnClient.DownloadFile(barCodeImgName, "demo_file.png" ,false,false,true,false);

	redHead.createWord("c:\\ZotnDoc\\" + fileItem.FILE_CODE_NUM + ".txt","c:\\ZotnDoc\\"+tempFileName,tempFileName);

    redHead.repleaceMarker("#FILE_CODE_NUM#", fileItem.FILE_CODE_NUM);
	redHead.repleaceMarker("#AUTH_USER_IDENTI#", fileItem.AUTH_USER_IDENTI);
	redHead.repleaceMarker("#AUTH_USER_NAME#", fileItem.AUTH_USER_NAME);
	redHead.repleaceMarker("#FILE_ORG#", fileItem.FILE_ORG);
	redHead.repleaceMarker("#FILE_IDENTI#", fileItem.FILE_IDENTI);
	redHead.repleaceMarker("#FILE_USER_NAME#", fileItem.FILE_USER_NAME);
	redHead.repleaceMarker("#AUTH_BTIME#", fileItem.AUTH_BTIME);
	redHead.repleaceMarker("#AUTH_ETIME#", fileItem.AUTH_ETIME);

	redHead.repleaceMarker("#AUTH_DOC_TITLE#", fileItem.AUTH_DOC_TITLE);
	redHead.repleaceMarker("#FILE_DOC_AUTH_STR#", fileItem.FILE_DOC_AUTH_STR);
	redHead.repleaceMarker("#FILE_DOC_AUTHED_STR#", fileItem.FILE_DOC_AUTHED_STR);	
	
	//alert(fileItem.detailList);
	//saveFile(fileItem.detailList, "c:\\ZotnDoc\\"+fileItem.FILE_CODE_NUM + ".txt");
	//redHead.repleaceMarker("#DETAILLIST#", fileItem.detailList);

    redHead.replaceText(fileItem.detailList);
	
	redHead.replaceBookmarkWithImg("barCode","c:\\ZotnDoc\\" + barCodeImg, "72", "72");
	
    var downLoadFileName = redHead.downLoadFileName;

    redHead.clearResource();
	try{
	var result = ZotnClient.uploadFile(UploadURL,downLoadFileName,false,false,false);
	} catch(e) {alert(e.message);}
	
	//var showInfo = jQuery("#dangdang").val() + "<br>" + fileItem.FILE_CODE_NUM;
	//alert(showInfo);
	//jQuery("#dangdang").val(showInfo);
	document.getElementById("dangdang").innerHTML += "<br>" + fileItem.FILE_CODE_NUM;
}

/*
 *   保存文件
*/
function saveFile(sContent,sFileName){
	try{
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		var textStream = fso.CreateTextFile(sFileName,true);
		textStream.Write(sContent);
		textStream.close();
	}catch(e){
		throw e.message;
	}
}



</script>
