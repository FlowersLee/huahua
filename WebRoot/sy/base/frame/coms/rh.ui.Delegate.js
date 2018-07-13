/**
 * 授权页面
 * @param {} options
 */
rh.ui.Delegate = function(options) {
	var defaults = {
		"servId": "",
		"dataId": "",
		"itemCode":null,
		"aclType": "",
		"hide" : "",
		"show" : "",
		"resizable" : true,
		"draggable" : true,
		"title" : "标题",
		"replaceCallBack":null,//替换的回调方法
		"afterFunc":null,//回写之后的回调函数
		"rebackCodes":null,
		"nameItemCode":null,  //保存选中数据名称的字段，此字段仅用于保存名称，ID还保持在原字段中。
		"replaceNodeClick":null,//单击方法
		"TYPE":""
	};
	// 合并默认配置参数和传入的参数
	this._opts = jQuery.extend(defaults, options);

	this._model = "default";//默认是default，显示右侧选中节点为link
	// 默认授角色和部门用户
	if (this._opts.deleteTree) {
		this._delegateTree = this._opts.deleteTree;
	} else {
		this._delegateTree = {"ROLE":{"id":"SY_ORG_ROLE","showcheck":false},"DEPT_USER":{"id":"SY_ORG_DEPT_USER_SUB","showcheck":false}};
	}
	
	// 保存当前页面里的树，分别为以字典ID为key
	this._tree = {};
	this._treeType = this._opts.TYPE;
	this._model = "default";//默认是default，显示右侧选中节点为link
	if (this._treeType == "single") {//单选不出右侧容器
		this._model = "default";
	}
	if (this._treeType == "multi") {//link默认为但选择模式
		this._model = "link";
	}
	this.dialogID = GLOBAL.getUnId("dialog-delegate", this._opts.id);
	
	this.tabsID = GLOBAL.getUnId("tabs-delegate", this._opts.id);
	
	// 数据权限
	this.aclData = {};
	
	// 数据权限类型
	this.aclType = defaults.aclType;
	
	// 一开始的角色
	this.preRoleAcl = [];
	
	// 一开始的用户
	this.preDeptUserAcl = [];

	
	// 权限类型按钮
	this.aclTypeBtn = {};
};

/**
 * 打开授权页面
 */
rh.ui.Delegate.prototype.open = function() {
	var _self = this;
	jQuery("#" + this.dialogID).dialog("destroy");
	
	// 构造Dialog
	this.winDialog = jQuery("<div></div>").addClass("cardDialog").attr("id", this.dialogID).attr("title",this._opts.title);
	
	this.winDialog.appendTo(jQuery("body"));
	
	var height = 400;
    var width = 400;
    if(this._model == "link"){
    width = 690;
    }
    var scroll = RHWindow.getScroll(parent.window);
    var viewport = RHWindow.getViewPort(parent.window);
    var top = scroll.top + viewport.height / 2 - height / 2 - 88;
	 
	var posArray = ["", top];
    
	jQuery("#" + _self.dialogID).dialog({
		autoOpen: false,
		height: height,
		width: width,
		modal: true,
		hide: _self._opts.hide,
		show: _self._opts.show,
		resizable: _self._opts.resizable,
		draggable: _self._opts.draggable,
		position: posArray,
	    buttons: {
				"确认": function() {
					_self._save();
				},
				"关闭": function() {
					jQuery("#" + _self.dialogID).dialog("close");
				}
		},
		open: function() { 
		},
		close: function() {
			_self.winDialog.remove();
		}
	});
    jQuery("#" + this.dialogID).dialog("open");
    jQuery(".ui-dialog-titlebar").last().css("display","block");//设置标题显示
    
    this.init();
};

rh.ui.Delegate.prototype.init = function() {
	var _self = this;	
	_self._buildTree();
	setTimeout(function() {
		_self._bldSelectedNode();
	},0);
	
	_self.loadData();
};

