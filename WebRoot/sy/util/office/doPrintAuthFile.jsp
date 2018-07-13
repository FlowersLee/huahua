
<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>

<% String pageTitle="批量打印授权书"; %>
<%@ include file="/sy/util/stylus/ZotnClientLib.jsp" %>
<%@ include file= "/sy/base/view/inHeader.jsp" %>
<%
    String tmplId = (String) request.getParameter("tmplFileId");
%>
<SCRIPT LANGUAGE="JavaScript" src="<%=urlPath%>/sy/util/office/redHeadAuth.js"></script>
<script LANGUAGE="JavaScript" src="<%=urlPath%>/sy/util/office/fileOperator.js"></script>
<center>
    <div id="dangdang" style='width:468px;height:60px;z-index: 1'>
        正在打印授权书...
    </div>
</center>


<SCRIPT  LANGUAGE="JavaScript">
var wordApp;

var redHead = new RedHead();

var docFileIds = window.dialogArguments;

cyclePrintFile();
function cyclePrintFile() {
	jQuery.each(docFileIds.split(","), function(i, docFileId) {
	    printWordDoc(docFileId);
	});
	
	alert("打印完成");
	
	window.close();
}

function printWordDoc(docId){
	try {
		var tempDownloadURL = getHostURL() + "/file/" + docId;
		
		var tempFileName = ZotnClient.DownloadFile(tempDownloadURL, "demo_file.doc" ,false,false,true,false);
		
		printDoc(tempFileName);
	}catch(e){
		alert(e.message);
	}
}

//打印Word文件
function printDoc(fileName){
	var wordDoc;
	fileName = "c:\\ZotnDoc\\" + fileName;
	try {
		createApp();
		wordDoc = wordApp.documents.open(fileName);
		wordDoc.ShowRevisions = false;
		wordDoc.PrintRevisions = false;
		wordDoc.TrackRevisions = false;
		wordDoc.AcceptAllRevisions();
		//wordApp.visible = true;
		wordDoc.printout();
		//wordDoc.close(0);
	}catch(e){
		alert(e.message);
		closeApp();
	}
}

function createApp(){
	if(wordApp ==null || wordApp ==undefined) {
		try{
			wordApp = new ActiveXObject("Word.Application");
		}catch(e){
			throw e;
		}
	}
}

function closeApp(){
	if (wordApp ==null || wordApp==undefined) {
		
	} else {
		wordApp.documents.close(0);
		wordApp.quit(0);
		wordApp = null;
	}
}
</script>
