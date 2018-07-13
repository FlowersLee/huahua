/**
 * 报表服务视图组件
 */
GLOBAL.namespace("rh.vi");

rh.vi.reportView = function(report) {
	var defaults = {
        'report' : {},
        //报表展示高度
        'REPORT_DISPLAY_HEIGHT' : 500,
        'FORM_ITEM_WIDTH' : '200',
        //默认列数
        'DEFAULT_COLUMN_WIDTH' : 3
    };
	defaults.report = $.extend(defaults.report, report);
    this.options = defaults;
    
    //报表参数定义
    this.options.FORM_ITEMS = FireFly.doAct('SY_PLUG_REPORT_ITEM', 'finds', 
        {'SERV_ID' : this.options.report.REPORT_CODE}, false)._DATA_;
    
    //报表展示iframe对象
    this.options.REPORT_DISPLAY_IFRAME = null;
    //提交用的表单对象
    this.options.SUBMIT_FORM = null;
    
    //所有的表单item对象,key为code值，value为对象
    this.options.ITEMS = {};
};

/**
 * 显示
 */
rh.vi.reportView.prototype.show = function() {
	$('body').append(this._buildCard());
    
    this._loadJsExtention();
    //加载渲染后处理
    this._afterLoad();
};

/**
 * 构建卡片
 */
rh.vi.reportView.prototype._buildCard = function() {
	this.cardContainer = this._buildCardContainer();
	return this.cardContainer;
};

/**
 * 构建卡片容器
 */
rh.vi.reportView.prototype._buildCardContainer = function() {
	return $('<div></div>')
			.addClass('ui-dialog ui-widget ui-widget-content ui-corner-all ui-draggable rh-ui-dialog bodyBack bodyBack-white')
			.css({
						'display' : 'block',
						'z-index' : '1001',
						'outline' : '0px none',
						'bottom' : '0px',
						'width' : '98.1%',
						'top' : '0px',
						'left' : '0px'
					})
			.append(
                $('<div></div>')
					.attr('id', this.options.report.REPORT_CODE + '-winDialog')
					.addClass('cardDialog rh-bottom-right-radius ui-dialog-content ui-widget-content')
					.css({
								'overflow' : 'hidden',
								'display' : 'block',
								'width' : 'auto',
								'min-height' : '0px',
                                'height' : '100%'
							})
					.append(
                        $('<div></div>')
					       .attr('id', this.options.report.REPORT_CODE + '-winTabs')
					       .addClass('rhCard-tabs ui-tabs ui-widget ui-widget-content')
                           .css('height', '100%')
					       .append(this._buildHead())
					       .append(
                                $('<div></div>')
							         .attr('id', this.options.report.REPORT_CODE + '-mainTab')
							         .addClass('ui-tabs-panel ui-widget-content')
                                     .css({'height':'100%', 'overflow':'auto'})
							         .append($('<div></div>').addClass('rhCard-headMsg'))
							         .append(this._buildForm())
                                     .append(this._buildReportArea())
                           )
                    )
                    .append(this._buildSubmitForm())
            );
};

/**
 * 创建头部
 */
rh.vi.reportView.prototype._buildHead = function() {
	var title = $("<li></li>").addClass("rhCard-titleLi")
	            .append($("<a></a>")
	            	 .attr("id", "rhCard-title")
	            	 .addClass("rhCard-title")
	            	 .text(this.options.report.REPORT_NAME));
	            
	return $("<ul></ul>")
			.addClass("tabUL tabUL-top ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header")
			.append(title)
            .append(this._buildBackButton());
};

/**
 * 构建“返回按钮”
 */
rh.vi.reportView.prototype._buildBackButton = function(){
    var me = this;
    return $('<li></li>')
                .addClass('rhCard-backLi')
                .append(
                    $('<a>&nbsp;</a>')
                        .addClass('rhCard-refresh')
                        .attr('id', 'rhCard-back')
                        .text('返回')
                        .bind('click', function(){
                            me.close();
                        })
                );
};

