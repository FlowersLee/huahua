/*=========================================================================================================
 * 写在最前面：此文件为功能示例文件库，包含了前端在业务操作中比较典型的功能，每个人可以在此页面添加自认为实用且具有代表性的功能代码，供大家学习和查阅。
 * 添加和修改时请按照已有代码格式添加(良好的格式、注释、作者)
 * 每个人都是贡献者也是受益者,鼓励大家勘误和贡献!!!!
 *========================================================================================================*/ 

/**********************************************************************************************************
 * 页面上的字段的对象获取，值获取和设置，显示，隐藏
 * @author liujinkai
 **********************************************************************************************************/
var itemValue = _viewer.getItem("USER_NAME").getValue();//获取字段的值
alert("字段值的获取：" + itemValue);
_viewer.getItem("USER_NAME").setValue("testcode");//常规字段的赋值

_viewer.getItem("DEPT_CODE").setValue("testcode");//字典类型字段的code赋值
_viewer.getItem("DEPT_CODE").setText("testcode__NAME");//字典类型字段的name赋值

_viewer.getItem("USER_NAME").getContainer().hide();//隐藏字段
_viewer.getItem("USER_NAME").getContainer().show();//显示字段

/**********************************************************************************************************
 * 卡片页面获取父服务的上下文句柄
 * @author liujinkai
 **********************************************************************************************************/
var name = _viewer.getParHandler().grid.getSelectItemValues("USER_NAME");
alert(name);
var btnName = _viewer.getParHandler().getBtn("add").text();
alert(btnName);

/**********************************************************************************************************
 * 字典的弹出选择并回调
 * @author liujinkai
 **********************************************************************************************************/
_viewer.getBtn("transTo").unbind("click").bind("click", function(event) {
	//1.构造树形选择参数
	var configStr = "SY_ORG_DEPT,{'TYPE':'multi'}";//此部分参数说明可参照说明文档的【树形选择】配置说明
	var extendTreeSetting = "{'rhexpand':false,'expandLevel':2,'cascadecheck':false,'checkParent':false,'childOnly':true}";
	var options = {
		"config" :configStr,
		"extendDicSetting":StrToJson(extendTreeSetting),//非必须参数，一般用不到
		"replaceCallBack":function(idArray,nameArray){//回调，idArray为选中记录的相应字段的数组集合
			dictCallBack(idArray,nameArray);
		}
	};
	//2.显示树形
	var dictView = new rh.vi.rhDictTreeView(options);
	dictView.show(event);	 
});

//字典弹出选择回调的方法
function dictCallBack(idArray,nameArray) {
	var param = {};
	param["TO_USER_CODE"] = idArray.join(",");
	param["USER_CODE"] = nameArray.join(",");
	FireFly.doAct(_viewer.servId, "testGetParam", param, true);
};

/**********************************************************************************************************
 * 打开新tab方法，并传递参数到下一个页面
 * @author liujinkai
 **********************************************************************************************************/
_viewer.getBtn("transTo").unbind("click").bind("click", function(event) {
	var params = {};
	params["test"] = _viewer.getItem("USER_NAME").getValue();
	params["hello"] = "world!";
	
	var options = {"url":"SY_ORG_DEPT.list.do","tTitle":"test","params":params,"menuFlag":3};
	Tab.open(options);
});

/**********************************************************************************************************
 * 打开新tab方法，并传递参数到下一个页面，并把当前的句柄传递到下一个页面,
 * 新打开的页面里通过_viewer.getParams().handler 可取到上个页面的句柄
 * @author liujinkai
 **********************************************************************************************************/
_viewer.getBtn("transTo").unbind("click").bind("click", function(event) {
	var params = {};
	params["test"] = _viewer.getItem("USER_NAME").getValue();
	params["hello"] = "world!";
	params["handler"] = _viewer;
	
	var options = {"url":"SY_ORG_DEPT.list.do","tTitle":"test","params":params,"menuFlag":3};
	Tab.open(options);
});

/**********************************************************************************************************
 * 给新建任务按钮绑定事件,打开新建任务服务的卡片页面,并设置回调函数,在关闭新建任务的页面时刷新本页面
 * @author liuxinhe
 **********************************************************************************************************/
_viewer.getBtn("create").unbind("click").bind("click", function() {
			Tab.open({
						"url" : "SY_COMM_TASK_ASSIGN.card.do",
						"tTitle" : "新建任务",
						"menuFlag" : 2,
						"params" : {
							"callBackHandler" : _viewer,
							"closeCallBackFunc" : function() {
								_viewer.refresh();
							}
						}
			});
});