rh.ui.Delegate.prototype.loadData = function() {
	var _self = this;
	$.ajax({
        type: "POST",
        url: "SY_SERV_DACL_ITEM.show.do",
        data: {"SERV_ID":_self._opts.servId,"DATA_ID":_self._opts.dataId,"ACL_TYPE":_self.aclType},
        async: false,
        success: function(data){
        	_self.aclData = StrToJson(data);
        	_self._select(_self.aclData[_self.aclType]);
        	_self._expand();
        },
        error: function(e) {alert("error occur!");}
	});
};

/**
 * 构造树
 */
rh.ui.Delegate.prototype._buildTree = function() {
	var _self = this;
	var setting = {
    	showcheck: false,  
    	url: "SY_COMM_INFO.dict.do",
        theme: "bbit-tree-no-lines", //bbit-tree-lines ,bbit-tree-no-lines,bbit-tree-arrows
        rhexpand: false,
        cascadecheck: false,
        
        root_no_check:true,
        rhItemCode:this._opts.itemCode,
        onnodeclick: function(item, id) {
        	jQuery.each(_self._tree, function(key, tree){
        		if(tree.getId() != id) {// 收起其它树,并取消其它树的选中
        			tree.unselected();
        		}
        		
        	});
        	//设置右侧显示
        	var treeid = _self._tree["ROLE"].getId();	
        	var treeuser = _self._tree["DEPT_USER"].getId();
        	
        	if(!item.hasOwnProperty("OTYPE")){
        	 item["OTYPE"] = "1";
        	}
        	_self._setRightSelect(item,id);
        	return false;
        },
        oncheckboxclick: function(item, s, id) {
        	jQuery.each(_self._tree, function(key, tree){
        		if(tree.getId() != id) {// 收起其它树,并取消其它树的选中
        			tree.unselected();
        		}
        	});
        }
    };
   
    var container = jQuery("<div class='dictTree-left'></div>");
    if (this._model == "link") {
    	container.addClass("dictTree-left--50");
    }
    if (this._pCon) {
    	this._pCon.append(container);
    } else {
//    	this.winDialog.parent().find(".ui-dialog-title").text(this.dialogName);
    	this.winDialog.append(container);
    }
     if (setting.childOnly) {
    	this._opts.childOnly = true;
    }
      jQuery.each(_self._delegateTree, function(key, dict){
    	setting["showcheck"] = dict.showcheck;
	    var dictData = FireFly.getDict(dict.id);
	    setting.dictId = dict.id;
	    setting.data = [{"NAME":dictData[0]["NAME"],"isexpand":true,"ID":"root","CHILD":dictData[0]["CHILD"]}];
	    var tree = new rh.ui.Tree(setting);
	    // 保存起来
	    _self._tree[key] = tree;
		container.append(tree.obj);
		
//		_self.tabs.append(tree.obj);
    });  
};

/**
 * 指定选中树的节点
 * @todo 添加其它支持改这
 */
