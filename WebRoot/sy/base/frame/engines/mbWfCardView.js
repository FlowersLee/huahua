
GLOBAL.namespace("mb.vi");

mb.vi.wfCardView = function(options) {
    var defaults = {
		"id":options.sId + "-viWfCardView",
		"sId":"",//服务ID
		"pId":options.sId,
		"parHandler":null,//主卡片的句柄
		"pkCode":""
	};
	var _self = this;
	this.opts = jQuery.extend(defaults,options);
	this._parHandler = this.opts.parHandler;
	this._nextStepNodeCode = "";
	
	//从页面取流程实例的信息，因手机版的未绑定流程信息故，注释掉该代码
	this.procInstId = this._parHandler.itemValue("S_WF_INST");
	this.wfState = this._parHandler.itemValue("S_WF_STATE");	
	
    this.reqdata = {}
	this.reqdata["PI_ID"] = this.procInstId;	//流程实例ID
	this.reqdata["INST_IF_RUNNING"] = this.wfState;	   //流程是否在运行
	if (!(this.getNodeInstBean() == undefined)) {
		this.reqdata["NI_ID"] = this.getNodeInstBean().NI_ID;
	} 
	this.wfBtns = {};
	this.wfNextBtns = {};
	this.wfNextBtnNames = {};
	
    return this;	
};

mb.vi.wfCardView.prototype.render = function() {
	//先注释掉获取表单按钮的代码
	this._bldBtnBar();
	//获取工作的按钮
	this._bldNextBtnBar();
	//this._doFiledControl();
	//显示相关文件
	/*if (this.getAuthBean().isShowRelate == "true") { 
	    this._bldRelateList();
	}
	Load.scriptJS("/sy/base/frame/engines/rhRealteFiles.js");
	var opts = {};
	opts["wfHandler"] = this;
	this.wfRelate = new mb.vi.relateFiles(opts);	
	*/
	//显示分发列表
	/*if (this.getAuthBean().isShowFenfaList == "true") {
		this._bldSendList();
	}*/
	
	//判断是否锁定 1,锁定，2正常 ， 锁定的文件，全部只读
	/*if (this.getAuthBean().lockState == "1") {
		this._parHandler.form.disabledAll();
	}*/
	//初始化意见
	this.initMind();
};

/*
 * 意见Code Bean
 */
mb.vi.wfCardView.prototype.getMindCodeBean = function() {
    var _self = this;
	
	return _self._parHandler.byIdData.mindCodeBean;
};

/*
 * 节点实例bean
 */
mb.vi.wfCardView.prototype.getNodeInstBean = function() {
    var _self = this;
	
	return _self._parHandler.byIdData.nodeInstBean;
};

/*
 * 相关权限 比如能否手写意见， 当前人是否正在处理当前的流程
 */
mb.vi.wfCardView.prototype.getAuthBean = function() {
    var _self = this;
	return _self._parHandler.byIdData.authBean;
};

/*
 * 获取按钮
 */
mb.vi.wfCardView.prototype.getButtonBean = function() {
    var _self = this;
	return _self._parHandler.byIdData.buttonBean;
};


/*
 * 获取页面field控制的数据
 */
mb.vi.wfCardView.prototype.getFieldControlBean = function() {
    var _self = this;
	return _self._parHandler.byIdData.fieldControlBean;
};

/*
 * 获取页面field控制的数据
 */
mb.vi.wfCardView.prototype.getBindTitle = function() {
    var _self = this;
	return _self._parHandler.byIdData.bindTitle;
};
mb.vi.wfCardView.prototype.getNextStepBean = function() {
    var _self = this;
	if (_self._parHandler.byIdData.nextSteps == undefined || _self._parHandler.byIdData.nextSteps == "undefined") {
	    return "";
	}
	return _self._parHandler.byIdData.nextSteps;
};
/*
 * 获取下一步的节点列表数据
 */
mb.vi.wfCardView.prototype.getNextStepBean_sc = function() {
    var _self = this;
    var userCode =  _viewer.itemValue("USER_CODE");
    var actID =  _viewer.itemValue("WF_ACT_ID");
	
    var actParam= {'WF_ACT_ID':actID};
    var result = FireFly.doAct("TBL_WFE_ACTIVITY_INST","find",actParam,false);
    var wfActID = result._DATA_;
    
    var wfParam= {'userID':userCode,'wfActID':'151054'};
    result = FireFly.doAct("TBL_WFE_BUTTONS","find",wfParam,false);
    var wfButtons = result._DATA_;
    return buttons;
};



/*
 * 对页面字段进行控制 , 如隐藏， 必填等控制
 */
mb.vi.wfCardView.prototype._doFiledControl = function() {
    var _self = this;
    var _fileControlData = _self.getFieldControlBean();
	
	var entirelyControl = _fileControlData.FIELD_CONTROL;
	var exceptionFiledStr = _fileControlData.FIELD_EXCEPTION;
	var updateFiledStr = _fileControlData.FIELD_UPDATE;
	var hiddenFiledStr = _fileControlData.FIELD_HIDDEN;	
	var mustFiledStr = _fileControlData.FIELD_MUST;		
 
	var parServID = _self.opts.pId;
	//可编辑字段
	if(entirelyControl == "false") {
		_self._parHandler.form.disabledAll();
		if (exceptionFiledStr.length > 0) {
			jQuery.each(exceptionFiledStr.split(','),function(i,item) {
				if(_self._parHandler.getItem(item)) {
					_self._parHandler.getItem(item).enabled();
				}
			});	
		}
	}

	//隐藏字段
	if (hiddenFiledStr.length > 0) {
		jQuery.each(hiddenFiledStr.split(','),function(i,item) {
			_self._parHandler.getItem(item).hide();
		});
	}
	
	//必填字段
	if (mustFiledStr.length > 0) {
		jQuery.each(mustFiledStr.split(','),function(i,item) {
			_self._parHandler.form.setNotNull(item,true);
		});	
	}
};

/*
 * 构建下一步卡片按钮条
 */