/**********************************************************************************************************
 * 打开用户信息悬浮框
 * @author hedongyang
 **********************************************************************************************************/
//例如，在一个div标签上绑定鼠标over事件，显示个人信息悬浮框
jQuery("<div></div>").unbind("mouseover").bind("mouseover",function(event){
	var user_code = System.getVar("@USER_CODE@");
	new rh.vi.userInfo(event, user_code);//event，事件对象；user_code，用户编码
});

/**********************************************************************************************************
 * 打开小卡片页面，
 * @author liujinkai
 **********************************************************************************************************/
var res = _viewer.getBtn("exp");
res.unbind("click").bind("click",function() {
	//打开修改页面act：方法（必填），sId：服务（必填），parHandler：当前句柄，widHeiArray:小卡片的宽度高度，xyArray：左上角坐标
    var temp = {"act":UIConst.ACT_CARD_MODIFY,"sId":"SY_ORG_USER","parHandler":_viewer,"widHeiArray":[700,500],"xyArray":[200,50]};
    temp[UIConst.PK_KEY] = "liujinkai";//修改时，必填
    var cardView = new rh.vi.cardView(temp);
    cardView.show();
	//打开添加页面act：方法（必填），sId：服务（必填），parHandler：当前句柄，widHeiArray:小卡片的宽度高度，xyArray：左上角坐标
    var temp = {"act":UIConst.ACT_CARD_ADD,"sId":"SY_ORG_USER","parHandler":_viewer,"widHeiArray":[600,300],"xyArray":[200,100]};
    var cardView = new rh.vi.cardView(temp);
    cardView.show();
});

/**********************************************************************************************************
 * 日程_弹出迷你卡片页
 * 此示例代码针对需要从一个A服务的某页面中触发某个操作弹出一个dialog，其中内嵌了一个B服务的卡片
 * 页，并且可以添加在A服务打开迷你卡片时动态的添加一个按钮对象到B服务卡片页的对象属性中，然后一起
 * 交由B服务的卡片引擎渲染，如果还需要在打开卡片页的同时给里面的相应字段赋初值，可以也拿到B服务卡片
 * 页的句柄直接进行操作，避免了再去B服务卡片页的工程js中编辑代码（只有简单的逻辑操作建议这么做）
 * @author wangchen
 **********************************************************************************************************/
//设置迷你卡片页的服务id、dialog宽高、dialog坐标
var options = {"sId": "A","widHeiArray": [1000,500],"xyArray": [50,50]};
//设置服务方法、A服务句柄
var opts = {"act":UIConst.ACT_CARD_ADD,"parHandler":this}
//删除按钮对象
var deleteBtn = {
	ACT_CODE: "deleteEve",//按钮代码
	ACT_CSS: "delete",//按钮样式类型
	ACT_EXPRESSION: "",//按钮操作表达式
	ACT_EXPRESSION_FLAG: "",
	ACT_MEMO: "Calendar.deleteData(Calendar.cardOpts.currEvent, true)",//按钮操作脚本
	ACT_NAME: "删除日程",//按钮名称
	ACT_ORDER: "0",
	ACT_TYPE: "2",
	ACT_WS_FLAG: "2",
	ACT_WS_RESULT: "",
	S_FLAG: "1"
}
//初始化卡片引擎
var cardView = new rh.vi.cardView(jQuery.extend(opts,options));
//添加按钮对象到B服务卡片页的对象属性中
cardView._data.BTNS.deleteEve = deleteBtn;
//展示卡片
cardView.show();
//拿到B服务句柄（cardView）进行操作
if(cardView.getItem("CAL_START_DATE")){cardView.getItem("CAL_START_DATE").setValue(convertToDate(scheduler.getEventStartDate(eventId)));}
if(cardView.getItem("CAL_START_TIME")){cardView.getItem("CAL_START_TIME").setValue(convertToTime(scheduler.getEventStartDate(eventId)));}
if(cardView.getItem("CAL_END_DATE")){cardView.getItem("CAL_END_DATE").setValue(convertToDate(scheduler.getEventEndDate(eventId)));}
if(cardView.getItem("CAL_END_TIME")){cardView.getItem("CAL_END_TIME").setValue(convertToTime(scheduler.getEventEndDate(eventId)));}
if(!eventObj.CAL_ID){
	jQuery("[actcode='deleteEve']").hide();
}
//保存之后
cardView.afterSave = function(resultData){
	//用户逻辑代码
};