rh.ui.Delegate.prototype._select = function(data) {
	var _self = this;
	_self.preRoleAcl = [];
	_self.preDeptUserAcl = [];
	_self._clean();
	jQuery.each(data, function(index, node){
		var owner = node["ACL_OWNER"];
		var ownerstr = owner.substr(2, owner.length);
		if(_self._tree["ROLE"] && owner.indexOf("R_") == 0) {// 角色
			_self.preRoleAcl.push(node);
			var dataAct = {};
			dataAct["_WHERE_"] = " AND ROLE_CODE ='"+ownerstr+"'";
			var role = FireFly.doAct("SY_ORG_ROLE","finds",dataAct);
			if(role["_DATA_"].length>0){
			var namedata = role["_DATA_"];
			var itemObj = {"ID":ownerstr,"NAME":namedata[0]["ROLE_NAME"],"OTYPE":"1"};
			var fromTreeId = _self._tree["ROLE"].getId();
			
			_self.setRightSelect(itemObj,fromTreeId);
			}
		 } else if (_self._tree["DEPT_USER"] && owner.indexOf("D_") == 0){//部门
		 	_self.preDeptUserAcl.push(node);
		 	var dataDeptAct = {};
		 	dataDeptAct["_WHERE_"] = " AND DEPT_CODE = '"+ownerstr+"'" ;
		 	var dataDeptName = FireFly.doAct("SY_ORG_DEPT_ALL", "finds" ,dataDeptAct);
		 	if(dataDeptName["_DATA_"].length>0){
		 	var dataDeptNames =dataDeptName["_DATA_"];
			var itemDept = {"ID":ownerstr,"NAME":dataDeptNames[0]["DEPT_NAME"],"OTYPE":"2"};
			var fromtreeid = _self._tree["DEPT_USER"].getId();
			_self.setRightSelect(itemDept,fromtreeid);
		 	}
		 	
		} else if(_self._tree["DEPT_USER"] && owner.indexOf("U_") == 0) {//用户
			_self.preDeptUserAcl.push(node);
			var dataUserAct = {};
		    dataUserAct["_WHERE_"] =" AND USER_CODE = '"+ownerstr+"'";
			
			var dataUserName = FireFly.doAct("SY_ORG_USER_ALL","finds", dataUserAct);
			if(dataUserName["_DATA_"].length>0){
			var dataUserNames = dataUserName["_DATA_"];
			var itemObj = {"ID":ownerstr,"NAME":dataUserNames[0]["USER_NAME"],"OTYPE":"3"};
			var fromtreeid = _self._tree["DEPT_USER"].getId();
			_self.setRightSelect(itemObj,fromtreeid);
			}
		}
	});
};

/**
 * 清空树
 */
rh.ui.Delegate.prototype._clean = function() {
	var _self = this;
	jQuery.each(_self._tree, function(key, tree){
		tree.clean();
	});
};

/**
 * 展开树
 */
rh.ui.Delegate.prototype._expand = function() {
	var _self = this;
	jQuery.each(_self._tree, function(key, tree){
		// 展开有子节点被选中的节点
		tree.expandParent();
	});
};

/**
 * 取得添加的和删除的权限实体
 * @todo 添加其它支持改这
 */
