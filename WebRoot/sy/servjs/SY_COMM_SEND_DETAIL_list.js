/** 服务卡片使用的js方法定义：开始 */
var _viewer = this;

/**
 * 将不是自己分发的数据变为只读
 */
_viewer.grid.getCheckBox().each(function(){
	var rowItem = jQuery(this);
	//将分发时间不为空的数据变为只读
	var pkCode = _viewer.grid.getRowPkByElement(rowItem);
	var recvTime = _viewer.grid.getRowItemValue(pkCode,"RECV_TIME");
	if(recvTime.length > 0){
		jQuery(this).hide();
		return;
	}
	//将分发状人不是自己的数据变为只读
	var userCode = System.getVar("@USER_CODE@");
	var sendUser = _viewer.grid.getRowItemValue(pkCode,"S_USER");
	if(userCode != sendUser){
		jQuery(this).hide();
		return;
	}
	//将分发状态不是已分发的数据变为只读
	var status = _viewer.grid.getRowItemValue(pkCode,"SEND_STATUS");
	if(status != "2"){
		jQuery(this).hide();
	}
});