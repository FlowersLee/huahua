_viewer = this;
/**
 * 如果是添加消息则直接保存
 */
_viewer.beforeSave = function(){
	var u = _viewer.getItem("USER_ID").getValue();
	_viewer.setExtendSubmitData({"USER_ID":u});
}
_viewer.afterSave = function(resultData){
	//被提醒人
	var userVal = _viewer.getItem("USER_ID").getValue();
	//提醒主键
	var REM_ID = resultData.REM_ID;
	//提醒状态
	var STATUS = _viewer.getItem("STATUS").getValue();
	//先通过当前提醒主键获取被提醒的人的主键
	var remindUserData={};
	remindUserData["_NOPAGE_"] = true;
	remindUserData["_searchWhere"] = " and REMIND_ID='"+REM_ID+"'";
	var remindUserID = FireFly.getListData("SY_COMM_REMIND_USERS",remindUserData);
	var remindUserID = remindUserID._DATA_;
	var remindUserPK ="";
	for(var i=0;i<remindUserID.length;i++){
		remindUserPK += remindUserID[i]._PK_+",";
	}
	//通过被提醒人主键批量删除
	if(remindUserPK){
		FireFly.listDelete("SY_COMM_REMIND_USERS",{"_PK_":remindUserPK});	
	}
	//如果被提醒人不为空  则保存
	if(userVal){
		var users = userVal.split(",");
		for(var i=0 ;i<users.length ;i++){
			var data = {};
			data = {"REMIND_ID":REM_ID,"USER_ID":users[i],"STATUS":STATUS};
			FireFly.cardAdd("SY_COMM_REMIND_USERS",data);
		}		
	}
}
/**
 * 如果存在主键则是修改 回显被提醒人  
 * 		如果不存在则是添加 不用回显
 */ 
var REM_ID= _viewer.getPKCode();
if(REM_ID){
	//获取被提醒人
	remindUserWhereDatas = {};
	remindUserWhereDatas["_NOPAGE_"] = true;
	remindUserWhereDatas["_searchWhere"] = " and REMIND_ID='" + REM_ID + "'";
	var remindUsers = FireFly.getListData("SY_COMM_REMIND_USERS", remindUserWhereDatas);
	var remindUsersLen = remindUsers._DATA_;
	var users = "";
	for (var i = 0; i < remindUsersLen.length; i++) {
		if (i != remindUsersLen.length - 1) {
			users += remindUsersLen[i].USER_ID + ",";
		}
		else {
			users += remindUsersLen[i].USER_ID;
		}
	}
	var userNameData = {
		"DICT_ID": "SY_ORG_DEPT_USER",
		"DICT_CODE": users
	};
	//通过被提醒人字典CODE获取名称
	var userNames = FireFly.doAct("SY_COMM_REMIND", "getUserDict", userNameData);
	//回显
	_viewer.getItem("USER_ID").setValue(users);//字典类型字段的code赋值
	_viewer.getItem("USER_ID").setText(userNames.USER_NAMES);//字典类型字段的name赋值

}
//绑定设置取消提醒的按钮如果当前状态为WAITING则改变状态为CANCLE
var status = _viewer.getItem("STATUS").getValue();
if(status == "WAITING"){
	 _viewer.setBtnText("cancleRemind","取消提醒");
}else if(status == "CANCLE") {
	_viewer.setBtnText("cancleRemind","设置提醒");
}
/**
 * 绑定取消提醒和设置提醒的按钮
 */
_viewer.getBtn("cancleRemind").unbind("click").bind("click",function(){
	
	var status = _viewer.getItem("STATUS").getValue();
	var pk = _viewer.getPKCode();
	if(pk){
		if(status == "WAITING"){
			_viewer.getItem("STATUS").setValue("CANCLE");
			_viewer.setBtnText("cancleRemind","设置提醒");
			FireFly.cardModify("SY_COMM_REMIND",{"_PK_":pk,"STATUS":"CANCLE"});
		}else if(status == "CANCLE"){
			_viewer.getItem("STATUS").setValue("WAITING");
			_viewer.setBtnText("cancleRemind","取消提醒");
			FireFly.cardModify("SY_COMM_REMIND",{"_PK_":pk,"STATUS":"WAITING"});
		}		
	}
})
//如果是添加则获取父服务的数据
if (!_viewer.getPKCode()) {
	//接受关联服务的值
	var usersValue = _viewer.getItem("USER_ID").getValue();
	var thisUser = System.getVar("@USER_CODE@");
	//判断如果有父句柄并且USER_ID不是是当前用户的值则为主服务传递的常量值（字段值）	
	if (_viewer.getParHandler() && usersValue != thisUser) {
		//获取父句柄
		var _pViewer = _viewer.getParHandler().getParHandler();
		var remindUsersCode = "";
		var remindUsersText = "";
		var usersArr = usersValue.split(",");
		for (var i = 0; i < usersArr.length; i++) {
			if (i != usersArr.length - 1) {
				//获取父服务传递的字段值
				remindUsersText += _pViewer.getItem(usersArr[i]).getText() + ",";
				remindUsersCode += _pViewer.getItem(usersArr[i]).getValue() + ",";
			}
			else {
				remindUsersText += _pViewer.getItem(usersArr[i]).getText();
				remindUsersCode += _pViewer.getItem(usersArr[i]).getValue();
			}
		}
		_viewer.getItem("USER_ID").setValue(remindUsersCode);
		_viewer.getItem("USER_ID").setText(remindUsersText);
	}
}