rh.ui.Delegate.prototype._save = function() {
	var _self = this;
	
	// 需要删除的IDs
	var deleteIds = [];
	
	// 需要添加的节点
	var addedNodes = [];
	var id =[],value =[];// 所有的用户和角色
	var roleAcl = [];//只过滤角色
	var deptUserAcl = [];//只过滤用户和部门
	//保存之前获取右侧的选中的值
	var backData = jQuery(".dictTree-dataItem",_self.winDialog);
		var roletreeid = this._tree["ROLE"].getId();
		var usetreeid = this._tree["DEPT_USER"].getId();
		jQuery.each(backData, function(i,n) {		
			var item = jQuery(n);
//           判断是来自那棵树的id
			if(item.attr("data-checkFromTreeId")==roletreeid){
			var roles = {};
			roles["ID"] = item.attr("data-id");
			roles["NAME"] = item.attr("data-name");
			roleAcl.push(roles);
			} else if(item.attr("data-checkFromTreeId") == usetreeid) {
			
			var users = {};
			users["ID"] = item.attr("data-id");
			users["NAME"] = item.attr("data-name");
			users["OTYPE"] = item.attr("otype");
			deptUserAcl.push(users);
			}
			id.push(item.attr("data-id"));
			value.push(item.attr("data-name"));
		});
		
	// 处理角色的增加和删除
	if (this._tree["ROLE"]) {
      var tree = this._tree["ROLE"].getId();
//    	var roleAcl = this._tree["ROLE"].getCheckedNodes();
		// 获取添加删除的角色

		var roleAclAdd = this._getRoleDiffNodes(roleAcl, this.preRoleAcl, true);
		var roleAclDelete = this._getRoleDiffNodes(this.preRoleAcl, roleAcl, false);
		
		jQuery.each(roleAclDelete, function(index, item) {
			deleteIds.push(item["ACL_ID"]);
		});
		if(_self._opts["dataId"] == ""){
		alert("请先保存栏目之后，在选择相关的权限！");
		jQuery("#" + _self.dialogID).dialog("close");
		return;
		} else {
		jQuery.each(roleAclAdd, function(index, item){
			var node = {};
			node["SERV_ID"] = _self._opts["servId"];
			node["DATA_ID"] = _self._opts["dataId"];
			node["ACL_TYPE"] = _self.aclType;
			node["ACL_OWNER"] = "R_" + item["ID"];
			addedNodes.push(node);
		});
		}
	}
	
	// 处理用户的增加和删除
	if (this._tree["DEPT_USER"]) {
//  	var deptUserAcl = this._tree["DEPT_USER"].getCheckedNodes();
		
		// 获取添加删除的用户
		var deptUserAdd = this._getDeptUserDiffNodes(deptUserAcl, this.preDeptUserAcl, true);
		var deptUserDelete = this._getDeptUserDiffNodes(this.preDeptUserAcl, deptUserAcl, false);
		
		jQuery.each(deptUserDelete, function(index, item){
			deleteIds.push(item["ACL_ID"]);
		});
		if(_self._opts["dataId"] == ""){
		alert("请先保存栏目之后，在选择相关的权限！");
		jQuery("#" + _self.dialogID).dialog("close");
		return;
		} else {
		jQuery.each(deptUserAdd, function(index, item){
			var node = {};
			node["SERV_ID"] = _self._opts["servId"];
			node["DATA_ID"] = _self._opts["dataId"];
			node["ACL_TYPE"] = _self.aclType;
			if(item["OTYPE"] == 2) {
				node["ACL_OWNER"] = "D_" + item["ID"];
			} else if(item["OTYPE"] == 3) {
				node["ACL_OWNER"] = "U_" + item["ID"];
			}
			addedNodes.push(node);
		});
		}

		
		
		
		
	}
	
	if(deleteIds.length > 0 && addedNodes.length > 0) {
		FireFly.batchSave("SY_SERV_DACL_ITEM",{"BATCHDELS":deleteIds.join(","),"BATCHDATAS":addedNodes}, function(){_self.loadData();});
	} else if(deleteIds.length > 0) {// 只有删除
		FireFly.batchSave("SY_SERV_DACL_ITEM",{"BATCHDELS":deleteIds.join(",")}, function(){_self.loadData();});
	} else if(addedNodes.length > 0) {// 只有添加
		FireFly.batchSave("SY_SERV_DACL_ITEM",{"BATCHDATAS":addedNodes}, function(){_self.loadData();});
	} else {// 没有变化
		Tip.showError("权限没有任何改变！", true);
	}              
};

/**
 * 过滤出左边比右边多的角色
 * @param {} arr1
 * @param {} arr2
 * @param {} isAdd 是否获取添加的
 * @return {}
 * @todo 添加其它支持得添加一个类似的方法
 */
rh.ui.Delegate.prototype._getRoleDiffNodes = function(arr1, arr2, isAdd) {
	return jQuery.grep(arr1, function(item1) {
		var bool = true;
		jQuery.each(arr2, function(index2, item2){
			if(isAdd) {
				if("R_" + item1["ID"] == item2["ACL_OWNER"]) {// 过滤掉
					bool = false;
					return;
				}
			} else {
				if(item1["ACL_OWNER"] == "R_" + item2["ID"]) {// 过滤掉
					bool = false;
					return;
				}
			}
		});
		return bool;
	});
};




/**
 * 过滤出左边比右边多的部门和用户
 * @param {} arr1
 * @param {} arr2
 * @param {} isAdd
 */