mb.vi.wfCardView.prototype._bldNextBtnBar = function() {
    var _self = this;
    this._btnBar = this._parHandler.btnBar;
	var _nextData = _self.getNextStepBean();
	
	jQuery.each(_nextData,function(i,actItem) {
	    var nodeCon = jQuery("<div></div>").addClass("mbBotBar-con");
    	var node = jQuery("<div></div>").addClass("mbBotBar-node").appendTo(nodeCon);
    	node.attr("id",GLOBAL.getUnId(actItem.NODE_CODE,_self.opts.sId));
    	var iconCss = actItem.ACT_CSS;
    	if (iconCss.length == 0) {
    		iconCss = "default";
    	}
    	var iconStr = "mb-btn-" + iconCss;
    	if (!isNaN(iconCss)) {
    		iconStr += " mb-extend-next";
    	}
    	var icon = jQuery("<div></div>").addClass("mbBotBar-node-icon " + iconStr).appendTo(node);
    	var tex = jQuery("<div></div>").addClass("mbBotBar-node-text").appendTo(node);
    	var name = actItem.NODE_NAME;
    	//工作流按钮名称上输入有空格,则取空格后部分
		var nodeNameSplitArray = name.split(" ");
		if (nodeNameSplitArray.length > 1) {
			name = nodeNameSplitArray[1];
		}
    	if (name.length > 4) {
    		name = name.substring(0,4) + "..";
    	}
    	tex.text(name);
		_self._parHandler.addBtn(nodeCon);
		
		if(typeof(actItem.NODE_USER) != "undefined"){ // 如果是返回XX的按钮，取得返回人的CODE
			nodeCon.bind("click",function() {
				_self.reqdata["NODE_CODE"] = actItem.NODE_CODE;
				_self.reqdata["TO_USERS"] = actItem.NODE_USER;		
				_self.reqdata["TO_TYPE"] = "3";		
				//把流程信息送交给oa
				var newActInst = rh_processData("SY_WFE_PROC.toNext.do",_self.reqdata);
				//送交给oa得到oa返回的成功信息
				//Tip.show("送交成功",true);
				alert("已经成功 " + actItem.NODE_NAME);
				_self._parHandler.refresh();
		    });			
			
		} else {
			nodeCon.bind("click",function(event) {
				_self._openSelectOrg(actItem.NODE_CODE,nodeCon,event);
		    });
			
			var nextBtnObj = {};
			nextBtnObj.layoutObj = nodeCon;
			nextBtnObj.dataObj = actItem;
		    _self.wfNextBtns[actItem.NODE_CODE] = nextBtnObj;
			
			_self.wfNextBtnNames[actItem.NODE_NAME] = nextBtnObj;
		}
	});
	
};
	
/**
 * 模拟点击返回的按钮
 */ 
mb.vi.wfCardView.prototype._pretendClickBack = function() {
    var _self = this;    
    _self._refreshMainPage();
	
    var aBackElement = jQuery("#rhCard-back");
	if (aBackElement) {
	   jQuery("#rhCard-back").click();
	}
}

/**
 * 刷新首页待办
 */
mb.vi.wfCardView.prototype._refreshMainPage = function() {
	//刷新首页的待办，主办等区块
	if (parent.Portal.getBlock("SY_COMM_TODO")) {
		parent.Portal.getBlock("SY_COMM_TODO").refresh();	//刷新待办	
	}
	if (parent.Portal.getBlock("SY_COMM_ENTITY")) {
		parent.Portal.getBlock("SY_COMM_ENTITY").refresh();	//刷新主办	
	}
}


/*
 * 构建卡片按钮条, 表单按钮  节点定义转换之后的按钮
 */
mb.vi.wfCardView.prototype._bldBtnBar = function() {
    var _self = this;
    this._btnBar = this._parHandler.btnBar;
	
	_self._buttonData = _self.getButtonBean();
	
	var formSaveButtonFlag = false;
	jQuery.each(this._buttonData,function(i,actItem) {
		var buttonType = i;
		
		if (actItem.ACT_CODE == "save") { // 如果循环到了save
			formSaveButtonFlag = true;
			return;
		}
		if (actItem.ACT_CODE == "cmWfTrackFigure") {
			return;
		}
	    var nodeCon = jQuery("<div></div>").addClass("mbBotBar-con");
    	var node = jQuery("<div></div>").addClass("mbBotBar-node").appendTo(nodeCon);
    	node.attr("id",GLOBAL.getUnId(actItem.ACT_CODE,_self.opts.sId));
    	var iconCss = actItem.ACT_CSS;
    	if (iconCss.length == 0) {
    		iconCss = "default";
    	}
    	var iconStr = "mb-btn-" + iconCss;
    	var icon = jQuery("<div></div>").addClass("mbBotBar-node-icon " + iconStr).appendTo(node);
    	var tex = jQuery("<div></div>").addClass("mbBotBar-node-text").appendTo(node);
    	tex.text(actItem.ACT_NAME);
		_self._act(actItem.ACT_CODE,actItem.SERV_ID,nodeCon,actItem);
		_self._parHandler.addBtn(nodeCon);
	});
	
	if(!formSaveButtonFlag){ //没有save,隐藏表单的
	    jQuery("#" + GLOBAL.getUnId("save",this.opts.pId)).parent().hide();
	}
};

/**
 * 判断返回的组织资源树，是否只有一个人  //"NAME":.*?"usr".*?usr:.*?}    new RegExp("\"usr:.*?\"", "g");
 */
mb.vi.wfCardView.prototype.treeDataHaseOneMan = function (treeData) {
	if (treeData == "[]") {
	    return "multi";
	}

	var reg = new RegExp("\"NAME\":.*?\"usr\".*?usr:.*?\"", "g");  
	
	if (treeData.match(reg).length == 1) {
	    // 取到这个人，然后直接送这个人，  "usr:.*?"
		var userCode = treeData.match(reg);
		
		return userCode;
	}
	
	return "multi";
};


 /*
 * 根据 节点信息， 打开人员选择窗口 ，也就是送交人
 * @param aId 动作ID
 */
