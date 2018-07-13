/** home页面渲染引擎 */
GLOBAL.namespace("rh.vi");
/**
 * 首页模版引擎，通过外部jsp传进模版定义bean，内部通过getPortal方法构造
 * */
rh.vi.portalView = function(options) {
	var defaults = {
		"id":options.id + "-viPortalView",
		"pkCode":""
	};
	this.opts = jQuery.extend(defaults,options);
	this._model = this.opts.model || "view";//显示模式 view:查看模式   edit:全编辑模式  
	this._pkCode = this.opts.pkCode || "";
	this._action = this.opts.action; //执行的动作，new：添加
	this._extendType = this.opts.extendType || "";  //添加的类型，per:个人
	this._type = this.opts.type || "";  //添加的类型(规则)，4:个人
	this._paramBean = this.opts.paramBean || "paramBean";//外层调用传递的参数对象
	this._ptParam = {};
	this._expParam = "";
	//模版缓存启用后，根据url值进行缓存
	this.onlyUrl = "SY_COMM_TEMPL.getPortal.do?pk=" + this._pkCode + "&userCode=" + System.getVar("@USER_CODE@")
	             + "&action=" + this._action + "&type=" + this._type + "&model=" + this._model;
};
/*
 * 渲染主方法
 */
rh.vi.portalView.prototype.show = function() {
	var _self = this;
	this._initMainData();//初始化数据
	
	this._layout();      //构建布局
	if (this._model == "edit") {
		this._editModel();      //编辑模式判断
	}
    jQuery(document).ready(function(){
    	setTimeout(function() {
    	_self._afterLoad();
    	_self._resetHeiWid();
    	},0);
    });
};
/*
 * 准备数据
 */
rh.vi.portalView.prototype._initMainData = function() {
	var _self = this;
	Tools.rhSetBodyBack();
	var ptType = 1;//OA首页
	var ptTitle = "办公首页";//OA首页
	
	//根据参数判断是否添加状态
	if (this._paramBean.PT_EXP_ORDER && this._paramBean.PT_EXP_ORDER == 1 
			&& this._action == "copy") {//规则排序最高,从首页修改进来
		this._action = "new";
	}
	
	var res = {};
	if (this._action == "new") {//进入个人新建状态
		this.templPKCode = "";
	} else {
		this.templPKCode = this._pkCode;
	}
	var data = {};
	data["PT_ID"] = this.templPKCode;
	
	data = jQuery.extend(data,this._paramBean);
	res = rh_processData(this.onlyUrl,data,false);		
	if ((res.PORTAL != null) && (res.PORTAL != "")) {
	  _self._templBeanParam = StrToJson(this._paramBean.PT_PARAM) || {};//模版内每个组件各自的定义参数
	  jQuery("body").html(res.PORTAL);
	} else {
	  _self._templBeanParam = {};
	  jQuery("body").html(res.PORTAL);
	}
};

/*
 * 构建列表页面布局
 */
rh.vi.portalView.prototype._layout = function() {
	this._initArea();
};
/*
 * 编辑模式
 */
rh.vi.portalView.prototype._editModel = function() {
	var _self = this;
	//构造按钮条
	var btnBar = jQuery("<div></div>").addClass("portal-btnBar");
	var tempData ={
			"model":{"ACT_NAME":"选择布局","ACT_CSS":"add","ACT_CODE":"model","ACT_TITLE":"选择模版的布局"},
			"coms":{"ACT_NAME":"选择组件","ACT_CSS":"add","ACT_CODE":"coms","ACT_TITLE":"选择布局上的组件"},
			//"netcoms":{"ACT_NAME":"选择本公司组件","ACT_CSS":"add","ACT_CODE":"netcoms"},
			"save":{"ACT_NAME":" 保存 ","ACT_CSS":"save","ACT_CODE":"save","ACT_TITLE":"保存整个模版的设置"},
			"view":{"ACT_NAME":" 预览 ","ACT_CSS":"search","ACT_CODE":"view","ACT_TITLE":"预览当前模版"},
			"refresh":{"ACT_NAME":"刷新 ","ACT_CSS":"refresh","ACT_CODE":"refresh","ACT_TITLE":"刷新当前模版"},
			"close":{"ACT_NAME":"关闭本页 ","ACT_CSS":"delete","ACT_CODE":"close","ACT_TITLE":"关闭当前模版页面"}}
	
	jQuery.each(tempData,function(i,n) {
			var temp = jQuery("<a></a>").addClass("rh-icon").addClass("rhGrid-btnBar-a");
			temp.attr("actcode",n.ACT_CODE);
			temp.attr("title",n.ACT_TITLE);
			temp.attr("id","btnBar-a-" + n.ACT_CODE);
			_self._act(n.ACT_CODE,temp);
			var labelName = jQuery("<span></span>").addClass("rh-icon-inner").text(n.ACT_NAME);
			temp.append(labelName);
			var icon = jQuery("<span></span>").addClass("rh-icon-img").addClass("btn-" + n.ACT_CSS);
			temp.append(icon);
			btnBar.append(temp);
	});
	var theme = jQuery("<select style='border:1px gray solid;margin-left:20px;margin-top:3px;' title='选择模版的风格，点击保存生效'>" +
			"<option value='portal-null'>模版风格（默认）</option><option value='portal-blue'>模版风格（蓝）</option>" +
			"<option value='portal-orange'>模版风格（桔色）</option><option value='portal-gray'>模版风格（灰）</option></select>")
	theme.bind("change", function(event) {
		var themeVal = jQuery(this).val();
		if (themeVal == "portal-null") {
			return true;
		}
		if (themeVal == "portal-blue") {
			delete _self._templBeanParam["THEME"];
		} else {
			_self._templBeanParam.THEME = themeVal;
		}
	});
	theme.appendTo(btnBar);
    btnBar.prependTo(jQuery("body"));
	this._initPortalAreaMove();
};
rh.vi.portalView.prototype._act = function(aId,taObj) {
	var _self = this;
	switch(aId) {
		case "model"://选择模版
			taObj.bind("click",function() {
				_self._openModelView();
				});	
			break;
		case "coms"://选择组件
			taObj.bind("click",function(event) {
				    parent.Tip.showLoad("组件打开中");
					setTimeout(function() {
					   _self._openComsView(1);
					},0);
					event.stopPropagation();
					return false;
				});	
			break;
		case "netcoms"://选择本公司组件
			taObj.bind("click",function() {
				_self._openComsView(2);
				});	
			break;
		case "view"://预览
		    taObj.bind("click",function() {
		    	Tab.open({'url':'SY_COMM_TEMPL.show.do?model=view&pkCode=' + _self._pkCode,'tTitle':'模版预览','menuFlag':3});
		    });  
		    break;
		case "save"://保存
		    taObj.bind("click",function() {
		    	_self._saveTempl();
		    });  
		    break;
		case "refresh"://刷新
		    taObj.bind("click",function() {
		    	window.location.href = window.location.href;
		    });  
		    break;
		case "close"://关闭
		    taObj.bind("click",function() {
		    	Tab.close();
		    });  
		    break;
	}
};
/*
 * 打开模版设置页面
 */
