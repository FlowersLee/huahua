/**是否窗口正在关闭**/
var _winClosed = false;
var NODE_DEF_VERSION = "1.1";
/**
 * 数据权限控制输入框的ID数组
 */
var _fieldIds = ["FIELD_EXCEPTION","FIELD_HIDDEN","FIELD_MUST","FIELD_DISPLAY"
	                 ,"GROUP_DISPLAY","GROUP_HIDE","GROUP_EXPAND","GROUP_COLLAPSE"
	                 ,"MIND_CODE","MIND_REGULAR","MIND_TERMINAL"];

$(document).ready(function() {
	$( "#tabs" ).tabs();
	window.status= ""; 
	var nodeObj = window.dialogArguments;
	
	if (nodeObj.BUTTONS_DEF || nodeObj.WF_CUSTOM_VARS) {
		if (nodeObj.NODE_DEF_VERSION != NODE_DEF_VERSION) {
			// 由于流程定义数据格式有调整，因此判断节点定义版本，避免出现问题。
			alert("节点定义数据格式可能不正确，请不要保存流程，并与管理员联系。");
			window.close();
			_winClosed = true;
			return;
		}
	}
	
	//初始化 基本信息
    initBaseInfo(nodeObj);
	
	//初始化 超时设置
	initTimeOut(nodeObj);
	
	//初始化 组织资源 页面
	initOrgInfo(nodeObj);
	
	//事件初始化
	initEvent(nodeObj);
	
	if(!nodeObj.FIELD_CONTROL){
		nodeObj.FIELD_CONTROL = "1";
	}
	
	$("#FIELD_CONTROL").val(nodeObj.FIELD_CONTROL);
	
	//向指定的输入框中设置上次定义的值。
	fillFieldValue(nodeObj,_fieldIds);
	
	//兼容老数据，如果有按钮定义节点，则使用新数据
	if(nodeObj.BUTTONS_DEF){
		var btnDef = DataEncode.decode(nodeObj.BUTTONS_DEF);
		WfAction.initActs(btnDef);
	}else{
		//显示老数据
		WfAction.initActs(nodeObj.FORM_BUTTONS,"FORM");
		WfAction.initActs(nodeObj.WF_BUTTONS,"WF");
	}
	
	//从node act 表中取得定义的规则 1 读 2 编辑 注释说明删除权限  
	var existedFileTypeJson = nodeObj.FILE_CONTROL;
	existedFileTypeJson = eval("(" + existedFileTypeJson + ")");
	initFileTypeField(nodeObj, existedFileTypeJson); //按照服务定义中的  自定义 字段 来 初始化
	
    //是否办结选项，如果被选中则办结按钮名称默认为“办结”
    jQuery("#PROC_END_FLAG").click(function(){
    	if(jQuery(this).attr("checked")){
    		jQuery("#PROC_END_NAME").val("办结");
    	}else{
    		jQuery("#PROC_END_NAME").val("");
    	}
    });
    //初始化自定义变量定义界面
    customVar.init(DataEncode.decode(nodeObj.WF_CUSTOM_VARS));
    
    dataUpdater.init(nodeObj.FIELD_UPDATE);
});

/**
 * 初始化超时设置 
 * [{'TYPE':'YIBAN','TIMEOUT':'24','REMIND':'EMAIL,MESSAGE','OPER':'CUIBAN,BACK'},
 * {'TYPE':'JINJI','TIMEOUT':'24','REMIND':'EMAIL,MESSAGE','OPER':'CUIBAN'},
 * {'TYPE':'TEJI','TIMEOUT':'24','REMIND':'EMAIL,MESSAGE','OPER':'CUIBAN'}]
 */
function initTimeOut(nodeObj) {
	//构造页面
    var typeArray = ["YIBAN","JINJI","TEJI"];
    var operArray = ["BACK","CUIBAN"];
    var operNameArray = ["退回","催办"];
    
	var dicList = FireFly.getDict("SY_COMM_REMIND_TYPE");
	var dicObjs = dicList[0]["CHILD"];//获取字典信息对象数组
	
    for(var i=0;i<typeArray.length;i++){ //紧急的类型
        var jinJiType = typeArray[i];
        
        var checkBoxRemind = new Array();
        checkBoxRemind.push("<span id='remindSpan"+jinJiType+"' class='ui-checkbox-default'>");
		for (var j = 0; j < dicObjs.length; j++) { //提醒方式的字典
			var remindType = dicObjs[j]["ID"];
			
			checkBoxRemind.push("<input type='checkbox' id='remindCheckbox"+jinJiType+remindType+"' name='remindCheckbox"+jinJiType+"' value ='"+remindType+"'>");
			checkBoxRemind.push(dicObjs[j]["NAME"]);
			checkBoxRemind.push("&nbsp;&nbsp;");
		}
		checkBoxRemind.push("</span>");
		
		var remindDiv = $("#NODE_TIMEOUT_"+jinJiType+"_REMIND");
		$(checkBoxRemind.join("")).appendTo(remindDiv);
		
		var checkBoxOper = new Array();
		checkBoxOper.push("<span id='operSpan"+jinJiType+"' class='ui-checkbox-default'>");
		for (var k=0;k<operArray.length;k++) { //操作的类型
			checkBoxOper.push("<input type='checkbox' id='operCheckbox"+jinJiType+operArray[k]+"' name='operCheckbox"+jinJiType+"' value ='"+operArray[k]+"'>");
			checkBoxOper.push(operNameArray[k]);
			checkBoxOper.push("&nbsp;&nbsp;");
		}
		checkBoxOper.push("</span>");
		
		var operDiv = $("#NODE_TIMEOUT_"+jinJiType+"_OPER");
		$(checkBoxOper.join("")).appendTo(operDiv);
    }
	
	//填值，
    var timeOutStr = Hex.decode(nodeObj.NODE_TIMEOUT);
	
	if (timeOutStr.indexOf("TIMEOUT") < 0) {
	    return;
	}
	
    var existedTimeoutJson = eval("(" + timeOutStr + ")");
	
	if(existedTimeoutJson != undefined) {
		jQuery.each(existedTimeoutJson,function(i,existitem) {
			var jinJiType = existitem.TYPE;
			//超时时间
			$("#NODE_TIMEOUT_" + jinJiType).val(existitem.TIMEOUT);
			
			//提醒方式
			if (existitem.REMIND && existitem.REMIND.length > 0) {
				var remindTypes = existitem.REMIND.split(",");
				for (var j=0;j<remindTypes.length;j++) {
					$("#remindCheckbox"+jinJiType+remindTypes[j]).attr("checked",true); 
				}				
			}
			
			//操作
			if (existitem.OPER && existitem.OPER.length > 0) {
				var operTypes = existitem.OPER.split(",");
				for (var j=0;j<operTypes.length;j++) {
					$("#operCheckbox"+jinJiType+operTypes[j]).attr("checked",true); 
				}
			}
		});
	}
}

