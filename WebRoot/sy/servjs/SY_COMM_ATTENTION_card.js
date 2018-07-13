var _viewer = this;

var proInstId = "";
var data_id = "";
if (_viewer.getParHandler().params) {
	proInstId =  _viewer.getParHandler().params.PI_ID;
	dataId =  _viewer.getParHandler().params.DATA_ID;
}

/**
 * 节点列表的下拉框
 */
showNodeSelect();
setNodeValue();
function showNodeSelect() {
	var _self = this;	

	var param = {};
	param["S_WF_INST"] = proInstId; //流程的ID
	
	var nodeDefList = FireFly.doAct("SY_WFE_PROC_DEF", "reteieveNodeDefList", param, false)._DATA_;	
	
	_viewer.getItem("NODE_CODE").removeOptions();
	_viewer.getItem("NODE_CODE").addOptions(nodeDefList);
}	

function setNodeValue() {
	var attentionTypeValue = _viewer.itemValue("ATT_TYPE");
	
	if (attentionTypeValue == '2') { //节点
		_viewer.getItem("NODE_CODE").setValue(_viewer.getByIdData("NODE_CODE"));
	}
}


/**
 * 不同关注方式的时候，改变输入的状态
 */
function _changeDisabledAttItem() {
	var attentionTypeValue = _viewer.itemValue("ATT_TYPE");

	_viewer.getItem("USER_CODE").enabled();
	_viewer.getItem("NODE_CODE").enabled();
	
	if (attentionTypeValue == '1') { //用户， 禁用选节点
		_viewer.getItem("NODE_CODE").setValue("");
		_viewer.getItem("NODE_CODE").disabled();
	} else { //节点，禁用选用户
		_viewer.getItem("USER_CODE").setValue("");
		
		_viewer.getItem("USER_CODE").disabled();
	}
}


//默认是用户，将节点的选择disable
_changeDisabledAttItem();
//处理关注方式改变的事件
_viewer.getItem("ATT_TYPE").obj.change(function(){ //提醒方式改变
	_changeDisabledAttItem();
});	


_viewer.getItem("PI_ID").setValue(proInstId);
_viewer.getItem("DATA_ID").setValue(dataId);

_viewer.beforeSave = function() {
	var attentionTypeValue = _viewer.itemValue("ATT_TYPE");
	
	var userCode = _viewer.itemValue("USER_CODE");
	var nodeCode = _viewer.itemValue("NODE_CODE");	
	
	if (attentionTypeValue == '1') { //用户
		if (userCode == "") {
			alert("请选择用户。");
			return false;
		}
		
		_viewer.getItem("USER_NAME").setValue(_viewer.getItem("USER_CODE").getText());
	} else {
		if (nodeCode == "") {
			alert("请选择节点。");
			return false;
		}
		_viewer.getItem("USER_NAME").setValue(_viewer.getItem("NODE_CODE").getText());
	}	
}