rh.vi.portalView.prototype._openModelView = function() {
	var _self = this;
	this._modelId = "rh_portal_model_dialog";
	//1.构造dialog
	this.winDialogModel = jQuery("<div></div>").addClass("rh-searchDialog").attr("id",this._modelId).attr("title","选择模版");
	this.winDialogModel.appendTo(jQuery("body").first());
	//@TODO:显示位置处理
	var hei = 400;
	var wid = jQuery("body").width()-200;
	var posArray = [];
	posArray[0] = "";
	posArray[1] = 20;
	
	jQuery("#" + this._modelId).dialog({
		autoOpen: false,
		height: hei,
		width: wid,
		modal: true,
		resizable:false,
		draggable:false,
		position:posArray,
		close: function() {
			_self.winDialogModel.empty();
			_self.winDialogModel.remove();
		}
	});
	_self._bldModelContent();
	var dialogObj = jQuery("#" + this._modelId);
	dialogObj.dialog("open");
	jQuery("#top_href").click();
	dialogObj.parent().addClass("rh-bottom-right-radius portal-selectComs-dialog");
	jQuery(".ui-dialog-titlebar").last().css("display","block");//设置标题显示
	
};
/*
 * 构造设置模版页面
 */
rh.vi.portalView.prototype._bldModelContent = function() {
	var _self = this;
	_self.models = {
			"co1":{"name":"1列布局","html":"<div class='portal-model-area wp95 floatLeft h250'>1列</div>",
				"tarhtml":"<div class='portal-target wp100 floatLeft'></div>"},
			"co3":{"name":"3列布局","html":"<div class='portal-model-area wp30 floatLeft h250'>1列</div><div class='portal-model-area wp30 floatLeft h250'>2列</div><div class='portal-model-area wp30 floatLeft h250'>3列</div>",
				"tarhtml":"<div class='portal-target wp33 floatLeft'></div><div class='portal-target wp34 floatLeft'></div><div class='portal-target wp33 floatLeft'></div>"},
			"co3_centerbig":{"name":"3列布局,中间列宽","html":"<div class='portal-model-area wp20 floatLeft h250'>1列</div><div class='portal-model-area wp50 floatLeft h250'>2列</div><div class='portal-model-area wp20 floatLeft h250'>3列</div>",
				"tarhtml":"<div class='portal-target wp25 floatLeft '></div><div class='portal-target wp50 floatLeft'></div><div class='portal-target wp25 floatLeft'></div>"},
			"co2_leftbig":{"name":"2列布局,左侧列宽","html":"<div class='portal-model-area wp63 floatLeft h250'>1列</div><div class='portal-model-area wp30 floatLeft h250'>2列</div>",
				"tarhtml":"<div class='portal-target wp67 floatLeft '></div><div class='portal-target wp33 floatLeft'></div>"},
			"co2_rightbig":{"name":"2列布局,右侧列宽","html":"<div class='portal-model-area wp30 floatLeft h250'>1列</div><div class='portal-model-area wp63 floatLeft h250'>2列</div>",
				"tarhtml":"<div class='portal-target wp33 floatLeft '></div><div class='portal-target wp67 floatLeft'></div>"},
			"co3_center2":{"name":"3列布局,中间2行","html":"<div class='portal-model-area wp30 floatLeft h250'>1列</div>"+
				"<table class='portal-model-area wp30 floatLeft h250' style='background:none;'>"+
				"<tr><td colspan='2' class='portal-model-area wp100 h120' style='margin-top:0px;'>1行</td></tr>"+
				"<tr><td class='portal-model-area floatLeft wp44 h120'>1列</td>"+
				"<td class='portal-model-area floatLeft wp44 h120'>2列</td></tr></table>"+
				"<div class='portal-model-area wp30 floatLeft h250'>3列</div>",
				"tarhtml":"<div style='min-height:550px;' class='portal-target wp33 floatLeft'></div>"+
				"<table id='center_table' style='min-height:200px;outline:1px #d8e1e5 dashed;' class='wp33 floatLeft'>"+
				"<tr><td class='portal-target wp100 floatLeft' colspan='2'></td></tr>"+
				"<tr><td class='portal-target wp44 floatLeft'></td>"+
				"<td class='portal-target wp44 floatRight'></td></tr>"+
				"</table>"+
				"<div style='min-height:550px;' class='portal-target wp33 floatLeft'></div>"},
			"line1_leftbig_line2_ave3":{"name":"一行左宽，二行平均，三行左宽","html":"<div class='portal-model-area wp63 floatLeft h120'>1列</div><div class='portal-model-area wp30 floatLeft h120'>2列</div>" + 
				"<div class='portal-model-area wp30 floatLeft h120'>1列</div><div class='portal-model-area wp30 floatLeft h120'>2列</div><div class='portal-model-area wp30 floatLeft h120'>3列</div>",
				"tarhtml":"<div class='portal-target wp67 floatLeft '></div><div class='portal-target wp33 floatLeft'></div>" + 
			 	"<div class='portal-target wp33 floatLeft '></div><div class='portal-target wp34 floatLeft'></div><div class='portal-target wp33 floatLeft'></div>"
				},
			"line1_leftbig_line2_ave3_line3_leftbig":{"name":"一行左宽，二行平均，三行左宽","html":"<div class='portal-model-area wp63 floatLeft h80'>1列</div><div class='portal-model-area wp30 floatLeft h80'>2列</div>" + 
				"<div class='portal-model-area wp30 floatLeft h80'>1列</div><div class='portal-model-area wp30 floatLeft h80'>2列</div><div class='portal-model-area wp30 floatLeft h80'>3列</div>" +
				"<div class='portal-model-area wp63 floatLeft h80'>1列</div><div class='portal-model-area wp30 floatLeft h80'>2列</div>",
				"tarhtml":"<div class='portal-target wp67 floatLeft '></div><div class='portal-target wp33 floatLeft'></div>" + 
			 	"<div class='portal-target wp33 floatLeft '></div><div class='portal-target wp34 floatLeft'></div><div class='portal-target wp33 floatLeft'></div>" + 
			 	"<div class='portal-target wp67 floatLeft '></div><div class='portal-target wp33 floatLeft'></div>"
			 	},
			"line1_ave3_line2_leftbig_line3_ave3":{"name":"一行平均，二行左宽，三行平均","html":"<div class='portal-model-area wp30 floatLeft h80'>1列</div><div class='portal-model-area wp30 floatLeft h80'>2列</div><div class='portal-model-area wp30 floatLeft h80'>3列</div>" + 
				"<div class='portal-model-area wp62 floatLeft h80'>1列</div><div class='portal-model-area wp30 floatLeft h80'>2列</div>" +
				"<div class='portal-model-area wp30 floatLeft h80'>1列</div><div class='portal-model-area wp30 floatLeft h80'>2列</div><div class='portal-model-area wp30 floatLeft h80'>3列</div>",
				"tarhtml":"<div class='portal-target wp33 floatLeft '></div><div class='portal-target wp34 floatLeft'></div><div class='portal-target wp33 floatLeft'></div>" + 
			 	"<div class='portal-target wp67 floatLeft '></div><div class='portal-target wp33 floatLeft'></div>" + 
			 	"<div class='portal-target wp33 floatLeft '></div><div class='portal-target wp34 floatLeft'></div><div class='portal-target wp33 floatLeft'></div>"
			 	},
			"top1_co2":{"name":"头部导航,2列布局,左侧列宽","html":"<div class='portal-model-area wp95 floatLeft h80'>头部列</div><div class='portal-model-area wp63 floatLeft h160'>1列</div><div class='portal-model-area wp30 floatLeft h160'>2列</div>",
				"tarhtml":"<div class='portal-target wp100 floatLeft'></div><div class='portal-target wp67 floatLeft '></div><div class='portal-target wp33 floatLeft'></div>"
			    },
			"top1_co2_bottom1":{"name":"头部导航,2列布局,左侧列宽,底部导航","html":"<div class='portal-model-area wp95 floatLeft h80'>头部列</div><div class='portal-model-area wp63 floatLeft h80'>1列</div><div class='portal-model-area wp30 floatLeft h80'>2列</div>" + 
				"<div class='portal-model-area wp95 floatLeft h80'>底部列</div>",
				"tarhtml":"<div class='portal-target wp100 floatLeft'></div><div class='portal-target wp67 floatLeft '></div><div class='portal-target wp33 floatLeft'></div><div class='portal-target wp100 floatLeft'></div>"
			    },
			"top1_co3":{"name":"头部导航,3列布局","html":"<div class='portal-model-area wp95 floatLeft h80'>头部列</div><div class='portal-model-area wp30 floatLeft h160'>1列</div><div class='portal-model-area wp30 floatLeft h160'>2列</div><div class='portal-model-area wp30 floatLeft h160'>3列</div>",
				"tarhtml":"<div class='portal-target wp100 floatLeft'></div><div class='portal-target wp33 floatLeft'></div><div class='portal-target wp34 floatLeft'></div><div class='portal-target wp33 floatLeft'></div>"
			    },
			"top1_co3_bottom1":{"name":"头部导航,3列布局,底部导航","html":"<div class='portal-model-area wp95 floatLeft h80'>头部列</div><div class='portal-model-area wp30 floatLeft h80'>1列</div><div class='portal-model-area wp30 floatLeft h80'>2列</div><div class='portal-model-area wp30 floatLeft h80'>3列</div>" + 
				"<div class='portal-model-area wp95 floatLeft h80'>底部列</div>",
				"tarhtml":"<div class='portal-target wp100 floatLeft'></div><div class='portal-target wp33 floatLeft'></div><div class='portal-target wp34 floatLeft'></div><div class='portal-target wp33 floatLeft'></div><div class='portal-target wp100 floatLeft'></div>"
			    }
	};
	jQuery("<a id='top_href' href='#3' style='margin-left:-1000px;'>&nbsp</a>").appendTo(this.winDialogModel);
	var modelContainer = jQuery("<div></div>").addClass("portal-selectModel-container");
	var i = 0;
	var data = _self.models;
	var len = data.length;
	jQuery.each(data,function(i,n) {//构造选择组件页面的每一个组件
		var comData = n;
		var com = jQuery("<div></div>").addClass("portal-selectModel");
		var comView = jQuery("<div></div>").addClass("portal-selectModel-view").appendTo(com);
		var view = jQuery(comData.html).appendTo(comView);
		var comTip = jQuery("<div></div>").addClass("portal-selectModel-tip").appendTo(com);
		//var name = jQuery("<div>名称：" + comData.PC_NAME + "</div>");
		var tip = jQuery("<div>&nbsp;&nbsp;说明：" + comData.name + "</div>");
		comTip.append(tip);
		//增加到模版按钮
		var addToBtn = jQuery("<div><div style='float:left'>&nbsp;&nbsp;操作：</div>" 
				+ "<a class='rh-icon rhGrid-btnBar-a select'><span class='rh-icon-inner'>选择该模版</span><span class='rh-icon-img btn-ok'></span></a>"
				+ "<a class='rh-icon rhGrid-btnBar-a html'><span class='rh-icon-inner'>进入html编辑</span><span class='rh-icon-img btn-edit'></span></a></div>");

		addToBtn.find(".select").bind("click",function(event) {
			var res = confirm("是否确认应用该模版？");
			if (res === true) {
				_self.sourceCode.val(comData.tarhtml);
				_self._useSource();
				_self.winDialogModel.empty();
				_self.winDialogModel.remove();
				_self._comSelectTip();
			}
		});
		addToBtn.find(".html").bind("click",function(event) {//展示到显示页面
			_self.sourceCode.val(comData.tarhtml);
			jQuery(".portal-selectModel-container").parent().scrollTop(1600);
		});
		comTip.append(addToBtn)
		com.appendTo(modelContainer);
	});
	modelContainer.appendTo(this.winDialogModel);
	jQuery("<HR style='border:1 dashed #987cb9;margin-top:10px;' width='99%' SIZE=1>").appendTo(this.winDialogModel);
	//源码修改区域
	this.sourceCode = jQuery("<textarea></textarea>").addClass("portal-selectModel-source");
	
	var okSource = jQuery("<div style='line-height:26px;margin-bottom:20px;' ><a class='rh-icon rhGrid-btnBar-a'><span class='rh-icon-inner'>应用代码</span><span class='rh-icon-img btn-save'></span></a><span>（模版将应用文本框内的代码实现）</span></div>");
	okSource.bind("click", function() {
		_self._useSource();
	});
	this.sourceCode.appendTo(this.winDialogModel);
	okSource.appendTo(this.winDialogModel);
};
/*
 * 打开组件设置页面
 */