/**
 * 初始化，文件类型，按照字段定义的
 */
function initFileTypeField(nodeObj, existedFileTypeJson) {
    var servDef = nodeObj.servDef;

    var fileTypeStr = new Array();
	for(var key in servDef.ITEMS){ 
		var itemDef = servDef.ITEMS[key];
		
		if (itemDef.ITEM_INPUT_TYPE == 14) { //自定义附件
			fileTypeStr.push(itemDef);
		}
	} 
    
    initFileTypeControlWithField(fileTypeStr, existedFileTypeJson);
}


/**
 * 向指定的输入框中设置上次定义的值。
 * @param fieldCtls 输入框ID数组
 */
function fillFieldValue(nodeObj,fieldCtls){
	for(var i=0;i<fieldCtls.length;i++){
		var fieldCtl = fieldCtls[i];
		$("#" + fieldCtl).val(nodeObj[fieldCtl]);
		if(nodeObj[fieldCtl + "__NAME"]){
			$("#" + fieldCtl + "__NAME").val(nodeObj[fieldCtl + "__NAME"]);
		}else{
			$("#" + fieldCtl + "__NAME").val(nodeObj[fieldCtl]);
		}
	}	
}

var WfAction = {};

/**初始化按钮**/
WfAction.initActs = function(btns,actType){
	if(typeof(btns) == "object"){
		for(var i=0;i<btns.length;i++){
			btns[i].param = Hex.decode(btns[i].param);
			btns[i].newname = Hex.decode(btns[i].newname);
			WfAction.addAct(btns[i]);
		}
	}else{
		//如果btns为null则返回。
		if(!btns || btns.length == 0) return;
		var btnArr = btns.split(",");
		for(var i=0;i<btnArr.length;i++){
			var btnObj = {"name":"","code":btnArr[i],"type":actType};
			WfAction.addAct(btnObj);
		}
	}
}

/**增加一行按钮**/
WfAction.addAct = function(btnObj){
	//name,code,actType
	var actBtnsTbl = jQuery("#actBtnTable");
	
	if (btnObj.newname == undefined) {
		btnObj.newname = btnObj.name;
	}
	
	var jsonVal = btnObj.name + "^" + btnObj.code + "^" + btnObj.type;
	var str = "<tr jsonVal='" + jsonVal + "' ><td class='tl'>" + btnObj.name + 
	          "</td><td class='tl'><input type='text' name='newname' value='" + btnObj.newname + "'></td><td class='tl'>" 
		      + btnObj.code + "</td><td><textarea class='wp' rows=3 cols=40>";
	//如果参数存在
	if(btnObj.param){
		str += btnObj.param;
	}
	str += "</textarea></td><td class='tc' onclick='javascript:WfAction.delAct(this)'>删除</td>";
	actBtnsTbl.append(str);
}

/**删除一行按钮**/
WfAction.delAct = function(obj){
	jQuery(obj).parent().remove();
}

/**
 * 初始化组织资源的页面
 */
function initOrgInfo(nodeObj){
	//bind类型
	if(nodeObj.NODE_BIND_MODE == 'ROLE'){
		$("#NODE_BIND_MODE_ROLE").attr("checked",true);
	}
    //角色
	$("#NODE_ROLE_CODES").val(nodeObj.NODE_ROLE_CODES);
	//默认给全部
	if (nodeObj.NODE_ROLE_MODE == undefined) {
	    nodeObj.NODE_ROLE_MODE = "2";
	}
	jQuery("input[name='NODE_ROLE_MODE'][value='"+nodeObj.NODE_ROLE_MODE+"']").attr("checked",true);
	
	$("#NODE_ROLE_WHERE").val(nodeObj.NODE_ROLE_WHERE);
	$("#NODE_ROLE_CODES__NAME").val(nodeObj.NODE_ROLE_CODES__NAME);
	
	//部门
	//默认给全部
	if (nodeObj.NODE_DEPT_MODE == undefined) {
	    nodeObj.NODE_DEPT_MODE = "2";
	}	
	jQuery("input[name='NODE_DEPT_MODE'][value='"+nodeObj.NODE_DEPT_MODE+"']").attr("checked",true);
	
	$("#NODE_DEPT_CODES").val(nodeObj.NODE_DEPT_CODES);
	if(nodeObj.NODE_DEPT_MODE == 3) { //如果是预定义， 处理下拉框
	    //将 NODE_DEPT_CODES 设置成 下拉框的默认值
	    //$("#NODE_DEPT_CODES").val($("#nodeDeptYuding").val());
	    //$("#nodeDeptYuding").attr("value",nodeObj.NODE_DEPT_CODES);
        $("#nodeDeptYuding").val(nodeObj.NODE_DEPT_CODES);
	}

	//$("#NODE_DEPT_LEVEL").val(nodeObj.NODE_DEPT_LEVEL);
	$("#NODE_DEPT_WHERE").val(nodeObj.NODE_DEPT_WHERE);
	$("#NODE_DEPT_CODES__NAME").val(nodeObj.NODE_DEPT_CODES__NAME);
	
	//人员
	//默认给全部
	if (nodeObj.NODE_USER_MODE == undefined) {
	    nodeObj.NODE_USER_MODE = 2;
	}
	
	if(nodeObj.NODE_USER_MODE == 3){//用户选择预定义
		$("#nodeUserYuding").val(nodeObj.NODE_USER_CODES);
		nodeObj.NODE_USER_CODES = "";
	}
	
	$("#NODE_USER_CODES").val(nodeObj.NODE_USER_CODES);
	jQuery("input[name='NODE_USER_MODE'][value='"+nodeObj.NODE_USER_MODE+"']").attr("checked",true);
	$("#NODE_USER_WHERE").val(nodeObj.NODE_USER_WHERE);		
	$("#NODE_USER_CODES__NAME").val(nodeObj.NODE_USER_CODES__NAME);
}

