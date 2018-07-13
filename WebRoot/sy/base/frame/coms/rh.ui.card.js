GLOBAL.namespace("rh.ui");
/**
 * 构造一个分组
 * @param {} options
 */
rh.ui.FieldSet = function(options) {
	var _self = this;
	var opts = {
		formContainerId : "",
		legendName : "分组",
		cardObj : null // 卡片对象
	};
	jQuery.extend(opts, options);
	this.cardObj = opts.cardObj;
	// form容器
	_self._formContainerId = opts.formContainerId;
	_self._legendName = opts.legendName;
	
	var $strArr = new Array();
	$strArr.push("<div class='ui-form-default'><div class='item ui-corner-5' id='");
	$strArr.push(_self._formContainerId);
	$strArr.push("'></div></div>");
	_self._container = _self.obj = jQuery($strArr.join(""));
	// 存放内容
	_self.formContent = jQuery("<div class='formContent'></div>");
	
	// 初始化
	_self._init();
};
/**
 * 初始化
 */
rh.ui.FieldSet.prototype._init = function() {
	var _self = this;
	var fieldset = jQuery("<fieldset></fieldset>");
	var fieldsetContainer = jQuery("<div class='fieldsetContainer'></div>").append(fieldset).appendTo(_self.obj.find(".item").first());
	
	// 创建legend
	var $strArr = new Array();
	$strArr.push("<span class='legend'><span class='name'>");
	$strArr.push(_self._legendName);
	$strArr.push("</span><span class='iconC icon-card-close'></span></span>");
	var legend = jQuery($strArr.join(""));
	
	fieldset.append(legend).append(this.formContent).appendTo(fieldsetContainer);
	// 注册收起下拉动画
	var legend = _self.obj.find(".legend").first();
	legend.click(function() {
		var close = jQuery(this).find(".iconC").first();
		if (close) {
			if (close.hasClass("icon-card-close")) {
				close.removeClass("icon-card-close").addClass("icon-card-open");
				_self.formContent.fadeOut(0);
				
				if (_self.cardObj) {
					_self.cardObj._resetHeiWid();
				}
			} else {
				close.removeClass("icon-card-open").addClass("icon-card-close");
				_self.formContent.fadeIn(0);
				if (_self.cardObj) {
					_self.cardObj._resetHeiWid();
				}
			}
		}
	});
};
/**
 * 添加内容到FieldSet里
 * @param content:需要添加的内容
 */
rh.ui.FieldSet.prototype.addContent = function(content) {
	var _self = this;
	_self.formContent.append(content);
};
/**
 * 获取obj
 */
rh.ui.FieldSet.prototype.getObj = function() {
	return this.obj;
};
/**
 * 获取container
 */
rh.ui.FieldSet.prototype.getContainer = function() {
	return this._container;
};
/**
 * 获取分组框里存放内容的对象
 */
rh.ui.FieldSet.prototype.getFormContent = function() {
	return this.formContent;
};
/**
 * 构造一个suggest
 * @param options
 * url:系统调用数据的url，如：系统数据连接：SY_ORG_USER.query.do;自定义数据连接：SELF_SERV.getParams.do;字典数据连接：DICT_ID.show.do
 * data:和系统连接url配合使用，定义需要匹配的列，如：{"SUGGEST":"ITEM_NAME"}
 * obj:要绑定的输入框，为jQuery对象
 * 整体调用，例如:
 * var search = _viewer.getItem("PROJ_CAT1".obj);
 * var temp = {"url":"PJ_PROJ_INFO_TYPE.query.do","data":{"SUGGEST":"ITEM_NAME"},"obj":search.obj};
 * new rh.ui.suggest(temp);
 */
rh.ui.suggest = function(options) {
	var _self = this;
	var opts = { 
			url:"", //链接地址
			data:null,//"data":{"SUGGEST":"ITEM_NAME"}指定输入格式
			obj:null,//文本框对象的jquery封装对象
			formHandler:null,
			_extWhere:""//查询条件
		};
	_self.highlightindex = -1;//高亮条目的索引
	_self._opts = jQuery.extend(opts, options);
	_self.formHandler = this._opts.formHandler;
	this._obj = this._opts.obj;
	this._obj.parent().css("position","relative");
	this._obj.keyup(function(event) {//响应键盘事件
		_self.addDiv(_self._opts);
	    _self.addEvent(event);
	});
};
/**
 * 显示匹配列表
 */
rh.ui.suggest.prototype.addDiv = function(options) {
	var _self = this;
	var url = options.url;//链接地址
	var column = options.data.SUGGEST;//指定输入格式
	var _opt = options.obj.val();//输入数据
	var obj = this._obj;//文本框对象的jquery封装对象
	var div = jQuery("#" + "rh_suggest_"+jQuery(obj).attr('id'));
	var _extWhere = options._extWhere;
	if (_opt != "") {
		if(_opt.indexOf("，")>0){
			_opt = _opt.replace("，",",");
		}
		if(_opt.lastIndexOf(",")>0){
			_opt = _opt.substr(_opt.lastIndexOf(",")+1).trim();
		}else if(_opt.indexOf(" ")>0){
			_opt = _opt.substr(_opt.lastIndexOf(" ")+1).trim();
		}
		if (_extWhere.length > 0) {//有过滤条件
			//字段级替换
			var match = new RegExp("#.*?#","gm").exec(_extWhere);//#字段#
			while(match != null) {
				var temp = match.toString();
				var item = temp.substring(1,temp.length-1);
				var value = _self.formHandler.getItem(item).getValue();
				_extWhere = _extWhere.replace(temp,value);
				match = new RegExp("#.*?#","gm").exec(_extWhere);
			}
		}
		_extWhere = _extWhere.replace(/\^/g,"'");//替换^
		var data = {"sdata": _opt,"surl":url,"column":column,"_extWhere":_extWhere};//向后台传递的JSON串
		var res = rh_processData("SY_COMM_SUGGEST.filterSuggest.do",data,false);
		var arr = new Array();
		var str = "";
		var liStr = [];
		var len = obj.css("max-width").substr(0,3)-3;
		jQuery.each(res.datas, function(i, n) {//遍历返回的bean中的数据
			arr.push(n);
			if(n.length>len){
				if(_opt.length<len){
			        liStr.push("<div id='div_");
			        liStr.push(i);
			        liStr.push("'  class='rh-suggest-li' title='");
			        liStr.push(n);
			        liStr.push("' orcon='");
			        liStr.push(n);
			        liStr.push("'>");
			        liStr.push(_opt);
			        liStr.push("<b>");
			        liStr.push(n.substring(_opt.length,len));
			        liStr.push("...</b></div>");
			        str = liStr.join("");
				}else{
					liStr.push("<div id='div_");
			        liStr.push(i);
			        liStr.push("'  class='rh-suggest-li' title='");
			        liStr.push(n);
			        liStr.push("' orcon='");
			        liStr.push(n);
			        liStr.push("'>");
			        liStr.push("<b>");
			        liStr.push(n.substring(0,len));
			        liStr.push("...</b></div>");
			        str = liStr.join("");
				}
			}else{
				liStr.push("<div id='div_");
		        liStr.push(i);
		        liStr.push("'  class='rh-suggest-li' title='");
		        liStr.push(n);
		        liStr.push("' orcon='");
		        liStr.push(n);
		        liStr.push("'>");
		        liStr.push(_opt);
		        liStr.push("<b>");
		        liStr.push(n.substring(_opt.length));
		        liStr.push("</b></div>");
		        str = liStr.join("");
			}
		});
		var id = "rh_suggest_"+jQuery(obj).attr('id');
		if (jQuery("#"+id).length == 0 && (arr != "")) {//第一次加载数据
		    div = jQuery("<div id="+id+" class='rh-suggest'></div>").appendTo(obj.parent());//确定div的位置
			div.html(str);
		} else if (jQuery("#"+id).length == 1 && (arr != "")) {//已经加载过，而且返回数据不为空
			div.show("slow");
			div.html(str);
		} else if (arr == "") {//无数据
			div.hide();
		}
		jQuery("#"+id).find(".rh-suggest-li").bind("click", function() {//条目的点击事件
			obj.val(obj.val()+jQuery("#" + jQuery(this).attr("id")).attr("orcon").substring(_opt.length));//文本框赋值
			div.hide();//div隐藏
		});
	} else {
		div.hide("slow"); //div显示
	}
};
/**
 * 条目响应键盘事件
 */
rh.ui.suggest.prototype.addEvent = function(event){
	var _self = this;
    var myEvent = event||window.event;
    var keyCode = myEvent.keyCode;
    var sug = jQuery("#rh_suggest_"+jQuery(_self._obj).attr('id'));
    var length = sug.find(".rh-suggest-li").length-1;
	if(keyCode==38){//按向上键
		if(_self.highlightindex!=-1){
			_self.highlightindex--;
		}else{
			_self.highlightindex = length;
		}
		sug.find("#div_" + _self.highlightindex).css("background-color","#EBEBEB");
	}
	if(keyCode==40){//按向下键
		if(_self.highlightindex != length && length != 0){
			_self.highlightindex++;
		}else {
			_self.highlightindex = 0;
		}
		sug.find("#div_" + _self.highlightindex).css("background-color","#EBEBEB");
	}
	if(keyCode==13){//按回车键
		var _opt = this._obj.val();
		if(_opt.lastIndexOf(",")>0){
			_opt = _opt.substr(_opt.lastIndexOf(",")+1).trim();
		}else if(_opt.indexOf(" ")>0){
			_opt = _opt.substr(_opt.lastIndexOf(" ")+1).trim();
		}
		this._obj.val(this._obj.val()+jQuery("#div_"+_self.highlightindex).attr("orcon").substr(_opt.length));
	    sug.hide();
	}
	jQuery(".rh-suggest-li").bind("mouseover",function(){
		  if("div_" + _self.highlightindex!=jQuery(this).attr("id")){
			  sug.find("#div_" + _self.highlightindex).css("background-color","white");
		  }else{
			  sug.find("#div_" + _self.highlightindex).css("background-color","#EBEBEB"); 
		  }
    });
};
/**
 * 构造一个ITEM
 * @param options 配置参数
 */
rh.ui.Item = function(options) {
	var _self = this;
	var opts = { // 默认占一行
		itemWidth: 100,
		leftWidth: 30,
		rightWidth: 70,
		maxWidth: 1400
	};
	_self._opts = jQuery.extend(opts, options);
	var $strArr = new Array();
	$strArr.push("<div class='inner' style='width:");
	$strArr.push(opts.itemWidth);
	$strArr.push("%;max-width:");
	$strArr.push(opts.maxWidth);
	$strArr.push("px;'></div>");
	_self.obj = jQuery($strArr.join(""));
};
/**
 * 获取Obj
 */
rh.ui.Item.prototype.getObj = function() {
	return this.obj;
};
/**
 * 添加Label
 */
rh.ui.Item.prototype.addLabel = function(label) {
	var _self = this;
	if (typeof(label) == "object" && label.type == "Label") {
		_self.obj.append(jQuery("<span class='left' style='width:" + _self._opts.leftWidth + "%;'></span>").append(label.obj));
	} else {
		_self.obj.append(jQuery("<span class='left' style='width:" + _self._opts.leftWidth + "%;'></span>").append(label));
	}
};
/**
 * 添加内容
 * @param content:添加的内容
 * @deprecated
 */
rh.ui.Item.prototype.addItem = function(content) {
	this.addContent(content);
};
/**
 * 添加内容
 * @param content:添加的内容
 */
rh.ui.Item.prototype.addContent = function(content) {
	var _self = this;
	_self.obj.append(jQuery("<span class='right' style='width:" + _self._opts.rightWidth + "%;'></span>").append(content));
};
/**
 * id : 按钮ID cls : 按钮样式 text : 显示文字 title : title icon : 替换图片样式
 */
rh.ui.Button = function(options) {
	this.type = "Button";
	var opts = {
		id : "",
		pId : "",
		cls : "ui-button-default",
		text : "",
		title : "",
		icon : ""
	};
	// 把参数复制到对象opts中
	jQuery.extend(opts, options);
	// 初始化按钮

	var $strArr = new Array();
	$strArr.push("<a id='");
	$strArr.push(opts.id);
	$strArr.push("' clss='");
	$strArr.push(opts.cls);
	$strArr.push("' title='");
	$strArr.push(opts.title);
	$strArr.push("' title='");
	$strArr.push("' href='javascript:void(0);'></a>");
	this.obj = jQuery($strArr.join(""))

	var $strChildArr = new Array();
	$strChildArr.push("<span class='left'>");
	$strChildArr.push("<span class='text ");
	$strChildArr.push(opts.icon);
	$strChildArr.push("' style='padding-left:20px'>");
	$strChildArr.push(opts.text);
	$strChildArr.push("</span></span>");
	this.obj.append($strChildArr.join(""));
};
/**
 * 返回jquery对象的html，便于调试
 */
rh.ui.Button.prototype.toString = function() {
	return jQuery('<div></div>').append(this.obj).clone().remove().html();
};
/**
 * 获取按钮文本
 */
rh.ui.Button.prototype.getText = function(text) {
	return this.obj.children(0).children(0).html();
};
/**
 * 设置按钮文本
 */
rh.ui.Button.prototype.setText = function(text) {
	this.obj.children(0).children(0).html(text);
};
/**
 * 使按钮无效
 */
rh.ui.Button.prototype.disabled = function() {
	var btn = this.obj;
	btn.attr("disabled", true);
	btn.removeClass().addClass("ui-button-disabled");
	btn.unbind("click");
};
/**
 * 使按钮有效
 */
rh.ui.Button.prototype.enabled = function() {
	var btn = this.obj;
	btn.attr("disabled", false);
	btn.removeClass().addClass("ui-button-default");
};
/* ui.rh.Button定义结束 */
/**
 * id : LabelID _for : label for属性 cls : Label样式 text : Label显示文字
 */
rh.ui.Label = function(options) {
	this.type = "Label";
	var opts = {
		id : "",
		_for : "",
		cls : "ui-label-default",
		text : "",
		isNotNull : false,
		tip : null
	};
	// 把参数复制到对象opts中
	jQuery.extend(opts, options);
	
	// 初始化label
	this.obj = jQuery("<div id='" + opts.id + "' class='" + opts.cls + "'></div>");
	// 文本对象
	this._text = jQuery("<span class='name' style='cursor:pointer;'>" + opts.text + "</span>");
	// 星号
	this._star = jQuery("<span class='star'>*</span>");
	if (opts.isNotNull) {
		this._star.html("*");
	} else {
		this._star.html("");
	}
	this._container = jQuery("<div class='container'></div>").append(this._text).append(this._star);
	this.obj.append(this._container);
};
/**
 * 返回jquery对象的html，便于调试
 */
rh.ui.Label.prototype.toString = function() {
	return jQuery('<div></div>').append(this.obj).clone().remove().html();
};
/**
 * 设置label的文本框
 */
rh.ui.Label.prototype.setText = function(text) {
	this.obj.html(text);
};
/**
 * 获取label的文本框
 */
rh.ui.Label.prototype.getText = function() {
	return this.obj.html();
};
/**
 * 显示Label的星号
 */
rh.ui.Label.prototype.showStar = function(bool) {
	if (bool) {
		this._star.html("*");
	} else {
		this._star.html("");
	}
};
/**
 * 隐藏该字段
 */
rh.ui.Label.prototype.hide = function() {
	this._text.hide();
	this._star.hide();
};
/**
 * 显示该字段
 */
rh.ui.Label.prototype.show = function() {
	this.obj.parent().show();
};
/**
 * 销毁当前组件的关联事件，释放内存
 */
rh.ui.Label.prototype.destroy = function() {
	this._text = null;
};
/* ui.rh.Label定义结束 */
/*
 * 静态文本组件，仅用于静态文字的显示
 */
rh.ui.StaticText = function(options) {
	var _self = this;
	this.type = "StaticText";
	var opts = {
		id : "",
		pId : "",
		name : "",
		cls : "ui-staticText-default",
		_default : "",
		width : 0,
		hidden : false
	};
	// 把参数复制到对象opts中
	this._opts = jQuery.extend(opts, options);
	this._id = opts.id;
	this._config = this._opts.config;//配置内容
	this.obj = jQuery("<span></span>").addClass(this._opts.cls);
	// 容器
	this._container = jQuery("<div class='blank'></div>").append(this.obj); 
	
	// 卡片样式
	if (opts.style && jQuery.trim(opts.style).length > 0) {
		this._container.css(StrToJson(opts.style));
	}
	
	this.disabled();
};
/**
 * 清空内容
 */
rh.ui.StaticText.prototype.clear = function() {
	var _self = this;
	_self.setValue("");
};
/**
 * 获取前置Label
 */
rh.ui.StaticText.prototype.getLabel = function() {
	return this.obj.parent().parent().find("#" + this._id + "_label");
};
/**
 * 获取容器
 */
rh.ui.StaticText.prototype.getContainer = function() {
	return this._container.parent().parent();
};
/*
* 获取容器
*/
rh.ui.StaticText.prototype.getBlank = function() {
	return this._container;
};
/**
 * 获取校验对象
 */
rh.ui.StaticText.prototype._getValidateObj = function() {
	return this._container;
};
/**
 * 校验是否为空
 */
rh.ui.StaticText.prototype.isNull = function() {
};
/**
 * 设置Text表单默认值
 */
rh.ui.StaticText.prototype.fillDefault = function(val) {
	if (val) {
		this.obj.html(val);
	} else if (this._config) {
		this.obj.html(this._config);		
	}
};
/**
 * 设置input框的值
 */
rh.ui.StaticText.prototype.fillData = function(val) {
	if (val && (val != "config")) {
		this.obj.html(val);
	} else if (this._config) {
		this.obj.html(this._config);		
	}
};
/**
 * 重新设置文本框文本
 */
rh.ui.StaticText.prototype.setValue = function(val) {
	this.fillData(val);
};
/**
 * 获取文本框文本
 */
rh.ui.StaticText.prototype.getValue = function() {
	return this.obj.html();
};
/**
 * 使文本框无效
 */
rh.ui.StaticText.prototype.disabled = function() {
	this.obj.addClass("disabled");
	this._container.addClass("disabled");
};
/**
 * 使文本框有效
 */
rh.ui.StaticText.prototype.enabled = function() {
	this.obj.removeClass("disabled");
	this._container.removeClass("disabled");
};
/**
 * 隐藏该字段
 */
rh.ui.StaticText.prototype.hide = function() {
	this.isHidden = true;
	this.obj.parent().parent().parent().hide();
};
/**
 * 显示该字段
 */
rh.ui.StaticText.prototype.show = function() {
	this.isHidden = false;
	this.obj.parent().parent().parent().show();
};
/**
 * 设置Text为必须输入项
 */
rh.ui.StaticText.prototype.setNotNull = function(bool) {
	this._opts.isNotNull = bool;
};
/**
 * id : 文本框ID name : 文本框name cls : 文本框样式 value : 文本框默认值 psw : 是否是密码框，默认为false
 */
rh.ui.Text = function(options) {
	var _self = this;
	this.type = "Text";
	var opts = {
		id : "",
		pId : "",
		name : "",
		cls : "ui-text-default",
		_default : "",
		psw : false,
		width : 0,
		isNotNull : false,
		isReadOnly : false,
		hidden : false
	};
	// 把参数复制到对象opts中
	this._opts = jQuery.extend(opts, options);
	this._id = opts.id;
	// 是否隐藏
	this.isHidden = this._opts.isHidden;
	// 下面填充表单默认值要用到
	this._default = opts._default;
	this.isPassword = false;
	var type = "text";
	if (opts.psw) {
		type = "password";
		this.isPassword = true;
	} else if (opts.hidden) {
		type = "hidden";
	}
	
	// chagne事件响应函数数组
	this._changeFuncs = [];
	
	// 初始化文本框
	var $strArr = new Array();
	$strArr.push("<input id='");
	$strArr.push(opts.id);
	$strArr.push("' type='");
	$strArr.push(type);
	$strArr.push("' name='");
	$strArr.push(opts.name);
	$strArr.push("' class='");
	$strArr.push(opts.cls);
	$strArr.push("' />");
	this._obj = this.obj = jQuery($strArr.join(""));
	this._container = jQuery("<div class='blank'></div>").append(this._obj);
	if (opts.isReadOnly) {// 只读
		this.disabled();
	} else {	
		// 只读不需要校验
		// 如果需要正则校验
		this._obj.blur(function() {
			// 上一个校验成功才做下一个校验
			var pass = true;
			if (opts.isNotNull) {
				if (_self.isNull()) {// 非空校验
					pass = false;
					_self._container.showError("该项必须输入！");
				} else {
					_self._container.showOk();
				}
			}
			// 有值才做数字校验、长度校验和正则校验
			if (!_self.isNull()) {
				if (opts.fieldType == UIConst.DATA_TYPE_NUM && pass) {// 数字校验
					if (opts.length.indexOf(",") > 0) {// 小数
						var intLength = opts.length.substring(0, opts.length
										.indexOf(","));
						var decLength = opts.length.substring(opts.length
								.indexOf(",")
								+ 1);
						if (!_self._container.validate(
								"^(0|[-+]?[0-9]{1,"
										+ (intLength - parseInt(decLength))
										+ "}([\.][0-9]{0," + decLength
										+ "})?)$",
								_self.getValue(),
								"请输入整数长度不超过"
										+ (intLength - parseInt(decLength))
										+ "位，小数长度不超过" + decLength + "位的有效数字！")) {
							pass = false
						}
					} else {
						if (!_self._container.validate(
								"^(0|[-+]?[0-9]{0," + opts.length  + "})$", _self.getValue(),
								"请输入长度不超过" + opts.length + "位有效数字！")) {
							pass = false
						}
					}
				} else if (opts.fieldType == UIConst.DATA_TYPE_STR && pass) {// 长度校验
					var val = _self.getValue().replace(/[^\x00-\xff]/g, "aa"); // 把中文替换成两个a
					if (!_self._container.validate(
							"^([\\S\\s]{0," + opts.length + "})$", val,
							"长度不能超过" + Math.floor(opts.length/2) + "个汉字(或" + opts.length + "个字符)！")) {
						pass = false;
					}
				}

				if (opts.regular && pass) {// 正则校验
					_self._container.validate(opts.regular, _self.getValue(),
							opts.hint);
				}
			}
		});
	}
	
	// 设置宽度
	if (parseInt(opts.width) > 0) {
		this._container.width(opts.width);
	}
	
	// 卡片样式
	if (opts.style && jQuery.trim(opts.style).length > 0) {
		this._container.css(StrToJson(opts.style));
	}
};
/**
 * 获取blank
 */
rh.ui.Text.prototype.getBlank = function() {
	return this._container;
};
/**
 * 清空
 */
rh.ui.Text.prototype.clear = function() {
	this.setValue("");
};
/**
 * 获取Label
 * @return {} 返回Label对象
 */
rh.ui.Text.prototype.getLabel = function() {
	return this._container.parent().parent().find("#" + this._id + "_label");
};
/**
 * 获取容器
 */
rh.ui.Text.prototype.getContainer = function() {
	return this._container.parent().parent();
};
/**
 * 校验对象
 */
rh.ui.Text.prototype._getValidateObj = function() {
	return this._container;
};
/**
 * 获取Text输入框 jQuery对象
 */
rh.ui.Text.prototype.getObj = function() {
	return this._obj;
};
/**
 * 校验是否为空
 */
rh.ui.Text.prototype.isNull = function() {
	return jQuery.trim(this._obj.val()).length == 0;
};
/**
 * 返回jquery对象的html，便于调试
 */
rh.ui.Text.prototype.toString = function() {
	return jQuery('<div></div>').append(this._container).clone().remove().html();
};
/**
 * 设置Text表单默认值
 */
rh.ui.Text.prototype.fillDefault = function() {
	// 设置表单默认值，取得是系统的变量，如果是自己构造的测试数据这行会报错
	this.fillData(System.getVar(this._default));
	// 把默认值设置到UI
	this.setValue(System.getVar(this._default));
};
/**
 * 设置input框的值
 */
rh.ui.Text.prototype.fillData = function(val) {
	if (!this.isPassword) {
		this._obj.val(val);
	}
};
/**
 * 重新设置文本框文本
 */
rh.ui.Text.prototype.setValue = function(val) {
	var theValue = this.getValue();
	this.fillData(val);
	if (theValue != val) {
		this.onchange();
	}
};
/**
 * 获取文本框文本
 */
rh.ui.Text.prototype.getValue = function() {
	return this._obj.val();
};
/**
 * 使文本框无效
 */
rh.ui.Text.prototype.disabled = function() {
	this._obj.attr("readonly", true).addClass("disabled");
	this._container.addClass("disabled");
};
/**
 * 使文本框有效
 */
rh.ui.Text.prototype.enabled = function() {
	this._obj.attr("readonly", false).removeClass("disabled");
	this._container.removeClass("disabled");
};
/**
 * 隐藏该字段
 */
rh.ui.Text.prototype.hide = function() {
	this.isHidden = true;
	this._container.parent().parent().hide();
};
/**
 * 显示该字段
 */
rh.ui.Text.prototype.show = function() {
	this.isHidden = false;
	this._container.parent().parent().show();
};
/**
 * 设置Text为必须输入项
 */
rh.ui.Text.prototype.setNotNull = function(bool) {
	this._opts.isNotNull = bool;
};
/**
 * Text change事件
 * @param func 响应函数
 */
rh.ui.Text.prototype.change = function(func) {
	var _self = this;
	if (func) {
		this._changeFuncs.push(func);
	}
	_self._obj.change(function() {
		if (func) {
			func.call(_self);
		}
	});
};
/**
 * 触发change事件
 */
rh.ui.Text.prototype.onchange = function() {
	var len = this._changeFuncs.length;
	for (var i = 0; i < len; i++) {
		this._changeFuncs[i].call(this);
	}
};
/**
 * 销毁当前组件的关联事件，释放内存
 */
rh.ui.Text.prototype.destroy = function() {
	this._obj = null;
	this.obj = null;
};
/* ui.rh.Text定义结束 */
/**
 * id : 多选框组ID name : 多选框组name cls : 多选框组样式 width : 组容器宽度 corner ： 组容器是否圆角 data :
 * 多选框定义数据，例如：[{id:"",name:"",value:"",text:"",checked:true}]
 */
rh.ui.Checkbox = function(options) {
	var _self = this;
	this.type = "Checkbox";
	var opts = {
		id : "",
		pId : "",
		name : "",
		cls : "ui-checkbox-default",
		data : [],
		width : 0,
		_default : ""
	};
	// 把参数复制到对象opts中
	this._opts = jQuery.extend(opts, options);
	// 是否隐藏
	this.isHidden = this._opts.isHidden;
	// 下面填充表单默认值要用到
	this._default = opts._default;
	// chagne事件响应函数数组
	this._changeFuncs = [];
	var data = opts.data;
	var len = data.length;
	var $strArr = new Array();
	$strArr.push("<span id='");
	$strArr.push(opts.id);
	$strArr.push("' class='");
	$strArr.push(opts.cls);
	$strArr.push("'>");
	$strArr.push("</span>");
	this._obj = this.obj = jQuery($strArr.join(""));
	this._container = jQuery("<div class='blank'></div>").append(this._obj);
	for (var i = 0; i < len; i++) {
		var value = data[i].ID;
		var text = data[i].NAME;
		this.addOption(value, text);
	}
	if (opts.isReadOnly) {// 只读
		this.disabled();
	} else {
		this.enabled();
		if (opts.isNotNull) {
			this._obj.blur(function() {
				if (_self.isNull()) {// 非空校验
					_self._container.showError("该项必须输入！");
				} else {
					_self._container.showOk();
				}
			});
		}
	}
	
	// 设置宽度
	if (parseInt(opts.width) > 0) {
		this._container.width(opts.width);
	}
	
	// 卡片样式
	if (opts.style && jQuery.trim(opts.style).length > 0) {
		this._container.css(StrToJson(opts.style));
	}
};
/**
 * 添加一项
 * @param value 该项值
 * @param text 显示的文字
 */
rh.ui.Checkbox.prototype.addOption = function(value, text) {
	var $strArr = new Array();
	$strArr.push("<input type='checkbox' value='");
	$strArr.push(value);
	$strArr.push("' name='");
	$strArr.push(this._opts.name);
	$strArr.push("' />");
	$strArr.push("<label>");
	$strArr.push(text);
	$strArr.push("</label>");
	this.obj.append($strArr.join(""));
};
/**
 * 获取blank
 */
rh.ui.Checkbox.prototype.getBlank = function() {
	return this._container;
};
/**
 * 清空
 */
rh.ui.Checkbox.prototype.clear = function() {
	var _self = this;
	this._obj.find(":checkbox").each(function() {
		var me = jQuery(this);
		me.attr("checked", false);
	});
};
/**
 * Checkbox change事件
 * @param {} func 回调方法
 */
rh.ui.Checkbox.prototype.change = function(func) {
	var _self = this;
	if (func) {
		this._changeFuncs.push(func);
	}
	_self._obj.find(":checkbox").change(function() {
		if (func) {
			func.call(_self);
		}
	});
};
/**
 * 触发change事件
 */
rh.ui.Checkbox.prototype.onchange = function() {
	var len = this._changeFuncs.length;
	for (var i = 0; i < len; i++) {
		this._changeFuncs[i].call(this);
	}
};
/**
 * 获取Label 
 * @return {} 返回Label对象
 */
rh.ui.Checkbox.prototype.getLabel = function() {
	return this._container.parent().parent().find("#" + this.opts.id + "_label");
};
/**
 * 获取容器
 */
rh.ui.Checkbox.prototype.getContainer = function() {
	return this._container.parent().parent();
};
/**
 * 获取校验对象
 */
rh.ui.Checkbox.prototype._getValidateObj = function() {
	return this._container;
};
/**
 * 获取Checkbox jQuery对象数组
 */
rh.ui.Checkbox.prototype.getObj = function() {
	return this._obj;
};
/**
 * 校验是否为空
 */
rh.ui.Checkbox.prototype.isNull = function() {
	return this._obj.find(":checkbox[checked]").length == 0;
};
/**
 * 返回jquery对象的html，便于调试
 */
rh.ui.Checkbox.prototype.toString = function() {
	return jQuery('<div></div>').append(this._container).clone().remove().html();
};
/**
 * 设置Checkbox表单默认值
 */
rh.ui.Checkbox.prototype.fillDefault = function() {
	// 设置表单默认值，取得是系统的变量，如果是自己构造的测试数据这行会报错
	this.fillData(System.getVar(this._default));
	// 把默认值设置到UI
	this.setValue(System.getVar(this._default));
};
/**
 * 设置checkbox的值
 */
rh.ui.Checkbox.prototype.fillData = function(val) {
	val = val + "";
	if (val) {
		var valArry = val.split(",");
		var len = valArry.length;
		this._obj.find(":checkbox").each(function() {
			var me = jQuery(this);
			for (var i = 0; i < len; i++) {
				if (me.val() == valArry[i]) {
					me.attr("checked", true);
				}
			}
		});
	}
};
/**
 * 获取选中的checkbox
 */
rh.ui.Checkbox.prototype.getCheckedCheckbox = function() {
	return this._obj.find(":checkbox[checked]");
};
/**
 * 获取选中的checkbox的值
 */
rh.ui.Checkbox.prototype.getValue = function() {
	var ret = "";
	this.getCheckedCheckbox().each(function() {
		var me = jQuery(this);
		if (ret == "") {// 第一个
			ret += me.val();
		} else {
			ret += "," + me.val();
		}
	});
	return ret;
};

/**
 * 选中的checkbox
 */
rh.ui.Checkbox.prototype.setValue = function(val) {
	var theValue = this.getValue();
	this.fillData(val);
	if (theValue != val) {
		this.onchange();
	}
};
/**
 * 使单选框无效
 */
rh.ui.Checkbox.prototype.disabled = function() {
	this._obj.addClass("disabled");
	this._obj.find(":checkbox").each(function(index, checkbox) {
		jQuery(checkbox).attr("disabled", true);
	});
	// 取消label点击事件
	this._obj.find("label").unbind("click");
	this._container.addClass("disabled");
};
/**
 * 使单选框有效
 */
rh.ui.Checkbox.prototype.enabled = function() {
	this._obj.removeClass("disabled");
	this._obj.find(":checkbox").each(function() {
		jQuery(this).attr("disabled", false);
	});
	// label注册点击事件点击时选中checkbox
	this._obj.find("label").each(function(){
		var $label = jQuery(this);
		$label.click(function(){
			$label.prev(":checkbox").click();
		});
	});
	this._container.removeClass("disabled");
};
/**
 * 隐藏该字段
 */
rh.ui.Checkbox.prototype.hide = function() {
	this.isHidden = true;
	this._container.parent().parent().hide();
};
/**
 * 显示该字段
 */
rh.ui.Checkbox.prototype.show = function() {
	this.isHidden = false;
	this._container.parent().parent().show();
};
/**
 * 设置Checkbox为必须输入
 */
rh.ui.Checkbox.prototype.setNotNull = function(bool) {
	this._opts.isNotNull = bool;
};
/* ui.rh.Checkbox定义结束 */
/*
 * id : 单选框组ID name : 单选框name cls : 单选框组样式 width : 组容器宽度 corner ： 组容器是否圆角 data :
 * 单选框定义数据，例如：[{id:"",value:"",text:"",checked:true}]
 */
