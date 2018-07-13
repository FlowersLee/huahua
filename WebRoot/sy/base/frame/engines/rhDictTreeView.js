/** 字典选择弹出框页面渲染引擎 */
GLOBAL.namespace("rh.vi");
/*待解决问题：
 * 
 * */
rh.vi.rhDictTreeView = function(options) {
	var defaults = {
		"id":"-viDictTreeView",
		"sId":"",//服务ID
		"aId":"", //操作ID
		"pCon":null,
		"pId":null,
		"linkWhere":"",
		"itemCode":null,
		"config":"",
		"rebackCodes":null,
		"hide":"",
		"show":"",
		"resizable": false,
		"replaceData":null,//替换的树形展示数据
		"replaceCallBack":null,//替换的回调方法
		"replaceNodeClick":null,//单击方法
		"afterFunc":null,//回写之后的回调函数
		"extendDicSetting":null,//扩展的树形参数设置
		"parHandler":null,
		"formHandler":null,
		"cardHandler":null,// 用于计算字段框的位置
		"searchFlag":false,
		"dialogName":null,
		"nameItemCode":null   //保存选中数据名称的字段，此字段仅用于保存名称，ID还保持在原字段中。
	};
	this.opts = jQuery.extend(defaults,options);
	this.parHandler = this.opts.parHandler;
	this.formHandler = this.opts.formHandler;
	this.cardHandler = this.opts.cardHandler;
	var config = this.opts.config;
	var confArray = config.split(",");
	this.dictId = confArray[0];
	this.dialogName = "字典选择";
	
	var conf = confArray.slice(1);
	this._confJson = StrToJson(conf.join(","));
	/* add by wangchen -begin*/
	//针对传阅，多选时可以全选部门下的节点
	this._multiCheckBox = this._confJson && (this._confJson.CHECKBOX) ? this._confJson.CHECKBOX:false; //多选时是否启用checkbox
	if (this._multiCheckBox) {
		//{'TYPE':'multi','extendDicSetting':{'rhexpand':false,'expandLevel':1,'cascadecheck':true,'checkParent':false,'childOnly':true}}
		//conf = "{'TYPE':'multi','extendDicSetting':{'rhexpand':false,'expandLevel':1,'cascadecheck':true,'checkParent':false,'childOnly':true}}";
		//this._confJson = StrToJson(conf);
	}
	/* add by wangchen -end*/
	this._treeType = this._confJson && (this._confJson.TYPE) ? this._confJson.TYPE:"single";
	this._modelSet = this._confJson && (this._confJson.MODEL) ? this._confJson.MODEL:null;//默认是default，显示右侧选中节点为link
	
	this._model = "default";//默认是default，显示右侧选中节点为link
	if (this._treeType == "single") {//单选不出右侧容器
		this._model = "default";
	}
	if (this._treeType == "multi") {//link默认为单选模式
		this._model = "link";
		/*modify by wangchen-begin*/
		if (!this._multiCheckBox) {
			this._treeType = "single";
		}
		/*modify by wangchen-end*/
		if (this._modelSet == "default") {//重新处理default情况
			this._treeType = "multi";
			this._model = "default";
		}
	}
	if (this._modelSet) {//有传递model的为高优先级
		this._model = this._modelSet;
	}
	this._searchType = this._confJson && (this._confJson.SEARCHTYPE) ? this._confJson.SEARCHTYPE:null;
	if (this.opts.searchFlag && this._searchType) {
		this._treeType = this._searchType;
	}
	this.level = this._confJson && (this._confJson.LEVEL) ? this._confJson.LEVEL:null;//显示层级
	this.showPid = this._confJson && (this._confJson.SHOWPID) ? this._confJson.SHOWPID:false;//是否显示父节点
	this._pid = this._confJson && (this._confJson.PID) ? this._confJson.PID:null;
	this.configExtendDicSetting = this._confJson && (this._confJson.extendDicSetting) ? this._confJson.extendDicSetting:null;
	this.extendBackItem = this._confJson && (this._confJson.extendBackItem) ? this._confJson.extendBackItem:null;
	this.rtnLeaf = this._confJson && (this._confJson.rtnLeaf) ? this._confJson.rtnLeaf:false;//只返回叶子节点值
	this.rtnNullFlag = this._confJson && (this._confJson.rtnNullFlag) ? this._confJson.rtnNullFlag:false;//空值也返回
	this.contentMain = jQuery();
	this._data = null;	
	this._searchWhere = "";//查询条件
	this._extWhere = this._confJson && (this._confJson.EXTWHERE) ? this._confJson.EXTWHERE:null;//扩展条件
	this.dialogId = GLOBAL.getUnId("dictDialog",Tools.rhReplaceId(this.dictId));
	this._linkWhere = this.opts.linkWhere;//关联功能过滤条件
	this.links = this.opts.links || {};//关联功能过滤条件
	this._height = "";
	this._width = "";
	this._pCon = this.opts.pCon;//树要放到的容器
	  
	this.LINK_WHERE = UIConst.LINK_WHERE;  
	this.SEARCH_WHERE = UIConst.SEARCH_WHERE;   
	this.params = this.opts.params;
	
	if(this._confJson && this._confJson.params){
		this.params = jQuery.extend(this.params,this._confJson.params);
	}
	
	if(this._confJson && this._confJson.nameItemCode){
		this.opts.nameItemCode = this._confJson.nameItemCode;
	}
	
};
/*
 * 渲染页面主方法
 */
