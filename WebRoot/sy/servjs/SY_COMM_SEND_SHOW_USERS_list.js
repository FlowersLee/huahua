var _viewer = this;

jQuery(".rhGrid-btnBar .searchDiv").hide();
_viewer.grid.unbindTrdblClick();
_viewer.params.ifFirst = "no";

//删除 列表复选框列
_viewer.grid.hideCheckBoxColum();

//行按钮绑定删除事件
_viewer.grid.getBtn("delete").unbind("click").bind("click",function(){
	FireFly.doAct(_viewer.servId,"delete",{"_PK_":jQuery(this).attr("rowpk")});
	_viewer.refresh();
});


//分发按钮
var send = _viewer.getBtn("send");
send.unbind("click").bind("click", function(event) {
	//判断是否有分发记录需要分发
	var recvUsers = _viewer.grid.getTdItems("RECV_UNAME");
	if(recvUsers == 0){
		alert("没有可以分发的用户！");
		return;
	}
	
	var resultData = FireFly.doAct("SY_COMM_SEND_SHOW_USERS", "send", _viewer.params);
	_viewer.params.TARGET_ROLE = "";
	_viewer.params.TARGET_DEPTS = "";
	_viewer.params.TARGET_USERS = "";
	//_viewer.refresh();
    if (resultData[UIConst.RTN_MSG] && resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
	    alert("发送成功");
	    Tab.close();
	}
});