mb.vi.wfCardView.prototype._openSelectOrg = function(aId,aObj,event) {
	var _self = this;
	var taObj = aObj;
	var nodeCode = aId;
	_self._nextStepNodeCode = nodeCode;	
	var inputName = GLOBAL.getUnId("wfToUser",_self.opts.sId);
	
	_self.reqdata["NI_ID"] = _self.getNodeInstBean().NI_ID;
	_self.reqdata["NODE_CODE"] = nodeCode;
	
	var rtnTreeData = rh_processData("SY_WFE_PROC.getNextStepUsersForSelect.do",_self.reqdata);
	
	var treeData = rtnTreeData.treeData;
	
	if (treeData == "[]") {
	    alert("当前节点没有可供选择的人员，请检查工作流配置！");
		return false;
	}
	
	var sendDirectFlag = true;
	var oneUserCodes = "";
	
	var bindTreeTitle = "人员选择";
	this.binderType = rtnTreeData.binderType;  //送交类型  

	if (_self.binderType == "ROLE") {
	    //如果是角色，取到角色的CODE
		this._binderRoleCode = rtnTreeData.roleCode;
		bindTreeTitle = "部门选择";
		sendDirectFlag = false;
	} else { //送人
		var rtnOneValue = _self.treeDataHaseOneMan(treeData);
		
		if (rtnOneValue == "multi") {
		    sendDirectFlag = false;
		} else {
		    oneUserCodes = rtnOneValue;
		}
	}
	
	if (sendDirectFlag) { // 直接送人
	    var oneUserObj = StrToJson("{" + oneUserCodes + "}");
	
	    var userCodeArray = new Array();
		userCodeArray.push(oneUserObj.ID);
	    var userNameArray = new Array();
		userNameArray.push(oneUserObj.NAME);		
		
	    _self._confirmSend(userCodeArray, userNameArray);
	} else { //显示组织机构树
		treeData = eval("(" + treeData + ")");

		var multiSelect = rtnTreeData.multiSelect;  //是否能多选
		
		var extendTreeSetting = "{'rhexpand':false,'expandLevel':0,";
		
		var selectType = "single";
		if (multiSelect == "true") {
			selectType = "multi";
			extendTreeSetting += "'cascadecheck':true,'checkParent':false,'showcheck':true";
		} else {
			extendTreeSetting += "'cascadecheck':false,'checkParent':false,'showcheck':false";
		}
		
		extendTreeSetting += "}";
		extendTreeSetting = StrToJson(extendTreeSetting);
		
//		var configStr = "SY_ORG_USER" + ",{'TYPE':'"+selectType+"'}";  //multi , single
//		var options = {"itemCode":inputName,"config" : configStr,"hide":"explode","show":"blind","rebackCodes":inputName,"replaceData":treeData,
//		"replaceCallBack":_self._confirmSend,
//		"extendDicSetting":extendTreeSetting,
//		"dialogName":bindTreeTitle,
//		"parHandler":_self};
//		
//		var dictView = new mb.vi.rhDictTreeView(options);
//		dictView.show(event);	
		
		
	    var temp = {"replaceData":treeData,"replaceCallBack":_self._confirmSend,"parHandler":_self};
	    this.selectView = new mb.vi.selectList(temp);
	    this.selectView._bldWin(event);
	    this.selectView.show();
	    
	}
};

/**
 * 将流程送下个节点的人
 */
mb.vi.wfCardView.prototype._confirmSend = function(idArray,nameArray) {
	var _self = this;
	if(confirm("确认送交?")){
		this.selectView._close();
	} else {
		return false;
	}
	//送交的类型  1 送部门+角色 ， 3 送用户
	var toType = "3";
	
	if(_self.binderType == "ROLE"){
	    toType = "1";
		_self.reqdata["TO_DEPT"] = idArray[0].replace("dept:",""); //送交部门
		_self.reqdata["TO_ROLE"] = _self._binderRoleCode; //送交角色		
	} else {
		var userArray = new Array();
		jQuery(idArray).each(function(indextrty,intrty){
		   if (intrty.indexOf("usr:") ==0) {
			   userArray.push(intrty);
		   }
		});
		
		var userNameStr = userArray.toString().replace(new RegExp("usr:","gm"),"");
		
		if (userNameStr.length<=0) {
		    alert("没有选中人员，请重新选择送交人员");
			
			return false;
		} 
	    _self.reqdata["TO_USERS"] = userNameStr; //送交人 替换掉所有的usr:
	}
	
	_self.reqdata["TO_TYPE"] = toType;  //类别
	_self.reqdata["NI_ID"] = _self.getNodeInstBean().NI_ID;  //当前节点实例ID
	_self.reqdata["NODE_CODE"] = _self._nextStepNodeCode;  //下个节点CODE
	var result = rh_processData("SY_WFE_PROC.toNext.do",_self.reqdata);
	//alert(idArray.join(",") + nameArray.join(","));
	//刷新页面
	alert("已经成功送交给" + nameArray.join(","));
	_self._parHandler.refresh();
};


 /*
 * 根据动作绑定相应的方法
 * @param actId 动作ID
 * 
 */
mb.vi.wfCardView.prototype._act = function(actId,servId,aObj,actItem) {
	var _self = this;
	var taObj = aObj;
	
	if (actItem.ACT_CODE == "delete") {
	    actItem.ACT_CODE = "deleteDoc";
	}

	
	
	taObj.bind("click",function(event){
	    
		if(actItem.ACT_MEMO.length > 1 && actItem.ACT_MEMO != "null") {
		    eval(actItem.ACT_MEMO);
		} else {
			eval("_self." + actItem.ACT_CODE + "(event,actItem)");
		}
	});


	var wfBtnObj = {};
	wfBtnObj.layoutObj = taObj;
	wfBtnObj.dataObj = actItem;		
	
	_self.wfBtns[actItem.ACT_CODE] = wfBtnObj;	
};


/**
 * 获取按钮 
 */
mb.vi.wfCardView.prototype._getBtn = function(actCode) {
	return this.wfBtns[actCode];
};