/**
 * 初始化 第一个tab 的基础信息
 */
function initBaseInfo(nodeObj){
	$("#SERV_ID").val(nodeObj.SERV_ID);	
	$("#SERV_PID").val(nodeObj.SERV_PID);	
	$("#NODE_CODE").val(nodeObj.NODE_CODE);	
	$("#NODE_NAME").val(nodeObj.NODE_NAME);
	$("#NODE_CAPTION").val(nodeObj.NODE_CAPTION);
	$("#NODE_SORT").val(nodeObj.NODE_SORT);
	//$("#MIND_CODE").val(nodeObj.MIND_CODE);
	//$("#NODE_TIMEOUT").val(nodeObj.NODE_TIMEOUT);
	//$("#NODE_TIMEOUT_ACT").val(nodeObj.NODE_TIMEOUT_ACT);
	$("#PROC_END_NAME").val(nodeObj.PROC_END_NAME);
	$("#NODE_SUB_PROC").val(nodeObj.NODE_SUB_PROC);
	$("#NODE_MEMO").val(nodeObj.NODE_MEMO);
	$("#NODE_EXTEND_CLASS").val(nodeObj.NODE_EXTEND_CLASS);	
	$("#NODE_REMIND_USER").val(nodeObj.NODE_REMIND_USER);	
	$("#NODE_TYPE").val(nodeObj.NODE_TYPE);
	//$("#MIND_TERMINAL").val(nodeObj.MIND_TERMINAL);
	$("#MIND_REGULAR_MUST").val(nodeObj.MIND_REGULAR_MUST);
	$("#MIND_REGULAR_SCRIPT").val(Hex.decode(nodeObj.MIND_REGULAR_SCRIPT));
	$("#MIND_SCRIPT").val(Hex.decode(nodeObj.MIND_SCRIPT));
	$("#MIND_TERMINAL_SCRIPT").val(Hex.decode(nodeObj.MIND_TERMINAL_SCRIPT));
	
	if(nodeObj.MIND_REGULAR_MUST=="1"){
		$("#MIND_REGULAR_MUST").attr("checked",true);
	}
	$("#MIND_TERMINAL_MUST").val(nodeObj.MIND_TERMINAL_MUST);
	if(nodeObj.MIND_TERMINAL_MUST=="1"){
		$("#MIND_TERMINAL_MUST").attr("checked",true);
	}
	$("#MIND_NEED_FLAG").val(nodeObj.MIND_NEED_FLAG);
	if(nodeObj.MIND_NEED_FLAG=="1"){
		$("#MIND_NEED_FLAG").attr("checked",true);
	}

	$("#NODE_IF_PARALLEL").val(nodeObj.NODE_IF_PARALLEL);
	if(nodeObj.NODE_IF_PARALLEL=="1"){
		$("#NODE_IF_PARALLEL").attr("checked",true);
	}	
	$("#NODE_IF_CONVERGE").val(nodeObj.NODE_IF_CONVERGE);
	if(nodeObj.NODE_IF_CONVERGE=="1"){
		$("#NODE_IF_CONVERGE").attr("checked",true);
	}
	$("#PROC_END_FLAG").val(nodeObj.PROC_END_FLAG);
	if(nodeObj.PROC_END_FLAG=="1"){
		$("#PROC_END_FLAG").attr("checked",true);
	}
	
	/** 给是否自动结束给一个默认自动结束的值*/
	if(typeof(nodeObj.NODE_IF_AUTOEND) == "undefined"){
	    nodeObj.NODE_IF_AUTOEND = 1;
	}
	$("#NODE_IF_AUTOEND").val(nodeObj.NODE_IF_AUTOEND);
	if(nodeObj.NODE_IF_AUTOEND=="1"){
		$("#NODE_IF_AUTOEND").attr("checked",true);
	}
	
	$("#NODE_SELF_SEND").val(nodeObj.NODE_SELF_SEND);
}

/**
 * 事件初始化
 * @param nodeObj
 */
function initEvent(nodeObj){
	//组织资源页面 角色信息中 “角色”和“送全部”不能同时选中
	$("#NODE_ROLE_MODE_2").bind("click", function(){
		$("#NODE_BIND_MODE_ROLE").attr("checked", false);
	});
	$("#NODE_BIND_MODE_ROLE").bind("change", function(){
		if(this.checked){
			$("#NODE_ROLE_MODE_2").attr("checked", false);
		}
	});
}

/**
 * 从字段中读取 文件权限
 * @param filedDefs
 * @param existedFileTypeJson
 */
