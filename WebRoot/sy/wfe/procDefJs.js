/*
 * 保存文件
*/
function saveFile(sContent,sFileName){
	sFileName = "D:\\workflow.xml";
	var sFileName = window.prompt("请输入您要保存的文件名:",sFileName); 
	if(sFileName==null)
		sFileName = "D:\\workflow.xml";

	try{
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		//alert("test1");
		var textStream = fso.CreateTextFile(sFileName,true);
		textStream.Write(sContent);
		textStream.close();
		alert("已经保存到目录" + sFileName);
	}catch(e){
		//alert(e);
		throw e.message;
	}
}

/**
 * 弹出选择框
 */
function selectFileEvt() {
    jQuery("#slectFileId").click();
}

/**
 * 弹出选择框
 */
function readFileContent() {
	var file = jQuery("#slectFileId").val();
	var content = "";
	try {
		var fso = new ActiveXObject("Scripting.FileSystemObject");  
		var reader = fso.openTextFile(file, 1);
		while(!reader.AtEndofStream) {
			content += reader.readline();
			//content += "\n";  换行先不要
		}
		reader.close();
	} catch (e) { 
		alert("Internet Explore read local file error: \n" + e); 
	}
	//alert(content);
	var obj=getFlashObject("workFlow");	
	obj.newFileXml(content);
	return content;	
}


var jsReady=false;  
function isReady() {  
    return jsReady;  
}  

/**
 * 获取flash对象
 */
function getFlashObject(movieName) {  
	var movie;
	if (navigator.appName.indexOf("Microsoft") != -1) {  //alert("IE"); 
		if (typeof (window[movieName].outPutXml) == 'function') { // < IE9   
			movie = window[movieName];   
		} else if (typeof (document[movieName].outPutXml) == 'function') { // >= IE9    
		    movie = document[movieName];         
		} 
	} else { // NON IE         
	    movie = document[movieName];     
	}   

	return movie;
} 

function getSWF(movieName) { 
	if (navigator.appName.indexOf("Microsoft") != -1) { 
	    return  document[movieName];  
	} else { 
	    return document[movieName+"_em"];  
	}  
}

/**是否已经选择服务ID**/
function checkServId(){
	var SERV_ID = _parentViewer.getItem('SERV_ID').getValue();
	if (SERV_ID.length <= 0) {
	    alert("请选择 服务编码");
	    return false;
	}
	
	return true;
}

/**
 * 打开节点定义弹出窗
 */ 

var nodeJosnStr;

function innerOpenNodeDefDlg(node){
	if(!checkServId()){
		return;
	}
	//往节点上给默认值

	
	var SERV_ID = _parentViewer.getItem('SERV_ID').getValue();
	var nodeObj = eval("(" + nodeJosnStr + ")");
	var SERV_PID = _parentViewer.getItem('SERV_PID').getValue();
	nodeObj.SERV_ID = SERV_ID;
	nodeObj.SERV_PID = SERV_PID;
		
	//取服务的附件字段上的 文件类型    
	var servDef = FireFly.getServMainData(SERV_ID);
		nodeObj.servDef = servDef;
	var dialogPage = null;	
	switch(nodeObj.NODE_TYPE){
		case '1' :
		case '2' :
		case '3' :
			dialogPage = 'node.jsp';
			break;
		case '4' :
			dialogPage = 'procnode.jsp';
			break;
		default : 
			alert('未知的结点类型');
			return;
	}
	
	var rtnObj = window.showModalDialog(dialogPage,nodeObj,"dialogWidth:1000px;dialogHeight:500px;center:yes;resizable:yes;status=no");

	if(typeof(rtnObj) == "object"){
		saveNodeInfo(rtnObj,rtnObj.NODE_NAME);	  
	}
}


function openNodeDefDlg(node){	
	nodeJosnStr=node;
	setTimeout('innerOpenNodeDefDlg("")',1);	
}

var lineJosnStr;
/**
 * 打开线的弹出框
 */
