/** 手机卡片页面form组件 */
GLOBAL.namespace("mb.ui");
mb.ui.card = function(options) {
   var defaults = {
		"id":options.pId + "-card",
		"act":"",
		"sId":"",
		"pCon":null,
		"pId":"",
		"parHandler":null,
		"readOnly":false,
		"data":null
   };
   this.opts = jQuery.extend(defaults,options);
   this._id = this.opts.id;
   this._pCon = this.opts.pCon;
   this._pkCode = options[UIConst.PK_KEY] || "";
   this.servId = this.opts.sId; 
   this._data = this.opts.data;//服务定义信息
   this._items = this._data.ITEMS; //字段定义信息
   this.servSrcId = this.opts.data.SERV_SRC_ID;	// 服务src
   this._readOnly = this.opts.readOnly || false;//form只读
   this.redTitle = this.opts.data.SERV_RED_HEAD;	// 红头标题
   if (this.redTitle.length > 0) {
       var redHeadObj = jQuery.parseJSON(this.redTitle);
       this.redTitle = redHeadObj.mbTitle;
   }
   
   this.dicts = this.opts.data.DICTS;
   this.origData = null;
   
   this.lTitle = UIConst.ITEM_MOBILE_LTITLE; 					/* 移动列表标题 */
   this.lItem = UIConst.ITEM_MOBILE_LITEM;    					/* 移动列表项 */
   this.cItem = UIConst.ITEM_MOBILE_CITEM;					    /* 移动卡片项 */
   this.cHidden = UIConst.ITEM_MOBILE_CHIDDEN;    				/* 移动卡隐藏项 */
   this.lTime = UIConst.ITEM_MOBILE_LTIME;					    /* 列表时间项 */
   
   this._uItems = {};
};


/*
 * 显示卡片页面，主方法
 */
mb.ui.card.prototype.render = function() {
   this._bldLayout();
};
mb.ui.card.prototype.afterRender = function() {
   this._afterLoad();
};
mb.ui.card.prototype.fillData = function(data) {
    this.origData = data;
   jQuery.each(this._uItems,function(i,n) {
	   var value = data[i];
	   if (n.setValue) {
		   if (data[i + "__NAME"]) {
			   n.setValue(value,data[i + "__NAME"]);
		   } else if (n.type == UIConst.FITEM_ELEMENT_ATTACH) {
			   n.setValue(data);
		   } else {
			   n.setValue(value);
		   }
	   }
   });
};