rh.ui.Radio = function(options) {
	var _self = this;
	this.type = "Radio";
	var opts = {
		id : "",
		pId : "",
		cls : "ui-radio-default",
		data : [],
		width : 0,
		_default : ""
	};
	// 把参数复制到对象opts中
	this._opts = jQuery.extend(opts, options);
	// 是否隐藏
	this.isHidden = this._opts.isHidden;
	// 提示信息
	this._tip = this._opts.tip;
	// 下面填充表单默认值要用到
	this._default = opts._default;
	// chagne事件响应函数数组
	this._changeFuncs = [];
	var data = opts.data;
	var len = data.length;
	var $strArr = new Array();
	$strArr.push("<div id='");
	$strArr.push(opts.id);
	$strArr.push("' class='");
	$strArr.push(opts.cls);
	$strArr.push("' >");
	$strArr.push("</div>");
	this._obj = this.obj = jQuery($strArr.join(""));
	this._container = jQuery("<div class='blank'></div>").append(this._obj);
	for (var i = 0; i < len; i++) {
		var value = data[i].ID;
		var text = data[i].NAME;
		this.addOption(value, text);
	}
	if (opts.isReadOnly) {// 只读
		this.disabled();
	} else {
		this.enabled();
		if (opts.isNotNull) {
			this._obj.blur(function() {
				if (_self.isNull()) {// 非空校验
					_self._container.showError("该项必须输入！");
				} else {
					_self._container.showOk();;
				}
			});
		}
	}

	// 卡片样式
	if (opts.style && jQuery.trim(opts.style).length > 0) {
		this._container.css(StrToJson(opts.style));
	}
	
	// 设置宽度
	if (parseInt(opts.width) > 0) {
		this._container.width(opts.width);
	}
	
	// 如果设置了后置提示信息--add by ljk
	if (this._tip && this._tip.length > 0) {
		// 卡片多列，该项只占一列时不显示提示信息
		if (opts.cols > 1 && opts.itemCols == 1) {
			this._tip = "";
		}
		jQuery("<span></span>").addClass("ui-label-after").html(this._tip).appendTo(this._container.find("#" + opts.id).first());
	}
};
/**
 * 添加一项
 * @param value 该项值
 * @param text 显示的文字
 */
rh.ui.Radio.prototype.addOption = function(value, text) {
	var $strArr = new Array();
	$strArr.push("<input type='radio' value='");
	$strArr.push(value);
	$strArr.push("' name='");
	$strArr.push(this._opts.name);
	$strArr.push("' />");
	$strArr.push("<label>");
	$strArr.push(text);
	$strArr.push("</label>");
	this.obj.append($strArr.join(""));
};
/**
 * 获取blank
 */
rh.ui.Radio.prototype.getBlank = function() {
	return this._container;
};
/**
 * 清空
 */
rh.ui.Radio.prototype.clear = function() {
	var _self = this;
	this._obj.find(":radio[checked]").each(function() {
		var me = jQuery(this);
		me.attr("checked", false);
	});
};
/**
 * Radio change事件
 * @param {} func 回调方法
 */
rh.ui.Radio.prototype.change = function(func) {
	var _self = this;
	if (func) {
		this._changeFuncs.push(func);
	}
	_self._obj.find(":radio").change(function() {
		if (func) {
			func.call(_self);
		}
	});
};
/**
 * 触发change事件
 */
rh.ui.Radio.prototype.onchange = function() {
	var len = this._changeFuncs.length;
	for (var i = 0; i < len; i++) {
		this._changeFuncs[i].call(this);
	}
};
/**
 * 获取Label
 * @return {} 返回Label对象
 */
rh.ui.Radio.prototype.getLabel = function() {
	return this._container.parent().parent().find("#" + this._opts.id + "_label");
};
/**
 * 获取容器
 */
rh.ui.Radio.prototype.getContainer = function() {
	return this._container.parent().parent();
};
/**
 * 获取校验对象
 */
rh.ui.Radio.prototype._getValidateObj = function() {
	return this._container;
};
/**
 * 获取Radio
 */
rh.ui.Radio.prototype.getObj = function() {
	return this._obj;
};
/**
 * 校验是否为空
 */
rh.ui.Radio.prototype.isNull = function() {
	return this._obj.find(":radio[checked]").length == 0;
};
/**
 * 返回jquery对象的html，便于调试
 */
rh.ui.Radio.prototype.toString = function() {
	return jQuery('<div></div>').append(this._container).clone().remove().html();
};
/**
 * 设置Radio表单默认值
 */
rh.ui.Radio.prototype.fillDefault = function() {
	// 设置表单默认值，取得是系统的变量，如果是自己构造的测试数据这行会报错
	this.fillData(System.getVar(this._default));
	// 把默认值设置到UI
	this.setValue(System.getVar(this._default));
};
/**
 * 设置radio的值
 */
rh.ui.Radio.prototype.fillData = function(val) {
	if (val) {
		this._obj.find(":radio").each(function() {
			var me = jQuery(this);
			if (me.val() == val) {
				me.attr("checked", true);
			};
		});
	}
};
/**
 * 获取选中的radio的值
 */
rh.ui.Radio.prototype.getValue = function() {
	var val = this.getCheckedRadio().val();
	return val == undefined ? "" : val;
};
/**
 * 设定选中的radio
 */
rh.ui.Radio.prototype.setValue = function(val) {
	// 重新选中某一个radio
	var theValue = this.getValue();
	this.fillData(val);
	if (val != theValue) {
		this.onchange();
	}
};
/**
 * 获取选中的radio
 */
rh.ui.Radio.prototype.getCheckedRadio = function() {
	return this._obj.find(":radio[checked]");
};
/**
 * 使单选框无效
 */
rh.ui.Radio.prototype.disabled = function() {
	this._obj.addClass("disabled");
	this._obj.find(":radio").each(function() {
		jQuery(this).attr("disabled", true);
	});
	// 取消label点击事件
	this._obj.find("label").unbind("click");
	this._container.addClass("disabled");
};
/**
 * 使单选框有效
 */
rh.ui.Radio.prototype.enabled = function() {
	this._obj.removeClass("disabled");
	this._obj.find(":radio").each(function() {
		jQuery(this).attr("disabled", false);
	});
	// 给label注册点击事件，点击时选中该radio
	this._obj.find("label").each(function(){
		var $label = jQuery(this); 
		$label.click(function(){
			$label.prev("input").click();
		});
	});
	this._container.removeClass("disabled");
};
/**
 * 隐藏该字段
 */
rh.ui.Radio.prototype.hide = function() {
	this.isHidden = true;
	this._container.parent().parent().hide();
};
/**
 * 显示该字段
 */
rh.ui.Radio.prototype.show = function() {
	this.isHidden = false;
	this._container.parent().parent().show();
};
/**
 * 设置Radio为必须输入项
 */
rh.ui.Radio.prototype.setNotNull = function(bool) {
	this._opts.isNotNull = bool;
};
/* ui.rh.Radio定义结束 */
/*
 * id : 文本框ID name : 文本框name cls : 文本框样式 width : 文本框宽度 height : 文本框高度 data :
 * 初始化数据，例如：[{value:"",text:""},{value:"",text:""}]
 */
rh.ui.Select = function(options) {
	var _self = this;
	this.type = "Select";
	var opts = {
		id : "",
		pId : "",
		name : "",
		cls : "ui-select-default",
		data : [],
		width : 0,
		_default : ""
	};
	
	this._opts = jQuery.extend(opts, options);// 把参数复制到对象opts中
	// 卡片对象，用于获取卡片上的数据
	this.cardObj = this._opts.cardObj;	
	// 是否隐藏
	this.isHidden = this._opts.isHidden;
	// 下面填充表单默认值要用到
	this._default = opts._default;
	// chagne事件响应函数数组
	this._changeFuncs = [];
	// 下拉框
	var $strArr = new Array();
	$strArr.push("<select id='");
	$strArr.push(opts.id);
	$strArr.push("' name='");
	$strArr.push(opts.name);
	$strArr.push("' class='");
	$strArr.push(opts.cls);
	$strArr.push("'></select>");
	this._obj = this.obj = jQuery($strArr.join(""));
	this._container = jQuery("<div class='blank' style='padding-left:0;'></div>").append(this._obj);
	// 调用原型方法初始化下拉框
	this.addOptions(opts.data);
	if (opts.isReadOnly) {// 只读
		this.disabled();
	} else {
		if (opts.isNotNull) {
			this._obj.blur(function() {
				if (_self.isNull()) {// 非空校验
					_self._container.showError("该项必须输入！");
				} else {
					_self._container.showOk();
				}
			});
		}
	}
	// 卡片样式
	if (opts.style && jQuery.trim(opts.style).length > 0) {
		this._container.css(StrToJson(opts.style));
	}
	
	// 设置宽度
	if (parseInt(opts.width) > 0) {
		this._container.width(opts.width);
	}
};
/**
 * 获取blank
 */
rh.ui.Select.prototype.getBlank = function() {
	return this._container;
};
/**
 * 清空
 */
rh.ui.Select.prototype.clear = function() {
	this._obj.val();
	if (this._obj.find("option").length > 0) {
		this._obj.find("option").first().attr("selected", true);
	}
};
/**
 * 获取Label
 * @return {} 返回Label对象
 */
rh.ui.Select.prototype.getLabel = function() {
	return this._container.parent().parent().find("#" + this._opts.id + "_label");
};
/**
 * 获取容器
 */
rh.ui.Select.prototype.getContainer = function() {
	return this._container.parent().parent();
};
/**
 * 获取校验对象
 */
rh.ui.Select.prototype._getValidateObj = function() {
	return this._container;
};
/**
 * 获取Select jQuery对象
 */
rh.ui.Select.prototype.getObj = function() {
	return this._obj;
};
/**
 * 校验是否为空
 */
rh.ui.Select.prototype.isNull = function() {
	return this.getText() == "";
};
/**
 * 返回jquery对象的html，便于调试
 */
rh.ui.Select.prototype.toString = function() {
	return jQuery('<div></div>').append(this._container).clone().remove().html();
};
/**
 * 设置Select表单默认值
 */
rh.ui.Select.prototype.fillDefault = function() {
	// 设置表单默认值，取得是系统的变量，如果是自己构造的测试数据这行会报错
	this.fillData(System.getVar(this._default));
	// 把默认值设置到UI
	this.setValue(System.getVar(this._default));
};

/**
 * @param val Option Value
 * @return 是否能选中指定Val的Option
 */
rh.ui.Select.prototype.select = function(val){
	var rtnVal = false;
	if (val) {
		this._obj.find("option").each(function() {
			var me = jQuery(this);
			if (me.val() == val) {
				me.attr("selected", true);
				rtnVal = true;
				return false;
			}
		});
	}
	
	return rtnVal;
}

/**
 * 设置select的值，成功设置返回true，否则返回false；
 * @param val option value
 * @param name option name
 */
rh.ui.Select.prototype.fillData = function(val,name) {
	var selected = this.select(val);
	// 如果没有找到对应的option则把Select的第一个option的Value设为该值
	if (!selected) {
		if(val && name && typeof(name) == "string"){
			this.addOptions([{"ID":val,"NAME":name}]);
			selected = this.select(val);
		}else{
			var opt = this._obj.find("option:selected");
			opt.val(val);
		}
	}
	
	return selected;
};

/**
 * 通过字典ID构造下拉列表
 * @param {} dictId
 */
rh.ui.Select.prototype.addOptionsByDict = function(dictId) {
	var data = FireFly.getDict(dictId)[0].CHILD;
	this.removeOptions();
	this.addOptions(data);
};
/**
 * 给下拉框添加option [{ID:"",NAME:""},{ID:"",NAME:""}]
 */
rh.ui.Select.prototype.addOptions = function(data) {
	if(jQuery.isEmptyObject(data)){  //保证必须有一个空的option，否则ie9下显示不正确
		this._obj.append("<option value='' selected></option>");
		return;
	}
	var len = data.length;
	if(this._obj.find("option").length == 0){
		this._obj.append("<option value='' selected></option>");
	}
	for (var i = 0; i < len; i++) {
		var value = data[i].ID;
		var text = data[i].NAME;
		this._obj.append("<option value='" + value + "'>" + text + "</option>");
	}
};

/**
 * 给下拉框 清除 数据
 */
rh.ui.Select.prototype.removeOptions = function() {
	this._obj[0].options.length = 0;
};


/**
 * 获取当前下拉框的值
 */
rh.ui.Select.prototype.getValue = function() {
	var opt = this._obj.find("option:selected");
	if (opt && opt.val() != undefined) {
		return opt.val();
	}
	return "";
};
/**
 * 重新选中option。
 * @param val option value
 * @param name option name
 * @return 成功设置返回true，否则返回false。
 */
rh.ui.Select.prototype.setValue = function(val,name) {
	var theValue = this.getValue();
	var ret = this.fillData(val,name);
	if (val != theValue) {
		this.onchange();
	}
	return ret;
};
/**
 * 获取选中的option的文本
 */
rh.ui.Select.prototype.getText = function() {
	var opt = this._obj.find("option:selected");
	if (opt) {
		return opt.text();
	}
	return "";
};
/**
 * 使下拉列表无效
 */
rh.ui.Select.prototype.disabled = function() {
	this._obj.attr("disabled", true).addClass("disabled");
	this._container.addClass("disabled");
};
/**
 * 使下拉列表有效
 */
rh.ui.Select.prototype.enabled = function() {
	this._obj.attr("disabled", false).removeClass("disabled");
	this._container.removeClass("disabled");
};
/**
 * 隐藏该字段
 */
rh.ui.Select.prototype.hide = function() {
	this.isHidden = true;
	this._container.parent().parent().hide();
};
/**
 * 显示该字段
 */
rh.ui.Select.prototype.show = function() {
	this.isHidden = false;
	this._container.parent().parent().show();
};
/**
 * 设置Select为必须输入项
 */
rh.ui.Select.prototype.setNotNull = function(bool) {
	this._opts.isNotNull = bool;
};
/**
 * 当值为values中的某一个时itemB必填
 * @param values 值数组
 * @param itemB 要控制的对象
 * @param bool 如果非必填的话是否清空值
 */
rh.ui.Select.prototype.setOtherItemNotNull = function(values, itemB, bool) {
	var itemCodeB = itemB._opts.id.substr(this.cardObj.servId.length + 1);
	var value = parseInt(this.getValue());
	var len = values.length;
	for (var i = 0; i < len; i++) {
		if (value == values[i]) {
			itemB.obj.blur(function() {// 给itemB注册失去焦点事件
				if (itemB.isNull()) {// 非空校验
					jQuery(this).parent().showError("该项必须输入！");
				} else {
					jQuery(this).parent().showOk();
				}
			});
			this.cardObj.form.setNotNull(itemCodeB, true);
			return;
		}
	}
	if (bool) {
		itemB.clear();
	}
	itemB.obj.parent().showOk();
	itemB.obj.unbind("blur");
	itemB.obj.parent().parent().find(".name").removeClass("error");
	itemB.obj.removeAttr("validate_msg").removeClass("errorbox_textarea").addClass("correctbox");
	this.cardObj.form.setNotNull(itemCodeB, false);
};
/**
 * 当值为values中的某一个时itemB隐藏否则显示
 */
rh.ui.Select.prototype.setOtherItemHide = function(values, itemB) {
	var value = parseInt(this.getValue());
	var len = values.length;
	for (var i = 0; i < len; i++) {
		if (value == values[i]) {
			itemB.hide();
			return;
		}
	}
	itemB.show();
};
/**
 * 当值为values中的某一个时itemB显示否则隐藏
 */
rh.ui.Select.prototype.setOtherItemShow = function(values, itemB) {
	var value = parseInt(this.getValue());
	var len = values.length;
	for (var i = 0; i < len; i++) {
		if (value == values[i]) {
			itemB.show();
			return;
		}
	}
	itemB.hide();
};
/**
 * 当值为values中的某一个时itemB只读
 */
rh.ui.Select.prototype.setOtherItemDisabled = function(values, itemB) {
	var value = parseInt(this.getValue());
	var len = values.length;
	for (var i = 0; i < len; i++) {
		if (value == values[i]) {
			itemB.disabled();
			return;
		}
	}
	itemB.enabled();
};
/**
 * 当值为values中的某一个时itemB只读
 */
rh.ui.Select.prototype.setOtherItemEnabled = function(values, itemB) {
	var value = parseInt(this.getValue());
	var len = values.length;
	for (var i = 0; i < len; i++) {
		if (value == values[i]) {
			itemB.enabled();
			return;
		}
	}
	itemB.disabled();
};
/**
 * Select change事件
 * @param {} func 回调方法
 */
rh.ui.Select.prototype.change = function(func) {
	var _self = this;
	if (func) {
		this._changeFuncs.push(func);
	}
	_self._obj.change(function() {
		if (func) {
			func.call(_self);
		}
	});
};
/**
 * 触发change事件
 */
rh.ui.Select.prototype.onchange = function() {
	var len = this._changeFuncs.length;
	for (var i = 0; i < len; i++) {
		this._changeFuncs[i].call(this);
	}
};
/* ui.rh.Select定义结束 */
/* rh.ui.File定义开始 */
rh.ui.File = function(options) {
	var _self = this;
	this.type = "File";
	var opts = {
		id : "",
		cls : "ui-file-default",
		width : "100%",
		config : {},
		saveHist : 2,	// 是否保存历史文件，1：是；2：否；
		itemCode : "",
		itemName : "",
		zotn : true// 默认载入zotn控件
	};
	this._opts = jQuery.extend(opts, options);// 把参数复制到对象opts中

	// 如果没有传id则生成一个随机id
	this.time = new Date().getTime();
	if (!this._opts.id || this._opts.id.length == 0) {
		this._opts.id = this.time;
	}
	
	// 配置参数
	this._config = this._opts.config;
	
	// 按钮文字
	var btnName = this._config.TEXT?this._config.TEXT:"上传文件";
	
	// 是否隐藏
	this.isHidden = this._opts.isHidden;
	// 下面填充表单默认值要用到
	this._default = opts._default;
	// 卡片对象，用于获取卡片上的数据
	this.cardObj = this._opts.cardObj;	
	// 是否只读
	this.isReadOnly = this._opts.isReadOnly;
	// 服务ID
	if (this.cardObj) {
		var servSrcId = this.cardObj.getServSrcId();
		if (servSrcId.length > 0) {
			this._servId = servSrcId;
		}
		
		// 数据ID
		if (this.cardObj._pkCode && this.cardObj._pkCode.length > 0) {
			this._dataId = this.cardObj._pkCode;
		}
	} else {
		if (this._opts.dataId && this._opts.dataId.length > 0) {
			this._dataId = this._opts.dataId;
		}
	}
	
	// 默认附件分类就是分组框的ID
	if (this._opts.itemCode && this._opts.itemCode.length > 0) {
		this._fileCat = this._opts.itemCode;
	}
	
	// 参数已设定服务ID
	if (this._config.SERV_ID && this._config.SERV_ID.length > 0) {
		this._servId = this._config.SERV_ID;
	}
	// 参数已设定分类
	if (this._config.FILE_CAT && this._config.FILE_CAT.length > 0) {
		this._fileCat = this._config.FILE_CAT;
	}
	// 参数已设定数据ID
	if (this._config.DATA_ID && this._config.DATA_ID.length > 0) {
		this._dataId = this._config.DATA_ID;
	}
	
	// 是否保存历史文件
	if (this._opts.saveHist == 1) {
		this._saveHist = true;
	}
	
	// 文件数据
	this._fileData = {};
	
	// 临时文件数据
	this._tempFileData = [];
	
	var $strArr = new Array();

	// div
	$strArr.push("<div class='" + this._opts.cls + "' id='" + this._opts.id + "'>");
	
	$strArr.push("<table class='file_uploadTable' style='border-width:0'><tr style='border-width:0' class='uploadBtntr'><td style='border-width:0'>");
    
	
	// 按钮
	$strArr.push("<span class='uploadBtn'><a class='rh-icon rhGrid-btnBar-a' id='" + this.time  + "-upload' actcode='upload'>" +
			"<span class='rh-icon-inner' style='position:relative;'><span id='uploadHolder_" + this.time + "'></span><span class='btnName'>" + btnName + "</span></span></a><span class='modifyBtn'><a class='rh-icon rhGrid-btnBar-a' actcode='upload'>" +
			"<span class='rh-icon-inner'>修改文件信息</span></a></span></span>");
	
	// 上传进度条
	$strArr.push("<fieldset class='progress ui-corner-2' id='fsUploadProgress_" + this.time + "'>");
	$strArr.push("<legend>上传进度</legend></fieldset>");
	
	$strArr.push("</td></tr><tr><td style='border-width:0'>");
	
	$strArr.push("<div class='fileContainer'></div>");
	
	// 关闭div
	$strArr.push("</td></tr></table>");
	$strArr.push("</div>");
	
	this._obj = jQuery($strArr.join(""));
		
	this._container = this.obj = jQuery("<div class='blank' style='background-image:none;'></div>").append(this._obj);
	
	// 设置宽度
	if (this._opts.width && parseInt(this._opts.width) > 0) {
		this._container.width(this._opts.width);
	}
	// 默认文件权限为47，除修改名字之外的全部权限
	this._acl = 47;
	if (this._config.VALUE) {
		this._acl = this._config.VALUE;
	}
	if (this.isReadOnly) {
		this.disabled();
	} else {
		// 权限数组
		var aclArr = this.calcAcl(this._acl);
		// 上传权限
		var uploadAcl = aclArr[3];
		if (!uploadAcl) {
			this._container.find(".uploadBtn").hide();
			this._container.find(".uploadBtntr").hide();
		}
		
		// 修改权限
		var modify = this._container.find(".modifyBtn").click(function(){
			_self.modifyFile();
		});
		var modfiyAcl = aclArr[1];
		if (!modfiyAcl) {
			modify.hide();
		}
	}
	
	// 自定义事件
	this.beforeUploadCallback = function(file) {return true;};// 上传之前
	this.afterUploadCallback = function(fileData) {};// 上传之后
	this.beforeDeleteCallback = function() {return true;};// 删除之前
	this.afterDeleteCallback = function(fileData) {};// 删除之后
	this.afterFillData = function(fileData) {};// 填充数据之后
	this.afterQueueComplete = function(fileData) {};// 这个上传队列完成之后
	
	// chagne事件响应函数数组
	this._changeFuncs = [];
	
	// 载入office编辑器
	if (this._opts.zotn) {
		Load.scriptJS("/sy/util/office/zotnClientLib_NTKO.js");
	}
	
	// 有效性校验
	if(this._opts.isNotNull){  
		var file = this;
		file._obj.blur(function() {
			file.validate();
		});
	}
};

/**
 * 有效性校验（现在只做了必填性校验）
 */
rh.ui.File.prototype.validate = function() {
	if(this._opts.isNotNull){
		if(this.isNull()){
			this._container.showError("该项必须输入！");
		}else{
			this._container.showOk();
		}
	}
}


/**
 * 获取ITEM_CODE
 */
rh.ui.File.prototype.getItemCode = function() {
	return this._opts.itemCode;
};
/**
 * 获取ITEM_NAME
 */
rh.ui.File.prototype.getItemName = function() {
	return this._opts.itemName;
};
/**
 * 获取blank
 */
rh.ui.File.prototype.getBlank = function() {
	return this._container;
};
/**
 * 刷新文件
 * @param servSrcId 引用自服务ID
 * @param dataId 数据ID
 * @param fileCat 文件分类
 */
rh.ui.File.prototype.refresh = function(servSrcId, dataId, fileCat) {
	var _servSrcId = "";
	if (this.cardObj) {
		_servSrcId = servSrcId?servSrcId:this.cardObj.form._servSrcId;
		this._dataId = this.cardObj.getOrigPK();
	}
	var _dataId = dataId?dataId:this._dataId;
	var _fileCat = fileCat?fileCat:this._fileCat;
	var fileData = FireFly.getCardFile(_servSrcId, _dataId, _fileCat);
	this.clear();
	this.fillData(fileData);
};
/**
 * 设置文件上传数据
 * @param servId 服务ID
 */
rh.ui.File.prototype.setServId = function(servId) {
	this.addPostParam("SERV_ID", servId);
};
/**
 * 设置文件上传数据
 * @param fileCat 文件分类ID
 */
rh.ui.File.prototype.setfileCat = function(fileCat) {
	this.addPostParam("FILE_CAT", fileCat);
};
/**
 * 设置文件上传数据
 * @param dataId 数据
 */
rh.ui.File.prototype.setDataId = function(dataId) {
	this.addPostParam("DATA_ID", dataId);
};
/**
 * 设置文件排序
 * @param fileSort 序号
 */
rh.ui.File.prototype.setFileSort = function () {
	var sort = 1;
	for (var id in this._fileData) {
		var fileSort = this._fileData[id]["FILE_SORT"];
		if (fileSort >= sort) {
			sort = parseInt(fileSort) + 1;
		}
	}
	this.addPostParam("FILE_SORT", sort);
};
/**
 * 设置文件ID，用于覆盖上传
 */
rh.ui.File.prototype.setFileId = function(fileId) {
	var url = FireFly.getContextPath() + "/file/" + fileId;
	this.getUpload().getSwfObj().setUploadURL(url);
	this.clearFileByFileId(fileId);
	this.getUpload().setUploadFiles(this.getUpload().getUploadFiles() - 1);
};
/**
 * 添加传递到后台的参数
 * @param name 键
 * @param value 值
 */
rh.ui.File.prototype.addPostParam = function(name, value) {
	var data = this.getUpload().getPostParams().data;
	var data = StrToJson(data);
	data[name] = value;
	this.getUpload().addPostParam("data", JsonToStr(data));
};
/**
 * 获取文件上传对象
 */
rh.ui.File.prototype.getUpload = function() {
	return this._upload;
};
/**
 * 设置文件读写权限
 * 设置文件的权限，与二进制111111进行与运算，最后转换成一个布尔类型的数组，把“下载，修改，删除，上传，编辑，查看”
 * 1可读 10可编辑 100可上传 1000可删除 10000可修改 100000可下载
 * @param acl权限数值
 */
rh.ui.File.prototype.setAcl = function(acl) {
	var aclArr = this.calcAcl(acl);
	
	// 下载权限
	var downloadAcl = aclArr[0];
	if (downloadAcl) {
		this._container.find(".download_file").parent().show();
	} else {
		this._container.find(".download_file").parent().hide();
	}
	// 修改权限
	var modifyAcl = aclArr[1];
	if (modifyAcl) {
		this._container.find(".mofifyBtn").show();
	} else {
		this._container.find(".mofifyBtn").hide();
	}
	// 删除权限
	var deleteAcl = aclArr[2];
	if (deleteAcl) {
		this._container.find(".delete_file").parent().show();
	} else {
		this._container.find(".delete_file").parent().hide();
	}
	// 上传权限
	var uploadAcl = aclArr[3];
	if (uploadAcl) {
		this._container.find(".uploadBtn").show();
		this._container.find(".uploadBtntr").show();
	} else {
		this._container.find(".uploadBtn").hide();
		this._container.find(".uploadBtntr").hide();
	}
	// 编辑权限
	var editAcl = aclArr[4];
	if (editAcl) {
		this._container.find(".edit_file").parent().show();
	} else {
		this._container.find(".edit_file").parent().hide();
	}
	// 查看权限
	var viewAcl = aclArr[5];
	if (viewAcl) {
		this._container.find(".view_file").parent().show();
	} else {
		this._container.find(".view_file").parent().hide();
	}
	
	if (acl == 1) {
		this._container.addClass("disabled");
	} else {
		this._container.removeClass("disabled");
	}
};
/**
 * 字母权限：D,M,X,U,W,R
 * 分别表示：下载，修改，删除，上传，编辑，查看
 */
rh.ui.File.prototype._calcChar2Num = function(acl) {
	acl = acl.toLowerCase();
	
};
/**
 * 设置某一指定文件的权限32、16、8、4、2、1，分别是下载、修改、删除、上传、编辑、查看
 */
rh.ui.File.prototype.setFileAcl = function(fileId, acl) {
	var aclArr = this.calcAcl(acl);
	
	// 下载权限
	var downloadAcl = aclArr[0];
	if (downloadAcl) {
		this._container.find("#" + fileId).find(".download_file").parent().show();
	} else {
		this._container.find("#" + fileId).find(".download_file").parent().hide();
	}
	// 删除权限
	var deleteAcl = aclArr[2];
	if (deleteAcl) {
		this._container.find("#" + fileId).find(".delete_file").parent().show();
	} else {
		this._container.find("#" + fileId).find(".delete_file").parent().hide();
	}
	// 编辑权限
	var editAcl = aclArr[4];
	if (editAcl) {
		this._container.find("#" + fileId).find(".edit_file").parent().show();
	} else {
		this._container.find("#" + fileId).find(".edit_file").parent().hide();
	}
	// 查看权限
	var viewAcl = aclArr[5];
	if (viewAcl) {
		this._container.find("#" + fileId).find(".view_file").parent().show();
	} else {
		this._container.find("#" + fileId).find(".view_file").parent().hide();
	}
};
/**
 * destory File
 */
rh.ui.File.prototype.destroy = function() {
	
	// 先显示this._upload.destroy()才能销毁
	this._container.find(".uploadBtntr").show();
	this._container.find(".uploadBtn").show();
	
	if (this._upload) {
		this._upload.destroy();
		this._upload = null;
	}
	this._container.html("");
    this._container.empty();
	this._container.remove();
};
/**
 * 清空
 */
rh.ui.File.prototype.clear = function() {
	// 清空页面上所有文件
	this._container.find(".file").remove();
	delete this._fileData;
	this._fileData = {};
	this._fileNumber = 0;
	if (this.cardObj) {
		this.cardObj._resetHeiWid();
	}
};
/**
 * 删除所有文件
 */
rh.ui.File.prototype.deleteAll = function() {
	var _self = this;
	var fileIds = new Array();
	this._container.find(".file").each(function(index, file){
		var fileId = jQuery(file).attr("icode");
		fileIds.push(fileId);
		_self.remove(fileId);
	});
	
	var fileIdsStr = fileIds.join(",");
	if (fileIdsStr.length > 0) {
		var data = {};
		data[UIConst.PK_KEY] = fileIdsStr;
		FireFly.doAct("SY_COMM_FILE", "delete", data, false);
		
		// 清空数据
		this._fileData = {};
	}
};
/**
 * 获取Label
 * @return {} 返回Label对象
 */
rh.ui.File.prototype.getLabel = function() {
	return this._container.parent().parent().find("#" + this._opts.id + "_label");
};
/**
 * 校验是否为空
 */
rh.ui.File.prototype.isNull = function() {
	return this._container.find(".fileInfo").length == 0;
};
/**
 * 返回jquery对象的html，便于调试
 */
rh.ui.File.prototype.toString = function() {
	return jQuery('<div></div>').append(this._container).clone().remove().html();
};
/**
 * 设置Attach表单默认值
 */
rh.ui.File.prototype.fillDefault = function() {
};
/**
 * 获取文件数据
 * 结构为{_PK_:fileData}
 */
rh.ui.File.prototype.getFileData = function() {
	return this._fileData;
};
/**
 * 初始化上传组件
 */
