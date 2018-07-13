<!--平台级的jsp文件-->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--StdListView.jsp列表页面-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.rh.core.base.*" %>
<%@ page import="com.rh.core.serv.*" %>
<%@ page import="com.rh.core.util.*" %>
<%@ page import="com.rh.core.comm.*" %>

<% String pageTitle="正在处理红头文件"; %>
<%@ include file="/sy/util/stylus/ZotnClientLib.jsp" %>
<%
	//test code
/*	
	String gwId = "1GBaBQRjV5WVjYO5eLbo49";
	String servId = "servId";
	String dataId = "dataId";
	String history ="3vzZAIk81feWOTzzadk2o2.doc";
*/
    String contextPath = request.getContextPath();

    String gwId =  (String) request.getParameter("gwId");
	String servId =  (String) request.getParameter("servId");
	String dataId =  gwId;
	String source = (String) request.getParameter("source");
	String target = (String) request.getParameter("target");
	String tmplId = (String) request.getParameter("cwTmplFileId");
	
	Bean gwBean = ServDao.find("OA_GW_GONGWEN", new Bean().setId(gwId));
	String zhengwenName = "正文";
    String fileExt = "fileExt"; // redHeadForm.getTemplateFileExt();
    String templateName = "templateName";
    String seqId = "seqId"; //redHeadForm.getTemplateName();
    String fileId = "fileId"; //String.valueOf(redHeadForm.getId());
    String username = gwBean.getStr("S_UNAME");  //redHeadForm.getUserName();

    String fileDept= gwBean.getStr("GW_YEAR_CODE"); //redHeadForm.getYearCode();
    String fileSecret= "密级:" + DictMgr.getName ("GW_SECRET", gwBean.getStr("GW_SECRET")); //redHeadForm.getSecret();
    String fileEmergy= "缓级:" + DictMgr.getName ("GW_EMERGENCY", gwBean.getStr("GW_EMERGENCY")); //redHeadForm.getEmergency();
    String companyname= "companyname"; //redHeadForm.getCompanyFullName();
    String fileHead= "fileHead"; //redHeadForm.getFileHead();
    String dfterDept= gwBean.getStr("GW_ZB_TDEPT"); //redHeadForm.getDeptTopName();

    String dfterName= gwBean.getStr("GW_CONTACT"); //redHeadForm.getContactName();
    String dfterTel=gwBean.getStr("GW_CONTACT_PHONE"); //redHeadForm.getContactPhone();
    String fileYear= gwBean.getStr("GW_YEAR"); //String.valueOf(redHeadForm.getYear());
    String fileNum= gwBean.getStr("GW_YEAR_NUMBER"); //String.valueOf(redHeadForm.getYearNumber());
    String fileTitle= gwBean.getStr("GW_TITLE"); //redHeadForm.getTitle();
    String note= gwBean.getStr("S_WF_NODE"); //StringUtils.replaceIgnoreCase(redHeadForm.getNote(), "String.fromCharCode(13)","\"\\r\\n\"");
    String Text="text"; //redHeadForm.getFileContent();
    String annex="tAttachment";  //StringUtils.replaceIgnoreCase(redHeadForm.getAttachment(), "String.fromCharCode(13)","\"\\r\\n\"");
    String saveYear="2003"; //redHeadForm.getSaveYear();
    String finishUserName = gwBean.getStr("GW_END_USER"); //redHeadForm.getFinishUserName();

    String chineseday= DateUtils.getChineseDate() ; //redHeadForm.getChineseDay();
    String topicWord= gwBean.getStr("GW_TOPIC"); //redHeadForm.getTopic();
    String mainTo= gwBean.getStr("GW_MAIN_TO"); //redHeadForm.getMainTo();
    String copyTo= gwBean.getStr("GW_COPY_TO"); //redHeadForm.getCopyTo();
    String copyupTo= gwBean.getStr("GW_COPYUP_TO"); //redHeadForm.getCopyupTo();
    String num=  gwBean.getStr("GW_COPIES"); //String.valueOf(redHeadForm.getCopies());
    
    String printTo =gwBean.getStr("GW_PRINT");
    String signName = gwBean.getStr("GW_SIGN_UNAME");
    String fileType ="fileType";
    String yearCode= gwBean.getStr("GW_YEAR_CODE");
    String yearNumber = gwBean.getStr("GW_YEAR_NUMBER");
    String memo = gwBean.getStr("GW_MEMO");
    String pageValue = gwBean.getStr("GW_PAGE");
    String title = gwBean.getStr("GW_TITLE");
    String cwDeptName = "cwDeptName";
    String deptName = gwBean.getStr("S_DNAME");
    String codeTime = gwBean.getStr("GW_CODE_TIME");
    String cosignTo = gwBean.getStr("GW_COSIGN_TO");
    String signInfo = "signInfo";
    String beginTime = gwBean.getStr("GW_BEGIN_TIME");
    String beginTimeChinese = "beginTimeChinese";
    String currentDateChinese = "currentDateChinese";
    String fromCode ="fromCode";

    String date = DateUtils.getDate(); //Datetime.getCurrentDateByString().trim();
    String year = date.substring(0,4);
    String month = date.substring(5,7);
    if (month.startsWith("0"))
        month=month.substring(1,2);
    String day = date.substring(8,10);
    if (day.startsWith("0"))
        day=day.substring(1,2);
		
	String hy_date="";
	String sendto= gwBean.getStr("GW_SEND_TO"); //redHeadForm.getSendTo();
	
    String psMindList = "psMindList-mind-cdoe, psMindList-mind-code2"; //StringUtils.replaceIgnoreCase(redHeadForm.getPsMindList(), "String.fromCharCode(13)","\"\\r\\n\"");
    String hgMindList = "hgMindList-mind-cdoe, hgMindList-mind-code2"; //StringUtils.replaceIgnoreCase(redHeadForm.getHgMindList(), "String.fromCharCode(13)","\"\\r\\n\"");
    String hqMindList = "hqMindList-mind-cdoe, hqMindList-mind-code2"; //StringUtils.replaceIgnoreCase(redHeadForm.getHqMindList(), "String.fromCharCode(13)","\"\\r\\n\"");
    String qfMindList = "qfMindList-mind-cdoe, qfMindList-mind-code2"; //StringUtils.replaceIgnoreCase(redHeadForm.getQfMindList(), "String.fromCharCode(13)","\"\\r\\n\"");

    String userPhone = gwBean.getStr("GW_CONTACT_PHONE"); //redHeadForm.getContactPhone();
    String titlelength="20";
    String min="7";
    int length=Integer.parseInt(titlelength);
    int minlength=Integer.parseInt(min);
    
    int subForUserId = 1;
    Bean serv = ServUtils.getServDef(servId);
    String fileServId = servId;
    if (!serv.isEmpty("SERV_PID")) {
    	fileServId = serv.getStr("SERV_PID");
    }