mb.ui.card.prototype._bldLayout = function() {
   this.mainContainer = jQuery("<div></div>").addClass("mbCard-form");
   this._bldForm();
   this.mainContainer.appendTo(this._pCon);
};
mb.ui.card.prototype._bindHrClick = function(hrObj) {
  var _self = this;
  if (hrObj.hasClass("mbCard-hr-closeFlag")) {
	  hrObj.next().fadeIn("slow");
	  hrObj.removeClass("mbCard-hr-closeFlag");
	  hrObj.find(".mbCard-hr-close").html(UIConst.FONT_STROKE_close);
  } else {
	  hrObj.next().fadeOut("slow");
	  hrObj.addClass("mbCard-hr-closeFlag");
	  hrObj.find(".mbCard-hr-close").html(UIConst.FONT_STROKE_expand);
  }
  
  
};
mb.ui.card.prototype._bldForm = function() {
    var _self = this;
    //主标题显示
    if (this.redTitle && this.redTitle.length > 0) {
    		jQuery("<div class='mbCard-form-redTitle'>" + this.redTitle + "</div>").appendTo(_self.mainContainer);
    }
    //form体展示
    var closeHrStr = "";//"<span class='mbCard-hr-close fontomasRegular'>" + UIConst.FONT_STROKE_close + "</span>";
    this.set = jQuery("<div></div>").addClass("mbCard-form-set").appendTo(_self.mainContainer);
    this.table = jQuery("<table></table>").addClass("mbCard-form-table mb-shadow-3 mb-radius-9").appendTo(this.set);
    this.hr = jQuery("<div></div>").html("<span class='mbCard-form-hr-base'>基本信息</span>").addClass("mbCard-form-hr");
    this.set.prepend(this.hr);
//	_self.hr.bind("click",function() {
//		_self._bindHrClick(jQuery(this));
//	});
    var count = 0;
    jQuery.each(this._items,function(i,n) {
    	var type = n.ITEM_INPUT_TYPE;
    	var itemName = n.ITEM_NAME;
    	var itemCode = n.ITEM_CODE;
    	var mbType = n.ITEM_MOBILE_TYPE;
    	var isHidden = n.ITEM_HIDDEN;
    	if (mbType && mbType.length > 0 && mbType < _self.cHidden) {//卡片显示：包括卡片项和列表的展示项
    		if ((count == 0) && (type == UIConst.FITEM_ELEMENT_HR)) {//第一个分组框
    			_self.hr.remove();
    			_self.hr = jQuery("<div></div>").html(itemName).addClass("mbCard-form-hr");
    			_self.set.prepend(_self.hr);
//    			_self.hr.bind("click",function() {
//    				_self._bindHrClick(jQuery(this));
//    			});
    			count++;
    			return true;    		
    		}
    		if ((count > 0) && (type == UIConst.FITEM_ELEMENT_HR)) {//分组框
    			var group = new mb.ui.group({"id":itemCode,"name":itemName,"type":"table","pCon":_self.mainContainer});
    			group.render();
    			_self.set = group.getObj();
    			_self.table = group.getSubObj();
    			count++;
    			return true;
    		}
    		if (type == UIConst.FITEM_ELEMENT_MIND) {//意见分组框
    			var group = new mb.ui.group({"id":itemCode,"name":itemName,"type":"div","pCon":_self.mainContainer});
    			group.render();
    			_self.set = group.getObj();
    			_self.table = group.getSubObj();
    			return true;
    		}
    		var rtnTr = _self._bldTr(n);
    		if (rtnTr) {
    			if (isHidden == 1) {//隐藏字段自动隐藏
    				rtnTr.hide();
    			}
    			rtnTr.appendTo(_self.table);
    		}
    		count++;
    	}
    });
};
//获取分组框方法，mind.js里会用到，暂时无用
mb.ui.card.prototype.getGroup = function(itemCode, inputType) {
	if (!inputType) {
		return jQuery("#" + itemCode).last();
	} else {
	}
	return null;
};
mb.ui.card.prototype._bldTr = function(item) {
	var _self = this;
    var tr = jQuery("<tr></tr>").addClass("mbCard-form-leftTr");
    var leftTd = jQuery("<td></td>").addClass("mbCard-form-leftTd").appendTo(tr);
    var rightTd = jQuery("<td></td>").addClass("mbCard-form-rightTd").appendTo(tr);
	// 输入框类型
	var type = item.ITEM_INPUT_TYPE;
	// 输入模式
	var inputMode = item.ITEM_INPUT_MODE;
	// 必填
	var notNull = item.ITEM_NOTNULL;
	var itemCode = item.ITEM_CODE;
	var itemName = item.ITEM_NAME;
	//构造lable
	_self._label({"id":"","item":item}).appendTo(leftTd);
	//构造输入框
	var ui;
	switch (type) {
	case UIConst.FITEM_ELEMENT_INPUT ://输入框
		if (inputMode == UIConst.FITEM_INPUT_AUTO) {//输入框
			var opts = {
					"id":_self._id + "-" + itemCode,
					"item":item
				}
				ui = new mb.ui.input(opts);
				_self._uItems[itemCode] = ui;
				ui.obj.appendTo(rightTd);
		} else if (inputMode == UIConst.FITEM_INPUT_DICT) {//字典
			var opts = {
					"id":_self._id + "-" + itemCode,
					"item":item,
					"data":_self.dicts[item.DICT_ID],
					"dictId":item.DICT_ID
				}
			ui = new mb.ui.dict(opts);
			_self._uItems[itemCode] = ui;
			ui.obj.appendTo(rightTd);
		} else if (inputMode == UIConst.FITEM_INPUT_DATE) {//日期选择
			var opts = {
					"id":_self._id + "-" + itemCode,
					"item":item
				}
			ui = new mb.ui.DateInput(opts);
			_self._uItems[itemCode] = ui;
			ui.obj.appendTo(rightTd);
		} else if(inputMode == UIConst.FITEM_INPUT_QUERY){//查询选择
			var opts = {
				"id" : _self._id + "-" + itemCode,
				"name" : itemCode,
				"config" : item.ITEM_INPUT_CONFIG,
				"formHandler" : _self
			};
			ui = new mb.ui.choose(opts);
			_self._uItems[itemCode] = ui;
			ui.obj.appendTo(rightTd);
		}  break;
	case UIConst.FITEM_ELEMENT_RADIO ://单选
		var opts = {
			"id":_self._id + "-" + itemCode,
			"item":item,
			"data":_self.dicts[item.DICT_ID]
		}
		ui = new mb.ui.radioBoxGroup(opts);
		_self._uItems[itemCode] = ui;
		ui.obj.appendTo(rightTd);
		break;
	case UIConst.FITEM_ELEMENT_CHECKBOX ://多选
		var opts = {
			"id":_self._id + "-" + itemCode,
			"item":item,
			"data":_self.dicts[item.DICT_ID]
		}
		ui = new mb.ui.checkBoxGroup(opts);
		_self._uItems[itemCode] = ui;
		ui.obj.appendTo(rightTd);
		break;
	case UIConst.FITEM_ELEMENT_SELECT ://下拉框
		var opts = {
			"id":_self._id + "-" + itemCode,
			"item":item,
			"data":_self.dicts[item.DICT_ID]
		}
		ui = new mb.ui.select(opts);
		_self._uItems[itemCode] = ui;
		ui.obj.appendTo(rightTd);
		break;
	case UIConst.FITEM_ELEMENT_TEXTAREA ://大文本
		var opts = {
			"id":_self._id + "-" + itemCode,
			"item":item
		}
		ui = new mb.ui.textArea(opts);
		_self._uItems[itemCode] = ui;
		ui.obj.appendTo(rightTd);	
		break;
	case UIConst.FITEM_ELEMENT_FILE ://文件
		var opts = {
			"id":_self._id + "-" + itemCode,
			"item":item
		}
		ui = new mb.ui.file(opts);
		_self._uItems[itemCode] = ui;
		ui.obj.appendTo(rightTd);	
		break;
	case UIConst.FITEM_ELEMENT_ATTACH ://上传文件
		var opts = {
			"id":_self._id + "-" + itemCode,
			"item":item,
			"servId":_self.servId,
			"servSrcId":_self.servSrcId
		}
		ui = new mb.ui.attach(opts);
		ui.type = UIConst.FITEM_ELEMENT_ATTACH;
		_self._uItems[itemCode] = ui;
		ui.obj.appendTo(rightTd);
		break;
	case UIConst.FITEM_ELEMENT_IMAGE ://图片
		var opts = {
			"id":_self._id + "-" + itemCode,
			"item":item
		}
		ui = new mb.ui.img(opts);
		_self._uItems[itemCode] = ui;
		ui.obj.appendTo(rightTd);
		break;
	case UIConst.FITEM_ELEMENT_PSW ://密码框
		var opts = {
			"id":_self._id + "-" + itemCode,
			"item":item
		}
		ui = new mb.ui.pwd(opts);
		_self._uItems[itemCode] = ui;
		ui.obj.appendTo(rightTd);	
		break;
	case UIConst.FITEM_ELEMENT_STATICTEXT://静态显示文本区 
		var opts = {
			"id":_self._id + "-" + itemCode,
			"item":item
		}
		ui = new mb.ui.staticText(opts);
		_self._uItems[itemCode] = ui;
		ui.obj.appendTo(rightTd);	
		break;
	default :
    }
	//必填项的支持
	if (notNull == UIConst.STR_YES) {
		jQuery("<span>*</span>").addClass("mbCard-form-notNull mb-icon-notNull").appendTo(leftTd);
	}
	return tr;
};
mb.ui.card.prototype._label = function(options) {
    var defaults = {
			"id":"",
			"item":null			
	};
    var opts = jQuery.extend(defaults,options);
    var itemName = opts.item.ITEM_NAME || "";
    itemName = itemName.replace(/\&nbsp;/g, "").replace(/\&nbsp/g, "");
	var label = jQuery("<label></label>").addClass("mbCard-form-label").text(itemName); 
	return label;
};