/**
 * 构建按钮条
 */
rh.vi.reportView.prototype._buildButtonBar = function(parent) {
    var buttonWidth = '100%';
    var buttonBar = $('<div></div>').addClass('inner')
        .css({'width':buttonWidth})
        .append(
            $('<div style="margin:0 auto;text-align:center"></div>').append(this._buildButton())
        );
        
	return buttonBar;
};

/**
 * 根据按钮定义构建按钮条中的按钮
 * 
 * @param {} config
 */
rh.vi.reportView.prototype._buildButton = function(config) {
    var me = this;
    return jQuery("<input type='button' id='advSearch-btn-reportView' value='开始查询'/>").addClass("rh-advSearch-btn")
                 .bind('click', function(e){
                           me._loadReport();
                        });
};

/**
 * 打开报表
 */
rh.vi.reportView.prototype._loadReport = function(){
    //打开蒙板
    if(this.options.report.OPEN_TYPE != '3'){
         this._mask();
    }
    //根据报表类型(润乾报表、帆软报表、图表、XDOC等)拼装需要的参数格式
    var paramData = this._assembleParamsByReportType();
    //提交表单
    var form = this.options.SUBMIT_FORM;
    //移除所有输入元素
    $("input",form).remove();
    $.each(paramData, function(key, value){
        form.append('<input type="hidden" name="' + key + '" value="' + value + '"/>');
    });
    form.submit();
    
    //取消蒙板
    var iframe = this.options.REPORT_DISPLAY_IFRAME[0];
    var me = this;
    if(iframe.attachEvent){
        iframe.attachEvent('onload', function(){
            me._unmask();
        });
    }else{
        iframe.onload = function(){
            me._unmask();
        };
    }
};
/**
 * 根据报表类型(润乾报表、帆软报表、图表、XDOC等)拼装需要的参数格式
 * @return {Object}
 */
rh.vi.reportView.prototype._assembleParamsByReportType = function(){
	var _self = this;
	//组装查询参数
	_self.advSearch.assembleParams();
	var params = {};
	//报表类型为“图表”
    if(this.options.report.REPORT_TYPE == 'SY_PLUG_REPORT_CHART'){
    	//“报表服务路径”对应图表的_PK_值
    	params[UIConst.PK_KEY] = this.options.report.REPORT_FILE_NAME;
    	//拼装查询区表单参数
    	_self.advSearch.reportParams["_WHERE_"]=_self.advSearch._WHERE_;
    	jQuery.extend(true,params,_self.advSearch.reportParams);
    }else{
    	//获取报表参数
        var result = FireFly.doAct(this.options.report.REPORT_CODE, 'getReportParameters', 
        		                   {'REPORT_PARAMS' : this._getReportParams()}, false);
        params = result._DATA_;
    }
    return params;
}

/**
 * 获取表单参数
 * 
 * @return {String}
 */
rh.vi.reportView.prototype._getReportParams = function(){
    var me = this;
    var params = '';
    $.each(this.advSearch.reportParams, function(key, value){
        params = params + '&' + key + '=' + value;
    });
    if(params.length > 1){
        params = params.substring(1);
    }
    
    return params; 
};

/**
 * 获取报表服务器地址
 * 
 * @return {String}
 */
rh.vi.reportView.prototype._getReportServerAddress = function(){
    var server = FireFly.getConfig(this.options.report.REPORT_TYPE);
    if(server && server.CONF_VALUE){
        return server.CONF_VALUE;
    }else{
    	Tip.showError(this.options.REPORT_TYPE__NAME + '报表服务器地址未配置，无法使用', true);
        return false;
    }
};

/**
 * 构建表单
 */
