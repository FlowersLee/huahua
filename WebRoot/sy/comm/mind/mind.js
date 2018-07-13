GLOBAL.namespace("rh.cm");

rh.cm.MindInput = function(name) {
	this.name = name;
	//意见ID
	this.mindId = null;
	//是否删除或删除文件
	this._fileIsModify = false;
	//意见输入框对象
	this.mindTextInput = null;
	//修改之前的意见内容
	this.oldMindText = "";
	//文件对象
	this.file = null;
	//保存回调方法
	this.mindSaveFunc = null;
	//意见对象
	this.mindObj = null;
	//意见输入框类型的名称
	this.mindInputName = "";
	//
	this.fileMap = new Map();
	
	//设置输入框对象
	this.setMindTextInput = function(textInputObj) {
		var _self = this;
		this.mindTextInput = textInputObj;
		if(!this.mindTextInput.attr("readonly")){
			this.mindTextInput.mouseout(function() {
				//_self.save();
			});
		}
	}
	
	/**
	 *填充数据 
	 */
	this.fillData = function(data){
		if (null != this.mindId) {  
	  		data["_PK_"] = this.mindId;
		}
		
		data["MIND_CONTENT"] = this.mindTextInput.val();
		if(this._fileIsModify){
			data["MIND_FILE"] = this._getMindFileVal();
		}
	}
	
	/**
	 * 意见是否已修改，包括意见内容和意见文件。
	 */
	this.isModify = function(){
		return this._textIsModify() || this._fileIsModify;
	};
	
	/**
	 * 意见内容是否已修改
	 * */
	this._textIsModify = function(){
		var newVal = this.mindTextInput.val() || "";
		if(newVal == this.oldMindText){
			return false;
		}
		return true;		
	}
	
	/**
	 * 取得意见文件值 
	 */
	this._getMindFileVal = function(){
		if(this.fileMap && this.fileMap.size() > 0 ) {
			var newVal = "";
			this.fileMap.each(function(index,key,value){
				newVal += key + "," + value + ";";
			});
			
			return newVal;
		}
		
		return "";
	}
	
	this.putFile = function(fileId,fileName){
		this._fileIsModify = true; 
		this.fileMap.put(fileId, fileName);
	}
	
	this.afterUploadFile = function(fileData) {
		//取得文件ID和文件名
		var fileId = fileData[0].FILE_ID;
		var fileName = fileData[0].FILE_NAME;
		this._fileIsModify = true; 
		this.fileMap.put(fileId, fileName);
		
		//保存意见内容
		this.save();
		//上传附件之后， 刷新下面的列表
		this.mindObj.refresh();
	}
	
	this.beforeUploadFile = function(){
		return true;
	}
	
	this.afterDeleteFile = function(fileData){
		this._fileIsModify = true; 
		//取得文件ID和文件名
		var fileId = fileData.FILE_ID;
		//删除文件
		this.fileMap.remove(fileId);
		
		this.save();
		
		//删除附件之后， 刷新下面的列表
		this.mindObj.refresh();
		return true;
	}

	/**
	 *初始化意见列表
	 */
	this.initMindPara = function(mindBean) {
		this.mindId = mindBean.MIND_ID;
		
		if (this.mindTextInput) {
			this.mindTextInput.val(mindBean.MIND_CONTENT);
			// 保存为旧的
			this.oldMindText = mindBean.MIND_CONTENT;
		}
		var strMindFile = mindBean.MIND_FILE;
		if(strMindFile && strMindFile.length > 0) {
			this.fileMap = this.parseMindFile(strMindFile);

			this.loadMindFile();
		}
	}
	
	/**
	 * 解析意见文件数据
	 * */
	this.parseMindFile = function(strMindFile){
		var fileMap = new Map();
		var files = strMindFile.split(";");
		for(var i = 0;i < files.length;i++){
			var file = files[i].split(",");
			if(file.length == 2 && file[0].length > 0 && file[1].length > 0){
				fileMap.put(file[0],file[1]);
			}
		}
		return fileMap;
	}



	/**
	 *初始化意见文件
	 */
	this.loadMindFile = function(strMindFile){
		if(this.file) {
			var fileList = FireFly.doAct("SY_COMM_FILE", "finds", {
				"SERV_ID" : "SY_COMM_MIND",
				"DATA_ID" : this.mindId//,
				//"FILE_ID" : this.MIND_FILE_ID 现在意见可以有多个附件
			});
			this.file.obj.find(".file").remove();
			//[{"FILE_ID":fileId,"FILE_NAME":fileName}]
			this.file.fillData(fileList._DATA_);
		}		
	}
	//保存意见方法
	this.save = function(){
		if(typeof(this.mindSaveFunc) == "function"){
			this.mindSaveFunc.call(this.mindObj);
		}
	}
	
	/**
	 * 是否存在意见输入框 
	 */
	this.exist = function(){
		if(this.mindTextInput && !this.mindTextInput.attr("readonly")){
			return true;
		}
		
		return false;
	}
	
	/**
	 * 清除意见内容
	 * */
	this.clearContent = function(){
		this.mindTextInput.val("");
		this.file.clear();
		this._fileIsModify = false;
		this.mindId = "";
		this.oldMindText = "";
		this.fileMap.clear();
	}
};
rh.cm.mind = function(options) {
  	var defaults = {
    	"viewer":null,
    	"id":"",
    	"wfCard":null,
    	"servId":null,
    	"dataId":null,
    	"pCon":null
  	};
  	
  	this._opts = jQuery.extend(defaults,options);	
  	this._data = null;
  	this._servId = this._opts.servId;
  	this._dataId = this._opts.dataId;
  	this._viewer = this._opts.viewer;
  	this._wfCard = this._opts.wfCard;
  	this._mindWfCardView = this._opts.mindWfCardView
  	this._pCon = this._opts.pCon;
  	
  	this._generalMind = new rh.cm.MindInput("GENERAL_MIND");
  	this._generalMind.mindObj = this;
  	this._terminalMind = new rh.cm.MindInput("TERMINAL_MIND");
  	this._terminalMind.mindObj = this;
  	this._regularMind = new rh.cm.MindInput("REGULAR_MIND");
  	this._regularMind.mindObj = this;
  	this.isMobile = System.getMB("mobile"); //是否是移动版
  	
  	// 意见分组框ID
  	this._mindFiledSetId = UIConst.MIND_FIELDSET;
  	
  	// 意见分组框
  	this._mindGroup = null;
  	
  	// 意见类型常量
  	this._mindType = {
  		M_NORMAL : 1,	// 普通意见
  		M_BRUSH : 2, 	// 画笔意见
  		M_ATTACH : 3	// 附件意见
  	};
  	
  	// 回调函数
  	this.callback = this._opts.callback ? this._opts.callback : function(){return true};
  	
  	// 所有意见
  	this.minds = [];
  	
  	// 整个意见的容器
  	this.obj = null;
};
/**
 * 渲染意见
 */
