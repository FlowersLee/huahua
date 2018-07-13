
/**
 * 附件(自定义)  字段， 按照类型自己显示
 */
rh.vi.attach = function (options) {
  	var defaults = {
  	    	"viewer":null,
  	    	"id":"",
  	    	"wfCard":null,
  	    	"servId":null,
  	    	"dataId":null,
  	    	"pCon":null
  	};
  	
  	this._opts = jQuery.extend(defaults,options);	
  	
  	this._servId = this._opts.servId;
  	this._dataId = this._opts.dataId;
  	this._viewer = this._opts.viewer;
  	this._wfCard = this._opts.wfCard;
  	this._pCon = this._opts.pCon;
  	this._servSrcId = this._opts.viewer._data.SERV_SRC_ID;
  	this._itemFileArray = new Array();
}

/**
 * 渲染 正文附件
 */
rh.vi.attach.prototype.render = function() {
	var _self = this;
	
	var items = _viewer._items;
	
	//外面放一个table
	//_self.attachTable = jQuery("<table></table>").appendTo(_self._pCon);
	for(var key in items){ 
		var itemDef = items[key];
		
		if (itemDef.ITEM_INPUT_TYPE == UIConst.FITEM_ELEMENT_ATTACH) { //自定义附件
			_self._bldItem(itemDef);
		}
	}
	
	_self._fillData();
	_self._setAcls();
}

/**
 * 按照 工作流设置权限
 */
rh.vi.attach.prototype._setAcls = function() {
	var _self = this;
	
	//如果锁定，文件都只有只读权限
	if (_self._wfCard && _self._wfCard.getAuthBean() && _self._wfCard.isLocked()) {
	    jQuery(_self._wfCard.getAuthBean().nodeFileControl).each(function(index, fileDef) {
	    	if (_self._itemFileArray[fileDef.ID]) {
	    		_self._itemFileArray[fileDef.ID].setAcl && _self._itemFileArray[fileDef.ID].setAcl(1);
	    	}
	    });		
	    
	    return;
	}
	
	//如果卡片只读， 也都设置成只读
	if (_viewer.opts.readOnly == "true") {
		var items = _viewer._items;	
		
		//加载数据
		for(var key in items){ 
			var itemDef = items[key];
			
			if (itemDef.ITEM_INPUT_TYPE == UIConst.FITEM_ELEMENT_ATTACH) { //自定义附件
				_self._itemFileArray[itemDef.ITEM_CODE].setAcl && _self._itemFileArray[itemDef.ITEM_CODE].setAcl(1);
			}
		}			
		
		return;
	}
	
	if (_self._wfCard) {
	    jQuery(_self._wfCard.getAuthBean().nodeFileControl).each(function(index, fileDef) {
	    	if (_self._itemFileArray[fileDef.ID]) {
	    		_self._itemFileArray[fileDef.ID].setAcl && _self._itemFileArray[fileDef.ID].setAcl(fileDef.VALUE);
	    	}
	    });			
	}

	if (_self._wfCard && _self._wfCard.getAuthBean() && _self._wfCard.getAuthBean().userDoInWf == "true") {
		if (_viewer.getByIdData("EXIST_ZHENGWEN")) {
			if (_self._itemFileArray["ZHENGWEN"]) { //正文类型的
				_self._itemFileArray["ZHENGWEN"].obj.find(".file").each(function(i, item){
					if (jQuery(item).text().indexOf("文稿") > 0) { //文稿
						jQuery(item).find(".edit_file").parent().hide(); //隐藏编辑
					}
				});
			}
		}
	}	
	
}


/**
 * 按照类型 显示列表数据
 */
rh.vi.attach.prototype._fillData = function() {
	var _self = this;
	var items = _viewer._items;	
	
	//加载数据
	for(var key in items){ 
		var itemDef = items[key];
		
		if (itemDef.ITEM_INPUT_TYPE == UIConst.FITEM_ELEMENT_ATTACH) { //自定义附件
			var fileData = FireFly.getCardFile(_self._servSrcId, _self._dataId, itemDef.ITEM_CODE);
		
			_self._itemFileArray[itemDef.ITEM_CODE].fillData(fileData);
		}
	}	
}


/**
 * 按照类型构造附件
 */
rh.vi.attach.prototype._bldItem = function(data) {
	var _self = this;
			
	
	//外面放个table
	var table = jQuery("<table class='center wp90 ml50 mt30' style='background-color: #fdfdfd;'></table>").appendTo(_self._pCon);
	var titleTr = jQuery("<tr></tr>").appendTo(table);
	var fileListTr = jQuery("<tr></tr>").appendTo(table);
	
	var titleTrTd = jQuery("<td></td>").appendTo(titleTr);
	var fileListTrTd = jQuery("<td></td>").appendTo(fileListTr);
	
	jQuery("<span class='left fb'>" + data.ITEM_NAME + ":</span>").appendTo(titleTrTd);
	var itemDiv = jQuery("<div id='" + data.ITEM_CODE + "_div'  class='inner' style='width:98%;max-width:1024px;'></div>").appendTo(fileListTrTd);			
	
	// 是否非空，1：是，2：否
	var isNotNull = (data.ITEM_NOTNULL == 1) ? true : false;
	var itemType = data.ITEM_TYPE; // 字段类型 1.表字段 2.视图字段 3.自定义字段
	var type = data.ITEM_INPUT_TYPE; // 输入框类型
	var isReadOnly = (data.ITEM_READONLY == 1) ? true : false; // 是否只读，1：是，2：否
	var inputMode = data.ITEM_INPUT_MODE; // 输入模式
	var isHidden = data.ITEM_HIDDEN == UIConst.YES;		 			
	
	/** label 左右显示的
	var label = new rh.ui.Label({
		_for : data.ITEM_CODE,
		text : data.ITEM_NAME,
		isNotNull : isNotNull,
		id : data.ITEM_CODE + "_label",
		tip : data.ITEM_TIP
	});
	
	itemDiv.append(jQuery("<span class='left fb' style='width:15%;'></span>").append(label.obj));
	*/
	
	var config = StrToJson(data.ITEM_INPUT_CONFIG);
	config.FILE_CAT = data.ITEM_CODE;
	config.SERV_ID = _self._servSrcId;
	
	var ui = new rh.ui.File({
		config : config,
		id : _self._servId + "-" + data.ITEM_CODE,
		name : _self._servId + "-" + data.ITEM_CODE,
		_default : data.ITEM_INPUT_DEFAULT,
		width : data.ITEM_CARD_WIDTH,
		isNotNull : isNotNull,
		isReadOnly : isReadOnly,
		style : data.ITEM_CARD_STYLE,
		isHidden : isHidden,
		dataId : _self._dataId,
		itemCode : data.ITEM_CODE,
		tip : data.ITEM_TIP,
		saveHist : data.ITEM_LOG_FLAG,
		itemCode : data.ITEM_CODE,
		itemName : data.ITEM_NAME
	});

	ui.afterUploadCallback = function(fileData) {
		_self._viewer.setRefreshFlag(_self._viewer.servId, true);
	};
	
	ui.afterDeleteCallback = function(fileData) {
		_self._viewer.setRefreshFlag(_self._viewer.servId, true);
		Tab.setCardTabFrameHei();
	};
	
	ui.afterFillData = function() {
		Tab.setCardTabFrameHei();
	};
	_self._itemFileArray[data.ITEM_CODE] = ui;
    var layoutObj = ui.obj;
    
    var rightSpan = jQuery("<span class='right' style='width:85%;'></span>");
    rightSpan.append(layoutObj);
    itemDiv.append(rightSpan);
    
    ui.initUpload();
}
