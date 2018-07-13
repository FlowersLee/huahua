/**
 * 构造多个树的dialog
 * @param {} options
 * <input id="dialog" type="button" value="弹出" />
 * $("#dialog").click(function(){
 * 		new rh.ui.DialogTree({"title":"角色、组织机构","dictIDs":[{"id":"SY_ORG_ROLE","showcheck":true},{"id":"SY_ORG_DEPT_USER","showcheck":true}],confirm:function(ids){
 *  		alert(ids[0].length);
 *  	}}).open();
 * });
 */
rh.ui.DialogTree = function(options) {
	
	var defaults = {
		"dictIDs": [],//[{"id":"SY_ORG_DEPT_USER","showcheck":true}],
		"hide" : "",
		"show" : "",
		"resizable" : true,
		"draggable" : false,
		"title" : "标题",
		"id" : "",	// 传入一个id，为了使得该dialog唯一
		"confirm" : false
	};
	
	// 合并默认配置参数和传入的参数
	this._opts = jQuery.extend(defaults, options);
	
	// 保存当前dialog里的树
	this._tree = [];
	
	this.dialogID = GLOBAL.getUnId("dialogTree", this._opts.id);
};

/**
 * 打开该Dialog
 */
rh.ui.DialogTree.prototype.open = function() {
	var _self = this;
	jQuery("#" + this.dialogID).dialog("destroy");
	
	// 构造Dialog
	_self.dialog = jQuery("<div></div>").addClass("dictDialog").attr("id", this.dialogID).attr("title", _self._opts.title);
	_self.dialog.appendTo(jQuery("body"));
	
	var height = 330;
    var width = 280;
	jQuery("#" + _self.dialogID).dialog({
		autoOpen: false,
		height: height,
		width: width,
		modal: false,
		hide: _self._opts.hide,
		show: _self._opts.show,
		resizable: _self._opts.resizable,
		position: '',
		buttons: {
			"确认": function() {// 确认时把结果传入回调方法里
				if(_self._opts.confirm && typeof(_self._opts.confirm) == "function") {
					var ids = [];// 所有ID，没棵树的被选中的值作为数组放入
					jQuery.each(_self._tree, function(index, tree) {
						var tmp = [];
						jQuery.each(tree.getCheckedNodes(), function(index, item) {
							tmp.push({"id":item.ID,"name":item.NAME});	
						});
						ids.push(tmp);
					});
					_self._opts.confirm.call(_self, ids);
				}
				
				jQuery("#" + _self.dialogID).dialog("close");
			},
			"关闭": function() {
				jQuery("#" + _self.dialogID).dialog("close");
			}
		},
		open: function() { 
		},
		close: function() {
			_self.dialog.remove()
		}
	});
    jQuery("#" + this.dialogID).dialog("open");
    jQuery(".ui-dialog-titlebar").last().css("display","block");//设置标题显示
    
    // 构建树
    this._buildTree();
};

rh.ui.DialogTree.prototype._buildTree = function() {
	var _self = this;
	var setting = {
    	showcheck: false,   
        theme: "bbit-tree-no-lines", //bbit-tree-lines ,bbit-tree-no-lines,bbit-tree-arrows
        rhexpand: true,
        cascadecheck: false,
        checkParent: false,
        root_no_check: true,
        onnodeclick: function(item, id) {
        	jQuery.each(_self._tree, function(index, tree){
        		if(tree.getId() != id) {// 收起其它树,并取消其它树的选中
        			tree.unselected();
        		}
        	});
        },
        oncheckboxclick: function(item, s, id) {
        	jQuery.each(_self._tree, function(index, tree){
        		if(tree.getId() != id) {// 收起其它树,并取消其它树的选中
        			tree.unselected();
        		}
        	});
        }
    };

    jQuery.each(this._opts.dictIDs, function(index, dict){
    	if (dict.showcheck) {
    		setting["showcheck"] = true;
	    }
	    setting.data = FireFly.getDict(dict.id);
	    _self._tree.push(new rh.ui.Tree(setting));
		_self.dialog.append(_self._tree[_self._tree.length - 1].obj);
    });
};