rh.vi.reportView.prototype._buildForm = function() {
	var _self = this;
    this.formContainer = $('<div></div>').addClass('formContent');
    var data = {};
    data["ITEMS"] = this.options.FORM_ITEMS;//报表参数定义
    data["DICTS"] = {};
    $.each(this.options.FORM_ITEMS, function(i, item){
    	//不隐藏的字段默认都作为查询项
    	if(item.ITEM_HIDDEN == 2){
    		item["ITEM_SEARCH_FLAG"]=1;
    	}
    });
    //渲染查询区组建
    this.advSearch = new rh.ui.reportSearch({"id":this.options.report.REPORT_CODE,"data":data,"parHandler":this,
		"pCon":this.formContainer,"treeLink":false,"col":3});
    this.advSearch.show();
    //重新绑定查询按钮事件
    jQuery(".rh-advSearch-btn",this.formContainer).unbind("click").bind("click",function(){
    	_self._loadReport();
    });
    return this.formContainer;
};

/**
 * 根据SY_PLUG_REPORT_ITEM配置构建表单项, 表单项的id=REPORT_CODE-ARG_CODE
 * @param {SY_PLUG_REPORT_ITEM} config
 */
rh.vi.reportView.prototype._buildFormItem = function(config){
	if (config && config.ITEM_HIDDEN == '2') {
        var inputType = config.ITEM_INPUT_TYPE;
        var id = config.ITEM_CODE;
        var name = id;
        var defaultValue = config.ITEM_INPUT_DEFAULT;
        var inputConfig = config.ITEM_INPUT_CONFIG;
        var width = config.ITEM_CARD_WIDTH ? config.ITEM_CARD_WIDTH : this.options.FORM_ITEM_WIDTH;
        var widthConfig = this._getWidthConfig(config.ITEM_CARD_COLS);
        var container = $('<div></div>').addClass('inner')
                            .css({'width':widthConfig.ITEM_WIDTH, 'max-width': widthConfig.MAX_WIDTH})
				            .append($('<span></span>')
                                .addClass('left')
                                .css('width', widthConfig.LABEL_WIDTH)
                                .append(this._buildItemLabel(id, config.ITEM_NAME))
                            );
        var item = $('<span></span>').addClass('right')
        			.css('width', widthConfig.INPUT_WIDTH);
        var input = null;
        
        switch(config.ITEM_INPUT_MODE){
            //输入模式为：无
            case UIConst.FITEM_INPUT_AUTO:
                input = this._buildAutoItem(inputType, id, name, defaultValue, inputConfig, width);
                break;
            //日期
            case UIConst.FITEM_INPUT_DATE:
                input = this._buildDateItem(id, name, defaultValue, inputConfig, width);
                break;
            //查询选择
            case UIConst.FITEM_INPUT_QUERY:
                input = this._buildQueryChoose(inputType, id, name, defaultValue, inputConfig, width);
                break;
            //数据字典
            case UIConst.FITEM_INPUT_DICT:
                input = this._buildDictionaryChoose(inputType, id, name, config.ITEM_CODE, inputConfig, width);
                break;
            default:
        }
        return container.append(item.append(input));
	} else {
		return null;
	}
};

/**
 * 构建表单项label
 * @param {} forItemId  label对应的表单项id
 * @param {} itemName   label内容
 * @param {} id 
 * @return {Object}
 */
rh.vi.reportView.prototype._buildItemLabel = function(forItemId, itemName){
    var id = forItemId + "-label";
    var label = new rh.ui.Label({
                _for : forItemId,
                text : itemName,
                id : id
            });
    this.options.ITEMS[id] = label;
    
    return label.obj;
};

/**
 * 构建输入模式为“无”的表单项
 * 
 * @param {String}
 *            inputType 输入类型
 * @param {String}
 *            id
 * @param {String}
 *            name
 * @param {String}
 *            defaultValue
 * @param {String}
 *            inputConfig
 */
