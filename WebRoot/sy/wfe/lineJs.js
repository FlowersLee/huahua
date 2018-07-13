var treeData = "";
var operListStr = "";
var lineSeqNum = 0; 
/**是否窗口正在关闭**/
var _winClosed = false;

$(document).ready(function() {
	$( "#tabs" ).tabs();
	window.status= ""; 
	var lineObj = window.dialogArguments;
	$("#LINE_CODE").val(lineObj.LINE_CODE);
	$("#LINE_COND_NAME").val(lineObj.LINE_COND_NAME);
	$("#SEND_TEXT").val(lineObj.SEND_TEXT);
	$("#RETURN_TEXT").val(lineObj.RETURN_TEXT);
	$("#LINE_SORT").val(lineObj.LINE_SORT);
	$("#PROC_CODE").val(lineObj.PROC_CODE);
	$("#SRC_NODE_CODE").val(lineObj.SRC_NODE_CODE);
	$("#TAR_NODE_CODE").val(lineObj.TAR_NODE_CODE);
	$("#LINE_IF_RETURN").val(lineObj.LINE_IF_RETURN);
	$("#SERV_ID").val(lineObj.SERV_ID);
	$("#CONFIRM_MSG").val(Hex.decode(lineObj.CONFIRM_MSG));
	$("#COND_MSG").val(Hex.decode(lineObj.COND_MSG));
	$("#IF_PARALLEL").val(lineObj.IF_PARALLEL);
	$("#IF_OUT_DEPT").val(lineObj.IF_OUT_DEPT);
	//线事件
	$("#LINE_EVENT").val(lineObj.LINE_EVENT);
	if(lineObj.LINE_IF_RETURN=="1"){
		$("#LINE_IF_RETURN").attr("checked",true);
	}

	if(lineObj.IF_PARALLEL == "1"){
		$("#IF_PARALLEL").attr("checked",true);
	}
	
	if(lineObj.IF_OUT_DEPT == "1"){
		$("#IF_OUT_DEPT").attr("checked",true);
	}	
	
	if(lineObj.LINE_CONDS_SCRIPT == "undefined" || lineObj.LINE_CONDS_SCRIPT == undefined) {
	    $("#LINE_CONDS_SCRIPT").val("");
	} else {
		if(lineObj.BASE64_ENCODE){
			$("#LINE_CONDS_SCRIPT").val(Base64.decode(lineObj.LINE_CONDS_SCRIPT));
		}else if(lineObj.HEX_ENCODE){
			$("#LINE_CONDS_SCRIPT").val(Hex.decode(lineObj.LINE_CONDS_SCRIPT));
		}else{
			$("#LINE_CONDS_SCRIPT").val(unescape(lineObj.LINE_CONDS_SCRIPT));
		}
	}
	$("#LINE_EXTEND_CLASS").val(lineObj.LINE_EXTEND_CLASS);
	
	//默认选中简单，并把复杂变disable
	var modeValue = lineObj.modeExpress;
	if (modeValue == undefined || modeValue.length<2) {
		$("input[name=modeExpress][value=simpleExpress]").attr("checked",true);
	}else{
	    $("input[name=modeExpress][value="+lineObj.modeExpress+"]").attr("checked",true);
	}
	changeMode();
	
	var reqdata = {};
	reqdata.SERV_ID = $("#SERV_ID").val();
	var rtnTreeData = rh_processData("SY_WFE_PROC_DEF.getLineCondVars.do",reqdata);
	
	treeData = rtnTreeData.treeData;
	
	operListStr = rtnTreeData.operatorList;	
	operListStr = StrToJson(operListStr);
	treeData = eval("(" + treeData + ")");
	//初始化列表
	var operListItemsStr = lineObj.operListItems;
	if (operListItemsStr != undefined && operListItemsStr != "") {
		if(lineObj.BASE64_ENCODE) {
			operListItemsStr = Base64.decode(lineObj.operListItems);
		} else if(lineObj.HEX_ENCODE) {
			operListItemsStr = Hex.decode(lineObj.operListItems);
		} else {
			operListItemsStr = unescape(lineObj.operListItems);
		}

		lineObj.operListItems = "[" + operListItemsStr + "]";
		initTableListItems(eval("(" + lineObj.operListItems + ")"));
	}
	dataUpdater.init(lineObj.UPDATE_EXPRESS);
	//初始化组织资源定义
	orgRes.init(lineObj.ORG_DEF || "");
});



