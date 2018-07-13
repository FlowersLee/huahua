var _viewer = this;
/********** 给id为transTo的按钮绑定事件：弹开人员的查询选择，并交互后台 ***********/
_viewer.getBtn("transTo").unbind("click").bind("click", function(event) {
	//1.获取当前部门编码
	var deptCode = _viewer.itemValue("DEPT_CODE");
	//2.构造查询选择参数
	var configStr = "SY_ORG_USER,{'SOURCE':'USER_CODE~USER_NAME~DEPT_CODE'," +
			                     "'EXTWHERE':' and 1=1','TYPE':'single'}";
	var options = {"itemCode":"testOpen",
		"config" :configStr,
		"parHandler":this,
	    "replaceCallBack":function(idArray) {//回调，idArray为选中记录的相应字段的数组集合
	    	callBack(idArray);
		}
	};
	//3.用系统的查询选择组件 rh.vi.rhSelectListView()
	var queryView = new rh.vi.rhSelectListView(options);
	queryView.show(event);
});
/*
 * 查询选择回调的方法（进行工作交接）
 */
function callBack(idArray) {
	var param = {};
	//接收用户信息
	param["TARGET_ODEPT_CODE"] = idArray["DEPT_CODE"];
	param["TARGET_USER_CODE"] = idArray["USER_CODE"];
	param["TARGET_USER_NAME"] = idArray["USER_NAME"];
	//移交用户信息
	param["ORIG_ODEPT_CODE"] = _viewer.getByIdData("DEPT_CODE");
	param["ORIG_USER_CODE"] = _viewer.getByIdData("USER_CODE");
	param["ORIG_USER_NAME"] = _viewer.getByIdData("USER_NAME");
	//工作交接服务
	FireFly.doAct("SY_ORG_WORK_HANDOVER", "save", param, true);
};