rh.vi.reportView.prototype._buildAutoItem = function(inputType, id, name, defaultValue, inputConfig, width){
    var item = null;
    var $item = null;
    switch(inputType){
        //文本框
        case UIConst.FITEM_ELEMENT_INPUT:
            item = new rh.ui.Text({
                        id : id,
                        name : name,
                        _default : defaultValue,
                        width : width,
                        item_input_config : inputConfig
                    });
            break;
        // 下拉框
        case UIConst.FITEM_ELEMENT_SELECT:
            item = new rh.ui.Select({
						id : id,
                        name : name,
                        _default : defaultValue,
                        width : width,
                        item_input_config : inputConfig
					});
            break;
        // 单选框
        case UIConst.FITEM_ELEMENT_RADIO:
            item = new rh.ui.Radio({
						id : id,
						name : name,
						_default : defaultValue,
						width : width,
						item_input_config : inputConfig
					});
            break;
        // 复选框
        case UIConst.FITEM_ELEMENT_CHECKBOX:
            item = new rh.ui.Checkbox({
						id : id,
                        name : name,
                        _default : defaultValue,
                        width : width,
                        item_input_config : inputConfig
					});
            break;
        // 大文本
        case UIConst.FITEM_ELEMENT_TEXTAREA:
            item = new rh.ui.Textarea({
						id : id,
                        name : name,
                        _default : defaultValue,
                        width : width,
                        item_input_config : inputConfig
					});
            break;
        default:
            break;
    }
    $item = item._container ? item._container : item._obj;
    this.options.ITEMS[id] = item;
    return $item;
};

/**
 * 构建日期项
 * 
 * @param {String} id 
 * @param {String} name
 * @param {String} defaultValue
 * @param {String} inputConfig
 * @return {String}
 */
rh.vi.reportView.prototype._buildDateItem = function(id, name, defaultValue, inputConfig, width){
    var item = new rh.ui.Date({
                id : id,
                name : name,
                _default : defaultValue,
                width : width,
                item_input_config : inputConfig
            });
    this.options.ITEMS[id] = item;
	return item._container ? item._container : item._obj;
};

/**
 * 构建查询选择
 * 
 * @param {String} inputType
 * @param {String} id
 * @param {String} name
 * @param {String} defaultValue
 * @param {String} inputConfig
 */
rh.vi.reportView.prototype._buildQueryChoose = function(inputType, id, name, defaultValue, inputConfig, width){
    var textType = 'text';
    if(inputType == UIConst.FITEM_ELEMENT_TEXTAREA){
        textType = 'textarea';
    }
    
    var item = new rh.ui.QueryChoose({
				id : id,
				name : name,
				_default : defaultValue,
				width : width,
				textType : textType,
				item_input_config : inputConfig,
				formHandler : this
			});
     this.options.ITEMS[id] = item;
     
     return item._container ? item._container : item._obj;
};

/**
 * 构建数据字典
 * 
 * @param {String} inputType
 * @param {String} id
 * @param {String} name
 * @param {String} itemCode 
 * @param {String} inputConfig
 */
rh.vi.reportView.prototype._buildDictionaryChoose = function(inputType, id, name, itemCode, inputConfig, width){
    var textType = 'text';
    if(inputType == UIConst.FITEM_ELEMENT_TEXTAREA){
        textType = 'textarea';
    }
    
    var item = new rh.ui.DictChoose({
                id : id,
                name : name,
                dict : FireFly.getDict(inputConfig.substring(0, inputConfig.indexOf(','))),
                item_code : itemCode,
                width : width,
                textType : textType,
                item_input_config : inputConfig,
                formHandler : this
            });
    this.options.ITEMS[id] = item;
    return item._container ? item._container : item._obj;;
};

/**
 * 构建报表展示区, iframe命名格式为：'SY_PLUG_REPORT-' + this.options.REPORT_CODE + '-display-iframe'
 */
rh.vi.reportView.prototype._buildReportArea = function() {
    var id = this.options.REPORT_CODE + '-display-iframe';
    this.options.REPORT_DISPLAY_IFRAME = $('<iframe></iframe>')
                    .attr('id', id)
                    .attr('name', id)
                    .addClass('tabFrame')
                    .css(
                        {
                            'width' : '100%',
                            'height' : '98%',
                            'frameBorder' : 0,
                            'border' : 0,
                            'scroll' : 'yes'
                        }
                    );
    this.iframeContainer = $('<div></div>').append(this.options.REPORT_DISPLAY_IFRAME)
	return this.iframeContainer;
};