//隐藏编辑器
function hideEditDiv() {
	swfobject.removeSWF("ctlFlash");
	var editDivIdObj = jQuery("#editDivId");
	jQuery("<div id='flashContent' style='display:none'>This text is replaced by the Flash.</div>").appendTo(editDivIdObj);
}

//显示编辑器
function showEditDiv() {
	var flashvars = {
		parser: "java",
		readOnly: false,	
		preferredFonts : "|Courier New|Courier|Arial|Tahoma|Consolas|",
		onload : "onEditorLoaded"
	};

	var params = { menu: "false", /* wmode : "transparent", */allowscriptaccess : "always" ,bgcolor : "999999"};
	var attributes = {id: "ctlFlash", name: "ctlFlash" };

	swfobject.embedSWF("CodeHighlightEditor.swf", "flashContent", "100%", "120", "10.0.0", "expressInstall.swf", flashvars, params, attributes);
}


/**
 * 设置编辑框的值
 */
jQuery(document).ready(function(){
	jQuery("#LINE_CONDS_SCRIPT").change(function(){
		document.getElementById('ctlFlash').setText(jQuery("#LINE_CONDS_SCRIPT").val());
	});
});

/**
* 关闭窗口
**/
jQuery(window).unload(function(){
	//&& confirm("是否保存？")
	if(!_winClosed ){
		//如果不是关闭状态，则
		confirmall(false);
	}
}); 

/**
 * 初始化列表显示
 */
function initTableListItems(operListItems) {
	jQuery(operListItems).each(function(i,tblTrItem) {
		lineSeqNum++;
		//增加一行表达式
		addRow(tblTrItem.newVarValue,tblTrItem.paramName,tblTrItem.filledValue,tblTrItem.logicValue,tblTrItem.optParamCode);
	});
}

/**
 * 修改模式：简单表达式与复杂表达式互换
 */
function changeMode() {
    var checkedValue = $("input[name='modeExpress']:checked").val();
	if(checkedValue == "simpleExpress") {  //简单模式
	    $("#LINE_CONDS_SCRIPT").attr("disabled", true);
		$("#LINE_CONDS_SCRIPT").css('display','');
		$("#flashContent").css('display','none');
		hideEditDiv();
		$("#addVar").attr("disabled", false);
		$("#selectExpress").attr("disabled", false);
		$("#expression").attr("disabled", false);
		$("#expressValue").attr("disabled", false);
	} else {  //复杂模式
	    $("#LINE_CONDS_SCRIPT").attr("disabled", false);
		$("#LINE_CONDS_SCRIPT").css('display','none');
		$("#flashContent").css('display','');
		showEditDiv();
		$("#addVar").attr("disabled", true);
		$("#selectExpress").attr("disabled", true);
		$("#expression").attr("disabled", true);
		$("#expressValue").attr("disabled", true);	
	}
}

/**
 * 将table 列表中的值按行转成json串
 */
function genTableListItems() {
	var genTableItemValue = "";
    $("#varListTable tr").each(function(j,m){
		var trObj = jQuery(m);
		if (trObj.hasClass("topTr")) {
		    return;
		}
		
		//取到select 的value , 替换填写的值，
		var aLineItem = {};
		aLineItem.paramName = trObj.find(".varName").text();
		aLineItem.newVarValue = trObj.find(".caoZuoFu").val();
		aLineItem.filledValue = trObj.find(".filledValue").val();
		aLineItem.logicValue = trObj.find("select.logicSelect").val();
		if(trObj.attr("optParamCode")){
			aLineItem.optParamCode = jQuery(m).attr("optParamCode");
		}
		
		genTableItemValue += JsonToStr(aLineItem) + ",";
	});
	//去掉最后的逗号
	genTableItemValue = genTableItemValue.substring(0, genTableItemValue.length-1);
	
	return genTableItemValue;
}