rh.ui.File.prototype.initUpload = function() {
	var _self = this;
	if (!this._upload) {
		var settings = {};
		// 可上传文件类型
		if (this._config.TYPES) {
			settings.file_types = this._config.TYPES;
		}
		// 可上传文件大小
		if (this._config.FILESIZE) {
			settings.file_size_limit = this._config.FILESIZE;
		}
		// 可上传文件描述
		if (this._config.DESC) {
			settings.file_types_description = this._config.DESC;
		}
		// 一次可选择文件数
		if (this._config.QUEUESIZE) {
			settings.file_queue_limit = this._config.QUEUESIZE;
		}
		// 最多可上传文件数
		if (this._config.FILENUMBER) {
			if (this._config.FILENUMBER == 1) {// 覆盖上传
				this._fileNumber = 1;
				settings.file_upload_limit = 0;
				settings.file_queue_limit = 1;
			} else {
				this._fileNumber = this._config.FILENUMBER;
				settings.file_upload_limit = this._config.FILENUMBER;
			}
		}
		// 按钮样式
		if (this._config.BTN_STYLES) {
			settings.btnStyles = this._config.BTN_STYLES;
		}
		// 按钮图片
		if (this._config.BTN_IMAGE) {
			settings.btnImage = this._config.BTN_IMAGE;
		}
		// 按钮文字
		if (this._config.TEXT) {
			settings.text = this._config.TEXT;
		}
		// 按钮宽度
		if (this._config.WIDTH) {
			settings.width = this._config.WIDTH;
		}
		// 按钮高度
		if (this._config.HEIGHT) {
			settings.height = this._config.HEIGHT;
		}
		// 按钮文字上边距
		if (this._config.TOP) {
			settings.top = this._config.TOP;
		}
		// 按钮文字左边距
		if (this._config.LEFT) {
			settings.left = this._config.LEFT;
		}
		
		//flash地址
		if (this._config.flash_url) {
			settings.flash_url = this._config.flash_url;
		}
		//上传地址
		if (this._config.upload_url) {
			settings.upload_url = this._config.upload_url;
		}
		//背景图片地址
		if (this._config.button_image_url) {
			settings.button_image_url = this._config.button_image_url;
		}
		// 是否保存修改痕迹，默认保留痕迹
		this._revision = true;
		if (this._config.REVISION && this._config.REVISION == "false") {
			this._revision = false;
		} 
		
		// post参数
		settings.post_params = {};
		settings.post_params.data = "{\"SERV_ID\" : \"" + this._servId + "\", \"FILE_CAT\" : \""+ this._fileCat;
		// 设置附件的DATA_ID
		if (this._dataId && this._dataId.length > 0) {
			settings.post_params.data += "\", \"DATA_ID\" : \""+ this._dataId + "\"}";
		} else {
			settings.post_params.data += "\"}";
		}
		
		// 按钮容器
		settings.button_placeholder = this._obj.find("#uploadHolder_" + this.time).get(0);
		// 进度条对象
		settings.custom_settings = {};
		settings.custom_settings.progressTarget = "fsUploadProgress_" + this.time;
		
		// 加载完了之后
		settings.swfupload_loaded_handler = function (){
			var num = _self._container.find(".file").length;
			var uploads = _self.getUpload().getUploadFiles();
			if (uploads == 0) {
				_self.getUpload().setUploadFiles(num);
			}
		};
		
		// 构造文件上传
		try {
			this._upload = new rh.ui.Upload(settings);
		} catch (e) {
			this.destroy();
			alert("创建flash上传组件失败！" + e);
			return;
		}
		
		// 上传之前做处理
		this._upload.beforeUpload = function(file) {

			// 调用对外回调函数
			if (!_self.beforeUploadCallback.call(_self, file)) {
				// 显示进度条
				_self.showProgress(false);
				_self._upload.cancelUpload();
				return false;
			} else {
				// 显示进度条
				_self.showProgress(true);
			}
			
			// 设置上传时的DATA_ID
			if (_self.cardObj && !_self._dataId || (_self._dataId && _self._dataId.length == 0)) {
				_self._dataId = _self.cardObj.getOrigPK();
				_self.setDataId(_self._dataId);
			}
			
			// 设置文件排序
			_self.setFileSort();
			
			// 给文件设置设置流程ID，WF_NI_ID
			if (_self.cardObj && _self.cardObj.wfCard && _self.cardObj.wfCard.getNodeInstBean()) {
				var wfNIId = _self.cardObj.wfCard.getNodeInstBean().NI_ID;
				if (wfNIId && wfNIId.length > 0) {
					this.addPostParam("WF_NI_ID", wfNIId);
				}
			}
			
			// 覆盖上传
			if (_self._fileNumber == 1 && this.getUploadFiles() == 1) {
				if (confirm("是否覆盖上传？")) {
					var fileId = _self.getFileId()[0];
					var url = FireFly.getContextPath() + "/file/" + fileId;
					_self.getUpload().getSwfObj().setUploadURL(url);
					_self.clearFileByFileId(fileId);
					this.setUploadFiles(0);
					return true;
				} else {
					_self._upload.cancelUpload();
					return false;
				}
			}
		};
		
		// 上传成功文件数据放到页面上
		this.numFilesUploaded = 0;
		this._upload.uploadSuccess = function(serverData) {
			var fileData = StrToJson(serverData)._DATA_;
			_self.fillData(fileData);

			_self._tempFileData.push(fileData[0]);
			
			var status = jQuery("#divStatus_" + _self.time, _self.progressDialog);
			status.html(++_self.numFilesUploaded + " 个文件已上传");
			
			// 回调上传之后的函数
			_self.afterUploadCallback.call(_self, fileData);
		};
		
		// 整个队列上传成功
		this._upload.queueComplete = function(numFilesUploaded){
			_self.queueComplete(numFilesUploaded);
		};
		
	}
	
	// 避免flash先加载完毕
	if (_self.getUpload() && _self.getUpload().getSwfObj() &&  _self.getUpload().getSwfObj().testExternalInterface()) {
		var uploads = _self.getUpload().getUploadFiles();
		if (uploads == 0) {
			_self.getUpload().setUploadFiles(this.getFileData().length);
		}
	}
};
/**
 * 显示进度条
 */
rh.ui.File.prototype.showProgress = function(bool) {
	var hei = 300;
	var wid = 450;
	
	var scroll = RHWindow.getScroll(parent.window);
    var viewport = RHWindow.getViewPort(parent.window);
    var top = scroll.top + viewport.height / 2 - hei / 2 - 88;
    var posArray = [];
    posArray[0] = "";
    posArray[1] = top;
    
	if (!this.progressDialog) {
		var _self = this;
		
		var progressId = "fsUploadProgress_" + this.time;
		var progress = jQuery("#" + progressId, this._obj);
		
		this.progressDialog = jQuery("<div style='padding:20px 0 0 10px;'></div>").addClass("dictDialog").attr("title","文件上传进度");
		this.progressDialog.appendTo(jQuery("body"));
		this.progressDialog.append("<div id='divStatus_" + this.time + "'>0 个文件已上传</div>");
		this.progressDialog.append(progress);

	    this.progressDialog.dialog({
			autoOpen: bool,
			height: hei,
			width: wid,
			show: "bounce", 
	        hide: "puff",
			modal: true,
			resizable: false,
			position: posArray,
			buttons: {
				"取消": function() {
					// 取消上传
					_self._upload.cancelUpload();
					
					var len = _self._tempFileData.length;
					var ids = [];
					for (var i = 0; i < len; i++) {
						ids.push(_self._tempFileData[i].FILE_ID);
						delete _self._tempFileData[i];
					}
					var data = {};
					data[UIConst.PK_KEY] = ids.join(",");
					FireFly.doAct("SY_COMM_FILE", "delete", data, false);
					_self._tempFileData = [];
					
					// 刷新文件
					_self.refresh();
					
					_self.progressDialog.dialog("close");
				},
				"关闭": function() {
					_self.progressDialog.dialog("close");
				}
			}
		});
		// 注释掉头部关闭按钮
	    this.progressDialog.parent().find(".ui-dialog-titlebar-close").hide();
		var btns = jQuery(".ui-dialog-buttonpane button",this.progressDialog.parent()).attr("onfocus","this.blur()");
		this._okBtn = btns.first().addClass("rh-small-dialog-ok");//.attr("disabled", true);
		btns.last().addClass("rh-small-dialog-close");
		this.progressDialog.parent().addClass("rh-small-dialog").addClass("rh-bottom-right-radius");
	    jQuery(".ui-dialog-titlebar").last().css("display","block");//设置标题显示
	} else {
		if (bool) {
			this.progressDialog.dialog("open",posArray);
		}
	}
};
/**
 * 队列完成
 */
rh.ui.File.prototype.queueComplete = function(numFilesUploaded) {
	var _self = this;	
	setTimeout(function(){
		_self.progressDialog.dialog("close");
		var status = jQuery("#divStatus_" + _self.time, _self.progressDialog);
		status.html("0 个文件已上传");	
		_self.numFilesUploaded = 0;
		_self._tempFileData = [];
		jQuery("#fsUploadProgress_" + _self.time).find("*").remove().append("<legend>上传进度</legend>");
		jQuery("#fsUploadProgress_" + _self.time).hide();
	}, 500);
	_self.afterQueueComplete(this._fileData);
};
/**
 * 获取上传文件ID
 */
rh.ui.File.prototype.getFileId = function() {
	var idArr = [];
	this._container.find(".file").each(function(index, node){
		idArr.push(jQuery(node).attr("icode"));
	});
	return idArr;
};
/**
 * 移除指定ID的文件
 */
rh.ui.File.prototype.clearFileByFileId = function(fileId) {
	if (fileId) {
		this.remove(fileId.replace(".", "_"));
	}
};
/**
 * 渲染之后
 */
rh.ui.File.prototype.afterRender = function() {
	this.initUpload();
};
/**
 * 填充数据
 * @param fileData 文件数据，数组
 */
rh.ui.File.prototype.fillData = function(fileData){	
	if (typeof fileData != "object") {
		return;
	}
	var _self = this;
	var len = fileData.length;
	
	// 权限数组
	var aclArr = this.calcAcl(this._acl);
	//  下载权限
	var downloadAcl = aclArr[0];
	// 删除权限
	var deleteAcl = aclArr[2];
	// 编辑权限
	var editAcl = aclArr[4];
	// 查看权限
	var viewAcl = aclArr[5];
	
	var existFileNum = 	this._container.find(".fileName").length;
	
	if  (len > 0) {
		this._container.find(".fileContainer").find(".none-file").remove();
		for (var i = 0; i < len; i++) {
			var file = fileData[i];
			
			// 文件数据保存到内存里
			this._fileData[file._PK_] = file;
			
			var fileId = file["FILE_ID"];
			
			// 显示在页面上的名字
			var disName = file["DIS_NAME"];
			var name = file["FILE_NAME"];
			// 如果没有DIS_NAME就用FILE_NAME代替
			if (!disName) {
				disName = name;
			}
			// 截取字符个数
			var charSize = 22;
			if (disName.length > charSize) {
				disName = disName.substring(0, charSize) + "...";
			}

			var size = null;
			if (parseInt(file["FILE_SIZE"]) != 0) {
				size = Math.ceil(parseInt(file["FILE_SIZE"]) / 1024) + "KB";
			}
			var time = file["S_MTIME"];
			var day = time.substr(0, 10); // 只显示到日期
			var allTime = time.substr(0, 23);// 用于鼠标放上去显示整个时间
			var mtype = file["FILE_MTYPE"];
			
			// 通过后缀名找到小图标
			var icon = Icon[Tools.getFileSuffix(name)];
			if (!icon) {
				icon = Icon["unknown"];
			}
			
			var id = fileId.replace(".", "_");
			
			// 添加时的流程节点ID
			var wfNIId = file["WF_NI_ID"];
			
			// 构造文件列表
			var $strArr = new Array();
			$strArr.push("<div class='file' id='" + id + "' icode='" + fileId + "'>");
			$strArr.push("<table style='border-width:0'><tr style='border-width:0'><td style='border-width:0'>");
			$strArr.push("<span class='blank'>");
			$strArr.push("<span class='fileSortNum'>" + (i + 1 + existFileNum) + ".</span>");		
			$strArr.push("<span class='" + icon + " iconC'>");
			$strArr.push("</span>");
			$strArr.push("</span>");
			$strArr.push("</td><td style='border-width:0'>");
			
			$strArr.push("<span class='fileInfo'>");
			$strArr.push("<table style='border-width:0'><tr><td style='border-width:0' align='left'>");
			
			$strArr.push("<span class='fileName' title='" + name + "'>");
//			$strArr.push("<a title='" + name + "' href='javascript:;'>");
			$strArr.push(disName);
//			$strArr.push("</a>");
			$strArr.push("</span>");
			
			$strArr.push("</td><td style='border-width:0'>");
			
			$strArr.push("<span title='" + allTime + "'>");
			$strArr.push(day);
			$strArr.push("</span>");
			
			$strArr.push("</td></tr></table>");
			$strArr.push("</span>");
			$strArr.push("</td><td style='border-width:0'>");
			
			
			$strArr.push("<span class='edit'>");
			$strArr.push("<span class='icon'>");
			$strArr.push("<span class='iconC icon-card-delete'></span>");
			$strArr.push("<a class='delete_file' href='javascript:;'>删除</a>");
			$strArr.push("</span>");
			var upperName = name.toUpperCase();
			if (upperName.indexOf(".DOC") >= 0 || upperName.indexOf(".DOCX") >= 0
				|| upperName.indexOf(".XLSX") >= 0 || upperName.indexOf(".XLS") >= 0
				|| upperName.indexOf(".PPTX") >= 0 || upperName.indexOf(".PPT") >= 0) {
				$strArr.push("<span class='icon'>");
				$strArr.push("<span class='iconC icon-card-edit'></span>");
				$strArr.push("<a class='edit_file' href='javascript:;'>编辑</a>");
				$strArr.push("</span>");
				$strArr.push("<span class='icon'>");
				$strArr.push("<span class='iconC icon-card-view'></span>");
				$strArr.push("<a class='view_file' href='javascript:;'>查看</a>");
				$strArr.push("</span>");
			} else {
				$strArr.push("<span class='icon'>");
				$strArr.push("<span class='iconC icon-card-view'></span>");
				$strArr.push("<a class='view_file' href='javascript:;'>查看</a>");
				$strArr.push("</span>");
			}
			$strArr.push("<span class='icon'>");
			$strArr.push("<span class='iconC icon-card-download'></span>");
			$strArr.push("<a class='download_file' href='javascript:;'>下载</a>");
			$strArr.push("</span>");
			$strArr.push("</span>");
			$strArr.push("</td></tr></table>");
			
			$strArr.push("</div>");
			
			// 显示到页面
			var $file = jQuery($strArr.join(""));	
			this._container.find(".fileContainer").first().append($file);
			
			var $delete = $file.find(".delete_file");
			var $edit = $file.find(".edit_file");
			var $view = $file.find(".view_file");
			var $fileName = $file.find(".fileName");
			var $download = $file.find(".download_file");
			
			// 注册删除事件
			$delete.data("id", fileId).data("name", name).click(function(){
				// 删除之前
				if (!_self.beforeDeleteCallback.call(_self)) {
					return;
				}
				var $this = jQuery(this);
				_self.deleteFile($this.data("id"), $this.data("name"));
			});
			
			// 注册编辑事件
			$edit.data("id", fileId).data("name", name).data("wfNIId", wfNIId).click(function(){
				// 没有保存不允许编辑
				if (_self.cardObj && _self.cardObj.getStatus() == UIConst.ACT_CARD_ADD) {
					alert("请先保存！");
				} else {
					var $this = jQuery(this);
					_self.editFile($this.data("id"), $this.data("name"), $this.data("wfNIId"));
				}
			});
					
			// 注册查看事件
			$view.data("id", fileId).data("name", name).click(function(){
				var $this = jQuery(this);
				_self.viewFile($this.data("id"), $this.data("name"));
			});
			
			// 点击文件名下载
//			$fileName.data("id", fileId).data("name", name).find("a").click(function(){
//				var $this = jQuery(this).parent();
//				window.open(FireFly.getContextPath() + "/file/" + $this.data("id") + "?act=download");
//			});
			
			// 注册下载事件
			$download.data("id", fileId).data("name", name).click(function(){
				var $this = jQuery(this);
				_self.downloadFile($this.data("id"), $this.data("name"));
			});
			
			// 权限设置
			if (!downloadAcl) {
				$download.parent().hide();
			}
			if (!deleteAcl) {
				$delete.parent().hide();
			}
			if (!editAcl) {
				$edit.parent().hide();
			}
			if (!viewAcl) {
				$view.parent().hide();
			}
		}
	} else {
		this.showNoneFile();
	}
	
	// fillData后处理
	this.afterFillData(fileData);
	
	// 载入数据之后校验通过
	this._getValidateObj() && this._getValidateObj().showOk && this._getValidateObj().showOk();
	
	// 触发change事件
	this.onchange();
	
	if (this.cardObj) {
		this.cardObj._resetHeiWid();
	}
};
/**
 * 删除页面上的文件
 */
rh.ui.File.prototype.remove = function(fileId) {
	this._container.find(".fileContainer").find("#" + fileId).remove();
	if (this.cardObj) {
		this.cardObj._resetHeiWid();
	}
};
/**
 * 修改文件
 */
rh.ui.File.prototype.modifyFile = function() {
	var idArr = this.getFileId();
	if (idArr.length > 0) {
		var _self = this;
		if (this.winDialog) {
			try {
				this.winDialog.dialog("destroy");
			} catch (e) {
				// 
			}
		}
		this.winDialog = jQuery("<div></div>").addClass("selectDialog").attr("title","修改文件信息");
		this.winDialog.appendTo(jQuery("body"));
		var bodyWid = jQuery("body").width();
		var hei = GLOBAL.getDefaultFrameHei() - 150;
	    var wid = bodyWid - 300;
	    var scroll = RHWindow.getScroll(parent.window);
	    var viewport = RHWindow.getViewPort(parent.window);
	    // scroll.top - viewport.height / 2 到顶上了，再加上高度的一半以及top的高度
	    var top = scroll.top - viewport.height / 2 + hei / 2 + 150;
	    var left = scroll.left - viewport.width / 2 + wid;
	    
	    var posArray = [left,top];

	    this.winDialog.dialog({
			autoOpen: false,
			height: hei,
			width: wid,
			modal: true,
			resizable:false,
			position:posArray,
			open: function() { 

			},
			close: function() {
				_self.winDialog.find("iframe").remove();
				_self.winDialog.remove();
			}
		});
	    this.winDialog.dialog("open");
	    this.winDialog.focus();
	    this._titBar = jQuery(".ui-dialog-titlebar").last().css("display","block");//设置标题显示
	    this.winDialog.parent().addClass("rh-bottom-right-radius rhSelectWidget-content");
	    //增加服务的切换
	    Tip.showLoad("努力加载中...",null,jQuery(".ui-dialog-title",this.windialog).last());
	    
	    var extWhere = " AND FILE_ID in('" + idArr.join("','") + "')"
	    var div = jQuery("<div class='rh-select-container'></div>").appendTo(this.winDialog);
	    var temp = {"sId":"SY_COMM_FILE_MODIFY","pCon":div,"batchFlag":true,"showTitleBarFlag":"false",
				"selectView":true,"pkHide":true,"replaceQueryModel":1,"parHandler":_self.cardObj,"resetHeiWid":function(){},"extWhere":extWhere};
		var listView = new rh.vi.listView(temp);
		listView.show();
		
		listView.afterSave = function(datas) {
			_self.refresh();
		};
	} else {
		alert("没有文件需要修改！");
	}
}
/**
 * 删除文件
 * @param fileId 文件ID
 */
rh.ui.File.prototype.deleteFile = function(fileId) {
	if (confirm("确定删除该文件？")) {
		// 从数据库中删除
		var data = {};
		data[UIConst.PK_KEY] = fileId;
		FireFly.doAct("SY_COMM_FILE", "delete", data, false);
		
		// 已上传文件减1
		this.getUpload().setUploadFiles(this.getUpload().getUploadFiles() - 1);
		
		// 从页面上删除
		this.remove(fileId.replace(".", "_"));
		
		// 删除之后
		this.afterDeleteCallback.call(this, this._fileData[fileId]);
		
		// 从内存里删除
		delete this._fileData[fileId];
		
		//校验
		this.validate();
		
		this.showNoneFile();
		
		// 触发change事件
		this.onchange();
		
		// 重新对文件进行排序
		this._container.find(".fileSortNum").each(function(index, node){
			jQuery(node).html(index + 1);
		});
	}
};
/**
 * 显示没有文件
 */
rh.ui.File.prototype.showNoneFile = function() {
	// 一个文件都没有则显示提示文字
	if (this._container.find(".fileContainer").first().find(".none-file").length == 0 && jQuery.isEmptyObject(this.getFileData())) {
		this._container.find(".fileContainer").first().append("<span class='none-file' style='line-height:27px;'>暂无文件！</span>");
	}
}
/**
 * 编辑文件
 * @param fileId 文件ID
 * @param fileName 文件名
 * @param addWfNIId 文件添加时的流程节点ID
 */
rh.ui.File.prototype.editFile = function(fileId, fileName, addWfNIId) {
	var uploadUrl = "/file/" + fileId + "?keepMetaData=true";
	if (this._saveHist) {
		uploadUrl = uploadUrl + "&model=saveHist";
	}
	// 是否记录痕迹
	var revision = this._revision;
	if (this.cardObj && this.cardObj.wfCard && this.cardObj.wfCard.getNodeInstBean()) {
		var wfNIId = this.cardObj.wfCard.getNodeInstBean().NI_ID;
		// 当前流程节点ID和文件添加时的节点ID一致时不用记录痕迹
		if (wfNIId && wfNIId.length > 0 && addWfNIId && addWfNIId.length > 0 && wfNIId == addWfNIId) {
			revision = false;
		} 
	} 
	editOfficeFile(fileName, "/file/" + fileId, uploadUrl, revision);
};
/**
 * 查看文件
 * @param fileId 文件ID
 */
rh.ui.File.prototype.viewFile = function(fileId, fileName) {
	zotnClientNTKO.DownloadFile("/file/" + fileId, fileName, false, true, false, true);
	//readOfficeFile(fileName, "/file/" + fileId, true);
};
/**
 * 下载文件
 */
rh.ui.File.prototype.downloadFile = function(fileId, fileName) {
	zotnClientNTKO.DownloadFile("/file/" + fileId, fileName, false, true, true, false);
};
/**
 * 设置Attach的值
 */
rh.ui.File.prototype.setValue = function(fileData) {
	if (!jQuery.isEmptyObject(fileData)) {
		this.fillData(fileData);
	}
	this.cardObj._resetHeiWid();
};
/**
 * 获取当前附件的值
 */
rh.ui.File.prototype.getValue = function() {
	return this._fileData;
};
/**
 * 获取所有已上传了的文件名，逗号分割
 */
rh.ui.File.prototype.getText = function() {
};
/**
 * 使无效，只读
 */
rh.ui.File.prototype.disabled = function() {
	this.setAcl(1);
};
/**
 * 使有效，全部权限
 */
rh.ui.File.prototype.enabled = function() {
	this.setAcl(15);
};
/**
 * 隐藏该字段
 */
rh.ui.File.prototype.hide = function() {
	this.isHidden = true;
	this._container.parent().parent().hide();
};
/**
 * 显示该字段
 */
rh.ui.File.prototype.show = function() {
	this.isHidden = false;
	this._container.parent().parent().show();
};
/**
 * 设置Attach为必须输入项
 */
rh.ui.File.prototype.setNotNull = function(bool) {
	this._opts.isNotNull = bool;
};
/**
 * 计算权限数组
 * 32,16,8,4,2,1 	分别是下载、修改、删除、上传、编辑、查看
 * D,M,X,U,W,R 	分别是下载，修改，删除，上传，编辑，查看
 * @param acl 权限数值
 * @return {} 返回权限数组对象
 */
rh.ui.File.prototype.calcAcl = function(acl) {
	var totalLen = 6; // 权限2进制总位数
	var aclArr = [false,false,false,false,false,false];
	if (!isNaN(acl)) {// 如果是数字
		acl = parseInt(acl);
		// 保存权限信息
		this._acl = acl;
		// 把十进制数字转化成二进制字符串，对应转化为布尔数组，例如0x101010变成[true,false,true,false,true,false]
		var aclStr = (parseInt(acl) & 63).toString(2);
		var len = aclStr.length;
		// 不够6位补零
		var tmpLen = totalLen - len;
		for (var i = 0; i < tmpLen; i++) {
			aclStr = "0" + aclStr;
		}
		len = totalLen;
		for (var i = 0; i < len; i++) {
			var tmp = aclStr.substring(i, i + 1);
			if (tmp.toString() == "1") {
				aclArr[i] = true;
			} 
		}
	} else {
		// 字母权限
		acl = acl.toLowerCase();
		// 保存二进制权限
		var numStr = ["0","0","0","0","0","0"];
		if (acl.indexOf("d") >= 0) {// 下载
			aclArr[0] = true;
			numStr[0] = "1";
		}
		if (acl.indexOf("m") >= 0) {// 修改
			aclArr[1] = true;
			numStr[1] = "1";
		} 
		if (acl.indexOf("x") >= 0) {// 删除
			aclArr[2] = true;
			numStr[2] = "1";
		}
		if (acl.indexOf("u") >= 0) {// 上传
			aclArr[3] = true;
			numStr[3] = "1";
		} 
		if (acl.indexOf("w") >= 0) {// 编辑
			aclArr[4] = true;
			numStr[4] = "1";
		} 
		if (acl.indexOf("r") >= 0) {// 查看
			aclArr[5] = true;
			numStr[5] = "1";
		} 
		// 转换成10进制数字，并保存权限信息
		this._acl = parseInt(numStr.join(""), 2);
	}
	return aclArr;
};
/**
 * 获取文件最外层的div
 */
rh.ui.File.prototype.getObj = function() {
	return this._obj;
};
/**
 * 获取文件最外层的div
 */
rh.ui.File.prototype.getContainer = function() {
	return this._container.parent().parent();
};
/**
 * 获取校验对象
 */
rh.ui.File.prototype._getValidateObj = function() {
	return this._container;
};
/**
 * change事件
 * @param func 响应函数
 */
rh.ui.File.prototype.change = function (func) {
	if (func) {
		this._changeFuncs.push(func);
	}
};
/**
 * 触发change事件
 */
rh.ui.File.prototype.onchange = function() {
	var len = this._changeFuncs.length;
	for (var i = 0; i < len; i++) {
		this._changeFuncs[i].call(this);
	}
};
/** rh.ui.File定义结束 */
rh.ui.Textarea = function(options) {
	var _self = this;
	this.type = "Textarea";
	var opts = {
		id : "",
		pId : "",
		name : "",
		cls : "ui-textarea-default",
		_default : "",
		width : 0,
		isNotNull : false,
		isReadOnly : false,
		isDict : false,
		item_input_config : ""
	};
	// 把参数复制到对象opts中
	this._opts = jQuery.extend(opts, options);
	// 是否隐藏
	this.isHidden = this._opts.isHidden;
	// 下面填充表单默认值要用到
	this._default = opts._default;
	// chagne事件响应函数数组
	this._changeFuncs = [];
	// 初始化文本框
	var $strArr = new Array();
	$strArr.push("<textarea wrap='soft' id='");
	$strArr.push(opts.id);
	$strArr.push("' class='");
	$strArr.push(opts.cls);
	$strArr.push("'  name='");
	$strArr.push(opts.name);
	$strArr.push("' rows='5' style='height:100%;'></textarea>");
	this._obj = this.obj = jQuery($strArr.join(""));
	this._container = jQuery("<div class='blank' style='height:74px;'></div>").append(this._obj);
	if (opts.isReadOnly) {// 只读
		this.disabled();
	} else {
		if (opts.isNotNull) {
			this._obj.blur(function() {
				if (_self.isNull()) {// 非空校验
					_self._container.showError("该项必须输入！");
				} else {
					_self._container.showOk();
				}
			});
		}
	}

	// 设置宽度
	if (parseInt(opts.width) > 0) {
		this._container.width(opts.width);
	}
	
	// 卡片样式
	if (opts.style && jQuery.trim(opts.style).length > 0) {
		this._container.css(StrToJson(opts.style));
	}
};
/**
 * 获取blank
 */
rh.ui.Textarea.prototype.getBlank = function() {
	return this._container;
};
/**
 * 清空
 */
rh.ui.Textarea.prototype.clear = function() {
	this.setValue("");
};
/**
 * 获取Label
 * 
 * @return {} 返回Label对象
 */
rh.ui.Textarea.prototype.getLabel = function() {
	return this._container.parent().parent().find("#" + this._opts.id + "_label");
};
/**
 * 获取容器
 */
rh.ui.Textarea.prototype.getContainer = function() {
	return this._container.parent().parent();
};
/**
 * 获取校验对象
 */
rh.ui.Textarea.prototype._getValidateObj = function() {
	return this._container;
};
/**
 * 获取Textarea jQuery对象
 */
rh.ui.Textarea.prototype.getObj = function() {
	return this._obj;
};
/**
 * 校验是否为空
 */
rh.ui.Textarea.prototype.isNull = function() {
	return jQuery.trim(this._obj.val()).length == 0;
};
/**
 * 返回jquery对象的html，便于调试
 */
rh.ui.Textarea.prototype.toString = function() {
	return jQuery('<div></div>').append(this._container).clone().remove().html();
};
/**
 * 设置多行文本框默认值
 */
rh.ui.Textarea.prototype.fillDefault = function() {
	// 设置表单默认值，取得是系统的变量，如果是自己构造的测试数据这行会报错
	this.fillData(System.getVar(this._default));
	// 把默认值设置到UI
	this.setValue(System.getVar(this._default));
};
/**
 * 设置多行文本框的值
 */
rh.ui.Textarea.prototype.fillData = function(val) {
	this._obj.val(val);
};
/**
 * 重新设置多行文本框文本
 */
rh.ui.Textarea.prototype.setValue = function(val) {
	var theValue = this.getValue();
	this.fillData(val);
	if (val != theValue) {
		this.onchange();
	}
};
/**
 * 获取多行文本框文本
 */
rh.ui.Textarea.prototype.getValue = function() {
	return this._obj.val();
};
/**
 * 使多行文本框无效
 */
rh.ui.Textarea.prototype.disabled = function() {
	this._obj.attr("readonly", true).addClass("disabled");
	this._container.addClass("disabled");
};
/**
 * 使多行文本框有效
 */
rh.ui.Textarea.prototype.enabled = function() {
	this._obj.attr("readonly", false).removeClass("disabled");
	this._container.removeClass("disabled");
};
/**
 * 隐藏该字段
 */
rh.ui.Textarea.prototype.hide = function() {
	this.isHidden = true;
	this._container.parent().parent().hide();
};
/**
 * 显示该字段
 */
rh.ui.Textarea.prototype.show = function() {
	this.isHidden = false;
	this._container.parent().parent().show();
};
/**
 * 设置Textarea为必须输入项
 */
rh.ui.Textarea.prototype.setNotNull = function(bool) {
	this._opts.isNotNull = bool;
};
/**
 * Textarea change事件
 * @param {} func 回调方法
 */
rh.ui.Textarea.prototype.change = function(func) {
	var _self = this;
	if (func) {
		this._changeFuncs.push(func);
	}
	_self._obj.change(function() {
		if (func) {
			func.call(_self);
		}
	});
};
/**
 * 触发change事件
 */
rh.ui.Textarea.prototype.onchange = function() {
	var len = this._changeFuncs.length;
	for (var i = 0; i < len; i++) {
		this._changeFuncs[i].call(this);
	}
};
/* ui.rh.Textarea定义结束 */
/**
 * 超大文本
 * @param {}  options
 * 是否开启字数统计和路径显示{"wordCount":"false","elementPathEnabled":"false"}
 */
rh.ui.BigText = function(options) {
	var _self = this;
	// 组件类型
	this.type = "BigText";
	var opts = {
		id : "",
		pId : "",
		name : "",
		cls : "ui-bigtext-default",
		_default : "",
		isNotNull : false,
		isReadOnly : false,
		config : {}
	};
	// 暂存editor的值
	this._val = "";
	// 把参数复制到对象opts中
	this._opts = jQuery.extend(opts, options);
	this._servId = "";
	this._dataId = "";
	if (this._opts.cardObj) {
		this._servId = this._opts.cardObj.servId;
		this._dataId = this._opts.cardObj._pkCode;
	}
	// 是否隐藏
	this.isHidden = this._opts.isHidden;
	// chagne事件响应函数数组
	this._changeFuncs = [];
	// 初始化文本框
	$strArr = new Array();
	this.editorId = _self._opts.id + "_" + new Date().getTime();
	this.editor = null;
	$strArr.push("<div id='");
	$strArr.push(_self._opts.id);
	$strArr.push("' class='");
	$strArr.push(opts.cls);
	$strArr.push("'><textarea id='");
	$strArr.push(this.editorId);
	$strArr.push("'>");
	$strArr.push(opts._default);
	$strArr.push("</textarea></div>");
	this._container = this.obj = jQuery("<div class='blank' style='padding-left:0;'></div>").append($strArr.join(""));
	
	// 设置宽度
	this.width = "100%";
	if (parseInt(opts.width) > 0) {
		this.width = parseInt(opts.width);
	}
	
	// 卡片样式
	this.height = 400;
	if (opts.style && jQuery.trim(opts.style).length > 0) {
		var style = StrToJson(opts.style);
		if (style) {
			if (style.width) {
				this.width = parseInt(style.width.substr(0, style.width.indexOf("px")));
				this._container.css({"width":style.width});
			}
			if (style.height) {
				this.height = parseInt(style.height.substr(0, style.height.indexOf("px")));
			}
			
		}
	}
};
/**
 * 获取blank
 */
rh.ui.BigText.prototype.getBlank = function() {
	return this._container;
};
/**
 * 清空
 */
rh.ui.BigText.prototype.clear = function() {
	this.setValue("");
};
/**
 * 获取Label
 * 
 * @return {} 返回Label对象
 */
rh.ui.BigText.prototype.getLabel = function() {
	return this._container.parent().parent().find("#" + this._opts.id + "_label");
};
/**
 * 获取容器
 */
rh.ui.BigText.prototype.getContainer = function() {
	return this._container.parent().parent();
};
/**
 * 获取校验对象
 */
rh.ui.BigText.prototype._getValidateObj = function() {
	return this._container;
};
/**
 * 获取UEditor
 */
rh.ui.BigText.prototype.getEditor = function() {
	return this.editor;
};
/**
 * 获取BigText 
 * 只用于校验
 */
rh.ui.BigText.prototype.getObj = function() {
	return this._container;
};
/**
 * 构建ckeditor
 */