/**
 * 获取按钮 根据CODE
 */
mb.vi.wfCardView.prototype._getWfNextBtn = function(actCode) {
	return this.wfNextBtns[actCode];
};


/**
 * 获取按钮 根据名称
 */
mb.vi.wfCardView.prototype._getNextBtnByName = function(actName) {
	return this.wfNextBtnNames[actName];
};


/**
 * 点击流程按钮  前执行 funName 函数
 */
mb.vi.wfCardView.prototype._doWfBtnBeforeClick = function(funName,btnObj) {
    var _self = this;
			
	var layoutObj = btnObj.layoutObj;
    var actItem = 	btnObj.dataObj;
	
	layoutObj.unbind("click").bind("click",function(event) {
	    var rtnValue = funName.call();

	    if (rtnValue) {
			if(actItem.ACT_MEMO.length > 1 && actItem.ACT_MEMO != "null") {
				eval(actItem.ACT_MEMO);
			}else {
				eval("_self." + actItem.ACT_CODE + "(event,actItem)");
			}
		}
	});	
};

/**
 * 点击流程按钮  后执行 funName 函数
 */
mb.vi.wfCardView.prototype._doWfBtnAfterClick = function(funName,btnObj) {
    var _self = this;
			
	var layoutObj = btnObj.layoutObj;
    var actItem = 	btnObj.dataObj;
	
	layoutObj.unbind("click").bind("click",function(event) {
		if(actItem.ACT_MEMO.length > 1 && actItem.ACT_MEMO != "null") {
			eval(actItem.ACT_MEMO);
		}else {
			eval("_self." + actItem.ACT_CODE + "(event,actItem)");
		}
		//之后执行
	    funName.call();		
	});	
};

/**
 * 点击下一步节点前执行 funName 函数
 */
mb.vi.wfCardView.prototype._doNextStepBeforeClick = function(funName,btnObj) {
    var _self = this;
			
	var layoutObj = btnObj.layoutObj;
    var actItem = 	btnObj.dataObj;
	
	layoutObj.unbind("click").bind("click",function(event) {
	    var rtnValue = funName.call();

	    if (rtnValue) {
		    _self._openSelectOrg(actItem.NODE_CODE,layoutObj,event);
		}
	});	
};

/**
 * 打开组织结构选择
 */
mb.vi.wfCardView.prototype._doOpenOrgSelect = function(event,btnObj) {
    var _self = this;
			
	var layoutObj = btnObj.layoutObj;
    var actItem = 	btnObj.dataObj;    

    _self._openSelectOrg(actItem.NODE_CODE,layoutObj,event);
};


/**
 * 点击流程按钮按钮之前执行
 */
mb.vi.wfCardView.prototype._doNextStepBeforeClick = function(funName,btnObj) {
    var _self = this;
			
	var layoutObj = btnObj.layoutObj;
    var actItem = 	btnObj.dataObj;
	
	layoutObj.unbind("click").bind("click",function(event) {
	    var rtnValue = funName.call();

	    if (rtnValue) {
		    _self._openSelectOrg(actItem.NODE_CODE,layoutObj,event);
		}
	});	
};


/** 
 * 相关文件 , 出查询选择，选择关联的文件
 * TODO 这里的查询条件，需要是当前人能查到的，
 */
mb.vi.wfCardView.prototype.cmRelate = function(event) { 
	var _self = this;
	
	this.wfRelate.chooseRelateWay(event);
}

/** 
 * 套红头  ， 套红头之前，需要先选择成文模板 ， 点按钮出一个dialog ，可以选择成文模板，确定的时候，再提交
 */
mb.vi.wfCardView.prototype.redHead = function(event) { 
	var _self = this;
	var _self = this;
    
	//查询成文模板的列表
	var reqCwData = {};
	_self._parHandler.itemValue("GW_YEAR_CODE")
	
	var gwYearCodeItemValue = _self._parHandler.itemValue("GW_YEAR_CODE");
	if (gwYearCodeItemValue == undefined || gwYearCodeItemValue == "" ) {
	    alert("没有生成机关代字，不能套红头");
		return false;
	}
	
	reqCwData["GW_YEAR_CODE"] = _self._parHandler.itemValue("GW_YEAR_CODE");
	
	var cwTmplRtnList = rh_processData("OA_GW_CODE_CW_TMPL.getCwTmplListByCode.do", reqCwData);
	
	var cwListObj = cwTmplRtnList.cwList;
	
	if (cwListObj.length == 1) {
		var orgFileId = cwListObj[0].FILE_ID;
		var realFileId = orgFileId.split(",")[0];
	    _self._doRedHeadConfirm(realFileId);
	} else {
		var winDialog = jQuery("<div style='margin:10px 0px 0px 10px'></div>").addClass("selectDialog").attr("id","chengWenTmplListDiv").attr("title","成文模板");    
		
		var chengContent = jQuery("<div></div>").appendTo(winDialog);
		jQuery("<li style='width: 100%'></li>").append("请选择一个成文模板:").appendTo(chengContent);
		var chengWenTmplList = jQuery("<li class='right'></li>");

		var cwTmplList = jQuery("<select id='templateSelectName' class='ui-select-default2' name='templateSelectName' style='width:80%;margin-right:20%' />").appendTo(chengWenTmplList).appendTo(chengContent);
		
		jQuery.each(cwTmplRtnList.cwList,function(i, cwTmp) {
			//将FILE_ID 进行截串
			var orgFileId = cwTmp.FILE_ID;
			var realFileId = orgFileId.split(",")[0];
			
			jQuery("<option value='" + realFileId + "'>").append(cwTmp.CW_NAME).appendTo(cwTmplList);
		});
		
		//按钮-确定
		var confirmCwTmplUl = jQuery("<div></div>").appendTo(winDialog);
		var confirmCwTmplLi = jQuery("<li style='width: 100%;'></li>").appendTo(confirmCwTmplUl);
		var confirmRedHead = jQuery("<a href='javascript:void(0);'>确定</a>").appendTo(confirmCwTmplLi).appendTo(confirmCwTmplUl);
		confirmRedHead.bind("click",function() {
		    //取到选中的成文模板
		    _self._doRedHeadConfirm(jQuery("#templateSelectName").val());
		});

		//按钮-取消
		jQuery("<span>&nbsp;&nbsp;&nbsp;</span>").appendTo(confirmRedHead);
		var redHeadCancelBtn = jQuery("<a href='javascript:void(0);'>取消</a>").appendTo(confirmRedHead);
		redHeadCancelBtn.bind("click",function() {
			winDialog.remove();
		});
		
		var posArray = [];
		if (event) {
			var cy = event.clientY;
			posArray[0] = "";
			posArray[1] = cy-120;
		}
		winDialog.appendTo(jQuery("body"));
		jQuery("#chengWenTmplListDiv").dialog({
			autoOpen: false,
			width: 400,
			height: 260,
			modal: true,
			resizable:false,
			position:posArray,
			open: function() { 

			},
			close: function() {
				winDialog.remove();
			}
		});	
		jQuery("#chengWenTmplListDiv").dialog("open");
		jQuery(".ui-dialog-titlebar").last().css("display","block");			
	}
}