mb.ui.card.prototype._afterLoad = function() {
	//只读控制
	if (this._readOnly === true || this._readOnly === "true") {
		var len = this._uItems.length;
		jQuery.each(this._uItems, function(i,item) {
			item.disabled();
		});
	}
	//绑定事件
    this._clickDo();
};
mb.ui.card.prototype._clickDo = function() {
   this.mainContainer.bind("click",function(event) {
	   var tar = event.target;
	   if (jQuery(tar).hasClass("mb-select-a")) {
		   
	   } else {
		   jQuery(".mb-select-active").removeClass("mb-select-active");
		   
	   }
   });
};
mb.ui.card.prototype.getModifyData = function() {
	var _self = this;
	var modiData = {};
	if (_self.origData) {//有初始数据
		var origData = _self.origData;
		jQuery.each(_self._uItems,function(i,n) {
			var origValue = origData[i];
			if (n.getValue() == origValue) {
				
			} else {
				modiData[i] = n.getValue();
			}
		});
		
	} else {
		jQuery.each(this._uItems,function(i,n) {
			modiData[i] = n.getVlaue();
		});		
	}
    return modiData;
};
mb.ui.card.prototype.getItem = function(itemCode) {
	var _self = this;
    var ui = _self._uItems[itemCode];
    return ui;
};
mb.ui.card.prototype.itemValue = function(itemCode) {
	var _self = this;
    var ui = _self.getItem(itemCode);  
    if (ui) {
    	return ui.getValue();
    } else {
    	return "";
    }
};
//==================分组框======================
/*
 * Demo:
 * var group = new mb.ui.group({"id":"test","name":"test","pCon":_viewer.form.mainContainer});
 * group.render();
 * var test = jQuery("<div>test11</div>");
 * group.append(test);
 */
