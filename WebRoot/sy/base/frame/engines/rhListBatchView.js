/** 可批量添加列表页面渲染引擎 */
GLOBAL.namespace("rh.vi");
/*待解决问题：
 * 
 * */
rh.vi.listViewBatch = function(options) {
	var _self = this;
	var defaults = {
		"id":options.sId + "-viListViewBatch",
		"sId":"",//服务ID
		"aId":"", //操作ID
		"pCon":null,
		"pId":null,
		"linkWhere":"",
		"linkServQuery":"",  //是否保留关联服务过滤，不设置的话，取“关联服务”配置中的值
		//关联服务配置数据
		"linkServData":{},
		"cardFlag":false //是否以卡片方式展示一条记录
	};
	this.opts = jQuery.extend(defaults,options);
	this.id = this.opts.id;
	this._sId = this.opts.sId;
	//表单类型
	this.type = "DataService";
	//alert(JsonToStr(this.opts.linkServData.SY_SERV_LINK_ITEM[1]));
	//所属卡片
	this.cardObj = this.opts.cardObj;
	//只读标识
	this.isReadOnly = this.opts.isReadOnly;
	//隐藏标识
	this.isHidden = this.opts.isHidden;
	//批量编辑标识
	this.batchFlag = this.isReadOnly ? false : true;
	//标识是否全部列为修改
	this.allTDModify = this.isReadOnly ? false : true;
	//所在form表单数据，修改时使用
	this._formData = {};
	this._parHandler = this.opts.parHandler;
	this._data = null;
	this._linkWhere = this.opts.linkWhere;//关联功能过滤条件
	this.links = this.opts.links || {};//关联功能过滤条件
	//alert(JsonToStr(this.links));
	this._linkServQuery = this.opts.linkServQuery;
	this._height = "";
	this._width = this.opts.width;
	//关联服务配置数据
	this._linkServData = this.opts.linkServData;
	//关联明细定义-过滤关联字段,提交数据时使用提供默认值使用
	this._linkWhereItemArray = [];
	//删除的主键缓存对象,例：{‘11’:'11','22':'22'}，保持key和value都是主键值，方便删除
	this._deleteDataPks = {};
	//是否以卡片方式展开一条记录
	this._cardFlag = this.opts.cardFlag;
};
/*
 * 渲染列表主方法
 */
rh.vi.listViewBatch.prototype.render = function() {
	this._initMainData();
	this._layout();
	this._bldBtnBar();
	this._bldGrid();
	this._afterLoad();
};
/*
 * 重新渲染组件
 */
rh.vi.listViewBatch.prototype._reRender = function() {
	this.content.remove();
	this._layout();
	this._bldBtnBar();
	this._bldGrid();
	this._afterLoad();
};
/*
 * 构建列表页面布局
 */
rh.vi.listViewBatch.prototype._layout = function() {
	//默认布局
	var pCon = this.opts.pCon;
	this.content = jQuery("<div id='"+this.id+"'></div>").addClass("content-mainCont").width(this._width);
	this.content.appendTo(pCon);
};
/*
 * 初始化服务主数据，包括服务定义、字段、按钮等
 */
rh.vi.listViewBatch.prototype._initMainData = function() {
	this._data = FireFly.getServMainData(this._sId);
};
/*
 * 构建列表(rh.ui.grid)，包括按钮、数据表格、分页条
 */
rh.vi.listViewBatch.prototype._bldGrid = function() {
	var _self = this;
	//判断如果_listData为null，则请求数据。
	if(!this._listData || jQuery.isEmptyObject(this._listData)){
		var options = {};
		this._linkWhere  =  this._linkWhere ? this._linkWhere : " and 1=2";
		options[UIConst.LINK_WHERE] = this._linkWhere;
		//设定不分页，取所有记录
		options["_NOPAGE_"] = "true";
		this._listData =  FireFly.getPageData(this._sId,options) || {};	
	}
	//列表行按钮，只读时不生成按钮
	var rowBtns = this.isReadOnly ? [] :  [{"ACT_NAME":"删除","ACT_CODE":"markDelete","ACT_CSS":"delete"}];
	
	var temp = {"id":this.opts.id,"pid":this.opts.pId,"mainData":this._data,
	            "parHandler":this,"pCon":this.content,"rowBtns":rowBtns,"allTDModify":this.allTDModify,
	            "batchFlag":this.batchFlag,"sortGridFlag":"false","buildPageFlag":"false","cardFlag":this._cardFlag};
	temp["listData"] = this._listData;
	this.grid = UIFactory.create(rh.ui.grid,temp);
	this.grid.render();	
};
/**
 * 打开修改页面
 */
