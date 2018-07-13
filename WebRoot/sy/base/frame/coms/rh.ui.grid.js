/** 表格grid组件 */
GLOBAL.namespace("rh.ui");
rh.ui.grid = function(options) {
	var defaults = {
		title: null,
		width: 'auto',
		height: 'auto',
		columns: null,
		method: 'post',
		nowrap: true,
		url: null,
		loadMsg: '数据加载中 ...',
		pagination: false,
		rownumbers: false,
		type: UIConst.TYPE_MULTI,
		pkHide:false,
		pageNumber: 1,
		pageSize: 10,
		pageList: [10,20,30,40,50],
		queryParams: {},
		sortOrder: 'asc',
		parHandler:null,
		pCon:null,
		pkConf:"",
		trStyle:"",
		batchFlag:false,
		byIdFlag:false,
		allTDModify:false,
		rowBtns:[],
		cardFlag:false,
		//@author chenwenming  列表是否支持点击标题排序,默认为支持
		sortGridFlag:"true",
		//是否构建分页工具条，默认为构建
		buildPageFlag:"true",
		onLoadSuccess: function(){},
		onLoadError: function(){},
		onClickRow: function(rowIndex, rowData){},
		onDblClickRow: function(rowIndex, rowData){},
		onSortColumn: function(sort, order){},
		onSelect: function(rowIndex, rowData){},
		onUnselect: function(rowIndex, rowData){}
	};	
	this._opts = jQuery.extend(defaults,options);
	this._parHandler = options.parHandler;
	this._pCon = this._opts.pCon;
	this._rowBtns = this._opts.rowBtns || [];//列表行按钮
	this._type = this._opts.type || UIConst.TYPE_MULTI;
	this._data = options.mainData || {};
	this._cols = options.listData._COLS_ || {};
	this.pkConf = this._data.SERV_KEYS || this._opts.pkConf || "";
	this.trStyle = this._data.SERV_LIST_STYLE || "";
	this._allTDModify = this._opts.allTDModify;//标识是否全部列为修改
	this._byIdFlag = this._opts.byIdFlag;//标识是否有双击进入卡片权限
	this._cardFlag = this._opts.cardFlag;//是否以卡片方式显示列表数据
	//@TODO:将数据获取放到view里
	this._lData =  options.listData._DATA_ || {};
	this._lPage = options.listData._PAGE_ || {};
	this._items = this._data.ITEMS || {};
	this._dicts = this._data.DICTS || {};
	//类变量
	this._newTrArray = {};
	this._ldataNum = 0;
	this._clickFeel = "dblclick";
	if (Browser.versions().iPad == true) {
		this._clickFeel = "click";
	}
	// 构建页码所需参数
	this.showPageNum = 5; // 最多显示的页码
	this.startNum = 1; // 中间页码的第一个页码
	this.endNum = this.startNum; // 中间页码的最后一个页码
	//系统变量到临时变量
	this._FITEM_ELEMENT_FILE = UIConst.FITEM_ELEMENT_FILE;  
	this._FITEM_ELEMENT_IMAGE = UIConst.FITEM_ELEMENT_IMAGE;
	//列表的单选、多选
	this._TYPE_SIN = UIConst.TYPE_SINGLE; 	
	this._TYPE_MUL = UIConst.TYPE_MULTI; 	
	this._checkRadio = "checkbox";
	if (this._type == this._TYPE_SIN) {
		this._checkRadio = "radio";
	}
	//@author chenwenming 标识是否显示[展开/折叠]明细列
	this._showDetail = false;
	this._linkServ = this._data.LINKS || {};//关联功能信息
	//[展开/折叠]的关联服务定义
	var _self = this;
	if(!jQuery.isEmptyObject(this._linkServ)){
		jQuery.each(this._linkServ,function(i,n) {
			//判断是否列表动态展开，如果为“是”，则需渲染[展开/折叠]明细列
			if (n.LINK_MAIN_LIST == "1") {
				_self._showDetail = true;
				return;
			}
		});
	}
	//@author chenwenming 
	//判断是否可以点击列标题排序
	this._sortGridFlag = this._opts.sortGridFlag;
	//判断是否构建分页工具条
	this._buildPageFlag = this._opts.buildPageFlag;
	// 校验规则
	// {"ITEM_CODE":{"require":"该项必须输入！","validate":{"regular":"^-?(?:\d+|\d{1,}(?:,\d{1,})+)(?:\.\d+)?$","message":"请输入数字！"}}}
	this._validation = {};
	//需要校验的item数据，{"ITEM_CODE":data}
	this._validateItems = {};
	//必填项item数据，{"ITEM_CODE":data}
	this._requireItems = {};
};
/*
 * 表格渲染方法，入口
 */
rh.ui.grid.prototype.render = function() {
	var _self = this;
	this._bldGrid().appendTo(this._pCon);
	this._bldPage().appendTo(this._pCon);
	this._afterLoad();
};
/*
 * 构建表格，包括标题头和数据表格
 */
rh.ui.grid.prototype._bldGrid = function() {
	this._table = jQuery("<table border=1></table>").addClass("rhGrid");
	this._bldCols().appendTo(this._table);
	this._bldBody().appendTo(this._table);
	if (!jQuery.isEmptyObject(this.sumTr)) {
		if(this._lData.length > 0){
			this._bldFoot().appendTo(this._table);
		}
	}
	return this._table;
};
/*
 * 构建标题
 */
rh.ui.grid.prototype._bldCols = function() {
	var _self = this;
	//@author chenwenming 默认头部除业务字段的列数 ，作为子表使用时，前面只有一个序号列
	this._headerColumnsLength = 0;
	//总列数
	this._colsLength = 0;
	
	var colsStr = [];
	var thead = jQuery("<thead></thead>").addClass("rhGrid-thead");
	this._tHead = thead;
	var tr = jQuery("<tr></tr>");
	//序号
	var xhao = jQuery("<th></th>").addClass("rhGrid-thead-num");
	xhao.appendTo(tr);
	//头部列数+1
	this._headerColumnsLength++;
	//总列数+1
	this._colsLength++;
	
	//复选框
	var thbox = jQuery("<th></th>").addClass("rhGrid-thead-box");
	var box = jQuery("<input type='checkbox'></input>").addClass("rhGrid-thead-checkbox");
	box.click(function(event) {
		if (box.attr("checked")) {
			_self.selectAllRows(); 
		} else {
		    _self.deSelectAllRows();	
		}
	});
	box.appendTo(thbox);
    thbox.appendTo(tr);
    //头部列数+1
	this._headerColumnsLength++;
	//总列数+1
	this._colsLength++;
    
    //@author chenwenming 是否渲染[展开/折叠]明细列
    if(this._showDetail){
    	var expandTh= jQuery("<th></th>").addClass("rhGrid-thead-detail");
        expandTh.appendTo(tr);
        //头部列数+1
    	this._headerColumnsLength++;
    	//总列数+1
    	this._colsLength++;
    }
	
    var cols = [];
	jQuery.each(this._cols,function(i,n) {
		var itemCode = n.ITEM_CODE;	
		//通过item获取cols的详细信息
		var pkHide = _self._opts.pkHide;
		var temp = jQuery("<th icode='"+itemCode+"'></th>").addClass("rhGrid-thead-th");
		temp.append(n.ITEM_NAME);
		if (n.ITEM_LIST_FLAG == UIConst.STR_NO) {
			temp.css("display","none");//addClass("rhGrid-th-hide");
		} else {
			_self._colsLength++;
			//@author chenwenming 作为子表使用时，暂时屏蔽排序
		    if(_self._sortGridFlag == "true"){
				temp.bind("click", function() {
					_self._sortGrid(itemCode,temp);
					parent.window.scrollTo(0,0); //进入卡片，外层页面滚动到顶部
			    });
		    }
		}
		if ((itemCode == _self.pkConf) && (pkHide == true || pkHide == 'true')) {
			temp.css("display","none");//addClass("rhGrid-th-hide");
		}		
		temp.appendTo(tr);
		var tempN = {};
		if (itemCode.indexOf("__NAME") > 0) {
			var code = itemCode.substring(0,itemCode.indexOf("__NAME"));
			tempN = jQuery.extend(tempN,_self._items[code] || {},n);
		} else {
			tempN = jQuery.extend(tempN,_self._items[itemCode] || {},n);	
		}
		cols.push(tempN);
		//add by wangchen-begin
		if (tempN.ITEM_LIST_WIDTH != 0) {
			temp.css("width",tempN.ITEM_LIST_WIDTH + "px");
		}
		//add by wangchen-end
	});

	jQuery.each(this._rowBtns,function(i,n) {//行按钮的列
		var temp = jQuery("<th></th>").attr("icode",n.ACT_CODE).addClass("rhGrid-thead-th");
		temp.append(n.ACT_NAME);
		_self._colsLength++;
		temp.appendTo(tr);	
	});
	this._cols = cols;
	tr.appendTo(thead);
	return thead;	
};
/*
 * 构建数据表格
 */
rh.ui.grid.prototype._bldBody = function() {
	var _self = this;
	var trs = [];
	this.sumTr = {};
	var i = 0;
	if (this._lData == null) {
		Tip.showError("后台错误！",true);
	}
	if (this._lData.length == 0) {
		trs.push("<tr><td colSpan=");
		trs.push(_self._colsLength);
		trs.push(" class='rhGrid-showNO'>无相关记录！</td></tr>");
	} else {
		var preAllNum = parseInt(this._lPage.SHOWNUM)*(parseInt(this._lPage.NOWPAGE)-1) || 0;
        if(this._isTreeColumnExist()){
            for(var i in this._lData){
                trs.push(this._buildTreegridRows(i-0+preAllNum,i,this._lData[i], 0, ''));
            }
        } else if (_self._cardFlag == true) {
        		var i = 0;
        		var len = this._lData.length;
        		_self._tHead.addClass("rhGrid-thead-hiden");
        		for (i;i < len; i++) {
        			var nextPageNum = preAllNum + i;
        			trs.push(_self._bldBodyTrCard(nextPageNum,i,this._lData[i]));
        		}
        } else {
            if (this._opts.batchFlag == true || this._allTDModify == true) {
                var i = 0;
                var len = this._lData.length;
        		for (i;i < len; i++) {
                    var nextPageNum = preAllNum + i;
                    trs.push(_self._bldBodyTrModify(nextPageNum,i,this._lData[i]));
                }
            } else {
            	var i = 0;
            	var len = this._lData.length;
        		for (i;i < len; i++) {
        			var nextPageNum = preAllNum + i;
        			trs.push(_self._bldBodyTr(nextPageNum,i,this._lData[i]));
        		};
            }
        }
	}
	this._tBody = jQuery("<tbody></tbody>").addClass("rhGrid-tbody");
	this._tBody.append(jQuery(trs.join("")));

    //绑定树节点的单击事件
    this._bindTreeNodeClickEventHandler();

	return this._tBody;
};

/**
 *
 * @param {int} num
 * @param {int} index
 * @param {Object} trData 当前行数据
 * @param {boolean} isTreegrid 是否是treegrid，当不是treegrid时，此参数可忽略
 * @param {int} treeNodeDepth 当前行在树中的层级，当isTreeGrid为true时该参数有意义
 * @returns {*}
 * @private
 */