rh.vi.rhDictTreeView.prototype.show = function(event,replacePosArray) {
	var _self = this;
	this._initMainData();
	if (this._pCon) {
		
	} else {
		this._layout(event,replacePosArray);
	}
	//this._bldSearch();
	this._bldDictTree();
	setTimeout(function() {
		_self._bldSelectedNode();
	},0);
	//this._afterLoad();
};
/*
 * 构建弹出框页面布局
 */
rh.vi.rhDictTreeView.prototype._layout = function(event,replacePosArray) {
	var _self = this;
	jQuery("#" + this.dialogId).dialog("destroy");
	//1.构造dialog
	this.winDialog = jQuery("<div></div>").addClass("dictDialog").attr("id",this.dialogId).attr("title",this.dialogName);
	this.winDialog.appendTo(jQuery("body"));
	
	var hei = GLOBAL.getDefaultFrameHei() - 100;
	var scroll = RHWindow.getScroll(window.top);
    var viewport = RHWindow.getViewPort(window);
    
    // 可视高度，如果本卡片的高度大于可视区域的高度则取可视区域的高度，否则取卡片的高度减去卷去的高度
    var cardHeight = jQuery(document).height() - 20;
    var viewportHeight = Math.min(viewport.height, cardHeight);
    viewportHeight = Math.min(viewport.height, cardHeight - (scroll.top > 45 ? scroll.top - 45 : 0));
    
	// 如果可视区域高度小于等于dialog高度则改变dialog高度
	if (viewportHeight <= hei) {
		hei = viewportHeight;
	}
	// 高度不能小于0
	if (hei <= 300) {
		hei = 300;
	}
	// 如果计算之后的高度实在是太矮则往上滚动
	if (viewportHeight - hei < 100) {
		jQuery(window.top.document).scrollTop(scroll.top - (hei - viewportHeight + 100 + 82)); 
		scroll = RHWindow.getScroll(window.top);
	    viewport = RHWindow.getViewPort(window);
	}
	
	var wid = 290;
    if (this._model == "link") {
    		wid = 690;
    }
    
    // 居中显示
    var top = scroll.top;
    
    // 对于关联服务为iframe的tab，由于它的父有45像素的头，所以弹出框往上移动45像素
    if (window.top.top != parent.window) { // 三级iframe
    		top -= 45;
    }
    var left = scroll.left + viewport.width / 2 - wid / 2;
    
    var posArray = [left,top];
    
    if (replacePosArray) {
    		posArray = replacePosArray;
    }

	jQuery("#" + this.dialogId).dialog({
		autoOpen: false,
		height: hei,
		width: wid,
		modal: true,
		hide:_self.opts.hide,
		show:_self.opts.show,
		resizable:_self.opts.resizable,
		position:posArray,
		buttons: {
				"确认": function() {
					var curNode = null;
					if (_self._model == "default") {
						if (_self._treeType == "multi") {
							curNode = _self.tree.getCheckedNodes();
						} else {
							curNode = [];
							curNode.push(_self.tree.getCurrentNode());
							//单选的时候，只选叶子节点，
							if (_self.rtnLeaf && _self.tree.hasChild(_self.tree.getCurrentNode()) || !_self.tree.getCurrentNode()) {
								alert("请选择具体的" + _self.dialogName + "！");
								return false;
							}
						}
						if (((curNode == null) || curNode.length == 0) && _self.rtnNullFlag == false) {
							alert("请选择" + _self.dialogName + "！");
							return false;
						}
					}
					_self.backWriteItem(curNode);
				},
				"关闭": function() {
					jQuery("#" + _self.dialogId).dialog("close");
					//jQuery(".bbit-tree-selected").removeClass("bbit-tree-selected");
				}
		},
		open: function() { 

		},
		close: function() {
			_self.winDialog.remove();
		}
	});
	var dialogObj = jQuery("#" + this.dialogId);
	dialogObj.dialog("open");

	dialogObj.parent().addClass("rh-small-dialog").addClass("rh-bottom-right-radius");
    jQuery(".ui-dialog-titlebar").last().css("display","block");//设置标题显示
};
/*
 * 构造树
 */