rh.vi.listViewBatch.prototype._openModify = function(pkConf) {
	var _self = this;
	var temp = {"act":UIConst.ACT_CARD_MODIFY,"sId":_self._sId,"parHandler":_self,"widHeiArray":[600,300],"xyArray":[200,100]};
    temp[UIConst.PK_KEY] = pkConf;
    var cardView = new rh.vi.cardView(temp);
    cardView.show();
}
/*
 * 获取服务和id的合并值(服务-ID)
 * @param id ID值
 */
rh.vi.listViewBatch.prototype._getUnId = function(id) {
    return this.id + "-" + id;
};
/*
 * 根据动作绑定相应的方法
 * @param aId 动作ID
 */
rh.vi.listViewBatch.prototype._act = function(aId,aObj) {
	var _self = this;
	var taObj = aObj;
	switch(aId) {
		case UIConst.ACT_BATCH_ADD://添加
			taObj.bind("click",function() {
			    //是否以卡片方式打开
				if(_self._cardFlag == true){
					var links = {};
					if (_self.opts.linkServData) {
						var linkItem = _self.opts.linkServData.SY_SERV_LINK_ITEM || {};
						jQuery.each(linkItem, function(i,n) {
							if (n.LINK_VALUE_FLAG == 1) {//主单数据项值
				                var value = _self._parHandler.itemValue(n.ITEM_CODE);
				                //如果页面上没有，则去links里找一下
				                if ((value == null || value==undefined) && _self.links) {
				                    value = _self.links[n.ITEM_CODE];
				                }
				                links[n.LINK_ITEM_CODE] = value;
				                if (_self._parHandler.form && _self._parHandler.form.getItem(n.ITEM_CODE) && _self._parHandler.form.getItem(n.ITEM_CODE).type == "DictChoose") {//字典类型传递关联值处理
				                    links[n.LINK_ITEM_CODE + "__NAME"] = _self._parHandler.form.getItem(n.ITEM_CODE).getText();
				                }
				            }
						});
					}
					var temp = {"act":UIConst.ACT_CARD_ADD,"sId":_self._sId,"parHandler":_self,"links":links,"widHeiArray":[600,300],"xyArray":[200,100]};
				    var cardView = new rh.vi.cardView(temp);
				    cardView.show();
				} else {
					_self._addNewTr();
				}
               return false;
			});	
			break;
	}
};
/*
 * 构建按钮条
 */
rh.vi.listViewBatch.prototype._bldBtnBar = function() {
	var _self = this;
	var tempData = [{"ACT_NAME":" 添 加 ","ACT_CODE":"addBatch","ACT_CSS":"add"}];//this._data.BTNS;
	var _btnBar = jQuery("<div></div>").addClass("rhGrid-btnBar");
	//根据只读标识判断是否显示按钮
	if(!_self.isReadOnly){
		jQuery.each(tempData,function(i,n) {
			var temp = jQuery("<a></a>").addClass("rh-icon").addClass("rhGrid-btnBar-a");
			temp.attr("id",_self._getUnId(n.ACT_CODE));
			temp.attr("actcode",n.ACT_CODE);
			_self._act(n.ACT_CODE,temp);
			var labelName = jQuery("<span></span>").addClass("rh-icon-inner").text(n.ACT_NAME);
			temp.append(labelName);
			var icon = jQuery("<span></span>").addClass("rh-icon-img").addClass("btn-" + n.ACT_CSS);
			temp.append(icon);
			_btnBar.append(temp);
		});
	}else{
		//将原来的按钮条替换为间隔条
		_btnBar.removeClass("rhGrid-btnBar").addClass("rhGrid-spacer").appendTo(this.content);
	}
	this._btnBar = _btnBar;
	this._btnBar.appendTo(this.content);
	return this._btnBar;
};
/*
 * 添加新的一行表格，不含数据
 */
rh.vi.listViewBatch.prototype._addNewTr = function() {
	var _self = this;
	var noDataTd = jQuery(this.grid._table).find(".rhGrid-showNO");
	if(noDataTd){
		//移除“无相关记录”行
		noDataTd.parent().remove();
	}
	var newTr = this.grid.addNewTrs();
	//隐藏新增列的删除按钮，保持列表中始终有一空列
	//jQuery(".rhGrid-td-rowBtn[icode='markDelete']",newTr).find(".rhGrid-td-rowBtnObj").hide();
	//重新绑定列表行事件
	this.grid._bindTrEvent();
	//绑定组件事件
	this._bindEvent();
	//重新计算高宽
	this._resetHeiWid();
};
/*
 * 获取列表是否含有显示按钮
 */