rh.cm.mind.prototype.render = function() {
	var _self = this;
	//如果是分发、签收用户则不能查看意见
	if(_self._wfCard.getDisplayMode() == "MODE_BASE"){
		var showMindMode = System.getVar("@C_CM_MIND_SHOW_EVERYTIME@");
		if (showMindMode != "TRUE") {
			return;
		} 
	}
	_self._getDefaultSortType(); //分析意见的默认显示类型
	if (_self._wfCard) {
		
		_self.getMindData();
		// 意见容器
	  	_self._pCon =  _self.obj = _self.getMindContainer();
	  	
	  	//构造送交的按钮组
	  	if (_self._viewer.existSubServ("MINDLIST") && _self._wfCard._getBtn("cmSaveAndSend")) {
	  		//
	  		_self.btnBar = jQuery("<div class=\"rhCard-btnBar\"></div>").appendTo(_self._pCon);
	  		_self.btnCon = jQuery("<div id=\"funcBtnDivCon\"></div>").appendTo(_self.btnBar);
//	  		 var opts = {"sId":_self._viewer.sId,"pkCode":_self._viewer._pkCode,"parHandler":_self._viewer};  		
	  		_self._mindWfCard = _self._mindWfCardView; //new rh.vi.wfCardView(opts);
	  		var renderMode = _self._wfCard.btnRenderMode || 10; //渲染模式请参考rhWfCardView.js中的说明
	  		if(renderMode == 11){
	  			renderMode = 0;
	  		}else if(renderMode == 111){
	  			renderMode = 100;
	  		}
	  		_self._mindWfCard.btnRenderMode = renderMode;
	  		_self.cmSaveAndSendItemBean = _self._wfCard._getBtn("cmSaveAndSend").dataObj;
	  		_self._mindWfCard.saveAndSendGroup = _self._mindWfCard._bldBtnGroup(_self.cmSaveAndSendItemBean.ACT_NAME, _self.cmSaveAndSendItemBean.ACT_CODE, true, _self.cmSaveAndSendItemBean);
	  		_self._mindWfCard.wfSendBtnGroup = []; //流程按钮组
	  		_self._mindWfCard._bldNextBtnBar(_self._wfCard.wfSendBtns);
	  		if(renderMode == 0 || renderMode == 100){
	  			_self._mindWfCard.saveAndSendGroup.parent().hide();
	  		}
	  		//
	  	}
		if (_self.canWriteMind()) { //如果能填写意见，则显示输入框
			var reqData = _self._wfCard.getNodeMindObj();
			reqData._isMobile = _self.isMobile;
			_self._wfCard.appendAgentUserFlagTo(reqData);
			
			var res = FireFly.doAct("SY_COMM_MIND", "showMindInput", reqData, false);
			if (_self._pCon) {
				_self._pCon.append(res.inputMindStr);
			}
			
			// 设置意见输入框  对象的 属性
			_self._createMindFrame();
		}
	  	
		if (_self.canWriteMind() || _self.MIND_TYPE_LIST_SIZE > 0) { 
		  	// 构造意见列表 , 和设置未出部门的意见到意见框
		  	_self._initData();
		} else {
			// 隐藏意见分组框
			if (this._mindGroup) {
				this._mindGroup.hide();
			}
		}
	} else {
		alert("工作流没启动");
	}
	
	if (jQuery("#saveMindBtn").length > 0) {
		jQuery("#saveMindBtn").unbind("click").bind("click",function(event){
			var saveResult = _self.saveMind();
			if(saveResult){
				_self.refresh();
				if (_self._viewer && _self._viewer.existSubServ("MINDLIST")) {
					_self._viewer.setRefreshFlag(_self._viewer.servId, true);
				}
			}
		});
	}
	
	_self._viewer.saveMind = function () {
		_self.saveMind();
		return true;
	};
	
	// 注册出部门填写最终意见和固定意见提示
  	_self._wfCard.callback = function(idArray, nameArray) {
		if (_self._wfCard.binderType == "ROLE") {
			//如果是角色则不判断
			return true;
		}
		
		var	ifOutDept = false; // 是否出部门? 默认没有出部门或者机构
		// 判断用户是否送出部门？
		jQuery(idArray).each(function(index, user){
		   	if (user.indexOf("usr:") == 0) {
			   	userCode = user.substr(user.indexOf("usr:") + 4);
			   	var userBean = FireFly.byId("SY_ORG_USER", userCode);
				ifOutDept = userBean.TDEPT_CODE && userBean.TDEPT_CODE != System.getUser("TDEPT_CODE");
			   	return;
		   	}
		});
		
		if (ifOutDept) { // 出部门或者机构了
	   		
	  		 // 如果锁定，必须填写固定意见
  			if (_self._hasRegularMindInput()) { // 固定意见
  				if (_self._hasWriteRegularMind()) { 
  					//已选择固定意见
	  				return true;
	  			} else {
	  				var regularMind = _self._wfCard.getRegularMind();
	  				alert("请选择" + regularMind.CODE_NAME + "！");
	  				return false;
	  			}
  			}
  			
  			if (_self._hasTerminalMindInput()) {
  				if (!_self._hasWriteTerminalMind()) { // 没有填写意见
		   			alert("请填写" + currMind.CODE_NAME + "！");
			   		return false;
		   		}
  			}
	   	}	
		return true;
  	}
};
/**
 * 构造意见输入框
 */