rh.vi.portalView.prototype._openComsView = function(pcType) {
	var _self = this;
	this._id = "rh_portal_coms_dialog";
	//1.构造dialog
	this.winDialog = jQuery("<div style='overflow:hidden;'></div>").addClass("rh-searchDialog").attr("id",this._id).attr("title","全部");
	this.comIframe = jQuery("<iframe src='' width='99%' height='100%'></iframe>").appendTo(this.winDialog);
	this.winDialog.appendTo(jQuery("body").first());
	//@TODO:显示位置处理
	var hei = 400;
	var wid = jQuery("body").width()-200;
	var posArray = [];
	posArray[0] = "";
	posArray[1] = 20;
	
	jQuery("#" + this._id).dialog({
		autoOpen: false,
		height: hei,
		width: wid,
		modal: true,
		resizable:false,
		draggable:false,
		position:posArray,
		close: function() {
			_self.winDialog.empty();
			_self.winDialog.remove();
		}
	});
	
	var dialogObj = jQuery("#" + this._id);
	dialogObj.dialog("open");
//	if (this._type.length > 0) {
//		_self._bldComsContent();
//	} else {
		//构造标题分类
		var titBar = dialogObj.parent().find(".ui-dialog-titlebar");
		//构造查询框
		var searchDiv = jQuery("<div style='float:left;margin:6px 0px 0px 12px;'></div>");
		var sel = jQuery("<select id='RH_PORTAL_COMS_SEL' style='border:1px gray solid;height:24px;'><option value='PC_ID'>组件编号</option><option value='PC_NAME'>组件名称</option></select>").appendTo(searchDiv);
		var inp = jQuery("<input id='RH_PORTAL_COMS_INP' type='text' width='80px' />").appendTo(searchDiv);
		inp.keypress(function(event) {//暂不起作用
	        if (event.keyCode == '13') {
	        	_self._searchIcon.click();
	            return false;
	        }
	    });
		this._searchIcon = jQuery("<img src='" + FireFly.getContextPath() + "/sy/comm/page/img/bannericon.png' title='点击查询' width='18px' height='18px' style='cursor:pointer;margin-bottom:-5px;'/>").appendTo(searchDiv);
		this._searchIcon.bind("click", function(event) {
			_self._bldComsClick();
		});
		searchDiv.prependTo(titBar);
		//全部
		titBar.find(".ui-dialog-title").addClass("portal-com-dialog-titleActive cp").bind("click", function() {
			jQuery(".portal-com-dialog-titleActive").removeClass("portal-com-dialog-titleActive");
			jQuery(this).addClass("portal-com-dialog-titleActive");
			_self._bldComsClick();
		});
		//组件分类
		var tempData = FireFly.getDict("SY_COMM_TEMPL_COMTYPE");//设置树的初始化数据
		var data = tempData[0].CHILD;
		jQuery.each(data, function(i,n) {
			var item = jQuery("<span ptype='" + n.ID + "'class='ui-dialog-title cp'>" + n.NAME + "</span>").appendTo(titBar);
			item.bind("click", function (event) {
				jQuery(".portal-com-dialog-titleActive").removeClass("portal-com-dialog-titleActive");
				jQuery(this).addClass("portal-com-dialog-titleActive");
				_self._bldComsClick();
			});
		});
		_self._bldComsContent();		
//	}
	
	dialogObj.parent().addClass("rh-bottom-right-radius portal-selectComs-dialog");
	jQuery(".ui-dialog-titlebar").last().css("display","block");//设置标题显示
};
rh.vi.portalView.prototype._bldComsClick = function() {
	var sValue = jQuery("#RH_PORTAL_COMS_SEL").val() + "," + jQuery("#RH_PORTAL_COMS_INP").val();
	var id = jQuery(".portal-com-dialog-titleActive").attr("ptype");
	this._bldComsContent(id,null,sValue);//类别，可应用范围，查询值
};
rh.vi.portalView.prototype._bldComsContent = function(pcType,areaType,searchValue) {
	var _self = this;
	parent.Tip.showLoad("加载中");
	var pcTypeParam = pcType || "";
	var areaTypeParam = areaType || "";
	var searchValue = searchValue || "";
	var extUrl = "&userCode=" + System.getVar("@USER_CODE@")+"&deptCode=" + System.getVar("@DEPT_CODE@") +"&roleCodes=" + System.getVar("@ROLE_CODES@");
	this.comIframe.attr("src",FireFly.getContextPath() + "/sy/comm/home/portalAllComs.jsp?pcType=" + pcTypeParam 
			+ "&areaType=" + areaTypeParam + "&searchValue=" + searchValue + extUrl);
};
/*
 * 打开参数设置页面
 */