/**
 * 套红头
 */
mb.vi.wfCardView.prototype._doRedHeadConfirm = function(cwTmplFileId) { 
	var _self = this;
	
	var servDataId = _self._parHandler._pkCode;
	
	var servId = _self._parHandler.servId; //_self._parHandler.itemValue("TMPL_CODE");
	
	var target = _self._getZhengWenId(); //正文文件ID
	
	var source = _self._getWenGaoId(); //文稿的文件ID
	
	var redhatUrl = encodeURI("/sy/util/office/doRedHead.jsp?gwId=" + servDataId + "&dataId="  + servDataId + "&servId=" + servId + "&source=" + source + "&target=" + target + "&cwTmplFileId=" + cwTmplFileId);
	
	window.open(redhatUrl);    
}


/**
 * 取到公文的正文ID
 */
mb.vi.wfCardView.prototype._getZhengWenId = function() { 
	var _self = this;
	_self.reqdata.PK_CODE = _self._parHandler._pkCode;
	
	var formServId = _self._parHandler.servId;
	_self.reqdata.TMP_CODE = formServId;

	var result = rh_processData(formServId+".getGwZhengWenId.do",_self.reqdata);
	
	return result.zhengWenId;
}

/**
 * 取到公文的文稿ID
 */
mb.vi.wfCardView.prototype._getWenGaoId = function() { 
	var _self = this;
	_self.reqdata.PK_CODE = _self._parHandler._pkCode;
	
	var formServId = _self._parHandler.servId;
	_self.reqdata.TMP_CODE = formServId;

	var result = rh_processData(formServId+".getGwWenGaoId.do",_self.reqdata);
	
	return result.wenGaoId;
}


/** 
 * 退回 ， 填写退回说明 -> 添加退回的待办 -> 完成分发（设置返回的字段值） -> 待办变成已办
 * 
 */
mb.vi.wfCardView.prototype.cmTuiHui = function(event,actItem) { 
	var _self = this;
    var sendId = actItem.SEND_ID;
	//退回回执
	var winDialog = jQuery("<div style='margin:10px 0px 0px 10px'></div>").addClass("selectDialog").attr("id","tuiHuiDiv").attr("title","退回回执");    
	

	var huiZhiContent = jQuery("<ul></ul>").appendTo(winDialog);
	jQuery("<li  class='left' style='width: 30%'></li>").append("请填写退回原因:").appendTo(huiZhiContent);
	var huiZhiLi = jQuery("<li class='right'></li>");
	jQuery("<textarea class='ui-textarea-default' type='textarea' cols='50' rows='5' id ='huiZhiContent' name ='huiZhiContent'/>").appendTo(huiZhiLi);
	huiZhiLi.appendTo(huiZhiContent);	

	//按钮-确定
	var  tuiHuiBtn = jQuery("<a href='javascript:void(0);'>确定</a>").appendTo(winDialog);
	tuiHuiBtn.bind("click",function() {
		_self.reqdata["TODO_CONTENT"] = jQuery("#huiZhiContent").val();
		_self.reqdata["SEND_ID"] = sendId;
		var result = rh_processData(WfActConst.SERV_PROC + ".cmTuiHui.do",_self.reqdata);
		
		if (result.rtnstr == "success") {
			Tip.show("退回成功",true);
			parent.Portal.getBlock("SY_COMM_TODO").refresh();
			_self._parHandler.backClick(); 
		} else {
			Tip.show("退回失败",true);
		}
	});

	//按钮-取消
	jQuery("<span>&nbsp;&nbsp;&nbsp;</span>").appendTo(winDialog);
	var tuiHuiCancelBtn = jQuery("<a href='javascript:void(0);'>取消</a>").appendTo(winDialog);
	tuiHuiCancelBtn.bind("click",function() {
	    winDialog.remove();
	});
	
	var posArray = [];
	if (event) {
		var cy = event.clientY;
		posArray[0] = "";
		posArray[1] = cy-120;
	}
	winDialog.appendTo(jQuery("body"));
	jQuery("#tuiHuiDiv").dialog({
		autoOpen: false,
		width: 400,
		height: 260,
		modal: true,
		resizable:false,
		position:posArray,
		open: function() { 

		},
		close: function() {
			winDialog.remove();
		}
	});	
	jQuery("#tuiHuiDiv").dialog("open");
	jQuery(".ui-dialog-titlebar").last().css("display","block");	
}

/** 
 * 转发   弹出选人的页面，确定即分发出去
 */