rh.cm.mind.prototype._createMindFrame = function() {
	var _self = this;
	// 固定意见
	var regularMind = _self._wfCard.getRegularMind();
	if (regularMind && regularMind.CODE_ID) {
		_self._createRegularMind(regularMind);
	}
	
	// 最终意见
	var currTerminalMind = _self._wfCard.getTerminalMind();
	if (currTerminalMind && currTerminalMind.CODE_ID) {
		_self._createTerminalMindFrame();
	}
	
	// 普通意见
 	var currMind = _self._wfCard.getMindCodeBean();
	if (currMind && currMind.CODE_ID) {
		_self._createGeneralMindFrame();
	}
};
/**
 * 创建固定意见
 */
rh.cm.mind.prototype._createRegularMind = function(regularMind) {
	var _self = this;
  	
  	// 意见框左边的文字
  	var mindInputName = regularMind.CODE_NAME;
  	this._regularMind.mindInputName = mindInputName;	
	
	jQuery("#REGULAR_MIND").unbind("click").bind("click",function(event){
		_self._chooseMind(event);
	});
	jQuery("#chooseRegularMind").unbind("click").bind("click",function(event){
		_self._chooseMind(event);
	});	
	jQuery("#cancelRegularMind").unbind("click").bind("click",function(event){
		_self.regularUsualId.val("");
		_self.regularMindValue.val("");
		_self.regularMind.val("");
		
		// 保存固定意见
		if (_self._regularMind.mindId) {
			FireFly.doAct("SY_COMM_MIND", "delete", {"_PK_":_self._regularMind.mindId});
			_self._regularMind.mindTextInput.val("");
		}
	});		
	
  	// 固定意见ID
  	this.regularUsualId = jQuery("#USUAL_MIND_ID");
  	// 固定意见值
  	this.regularMindValue = jQuery("#USUAL_MIND_VALUE");
  	// 固定意见文本
  	this.regularMind = jQuery("#REGULAR_MIND");
  	
  	
	// 保存时的回调方法
	this._regularMind.mindSaveFunc = _self.saveRegularMind;
	
	this._regularMind.setMindTextInput(jQuery("#REGULAR_MIND_CONTENT"));	
	
	// 创建文件上传按钮
	this._createFile(this._regularMind, false);
	
	// 绑定常用批语
	this._bldUsualMind(this._regularMind);
};
/**
 * 构造最终意见输入框
 */
rh.cm.mind.prototype._createTerminalMindFrame = function() {
	var _self = this;
  	
	// 意见框左边的文字
  	var mindInputName = _self._wfCard.getTerminalMind().CODE_NAME;
  	this._terminalMind.mindInputName = mindInputName;	
	
  	//最终意见是否是只读？
  	var readonly = ! _self._wfCard.canWriteTerminalMind();
	
  	this._terminalMind.setMindTextInput(jQuery("#TERMINAL_MIND"));	
  	
	// 保存时回调
	this._terminalMind.mindSaveFunc = _self.saveTerminalMind;
	
	// 构建附件上传
	this._createFile(this._terminalMind, false);
	
	// 绑定常用批语
	this._bldUsualMind(this._terminalMind);
};
/**
 * 构造普通意见输入框，包括：自拟意见、手写意见、附件意见、固定意见(包含自拟意见)
 */
rh.cm.mind.prototype._createGeneralMindFrame = function() {
	var _self = this;

  	// 自拟意见框左边的文字
  	var mindInputName = _self._wfCard.getMindCodeBean().CODE_NAME;
  	this._generalMind.mindInputName = mindInputName;	
	
	// 保存时回调
	this._generalMind.mindSaveFunc = _self.saveGeneralMind;
	
 	this._generalMind.setMindTextInput(jQuery("#GENERAL_MIND"));

	// 构建文件上传
	this._createFile(this._generalMind, false);
	
	// 绑定常用批语
	this._bldUsualMind(this._generalMind);
};
/**
 * 获取意见分组框存放内容的对象
 */
rh.cm.mind.prototype.getMindContainer = function() {
	var _self = this;
	
	// 存放意见的容器
	var mindContainer = null;
	
	if (_self._pCon) {
		return _self._pCon;
	}

	// 查找意见分组框
	this._mindGroup = this._viewer.form.getGroup(this._mindFiledSetId);
	if (!this._mindGroup) {
		this._mindGroup = this._viewer.form.getGroup(null, UIConst.FITEM_ELEMENT_MIND);
	}
	
	if  (this._mindGroup) {
		mindContainer = this._mindGroup.find(".formContent").first();
	} else {
		var fs = new rh.ui.FieldSet({"formContainerId":this._mindFiledSetId,"legendName":"意见"});
		this._mindGroup = fs.getObj();
		this._mindGroup.appendTo(this._viewer.formCon);
		//如果是模板显示页面，添加模板的样式
		if (this._viewer._data.SERV_CARD_TMPL == 1) { //启用了模板
			this._mindGroup.addClass("temp_container");
		}
		
		mindContainer = fs.getFormContent();
	}
	return mindContainer;
};
/**
 * 是否能输入意见
 */
rh.cm.mind.prototype.canWriteMind = function() {
	var _self = this;
	var authBean = _self._wfCard.getAuthBean();
	if (_self._wfCard != null) {
//		&& (_self._wfCard.getMindCodeBean().CODE_ID 
//		|| _self._wfCard.getTerminalMind().CODE_ID 
//		|| _self._wfCard.getRegularMind().CODE_ID)) {
//		return true;
		if (this._wfCard.getMindCodeBean() && this._wfCard.getMindCodeBean().CODE_ID) {
			return true;
		}
		if (this._wfCard.getTerminalMind() && this._wfCard.getTerminalMind().CODE_ID) {
			return true;
		}
		if (this._wfCard.getRegularMind() && this._wfCard.getRegularMind().CODE_ID) {
			return true;
		}
	}
	return false;
};
/**
 * 判断有没有配置最终意见
 * @return {Boolean}
 */
rh.cm.mind.prototype._hasTerminalMindInput = function() {
	var currTerminalMind = this._wfCard.getTerminalMind();
	if(currTerminalMind && currTerminalMind.CODE_ID) {
		return true;
	}

	return false;
}; 
/**
 * 是否已经填写最终意见
 */
rh.cm.mind.prototype._hasWriteTerminalMind = function() {
	var _self = this;
	if(_self._terminalMind.mindId){
		return true;
	}
	
	return true;
};
/**
 * 判断有没有配置固定意见
 */