rh.vi.portalView.prototype._openParamView = function(data,event) {
	var _self = this;
	this._id = "rh_portal_param_dialog";
	//1.构造dialog
	this.winParamDialog = jQuery("<div></div>").addClass("rh-searchDialog").attr("id",this._id).attr("title","设置参数");
	this.winParamDialog.appendTo(jQuery("body").first());
	//@TODO:显示位置处理
	var hei = 290;
	var wid = 450;
	var posArray = [];
	posArray[0] = event.clientX-400;
	posArray[1] = event.clientY-10;
	
	jQuery("#" + this._id).dialog({
		autoOpen: false,
		height: hei,
		width: wid,
		modal: true,
		resizable:false,
		draggable:true,
		position:posArray,
		close: function() {
			_self.winParamDialog.empty();
			_self.winParamDialog.remove();
		}
	});
	_self._bldParamContent(data);
	var dialogObj = jQuery("#" + this._id);
	dialogObj.dialog("open");
	dialogObj.parent().addClass("rh-bottom-right-radius portal-param-dialog");
	jQuery(".ui-dialog-titlebar").last().css("display","block");//设置标题显示
};
/*
 * 构造参数设置页面
 */
rh.vi.portalView.prototype._bldParamContent = function(paramObj) {
	var _self = this;
	var pcId = paramObj.PC_ID;
	//获取组件对象
	var comObj = FireFly.byId("SY_COMM_TEMPL_COMS",pcId);
	var pcFtl = comObj.PC_CON;//对应ftl文件
	var pcType = comObj.PC_TYPE;//组件类型
	var pcParam = comObj.PC_PARAM || "";//组件的系统参数定义
	var pcSelfParam = eval(comObj.PC_SELF_PARAM) || [];//组件的个性化参数定义
	var pcSelfJS = comObj.PC_SELF_PARAM_JS;//组件的个性参数js
	var pcParamArray = pcParam.split(",");
	var netParam = {"21":"CM_NEWS","22":"SY_COMM_WENKU","23":"CM_BBS"};
	//1.================系统参数：获取组件参数定义数据====================
	var dictData = FireFly.getCache("SY_COMM_TEMPL_COMPARAM",FireFly.dictData);
	data = dictData[0].CHILD;
	//var comsContainer = jQuery("<div></div>").addClass("portal-param-container");
	jQuery("<div style='color:red;font-size:12px;line-height:25px;'>&nbsp;&nbsp;(注：输入项为空则使用默认值,设定完成后点击顶部保存按钮生效！)</div>").appendTo(this.winParamDialog);
	var comsContainer = jQuery("<table ></table>").addClass("portal-param-container");
	var i = 0;
	var len = data.length;
    var paramObj = this._getSlimParam(pcId);
    jQuery.each(data,function(i,n) {//构造选择组件页面的每一个组件
        var id = n.ID;
        var name = n.NAME;
    	if (jQuery.inArray(id, pcParamArray) == -1) {
    		return;
    	}
        //var div = jQuery("<div></div>");
        var divTr = jQuery("<tr></tr>");
        var tdLabel = jQuery("<td></td>").appendTo(divTr);
        var tdInp = jQuery("<td></td>").appendTo(divTr);
        jQuery("<label></label>").addClass("portal-param-edit-label").text(name).appendTo(tdLabel);
        var input = jQuery(); 
        if ((id == "data")) {//设置数据对象
        	if (pcType < 20) {
        		return;
        	}
        	input = jQuery("<textarea id='" + id + "' rows=3 cols=30></textarea>").addClass("portal-param-edit-input").appendTo(tdInp);
        	var addBtn = jQuery("<span class='cp ul' style='color:blue;' title='栏目选择'>选择栏目</span>").appendTo(tdInp);
        	addBtn.bind("click", function() {
        		if (pcFtl == "SY_COM_BANNER.ftl") {//新闻banner型
            		//1.构造树形选择参数
            		var configStr = "CM_CMS_CHNL_MANAGE,{\"TYPE\":\"multi\"}";
            		var extendTreeSetting = "{'cascadecheck':false,'checkParent':false,'childOnly':true}";
            		var options = {
            			"config" :configStr,
            			"extendDicSetting":StrToJson(extendTreeSetting),
            			"replaceCallBack":function(idArray,nameArray) {
            				//构造选择栏目的数据对象字符串
            				var dataurl = "CM_CMS_CHNL.query.do?data={\"_extWhere\":\" and CHNL_ID in ('" + idArray.join("','") + "')\"}";
            				input.val(dataurl);
            			}
            		};
        		} else {
            		//1.构造树形选择参数
            		var configStr = "CM_CMS_CHNL_MANAGE,{\"TYPE\":\"multi\",\"EXTWHERE\":\" and SERV_ID='" + netParam[pcType] + "'\"}";
            		var extendTreeSetting = "{'cascadecheck':false,'checkParent':false,'childOnly':true}";
            		var options = {
            			"config" :configStr,
            			"extendDicSetting":StrToJson(extendTreeSetting),
            			"replaceCallBack":function(idArray,nameArray) {
            				//构造选择栏目的数据对象字符串
            				var dataurl = "CM_NEWS.query.do?data={\"_extWhere\":\" and CHNL_ID in ('" + idArray.join("','") + "') and NEWS_TYPE='1'\"}";
            				input.val(dataurl);
            			}
            		};
        		}
        		//2.显示树形
        		var dictView = new rh.vi.rhDictTreeView(options);
        		dictView.show(event);	
        	});
        	if (paramObj.data) {//数据对象
        		input.val(paramObj.data);
        	}
        } else if (id == "boxTheme") {//样式
        	input = jQuery("<select id='" + id + "' class='portal-param-edit-select'><option value='portal-null'>无</option><option value=''>标题条式</option><option value='portal-box-border'>边框式</option></select>").appendTo(tdInp);
            input.addClass("portal-param-edit-input");
        } else if (id == "titleBar") {//标题条
        	input = jQuery("<select id='" + id + "' class='portal-param-edit-select'><option value='portal-null'>无</option><option value=''>显示</option><option value='portal-title-none'>不显示</option></select>").appendTo(tdInp);
            input.addClass("portal-param-edit-input");
        } else {
        	input = jQuery("<input id='" + id + "'></input>").addClass("portal-param-edit-input").appendTo(tdInp);
        }

        if (id === "height") {//高度
        	var addBtn = jQuery("<span class='portal-param-edit-add' title='增加高度'> + </span>").appendTo(tdInp);
        	addBtn.bind("click", function() {
        		var inputVal = input.val();
        		if (inputVal == "") {
        			inputVal = conObj.height()
        		}
        		var va = parseInt(inputVal) + 10;
        		input.val(va);
        		extendParam();
        	});
        	var deleteBtn = jQuery("<span class='portal-param-edit-add' title='减少高度'> — </span>").appendTo(tdInp);
        	deleteBtn.bind("click", function() {
        		var inputVal = input.val();
        		if (inputVal == "") {
        			inputVal = conObj.height()
        		}
        		var va = parseInt(inputVal) - 10;
        		input.val(va);
        		extendParam();
        	});
        	var conObj = jQuery(".portal-target").find(".portal-temp[comid='" + pcId + "']").find(".portal-box-con");
        	if (paramObj.height) {//取参数对象中个性定义的
        		input.val(paramObj.height);
        	} 
        } else if (id == "icon") {//小图标
        	var span = jQuery("<span class='cp ul' style='color:blue;'>选择图标</span>").appendTo(tdInp);
        	span.bind("click",function(event) {
        		if (jQuery(".portal-param-icons").length == 1) {
        			jQuery(".portal-param-icons").show();
        		} else {
        			var icons = jQuery("<div class='portal-param-icons'></div>").appendTo(tdInp);
        			var tit = jQuery("<div class='portal-param-icons-tit'></div>").appendTo(icons);
        			var close = jQuery("<div class='portal-param-icons-close btn-delete'></div>").appendTo(tit);
        			close.bind("click",function() {
        				jQuery(".portal-param-icons").hide();
        			});
        			var tempData = FireFly.getDict("SY_PORTAL_ICONS");//设置树的初始化数据
        			var data = tempData[0].CHILD;
        			jQuery.each(data, function(i,n) {
        				var con = jQuery(".portal-param-icons");
        				var span = jQuery("<span class='portal-prams-icons-span'></span>").attr("title",n.NAME).attr("iconid",n.ID).addClass(n.ID).appendTo(con);
        				span.bind("click",function() {
        					input.val(jQuery(this).attr("iconid"));
        					jQuery(".portal-param-icons").hide();
        				});
        			});
        		}
        	});
        	if (paramObj.icon) {
        		input.val(paramObj.icon);
        	}
        } else {//其它
        	if (paramObj[id]) {
        		input.val(paramObj[id]);
        	}	
        }
        input.keypress(function(event) {
    		if (event.keyCode == '13') {
    			extendParam();
    		}
    	});
    	var clearBtn = jQuery("<span class='cp ul portal-param-edit-clear' title='清空'>清空</span>").appendTo(tdInp);
    	clearBtn.bind("click", function() {
    		input.val("");
    	});
    	divTr.appendTo(comsContainer);
	});
	//2.=========系统参数：获取组件参数定义数据==============
    //jQuery("<hr/>").appendTo(comsContainer);
    jQuery.each(pcSelfParam, function(i,n) {
    	var id = n.id;
    	var name = n.name || '';
    	var type = n.type;
    	if (type && type == 1) {//如果是默认值类型，直接返回
    		return;
    	}
       // var div = jQuery("<div></div>");
        var tr = jQuery("<tr></tr>");
        var tdLabel = jQuery("<td></td>").appendTo(tr);
        var tdInp = jQuery("<td></td>").appendTo(tr);
        if (name.length > 10) {
        	name = name.substring(0,6) + "..";
        }
        jQuery("<label></label>").attr("title",n.name).addClass("portal-param-edit-label").text(name).appendTo(tdLabel);
    	if (type && type == 2) {//组件参数设定需要显示并后台需要替换的
    		input = jQuery("<input id=''></input>").attr("repId",id).addClass("portal-param-edit-input").appendTo(tdInp);	
    	} else {
        	input = jQuery("<input></input>").attr("id",id).addClass("portal-param-edit-input").appendTo(tdInp);	
    	}
    	if (paramObj[id]) {
    		input.val(paramObj[id]);
    	}	
    	tr.appendTo(comsContainer);
    });
	//取当前的高度值，赋值到其高度
	comsContainer.appendTo(this.winParamDialog);
	var div = jQuery("<div style='margin-top:20px;font-size:12px;'></div>");
	var okParam = jQuery("<a class='rh-icon rhGrid-btnBar-a portal-param-edit-ok' style='margin-left:36%'><span class='rh-icon-inner' style='font-size:12px;'>确定</span><span class='rh-icon-img btn-ok'></span></a>").appendTo(div);
	okParam.bind("click", function(event) {
		extendParam();
		_self.winParamDialog.empty();
		_self.winParamDialog.remove();
        
	});
	var closeParam = jQuery("<a class='rh-icon rhGrid-btnBar-a portal-param-edit-ok' style='display:block-inline;'><span class='rh-icon-inner' style='font-size:12px;'>取消</span><span class='rh-icon-img btn-delete'></span></a>").appendTo(div);
	closeParam.bind("click", function(event) {
		_self.winParamDialog.empty();
		_self.winParamDialog.remove();
        
	});
	div.appendTo(this.winParamDialog);
	//3.=========执行个性化参数的js==============
    if (pcSelfJS && pcSelfJS.length > 0) {
        var servExt = new Function(pcSelfJS);
        servExt.apply(_self);
    }
    //打开参数设置时，预存储旧参数对象，用于确定时候判断是否已经有了参数修改
    var oldParamData = {};
	jQuery.each(jQuery(".portal-param-edit-input"),function(i,n) {
		var attr = jQuery(n).attr("id");
		if (attr == "") {//被替换的id值
			attr = jQuery(n).attr("repId");
		}
		if (jQuery(n).val().length > 0) {
			if(attr == "json"){
				oldParamData[attr] = jQuery.parseJSON(jQuery(n).val());
			} else {
				oldParamData[attr] = jQuery(n).val();
			}
		}
	});
    //参数修改后的合并系统参数
	function extendParam() {
		var all = {};
		var valData = {};
		jQuery.each(jQuery(".portal-param-edit-input"),function(i,n) {
			var attr = jQuery(n).attr("id");
			if (attr == "") {//被替换的id值
				attr = jQuery(n).attr("repId");
			}
			if (jQuery(n).val().length > 0) {
				//modify by wangchen
				if(attr == "json"){
					valData[attr] = jQuery.parseJSON(jQuery(n).val());
				} else {
					valData[attr] = jQuery(n).val();
				}
				//modify by wangchen
			}
		});
		all[pcId] = valData;
		_self._excuceBoxStyle(all);
		_self._ptParam = jQuery.extend(_self._ptParam,all);		
		//判断参数是否变化，如果变化则提示保存
		if (JsonToStr(oldParamData) != JsonToStr(valData)) {
			_self._comSaveTip();
		}
	};
};
/*
 * 获取比对的后的参数对象
 */