rh.vi.rhDictTreeView.prototype._bldDictTree = function() {
	var _self = this;
	var dictUrl = FireFly.getContextPath() + "/SY_COMM_INFO.dict.do";
	if(_self.params){
		dictUrl += "?" + jQuery.param(_self.params);
	}
	var setting = {
		rhexpand: false,
    	showcheck: false,   
    	url: dictUrl, 
    	dictId : this.dictId,
        theme: "bbit-tree-no-lines", //bbit-tree-lines ,bbit-tree-no-lines,bbit-tree-arrows
        rhItemCode:this.opts.itemCode,
        handler: this, //本实例句柄需要传递  add by wangchen
        onnodeclick: function(item) {
			/*modify by wangchen-begin*/
			if (!_self._multiCheckBox) {
	        	if (_self.opts.replaceNodeClick != null) {//增加单击覆盖 2013-03-14 jinkai
	        		        var backFunc = _self.opts.replaceNodeClick;
	                        backFunc.call(_self.opts.parHandler,item);
	        	}
	        	//设置右侧显示
	        	_self._setRightSelect(item);
		    	return false;
			}
			/*modify by wangchen-end*/
		},
		onnodedblclick : function(item) {
			if (_self._model == "default") {
				var str = [];
				str.push(item);
				//单选的时候，只选叶子节点，
				if (_self.rtnLeaf && _self.tree.hasChild(item)) {
					alert("请选择具体的" + _self.dialogName + "！");
					return false;
				}
				_self.backWriteItem(str);
			}
		},
		oncheckboxclick : function(item,s,id) {
			/*modify by wangchen-begin*/
			if (this._multiCheckBox) {
				_self._checkClick(item,s,id);//多选框的点击绑定
			}
			/*modify by wangchen-end*/
		}
    };
    setting.rhLeafIcon = Tools.getTreeLeafClass(this.dictId);//系统默认提供
    if (this._treeType == "multi") {
    	setting["showcheck"] = true;
    }
    if (this.configExtendDicSetting) {
    	setting = jQuery.extend(setting,this.configExtendDicSetting);//合并扩展的树形设置信息    	
    }
    if (_self.opts.replaceData) {
	    var tempData =_self.opts.replaceData;// 替换的显示数据
	    if (tempData.length > 0) {
		    this.dialogName = tempData[0].NAME;
		    setting.data = tempData[0].CHILD;
	    }
    } else {
    	var extWhere = Tools.parVarReplace(this._extWhere);
    	extWhere = Tools.systemVarReplace(extWhere);
    	setting.extWhere = extWhere;
	    var tempData = FireFly.getDict(this.dictId,_self._pid,extWhere,_self.level,_self.showPid,_self.params);//设置树的初始化数据
	    this.dialogName = tempData[0].NAME;
	    setting.data = tempData[0].CHILD;
    }
    if (this.opts.extendDicSetting) {
    	setting = jQuery.extend(setting,this.opts.extendDicSetting);//合并扩展的树形设置信息
    }
    if (this.opts.dialogName) {//替换标题
    	this.dialogName = this.opts.dialogName;
    }
    if (setting.childOnly) {
    	this.opts.childOnly = true;
    }
    this.tree = new rh.ui.Tree(setting);
    var container = jQuery("<div class='dictTree-left'></div>");
    if (this._model == "link") {
    	container.addClass("dictTree-left--50");
    }
    container.append(this.tree.obj);
    if (this._pCon) {
    	this._pCon.append(container);
    } else {
    	this.winDialog.parent().find(".ui-dialog-title").text(this.dialogName);
    	this.winDialog.append(container);
    }
};
/*
 * 回写值
 */