rh.cm.mind.prototype._hasRegularMindInput = function() {
	var regularMind = this._wfCard.getRegularMind();
	if(regularMind && regularMind.CODE_ID){
		return true;
	}
	
	return false;
};
/**
 *是否已填写固定意见
 */
rh.cm.mind.prototype._hasWriteRegularMind = function() {
	var _self = this;
	if(_self.regularUsualId && _self.regularUsualId.val() != null 
		&& _self.regularUsualId.val().length > 0) {
		return true;
	}
	return false;
};
/**
 * 保存最终意见
 */
rh.cm.mind.prototype.saveTerminalMind = function() {
	var _self = this;
	var wfCard = _self._wfCard;		
	if(!wfCard.canWriteTerminalMind()){  //不能填写最终意见，则返回
		return;
	}
	
	var currTerminalMind = wfCard.getTerminalMind();
	if(!_self._hasTerminalMindInput()){		//最终意见输入框不存在则返回
		return false;
	}
	
	if (!_self._terminalMind.isModify()) {
		// 意见输入框的值等于原始值，表示已经更改过
		return false;
	}
	
	if (_self._terminalMind.mindTextInput.val() && _self._terminalMind.mindTextInput.val().length > 0) {
		var data = _self._createMindBean(currTerminalMind);
    	_self._terminalMind.fillData(data);
    	
		data["MIND_IS_TERMINAL"] = 1; // 是最终意见
				
		if (_self._viewer.params && _self._viewer.params.isProxyUser) { // 代理身份的提示
			if (confirm("您已经填写了最终意见，请确认您是否有权限填写最终意见？")) {
				_self._saveMind(data,_self._terminalMind);
			}
		} else { // 正常身份的提示
			_self._saveMind(data,_self._terminalMind);
		}
	} 
	return true;
};
/**
 * 根据MindCodeBean 创建数据Bean 
 */
rh.cm.mind.prototype._createMindBean = function(mindCodeBean){
	var _self = this;
	var data = {};
	data["MIND_CODE"] = mindCodeBean.CODE_ID;
	data["MIND_CODE_NAME"] = mindCodeBean.CODE_NAME;
    data["SERV_ID"] = _self._servId;
    data["DATA_ID"] = _self._dataId;
    data["WF_NI_ID"] = this._wfCard.getNodeInstBean().NI_ID;
    data["WF_NI_NAME"] = this._wfCard.getNodeInstBean().NODE_NAME;
    data["MIND_DIS_RULE"] = mindCodeBean.MIND_DIS_RULE; //显示规则
    data["MIND_TYPE"] = "1"; //1:文字意见;2:手写意见
//    data["BD_USER"] = "";
//    data["DB_UNAME"] = "";
	data["S_FLAG"] = 2; //启用标志
	
	//增加委托用户USER_CODE
	_self._wfCard.appendAgentUserFlagTo(data); 
	
	return data;
};
/**
 * 保存固定意见
 */
rh.cm.mind.prototype.saveRegularMind = function() {
	var _self = this;
	
	if(!_self.regularMindValue || ! _self._regularMind.mindTextInput){ 
		//是否存在固定意见的输入框
		return false ;
	}
	
	if (!_self.regularUsualId || !_self.regularUsualId.val() || _self.regularUsualId.val().length == 0) {
		//没有选择最终意见
		return false;
	}
	
	if (!_self._regularMind.isModify()) {
		//意见内容没有变化
		return false;
	}

	var wfCard = this._wfCard;
	//固定意见的MindCodeBean
 	var currMind = wfCard.getRegularMind();
  	
	var data = _self._createMindBean(currMind);
	_self._regularMind.fillData(data);
	data["USUAL_ID"] = _self.regularUsualId.val(); // 固定意见类型，批准，同意等
	
	if (_self.regularMindValue.val() == 1) { // 批准需要提示一下
		if (_self._viewer.params && _self._viewer.params.isProxyUser) { // 代理身份的提示
			if (confirm("您已经批准了该审签单，请确认您是否有权限批准？")) {
				_self._saveMind(data,_self._regularMind);
			}
		} else { // 正常身份
			_self._saveMind(data,_self._regularMind);
		} 
	} else { // 非批准意见也不用提醒
		_self._saveMind(data,_self._regularMind);
	} 
	
	if (_self._wfCard.isSendState) { // 发送状态才刷新
		_self._wfCard._reloadNextBtn(); // 刷新按钮
	}
	
	return true;
};

/**
 * 构建附件
 */
rh.cm.mind.prototype._createFile = function(mind, readonly) {
	var _self = this;
	try {
		// 创建文件上传按钮
		var config = {"SERV_ID":"SY_COMM_MIND", "FILE_CAT":"REGULAR_MIND_FILE", "VALUE":15, "TYPES":"*.*"};
		if(readonly){
			//设置文件操作权限为只读
			config.VALUE = 0;
		}
	
		mind.file = new rh.ui.File({
			"config" : config
		});
		jQuery("#upload_" + mind.name).append(mind.file.obj);
	
		mind.file.afterUploadCallback = function(fileData){
			mind.afterUploadFile(fileData);
			if (_self._viewer) {
				_self._viewer.setRefreshFlag(_self._viewer.servId, true);
			}
		};
		
		mind.file.beforeUploadCallback = function(){
			return mind.beforeUploadFile();
		};
		
		mind.file.afterDeleteCallback = function(fileData){
			mind.afterDeleteFile(fileData);
			if (_self._viewer) {
				_self._viewer.setRefreshFlag(_self._viewer.servId, true);
			}
		};	
		
		// 初始化上传按钮
		mind.file.initUpload();
		
//		if (!readonly) {  // 绑定常用批语
//			this._bldUsualMind(mind);
//		}	
	} catch(e) {
	}
};
/**
 * @param mind 意见input类型
 */