/**
 * 确认，并关闭弹出页面，返回节点定义
 * @param closeWin 是否关闭窗口
 */
function confirmall(closeWin){
    //确定的时候，将operListItem 值按行转成Json串保存 , 如果是简单，就保存，
    var operListItems = "";
    var checkedValue = $("input[name='modeExpress']:checked").val();
	if(checkedValue == "simpleExpress") {  //简单模式
	    operListItems = genTableListItems();
	} else {
		var textVal = $("#LINE_CONDS_SCRIPT").val();
		try{
			//catch由于flash未初始化导致调用getText()方法失败的情况
			textVal = document.getElementById('ctlFlash').getText();
		}catch(e){
			
		}
		
		$("#LINE_CONDS_SCRIPT").val(textVal);
	}
	
	var chkboxIds = ["LINE_IF_RETURN","IF_PARALLEL","IF_OUT_DEPT"];
	setCheckBoxVal(chkboxIds);
    var lineObj = {  
		LINE_CODE : $("#LINE_CODE").val(),
		LINE_COND_NAME: $("#LINE_COND_NAME").val(),
		SEND_TEXT: $("#SEND_TEXT").val(),
		RETURN_TEXT: $("#RETURN_TEXT").val(),
		LINE_SORT : $("#LINE_SORT").val(),
		PROC_CODE : $("#PROC_CODE").val(),
		SRC_NODE_CODE : $("#SRC_NODE_CODE").val(),
		TAR_NODE_CODE : $("#TAR_NODE_CODE").val(),
		LINE_IF_RETURN : $("#LINE_IF_RETURN").val(),
		LINE_CONDS_SCRIPT : Hex.encode($("#LINE_CONDS_SCRIPT").val()),
		LINE_EXTEND_CLASS : $("#LINE_EXTEND_CLASS").val(),
		CONFIRM_MSG : Hex.encode($("#CONFIRM_MSG").val()),
		COND_MSG : Hex.encode($("#COND_MSG").val()),
		IF_PARALLEL : $("#IF_PARALLEL").val(),
		IF_OUT_DEPT : $("#IF_OUT_DEPT").val(),
		modeExpress : checkedValue,
		operListItems : Hex.encode(operListItems),
		HEX_ENCODE : true,
		UPDATE_EXPRESS : dataUpdater.saveDef(),
		LINE_EVENT : $("#LINE_EVENT").val(),
		ORG_DEF : orgRes.saveDef()
    };
    //window.returnValue = $.toJSON(nodeObj);
	window.returnValue = lineObj;
	if(closeWin){
		window.close();
		_winClosed = true;
	}
}

/**
 * 打开选择系统变量的树
 */
function openSysParams() {
	if(treeData._MSG_){
		alert(treeData._MSG_);
		return;
	}

    var _self = this;
    var inputName = "selectExpress";
	
	var extendTreeSetting = "{'cascadecheck':false,'checkParent':false,'showcheck':false}";
	
	extendTreeSetting = StrToJson(extendTreeSetting);
	
	var configStr = "SY_ORG_USER" + ",{'TYPE':'single'}";
	var options = {"itemCode":inputName,"config" : configStr,"hide":"explode","show":"blind","rebackCodes":inputName,"replaceData":treeData,
	"replaceCallBack":confirmSelect,
	"extendDicSetting":extendTreeSetting,
	"dialogName":"条件选择",
	"parHandler":_self
	};
	var dictView = new rh.vi.rhDictTreeView(options);
	dictView.show(event);
}

/**
 * 确定选择，将变量取值放到下拉框中去
 */