rh.vi.portalView.prototype._getSlimParam = function(comid) {
	var data = jQuery.extend(this._ptParam[comid] || {},this._templBeanParam[comid] || {});
	return data;
};

/*
 * 添加到模版
 */
rh.vi.portalView.prototype._addToModel = function(id) {
	var extendCon = jQuery("<div></div>").addClass("portal-temp").attr("comid",id);
	extendCon.append(this.coms[id]);
	//将组件摆放到目标区域
//	var indexTarget = 0;
//	var smallCountTemp = 0;
//	jQuery.each(jQuery(".portal-target"),function(i,n) {
//		var countTemp = jQuery(n).find(".portal-temp").length;
//		if (i === 0) {
//			smallCountTemp = countTemp;
//		}
//		if (smallCountTemp > countTemp) {
//			smallCountTemp = countTemp;
//			indexTarget = i;
//		}
//	});
	var targetIndex = this._targetIndex;
	if (targetIndex == jQuery(".portal-target").length) {
		targetIndex = 0;
		this._targetIndex = 0;
	}
	jQuery(".portal-target").eq(targetIndex).append(extendCon);
	this._targetIndex++;
	this._initPortalAreaMove();
	this._resetHeiWid();
	this._comSaveTip();
};
/*
 * 从模版中删除组件
 */