mb.ui.group = function(options) {
	var _self = this;
    var defaults = {
			"id":"mb-group",
			"name":"分组框", //显示的标题
			"type":"div",//talbe:表示内次为talbe构造
			"pCon":null
	};
    var opts = jQuery.extend(defaults,options);
    this.pCon = opts.pCon;
    var type = opts.type;
    var item = opts.item;
    var itemCode = opts.id;
    var itemName = opts.name;
    var set = jQuery("<div id='" + itemCode + "'></div>").addClass("mbCard-form-set");
    var table = jQuery("<table></table>");
    if (type == "div") {
    	talbe = jQuery("<div></div>");
    }
    table.addClass("mbCard-form-table mb-shadow-3 mb-radius-9").appendTo(set);
    var hr = jQuery("<div></div>").html(itemName).addClass("mbCard-form-hr");
    set.prepend(hr);
	this.obj = set; 
};
mb.ui.group.prototype.render = function() {
	this.obj.appendTo(this.pCon);
}
mb.ui.group.prototype.getObj = function() {
	return this.obj;
}
mb.ui.group.prototype.getSubObj = function() {
	return this.obj.find(".mbCard-form-table");
};
mb.ui.group.prototype.append = function(con) {
	this.obj.find(".mbCard-form-table").append(con);
};
//==================普通输入框======================
mb.ui.input = function(options) {
    var defaults = {
			"id":"",
			"type":"text"
	};
    var opts = jQuery.extend(defaults,options);
    var item = opts.item;
	//this.obj = jQuery("<input type='" + opts.type + "' value=''></input>").attr("id",opts.id).addClass("mbCard-form-input"); 
	//this.obj = jQuery("<textarea style='line-height:44px;overflow:hidden;'></textarea>").attr("id",opts.id).addClass("mbCard-form-input"); 
    this.obj = jQuery("<span style='word-wrap:normal;word-break:break-all;' contenteditable='true'></span>").attr("id",opts.id).addClass("mbCard-form-input");
};
mb.ui.input.prototype.getLen = function (str){
	return str.replace(/[^\x00-\xff]/gi,'aa').length;
}
mb.ui.input.prototype.setValue = function(value) {
	this.obj.text(value);
	/*
	var widthStr = this.obj.css("width");
	var width = Format.substr(0,widthStr.length-2,widthStr);
	width = width - 2; //textarea的宽度
	var count = 1;//默认行数
	var characters = this.getLen(value);//转换后的字符个数
	var words = 18*characters/2; //文字的总像素值
	if(width > 0){
		count = Math.ceil(words/width);
	}
	var heiAll = count*30;
	this.obj.css("height",heiAll+"px");
	*/
	this.obj.css("line-height","30px");
};
mb.ui.input.prototype.getValue = function() {
	return this.obj.text();
};
mb.ui.input.prototype.disabled = function() {
	return this.obj.attr("readonly","true").addClass("mbCard-item-disabled");
};
mb.ui.input.prototype.enabled = function() {
	return this.obj.attr("readonly","").removeClass("mbCard-item-disabled");
};
//==================大文本框======================
mb.ui.textArea = function(options) {
    var defaults = {
			"id":""
	};
    var opts = jQuery.extend(defaults,options);
    var item = opts.item;
	this.obj = jQuery("<textarea></textarea>").attr("id",opts.id).addClass("mbCard-form-textArea"); //mb-box-shadow-inset mb-radius-9

};
mb.ui.textArea.prototype.setValue = function(value) {
	this.obj.val(value);
};
mb.ui.textArea.prototype.getValue = function() {
	return this.obj.val();
};
mb.ui.textArea.prototype.disabled = function() {
	return this.obj.attr("readonly","true").addClass("mbCard-item-disabled");
};
mb.ui.textArea.prototype.enabled = function() {
	return this.obj.attr("readonly","").removeClass("mbCard-item-disabled");
};
//==================日期输入框======================
mb.ui.DateInput = function(options) {
    var defaults = {
			"id":"",
			"type":"date"
	};
    var opts = jQuery.extend(defaults,options);
    var type = opts.type;
    var item = opts.item;
    if (type == "DATETIME") {
    	type = "datetime-local";
    } else if (type == "MONTH") {
    	type = "datetime-local";
    } else if (type == "DATEHM") {
    	type = "time";
    }
	this.obj = jQuery("<input type='" + type + "' value='' height='20px'></input>").attr("id",opts.id).addClass("mbCard-form-input"); // mb-box-shadow-inset mb-radius-9
	this.obj.bind("click",function() {
		
	});

};
mb.ui.DateInput.prototype.setValue = function(value) {
	this.obj.val(value);
};
mb.ui.DateInput.prototype.getValue = function() {
	return this.obj.val();
};
mb.ui.DateInput.prototype.disabled = function() {
	return this.obj.attr("readonly","true").addClass("mbCard-item-disabled");
};
mb.ui.DateInput.prototype.enabled = function() {
	return this.obj.attr("readonly","").removeClass("mbCard-item-disabled");
};
//==================单选输入框======================
mb.ui.radioBoxGroup = function(options) {
	var _self = this;
    var defaults = {
			"id":"",
			"data":null//字典数据
	};
    var opts = jQuery.extend(defaults,options);
    var item = opts.item;
    var data = opts.data;
    this.id = opts.id;
    
    var len = data.length - 1;
    var group = jQuery("<div></div>").addClass("mb-radioGroup");

    jQuery.each(data,function(i,n) {
    	var id = n.ID;
    	var unitId = _self.id + "-" + id;
    	var labelId = unitId + "-label";
    	
    	var radioDiv = jQuery("<div></div>").addClass("mb-radio").appendTo(group);
    	var radioInput = jQuery("<input type='radio'/>").attr({"value":id,"name":unitId,"id":unitId}).addClass("mb-radio-input").appendTo(radioDiv);
    	var radioLabel = jQuery("<label type='radio'></label>").attr({"for":unitId,"id":labelId}).addClass("mb-radio-label").appendTo(radioDiv);
    	if (i == 0) {
    		radioLabel.addClass("mb-radius-left6");
    	} else if (i == len) {
    		radioLabel.addClass("mb-radius-right6");
    	}
    	var radioBtnInner = jQuery("<span></span>").addClass("mb-btn-inner").appendTo(radioLabel);
    	var radioBtnText = jQuery("<span></span>").addClass("mb-btn-text").text(n.NAME).appendTo(radioBtnInner);

    	radioLabel.bind("click", function(event) {
    		_self.setValue(id);
    	});
    });
	this.obj = group; 
};
mb.ui.radioBoxGroup.prototype.setValue = function(value) {
	var unitId = this.id + "-" + value;
	var labelId = unitId + "-label";
	this.obj.find(".mb-radio-labelActive").removeClass("mb-radio-labelActive");
	this.obj.find("#" + labelId).addClass("mb-radio-labelActive");
	this.obj.find(".mb-radio-input").removeAttr("CHECKED");
	this.obj.find("#" + unitId).attr("CHECKED","checked");
};
mb.ui.radioBoxGroup.prototype.getValue = function() {
	var res = this.obj.find(".mb-radio-input[CHECKED=checked]").attr("value");
	return res || '';
};
mb.ui.radioBoxGroup.prototype.disabled = function() {
	this.obj.addClass("mbCard-item-disabled").find(".mb-radio-label").unbind("click");
};
mb.ui.radioBoxGroup.prototype.enabled = function() {
	this.obj.removeClass("mbCard-item-disabled");
};
//==================多选输入框======================
mb.ui.checkBoxGroup = function(options) {
	var _self = this;
    var defaults = {
			"id":"",
			"data":null//字典数据
	};
    var opts = jQuery.extend(defaults,options);
    var item = opts.item;
    var data = opts.data;
    this.id = opts.id;
    
    var len = data.length - 1;
    var group = jQuery("<div></div>").addClass("mb-radioGroup");
//    group.bind("click",function() {
//    	_self.getValue();
//    });
    jQuery.each(data,function(i,n) {
    	var id = n.ID;
    	var unitId = _self.id + "-" + id;
    	var labelId = unitId + "-label";
    	
    	var radioDiv = jQuery("<div></div>").addClass("mb-radio").appendTo(group);
    	var radioInput = jQuery("<input type='radio'/>").attr({"value":id,"name":unitId,"id":unitId}).addClass("mb-radio-input").appendTo(radioDiv);
    	var radioLabel = jQuery("<label type='radio'></label>").attr({"for":unitId,"id":labelId}).addClass("mb-radio-label").appendTo(radioDiv);
    	if (i == 0) {
    		radioLabel.addClass("mb-radius-left6");
    	} else if (i == len) {
    		radioLabel.addClass("mb-radius-right6");
    	}
    	var radioBtnInner = jQuery("<span></span>").addClass("mb-btn-inner").appendTo(radioLabel);
    	var radioBtnText = jQuery("<span></span>").addClass("mb-btn-text").text(n.NAME).appendTo(radioBtnInner);

    	radioLabel.bind("click", function(event) {
    		if (jQuery(this).hasClass("mb-radio-labelActive")) {
    			_self.dsetValue(id);
    		} else {
    			_self.setValue(id);
    		}
    		
    	});
    });
	this.obj = group;
};
mb.ui.checkBoxGroup.prototype.setValue = function(value) {
	var unitId = this.id + "-" + value;
	var labelId = unitId + "-label";
	this.obj.find("#" + labelId).addClass("mb-radio-labelActive");
	this.obj.find("#" + unitId).attr("CHECKED","checked");
};
mb.ui.checkBoxGroup.prototype.dsetValue = function(value) {
	var unitId = this.id + "-" + value;
	var labelId = unitId + "-label";
	this.obj.find("#" + labelId).removeClass("mb-radio-labelActive");
	this.obj.find("#" + unitId).removeAttr("CHECKED");
};
mb.ui.checkBoxGroup.prototype.getValue = function() {
	var res = this.obj.find(".mb-radio-input[CHECKED=checked]");
	var resArray = [];
	jQuery.each(res,function(i,n) {
		
		resArray.push(jQuery(n).attr("value"));
	});
	return resArray.join(",");
};
mb.ui.checkBoxGroup.prototype.disabled = function() {
	this.obj.addClass("mbCard-item-disabled").find(".mb-radio-label").unbind("click");
};
mb.ui.checkBoxGroup.prototype.enabled = function() {
	this.obj.removeClass("mbCard-item-disabled");
};
//==================下拉选择框======================
mb.ui.select = function(options) {
	var _self = this;
    var defaults = {
			"id":"",
			"data":null//字典数据
	};
    var opts = jQuery.extend(defaults,options);
    var item = opts.item;
    this._data = opts.data;
    this.id = opts.id;
    
    var name = item.ITEM_NAME;
    var group = jQuery("<div></div>").addClass("mb-select");
    this.a = jQuery("<a></a>").addClass("mb-select-a").appendTo(group);
    var inner = jQuery("<span></span>").addClass("mb-select-inner").appendTo(this.a);
    this.input = jQuery("<input type='hidden'></input>").addClass("mb-select-input").appendTo(inner);
    this.text = jQuery("<span></span>").addClass("mb-select-text").appendTo(inner);
    var icon = jQuery("<span></span>").addClass("mb-select-icon mb-down-nav mb-radius-18").appendTo(inner);
    group.bind("click",function(event) {
    	jQuery(".mb-select-active").removeClass("mb-select-active");
    	_self.a.addClass("mb-select-active");
		var opts = {
				"id":_self.id,
				"data":_self._data,
				"title":name,
				"parHandler":_self
			}
		var ui = new mb.ui.dialog(opts);
		ui.render();
    });

	this.obj = group;
};
mb.ui.select.prototype.setValue = function(value,text) {
	var _self = this;
	var unitId = this.id + "-" + value;
	var labelId = unitId + "-label";
	var i = 0;
	var len = this._data.length;
	if (text) {
		_self.input.val(value);
		_self.text.text(text);
	} else {
		for (i;i < this._data.length;i++) {
			var obj = _self._data[i];
			if (obj.ID == value) {
				_self.input.val(value);
				_self.text.text(obj.NAME);
				break;
			}
		}
	}
};
mb.ui.select.prototype.getValue = function() {
	var _self = this;
    return _self.input.val();
};
mb.ui.select.prototype.getText = function() {
	var _self = this;
	return _self.text.val();
};
mb.ui.select.prototype.setActive = function() {
	var _self = this;
};
mb.ui.select.prototype.disabled = function() {
	this.obj.addClass("mbCard-item-disabled").unbind("click");
};
mb.ui.select.prototype.enabled = function() {
	this.obj.removeClass("mbCard-item-disabled");
};
//==================文件查看======================
mb.ui.file = function(options) {
	var _self = this;
    var defaults = {
			"id":"",
			"data":null//字典数据
	};
    var opts = jQuery.extend(defaults,options);
    var item = opts.item;
    this._data = opts.data;
    this.id = opts.id;
    
    var name = item.ITEM_NAME;
    var group = jQuery("<div></div>").addClass("mb-file");
    var icon = jQuery("<span></span>").addClass("mb-file-icon").appendTo(group);
    this.a = jQuery("<a href='#' target='_blank'></a>").addClass("mb-file-a").appendTo(group);
	this.obj = group;
};
mb.ui.file.prototype.setValue = function(value) {
	var _self = this;
	if (value) {
		var array = value.split(";");
		for (i = 0; i< array.length;i++) {
			if (array[i].length > 0) {
				var fileValue = array[i].split(",");
				var href = "/file/" + fileValue[0];
				_self.a.attr("href",href);
				_self.a.text(fileValue[1]);
			}
		}
	}
};
mb.ui.file.prototype.getValue = function() {
	var _self = this;
    return _self.a.text();
};
mb.ui.file.prototype.disabled = function() {
};
mb.ui.file.prototype.enabled = function() {
};
//==================自定义文件查看======================
mb.ui.attach = function(options) {
	var _self = this;
    var defaults = {
			"id":"",
			"data":null,//字典数据
			"servId":""
	};
    this.opts = jQuery.extend(defaults,options);
    var item = this.opts.item;
    this._data = this.opts.data;
    this.id = this.opts.id;
    this.itemCode = item.ITEM_CODE;
    this.servId = this.opts.servId;
    this.servSrcId = this.opts.servSrcId;
    
    var name = item.ITEM_NAME;
    var group = jQuery("<div></div>").addClass("mb-file");
    var icon = jQuery("<span></span>").addClass("mb-file-icon").appendTo(group);
    //this.a = jQuery("<a href='#' target='_blank'></a>").addClass("mb-file-a").appendTo(group);
	this.obj = group;
};
mb.ui.attach.prototype.setValue = function(byIdData) {
	var _self = this;
	// 载入附件
	var servDataId = byIdData._PK_;
	var servSrcId = this.servSrcId;
	var fileData = FireFly.getCardFile(servSrcId, servDataId, this.itemCode);
	for (i = 0; i< fileData.length;i++) {
		var item = fileData[i];
		var href = "/file/" + item.FILE_ID;
		var aItem = jQuery("<div><span class='mb-file-sort'>" + (i + 1) + "、</span><a href='" + href + "' class='mb-file-a'>" + item.FILE_NAME + "</a></div>");
		aItem.appendTo(this.obj);
	}
};
mb.ui.attach.prototype.getValue = function() {
	var _self = this;
    return "";
};
mb.ui.attach.prototype.disabled = function() {
};
mb.ui.attach.prototype.enabled = function() {
};
//==================图片显示======================
mb.ui.img = function(options) {
	var _self = this;
    var defaults = {
			"id":"",
			"data":null//字典数据
	};
    var opts = jQuery.extend(defaults,options);
    var item = opts.item;
    this._data = opts.data;
    this.id = opts.id;
    
    var name = item.ITEM_NAME;
    var group = jQuery("<div></div>").addClass("mb-img-div");
    this.img = jQuery("<img></img>").addClass("mb-img").appendTo(group);
    this.img.attr({width:"80px",height:"80px"});
	this.obj = group;
};
mb.ui.img.prototype.setValue = function(value) {
	var array = value.split(",");
	var src = "/file/" + array[0];
	this.img.attr("src",src);
};
mb.ui.img.prototype.getValue = function() {
	var _self = this;
    return this.img.attr("src");
};
mb.ui.img.prototype.disabled = function() {
	this.obj.addClass("mbCard-item-disabled");
};
mb.ui.img.prototype.enabled = function() {
	this.obj.removeClass("mbCard-item-disabled");
};
//==================密码框======================
mb.ui.pwd = function(options) {
	var _self = this;
    var defaults = {
			"id":"",
			"data":null//字典数据
	};
    var opts = jQuery.extend(defaults,options);
    var item = opts.item;
    this._data = opts.data;
    this.id = opts.id;
    
    var name = item.ITEM_NAME;
	this.obj = jQuery("<input type='password' value=''></input>").attr("id",opts.id).addClass("mbCard-form-input mb-box-shadow-inset mb-radius-9"); 
};
mb.ui.pwd.prototype.setValue = function(value) {
	this.obj.val(value);
};
mb.ui.pwd.prototype.getValue = function() {
	var _self = this;
    return this.obj.val();
};
mb.ui.pwd.prototype.disabled = function() {
	this.obj.attr("readonly","true").addClass("mbCard-item-disabled");
};
mb.ui.pwd.prototype.enabled = function() {
	this.obj.attr("readonly","").removeClass("mbCard-item-disabled");
};
//==================字典选择======================TODO:异步加载的情况
mb.ui.dict = function(options) {
	var _self = this;
    var defaults = {
			"id":"",
			"dictId":"",
			"data":null//字典数据
	};
    var opts = jQuery.extend(defaults,options);
    var item = opts.item;
    this._data = opts.data;
    this.id = opts.id;
    this.dictId = opts.dictId;
    var config = item.ITEM_INPUT_CONFIG;
    var name = item.ITEM_NAME;
    var group = jQuery("<div></div>").addClass("mb-select");
    this.a = jQuery("<a></a>").addClass("mb-select-a").appendTo(group);
    var inner = jQuery("<span></span>").addClass("mb-select-inner").appendTo(this.a);
    this.input = jQuery("<input type='hidden'></input>").addClass("mb-select-input").appendTo(inner);
    this.text = jQuery("<span></span>").addClass("mb-select-text").appendTo(inner);
    var icon = jQuery("<span></span>").addClass("mb-select-icon mb-down-nav mb-radius-18").appendTo(inner);
    group.bind("click",function(event) {
    	jQuery(".mb-select-active").removeClass("mb-select-active");
    	_self.a.addClass("mb-select-active");
    	
	    var temp = {"dictId":_self.dictId,"pCon":jQuery("body"),"parHandler":_self,"config":config};
	    var selectView = new mb.vi.selectList(temp);
	    selectView._bldWin(event);
	    selectView.show();
	   
//		var selectListUrl = "/sy/base/view/mbSelectListView.jsp?dictId=" + _self.dictId;
//    	alert(selectListUrl);
//		window.location.href = selectListUrl;
    });

	this.obj = group;
};
mb.ui.dict.prototype.setValue = function(value,text) {
	var _self = this;
	var unitId = this.id + "-" + value;
	var labelId = unitId + "-label";
	var i = 0;
	if (text || text == "") {
		_self.input.val(value);
		_self.text.text(text);
	} else {
		if (_self._data) {
			_self.pickNode(value,_self._data);
		}
	}
};
mb.ui.dict.prototype.pickNode = function(id,data) {
	var _self = this;
	var len = 0;
	if (data) {
		len = data.length;
	}
	for (var i = 0; i < len; i++) { // 遍历查找NAME
		if (id == data[i].ID) {
			_self.input.val(id);
			_self.text.text(data[i].NAME);
			return true; // 找到了
		} else if (data[i].CHILD) {
			var ret = _self.pickNode(id,data[i].CHILD);
			if (ret) { // 找到了则直接返回，不进行余下的循环
				return true;
			}
		}
	}
	return false; // 没有找到
};
mb.ui.dict.prototype.getValue = function() {
	var _self = this;
    return _self.input.val();
};
mb.ui.dict.prototype.getText = function() {
	var _self = this;
	return _self.text.val();
};
mb.ui.dict.prototype.setActive = function() {
	var _self = this;
};
mb.ui.dict.prototype.disabled = function() {
	this.obj.addClass("mbCard-item-disabled").unbind("click");
};
mb.ui.dict.prototype.enabled = function() {
	this.obj.removeClass("mbCard-item-disabled");
};
//==================静态文本======================
mb.ui.staticText = function(options) {
	var _self = this;
    var defaults = {
			"id":""
	};
    var opts = jQuery.extend(defaults,options);
    this.item = opts.item;
    this.id = opts.id;
    var name = this.item.ITEM_NAME;
	this.obj = jQuery("<span></span>").attr("id",opts.id); 
};
mb.ui.staticText.prototype.setValue = function(value) {
	this.obj.html(this.item.ITEM_INPUT_CONFIG);
};
mb.ui.staticText.prototype.getValue = function() {
	var _self = this;
    return this.obj.html();
};
mb.ui.staticText.prototype.disabled = function() {
};
mb.ui.staticText.prototype.enabled = function() {
};
//==================查询选择======================
mb.ui.choose = function(options) {
	var _self = this;
    var defaults = {
		"id" : "",
		"pId" : "",
		"name" : "",
		"formHandler" : null
	};
    var opts = jQuery.extend(defaults,options);
    this.id = opts.id;
    this.formHandler = opts.formHandler;
    var config = opts.config;
    var name = opts.name;
    var group = jQuery("<div></div>").addClass("mb-select");
    this.a = jQuery("<a></a>").addClass("mb-select-a").appendTo(group);
    var inner = jQuery("<span></span>").addClass("mb-select-inner").appendTo(this.a);
    this.text = jQuery("<span id='"+this.id+"'></span").addClass("mb-choose-text").appendTo(inner);
    var icon = jQuery("<span></span>").addClass("mb-select-icon mb-down-nav mb-radius-18").appendTo(inner);
    group.bind("click",function(event) {
    	jQuery(".mb-select-active").removeClass("mb-select-active");
    	_self.a.addClass("mb-select-active");
	    var temp = {"chooseId":_self.id,"pCon":jQuery("body"),"parHandler":_self,"config":config};
	    var choose = new mb.ui.querychoose(temp);
	    choose._bldWin(event);
	    choose.show();
    });

	this.obj = group;
};
mb.ui.choose.prototype.setValue = function(text) {
	var _self = this;
	_self.text.text(text);
};
/*
 * 当回写值有多个字段时，为组设置值
 */
mb.ui.choose.prototype.setGroupValue = function(target,value) {
	var _self = this;
	var sId = _self.formHandler.servId;
	var targetObj = sId +"-form-card-"+target;
	jQuery("#"+targetObj).text(value);
};
/*
 * 获取值
 */
mb.ui.choose.prototype.getValue = function() {
	var _self = this;
    return _self.text.text();
};
/*
 * 只读
 */
mb.ui.choose.prototype.disabled = function() {
	this.obj.addClass("mbCard-item-disabled").attr("readonly","true").unbind("click");
};
/*
 * 可录入
 */
mb.ui.choose.prototype.enabled = function() {
	 this.obj.attr("readonly","").removeClass("mbCard-item-disabled");
};