function initFileTypeControlWithField(fileTypes, existedFileTypeJson) {
	var tableview = $("#fileTypeSelect");

	//循环服务中的文件类型串，取到act表中的具体值，取不到，当0处理
	jQuery.each(fileTypes,function(i,itemold) {
	    var existFlag = false;

	    //默认值从输入设置中配置的VALUE值
	    var inputConfig = StrToJson(itemold.ITEM_INPUT_CONFIG);
	    var defaultValue = 0;
	    if (inputConfig && inputConfig.VALUE) {
	    	defaultValue = inputConfig.VALUE;
	    }	    
	    
	    //将字段定义转化
	    var item = {};
	    item.ID = itemold.ITEM_CODE;
	    item.NAME = itemold.ITEM_NAME;
	    item.VALUE = defaultValue;
	    
		if(existedFileTypeJson != undefined) {
			jQuery.each(existedFileTypeJson,function(i,existitem) {
				if (item.ID == existitem.ID) {
					existFlag = true;	    
					//构建表格
					var str = "<tr id='"+existitem.ID+"'><td><span>"+item.NAME+"</span></td><td><input type='checkbox' class='read' id='checkRead"+item.NAME+"' value=''></td>"+
					          "<td><input type='checkbox' class='write' id='checkWrite"+item.NAME+"' value=''></td>"+
					          "<td><input class='addnew' type='checkbox' id='checkAdd"+item.NAME+"' value=''></td>"+
					          "<td><input class='del' type='checkbox' id='checkDel"+item.NAME+"' value=''></td>"+
					          "<td><input class='modify' type='checkbox' id='checkMdofiy"+item.NAME+"' value=''></td>"+
					          "<td><input class='download' type='checkbox' id='checkDown"+item.NAME+"' value=''></td></tr>";
					
					tableview.append(str);
					
					initFileItemValue(item,existitem);
					
					return;
				}
			});		
		}

		//没找到，设置初始值
		if (!existFlag) {
			var str = "<tr id='"+item.ID+"'><td><span>"+item.NAME+"</span></td><td><input type='checkbox' class='read' id='checkRead"+item.NAME+"' value=''/></td>"+
			          "<td><input class='write' type='checkbox' id='checkWrite"+item.NAME+"' value=''/></td>"+
			          "<td><input class='addnew' type='checkbox' id='checkAdd"+item.NAME+"' value=''/></td>"+
			          "<td><input class='del' type='checkbox' id='checkDel"+item.NAME+"' value=''/></td>"+
					  "<td><input class='modify' type='checkbox' id='checkMdofiy"+item.NAME+"' value=''></td>"+
					  "<td><input class='download' type='checkbox' id='checkDown"+item.NAME+"' value=''></td></tr>";
					
			tableview.append(str);			
			
			initFileItemValue(item);
		}		
	});	
}

/**
 * 32,16,8,4,2,1 	分别是下载、修改、删除、上传、编辑、查看
 * D, M, X,U,W,R 	分别是下载，修改，删除，上传，编辑，查看
 * @param defItemValue
 */
function getFileACTValue(defItemValue) {
	var digitalNum = 0;
	if (defItemValue.indexOf("D") > -1) {
		digitalNum += 32;
	}
	if (defItemValue.indexOf("M") > -1) {
		digitalNum += 16;
	}
	if (defItemValue.indexOf("X") > -1) {
		digitalNum += 8;
	}
	if (defItemValue.indexOf("U") > -1) {
		digitalNum += 4;
	}
	if (defItemValue.indexOf("W") > -1) {
		digitalNum += 2;
	}
	if (defItemValue.indexOf("R") > -1) {
		digitalNum += 1;
	}
	
	return digitalNum;
}

/**
 * @param defItem 服务中定义的
 * @param fileItem 节点中保存的
 */
function initFileItemValue(defItem,fileItem){
    var existitem = defItem;
	
	if (fileItem != undefined) {
	    existitem = fileItem;
	} else { //节点上没有值，就是取的定义上的值 ， 定义上的值，有可能是字母形式的，转成数字的 D,M,X,U,W,R
		if (existitem.VALUE) {
			var defItemValue = existitem.VALUE.toUpperCase();
			//存在字母权限的定义
			if (defItemValue.indexOf("D") > -1 || defItemValue.indexOf("M") > -1 ||defItemValue.indexOf("X") > -1 ||defItemValue.indexOf("U") > -1 ||defItemValue.indexOf("W") > -1 ||defItemValue.indexOf("R") > -1) { 
				existitem.VALUE = getFileACTValue(defItemValue);
			}			
		}
	}
	
    var acl = existitem.VALUE;
	acl = parseInt(acl);
	
	// 把十进制数字转化成二进制字符串，对应转化为布尔数组，例如0x1010变成[true,false,true,false]
	var acl = (acl & 63).toString(2);

	var len = acl.length;
	
	// 不够六位补零
	var tmpLen = 6 - len;
	for (var i = 0; i < tmpLen; i++) {
		acl = "0" + acl;
	}

	//下载
	var tmpDel = acl.substring(0, 1);
	if (tmpDel.toString() == "1") {
	    $("#checkDown"+defItem.NAME).attr("checked",true);  //下载
	}	
	
	//修改
	var tmpDel = acl.substring(1, 2);
	if (tmpDel.toString() == "1") {
	    $("#checkMdofiy"+defItem.NAME).attr("checked",true);  //修改
	}
	
	//删除
	var tmpDel = acl.substring(2, 3);
	if (tmpDel.toString() == "1") {
	    $("#checkDel"+defItem.NAME).attr("checked",true);  //删除
	}

	//添加
	var tmpAdd = acl.substring(3, 4);
	if (tmpAdd.toString() == "1") {
	    $("#checkAdd"+defItem.NAME).attr("checked",true);  //添加
	}

	//编辑	
	var tmpWrite = acl.substring(4, 5);
	if (tmpWrite.toString() == "1") {
	    $("#checkWrite"+defItem.NAME).attr("checked",true);  //编辑	
	}

	//查看
	var tmpRead = acl.substring(5, 6);
	if (tmpRead.toString() == "1") {
	    $("#checkRead"+defItem.NAME).attr("checked",true);  //查看
	}	
	
	
}

/**
 * 得到保存到数据中的文件控制的串
 * 
 */
function getFileControlStr(){
    var fileTypeArray = new Array(); 
	
	var trArray = [];
	$("#fileTypeSelect tr").each(function(j,m) {
	    if (jQuery(m).hasClass("topTr")) {
		   return;
		}
		var trObj = jQuery(this);
	    var trFileStr = "'ID':'" + trObj.attr('id')
					  + "','NAME':'" + trObj.find("SPAN").text() + "','VALUE':";
		var value = 0;
		trObj.find("input[type='checkbox']:checked").each(function(){
			var tdObj = jQuery(this);
			if (tdObj.hasClass("read")) {
			 value += 1; 
		   } else if (tdObj.hasClass("write")) {
			 value += 2; 				   
		   } else if (tdObj.hasClass("addnew")) {
			 value += 4; 				   
		   } else if (tdObj.hasClass("del")) {
			 value += 8; 
		   } else if (tdObj.hasClass("modify")) {
			 value += 16;
		   } else if (tdObj.hasClass("download")) {
			 value += 32;
		   }
		});
		trArray.push("{" + trFileStr + "'" + value + "'}");
	});
	var rtnFileControlStr = "[" + trArray.join(",") + "]";
	
    return rtnFileControlStr;
}