rh.cm.mind.prototype._bldUsualMind = function(mind){
    var mindTextInput = jQuery("#" + mind.name);
    if (mind.name == "REGULAR_MIND") {
    	mindTextInput = jQuery("#REGULAR_MIND_CONTENT");
    }
    
    var uploadArea = jQuery("#upload_" + mind.name);
    var commTag =  null;
	if (this.isMobile) { //移动版
		var saveMindBtn = jQuery("#saveMindBtn");
		commTag = jQuery("<a href='javascript:void(0)'><span class='usualContent'>常用批语</span></a>");
		saveMindBtn.after(commTag);
	} else {
		uploadArea.find(".uploadBtn").addClass("wp");
		uploadArea.find("OBJECT").addClass("fl");
		commTag = jQuery("<span class='fl ml30 mt5 unl cp' style='font-size:14px;'>常用批语</span>");
		uploadArea.find(".uploadBtn").append(commTag);
	}
    
	var opts = {"typeCode":"MIND"
		,"optionType":"single"
		,"fieldObj":mindTextInput
		,"optObj":commTag};
	Select.usualContent(opts,this._viewer,null,[500,400]);
};
/**
 * 保存普通意见
 */
rh.cm.mind.prototype.saveGeneralMind = function() {
	var _self = this;
	var currMind = this._wfCard.getMindCodeBean();
	if (!currMind.CODE_ID){
		//没有意见输入框，则返回不保存
		return false;
	}
	
	if (!_self._generalMind.isModify()) {
		//意见内容没有变化，则返回不保存
		return false;	
	}
	
	_self._generalMind.oldMindText = _self._generalMind.mindTextInput.val();
			
	var data = _self._createMindBean(currMind);

	_self._generalMind.fillData(data);
	
	_self._saveMind(data,_self._generalMind);
	
	return true;
};

/**
 * 保存普通意见或固定意见
 * @param {} data
 */
rh.cm.mind.prototype._saveMind = function(data,mindInputObj) {
	var _self = this;
	var resultData = FireFly.doAct("SY_COMM_MIND", "save", data);
	
	if (resultData[UIConst.RTN_MSG] && resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
  		mindInputObj.mindId = resultData.MIND_ID;
  		mindInputObj._fileIsModify = false;
  		mindInputObj.oldMindText = data.MIND_CONTENT;
  		// 保存完了删除新文件的标志
        if (mindInputObj.file) {
            mindInputObj.file.obj.find( ".newFile").remove();
        }
  	    _self.callback.call(_self._viewer, resultData); // 回调
  		this._viewer.cardBarTip("意见已保存！" );//调用卡片句柄的提示信息方法
	} else {
		this._viewer.cardBarTipError("返回错误，请检查！" + JsonToStr(resultData));
	}
};

/**
 * 保存所有意见，供送一个节点之前调用
 */
rh.cm.mind.prototype.saveMind = function() {
	var _self = this;
 	// 保存固定意见
 	var saveReg = _self.saveRegularMind();
 	// 保存最终意见
 	var saveTerm = _self.saveTerminalMind();
 	// 保存普通意见
 	var saveGen = _self.saveGeneralMind();
	
  	return saveReg || saveTerm || saveGen;
};

/**
 * 打开固定意见选择框
 * @param {} event
 */
rh.cm.mind.prototype._chooseMind = function(event) {
	var _self = this;
	var regularMind = _self._wfCard.getRegularMind();
	var inputName ="REGULAR_MIND";

	var configStr = "SY_COMM_MIND_REGULAR,{'TARGET':'MIND_ID~REGULAR_MIND','SOURCE':'MIND_ID~MIND_CONTENT~MIND_VALUE','PKHIDE':true,'EXTWHERE':' and REGULAR_TYPE=^" + regularMind.CODE_ID + "^', 'TYPE':'single','HIDE':'MIND_ID'}";
	var options = {"itemCode":inputName, "config":configStr, "rebackCodes":inputName, "parHandler":_self._viewer, "replaceCallBack":function(mind){
		_self.regularUsualId.val(mind.MIND_ID);
		_self.regularMind.val(mind.MIND_CONTENT);
		_self.regularMindValue.val(mind.MIND_VALUE);
		
		var newRegularMindVal = mind.MIND_CONTENT + "。" +  _self._regularMind.mindTextInput.val();
		 _self._regularMind.mindTextInput.val(newRegularMindVal);
		
		// 保存固定意见
		_self.saveRegularMind();
	}};

	var queryView = new rh.vi.rhSelectListView(options);
	queryView.show(event);
};
/**
 * 设置默认排序
 */
rh.cm.mind.prototype._getDefaultSortType = function() {
	var _self = this;
	_self.defaultSortType = "TYPE";
	jQuery.each(_self._viewer._data.ITEMS, function(index, item){
		if (item.ITEM_INPUT_TYPE == UIConst.FITEM_ELEMENT_MIND) {
			//获取字段定义的默认值
			var mindDef = _self._viewer.getItemConfig(item.ITEM_CODE);
			if (mindDef && mindDef.length > 0) {
				var mindDefJson = StrToJson(mindDef);
				_self.defaultSortType = mindDefJson.MIND_LIST_ORDER;
				_self.defaultExpandsionAll = mindDefJson.MIND_LIST_EXPANDSION;
			}
		}
	});
};
/**
 * 初始化其他机构的意见的列表
 */