rh.vi.portalView.prototype._deleteCom = function(id) {
	jQuery(".portal-target").find(".portal-temp[comid='" + id + "']").empty().remove();
	delete this._templBeanParam[id];
	delete this._ptParam[id];
	this._resetHeiWid();
	this._comSaveTip();
};
/*
 *修改高度
 */
rh.vi.portalView.prototype._resetHeiWid = function() {
	this._setPortalHei();
};
/*
 * 对外提供方法，修改高度
 */
rh.vi.portalView.prototype.resetHeiWid = function() {
	this._setPortalHei();
};
/*
 *页面渲染后
 */
rh.vi.portalView.prototype._afterLoad = function() {
	var _self = this;
	//获取参数区块的参数设置，并应用其样式的参数
	this._excuceBoxStyle();
	//去掉portal-box-title的移动手势
    if (this._model == "view") {
    	jQuery(".portal-box-title").css({"cursor":"auto"});
    } else {
    	//this._resize();
    }
    //执行自刷新组件
    this._selfRefreshBlocks();
};
/*
 * 动态改变大小
 */
rh.vi.portalView.prototype._resize = function() {
	var _self = this;
    jQuery(".portal-temp").resizable({
       resize: function(event,ui) {
//    	   var orLeft = ui.originalPosition.left;
//    	   var orTop = ui.originalPosition.top;
//    	   var left = ui.position.left;
//    	   var top = ui.position.top;
//    	   var orWid = ui.originalSize.width;
//    	   var orHei = ui.originalSize.height;
//    	   var wid = ui.size.width;
    	   var hei = ui.size.height;
//    	   var exWid = left-orLeft;
//    	   var exHei = top-orTop;
           if (ui.element.parent().find(".portal-temp").length == 1) {
        	   var parHei = hei + 20;
        	   ui.element.parent().css("height",parHei);        	   
           }
    	   _self._resetHeiWid();
       },
       stop: function(event,ui) {

    	   var comid = ui.element.attr("comid");
    	   var hei = ui.size.height;
    	   var temp = {};
    	   temp[comid] = {"height":"" + hei};
    	  _self._ptParam = jQuery.extend(_self._ptParam,temp);
       },
       containment:"parent"
    });
};
/*
 * 执行区块的样式设定
 */