rh.vi.listViewBatch.prototype._isHaveShowBtn = function() {
	var _self = this;
	var btns =  this._btnBar.find(".rhGrid-btnBar-a");
	if (btns.length == 0) {
		return false;
	} else {
		return true;
	}
};
/*
 * 隐藏多选框列
 */
rh.vi.listViewBatch.prototype.hideCheckBox = function() {
	var _self = this;
	if (_self.grid) {//非查询选择
		if (this._isHaveShowBtn() === false) {
			this.grid.hideCheckBoxColum();
		}
	}
};

/*
 * 获取组件的值 包括新增的 修改的 删除的，其中，数据是新增还是修改需自行通过主键是否为空进行判断。 
 * 新增的 修改的数据行含有所有字段的信息。
 */
rh.vi.listViewBatch.prototype.getAllData = function(){
	var _self = this;
	var changeData = {};
	//获取默认数据（子单和主单关联的那部分数据，如外键的值）
	var defaultData = {};
	jQuery.each(_self._linkWhereItemArray,function(i,n){
		var value = null;
		if (n.LINK_VALUE_FLAG == 2) {//主单常量值
  		    value = n.ITEM_CODE;
  		}else{
  			value = _self.getMainItemValue(n.ITEM_CODE);
  		}
		defaultData[n.LINK_ITEM_CODE] = value;
	});
	//获取删除数据主键串
	var deletePks = "";
	jQuery.each(_self._deleteDataPks,function(i,n){
		deletePks +=n+",";
	})
	if(deletePks){
		changeData[this._sId+'__DELS'] = deletePks.substring(0, deletePks.lastIndexOf(","));
	}
	//获取新增行及修改行的所有数据
	var datas = _self.grid.getTrDatas() || [];
	//将子单的默认数据填充
	jQuery.each(datas,function(i,n){
		n = jQuery.extend(n,defaultData); 
	});
	//将新增和修改数据放入changeData
	if(datas.length > 0){
		changeData[_self._sId] = datas;
	}
	if(jQuery.isEmptyObject(changeData)){
		//返回""，标识没有数据修改
		return "";
	}else{
		//$.toJSON(changeData)
	    return changeData;
	}
};


/*
 * 获取组件ChangeData
 */
rh.vi.listViewBatch.prototype.getChangeData = function(){
	var _self = this;
	var changeData = {};
	//获取默认数据（子单和主单关联的那部分数据，如外键的值）
	var defaultData = {};
	jQuery.each(_self._linkWhereItemArray,function(i,n){
		var value = null;
		if (n.LINK_VALUE_FLAG == 2) {//主单常量值
  		    value = n.ITEM_CODE;
  		}else{
  			value = _self.getMainItemValue(n.ITEM_CODE);
  		}
		defaultData[n.LINK_ITEM_CODE] = value;
	});
	//获取删除数据主键串
	var deletePks = "";
	jQuery.each(_self._deleteDataPks,function(i,n){
		deletePks +=n+",";
	})
	if(deletePks){
		changeData[this._sId+'__DELS'] = deletePks.substring(0, deletePks.lastIndexOf(","));
	}
	//获取新增数据
	var newData = _self.grid.getNewTrDatas() || [];
	//获取修改数据
	var modifyData = _self.grid.getModifyTrDatas() || [];
	//合并新增和修改数据
	var datas = jQuery.merge(newData,modifyData);
	//将子单的默认数据填充
	jQuery.each(datas,function(i,n){
		n = jQuery.extend(n,defaultData); 
	});
	//将新增和修改数据放入changeData
	if(datas.length > 0){
		changeData[_self._sId] = datas;
	}
	if(jQuery.isEmptyObject(changeData)){
		//返回""，标识没有数据修改
		return "";
	}else{
		//$.toJSON(changeData)
	    return changeData;
	}
};
/*
 * 根据itemCode获取主单数据项的值
 */
rh.vi.listViewBatch.prototype.getMainItemValue = function(itemCode){
	var value = null;
	if(this.cardObj){
		value = this.cardObj.itemValue(itemCode);
	}
	return value;
};
/*
 * 重置当前页面的高度，初始化时、从卡片返回列表时
 */