function confirmSelect(id,value) {
	jQuery("#optParamCode").val(id);
	jQuery("#selectExpress").val(value);
    var sysParamCode = jQuery("#optParamCode").val();
	//设置下拉框的属性
	jQuery("#expression").empty(); //清空下拉框
	var selectExp = jQuery("#expression");
    jQuery("<option value=''></option>").appendTo(selectExp);

	jQuery(operListStr).each(function(indextrty,intrty){
	    if (intrty.ID == sysParamCode) {
		    jQuery(intrty.operList).each(function(index,intrtyItem){
				jQuery("<option value='"+intrtyItem.SYNTAX+"'>"+intrtyItem.NAME+"</option>").appendTo(selectExp);
			});
	    }
	});
}

/**
 * selectId select框id 
 * expressName 表达式的名称或者表达式的CODE，通过表达式取得操作符。
 * selectedItemVal 选中的Option的Value
 */
function addPropOptions(selectObjId, expressName,selectedItemVal) {
	//设置下拉框的属性
	var selectExp = jQuery("#" + selectObjId);

	jQuery(operListStr).each(function(indextrty,intrty){
	    if (intrty.ID == expressName) {
		    jQuery(intrty.operList).each(function(index,intrtyItem){
				var optHtml = "<option value='"+intrtyItem.SYNTAX+"'" ;
				if(intrtyItem.SYNTAX == selectedItemVal){
					optHtml += " selected ";
				}
				optHtml += ">"+intrtyItem.NAME+"</option>";
				//jQuery().appendTo(selectExp);
				selectExp.append(optHtml);
			});
	    }
	});
}

/**
 * 将最后的那条数据最后添加逻辑操作符 and
 */
function addLogicSelect() {
    //取到最后一行
	jQuery('#varListTable tr:last').find("TD.logicSelect").each(function(i,n) {
		var tdItem = jQuery(n);
		var logicSelStr = "<select class='logicSelect' onchange='generateComplex()'><option value='&&'>and</option><option value='||'>or</option></select>";
		tdItem.html(logicSelStr);
	});	
}

/**
 * 删除选中的变量行
 */
function delSelectedItem(tdObj){
	var varListTable = document.getElementById("varListTable");
	varListTable.deleteRow(tdObj.parentNode.rowIndex);
	
	//将最后一行的逻辑操作符去掉
	var logicTd = jQuery('#varListTable tr:last').find("td.logicSelect");
	logicTd.html("");
	
	//重新生成表达式
	generateComplex();
}

/**
 * 点击添加按钮
 */
function clickAddBtn() {
    lineSeqNum++;
	var expression = jQuery("#expression").val();
	var optParamCode = jQuery("#optParamCode").val();
	var newVarName = jQuery("#selectExpress").val();
	var filledValue = jQuery("#expressValue").val();
	
    //先做判断，是否都填值了，否则不添加
	if(newVarName== "双击选择已定义变量" || newVarName.length <= 0) {
	    alert("请双击并选择变量!");
		return;	    
	}
	if(expression.length <= 0) {
	    alert("请选择操作符!");
		return;	    
	}
	//expression中含有${value}时，必须填写值；否则不用填写
	if(expression.indexOf('${value}') > -1 && filledValue.length <= 0){
	    alert("请填写值!");
		return;
	}
	
	var paramType = "";
	jQuery(operListStr).each(function(index,item){
	    if (item.ID == optParamCode) {
			paramType = item.PARAM_TYPE;
		}
	});
	
	var ifAddQuotation = false;
	if(paramType == "string"){
		ifAddQuotation = true;
	} else if(expression.indexOf("=")>0 || expression.indexOf(">")>0 || expression.indexOf("<")>0){
		//对 filledValue 检查，两边没有引号，进行补齐引号
	} else {
		ifAddQuotation = true;
	}
	
	if(ifAddQuotation){
		var reCat = /^".*?"/gi;
		if(!reCat.test(filledValue)){
			filledValue = "\"" + filledValue + "\"";
		}
	}
	
    //如果行数大于1，将上面的那条数据最后添加逻辑操作符 and
	if(jQuery("#varListTable").find("tr").length > 1){
		addLogicSelect();
	}
	
	addRow(expression,newVarName,filledValue,undefined,optParamCode);
	
	//清除添加的地方的值
	clearAddInput();
	
	//生成复杂表达式
	generateComplex();
}