%>
<SCRIPT LANGUAGE="JavaScript" src="<%=contextPath%>/sy/util/office/redHead.js"></script>
<script LANGUAGE="JavaScript" src="<%=contextPath%>/sy/util/office/zotnClientLib_NTKO.js"></script>
<script LANGUAGE="JavaScript" src="<%=contextPath%>/sy/util/office/fileOperator.js"></script>
<SCRIPT LANGUAGE="JavaScript">

    function warn(){
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
    var annex;
    var psMindList;
    var hgMindList;
    var hqMindList;
    var qfMindList;
    var titlelength;
    var minlength;
    var DownloadURL;
    var UploadURL;
    var TempDownloadURL;
    var fileID;

    annex = "annex";
    psMindList = "<%=psMindList%>";
    hgMindList = "<%=hgMindList%>";
    hqMindList = "<%=hqMindList%>";
    qfMindList = "<%=qfMindList%>";
    titlelength = "<%=titlelength%>";
    minlength = "<%=minlength%>";

    fileID = "fileId";

//    DownloadURL = "http://172.16.0.168:8080/sy/util/office/demo_file.doc";
//    UploadURL   = "http://172.16.0.168:8080";
//    TempDownloadURL = getHostUR() + "cm/office/red_head_tmpl.doc";
    DownloadURL = getHostURL() + "/file/<%=source%>"; 

    
    UploadURL   =  "/file/<%=target%>?data={SERV_ID:<%=fileServId%>,DATA_ID:<%=dataId%>,SOURCE_ID:<%=source%>,FILE_CAT:ZHENGWEN,handler:redhead,DIS_NAME:ZHENGWEN}";
//    TempDownloadURL = getHostURL() +  "/sy/util/office/red_head_tmpl.doc";
    TempDownloadURL = getHostURL() + "/file/<%=tmplId%>";
    
	var needEncrypt = false;
	//从服务器上下载到本地
	var fileName = ZotnClient.DownloadFile(DownloadURL, "demo_file.doc" ,false,false,true,false);
	var tempFileName = ZotnClient.DownloadFile(TempDownloadURL, "demo_file.doc" ,false,false,true,false);
	redHead.createWord("c:\\ZotnDoc\\"+fileName,"c:\\ZotnDoc\\"+tempFileName,tempFileName);
	redHead.repleaceMarker("#fileEmergy#","<%=fileEmergy%>");

    <%if (saveYear.trim().length()>0) {%>
    redHead.repleaceMarker("★","<%=saveYear%>★");
    <%} else {%>
    redHead.repleaceMarker("★","<%=saveYear%>");
    <%}%>

     replaceTag(redHead,"#note#","<%=note%>");
     redHead.repleaceMarker("#fileSecret#","<%=fileSecret%>");
     redHead.repleaceMarker("#companyname#","<%=fileHead%>");
     redHead.repleaceMarker("#fileDept#","<%=fileDept%>");
     redHead.repleaceMarker("#fileYear#","<%=fileYear%>");
     redHead.repleaceMarker("#fileNum#","<%=fileNum%>");
     redHead.repleaceMarker("#fnshrName#","<%=finishUserName%>");
     redHead.repleaceMarker("#chineseday#","<%=chineseday%>");
     replaceTag(redHead, "#mainTo#","<%=mainTo%>");
     replaceTag(redHead,"#annex#",annex);
     redHead.repleaceMarker("#dfterDept#","<%=dfterDept%>");
     redHead.repleaceMarker("#num#","<%=num%>");
     redHead.repleaceMarker("#day#","<%=day%>");
     redHead.repleaceMarker("#month#","<%=month%>");
     redHead.repleaceMarker("#year#","<%=year%>");
     replaceTag(redHead,"#topicWord#","<%=topicWord%>");
     replaceTag(redHead,"#printTo#","<%=printTo%>");
     redHead.repleaceMarker("#signName#","<%=signName%>");
     redHead.repleaceMarker("#fileType#","<%=fileType%>");
     redHead.repleaceMarker("#yearCode#","<%=yearCode%>");
     redHead.repleaceMarker("#yearNumber#","<%=yearNumber%>");
     replaceTag(redHead,"#memo#","<%=memo%>");
     redHead.repleaceMarker("#page#","<%=pageValue%>");
     redHead.repleaceMarker("#sendto#","<%=sendto%>");
     redHead.repleaceMarker("#title#","<%=title%>");
     redHead.repleaceMarker("#cwDeptName#","<%=cwDeptName%>");
     redHead.repleaceMarker("#deptName#", "<%=deptName%>");
     redHead.repleaceMarker("#username#","<%=username%>");
     redHead.repleaceMarker("#topic#", "<%=topicWord%>");
     replaceTag(redHead,"#copyTo#","<%=copyTo%>");
     redHead.repleaceMarker("#codeTime#","<%=codeTime%>");
     replaceTag(redHead,"#dfterName#","<%=dfterName%>");
     replaceTag(redHead,"#huiyitime#","<%=sendto%>");
     replaceTag(redHead,"#cosignTo#","<%=cosignTo%>");
     replaceTag(redHead, "#copyupTo#","<%=copyupTo%>");
     replaceTag(redHead,"#signInfo#","<%=signInfo%>");
     redHead.repleaceMarker("#beginTime#","<%=beginTime%>");
     redHead.repleaceMarker("#beginTimeChinese#","<%=beginTimeChinese%>");
     redHead.repleaceMarker("#currentDateChinese#","<%=currentDateChinese%>");
     redHead.repleaceMarker("#fromCode#","<%=fromCode%>");

     redHead.repleaceMarker("#userPhone#","<%=userPhone%>");
     redHead.repleaceMarker("#fileTitle#", "<%=fileTitle%>");
     replaceTag(redHead,"#psMindList#",psMindList);
     replaceTag(redHead,"#hgMindList#",hgMindList);
     replaceTag(redHead,"#hqMindList#",hqMindList);
     replaceTag(redHead,"#qfMindList#",qfMindList);
     redHead.replaceText();
     var downLoadFileName = redHead.downLoadFileName;
  	redHead.clearResource();
  	alert(UploadURL);
 	 var flag = zotnClientNTKO.openRedHeadFile("file:\\c:/ZotnDoc/"+downLoadFileName,UploadURL,downLoadFileName);
 	//var flag = zotnClientNTKO.openRedHeadFile("http://172.16.0.168:8080/sy/util/office/demo_file.doc",UploadURL,downLoadFileName);
	if(!(flag == 'undefined')) {
//		history.go(-1);
		showStatus("完成");
		ZotnClient_redHeadWordQuit();
		redHead.clearResource();
	}
}


function ZotnClient_redHeadWordQuit(){
//    var url = "/servlet/com.zotn.screens.msv.GongwenServlet?"+
//          "func=showWfModify&wfActID=wfActId" +
//         "<%if(subForUserId>0){%>&subForUserId=<%=subForUserId%><%}%>"; 
//   window.parent.navigate(url)
}


function replaceTag(redHead,tag,value){
	redHead.repleaceMarker(tag,value);
}

</script>

<script LANGUAGE=javascript>
    warn();
  //  insertdata();
    setTimeout("insertdata()",4000);
</script>