/**
 * 设置checkbox Dom对象的值
 * @param chkboxIds checkbox Dom对象ID数组
 */
function setCheckBoxVal(chkboxIds){
    for(var i=0;i<chkboxIds.length;i++){
        var chkboxId = chkboxIds[i];
        var checkbox = $("#" + chkboxId);
        if(checkbox.length > 0){
            if(checkbox[0].checked){
                checkbox.val('1');
            }else{
                checkbox.val('2');
            }
        }
    }
}

/**
 * 获取给定紧急程度的提醒设置
 * @param jinJiType 紧急类型
 */
function getTimeOutRemindValue(jinJiType) {
	var remindStr = "";
    $("input[name='remindCheckbox"+jinJiType+"']").each(function(){ 
        if($(this).attr("checked")){
        	remindStr += $(this).val()+","
        }
    });
    
    if (remindStr.length > 0) {
    	remindStr = remindStr.substring(0, remindStr.length-1);
    }
    
    return remindStr;
}

/**
 * 获取给定紧急程度的提醒设置
 * @param jinJiType 紧急类型
 */
function getTimeOutOperValue(jinJiType) {
	var operStr = "";
    $("input[name='operCheckbox"+jinJiType+"']").each(function(){ 
        if($(this).attr("checked")){
        	operStr += $(this).val()+","
        }
    });
    
    if (operStr.length > 0) {
    	operStr = operStr.substring(0, operStr.length-1);
    }    
    
    return operStr;	
}

/**
 * 获取超时设置的串
 * [{'TYPE':'YIBAN','TIMEOUT':'24','REMIND':'EMAIL,MESSAGE','OPER':'CUIBAN,BACK'},...]
 */
function getTimeoutStr() {
    var typeArray = ["YIBAN","JINJI","TEJI"];
    var operArray = ["BACK","CUIBAN"];
	
	var timeOut = new Array();
	timeOut.push("[");
    for(var i=0;i<typeArray.length;i++){
        var jinJiType = typeArray[i];
        var timeOutValue = $("#NODE_TIMEOUT_" + jinJiType).val();

		if(timeOutValue.replace(/[\d+]/ig,"").length>0){
			alert("请检查，超时时间需填写数字!");
			
			return false;
		}

	    timeOut.push("{'TYPE':'" + jinJiType + "',");
        timeOut.push("'TIMEOUT':'" + timeOutValue + "',");	
        timeOut.push("'REMIND':'" + getTimeOutRemindValue(jinJiType) + "',");	
		timeOut.push("'OPER':'" + getTimeOutOperValue(jinJiType) + "'}");
		timeOut.push(",");
    }
    
	timeOut.pop();
	timeOut.push("]");
	return timeOut.join("");
}

/**
 * 确认，并关闭弹出页面，返回节点定义
 */