/**
* 在表中添加一行记录
**/
function addRow(newVarValue,newVarName,filledValue,logicValue,optParamCode){
	var rowId = "EXP" + lineSeqNum;

	//添加一行
	var varListTable = jQuery("#varListTable");
	
	var pramCodeAttr = "";
	if(optParamCode){
		pramCodeAttr = "optParamCode='" + optParamCode + "'";
	}
	var newLineStr = "<tr id='liTr"+ rowId +"' " + pramCodeAttr + ">";
	
	newLineStr += "<td class='varName' style='text-align:left'>"+newVarName+"</td>";
	
	newLineStr += "<td class='tl'><select class='caoZuoFu' id='caoZuoFu" + rowId + "' onchange='generateComplex()'></select></td>";
	
	newLineStr += "<td><input class='filledValue' id='filledValue"+ rowId +"' type=text value='"+filledValue+"'  onchange='generateComplex()'></td>";
	
	if(logicValue && logicValue.length > 1) {
	    var andChecked = "";
		var orChecked = "";
		if (logicValue == "&&") {
		    andChecked = "selected";
		} else if (logicValue == "||") {
		    orChecked = "selected";
		}
	
		newLineStr += "<td class='logicSelect'><select class='logicSelect' onchange='generateComplex()' id='logicSelect"+rowId+"'><option value='&&' "+andChecked+">and</option><option value='||' "+orChecked+">or</option></select></td>";
	} else {
	    newLineStr += "<td class='logicSelect'></td>";
	}
	newLineStr += "<td onclick=\"jascript:delSelectedItem(this);\"><u>删除</u></td></tr>";
	
	jQuery(newLineStr).appendTo(varListTable);
	
	//生成下拉框  操作符 
	if(optParamCode){
		addPropOptions("caoZuoFu" + rowId, optParamCode,newVarValue);
	}else{
		addPropOptions("caoZuoFu" + rowId, newVarName,newVarValue);
	}
}

//清除添加的地方的值
function clearAddInput() {
	jQuery("#selectExpress").val("");
	jQuery("#expression").empty(); //清空下拉框
	jQuery("#expressValue").val("");
}

/**
 * 生成复杂表达式
 */
function generateComplex() {
    //读取列表的内容，循环拼串
	var genVarValue = "";
    $("#varListTable tr").each(function(j,m){
		if (jQuery(m).hasClass("topTr")) {
		    return;
		}
		var trObj = jQuery(m);
		//取到select 的value , 替换填写的值， 
		var newVarValue = trObj.find(".caoZuoFu").val();
		var filledValue = trObj.find(".filledValue").val();
		var logicValue = trObj.find("select.logicSelect").val();
		
		genVarValue += newVarValue.replace("${value}",filledValue) + " ";
		if(logicValue){
			genVarValue += logicValue + " ";
		}
	});
	
    jQuery("#LINE_CONDS_SCRIPT").val(genVarValue);
}

function onEditorLoaded(){
	document.getElementById('ctlFlash').setText(document.getElementById('LINE_CONDS_SCRIPT').value);
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
						dataUpdater.addItem(obj.UPDATE_CONDS,obj.UPDATE_FIELD,obj.UPDATE_VALUE);
					});
				}catch(e){
					
				}
			}

		}

	},
	addItem : function(conds,field,value) {
		conds = conds || "";
		field = field || "";
		value = value || "";
		var rows = "<tr class='expressList'><td>"
				 + "<textarea name='UPDATE_CONDS' class='wp' rows='3'>" + conds + "</textarea>"
				 + "</td><td>"
				 + "<textarea name='UPDATE_FIELD' class='wp' rows='3'>"  + field + "</textarea>"
				 + "</td><td>"
				 + "<textarea name='UPDATE_VALUE' class='wp' rows='3'>" + value + "</textarea>"
				 + "</td><td onclick='dataUpdater.removeItem(this)'><a>删除</a></td></tr>";
		
		jQuery("#dataUpdateTable").append(rows);
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
				UPDATE_CONDS : jQuery(obj).find("textarea[name=UPDATE_CONDS]").val(),
				UPDATE_FIELD : jQuery(obj).find("textarea[name=UPDATE_FIELD]").val(),
				UPDATE_VALUE : jQuery(obj).find("textarea[name=UPDATE_VALUE]").val()
			};
			def.push(item);
			
		});
		return Hex.encode(jQuery.toJSON(def));
	}
};

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