rh.vi.portalView.prototype._excuceBoxStyle = function(comParamJson) {
	var _self = this;
	//获取参数区块的参数设置，并应用其样式的参数
	var data = {};
	if (comParamJson) {
		data = comParamJson;
	} else {
		data = this._templBeanParam;
	}
//    jQuery.each(data,function(i,n) {
//    	jQuery.each(n,function(y,m) {
//    		if (y == "height") {
//    			jQuery(".portal-temp[comid=" + i + "]").find(".portal-box-con").css("height",m);
//    		} else if (y == "icon") {
//    			jQuery(".portal-temp[comid=" + i + "]").find(".portal-box-title-icon").attr("class","").addClass("portal-box-title-icon icon_portal_" + m);
//    		} else if (y == "name") {
//    			jQuery(".portal-temp[comid=" + i + "]").find(".portal-box-title-label").text(m);
//    		} else if (y == "href") {
//    			var label = jQuery(".portal-temp[comid=" + i + "]").find(".portal-box-title-label");
//    			var str = "<a href=\"" + m + "\">" +  label.text() + "</a>";
//    			label.html(str);
//    		} else if (y == "discript") {
//    			jQuery(".portal-temp[comid=" + i + "]").find(".portal-box-title-label").attr("title",m);
//    		}
//    	});
//    });
    if (comParamJson) {
    	 this._resetHeiWid();
    }
};
/*
 *页面渲染后
 */
rh.vi.portalView.prototype._saveTempl = function() {
	var _self = this;
    var hml = jQuery("body").clone();//原始代码
    hml.find(".portal-target").removeClass("ui-droppable ui-sortable");
    jQuery(".portal-btnBar",hml).remove();
    jQuery(".portal-temp",hml).each(function(i,n) {//替换组件
       var area = jQuery(n);
       var comid = area.attr("comid");
       area.replaceWith("[" + comid + "]");
    });
    var tableClass = {};
    var ptContent = jQuery("<div></div>");
    jQuery(".portal-target",hml).each(function(i,n) {//取body内的portal-target对象，过滤掉其它的杂项
    	if (jQuery(n).get(0).tagName == "TD") {
    		var table = jQuery(n).parent().parent().parent();
    		var id = table.attr("id");
    		if (table[id]) {
    			return;
    		} else {
    			table[id] = true;
    			table.appendTo(ptContent);
    		}
    	} else {
    		jQuery(n).appendTo(ptContent);
    	}
    });
    var data = {};
    data["PT_CONTENT"] = ptContent.html();
    if (this._action == "new") {//新建的模版
    	data["PT_TITLE"] = this._paramBean["PT_TITLE"] + "<系统生成" + System.getVar("@USER_CODE@") + ">";
    	data["PT_TYPE_ATTRIBUTE"] = this._type;
    	data["PT_TYPE"] = this._extendType;
    	data["S_PUBLIC"] = "2";
    }
    data["_PK_"] = this.templPKCode;//OA
    //构造参数设置和规则设置
    var ptParam = jQuery.extend(this._templBeanParam,this._ptParam);
    jQuery.each(ptParam, function(i, n) {//参数项为空的判断
    	if (jQuery.isEmptyObject(n)) {
    		delete ptParam[i];
    	}
    });
    if (jQuery.isEmptyObject(ptParam)) {//参数对象为空的判断
    	data["PT_PARAM"] = "";
    } else {
    	data["PT_PARAM"] = JSON.stringify(ptParam);
    }

    if ((this._action == "new") && (this._type.length > 0)) {//新建状态而且有类别
    	data["_TYPE"] = this._type;
    }
    var resultData = FireFly.doAct("SY_COMM_TEMPL","save",data,true);
    if (resultData[UIConst.RTN_MSG] && resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
    	jQuery(".portal__saveTip").hide();
    	parent.Tip.clear();
    	if (this._action == "new") {//个人新建状态
    		window.location.href = "SY_COMM_TEMPL.show.do?pkCode=" + resultData["_PK_"] + "&model=edit";
    	} else {
    		window.location.href = window.location.href;
    	}
	} 
};
/*
 * 应用源码
 */
rh.vi.portalView.prototype._useSource = function() {
	var _self = this;
    var source = jQuery(".portal-selectModel-source").val(); 
    jQuery(".portal-target").empty().remove();
    jQuery(source).insertAfter(jQuery(".portal-btnBar"));
    this._clearParams();
    this._resetHeiWid();
};
/*
 * 清空参数设置
 */
rh.vi.portalView.prototype._clearParams = function() {
	var _self = this;
	this._templBeanParam = {};
	this._ptParam = {};
};
/*
 *页面渲染后
 */
rh.vi.portalView.prototype._initPortalAreaMove = function() {
	var _self = this;
	var flag = false;
	var emptyFlag = false;
	jQuery('.portal-temp').bind("mouseover",function(event) {
		 if (jQuery(".portal-box-edit").length == 0) {
			 var pcId = jQuery(this).attr("comid");
			 var edit = jQuery("<div></div>").addClass("portal-box-edit");
			 var param = jQuery("<div title='参数设置'></div>").addClass("portal-box-edit-param btn-option").appendTo(edit);
			 param.bind("click", function(event) {
				 var data = {};
				 data["PC_ID"] = pcId;
				 _self._openParamView(data,event);
			 });
			 var del = jQuery("<div title='删除当前组件'></div>").addClass("portal-box-edit-param btn-delete ").appendTo(edit);
			 del.bind("click", function(event) {
				 var res = confirm("将该组件和此组件的相关设置从模版中移除？");
				 if (res === true) {
					 _self._deleteCom(pcId);
				 }
			 });
			 edit.appendTo(jQuery(this));
		 }
	}).bind("mouseleave",function(event) {
      	 jQuery(".portal-box-edit").remove();
	});
		 
	 
	jQuery('.portal-temp').draggable({
	    cursor: "auto",
	    revert:true,
	    zIndex: 700,
		create:function(event, ui) {
			    	
		},
	    start:function(event, ui){
	    	if (flag == false) {
	    		return false;
	    	}
	    },
	    drag: function( event, ui ) {
	    	_self._setComsScope(ui);
	    },
	    stop:function(event, ui){
	    }
	});
	jQuery(".portal-target").droppable({
	   accept: '.portal-temp',
       over: function(event, ui) {
           //if (jQuery(this).html() == "") {
		      var wid = jQuery(this).width()-30;
		      var tem = jQuery("<div id='lineFlag' class='lineFlag'></div>").width(wid);
		      tem.appendTo(jQuery(this));   
		      emptyFlag = true;           	
           //}
       },
	   out: function(event, ui) {
	   	   if (emptyFlag) {
		      jQuery("#lineFlag").remove();  	
	       } 
	   },
	   drop: function(event, ui) {
	       if (emptyFlag) {
		      jQuery("#lineFlag").remove();
		   	  ui.draggable.appendTo(jQuery(this));	     
		   	  _self._setPortalHei(); 	
	       } else {
	       	  emptyFlag = false;      
	       }
	   }
	}).sortable({
		items: ".portal-temp",
		revert: true,
		sort: function() {
		}
	});
    jQuery('.portal-temp').droppable({
       accept: '.portal-temp',
	   over: function(event, ui) {
		  jQuery(this).parent().addClass("portal-target--active");
		  jQuery(".lineFlag").remove();
		  var wid = jQuery(this).parent().width()-30;
		  var tem = jQuery("<div id='lineFlag' class='lineFlag'></div>").width(wid);
		  var uiTopLen = jQuery(this).prev().length;//判断当前组件是否是最上面
		  if (uiTopLen == 0) {
			  tem.insertBefore(jQuery(this));    
		  } else {
			  tem.insertAfter(jQuery(this));    
		  }
	   },
	   out: function(event, ui) {
	      jQuery(".lineFlag").remove();
	      jQuery(this).parent().removeClass("portal-target--active");
	   },
	   drop: function(event, ui) {
	   	  jQuery(".lineFlag").remove();
	   	  jQuery(this).parent().removeClass("portal-target--active");
		  var uiTopLen = jQuery(this).prev().length;//判断当前组件是否是最上面
		  if (uiTopLen == 0) {
			  ui.draggable.insertBefore(jQuery(this));    
		  } else {
			  ui.draggable.insertAfter(jQuery(this));    
		  }
		  _self._setPortalHei();
		  //提示保存
		  _self._comSaveTip();
		  //saveTempl();
	   }
	});
	jQuery('.portal-temp').bind("mousedown",function(event) {
	 	if (jQuery(event.target).hasClass("portal-box-title")) {
	 		flag = true;
	 	} else {
	 		flag = false;
	 	}
	});	
};
/*
 * 设置组件滚动
 */
