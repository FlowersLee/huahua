var PROTECTED_TYPE = {
		REVISION:0 //保护痕迹
		,FORM_FIELDS:2 //
		,COMMENTS:1 //
};

var DOC_TYPE = {
	"word":1,
	"excel":2,
	"wps":6,
	"et":7
}

/**可用的Word/Wps软件版本**/
var APP_VALID_VER = {
	"word":"",
	"wps":""
}

/**
* 相关参数:
* edit：是否是编辑文件
* read：是否查看文件
* revision：编辑文件时是否记录痕迹
* showRevision: 查看文件时，是否显示痕迹
* extName: 文件扩展名
* existOffice:是否存在MS office
* existWps:是否存在WPS office
* WORD、WPS客户端不存在则返回版本号为100.
**/
var _officeParam = {
	"edit" : false, //编辑文件
	"read" : false, //只读
	"print" : false,
	"revision" : false, //是否记录痕迹
	"showRevision" : false , //是否显示痕迹
	"extName" : "", //文件扩展名
	"existOffice" : false,
	"existWps" : false,
	"officeVer" : 100,
	"wpsVer": 100,
	"VER_NULL": 100,
	"currentApp": "", //Word、Wps
	"localFile": "", //本地文件地址
	"isLocalFile": false, //是否本地文件
	"httpUrl": "", //网络地址
	"setOfficeVer": function(ver){
		this.officeVer = ver;
		if(ver != this.VER_NULL){
			this.existOffice = true;
		}
	},
	"setWpsVer": function(ver){
		this.wpsVer = ver;
		if(ver != this.VER_NULL){
			this.existWps = true;
		}		
	}
}
	
	
var PROTECTED_PASSWD = "zotnOA@1234";
var zotn = {};
zotn.office = function (TANGER_OCX) {
	var doc = TANGER_OCX.ActiveDocument;
	var docType = TANGER_OCX.DocType;
	this.docType = docType;
	this.nokoOcx = TANGER_OCX;
	
	/**设置文件为只读*/
	this.protect = function (type){
		if(docType == DOC_TYPE.word || docType == DOC_TYPE.wps){
			if(doc.ProtectionType == -1){
				doc.protect(type,true,PROTECTED_PASSWD);
			}
		}
	}
	
	/**保护痕迹**/
	this.protectRevision = function(){
		if(docType == DOC_TYPE.word){
			if(doc.ProtectionType == -1){
				var revision = doc.ShowRevisions;
				doc.Protect(PROTECTED_TYPE.REVISION, true, PROTECTED_PASSWD);
				doc.ShowRevisions = revision;
			}
		}else if(docType == DOC_TYPE.wps){
			if(doc.ProtectionType == -1){
				doc.Protect(PROTECTED_TYPE.REVISION, true, PROTECTED_PASSWD);
			}
		}else if(docType == DOC_TYPE.excel){
			//var excelApp = doc.Application;
			//var excelWorkBook = doc.Application.activeWorkbook;
			
            //if(!excelWorkBook.MultiUserEditing){
			//	TANGER_OCX_OBJ.activate(true);
            //    if(_officeParam.officeVer > 9){
			//		excelWorkBook.RemovePersonalInformation = false;
            //    }
				
                //将文件设置为共享模式accessmode:=xlShared, CreateBackup:=False, AddToMru:=False
                //excelWorkBook.SaveAs(_officeParam.localFile,null,null,null,null,false, 2,null, false);
                //保护共享模式
                //excelWorkBook.ProtectSharing(_officeParam.localFile);
				//excelApp.DisplayAlerts = false;
				//alert(excelApp.DisplayAlerts);
				
                //excelApp.ScreenUpdating = true;
            //}
            
            //if(excelWorkBook.MultiUserEditing){
                //显示修订痕迹
                //excelWorkBook.HighlightChangesOptions(2);
                //excelWorkBook.HighlightChangesOnScreen = true;
                //excelWorkBook.ListChangesOnNewSheet = false;
            //}
		}else if(docType == DOC_TYPE.et){
			//TANGER_OCX_OBJ.SetReadOnly(true,PROTECTED_PASSWD);
		}
	}
	
	/**取消保护痕迹**/
	this.unprotectRevision = function(){
		if(docType == DOC_TYPE.word){
			if(doc.ProtectionType == 0){
				doc.Unprotect(PROTECTED_PASSWD);
			}
		}else if(docType == DOC_TYPE.wps){
			if(doc.ProtectionType == 0){
				doc.Unprotect(PROTECTED_PASSWD);
			}
		}	
	}
	
	/**接受修订*/
	this.acceptAllRevisions = function (){
		//文档是受保护的则不接受修订
		if(docType == DOC_TYPE.word){
			if(doc.Protected){
				return;
			}
			if(doc.Revisions.Count >= 1){
				doc.AcceptAllRevisions();
			}
		}else if(docType == DOC_TYPE.wps){
			if(doc.Protected){
				return;
			}
			if(doc.Revisions.Count >= 1){
				doc.AcceptAllRevisions();
			}
		}
	}
	
	/**
	*	改变单元格的焦点，修正wps的bug：WPS编辑excel时，最后修改的单元格焦点不切换到其它地方，则不能保存这个单元格的值
	*/
	this.changeCellFocus = function() {
		if(_officeParam.currentApp == "wps" 
			&& ( _officeParam.extName == ".xlsx"
				|| _officeParam.extName == ".xls"
				|| _officeParam.extName == ".et"
				)
			){
			//doc.Application.ActiveSheet.cells(2,2).select();
			//doc.Application.ActiveSheet.cells(1,1).select();
			var wpsassist = new ActiveXObject("wpsassist2012.forNTKO");
			wpsassist.OutCell3260(TANGER_OCX_OBJ.GetWindowHandle(), true);
		}
	}
	
	/**
	* 隐藏特殊菜单
	**/
	this.hideMenuBtn = function() {
		if(_officeParam.currentApp == "wps" 
			&& ( _officeParam.extName == ".xlsx"
				|| _officeParam.extName == ".xls"
				|| _officeParam.extName == ".et"
				)
			){
			
			
			
			//隐藏wps et菜单上的按钮
			var excelApp = TANGER_OCX.ActiveDocument.application;
			var menuIds = [1377,864,865,866,867];
			for(var i=0;i<menuIds.length;i++){
				/**
				try{
					var controls = excelApp.CommandBars.FindControls(menuIDs[i]);
					if(!controls){
						var count = controls.count;
						alert("count:" + count);
						for(var m=0;m<count;m++){
							var control = controls.item(m);
							control.Enabled = false;
						}
					}
				}catch(e){
				
				}**/
			}
		}
	}
	
	/**
	*	检查版本是否符合要求
	**/
	this.checkVersion = function(){
		if(_officeParam.currentApp == "wps" ){
			var wpsVer = APP_VALID_VER.wps;
			if(wpsVer && wpsVer.length > 0){
				var actVer = TANGER_OCX.ActiveDocument.application.build;
				
				var result = compareVer(wpsVer,actVer);
				if(result > 0){
					alert("本系统的wps版本不符合要求，请安装Wps" + APP_VALID_VER.wps + "版本。");
					return false;
				}
			}
		}
		
		return true;
	}
	
	/**比例版本号，如果相等返回0，大于返回1，小于返回-1**/
	function compareVer(defVer,actVer){
		var defVers = defVer.split(".");
		var actVers = actVer.split(".");
		for(var i=0;i<defVers.length;i++){
			var defVerNum = parseInt(defVers[i]);
			if(actVers.length > i){
				var actVerNum = parseInt(actVers[i]);
				if(defVerNum > actVerNum){
					return 1;
				}else if(defVerNum < actVerNum){
					return -1;
				}
			}
		}
		return 0;
	}
	
	/**
	*	取得当前编辑器使用的wps还是office。
	**/
	this.getAppName = function(){
		try{
			var appName = TANGER_OCX.ActiveDocument.application.name;
			if(appName){
				appName = appName.toLowerCase();
			}
			if(appName.indexOf("wps") >= 0 ){
				return "wps";
			}else if(appName.indexOf("microsoft") >= 0){
				return "office";
			}			
			return "none";
		}catch(e){
			//
		}
	}
};