/**********************************************************************************************************
 * 相关文件字段的回调处理
 * @author chujie
 **********************************************************************************************************/
//获取相关文件的字段
var relate = _viewer.getItem("GW_RELATE");
//单击确定后进行回调处理
relate.callBack = function (arr){
   gwExtCard.getRelate(arr,_viewer);
};

/**********************************************************************************************************
 * 向某个字段后面追加一个按钮或者文字
 * @author chujie
 **********************************************************************************************************/
var searchFlag = _viewer.form.getItem("GW_PRINT");
var setSearch = jQuery(" <a href='#' style='padding-right: 20px;padding-top: 10px;' class='icon-input-select'></a>")
					.appendTo(searchFlag.obj.parent());

/**********************************************************************************************************
 * 从一个卡片向另一个卡片传递数据可以加一个link参数
 * @author chujie
 **********************************************************************************************************/
var links ={"Title":Title,"Content":Content,"PK":PK,"servId":servId};
_viewer.getBtn("remind").unbind("click").bind("click",function(event) {
	if(PK){
	    var temp = {"act":UIConst.ACT_CARD_ADD,"sId":"SY_COMM_SET_REMIND","widHeiArray":[600,360],"xyArray":[200,100],"links":links};
	    var cardView = new rh.vi.cardView(temp);
	    cardView.show(event);
	} else{
		_viewer.cardBarTipError("请先保存");
	}
});
//在另一个卡片上调用就可以得到
var remindDataID = _viewer.links.PK;

/**********************************************************************************************************
 * 颜色选取插件
 * @author 赵振兴-20130201
 **********************************************************************************************************/
 1.插件所在路径：“/sy/base/frame/coms/colorPicker/”文件目下，包括：arrow.gif,cross.gif,hs.png,hv.png,jscolor.js
 2.jscolor.js文件中第二行的"dir"属性指定js调用的arrow.gif等图片的路径。
 3.修改bindClass属性，值为绑定的input的ID属性。
 4.在页面中直接引入jscolor.js文件，调用 jscolor.bind()函数。
 	jQuery("<script type='text/javascript' src='" + FireFly.getContextPath() + "/sy/base/frame/coms/colorPicker/jscolor.js'></script>").appendTo(jQuery("body"));
 	jscolor.bind();
 5.参考服务为：SY_COMM_CAL_TYPE的卡片页，有"日程颜色"一列。参考文件为：SY_COMM_CAL_TYPE_card.js
  
/**********************************************************************************************************
 * 兼容浏览器的CSS截串方式
 * @author 赵振兴-20130201
 **********************************************************************************************************/
overflow:hidden;
white-space:nowrap;
text-overflow:ellipsis;
-o-text-overflow:ellipsis;
-moz-text-overflow:ellipsis;
-webkit-text-overflow:ellipsis;
-icab-text-overflow: ellipsis;
-khtml-text-overflow: ellipsis;
 	
/**********************************************************************************************************
 * 列表：获取选中记录的主键并交互后台
 * @author liujinkai
 **********************************************************************************************************/