rh.cm.mind.prototype.initShowMindList = function() {
	var _self = this;
	var odeptCode = System.getVar("@ODEPT_CODE@");
	jQuery(".mindOdpt").each(function(){
		if (jQuery(this).attr("deptCode") == odeptCode) {
			jQuery("<span class='icon-card-close rh-advSearch__iconC'>&nbsp;&nbsp;&nbsp;&nbsp;</span>").appendTo(jQuery(this).attr("title","点击查看详细"));
		} else {
			jQuery("<span class='icon-card-open rh-advSearch__iconC'>&nbsp;&nbsp;&nbsp;&nbsp;</span>").appendTo(jQuery(this).attr("title","点击查看详细"));
		}
	});
	//绑定意见显示方式按钮的click事件
	jQuery(".mindSortClick").bind("click",function(){
		var obj = jQuery(this);
		//点击列表类型查看的时候对前面的显示标志进行联动
		var objParent = obj.parent().find(".rh-advSearch__iconC");
		if ((objParent.attr("class") || "").indexOf("icon-card-open") >=0) {
			objParent.addClass("icon-card-close").removeClass("icon-card-open");
		}
		var odeptCode = obj.attr("deptCode");
		var sortType =  obj.attr("sortType");
		_self.displayMindList(odeptCode, sortType);
		obj.parent().find(".mindSortClick").removeClass("mindTypeSelected");
		var sortType =  obj.attr("sortType")?obj.attr("sortType"):"TYPE";
		obj.parent().find("[sortType=" + sortType + "]").addClass("mindTypeSelected");
		_self._mindResetHeiWid();
	});
	//绑定机构名称连接的click事件
	jQuery(".mindOdpt").bind("click",function(){
		var obj = jQuery(this);
		//点击列表类型查看的时候对前面的显示标志进行联动
		var objParent = obj.find(".rh-advSearch__iconC");
		if ((objParent.attr("class") || "").indexOf("icon-card-open") >=0) {
			objParent.addClass("icon-card-close").removeClass("icon-card-open");
		} else if (objParent.attr("class").indexOf("icon-card-close") >=0) {
			objParent.addClass("icon-card-open").removeClass("icon-card-close");
		}
		var odeptCode = obj.attr("deptCode");
		var mindContentObj = jQuery("#mindContent" + odeptCode);
		if(mindContentObj.contents().length == 0){ // 没有意见内容，则重新装载
			var sortType =  obj.attr("sortType") || _self.defaultSortType;
			_self.displayMindList(odeptCode, sortType);
			obj.parent().find(".mindSortClick").removeClass("mindTypeSelected");
			var sortType =  obj.attr("sortType")?obj.attr("sortType"):_self.defaultSortType;
			obj.parent().find("[sortType=" + sortType + "]").addClass("mindTypeSelected");
		} else if (mindContentObj.hasClass("none")) {
			mindContentObj.removeClass("none");
		} else {
			mindContentObj.addClass("none");
		}
		
		_self._mindResetHeiWid();
	});
	
	_self._copyMind();   //复制意见
	_self._deleteMind(); //删除意见
};
/**
 * 根据机构显示意见列表
 */
rh.cm.mind.prototype.displayMindList = function(odeptCode, sortType) {
	var _self = this;
	var res = _self._getMindData(sortType, odeptCode, "listMind");
  	jQuery("#mindTable" + odeptCode).remove();
  	var mindListObj = jQuery("#mindContent" + odeptCode).append(res.MIND_LIST).removeClass("none");
  	_self._mindResetHeiWid();  	

	_self._copyMind();
	_self._deleteMind();   //删除意见
};
/**
 * 复制意见
 */
rh.cm.mind.prototype._copyMind = function() {
	var _self = this;
	
	//点击意见复制按钮
  	jQuery(".mindTable").find("a.COPY_MIND").unbind("click").bind("click", function(){
		var _copyBtn = jQuery(this);
		
		var mindContent = _copyBtn.parent().find("span.MIND_CONTENT").text();
		
		var mindFileObj = _copyBtn.parent().find("a.MIND_FILE");
		var mindFileIDs = new Array();

		if(mindFileObj.length > 0){
			for(var i=0;i<mindFileObj.length;i++){
				mindFileIDs.push(jQuery(mindFileObj[i]).attr("fileID"));
			}
		}
		var html = new Array();
		html.push("<div id='DIV_MIND_SELECT' title='请选择意见类型'>");
		html.push("<table>");
		html.push("<tr class='h25'><td colspan='2'>请选择意见类型</td></tr>");
		
		if(_self._terminalMind.exist()){
			html.push("<tr><td class='w30 h25'><input type='radio' name='mindTypeCode' value='_terminalMind'></td>");
			html.push("<td><span class='mindTypeName'>" + _self._terminalMind.mindInputName);
			html.push("</span></td></tr>");
		}
		if(_self._regularMind.exist()){
			html.push("<tr><td class='w30 h25'><input type='radio' name='mindTypeCode' value='_regularMind' ></td>");
			html.push("<td><span class='mindTypeName'>" + _self._regularMind.mindInputName);
			html.push("</span></td></tr>");
		}
		if(_self._generalMind.exist()){
			html.push("<tr><td class='w30 h25'><input type='radio' name='mindTypeCode' value='_generalMind' ></td>");
			html.push("<td><span class='mindTypeName'>" + _self._generalMind.mindInputName);
			html.push("</span></td></tr>");
		}

		html.push("</table>");
		html.push("</div>");
		
		var dialog = jQuery(html.join("")).addClass("dictDialog");
		
		// 点击文字也能选中
		dialog.find(".mindTypeName").css({"cursor":"pointer"}).click(function(){
			jQuery(this).parent().parent().find("input").first().click();
		});
		
		var hei = 200;
		var wid = 500;
		
		var scroll = RHWindow.getScroll(parent.window);
	    var viewport = RHWindow.getViewPort(parent.window);
	    var top = scroll.top - viewport.height / 2 + 2 *hei;
	    var posArray = [];
	    
	    posArray[0] = "";
	    posArray[1] = top;
		
		dialog.dialog({
			autoOpen: true,
			height: hei,
			width: wid,
			show: "bounce", 
	        hide: "puff",
			modal: true,
			resizable: false,
			position: posArray,
			buttons: {
				"确认": function() {
					dialog.dialog("close");
					var selectItem = dialog.find("input[type=radio]:checked");

					if(selectItem.length == 1){
						var itemVal = selectItem.attr("value");
						var mindInputObj = null;
						if(itemVal == "_generalMind"){
							mindInputObj = _self._generalMind;
						}else if(itemVal == "_terminalMind"){
							mindInputObj = _self._terminalMind;
						}else if(itemVal == "_regularMind"){
							mindInputObj = _self._regularMind;
						}
						
						if(mindInputObj.mindTextInput.text() != ""){
							if(!confirm("是否覆盖已有意见内容！")){
								return;
							}
						}
						
						mindInputObj.mindTextInput.text(mindContent);
						mindInputObj.save();
						//如果存在意见附件，则复制意见附件
						for(var i =0;i<mindFileIDs.length;i++){
							var mindFileID = mindFileIDs[i];
							var paramBean = {
								"OLD_FILE_ID" : mindFileID,
								"NEW_SERV_ID" : "SY_COMM_MIND",
								"NEW_DATA_ID" : mindInputObj.mindId,
								"NEW_FILE_CAT" : mindInputObj.file._opts.config.FILE_CAT
							};

							//复制文件
							var resultData = FireFly.doAct("SY_COMM_FILE", "copyFile", paramBean);
							//显示文件复制结果，并保存
							if (resultData[UIConst.RTN_MSG] 
								&& resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
								mindInputObj.putFile(resultData.FILE_ID,resultData.FILE_NAME);
							}
						}
						
						if(mindFileIDs.length > 0){
							mindInputObj.save();
							mindInputObj.loadMindFile();
						}
						_self.refresh();
						mindInputObj.mindTextInput.focus();
					}
					return true;
				},
				"取消": function(){
					dialog.dialog("close");
					return false;
				}
			}
		});
		// 注释掉头部关闭按钮
//		dialog.parent().find(".ui-dialog-titlebar-close").hide();
		var btns = jQuery(".ui-dialog-buttonpane button",dialog.parent()).attr("onfocus","this.blur()");
		btns.first().addClass("rh-small-dialog-ok");
		btns.last().addClass("rh-small-dialog-close");
		dialog.parent().addClass("rh-small-dialog").addClass("rh-bottom-right-radius");
	    jQuery(".ui-dialog-titlebar").last().css("display","block");//设置标题显示
	});		
};
/**
 * 删除意见
 */