/**
 * 组织资源定义
 */
var orgRes = {
	/**初始化**/
	"init" : function(defVal){
		var nodeObj = undefined;
		if(defVal){
			defVal = Hex.decode(defVal);
			if(typeof(defVal) == 'string'){
				try{
					nodeObj = jQuery.evalJSON(defVal);
				}catch(e){
					//throw e;
				}
			}
		}
		nodeObj = nodeObj || {};
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
		
		//部门,默认给全部
		if (nodeObj.NODE_DEPT_MODE == undefined) {
		    nodeObj.NODE_DEPT_MODE = "2";
		}	
		jQuery("input[name='NODE_DEPT_MODE'][value='"+nodeObj.NODE_DEPT_MODE+"']").attr("checked",true);
		
		$("#NODE_DEPT_CODES").val(nodeObj.NODE_DEPT_CODES);
		if(nodeObj.NODE_DEPT_MODE == 3) { //如果是预定义， 处理下拉框
		    //将 NODE_DEPT_CODES 设置成 下拉框的默认值
	        $("#nodeDeptYuding").val(nodeObj.NODE_DEPT_CODES);
		}

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
		selectCheckBox("ENABLE_ORG_DEF",nodeObj.ENABLE_ORG_DEF);
	},
	
	/**保存**/
	"saveDef" : function(){
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
		
		var rtn = {
			ENABLE_ORG_DEF : getCheckBoxVal("ENABLE_ORG_DEF"),
			NODE_ROLE_CODES : $("#NODE_ROLE_CODES").val(),
			NODE_ROLE_MODE : $("input[name='NODE_ROLE_MODE']:checked").val(),
			NODE_BIND_MODE : $("#NODE_BIND_MODE").val(),
			NODE_ROLE_WHERE : $("#NODE_ROLE_WHERE").val(),
			NODE_ROLE_CODES__NAME : $("#NODE_ROLE_CODES__NAME").val(),
			NODE_DEPT_CODES : $("#NODE_DEPT_CODES").val(),
			NODE_DEPT_MODE : $("input[name='NODE_DEPT_MODE']:checked").val(),
			NODE_DEPT_WHERE : $("#NODE_DEPT_WHERE").val(),
			NODE_DEPT_CODES__NAME : $("#NODE_DEPT_CODES__NAME").val(),
			NODE_USER_CODES : $("#NODE_USER_CODES").val(),
			NODE_USER_MODE : $("input[name='NODE_USER_MODE']:checked").val(),
			NODE_USER_WHERE : $("#NODE_USER_WHERE").val(),
		    NODE_USER_CODES__NAME : $("#NODE_USER_CODES__NAME").val(),
		    NODE_EXTEND_CLASS : $("#NODE_EXTEND_CLASS").val(),
		}
		return Hex.encode(jQuery.toJSON(rtn));
	}
}

/**
 * 如果value为1 则选中Checkbox
 * @param chkboxId
 * @param value
 */
function selectCheckBox(chkboxId,value){
	if(value == '1' ){
		$("#" + chkboxId).attr("checked",true);
	}else{
		$("#" + chkboxId).attr("checked",false);
	}
}

/** 获取CheckBoxVal **/
function getCheckBoxVal(chkboxId){
	if($("#" + chkboxId).attr('checked') != undefined) {
		return $("#" + chkboxId).val();
	}
	return "";
}