rh.vi.listViewBatch.prototype._resetHeiWid = function() {
	if(this.cardObj){
		this.cardObj._resetHeiWid();
	}
};
rh.vi.listViewBatch.prototype._afterLoad = function() {
	//绑定事件
	this._bindEvent();
	//组装关联明细定义的过滤关联字段
	this._setLinkWhereItem();
	//没有按钮则自动隐藏多选框
	this.hideCheckBox();
};
/*
 * 组装关联明细定义的过滤关联字段
 */
rh.vi.listViewBatch.prototype._setLinkWhereItem = function() {
	  var _self = this;
	  //关联功能构造
	  var linkItem = this._linkServData.SY_SERV_LINK_ITEM || {};
	  jQuery.each(linkItem, function(i,n) {
	  	if (n.LINK_WHERE_FLAG == 1) {
	  		_self._linkWhereItemArray.push(n);
	  	}
	  });
};
/*
 * 组装where条件
 * @param data form表单数据
 * @return where条件语句
 */
rh.vi.listViewBatch.prototype._assembleWhere = function(data) {
	  //关联功能构造
	  var linkItem = this._linkServData.SY_SERV_LINK_ITEM || {};
	  var linkWhere = [];
	  var links = {};
	  var parVal = {};//关联字段值转换成系统变量,供子调用
	  jQuery.each(linkItem, function(i,n) {//生成子功能过滤条件
	  	if (n.LINK_WHERE_FLAG == 1) {
	  		linkWhere.push(" and ");
	  		linkWhere.push(n.LINK_ITEM_CODE);
	  		linkWhere.push("='");
	  		var value = data[n.ITEM_CODE];
	  		if (n.LINK_VALUE_FLAG == 2) {//主单常量值
	  		    value = n.ITEM_CODE;
	  		}
	  		linkWhere.push(value);
	  		linkWhere.push("' ");
	  	}
	  });
	  //关联服务定义里的过滤条件处理
	  var itemLinkWhere = Tools.itemVarReplace(this._linkServData.LINK_WHERE,data);
	  return linkWhere.join("")+ itemLinkWhere;
};
//绑定事件
rh.vi.listViewBatch.prototype._bindEvent = function(){
	var _self = this;
	//绑定列表行按钮点击事件
	this.grid.getBtn("markDelete").unbind("click",this._markDeleteClickEvent).bind("click", {"view":this},this._markDeleteClickEvent);

};
/*
 * 列表行删除按钮点击方法
 */
rh.vi.listViewBatch.prototype._markDeleteClickEvent = function(event) {
	var _self = event.data.view;
	var pTr = jQuery(this).parent().parent(".tBody-tr");
	var checkstate = jQuery(".rowIndex",pTr).attr("checked");
	if(pTr.hasClass("newTr")){
		pTr.remove();
		//设定行数
		_self.grid.decrementLdataNum();
		//重新计算高宽
		_self._resetHeiWid();
	}else{
		var pk = jQuery(this).attr("rowpk");
		if(pTr.hasClass("markDelete-tr")){
			pTr.removeClass("markDelete-tr");
			pTr.css('background-color','');
			//从删除主键缓存对象中移除
			if(pk){
				delete _self._deleteDataPks[pk];
			}
			//设定行“取消删除”按钮变为“删除”
	    	jQuery(this).find(".rh-icon-inner").text("删除");
	    }
	    else{
	    	pTr.addClass("markDelete-tr");
	    	//DimGray
	    	pTr.css('background-color','red');
	    	//加入到删除主键缓存对象中
	    	if(pk){
	    		_self._deleteDataPks[pk] = pk;
			}
	    	//设定行“删除”按钮变为“取消删除”
			jQuery(this).find(".rh-icon-inner").text("取消");
	    }
	}
	event.stopPropagation();
	return false;
}
//小卡片方式点击返回按钮时刷新列表
rh.vi.listViewBatch.prototype.refreshGrid = function(){
	var _self = this;
	var options = {};
	//设定不分页，取所有记录
	options["_NOPAGE_"] = "true";
	_self.refresh(options);
}
/*
 * 刷新组件
 */
rh.vi.listViewBatch.prototype.refresh = function(options) {
	options = options ? options : {};
    this._refreshGridBody(options);
};
/*
 * 刷新组件内的grid
 */
rh.vi.listViewBatch.prototype._refreshGridBody = function(options) {
	options[UIConst.LINK_WHERE] = this._linkWhere;
	this._listData =  FireFly.getPageData(this._sId,options) || {};	
	this.grid.refresh(this._listData);
	//绑定组件事件
	this._bindEvent();
	//没有按钮则自动隐藏多选框
	this.hideCheckBox();
	//重算高度
	this._resetHeiWid();
};
/*
 * 获取Grid组件
 */