rh.cm.mind.prototype._deleteMind = function(){
	var _self = this;
	
	//点击意见复制按钮
  	jQuery(".mindTable").find("a.DELETE_MIND").unbind("click").bind("click", function(){
  		if(confirm("确定删除意见？")){
  			var delBtn = jQuery(this);
  			var data = {};
  			var mindId = delBtn.attr("MIND_ID");
  			data["_PK_"] = mindId;
  			var res = FireFly.doAct("SY_COMM_MIND", "delete", data, true);
  			_self.refresh();

  			if (_self.regularMind) { // 清除固定意见框
  				if(_self.regularMind && _self.regularMind.mindId == mindId){
  					_self.regularMind.clearContent();
  				}
  			}
  			
  			if (_self._generalMind) { //清除普通意见框
  				if(_self._generalMind && _self._generalMind.mindId == mindId){
  					_self._generalMind.clearContent();
  				}
  			}
  			
  			if (_self._terminalMind) { //清除最终意见框
  				if(_self._terminalMind && _self._terminalMind.mindId == mindId){
  					_self._terminalMind.clearContent();
  				}
  			}
  		}
  	});
}



/**
 * 显示意见到页面上
 */
rh.cm.mind.prototype._initData = function() {
	var _self = this;
	if (!_self.mindContainer) {		
		_self.mindContainer = jQuery("<div id='mindContainer'></div>");
		_self.mindContainer.appendTo(this._pCon);		
	}
	if(_self.MIND_TITLE && _self.MIND_TYPE_LIST_SIZE > 0){
		var mindTitleObj = _self.mindContainer.append(_self.MIND_TITLE);
		_self.initShowMindList();
		
		if (_self.firstAllData) {
			_self._expansionFisrtAll(_self.firstAllData);
		}
	}
  	
	if (jQuery.isEmptyObject(this._data)) {
		return;
	}
	
	var authBean = _self._wfCard.getAuthBean();
	//办理用户:当前用户或委托用户
	var doUser = _self._wfCard.getDoUserBean();
	jQuery.each(this._data, function(i, m) {
		// 本部门的最终意见，且还没有出过部门
		if (_self._hasTerminalMindInput && m.MIND_IS_TERMINAL == 1 && m.S_FLAG == 2 && doUser["TDEPT_CODE"] == m.S_TDEPT) { 
			_self._terminalMind.initMindPara(m);
		} else if(_self._hasRegularMindInput() && m.USUAL_ID && m.USUAL_ID.length > 0 && m.S_FLAG == 2 && doUser["TDEPT_CODE"] == m.S_TDEPT){
			var regularMind = _self._wfCard.getRegularMind(); //  取出当前意见类型
			//写固定意见的值
			if(_self.regularUsualId){
				_self.regularUsualId.val(m.USUAL_ID);
			}
			if(_self.regularMindValue){
				_self.regularMindValue.val(m.MIND_VALUE);
			}
			if(_self.regularMind){
				_self.regularMind.val(m.USUAL_CONTENT);	
			}

			_self._regularMind.initMindPara(m);
		}else if (authBean.userDoInWf == "true" && doUser["USER_CODE"] == m.S_USER && m.S_FLAG == 2) { 
			// 当前人能正在办理本审批单
			var currMind = _self._wfCard.getMindCodeBean(); //  取出当前意见类型
			
			if (m.WF_NI_ID == _self._wfCard.getNodeInstBean().NI_ID) { // 同一节点
				if (m.MIND_TYPE == _self._mindType.M_NORMAL && m.MIND_IS_TERMINAL != 1) { // 自拟意见
					_self._generalMind.initMindPara(m);
				}  
			}
		}
	});
};

/**
 * 一进页面，展开所有的意见列表
 */
rh.cm.mind.prototype._expansionFisrtAll = function(firstAllData) {
	var _self = this;
	
	jQuery.each(firstAllData, function(index, item){
		var odeptCode = item.odeptCode;
		
	  	jQuery("#mindTable" + odeptCode).remove();
	  	var mindListObj = jQuery("#mindContent" + odeptCode).append(item.MIND_LIST).removeClass("none");
	  	
	  	//机构上的图标打开状态
	  	var obj = jQuery("#mind" + odeptCode).find(".mindOdpt");
		var objParent = obj.find(".rh-advSearch__iconC");
		if ((objParent.attr("class") || "").indexOf("icon-card-open") >=0) {
			objParent.addClass("icon-card-close").removeClass("icon-card-open");
		} else if (objParent.attr("class").indexOf("icon-card-close") >=0) {
			objParent.addClass("icon-card-open").removeClass("icon-card-close");
		}
		
		//默认的排序
		var sortType =  _self.defaultSortType;
		obj.parent().find("[sortType=" + sortType + "]").addClass("mindTypeSelected");
		
	  	_self._mindResetHeiWid();
	});
}

/**
 * 从服务器端取得意见数据
 */