/**
 * 字符串处理相关通用方法
 */
var StringUtils = {
		/**字符串对象增加方法：是否以指定字符串结束**/
		"endWith" : function(srcStr,str){
			if(str==null || str=="" || srcStr==null || srcStr.length==0 || str.length>srcStr.length) 
			  return false; 
			if(srcStr.substring(srcStr.length-str.length)==str) 
			  return true; 
			else 
			  return false; 
		} ,
		/**字符串对象增加方法：是否以指定字符串开始**/
		"startWith" : function(srcStr,str){
			if(str==null||str=="" || srcStr==null || srcStr.length==0||str.length>srcStr.length) 
			  return false; 
			if(srcStr.substr(0,str.length)==str) 
			  return true; 
			else 
			  return false; 
		}	
};

/**
 * 计时器,辅助调试时查看执行时间。调用如：
 * 	var stopWatch = new Stopwatch();
 * 	stopWatch.start();
 *  //执行代码
 * 	stopWatch.time() + "毫秒"
 */
function Stopwatch() {
	// Private vars
	var startAt = 0; // Time of last start / resume. (0 if not running)
	var lapTime = 0; // Time on the clock when last stopped in milliseconds

	var now = function() {
		return (new Date()).getTime();
	};
	// 启动计时器，或者继续计时
	this.start = function() {
		startAt = now();
		return lapTime;
	};
	// 停止或暂停计时
	this.stop = function() {
		lapTime = startAt ? lapTime + now() - startAt : 0;
		startAt = 0; // 暂停

		return lapTime;
	};
	// 耗时
	this.time = function() {
		return lapTime + (startAt ? now() - startAt : 0);
	};
}; 

