var _viewer = this;
var previewBtn = _viewer.getBtn('register');

previewBtn.click(function(){
	//开通该部门站点
	var servId = "SY_ORG_DEPT";
	var dataId = _viewer.itemValue("DEPT_CODE");
	var data = {};
	data["SERV_ID"] = servId;
	data["DATA_ID"] = dataId;
	data["SITE_TYPE"] = 2;
	var resultData = parent.FireFly.doAct("CM_CMS_SITE", "register", data);
	if (resultData[UIConst.RTN_MSG] && resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
  		Tip.show("操作成功!");
	} else {
		Tip.showError(resultData[UIConst.RTN_MSG], true);
	}
	
});