_viewer.getBtn("exp").unbind("click").bind("click",function() {
	var pkCodes = _viewer.grid.getSelectPKCodes();//获取主键值
	var itemName = [];
	var i = 0;
	for (i;i < pkCodes.length;i++) {
		itemName.push(_viewer.grid.getRowItemValue(pkCodes[i],"USER_NAME"));//获取某行的字段值
	}
	var param = {};
	param["pkCodes"] = pkCodes.join(",");
	param["userName"] = itemName.join(",");
	var result = FireFly.doAct(_viewer.servId, "testListGetParam", param, true);
    if (result[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {//成功后刷新列表
    	_viewer.refresh();
    } 
});

/**********************************************************************************************************
 * 列表：行按钮的获取和事件绑定示例
 * @author liujinkai
 **********************************************************************************************************/
var res = _viewer.grid.getBtn("test");
res.unbind("click").bind("click",function() {
	var pk = jQuery(this).attr("rowpk");//获取主键信息
	alert(pk);
});

/**********************************************************************************************************
 * 动态调用消息聊天窗口示例
 * @author liujinkai
 **********************************************************************************************************/
var res = _viewer.getBtn("exp");
res.unbind("click").bind("click",function() {
	parent.rhImFunc.showChatArea({"id":"liwei","name":"aa","status":"online"});
});

/**********************************************************************************************************
 * 代码构造查询选择框，并回调
 * @author liujinkai
 **********************************************************************************************************/
_viewer.getBtn("selectOne").unbind("click").bind("click", function(event) {//选择一个现有模版
	//1.构造查询选择参数，其中参数【HTMLITEM】非必填，用以标识返回字段的值为html标签类的
	var configStr = "SY_COMM_TEMPL,{'TARGET':'~PT_TITLE~PT_CONTENT~PT_PARAM~PT_INCL_CSSJS','SOURCE':'PT_ID~PT_TITLE~PT_CONTENT~PT_PARAM~PT_INCL_CSSJS'," +
			"'HIDE':'PT_TITLE~PT_CONTENT','TYPE':'single','HTMLITEM':'PT_CONTENT,PT_INCL_CSSJS'}";
	var options = {
		"config" :configStr,
		"parHandler":_viewer,
		"formHandler":_viewer.form,
	    "replaceCallBack":function(idArray) {//回调，idArray为选中记录的相应字段的数组集合
	    	callBack(idArray);
		}
	};
	//2.用系统的查询选择组件 rh.vi.rhSelectListView()
	var queryView = new rh.vi.rhSelectListView(options);
	queryView.show(event);
});
/*
 * 回调的方法
 */
function callBack(idArray) {
	var title = idArray["PT_TITLE"] + "【新建】";
    _viewer.getItem("PT_TITLE").setValue(title);
    _viewer.getItem("PT_CONTENT").setValue(idArray["PT_CONTENT"]);
    _viewer.getItem("PT_PARAM").setValue(idArray["PT_PARAM"]);
    _viewer.getItem("PT_INCL_CSSJS").setValue(idArray["PT_INCL_CSSJS"]);
};
/**********************************************************************************************************
 * 写ftl文件中常用的freemarker语法
 * 严重注意:::::freemarker里不支持双斜杠注释(//)，添加的话将导致运行错误，请务必不要添加，可以采用<!--此处注释内容-->
 * @author liujinkai
 **********************************************************************************************************/
/*
 * 1.循环list
 */
//1.1 循环取值
<#list _DATA_ as data>
	<#if (data_index%2 == 0)>
		<tr><td>${data.MA_TITLE}</td><td>${data.S_TDEPT}</td><td>${data.S_ATIME}</td></tr>
	<#else>
		<tr class='fmyj_tr_back'><td>${data.MA_TITLE}</td><td>${data.S_TDEPT}</td><td>${data.S_ATIME}</td></tr>
	</#if>
</#list>
//1.2 beake,跳出循环
￼<#list seq as x> 
    ${x}
	<#if x = "spring">
		<#break>
	</#if> 
</#list>
//1.3 item_index:这是一个包含当前项在循环中的步进索引的数值;item_has_next:来辨别当前项是否是序列的最后一项的布尔值。
￼<#assign seq = ["winter", "spring", "summer", "autumn"]> 
<#list seq as x>
	${x_index + 1}. ${x}
	<#if x_has_next>,</#if> 
</#list>
//打印结果：
￼1. winter, 
2. spring, 
3. summer, 
4. autumn

/*
 * 2.if else 条件
 */
<#if condition> 
...
<#elseif condition2> 
...
<#elseif condition3> 
...
<#else>
...
</#if>
/*
 * 3.变量定义类
 * <#assign name=value>
 * or
 * <#assign name1=value1 name2=value2 ... nameN=valueN>
 */
<#assign myvar = "hello world">
<#assign seasons = ["winter", "spring", "summer", "autumn"]>
<#assign test = test + 1>

/*
 * 4.截串方法
 * exp?substring(from, toExclusive) , 也 可 以 作 为 exp?substring(from)调用
 */
<#assign title_home = defWf.PROC_NAME?substring(0,15) + "..">
${defWf.PROC_NAME?substring(0,15)}
/*
 * 5.长度判断
 */
<#if (userWf.PROC_NAME?length > 15)>
	<#assign title_home = userWf.PROC_NAME?substring(0,15) + "..">
</#if>
/*
 * 6.include 模板中插入另外一个 FreeMarker 模板文件(由 path 参数指定)
 *   <#include path>
 */
<#include "/common/copyright.ftl">
/*
 * 7.不存在的变量，
 * 通过在变量名后面跟着一个!和默认值。就像下面的例子,当 user 从数据模型中丢失时,模板将会将 user 的值表示为字符串”Anonymous”。
 */
<h1>Welcome ${user!}!</h1>
<h1>Welcome ${user!"Anonymous"}!</h1>
//当然也可以在变量名后面通过放置??来询问 FreeMarker 一个变量是否存在。将它和 if指令合并,那么如果 user 变量不存在的话将会忽略整个问候代码段:
<#if user??><h1>Welcome ${user}!</h1></#if>

/**********************************************************************************************************
 * 系统配置默认首页
 * 说明：通过【系统配置】，设置【SY_HOME_CONFIG】。url对应要打开的页面，menuId为对应的菜单id，closeFlag表示当前页的tab是否可以关闭
 * 注意：即使设置上面的值，通过平台的登录页进入系统，默认是带工作台桌面的，这样可以进入开发功能，便于开发。如果项目上的登录页进入系统不要工作台，需要在对应的index页面上
 *     设置<input type="hidden" id="rhDevIndex" value="false"/>,值为false即可在登录后取消工作台显示。
 * @author liujinkai
 **********************************************************************************************************/
配置值：{'tTitle':'系统首页','url':'SY_COMM_TEMPL.show.do','menuId':'huaxiaLW_Main','closeFlag':false}

/**********************************************************************************************************
 * 单点登录后，利用openTab参数设置打开的页面
 * 说明：应用场景如别的系统里嵌入咱的待办，点击待办需要打开咱系统的具体卡片，那么打开的url需要增加参数openTab，具体如下示例
 * @author liujinkai
 **********************************************************************************************************/
如：http://localhost:9009/sy/comm/page/page.jsp?openTab={'tTitle':'待办事物','url':'SY_COMM_TODO.list.do','menuId':'huaxiaLW_Main'}
其中此链接是经过Lang.strToHex后台编码，传递到新系统页面，然后经过Lang.hexToStr解码而成，目的是为了防止不能识别的传递字符。
如果不需要进行Lang.hexToStr解码，可以增加参数：'nohex':'true',即：
http://localhost:9009/sy/comm/page/page.jsp?openTab={'tTitle':'待办事物','url':'SY_COMM_TODO.list.do','menuId':'huaxiaLW_Main','nohex':'true'}

/**********************************************************************************************************
 * 菜单点击时一些特殊参数配置说明
 * @author liujinkai
 **********************************************************************************************************/
说明：1)点击直接打开一个新的浏览器级的新页面，菜单类型为链接，如：http://www.baidu.com?target=blank
    2)打开的系统列表不需要加载加载数据，菜单类型为链接，如：CM_INFOS_CHNL.list.do?dataFlag=false
    		