function confirmall(closeWin){
	var chkboxIds = ["PROC_END_FLAG","NODE_IF_PARALLEL","NODE_IF_CONVERGE","MIND_NEED_FLAG"
	                 ,"MIND_REGULAR_MUST","MIND_TERMINAL_MUST","NODE_IF_AUTOEND"];
	
	setCheckBoxVal(chkboxIds);
	
	//bind类型
	if($("#NODE_BIND_MODE_ROLE").attr('checked')!=undefined) {
		$("#NODE_BIND_MODE").val("ROLE");
	}
	
	//部门 如果选择的是 预定义 ， 则取 nodeDeptYuding 中的值到 NODE_DEPT_CODES
	if($("input[name='NODE_DEPT_MODE']:checked").val() == 3) { //如果是预定义， 从下拉框取
	    $("#NODE_DEPT_CODES").val($("#nodeDeptYuding").val());
	}
	
	//如果是选的全部，将指定的input中的值清除
	if($("input[name='NODE_DEPT_MODE']:checked").val() == 2) { //部门是全部 ， 取消部门的值
	    $("#NODE_DEPT_CODES").val("");
		$("#NODE_DEPT_CODES__NAME").val("");
	}
	if($("input[name='NODE_DEPT_MODE']:checked").val() == 3) { //部门是预定义 ， 取消部门名称的值
		$("#NODE_DEPT_CODES__NAME").val("");
	}
	
	if($("input[name='NODE_ROLE_MODE']:checked").val() == 2) { //角色是全部 ， 取消角色的值
	    $("#NODE_ROLE_CODES").val("");
		$("#NODE_ROLE_CODES__NAME").val("");
	}
	var nodeUserModeVal = $("input[name='NODE_USER_MODE']:checked").val();
	if(nodeUserModeVal == 2) { //人员是全部 ， 取消人员的值
	    $("#NODE_USER_CODES").val("");
		$("#NODE_USER_CODES__NAME").val("");
	}else if(nodeUserModeVal == 4) { //人员是送角色 ， 取消人员的值
	    $("#NODE_USER_CODES").val("");
		$("#NODE_USER_CODES__NAME").val("");
	}else if(nodeUserModeVal == 3){//人员是预定义，则保存预定义选中项的值
		$("#NODE_USER_CODES").val($("#nodeUserYuding").val());
		$("#NODE_USER_CODES__NAME").val("");
	}
	
	/**按钮权限**/
	var FORM_BUTTONS = new Array();
	var WF_BUTTONS = new Array();
	var BUTTONS_DEF = new Array();
	var BUTTON_PARAMS = new Array();
	var BUTTON_ALIAS = new Array();
	
	jQuery("#actBtnTable").find("TR[jsonVal]").val(function(){
		var strJsonVal = jQuery(this).attr("jsonVal");
		var btnVal = strJsonVal.split("^");
		var btn = {};
		btn.name = btnVal[0];
		btn.code = btnVal[1];
		btn.type = btnVal[2];
		var newname = jQuery(this).find("input[name='newname']").val();
		btn.newname = Hex.encode(newname);
		var param = jQuery(this).find("TEXTAREA").val();
		btn.param = Hex.encode(param);
		BUTTONS_DEF.push(btn);
		
		if(param != ""){
			var paramObj = new Object();
			paramObj["name"] = btn.code;
			paramObj["value"] = param;
			BUTTON_PARAMS.push(paramObj);
		}
		
		BUTTON_ALIAS.push("{'ACT_CODE':'" + btn.code + "','ACT_NAME':'" + newname + "'}");
		
		if(btn.type == "FORM"){
			FORM_BUTTONS.push(btn.code);
		}else if(btn.type == "WF"){
			WF_BUTTONS.push(btn.code);
		}
	});

	
	var timeOutStr = getTimeoutStr();
	if (!timeOutStr) {
		return;
	}
	
    var nodeObj = {  
	    SERV_ID : $("#SERV_ID").val(),
		SERV_PID : $("#SERV_PID").val(),
		NODE_CODE : $("#NODE_CODE").val(),
		NODE_IF_AUTOEND : $("#NODE_IF_AUTOEND").val(),
		NODE_NAME : $("#NODE_NAME").val(),
		NODE_CAPTION : $("#NODE_CAPTION").val(),
		NODE_SORT : $("#NODE_SORT").val(),
		NODE_TIMEOUT : Hex.encode(timeOutStr),
		//NODE_TIMEOUT : $("#NODE_TIMEOUT").val(),
		//NODE_TIMEOUT_ACT : $("#NODE_TIMEOUT_ACT").val(),
		PROC_END_NAME : $("#PROC_END_NAME").val(),	
		NODE_SUB_PROC : $("#NODE_SUB_PROC").val(),
		NODE_MEMO : $("#NODE_MEMO").val(),
		NODE_EXTEND_CLASS : $("#NODE_EXTEND_CLASS").val(),
		//NODE_REMIND_USER : $("#NODE_REMIND_USER").val(),
		NODE_TYPE : $("#NODE_TYPE").val(),
		MIND_NEED_FLAG : $("#MIND_NEED_FLAG").val(),
		MIND_TERMINAL_MUST : $("#MIND_TERMINAL_MUST").val(),
		MIND_REGULAR_MUST : $("#MIND_REGULAR_MUST").val(),
		MIND_REGULAR_SCRIPT : Hex.encode($("#MIND_REGULAR_SCRIPT").val()),
		MIND_SCRIPT : Hex.encode($("#MIND_SCRIPT").val()),
		MIND_TERMINAL_SCRIPT : Hex.encode($("#MIND_TERMINAL_SCRIPT").val()),
		NODE_IF_PARALLEL : $("#NODE_IF_PARALLEL").val(),
		NODE_IF_CONVERGE : $("#NODE_IF_CONVERGE").val(),	
		PROC_END_FLAG : $("#PROC_END_FLAG").val(),	
		NODE_SELF_SEND : $("#NODE_SELF_SEND").val(),
		NODE_ROLE_CODES : $("#NODE_ROLE_CODES").val(),
		NODE_ROLE_MODE : $("input[name='NODE_ROLE_MODE']:checked").val(),
		NODE_BIND_MODE : $("#NODE_BIND_MODE").val(),
		NODE_ROLE_WHERE : $("#NODE_ROLE_WHERE").val(),
		NODE_ROLE_CODES__NAME : $("#NODE_ROLE_CODES__NAME").val(),
		NODE_DEPT_CODES : $("#NODE_DEPT_CODES").val(),
		NODE_DEPT_MODE : $("input[name='NODE_DEPT_MODE']:checked").val(),
		//NODE_DEPT_LEVEL : $("#NODE_DEPT_LEVEL").val(),
		NODE_DEPT_WHERE : $("#NODE_DEPT_WHERE").val(),
		NODE_DEPT_CODES__NAME : $("#NODE_DEPT_CODES__NAME").val(),
		NODE_USER_CODES : $("#NODE_USER_CODES").val(),
		NODE_USER_MODE : $("input[name='NODE_USER_MODE']:checked").val(),
		NODE_USER_WHERE : $("#NODE_USER_WHERE").val(),
        NODE_USER_CODES__NAME : $("#NODE_USER_CODES__NAME").val(),
		FILE_CONTROL : getFileControlStr(),
		FIELD_CONTROL : $("#FIELD_CONTROL").val(),
		FIELD_UPDATE : dataUpdater.saveDef(),
		FORM_BUTTONS : FORM_BUTTONS.join(","),
		WF_BUTTONS : WF_BUTTONS.join(","),
		BUTTON_PARAMS : DataEncode.encode(BUTTON_PARAMS),
		BUTTONS_DEF : DataEncode.encode(BUTTONS_DEF),
		BUTTON_ALIAS : DataEncode.encode(BUTTON_ALIAS.join("~")),
		WF_CUSTOM_VARS : DataEncode.encode(customVar.saveDef()),
		NODE_DEF_VERSION : NODE_DEF_VERSION
    };
    
    for(var i=0;i<_fieldIds.length;i++){
    	nodeObj[_fieldIds[i]] = $("#" + _fieldIds[i]).val();
    	nodeObj[_fieldIds[i] + "__NAME"] = $("#" + _fieldIds[i] + "__NAME").val();
    }
    
	window.returnValue = nodeObj;
	if(closeWin){
		window.close();
		_winClosed = true;
	}
}

/**
 * 取消，并返回父页面
 */
function cancelall(){
	if(confirm("是否确定取消？")){
	    window.returnValue = "undefined";
	    _winClosed = true;
	    window.close();
	}
}

/**
 * 打开选择字段名称的输入框
 * @param inputName 返回结果输入框的ID
 * @param strWhere 查询条件
 */