rh.ui.grid.prototype._bldBodyTr = function(num,index,trData, isTreegrid, treeNodeDepth) {
	var _self = this;
	var yes = UIConst.STR_YES;
	var tempPK = "";
	var pks = this.pkConf;
	var trStyle = this.trStyle;
	//@TODO:优化
	var tr = [];
	var trTemp = [];
	trTemp.push("<tr class='tBody-tr' ");
	trTemp.push("id='");
	trTemp.push(trData[pks]);
	trTemp.push("' style='");
	//序号
	tr.push("<td class='indexTD'>");
	tr.push(num+1);
	tr.push("</td>")
	//复选框
	tr.push("<td class='checkTD'>");
	tr.push("<input type='" + _self._checkRadio + "' class='rowIndex' id='href-" + trData[UIConst.PK_KEY] + "' ");
	tr.push("indexL='");
	tr.push(index);
	tr.push("'></input>");
	tr.push("</td>");
	
	//@author chenwenming 是否渲染[展开/折叠]明细列
    if(this._showDetail){
    	//明细展开和折叠列
    	tr.push("<td class='rhGrid-td-detail-center'>");
    	tr.push("<span class='span-detail'></span>");
    	tr.push("</td>");
    }
    var j = 0;
    var len =  this._cols.length;
    for (j; j < len; j++) {
    	var m = this._cols[j];
        var itemCode = m.ITEM_CODE;
        var value = trData[itemCode] || "";
		var style = m.ITEM_LIST_STYLE || "";
		if (itemCode == pks) {
			//主键列
			tempPK = value;
			tr.push("<td class='");
			tr.push(UIConst.PK_KEY);	
			if ((m.ITEM_LIST_FLAG == 2) || (_self._opts.pkHide == true || _self._opts.pkHide == 'true')) {
				tr.push(" rhGrid-td-hide");
			}
			tr.push("' style='");
			if (m.ITEM_LIST_WIDTH > 0) {
				tr.push("width:" + m.ITEM_LIST_WIDTH + "px;");
			}
			tr.push("' icode='");
			tr.push(itemCode);
			tr.push("'");
			tr.push(">");
			tr.push(value);
			tr.push("</td>");
		} else {
			tr.push("<td class='");
			//显示位置
			if (m.ITEM_LIST_FLAG == 2) {
				tr.push("rhGrid-td-hide ");
			}
			if (m.ITEM_LIST_ALIGN == 2) {//居右
				tr.push("rhGrid-td-right ");
			} else if (m.ITEM_LIST_ALIGN == 3) {//居中
				tr.push("rhGrid-td-center ");
			} else {//居左
				tr.push("rhGrid-td-left ");
			}
			tr.push("' icode='");
			tr.push(itemCode);
			tr.push("' style='");
			if (m.ITEM_LIST_WIDTH > 0) {
				tr.push("width:" + m.ITEM_LIST_WIDTH + "px;");
			}
			tr.push(_self._itemStyle(style, value));//字段样式设定
			tr.push("'")
			trTemp.push(_self._lineStyle(trStyle, itemCode, value));//行样式设定
			//@TODO:列表数据格式化处理
			if(value){ // add by wangchen
				var format = m.ITEM_LIST_FORMAT || "";
				// add by wangchen-begin
				var width = m.ITEM_LIST_WIDTH || "0";
				if (width != "0" && format.length == 0) {
					tr.push(" title=\"");
					tr.push(value.replace(/\"/gi, "&quot;"));
					tr.push("\"");
				}
				// add by wangchen-end
				if (format.length > 0) {
					var formatStr = format.substring(0,format.length-1);
					if (formatStr.lastIndexOf("(") != (formatStr.length - 1)) { //不是以(为结尾
						formatStr = formatStr + ",";
					}
					tr.push(" title=\"");
					tr.push(value.replace(/\"/gi, "&quot;"));
					tr.push("\"");
					value = eval(formatStr + "\"" + value.replace(/[\n\r]/gi, "").replace(/\"/gi, "&quot;") + "\")");
				}
			} // add by wangchen
			//列表url处理
			var listLink = m.ITEM_LIST_LINK || "";
			if (listLink.length > 0) {
			    listLink = Tools.itemVarReplace(listLink,trData);
				value = "<a href='#' onclick='" + listLink + "'>" + value + "</a>";
			}	
			//文件链接处理
			var inputType = m.ITEM_INPUT_TYPE || "";
			if (inputType.length > 0 && inputType == _self._FITEM_ELEMENT_FILE) {
				tr.push(" ifile='");
				tr.push(value);
				tr.push("'");
				if(value && value.length > 0 && value.indexOf(",") >= 0) {
					var tempArray = value.split(",");
					var uuid = tempArray[0];
					var titleArray = tempArray[1].split(";");
					var title = titleArray[0];
					value = "<a href='" + FireFly.getContextPath() + "/file/";
			        value += uuid;
				    value += "' title='";
				    value += title;
				    value += "' target='_blank'>";
				    value += title;
				    value += "</a>";				
				}
			}
			if (inputType.length > 0 && inputType == _self._FITEM_ELEMENT_IMAGE) {
				tr.push(" ifile='");
				tr.push(value);
				tr.push("'");
				if(value) {
					var tempArray = value.split(",");
					var uuid = tempArray[0];
					var title = "";
					if (1 < tempArray.length) {
					var titleArray = tempArray[1].split(";");
					title = titleArray[0];
					}
					//var imgVal = FireFly.contextPath + "/file/" + uuid;
					//onmouseover = \"new rh.vi.suspendImg(event, '" + imgVal +"');\"
					value = "<img  class='radius5' src='"+ FireFly.contextPath + "/file/";
				    value += uuid;     
				    value += "' title='";
				    value += title;
				    value += "' width='30px' height='30px'/>";
				}
			}
			if (inputType == UIConst.FITEM_ELEMENT_PSW) {//密码框
				value = "******";
			}
			//”是否用户“字段启用，则有用户信息弹出框显示
			if (m.ITEM_USER_FLAG == yes) { 
				var user_id = itemCode;
				if (trData[itemCode + "__NAME"]) {
				} else {
					if (itemCode.indexOf("__NAME") > 0) {
						user_id = itemCode.substring(0,itemCode.indexOf("__NAME"));
						if (trData[user_id + "__STATUS"] == "1") {
							value = "<div class='rh-user-info-list-online'>&nbsp;</div><span onmouseover = \"new rh.vi.userInfo(event, '" + trData[user_id] + "')\">" + value + "</span>";
						} else if (trData[user_id + "__STATUS"] == "2") {
							value = "<div class='rh-user-info-list-offline'>&nbsp;</div><span onmouseover = \"new rh.vi.userInfo(event, '" + trData[user_id] + "')\">" + value + "</span>";
						}
					}
				}
			}
			tr.push(">");

            //设置tree column列的样式
            if (isTreegrid && m.ITEM_CODE === this._opts.treeColumn) {
                tr.push(this._buildTreeNodeCell(treeNodeDepth, trData._CHILDREN_ && trData._CHILDREN_.length>0, value));
            } else {
			    tr.push(value);
            }

			tr.push("</td>");
			//合计字段的统计
			_self._bldSum(m, value);
		}
	};
	//行按钮支持
	jQuery.each(this._rowBtns,function(i,n) {//行按钮的列
		//对行按钮进行权限判断 没有权限的将按钮进行disable，而不是不显示，这样比较美观
		var hasActFlag = true;
		if (n.ACT_EXPRESSION && n.ACT_EXPRESSION.length > 0){
			hasActFlag = _self._parHandler._excuteActExp(Tools.itemVarReplace(n.ACT_EXPRESSION, trData));
		}
        var btnCode = n.ACT_CODE;
        var btnName = n.ACT_NAME;
		tr.push("<td align=right class='rhGrid-td-rowBtn ");
		tr.push("'");
		tr.push(" icode='");
		tr.push(btnCode);
		tr.push("'");	
		tr.push(">");
		if(hasActFlag){		
			tr.push("<a href='javascript:void(0);' class='rhGrid-td-rowBtnObj rh-icon'");
		}else{
			tr.push("<a title='没有操作权限' href='javascript:void(0);' class='rhGrid-td-rowBtnObj rh-icon-disable'");
		}
		tr.push(" rowpk='");
		tr.push(tempPK);
		tr.push("'");	
		tr.push(">");
		tr.push("<span class='rh-icon-inner'>");
		tr.push(btnName);
		tr.push("</span>");
		tr.push("<span class='rh-icon-img ");
		tr.push("btn-" + n.ACT_CSS);
		tr.push("'>");
		tr.push("</span>");	
		tr.push("</a>");
		tr.push("</td>");		
	});
	trTemp.push("'>");
	tr.push("</tr>");
	var _tBodyTr = trTemp.join("") + tr.join("");
	return _tBodyTr;
};

/**
 * 卡片方式显示列表内容
 * @param {int} num
 * @param {int} index
 * @param {Object} trData 当前行数据
 * @returns {*}
 * @private
 */
rh.ui.grid.prototype._bldBodyTrCard = function(num,index,trData) {
	var _self = this;
	var tempPK = "";
	var pks = this.pkConf;
	var trStyle = this.trStyle;
	//@TODO:优化
	var tr = [];
	var trTemp = [];
	trTemp.push("<tr class='tBody-tr tBody-tr-conCard' ");
	trTemp.push("id='");
	trTemp.push(trData[pks]);
	trTemp.push("' style='");
	//序号
	tr.push("<td class='indexTD'>");
	tr.push(num+1);
	tr.push("</td>");
	tr.push("<td>");
	tr.push("<div>");
	
	var j = 0;
    var len =  this._cols.length;
	for (j; j < len; j++) {
		var m = this._cols[j];
        var itemCode = m.ITEM_CODE;
        var itemName = m.ITEM_NAME;
        var value = trData[itemCode] || "";
		var style = m.ITEM_LIST_STYLE || "";
		if (itemCode == pks) {
			//主键列
			tempPK = value;
			tr.push("<div class='tBody-tr-card ");
			if ((m.ITEM_LIST_FLAG == 2) || (_self._opts.pkHide == true || _self._opts.pkHide == 'true')) {
				tr.push(" rhGrid-td-hide'");
			}
			tr.push(">");
			tr.push("<span ");
			tr.push(" class='");
			tr.push("rhGrid-td-card ");
			tr.push("tBody-label-card ");
			tr.push("' icode='");
			tr.push(itemCode);
			tr.push("'>");
			tr.push(itemName);
			tr.push("</span>");
			tr.push("<span class='");
			tr.push("tBody-span-border ");
			tr.push(UIConst.PK_KEY);	
			if ((m.ITEM_LIST_FLAG == 2) || (_self._opts.pkHide == true || _self._opts.pkHide == 'true')) {
				tr.push(" rhGrid-td-hide");
			}
			tr.push("' style='");
			if (m.ITEM_LIST_WIDTH > 0) {
				tr.push("width:" + m.ITEM_LIST_WIDTH + "px;");
			}
			tr.push("' icode='");
			tr.push(itemCode);
			tr.push("'");
			tr.push(">");
			tr.push(value);
			tr.push("</span>");
			tr.push("</div>");
		} else {
			var inputType = m.ITEM_INPUT_TYPE || "";
			tr.push("<div class='");
			tr.push("tBody-tr-card ");
			tr.push("' style='");
			if (m.ITEM_LIST_FLAG == UIConst.STR_NO) {
				tr.push("display:none;");
			}
			if (inputType == UIConst.FITEM_ELEMENT_TEXTAREA) {
				tr.push("width:100%;clear:both;");
			}
			tr.push("'>");
			tr.push("<span ");
			tr.push("class='");
			tr.push("tBody-label-card ");
			tr.push("rhGrid-td-card ");
			if (inputType == UIConst.FITEM_ELEMENT_TEXTAREA) {
				tr.push("form__left7");
			} else {
				tr.push("form__left15 ");
			}
			tr.push("' icode='");
			tr.push(itemCode);
			tr.push("'>");
			tr.push(itemName);
			tr.push("</span>");
			tr.push("<span class='");
			tr.push("tBody-span-border ");
			if (inputType == UIConst.FITEM_ELEMENT_TEXTAREA) {
				tr.push("form__right85 ");
			} else {
				tr.push("form__right70 ");
			}
			//显示位置
			if (m.ITEM_LIST_FLAG == 2) {
				tr.push("rhGrid-td-hide ");
			}
			if (m.ITEM_LIST_ALIGN == 2) {//居右
				tr.push("rhGrid-td-right ");
			} else if (m.ITEM_LIST_ALIGN == 3) {//居中
				tr.push("rhGrid-td-center ");
			} else {//居左
				tr.push("rhGrid-td-left ");
			}
			tr.push("' icode='");
			tr.push(itemCode);
			tr.push("' style='");
			if (m.ITEM_LIST_WIDTH > 0) {
				tr.push("width:" + m.ITEM_LIST_WIDTH + "px;");
			}
			tr.push(_self._itemStyle(style, value));//字段样式设定
			tr.push("'");
			trTemp.push(_self._lineStyle(trStyle, itemCode, value));//行样式设定
			//@TODO:列表数据格式化处理
			if(value){ // add by wangchen
				var format = m.ITEM_LIST_FORMAT || "";
				// add by wangchen-begin
				var width = m.ITEM_LIST_WIDTH || "0";
				if (width != "0" && format.length == 0) {
					tr.push(" title=\"");
					tr.push(value.replace(/\"/gi, "&quot;"));
					tr.push("\"");
				}
				// add by wangchen-end
				if (format.length > 0) {
					var formatStr = format.substring(0,format.length-1);
					if (formatStr.lastIndexOf("(") != (formatStr.length - 1)) { //不是以(为结尾
						formatStr = formatStr + ",";
					}
					tr.push(" title=\"");
					tr.push(value.replace(/\"/gi, "&quot;"));
					tr.push("\"");
					value = eval(formatStr + "\"" + value.replace(/[\n\r]/gi, "").replace(/\"/gi, "&quot;") + "\")");
				}
			} // add by wangchen
			//列表url处理
			var listLink = m.ITEM_LIST_LINK || "";
			if (listLink.length > 0) {
			    listLink = Tools.itemVarReplace(listLink,trData);
				value = "<a href='#' onclick='" + listLink + "'>" + value + "</a>";
			}	
			//文件链接处理
			if (inputType.length > 0 && inputType == _self._FITEM_ELEMENT_FILE) {
				tr.push(" ifile='");
				tr.push(value);
				tr.push("'");
				if(value && value.length > 0 && value.indexOf(",") >= 0) {
					var tempArray = value.split(",");
					var uuid = tempArray[0];
					var titleArray = tempArray[1].split(";");
					var title = titleArray[0];
					value = "<a href='" + FireFly.getContextPath() + "/file/";
			        value += uuid;
				    value += "' title='";
				    value += title;
				    value += "' target='_blank'>";
				    value += title;
				    value += "</a>";				
				}
			}
			if (inputType.length > 0 && inputType == _self._FITEM_ELEMENT_IMAGE) {
				tr.push(" ifile='");
				tr.push(value);
				tr.push("'");
				if(value) {
					var tempArray = value.split(",");
					var uuid = tempArray[0];
					var title = "";
					if (1 < tempArray.length) {
					var titleArray = tempArray[1].split(";");
					title = titleArray[0];
					}
					value = "<img  class='radius5' src='"+ FireFly.contextPath + "/file/";
				    value += uuid;     
				    value += "' title='";
				    value += title;
				    value += "' width='30px' height='30px'/>";
				}
			}
			if (inputType == UIConst.FITEM_ELEMENT_PSW) {//密码框
				value = "******";
			}
			tr.push(">");

           //设置tree column列的样式
		   tr.push(value);
		   tr.push("</span>");
		   tr.push("</div>");
		   //合计字段的统计
		   _self._bldSum(m, value);
		}
	}
	//行按钮支持 
	jQuery.each(this._rowBtns,function(i,n) {//行按钮的列
		//对行按钮进行权限判断 没有权限的将按钮进行disable，而不是不显示，这样比较美观
		var hasActFlag = true;
		if (n.ACT_EXPRESSION && n.ACT_EXPRESSION.length > 0){
			hasActFlag = _self._parHandler._excuteActExp(Tools.itemVarReplace(n.ACT_EXPRESSION, trData));
		}
        var btnCode = n.ACT_CODE;
        var btnName = n.ACT_NAME;
		tr.push("<td align=right class='rhGrid-td-rowBtn ");
		tr.push("'");
		tr.push(" icode='");
		tr.push(btnCode);
		tr.push("'");	
		tr.push(">");
		if(hasActFlag){		
			tr.push("<a href='javascript:void(0);' class='rhGrid-td-rowBtnObj rh-icon'");
		}else{
			tr.push("<a title='没有操作权限' href='javascript:void(0);' class='rhGrid-td-rowBtnObj rh-icon-disable'");
		}
		tr.push(" rowpk='");
		tr.push(tempPK);
		tr.push("'");	
		tr.push(">");
		tr.push("<span class='rh-icon-inner'>");
		tr.push(btnName);
		tr.push("</span>");
		tr.push("<span class='rh-icon-img ");
		tr.push("btn-" + n.ACT_CSS);
		tr.push("'>");
		tr.push("</span>");	
		tr.push("</a>");
		tr.push("</td>");		
	});
	trTemp.push("'>");
	tr.push("</div>");
	tr.push("</td>");
	tr.push("</tr>");
	var _tBodyTr = trTemp.join("") + tr.join("");
	return _tBodyTr;
};

/*
 * 构建表底
 */
rh.ui.grid.prototype._bldFoot = function() {
	var _self = this;
	var foot = [];
	foot.push("<TFOOT class='rhGrid-tFoot'>");
	foot.push("<tr class='rhGrid-tFoot-tr'>");
	foot.push("<td class='rhGrid-tFoot-td' style='text-align:center;white-space:nowrap' colspan=" + this._headerColumnsLength + ">合计:</td>");
	var cols = this.getBodyTr().first().children();
	jQuery.each(cols, function(i, n) {
		var obj = jQuery(n);
		var itemCode = obj.attr("icode");
		var sumAll = "";
		if (obj.hasClass("indexTD") || obj.hasClass("checkTD") || obj.hasClass("rhGrid-td-detail-center")) {
			return;
		}
		if (_self.sumTr[itemCode] != undefined) {
			sumAll = _self.sumTr[itemCode];
		}
		foot.push("<td class='" + obj.attr("class") + " rhGrid-tFoot-td' style='color:red;'>" + sumAll + "</td>");
	});
	foot.push("</tr></TFOOT>");
	this._foot = jQuery(foot.join(""));
	return this._foot;
};
/*
 * 构建分页条
 */
rh.ui.grid.prototype._bldPage = function() {
	var _self = this;
	this._page = jQuery("<div class='rhGrid-page'></div>");
	//判断是否构建分页
	if(this._buildPageFlag === "false" || this._buildPageFlag === false) {
		this._page.addClass("rhGrid-page-none");
	} else if (this._lPage.PAGES == null) {//没有总条数的情况
		if (this._lPage.NOWPAGE > 1) {//上一页 {"ALLNUM":"1","SHOWNUM":"1000","NOWPAGE":"1","PAGES":"1"}
			this._page.append(jQuery("<a href='javascript:parent.window.scroll(0,0);' class='ui-corner-4'>上一页</a>").click(function(){
				_self.prePage();
			}));
		} else {
			this._page.append("<span class='disabled ui-corner-4'>上一页</span>");
		}
		this._page.append("<span class='current ui-corner-4'>" + this._lPage.NOWPAGE + "</span>");	//当前页
		if (this._lData.length == this._lPage.SHOWNUM) {//下一页
			this._page.append(jQuery("<a href='javascript:parent.window.scroll(0,0);' class='ui-corner-4'>下一页</a>").click(function(){
				_self.nextPage();
			}));
		} else {
			this._page.append("<span class='disabled ui-corner-4'>下一页</span>");
		}
	} else if (!jQuery.isEmptyObject(this._lPage)) {
		// 当前页码
		var currentPageNum = parseInt(this._lPage.NOWPAGE);
		// 总页数
		var sumPage = parseInt(this._lPage.PAGES);
		
		if (this.startNum + this.showPageNum < sumPage) {
			this.endNum = this.startNum + this.showPageNum
		} else {
			this.endNum = sumPage;
		}
		
		// 总条数
		var allNum = parseInt(this._lPage.ALLNUM);
		// 显示上一页
		if(currentPageNum != 1) {
			this._page.append(jQuery("<a href='javascript:parent.window.scroll(0,0);' class='ui-corner-4'>上一页</a>").click(function(){
				_self.prePage();
				
			}));
		} else {
			this._page.append("<span class='disabled ui-corner-4'>上一页</span>");
		}
		// 移动页码
		if(currentPageNum > this.startNum + Math.floor((this.endNum - this.startNum) / 2)) {// 如果点击了后面的页码，则后移
			if(currentPageNum == sumPage) {// 点击了最后一页
				this.endNum = sumPage;
				
				if(this.endNum - this.showPageNum > 0) {
					this.startNum = this.endNum - this.showPageNum;	
				} else {
					this.startNum = 1;
				}
			} else {
				if (currentPageNum > this.showPageNum) {
					this.endNum = currentPageNum + 1;
					this.startNum = currentPageNum - this.showPageNum + 1;
				}
			}
		} else {// 否则前移
			if(currentPageNum == 1) {// 点击了第一页
				this.startNum = 1;
			} else {
				this.startNum = currentPageNum - 1;
			}
			if(this.startNum + this.showPageNum < sumPage) {
				this.endNum = this.startNum + this.showPageNum;
			} else {
				this.endNum = sumPage;
			}
		}
		// 显示首页
		if(this.startNum != 1) {
			this._page.append(jQuery("<a href='javascript:parent.window.scroll(0,0);' class='ui-corner-4'>1</a>").click(function(){
				_self.gotoPage(parseInt(jQuery(this).html()));
			})).append("...");
		}
		// 如果总页数小于本页显示的最大页码
		if(sumPage < this.endNum) {
			this.endNum = sumPage;
		}
		// 显示中间页码
		for(var i = this.startNum; i <= this.endNum; i++) {
			if(i == currentPageNum) {// 构建当前页
				this._page.append("<span class='current ui-corner-4'>" + i + "</span>");	
			} else {
				this._page.append(jQuery("<a href='javascript:parent.window.scroll(0,0);' class='ui-corner-4'>" + i + "</a>").click(function(){
					_self.gotoPage(parseInt(jQuery(this).html()));
				}));
			} 	
		}
		// 显示尾页
		if(sumPage > this.endNum) {
			this._page.append("...").append(jQuery("<a href='javascript:parent.window.scroll(0,0);' class='ui-corner-4'>" + sumPage + "</a>").click(function(){
				_self.lastPage();
			}));
		}
		// 显示下一页
		if(currentPageNum != sumPage) {
			this._page.append(jQuery("<a href='javascript:parent.window.scroll(0,0);' class='ui-corner-4'>下一页</a>").click(function(){
				_self.nextPage();
			}));
		} else {
			this._page.append("<span class='disabled ui-corner-4'>下一页</span>");
		}
		// 显示跳转到指定页码
		if (sumPage > 6) {
			this._page.append("<input class='toPageNum ui-corner-4' type='text' value=''/>").append(jQuery("<input class='toPageBtn' type='button' value='GO' />").click(function(){
				try {
					var val = parseInt(jQuery(this).prev().val());
					if (val >= 1 && val <= sumPage) {
						_self.gotoPage(val);
					}
				} catch (e) {
					// 页码转换异常，忽略
				}
			}));
		}
		//总条数显示
		jQuery("<span class='allNum'></span>").text("共" + allNum + "条").appendTo(this._page);
	}
	return this._page;
};

/*
 * 刷新表格，包括数据body体和分页条
 */
rh.ui.grid.prototype.refresh = function(listData) {  
	this._lData = listData._DATA_;
	this._lPage = listData._PAGE_ || {};
	//body
	this._tBody.remove();
	this._bldBody().appendTo(this._table);
	//footer
	if(this._foot){
		this._foot.remove();
	}
	if (!jQuery.isEmptyObject(this.sumTr)) {
		if(this._lData.length > 0){
			this._bldFoot().appendTo(this._table);
		}
	}
	//page
	this._page.remove();
	this._bldPage().appendTo(this._pCon);
	this._afterLoad();
};

/*
 * 加载表格数据后执行
 */
rh.ui.grid.prototype._afterLoad = function() {
	var _self = this;
	//单选、多选的判断因此box
	if (_self._type == _self._TYPE_SIN) {
		_self.hideCheckBoxColum();
	}
	//行样式修改
	this._tBody.children("tr:odd").addClass("tBody-trOdd");
	//只对可编辑列表进行校验
	if(_self.isEditable()){
		//初始化可编辑列的校验相关信息
		this._initValidation();
		//必填列的TH头增加必填标识
		if(!jQuery.isEmptyObject(this._requireItems)){
			this._markRequireThs();
		}
	}
	//绑定事件
	this._bindEvent();
};
/*
 * 获取行对象集合
 */
rh.ui.grid.prototype.getBodyTr = function() {
	return this._tBody.children(".tBody-tr");
};
/*
 * 初始化可编辑列的校验相关信息
 */
rh.ui.grid.prototype._initValidation = function() {
	var _self = this;
	jQuery.each(_self._cols,function(i,data){
		if ((data.ITEM_LIST_EDIT == 1) || (_self._allTDModify == true)) {
			//不对显示值进行校验
			if (data.ITEM_CODE.indexOf("__NAME") > 0) {
				return;
			}
			//如果列为主键，隐藏了则不需校验
			if((_self.pkConf == data.ITEM_CODE) && 
					(data.ITEM_LIST_FLAG == 2 || _self._opts.pkHide == true || _self._opts.pkHide == 'true')){
				return;
			}
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

			if (isNotNull) {// 必须输入，必须输入项比较简单，所以直接以requrire为key，提示信息为值
				verify["require"] = {
					"message" : "该项必须输入！"
				};
				//加入必填
				_self._requireItems[data.ITEM_CODE]=data;
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
			//根据verify是否为空对象，判断是否需要校验
			if(!jQuery.isEmptyObject(verify)){
				_self._validation[data.ITEM_CODE] = verify;
				_self._validateItems[data.ITEM_CODE] = data;
			}
		}
	});
};
/*
 * 必填列的TH头增加必填标识
 */
rh.ui.grid.prototype._markRequireThs = function() {
	var _self = this;
	jQuery.each(this._requireItems,function(key,data){
		var obj = jQuery("th[icode='"+key+"'],th[icode='"+key+"__NAME"+"']",_self._tHead);
		if(obj.has("span.star").length < 1){
			obj.append(jQuery("<span class='star'>*</span>"));
		}
	});
}
/*
 * 校验列表的编辑列是否合法
 * @param mode 目前支持两种方式校验：
 * 1、selected:校验选中的行（默认）
 * 2、all:校验所有行 
 */
rh.ui.grid.prototype.validate = function(mode) {
	var _self = this;
	// 保存校验是否通过标志
	var pass = true;
	//获取需要校验的行
	var validateRows = [];
	var sels = this.getCheckBox();
	jQuery.each(sels,function(i,n) {
		if(mode && mode=='all'){
			//所有行都校验
			validateRows.push(jQuery(n).parent().parent());
		} else{
			//只校验选中行
			if(jQuery(n).attr("checked")) {
	      		validateRows.push(jQuery(n).parent().parent());
	      	}
		}
    });
	for (var id in this._validation) {// 校验每一个字段
		var itemValidate = this._validation[id];
		for(var i=0;i<validateRows.length;i++){
			var validateInputs = jQuery(".batchModify[icode='"+id+"'],.batchModify[ilink='"+id+"']",jQuery(validateRows[i]));
	    	if (!validateInputs) { //未找到对应列则跳过不校验
				continue;
			}
			var validateObj = null;
			//递归校验可编辑列的每个input域
			jQuery.each(validateInputs,function(i,validateInput){
				validateObj = jQuery(validateInput);
				//隐藏字段不校验
				if (validateObj.parent().hasClass("rhGrid-td-hide")) {
					return;
				}
				if (itemValidate["require"]) {// 必须输入校验
					if (jQuery.trim(_self._getEditorValue(validateObj)).length == 0) {
						validateObj.showError(itemValidate["require"]["message"]);
						pass = false;
						return;
					}
				}
				var val = _self._getEditorValue(validateObj);
				if (val) {
					// 挨个校验，只有前面的所有检验成功了，后面的校验才会执行
					if (itemValidate["num"]) {// 数字校验
						if (!validateObj.validate(itemValidate["num"]["regular"], val,
								itemValidate["num"]["message"])) {
							pass = false;
							return;
						}
					}
					if (itemValidate["txt"]) {// 字符串和大文本
						if (!validateObj.validate(itemValidate["txt"]["regular"], val
										.replace(/[^\x00-\xff]/g, "aa"),
								itemValidate["txt"]["message"])) {
							pass = false;
							return;
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
				}
			});
		}
	}
	return pass;
};
/*
 * 校验列表所有的编辑列是否合法
 */
rh.ui.grid.prototype.validateAll = function() {
	this.validate("all");
}
/* @author chenwenming
 * 绑定事件
 */
rh.ui.grid.prototype._bindEvent = function(){
	//绑定行相关事件
	this._bindTrEvent();
};
/*
 * @author chenwenming
 * 绑定行相关事件
 */
rh.ui.grid.prototype._bindTrEvent = function(){
	var _self = this;
	//绑定行的单击事件
	this.getCheckBox().unbind("click",this._rowIndexClickEvent).bind("click",{"grid":this},this._rowIndexClickEvent);
	//@author chenwenming
	//绑定展开子表按钮的单击事件
	jQuery(".span-detail",this.getBodyTr()).unbind("click",this._renderDetailEvent).bind("click",{"grid":this},this._renderDetailEvent);
    //绑定行双击事件
	if (this._byIdFlag == true) {//默认执行双击事件
		this.getBodyTr().unbind(this._clickFeel,this._bodyTrClickFeelEvent).bind(this._clickFeel,{"grid":this},this._bodyTrClickFeelEvent);
	}
	//TODO:把行点击事件封装成一个方法
	if (this._opts.batchFlag == true) { //批量修改
		jQuery(".batchModify",this.getBodyTr()).unbind("change",this._batchModifyChangeEvent).bind("change",{"grid":this},this._batchModifyChangeEvent);
		jQuery(".bactchDate",this.getBodyTr()).unbind("click",this._bactchDateFocusEvent).bind("click",{"grid":this},this._bactchDateFocusEvent);
		jQuery(".bactchDate",this.getBodyTr()).unbind("focus",this._bactchDateFocusEvent).bind("focus",{"grid":this},this._bactchDateFocusEvent);
		jQuery(".batchDict-select",this.getBodyTr()).unbind("click",this._batchDictSelectClickEvent).bind("click",{"grid":this},this._batchDictSelectClickEvent);	
		jQuery(".batchDict-clear",this.getBodyTr()).unbind("click",this._batchDictClearClickEvent).bind("click",{"grid":this},this._batchDictClearClickEvent);	
		jQuery(".batchQuery-select",this.getBodyTr()).unbind("click").bind("click",{"grid":this},this._batchQuerySelectClickEvent);	
		jQuery(".batchQuery-clear",this.getBodyTr()).unbind("click").bind("click",{"grid":this},this._batchQueryClearClickEvent);	
	}
	//如果存在需校验的编辑Item，则进行事件绑定
	if(!jQuery.isEmptyObject(this._validation)){
		jQuery.each(_self._validateItems,function(i,data){
			if(_self._validation[data.ITEM_CODE]){
				//输入类型
				var inputType = data.ITEM_INPUT_TYPE;
				//输入模式
				var inputMode = data.ITEM_INPUT_MODE;
				//校验的组件
				var validateObjs = jQuery(".batchModify[icode='"+data.ITEM_CODE+"'],.batchModify[ilink='"+data.ITEM_CODE+"']",_self.getBodyTr());
				/*
				 * 以下情况只对必填进行校验
				 * 输入类型为“下拉框”、“单选”、“多选”、“密码框”
				 * 输入模式为“日期选择”，“字典选择”
				 */
				if((inputType == UIConst.FITEM_ELEMENT_SELECT) || (inputType == UIConst.FITEM_ELEMENT_RADIO)
	                || (inputType == UIConst.FITEM_ELEMENT_CHECKBOX) || (inputMode == UIConst.FITEM_INPUT_DATE)
	                || (inputMode == UIConst.FITEM_INPUT_DICT) || (inputType == UIConst.FITEM_ELEMENT_PSW)){
					//如果必填
					if(_self._validation[data.ITEM_CODE]["require"]){
						
						validateObjs.unbind("blur",_self._blankValidateBlurEvent).bind("blur",{"grid":_self},_self._blankValidateBlurEvent);
						//输入模式为“字典选择”时，增加点击输入框弹出字典选择的事件
						if(inputMode == UIConst.FITEM_INPUT_DICT){
							validateObjs.unbind("click",_self._inputDictSelectClickEvent).bind("click",_self._inputDictSelectClickEvent);
						}
					}
				}else{
					//其他输入类型
					validateObjs.unbind("blur",_self._textValidateBlurEvent).bind("blur",{"grid":_self,"itemData":data},_self._textValidateBlurEvent);
				}
			}
		});
	}
}
/*
 * 输入类型为文本框，失去焦点校验方法
 */
rh.ui.grid.prototype._textValidateBlurEvent = function(event) {
	var _self = event.data.grid;
	var data = event.data.itemData;
	// 是否非空，1：是，2：否
	var isNotNull = (data.ITEM_NOTNULL == 1) ? true : false;
	// 正则表达式
	var regular = data.ITEM_VALIDATE;
	// 正则校验失败提示语
	var hint = data.ITEM_VALIDATE_HINT;
	// 系统级校验，一、数字：数字、长度。二、大文本和字符串：长度。
	var fieldType = data.ITEM_FIELD_TYPE;
	var length = data.ITEM_FIELD_LENGTH;
	var validateObj = jQuery(this);
	// 上一个校验成功才做下一个校验
	var pass = true;
	if (isNotNull) {
		if (_self._isEditorNull(validateObj)) {// 非空校验
			pass = false;
			validateObj.showError("该项必须输入！");
		} else {
			validateObj.showOk();
		}
	}
	// 有值才做数字校验、长度校验和正则校验
	if (!_self._isEditorNull(validateObj)) {
		if (fieldType == UIConst.DATA_TYPE_NUM && pass) {// 数字校验
			if (length.indexOf(",") > 0) {// 小数
				var intLength = length.substring(0, length
								.indexOf(","));
				var decLength = length.substring(length
						.indexOf(",")
						+ 1);
				if (!validateObj.validate(
						"^(0|[-+]?[0-9]{1,"
								+ (intLength - parseInt(decLength))
								+ "}([\.][0-9]{0," + decLength
								+ "})?)$",
						_self._getEditorValue(this),
						"请输入整数长度不超过"
								+ (intLength - parseInt(decLength))
								+ "位，小数长度不超过" + decLength + "位的有效数字！")) {
					pass = false
				}
			} else {
				if (!validateObj.validate(
						"^(0|[-+]?[0-9]{0," + length  + "})$", _self._getEditorValue(this),
						"请输入长度不超过" + length + "位有效数字！")) {
					pass = false
				}
			}
		} else if (fieldType == UIConst.DATA_TYPE_STR && pass) {// 长度校验
			var val = _self._getEditorValue(this).replace(/[^\x00-\xff]/g, "aa"); // 把中文替换成两个a
			if (!validateObj.validate(
					"^([\\S\\s]{0," + length + "})$", val,
					"长度不能超过" + length + "位！")) {
				pass = false;
			}
		}
		if (regular && pass) {// 正则校验
			validateObj.validate(regular, _self._getEditorValue(this),hint);
		}
	}
}
/*
 * 失去焦点,非空校验方法
 */
rh.ui.grid.prototype._blankValidateBlurEvent = function(event) {
	var _self = event.data.grid;
	var validateObj = jQuery(this);
	if (_self._isEditorNull(validateObj)) {// 非空校验
		validateObj.showError("该项必须输入！");
	} else {
		validateObj.showOk();;
	}
}
/*
 * “字典”选择输入框单击时，模拟点击选择图标
 */
rh.ui.grid.prototype._inputDictSelectClickEvent = function(event) {
	jQuery(this).parent().find(".batchDict-select").click();//模拟点击选择图标
	return false;
}
/*
 * 获取可编辑列表的实际值
 * 存在ivalue属性，则取ivalue的值，不存在取value值
 */
rh.ui.grid.prototype._getEditorValue = function(editor) {
	var value = jQuery(editor).attr("ivalue");
	if(typeof(value)=="undefined") {
		value = jQuery(editor).val();
	}
	return value;
}
/*
 * 校验可编辑列表的editor是否为空
 */
rh.ui.grid.prototype._isEditorNull = function(editor) {
	return (editor ? (jQuery.trim(jQuery(editor).val()).length == 0) : false);
}
/*
 * 绑定行的单击事件
 */
rh.ui.grid.prototype._rowIndexClickEvent = function(event) {
	var _self = event.data.grid;
	var tar = jQuery(event.target);
	var pTr = tar.parent().parent();
	if (tar.attr("type") == "radio") {//单选特殊处理
		_self.getCheckBox().removeAttr("checked");
	    _self.getBodyTr().filter(".tBody-selectTr").removeClass("tBody-selectTr");
	}
	if (pTr.hasClass("tBody-selectTr")) {
		pTr.removeClass("tBody-selectTr");
		tar.removeAttr("checked");
	} else {
		pTr.addClass("tBody-selectTr");
		tar.attr("checked","true");
	}
	event.stopPropagation();
}
/*
 * 绑定行双击事件
 */
rh.ui.grid.prototype._bodyTrClickFeelEvent = function(event) {
	var _self = event.data.grid;
	clearTimeout(_self._openCardViewTimer);
	//@workgroup 比对class的值防止点击多选框弹开卡片页面
	var node = jQuery(event.target);
	var pTr = jQuery(node).parentsUntil(null,".tBody-tr");
	if (node.hasClass("tBody-tr")) {
		pTr = jQuery(node);
	}
	/*
	 * @author chenwenming
	 * 增加排除展开/折叠按钮的判断(span-detail)
	 */
	if (node.hasClass("batchModify") || node.hasClass("rowIndex") || node.hasClass("span-detail")) {
		event.stopPropagation();
		return false;
	}
	if (_self._parHandler._openCardView) {
		_self._openCardViewTimer = setTimeout(function() {
			_self._parHandler._openCardView(UIConst.ACT_CARD_MODIFY,pTr.attr("id"));  
		},0);  			
	}
	_self.getCheckBox().removeAttr("checked");
	_self.getBodyTr().filter(".tBody-selectTr").removeClass("tBody-selectTr");
	jQuery(".rowIndex",pTr).attr("checked","true");
	pTr.addClass("tBody-selectTr");
	event.stopPropagation();
	return false; 
}
/*
 * 绑定可编辑列的change事件
 */
rh.ui.grid.prototype._batchModifyChangeEvent = function(event) {//输入框事件绑定
	var _self = event.data.grid;
	var node = jQuery(event.target);
	pTr = node.parent().parent();
	pTr.addClass("tBody-selectTr");
	jQuery(".rowIndex",pTr).attr("checked","true");
}
/**
 * 绑定可编辑列日期选择的focus事件
 */
rh.ui.grid.prototype._bactchDateFocusEvent = function(event) {//时间日期事件绑定
	var _self = event.data.grid;
	var node = jQuery(event.target);
	listBatchDate(node.attr("conf"),node);
};
/**
 * 绑定字典选择事件
 */
rh.ui.grid.prototype._batchDictSelectClickEvent = function(event) {//字典选择绑定事件
	var _self = event.data.grid;
	event.stopPropagation();
	var node = jQuery(event.target);
	var input = jQuery(".batchDict",node.parent());
	var itemCode = input.attr("ilink");//CODE字段编号
	input.setValue = function(value) {
		var codeInput = jQuery("input[icode='" + itemCode + "']",input.parent().parent());
		codeInput.val(value);
		input.attr("ivalue",value);
		var pTr = node.parent().parent();
		pTr.addClass("tBody-selectTr");
		jQuery(".rowIndex",pTr).attr("checked","true");
	};
	input.setText = function(text) {
		input.val(text);
	};
	var options = {
		"itemCode" : input.attr("icode"),
		"config" : decodeURI(input.attr("config")),
		"parHandler" : input,
		"afterFunc" : function(id, value){
				if(_self.dictionarySelectCallback && _self.dictionarySelectCallback[itemCode]){
					_self.dictionarySelectCallback[itemCode].call(input, id, value);
				}
			}
		};
	
	var dictView = new rh.vi.rhDictTreeView(options);
	dictView.show(event);
	//选中已选节点
	dictView.tree.selectNodes(input.attr("ivalue").split(","));
	return false;
};
/**
 * 注册树形选择组件的回调事件
 * 
 * @param {String} itemCode		组件对应的字段编码
 * @param {Function} callback	回调方法，选择的id、value为其参数
 */
rh.ui.grid.prototype.registerDictionarySelectCallback = function(itemCode, callback){
	if(!this.dictionarySelectCallback){
		this.dictionarySelectCallback = {};
	}
	
	this.dictionarySelectCallback[itemCode] = callback;
};
/*
 * 绑定字典清除事件
 */
rh.ui.grid.prototype._batchDictClearClickEvent = function(event) {//字典清除绑定事件
	var _self = event.data.grid;
	event.stopPropagation();
	var node = jQuery(event.target);
	var input = jQuery(".batchDict",node.parent());
	//清除name和code内的值
	input.val("");
	input.attr("ivalue","");
	var itemCode = input.attr("ilink");//CODE字段编号
	var codeInput = jQuery("input[icode='" + itemCode + "']",input.parent().parent());
	codeInput.val("");
	//选中行
	var pTr = node.parent().parent();
	pTr.addClass("tBody-selectTr");
	jQuery(".rowIndex",pTr).attr("checked","true");
	return false;
};
/**
 * 绑定查询选择事件 
 */
rh.ui.grid.prototype._batchQuerySelectClickEvent = function(event) {//查询选择绑定事件
	var _self = event.data.grid;
	event.stopPropagation();
	var node = jQuery(event.target);
	var input = jQuery(".batchQuery",node.parent());
	var itemCode = input.attr("icode");//CODE字段编号
	
	var options = {
			"itemCode" : itemCode,
			"config" : decodeURI(input.attr("config")),
			"parHandler" : _self,
			"replaceCallBack" : function(arr,where,sArray) {
				var pTr = node.parent().parent();
				jQuery.each(arr,function(i,n) {
					var tCode = sArray[i];//目标字段
					if (tCode && tCode.length > 0) {
						jQuery(".batchModify[icode='" + tCode + "']",pTr).val(n);
					}
				});
				pTr.addClass("tBody-selectTr");
				jQuery(".rowIndex",pTr).attr("checked","true");
			 }
	};
	var queryView = new rh.vi.rhSelectListView(options);
	queryView.show(event);	
	return false;
};
/*
 * 绑定查询选择事件
 */
rh.ui.grid.prototype._batchQueryClearClickEvent = function(event) {//字典清除绑定事件
	var _self = event.data.grid;
	event.stopPropagation();
	var node = jQuery(event.target);
	var input = jQuery(".batchQuery",node.parent());
	//清除name和code内的值
	input.val("");
	//选中行
	var pTr = node.parent().parent();
	pTr.addClass("tBody-selectTr");
	jQuery(".rowIndex",pTr).attr("checked","true");
	return false;
};
/*
 * @author chenwenming
 * 展开列渲染所有子列表
 */
rh.ui.grid.prototype._renderDetailEvent = function(event){
	var _self = event.data.grid;
	var row = jQuery(this).parent().parent()[0];
	var nextrow = $(row).next("tr.l-grid-detailpanel");
	if (jQuery(this).hasClass("l-open")) {
        nextrow.hide();
        jQuery(this).removeClass("l-open");
    } else {
   	    if (nextrow.length > 0) {
            nextrow.show();
            jQuery(this).addClass("l-open");
        } else {
       	 	 var node = jQuery(event.target);
			 var pTr = node.parent().parent(".tBody-tr");
			 
			 if(pTr && pTr.length > 0) {
			     //行记录的主键值
				 var rowDataId = pTr.attr("id");
				 var detailTr = jQuery("<tr id='"+row.id+"_detail'</tr>").addClass("tBody-tr-detail l-grid-detailpanel");
				 jQuery(row).after(detailTr);
				 
				 //占位TD,占位至数据列
				 var holderTd = jQuery("<td colspan='"+_self._headerColumnsLength+"'></td>").css({"background-color":"#F5FAFD"});
				 detailTr.append(holderTd);
				 var detailTd = jQuery("<td colspan='"+(_self._colsLength-_self._headerColumnsLength)+"'></td>").css({"border":"1px #C5C5C5 solid"});
				 detailTr.append(detailTd);
				 var detailContainer = jQuery("<div></div>").addClass("rhCard-tabs");
				 detailTd.append(detailContainer);
				 jQuery(this).addClass("l-open");
				 
				 var temp = {"sId":_self._parHandler.servId,"parHandler":_self._parHandler,"pCon":detailContainer,
						     "mainData":_self._data};
				 //主键值
				 temp[UIConst.PK_KEY] = rowDataId;
				 var listExpanderView = new rh.vi.listExpanderView(temp);
				 listExpanderView.show();
			 }
        }
    }
	event.stopPropagation();
	//重新计算parhandler[rhlistView]高度
    _self._parHandler._resetHeiWid();
}

rh.ui.grid.prototype.unbindTrClick = function() {
	this.getBodyTr().unbind("click");
};
//TODO增加bind单击事件
rh.ui.grid.prototype.unbindIndexTDClick = function() {
	jQuery(".indexTD",this.getBodyTr()).unbind("click");
};
rh.ui.grid.prototype.unbindTrdblClick = function() {
	var _self = this;
	this.getBodyTr().unbind(_self._clickFeel);
};
/*
 * 行双击事件方法，主要用于外面调用传入点击事件，grid内暂并未使用
 */
rh.ui.grid.prototype.dblClick = function(func,parSelf) {
	var _self = this;
	this.getBodyTr().unbind(_self._clickFeel);
    this.getBodyTr().bind(_self._clickFeel,function(event) {
		var node = jQuery(event.target);
    	if ((node.attr("class") != "rowIndex") && (node.attr("class") != "checkTD")) {
    		var pTr = jQuery(node).parentsUntil(null,".tBody-tr");
    		if (node.hasClass("tBody-tr")) {
    			pTr = jQuery(node);
    		}
    		_self.getBodyTr().removeClass("tBody-selectTr");
    		_self.getCheckBox().removeAttr("checked");
    		jQuery(".rowIndex",pTr).attr("checked","true");
    		pTr.addClass("tBody-selectTr");
			func.call(parSelf,pTr.attr("id"),node);
		    return false; 
    	}
	});
};
/*
 * 行点击事件方法，主要用于外面调用传入点击事件，grid内暂未使用
 */
rh.ui.grid.prototype.trClick = function(func,parSelf) {
	var _self  = this;
    this.getBodyTr().unbind("click").bind("click",function(event) {
		var node = jQuery(event.target);
		var pTr = node.parent();
		_self.getBodyTr().removeClass("tBody-selectTr");
		_self.getCheckBox().removeAttr("checked");
		jQuery(".rowIndex",pTr).attr("checked","true");
		pTr.addClass("tBody-selectTr");
		func.call(parSelf,pTr.attr("id"));
	    return false; 
	});
};
/*
 * 获取选中行的索引值数组集合，如：[22,33,44]
 */
rh.ui.grid.prototype.getSelectRowIndexs = function() {
    var temp = [];
    var sels = this.getCheckBox();
    jQuery.each(sels,function(i,n) {
      	if(jQuery(n).attr("checked")) {
      		temp.push(jQuery(n).attr("indexL"));
      	}
    });
    return temp;
};
/*
 * 获取选中行的主键值数组集合，如：[22,33,44]
 */
rh.ui.grid.prototype.getSelectPKCodes = function() {
    var temp = [];
    var sels = this.getCheckBox();
    jQuery.each(sels,function(i,n) {
    	var chkboxObj = jQuery(n)
      	if(chkboxObj.attr("checked") && chkboxObj.css("display") != "none") {
      		var pk = jQuery(n).parent().parent().attr("id");
      		temp.push(pk);
      	}
    });
    return temp;
};
/*
 * 获取列表所有的主键值集合，如：[22,33,44]
 */
rh.ui.grid.prototype.getPKCodes = function() {
    var temp = [];
    var sels = this.getCheckBox();
    jQuery.each(sels,function(i,n) {
      		var pk = jQuery(n).parent().parent().attr("id");
      		temp.push(pk);
    });
    return temp;
};
/*
 * 获取选中行的某字段数组集合，如：[22,33,44]
 */
rh.ui.grid.prototype.getSelectItemValues = function(itemCode,html) {
    var temp = [];
    var sels = this.getCheckBox();
    jQuery.each(sels,function(i,n) {
      	if(jQuery(n).attr("checked")) {
      		var iText = "";
      		var iObj = jQuery("td[icode='" + itemCode + "']",jQuery(n).parent().parent());
      		if(iObj.attr("ifile")) {
      		  iText = iObj.attr("ifile");
      		} else if(iObj.attr("title")) {//如果服务定义中某字段设置了列表格式参数，则获取构造完的tr标签中的'title'属性值作为未格式化前的原始数据
			  iText = iObj.attr("title");
      		} else {
      		  if (html) {
      			  iText = iObj.html();
      		  } else {
      			  iText = iObj.text();
      		  }
      		}
      		temp.push(iText);
      	}
    });
    return temp;
};

/**
 * 取得选中行对应字段的值，如果选中多行，则只给任意一个数据对应的值。
 */
rh.ui.grid.prototype.getSelectItemVal = function(itemCode,html){
	var values = this.getSelectItemValues(itemCode);
	if(values.length > 0){
		return values[0];
	}
	return undefined;
}

/*
 * 获取某行的某个字段值
 * @param pkCode 记录ID
 * @param itemCode 字段名
 */
rh.ui.grid.prototype.getRowItemValue = function(pkCode,itemCode) {
  	var iText = "";
  	var iObj = this.getRowItem(pkCode,itemCode);
	if(iObj.attr("ifile")) {
	  iText = iObj.attr("ifile");
	} else if (iObj.find(".batchModify").length > 0) {//批量编辑获取batchModify里的值
	  iText = iObj.find(".batchModify").val();
	} else {
	  iText = iObj.text();
	}
    return iText;
};
/*
 * 获取某行的某个字段TD对象
 * @param pkCode 记录ID
 * @param itemCode 字段名
 */
rh.ui.grid.prototype.getRowItem = function(pkCode,itemCode) {
	return this.getBodyTr().filter("tr[id='" + pkCode + "']").find("td[icode='" + itemCode + "']");
};
/*
 * 获取某行的某个字段的编辑框对象,NEW
 * @param pkCode 记录ID
 * @param itemCode 字段名
 */
rh.ui.grid.prototype.getRowItemModify = function(pkCode,itemCode) {
	return this.getBodyTr().filter("tr[id='" + pkCode + "']").find("td[icode='" + itemCode + "']").find(".batchModify");
};
/*
 * 获取某个字段值的TD对象集合
 * @param itemCode 字段名
 */
rh.ui.grid.prototype.getTdItems = function(itemCode) {
	var iObj = jQuery("td[icode='" + itemCode + "']",this.getBodyTr());
    return iObj;
};
/*
 * 获取某个字段值的编辑容器的对象集合,NEW
 * @param itemCode 字段名
 */
rh.ui.grid.prototype.getItemsModify = function(itemCode) {
	var iObj = jQuery("td[icode='" + itemCode + "']",this.getBodyTr()).find(".batchModify");
    return iObj;
};
/**
 *getRowPkByElement 通过行内的任何一个子Element，取得本行的数据ID
 */
rh.ui.grid.prototype.getRowPkByElement = function(rowChildObj) {
	var rowObj = rowChildObj.parentsUntil("tr").parent().attr("id");
    return rowObj;
};

/**
 * 取得指定行的指定字段的Value __NEW__
 * @param rowChildObj 行内的任意子对象（jQuery对象）
 * @param itemCode 字段名
 */
rh.ui.grid.prototype.getRowItemValueByElement = function(rowChildObj,itemCode) {
	var rowObj = rowChildObj.parentsUntil("tr").parent();
	return rowObj.find("[icode=" + itemCode + "]").text();
}

/*
 * 获取行按钮对象 只返回用户具有操作权限的
 */
rh.ui.grid.prototype.getBtn = function(actCode) {
    var rowBtn = jQuery(".rhGrid-td-rowBtn[icode='" + actCode + "']",this.getBodyTr()).find(".rhGrid-td-rowBtnObj.rh-icon");
    return rowBtn;
};
/*
 * 获中所有行
 */
rh.ui.grid.prototype.selectAllRows = function() {
	var sels = this.getCheckBox();
    jQuery.each(sels,function(i,n) {
    	var row = jQuery(n);
      	row.attr("checked","true");
      	row.parent().parent().addClass("tBody-selectTr");
    });
};
rh.ui.grid.prototype.setRowSelect = function(pkCode) {

};
/*
 * 取消页面选中行
 */
rh.ui.grid.prototype.deSelectAllRows = function() {
	var sels = this.getCheckBox();
    jQuery.each(sels,function(i,n) {
    	var row = jQuery(n);
      	row.removeAttr("checked");
      	row.parent().parent().removeClass("tBody-selectTr");
    });
};
/*
 * 上一页
 */
rh.ui.grid.prototype.prePage = function() {
    var prePage = parseInt(this._lPage.NOWPAGE) - 1;
    var nowPage = "" + ((prePage > 0) ? prePage:1);
    this.gotoPage(nowPage);
};
/*
 * 下一页
 */
rh.ui.grid.prototype.nextPage = function() {
    var nextPage = parseInt(this._lPage.NOWPAGE) + 1;
    var pages = parseInt(this._lPage.PAGES);
    var nowPage = "" + ((nextPage > pages) ? pages:nextPage);
    this.gotoPage(nowPage);
};
/*
 * 首页
 */
rh.ui.grid.prototype.firstPage = function() {
    this.gotoPage(1);
};
/*
 * 末页
 */
rh.ui.grid.prototype.lastPage = function() {
    this.gotoPage(this._lPage.PAGES);
};
/**
 * 指定到某一页
 * @param {} num 页码
 */
rh.ui.grid.prototype.gotoPage = function(num) {
	var _loadbar = new rh.ui.loadbar();
	_loadbar.show(true);
	this._lPage.NOWPAGE = num;
	var data = {"_PAGE_":this._lPage};
    if(this._parHandler){
        this._parHandler.refresh(data);
    }else{
        this.refresh(this.getPageData());
    }
	setTimeout(function() {
	    _loadbar.hide();	
    },300);
};


/**
 * 加载某页数据, 分页信息及当前页信息从_lPage中获取。当gird独立使用时，必须重载此方法
 * 返回值：fresh方法需要的参数，包含_COLS_ _DATA_ _PAGE_信息
 * @return {}
 */
rh.ui.grid.prototype.getPageData = function(){
    return {};
};


/*
 * 表格标题排序
 * @param itemId 标题编码
 * @param colObj 列标题的TD对象
 */
rh.ui.grid.prototype._sortGrid = function(itemId,colObj) {
	if (this._items && this._items[itemId] && this._items[itemId].ITEM_TYPE == UIConst.FORM_FIELD_TYPE_SELF) {//自定义字段直接返回
		return true;
	}
	var order = "asc";//desc降序 Asc升序
	//@workgroup 字典字典特殊处理
	if (itemId.indexOf("__NAME") > 0) {
		itemId = itemId.substring(0,itemId.indexOf("__NAME"));
	}
	var insertStr = jQuery("<span class='rhGrid-thead-orderSpan'></span>");
	insertStr.append("&uarr;");
	if (colObj.data("order") && (colObj.data("order") == order)) {
		order = "desc";
		insertStr.empty();
		insertStr.append("&darr;");
	}
	colObj.data("order",order);
	jQuery(".rhGrid-thead-orderSpan", this._tHead).remove();
	colObj.append(insertStr);
	//@TODO 分离封装到引擎中
	var _loadbar = new rh.ui.loadbar();
	_loadbar.show();
	var orderStr = itemId + " " + order;
	
	if (this._items && this._items[itemId] && this._items[itemId].ITEM_ORDER_CODES && (this._items[itemId].ITEM_ORDER_CODES.length > 0)) {//重置排序
		var defineStr = this._items[itemId].ITEM_ORDER_CODES;
		if (order == "desc") {
			defineStr = defineStr.replace(/asc/g,"aaa");
			defineStr = defineStr.replace(/desc/g,"ddd");
			defineStr = defineStr.replace(/aaa/g,"desc");
			defineStr = defineStr.replace(/ddd/g,"asc");
		}
		orderStr = defineStr;
	}
	this._lPage.ORDER = orderStr;
	var data = {"_PAGE_":this._lPage};
	
    this._parHandler.refresh(data);
    setTimeout(function() {
	    _loadbar.hide();	
    },300);
};
/*
 * 隐藏checkbox列
 */
rh.ui.grid.prototype.hideCheckBoxColum = function() {
    jQuery(".checkTD",this.getBodyTr()).css("display","none");
	//checkbox列头在显示状态的话，对列数-1
	if(jQuery(".rhGrid-thead-box",this._tHead).filter(":visible").length > 0){
		jQuery(".rhGrid-thead-box",this._tHead).css("display","none");
	    //列数-1
	    this._colsLength--;
	    this._headerColumnsLength--;
	    //重新构建foot
	    if(this._foot){
			this._foot.remove();
		}
	    if (!jQuery.isEmptyObject(this.sumTr)) {
			if(this._lData.length > 0){
				this._bldFoot().appendTo(this._table);
			}
		}
	}
};
//=============================批量操作列表=======================
/**
 * 构建表格的一行,批量修改行
 *
 * @param {int} num
 * @param {int} index
 * @param {Object} trData 当前行数据
 * @param {boolean} isTreegrid 是否是treegrid，当不是treegrid时，此参数可忽略
 * @param {int} treeNodeDepth 当前行在树中的层级，当isTreeGrid为true时该参数有意义
 * @returns {*}
 * @private
 */
rh.ui.grid.prototype._bldBodyTrModify = function(num,index,trData,isTreegrid,treeNodeDepth) {
	var _self = this;
	var yes = UIConst.STR_YES;
	var tempPK = "";
	//@TODO:优化
	var tr = [];
	var trTemp = [];
	var pks = this.pkConf;
	var trStyle = this.trStyle;
		
	trTemp.push("<tr class='tBody-tr' ");
	trTemp.push("id='");
	trTemp.push(trData[pks]);
	trTemp.push("' style='");
	//序号
	tr.push("<td class='indexTD'>");
	tr.push(num+1);
	tr.push("</td>")
	//复选框
	tr.push("<td class='checkTD'>");
	tr.push("<input type='" + _self._checkRadio + "' class='rowIndex' id='href-" + trData[pks] + "' ");
	tr.push("indexL='");
	tr.push(index);
	tr.push("'></input>");
	tr.push("</td>");
	
	//@author chenwenming 是否渲染[展开/折叠]明细列
    if(this._showDetail){
    	//明细展开和折叠列
    	tr.push("<td class='rhGrid-td-detail-center'>");
    	tr.push("<span class='span-detail'></span>");
    	tr.push("</td>");
    }
    var j = 0;
    var len =  this._cols.length;
    for (j; j < len; j++) {
    	var m = this._cols[j];
        var itemCode = m.ITEM_CODE;
        var value = trData[itemCode] || "";
		//列表样式格式化处理
		var style = m.ITEM_LIST_STYLE || "";

		if (itemCode == pks) {//@TODO:未考虑多主键情况
			//主键列
			tempPK = value;
			tr.push("<td class='");
			tr.push(UIConst.PK_KEY);
			if ((m.ITEM_LIST_FLAG == 2) || (_self._opts.pkHide == true || _self._opts.pkHide == 'true')) {
				tr.push(" rhGrid-td-hide");
			}
			tr.push("'");
			tr.push(" icode='");
			tr.push(itemCode);
			tr.push("'");
			tr.push(">");
			if (m.ITEM_LIST_EDIT != 1 && _self._allTDModify == false) {
				tr.push(value);
			} else {
				tr.push("<input type='text' value=\"");
				tr.push(value);
				tr.push("\" icode='");
				tr.push(itemCode);
				tr.push("' style='");
				if (m.ITEM_LIST_WIDTH > 0) {
					tr.push("width:" + m.ITEM_LIST_WIDTH + "px;word-break:break-all;");
				}
				tr.push("' ");
				tr.push(" pk='");
				tr.push(trData[pks]);
				tr.push("' ");
				tr.push("class='batchModify' style='width:99%'");
				tr.push("/>");	
			}
			tr.push("</td>");	
		} else {
			tr.push("<td class='");
			if (m.ITEM_LIST_FLAG == 2) {
				tr.push("rhGrid-td-hide ");
			}
			if (m.ITEM_LIST_ALIGN == 2) {//居右
				tr.push("rhGrid-td-right ");
			} else if (m.ITEM_LIST_ALIGN == 3) {//居中
				tr.push("rhGrid-td-center ");
			} else {//居左
				tr.push("rhGrid-td-left ");
			}
			tr.push("' icode='");
			tr.push(itemCode);
			tr.push("' style='");
			if (m.ITEM_LIST_WIDTH > 0) {
				tr.push("width:" + m.ITEM_LIST_WIDTH + "px;word-break:break-all;");
			}
			tr.push(_self._itemStyle(style,value));//字段设定
			trTemp.push(_self._lineStyle(trStyle, itemCode, value));//行样式设定
			//是否为只读
			var isReadOnly = (m.ITEM_READONLY == 1) ? true : false;
			if(!isReadOnly && m.ITEM_READONLY_SCRIPT){
				var readOnlyScript = m.ITEM_READONLY_SCRIPT;
				readOnlyScript = Tools.itemVarReplace(readOnlyScript, trData);	//替换字段级变量
				readOnlyScript = Tools.systemVarReplace(readOnlyScript);       	//替换系统变量
				readOnlyScript = readOnlyScript.replace(/undefined/g,'');		//替换undefined
				try{
				    isReadOnly = eval(readOnlyScript);
				}catch(e){}
			}
			if (!isReadOnly && (m.ITEM_LIST_EDIT == 1 || _self._allTDModify == true)) { 
				tr.push("'>"); 
				var inputType = m.ITEM_INPUT_TYPE;
				var inputMode = m.ITEM_INPUT_MODE;
				var notNull = m.ITEM_NOTNULL;//必填
				var index = itemCode.indexOf("__NAME");
				if ((index > 0) && ((inputType == UIConst.FITEM_ELEMENT_SELECT) || (inputType == UIConst.FITEM_ELEMENT_RADIO)
				      || (inputType == UIConst.FITEM_ELEMENT_CHECKBOX))) {//下拉、单选、多选
					var linkCode = itemCode.substring(0,index);
					tr.push(_self._bldSelect(m.DICT_ID,trData[linkCode],trData[pks],linkCode,notNull));
				} else if (inputMode == UIConst.FITEM_INPUT_DATE) {//日期时间
					tr.push("<input type='text' value=\"");
					tr.push(value);
					tr.push("\" icode='");
					tr.push(itemCode);
					tr.push("' ");
					tr.push(" pk='");
					tr.push(trData[pks]);
					tr.push("' ");
					tr.push(" conf='");
					tr.push(m.ITEM_INPUT_CONFIG);
					tr.push("' ");
					tr.push("class='batchModify bactchDate' ");
					tr.push("/>");				    
				} else if ((index > 0) && (inputMode == UIConst.FITEM_INPUT_DICT)) {//字典选择
					var linkCode = itemCode.substring(0,index);
				    tr.push(_self._bldDict(m.DICT_ID,trData[linkCode],value,
				            trData[pks],linkCode,itemCode,m.ITEM_INPUT_CONFIG));                   			    
				} else if (inputMode == UIConst.FITEM_INPUT_QUERY) {//查询选择
					var edit = m.ITEM_INPUT_FLAG;
				    tr.push(_self._bldQuery(value,trData[pks],itemCode,m.ITEM_INPUT_CONFIG,edit));                   			    
				} else {
					var typText = "text";
					if (inputType == UIConst.FITEM_ELEMENT_PSW) {//密码框
						typText = "password";
					}
					tr.push("<input type='");
					tr.push(typText);
					tr.push("' value=\"");
					tr.push(value ? rhHtmlEncode(value) : value);
					tr.push("\" icode='");
					tr.push(itemCode);
					tr.push("' ");
					tr.push(" pk='");
					tr.push(trData[pks]);
					tr.push("' ");
					tr.push("class='batchModify' style='width:99%'");
					tr.push("/>");					
				}
			} else {//非批量编辑字段
				tr.push("'");
				//@TODO:列表数据格式化处理var format = m.ITEM_LIST_FORMAT || "";
				if(value){ // add by wangchen
					var format = m.ITEM_LIST_FORMAT || "";
					// add by wangchen-begin
					var width = m.ITEM_LIST_WIDTH || "0";
					if (width != "0" && format.length == 0) {
						tr.push(" title='");
						tr.push(value);
						tr.push("'");
						value = value.replace(/"/g, "\\\""); //确保下面方法可以顺利执行
					}
					// add by wangchen-end			
					if (format.length > 0) {
						var formatStr = format.substring(0,format.length-1);
						if (formatStr.lastIndexOf("(") != (formatStr.length - 1)) { //不是以(为结尾
							formatStr += ",";
						}
						tr.push(" title='");
						tr.push(value);
						tr.push("'");
						value = value.replace(/"/g, "\\\""); //确保下面方法可以顺利执行
						value = eval(formatStr + "\"" + value.replace(/\n/gi, "").replace(/\"/gi, "") + "\")");
					}
				} // add by wangchen
				//列表url处理
				var listLink = m.ITEM_LIST_LINK || "";
				if (listLink.length > 0) {
				    listLink = Tools.itemVarReplace(listLink,trData);
					value = "<a href='#' onclick='" + listLink + "'>" + value + "</a>";
				}		
				//文件链接处理
				var inputType = m.ITEM_INPUT_TYPE || "";
				if (inputType.length > 0 && inputType == _self._FITEM_ELEMENT_FILE) {
					tr.push(" ifile='");
					tr.push(value);
					tr.push("'");
					if(value) {
						var tempArray = value.split(",");
						var uuid = tempArray[0];
						var titleArray = tempArray[1].split(";");
						var title = titleArray[0];
						value = "<a href='" + FireFly.contextPath + "/file/";
						value += uuid;
						value += "' title='";
						value += title;
						value += "' target='_blank'>";
						value += title;
						value += "</a>";						
					}
				}
				if (inputType == UIConst.FITEM_ELEMENT_PSW) {//密码框
					value = "******";
				}
				//”是否用户“字段启用，则有用户信息弹出框显示
				if (m.ITEM_USER_FLAG == yes) { 
					var user_id = itemCode;
					if (trData[itemCode + "__NAME"]) {
					} else {
						if (itemCode.indexOf("__NAME") > 0) {
							user_id = itemCode.substring(0,itemCode.indexOf("__NAME"));
							if (trData[user_id + "__STATUS"] == "1") {
								value = "<div class='rh-user-info-list-online'>&nbsp;</div><span onmouseover = \"new rh.vi.userInfo(event, '" + trData[user_id] + "')\">" + value + "</span>";
							} else if (trData[user_id + "__STATUS"] == "2") {
								value = "<div class='rh-user-info-list-offline'>&nbsp;</div><span onmouseover = \"new rh.vi.userInfo(event, '" + trData[user_id] + "')\">" + value + "</span>";
							}
						} 
					}
				}
				tr.push(">");

                //设置tree column列的样式
                if (isTreegrid && m.ITEM_CODE === this._opts.treeColumn) {
                    tr.push(this._buildTreeNodeCell(treeNodeDepth, trData._CHILDREN_ && trData._CHILDREN_.length>0, value));
                } else {
				    tr.push(value);
			    }
            }
			tr.push("</td>");
			//合计字段的统计
			_self._bldSum(m, value);
		}
	};
	//行按钮支持 
	jQuery.each(this._rowBtns,function(i,n) {//行按钮的列
		//对行按钮进行权限判断 没有权限的将按钮进行disable，而不是不显示，这样比较美观
		var hasActFlag = true;
		if (n.ACT_EXPRESSION && n.ACT_EXPRESSION.length > 0){
			hasActFlag = _self._parHandler._excuteActExp(Tools.itemVarReplace(n.ACT_EXPRESSION, trData));
		}
        var btnCode = n.ACT_CODE;
        var btnName = n.ACT_NAME;
		tr.push("<td align=right class='rhGrid-td-rowBtn ");
		tr.push("'");
		tr.push(" icode='");
		tr.push(btnCode);
		tr.push("'");	
		tr.push(">");
		if(hasActFlag){		
			tr.push("<a href='javascript:void(0);' class='rhGrid-td-rowBtnObj rh-icon'");
		}else{
			tr.push("<a title='没有操作权限' href='javascript:void(0);' class='rhGrid-td-rowBtnObj rh-icon-disable'");
		}
		tr.push(" rowpk='");
		tr.push(tempPK);
		tr.push("'");	
		tr.push(">");
		tr.push("<span class='rh-icon-inner'>");
		tr.push(btnName);
		tr.push("</span>");
		tr.push("<span class='rh-icon-img ");
		tr.push("btn-" + n.ACT_CSS);
		tr.push("'>");
		tr.push("</span>");	
		tr.push("</a>");
		tr.push("</td>");		
	});
	trTemp.push("'>");
	tr.push("</tr>");
	var _tBodyTr = trTemp.join("") + tr.join("");
	return _tBodyTr;
};


/**
 * 给定字段信息及其值，构建出grid的汇总信息
 * @param item 字段配置信息
 * @param value 字段的值
 */
rh.ui.grid.prototype._bldSum = function(item, value){ 
	if (item.ITEM_SUM_FLAG == UIConst.STR_YES) {
	    //初始化 设初值为0
		var sumItem = this.sumTr[item.ITEM_CODE]; 
		if (!sumItem) {
			this.sumTr[item.ITEM_CODE] = 0;
		}
		//value为空 返回
		if(!value)  return;
	
		//小数位数  默认取字段设置中的值，如果为0的话，取该字段值中小数位最高的位数
		var decimalNum = 0;
		var fieldLength = item.ITEM_FIELD_LENGTH;
		if(fieldLength && fieldLength.indexOf(",") > -1){
			decimalNum = fieldLength.split(",")[1];
		}
		if(decimalNum < 1){
			var sumStr = "" + this.sumTr[item.ITEM_CODE];
			var sumDecimalNum = sumStr.indexOf(".") > -1 ? sumStr.length - sumStr.indexOf(".") - 1 : 0;
			var valueStr = "" + value;
			var valueDecimalNum = valueStr.indexOf(".") > -1 ? valueStr.length - valueStr.indexOf(".") - 1 : 0;
			decimalNum = Math.max(sumDecimalNum, valueDecimalNum);
		}

		if(decimalNum < 1){
			if (sumItem) {
				this.sumTr[item.ITEM_CODE] = parseInt(sumItem) + parseInt(value);
			} else {
				this.sumTr[item.ITEM_CODE] = parseInt(value);
			}
		}else{
			if (sumItem) {
				//value前面的“+”，是因为value是字符串，加“+”后才能正常相加
				this.sumTr[item.ITEM_CODE] = Math.round(( + value + sumItem)*Math.pow(10,decimalNum))/Math.pow(10,decimalNum);
				                           
			} else {
				this.sumTr[item.ITEM_CODE] = Math.round(value*Math.pow(10,decimalNum))/Math.pow(10,decimalNum);
			}
		}
	}
};


/*
 * 根据字典构造一个select
 * @param dicId 字典编号
 * @param selectValue 选中值
 * @param pk 主键值
 * @param itemCode 字段值
 */
rh.ui.grid.prototype._bldSelect = function(dicId, selectValue, pk, itemCode, notNull) {
	var dict = this._dicts[dicId];
	var sel = [];
	sel.push("<select class='batchModify' ");
	sel.push(" icode='");
	sel.push(itemCode);
	sel.push("' pk='");
	sel.push(pk);
	sel.push("'>");
	var opt = [];
	//默认存在一个空option，防止下拉框必填且第一个值被默认，所在行未被选中，没有提交后台的问题
	//if (notNull != UIConst.STR_YES) {//非必填的
		opt.push("<option value=''></option>");
	//}
	jQuery.each(dict, function(i,n) {

		opt.push("<option value='");
		opt.push(n.ID);
		opt.push("'");
		if (n.ID == selectValue) {
			opt.push(" SELECTED ");
		}
		opt.push(">");
		opt.push(n.NAME);
		opt.push("</option>");	
	});
	
	sel.push(opt.join(""));
	sel.push("</select>");
	return sel.join("");
};
/*
 * 根据字典构造一个字典组合
 * @param dicId 字典编号
 * @param selectValue 选中值
 * @param pk 主键值
 * @param itemCode 字段值
 */
rh.ui.grid.prototype._bldDict = function(dicId, code, name, pk, itemCode, itemName, config) {
	var tr = [];
	tr.push("<input type='text' value=\"");
	tr.push(name);
	tr.push("\" ");
	tr.push(" icode='");
	tr.push(itemName);
	tr.push("' ");
	tr.push(" ilink='");
	tr.push(itemCode);
	tr.push("' ");
	tr.push(" config='");
	tr.push(encodeURI(config).replace(/'/g,'%27'));
	tr.push("' ");
	tr.push(" ivalue='");
	tr.push(code);
	tr.push("' ");
	tr.push(" pk='");
	tr.push(pk);
	tr.push("' ");
	tr.push(" dictId='");
	tr.push(dicId);
	tr.push("'");
	tr.push(" readonly='readonly' ");
	tr.push("class='batchModify batchDict' ");
	tr.push("/>");	
	tr.push("<a href='#' class='batchDict-select'>选择</a>");
	tr.push("&nbsp;<a href='#' class='batchDict-clear'>取消</a>");
	return tr.join("");
};
/*
 * 构造一个查询选择
 * @param value 值
 * @param pk 主键值
 * @param itemCode 字段值
 * @param config 配置值
 */
rh.ui.grid.prototype._bldQuery = function(value, pk, itemCode, config, editFlag) {
	var tr = [];
	tr.push("<input type='text' value=\"");
	tr.push(value);
	tr.push("\" ");
	tr.push(" icode='");
	tr.push(itemCode);
	tr.push("' ");
	tr.push(" config='");
	tr.push(encodeURI(config).replace(/'/g,'%27'));
	tr.push("' ");
	tr.push(" pk='");
	tr.push(pk);
	tr.push("' ");
	if (editFlag && (editFlag == UIConst.STR_YES)) {
	} else {
		tr.push(" readonly='readonly' ");
	}
	tr.push("class='batchModify batchQuery' ");
	tr.push("/>");	
	tr.push("<a href='#' class='batchQuery-select'>选择</a>");
	tr.push("&nbsp;<a href='#' class='batchQuery-clear'>取消</a>");
	return tr.join("");
};
/*
 * 增加新行
 */
rh.ui.grid.prototype.addNewTrs = function() {
	var _self = this;
	if (this._ldataNum == 0) {
		this._ldataNum = this._lData.length;
		this._lastIndex = this._lData.length;
	}
    this._allTDModify = true;
    var tr = this._bldBodyTrModify(this._lastIndex, this._lastIndex,{});
    var trObj = jQuery(tr).addClass("newTr");
    this._tBody.append(trObj);
    this._ldataNum++;
    this._lastIndex++;
    return trObj;
};
/*
 * 外层调用减少行数量
 */
rh.ui.grid.prototype.decrementLdataNum = function() {
	this._ldataNum--;
    this._lastIndex--;
};
/*
 * 获取新增数据
 */
rh.ui.grid.prototype.getNewTrDatas = function() {
	var _self = this;
	var datas = [];
	//判断多选框选中的
	var indexs = this.getSelectRowIndexs();
	if (indexs.length == 0) {
		return null;
	}
    jQuery.each(indexs, function(i,n) {
    	var tr = jQuery("input[indexL='" + n + "']",_self.getBodyTr()).parent().parent();
    	if (tr.hasClass("newTr")) {
			var inputs = jQuery(".batchModify",tr);
	    	datas.push(_self._getNewDataBase(inputs));
    	}
    });
    return datas;
};
/*
 * 获取新增数据,包括批量新增和批量修改的数据
 */
rh.ui.grid.prototype.getModifyTrDatas = function() {
	var _self = this;
	var datas = [];
	//判断多选框选中的
	var indexs = this.getSelectRowIndexs();
	if (indexs.length == 0) {
		return null;
	}
    jQuery.each(indexs, function(i,n) {
    	var tr = jQuery("input[indexL='" + n + "']",_self.getBodyTr()).parent().parent();
    	if (!tr.hasClass("newTr")) {
			var inputs = jQuery(".batchModify",tr);
	    	datas.push(_self._getNewDataBase(inputs));
    	}
    });
    //@TODO:多条保存，如果有一条没有修改数据，则提示没有修改数据
    return datas;
};
/*
 * 获取表格中的所有行的所有列的数据  不区分是新增的还是修改的，已标记为删除的数据不返回。
 * 有单选/复选框时，只返回选中行的数据 ；否则，返回所有行的数据
 */
rh.ui.grid.prototype.getTrDatas = function() {
	var _self = this;
	var datas = [];
	//选中所有行
	_self.selectAllRows();
	//判断多选框选中的
	var indexs = this.getSelectRowIndexs();
	if (indexs.length == 0) {
		return null;
	}
    jQuery.each(indexs, function(i,n) {
    	var tr = jQuery("input[indexL='" + n + "']",_self.getBodyTr()).parent().parent();
    	if(tr.hasClass("markDelete-tr")) return;
    	var rowData = {};
    	var tds = jQuery("td:not(.rhGrid-td-rowBtn)[icode]",tr);
    	jQuery.each(tds, function(tdIndex, td) {
    		var tdObj = jQuery(td);
    		var value = "";
    		if(tdObj.attr("ifile")) {
    			value = tdObj.attr("ifile");
    	    } else if (tdObj.find(".batchModify").length > 0) {//批量编辑获取batchModify里的值
    	    	value = tdObj.find(".batchModify").val();
    	    } else {
    	    	value = tdObj.text();
    	    }
    		//主键列
    		if(tdObj.hasClass(UIConst.PK_KEY)){
    			rowData[UIConst.PK_KEY] = value;
    		}
    		rowData[tdObj.attr("icode")] = value;
    	});
    	datas.push(rowData);
    });
    return datas;
};

/*
 * 获取data的基础方法
 */
rh.ui.grid.prototype._getNewDataBase = function(objs) {
	var data = {};
	var pk_key = UIConst.PK_KEY;
	jQuery.each(objs, function(j,m) {
		if (jQuery(m).parent().hasClass("rhGrid-td-hide")) {//隐藏字段过滤掉
			return;
		}
		var id = jQuery(m).attr("icode");
		var pk = jQuery(m).attr("pk");
        if (pk && (pk.length > 0)) {
        	data[pk_key] = pk;
        }
		if (jQuery(m).hasClass("batchDict")) {//字典类型的
		    var ilink = jQuery(m).attr("ilink");
    		data[ilink] = jQuery(m).attr("ivalue");    			
		} else {
    		data[id] = jQuery(m).attr("value");
		}
	});
	return data;
};
/*
 * 删除一行
 */
rh.ui.grid.prototype.deleteTr = function() {

};
/*
 * 字段样式设定
 */
rh.ui.grid.prototype._itemStyle = function(style,value) {
	//列表样式格式化处理
	var array = [];
	if (style.length > 0) {//字段设定
		var style = StrToJson(style);
		jQuery.each(style,function(i, n) {
			var replaceValue = Tools.systemVarReplace(i);
			if (replaceValue.indexOf("!") == -1) { //正常匹配
				replaceValue = "," + replaceValue + ",";
				if (replaceValue.indexOf("," + value + ",") > -1) {
					array.push(n);
				}
			} else if (replaceValue.indexOf("!") == 0) { //非匹配的情况
				var noValue = "!" + value;
				if (noValue != replaceValue) {
					array.push(n);
				}
			}
		});
	} 
	return array.join("");
};
/*
 * 行样式设定
 */
rh.ui.grid.prototype._lineStyle = function(trStyle,itemCode,value) {
	var array = [];
	if (trStyle.length > 0) {//行设定
		var trStyleObj = StrToJson(trStyle);
		jQuery.each(trStyleObj,function(i, n) {
			if (i == itemCode) {
				jQuery.each(n,function(j,m) {
					var replaceValue = Tools.systemVarReplace(j);
					replaceValue = "," + replaceValue + ",";
					if (replaceValue.indexOf("," + value + ",") > -1) {
						array.push(m);
					}
				});
			}
		});
	}
    return array.join("");
};
/*
 * 获取头部的复选框按钮
 */
rh.ui.grid.prototype.getHeadCheckBox= function() {
	return jQuery(".rhGrid-thead-checkbox", this._tHead);
};
/*
 * 获取checkbox复选框对象
 */
rh.ui.grid.prototype.getCheckBox= function() {
	return jQuery(".rowIndex",this.getBodyTr());
};
/*
 * 根据主键获取checkbox对象
 */
rh.ui.grid.prototype.getCheckBoxItem= function(pkCode) {
	return jQuery("#href-" + pkCode,this.getBodyTr());
};
/*
 * 获取表格
 */
rh.ui.grid.prototype.getTable = function() {
	return this._table;
};

/**
 * 获取指定Element所在的行（TR）
 */
rh.ui.grid.prototype.getRowByElement = function(element){
	var pTr = jQuery(element).parentsUntil(null,".tBody-tr");
	return pTr;
}
/*
 * 判断列表是否可编辑
 */
rh.ui.grid.prototype.isEditable = function() {
	return (this._allTDModify == true || this._opts.batchFlag == true)
}
/*
 * 判断列表是否需要校验
 */
rh.ui.grid.prototype.needValidate = function() {
	return !jQuery.isEmptyObject(this._validation);
}

/**
 * @param itemCode 字段名称
 * @returns 取得指定字段(列)定义
 */
rh.ui.grid.prototype.getColumnDef = function(itemCode) {
	var result = undefined;
	var grid = this;
	jQuery.each(grid._cols,function(i,n) {
		if(this.ITEM_CODE == itemCode){
			result = this;
			return false;
		}
	});
	
	return result;
};
/**
 * @param title 行提示信息
 */
rh.ui.grid.prototype.setTrTitle = function(title) {
	this.getBodyTr().attr("title",title);
};
/**
 * @param title 行提示信息
 */
rh.ui.grid.prototype.setCheckTDTitle = function(title) {
	jQuery(".checkTD",this.getBodyTr()).attr("title",title);
};


/**
 * tree column是否存在
 *
 * @retrns {boolean}
 * @private
 */
rh.ui.grid.prototype._isTreeColumnExist = function () {
    if (this.isTreeColumnExist === undefined) {
        this.isTreeColumnExist = false;
        if (this._opts.treeColumn) {
            for (var column in this._cols) {
                if (this._cols[column].ITEM_CODE === this._opts.treeColumn) {
                    this.isTreeColumnExist = true;
                    break;
                }
            }
        }
    }

    return this.isTreeColumnExist;
};

/**
 * 注册树节点的单击事件，在树节点收缩、展开时调用
 *
 * @param {function} handler 方法参数为(e, grid),handler的this指向当前行
 */
rh.ui.grid.prototype.registerTreeNodeClickEventHandler = function(handler){
    if(this._treeNodeClickEventHandlers){
        this._treeNodeClickEventHandlers.push(handler);
    }else{
        this._treeNodeClickEventHandlers = [handler];
    }
};

/**
 * 取消注册树节点的单击事件
 *
 * @param {function} handler
 */
rh.ui.grid.prototype.unregisterTreeNodeClickEventHandler = function(handler){
    if(this._treeNodeClickEventHandlers){
        for(var i=0; i<this._treeNodeClickEventHandlers.length; i++){
            if(this._treeNodeClickEventHandlers[i] == handler){
                this._treeNodeClickEventHandlers.splice(i, 1);
                i--;
            }
        }
    }
};

/**
 * 绑定树节点的单击事件
 *
 * @private
 */
rh.ui.grid.prototype._bindTreeNodeClickEventHandler = function(){
    var me = this;
    this._tBody.find('td > div.treegrid-node-el').each(function () {
        $(this).unbind('click').bind('click',function(e){
            me._treegridNonLeafNodeClick.call($(this), e, me);
        });
    });
};

/**
 * treegrid树上的节点点击时激发的事件
 *
 * @param {event} e
 * @private
 */
rh.ui.grid.prototype._treegridNonLeafNodeClick = function (e, context) {
    var et = e.target || e.srcElement;
    var me = $(this);
    if (et.tagName == "IMG") {
        //切换图标
        (function(icon, node){
            if (icon.hasClass('treegrid-elbow-minus')) {
                node.removeClass('treegrid-node-expanded');
                node.addClass('treegrid-node-collapsed');

                icon.removeClass('treegrid-elbow-minus');
                icon.addClass('treegrid-elbow-plus');
                icon.attr('src', FireFly.getContextPath() + '/sy/theme/default/images/treegrid/elbow-plus-nl.gif');
            } else if (icon.hasClass('treegrid-elbow-plus')) {
                node.removeClass('treegrid-node-collapsed');
                node.addClass('treegrid-node-expanded');

                icon.removeClass('treegrid-elbow-plus');
                icon.addClass('treegrid-elbow-minus');
                icon.attr('src', FireFly.getContextPath() + '/sy/theme/default/images/treegrid/elbow-minus-nl.gif');
            }
        })($(et), me);


        //收缩或展开树
        var row = $(this).parentsUntil('tr').parent();
        (function(row){
            //收缩树
            var collapse = function(){
                var me = $(this);
                me.nextAll("tr[parent='" + me.attr('rowId') + "']").each(function(i, subRow){
                    subRow = $(subRow);
                    subRow.hide();
                    collapse.call(subRow);
                });
            };

            //展开树
            var expand = function(){
                var me = $(this);
                me.nextAll("tr[parent='" + me.attr('rowId') + "']").each(function(i, subRow){
                    subRow = $(subRow);
                    subRow.show();
                    if(subRow.attr('state') === 'EXPANDED'){
                        expand.call(subRow);
                    }
                });
            };

            if(row.attr('state') == 'COLLAPSED'){
                row.attr('state', 'EXPANDED');
                expand.call(row);
            }else{
                row.attr('state', 'COLLAPSED');
                collapse.call(row);
            }
        })(row);

        //激发绑定的其他单击处理器
        if(context._treeNodeClickEventHandlers){
            for(var i in context._treeNodeClickEventHandlers){
                context._treeNodeClickEventHandlers[i].call(row, e, context);
            }
        }
    }
};

/**
 * 构建树节点所在单元格html
 *
 * @param {int} depth 当前树节点的深度
 * @param {boolean} hasChildren 当前节点是否拥有子节点
 * @param {string} value 当前单元格的值
 * @returns {string} 单元格html
 * @private
 */
rh.ui.grid.prototype._buildTreeNodeCell = function(depth, hasChildren, value){
    var builder = "<div title='" + value + "'";
    if (hasChildren) {
        builder += " class='treegrid-node-el treegrid-node-expanded'";
    } else {
        builder += " class='treegrid-node-el treegrid-node-leaf'";
    }
    builder += ">";
    builder += "<span>";
    if (depth >= 1) {
        builder += "<img class='treegrid-icon' src= '" + FireFly.getContextPath() + "/sy/theme/default/images/treegrid/s.gif'/>";
        for (var i = 1; i < depth; i++) {
            builder += "<img class='treegrid-elbow-line' src='" + FireFly.getContextPath() + "/sy/theme/default/images/treegrid/s.gif'/>";
        }
        if(!hasChildren){
            builder += "<img class='treegrid-elbow-line' src='" + FireFly.getContextPath() + "/sy/theme/default/images/treegrid/s.gif'/>";
        }
    }
    builder += "</span>";

    if (hasChildren) {
        builder += "<img class='treegrid-elbow-minus' src='" + FireFly.getContextPath() + "/sy/theme/default/images/treegrid/elbow-minus-nl.gif'/>";
    }
    builder +=
        "<img class='treegrid-node-icon' src='" + FireFly.getContextPath() + "/sy/theme/default/images/treegrid/s.gif'/>" +
            "<a><span>" + value + "</span></a>";

    return builder;
};

/**
 * 插入行，如果给定的插入行(parentId)不存在，则在表格最后作为一棵新树插入
 *
 * @param {string} parentId 进行插入的行的id，插入的数据作为此行的子数据
 * @param {Array} data 插入的数据
 */
rh.ui.grid.prototype.insertTreegridRows = function(parentId, data){
    //find the position to insert
	var parent = this.getBodyTr().filter('tr[rowId="' + parentId +'"]');
    if(parent.length === 0){
        parent = this.getBodyTr().filter('tr[rowId]').last();
        parentId = '';
    }

    //build the html of new rows, then insert
    var html = '';
    var parentNum = parent.find('td.indexTD').text()- 0;
    var parentIndex = parent.find('input.rowIndex').attr('indexl') - 0;
    var parentDepth = parent.attr('depth')-0;
    var me = this;
    $.each(data, function(i, v){
        html += me._buildTreegridRows(parentNum + i, parentIndex + i, v, parentId == '' ? 0 : parentDepth + 1, parentId);
    });
    parent.after(html);
    this._bindTreeNodeClickEventHandler();

    //update num、index of rows
    (function(rows){
        var firstRow = rows.first();
        var firstRowNum = firstRow.find('td.indexTD').text() - 0;
        var firstRowIndex = firstRow.find('input.rowIndex').attr('indexl') - 0;
        for(var i=rows.length-1; i>=0; i--){
            var row = $(rows[i]);
            var rowNum = row.find('td.indexTD').text() - 0;
            if((rowNum - firstRowNum + 1) < i){
                row.find('td.indexTD').text(firstRowNum + i);
                row.find('input.rowIndex').attr('indexl', firstRowIndex + i);
            }else{
                break;
            }
        }
    })(me.getBodyTr().filter('tr[rowId]'));
};


/**
 * 构建tree grid行html
 *
 * @param {int} num 当前data的num
 * @param {int} index 当前data的index
 * @param {Object} data 数据
 * @param {int} depth 当前数据在整棵树中的深度
 * @param {string} parentId 当前数据的父节点id，如果没有父节点则为空字符串
 * @returns {string}
 * @private
 */
rh.ui.grid.prototype._buildTreegridRows = function(num, index, data, depth, parentId){
    var builder = "";
    var builderFunction = this._bldBodyTr;
    if(this.isEditable()){
        builderFunction = this._bldBodyTrModify;
    }

    var html = builderFunction.call(this,num, index, data, true, depth);
    html = html.substr(0, 3) +
        ' rowId="' + data._PK_ + '"' +
        ' parent="' + parentId + '"' +
        ' state="EXPANDED" ' +
        ' depth="' + depth + '"' +
        html.substring(4);
    builder += html;

    if(data._CHILDREN_ && data._CHILDREN_.length > 0){
        for (var i = 0; i < data._CHILDREN_.length; i++) {
            builder = builder + this._buildTreegridRows(num + 1 + i, index + 1 + i, data._CHILDREN_[i], depth + 1, data._PK_);
        }
    }

    return builder;
};