/**********************************************************************************************************
 * 利用系统的rh.ui.grid组件，根据自己拼装的数据对象，展示系统风格的表格
 * 说明：此组件需要几个必须参数，下面有详细的说明，前提是页面已经引入系统的inHeader.jsp文件或已经在系统的页面内
 *     下面以SY_SERV服务的两条数据为例展示数据
 * @author liujinkai
 **********************************************************************************************************/
//*必须参数，列表实体数据
var listData = {
		//*必须参数，表格头定义
		"_COLS_":{
			"SERV_ID": {"ITEM_NAME":"服务编码", "ITEM_CODE":"SERV_ID", "ITEM_LIST_FLAG":"1"},
			"SERV_NAME": {"ITEM_NAME":"服务名称", "ITEM_CODE":"SERV_NAME", "ITEM_LIST_FLAG":"1"}
		},
		//*必须参数，表格体数据定义
		"_DATA_":[
		    {"ROWNUM_": "1",
		     "SERV_ID": "SY_COMM_ADDRESS_APPLY",
		     "SERV_NAME": "通讯录申请",
		     "_PK_": "SY_COMM_ADDRESS_APPLY",
		     "_ROWNUM_": "0"
		    },
		    {"ROWNUM_": "2",
		     "SERV_ID": "SY_COMM_ADDRESS_ASSIST",
			     "SERV_NAME": "共享联系人",
			     "_PK_": "SY_COMM_ADDRESS_ASSIST",
			     "_ROWNUM_": "1"
			}
		],
		//非必须参数，分页定义信息，和buildPageFlag配合使用
		"_PAGE_": {
			"ALLNUM": "2",
			"NOWPAGE": "1",
			"PAGES": "1",
			"SHOWNUM": "2"
		}
};
//非必须参数，字段的设置信息
var mainData = {
		"ITEMS": {
                   "SERV_ID":{"ITEM_LIST_STYLE":"{'SY_COMM_ADDRESS_APPLY':'color:red'}","ITEM_LIST_ALIGN":"3","ITEM_LIST_WIDTH":"200"},
                   "SERV_NAME":{"ITEM_LIST_STYLE":"{'SY_COMM_ADDRESS_APPLY':''}","ITEM_LIST_ALIGN":"3"}
        }
};
/*
* 说明*为必须参数
* id:*唯一ID
* pCon:*外层容器
* listData:*列表数据
* mainData:字段的设置信息，
* buildPageFlag:是否显示分页，不写默认为false
*/
var options = {
		"id":"SY_SERV",
		"mainData":mainData,
		"pCon":jQuery("body"),
		"listData":listData,
		"buildPageFlag":true	
};
var grid = new rh.ui.grid(options);
grid.render();