function  openFieldControlDialog(inputName,extParams) {
//	alert(extParams);
    var servIdName = $("#SERV_ID").val();
	var servPidName = $("#SERV_PID").val();
	
	var params = {"SRC_SERV_ID":servIdName};
	params = jQuery.extend(params,extParams);
	
	var configStr = "SY_SERV_ITEM_QUERY,{'TARGET':'"+inputName+"~','SOURCE':'ITEM_CODE~ITEM_NAME','TYPE':'multi'}";
	var options = {"itemCode":inputName,"config" :configStr,"rebackCodes":inputName,"parHandler":this,"formHandler":this,"replaceCallBack":function(obj){
		jQuery("#" + inputName).val(obj.ITEM_CODE);
		jQuery("#" + inputName + "__NAME").val(obj.ITEM_NAME);
	},"hideAdvancedSearch":true,"params":params};
	var queryView = new rh.vi.rhSelectListView(options);
	queryView.show(null,[50,0]);
}

/**
 * 选择工作流定义按钮
 */
function openWfeButtonDialog(inputName) {
		
		var configStr = "SY_WFE_PROC_DEF_ACT,{'TARGET':'"+inputName+"~','SOURCE':'ACT_CODE~ACT_NAME','EXTWHERE':'' ,'TYPE':'multi'}";
		
   		var options = {"itemCode":inputName,"config" :configStr,"rebackCodes":inputName,"parHandler":this,"formHandler":this,"replaceCallBack":function(result){
			var actCodes = result.ACT_CODE.split(",");
			var actNames = result.ACT_NAME.split(",");
			for(var i=0;i < actCodes.length;i++){
				var btnObj = {name:actNames[i],newname:actNames[i],code:actCodes[i],type:"WF"};
				WfAction.addAct(btnObj);
			}
		},"hideAdvancedSearch":true};
		var queryView = new rh.vi.rhSelectListView(options);
		queryView.show(null,[50,0]);
}

/**
 * 选择表单按钮
 */
function  openButtonDialog(inputName,formTableName,pTableName) {
        if(formTableName != "SY_WFE_PROC_DEF"){
		    formTableName = $("#SERV_ID").val();
			pTableName = $("#SERV_PID").val();
		}

    	//var extSql = " and S_FLAG=1 and (ACT_TYPE=3 and ACT_CODE !=^byid^) and SERV_ID in (^"+formTableName+"^,^"+pTableName+"^) " + 
        //" or act_id in (select act_id from sy_serv_act where serv_id  = ^"+formTableName+"^ and ACT_CODE in (^save^,^delete^))";       
		var configStr = "SY_SERV_ACT_QUERY,{'TARGET':'"+inputName+"~','SOURCE':'ACT_CODE~ACT_NAME','TYPE':'multi'}";
		
   		var options = {"itemCode":inputName,"config" :configStr,"rebackCodes":inputName,"parHandler":this
   				,"formHandler":this,"replaceCallBack":function(result){
			var actCodes = result.ACT_CODE.split(",");
			var actNames = result.ACT_NAME.split(",");
			for(var i=0;i < actCodes.length;i++){
				var btnObj = {name:actNames[i],newname:actNames[i],code:actCodes[i],type:"FORM"};
				WfAction.addAct(btnObj);
			}
		},"hideAdvancedSearch":true,"params":{"SRC_SERV_ID":formTableName}};
		var queryView = new rh.vi.rhSelectListView(options);
		queryView.show(null,[50,0]);
}

/**
 * 意见类型的选择
 * @param inputName 输入框ID
 * @param extWhere 附加查询条件
 */
function openMindTypeCode(inputName,extWhere){
	var strWhere = extWhere || " and REGULAR_TYPE = ^2^";
	
	var configStr = "SY_COMM_MIND_CODE,{'TARGET':'"
					+ inputName + "~','SOURCE':'CODE_ID~CODE_NAME~MIND_DESC','EXTWHERE':'"
					+ strWhere + "','TYPE':'single'}";
	var options = {"itemCode":inputName,"config" :configStr,"rebackCodes":inputName,"parHandler":this,
			"formHandler":this,"replaceCallBack":function(obj){
				jQuery("#" + inputName).val(obj.CODE_ID);
				jQuery("#" + inputName + "__NAME").val(obj.CODE_NAME + "(" + obj.CODE_ID + ")" );
			},"hideAdvancedSearch":true};		
	var queryView = new rh.vi.rhSelectListView(options);
	queryView.show(null,[50,0]);
}

/**
 * 打开部门选择和角色选择的树
 */
function openTreeDialogDept(inputName, radioInputId) {
		var configStr = "SY_ORG_DEPT, {'TYPE':'multi'}";
		var extendTreeSetting = {'cascadecheck':false,'checkParent':false};
		var options = {"itemCode":inputName,"config" : configStr,"hide":"explode","show":"blind",
		"extendDicSetting":extendTreeSetting,
		"replaceCallBack":function(id,value){
			jQuery("#" + inputName).val(id.join(","));
			jQuery("#" + inputName+ "__NAME").val(value.join(","));
			if(radioInputId){
				jQuery("#" + radioInputId).attr("checked","true");
			}

		}};
		var dictView = new rh.vi.rhDictTreeView(options);
		dictView.show();
		//如果没有选中，表示原有的数据和现有数据是不相配的
		if(!jQuery("#" + radioInputId).attr("checked")){
			jQuery("#" + inputName).val("");
		}
}

/**
 * 打开人员选择和角色选择的树
 */
function  openTreeDialog(inputName, formTableName,radioInputId) {
		var configStr = formTableName + ",{'TYPE':'multi','rtnLeaf':true}";
		var extendTreeSetting = {'cascadecheck':true,'checkParent':false};
		var options = {"itemCode":inputName,"config" : configStr,"hide":"explode","show":"blind",
		"extendDicSetting":extendTreeSetting,
		"replaceCallBack":function(id,value){
			jQuery("#" + inputName).val(id.join(","));
			jQuery("#" + inputName+ "__NAME").val(value.join(","));
			if(radioInputId){
				jQuery("#" + radioInputId).attr("checked","true");
			}

		}};
		var dictView = new rh.vi.rhDictTreeView(options);
		dictView.show();
		//如果没有选中，表示原有的数据和现有数据是不相配的
		if(!jQuery("#" + radioInputId).attr("checked")){
			jQuery("#" + inputName).val("");
		}
}