rh.ui.BigText.prototype.createEditor = function() {
	var _self = this;
	this.destroy();

	if (!this._dataId) {
		this._dataId = this._opts.cardObj.getOrigPK();
	}
	
	// 初始化editor
	var fileUrl = "/file/";
	var params = "?SERV_ID=" + this._servId + "&DATA_ID=" + this._dataId + "&FILE_CAT=";
	
	// 默认复杂模式
	var toolbars = [
	                ['fullscreen', 'source', '|', 'undo', 'redo', '|',
	                  'bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'autotypeset', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'cleardoc', '|',
	                  'rowspacingtop', 'rowspacingbottom','lineheight','|',
	                  'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|', 'indent', '|',
	                  'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
	                  'link', 'unlink', '|',
	                  'insertimage', 'emotion','scrawl', 'insertvideo','music','attachment', 'map', 'insertframe','highlightcode','template','background', '|',
	                  'horizontal', 'spechars', 'wordimage', '|',
	                  'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', '|',
	                  'preview']
	          ];

	// 简单模式
	if (this._opts.config.simple) {
		toolbars = [
	                ['undo', 'redo', 'bold', 'italic', 'underline', 'strikethrough', 'link', 'unlink', 'insertimage', 'emotion', '|', 'attachment', 'map']
	          ];
	}
	
	// 自定义配置
	if (this._opts.config.toolbars) {
		var toolbarsStr = "[[" + this._opts.config.toolbars + "]]"
		toolbars = StrToJson(toolbarsStr);
	}
	
	// 是否开启字数统计，默认启用
	var wordCount = true;
	if (this._opts.config.wordCount == "false") {
		wordCount = false;
	}
    //是否启用元素路径，默认是显示
	var elementPathEnabled = true;
	if (this._opts.config.elementPathEnabled == "false") {
		elementPathEnabled = false;
	}
	var config = {
		// 比容器宽两像素
		initialFrameWidth:this.width			// 初始化编辑器宽度
		,initialFrameHeight:this.height 		// 初始化编辑器高度
		,minFrameHeight:0						// 最小高度
		,autoHeightEnabled:false				// 关闭默认长高，使用滚动条
		,zIndex:1100							// 编辑器层级的基数
		,imageUrl:RHFile.uploadUrl.imageUrl + params + "IMAGE_CAT"            			// 图片上传提交地址
	    ,scrawlUrl:RHFile.uploadUrl.scrawlUrl + params + "SCRAWL_IMG_CAT"          	// 涂鸦上传地址
	    ,fileUrl:RHFile.uploadUrl.fileUrl + params + "ATTACHMENT_CAT"            		// 附件上传提交地址
	    ,catcherUrl:RHFile.uploadUrl.catcherUrl + params + "REMOTE_IMG_CAT"   			// 处理远程图片抓取的地址
	    ,imageManagerUrl:RHFile.uploadUrl.imageManagerUrl + params						// 图片在线管理的处理地址
	    ,snapscreenHost: '127.0.0.1'                    						// 屏幕截图的server端文件所在的网站地址或者ip，请不要加http://
	    ,snapscreenServerUrl:RHFile.uploadUrl.snapscreenServerUrl + "SNAP_IMG_CAT" 	// 屏幕截图的server端保存程序，UEditor的范例代码为“URL +"server/upload/jsp/snapImgUp.jsp"”
	    ,wordImageUrl:RHFile.uploadUrl.wordImageUrl + params + "WORD_IMG_CAT"      	// word转存提交地址
	    ,getMovieUrl:RHFile.uploadUrl.getMovieUrl + params + "MOVIE_CAT"           	// 视频数据获取地址
	    ,imagePath:fileUrl                // 图片修正地址，引用了fixedImagePath,如有特殊需求，可自行配置
	    ,scrawlPath:fileUrl               // 图片修正地址，同imagePath
	    ,filePath:fileUrl                 // 附件修正地址，同imagePath
	    ,catcherPath:fileUrl              // 图片修正地址，同imagePath
	    ,imageManagerPath:fileUrl         // 图片修正地址，同imagePath
	    ,snapscreenPath:fileUrl			  // 图片修正地址，同imagePath
	    ,wordImagePath:fileUrl            // 图片修正地址，同imagePath
	    ,toolbars:toolbars
	    ,maximumWords:Math.floor(this._opts.words / 2)
	    //是否开启字数统计
	    ,wordCount:wordCount
	    //是否启用元素路径，默认是显示
	    ,elementPathEnabled:elementPathEnabled
	};
	
	if (!this.editor) {
		UE.getEditor(this.editorId, config).ready(function(){
			_self.editor = this;
			// 载入后台传入的数据
			this.setContent(_self._val);
			this.focus(true);
			if (_self._opts.cardObj) {
				_self._opts.cardObj.resetSize();
			}
			// 只读
			if (_self._opts.isReadOnly) {
				_self.disabled();
			}
			
			// 注册change事件
			var len = _self._changeFuncs.length;
			for (var i = 0; i < len; i ++) {
				var func = _self._changeFuncs[i];
				(function(f){
					_self.editor.addListener("selectionchange", function () {
						f.call(_self);
				    });
				})(func);
			}
			
		});
	} 
};
/**
 * 销毁ckeditor实例
 */
rh.ui.BigText.prototype.destroy = function() {
	if (this.editor && this.editor.destroy) {
		this.editor.destroy();
		this.editor = null;
	}
};
/**
 * 校验是否为空
 */
rh.ui.BigText.prototype.isNull = function() {
	return jQuery.trim(this.getValue()).length == 0;
};
/**
 * 返回jquery对象的html，便于调试
 */
rh.ui.BigText.prototype.toString = function() {
	return jQuery('<div></div>').append(this._container).clone().remove().html();
};
/**
 * 渲染之后
 */
rh.ui.BigText.prototype.afterRender = function() {
	this.createEditor();
};
/**
 * 设置BigText默认值
 */
rh.ui.BigText.prototype.fillDefault = function() {
	this.setValue("");
};
/**
 * 设置BigText的值
 */
rh.ui.BigText.prototype.fillData = function(val) {
	this.setValue(val);
};
/**
 * 重新设置BigText
 */
rh.ui.BigText.prototype.setValue = function(val) {
	this._val = val;
	if (this.editor) {
		var theValue = this.getValue();
		this.editor.setContent(val);
		if (val != theValue) {
			this.onchange();
		}
	}
};
/**
 * 获取BigText文本
 */
rh.ui.BigText.prototype.getValue = function() {
	if (this.editor) {
		return this.editor.getContent();
	}
	return "";
};
/**
 * 使BigText无效
 */
rh.ui.BigText.prototype.disabled = function() {
	var _self = this;
	if (this.editor) {
		this.editor.disable();
	} else {
		setTimeout(function(){
			_self.disabled();
		}, 200);
	}
};
/**
 * 使BigText有效
 */
rh.ui.BigText.prototype.enabled = function() {
	if (this.editor) {
		this.editor.enable();
	}
};
/**
 * 隐藏该字段
 */
rh.ui.BigText.prototype.hide = function() {
	this.isHidden = true;
	this._container.parent().parent().hide();
};
/**
 * 显示该字段
 */
rh.ui.BigText.prototype.show = function() {
	this.isHidden = false;
	this._container.parent().parent().show();
};
/**
 * 设置BigText为必须输入项
 */
rh.ui.BigText.prototype.setNotNull = function(bool) {
	this._opts.isNotNull = bool;
};
/**
 * BigText change事件
 * @param {} func 回调方法
 */
rh.ui.BigText.prototype.change = function(func) {
	var _self = this;
	if (func) {
		this._changeFuncs.push(func);
	}
};
/**
 * 触发change事件
 */
rh.ui.BigText.prototype.onchange = function() {
	var len = this._changeFuncs.length;
	for (var i = 0; i < len; i++) {
		this._changeFuncs[i].call(this);
	}
};
/* ui.rh.BigText定义结束 */
/**
 * 相关文件的选择组件
 * @param {}  options
 */
rh.ui.linkSelect = function(options) {
	var _self = this;
	this.type = "LinkSelect";// 组件类型
	var opts = {
		"id":"",
		"name":"",
		"sId":"",
        "cardObj":null,
        "isReadOnly":false,
		"cls":"ui-linkselect-default"
	};
	this.opts = jQuery.extend(opts,options);
	this._itemCode = this.opts.itemCode; //服务的itemCode
	this._actTable = "SY_SERV_RELATE";
	this.srcServId = this.opts.servSrcId;//服务的srcid
	this.cardObj = this.opts.cardObj;//卡片句柄
	this._val = "";
	this._configs = this.opts.config;//输入设置
	this.sId = this.opts.servID;//服务code
	this.pkCode = this.cardObj.getPKCode();//卡片主键
	this.itemCode = this.opts.ITEM_CODE;//字段编码
	this.parHandler = this.opts.parHandler;//form句柄
	this._isReadOnly = this.opts.isReadOnly;
	this._build();

};
/**
 * 增加回调方法
 */
rh.ui.linkSelect.prototype.callBack = function(data) {
	this.buildList(data);
};
/**
 * 增加点击前判断方法
 */
rh.ui.linkSelect.prototype.beforeClick = function() {
};
/**
 * 渲染显示
 */
rh.ui.linkSelect.prototype._build = function() {
	var _self = this;
    this.obj = jQuery("<a class='ui-linkSelect-default' style='width:80px;' href='javascript:void(0);'>选择相关文件</a>");	
    this.obj.bind("click",function() {
    	if (_self.beforeClick() === false) {
    		return true;
    	};
    	_self.open();
    });
    if (this._isReadOnly === true) {
    	this.obj.hide();
    }
};
/**
 * 弹出选择页面
 */
rh.ui.linkSelect.prototype.open = function() {
	var _self = this;
	var options = {
			"configs" : _self._configs,
			"parHandler" : _self,
			"formHandler" : _self.parHandler,
			"replaceCallBack" : function(arr) {
				_self.callBack.call(_self,arr);
			 }
	};
	var queryView = new rh.vi.rhSelectListView(options);
	queryView.show();	
};
/**
 * 确定返回并保存记录到后台
 */
rh.ui.linkSelect.prototype.buildList = function(array) {
	var _self = this;
	this.pkCode = this.cardObj.getItem(this.cardObj.servKeys).getValue();
	
	//构造batchsave
	var datas = [];
	jQuery.each(array, function(i,n) {
		var data = {};
		if(n.sId && n.sId.length > 0 && n.dataId && n.dataId.length > 0){
			data["SERV_ID"] = _self.srcServId;
			data["DATA_ID"] = _self.pkCode;
			data["RELATE_SERV_ID"] = n.sId;
			data["RELATE_DATA_ID"] = n.dataId;
			data["RELATE_TYPE"] = _self._itemCode;
			datas.push(data);
		}
	});
	var batchData = {};
	batchData["BATCHDATAS"] = datas;
	var resultData = FireFly.batchSave(this._actTable,batchData,null,true);
	if (this.cardObj.getPKCode() > 0) {//修改状态
		this.cardObj.refresh();
	} else {//添加卡片状态
		this.fillData();
		this.cardObj._resetHeiWid();
	}
	//增加保存后方法
	this.afterSave(resultData);
};
/**
 * 获取值
 */
rh.ui.linkSelect.prototype.getValue = function() {
	
};
/**
 * 设置值
 */
rh.ui.linkSelect.prototype.setValue = function() {
	
};
/**
 * 构造列表
 */