//treegrid demo
(function($){
    //grid参数
    var listData = {
    //*必须参数，表格头定义
    "_COLS_":{
        "ID": {"ITEM_NAME":"主键", "ITEM_CODE":"ID", "ITEM_LIST_FLAG":"1"},
        "NAME": {"ITEM_NAME":"组织机构名称", "ITEM_CODE":"NAME", "ITEM_LIST_FLAG":"1", "ITEM_LIST_EDIT": 0},
        "LEADER": {"ITEM_NAME":"主管", "ITEM_CODE":"LEADER", "ITEM_LIST_FLAG":"1", "ITEM_LIST_EDIT": 1},
        "CONTACT": {"ITEM_NAME":"联系方式", "ITEM_CODE":"CONTACT", "ITEM_LIST_FLAG":"1", "ITEM_LIST_EDIT": 1}
    },

    //*必须参数，表格体数据定义，父子之间通过嵌套的方式来表达
    "_DATA_":[
        {
            "ROWNUM_": "1",
            "ID": "1",
            "NAME": "管道局",
            "LEADER": "aaaa",
            "CONTACT": "12345678",
            "_PK_": "1",
            "_ROWNUM_": "0",
            "_CHILDREN_": [
                {
                    "ROWNUM_": "2",
                    "ID": "2",
                    "NAME": "一公司",
                    "LEADER": "bbbb",
                    "CONTACT": "12345678",
                    "_PK_": "2",
                    "_ROWNUM_": "1"
                },{
                    "ROWNUM_": "3",
                    "ID": "3",
                    "NAME": "二公司",
                    "LEADER": "cccc",
                    "CONTACT": "12345678",
                    "_PK_": "3",
                    "_ROWNUM_": "2"
                },{
                    "ROWNUM_": "4",
                    "ID": "4",
                    "NAME": "中油龙慧",
                    "LEADER": "dddd",
                    "CONTACT": "12345678",
                    "_PK_": "4",
                    "_ROWNUM_": "3",
                    "_CHILDREN_":[
                        {
                            "ROWNUM_": "5",
                            "ID": "5",
                            "NAME": "产品实施中心",
                            "LEADER": "陈笑峰",
                            "CONTACT": "12345678",
                            "_PK_": "5",
                            "_ROWNUM_": "4"
                        },{
                            "ROWNUM_": "6",
                            "ID": "6",
                            "NAME": "项目实施中心",
                            "LEADER": "田利军",
                            "CONTACT": "12345678",
                            "_PK_": "6",
                            "_ROWNUM_": "5"
                        }
                    ]
                }
            ]
        }
    ]
};

//treeColumn用于指定哪一列作为树形列，当该参数存在，并且指定的列存在，则会构建treegrid
var options = {
    "pCon":$(body),
    "listData":listData,
    "treeColumn": "NAME",
    "buildPageFlag":false,
    "batchFlag": false
    };
var grid = new rh.ui.grid(options);

grid.render();

var insertData =
    [
        {
            "ROWNUM_": "1",
            "ID": "9",
            "NAME": "北京信息技术分公司",
            "LEADER": "aaaa",
            "CONTACT": "12345678",
            "_PK_": "9",
            "_ROWNUM_": "0",
            "_CHILDREN_": [
                {
                    "ROWNUM_": "2",
                    "ID": "10",
                    "NAME": "行政办公室",
                    "LEADER": "bbbb",
                    "CONTACT": "12345678",
                    "_PK_": "10",
                    "_ROWNUM_": "1"
                },{
                    "ROWNUM_": "4",
                    "ID": "11",
                    "NAME": "项目实施中心",
                    "LEADER": "dddd",
                    "CONTACT": "12345678",
                    "_PK_": "11",
                    "_ROWNUM_": "3",
                    "_CHILDREN_":[
                        {
                            "ROWNUM_": "5",
                            "ID": "12",
                            "NAME": "PCM",
                            "LEADER": "陈笑峰",
                            "CONTACT": "12345678",
                            "_PK_": "12",
                            "_ROWNUM_": "4"
                        },{
                            "ROWNUM_": "6",
                            "ID": "13",
                            "NAME": "全生命周期",
                            "LEADER": "田利军",
                            "CONTACT": "12345678",
                            "_PK_": "13",
                            "_ROWNUM_": "5"
                        }
                    ]
                }
            ]
        }
    ];

    //插入行
    grid.insertTreegridRows('4', insertData);

    var a = function(e, grid){alert()};
    //注册树节点点击事件
    grid.registerTreeNodeClickEventHandler(a);
    //取消注册树节点点击事件
    grid.unregisterTreeNodeClickEventHandler(a);
})($);