mb.vi.wfCardView.prototype.cmZhuanFa = function(event,actItem) { 
	var _self = this;
	//分发ID
	var sendId = actItem.SEND_ID;
	_self.reqdata.SEND_ID = sendId;  
	
	var inputName = "zhuanfaUsers";
	
	//
	var configStr = "SY_ORG_DEPT_USER,{'TYPE':'multi'}";
	var extendTreeSetting = {'cascadecheck':false,'checkParent':false};
	var options = {"itemCode":inputName,"config" : configStr,"hide":"explode","show":"blind",
	"extendDicSetting":extendTreeSetting,
	"replaceCallBack":_self._zhuanFa,
	"parHandler":_self};
	var dictView = new mb.vi.rhDictTreeView(options);
	dictView.show(event);
}

/**
 * 转发  
 */
mb.vi.wfCardView.prototype._zhuanFa = function(idArray,nameArray) {
    var _self = this;
	_self.reqdata["TARGET_USERS"] = idArray.join(",");
	
	_self.reqdata["SERV_ID"] = _self._parHandler.servId;
	_self.reqdata["DATA_ID"] = _self._parHandler._pkCode;
	_self.reqdata["DATA_TITLE"] = _self.getBindTitle() + "(分发)" ; //_self._parHandler.itemValue("GW_TITLE");
    
	var result = rh_processData(WfActConst.SERV_PROC + ".cmZhuanFa.do",_self.reqdata);
    
	if (result.rtnstr == "success") {
	    Tip.show("转发成功",true);
	} else {
	    Tip.show("转发失败",true);
	}
	_self._parHandler.refresh();    
}

/** 
 * 签收
 */
mb.vi.wfCardView.prototype.cmQianShou = function(event, actItem) { 
	var _self = this;
	//分发ID
	var sendId = actItem.SEND_ID;
	_self.reqdata.SEND_ID = sendId;
	var result = rh_processData(WfActConst.SERV_PROC+".cmQianShou.do",_self.reqdata);
	if (result.rtnstr == "success") {
	    Tip.show("操作成功",true);
	} else {
	    Tip.show("操作失败",true);
	}
	_self._parHandler.refresh();    
}

/** 
 * 锁定文件
 */
mb.vi.wfCardView.prototype.cmLockFile = function() { 
	var _self = this;
    
	var result = rh_processData(WfActConst.SERV_PROC+".cmLockFile.do",_self.reqdata);
	
	if (result.rtnstr == "success") {
	    _self._parHandler.refresh();
	    alert("锁定成功");		
	} else {
	    Tip.show("操作失败",true);
	}
}

/** 
 * 解锁文件
 */
mb.vi.wfCardView.prototype.cmUnLockFile = function() { 
	var _self = this;
    
	var result = rh_processData(WfActConst.SERV_PROC+".cmUnLockFile.do",_self.reqdata);
	
	if (result.rtnstr == "success") {
	    _self._parHandler.refresh();
	    alert("解锁成功");		
	} else {
	    Tip.show("操作失败",true);
	}
}


/** 
 * 分发
 */
mb.vi.wfCardView.prototype.cmFenFa = function() { 
	var _self = this;
	
	var servDataId = _self._parHandler._pkCode;
	
	var fenfaObj = {};  
	
	fenfaObj.SERV_ID = _self._parHandler.servId;
	fenfaObj.DATA_ID = servDataId;
	fenfaObj.DATA_TITLE = _self.getBindTitle() + "(分发)" ;
	
	var fenFaUrl = encodeURI("SY_COMM_SEND_DETAIL_SHOW_CARD.showSend.do?data=" + JsonToStr(fenfaObj));
	
	var options = {"id":"SY_COMM_SEND_DETAIL_SHOW_CARD-" + servDataId,"url":fenFaUrl,"tTitle":"分发","menuFlag":4};
	Tab.open(options);
}


/** 
 * 补登意见
 */
