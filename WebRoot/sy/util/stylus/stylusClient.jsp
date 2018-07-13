<!--平台级的jsp文件-->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--StdListView.jsp列表页面-->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%
        String   pageTitle = "手写笔输入";
        String   localPath = "C:\\\\ZotnDoc\\\\";
        String   fileName = "handwritten.bmp";
        String   uploadURL = "";
%>
<jsp:include page="/sy/util/stylus/ZotnClientLib.jsp" /> 

<BODY bgColor=white>
<body bgcolor="#ffffff"  onload="load()" >


<!-- for handwritten input area -->
<TABLE id=TABLE1 borderColor=#000000 height=480 cellSpacing=0 cellPadding=0 width="100%" border=1>
    <TBODY>
    <TR>
        <TD>
            <OBJECT id=OBJECT1 name=handwriter codeBase="/sy/util/stylus/IESignOCX.cab" classid="CLSID:0E5FCF74-F909-4C25-B436-0D0D570AEAC2" width="100%" height="100%">
                <PARAM NAME="_Version" VALUE="65536"></PARAM>
                <PARAM NAME="_ExtentX" VALUE="18441"></PARAM>
                <PARAM NAME="_ExtentY" VALUE="10478"></PARAM>
                <PARAM NAME="_StockProps" VALUE="0"></PARAM>
            </OBJECT>
        </TD>
    </TR>
    </TBODY>
</TABLE>
<BR>
<INPUT language=JavaScript id=INPUT1 onclick="javascript:uploadPic()" type=button value=确定 name=button>
<INPUT language=JavaScript id=INPUT3 onclick="javascript:handwriter.IESignClear()" type=button value=清除 name=button2>&nbsp;
<INPUT language=javascript id=INPUT2 onclick="javascript:window.close()" type=button value=取消>&nbsp;&nbsp;
<input type=hidden id=select1 value="0">
<span id="responseText"></span>
<FORM method=post>&nbsp;</FORM>
<SCRIPT language=javascript>
function load()
{
    wHeight = 600;
    wWidth = 800;
    mTop = (window.screen.height - wHeight)/2;
    mLeft = (window.screen.width - wWidth)/2;
    window.moveTo(mLeft,mTop);
    window.resizeTo(wWidth,wHeight);
    window.focus();
}
function uploadPic()
{
    handwriter.IESignSetScale(50);
    if (handwriter.IESignSaveFile("<%=localPath%><%=fileName%>"))
    {
      var host = getHostURL();
      //TODO update image file
      var result = ZotnClient.uploadFile(getHostURL() + "/file?data={\"SERV_ID\":\"OA_GW_GONGWEN\",\"DATA_ID\":\"TEST\"}","<%=fileName%>",false,false,false);
      alert("jason:" + result);
     // var array = new Function("return " + result);
    }
    else
    {
        alert("手写笔错误");
    }
 
    //调用父页面的刷新按钮
    window.opener.document.getElementById("mind-pen-refresh").click();
    window.close();
}

</SCRIPT>




</BODY>
</HTML>