/**********************************************************************************************************
 * 利用系统的rh.ui.Form组件，根据自己拼装的数据对象，展示系统风格的Form表单
 * 说明：此组件需要几个必须参数，下面有详细的说明，前提是页面已经引入系统的inHeader.jsp文件或已经在系统的页面内
 * @author liujinkai
 **********************************************************************************************************/
/*
* form的定义信息
* SERV_CARD_STYLE:卡片显示列数，不写默认为2列
* ITEMS:*每个字段项的定义信息
* DICTS:字段项中用到的字典项预定义信息
* 说明：如果查询选择和字典的点击事件自己写的话，就找到相应的图标绑定上相应的自己的事件
*/
var mainData = {"SERV_CARD_STYLE":1,
		        "ITEMS": {
	                       "SERV_TEXT":{"ITEM_CODE":"SERV_TEXT",
	                    	          "ITEM_NAME":"输入框",
	                    	          "ITEM_INPUT_TYPE":"1",
	                    	          "ITEM_INPUT_MODE":"1",
	                    	          "ITEM_CARD_WIDTH":"0",
	                    	          "ITEM_CARD_DISABLE":"2"},
	     		               "SERV_RADIO":{"ITEM_CODE":"SERV_RADIO",
		                    	            "ITEM_NAME":"单选框",
		                    	            "ITEM_INPUT_TYPE":"3",
		                    	            "ITEM_INPUT_MODE":"1",
		                    	            "ITEM_INPUT_CONFIG":"SY_YESNO",
		                    	            "DICT_ID":"SY_YESNO",
		                    	            "ITEM_CARD_WIDTH":"0",
		                    	            "ITEM_CARD_DISABLE":"2"},
	     		           "SERV_MULTIRADIO":{"ITEM_CODE":"SERV_MULTIRADIO",
		                    	            "ITEM_NAME":"多选框",
		                    	            "ITEM_INPUT_TYPE":"4",
		                    	            "ITEM_INPUT_MODE":"1",
		                    	            "ITEM_INPUT_CONFIG":"SY_SERV_QUERY_MODE",
		                    	            "DICT_ID":"SY_SERV_QUERY_MODE",
		                    	            "ITEM_CARD_WIDTH":"0",
		                    	            "ITEM_CARD_DISABLE":"2"},
     		     		   "SERV_SELECT":{"ITEM_CODE":"SERV_SELECT",
		                    	            "ITEM_NAME":"下拉框",
		                    	            "ITEM_INPUT_TYPE":"2",
		                    	            "ITEM_INPUT_MODE":"1",
		                    	            "ITEM_INPUT_CONFIG":"SY_SERV_QUERY_MODE",
		                    	            "DICT_ID":"SY_SERV_QUERY_MODE",
		                    	            "ITEM_CARD_WIDTH":"0",
		                    	            "ITEM_CARD_DISABLE":"2"},
			     		     	"SERV_FILE":{"ITEM_CODE":"SERV_FILE",
		                    	            "ITEM_NAME":"附件",
		                    	            "ITEM_INPUT_TYPE":"7",
		                    	            "ITEM_INPUT_MODE":"1",
		                    	            "ITEM_INPUT_CONFIG":"SY_SERV_QUERY_MODE",
		                    	            "DICT_ID":"SY_SERV_QUERY_MODE",
		                    	            "ITEM_CARD_WIDTH":"0",
		                    	            "ITEM_CARD_DISABLE":"2"},
			     		     	"SERV_TEXTAREA":{"ITEM_CODE":"SERV_TEXTAREA",
		                    	            "ITEM_NAME":"大文本",
		                    	            "ITEM_INPUT_TYPE":"5",
		                    	            "ITEM_INPUT_MODE":"1",
		                    	            "ITEM_INPUT_CONFIG":"",
		                    	            "DICT_ID":"",
		                    	            "ITEM_CARD_WIDTH":"0",
		                    	            "ITEM_CARD_DISABLE":"2"},
			     		    "SERV_TIME":{"ITEM_CODE":"SERV_TIME",
		                    	            "ITEM_NAME":"时间",
		                    	            "ITEM_INPUT_TYPE":"1",
		                    	            "ITEM_INPUT_MODE":"4",
		                    	            "ITEM_INPUT_CONFIG":"DATE",
		                    	            "DICT_ID":"",
		                    	            "ITEM_CARD_WIDTH":"0",
		                    	            "ITEM_CARD_DISABLE":"2"},
	    				     	"SERV_DICT":{"ITEM_CODE":"SERV_DICT",
		                    	            "ITEM_NAME":"字典选择",
		                    	            "ITEM_INPUT_TYPE":"1",
		                    	            "ITEM_INPUT_MODE":"3",
		                    	            "ITEM_INPUT_CONFIG":"SY_SERV_QUERY_MODE",
		                    	            "DICT_ID":"",
		                    	            "ITEM_CARD_WIDTH":"0",
		                    	            "ITEM_CARD_DISABLE":"2"},
			     		    "SERV_QUERYSELECT":{"ITEM_CODE":"SERV_QUERYSELECT",
		                    	            "ITEM_NAME":"查询选择",
		                    	            "ITEM_INPUT_TYPE":"1",
		                    	            "ITEM_INPUT_MODE":"2",
		                    	            "ITEM_INPUT_CONFIG":"",
		                    	            "DICT_ID":"",
		                    	            "ITEM_CARD_WIDTH":"0",
		                    	            "ITEM_CARD_DISABLE":"2"}
                         },
                 "DICTS" : {
                	 "SY_YESNO":[{"NAME":"是","ITEM_NAME":"是","ID":"1","ITEM_CODE":"1"},
                	             {"NAME":"否","ITEM_NAME":"否","ID":"2","ITEM_CODE":"2"}],
                	 "SY_SERV_QUERY_MODE":[{"NAME":"简洁模式","ITEM_NAME":"简洁模式","ID":"1","ITEM_CODE":"1"},
                	                       {"NAME":"平铺模式","ITEM_NAME":"平铺模式","ID":"2","ITEM_CODE":"2"},
                	                       {"NAME":"卡片模式","ITEM_NAME":"卡片模式","ID":"3","ITEM_CODE":"3"}]
                 }
               };
