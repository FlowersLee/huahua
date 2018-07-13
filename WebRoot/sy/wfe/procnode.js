$(document).ready(function() {
	$( "#tabs" ).tabs();
	
	var node = window.dialogArguments;
	//初始化页面表单
	_initForm(node);
	//初始化组织资源
	_initOrganizationResource(node);
	_initOrganizationResourceLimitation(node);
});

/**
 * 初始化页面表单
 * 
 * @param {Object} node		节点对象
 */
function _initForm(node){
	$.each(node, function(i, n){
		var input = $('#' + i);
		if(input.length > 0){
			if(input.attr('type') == 'checkbox'){
				if(n == '1'){
					input.attr('checked', true);
				}
			}else{
				input.val(n);
			}
		}
	});
}

/**
 * 初始化组织资源的页面
 * @param {Object} node 节点对象
 */
function _initOrganizationResource(node){
	//bind类型
	if(node.NODE_BIND_MODE == 'ROLE'){
		$("#NODE_BIND_MODE_ROLE").attr("checked",true);
	}
    //角色
	$("#NODE_ROLE_CODES").val(node.NODE_ROLE_CODES);
	//默认给全部
	if (node.NODE_ROLE_MODE == undefined) {
	    node.NODE_ROLE_MODE = "2";
	}
	jQuery("input[name='NODE_ROLE_MODE'][value='"+node.NODE_ROLE_MODE+"']").attr("checked",true);
	
	$("#NODE_ROLE_WHERE").val(node.NODE_ROLE_WHERE);
	$("#NODE_ROLE_CODES__NAME").val(node.NODE_ROLE_CODES__NAME);
	
	//部门
	//默认给全部
	if (node.NODE_DEPT_MODE == undefined) {
	    node.NODE_DEPT_MODE = "2";
	}	
	jQuery("input[name='NODE_DEPT_MODE'][value='"+node.NODE_DEPT_MODE+"']").attr("checked",true);
	
	$("#NODE_DEPT_CODES").val(node.NODE_DEPT_CODES);
	if(node.NODE_DEPT_MODE == 3) { //如果是预定义， 处理下拉框
        $("#nodeDeptYuding").val(node.NODE_DEPT_CODES);
	}

	$("#NODE_DEPT_WHERE").val(node.NODE_DEPT_WHERE);
	$("#NODE_DEPT_CODES__NAME").val(node.NODE_DEPT_CODES__NAME);
	
	//人员
	//默认给全部
	if (node.NODE_USER_MODE == undefined) {
	    node.NODE_USER_MODE = 2;
	}
	
	if(node.NODE_USER_MODE == 3){//用户选择预定义
		$("#nodeUserYuding").val(node.NODE_USER_CODES);
		node.NODE_USER_CODES = "";
	}
	
	$("#NODE_USER_CODES").val(node.NODE_USER_CODES);
	jQuery("input[name='NODE_USER_MODE'][value='"+node.NODE_USER_MODE+"']").attr("checked",true);
	$("#NODE_USER_WHERE").val(node.NODE_USER_WHERE);		
	$("#NODE_USER_CODES__NAME").val(node.NODE_USER_CODES__NAME);
}

/**
 * 初始化组织资源输入限制条件
 * @param {Object} node 节点
 */
function _initOrganizationResourceLimitation(node){
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
 * 打开服务选择对话框
 * 
 * @param {String} inputName	选择之后的回填输入框name
 */
function openServiceSelectDialog(inputName){
	var configStr = "SY_SERV,{'TARGET':'"
			+ inputName
			+ "~','SOURCE':'SERV_ID~SERV_DATA_TITLE~SERV_NAME','EXTWHERE':' and SERV_DATA_TITLE is not null','TYPE':'single'}";
	var options = {
		"itemCode" : inputName,
		"config" : configStr,
		"rebackCodes" : inputName,
		"parHandler" : this,
		"formHandler" : this,
		"replaceCallBack" : function(result) {

		},"hideAdvancedSearch":true
	};
	var queryView = new rh.vi.rhSelectListView(options);
	queryView.show(null,[50,0]);
}

/**
 * 打开部门选择和角色选择的树
 * @param {String} inputName 回写的dom对象id
 * @param {String} radioInputId 对应的radio的id
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
 * @param {String} inputName
 * @param {String} formTableName
 * @param {String} radioInputId
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
 * 确认，并关闭弹出页面，返回节点定义
 * @param {boolean} closeWin 是否关闭窗口
 */
function confirmAll(closeWin){
	//设置所有checkbox的值
	$.each($('input[type="checkbox"]'), function(i, n){
		var checkbox = $(n);
		if(checkbox[0].checked){
			checkbox.val('1')
		}else{
			checkbox.val('2');
		}
	});
	
	//bind类型
	if($("#NODE_BIND_MODE_ROLE").val() == '1') {
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

	var node = {};
	$.each($('input[type!="button"], select, textarea'), function(i, n){
		var item = $(n);
		var itemName = item.attr('name');
		if(itemName == undefined){
			return;
		}
		if(item.attr('type') == 'radio'){
			if(item.prop('checked')){
				node[itemName] = item.val();
			}
		}else{
			node[itemName] = item.val();
		}
	});

	window.returnValue = node;
	if(closeWin){
		window.close();
	}
}

/**
 * 取消，并返回父页面
 */
function cancelAll(){
	if(confirm("是否确定取消？")){
	    window.returnValue = "undefined";
	    window.close();
	}
}