rh.vi.listViewBatch.prototype.getGrid = function(val) {
	return this.grid;
};

/*
 * 获取父句柄
 */
rh.vi.listViewBatch.prototype.getParHandler = function() {
    return this._parHandler;
};

/*
 * 根据code获取列Items
 */
rh.vi.listViewBatch.prototype.getColsItems = function(code) {
	return jQuery("#"+this.id+" .batchModify[icode='"+code+"']");
};
/*
 * 设定组件只读属性
 */
rh.vi.listViewBatch.prototype._setReadOnly = function(val) {
	this.isReadOnly = val;
	//批量编辑标识
	this.batchFlag = val ? false : true;
	//标识是否全部列为修改
	this.allTDModify = val ? false : true;
};
/**
 * 清空
 */
rh.vi.listViewBatch.prototype.clear = function() {
	//此组件的值通过关联服务定义查询出来，不能清除，此处提供一个空实现
};
/**
 * 获取Label
 * @return {} 返回Label对象
 */
rh.vi.listViewBatch.prototype.getLabel = function() {
	var _self = this;
	return _self.obj.parent().parent().find("#" + _self._id + "_label");
};
/**
 * 获取容器
 */
rh.vi.listViewBatch.prototype.getContainer = function() {
	return this.obj.parent().parent();
};
/**
 * 校验是否为空
 */
rh.vi.listViewBatch.prototype.isNull = function() {
	var nullFlag = true;
	//查询数据列
	var dataRows = jQuery(this.grid._table).find(".tBody-tr");
	if(dataRows && dataRows.length > 0){
		nullFlag = false;
	}
	return nullFlag;
};
/**
 * 返回jquery对象的html，便于调试
 */
rh.vi.listViewBatch.prototype.toString = function() {
	return jQuery('<div></div>').append(this.obj).clone().remove().html();
};
/*
 * 填充默认数据
 */
rh.vi.listViewBatch.prototype.fillDefault = function() {
	//Form表单项方法，此处提供一个空实现
};
/*
 * 填充数据
 * @param val  组件值(此组件的数据通过关联服务定义的定义信息查询出来，val暂时无效，此处保留和form其他组件保持一致)
 * @param data form表单数据
 */
rh.vi.listViewBatch.prototype.fillData = function(val,data) {
	var _self = this;
	this._formData = data;
	//组装查询条件
	this._linkWhere = this._assembleWhere(data);
	var options = {};
	options[UIConst.LINK_WHERE] = this._linkWhere;
	//关联服务过滤
	options["_linkServQuery"] = this._linkServQuery || this._linkServData.LINK_SERV_QUERY;
	//设定不分页，取所有记录
	options["_NOPAGE_"] = "true";
	//刷新列表
	this._refreshGridBody(options);
	//判断非只读下绑定行单击事件
	if(!_self.isReadOnly) {
		_self.grid.dblClick(_self._openModify, _self);
	}
};
/**
 * 重新设置数据
 */
rh.vi.listViewBatch.prototype.setValue = function(val) {
	//本组件的数据通过关联服务定义的定义信息查询出来，不能设定值，此处提供一个空实现。
};
/*
 * 获取组件的值
 */
rh.vi.listViewBatch.prototype.getValue = function() {
	return this.getChangeData();
};
/**
 * 使组件无效
 */
rh.vi.listViewBatch.prototype.disabled = function() {
	this._setReadOnly(true);
	//重新渲染组件
	this._reRender();
};
/**
 * 使组件有效
 */
rh.vi.listViewBatch.prototype.enabled = function() {
	this._setReadOnly(false);
	//重新渲染组件
	this._reRender();
};
/**
 * 隐藏该字段
 */
rh.vi.listViewBatch.prototype.hide = function() {
	this.isHidden = true;
	this.obj.parent().parent().hide();
};
/**
 * 显示该字段
 */
rh.vi.listViewBatch.prototype.show = function() {
	this.isHidden = false;
	this.obj.parent().parent().show();
};
/**
 * 设置组件为必须输入项
 */
rh.vi.listViewBatch.prototype.setNotNull = function(bool) {
	this.opts.isNotNull = bool;
};

/**
 * 获取校验对象
 */
rh.vi.listViewBatch.prototype._getValidateObj = function() {
	return this.opts.pCon;
};