/*
* 说明*为必须参数
* pId:*唯一ID,将和字段的编码合并构成每个字段的唯一ID
* data:*form的定义数据
*/
var opts = {
	"pId":"formView",
	"data" : mainData
};
var form = new rh.ui.Form(opts);
form.obj.appendTo(jQuery("body"));
//组件的渲染
form.render();
//如果需要填充业务数据，请执行下面代码。注意字典项需要__NAME的值
var idData = {"SERV_TEXT":"我是单选框的值",
		      "SERV_RADIO":"1",
		      "SERV_MULTIRADIO":"1,2",
		      "SERV_SELECT":"2",
		      "SERV_FILE":"文件名对应uuid.txt,文件显示名称.txt",
		      "SERV_TEXTAREA":"我是大文本的值",
		      "SERV_TIME":"2013-07-05",
		      "SERV_DICT":"1",
		      "SERV_DICT__NAME":"简洁模式",
		      "SERV_QUERYSELECT":"我是查询选择"
		      };
form.fillData(idData);

/**********************************************************************************************************
 * 通过后台监听类实现对模版参数的处理
 * 说明：需要在监听类里实现接口PortalListenInterface的方法beforeInputParamBean(ParamBean paramBean),来完成对参数的处理。实现步骤如下
 * @author liujinkai
 **********************************************************************************************************/
1、在首页模版的字段【参数设定】里填写相应监听类，如：{"LISTENER":"com.rh.core.comm.portal.PortalTemplServ"}
2、在PortalTemplServ里实现接口PortalListenInterface的方法beforeInputParamBean(ParamBean paramBean);


Layout组件的使用可参考例子，路径为/sy/base/frame/plugs/jquery-ui/sample/layout/index.jsp，
说明文档在/doc/Layout使用说明文档.docx