/**
 * 构建提交用表单对象
 * @return {Object} 表单对象
 */
rh.vi.reportView.prototype._buildSubmitForm = function(){
    var form = 
        $('<form></form>')
            .attr('action', this._getReportServerAddress())
            .attr('method', 'post')
            .attr('enctype', 'application/x-www-form-urlencoded');
    
    //设置target
    var target = null;
    if(this.options.report.OPEN_TYPE == '3'){
        target = '_blank';
    }else{
        target = this.options.REPORT_DISPLAY_IFRAME.attr('name');
    }
    form.attr('target', target);
    this.options.SUBMIT_FORM = form;
    return form;
};

/**
 * 根据表单项所占列数计算各宽度配置
 * 
 * @param {int} columns 表单项所占列数
 */
rh.vi.reportView.prototype._getWidthConfig = function(columns){
	var blankWidth = 2.5;
	//label占itemWidth的宽度
	var labelWidth = 35; 
	var itemWidth = 48.75;
	// inner最大的宽度
	var maxWidth = 1400;
	
    if (columns >= this.options.DEFAULT_COLUMN_WIDTH) {
        labelWidth = labelWidth / this.options.DEFAULT_COLUMN_WIDTH;
        itemWidth = 100 - blankWidth;
    } else {
        labelWidth = labelWidth / columns;
        itemWidth = 100 / this.options.DEFAULT_COLUMN_WIDTH - 2.5 * (columns / this.options.DEFAULT_COLUMN_WIDTH);
        maxWidth = maxWidth / this.options.DEFAULT_COLUMN_WIDTH * columns;
    }
    
    // 1是留出来的左右边距
    var inputWidth = (100 - labelWidth - 1);
    
    return {
		'ITEM_WIDTH' : itemWidth + '%',
		'LABEL_WIDTH' : labelWidth + '%',
		'INPUT_WIDTH' : inputWidth + '%',
		'MAX_WIDTH' : maxWidth + 'px'
	}
};

/**
 * 显示遮罩层
 */
rh.vi.reportView.prototype._mask = function(){
    $('#' + this.options.report.REPORT_CODE + '-mainTab').mask('正在查询...');
};

/**
 * 取消遮罩层
 */
rh.vi.reportView.prototype._unmask = function(){
    $('#' + this.options.report.REPORT_CODE + '-mainTab').unmask();
};

/**
 * 关闭当前页
 */
rh.vi.reportView.prototype.close = function() {
	Tab.close();
};

/**
 * 加载js扩展，js命名遵循规则：[REPORT_CODE].js,文件路径为：/sy/plug/report/js/[REPORT_CODE].js
 */
rh.vi.reportView.prototype._loadJsExtention = function(){
    Load.js('/sy/plug/report/js/' + this.options.report.REPORT_CODE + '.js', this);
};

/**
 * 获取给定编码的表单项
 * 
 * @param {String} itemCode 表单项编码
 * @return {Object}
 */
rh.vi.reportView.prototype.getItem = function(itemCode){
    return this.options.ITEMS[itemCode];
};
/**
 * 加载渲染后处理
 */
rh.vi.reportView.prototype._afterLoad = function(){
	//取得查询区的高度
	this.formContainerHeight = this.formContainer.height();
	this.iframeContainer.height(this.cardContainer.height()-this.formContainerHeight-60);
}
/**
 * 重置页面高度
 */
rh.vi.reportView.prototype._resetHeiWid = function() {
	var formContainerHeight_new = this.formContainer.height();
	//计算form原来的高度和当前高度的差值
	var diff = this.formContainerHeight - formContainerHeight_new;
	//重新保存查询区form的高度
	this.formContainerHeight = formContainerHeight_new;
	this.iframeContainer.height(this.iframeContainer.height()+diff);
};