rh.cm.mind.prototype._getMindData = function(sortType, odeptCode, type){
	var _self = this;
	var data = {};
  	data["_NOPAGE_"] = "YES";
  	data["DATA_ID"] =  _self._dataId;
  	data["SERV_ID"] = _self._servId;
  	data["_extWhere"] = " AND S_FLAG=1";
  	
  	sortType = sortType || _self.defaultSortType;
	data["SORT_TYPE"] = sortType;
	data["CAN_COPY"] = _self.canWriteMind();
	data["_isMobile"] = _self.isMobile;
	
	data["userDoInWf"] = _self._wfCard.getAuthBean().userDoInWf;
//	alert("userDoInWf=" + data["userDoInWf"]);
	//增加流程节点ID参数
	var nodeInstBean = _self._wfCard.getNodeInstBean();
	if(nodeInstBean){
		data["NI_ID"] = nodeInstBean["NI_ID"]; 
	}
	//增加是否允许删除意见的变量
	var delMindDef = _self._wfCard.getCustomVarContent("DEL_MIND");
	if(delMindDef == "true"){
		data["DEL_MIND"] = "true"; 
	}
  	
	var reqMethod = "displayMindTitle";
	if (type && type == "listMind") {
		reqMethod = "displayMindList";
		data["ODEPT_CODE"] = odeptCode;
	} else {
		data["EXPANDSION_ALL"] = _self.defaultExpandsionAll;
	}
	
	_self._wfCard.appendAgentUserFlagTo(data); //如果是委托办理，则增加委托用户标识
	
	var res = FireFly.doAct("SY_COMM_MIND", reqMethod, data, false);
  	
  	return res;
}

/**
 * 获取意见数据
 */
rh.cm.mind.prototype.getMindData = function(sortType) {
	var _self = this;
  	var res = this._getMindData(sortType);
  	_self._data = res._DATA_;
  	_self.MIND_TITLE = res.MIND_TITLE;
  	_self.MIND_TYPE_LIST_SIZE = res.MIND_TYPE_LIST_SIZE;
  	_self.MIND_ODEPT_SIZE = res.MIND_ODEPT_SIZE;
  	if (_self.defaultExpandsionAll == "TRUE") {
  		_self.firstAllData = res.allData;
  	}
};

/**
 * 刷新意见分组框
 */
rh.cm.mind.prototype.refresh = function(sortType) {
	var _self = this;
    //清除意见列表
	var odeptCode = System.getUser("ODEPT_CODE");
	jQuery("#mindContent" + odeptCode).remove();   //本单位
	
	jQuery(".mindODeptTable").each(function(index, obj){ //其他单位
		var otherOdeptCode = jQuery(obj).attr("deptCode");
		jQuery("#mindContent" + otherOdeptCode).remove(); 
		jQuery("#mindContent" + otherOdeptCode).remove();
	});
	
	jQuery(".mindODeptTable").remove();   //清除意见标题
	
	var sortTypeTemp = "";
	if (sortType) {
		sortTypeTemp = sortType;
	}
	_self.getMindData(sortTypeTemp);
  	_self._initData();
  	_self._mindResetHeiWid();
};

/**
 * 意见中重置页面高度，如果页面上 没有关联 意见的 卡片自定义页面，则重置
 */
rh.cm.mind.prototype._mindResetHeiWid = function() {
	var _self = this;
	
  	if (!_self._viewer.existSubServ("MINDLIST")) { //不存在意见标签页面
  		_self._viewer._resetHeiWid();
  	} else { //重置标签页面的高度
  		Tab.setCardTabFrameHei();
  	}	
}

/**
 * 获取意见Label与内容宽度比例
 */
rh.cm.mind.prototype.getWidth = function(cols) {
	var width = this._viewer.form.getItemWidth(cols?cols:this._viewer.form.cols, this._viewer.form.cols);
	return {"itemWidth":width.ITEM_WIDTH, "leftWidth":width.LEFT_WIDTH, "rightWidth":width.RIGHT_WIDTH, "maxWidth":width.MAX_WIDTH};
};

/**
 * 销毁文件上传组件
 */
rh.cm.mind.prototype.destroy = function() {
	var _self = this;
	if (_self._terminalMind) {
		if (_self._terminalMind.file) {
			_self._terminalMind.file.destroy();
		}
		_self._terminalMind = null;
	}
	
	if (_self._generalMind) {
		if (_self._generalMind.file) {
			_self._generalMind.file.destroy();
		}
		_self._generalMind = null;
	}
	
	if (_self._regularMind) {
		if (_self._regularMind.file) {
			_self._regularMind.file.destroy();
		}
		_self._regularMind = null;
	}
	
	if (_self._mindWfCardView) {
		_self._mindWfCardView.destroy();
		_self._mindWfCardView = null;
	}
	
	if (_self._wfCard) {
		_self._wfCard = null;
	}
	
	if (_self._viewer) {
		_self._viewer.mind = null;
		_self._viewer = null;
	}
};

/**
 * 意见只读
 */
rh.cm.mind.prototype.setMindDisabed = function() {
	var _self = this;
	if (_self.terminalMindInput) { // 最终意见框
		_self.terminalMindInput.attr("readonly", true);
		_self.terminalMindInput.addClass("ui-text-disabled");
		if (_self.saveTerminalMindBtn) {// 最终意见保存按钮不可用
			_self.saveTerminalMindBtn.attr("disabled", true);
		}
	}
	if (_self.regularMind) { // 固定意见框
		_self.regularMind.attr("disabled", true);
		_self.chooseMind.attr("disabled", true);
		_self.cancelMind.attr("disabled", true);
		if (_self.saveRegularMindBtn) {
			_self.saveRegularMindBtn.attr("disabled", true);
		}
	}
	if (_self.mindText) { // 意见输入框
		_self.mindText.attr("readonly", true);
		_self.mindText.addClass("ui-textarea-disabled");
	}
	if (_self.saveMindBtn) { // 保存意见按钮
		_self.saveMindBtn.attr("disabled", true);
	}
	if (_self.mindTable) { // 意见列表
		_self.mindTable.find(".deleteMind").attr("disabled", true);
		_self.mindTable.find(".copyMind").attr("disabled", true);
	}
};

/**
 * 意见可写
 */
rh.cm.mind.prototype.setMindEnabled = function() {
	var _self = this;
	_self.mindText.attr("readonly", false);
	_self.mindText.removeClass("ui-textarea-disabled");
	_self.saveMind.attr("disabled", false);
	_self.mindTable.find(".deleteMind").attr("disabled", false);
};