rh.ui.linkSelect.prototype.fillData = function() {
	var _self = this;
	var param = {};
	param[UIConst.EXT_WHERE] = " and DATA_ID='" + this.pkCode + "' and SERV_ID='" + this.srcServId + "'" + " and RELATE_TYPE='" + this._itemCode + "'";
	var data = FireFly.getListData(this._actTable,param)._DATA_ || {};
	if (this.obj.parent().find(".rh-linkselect-table")) {
		this.obj.parent().find(".rh-linkselect-table").remove();
	}
	this.table = jQuery("<table class='rh-linkselect-table'></table>");
//	if (data.length == 0) {
//		var tr = jQuery("<tr width='100%'></tr>");
//		var td1 = jQuery("<td>暂无相关文件！</td>").appendTo(tr);
//		tr.appendTo(_self.table);
//	}
	jQuery.each(data,function(i,n) {
		var tr = jQuery("<tr></tr>");
		var td1 = jQuery("<td class='ui-linkSelect-default-td cp'><a>" +(i+1)+". "+n.TITLE + "</a></td>").appendTo(tr);
		var td2 = jQuery("<td class='ui-linkSelect-default-td '>" + n.S_USER__NAME + "</td>").appendTo(tr);
		var td3 = jQuery("<td class='ui-linkSelect-default-td ui-linkselect-default-delete'><a href='javascript:void(0);'>删除</a></td>").appendTo(tr);
		td1.bind("click",function(){
			var opts = {"tTitle":n.TITLE,"url":n.RELATE_SERV_ID+".card.do?pkCode="+n.RELATE_DATA_ID,"menuFlag":3};
			Tab.open(opts);
		});
		td3.bind("click",function(event) {//删除绑定
			var res = confirm("您确认要删除该条记录吗?");
			if (res === true) {
	    		var temp = {};
	    		temp[UIConst.PK_KEY]=n.RELATE_ID;
	    		var result = FireFly.listDelete(_self._actTable,temp);
				if (result[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
					_self.fillData();
					_self.cardObj._resetHeiWid();
			    }
				_self.afterDelete(n.RELATE_ID);//删除后方法覆盖
			} 
		});
		tr.appendTo(_self.table);
	});
    if (this._isReadOnly === true) {
    	this.table.find(".ui-linkselect-default-delete").hide();
    }
	this.table.appendTo(this.obj.parent());
};
/**
 * 增加添加后方法
 */
rh.ui.linkSelect.prototype.afterSave = function(relateId) {

};
/**
 * 增加删除后方法
 */
rh.ui.linkSelect.prototype.afterDelete = function(relateId) {

};
/**
 * 填充默认值
 */
rh.ui.linkSelect.prototype.fillDefault = function() {

};
/**
 * 只读
 */
rh.ui.linkSelect.prototype.disabled = function() {
    this.obj.parent().find(".ui-linkselect-default-delete").hide();
    this.obj.hide();
};
/**
 * 取消只读
 */
rh.ui.linkSelect.prototype.enabled = function() {
    this.obj.parent().find(".ui-linkselect-default-delete").show();
    this.obj.show();
};
/**
 * 隐藏
 */
rh.ui.linkSelect.prototype.hide = function() {
	this.isHidden = true;
	this.obj.parent().parent().hide();
};
/**
 * 显示
 */
rh.ui.linkSelect.prototype.show = function() {
	this.isHidden = false;
	this.obj.parent().parent().show();
};
/**
 * 获取校验对象
 */
rh.ui.linkSelect.prototype._getValidateObj = function() {
	return this.obj;
};
/* rh.ui.linkList定义结束 */
/**
 * 日期选择
 * @param {}  options
 */
rh.ui.Date = function(options) {
	var _self = this;
	this.type = "Date";
	var opts = {
		id : "",
		pId : "",
		name : "",
		cls : "ui-date-default",
		data : [],
		width : 0,
		item_input_config : "",
		_default : ""
	};
	this._opts = jQuery.extend(opts, options);// 把参数复制到对象opts中
	// 是否隐藏
	this.isHidden = this._opts.isHidden;
	// 下面填充表单默认值要用到
	this._default = opts._default;
	// 日期控件
	this._obj = this.obj = jQuery("<input type='text' class='Wdate " + opts.cls + "' id='" + opts.id + "' />");
	// obj容器
	this._container = jQuery("<div class='blank'></div>").append(this._obj);

	if (opts.isReadOnly) {// 只读
		this.disabled();
	} else {
		this.enabled();
	}
	
	// 设置宽度
	if (parseInt(opts.width) > 0) {
		this._container.width(opts.width);
	}
	
	// 卡片样式
	if (opts.style && jQuery.trim(opts.style).length > 0) {
		this._container.css(StrToJson(opts.style));
	}
	
	// change事件相应函数数组
	this._changeFuncs = [];
};
/**
 * 获取blank
 */
rh.ui.Date.prototype.getBlank = function() {
	return this._container;
};
/**
 * 清空
 */
rh.ui.Date.prototype.clear = function() {
	this.setValue("");
};
/**
 * 获取Label
 * 
 * @return {} 返回Label对象
 */
rh.ui.Date.prototype.getLabel = function() {
	return this._container.parent().parent().find("#" + this._opts.id + "_label");
};
/**
 * 获取容器
 */
rh.ui.Date.prototype.getContainer = function() {
	return this._container.parent().parent();
};
/**
 * 获取校验对象
 */
rh.ui.Date.prototype._getValidateObj = function() {
	return this._container;
};
/**
 * 获取输入框对象
 */
rh.ui.Date.prototype.getObj = function() {
	return this._obj;
};
/**
 * 校验是否为空
 */
rh.ui.Date.prototype.isNull = function() {
	return jQuery.trim(this._obj.val()).length == 0;
};
/**
 * 返回jquery对象的html，便于调试
 */
rh.ui.Date.prototype.toString = function() {
	return jQuery('<div></div>').append(this._container).clone().remove().html();
};
/**
 * 设置Date表单默认值
 */
rh.ui.Date.prototype.fillDefault = function() {
	// 设置表单默认值，取得是系统的变量，如果是自己构造的测试数据这行会报错
	this.fillData(System.getVar(this._default));
	// 把默认值设置到UI
	this.setValue(System.getVar(this._default));
};
/**
 * 设置Date
 */
rh.ui.Date.prototype.fillData = function(val) {
	this._obj.val(val);
	this._oldValue = val;
};

/**
 * 重新设置时间
 */
rh.ui.Date.prototype.setValue = function(val) {
	this.fillData(val);
	this.onchange();
};

/**
 * 获取时间
 */
rh.ui.Date.prototype.getValue = function() {
	return this._obj.val();
};

/**
 * 设置change事件回调方法
 * 这里比较特殊，似乎wdate已经使用了onchange事件，所以自己管理change事件相应函数
 * @param {} func
 */
rh.ui.Date.prototype.change = function(func) {
	if (func) {
		this._changeFuncs.push(func);
	}
};


/**
 * 触发change事件
 */
rh.ui.Date.prototype.onchange = function() {
	var len = this._changeFuncs.length;
	var theValue = this.getValue();
	if (theValue != this._oldValue) {
		this._oldValue = this.getValue();
		for (var i = 0; i < len; i++) {
			this._changeFuncs[i].call(this._obj);
		}
	}
};

/**
 * 使时间框无效
 */
rh.ui.Date.prototype.disabled = function() {
	var date = this._obj;
	date.attr("readonly", true).addClass("disabled");
	date.css({"cursor" : "default"});
	date.unbind("focus").focus(function() {
		date.trigger("blur");
	});
	date.unbind("click");
	date.unbind("blur");
	this._container.addClass("disabled");
};

/**
 * 使时间框有效
 */
rh.ui.Date.prototype.enabled = function() {
	var _self = this;
	var date = _self._obj;
	date.attr("readonly", false).removeClass("disabled");

	date.css({"cursor" : "pointer"});

	date.click(function() {
		_self.setDatePicker(_self._opts.item_input_config);
	});

	date.focus(function() {
		_self.setDatePicker(_self._opts.item_input_config);
	});

	date.blur(function() {
		if (_self._opts.isNotNull) {
			if (_self.isNull()) {// 非空校验
				_self._container.showError("该项必须输入！");
			} else {
				_self._container.showOk();
			}
		}
	});
	this._container.removeClass("disabled");
};

/**
 * 根据输入模式显示不同的WdatePicker输入模式
 * 
 * @return {}
 */
rh.ui.Date.prototype.setDatePicker = function(config) {
	var _self = this;
	var configArray = new Array();
	if (!config) {// 如果config没传则为默认输入模式
		configArray[0] = "DATE";
	} else {
		configArray = config.split(",");
		if (configArray.length == 0) {
			configArray[0] = "DATE";
		}
	}

	var onClickStr = "";
	var dateType = configArray[0];
	switch (dateType) {
		case "DATETIME" :
			onClickStr = "WdatePicker({startDate:'%y-%MM-%dd %H:%m:%ss',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:false,onpicked:function(){_self.onchange();}";
			break;
		case "DATETIMEH" :
			onClickStr = "WdatePicker({startDate:'%y-%MM-%dd %H',dateFmt:'yyyy-MM-dd HH',alwaysUseStartDate:true,onpicked:function(){_self.onchange();}";
			break;
		case "DATETIMEHM" :
			onClickStr = "WdatePicker({startDate:'%yyyy-%MM-%dd %HH:%mm',dateFmt:'yyyy-MM-dd HH:mm',alwaysUseStartDate:true,onpicked:function(){_self.onchange();}";
			break;
		case "YEAR" :
			onClickStr = "WdatePicker({startDate:'%yyyy',dateFmt:'yyyy',onpicked:function(){_self.onchange();}";
			break;
		case "MONTH" :
			onClickStr = "WdatePicker({startDate:'%yyyy-%MM',dateFmt:'yyyy-MM',alwaysUseStartDate:true,onpicked:function(){_self.onchange();}";
			break;
		case "CUSTOM" :
			onClickStr = "WdatePicker({startDate:'" + configArray[2]
					+ "',dateFmt:'" + configArray[3] + "',alwaysUseStartDate:"
					+ configArray[4] + ",onpicked:function(){_self.onchange();}";
			break;
		case "TIME" :
			onClickStr = "WdatePicker({startDate:'',dateFmt:'H:mm',alwaysUseStartDate:true,onpicked:function(){_self.onchange();}";
			break;
		default :
			onClickStr = "WdatePicker({onpicked:function(){_self.onchange();}";
	}

	onClickStr += "})";
	eval(onClickStr);
};

/**
 * 隐藏该字段
 */
rh.ui.Date.prototype.hide = function() {
	this.isHidden = true;
	this._container.parent().parent().hide();
};

/**
 * 显示该字段
 */
rh.ui.Date.prototype.show = function() {
	this.isHidden = false;
	this._container.parent().parent().show();
};

/**
 * 设置Date为必须输入项
 */
rh.ui.Date.prototype.setNotNull = function(bool) {
	this._opts.isNotNull = bool;
};
/* ui.rh.Date定义结束 */

/**
 * 字典选择,分为单行文本和多行文本
 * 
 * @param {}
 *            options
 */
rh.ui.DictChoose = function(options) {
	var _self = this;
	this.type = "DictChoose";
	var opts = {
		id : "",
		pId : "",
		name : "",
		cls : "ui-dict-default",
		_default : "",
		width : 0,
		isNotNull : false,
		isEdit : 2, // 是否可编辑
		textType : "text", // text,textarea
		dict : {}, // 字典，根据_default获取字典项的name
		formHandler : null
	};
	// 把参数复制到对象opts中
	this._opts = jQuery.extend(opts, options);
	// 是否隐藏
	this.isHidden = this._opts.isHidden;
	// 是否可编辑
	this._isEdit = this._opts.isEdit;
	// 真实id
	this._id = opts.item_code;
	// 下面填充表单默认值要用到
	this._default = opts._default;
	// 默认name
	this._defaultName = opts._defaultName;
	//form句柄
	this._formHandler = this._opts.formHandler;
	this._dict = opts.dict;
	if (opts.textType == "text") {// 显示name
		this._obj = this.obj = jQuery("<input class='" + opts.cls + "' id='" + opts.id
				+ "__NAME' type='text' name='" + opts.name + "' />");
	} else if (opts.textType == "textarea") {
		this._obj = this.obj = jQuery("<textarea class='" + opts.cls
			+ "' wrap='soft' rows='5' cols='7' id='" + opts.id
			+ "__NAME' type='text' name='" + opts.name + "'></textarea>");
	}
	// 隐藏框
	this._valueHidden = jQuery("<input id='" + opts.id + "' type='hidden' />");
	// 取消选择样式
	this._cancelClass = "icon-input-clear";
	// 选择
	this._choose = jQuery("<span title='点击选择' class='iconChoose " + this.getBackClass() + "' ></span>");
	// 取消选择
	this._cancel = jQuery("<span title='点击清除内容' class='iconCancel " + this._cancelClass + "'></span>");
	// obj容器
	this._container = jQuery("<div class='blank' style='cursor:pointer;position:relative;'></div>")
		.append(this._obj).append(this._choose).append(this._cancel).append(this._valueHidden);
	
	if (opts.textType == "textarea") {
		this._container.css({"height":"65px"});
	}
	
	// 设置宽度
	if (parseInt(opts.width) > 0) {
		this._container.width(opts.width);
	}
	
	// 卡片样式
	if (opts.style && jQuery.trim(opts.style).length > 0) {
		this._container.css(StrToJson(opts.style));
	}
	
	// 动态计算图片按钮的绝对位置，以及输入框的高度
	if (opts.textType == "textarea") {
		var top = (this._container.height() - 18) + "px";
		this._choose.css({"top":top});
		this._cancel.css({"top":top});
		this._obj.css({"height":(this._container.height() - 1) + "px","overflow":"auto"});
	}
	
	if (opts.isReadOnly) {
		this.disabled();
	} else {
		this.enabled();
	}
	
	// 复制之后回调该方法
	this.callback = null;
	
	// change事件回调函数数组
	this._changeFuncs = [];

	// 有效性校验
	if(this._opts.isNotNull){
		var _self = this;
		_self._obj.blur(function() {
			_self.validate();
		});
	}

};

/**
 *有效性校验（只做了非空校验）
 */
rh.ui.DictChoose.prototype.validate = function() {
	var _self = this;
	if (_self._opts.isNotNull) {
		if (_self.isNull()) {// 非空校验
			_self._container.showError("该项必须输入！");
		} else {
			_self._container.showOk();
		}
	}
}

/**
 * 获取blank
 */
rh.ui.DictChoose.prototype.getBlank = function() {
	return this._container;
};
/**
 * 根据字典类型获取字典背景样式class
 * @return {} 返回字典选择背景样式class
 */
rh.ui.DictChoose.prototype.getBackClass = function() {
	// 根据字典ID来决定字典选择框背景图片
	var dictId = this._opts.item_input_config.toUpperCase();
	var backClass = "icon-input-";
	// user dept role org
	if (dictId.indexOf("USER") >= 0) {
		backClass += "user";
	} else if (dictId.indexOf("DEPT") >= 0) {
		backClass += "dept";
	} else if (dictId.indexOf("ROLE") >= 0) {
		backClass += "role";
	} else if (dictId.indexOf("ORG") >= 0) {
		backClass += "org";
	} else {
		backClass += "dict";
	}
	return backClass;
};
/**
 * 获取Label
 * @return {} 返回Label对象
 */
rh.ui.DictChoose.prototype.getLabel = function() {
	return this._container.parent().parent().find("#" + this._opts.id + "_label");
};
/**
 * 获取容器
 */
rh.ui.DictChoose.prototype.getContainer = function() {
	return this._container.parent().parent();
};
/**
 * 获取校验对象
 */
rh.ui.DictChoose.prototype._getValidateObj = function() {
	return this._container;
};
/**
 * 获取DictChoose jQuery对象
 */
rh.ui.DictChoose.prototype.getObj = function() {
	return this._obj;
};
/**
 * 校验是否为空
 */
rh.ui.DictChoose.prototype.isNull = function() {
	var isNull = false;
	if (!this.getText() || this.getText().length == 0) {
		isNull = true;
	}
	return isNull;
};
/**
 * 返回jquery对象的html，便于调试
 */
rh.ui.DictChoose.prototype.toString = function() {
	return jQuery('<div></div>').append(this._container).clone().remove().html();
};
// 通过DICT_ID获取字典默认值
rh.ui.DictChoose.prototype.getDictDefaultName = function(val) {
	// 把默认值分拆出来，字典项value
	// 通过字典项value找到字典项name
	var dictNames = "";
	if (val) {
		var codes = val.split(",");
		var len = codes.length;
		for (var i = 0; i < len; i++) {
			if (dictNames == "") {
				dictNames += FireFly.getDictNames(this._dict, codes[i]);
			} else {
				dictNames += "," + FireFly.getDictNames(this._dict, codes[i]);
			}
		}
	}
	return dictNames;
};
/**
 * 清除字典选择当前数据
 */
rh.ui.DictChoose.prototype.clear = function() {
	this._obj.val("");
	this._valueHidden.val("");
};
/**
 * 设置Text表单默认值
 */
rh.ui.DictChoose.prototype.fillDefault = function(val) {
	// 设置name到文本框到
	if (val) {
		if (this.getDictDefaultName(val)) {
			this.setText(this.getDictDefaultName(val));
		} else {
			if (!this._opts.isReadOnly) {
				this._oldValue = this._def
				this.setText(this._def);
			}
		}
	} else {
		if (this._default != this._defaultName) {
			if (this._default) {
				this.setValue(this._default);
			}
			
			if (this._defaultName) {
				this._oldValue = this._defaultName
				this.setText(this._defaultName);
			}
		}
	}
};
/**
 * 设置input框的值
 */
rh.ui.DictChoose.prototype.fillData = function(val, data) {
	this.setValue(val);
	// 设置字典选择框的文本，也就是字典默认值对应的name
	if (data) {
		if (!data[this._id + "__NAME"]) {
			this.fillDefault(val);
		} else {
			this._oldValue = data[this._id + "__NAME"];
			this.setText(data[this._id + "__NAME"]);
		}
		//如果是用户字段，则添加在线状态
		if (data[this._id + "__STATUS"]) {
			this._lineStatus = jQuery("<div>&nbsp;</div>").bind("mouseover",function(event){
				new rh.vi.userInfo(event, val);
			}).appendTo(this._container);
			//判断当前用户在线状态
			if (data[this._id + "__STATUS"] == UIConst.STR_NO) {
				this._lineStatus.addClass("rh-user-info-offline-status").attr("title", "离线");
			} else if (data[this._id + "__STATUS"] == UIConst.STR_YES) {
				this._lineStatus.addClass("rh-user-info-online-status").attr("title", "在线");
			}
		}
	} else {// 如果没有data的话，则去字典数组里递归查找
		this.fillDefault(val);
	}
};
/**
 * 重新设置字典选择框的值
 * @param val 值
 * @param toQueryName 是否去查找name
 */
rh.ui.DictChoose.prototype.setValue = function(val, toQueryName) {
	this._valueHidden.val(val);
	if (toQueryName) {
		this.setText(""); // 清空
		var dictName = this._opts.item_input_config.split(",")[0];
		this.setName(this._formHandler.cardObj._data.DICTS[dictName]);
	}
};
/**
 * 获取字典选择框的值
 */
rh.ui.DictChoose.prototype.getValue = function() {
	return this._valueHidden.val();
};
/**
 * 获取字典选择框文本
 */
rh.ui.DictChoose.prototype.getText = function() {
	if (this._obj.val() == this._def) {
		return "";
	}
	return this._obj.val();
};
/**
 * 重新设置字典选择框文本
 */
rh.ui.DictChoose.prototype.setText = function(val) {
	this._obj.val(val);
};
/**
 * 从字典数据里找出Name
 * @param {} data 字典数据
 */
rh.ui.DictChoose.prototype.setName = function(data) {
	var id = this.getValue();
	var ids = id.split(",");
	var len = ids.length;
	for (var i = 0; i < len; i++) {
		this._setName(ids[i], data);
	}
};
/**
 * 通过id去匹配字典数据里的NAME
 * @param {}  id 所要匹配的id
 * @param {}  data 字典数据
 */
rh.ui.DictChoose.prototype._setName = function(id, data) {
	var len = data.length;
	for (var i = 0; i < len; i++) { // 遍历查找NAME
		if (id == data[i].ID) {
			if (this.getText() && this.getText().length > 0) {
				this.setText(this.getText() + "," + data[i].NAME);
			} else {
				this.setText(data[i].NAME);
			}
			return true; // 找到了
		}

		if (data[i].CHILD) {
			var ret = this.setName(data[i].CHILD);
			if (ret) { // 找到了则直接返回，不进行余下的循环
				return true;
			}
		}
	}
	return false; // 没有找到
};

/**
 * @return 取得服务定义字段定义中配置的值
 */
rh.ui.DictChoose.prototype._getConfigVal = function(){
	var _self = this;
	var config = _self._opts.item_input_config;
	if (_self._formHandler && _self._formHandler.getItemsValues()) {//替换字段级变量
		config = Tools.itemVarReplace(config,_self._formHandler.getItemsValues());
	}
	
	return config;
}

/**
 * @return 取得服务定义字段定义中配置的值，并转换成json对象
 */
rh.ui.DictChoose.prototype._getConfigObj = function(){
	var _self = this;
	var config = _self._getConfigVal();
	var confArray = config.split(",");
	
	var conf = confArray.slice(1);
	var jsonObj = StrToJson(conf.join(","));
	
	return jsonObj;
}

/**
 * 构造字典选择树
 */
rh.ui.DictChoose.prototype._buildTree = function(event) {
	var _self = this;
	var config = _self._getConfigVal();
	var options = {
		"itemCode" : _self._opts.id,
		"config" : config,
		"parHandler" : _self,
		"hide" : "explode",
		"show" : "blind",
		"formHandler" : _self._formHandler,
		"afterFunc" : function(id, value) {
			// 触发change事件
			_self.onchange();
			if (id) {
				_self._container.showOk();
			} else {
				if (!_self.getText() || _self.getText().length == 0) {
					_self._container.showError();
				}
			}
			if (typeof(_self.callback) == "function") {
				_self.callback.call(_self,id,value);
			}
		}
	};
	var dictView = new rh.vi.rhDictTreeView(options);
	dictView.show(event);
	dictView.tree.selectNodes(_self.getValue().split(","));
};
/**
 * 使文本框无效
 */
rh.ui.DictChoose.prototype.disabled = function() {
	var _self = this;
	_self._obj.attr("readonly", true).addClass("disabled");
	// 输入框
	_self._obj.css({"cursor" : "default"});
	_self._obj.unbind("blur");
	_self._obj.unbind("click");

	// 选择按钮
	_self._choose.removeClass(this.getBackClass());
	_self._choose.css({"cursor" : "default"});
	_self._choose.unbind("click");
	// 取消按钮
	_self._cancel.css({"cursor" : "default"});
	_self._cancel.unbind("click");
	_self._cancel.removeClass(this._cancelClass);
	_self._container.addClass("disabled");
};
/**
 * 使文本框有效
 */
rh.ui.DictChoose.prototype.enabled = function() {
	var _self = this;
	_self._obj.attr("readonly", true).removeClass("disabled");

	// 输入框事件和样式
	_self._obj.css({"cursor" : "pointer"});
	_self._obj.unbind("click").click(function(event) {
		_self._choose.click();//模拟点击选择图标
		return false;
	});
	// 选择按钮事件和样式
	_self._choose.css({"cursor" : "pointer"});
	_self._choose.addClass(_self.getBackClass());
	_self._choose.unbind("click").click(function(event) {
		_self._buildTree(event);
		return false;
	});
	// 取消按钮事件和样式
	_self._cancel.css({"cursor" : "pointer"});
	_self._cancel.addClass(_self._cancelClass);
	_self._cancel.unbind("click").click(function(event) {
		_self.setValue("");
		_self.setText("");
		_self.validate();
		var confObj = _self._getConfigObj()  || {};
		if(confObj && confObj.nameItemCode){  //如果定义了其它保存数据的字段，则清空相关字段的值
			var itemObj = _self._formHandler.getItem(confObj.nameItemCode);
			if(itemObj){
				itemObj.setValue("");
			}
		}
		// 触发change事件
		_self.onchange();
		return false;
	});
	_self._container.removeClass("disabled");
};

/**
 * 隐藏该字段
 */
rh.ui.DictChoose.prototype.hide = function() {
	this.isHidden = true;
	this._container.parent().parent().hide();
};

/**
 * 显示该字段
 */
rh.ui.DictChoose.prototype.show = function() {
	this.isHidden = false;
	this._container.parent().parent().show();
};

/**
 * 设置DictChoose为必须输入项
 */
rh.ui.DictChoose.prototype.setNotNull = function(bool) {
	this._opts.isNotNull = bool;
};
/**
 * DictChoose change事件
 * @param func 响应函数
 */
rh.ui.DictChoose.prototype.change = function(func) {
	if (func) {
		this._changeFuncs.push(func);
	}
};
/**
 * change响应函数
 */
rh.ui.DictChoose.prototype.onchange = function() {
	var len = this._changeFuncs.length;
	var theValue = this.getText();
	if (this._oldValue != theValue) {
		this._oldValue = theValue;
		for (var i = 0; i < len; i++) {
			this._changeFuncs[i].call(this);
		}
	}
};
/* ui.rh.DictChoose定义结束 */

/**
 * 查询选择,分为单行文本和多行文本
 * 
 * @param {}
 *            options
 */
rh.ui.QueryChoose = function(options) {
	var _self = this;
	this.type = "QueryChoose";
	var opts = {
		id : "",
		pId : "",
		name : "",
		cls : "ui-query-default",
		_default : "",
		width : 0,
		isEdit : 2, // 1是可选可录入，2是不可以
		isNotNull : false,
		textType : "text", // text,textarea
		formHandler : null
	};

	// 赋值完成之后的事件
	this.callback = function() {};
	
	// 把参数复制到对象opts中
	this._opts = jQuery.extend(opts, options);

	// 是否隐藏
	this.isHidden = this._opts.isHidden;

	// 下面填充表单默认值要用到
	this._default = opts._default;

	if (opts.textType == "text") {// 显示name
		this._obj = this.obj = jQuery("<input class='" + opts.cls + "' id='" + opts.id
				+ "' type='text' name='" + opts.name + "'  readonly='true' />");

	} else if (opts.textType == "textarea") {
		this._obj = this.obj = jQuery("<textarea class='" + opts.cls
			+ "' wrap='soft' rows='5' cols='7' style='" + opts.style
			+ " id='" + opts.id + "' type='text' name='" + opts.name
			+ "' readonly='true'></textarea>");
	}

	// 取消选择样式
	this._cancelClass = "icon-input-clear";
	
	// 查询选择
	this._choose = jQuery("<span title='点击选择' class='iconChoose " + this.getBackClass() + "'></span>");
	
	// 取消选择
	this._cancel = jQuery("<span title='点击清除内容' class='iconCancel " + this._cancelClass + "'></span>");
	
	this._container = jQuery("<div class='blank' style='cursor:pointer;position:relative;'></div>")
		.append(this._obj).append(this._choose).append(this._cancel);
	
	if (opts.textType == "textarea") {
		this._container.css({"height":"65px"});
	}
	
	// 设置宽度
	if (parseInt(opts.width) > 0) {
		this._container.width(opts.width);
	}
	
	// 卡片样式
	if (opts.style && jQuery.trim(opts.style).length > 0) {
		this._container.css(StrToJson(opts.style));
	}
	
	// 动态计算图片按钮的绝对位置，以及输入框的高度
	if (opts.textType == "textarea") {
		var top = (this._container.height() - 18) + "px";
		this._choose.css({"top":top});
		this._cancel.css({"top":top});
		this._obj.css({"height":(this._container.height() - 1) + "px","overflow":"auto"});
	}
	
	if (opts.isReadOnly) {// 只读
		this.disabled();
	} else {
		this.enabled();
	}

	// change事件响应函数数组
	this._changeFuncs = [];
	// 有效性校验
	if(this._opts.isNotNull){
		var _self = this;
		_self._obj.blur(function() {
			_self.validate();
		});
	}
};

/**
 *有效性校验（只做了非空校验）
 */
rh.ui.QueryChoose.prototype.validate = function() {
	var _self = this;
	if (_self._opts.isNotNull) {
		if (_self.isNull()) {// 非空校验
			_self._container.showError("该项必须输入！");
		} else {
			_self._container.showOk();
		}
	}
}

/**
 * 获取blank
 */
rh.ui.QueryChoose.prototype.getBlank = function() {
	return this._container;
};
/**
 * 修改查询条件
 */
rh.ui.QueryChoose.prototype.changeWhere = function(where) {
	var _self = this;
	if (_self._opts.item_input_config && _self._opts.item_input_config.length > 0) {
		var servId = _self._opts.item_input_config.substr(0, _self._opts.item_input_config.indexOf(","));
		var config = _self._opts.item_input_config.substr(_self._opts.item_input_config.indexOf(",") + 1);
		var configObj = StrToJson(config);
		configObj.EXTWHERE = where;
		_self._opts.item_input_config = servId + "," + JsonToStr(configObj);
	}
};

/*
 * 展现动态菜单
 */
rh.ui.QueryChoose.prototype._suggest = function(){
	var _self = this;	
    if (_self._opts.item_input_config && _self._opts.item_input_config.length > 0) {
	      var servId = _self._opts.item_input_config.substr(0,_self._opts.item_input_config.indexOf(","));
	      var config = _self._opts.item_input_config.substr(_self._opts.item_input_config.indexOf(",") + 1);
          var configObj = StrToJson(config);
          var source = configObj.SOURCE;
          var where = configObj.EXTWHERE;
	      var column = "";
          if(source.indexOf("~")<1){
        	  column = source;
          }else{
        	  column = source.split("~")[0];
          }
          var temp = {"url":servId+".query.do","data":{"SUGGEST":column},"obj":_self.obj,"_extWhere":where,"formHandler":_self._opts.formHandler};
          new rh.ui.suggest(temp);
    }
};
/**
 * 构造查询界面
 * 
 * @param {}
 *            event
 */
rh.ui.QueryChoose.prototype._buildQuery = function(event) {
	var _self = this;
	var options = {
		"itemCode" : _self._opts.id,
		"config" : _self._opts.item_input_config,
		"parHandler" : _self,
		"formHandler" : _self._opts.formHandler,
		"replaceCallBack" : function(arr) {
			// 触发change事件
			_self.onchange();
			if (!jQuery.isEmptyObject(arr)) {
				_self._container.showOk();
			} else {
				if (!_self.getValue() || _self.getValue().length == 0) {
					_self._container.showError();
				}
			}
			_self.callback.call(_self,arr);
		 }
	};
	var queryView = new rh.vi.rhSelectListView(options);
	queryView.show(event);	
	return false;
};

/**
 * 根据字典类型获取字典背景样式class
 * 
 * @return {} 返回字典选择背景样式class
 */
rh.ui.QueryChoose.prototype.getBackClass = function() {
	// 根据字典ID来决定字典选择框背景图片
	return "icon-input-select";
};

/**
 * 获取Label
 * 
 * @return {} 返回Label对象
 */
rh.ui.QueryChoose.prototype.getLabel = function() {
	return this._container.parent().parent().find("#" + this._opts.id + "_label");
};

/**
 * 获取容器
 */
rh.ui.QueryChoose.prototype.getContainer = function() {
	return this._container.parent().parent();
};
/**
 * 获取校验对象
 */
rh.ui.QueryChoose.prototype._getValidateObj = function() {
	return this._container;
};
/**
 * 获取QueryChoose jQuery对象
 */
rh.ui.QueryChoose.prototype.getObj = function() {
	return this._obj;
};
/**
 * 校验是否为空
 */
rh.ui.QueryChoose.prototype.isNull = function() {
	return (!this.getValue() || this.getValue().length == 0);
};

/**
 * 返回jquery对象的html，便于调试
 */
rh.ui.QueryChoose.prototype.toString = function() {
	return jQuery('<div></div>').append(this._container).clone().remove().html();
};

/**
 * 清除字典选择当前数据
 */
rh.ui.QueryChoose.prototype.clear = function(event) {
	var _self = this;
	//默认清空关联字段
	_self._formHandler = _self._opts.formHandler;
	var config = _self._opts.item_input_config;
	var confArray = config.split(",");
	if ((confArray.length > 1) && _self._formHandler) {//关联字段也清空
		var conf = confArray.slice(1);
		_self._confJson = StrToJson(conf.join(","));
		_self._target = _self._confJson && (_self._confJson.TARGET) ? _self._confJson.TARGET.split("~"):"";
		_self._linkClear = _self._confJson && (_self._confJson.LINKCLEAR == false || _self._confJson.LINKCLEAR == "false") ? _self._confJson.LINKCLEAR:"true";
		if (_self._linkClear == true || _self._linkClear == "true") {//不要关联清除
			jQuery.each(_self._target,function(i,n) {
				if (n.length > 0) {
					_self._formHandler.getItem(n).setValue("");
				}
			});
		}
	}
	_self.setValue("");
	return false;
};

/**
 * 设置Text表单默认值
 */
rh.ui.QueryChoose.prototype.fillDefault = function() {
	if (this._default && this._default.length > 0) {
		// 设置表单默认值，取得是系统的变量
		var sysVar = System.getVar(this._default);

		if (!sysVar || sysVar.length == 0) {
			this.fillData(this._def);
		} else {
			this.fillData(sysVar);
		}
	}
};

/**
 * 设置input框的值
 */
rh.ui.QueryChoose.prototype.fillData = function(val) {
	if (val && val.length > 0) {
		this._oldValue = val;
		this.setValue(val);
	}
};

/**
 * 重新设置字典选择框的值
 */
rh.ui.QueryChoose.prototype.setValue = function(val) {
	this._obj.val(val);
};

/**
 * TODO:完善，设置输入框内部的链接样式
 */
rh.ui.QueryChoose.prototype._setInputLink = function() {
	var _self = this;
	this.obj.css("text-decoration", "underline").css("color", "blue").css("cursor", "hand");
	var config = this._opts.item_input_config;
	config = config.split(",");
	var sid = config[0];
	var openName = jQuery(".ui-label-default", this._container.parent().parent()).text();
	this._obj.bind("click", function(event) {
		var value = _self.getValue();
		if (value.length == 0) {
			return false;
		}
		var options = {
			"url" : sid + ".card.do?pkCode=" + value,
			"tTitle" : "查看-" + openName,
			"menuFlag" : 3
		};
		Tab.open(options);
		event.stopPropagation();
	});
};

/**
 * 获取字典选择框的值
 */
rh.ui.QueryChoose.prototype.getValue = function() {
	return this._obj.val();
};

/**
 * 使文本框无效
 */
rh.ui.QueryChoose.prototype.disabled = function() {
	var _self = this;
	_self._obj.attr("readonly", true).addClass("disabled");
	
	// 输入框
	_self._obj.css({"cursor" : "default"});
	_self._obj.unbind("click");
	_self._obj.unbind("blur");
	
	// 选择按钮
	_self._choose.removeClass(this.getBackClass());
	_self._choose.css({"cursor" : "default"});
	_self._choose.unbind("click");
	
	// 取消按钮
	_self._cancel.removeClass(this._cancelClass);
	_self._cancel.css({"cursor" : "default"});
	_self._cancel.unbind("click");
	_self._container.addClass("disabled");
	
	
	//modify 访问外部数据
	_self._obj.unbind("click").click(function(event) { // 点击时弹出选择树
		
	var config = _self._opts.item_input_config;
	//查询选择数据源是否为url
	//当数据源为url，我们将打开该url
	//当数据源为系统服务，我们将使用dialog打开
	var isOpenUrl = false;
	if (config && (config.substr(0,1)=="/" || config.substr(0,7) == "http://")) {
		isOpenUrl = true;
	} else {
		isOpenUrl = false;
	}
	//解析url查询选择配置 ${url},${link}
	var configArray = new Array();
	if (isOpenUrl) {
		configArray = config.split(",");
		if (configArray.length == 0) {
			configArray[0] = config;
		}
	} else {
		return;
	}
	
	//当我们配置了打开连接，点击数据时将打开指定url
	if (configArray[1]){
		var selectUrl = configArray[0];
		var targetUrl = configArray[1];
		var selectArray = selectUrl.split("&");
		//标题item
		var titleItem = "";
		//id item
		var idItem = "";
		for (var i=0; i < selectArray.length; i++) {
			if (selectArray[i].substr(0,3)=="id=" ) {
				idItem = selectArray[i].substr(3);
			}
			if (selectArray[i].substr(0,6)=="title=" ) {
				titleItem = selectArray[i].substr(6);
			}
		}
		
		var idValue = _self._opts.cardObj.getItem(idItem).getValue();
		if (idValue && 0 < idValue) {
			targetUrl = targetUrl.replace("${id}", idValue);
			window.open(targetUrl ,'打开连接','');
		}

	}
		
		});

};

/**
 * 使文本框有效
 */
rh.ui.QueryChoose.prototype.enabled = function() {
	var _self = this;
	var config = _self._opts.item_input_config;
	//查询选择数据源是否为url
	//当数据源为url，我们将打开该url
	//当数据源为系统服务，我们将使用dialog打开
	var isOpenUrl = false;
	if (config && (config.substr(0,1)=="/" || config.substr(0,7) == "http://")) {
		isOpenUrl = true;
	} else {
		isOpenUrl = false;
	}
	//解析url查询选择配置 ${url},${link}
	var configArray = new Array();
	if (isOpenUrl) {
		configArray = config.split(",");
		if (configArray.length == 0) {
			configArray[0] = config;
		}
	}
	
	_self._obj.attr("readonly", false).removeClass("disabled");
	if (_self._opts.isEdit == 2) { // 非可选可录入
		_self._obj.focus(function() { // 非可选可录入不可获取焦点
			_self._obj.trigger("blur");
		});
		_self._obj.css({"cursor" : "pointer"});
		_self._obj.unbind("click").click(function(event) { // 点击时弹出选择树
			
			//当我们配置了打开连接，点击数据时将打开指定url
			if (configArray[1]){
				var selectUrl = configArray[0];
				var targetUrl = configArray[1];
				var selectArray = selectUrl.split("&");
				//标题item
				var titleItem = "";
				//id item
				var idItem = "";
				for (var i=0; i < selectArray.length; i++) {
					if (selectArray[i].substr(0,3)=="id=" ) {
						idItem = selectArray[i].substr(3);
					}
					if (selectArray[i].substr(0,6)=="title=" ) {
						titleItem = selectArray[i].substr(6);
					}
				}
				
				var idValue = _self._opts.cardObj.getItem(idItem).getValue();
				if (idValue && 0 < idValue) {
					targetUrl = targetUrl.replace("${id}", idValue);
					window.open(targetUrl ,'打开连接','');
				} else {
					_self._choose.click();//模拟点击选择
				}
			} else {
				_self._choose.click();//模拟点击选择
			}
			
			return false;
		});
	} else if (_self._opts.isEdit == 1) { // 可选可录入设置
		// 设置回调方法
		_self._obj.css({"cursor" : "auto"});
		_self._obj.unbind("click").click(function(event) { // 点击时弹出选择树
			var s = _self._opts.item_input_config.substr(_self._opts.item_input_config.indexOf(",")+1)
			var json = StrToJson(s);
			var value = json.SUGGEST;
			if(_self._opts.item_input_config.indexOf("SUGGEST")>0 && value=="true"){//展现菜单
			     _self._obj.focus();
			     _self._suggest();
			}
			return false;
		});
	}
	
	// 选择按钮
	_self._choose.css({"cursor" : "pointer"});
	_self._choose.addClass(_self.getBackClass());
	_self._choose.unbind("click").click(function(event) {
		//查询选择url连接
		if (isOpenUrl) {
			window.open(configArray[0] ,'查询连接','');
		} else {
		_self._buildQuery(event);
		}
		return false;
	});
	
	// 取消按钮
	_self._cancel.css({"cursor" : "pointer"});
	_self._cancel.addClass(_self._cancelClass);
	_self._cancel.unbind("click").click(function(event) {
		_self.clear(event);
		//非空校验
		_self.validate();
		// 触发change事件
		_self.onchange();
	});
	_self._container.removeClass("disabled");
};

/**
 * 隐藏该字段
 */
rh.ui.QueryChoose.prototype.hide = function() {
	this.isHidden = true;
	this._container.parent().parent().hide();
};

/**
 * 显示该字段
 */
rh.ui.QueryChoose.prototype.show = function() {
	this.isHidden = false;
	this._container.parent().parent().show();
};

/**
 * 设置QueryChoose为必须输入项
 */
rh.ui.QueryChoose.prototype.setNotNull = function(bool) {
	this._opts.isNotNull = bool;
};
/**
 * QueryChoose change事件
 * @param func 响应函数
 */
rh.ui.QueryChoose.prototype.change = function(func) {
	if (func) {
		this._changeFuncs.push(func);
	}
};
/**
 * change响应函数
 */
rh.ui.QueryChoose.prototype.onchange = function() {
	var len = this._changeFuncs.length;
	var theValue = this.getValue();
	if (this._oldValue != theValue) {
		this._oldValue = theValue;
		for (var i = 0; i < len; i++) {
			this._changeFuncs[i].call(this);
		}
	}
};
/* ui.rh.QueryChoose定义结束 */

/**
 * 图片上传组件
 * 
 * @param {}
 *            options   
 * 输入设置 config的格式: {width:"100px",height:"100px"}   
 */
rh.ui.Image = function(options){
	var _self = this;
	this.type = "Image";   
	var opts = {
		id:"", // 组件ID，上传按钮的id
		name:"", // 组件名称，上传按钮的id
		_default:"",
		width:0,
		isNotNull:false,  //非空
		isReadOnly:false, //只读
		config:{}, //输入配置
		postParams:"", // 这个必须加上否则没法上传
		servID:"", // 服务ID
		style:"",
		queueSize:0, // 一次可上传的文件数，为0不限制队列大小
		isHidden:false, //不显示
		cardObj:null,
		tip:null,
		cls:"ui-imageupload-default"
	};
	
	this._opts = jQuery.extend(opts, options);
	var defaultConfig = {"IMG_WIDTH":"200","IMG_HEIGHT":"200","TYPES":"*.jpeg;*.bmp;*.jpg;*.png;*.gif;",
			"DESC":"上传图片","SERV_ID":opts.servID,"FILE_CAT":opts.itemCode,"VALUE":15};
	
	if (opts.cardObj._pkCode && opts.cardObj._pkCode.length > 0) {
		defaultConfig["DATA_ID"] = opts.cardObj._pkCode;
	}

	this._opts.config = jQuery.extend(defaultConfig, this._opts.config);

	this._file = new rh.ui.File({"config":this._opts.config,"zotn":false});
    
	// 图片显示样式
	this._css = {};
	
	if (this._opts.config.IMG_WIDTH && this._opts.config.IMG_WIDTH.length > 0) {
		this._css["width"] = this._opts.config.IMG_WIDTH;
	}
	if (this._opts.config.IMG_HEIGHT && this._opts.config.IMG_HEIGHT.length > 0) {
		this._css["height"] = this._opts.config.IMG_HEIGHT;
	}
	
    this._input = jQuery("<input type='hidden' id='" + opts.id + "'/>");
    this._container = this._obj = this.obj = jQuery("<div class='" + opts.cls + "'></div>").append(this._input);
    
    // 覆盖显示没有文件
	this._file.showNoneFile = function(){};
    
	// 覆盖填充数据函数
	this._file.fillData = function(fileData) {
		if (!jQuery.isEmptyObject(fileData)) {
			var imageData = fileData[0];
			_self.setValue(imageData["FILE_ID"] + "," + imageData["FILE_NAME"]);
			_self.afterFillData(imageData["FILE_ID"] + "," + imageData["FILE_NAME"]);
		}
	};
	
	this._obj.append(this._file.getObj());
	
	// 取消操作
	this._cancel = jQuery("<span class='cancel' id='" + this._opts.id + "_cancel" + "'>" +
			"<a class='rh-icon rhGrid-btnBar-a' id='" + this._opts.servID + "-delete' actcode='delete'>" +
			"<span class='rh-icon-inner'>取消</span><span class='rh-icon-img btn-delete'/></a>" +
			"</span>").click(function(){
		_self._input.val("");
		_self._obj.parent().find(".ui-image-default").remove();
		// 触发change事件
		_self.onchange();
	});
	this._file.getObj().find(".uploadBtn").first().after(this._cancel);
	
	// 没有权限时取消按钮也隐藏
	if (defaultConfig.VALUE && defaultConfig.VALUE == "0") {
		this._cancel.hide();
	}
	
	if (opts.isReadOnly) {
		this.disabled();
	} 
	
	// chagne事件响应函数数组
	this._changeFuncs = [];
};
/**
 * 获取Label
 * @return {} 返回Label对象
 */
rh.ui.Image.prototype.getLabel = function() {
	return this._container.parent().parent().find("#" + this._opts.id + "_label");
};
/**
 * 设置图片上传的列表
 */
rh.ui.Image.prototype.setValue = function(val){
	this._input.val(val);
	var showType = this._opts.config.SHOWTYPE || "flash";
	if(System.getVar("@C_SY_IMG_SHOW_TYPE@")) {
		showType = System.getVar("@C_SY_IMG_SHOW_TYPE@");
	}
	var id_name = val.split(",");
	var fileId = id_name[0];
	var fileName = id_name[1];
	this._obj.parent().find(".ui-image-default").remove();
	if(showType != "flash") {
		this._obj.before(jQuery("<img class='ui-image-default' title='" + fileName + "' src='"+ FireFly.getContextPath() + "/file/" + fileId + "' style='margin-top:5px;'></img>").css(this._css));
	} else {
		this._obj.before(jQuery("<iframe style='border:0px' class='ui-image-default'></iframe>").attr("src", FireFly.getContextPath() + "/sy/base/frame/coms/imgFlash/picViewerObject.jsp?fileId=" + fileId).css(this._css));
	}
	
	if (this._opts.cardObj) {
		this._opts.cardObj._resetHeiWid();
	}
	
	// 触发change事件
	this.onchange();
};
/**
 * 新上传后填充数据后执行
 */
rh.ui.Image.prototype.afterFillData = function(val) {
};
/**
 * 填充数据
 */
rh.ui.Image.prototype.fillData = function(val) {
	if (val && val.length > 0) {
		this.setValue(val);
	}
};
/**
 * 渲染之后
 */
rh.ui.Image.prototype.afterRender = function() {
	this._file.initUpload();
};
/**
 * 启动上传
 */
rh.ui.Image.prototype.enabled = function() {
	this._file.getObj().show();
	this._cancel.show();
};
/**
 * 获取文件上传的列表
 */
rh.ui.Image.prototype.getValue = function(){
	return this._input.val();
};
/**
 * 禁止上传
 */
rh.ui.Image.prototype.disabled = function() {
	this._file.getObj().hide();
	this._cancel.hide();
};
/**
 * 校验是否为空
 */
rh.ui.Image.prototype.isNull = function() {
	return jQuery.trim(this._input.val()).length == 0;
};
/**
 * 返回最外层div
 */
rh.ui.Image.prototype.getObj = function() {
	return this._obj;
};
/**
 * 返回最外层div
 */
rh.ui.Image.prototype.getContainer = function() {
	return this._container.parent().parent();
};
/**
 * 获取校验对象
 */
rh.ui.Image.prototype._getValidateObj = function() {
	return this._container;
};
/**
 * destory File
 */
rh.ui.Image.prototype.destroy = function() {
	this._file.destroy();
};
/**
 * 隐藏
 */
rh.ui.Image.prototype.hide = function() {
	this._container.parent().parent().hide();
};
/**
 * 显示
 */
rh.ui.Image.prototype.show = function() {
	this._container.parent().parent().show();
};
/**
 * change事件
 * @param func 响应函数
 */
rh.ui.Image.prototype.change = function (func) {
	if (func) {
		this._changeFuncs.push(func);
	}
};
/**
 * 触发change事件
 */
rh.ui.Image.prototype.onchange = function() {
	var len = this._changeFuncs.length;
	for (var i = 0; i < len; i++) {
		this._changeFuncs[i].call(this);
	}
};
/**
 * 字段级文件
 */
rh.ui.ItemFile = function(options) {
	var _self = this;
	this.type = "ItemFile";
	
	var opts = {
		id:"", // 组件ID，上传按钮的id
		name:"", // 组件名称，上传按钮的id
		_default:"",
		width:0,
		isNotNull:false,  //非空
		isReadOnly:false, //只读
		config:{}, //输入配置
		postParams:"", // 这个必须加上否则没法上传
		servID:"", // 服务ID
		style:"",
		isHidden:false, //不显示
		cardObj:null,
		tip:null,
		cls:"ui-itemfile-default"
	};
	
	this._opts = jQuery.extend(opts, options);
	
	var $strArr = new Array();
	
	// 显示框
	$strArr.push("<span id='");
	$strArr.push(opts.id);
	$strArr.push("_NAME' class='")
	$strArr.push(opts.cls);
	$strArr.push("'><span class='fileName'></span><span class='uploadContainer'></span></span>");
	
	this._obj = jQuery($strArr.join(""));
	this._container = jQuery("<div class='blank'></div>").append(this._obj);
	
	// 隐藏数据域
	this._input = jQuery("<input id='" + opts.id + "' type='hidden' />").appendTo(this._container);
	
	// 取得传递参数，和默认参数合并
	var defaultConfig = {"SERV_ID":opts.servID, "FILE_CAT":opts.itemCode, "FILENUMBER":"9999", "VALUE":"15", "TYPES":"*.jpg;*.jpeg;*.png;*.gif;*.doc;*.docx;*.wps;*.xls;*.xlsx;*.ppt;*.pptx;*.txt;*.json;"}
	var config = jQuery.extend(defaultConfig, this._opts.config);
	this._file = new rh.ui.File({
		"config" : config,
		"cardObj" : opts.cardObj
	});
	
	var _uploadContainer = this._obj.find(".uploadContainer").first();
	this._file.getObj().appendTo(_uploadContainer);
	this._cancel = jQuery("<a class='rh-icon rhGrid-btnBar-a' id='" + this._opts.servID + "-delete' actcode='delete'>" +
			"<span class='rh-icon-inner'>取消</span><span class='rh-icon-img btn-delete'/></a>").click(function(){
		_self.clear();
		_self.validate();
		// 触发change事件
		_self.onchange();
	}).appendTo(_uploadContainer);
	
	// 覆盖显示没有文件
	this._file.showNoneFile = function(){};
	
	this._file.fillData = function(fileData) {
		if (!jQuery.isEmptyObject(fileData)) {
			var file = fileData[0];
			_self.fillData(file.FILE_ID + "," + file.FILE_NAME + ";");
		}
	};
	
	// 上传完之后校验
	this._file.afterUploadCallback = function(fileData) {
		if (!jQuery.isEmptyObject(fileData)) {
			_self._getValidateObj().showOk();
		}
	};
	
	// 是否隐藏
	this.isHidden = opts.isHidden;
	
	if (opts.isReadOnly) {
		this.disabled();
	}
	
	// 设置宽度
	if (parseInt(opts.width) > 0) {
		this._container.width(opts.width);
	}
	
	// 卡片样式
	if (opts.style && jQuery.trim(opts.style).length > 0) {
		this._container.css(StrToJson(opts.style));
	}
	
	//this.hide();
	
	// chagne事件响应函数数组
	this._changeFuncs = [];
	
	// 有效性校验
	if(this._opts.isNotNull){
		var file = this;
		file._obj.blur(function() {
			file.validate();
		});
	}
};

/**
 * 有效性校验（现在只做了必填性校验）
 */
rh.ui.ItemFile.prototype.validate = function() {
	if(this._opts.isNotNull){
		if(this.isNull()){
			this._container.showError("该项必须输入！");
		}else{
			this._container.showOk();
		}
	}
}


/**
 * 渲染之后
 */
rh.ui.ItemFile.prototype.afterRender = function() {
	this._file.initUpload();
};
/**
 * 销毁上传组件
 */
rh.ui.ItemFile.prototype.destroy = function() {
	this._file.destroy();
};
/**
 * 获取blank
 */
rh.ui.ItemFile.prototype.getBlank = function() {
	return this._container;
};
/**
 * 获取文件ID
 */
rh.ui.ItemFile.prototype.getFileId = function() {
	var val = this.getValue();
	if (val && val.length > 0 && val.indexOf(";") >= 0) {
		var id_name = val.split(";");
		return id_name[0];
	}
	return;
};
/**
 * 清空
 */
rh.ui.ItemFile.prototype.clear = function() {
	this._obj.find(".fileName").first().html("");
	this._input.val("");
};
/**
 * 设置数据
 */
rh.ui.ItemFile.prototype.setValue = function(val){
	if (val && val.length > 0 && val.indexOf(",") >= 0) {
		var id_name = val.split(",");
		var size = 18;
		var tmpName = id_name[1].split(";");
		var name = tmpName[0];
		if (name.length > size) {// 超过size个字符，则取size的前一半后一半，在title里放置完整的文件名
			var suffix = name.substr(name.length - size / 2, size / 2);
			name = name.substr(0, size / 2) + "..." + suffix;
		}
		this._obj.find(".fileName").first().html("<a href='" + FireFly.getContextPath() + "/file/" + id_name[0] +  "' title='" + tmpName[0] + "' target='_blank'>" + name + "</a>");
		this._input.val(val);
		
		// 触发change事件
		this.onchange();
	}
};
/**
 * 填充数据
 */
rh.ui.ItemFile.prototype.fillData = function(val) {
	if (val && val.length > 0) {
		this.setValue(val);
	}
};
/**
 * 获取值
 */
rh.ui.ItemFile.prototype.getValue = function(){
	return this._input.val();
};
/**
 * 生效
 */
rh.ui.ItemFile.prototype.enabled = function() {
	this._file.getObj().show();
	this._cancel.show();
	this._container.removeClass("disabled");
};
/**
 * 失效
 */
rh.ui.ItemFile.prototype.disabled = function() {
	this._file.getObj().hide();
	this._cancel.hide();
	this._container.addClass("disabled");
};
/**
 * 显示
 */
rh.ui.ItemFile.prototype.show = function() {
	this.isHidden = false;
	this.getContainer().show();
};
/**
 * 隐藏
 */
rh.ui.ItemFile.prototype.hide = function() {
	this.isHidden = true;
	this.getContainer().hide();
};
/**
 * 校验是否为空
 */
rh.ui.ItemFile.prototype.isNull = function() {
	return !this.getValue() || this.getValue().length == 0;
};
/**
 * 获取obj
 */
rh.ui.ItemFile.prototype.getObj = function() {
	return this._obj;
};
/**
 * 获取容器
 */
rh.ui.ItemFile.prototype.getContainer = function() {
	return this._container.parent().parent();
};
/**
 * 获取校验对象
 */
rh.ui.ItemFile.prototype._getValidateObj = function() {
	return this._container;
};
/**
 * change事件
 * @param func 响应函数
 */
rh.ui.ItemFile.prototype.change = function (func) {
	if (func) {
		this._changeFuncs.push(func);
	}
};
/**
 * 触发change事件
 */
rh.ui.ItemFile.prototype.onchange = function() {
	var len = this._changeFuncs.length;
	for (var i = 0; i < len; i++) {
		this._changeFuncs[i].call(this);
	}
};
/**
/**
 * 上传组件
 * @param {} options 构造函数参数
 * options参数说明
 * flash_url					:	flash文件路径
 * upload_url					:	后端处理代码路径
 * postParams					:	上传参数，jsessionid该参数必须有保证在同一个session里上传的，SERV_ID对应的服务ID，DATA_ID对应数据ID，FILE_ID覆盖的文件ID
 * file_size_limit				:	可上传文件的大小，默认单位"KB"，例如："50 KB"，也可这样"50 MB"，0为不限制上传文件大小，但是后台可能会有大小限制，默认为"100 MB"
 * file_types					:	可上传文件类型，以后缀名来区分类型，"*.*"为不限制类型，为了安全起见代码中给出了默认可上传类型，大部分类型都可以
 * file_types_description		:	文件描述信息，默认为为"All Files"
 * file_upload_limit			:	最多可上传文件数，0为不限制数量，默认为"100"
 * file_queue_limit				:	一次最多可选择文件数，0为不限制，默认不限制
 * custom_settings				:	进度条显示dom对象ID
 * debug						:	是否打开调试信息，为true会显示上传信息
 * button_image_url				:	flash按钮背景图片
 * button_placeholder_id		:	放置按钮的dom对象ID
 * button_width					：	按钮宽度
 * button_height				：	按钮高度
 * file_queued_handler			: 	fileQueued，上传列表准备成功事件
 * file_queue_error_handler 	: 	fileQueueError，上传列表准备失败事件
 * file_dialog_complete_handler : 	fileDialogComplete，文件选择框成功弹出事件
 * upload_start_handler 		: 	uploadStart，上传开始事件
 * upload_progress_handler 		: 	uploadProgress，上传进度事件
 * upload_error_handler 		: 	uploadError，上传错误事件
 * upload_success_handler 		: 	uploadSuccess，上传成功事件
 * upload_complete_handler 		: 	uploadComplete，上传完成事件
 * queue_complete_handler 		: 	queueComplete，上传列表完成事件
 */
rh.ui.Upload = function(options) {
	var _self = this;
	this.type = "Upload";
	
	this._defaultTypes = "*.jpg;*.jpeg;*.png;*.gif;*.doc;*.docx;*.wps;*.xls;*.xlsx;*.ppt;*.pptx;*.rar;*.zip;*.7z;*.gz;*.tar;*.txt;*.chm;*.pdf;";
	// 按钮样式
	var btnStyles = options.btnStyles?options.btnStyles:".Button {font-family:宋体;font-size:12px;color:#222222;:hover:#FFFFFF;}";
	// 按钮图片
//	var btnImage = options.btnImage?options.btnImage:"swfupload.png";
	// 按钮名称
//	var text = options.text?options.text:"上传文件";
	// 按钮宽度
	var width = options.width?options.width:"55";
	// 按钮高度
	var height = options.height?options.height:"25";
	// 上边距
	var top = options.top?options.top:"4";
	// 左边距
	var left = options.left?options.left:"0";
	var opts = {
		flash_url : FireFly.getContextPath() + "/sy/base/frame/coms/file/swfupload.swf",
		upload_url : FireFly.getContextPath() + "/file",
		post_params : {"jsessionid" : "\"" + FireFly.jsessionid + "\""},
		use_query_string : true,
		file_size_limit : "100 MB",
		file_types : this._defaultTypes,
		file_types_description : "All Files",
		file_upload_limit : 100,
		file_queue_limit : 0,
		custom_settings : {progressTarget : "fsUploadProgress",cancelButtonId : "btnCancel"},
		debug: false,

		// Button settings
//		button_image_url: FireFly.getContextPath() + "/sy/theme/default/images/card/" + btnImage,
		button_width: width,
		button_height: height,
		button_text: "<span class='Button'>"/* + text*/ + "</span>",
		button_text_style : btnStyles,
		button_text_left_padding: left,
        button_text_top_padding: top,
		
		button_window_mode : SWFUpload.WINDOW_MODE.TRANSPARENT,
		button_cursor : SWFUpload.CURSOR.HAND,
		
		// The event handler functions are defined in handlers.js
		file_queued_handler : fileQueued,
		file_queue_error_handler : fileQueueError,
		file_dialog_complete_handler : fileDialogComplete,
		upload_start_handler : uploadStart,
		upload_progress_handler : uploadProgress,
		upload_error_handler : uploadError,
		upload_success_handler : uploadSuccess,
		upload_complete_handler : uploadComplete,
		queue_complete_handler : queueComplete,	// Queue plugin event
		
		// 其它参数
		cls : "ui-upload-default",
		
		// 传递Upload句柄
		_upload : this
	};
	// 合并自定义参数和默认参数
	this._opts = jQuery.extend(opts, options);
	this._opts.codebase = FireFly.getContextPath() + "/sy/comm/index/file/flash.exe#version=9,0,0,0";
	this.createSwfObj();
};
/**
 * 取消当前上传
 */
rh.ui.Upload.prototype.cancelUpload = function() {
	this.getSwfObj().cancelUpload(null, false);
	this.getSwfObj().cancelQueue();
};
/**
 * 构造上传组件实例
 */
rh.ui.Upload.prototype.createSwfObj = function() {
	var _self = this;
	try {
		this._swfObj = new SWFUpload(this._opts);
	} catch(e) {
		throw e;
	}
};
/**
 * 获取post_params
 */
rh.ui.Upload.prototype.getPostParams = function() {
	return this._opts.post_params;
};
/**
 * 设置已经上传文件个数
 */
rh.ui.Upload.prototype.setUploadFiles = function(num) {
	var stat = this._swfObj.getStats();
	stat.successful_uploads = num;
	this._swfObj.setStats(stat);
};
/**
 * 获取已经上传文件个数
 */
rh.ui.Upload.prototype.getUploadFiles = function() {
	return this._swfObj.getStats().successful_uploads;
};
/**
 * 获取SWFUpload对象
 */
rh.ui.Upload.prototype.getSwfObj = function() {
	return this._swfObj;
};
/**
 * 上传之前的事件 
 */
rh.ui.Upload.prototype.beforeUpload = function(file) {
};
/**
 * 文件成功上传事件
 */
rh.ui.Upload.prototype.uploadSuccess = function(serverData) {
};
/**
 * 文件上传完成事件
 */
rh.ui.Upload.prototype.uploadComplete = function() {
};
/**
 * 整个队列都完成
 */
rh.ui.Upload.prototype.queueComplete = function(numFilesUploaded) {
};
/**
 * 动态添加POST参数
 */
rh.ui.Upload.prototype.addPostParam = function(name, value) {
	this._swfObj.addPostParam(name, value);
};
/**
 * 动态删除POST参数
 */
rh.ui.Upload.prototype.removePostParam = function(name) {
	this._swfObj.removePostParam(name);
};
/**
 * 销毁
 */
rh.ui.Upload.prototype.destroy = function() {
	var swfObj = this.getSwfObj();
	if (swfObj) {
		swfObj.destroy();
	}
};


/*-------------------------------------------iframe初始化组件定义开始-------------------------------------------------------*/
rh.ui.Iframe = function(options) {
	var _self = this;
	this.type = "Iframe";
	var opts = {
		id:"",
		confg:"",
		isHidden : false,
		cardObj:null
	};
	// 把参数复制到对象opts中
	this._opts = jQuery.extend(opts, options);
	// 是否隐藏
	this.isHidden = this._opts.isHidden;
	// 下面填充表单默认值要用到
	this._default = opts._default;
	// 初始化文本框
	this.obj = jQuery("<iframe></iframe>");
	
};

/*
 * 替换系统变量
 */
rh.ui.Iframe.prototype.expFunc = function(tmpExp,cardData) {
	var _self = this;
	tmpExp = Tools.itemVarReplace(tmpExp,cardData);//替换字段级变量
	tmpExp = Tools.systemVarReplace(tmpExp);//替换系统变量
	//tmpExp = Tools.itemVarReplace(tmpExp,_self._linksVars);//关联定义的变量替换
	tmpExp = tmpExp.replace(/undefined/g,'');//替换undefined
	return tmpExp;
};

/**
 * 获取Label
 * 
 * @return {} 返回Label对象
 */
rh.ui.Iframe.prototype.getLabel = function() {
	return this.obj.parent().parent().find("#" + this.opts.id + "_label");
};
/**
 * 获取容器
 */
rh.ui.Iframe.prototype.getContainer = function() {
	return this.obj.parent().parent();
};
/**
 * 获取校验对象
 */
rh.ui.Iframe.prototype._getValidateObj = function() {
	return this.obj;
};
/**
 * 返回jquery对象的html，便于调试
 */
rh.ui.Iframe.prototype.toString = function() {
	return jQuery('<div></div>').append(this.obj).clone().remove().html();
};
/**
 * 设置多行文本框默认值
 */
rh.ui.Iframe.prototype.fillDefault = function() {
};
/**
 * 设置多行文本框的值
 */
rh.ui.Iframe.prototype.fillData = function(val) {
	var _self = this;
	var opts = this._opts;
	var iframeStr = _self.expFunc(opts.confg, opts.cardObj.byIdData);
	iframeStr = iframeStr.replace(/<iframe/g, "<iframe id='" + opts.id + "' ");
	this.obj = this.obj.replaceWith(iframeStr);
	//卡片iframe传递卡片句柄
	if (frames[opts.id]) {
		frames[opts.id]._parentViewer = opts.cardObj;
	}
	// 卡片样式
	if (opts.style && jQuery.trim(opts.style).length > 0) {
		this.obj.css(StrToJson(opts.style));
	}
};
/**
 * 设置值
 */
rh.ui.Iframe.prototype.setValue = function(val) {};
/**
 * 获取多行文本框文本
 */
rh.ui.Iframe.prototype.getValue = function() {};

/**
 * 隐藏该字段
 */
rh.ui.Iframe.prototype.hide = function() {
	this.isHidden = true;
	this.obj.parent().parent().hide();
};
/**
 * 显示该字段
 */
rh.ui.Iframe.prototype.show = function() {
	this.isHidden = false;
	this.obj.parent().parent().show();
};
/**
 * disabled
 */
rh.ui.Iframe.prototype.disabled = function() {
};
/*------------------------------------------------iframe定义结束-----------------------------------------------------------*/

/**
 * spacing : form表单名字 cls : li之间的间距 cols : 列数 action : form表单action data :
 * 构造表单项所需数据
 */
rh.ui.Form = function(options) {
	// 卡片对象
	this.cardObj = options.parHandler;
	this.type = "Form";
	// UI对象容器，一UI的key作为对象的名字
	this._items = {};
	// Form中的所有Label，key就是对应的组件的Key
	this._labels = {};
	// 用于保存当前item值，用于比较查看是否有item值被修改过
	this._data = {};
	// 校验规则
	// {"ITEM_CODE":{"require":"该项必须输入！","validate":{"regular":"^-?(?:\d+|\d{1,}(?:,\d{1,})+)(?:\.\d+)?$","message":"请输入数字！"}}}
	this._validation = {};
	// 用于保存该表单对象里的字段级文件上传对象
	this._files = new Array();
	// 用于保存表单对象中的自定义附件类型的文件上传对象
	this._attachFiles = new Array();
	// 默认关闭的分组
	this._closeFieldset = [];
	// 无处可放的字段项
	this._noHomeItems = [];
	// 字段组合框信息
	// {"COMBO":{"ITEM_CODES":"NAME1,NAME2,NAME3","POSITION":"TOP_CENTER","WRAP":{"NAME1":{"BEFORE":"[","AFTER":"]"}}}}
	this._comboItemOpts = {};
	// {"POSITION":'RIGHT_TOP'}，POSITION包括：LEFT_TOP、CENTER_TOP、RIGHT_TOP
	this._resetPositionOpts = {};
	var opts = {
		id : "",
		pId : "",
		cls : "ui-form-default",
		data : {}
	};
	// 把参数复制到对象opts中
	this._opts = jQuery.extend(opts, options);
	// 当前服务ID
	this._servID = opts.pId;
	// 构造一个div容器把form表单内容全部放到该div中
	this.obj = jQuery("<div></div>");
	this.obj.addClass(opts.cls);
	this._servData = opts.data;
	//src的服务id
	this._servSrcId = this._servData.SERV_SRC_ID;
	// 服务字段的定义
	this.items = opts.data.ITEMS;
	// 字典定义
	this.dicts = opts.data.DICTS;
	// 卡片项默认值
	this._defaults = {};
	//存储只读表达式
	this._expNotNullItems = {};
	//存储必填表达式
	this._expReadItems = {};
	//存储隐藏表达式
	this._expHiddenItems = {};
	//分组框的json格式对象｛"GROUP_ONE":"GROUP_ONE"｝,
	this._groupJson = {};
	// cols：卡片默认列数
	if (opts.data.SERV_CARD_STYLE <= 0 || !opts.data.SERV_CARD_STYLE) {// 如果没有指定列数或者列数为空则默认为2列
		this.cols = 2;
	} else {
		this.cols = parseInt(opts.data.SERV_CARD_STYLE);
	}
	var templFlag = this._servData.SERV_CARD_TMPL || 2;	//获取模版启用标志,默认不启用
	if (templFlag == 1) {
		this._bldTempl();
	} else {// 过滤被禁用的Item和隐藏的Item,按照分组框把opts.data.ITEMS分成诺干个数组
		this.groupArray = this._calcGroup(this._clearDisableAndHiddenItem(this.items));
		for ( var i = 0; i < this.groupArray.length; i++) {
			this._init(this.cols, this.groupArray[i], i);// 构造表单
		}
	}
};
/**
 * 获取字段级文件上传对象
 */
rh.ui.Form.prototype.getFiles = function() {
	return this._files;
};
/**
 * 获取指定ITEM_CODE的字段级文件上传对象
 */
rh.ui.Form.prototype.getFile = function(itemCode) {
	var _self = this;
	if (itemCode) {
		var len = this._files.length;
		for (var index = 0; index < len; index++) {
			var file = this._files[index];
			if (itemCode == file._opts.itemCode) {
				return file;
			}
		}
	}
	alert("字段文件'" + itemCode + "'不存在！");
	return null;
};
/**
 * 获取自定义附件类型的文件上传对象
 */
rh.ui.Form.prototype.getAttachFiles = function() {
	return this._attachFiles;
};
/**
 * 获取指定ITEM_CODE的自定义附件类型的文件上传对象
 */
rh.ui.Form.prototype.getAttachFile = function(itemCode) {
	var _self = this;
	if (itemCode) {
		var len = this._attachFiles.length;
		for (var index = 0; index < len; index++) {
			var file = this._attachFiles[index];
			if (itemCode == file._opts.itemCode) {
				return file;
			}
		}
	}
	alert("附件'" + itemCode + "'不存在！");
	return null;
};
/**
 * 获取Form jQuery对象
 */
rh.ui.Form.prototype.getObj = function() {
	return this.obj;
};
/**
 * 清空
 */
rh.ui.Form.prototype.clear = function() {
	var items = this.getItems();
	for (var key in items) {// 遍历所有表单域
		var item = items[key];
		if (item.clear) {
			item.clear();
		}
	}
};
/**
 * 对组件做额外的处理
 */
rh.ui.Form.prototype.render = function() {
	var _self = this;
	// 收起所有设置为收起的fieldset
	jQuery.each(this._closeFieldset, function(index, item) {
		item.slideToggle(0);
	});
	jQuery("[tip]").colorTip({color:"blue",timeout:0});
};
/**
 * 渲染之后
 */
rh.ui.Form.prototype.afterRender = function() {
	jQuery.each(this.getItems(), function(key, item) {
		if (item.afterRender) {
			item.afterRender();
		}
	});
	// 动态表达式
	this.doExpression();
	// 组合多个字段
	this._comboItem();
	// 重置字段位置
	this._resetPosition();
};
/**
 * 组合多个字段项
 */
rh.ui.Form.prototype._comboItem = function() {
	if (!jQuery.isEmptyObject(this._comboItemOpts)) {
		// 获取要和itemCode组合的字段项CODE
		for (var itemCode in this._comboItemOpts) {
			var combo = this._comboItemOpts[itemCode];
			// 所有需要组合在一起的字段名
			var itemCodes = combo["ITEM_CODES"].split(",");
			// 后缀
			var suffix = combo["SUFFIX"];
			// 分隔符
			var sep = combo["SEP"];
			// 放置位置
			var position = combo["POSITION"];
			// 包装符
			var wraps = combo["WRAP"];
			// 最后一个字段项
			var lastItem = null;
			// 总共合在一起的字段数量
			var sum = itemCodes.length + 1;
			// 当前item
			var firstItem = this.getItem(itemCode);
			// label实际宽度
			var labelWidth = firstItem.getLabel().find(".name").width();
			// 右边内容实际宽度
			var contentWidth = firstItem.getBlank().width();
			// 需要添加分隔符的item
			var addSepItem = firstItem;
			for (var i = 0; i < sum - 1; i++) {
				var tmpItemCode = itemCodes[i];
				// 排除自己
				if (tmpItemCode == itemCode) {
					continue;
				}
				var tmpItem = this.getItem(tmpItemCode);
				if (!tmpItem) {
					alert("字段项" + tmpItemCode + "不存在！");
					return;
				}
				tmpItem.getLabel().remove();
				contentWidth += tmpItem.getBlank().width();
				tmpItem.getBlank().parent().parent().removeClass("inner").hide();
				if (sep && sep.length > 0) {
					addSepItem.getBlank().after(jQuery("<span>" + sep + "</span>").css({"margin":"0 1px 0 1px"}));
					addSepItem = tmpItem;
					firstItem.getBlank().parent().append(tmpItem.getBlank().removeClass("fl").css({"display":"inline-block"}))
				} else {
					firstItem.getBlank().parent().append(tmpItem.getBlank().removeClass("fl").css({"margin-left":"3px","display":"inline-block"}))
				}
				// 加上中间的间隔
				contentWidth += (sum - 1) * 5
				if (i == sum - 2) {
					lastItem = tmpItem;
				}
			}
			
			// 加上后缀
			if (suffix && suffix.length > 0) {
				var suffix = jQuery("<span style='line-height:27px;display:inline-block;'>" + suffix + "</span>");
				lastItem.getBlank().parent().append(suffix);
				contentWidth += suffix.width() + 3;
			}
			
			// 添加包装符
			for (var wrapItemCode in wraps) {
				if (wrapItemCode == itemCode) {
					alert("第一个项不支持前后添加扩符！");
					continue;
				}
				var theItem = this.getItem(wrapItemCode);
				if (!theItem) {
					alert("字段项" + theItemCode + "不存在！");
					continue;
				}
				// 取得包装符
				var wrap = wraps[wrapItemCode];
				if (wrap) {
					var before = wrap["BEFORE"];
					var after = wrap["AFTER"];
					if (before) {// 前包装符
//						alert("before:" + before);
						theItem.getBlank().before(jQuery("<span>" + before + "</span>").css({"margin-right":"2px"}));
					}
					if (after) {// 后包装符
//						alert("after:" + after);
						theItem.getBlank().after(jQuery("<span>" + after + "</span>").css({"margin-left":"2px"}));
					}
				}
			}
		}
	}
};
/**
 * 重置字段位置，支持LEFT_TOP、CENTER_TOP、RHGHT_TOP
 */
rh.ui.Form.prototype._resetPosition = function() {
	if (!jQuery.isEmptyObject(this._resetPositionOpts)) {
		// 获取要重置位置的字段项CODE
		for (var itemCode in this._resetPositionOpts) {
			var resetPosition = this._resetPositionOpts[itemCode];
			var item = this.getItem(itemCode);
			
			/**
			 * 剥去外层右边的无效空间
			 */
			var marginTop = "50px";
			var position = resetPosition.POSITION;
			var width = resetPosition.WIDTH;
			var blank = item.getBlank();
			var left = item.getLabel().parent();
			if (position == "CENTER_TOP") {
				left.width(left.find(".name").first().width() + 15);
			} else {
				left.width(left.width());
			}
			var right = blank.parent();
			var rightPadding = right.parent().width() - left.width() - right.width();
			blank.width(width);
			right.width(blank.width());
			right.parent().parent().css({"position":"relative","margin-top":marginTop});
			right.parent().css({"position":"absolute"}).width(left.width() + right.width());
			
			/**
			 * 采用绝对定位
			 * @TODO 中间和右上角的位置计算还需改进
			 */
			var top = "-50px";
			switch (position) {
				case "LEFT_TOP" : 
					right.parent().css({"top":top,"left":"0px"});
					break;
				case "CENTER_TOP" : 
					right.parent().css({"top":top,"left":(right.parent().parent().width() - right.parent().width() - 15) / 2 + "px"});
					break;
				case "RIGHT_TOP" : 
					right.parent().css({"top":top,"right":rightPadding + "px"});
					break;
				default :
					right.parent().css({"top":top,"right":rightPadding + "px"});
			}
		}
	}
};
/**
 * 处理表达式
 */
rh.ui.Form.prototype.doExpression = function() {
	var _self = this;
	var itemCode,tmpExp,tarItem,len,i;
	
	// 必填
	function doNotNull(item, exp) {
		if (_self.expFunc(exp, true)) {
			_self.setNotNull(item,true);
		} else {
			_self.setNotNull(item,false);
		}
	}
	
	// 只读
	function doReadOnly(item, exp) {
		if (_self.expFunc(exp, true)) {
			item.disabled();
		} else {
			item.enabled();
		}
	}
	
	// 隐藏
	function doHide(item, exp) {
		if (_self.expFunc(exp, true)) {
			item.hide();
		} else {
			item.show();
		}
		item._opts && item._opts.cardObj && item._opts.cardObj.resetSize();
	}
	
	// 必填表达式
	for (itemCode in this._expNotNullItems) {
		tmpExp = this._expNotNullItems[itemCode];
		// 被控对象
		tarItem = this._items[itemCode];
		if (!tarItem) {
			continue;
		}
		// 主控对象集合
		var srcNotNullItems = this._match(tmpExp);
		len = srcNotNullItems.length;
		for (i = 0; i < len; i++) {
			// 匿名函数是为了消除闭包的副作用
			(function(item, exp){
				doNotNull(item, exp);
				srcNotNullItems[i].change(function(){
					doNotNull(item, exp);
				});
			})(itemCode, tmpExp);
		}
	}
	// 只读表达式
	for (itemCode in this._expReadItems) {
		tmpExp = this._expReadItems[itemCode];
		tarItem = this._items[itemCode];
		if (!tarItem) {
			continue;
		}
		var srcReadonlyItems = this._match(tmpExp);
		len = srcReadonlyItems.length;
		for (i = 0; i < len; i++) {
			(function(item, exp){
				doReadOnly(item, exp);
				srcReadonlyItems[i].change(function(){
					doReadOnly(item, exp);
				});
			})(tarItem, tmpExp);
		}
	}
	// 隐藏表达式
	for (itemCode in this._expHiddenItems) {
		tmpExp = this._expHiddenItems[itemCode];
		tarItem = this._items[itemCode];
		if (!tarItem) {
			continue;
		}
		var srcHiddenItems = this._match(tmpExp);
		len = srcHiddenItems.length;
		for (i = 0; i < len; i++) {
			(function(item, exp){
				doHide(item, exp);
				srcHiddenItems[i].change(function(){
					doHide(item, exp);
				});
			})(tarItem, tmpExp);
		}
	}
};
/**
 * 返回匹配的字段数组
 */
rh.ui.Form.prototype._match = function(str) {
	var matchItems = [];// 所有字段
	var regExp = new RegExp("#.*?#","gm");
	var match = regExp.exec(str);//#字段#
	while (match) {
		var matchStr = match[0].substr(1, match[0].length - 2);
		var item = this._items[matchStr]
		if (item) {
			matchItems.push(item);
		}
		match = regExp.exec(str);
	}
	return matchItems;
};
/**
 * 销毁组件
 */
rh.ui.Form.prototype.destroy = function() {
	var _self = this;
	jQuery.each(_self._items, function(key, item) {
		if (item) {
			var type = item.type;
			if (type == "File" || type == "BigText" || type == "Image" || type == "ItemFile") {
				item.destroy && item.destroy();
			}
		}
	});
	//清除对象引用
	this.destroyRefrence();
};
/**
 * 销毁组件，包括清除引用、事件绑定等
 */
rh.ui.Form.prototype.destroyRefrence = function() {
	var _self = this;
	//将label对象置null
	jQuery.each(_self._labels, function(key, item) {
		if (item) {
			//_self._labels[key].destroy()
			_self._labels[key] = null;
		}
	});
	_self._labels = null;
	//将form内组件对象置null
	jQuery.each(_self._items, function(key, item) {
		if (item) {
			_self._items[key] = null;
		}
	});
	_self._items = null;
	//将提示对象置null,并消除其绑定事件
	//this.obj.find(".colorTip").unbind().empty().remove();
};
/**
 * 用于字段校验，form表单在保存之前调用该方法进行字段校验
 */
rh.ui.Form.prototype.validate = function() {
	// 保存校验是否通过标志
	var pass = true;
	for (var id in this._validation) {// 校验每一个字段
		var itemValidate = this._validation[id];
		// 如果该字段没找到或者隐藏了则跳过不校验
		if (!this.getItem(id) || this.getItem(id).isHidden) { 
			continue;
		}
//		// 非表字段不需要校验
//		if (this.getItem(id).itemType != 1) {
//			var type = this.getItem(id).type;
//			if (type != "File") {// 文件字段除外
//				continue;
//			}
//		}
		
		// 自定义字段
		if (this.getItem(id).itemType == 3) {
			var type = this.getItem(id).type;
			// 不需要校验的自定义字段不执行校验操作
			if (!this.isNeedValidateItem(type)) {
				continue;
			}
		}
		
		// 校验对象
		var validateObj = this.getItem(id)._getValidateObj();
		if (validateObj) {
			if (itemValidate["require"]) {// 必须输入校验
				if (this.getItem(id).isNull()) {
					validateObj.showError(itemValidate["require"]["message"]);
					pass = false;
					continue;
				}
			}
			var val = this.getItem(id).getValue();
			if (val && (typeof(val)!="object")) {
				// 挨个校验，只有前面的所有检验成功了，后面的校验才会执行
				if (itemValidate["num"]) {// 数字校验
					if (!validateObj.validate(itemValidate["num"]["regular"], val,
							itemValidate["num"]["message"])) {
						pass = false;
						continue;
					}
				}
				if (itemValidate["txt"]) {// 字符串和大文本
					if (!validateObj.validate(itemValidate["txt"]["regular"], val
									.replace(/[^\x00-\xff]/g, "aa"),
							itemValidate["txt"]["message"])) {
						pass = false;
						continue;
					}
				}
				var validateArr = itemValidate["validate"];
				if (validateArr) {
					var len = validateArr.length;
					for (var i = 0; i < len; i++) { // 正则校验
						var validation = validateArr[i];
						if (!validateObj.validate(validation["regular"], val, validation["message"])) {
							pass = false;
							break;
						}
					}
				}
			} else if(val && (typeof(val)=="object")){
				//如果类型为“嵌入服务”，只检验必填
				if(this.getItem(id).type=="DataService"){
					//校验嵌入服务的列表数据是否合法
					var validateGrid = this.getItem(id).getGrid();
					//判断列表如果需要校验，对列表进行校验
					if(validateGrid.needValidate() && !validateGrid.validate()){
						pass = false;
						continue;
					}
				}
			}
		}
	}
	//判断如果有校验未通过，跳到相应字段并触发焦点
	if (this.obj.find(".error").length > 0) {
		var errorItemTop = this.obj.find(".error").first().offset().top - 40;
		parent.window.scrollTo(0,errorItemTop); //滚动外层滚动条
		this.obj.find(".blankError").first().find(":first").trigger("focus");//找到输入域触发焦点
	}
	return pass;
};
/**
 * 判断指定的字段类型需不需要校验
 */
rh.ui.Form.prototype.isNeedValidateItem = function(type) {
	switch(type) {
		case "StaticText" : 
		case "Text" :
		case "Select" :
		case "Radio" :
		case "Checkbox" :
		case "Textarea" :
		case "BigText" :
		case "File" :
        case "ItemFile" :
        case "Date" :
        case "DictChoose" :
        case "QueryChoose" :
        case "DataService" :
			return true;
		default : return false;
	}
};
/**
 * 动态设置某一个项的正则校验
 * @param {} key ITEM ID 
 * @param {} regular 正则校验
 * @param {} message 提示信息
 */
rh.ui.Form.prototype.setRegularValidate = function(key, regular, message) {
	var _self = this;
	var itemValidate = _self._validation[key];

	if (itemValidate) {
		// 找出是否有相等的message，如果message相等则认为是同样的校验，覆盖
		var match = false;
		for (var v in itemValidate["validate"]) {
			if (itemValidate["validate"][v].message == message) {
				itemValidate["validate"][v].regular = regular;
				match = true;
			}
		}
		if (!match) {
			if (itemValidate["validate"]) {
				itemValidate["validate"].push({"regular":regular, "message":message});
			} else {
				var validateArr = [];
				validateArr.push({"regular":regular, "message":message});
				itemValidate["validate"] = validateArr;
			}
		}
	}
};
/**
 * 检测是否有文件正在上传
 */
rh.ui.Form.prototype.checkUpload = function() {
	var len = this._files.length;
	for (var i = 0; i < len; i++) {
		if (this._files[i].getCurrentQueueSize() > 0) {
			return true;
		}
	}
	return false;
};
/**
 * 初始化form表单
 * @param {} cols 每行ITEM个数
 * @param {}  groupData 数据
 * @param {} 索引值
 */
rh.ui.Form.prototype._init = function(cols, groupData, index) {
	var isIE7 = $.browser.msie && ($.browser.version == "7.0");
	var _self = this;
	var data = groupData["data"];
	var container = jQuery("<div class='formContent'></div>");
	for (var i = 0; i < data.length; i++) {
		var itemObj = this._createItem(data[i], cols);
		// 隐藏掉
		var isHidden = data[i].ITEM_HIDDEN;
		if (isHidden == UIConst.YES) {
			itemObj.hide();
		}
		container.append(itemObj);
	}
	if (groupData["isGroup"] && groupData["hidden"] != "1") {
		var isClose = false;
		var config = groupData["config"];
		if (config) {
			config = StrToJson(config);
			isClose = config.close;
		}
		var group = jQuery("<div class='item ui-corner-5' id='"
				+ groupData["id"] + "'></div>");
		var fieldsetContainer = jQuery("<div class='fieldsetContainer'></div>");
		// 卡片样式
		if (groupData["style"] && jQuery.trim(groupData["style"]).length > 0) {
			group.css(StrToJson(groupData["style"]));
		}
		if (groupData["name"] == "") {// 如果没有名字则不显示lengend
			fieldsetContainer.append(jQuery("<fieldset></fieldset>").append(container));
			group.append(fieldsetContainer);
		} else {
			if (isClose) {
				group.append(fieldsetContainer.append(jQuery("<fieldset></fieldset>")
					.append("<span class='legend'><span class='name'>" + groupData["name"] + "</span><span class='iconC icon-card-open'></span></span>")
					.append(container)));
			} else {
				group.append(fieldsetContainer
					.append(jQuery("<fieldset></fieldset>")
					.append("<span class='legend'><span class='name'>" + groupData["name"] + "</span><span class='iconC icon-card-close'></span></span>")
					.append(container)));
			}
		}

		var legend = group.find(".legend").first();
		legend.click(function() {
			var close = jQuery(this).find(".iconC");
			if (close.hasClass("icon-card-close")) {
				close.removeClass("icon-card-close").addClass("icon-card-open");
//				if (isIE7) { // IE7下slideToggle有问题
					container.fadeOut(0);
					_self.cardObj._resetHeiWid();
//				} else {
//					container.slideToggle("slow", function() {
//						_self.cardObj._resetHeiWid();
//					});
//				}
			} else {
				close.removeClass("icon-card-open").addClass("icon-card-close");
//				if (isIE7) {
					container.fadeIn(0);
					_self.cardObj._resetHeiWid();
//				} else {
//					container.slideDown("slow", function() {
//						_self.cardObj._resetHeiWid();
//					});
//				}
			}
		});
		// 记住所有需要关闭的fieldset
		if (isClose) {
			this._closeFieldset.push(container);
		}
		this.obj.append(group);
	} else {
		container.data("index", index);
		 this._noHomeItems.push(container);
	}
};
// 页面渲染之后的处理
rh.ui.Form.prototype.afterLoad = function() {
	var len = this._noHomeItems.length;
	var index = len;
	for (var i = 0; i < len; i++) {
		var container = this._noHomeItems[i];
		index = container.data("index");
		for (var j = index; j >= 0; j--) {
			var theGroup = this.groupArray[j];
			if (theGroup.hidden == "2") {// 最后一个有效的分组框
				this.getGroup(theGroup.id).find(".formContent").append(container);
				return;
			}
		}
	}
	
};
// 按分组框把整个表单定义数据分成若干份
rh.ui.Form.prototype._calcGroup = function(data) {
	var _self = this;
	// [{"isGroup":true, "data":[]}, {"isGroup":false, "data":[]}]
	var groupArray = [];
	// 分组框显示的名字
	var name = "";
	// 分组code
	var id = "";
	// 构建一个分组
	var group = {
		"isGroup" : true,
		"data" : []
	};
	// 设置分组框名字
	group.name = name;
	// 设置分组框ID
	group.id = id;
	// 用于记录索引位置
	var index = 0;
	jQuery.each(data, function(key, node) {
		if (_self._isGroup(node) && node.ITEM_HIDDEN != UIConst.YES) {// 如果是分组框
			if (index != 0) {// 第一个不是分组框
				groupArray.push(group);
				// 清空上一个分组
				group = {
					"isGroup" : true,
					"data" : []
				};
			}
			
			// 是否隐藏分组框，用于自定义意见或评论，如果隐藏则找它之上的分组框
			if (_self._isSpecialGroup(node)) {
				group.hidden = node.ITEM_LABEL_HIDDEN;
				group.special = "1";
			} else {// 普通分组框永远显示
				group.hidden = "2";
				group.special = "2";
			}
			
			// 分组框的输入类型
			group.type = node.ITEM_INPUT_TYPE;
			// 取出分组框的名字
			group.name = node["ITEM_NAME"];
			// 取出分组框ID
			group.id = node["ITEM_CODE"];
			// 取出分组的配置
			group.config = node["ITEM_INPUT_CONFIG"];
			// 取出分组框样式
			group.style = node["ITEM_CARD_STYLE"];
			//放置ITEM_CODE到存储对象
			_self._groupJson[node["ITEM_CODE"]] = node["ITEM_CODE"];
			//存储隐藏表达式
			if (jQuery.trim(node.ITEM_HIDDEN_SCRIPT).length > 0) {
				_self._expHiddenItems[node.ITEM_CODE] = node.ITEM_HIDDEN_SCRIPT;
			}
		} else if (!_self._isGroup(node)) {// 不是分组框则把数据放到分组里去
			group.data.push(node);
		}
		index++;
	});
	groupArray.push(group);
	return groupArray;
};
// 判断一个字段类型是不是分组框
rh.ui.Form.prototype._isGroup = function(node) {
	var inputType = node.ITEM_INPUT_TYPE;
	switch(inputType) {
		case UIConst.FITEM_ELEMENT_HR : 
		case UIConst.FITEM_ELEMENT_MIND :
		case UIConst.FITEM_ELEMENT_COMMENT :
		return true;
		default : return false;
	}
};
// 判断是不是特殊的分组框，例如评论、意见等
rh.ui.Form.prototype._isSpecialGroup = function(node) {
	var inputType = node.ITEM_INPUT_TYPE;
	switch(inputType) {
		case UIConst.FITEM_ELEMENT_MIND :
		case UIConst.FITEM_ELEMENT_COMMENT :
		return true;
		default : return false;
	}
};
// 把隐藏的item放到后面
rh.ui.Form.prototype._setHiddenPos = function(data) {
	var _data = {};
	var _hiddenItem = {};
	jQuery.each(data, function(key, node) {
		if (node.ITEM_HIDDEN == UIConst.YES) {// 隐藏的
			_hiddenItem[key] = node;
		} else {
			_data[key] = node;
		}
	});
	return jQuery.extend(_data, _hiddenItem);
};
// 组合服务+itemCode
rh.ui.Form.prototype._getUnId = function(id) {
	var sId = this._opts.pId;
	return sId + "-" + id;
};
/**
 * 获取Item相关宽度，支持到6列
 * @param itemCols:占用列数
 * @param cols 总列数
 */
rh.ui.Form.prototype.getItemWidth = function(itemCols, cols) {
	
	var blankWidth = 0;
	var isIE7 = $.browser.msie && ($.browser.version == "7.0");
	if (isIE7) {
		blankWidth = 1 / cols; // 空出1%，（IE7下30% + 70% > 100%)
	}
	
	var labelWidth = 30; // label占itemWidth的宽度
	var itemWidth = 70;
	// 48比52是为了能够整除1到4，这样才能找到对应的样式
	if (cols >= 4) {
		labelWidth = 48;
		itemWidth = 52;
	}
	// 60比40是为了能够整除1到6，这样才能找到对应的样式
	if (cols >= 6) {
		labelWidth = 60;
		itemWidth = 40;
	}
	var maxWidth = 1400; // inner最大的宽度
	var selfTempl = 90;
	if (itemCols >= cols) {// 占一行
		labelWidth = labelWidth / cols;
		itemWidth = 100 - (blankWidth * cols);
	} else {
		labelWidth = labelWidth / itemCols;
		itemWidth = 100 * (itemCols / cols) - itemCols * blankWidth;
		maxWidth = maxWidth / cols * itemCols;
	}
	var rightWidth = 100 - labelWidth;
	/**
	 * ITEM_WIDTH:总宽度
	 * LEFT_WIDTH:Label宽度
	 * RIGHT_WIDTH:内容宽度
	 * MAX_WIDTH:最大宽度
	 */
	this.WIDTH = {ITEM_WIDTH:itemWidth, LEFT_WIDTH:labelWidth, RIGHT_WIDTH:rightWidth, MAX_WIDTH:maxWidth};
	if (cols == 0) {//自定义模版的时候
		this.WIDTH.RIGHT_WIDTH = selfTempl;
	}
	return this.WIDTH;
};
// 创建一列
rh.ui.Form.prototype._createItem = function(data, cols) {
	var _self = this;
	if(!data){
		return;
	}
	// 意见框永远占一行
	if (data.ITEM_INPUT_MODE == UIConst.FITEM_ELEMENT_MIND) {
		data.ITEM_CARD_COLS = cols;
	}
	var cardCols = data.ITEM_CARD_COLS || 2;
	var width = this.getItemWidth(cardCols,cols);
	
	var itemWidth = width.ITEM_WIDTH + "";
	var labelWidth = width.LEFT_WIDTH;
	var rightWidth = width.RIGHT_WIDTH;
	var maxWidth = width.MAX_WIDTH;
	if (data.ITEM_HIDDEN != UIConst.YES) {// 没被隐藏的则做校验
		/*
		 * 取出必填及校验规则{"ITEM_CODE":{"require":"该项必须输入！","validate":{"regular":"^-?(?:\d+|\d{1,}(?:,\d{1,})+)(?:\.\d+)?$","message":"请输入数字！"}}}
		 */
		// 存放规则
		var verify = {};
		// 是否非空，1：是，2：否
		var isNotNull = (data.ITEM_NOTNULL == 1) ? true : false;
		// 正则表达式
		var regular = data.ITEM_VALIDATE;
		// 正则校验失败提示语
		var hint = data.ITEM_VALIDATE_HINT;
		// 卡片url的设定
		var cardUrl = data.ITEM_CARD_LINK || "";

		if (isNotNull) {// 必须输入，必须输入项比较简单，所以直接以requrire为key，提示信息为值
			verify["require"] = {
				"message" : "该项必须输入！"
			};
		}
		var validateArr = [];
		if (regular && jQuery.trim(regular) != "") {
			validateArr.push({"regular" : regular, "message" : (hint ? hint : "")});
			verify["validate"] = validateArr;
		}
		// 系统级校验，一、数字：数字、长度。二、大文本和字符串：长度。
		var fieldType = data.ITEM_FIELD_TYPE;
		var length = data.ITEM_FIELD_LENGTH;
		if (fieldType == UIConst.DATA_TYPE_NUM) {// 数字
			if (length.indexOf(",") > 0) {// 小数
				var intLength = length.substring(0, length.indexOf(","));
				var decLength = length.substring(length.indexOf(",") + 1);
				verify["num"] = {
					"regular" : "^(0|[-+]?[0-9]{1," + (intLength - parseInt(decLength)) + "}([\.][0-9]{0," + decLength + "})?)$",
					"message" : "请输入整数长度不超过" + (intLength - parseInt(decLength)) + "位，小数长度不超过" + decLength + "位的有效数字！"
				};
			} else {
				verify["num"] = {
					"regular" : "^(0|[-+]?[0-9]{0," + length + "})$",
					"message" : "请输入长度不超过" + length + "位有效数字！"
				};
			}
		}
		if (fieldType == UIConst.DATA_TYPE_STR || fieldType == UIConst.DATA_TYPE_BIGTEXT) {// 字符串或者大文本
			verify["txt"] = {
				"regular" : "^([\\S\\s]{0," + length + "})$",
				"message" : "长度不能超过" + length + "位！"
			};
		}
		this._validation[data.ITEM_CODE] = verify;
	}
	var itemDiv = jQuery("<div id='" + _self._getUnId(data.ITEM_CODE)
		+ "_div'  class='inner' style='width:" + itemWidth + "%;max-width:"
		+ maxWidth + "px;'></div>");
	if (cols > 0) {// 系统定义页面
		var label;
		if (data.ITEM_NAME && data != "") {// 如果有label的话
			label = new rh.ui.Label({
				_for : _self._getUnId(data.ITEM_CODE),
				text : data.ITEM_NAME,
				isNotNull : isNotNull,
				id : _self._getUnId(data.ITEM_CODE) + "_label",
				tip : data.ITEM_TIP
			});
			// 阻止单击事件冒泡
			label._text.click(function() {return false;});
			if (System.getUser("DEV_FLAG") == "true") {// 开发人员才开启
				label._text.dblclick(function() {
					var options = {
						"url" : "SY_SERV_ITEM.card.do?pkCode="
								+ data.ITEM_ID,
						"tTitle" : "服务项-" + data.ITEM_NAME,
						"menuFlag" : 3
					};
					Tab.open(options);
				});
			} else {
				label._text.css("cursor", "default");
			}
		} else {// 否则构造一个空的Label
			label = new rh.ui.Label();
		}
		// 保存Label
		_self._labels[data.ITEM_CODE] = label;
		// 把label放入li中，然后放入到里边的ul中
		itemDiv.append(jQuery("<span class='left" + " form__left" + labelWidth + "'></span>").append(label.obj));
		
		// 隐藏label
		if (data.ITEM_LABEL_HIDDEN && data.ITEM_LABEL_HIDDEN == "1") {
			label.hide();
		}
	} else { // 自定义页面
		itemDiv = jQuery("<div id='" + _self._getUnId(data.ITEM_CODE) + "_div'  class='inner' style='width:100%;'></div>");
	}
	// 字段项扩展设置ITEM_EXPTENDS
	var itemExptends = data.ITEM_EXPTENDS;
	if (itemExptends && itemExptends.length > 0) {
		// 重组字段
		var combo = StrToJson(itemExptends).COMBO;
		if (!jQuery.isEmptyObject(combo)) {
			this._comboItemOpts[data.ITEM_CODE] = combo;
		}
		
		// 重置字段位置
		var resetPosition = StrToJson(itemExptends).RESET_POSITION;
		if (!jQuery.isEmptyObject(resetPosition)) {
			this._resetPositionOpts[data.ITEM_CODE] = resetPosition;
		}
	}
	
	// 字段类型 1.表字段 2.视图字段 3.自定义字段
	var itemType = data.ITEM_TYPE;
	// 输入框类型
	var type = data.ITEM_INPUT_TYPE;
	// 是否只读，1：是，2：否
	var isReadOnly = (data.ITEM_READONLY == 1) ? true : false;
	// 输入模式
	var inputMode = data.ITEM_INPUT_MODE;
	var isHidden = data.ITEM_HIDDEN == UIConst.YES;
	var ui;
	if (data.ITEM_CARD_DISABLE == UIConst.NO) {// 卡片没被禁用
		switch (inputMode) {
			case UIConst.FITEM_INPUT_AUTO : {// 输入模式为：无
				switch (type) {
					case UIConst.FITEM_ELEMENT_INPUT :
						ui = new rh.ui.Text({
							id : _self._getUnId(data.ITEM_CODE),
							name : _self._getUnId(data.ITEM_CODE),
							_default : data.ITEM_INPUT_DEFAULT,
							width : data.ITEM_CARD_WIDTH,
							isNotNull : isNotNull,
							isReadOnly : isReadOnly,
							item_input_config : data.ITEM_INPUT_CONFIG,
							regular : regular,
							hint : hint,
							fieldType : data.ITEM_FIELD_TYPE,
							length : data.ITEM_FIELD_LENGTH,
							style : data.ITEM_CARD_STYLE,
							isHidden : isHidden,
							tip : data.ITEM_TIP,
							cardObj : this.cardObj
						});
						break;
					case UIConst.FITEM_ELEMENT_PSW : // 密码框
						ui = new rh.ui.Text({
							id : _self._getUnId(data.ITEM_CODE),
							name : _self._getUnId(data.ITEM_CODE),
							_default : data.ITEM_INPUT_DEFAULT,
							width : data.ITEM_CARD_WIDTH,
							isNotNull : isNotNull,
							isReadOnly : isReadOnly,
							item_input_config : data.ITEM_INPUT_CONFIG,
							regular : regular,
							hint : hint,
							fieldType : data.ITEM_FIELD_TYPE,
							length : data.ITEM_FIELD_LENGTH,
							style : data.ITEM_CARD_STYLE,
							psw : true,
							isHidden : isHidden,
							tip : data.ITEM_TIP,
							cardObj : this.cardObj
						});
						break;
					case UIConst.FITEM_ELEMENT_SELECT :
						ui = new rh.ui.Select({
							id : _self._getUnId(data.ITEM_CODE),
							name : _self._getUnId(data.ITEM_CODE),
							_default : data.ITEM_INPUT_DEFAULT,
							data : this.dicts[data.DICT_ID],
							width : data.ITEM_CARD_WIDTH,
							isNotNull : isNotNull,
							isReadOnly : isReadOnly,
							style : data.ITEM_CARD_STYLE,
							regular : regular,
							hint : hint,
							isHidden : isHidden,
							tip : data.ITEM_TIP,
							cardObj : this.cardObj
						});
						break;
					case UIConst.FITEM_ELEMENT_IFRAME :
						ui = new rh.ui.Iframe({
							id : _self._getUnId(data.ITEM_CODE),
							isHidden : isHidden,
							confg : data.ITEM_INPUT_CONFIG,
							cardObj:_self.cardObj
						});
						break;
					case UIConst.FITEM_ELEMENT_RADIO :
						ui = new rh.ui.Radio({
							id : _self._getUnId(data.ITEM_CODE),
							name : _self._getUnId(data.ITEM_CODE),
							_default : data.ITEM_INPUT_DEFAULT,
							data : this.dicts[data.DICT_ID],
							width : data.ITEM_CARD_WIDTH,
							isNotNull : isNotNull,
							isReadOnly : isReadOnly,
							style : data.ITEM_CARD_STYLE,
							regular : regular,
							hint : hint,
							isHidden : isHidden,
							tip : data.ITEM_TIP,
							itemCols : data.ITEM_CARD_COLS, 
							cols : cols,
							cardObj : this.cardObj
						});
						break;
					case UIConst.FITEM_ELEMENT_CHECKBOX :
						ui = new rh.ui.Checkbox({
							id : _self._getUnId(data.ITEM_CODE),
							name : _self._getUnId(data.ITEM_CODE),
							_default : data.ITEM_INPUT_DEFAULT,
							data : this.dicts[data.DICT_ID],
							width : data.ITEM_CARD_WIDTH,
							isNotNull : isNotNull,
							isReadOnly : isReadOnly,
							style : data.ITEM_CARD_STYLE,
							regular : regular,
							hint : hint,
							isHidden : isHidden,
							tip : data.ITEM_TIP,
							cardObj : this.cardObj
						});
						break;
					case UIConst.FITEM_ELEMENT_ATTACH :
						_self._fieldFile = true;
						ui = new rh.ui.File({
							config : StrToJson(data.ITEM_INPUT_CONFIG),
							id : _self._getUnId(data.ITEM_CODE),
							name : _self._getUnId(data.ITEM_CODE),
							_default : data.ITEM_INPUT_DEFAULT,
							data : this.dicts[data.DICT_ID],
							width : data.ITEM_CARD_WIDTH,
							isNotNull : isNotNull,
							isReadOnly : isReadOnly,
							style : data.ITEM_CARD_STYLE,
							regular : regular,
							hint : hint,
							isHidden : isHidden,
							cardObj : this.cardObj,
							itemCode : data.ITEM_CODE,
							tip : data.ITEM_TIP,
							saveHist : data.ITEM_LOG_FLAG,
							itemCode : data.ITEM_CODE,
							itemName : data.ITEM_NAME
						});
						this._attachFiles.push(ui);
						break;
					case UIConst.FITEM_ELEMENT_TEXTAREA :
						ui = new rh.ui.Textarea({
							id : _self._getUnId(data.ITEM_CODE),
							name : _self._getUnId(data.ITEM_CODE),
							_default : data.ITEM_INPUT_DEFAULT,
							width : data.ITEM_CARD_WIDTH,
							isNotNull : isNotNull,
							isReadOnly : isReadOnly,
							config : data.ITEM_INPUT_CONFIG,
							regular : regular,
							hint : hint,
							style : data.ITEM_CARD_STYLE,
							fieldType : data.ITEM_FIELD_TYPE,
							length : data.ITEM_FIELD_LENGTH,
							isHidden : isHidden,
							tip : data.ITEM_TIP,
							cardObj : this.cardObj
						});
						break;
					case UIConst.FITEM_ELEMENT_BIGTEXT :
						ui = new rh.ui.BigText({
							// 传入卡片对象
							cardObj : this.cardObj,
							id : _self._getUnId(data.ITEM_CODE),
							name : _self._getUnId(data.ITEM_CODE),
							_default : data.ITEM_INPUT_DEFAULT,
							width : data.ITEM_CARD_WIDTH,
							isNotNull : isNotNull,
							isReadOnly : isReadOnly,
							config : StrToJson(data.ITEM_INPUT_CONFIG),
							regular : regular,
							hint : hint,
							style : data.ITEM_CARD_STYLE,
							fieldType : data.ITEM_FIELD_TYPE,
							length : data.ITEM_FIELD_LENGTH,
							isHidden : isHidden,
							tip : data.ITEM_TIP,
							words : data.ITEM_FIELD_LENGTH
						});
						break;
					case UIConst.FITEM_ELEMENT_FILE :
						ui = new rh.ui.ItemFile({
							id : _self._getUnId(data.ITEM_CODE),
							name : _self._getUnId(data.ITEM_CODE),
							_default : data.ITEM_INPUT_DEFAULT,
							width : data.ITEM_CARD_WIDTH,
							isNotNull : isNotNull,
							isReadOnly : isReadOnly,
							config : StrToJson(data.ITEM_INPUT_CONFIG),
							servID : this._servID,
							style : data.ITEM_CARD_STYLE,
							isHidden : isHidden,
							cardObj : this.cardObj,
							tip : data.ITEM_TIP,
							itemCode : data.ITEM_CODE
						});
						this._files.push(ui);
						break;
					case UIConst.FITEM_ELEMENT_IMAGE:
						ui = new rh.ui.Image({
							id : _self._getUnId(data.ITEM_CODE),
							name : _self._getUnId(data.ITEM_CODE),
							_default : data.ITEM_INPUT_DEFAULT,
							width : data.ITEM_CARD_WIDTH,
							isNotNull : isNotNull,
							isReadOnly : isReadOnly,
							config : StrToJson(data.ITEM_INPUT_CONFIG),
							postParams : {
								"data" : "{\"SERV_ID\":\"" + this._servID + "\"}"
							},
							servID : this._servID,
							style : data.ITEM_CARD_STYLE,
							queueSize : 1,
							isHidden : isHidden,
							cardObj : this.cardObj,
							tip : data.ITEM_TIP,
							itemCode : data.ITEM_CODE
						});
						this._files.push(ui);
						break;
					case UIConst.FITEM_ELEMENT_DATA_SERVICE :
						var linkServ = this._opts.data.LINKS || {};//关联功能信息
						var linkServData;
						var config = data.ITEM_INPUT_CONFIG;
					    var confArray = config.split(",");
						var sId = confArray[0];
						var conf = confArray.slice(1);
						var _confJson = StrToJson(conf.join(","));
						var cardFlag = _confJson && (_confJson.CARDFLAG) ? _confJson.CARDFLAG:"";//是否以卡片方式打开列表内容
						jQuery.each(linkServ, function(i,n) {//生成子功能过滤条件
							//输入设置的值 和 关联服务对应，且关联服务的显示位置为“主单数据项”
							if(n.LINK_SERV_ID == sId && n.LINK_SHOW_POSITION==1){
								linkServData = n;
							}
						});
						if(linkServData){
							//获取容器宽度
							var viewWidth = data.ITEM_CARD_WIDTH;
							if (viewWidth == 0) {
								viewWidth = "100%";
							}
							var containerDiv = jQuery("<div></div>").addClass("ui-dataservice-container");
							var temp = {
								"sId" : sId,
								"cardFlag":cardFlag,
								"pCon" : containerDiv,
								"isReadOnly" : isReadOnly,
								"isHidden" : isHidden,
								"width":viewWidth,
								"cardObj" : _self.cardObj,
								"parHandler" : _self.cardObj,
								"linkServData" : linkServData
							};
							ui = new rh.vi.listViewBatch(temp);
							ui.render();
							ui.obj = containerDiv;
						}
						break;
					case UIConst.FITEM_ELEMENT_LINKSELECT:
						if (itemType != 3) {//非自定义类别返回
							break;
						}
						var temp = {
							id : _self._getUnId(data.ITEM_CODE),
							name : _self._getUnId(data.ITEM_CODE),
							config : data.ITEM_INPUT_CONFIG,
							cardObj : _self.cardObj,
							servID : this._servID,
							servSrcId:_self._servSrcId,
							itemCode : data.ITEM_CODE,
							isNotNull : isNotNull,
							isReadOnly : isReadOnly,
							parHandler: _self
						};
						ui = new rh.ui.linkSelect(temp);
						break;
					case UIConst.FITEM_ELEMENT_STATICTEXT://静态显示文本区 
						var temp = {
							id : _self._getUnId(data.ITEM_CODE),
							name : _self._getUnId(data.ITEM_CODE),
							config : data.ITEM_INPUT_CONFIG,
							cardObj : _self.cardObj,
							servID : this._servID,
							itemCode : data.ITEM_CODE,
							parHandler: _self,
							style : data.ITEM_CARD_STYLE
						};
						ui = new rh.ui.StaticText(temp);
						break;					
					default :
						ui = null;
						alert("没有创建任何UI for " + data.ITEM_CODE + " from rh.ui.Form");
				}
				break;
			}
			case UIConst.FITEM_INPUT_COMBINE : {// 输入模式为：组合框
				switch (type) {
					case UIConst.FITEM_ELEMENT_INPUT :
						ui = new rh.ui.Text({
							id : _self._getUnId(data.ITEM_CODE),
							name : _self._getUnId(data.ITEM_CODE),
							_default : data.ITEM_INPUT_DEFAULT,
							width : data.ITEM_CARD_WIDTH,
							isNotNull : isNotNull,
							isReadOnly : isReadOnly,
							item_input_config : data.ITEM_INPUT_CONFIG,
							regular : regular,
							hint : hint,
							fieldType : data.ITEM_FIELD_TYPE,
							style : data.ITEM_CARD_STYLE,
							length : data.ITEM_FIELD_LENGTH,
							isHidden : isHidden,
							tip : data.ITEM_TIP,
							cardObj : this.cardObj
						});
						break;
					case UIConst.FITEM_ELEMENT_TEXTAREA :
						ui = new rh.ui.Textarea({
							id : _self._getUnId(data.ITEM_CODE),
							name : _self._getUnId(data.ITEM_CODE),
							_default : data.ITEM_INPUT_DEFAULT,
							width : data.ITEM_CARD_WIDTH,
							isNotNull : isNotNull,
							isReadOnly : isReadOnly,
							config : data.ITEM_INPUT_CONFIG,
							regular : regular,
							hint : hint,
							style : data.ITEM_CARD_STYLE,
							fieldType : data.ITEM_FIELD_TYPE,
							length : data.ITEM_FIELD_LENGTH,
							isHidden : isHidden,
							tip : data.ITEM_TIP,
							cardObj : this.cardObj
						});
						break;
				}
				break;
			}
			case UIConst.FITEM_INPUT_DATE : {// 输入模式为：日期选择，不考虑输入类型
				ui = new rh.ui.Date({
					id : _self._getUnId(data.ITEM_CODE),
					name : _self._getUnId(data.ITEM_CODE),
					_default : data.ITEM_INPUT_DEFAULT,
					width : data.ITEM_CARD_WIDTH,
					isNotNull : isNotNull,
					isReadOnly : isReadOnly,
					item_input_config : data.ITEM_INPUT_CONFIG,
					regular : regular,
					style : data.ITEM_CARD_STYLE,
					hint : hint,
					isHidden : isHidden,
					tip : data.ITEM_TIP,
					cardObj : this.cardObj
				});
				break;
			}
			case UIConst.FITEM_INPUT_QUERY : {// 输入模式为：查询选择
				switch (type) {
					case UIConst.FITEM_ELEMENT_INPUT :
						ui = new rh.ui.QueryChoose({
							id : _self._getUnId(data.ITEM_CODE),
							name : _self._getUnId(data.ITEM_CODE),
							_default : data.ITEM_INPUT_DEFAULT,
							width : data.ITEM_CARD_WIDTH,
							isNotNull : isNotNull,
							isReadOnly : isReadOnly,
							textType : "text",
							item_input_config : data.ITEM_INPUT_CONFIG,
							formHandler : _self,
							regular : regular,
							hint : hint,
							style : data.ITEM_CARD_STYLE,
							isEdit : data.ITEM_INPUT_FLAG,
							isHidden : isHidden,
							tip : data.ITEM_TIP,
							cardObj : this.cardObj
						});
						break;
					case UIConst.FITEM_ELEMENT_TEXTAREA :
						ui = new rh.ui.QueryChoose({
							id : _self._getUnId(data.ITEM_CODE),
							name : _self._getUnId(data.ITEM_CODE),
							_default : data.ITEM_INPUT_DEFAULT,
							width : data.ITEM_CARD_WIDTH,
							isNotNull : isNotNull,
							isReadOnly : isReadOnly,
							textType : "textarea",
							item_input_config : data.ITEM_INPUT_CONFIG,
							formHandler : _self,
							regular : regular,
							hint : hint,
							style : data.ITEM_CARD_STYLE,
							isEdit : data.ITEM_INPUT_FLAG,
							isHidden : isHidden,
							tip : data.ITEM_TIP,
							cardObj : this.cardObj
						});
						break;
					default : // 默认就是Text类型的字典选择
						ui = new rh.ui.QueryChoose({
							id : _self._getUnId(data.ITEM_CODE),
							name : _self._getUnId(data.ITEM_CODE),
							_default : data.ITEM_INPUT_DEFAULT,
							width : data.ITEM_CARD_WIDTH,
							isNotNull : isNotNull,
							isReadOnly : isReadOnly,
							textType : "text",
							item_input_config : data.ITEM_INPUT_CONFIG,
							formHandler : _self,
							regular : regular,
							hint : hint,
							style : data.ITEM_CARD_STYLE,
							isEdit : data.ITEM_INPUT_FLAG,
							isHidden : isHidden,
							tip : data.ITEM_TIP,
							cardObj : this.cardObj
						});
				}
				break;
			}
			case UIConst.FITEM_INPUT_DICT : {// 输入模式为：字典选择
				switch (type) {
					case UIConst.FITEM_ELEMENT_INPUT :
						ui = new rh.ui.DictChoose({
							id : _self._getUnId(data.ITEM_CODE),
							name : _self._getUnId(data.ITEM_CODE),
							_default : data.ITEM_INPUT_DEFAULT__CODE,
							_defaultName : data.ITEM_INPUT_DEFAULT__NAME,
							width : data.ITEM_CARD_WIDTH,
							isNotNull : isNotNull,
							isReadOnly : isReadOnly,
							textType : "text",
							dict : this.dicts[data.DICT_ID],
							item_input_config : data.ITEM_INPUT_CONFIG,
							formHandler : _self,
							item_code : data.ITEM_CODE,
							regular : regular,
							hint : hint,
							style : data.ITEM_CARD_STYLE,
							isEdit : data.ITEM_INPUT_FLAG,
							isHidden : isHidden,
							tip : data.ITEM_TIP,
							cardObj : this.cardObj
						});
						break;
					case UIConst.FITEM_ELEMENT_TEXTAREA :
						ui = new rh.ui.DictChoose({
							id : _self._getUnId(data.ITEM_CODE),
							name : _self._getUnId(data.ITEM_CODE),
							_default : data.ITEM_INPUT_DEFAULT__CODE,
							_defaultName : data.ITEM_INPUT_DEFAULT__NAME,
							width : data.ITEM_CARD_WIDTH,
							isNotNull : isNotNull,
							isReadOnly : isReadOnly,
							textType : "textarea",
							dict : this.dicts[data.DICT_ID],
							item_input_config : data.ITEM_INPUT_CONFIG,
							formHandler : _self,
							item_code : data.ITEM_CODE,
							regular : regular,
							hint : hint,
							style : data.ITEM_CARD_STYLE,
							isEdit : data.ITEM_INPUT_FLAG,
							isHidden : isHidden,
							tip : data.ITEM_TIP,
							cardObj : this.cardObj
						});
						break;
					default : // 默认就是Text类型的字典选择
						ui = new rh.ui.DictChoose({
							id : _self._getUnId(data.ITEM_CODE),
							name : _self._getUnId(data.ITEM_CODE),
							_default : data.ITEM_INPUT_DEFAULT__CODE,
							_defaultName : data.ITEM_INPUT_DEFAULT__NAME,
							width : data.ITEM_CARD_WIDTH,
							isNotNull : isNotNull,
							isReadOnly : isReadOnly,
							textType : "text",
							dict : this.dicts[data.DICT_ID],
							item_input_config : data.ITEM_INPUT_CONFIG,
							formHandler : _self,
							regular : regular,
							hint : hint,
							style : data.ITEM_CARD_STYLE,
							isEdit : data.ITEM_INPUT_FLAG,
							isHidden : isHidden,
							tip : data.ITEM_TIP,
							cardObj : this.cardObj
						});
				}
				break;
			}
			default :
				ui = null;
				alert("没有创建任何UI for " + data.ITEM_CODE + " from rh.ui.Form");
		}
	}

	if (ui) {
		
		// 字段类型存入组件里
		ui.itemType = itemType;
		
		// 把该UI对象放到容器里
		_self._items[data.ITEM_CODE] = ui;
		var rightSpan = jQuery("<span class='right" + " form__right" + rightWidth + "'></span>");
		var itemObj = ui._container?ui._container:ui.obj;
		var tip = data.ITEM_TIP || "";
		itemObj.attr("tip", tip.replace(/\"/g, "'"));
		itemObj.addClass("fl wp");
		rightSpan.append(itemObj);
		//卡片url链接增加
		if (cardUrl && cardUrl.length > 0) {
			_self._appendCardUrl(rightSpan,cardUrl);
		}
		itemDiv.append(rightSpan);
		

		// 保存默认值
		this._defaults[data.ITEM_CODE] = data.ITEM_INPUT_DEFAULT;
		//存储必填表达式
		if (jQuery.trim(data.ITEM_NOTNULL_SCRIPT).length > 0) {
			this._expNotNullItems[data.ITEM_CODE] = data.ITEM_NOTNULL_SCRIPT;
		}
		//存储只读表达式
		if (jQuery.trim(data.ITEM_READONLY_SCRIPT).length > 0) {
			this._expReadItems[data.ITEM_CODE] = data.ITEM_READONLY_SCRIPT;
		}
		//存储隐藏表达式
		if (jQuery.trim(data.ITEM_HIDDEN_SCRIPT).length > 0) {
			this._expHiddenItems[data.ITEM_CODE] = data.ITEM_HIDDEN_SCRIPT;
		}
	}
	// 把里边的ul放入到外面的li中返回
	return itemDiv;

};
// 清除卡片中被禁用的Item
rh.ui.Form.prototype._clearDisableAndHiddenItem = function(data) {
	var _self = this;
	var tmpData = {};
	jQuery.each(data, function(key, item) {
		/*if (item.ITEM_INPUT_TYPE == UIConst.FITEM_ELEMENT_HIDDEN) {
			ui = new rh.ui.Text({
				id : item.ITEM_CODE,
				name : item.ITEM_CODE,
				_default : item.ITEM_INPUT_DEFAULT,
				hidden : true
			});

			// 隐藏字段对象也得放到对象池里
			_self._items[item.ITEM_CODE] = ui;

			jQuery("body").append(ui.obj);
		} else */if (item.ITEM_CARD_DISABLE != 1) {// Item没被被禁用
			tmpData[key] = item;
		}
	});
	return tmpData;
};
/**
 * 设置指定组件的值
 * @param {}  key
 * @param {} value
 */
rh.ui.Form.prototype.setValue = function(key, value) {
	this.getItem(key).setValue(value);
};
/**
 * 获取指定key的组件的值
 * @param {} key
 * @return {}
 */
rh.ui.Form.prototype.getValue = function(key) {
	return this.getItem(key).getValue();
};
/**
 * 设置指定值的集合
 * 
 * @param {"CO_TYPE":"3","CO_TYPE__NAME":"test"}
 */
rh.ui.Form.prototype.setValues = function(datas) {
	var _self = this;
	jQuery.each(datas, function(i, n) {
		if (i.indexOf("__NAME") > 0) {
			return true;
		} else {
			if (_self.getItem(i)) {
				_self.getItem(i).fillData(n, datas);
			}
		}
	});
};
/**
 * 通过key获取UI对象，key就是当前UI的id
 */
rh.ui.Form.prototype.getItem = function(key) {
	return this._items[key];
};
/**
 * 获取UI对象容器
 */
rh.ui.Form.prototype.getItems = function() {
	return this._items;
};
/**
 * 所有的组件都失效
 */
rh.ui.Form.prototype.disabledAll = function() {
	jQuery.each(this.getItems(), function(index, item) {
		item.disabled();
	});
};
/**
 * 所有的组件都有效
 */
rh.ui.Form.prototype.enabledAll = function() {
	jQuery.each(this.getItems(), function(index, item) {
		item.enabled();
	});
};
/**
 * 所有的组件都隐藏
 */
rh.ui.Form.prototype.hideAll = function() {
	jQuery.each(this.getItems(), function(index, item) {
		item.hide && item.hide();
	});
};
/**
 * 所有的组件都显示
 */
rh.ui.Form.prototype.showAll = function() {
	jQuery.each(this.getItems(), function(index, item) {
		item.show && item.show();
	});
};
/**
 * 设置表单默认值
 */
rh.ui.Form.prototype.fillDefault = function(defaults) {
	if (defaults) {//如果有传递过来的默认值集合
		this._defaults = defaults;
	} else {
		for (var key in this._items) {
			if (this.getItem(key).fillDefault) {
				this.getItem(key).fillDefault();
			}
		}
	}
};
/**
 * 隐藏所有Label
 */
rh.ui.Form.prototype.hideLabel = function() {
	for (var key in this._items) {
		!this.getItem(key).isHidden && this.getItem(key).getLabel().hide();
	}
};
/**
 * 显示所有Label
 */
rh.ui.Form.prototype.showLabel = function() {
	for (var key in this._items) {
		!this.getItem(key).isHidden && this.getItem(key).getLabel().show();
	}
};
/**
 * 用数据填充form
 */
rh.ui.Form.prototype.fillData = function(data) {
	// 变化的表单域总数量
	var sum = 0;
	// 保存
	this._data = data;
	for (var key in this._items) {
		if (data[key] != this._items[key].getValue()) {// 如果该数据有变化
			sum++;
		}
		var item = this.getItem(key);
		if (item.type == "File") {
			// 载入附件
			var servDataId = this.cardObj.getOrigPK();
			var fileData = FireFly.getCardFile(this._servSrcId, servDataId, key);
			item.fillData(fileData);
		} else {
			item.fillData(data[key], data);
		}
	}
	if (sum == 0) {// 防止空对象干扰后面计算表单域的变化
		return;
	}
};
/**
 * 获取修改了的item，拼接成json对象
 */
rh.ui.Form.prototype.getChangedItems = function() {
	var jsonObj = {};
	var tmpData = this._data;
	var items = this.getItems();
	for (var key in items) {//遍历所有表单域
		var item = items[key];
		if (item.type == "File" || item.type == "StaticText") {// Attach类型附件或者静态文本不通过Form提交
			continue;
		}
		var theVal = tmpData[key];// 原始值
		var curVal = item.getValue();// 当前值
		if (theVal == undefined) {
			if (curVal) {
				//如果item返回对象，直接放入jsonObj中
				if (typeof(curVal) == "object") {
					jsonObj = jQuery.extend(jsonObj,curVal); 
					continue;
				}
				jsonObj[key] = curVal;
			}
		} else if (theVal != curVal) {//如果表单有变化，且不是从undefined变化而来的
			if (!curVal) { //如果curVal为空或undefined
				curVal = "";
			}
			jsonObj[key] = curVal;
		}
	}
	return jsonObj;
};
/**
 * 获取form的所有字段的值集合，拼接成json对象
 */
rh.ui.Form.prototype.getItemsValues = function() {
	var jsonObj = {};
	var tmpData = this._data;
	var items = this.getItems();
	for (var key in items) {//遍历所有表单域
		var item = items[key];
		var curVal = item.getValue();//当前值
		if (!curVal) { //如果curVal为空或undefined
			curVal = "";
		}
		jsonObj[key] = curVal;
	}
	return jsonObj;
};
/*
 * 获取Form表单中所有嵌入服务的ChangeData
 */
rh.ui.Form.prototype.getDataServiveChangeData = function(){
	var changeData = {};
	var items = this.getItems();
	for (var key in items) {// 遍历所有表单域
		var item = items[key];
		if(item && item.type == "DataService"){
			changeData = jQuery.extend(changeData,item.getChangeData());
		}
	}
	return changeData;
};
// 把表单的初始值保存到this._data对象里
rh.ui.Form.prototype._saveDefault = function(data) {
	var key = data.ITEM_CODE;
	var defaultValue = data.ITEM_INPUT_DEFAULT;
	var options = data.ITEM_OPTIONS;
	if (options) {// radio,checkbox,select，这三者的默认值有可能不是可选择项中的一种
		for (var value in options) {// {"1":"是"}
			if (defaultValue == value) {// 如果默认值是options里的一个
				this._data[key] = defaultValue;
			} else {
				this._data[key] = "";
			}
		}
	} else {
		this._data[key] = defaultValue;
	}
};
/**
 * 返回jquery对象的html，便于调试
 */
rh.ui.Form.prototype.toString = function() {
	return jQuery('<div></div>').append(this.obj).clone().remove().html();
};
/**
 * 重置表单
 */
rh.ui.Form.prototype.reset = function() {
	// 清空所有子节点
	this.obj.empty();
	// 重新设置表单
	for (var i = 0; i < this.groupArray.length; i++) {
		// 构造表单
		this._init(this.cols, this.groupArray[i], i);
	}
};
/**
 * 隐藏Form
 */
rh.ui.Form.prototype.hide = function() {
	this.obj.parent().hide();
};
/**
 * 显示Form
 */
rh.ui.Form.prototype.show = function() {
	this.obj.parent().show();
};
/**
 * 设置某一指定KEY的组件为不需输入
 * @param {} key 组件ID
 * @param {} bool 是否必须输入
 */
rh.ui.Form.prototype.setNotNull = function(key, bool) {
	if (this.getItem(key) && this.getItem(key).setNotNull) {// 设置失去焦点时的校验
		this.getItem(key).setNotNull(bool);
	}
	if (this._labels[key]) {// 设置Label的星号
		this._labels[key].showStar(bool);
	}
	if (bool) {// 设置必须输入
		if (!this._validation[key]) {
			this._validation[key] = {};
		}
		this._validation[key]["require"] = {
			"message" : "该项必须输入！"
		};
	} else {// 取消必须输入
		this.getItem(key)._getValidateObj().showOk();
		if (!this._validation[key]) {
			this._validation[key] = {};
		}
		this._validation[key]["require"] = null;
	}
};
/**
 * 获取卡片默认值
 */
rh.ui.Form.prototype.getDefaults = function() {
	return this._defaults;
};
/**
 * 通过分组框的ITEM_CODE获取该分组
 * @param itemCode 分组框编码
 * @param inputType 分组框的输入类型，默认为普通分组框类型，也可以是意见(自定义)或者评论(自定义)
 */
rh.ui.Form.prototype.getGroup = function(itemCode, inputType) {
	if (!inputType) {
		var groups = this.obj.find("#" + itemCode);
		if (groups.length == 0) {
			return null;
		}
		return groups.first();
	} else {
		var len = this.groupArray ? this.groupArray.length : 0;
		for (var index = 0; index < len; index++) {
			var group = this.groupArray[index];
			if (group.type == inputType) {// 是该类型
				if (group.hidden != "1") {// 不隐藏分组框
					// 找到第一个则返回
					return this.getGroup(this.groupArray[index].id);
				} else if (group.hidden == "1") {// 如果隐藏则找上一个分组框
					if (index >= 1) {
						for (var i = (index - 1); i >= 0; i--) {
							var theGroup = this.groupArray[i];
							if (theGroup.hidden == "2" || (theGroup.hidden == "1" && theGroup.special == "2")) {// 且不是特殊的分组框
								return this.getGroup(theGroup.id);
							}
						}
					} else {// 否则返回默认的第一个分组框
						return jQuery(".item").first();
					}
				}
			}
		}
	}
	return null;
};
/**
 * 返回分组框存放表单的容器，参数为分组框的itemCode
 * @param itemCode 分组框编码
 * @param inputType 分组框的输入类型，默认为普通分组框类型，也可以是意见(自定义)或者评论(自定义)
 */
rh.ui.Form.prototype.getGroupForm = function(itemCode, inputType) {
	var group = null;
	if (!inputType) {
		group = this.getGroup(itemCode);
	} else {
		group = this.getGroup(itemCode, inputType);
	}
	if (group) {
		return group.find(".formContent").first();
	}
	return null;
};
/**
 * 字段的表达式执行
 * @param idData 实际的业务数据，添加时为默认值集合，修改时为业务数据
 */
rh.ui.Form.prototype.expItems = function(idData,links) {
	this._byIdData = idData;
	this._linksVars = links;
	this.expReadItems();
	this.expHiddenItems();
	this.expNotNullItems();
};
/**
 * 替换字段级和系统变量
 * @param tmpExp 表达式值
 * @param current 是否当前值
 */
rh.ui.Form.prototype.expFunc = function(tmpExp, current) {
	var _self = this;
	tmpExp = Tools.itemVarReplace(tmpExp,current?_self.getItemsValues():_self._byIdData);//替换字段级变量
	tmpExp = Tools.systemVarReplace(tmpExp);//替换系统变量
	tmpExp = Tools.itemVarReplace(tmpExp,_self._linksVars);//关联定义的变量替换
	tmpExp = tmpExp.replace(/undefined/g,'');//替换undefined
	var actExp = eval(tmpExp);
	return actExp;
};
/**
 * 表达式设置字段只读
 */
rh.ui.Form.prototype.expReadItems = function() {
	var _self = this;
	if (!jQuery.isEmptyObject(this._expReadItems)) {
		jQuery.each(_self._expReadItems,function(i,n) {
			if (_self.expFunc(n)) {
				_self.getItem(i).disabled();
			};
		});
	}
};
/**
 * 表达式设置字段隐藏
 */
rh.ui.Form.prototype.expHiddenItems = function() {
	var _self = this;
	if (!jQuery.isEmptyObject(this._expHiddenItems)) {
		jQuery.each(_self._expHiddenItems,function(i,n) {
			if (_self.expFunc(n)) {
				if (!jQuery.isEmptyObject(_self._groupJson) && _self._groupJson[i]) {
					_self.getGroup(i).hide();
				} else {
					_self.getItem(i).hide();
				}
			};
		});
	}
};
/**
 * 表达式设置字段必填
 */
rh.ui.Form.prototype.expNotNullItems = function() {
	var _self = this;
	if (!jQuery.isEmptyObject(this._expNotNullItems)) {
		jQuery.each(_self._expNotNullItems,function(i,n) {
			if (_self.expFunc(n)) {
				_self.setNotNull(i,true);
			};
		});
	}
};
/**
 * 字段的卡片url功能添加
 * javascript:Tab.open({'url':'SY_ORG_USER.list.do','tTitle':'测试'});
 */
rh.ui.Form.prototype._appendCardUrl = function(obj,cardUrlObj) {
	var arr = cardUrlObj.split("},{");
	for (var i = 0;i < arr.length; i++) {
		var ob = arr[i];
		var res = "";
		if (arr.length > 1) {
			if (ob.indexOf("{") == 0) {
				res += ob;
				res += "}";
			} else {
				res += "{";
				res += ob;
			}
		} else {
			res = ob;
		}
		var temp = StrToJson(res);
		var text = temp.text;
		var href = temp.href;
		jQuery("<a class='ui-url-default fl' href=\"" + href + "\"></a>").text(text).appendTo(obj);
	}
};

/**
 * 是否存在Attach类型的字段
 */
rh.ui.Form.prototype.existAttach = function() {
	var _self = this;
	if (_self._attachFiles.length > 0) {
		return true;
	}
	return false;
};
/**
 * 有自定义模版的展示页面
 */
rh.ui.Form.prototype._bldTempl = function() {
	var _self = this;
	var obj = this._servData.SERV_CARD_TMPL_CONTENT;//文件定义内容模版,tmpl目录下内容
	var htmlObj = jQuery(obj);
	var items = this.items;//获取字段定义的数据集合
	htmlObj.find(".rh-item").each(function(i, n) {
				var itemCode = jQuery(n).attr("code");
				htmlObj.find(".rh-item[code='" + itemCode + "']")
						.append(_self._createItem(items[itemCode], 0));//参数为0创建卡片时用自定义模版
	});
	htmlObj.appendTo(this.obj);
	//替换红头标题
	var rehHeadObj = jQuery.parseJSON(_self._servData.SERV_RED_HEAD);
	htmlObj.find(".rh-item-redHead").each(function(i, n) {//替换文字
        jQuery(n).html(Tools.systemVarReplace(rehHeadObj["title"]));
	});
	htmlObj.find(".rh-item-redHead-logo").each(function(i, n) {//替换logo
        jQuery(n).attr("src",Tools.systemVarReplace(rehHeadObj["logo"]));
	});
 
	this.otherItemContainer = jQuery("<div class='otherItemContainer'></div>").hide().appendTo(this.obj);// 其它字段项容器
	for(var key in items){// 其它字段项也放到页面上
		if (!_self.getItem(key)) { //没创建过
			if (items[key].ITEM_HIDDEN == UIConst.YES && items[key].ITEM_TYPE == 3) { //隐藏 的 自定义字段
				continue;
			} 
			
			if (this._isGroup(items[key])) { //分组框
				continue;
			} 
			_self._createItem(items[key], 0).appendTo(this.otherItemContainer);
		}
	} 
};
/**
 * 取得意见(自定义)字段
 */
rh.ui.Form.prototype.getMindItem = function(){
	var rtnData = null;

	jQuery.each(this._servData.ITEMS,function(){
		if(this.ITEM_INPUT_TYPE == UIConst.FITEM_ELEMENT_MIND){
			rtnData = this;
			return;
		}
	});

	if(rtnData){
		return this.getItem(rtnData.ITEM_CODE);
	}
	
	return null;
};
/* ui.rh.Form定义结束 */

/**
 * 可视化json
 * @param option 参数
 */
rh.vi.visualJson = function(option){
	this.notNullId = [];//不为空的元素字段id数组
	this.isVisualHand = []; //是否为json对象串外的服务id，或者字典id，例如：sy_serv,{json}
	this.radioName = [];//获取点选按钮的name
	this.ids = [];//获取每个元素的id
	this.chooseObjs = [];//获取有查询选择的元素
	this.isTarget = [];//是否为目标字段
	this._loadData(option);
};

/**
 * 初始化
 */
rh.vi.visualJson.prototype._loadData = function(option){
	var _self = this;
	var json = option["json"]; //获取json中的元素
	var html = "";
	//rh-card-visualJson-col2div
	for (var i = 0; i < json.length; i++) {
		if ((json[i].type || "input") == "input") {//输入框类型
			html += _self._inputHtml(json[i], option["col"]);
		} else if (json[i].type == "textarea"){//文本域类型
			html += _self._textAreaHtml(json[i], option["col"]);
		} else if (json[i].type == "radio") {//单选按钮类型
			html += _self._radioHtml(json[i], option["col"]);
		}
	}
	_self._createDialog(option,html);
};

/**
 * 构造dialog弹出框
 */
rh.vi.visualJson.prototype._createDialog = function(option,html){
	var _self = this;
	jQuery("#rh-card-json-visual-json-div").remove();
	var dialogId = "rh-card-json-visual-json-div"; // 设置Dialog的id
	var winDialog = jQuery("<div></div>").attr("id", dialogId).attr("title","动态Json可视化");
	winDialog.appendTo(jQuery("body"));
	var bodyWid = jQuery("body").width();
	var hei = option["dialogHei"] || (GLOBAL.getDefaultFrameHei() - 100);
	var wid = option["dialogWid"] || (bodyWid / 2 + 30);
	var posArray = [ 30, 30 ];
	jQuery("#" + dialogId).dialog({
		autoOpen : false,height : hei,width : wid,modal : true,show:"blud",hide:"blue",
		draggable:true,resizable : false,position : posArray,
		buttons: {
			"确认": function() {
				 if (option.callBack) {//回写之后的方法
				        var callBack = option.callBack;
				        callBack.call(callBack.parHandler,_self._clickOkData(dialogId));	    	
				    }
			},
			"关闭": function() {
				jQuery("#" + dialogId).remove();
			}
	},
		open : function() {},
		close : function() {jQuery("#" + dialogId).remove();}
	});

	// 打开dialog
	var dialogObj = jQuery("#" + dialogId);
	dialogObj.dialog("open");
	
	dialogObj.focus();
	jQuery(".ui-dialog-titlebar").last().css("display", "block");// 设置标题显示
	dialogObj.parent().addClass("rh-bottom-right-radius rhSelectWidget-content");
	Tip.showLoad("努力加载中...", null, jQuery(".ui-dialog-title", winDialog).last());
	var btns = jQuery(".ui-dialog-buttonpane button",dialogObj.parent()).attr("onfocus","this.blur()");
	btns.first().addClass("rh-small-dialog-ok");
	btns.last().addClass("rh-small-dialog-close");
	dialogObj.parent().addClass("rh-small-dialog").addClass("rh-bottom-right-radius");
	dialogObj.css({"background-color":"#FFF"});
    jQuery(".ui-dialog-titlebar").last().css("display","block");//设置标题显示
	var jsonDiv = "";
	if (option["col"] == "2") {
		jsonDiv = jQuery("<div style='margin:10px 0px 10px 0px;'></div>");
	} else {
		jsonDiv = jQuery("<div style='margin:10px 10px 10px 10px;'></div>");
	}
	jsonDiv.append(html);
	jsonDiv.appendTo(dialogObj);
	
	_self._setOldVal(option["sourceVal"] || "");//把旧值放入json可视化界面中
	
	var chooseObjs = _self.chooseObjs;//有查询选择的字段
	for (var i = 0; i < chooseObjs.length; i++) {
		var aObj = jQuery("<a href='javascript:void(0);'  class='rh-icon rhGrid-btnBar-a'></a>").bind("click",
			{"conf":chooseObjs[i]["conf"],"chooseId":chooseObjs[i]["chooseId"],"serv_id":option["parHandler"].byIdData.SERV_ID}, function(event){
			_self._parseChooseConfBean(event,event.data["conf"],event.data["chooseId"], event.data["serv_id"]);
		});
		aObj.append("<span class='rh-icon-inner'>选择</span><span class='rh-icon-img btn-select '></span>");
		if (option["col"] == "2") {
			jQuery("#" + chooseObjs[i]["chooseId"]).css({"width":"83%"}).parent().append(aObj);
		} else {
			jQuery("#" + chooseObjs[i]["chooseId"]).css({"width":"85%"}).parent().append(aObj);
		}
	}
	_self._notNullEle();//不能为空的元素标记
};

/**
 * 点击[确定]回调函数
 */
rh.vi.visualJson.prototype._clickOkData = function(dialogId){
	var _self = this;
	if (_self._notNullMag() == null){//添加提示信息
		return;
	}
	var inpObj = _self._getInpAndTexObj();//获取输入框值对象
	var radioObj = _self._getRadioObj();//获取单选按钮值对象
	var lastFormatStr = JsonToStr(jQuery.extend(inpObj ,radioObj));//最终值
	var isVisualHand = _self.isVisualHand;
	for (var i = 0; i < isVisualHand.length; i++) {
		lastFormatStr = jQuery("#" + isVisualHand[i]).val() + "," + lastFormatStr;
	}
	jQuery("#" + dialogId).remove();//删除弹出框
	return lastFormatStr;
};

/**
 * 获取原来的值，放入可视化界面中
 */
rh.vi.visualJson.prototype._setOldVal = function(val){
	var _self = this;
	if (val.length > 0) {
		var isVisualHand = _self.isVisualHand;
		if (val.indexOf("{") > 0) {
			var isVisualHandStr = val.substring(0,val.indexOf("{") - 1).split(",");
			for (var i = 0; i < isVisualHand.length; i ++) {
				jQuery("#" + isVisualHand[i]).val(isVisualHandStr[i]);//获取主键字段，键值一一对应
			}
			var json = StrToJson(val.substring(val.indexOf("{"),val.length));
			//给input框，文本域赋值
			var ids = _self.ids;
			for(var i in json){//此处不能直接写ids的值，因为还有单选按钮，所以不能直接写，必须用循环嵌套
				for (var j = 0; j < ids.length; j ++) {
					if (ids[j].indexOf(("-" + i)) > 0) {
						if (typeof json[i] == "object") {
							jQuery("#" +ids[j]).val(JsonToStr(json[i]));
						} else {
							jQuery("#" +ids[j]).val(json[i]);
						}
					}
				}
			}
			//给单选按钮赋值
			var radioName = _self.radioName;
			for(var i in json){
				for (var j = 0; j < radioName.length; j ++) {
					if (radioName[j].indexOf(i) > 0) {
						jQuery(":radio[name='"+ radioName[j] +"'][value='" + json[i] + "']").attr("checked",true);
					}
				}
			}
		} else {
			var isVisualHandStr = val.split(",");
			for (var i = 0; i < isVisualHand.length; i ++) {
				jQuery("#" + isVisualHand[i]).val(isVisualHandStr[i]);//获取主键字段，键值一一对应
			}
		}
	}
};

/**
 * 解析有查询选择的元素
 */
rh.vi.visualJson.prototype._parseChooseConfBean = function(event, confBean, chooseId, serv_id){
	var _self = this;
	var conf = {};
	conf = jQuery.extend(conf ,confBean);
	var sid = conf["sid"];
	var extWhere = conf["EXTWHERE"];
	var serVal = jQuery("#" + _self.isVisualHand[0]).val();
	if (_self.isTarget[0] == chooseId) {//如果是目标字段
		extWhere = _self._isTargetCode(serv_id, extWhere);
	} else if (_self.isVisualHand[0] != chooseId) {//如果不是服务字段
		if (serVal) {
			extWhere = _self._isSourceCode(serVal, extWhere);
		} else {
			alert("先确定服务编码，再选择！");
			return;
		}
	}
	conf["EXTWHERE"] = extWhere;
	var configStr = sid + "," + JsonToStr(conf);
	var options = {
		"config":configStr,
		"searchFlag":true,
		"parHandler":_self,
		"formHandler":_self,//启用回写功能是需要被回写的页面或页面中form表单的句柄都可以，
		"replaceCallBack":function(idArray){//回调，idArray为选中记录的相应字段组的json串
			_self._chooseBackData(idArray,chooseId);
		}
	};
	var queryView = new rh.vi.rhSelectListView(options);
	queryView.show(event);
};

/*
 * 查询选择回调函数
 */
rh.vi.visualJson.prototype._chooseBackData = function(idArray,chooseId){
	jQuery("#" + chooseId).val("");
	var idArryData = [];
	var j = 0;
	for (var i in idArray) {
		j ++;
		idArryData[j] = idArray[i];
	}
	var itemCodes =idArryData[1].replace(/,/gi,"~");
	jQuery("#" + chooseId).val(itemCodes);
};
/**
 * 获取input元素，生成html元素标签
 */
rh.vi.visualJson.prototype._inputHtml = function(obj, col){
	var _self = this;
	_self._isNotNull(obj);//如果该项不为空，显示红色
	_self._isVisualHand(obj);//是否为主键code
	_self._isTarget(obj);//是否为目标字段
	_self._isChooseConf(obj["confBean"], obj["code"]);//获取有查询选择的元素id
	_self.ids.push("visual-json-" + obj["code"]);
	var col2Class = "";
	if (col == 2) {
		col2Class = "rh-card-visualJson-col2div";
	}
	return "<div class='rh-card-visualJson-div " + col2Class + "'><span class='name-span1'>" +obj["name"] + "</span><span class='name-span2'><input type='text' value='' id='visual-json-" + obj["code"] + "'/></span></div>";
};

/**
 * 获取textarea元素，生成html元素标签
 */
rh.vi.visualJson.prototype._textAreaHtml = function(obj, col){
	var _self = this;
	_self._isNotNull(obj);//如果该项不为空，显示红色
	_self._isVisualHand(obj);//是否为主键code
	_self._isTarget(obj);//是否为目标字段
	_self._isChooseConf(obj["confBean"], obj["code"]);//获取有查询选择的元素id
	_self.ids.push("visual-json-" + obj["code"]);
	var col2Class = "";
	if (col == 2) {
		col2Class = "rh-card-visualJson-col2div";
	}
	return "<div class='rh-card-visualJson-div " + col2Class + "'><span class='name-span1'>" +obj["name"] + "</span><span class='name-span2'><textarea id='visual-json-" + obj["code"] + "'></textarea></span></div>";
};

/**
 * 获取radio元素，生成html元素标签
 */
rh.vi.visualJson.prototype._radioHtml = function(obj, col){
	var _self = this;
	var col2Class = "";
	if (col == 2) {
		col2Class = "rh-card-visualJson-col2div";
	}
	var radioHtml = "<div class='rh-card-visualJson-div " + col2Class + "'><span class='name-span1'>" +obj["name"] + "</span><span class='rh-card-visualJson-radio'><div>";
	var radioValStr = _self._getRadioVal(obj["value"]); //获取radio的值
	var radioShowStr = _self._getRadioVal(obj["show"]);//获取radio的显示文字
	for (var i = 0; i < radioValStr.length; i++) {
		radioHtml += "<input type='radio' name='visual-json-" + obj["code"] + "'  value='"+ radioValStr[i] +"' style='vertical-align: middle;'><label style='margin-right: 15px;'>" + radioShowStr[i] + "</label></input>";
	}
	_self.radioName.push("visual-json-" + obj["code"]);
	return radioHtml + "</div></span></div>";
};

/**
 * 获取点选按钮的value值
 */
rh.vi.visualJson.prototype._getRadioVal = function(val){
	return val.split(",");
};

/**
 * 获取点选按钮的显示文字
 */
rh.vi.visualJson.prototype._getRadioShow = function(val){
	return val.split(",");
};

/**
 * 元素是否允许为空为true时，获取此元素id
 */
rh.vi.visualJson.prototype._isNotNull = function(obj){
	var _self = this;
	if (obj["notNull"]) {//如果该项不为空，显示红色
		_self.notNullId.push("visual-json-" + obj["code"]);
	}
};

/**
 * 是否为主键code为true时，获取此元素id
 */
rh.vi.visualJson.prototype._isVisualHand = function(obj){
	var _self = this;
	if (obj["isVisualHand"]) {
		_self.isVisualHand.push("visual-json-" + obj["code"]);
	}
};

/**
 * 是否为查询选择，获取此元素id
 */
rh.vi.visualJson.prototype._isChooseConf = function(conf,val){
	var _self = this;
	if (conf) {
		_self.chooseObjs.push({"chooseId":"visual-json-" + val,"conf":conf});
	}
};

/**
 * 是否为目标字段，获取为目标字段的元素id
 */
rh.vi.visualJson.prototype._isTarget = function(obj){
	var _self = this;
	if (obj["isTarget"]) {
		_self.isTarget.push("visual-json-" + obj["code"]);
	}
};

/**
 * 不能为空的元素
 */
rh.vi.visualJson.prototype._notNullEle = function(){
	var _self = this;
	var isNotNull = _self.notNullId;
	for (var i = 0; i < isNotNull.length; i ++) {
		var spanObj = jQuery("#" + isNotNull[i]).parent().parent().find("span[class='name-span1']");
		spanObj.html(spanObj.html() + "<font style='color:red;font-weight:bold;'>*<font>");
	}
};

/**
 * 不能为空的元素添加提示信息
 */
rh.vi.visualJson.prototype._notNullMag = function(){
	var _self = this;
	var isNotNull = _self.notNullId;
	for (var i = 0; i < isNotNull.length; i ++) {
		if ( !jQuery("#" + isNotNull[i]).val()) {
			alert("必填项不能为空，请填写");
			return null;
		}
	}
	return "";
};

/**
 * 获取输入框和文本域的值对象
 */
rh.vi.visualJson.prototype._getInpAndTexObj = function(){
	var _self = this;
	var obj = {};//返回的对象
	var ids = _self.ids;//输入项的id
	var isVisualHand = _self.isVisualHand;//主键字段的id
	for (var i = 0; i < ids.length; i++) {
		var id = ids[i];
		for (var j = 0; j < isVisualHand.length; j ++) {
			if (id != isVisualHand[j] && "" != (jQuery("#" + id).val() || "")) {
				obj[id.substring(id.lastIndexOf("-") + 1,id.length)] = jQuery("#" + id).val();
			}
		}
	}
	return obj;
};

/**
 * 获取单选按钮值对象
 */
rh.vi.visualJson.prototype._getRadioObj = function(){
	var _self = this;
	var radioName = _self.radioName;
	var obj = {};//单独按钮值对象
	for (var i = 0; i < radioName.length; i++) {
		var itemVal = jQuery("input[name='" +radioName[i] + "']:checked").val() || "";
		if (itemVal != "") {
			var item = radioName[i];
			obj[item.substring(item.lastIndexOf("-") + 1,item.length)] = itemVal;
		}
	}
	return obj;
};

/**
 * 如果是原字段服务
 */
rh.vi.visualJson.prototype._isSourceCode = function(sourceVal, extWhere){
	var _self = this;
	//如果是原字段服务
	if (_self._isNotNullExtWhere(extWhere)) {
		if (extWhere.indexOf("$") >= 0) {
			return extWhere.replace(extWhere.substring(extWhere.indexOf("$"),extWhere.lastIndexOf("$") + 1), sourceVal);
		}
	} else {
		return " and SERV_ID = '"+ sourceVal +"'";
	}
};

/**
 * 如果是目标字段
 */
rh.vi.visualJson.prototype._isTargetCode =function(serv_id, extWhere){
	var _self = this;
	//如果是目标字段
	if (_self._isNotNullExtWhere(extWhere)) {
		if (extWhere.indexOf("$") >= 0) {
			return extWhere.replace(extWhere.substring(extWhere.indexOf("$"),extWhere.lastIndexOf("$") + 1), serv_id);
		}
	} else {
		return " and SERV_ID = '"+ serv_id +"'";
	}
};

/**
 * 判断extWhere属性是否为空,不为空返回true，为空返回false
 */
rh.vi.visualJson.prototype._isNotNullExtWhere =function(extWhere) {
	if ((extWhere || "") != "") {
		return true;
	}
	return false;
};


/**
 * 悬浮的对话框，显示鼠标放在某个Element上才显示的信息。
 * opts
 */
rh.vi.HoverDlg = function(opts){
	this.x = 0;//弹出框横坐标
	this.y = 0;//弹出框纵坐标
	var rand = parseInt(Math.random() * 100000);
	this.opts = {"width":"275px","height":"225px","id":"HoverDlg" + rand};
	jQuery.extend(this.opts, opts);
	this.container = this.createDlg();
}

rh.vi.HoverDlg.prototype.createDlg = function(){
	//最外层div
	this.dlgOuterDiv = jQuery("<div class = 'icon-user-info-div-back' name = 'user-entity-dialog-names' ></div>")
		.css({
			"display":"none",
			"position":"absolute",
			"top":this.y,"left":this.x,
			"width":this.opts.width,"height":this.opts.height,
			"z-index":"10000"
		}).appendTo(jQuery("body"));
	
	//添加圆角，阴影。内层div
	var winDialog = jQuery("<div></div>").attr("id", this.opts.id)
		.attr("class", "icon-user-info-div-back rh-user-info-circular-bead rh-user-info-shadow")
		.css({"width":this.opts.width,"height":this.opts.height});
	
	winDialog.appendTo(this.dlgOuterDiv);
	return winDialog;
}

rh.vi.HoverDlg.prototype.removeContent = function(){
	this.container.children().remove();
	this.container.html("");
}

rh.vi.HoverDlg.prototype.show = function(e){
	var position = Mouse.dialogPosition(e, 275, 225);
	this.dlgOuterDiv.css("left",position.x).css("top",position.y);
	this.dlgOuterDiv.show("fast");
}

rh.vi.HoverDlg.prototype.hide = function(){
	this.dlgOuterDiv.fadeOut("fast");	
}

/**
 * 进度条组件,parent进度条的父控件对象,width进度条的宽度,barClass进度条的css
 */
rh.vi.ProgressBar = function(parent, width , barClass){
	this.load(parent, width , barClass);
};

/*
 * 进度条初始化方法
 */
rh.vi.ProgressBar.prototype.load = function(parent, width , barClass){
	this.parent=parent;
	this.pixels = width;
	this.parent.innerHTML="<div/>";
	this.outerDIV = this.parent.childNodes[0];
	this.outerDIV.innerHTML="<div/>";
	this.fillDIV = this.outerDIV.childNodes[0];
	this.fillDIV.innerHTML = "0";
	this.fillDIV.style.width = "0px";
	this.outerDIV.className = barClass;
	this.outerDIV.style.width = (width + 2) + "px";
};

//更新进度条进度 pct的值要介于0和1之间
rh.vi.ProgressBar.prototype.setPercent = function(pct) {
	var fillPixels;
	if (pct < 1.0){
		fillPixels = Math.round(this.pixels * pct);
	}else {
		pct = 1.0;
	  	fillPixels = this.pixels;
	}
	this.fillDIV.innerHTML = Math.round(100 * pct * 10)/10 + "%";
	this.fillDIV.style.width = fillPixels + "px";
};

/*
 * 进度条开始,param presentNum当前数值
 */
rh.vi.ProgressBar.prototype.startAutoDemo = function (presentNum){
	this.presentNum = presentNum;
		var _self = this;
		_self.updatePercent();
};

//演示程序
rh.vi.ProgressBar.prototype.updatePercent = function (){
	var _self = this;
	if(window.count==null){
		window.count=0;
	} else {
		window.count = _self.presentNum;
	}
	window.count=count%100;
	jtProBar.setPercent(window.count/100);
	window.dataDIV = progressBar.childNodes[0].childNodes[0].innerHTML;
	if (window.dataDIV == "100%") {
		stopAutoDemo();
		window.loadOk = window.setInterval(function(){
			window.clearInterval(window.loadOk);
		},10);
	}
};