function innerOpenLineDefDlg(lineDef){
	if(!checkServId()){
		return;
	}

	var lineObj = eval("(" + lineJosnStr + ")");
	lineObj.SERV_ID = _parentViewer.getItem('SERV_ID').getValue();
	var rtnObj = window.showModalDialog("line.jsp",lineObj,"dialogWidth:1000px;dialogHeight:500px;center:yes;resizable:yes;status=no");
	
	if(typeof(rtnObj) == "object"){  
		saveNodeInfo(rtnObj,rtnObj.LINE_COND_NAME);
	}
}

function openLineDefDlg(lineDef){	
	lineJosnStr=lineDef;
	setTimeout('innerOpenLineDefDlg("")',1);	
}
function saveNodeInfo(rtnObj,lable){
	 var retStr=JSON.stringify(rtnObj);
	 var flash = document.getElementById("workFlow");
	 flash.saveJosn(retStr);
	 flash.saveNodeLabel(lable);
}

var JSON = JSON || {};

JSON.stringify = JSON.stringify || function (obj) {
    var t = typeof (obj);
    if (t != "object" || obj === null) {
        // simple data type
        if (t == "string") obj = '"'+obj+'"';
        return String(obj);
    }else {
        // recurse array or object
        var n, v, json = [], arr = (obj && obj.constructor == Array);
        for (n in obj) {
            v = obj[n]; t = typeof(v);
            if (t == "string") v = '"'+v+'"';
            else if (t == "object" && v !== null) v = JSON.stringify(v);
            json.push((arr ? "" : '"' + n + '":') + String(v));
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
};
 
/**
 * 通过服务 ID 取出 支持的文件列表
 */
function getFileTypeList(servId){
	var reqdata = {};	
	reqdata["SERV_ID"] = servId;	
    
    var resultFileTypeStr = rh_processData("SY_WFE_PROC_DEF.getServFileType.do",reqdata);
	
	return resultFileTypeStr.rtnStr;
}

/**
 * 打开连线定义弹出窗
 */
var xml ="<?xml version=\"1.0\" encoding=\"UTF-8\"?><AddFlow Nodes='0' Links='0' processType=\"BPEL\" maxId=\"1\"  category=\"Business\"></AddFlow>";
	
function getXml(){
	return xml;
}


function getMode(){
	return 1;
}


function saveXml(json){
	window.clipboardData.setData("Text",json) ;

}

//设置节点默认宽高
function getNodeWH(){
	var width = 85; //缺省宽高
	var height = 30;
	var nodeSize = System.getVar("@C_SY_WF_NODE_SIZE@");
	if (nodeSize) {
		var sizes = nodeSize.split(",");
		width = parseInt(sizes[0]);
		height = parseInt(sizes[1]);
	}
	return [width,height];
}

//设置备注框宽高,宽制约左备注,高制约顶部备注
function getBeizhuWH(){
	return [60,30];
}

//装载流程定义
$(document).ready(function(){
	//var procDefId = _parentViewer.getItem('PD_ID').getValue();
	var procCode = _parentViewer.getItem('PROC_CODE').getValue();
	var reqProcCmpy = _parentViewer.getItem('S_CMPY').getValue();
	var reqProcENName = _parentViewer.getItem('EN_NAME').getValue();	
	var SERV_ID = _parentViewer.getItem('SERV_ID').getValue();	
	var SERV_PID = _parentViewer.getItem('SERV_PID').getValue();	
	$("#SERV_ID").val(SERV_ID);
	$("#SERV_PID").val(SERV_PID);
	
	//两种方式取xml数据，第一种是 异步的从目录下读取 xml文件；第二种 直接从数据库中取的数据
	if(procCode.length > 0){
		
		var reqdata = {};
		reqdata["PROC_CODE"] = procCode;	
		reqdata["S_CMPY"] = reqProcCmpy;	
		reqdata["EN_NAME"] = reqProcENName;	

		xml = _parentViewer.getItem('PROC_XML').getValue();
		
		jsReady=true; 
	};
	
	jQuery(window).resize(function(){
		try{
			var height = jQuery(this).height() -10;
			var obj = getFlashObject("workFlow");
			obj.height = height;
		}catch(e){
			
		}
	});
});

//取得定义结果
function showWorkflowDefXml(){
	var obj=getFlashObject("workFlow");
	
	var result = obj.outPutXml();
	
	return result;
}

//页面关闭前，移除Flash对象，避免出现错误提示。
$(window).unload( function () {
	removeFlashObject("workFlow");
} ); 