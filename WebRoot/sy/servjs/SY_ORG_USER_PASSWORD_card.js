var _viewer = this;
var obj = jQuery("<div id='SY_ORG_USER_PASSWORD-USER_PASS_div' class='inner' style='width:97.5%'>" +
		"<span class='left' style='width:35%;'>" +
		"<label id='SY_ORG_USER_PASSWORD-USER_PASS_label' for='SY_ORG_USER_PASSWORD-USER_PASS' class='ui-label-default'>" +
		"<span class='name' style='cursor:pointer;'>新密码</span>" +
		"<span class='star'>&nbsp;&nbsp;&nbsp;&nbsp;</span></label></span><span class='right' style='width:65%;'>" +
		"<input id='SY_ORG_USER_PASSWORD-USER_PASS' type='password' name='SY_ORG_USER_PASSWORD-USER_PASS' class='ui-text-default ui-text-disabled'  style='max-width: 200px; '>" +
		"</span></div>");
obj.appendTo( jQuery(".formContent"));
var obj2 = jQuery("<div id='SY_ORG_USER_PASSWORD-USER_PASS_CHE_div' class='inner' style='width:97.5%'>" +
		"<span class='left' style='width:35%;'>" +
		"<label id='SY_ORG_USER_PASSWORD-USER_PASS_CHE_label' for='SY_ORG_USER_PASSWORD-USER_PASS_CHE' class='ui-label-default'>" +
		"<span class='name' style='cursor:pointer;'>确认密码</span>" +
		"<span class='star'>&nbsp;&nbsp;&nbsp;&nbsp;</span></label></span><span class='right' style='width:65%;'>" +
		"<input id='SY_ORG_USER_PASSWORD-USER_PASS_CHE' type='password' name='SY_ORG_USER_PASSWORD-USER_PASS_CHE' class='ui-text-default ui-text-disabled'  style='max-width: 200px; '>" +
		"</span></div>");
obj2.appendTo( jQuery(".formContent"));

var userCode =  _viewer.itemValue("USER_CODE");

var appData = {'APP_SSO':'3'};
var appResultData = FireFly.doAct("PT_APP","finds",appData,false);
var dataList = appResultData._DATA_;
if(dataList.length > 0) {	
	jQuery.each(dataList,function(i,app) {
	var appId = app["APP_ID"];
	var userData = {'APP_ID':appId , 'USER_CODE':userCode};
	var userResultData= FireFly.doAct("PT_APP_USER" , "finds" , userData,false);
	if(userResultData._DATA_ == "") {
		 FireFly.doAct("PT_APP_USER" , "add" , userData,false);
		 _viewer.sonTab["PT_APP_PASSWORD"].refresh();
	}
});
}



 _viewer.getBtn('save').unbind("click").bind("click",function() {
	var pswd = jQuery("#SY_ORG_USER_PASSWORD-USER_PASS");
	var pswdChe = jQuery("#SY_ORG_USER_PASSWORD-USER_PASS_CHE");
	if (pswd.val().length == 0) {
		pswd.focus();
		Tip.showError("新密码不能为空！");
        return;
    } else{	
		if (pswdChe.val() == pswd.val()) {
			 var data = {};
			 var userCode =  _viewer.itemValue("USER_CODE");
			 data[UIConst.PK_KEY] = userCode;
			 var datas = {'USER_PASSWORD':pswd.val()};
			 data = jQuery.extend(data,datas);
			 var resultData = FireFly.doAct("SY_ORG_USER","save",data,false);
			 if (resultData[UIConst.RTN_MSG] && resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
				 Tip.show("密码已修改，请重新登陆！");
			   } else {
				   Tip.showError("密码修改失败！"+resultData[UIConst.RTN_MSG]);
			   } 
		} else {
			Tip.showError("确认密码与新密码不一致！");
			 return;
		}
    }
	
});


 
 
 