mb.vi.wfCardView.prototype.cmBuDeng = function(event, actItem) { 
var leaders = StrToJson(actItem.leaders);
 if ( null == leaders || "" == leaders) {
  alert("当前没有补登领导可以选择!");
  return;
 }
	var _self = this;
	//补登意见弹出匡
    jQuery("#bdmind").dialog("destroy");
	 var winDialog = jQuery("<div style='margin:10px 0px 0px 10px'></div>").addClass("selectDialog").attr("id","bdmind").attr("title","补登意见");
	 
	 //补登意见必要属性
	 var ul = jQuery("<ul></ul>").appendTo(winDialog);
	 var inputNameLi = jQuery("<li class='right'></li>");
	 
	 var users = jQuery("<select id='TARGET_USER' class='ui-select-default2' name='TARGET_USER' style='width: 200px;' />").appendTo(inputNameLi);
	 //foreach leaders
	 jQuery.each(leaders,function(i, leader) {
     jQuery("<option value='" + leader.userCode + "'>").append(leader.userName).appendTo(users);
	 });
	 inputNameLi.appendTo(ul);
	 	
	//时间
	 var bdtime = jQuery("<ul></ul>").appendTo(winDialog);
	 jQuery("<li  class='left' style='width: 30%'></li>").append("补登时间").appendTo(bdtime);
	 var timeLi = jQuery("<li class='right'></li>").appendTo(bdtime);
	 jQuery("<input id='TARGET_TIME' class='Wdate ui-date-default' onfocus=\"WdatePicker({startDate:'%y-%MM-%dd %H:%m:%ss',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:false})\"  type='text' style='width: 200px;' />").appendTo(timeLi);
	 
	 //意见输入
	 var bdmind = jQuery("<ul></ul>").appendTo(winDialog);
	 jQuery("<li  class='left' style='width: 30%'></li>").append("意见").appendTo(bdmind);
	 var bdmindLi = jQuery("<li class='right'></li>");
	 jQuery("<textarea class='ui-textarea-default' type='textarea' cols='50' rows='3' id ='TARGET_MIND' name ='TARGET_MIND'  />").appendTo(bdmindLi);
	 bdmindLi.appendTo(bdmind);
	 jQuery("<BR/>").appendTo(winDialog);
	 jQuery("<BR/>").appendTo(winDialog);
	 jQuery("<BR/>").appendTo(winDialog);
	 //按钮-保存
	 var  okBtn = jQuery("<a><span class='rh-icon rh-icon-inner'>保存<span class='rh-icon-img btn-save'></span></span></a>").appendTo(winDialog);
	 okBtn.bind("click",function() {
	 var user = jQuery("#TARGET_USER").val();
	 var uname = jQuery("#TARGET_USER").find('option:selected').text();
	 var mindstr = "<xmp>" + jQuery("#TARGET_MIND").val() +  "</xmp>";
	 var mindTime = jQuery("#TARGET_TIME").val();

// 保存意见
    var currMindCodeName = _self.getMindCodeBean().CODE_NAME;
    var currNiId = _self.getNodeInstBean().NI_ID;
    var currMindCode = _self.getMindCodeBean().CODE_ID;
    var currMindDisRule = _self.getMindCodeBean().MIND_DIS_RULE;
    var currMindType = 1;

    //save budeng mind	 
    var data = {};
    data["MIND_CONTENT"] = mindstr;
    data["MIND_CODE"] = currMindCode;
    data["SERV_ID"] = _self._parHandler.servId;  //服务名
    data["DATA_ID"] = _self._parHandler._pkCode;
    data["MIND_TYPE"] = currMindType;
    data["WF_NI_ID"]= currNiId;
    data["MIND_DIS_RULE"]= "";
    data["BD_USER"]= user;
    data["BD_UNAME"]= uname;
    if (mindTime) {
     data["MIND_TIME"]= mindTime;
    }
    var resultData = FireFly.doAct("SY_COMM_MIND","save",data);
    if (resultData[UIConst.RTN_MSG] && resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
     _self._parHandler.mind.refresh();
    } else {
      Tip.show("返回错误，请检查！" + JsonToStr(resultData), true);
    }	 
	
	 winDialog.remove();
	 });
	 
	 jQuery("<span>&nbsp;&nbsp;&nbsp;</span>").appendTo(winDialog);
	 //按钮-取消
	  var  cancelBtn = jQuery("<a><span class='rh-icon rh-icon-inner'>取消<span class='rh-icon-img btn-clear'></span></span></a>").appendTo(winDialog);
	 cancelBtn.bind("click",function() {
	 winDialog.remove();
	 });
	 
	    var posArray = [];
	    if (event) {
		    var cy = event.clientY;
		    posArray[0] = "";
		    posArray[1] = cy-120;
	    }
		winDialog.appendTo(jQuery("body"));
	    jQuery("#bdmind").dialog({
			autoOpen: false,
			width: 400,
			height: 260,
			modal: true,
			resizable:false,
			position:posArray,
			open: function() { 
	
			},
			close: function() {
				winDialog.remove();
			}
		});
	    jQuery("#bdmind").dialog("open");
	    jQuery(".ui-dialog-titlebar").last().css("display","block");//设置标题显示
 
	
	
//	alert(actItem.leaders + "will call the budeng function");
}


/** 
 * 流程跟踪
 */
mb.vi.wfCardView.prototype.cmWfTracking = function() { 
	var _self = this;
	
	var trackObj = "{'act':'query','PI_ID':'" +  _self.procInstId + "','INST_IF_RUNNING':'" + _self.wfState + "'}";
	
	var opts = {"sId":"SY_WFE_TRACK","url":"SY_WFE_TRACK.list.do","tTitle":"流程跟踪","params":trackObj,"menuFlag":3};
	Tab.open(opts);
}

/** 
 * 独占 ， 即开始处理文件 用于 送角色的时候，其中某人进流程，点独占，角色内其他人员就不能收到待办了
 */
mb.vi.wfCardView.prototype.duZhan = function() { 
	var _self = this;
	var result = rh_processData(WfActConst.SERV_PROC+".duZhan.do",_self.reqdata);
	if (result.rtnstr == "success") {
	    Tip.show("操作成功",true);
	} else {
	    Tip.show("操作失败",true);
	}
	_self._parHandler.refresh();
}

/** 
 * 结束当前工作
 */
mb.vi.wfCardView.prototype.stopWfNode = function() { 
	var _self = this;
	var result = rh_processData(WfActConst.SERV_PROC+".stopWfNode.do",_self.reqdata);
	if (result.rtnstr == "success") {
	    Tip.show("操作成功",true);
	} else {
	    Tip.show("操作失败",true);
	}
	_self._parHandler.refresh();
}


/** 
 * 打印
 */
mb.vi.wfCardView.prototype.cmPrint = function() { 
	var _self = this;
	_self.reqdata.PK_CODE = _self._parHandler._pkCode;
	
	var formServId = _self._parHandler.servId;
	_self.reqdata.TMP_CODE = formServId;

	// 打印预览
	window.open(formServId+".cmPrint.do?data=" + JsonToStr(_self.reqdata)); 
}


/** 
 * 办结
 */
mb.vi.wfCardView.prototype.finish = function() { 
	var _self = this;
	var result = rh_processData(WfActConst.SERV_PROC+".finish.do",_self.reqdata);
	_self._parHandler.refresh();
    alert("办结成功！");
	//关闭当前页面
	_self._pretendClickBack();	
}

/** 
 * 取消办结
 */
mb.vi.wfCardView.prototype.undoFinish = function() { 
	var _self = this;
	var result = rh_processData(WfActConst.SERV_PROC+".undoFinish.do",_self.reqdata);
	_self._parHandler.refresh();
}

/** 
 * 收回
 */
mb.vi.wfCardView.prototype.withdraw = function() { 
	var _self = this;
	var result = rh_processData(WfActConst.SERV_PROC+".withdraw.do",_self.reqdata);
	_self._parHandler.refresh();
}

/** 
 * 终止并发
 */
mb.vi.wfCardView.prototype.stopParallelWf = function() { 
	var _self = this;
	var result = rh_processData(WfActConst.SERV_PROC+".stopParallelWf.do",_self.reqdata);
	_self._parHandler.refresh();
}

/** 
 * 删除
 */