function addDrafter(inputName,radioInputId) {
	jQuery("#" + inputName).val("draftUser");
	jQuery("#" + inputName+ "__NAME").val("起草人");
	if(radioInputId){
		jQuery("#" + radioInputId).attr("checked","true");
	}
}

function cancelSelect(inputName) {
    jQuery("#" + inputName).val("");
    jQuery("#" + inputName + "__NAME").val("");
}

function cancelRegular(inputName) {
    jQuery("#" + inputName).val("");
	jQuery("#" + inputName + "__NAME").val("");
}

/**自动选中部门预定义的值**/
jQuery(document).ready(function(){
	jQuery("#nodeDeptYuding").change(function(){
		jQuery("#NODE_DEPT_MODE_3").attr("checked","true");
	});
});

/**
* 关闭窗口
**/
jQuery(window).unload(function(){
	//&& confirm("是否保存？")
	if(!_winClosed){
		//如果不是关闭状态，则
		confirmall(false);
	}
}); 


/**
 * 自定义变量功能常用方法
 */
var customVar = {
	init : function(defVal){
		var objVal = eval(defVal);
		/**为自定义变量的增加按钮绑定点击事件**/
		jQuery(document).ready(function(){
			jQuery("#btnCustomVarAdd").bind("click",function(){
				customVar.addVar();
			});
		});
		
		//初始化数据
		jQuery(objVal).each(function(index,obj){
			customVar.addVar(obj.VAR_CODE,obj.VAR_CONTENT,obj.VAR_MEMO);
		});

	},
	/** 增加客户端自定义变量 **/
	addVar : function(varName,varContent,varMemo){
		varName = varName || "";
		varContent = varContent || "";
		varMemo = varMemo || "";
		var rows = "<tr class='varList'><td>"
				 + "<input type='text' name='VAR_CODE' value='" + varName + "' class='wp h' />"
				 + "</td><td>"
				 + "<textarea name='VAR_CONTENT' class='wp' rows='3'>" + varContent + "</textarea>"
				 + "</td><td>"
				 + "<textarea name='VAR_MEMO' class='wp' rows='3'>" + varMemo + "</textarea>"
				 + "</td><td onclick='customVar.removeVar(this)'><a>删除</a></td></tr>";
		
		jQuery("#tblCustomVarAdd").append(rows);
	},
	 /**删除指定变量**/
	removeVar : function(obj){
		jQuery(obj).parent().remove();
	},
	/**取得保存到服务器端的数据**/
	saveDef : function(){
		var def = new Array();
		jQuery("#tblCustomVarAdd").find("tr.varList").each(function(index,obj){
			var item = {
				VAR_CODE : jQuery(obj).find("input[name=VAR_CODE]").val(),
				VAR_CONTENT : jQuery(obj).find("textarea[name=VAR_CONTENT]").val(),
				VAR_MEMO : jQuery(obj).find("textarea[name=VAR_MEMO]").val()
			};
			def.push(item);
			
		});
		return def;
	}
};

/**
 *编码json对象 
 */
var DataEncode = {
	encode : function(obj) {
		if( typeof (obj) == "object" || typeof (obj) == "array") {
			return Hex.encode(jQuery.toJSON(obj));
		}

		return Hex.encode(obj);
	},
	decode : function(obj) {
		if(typeof(obj) == "string"){
			if(obj == ""){
				return {};	
			}
			var orgStr = Hex.decode(obj);
			return jQuery.evalJSON(orgStr);
		}
		return obj;
	}
}; 


/**更新数据**/
var dataUpdater = {
	init : function(defVal) {
		jQuery(document).ready(function() {
			jQuery("#btnDataUpdate").click(function() {
				dataUpdater.addItem();
			});
		});
		
		if(defVal){
			defVal = Hex.decode(defVal);
			if(typeof(defVal) == 'string'){
				try{
					var list = eval(defVal);
					//初始化数据
					jQuery(list).each(function(index,obj){
						dataUpdater.addItem(obj.UPDATE_MOMENT,obj.UPDATE_CONDS,obj.UPDATE_FIELD,obj.UPDATE_VALUE);
					});
				}catch(e){
					
				}
			}

		}

	},
	addItem : function(moment,conds,field,value) {
		moment = moment || "";
		conds = conds || "";
		field = field || "";
		value = value || "";
		var row = new Array();
		row.push("<tr class='expressList'><td><select name='UPDATE_MOMENT'>");
		row.push("<option value='ENTER'>进入节点</option>");
		row.push("<option value='FINISH'>结束节点</option>");
		row.push("<option value='MIND'>保存意见</option>");
		row.push("<option value='VIEW'>查看审批单</option>");
		row.push("</select></td><td>");
		row.push("<textarea name='UPDATE_CONDS' class='wp' rows='3'>" + conds + "</textarea>");
		row.push("</td><td>");
		row.push("<textarea name='UPDATE_FIELD' class='wp' rows='3'>"  + field + "</textarea>");
		row.push("</td><td>");
		row.push("<textarea name='UPDATE_VALUE' class='wp' rows='3'>" + value + "</textarea>");
		row.push("</td><td onclick='dataUpdater.removeItem(this)'><a>删除</a></td></tr>");
		
		jQuery(row.join("")).appendTo(jQuery("#dataUpdateTable")).find("select[name=UPDATE_MOMENT]").val(moment);
	},
	/**删除指定行**/
	removeItem : function(colObj) {
		jQuery(colObj).parent().remove();
	},
	/**取得保存到服务器端的数据**/
	saveDef : function() {
		var def = new Array();
		jQuery("#dataUpdateTable").find("tr.expressList").each(function(index,obj){
			var item = {
				UPDATE_MOMENT :jQuery(obj).find("select[name=UPDATE_MOMENT]").val(),
				UPDATE_CONDS : jQuery(obj).find("textarea[name=UPDATE_CONDS]").val(),
				UPDATE_FIELD : jQuery(obj).find("textarea[name=UPDATE_FIELD]").val(),
				UPDATE_VALUE : jQuery(obj).find("textarea[name=UPDATE_VALUE]").val()
			};
			def.push(item);
			
		});
		return Hex.encode(jQuery.toJSON(def));
	}
};