rh.vi.portalView.prototype._setComsScope = function(ui){
	var top = ui.offset.top;
	var pframe = jQuery(window.parent);
	var scope = top - pframe.scrollTop();//滚动条不滚动的拖放范围
	var clientHeight = pframe.height()-150;//父窗口高度-150
	var scroll = pframe.scrollTop();//父窗口的滚动条高度
	var dh = jQuery(document).height();//当前文档的高度
	if(scope > clientHeight && top < dh){
		pframe.scrollTop(scroll+10);
	}else if(scope < 20){
		pframe.scrollTop(scroll-10);
	}
}
/*
 * 设置页面高度
 */
rh.vi.portalView.prototype._setPortalHei = function(conHei) {
	if(!conHei){
		var hei = GLOBAL.defaultFrameHei;
		var bodyHei = document.documentElement.scrollHeight;
		jQuery(".portal-target").each(function(i,n) {
			if (bodyHei > hei) {
				hei = bodyHei;
			}
		});
		// hei += jQuery(".portal-btnBar").height() + 10;
	}else{
		hei = conHei;
	}	
	Tab.setFrameHei(hei);
};
/*
 * 区块的统一处理
 */
rh.vi.portalView.prototype._initArea = function() {
//	  if (parent.GLOBAL.style.SS_STYLE_BLOCK) {//区块头
//			jQuery(".portal-box .portal-box-title").each(function(i,n) {
//				jQuery(n).addClass(parent.GLOBAL.style.SS_STYLE_BLOCK);
//			});
//	  }
	  jQuery(".portal-box-hideBtn").bind("click",function() {
	  	if (jQuery(this).hasClass("hideFlag")) {
	 	  	var box = jQuery(this).parent().parent();
		  	box.css("min-height",box.data("min-hei"));
		  	box.find(".portal-box-con").show(); 	
		  	jQuery(this).removeClass("hideFlag");
		  	jQuery(this).removeClass("conHeanderTitle-close");
	  	} else {
		  	var box = jQuery(this).parent().parent();
		  	box.data("min-hei",box.css("min-height"));
		  	box.css("min-height",20);

		  	box.find(".portal-box-con").hide();
	  		jQuery(this).addClass("hideFlag");
	  		jQuery(this).addClass("conHeanderTitle-close");
	  	}
	  });
};
/*
 * 根据组件id刷新某一特定区块内容
 */
rh.vi.portalView.prototype.refreshBlock = function(comid) {
	if (jQuery(".portal-temp[comid=" + comid + "]").length == 0) {
		return false;
	}
	var data = {};
	data["PC_ID"] = comid; //对应ID
	if (this._paramBean.PT_PARAM) {
		var param = StrToJson(this._paramBean.PT_PARAM)[comid];
		data["PT_PARAM"] = JsonToStr(param); //模版级参数
	}
	var res = FireFly.doAct("SY_COMM_TEMPL","getPortalArea",data,false);
	if ((res.AREA != null) && (res.AREA != "")) {
		var comObj = jQuery(".portal-temp[comid=" + comid + "]");
		comObj.empty();
		comObj.html(res.AREA);
	}
};
/*
 * 刷新模版内自刷新组件
 */
rh.vi.portalView.prototype._selfRefreshBlocks = function() {
	var _self = this;
	var refreshs = jQuery(".portal-temp[comrefresh='true']");
	if (refreshs.length > 0) {
		jQuery.each(refreshs, function (i,n) {
			var comObj = jQuery(n);
			var comid = comObj.attr("comid");
			var data = {};
			data["PC_ID"] = comid; //对应ID
			if (_self._paramBean.PT_PARAM) {
				var param = StrToJson(_self._paramBean.PT_PARAM)[comid];
				data["PT_PARAM"] = JsonToStr(param); //模版级参数
			}
			var res = FireFly.doAct("SY_COMM_TEMPL","getPortalArea",data,false);
			if ((res.AREA != null) && (res.AREA != "")) {
				comObj.empty();
				comObj.html(res.AREA);
			}
		});
	}
};
/*
 * 模版操作的提示信息
 */
rh.vi.portalView.prototype._comSelectTip = function() {
	var _self = this;
	if (jQuery(".portal__tip").length == 0) {
		//选择提示
		var tipSave = jQuery("<div class='portal__tip'>模版已设置，点击【<a href=\"javascript:jQuery('#btnBar-a-coms').click();\" title='点击打开选择组件页面'>选择组件</a>】按钮进行组件的设置。<span class='portal__tip__close' title='清除提示'></span></div>")
		tipSave.appendTo(jQuery(".portal-btnBar"));
		jQuery(".portal__tip__close").bind("click",function() {
			jQuery(this).parent().hide("slow");
		});
	} else {
		jQuery(".portal__tip").show("slow");
	}
	setTimeout(function() {
		jQuery(".portal__tip").hide("slow");
	},8000);
};
/*
 * 模版操作的保存信息
 */
rh.vi.portalView.prototype._comSaveTip = function() {
	var _self = this;
	if (jQuery(".portal__saveTip").length == 0) {
		//保存提示
	    var tipSave = jQuery("<div class='portal__saveTip'>页面已更改，是否保存？      <a href=\"javascript:jQuery('#btnBar-a-save').click();\" title='保存当前页面设置'>确认保存</a><span class='portal__saveTip__close' title='清除提示'></span></div>")
	    tipSave.appendTo(jQuery(".portal-btnBar"));
		jQuery(".portal__saveTip__close").bind("click",function() {
			jQuery(this).parent().hide("slow");
		});
	} else {
		jQuery(".portal__saveTip").show("slow");
	}
	setTimeout(function() {
		jQuery(".portal__saveTip").hide("slow");
	},8000);
};