rh.ui.Delegate.prototype._getDeptUserDiffNodes = function(arr1, arr2, isAdd) {
	return jQuery.grep(arr1, function(item1) {
		var bool = true;
		jQuery.each(arr2, function(index2, item2){
			if(isAdd) {
				if(item1["OTYPE"] == 2) {// 部门
					if("D_" + item1["ID"] == item2["ACL_OWNER"]) {// 过滤掉
						bool = false;
						return;
					}
				} else if(item1["OTYPE"] == 3) {// 用户
					if("U_" + item1["ID"] == item2["ACL_OWNER"]) {// 过滤掉
						bool = false;
						return;
					}
				}
			} else {
				if(item2["OTYPE"] == 2) {// 部门
					if(item1["ACL_OWNER"] == "D_" + item2["ID"]) {// 过滤掉
						bool = false;
						return;
					}
				} else if(item2["OTYPE"] == 3) {// 用户
					if(item1["ACL_OWNER"] == "U_" + item2["ID"]) {// 过滤掉
						bool = false;
						return;
					}
				}
			}
		});
		return bool;
	});
};

/*
 * 设置右侧已选中节点的列表
 */
rh.ui.Delegate.prototype._bldSelectedNode = function() {
	var _self = this;

//	if (this._model == "default") {
//		return true;
//	}
	var container = jQuery("<div class='dictTree-right'></div>");
	var listNode = jQuery("<div class='dictTree-right-list'></div>").appendTo(container);//选中的元素外容器
	var ul = jQuery("<ul class='dictTree-right-ul'></ul>");
	ul.appendTo(listNode);
	var clearCon = jQuery("<div class='dictTree-list-btncon'></div>");
	var clear = jQuery("<input type='button' value='清空列表' class='dictTree-clear'/>").appendTo(clearCon);
	clear.bind("click",function(event) {
		var res = confirm("确认清空当前已选择的节点吗？");
		if (res) {
			ul.empty();
		}
	});
	clearCon.appendTo(listNode);
	container.appendTo(this.winDialog);
	//取消左侧的选中节点
	jQuery(".bbit-tree-selected",this.winDialog).removeClass("bbit-tree-selected");
};

/*
 * 从外面自己制作要填充到右面的数据，是JSON格式的，使用这个方法渲染完弹出框后自动填写到右面
 */
rh.ui.Delegate.prototype.setRightSelect = function(nodes,checkFromTreeId){
	var _self = this;
	setTimeout(function(){
			//回写需要一点儿时间，所以加了一个延时
//			var itemObj = {"ID":n.ID,"NAME":n.NAME};
			_self._setRightSelect(nodes,checkFromTreeId);
	
	},100);
};

/*
 * 根据当前点的值放到右侧容器中
 */
rh.ui.Delegate.prototype._setRightSelect = function(itemObj,checkFromTreeId,removeFlag) {
	if (this._model == "link") {
		var id = itemObj.ID;//节点的编码
		var name = itemObj.NAME;//节点的名称
		var otype = itemObj.OTYPE;//区分用户和部门
//		if (this._opts.childOnly && itemObj.CHILD) {//非叶子节点直接返回
//			return false;
//		}
		var rightUrl = jQuery(".dictTree-right-ul",this.winDialog);
		var leftTree = jQuery(".dictTree-left",this.winDialog);
		var rightObj = jQuery(".dictTree-dataItem[data-id='" + id + "']",rightUrl);
		if (removeFlag == true) {
			rightObj.remove();
			return false;
		}
		if (rightObj.length > 0) {
			return false;
		}
		var item = jQuery("<li class='dictTree-dataItem' data-id='" + id + "'  data-checkFromTreeId= '"+checkFromTreeId+"'  otype = '"+otype+"' data-name='" + name + "'>" + name + "</li>");
		var span = jQuery("<span class='dictTree-right__delte'>删除</span>").appendTo(item);
		span.bind("click", function(event) {
			//jQuery("div[itemid='" + id + "']",leftTree).find(".bbit-tree-node-cb").click();
			jQuery(this).parent().remove();
		});
		item.appendTo(rightUrl);
		rightUrl.scrollTop(rightUrl.height());//自动滚动到底部
	}
};
