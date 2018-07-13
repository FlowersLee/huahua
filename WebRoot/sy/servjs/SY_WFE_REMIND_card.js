var _viewer = this;
var titleDiv = jQuery("<div></div>").css({"margin":"10px 0px"});
var table = jQuery("<table width='100%'></table>").appendTo(titleDiv);
var tr1 = jQuery("<tr></tr>").appendTo(table);
var td11 = jQuery("<td width='30%'></td>").appendTo(tr1);
var td12 = jQuery("<td width='40%' align='center'></td>").appendTo(tr1);
var td13 = jQuery("<td width='30%' align='left'></td>").appendTo(tr1);
var title1 = jQuery("<font style='color: #FF0000;font-family: 方正小标宋简体;font-size: 24px;'></font>").appendTo(td12);
//_viewer.form.getItem("REMD_SCRT").getContainer().css({"width":"100%","margin":"0px"}).appendTo(td13);
_viewer.form.getItem("S_EMERGENCY").getContainer().css({"width":"100%","margin":"0px"}).appendTo(td13);

var tr2 = jQuery("<tr></tr>").appendTo(table); //编号
var td21 = jQuery("<td width='100%' colspan=3 align='right'></td>").appendTo(tr2);
var yearCode = _viewer.form.getItem("REMD_CODE");
_viewer.form.getItem("REMD_CODE").getContainer().remove();
yearCode.obj.css({"float":"none","width":"auto"}).appendTo(td21);
var gwCode = jQuery("<span></span>").appendTo(td21);
jQuery("<font>（</font>").appendTo(gwCode);
_viewer.form.getItem("REMD_YEAR").getContainer().remove();
_viewer.form.getItem("REMD_YEAR").obj.css({"float":"none","width":"auto"}).appendTo(gwCode);
jQuery("<font>）</font>").appendTo(gwCode);
_viewer.form.getItem("REMD_NUM").getContainer().remove();
_viewer.form.getItem("REMD_NUM").obj.css({"float":"none","width":"auto"}).appendTo(gwCode);
jQuery("<font>号</font>").appendTo(gwCode);

_viewer.form.obj.find("fieldset").first().prepend(titleDiv);

getMaxCode();

//添加被催办文件链接
//获取字段对象
var preesObj = _viewer.form.getItem("PREES_FILES").obj;
//获取数据ID
var dataId = _viewer.getItem("DATA_ID").getValue() || "";
//获取被催办文件label和值
//如果不存在数据ID
if("" == dataId){
	//如果没有被催办文件，则隐藏
	preesObj.parent().parent().hide();
} else {
	//获取数据对象的标题
	var preesArry = FireFly.doAct("SY_COMM_ENTITY","finds",{"_SELECT_":"TITLE","_WHERE_":" and DATA_ID='"+dataId+"'"});
	if (preesArry.length > 0) {
		//获取标题
		var title = preesArry["_DATA_"][0]["TITLE"] || "";
		//如果存在标题
		if ("" != title) {
			preesObj.html(title).unbind("click").bind("click",function(){
				Tab.open({
					"url": _viewer.getItem("SERV_ID").getValue() + ".card.do?pkCode=" + dataId,
					"tTitle": title,
					"menuFlag": "4"
				});
			});
		}
	} else {
		//如果没有被催办文件，则隐藏
		preesObj.parent().parent().hide();
	}
}

//获取机关代字最大值
function getMaxCode() {
	var param = {};
	param["REMD_CODE"] = yearCode.getValue();
	param["REMD_YEAR"] = _viewer.form.getItem("REMD_YEAR").getValue();
	var yearNumber = _viewer.getByIdData("REMD_NUM");
	if (yearNumber<=0) {
		var tmpl = FireFly.doAct(_viewer.servId, "getMaxCode", param, false);
		yearNumber = tmpl["REMD_NUM"];
	}
	
	_viewer.form.getItem("REMD_NUM").setValue(yearNumber);
}

_viewer._parentRefreshFlag = true;