rh.vi.rhDictTreeView.prototype.backWriteItem = function(nodes) {
	var id=[],value=[];
	var _self = this;
	if (this._model == "default") {//默认模式
		if (_self.rtnLeaf == true || _self.rtnLeaf == "true") { //如果只需要 取到 叶子值，去掉不是叶子节点的节点
			jQuery.each(nodes, function(i, n) {
				if (!_self.tree.hasChild(n)) {
					id.push(n.ID);
					value.push(n.NAME);
				}
			});
		} else {
			jQuery.each(nodes, function(i, n) {
				id.push(n.ID);
				value.push(n.NAME);
			});
		}	
	} else if (this._model == "link") {//右侧列表模式
		var backData = jQuery(".dictTree-dataItem",_self.winDialog);
		jQuery.each(backData, function(i,n) {
			var item = jQuery(n);
			id.push(item.attr("data-id"));
			value.push(item.attr("data-name"));
		});
	}
	var ret = true; // 用于接收回调函数返回值,来判断是否选择成功
    if (_self.opts.replaceCallBack) { //有替换的回调函数
        var backFunc = _self.opts.replaceCallBack;
        ret = backFunc.call(_self.opts.parHandler,id,value);
        if (ret != false) {
        	ret = true;
        }
    } else {
	    if (_self.opts.rebackCodes) {
	 	   jQuery("#" + _self.opts.rebackCodes).val(id.join(","));
	 	   jQuery("#" + _self.opts.rebackCodes + "__NAME").val(value.join(","));
	    } else {
	    	_self.parHandler.setValue(id.join(","));
	    	_self.parHandler.setText(value.join(","));
	    	if (_self.extendBackItem) {//回写扩展字段
	    		_self.formHandler.getItem(_self.extendBackItem).setValue(value.join(","));;
	    	}
	    }
	    
	    if(_self.opts.nameItemCode){ //将名称放到自定字段中
	    	var nameItem = _self.formHandler.getItem(_self.opts.nameItemCode);
	    	if(nameItem.type == 'Text' || nameItem.type == 'Textarea'){
	    		nameItem.setValue(value.join(","));
	    	}
	    } 
	    
	    if (_self.opts.afterFunc) {//回写之后的方法
	        var afterFunc = _self.opts.afterFunc;
	        afterFunc.call(_self.opts.parHandler,id,value);	    	
	    }
    }
    if (ret && typeof(jQuery) == "function") {
    	jQuery("#" + this.dialogId).dialog("close");
    }
};
/*
 * 初始化主数据
 */
rh.vi.rhDictTreeView.prototype._initMainData = function() {
	//默认布局
	var pId = "";
};

/*
 * 设置右侧已选中节点的列表
 */
rh.vi.rhDictTreeView.prototype._bldSelectedNode = function() {
	var _self = this;
	if (this._model == "default") {
		return true;
	}
	var container = jQuery("<div class='dictTree-right'></div>");
	var listNode = jQuery("<div class='dictTree-right-list'></div>").appendTo(container);//选中的元素外容器
	var ul = jQuery("<ul class='dictTree-right-ul'></ul>");
	ul.appendTo(listNode);
	var clearCon = jQuery("<div class='dictTree-list-btncon'></div>");
	var clear = jQuery("<input type='button' value='清空列表' class='dictTree-clear'/>").appendTo(clearCon);
	this.selectedCount = 0; //add by wangchen
	this.selectedCountBox = jQuery("<span id='dictTree-clear'></span>").appendTo(clearCon); //add by wangchen
	this._setSelectCount(0);//add by wangchen
	clear.bind("click",function(event) {
		var res = confirm("确认清空当前已选择的节点吗？");
		if (res) {
			ul.empty();
			_self._setSelectCount(0);
			_self.tree.cleanAndCollapseExcluRoot();
		}
	});
	clearCon.appendTo(listNode);
	container.appendTo(this.winDialog);
	//设置回显
//	var selectedNodes = jQuery(".bbit-tree-selected",this.winDialog);
//	jQuery.each(selectedNodes,function(i,n) {
//		var obj = jQuery(n);
//		var id = obj.attr("itemid");
//		var name = obj.attr("title");
//		var itemObj = {"ID":id,"NAME":name};
//		_self._setRightSelect(itemObj);
//	});
	if (this.parHandler && this.parHandler.getValue && this.parHandler.getText
			|| this.opts.itemCode) {//有父句柄或有传递的itemCode
		var ids = "";
		var names = "";
		var itemCode = this.opts.itemCode;
		if (this.parHandler && this.parHandler.getValue && this.parHandler.getText) {
			ids = this.parHandler.getValue().split(",");
			names = this.parHandler.getText().split(",");			
		} else if (itemCode) {
			var itemObj = jQuery("#" + itemCode);
			if(itemObj.length == 1){
				ids = jQuery("#" + itemCode).val().split(",");
				names = jQuery("#" + itemCode + "__NAME").val().split(",");
			}		
		}
		for (var i = 0; i < ids.length; i++) {
			if (ids[i] == "") {
				return;
			}
			var itemObj = {"ID":ids[i],"NAME":names[i]};
			_self._setRightSelect(itemObj);
		}
	}
	//取消左侧的选中节点
	jQuery(".bbit-tree-selected",this.winDialog).removeClass("bbit-tree-selected");
};