mb.vi.wfCardView.prototype.deleteDoc = function() { 
	var _self = this;
	var confirmDel=confirm("确定删除该文件？");
	if (confirmDel==false){
	     return ;
	}
	
	_self.reqdata.SERV_ID = _self._parHandler.servId;
	_self.reqdata.DATA_ID = _self._parHandler._pkCode;
	var result = rh_processData(WfActConst.SERV_PROC+".deleteDoc.do",_self.reqdata);
	if (result.rtnstr == "success") {
	    Tip.show("删除成功",true);
        _self._pretendClickBack();
	    _self._parHandler.backClick();
	} else {
	    Tip.show("删除失败",true);
	}
}

/**
 * 在页面的最下面显示  分发的详细信息，点连接打开  分发明细列表
 */
mb.vi.wfCardView.prototype._bldSendList = function() {
    _self = this;
	
	var _cardSendObj = jQuery("<div id='sendDtailBtn' style='margin:0 auto;background-color:white;width:98%;height:30px; line-height:30px;'></div>").addClass("ui-form-default").addClass("center").addClass("ui-corner-5").attr("height",300);
	
	var _sendDetailHref = jQuery("<a href='#' onclick='_self._showSendList()' style='margin-left:18px;padding-left:18px'>分发明细>></a>").addClass("btn-cmFenFa");
	_sendDetailHref.appendTo(_cardSendObj);
	
	_cardSendObj.appendTo(_self._parHandler.formCon);
}

/**
 * 分发明细列表
 */
mb.vi.wfCardView.prototype._showSendList = function() {
	var sendObj = {};
	sendObj.SERV_ID = _self._parHandler.servId;
    sendObj.DATA_ID = _self._parHandler._pkCode;
	if (_self.getAuthBean().userDoInWf == "true") {
		var opts = {"url":"SY_COMM_SEND_DETAIL.list.do","tTitle":"分发明细","params":sendObj,"menuFlag":4};
		Tab.open(opts);
	} else {
		var opts = {"url":"SY_COMM_SEND_DETAIL.list.do?readOnly=true","tTitle":"分发明细","params":sendObj,"menuFlag":4};
		Tab.open(opts);		    
	}
}


/**
 * Act 定义的一些常量
 */
var WfActConst = {
    /** 流程定义的服务 */
    SERV_PROC : "SY_WFE_PROC"
};
/**
 * 如果有委托办理，则增加委托办理人标识
 */
mb.vi.wfCardView.prototype.appendAgentUserFlagTo = function(reqdata){
	//增加委托用户USER_CODE
	var _agentUser = this._parHandler.getByIdData("_AGENT_USER_");
	if(_agentUser != ""){
		reqdata["_AGENT_USER_"] = _agentUser;
	}	
}
/**
 * @param varCode
 *            变量名称
 * @returns 指定变量的值，未找到指定变量则返回undefined
 */
mb.vi.wfCardView.prototype.getCustomVarContent = function(varCode) {
	var customVars = this._parHandler.byIdData.WF_CUSTOM_VARS;
	var result = undefined;
	if (customVars) {
		jQuery(customVars).each(function(index, item) {
			if (item.VAR_CODE == varCode) {
				result = item.VAR_CONTENT
			}
		});
	}

	return result;
}
/**
 * 取得审批单的现实模式。常用的查看模式有：MODE_DOING(办理模式)、MODE_ADMIN（流程管理员）、
 * MODE_FLOW（流经模式）、MODE_BASE（最低权限，分发、接收用户查看模式）
 */
mb.vi.wfCardView.prototype.getDisplayMode = function() {
	return this._parHandler.byIdData.WF_DISPLAY_MODE || "";
}
/**
 * 初始化意见
 */
mb.vi.wfCardView.prototype.initMind = function() {
	var _self = this;
	
	// 动态装载意见代码
	Load.scriptJS("/sy/comm/mind/mind.js");
	var tr = jQuery("<tr></tr>");
	var mindCon = jQuery("<td colspan=2></td>").appendTo(tr);
	tr.appendTo(jQuery(".mbCard-form-table").last());
	var param = {"viewer":_self._parHandler,"id":"rh.cm.mind","servId":_self._parHandler.getServSrcId()
			,"dataId":_self._parHandler._pkCode,"wfCard":this,"pCon":mindCon};
	
	_self.mind = new rh.cm.mind(param);	
	_self.mind.render();
	//意见后特殊处理
	jQuery(".mindList_time").each(function(i,n) {
		
	});
};
/*
 * 意见Code Bean
 */
mb.vi.wfCardView.prototype.getMindCodeBean = function() {
	var _self = this;

	return _self._parHandler.byIdData.mindCodeBean;
};

/*
 * 最终 意见Code Bean
 */
mb.vi.wfCardView.prototype.getTerminalMind = function() {
	var _self = this;

	return _self._parHandler.byIdData.mindTerminal || {};
};

/**
 * 取得固定意见
 */
mb.vi.wfCardView.prototype.getRegularMind = function() {
	var _self = this;
	var result = jQuery.extend({}, _self._parHandler.byIdData.regularMind);
	return result;
}
/**
 * 取得意见类型的对象
 */
mb.vi.wfCardView.prototype.getNodeMindObj = function() {
	var _self = this;
	
	var nodeMind = {};
	
	nodeMind.REGULAR = JsonToStr(_self.getRegularMind());
	nodeMind.TERMINAL = JsonToStr(_self.getTerminalMind());
	nodeMind.GENERAL = JsonToStr(_self.getMindCodeBean());	
	
	return nodeMind;
}
/**
 * 取得当前审批单的办理用。兼容委托办理情况
 */
mb.vi.wfCardView.prototype.getDoUserBean = function(){
	//增加委托用户USER_CODE
	var _agentUserBean = this._parHandler.getByIdData("_AGENT_USER_BEAN_");
	if(_agentUserBean){
		return _agentUserBean;
	}
	
	return System.user;
};
/**
 * 是否能填写最终意见
 */
mb.vi.wfCardView.prototype.canWriteTerminalMind = function() {
	var mindCodeBean = this.getTerminalMind();
	if (mindCodeBean && mindCodeBean.READ_ONLY) {
		if (mindCodeBean.READ_ONLY == "true") {
			return false;
		}
	}

	return true;
}