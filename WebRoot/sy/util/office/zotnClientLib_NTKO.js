// 载入ZotnClient控件
var ZotnClient = ZotnClient || null;
if (!ZotnClient && typeof(FireFly) != "undefined") {
	FireFly.createZotnClient();
	ZotnClient = FireFly.getZotnClient();
}
/**
 *只读文件zotnReadOffice
 *fileName:文件名
 *downLoadUrl:下载文件url
 *showRevision:是否显示痕迹
 */
function readOfficeFile(fileName,downLoadUrl,showRevision){
	var newFileName = encodeURIComponent(fileName);
	var newDownloadUrl = encodeURIComponent(downLoadUrl);
	
	var contextPath = zotnClientNTKO._getContextPath();
	
	if (showRevision) {
		return showDialog(contextPath + "/sy/util/office/officeClient.jsp?fileName=" + newFileName + "&downLoadUrl=" + newDownloadUrl + "&fileAction=;read;print;showRevision;", window.screen.width,window.screen.height);	
	} else {
		return showDialog(contextPath + "/sy/util/office/officeClient.jsp?fileName=" + newFileName + "&downLoadUrl=" + newDownloadUrl + "&fileAction=;read;print;", window.screen.width,window.screen.height);	
	}
}


/**
 *编辑文件zotnEditOffice
 *fileName:文件名
 *downLoadUrl:下载文件url
 *upLoadUrl:上传文件url
 *revision:是否记录痕迹
 *qrCode:插入二维码
 */
function editOfficeFile(fileName,downLoadUrl,upLoadUrl,revision,qrCode){
	var newFileName = encodeURIComponent(fileName);
	var contextPath = zotnClientNTKO._getContextPath();
	if (revision) {
		return showDialog(contextPath + "/sy/util/office/officeClient.jsp?fileName=" + newFileName + "&downLoadUrl=" + encodeURIComponent(downLoadUrl) + "&upLoadUrl=" + encodeURIComponent(upLoadUrl) + "&fileAction=;edit;print;showRevision;revision;" + (qrCode?("&qrCode="+qrCode):""), window.screen.width,window.screen.height);	
	} else {
		return showDialog(contextPath + "/sy/util/office/officeClient.jsp?fileName=" + newFileName + "&downLoadUrl=" + encodeURIComponent(downLoadUrl) + "&upLoadUrl=" + encodeURIComponent(upLoadUrl) + "&fileAction=;edit;print;showRevision;" + (qrCode?("&qrCode="+qrCode):""), window.screen.width,window.screen.height);
	}
}

/**
 *判断文件的类型，如果是.doc或.xls返回true，否则返回false
 *
 *fileName:文件名
 */
 function isWordOrExcelFile(fileName){
	if(fileName == '') return false;
	var allType = ".doc|.docx|.xls|.xlsx|.ppt|.pptx|.wps|.et|";
	if(fileName.indexOf(".")<0){
		fileName = "."+fileName;
	}
	var extType = fileName.substr(fileName.lastIndexOf(".")).toLowerCase();
	if(allType.indexOf(extType+"|")>=0){
		return true;
	}else{
		return false;
	}
 }
 
 var zotnClientNTKO = {};
	/**
	*revision : 是否记录修订信息
	*/
	
	zotnClientNTKO.OnLineEditFile = function(DownloadURL, UploadURL, fileType, ifEncrypt ,revision,ifSeal){
		if(revision == undefined || revision == 'undefined'){
			revision = false;
		}
		editOfficeFile(fileType,DownloadURL,UploadURL,revision);
	}
	
	  
  /** 
  * 套红头结束之后，使用此方法打开红头文件
  */
  zotnClientNTKO.openRedHeadFile = function(downLoadUrl, upLoadUrl, fileName){
    var revision = false;
    editOfficeFile(fileName,downLoadUrl,upLoadUrl,revision);
  }
  
	
	/**
	*isRevision: 是否显示修订信息
	**/
	zotnClientNTKO.DownloadFile = function(DownloadURL, fileName ,ifEncrypt,ifDialog,ifDownload,isRevision){
		if(isRevision == 'undefined'){
			isRevision = false;
		}
		if(ifDownload == 'undefined'){
			ifDownload = false;
		}
		if(!ifDownload && isWordOrExcelFile(fileName)){
			readOfficeFile(fileName,DownloadURL,isRevision);
		}else{
			if (ZotnClient && ZotnClient.IpAddress) {
				ZotnClient.DownloadFile(getHostURL() + FireFly.getContextPath() + DownloadURL, fileName ,ifEncrypt,ifDialog,ifDownload,isRevision);
			} else {
				window.open(FireFly.getContextPath() + DownloadURL);
			}
		}
	}
	
	zotnClientNTKO._getContextPath = function(){
		if(typeof(FireFly) != "undefined"){
			return FireFly.contextPath;
		}
		
		if(typeof(FireFlyContextPath) != "undefined"){
			return FireFlyContextPath;
			
		}
		return "";
	}	

/**显示Window对话框**/
function showDialog(url,width,height){
	//return openNewWindow(url,width,height);
	var windowArgs = "width="+width+",height="+height+",toolbar=no,status=no,directories=no,menubar=no,resizable=yes,scrollable=no,scrollbars=no";
	return window.open(url,"_blank",windowArgs);
	//var dialogArgs = "scroll:no;status:off;dialogWidth:" +width+ "px;dialogHeight:"+height+"px" 
					+ ";resizable:yes";
	//return window.showModalDialog(url,window,dialogArgs);
}

function getHostURL(){
	return window.location.protocol + "//" + window.location.host;
}