/*
 * 从外面自己制作要填充到右面的数据，是JSON格式的，使用这个方法渲染完弹出框后自动填写到右面
 */
rh.vi.rhDictTreeView.prototype.setRightSelect = function(nodes){
	var _self = this;
	setTimeout(function(){
		jQuery.each(nodes, function(i, n) {
			//回写需要一点儿时间，所以加了一个延时
			var itemObj = {"ID":n.ID,"NAME":n.NAME};
			_self._setRightSelect(itemObj);
		});
	},100);
};

/*
 * 根据当前点的值放到右侧容器中
 */
rh.vi.rhDictTreeView.prototype._setRightSelect = function(itemObj,removeFlag) {
	var _self = this;
	if (this._model == "link") {
		var id = itemObj.ID;//节点的编码
		var name = itemObj.NAME;//节点的名称
		if (this.opts.childOnly && itemObj.CHILD) {//非叶子节点直接返回
			return false;
		}
		var rightUrl = jQuery(".dictTree-right-ul",this.winDialog);
		var leftTree = jQuery(".dictTree-left",this.winDialog);
		var rightObj = jQuery(".dictTree-dataItem[data-id='" + id + "']",rightUrl);
		if (removeFlag == true) {
			if (rightObj.length == 0) { // add by wangchen
				return false; // add by wangchen
			} // add by wangchen
			rightObj.remove();
			this._setSelectCount(-2); // add by wangchen
			return false;
		}			
		if (rightObj.length > 0) {
			return false;
		}
		this._setSelectCount(-1); // add by wangchen
		var item = jQuery("<li class='dictTree-dataItem' data-id='" + id + "' data-name='" + name + "'>" + name + "</li>");
		var span = jQuery("<span class='dictTree-right__delte'>删除</span>").appendTo(item);
		span.bind("click", function(event) {
			/*modify by wangchen-begin*/
			var nodeCheckBox = jQuery("div[itemid='" + id + "']",leftTree).find(".bbit-tree-node-cb");
			if (nodeCheckBox.length == 1 && nodeCheckBox.parent().hasClass("bbit-tree-selected")) {
				jQuery("div[itemid='" + id + "']",leftTree).find(".bbit-tree-node-cb").click();
			} else {
				_self._setSelectCount(-2);
			}
			/*modify by wangchen-end*/
			jQuery(this).parent().remove();
		});
		item.appendTo(rightUrl);
		rightUrl.scrollTop(rightUrl.height());//自动滚动到底部
	}
};

/*
 * 设置右侧计数器 add by wangchen
 */
rh.vi.rhDictTreeView.prototype._setSelectCount = function(flag) {
	if (flag == -1) {
		this.selectedCount++;
	} else if (flag == -2) {
		this.selectedCount--;
	} else {
		this.selectedCount = flag;
	}
	this.selectedCountBox.html("（共" + this.selectedCount + "项）");
};


/*
 * 多选框的点击事件
 */
rh.vi.rhDictTreeView.prototype._checkClick = function(item,s,id) {
	if (this._model == "link") {
		var itemId = item.ID;//节点的编码
		var itemName = item.NAME;//节点的名称
		if (s == 1) {//选中
			this._setRightSelect(item);
		} else if (s == 0) {
			this._setRightSelect(item,true);
		}
	}
};