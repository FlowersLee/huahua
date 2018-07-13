/** 卡片页面渲染引擎 */
GLOBAL.namespace("rh.vi");
rh.vi.cardView = function(options) {
    var defaults = {
        "id":options.sId + "-viCardView",
        "act":"",
        "sId":"",
        "pCon":null,
        "pId":"",
        "parHandler":null,
        "parTabClose":false,
        "transferData":"",
        "replaceUrl":"",//替换当前业务数据获取
        "readOnly":false,
        "saveReturn":false,
        "title":"",//当前标题
        "reset":true, //重置外层高度
        "backBtn":true,//返回按钮显示与否
        "beforeSaveCheck":false,//返回时是否检查保存
        "areaId":"",//刷新home页的portal相应区块
        "cardIn":false,//单条记录进卡片
        "widHeiArray":null,//小卡片窗口的[宽度,高度]
        "xyArray":null,//小卡片窗口的[x坐标,y坐标]
        "servDef":null //服务定义数据
    };
    this._pkCode = options[UIConst.PK_KEY] || "";
    this.opts = jQuery.extend(defaults,options);
    this.servId = this.opts.sId;
    this._actVar = this.opts.act;
    this._replaceUrl = this.opts.replaceUrl;//代办进入时的替换url
    this._parHandler = this.opts.parHandler;
    this._transferData = this.opts.transferData;
    this.beforeSaveCheck = this.opts.beforeSaveCheck;
    this.links = this.opts.links || null;//关联功能过滤条件
    this.widHeiArray = this.opts.widHeiArray || [];//卡片窗口的[宽度,高度]
    this.xyArray = this.opts.xyArray || [];//卡片窗口的[x坐标,y坐标]
    this.miniCard = false;//小卡片标志
    this._height = "";
    this._width = "";
    this._modal = false;//卡片模式
    this._parentRefreshFlag = false;
    this._areaId = this.opts.areaId;
    this._readOnly = this.opts.readOnly;
    this._pCon = this.opts.pCon;
    this.saveReturn = this.opts.saveReturn;
    this._cardIn = this.opts.cardIn;
    this.dialogId = GLOBAL.getUnId("winDialog",this.opts.sId);
    this.tabsId = GLOBAL.getUnId("winTabs",this.opts.sId);
    this._mainTab = GLOBAL.getUnId("mainTab",this.opts.sId);
    this._preTabHandlerRefresh = null;//跨tab的传递句柄，点击返回时，自动调用刷新方法
    this._transferParams = this.opts.transParams || {};//系统处理的转换的jsp链接过来的参数对象
    this.params = {};//当前引擎的参数集合对象
    if (this.opts.paramsFlag == "true") {
        this.params = parent.System.getTempParams(this.servId);//和paramsFlag配合使用，构造时传入的参数对象，仅用于传递参数
        if (opener) { //如果是弹出新页面的参数取值处理
            this.params = opener.System.getTempParams(this.servId);
        }
        if (this.params.links) {//外层传递的links参数对象
            this.links = this.params.links;
        }
        if (this.params.handlerRefresh) {//跨tab的刷新传递
            this._preTabHandlerRefresh = this.params.handlerRefresh;
        }
    }
    if (!jQuery.isEmptyObject(this._transferParams)) {//系统处理的链接参数,可被params对象值覆盖
    	this.params = jQuery.extend(this._transferParams,this.params);
    }
    if (this.widHeiArray.length > 0) {//小卡片
        this.miniCard = true;
        this._modal = true;//模态
    }
    if(this.opts.servDef){ // 是否服务定义已存在？存在则放到缓存中
        this._data = this.opts.servDef;
        FireFly.setCache(this.opts.sId,FireFly.servMainData,this._data);
    }else{ // 服务定义不存在则异步加载
        this._data = FireFly.getCache(this.opts.sId,FireFly.servMainData);
    }
    //服务定义的标签script和css文件
    var servJS = this._data.SERV_JS;
    if (servJS.length > 0) {
        var servStyle = GLOBAL.servStyle[this.servId];
        if (!servStyle) {
            jQuery(servJS).appendTo("head");
            GLOBAL.servStyle[this.servId] = "true";
        }
    }
    this._items = this._data.ITEMS; //字段定义信息
    this._linkServ = this._data.LINKS || {};//关联功能信息
    this.servKeys = this._data.SERV_KEYS;
    this._jsp = this._data.SERV_CARD_JSP || "";
    this._commentFlag = this._data.SERV_COMMENT_FLAG || 2;
    this.servName = this._data.SERV_NAME || "";
    this._redHeadText = this._data.SERV_RED_HEAD || "";//红头文字
    this._title = (this.opts.title.length > 0) ? this.opts.title : this.servName;

    this._servCardLoad = this._data.SERV_CARD_LOAD || "";//卡片加载js
    this._pServCardLoad = this._data.P_SERV_CARD_LOAD || "";//父服务卡片加载js
    this._servPId = this._data.SERV_PID;//父服务ID
    this._tabRefreshFlag = {};// 保存是否需要刷新当前被点击的tab，key为服务ID，值为布尔类型
};
/*
 * 显示卡片页面，主方法
 */
rh.vi.cardView.prototype.show = function() {
    var _self = this;
    if (this._pCon) {//有设定容器展示前清空原区域内容
        _self.destroyUI();
        this._pCon.empty();
    }
    this._tabLayout();
    if (this._pCon == null) {//没有设定外层容器
        this._bldWin();
    }
    this._bldCardLayout();
    this._afterLoad();
};
/*
 * 布局卡片tabs和主功能页
 */
rh.vi.cardView.prototype._tabLayout = function() {
    var _self = this;
    //默认布局
    var pId = "";
    var mainP = "wp";
    var sliderP = "wp0";
    var winDialogCss = {"overflow":"hidden"};
    var miniDialogCss = "";
    if (this.miniCard) {//小卡片
        winDialogCss = {"overflow-y":"auto","overflow-x":"hidden"};
        miniDialogCss = "cardDialogMini";
    }
    //tempTODO 临时增加边框阴影
    this.winDialog = jQuery("<div></div>").addClass("cardDialog").addClass("rh-bottom-right-radius").addClass(miniDialogCss).attr("id",this.dialogId).attr("title","卡片").css(winDialogCss);
    this.tabs = jQuery("<div></div>").attr("id",this.tabsId).addClass("rhCard-tabs");
    this.mainUL = jQuery("<ul></ul>").addClass("tabUL").addClass("tabUL-top").appendTo(this.tabs);
    try{
        if (parent.GLOBAL.style.SS_STYLE_BLOCK) {//区块头
            this.mainUL.addClass(parent.GLOBAL.style.SS_STYLE_BLOCK);
        }
    } catch (e) {}
    //主信息
    var mainLi = jQuery("<li></li>").addClass("rhCard-tabs-li").appendTo(this.mainUL);
    var mainA = jQuery("<a></a>").text("基本信息").attr("href","#"+ this._mainTab).appendTo(mainLi);
    this.mainLi = mainA;
    this.mainLi.bind("click",function() {
        if (_self.getRefreshFlag(_self.servId)) {
            _self.setRefreshFlag(_self.servId, false);
            _self.refresh();
        } else {
            _self._changeTabHeiWid(_self._MainHeight);
        }
    });
    this.mainCon = jQuery("<div class='rhCard-mainTab'></div>").attr("id",this._mainTab).appendTo(this.tabs);

    this.sonTab = {};
    this.sonTabTop = [];//顶部关联tab
    //卡片下方关联tab
    this._bottomTabs = null;
    var bottomUL = null;
    //获取爷爷的servid
    if (_self.getParHandler() && _self.getParHandler().getParHandler() && _self.getParHandler().getParHandler().servId) {
        this.parServId = _self.getParHandler().getParHandler().servId;
    }
    //修改状态才进入
    if (this._actVar == UIConst.ACT_CARD_MODIFY) {
        //构造关联功能
        jQuery.each(this._linkServ,function(i,n) {
            //如果爷爷存在则孙子服务自动隐藏，防止循环的存在
            if (n.LINK_SERV_ID == _self.parServId) {
                return true;
            }
            //仅显示主单标签和主单下列表
            if ((n.LINK_SHOW_POSITION == 2) || n.LINK_SHOW_POSITION == 3) {
                var tempA = jQuery("<a></a>").attr("href","#" + n.LINK_SERV_ID).append(n.LINK_NAME);
                var tempLi = jQuery("<li></li>").attr("sid",n.LINK_SERV_ID).append(tempA);
                var tempCon = jQuery("<div></div>").attr("id",n.LINK_SERV_ID).addClass("rhCard-sonTab");
                if (n.LINK_SHOW_POSITION == 2) {//主单下列表
                    if (_self._bottomTabs == null) {//第一个
                        _self._bottomTabs = jQuery("<div></div>").addClass("rhCard-tabs");
                        bottomUL = jQuery("<ul></ul>").addClass("tabUL").addClass("tabUL-bottom").appendTo(_self._bottomTabs);
                        _self._bottomFirstA = tempA;
                    }
                    tempLi.addClass("rhCard-tabs-bottomLi").appendTo(bottomUL);
                    tempA.attr("bottomTabFlag","true");
                    _self._bottomTabs.append(tempCon);
                } else {
                    tempLi.addClass("rhCard-tabs-topLi").addClass("rhCard-tabs-li").appendTo(_self.mainUL);
                    tempCon.appendTo(_self.tabs);
                    _self.sonTabTop.push(n.LINK_SERV_ID);
                }

                tempA.bind("click",function(event) {
                    var thisObj = jQuery(this);
                    if (_self.sonTab[n.LINK_SERV_ID+"-FLAG"]) { //已加载过
                        if (n.LINK_REFRESH == 1 || _self.getRefreshFlag(n.LINK_SERV_ID)) {//强制刷新或者其它地方设置过点击要刷新了
                            if(typeof(_self.sonTab[n.LINK_SERV_ID].refresh) == "function"){
                                _self.sonTab[n.LINK_SERV_ID].refresh();
                            }else if(_self.sonTab[n.LINK_SERV_ID].is("iframe")){
                                _self.sonTab[n.LINK_SERV_ID][0].contentWindow.location.reload(true);
                            }
                            // 刷新完了之后把刷新标志置为false
                            if (_self.getRefreshFlag(n.LINK_SERV_ID)) {
                                _self.setRefreshFlag(n.LINK_SERV_ID, false);
                            }
                        } else {
                            var temp = _self.sonTab[n.LINK_SERV_ID];
                            if (jQuery(this).attr("bottomTabFlag") == "true") {//主单下列表标识
                                _self._changeBottomTabHeiWid(temp._height);
                            } else {//主单上列表修改高度
                                _self._changeTabHeiWid(temp._height);
                            }
                        }
		          	　return false;
                    }
                    //_self.cardBarTipLoad("加载中..");
                    var editBtnsFlag = _self._judgeEditBtns();//判断按钮组的只读
                    setTimeout(function() {//第一次加载
                        //关联功能构造
                        var linkItem = n.SY_SERV_LINK_ITEM || {};
                        var linkWhere = [];
                        var links = {};
                        var parVal = {};//关联字段值转换成系统变量,供子调用
                        var linkItemReadOnly = "";
                        var linkItemType = "";//单选多选标识
                        var linkItemSearch = "false";//显示查询
                        jQuery.each(linkItem, function(i,n) {//生成子功能过滤条件
                            if (n.LINK_WHERE_FLAG == 1) {
                                linkWhere.push(" and ");
                                linkWhere.push(n.LINK_ITEM_CODE);
                                linkWhere.push("='");
                                var value = _self.itemValue(n.ITEM_CODE);
                                if (n.LINK_VALUE_FLAG == 2) {//主单常量值
                                    value = n.ITEM_CODE;
                                }
                                linkWhere.push(value);
                                linkWhere.push("' ");
                            }
                            if (n.LINK_VALUE_FLAG == 1) {//主单数据项值
                                var value = _self.itemValue(n.ITEM_CODE);
                                //如果页面上没有，则去links里找一下
                                if ((value == null || value==undefined) && _self.links) {
                                    value = _self.links[n.ITEM_CODE];
                                }
                                links[n.LINK_ITEM_CODE] = value;
                                if (_self.form && _self.form.getItem(n.ITEM_CODE) && _self.form.getItem(n.ITEM_CODE).type == "DictChoose") {//字典类型传递关联值处理
                                    links[n.LINK_ITEM_CODE + "__NAME"] = _self.form.getItem(n.ITEM_CODE).getText();
                                }
                                var parValId = "@" + n.LINK_ITEM_CODE + "@";
                                parVal[parValId] = value;
                            }
                            if (n.LINK_VALUE_FLAG == 2) {//主单常量值
                                if (n.LINK_ITEM_CODE.toUpperCase() == "READONLY") {//只读参数设置
                                    linkItemReadOnly = _self._excuteActExp(n.ITEM_CODE);
                                } else if (n.LINK_ITEM_CODE.toUpperCase() == "TYPE") { //单选多选标识
                                    linkItemType = n.ITEM_CODE;
                                } else if (n.LINK_ITEM_CODE.toUpperCase() == "SHOWSEARCHFLAG") {//显示查询
                                    linkItemSearch = n.ITEM_CODE;
                                } else {//其它常量值的增加
                                    links[n.LINK_ITEM_CODE] = n.ITEM_CODE;
                                }
                            }
                        });
                        //关联服务定义里的过滤条件处理
                        var itemLinkWhere = Tools.itemVarReplace(n.LINK_WHERE,_self.byIdData);
                        var linkWhereAll = linkWhere.join("") + itemLinkWhere;
                        if (n.LINK_SHOW_TYPE == 3) {//自定义url
                            linkWhereAll = Tools.xdocUrlReplace(linkWhereAll);//如果有doc则替换
                            var frame = _self._bldURLTab({"tabSid":n.LINK_SERV_ID,"tabUrl":linkWhereAll,"pCon":tempCon});
                            frame._height = frame.height();
                            _self.sonTab[n.LINK_SERV_ID] = frame;
                            _self.cardClearTipLoad();
                        } else {
                            var readFlag = _self._readOnly;
                            if (editBtnsFlag == false) {//只读关联功能
                                readFlag = true;
                            }
                            if (_self.wfCard && _self.wfCard.isExistEditBtn()) {//判断工作流是否存在编辑组按钮
                                readFlag = false;
                            }
                            if (typeof linkItemReadOnly == "boolean") {//忽略字符串
                                if (linkItemReadOnly == false) {//关联字段定义里的只读控制
                                    readFlag = false;
								} else {
									readFlag = true;
                                }
                            }
                            if (_self.tabReadOnlyArray && _self.tabReadOnlyArray[n.LINK_SERV_ID + "_READONLY"] && _self.tabReadOnlyArray[n.LINK_SERV_ID + "_READONLY"] == true) {//tab的调用方法设置只读
                                readFlag = true;
                            }
                            var oneRecordCon = tempCon;
                            if (n.LINK_SHOW_TYPE == 2) {//卡片显示
                                tempCon = null;
                            }
                            var temp = {"sId":n.LINK_SERV_ID,"pCon":tempCon,"showSearchFlag":linkItemSearch,"showTitleBarFlag":"false","replaceQueryModel":1,"type":linkItemType,
                                "linkWhere":linkWhereAll,"linkServQuery":n.LINK_SERV_QUERY,"links":links,"parHandler":_self,"readOnly":readFlag,"parVar":parVal};
                            if (thisObj.attr("bottomTabFlag") == "true") {//主单下列表标识
                                temp["bottomTabFlag"] = true;
                            }
                            if (n.LINK_SHOW_TYPE == 2) {
                                temp["reset"] = false;
                            }
                            var listView = new rh.vi.listView(temp);
                            listView.show();
                            _self.sonTab[n.LINK_SERV_ID] = listView;
                            //单条记录进卡片
                            if (n.LINK_SHOW_TYPE == 2) {//卡片显示
                                var listData = listView.getListData()._DATA_;
                                var recordNum = listData.length;
                                var act = UIConst.ACT_CARD_ADD;
                                var pk = "";
                                if (recordNum == 1) {
                                    act = UIConst.ACT_CARD_MODIFY;
                                    pk = listData[0][UIConst.PK_KEY];
                                }
                                if (typeof linkItemReadOnly == "boolean") {//关联字段定义里的只读控制
                                    readFlag = linkItemReadOnly;
                                }
                                var temp = {"act":act,"sId":n.LINK_SERV_ID,"pCon":oneRecordCon,"links":links,"cardIn":true,"parHandler":_self,
                                    "readOnly":readFlag,"bottomTabFlag":temp["bottomTabFlag"]};
                                temp[UIConst.PK_KEY] = pk;
                                var cardView = new rh.vi.cardView(temp);
                                cardView.show();
                                _self.sonTab[n.LINK_SERV_ID] = cardView;
                            }
                        }
                        _self.sonTab[n.LINK_SERV_ID + "-FLAG"] = true;
                        return false;
                    },10); //setTimeout结束
                });//click结束
            }
        });
    }
    //只主信息的时候隐藏主tab
    if (this.sonTabTop.length == 0) {
        mainLi.css("margin-top","-3000px");
    }
    //标题
    _self.tabs.find(".rhCard-tabs-li").first().addClass("rhCard-tabs-li-left");
    _self.tabs.find(".rhCard-tabs-li").last().addClass("rhCard-tabs-li-right");
    var titleLi = jQuery("<li></li>").addClass("rhCard-titleLi");
    this.titleObj = jQuery("<a>" + this._title + "</a>").attr("id","rhCard-title").addClass("rhCard-title").appendTo(titleLi);
    titleLi.prependTo(_self.mainUL);
    //返回
    if (this.opts.backBtn === true) {//显示返回按钮
        var backLi = jQuery("<li></li>").addClass("rhCard-backLi").appendTo(_self.mainUL);
        this.backA = jQuery("<a>返回</a>").attr("id","rhCard-back").addClass("rhCard-refresh").appendTo(backLi);
        this.backA.on("mousedown",function() {
            if ((window.self == window.top) && (_self.miniCard == false)) {//顶层页面自动关闭
                if (jQuery("#viewPage").val() == "card") {
                    var browserName=navigator.appName;
                    if (browserName=="Netscape"){
                        window.open('', '_self', '');
                    }
                    window.close();
                    return false;
                }
            }
            //如果用户修改数据，提示用户保存
            if ((_self._actVar == UIConst.ACT_CARD_MODIFY) && (_self.beforeSaveCheck == true)) {//修改
                if (jQuery.isEmptyObject(_self.getChangeData())) {
                } else {
                    var confirmDel=confirm("数据有修改，是否保存？");
                    if (confirmDel == true){
                        if (_self.btns[UIConst.ACT_SAVE]) {
                            _self.btns[UIConst.ACT_SAVE].click();
                            return false;
                        }
                    }
                }
            }
            //销毁页面组件
            _self.destroyUI();
            if (_self._pCon) {//有设定容器
                _self._pCon.empty();
            } else {//默认body容器
                jQuery("#" + _self.dialogId).dialog("close");
            }
            if (_self._parentRefreshFlag) {
                if (_self._parHandler) {
                    _self._parHandler.refreshGrid();
                }
            }
            if (_self._preTabHandlerRefresh) {//跨tab的句柄传递
                _self._preTabHandlerRefresh.refresh();
            }
            if (_self._areaId.length > 0) {//有区块id，则刷新hom页的相应区块
                var temp = _self._areaId.split(",");
                jQuery.each(temp,function(i,n) {
                    try {
                        _self.params.portalHandler.refreshBlock(n);
                    } catch(e){
                    }
                });
            }
            if (_self.opts.parTabClose) {//关闭外层tab
                if (GLOBAL.getFrameId()) {
                    Tab.close();
                }
                return false;
            }
            _self._preBtnBarFixed();
            return false;
            // _self._parHandler._locHref(_self._pkCode);
        });
    }
    if (window.self != window.top) {//顶层页面自动关闭
        var refreshLi = jQuery("<li></li>").addClass("rhCard-refreshLi").appendTo(_self.mainUL);
        this.refreshA = jQuery("<a>刷新</a>").attr("id","rhCard-refresh").addClass("rhCard-refresh").appendTo(refreshLi);
        if(System.getVar("@C_SY_REFRESH_ICON_SHOW@") == 'false'){
            refreshLi.hide();
        }
        this.refreshA.on("mousedown",function() {
            _self.refresh();
            _self.cardBarTip("刷新成功");
        });
    }
    if (this._pCon) {//有容器传入
        if (this._cardIn == true) {//单条记录进卡片
            this.tabs.appendTo(this._pCon);
            this.mainUL.hide();
            this.winDialog = this.getParHandler().winDialog;
        } else {
            this.tabs.appendTo(this._pCon);
            this.winDialog = jQuery();
            jQuery("#" + this.tabsId).tabs({});
            jQuery("#" + this.tabsId).css({"min-height":"auto"}); //设定自动高度
        }
    } else {
        this.tabs.appendTo(this.winDialog);
        this.winDialog.appendTo(jQuery("body"));
    }
};
/*
 * 构造tab的关联自定义url
 */
rh.vi.cardView.prototype._bldURLTab = function(opts) {
    var _self = this;

    var tabSid = opts.tabSid;
    var tabUrl = opts.tabUrl;
    var tabPCon = opts.pCon;
    var id = tabSid + "-tabsIframe";
    var frame = jQuery("<iframe border='0' class='rhCard-tabsIframe' frameborder='0'></iframe>").attr({"id":id,"name":id,"width":"100%","height":600,"src":tabUrl});
    frame.appendTo(tabPCon);

    document.shareCradViewer = _self;
    jQuery(document).data("shareCradViewer", _self);
    frames[id]._parentViewer = this;

    return frame;
};
/*
 * 模拟点击返回按钮
 */
rh.vi.cardView.prototype.backClick = function() {
    this.backA.mousedown();
};
/*
 * 构建卡片外层的window框
 */
rh.vi.cardView.prototype._bldWin = function() {
    var _self = this;
    var hei = document.documentElement.scrollHeight;
    var wid = document.documentElement.scrollWidth;
    var widPercent = "98.1%";
    var parWid = parent.document.documentElement.scrollWidth;
    var position = "left top";
    if (parWid < 1028) {//判断屏幕的宽度
        widPercent = "97%";
    } else if (parWid > 1800) {
        widPercent = "98.8%";
    }
    widPercent = UIConst.CARD_WID || widPercent;
    if (this.miniCard) {//有替换的宽高度
        widPercent = this.widHeiArray[0];
        hei = this.widHeiArray[1];
        position = this.xyArray;
    }
    jQuery("#" + this.dialogId).dialog({
        autoOpen: false,
        height: hei,
        width: widPercent,
        modal: _self._modal,
        resizable:false,
        position:position,
        open: function() {

        },
        close: function() {
            if (jQuery.browser.version == "8.0") {//解决浏览器IE8下工作流返回右侧黑板bug
                _self.winDialog.remove();
                _self.winDialog.empty();
            } else {
                _self.winDialog.empty();
                _self.winDialog.remove();
            }
            if (_self._parHandler) {
                _self._parHandler._resetHeiWid();
            }
        }
    });
    jQuery("#" + this.tabsId).tabs({});
    this.mainLi.click();
    this.winDialog.dialog("open");
    this.winDialog.parent().addClass("rh-ui-dialog").addClass("bodyBack");
    if (this.miniCard) {//小卡片设置区分边框
        this.winDialog.addClass("rh-ui-dialog-mini-border");
        this.winDialog.parent().addClass("rh-ui-dialog-mini");
    } else {
        Tools.rhSetBodyBack();//设置背景
    }
    if ((this._cardIn != true) && (this.miniCard == false)) {//单条记录进卡片
        parent.window.scrollTo(0,0); //进入卡片，外层页面滚动到顶部
    } else if (this.miniCard === true) {//小卡片滚动定位
        var top = this.winDialog.parent().css("top") + "";
        top = top.split("px");
        parent.window.scrollTo(0,top[0]);
    }
};
/*
 * 构建卡片布局，包括form和下方关联的功能
 */
rh.vi.cardView.prototype._bldCardLayout = function() {
    var _self = this;
    this._bldBtnBar();
    this._bldHeadMsg();
    this._bldForm();
    this._bldBtnBarAfter();

    if (this._commentFlag == UIConst.YES && _self._pkCode.length > 0) {//卡片级评论  如果有主键值，才显示输入评论的框和显示评论
        this._bldCardComment();
    }

    if (this._jsp.length > 0) {//嵌入自定义JSP
        this._bldIncludeJSP();
    }
    this._bldFormLayoutAfter();
};

/*
 * 构建form布局后执行方法，form和按钮后
 */
rh.vi.cardView.prototype._bldFormLayoutAfter = function() {
    this._readOnlyForm();
};
/*
 * 设置form的只读
 */
rh.vi.cardView.prototype._readOnlyForm = function() {
    var _self = this;
    var saveBtnFlag = _self.getBtn("save") || false;//是否存在保存按钮
    var editBtnsFlag = _self._judgeEditBtns();
    if (_self._readOnly == true || _self._readOnly == "true"　|| editBtnsFlag == false) {
        //设置form的只读
        _self.form.disabledAll();
    }
};
/*
 * 执行关联服务定义的操作表式
 */
rh.vi.cardView.prototype._bldLinkServExp = function() {
    var _self = this;
    if (this._actVar == UIConst.ACT_CARD_MODIFY) {
        jQuery.each(_self._linkServ,function(i,n) {
            var exp = n.LINK_EXPRESSION;
            var sid = n.LINK_SERV_ID;
            if (exp && exp.length > 0) {
                var flag = _self._excuteActExp(exp);
                if (flag == false) {
                    _self.tabHide(sid);
                }
            }
        });
    }
};

/**
 * 是否存在这样一个关联子服务
 */
rh.vi.cardView.prototype.existSubServ = function(subServId) {
    var _self = this;
    var rtnVal = false;
    jQuery.each(_self._linkServ, function(i,n) {
        var sid = n.LINK_SERV_ID;
        if (sid == subServId) {
            rtnVal = true;
            return false;
        }
    });

    return rtnVal;
};


/*
 * 页面构造完成后，引擎执行动作
 */
rh.vi.cardView.prototype._afterLoad = function() {
    var _self = this;
    //工作流控制页面
    var opts = {"sId":this.opts.sId,"pkCode":this._pkCode,"parHandler":this};
    this.wfCard = new rh.vi.wfCardView(opts);
    this.wfCard.render();
    //Form在页面加载完了之后要做处理
    this.form.afterLoad();
    //构造卡片下方关联tab
    if (this._bottomTabs) {
        this._bottomTabs.appendTo(this.mainCon);
        this._bottomTabs.tabs({})
    }
    //关联服务的操作表达式控制显示与否
    this._bldLinkServExp();
    //构造Form后执行js
    this._excuteProjectJS();
    //显示提示
    this._tipShow();
    //工程js后执行显示点击
    if (this._bottomTabs) {
        this._bottomFirstA.click();
    }
    //设置diaglog和外层iframe的高度
    this._resetHeiWid();
    //绑定滚动条事件
    this._btnBarFixed();
    //按钮条返回按钮位置处理
    this._btnBarBackBtn();
    //清除提示
    this.cardClearTipLoad();
};

/*
 * 根据动作绑定相应的方法
 * @param aId 动作ID
 */
rh.vi.cardView.prototype._act = function(aId,aObj) {
    var _self = this;
    var taObj = aObj;
    switch(aId) {
        case UIConst.ACT_SAVE://保存
            taObj.bind("click",function() {
                _self.cardBarTipLoad("提交中...");//Tip.showLoad("提交中...");
                setTimeout(function() {
                    _self._saveForm();
                    if (_self.saveReturn == true || _self.saveReturn == "true") {//保存后自动返回到列表页面
                        _self.backA.mousedown();
                    }
                },0);
                if(this.miniCard == false) {//单条记录进卡片
                    parent.window.scrollTo(0,0); //进入卡片，外层页面滚动到顶部
                }
                return false;
            });
            break;
        case UIConst.ACT_SAVE_NEW://复制并新建
            taObj.bind("click",function() {
                if (_self._actVar == UIConst.ACT_CARD_ADD) {
                    _self.cardBarTipError("添加状态不能复制！");
                    return false;
                }
                _self.cardBarTipLoad("新建中...");//Tip.showLoad("提交中...");
                setTimeout(function() {
                    //if(_self._saveForm() == true) {
                    _self._pkCode = "";
                    _self._actVar = UIConst.ACT_CARD_ADD;
                    _self._copyNewFlag = true;
                    _self.refresh();
                    //};
                },0);
                if(this.miniCard == false) {//单条记录进卡片
                    parent.window.scrollTo(0,0); //进入卡片，外层页面滚动到顶部
                }
                return false;
            });
            break;
        case UIConst.ACT_LOG_ITEM://变更历史
            taObj.bind("click",function() {
                var extWhere = "and SERV_ID='" + _self.servId + "' and DATA_ID='" + _self._pkCode + "'";
                var opts = {"url":"SY_SERV_LOG_ITEM_SINGLE.list.do?extWhere=" + encodeURIComponent(extWhere),"tTitle":"变更历史","menuFlag":3};
                Tab.open(opts);
                return false;
            });
            break;
        case "back"://返回
            taObj.bind("click",function() {
                _self.backClick();
                return false;
            });
            break;
        case "test2"://test
            taObj.bind("click",function(event) {
                var options = {"sId":"SY_ORG_USER"};
//		     	var dict = new rh.vi.rhDictTreeView(options);
//		     	dict.show(event);
                var select = new rh.vi.rhSelectListView(options);
                select.show(event);
            });
            break;
    }
};

/*
 * 卡片页面与后台交互方法，公用方法
 * @param act 动作ID
 * @param codes 需传递到后台的字段编号，多个以逗号分隔；没有codes，则默认传递所有字段
 * @parem async 是否异步
 */
rh.vi.cardView.prototype.doAct = function(act,codes,reload,extendData,async) {
    var _self = this;
    var datas = this.itemValues(codes);
    datas[UIConst.PK_KEY] = this._pkCode;
    if (extendData) {
        datas = jQuery.extend(datas,extendData);
    }

    if(async) {// 异步
        FireFly.doAct(this.opts.sId, act, datas, true, true, function(result){
            if (result[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
                if (reload && reload == true) {
                    _self.refresh();
                }
            }
        });
    } else {
        var result = FireFly.doAct(this.opts.sId, act, datas,true);
        if (result[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
            if (reload && reload == true) {
                _self.refresh();
            }
            return result;
        }
    }
};
/*
 * 卡片页面与后台交互方法，公用方法
 * @param act 动作ID
 * @param codes 需传递到后台的字段编号，多个以逗号分隔；没有codes，则默认传递所有字段
 */
rh.vi.cardView.prototype.doActReload = function(act,codes) {
    this.doAct(act,codes,true);
};
/*
 * 构建卡片按钮条
 */
rh.vi.cardView.prototype._bldBtnBar = function() {
    var _self = this;
    this.btnBar = jQuery("<div></div>").addClass("rhCard-btnBar");
    jQuery("<div class='rhCard-btnBar--instead'></div>").appendTo(this.mainCon);
    _self.btnBar.appendTo(this.mainCon);
};
/*
 * 构建按钮条下提示
 */
rh.vi.cardView.prototype._bldHeadMsg = function() {
    var _self = this;
    this.headMsgBar = jQuery("<div></div>").addClass("rhCard-headMsg");
    this.headMsgBar.appendTo(this.mainCon);
};
/*
 * 构建卡片按钮条后执行
 */
rh.vi.cardView.prototype._bldBtnBarAfter = function() {
    var _self = this;
    this.btns = {};
    var oneVar = UIConst.STR_YES;
    var tempData = this._data.BTNS;
    jQuery.each(tempData, function(i, n) {//满足条件则覆盖卡片的只读为编辑
        if (n.ACT_CODE == UIConst.ACT_MODIFY && n.S_FLAG == oneVar && n.ACT_TYPE == UIConst.ACT_TYPE_NOBTN) {//卡片按钮 && 启用&&非按钮
            _self._readOnly = false;
        }
    });
    jQuery.each(tempData, function(i, n) {
        if ((n.ACT_TYPE == UIConst.ACT_TYPE_CARD) && n.S_FLAG == oneVar) {//卡片按钮 && 启用
            var showFlag = true;//按钮的只读开关
            if ((_self._readOnly == true || _self._readOnly == "true") && (n.ACT_GROUP == oneVar)) {//页面只读&&编辑组
                showFlag = false;
            }
            if (showFlag) {
                var temp = jQuery("<a></a>").addClass("rh-icon").addClass("rhGrid-btnBar-a");
                temp.attr("id",GLOBAL.getUnId(n.ACT_CODE,_self.opts.sId));
                temp.attr("actcode",n.ACT_CODE);
                temp.attr("title",n.ACT_TIP);
                _self._act(n.ACT_CODE,temp);
                var labelName = jQuery("<span></span>").addClass("rh-icon-inner").text(n.ACT_NAME);
                temp.append(labelName);
                var icon = jQuery("<span></span>").addClass("rh-icon-img").addClass("btn-" + n.ACT_CSS);
                temp.append(icon);
                temp.data("actgroup",n.ACT_GROUP);
                if (n.ACT_MEMO.length > 0) {
                    temp.bind("click",function(event) {
                        var memo = n.ACT_MEMO;
                        memo = _self._replaceVars(memo,_self.byIdData);//替换变量
                        var _funcExt = new Function(memo);
                        _funcExt.apply(_self, [event]);
                    });
                }
                _self.btns[n.ACT_CODE] = temp;
                if ((n.ACT_EXPRESSION.length > 0) && _self._excuteActExp(n.ACT_EXPRESSION) == false) {//判断操作表达式
                    temp.hide();
                    _self.btnBar.append(temp);
                } else {
                    _self.btnBar.append(temp);
                }
            }
        }
    });
};
/*
 * 判断当前按钮组是否有编辑组按钮
 * return flag true：有编辑组按钮显示  false：没有编辑组按钮显示
 */
rh.vi.cardView.prototype._judgeEditBtns = function() {
    var _self = this;
    var rtnFlag = false;
    if (this._cardIn == true) {
        return true;
    }
    //按钮条显示则执行编辑组判断，不显示则读取最后一次的值
    if (this.btnBar.is(":visible")) {
        _self._judgeEditBtnsVar = null;
        jQuery.each(_self.btns,function(i,n) {
            var obj = jQuery(n);
            var visFlag = obj.is(":visible");
            if (obj.is(":visible") && (obj.data("actgroup") == UIConst.STR_YES)) {
                if (_self._judgeEditBtnsVar == null) {
                    _self._judgeEditBtnsVar = true;
                }
            }
        });
        if (_self._judgeEditBtnsVar) {
            rtnFlag = _self._judgeEditBtnsVar;
            _self._lastJudage = rtnFlag;
        } else {
            _self._lastJudage = false;
        }
    } else if (_self._lastJudage) {//取最后一次的
        rtnFlag = _self._lastJudage;
    }
    return rtnFlag;
};
/*
 * 按钮条只读
 */
rh.vi.cardView.prototype._readBtns = function() {
    var _self = this;
    var rtnFlag = false;
    jQuery.each(_self.btns,function(i,n) {
        var obj = jQuery(n);
        var visFlag = obj.is(":visible");
        if (obj.is(":visible") && (obj.data("actgroup") == UIConst.STR_YES)) {
            obj.hide();
        }
    });
};
/*
 * 获取默认值数据
 */
rh.vi.cardView.prototype.getDefaultData = function(itemCode) {
    var _self = this;
    var temp = _self._items[itemCode].ITEM_INPUT_DEFAULT;//缺省值
    return System.getVar(temp);
};
/*
 * 获取业务数据，修改时获取的是业务数据，添加的时候获取的是默认值
 */
rh.vi.cardView.prototype.getByIdData = function(itemCode) {
    var _self = this;
    if (_self._actVar == UIConst.ACT_CARD_MODIFY) {//修改
        return _self.byIdData[itemCode] || "";
    } else if (_self._actVar == UIConst.ACT_CARD_ADD) {//添加
        return _self.byIdData[itemCode] || "";
    }
};


/**
 * 根据字段配置的“ITEM_CARD_FORMAT”信息对form的byIdData中的数据进行处理
 */
rh.vi.cardView.prototype.formatData = function () {
	if (!this.byIdData) return;
	for (var key in this._items) {
		var format = this._items[key].ITEM_CARD_FORMAT || "";
		var value = this.byIdData[key];
		if (format && !jQuery.isEmptyObject(value)) {
			var formatStr = format.substring(0, format.length - 1);
			if (formatStr.lastIndexOf("(") != (formatStr.length - 1)) { //不是以(为结尾
				formatStr += ",";
			}
			value = value.replace(/"/g, "\\\""); //确保下面方法可以顺利执行
			value = eval(formatStr + "\"" + value.replace(/\n/gi, "").replace(/\"/gi, "") + "\")");
			this.byIdData[key] = value;
		}
	}
};


/*
 * 获取业务数据里的原始值
 */
rh.vi.cardView.prototype.getOrigPK = function() {
    return this.byIdData[this.servKeys];
};
/*
 * 仅重新读取form数据并填充
 */
rh.vi.cardView.prototype.refreshFormData = function() {
    this._beforeByIdData = null;
    this._fillFormData();
};
/*
 * 构建卡片form，调用rh.ui.Form组件
 */
rh.vi.cardView.prototype._bldForm = function() {
    var _self = this;
    //构造Form
    this.formCon = jQuery("<div class='form-container'></div>");
    var opts = {
        "id":"formView",
        "pId":_self.opts.sId,
        data : this._data,
        "parHandler":_self
    };
    //this._beforeForm();
    this.form = new rh.ui.Form(opts);
    this.formCon.append(this.form.obj);
    this.formCon.appendTo(this.mainCon);
    //对组件做额外的处理
    this.form.render();
    //填充数据
    this._fillFormData();
    //表达式设置字段的必填、只读、隐藏
    this.form.expItems(_self.byIdData,_self.links);
    //增加红头文字
    this.addRedHead(this._redHeadText);
};
/*
 * 渲染form之前的操作
 */
rh.vi.cardView.prototype._beforeForm = function() {
    //根据条件处理渲染前byId先执行
    this._beforeByIdData = this._byIdData();
};
/*
 * byId方法
 */
rh.vi.cardView.prototype._byIdData = function() {
    //根据条件处理渲染前byId先执行
    var data = {};
    if (this._actVar == UIConst.ACT_CARD_MODIFY) {//修改
        var replaceUrl = this._replaceUrl;
        if (replaceUrl.length > 0) {//替换的业务数据获取
            var temp = replaceUrl.split("data=");
            if (temp.length > 0) {
                this.urlExtendParams = StrToJson(temp[1]);//进入卡片的替换url的扩展参数
            }
            data = FireFly.byIdParam(replaceUrl);
        } else {
            data = FireFly.byId(this.servId,this._pkCode,this.slimParams());
        }
    } else if (this._actVar == UIConst.ACT_CARD_ADD) {
        data = FireFly.byId(this.servId, null, this.slimParams());
    }
    return data;
};
/*
 * 保存之前执行,业务代码可覆盖此方法
 */
rh.vi.cardView.prototype._fillFormData = function() {
    var _self = this;
    var pkKey = UIConst.PK_KEY;
    if (this._actVar == UIConst.ACT_CARD_MODIFY) {//修改
        var data = this._beforeByIdData || this._byIdData();
        data[UIConst.CARD_STATUS] = "";
        _self.byIdData = data;
		_self.formatData();
        _self.form.afterRender();
        _self.form.fillData(data);
        _self._lastData = data;
    } else if (this._actVar == UIConst.ACT_CARD_ADD) {//添加
        if (_self._copyNewFlag && _self._copyNewFlag == true) {//保存复制
            _self.form.fillDefault();
            var tempData = _self._lastData;
            delete tempData[pkKey];
            var byIdDefaults = this._byIdData();
            if (byIdDefaults) {
                tempData[_self.servKeys] = byIdDefaults[_self.servKeys];
                tempData[pkKey] = byIdDefaults[pkKey];
                tempData["S_MTIME"] = byIdDefaults["S_MTIME"];
                _self.byIdData = tempData;
				_self.formatData();
                _self.form.afterRender();
                _self.form.fillData(tempData);
                _self.cardBarTip("已新复制，请修改后保存生效！");
            }
        } else {
            //获取主键信息返回值并赋值
            var byIdDefaults = this._byIdData();
            if (byIdDefaults) {
                _self.byIdData = byIdDefaults;
				_self.formatData();
                _self.form.afterRender();
                _self.form.setValues(byIdDefaults);
                _self.form.fillDefault(byIdDefaults);//将后台传递给的默认值存储到form中
                //如果显示，则不自动填充生成的主键
//           	    if (_self.form.getItem(this.servKeys)) {
//           	    	var str = _self.form.getItem(this.servKeys).obj.css("display");
//           	    	if ((str == "block") || (str == "inline-block")) {
//           	    		_self.form.getItem(this.servKeys).setValue("");
//           	    	}
//           	    }
            }
            //关联参数
            if (_self.links) {
                var links = _self.links;
                links = jQuery.extend(links,this._transferData);
                _self.form.setValues(links);
            }
            _self.byIdData = _self.form.getDefaults();
        }
        _self.byIdData[pkKey] = "";
    }
};
/*
 * 保存意见方法
 */
rh.vi.cardView.prototype.saveMind = function() {
};
/*
 * 保存之前执行,业务代码可覆盖此方法
 */
rh.vi.cardView.prototype.beforeSave = function() {
};
/*
 * 保存之后执行,业务代码可覆盖此方法
 */
rh.vi.cardView.prototype.afterSave = function(resultData) {
};
/*
 * 获取修改的页面数据
 */
rh.vi.cardView.prototype.getChangeData = function() {
    var changeData = "";
    if (this._actVar == UIConst.ACT_CARD_ADD && (this._copyNewFlag && this._copyNewFlag == true)) {//复制过来的话
        changeData = this.form.getItemsValues();
    } else {
        changeData = this.form.getChangedItems();//获取页面修改的字段值集合对象
    }
    if ((changeData["USER_PASSWORD"] == "")) {
        delete changeData["USER_PASSWORD"];
    }
    if (this.extendSubmitData) {//扩展的参数传递到后台
        changeData = jQuery.extend(changeData,this.extendSubmitData);
    }
    return changeData;
};
/*
 * 设置扩展提交参数
 */
rh.vi.cardView.prototype.setExtendSubmitData = function(data) {
    this.extendSubmitData = data;
};
/*
 * 获取修改的页面数据和pkcode
 */
rh.vi.cardView.prototype.getChangeDataAndPK = function() {
    var changeData = this.getChangeData();
    changeData[UIConst.PK_KEY] = this._pkCode;
    return changeData;
};
/*
 * 保存form修改的数据
 */
rh.vi.cardView.prototype._saveForm = function() {
    var _self = this;
    //保存之前的监听方法beforeSave()
    if (_self.beforeSave() == false) {
        return false;
    };
    //保存意见方法
    if (_self.saveMind() == false) {
        return false;
    }
    var changeData = this.getChangeData();
    if (jQuery.isEmptyObject(changeData)) {
        _self.cardBarTipError("没有修改数据，未做提交！");
        return false;
    } else { // 有修改才做校验
        if(!this.form.validate()) {
            _self.cardBarTipError("校验未通过");
            return false;
        }
    }
    if (this._actVar == UIConst.ACT_CARD_MODIFY) {//修改
        _self.modifySave(changeData);
    } else if (this._actVar == UIConst.ACT_CARD_ADD) {//添加
        changeData["_ADD_"] = true;//增加标志
        changeData[UIConst.PK_KEY] = _self.byIdData[this.servKeys];//增加主键
        changeData[this.servKeys] = _self.getItem(this.servKeys).getValue();
        _self.addSave(changeData);
    }
    return true;
};
/*
 * 添加保存
 */
rh.vi.cardView.prototype.addSave = function(changeData,afterReload) {
    var _self = this;
    var resultData = FireFly.cardAdd(_self.opts.sId,changeData);
    _self.afterSave(resultData);//保存后监听方法
    if (resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
        _self._pkCode = resultData[_self.servKeys];
        _self._actVar = UIConst.ACT_CARD_MODIFY;
        _self._parentRefreshFlag = true;
        _self._copyNewFlag = false;//复制新建成功后的状态
        if (afterReload == false) {
        } else {
            _self.refresh();
        }
    }
};
/*
 * 修改保存
 */
rh.vi.cardView.prototype.modifySave = function(changeData,afterReload) {
    var _self = this;
    changeData[UIConst.PK_KEY] = this._pkCode;
    if (_self.itemValue("S_MTIME")) {
        changeData["S_MTIME"] = _self.itemValue("S_MTIME");
    }
    var resultData = FireFly.cardModify(_self.opts.sId,changeData);
    _self.afterSave(resultData);//保存后监听方法
    if (resultData[UIConst.RTN_MSG] && resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
        _self._pkCode = resultData[_self.servKeys];
        _self._parentRefreshFlag = true;
        _self._lastData = resultData;
        if (afterReload == false) {
        } else {
            _self.refresh();
        }
    }
};
/*
 * 对外公布的保存form方法
 */
rh.vi.cardView.prototype.saveForm = function() {
    return this._saveForm();
};
/*
 * 构造 评论页面
 */
rh.vi.cardView.prototype._bldCardComment = function() {
    var _self = this;
    var commentContainer = null;
    var commentGroup = this.form.getGroup(null, UIConst.FITEM_ELEMENT_COMMENT);
    if (commentGroup) {// 找评论输入类型的字段项
        this._cardCommentObj = commentGroup;
        commentContainer = commentGroup.find(".formContent").first();
        var width = this.form.getItemWidth(this.form.cols, this.form.cols);

        //渲染评论
        var opts = {"cardObj":this, "pCon":commentContainer ,"DATA_ID": _self._pkCode, "SERV_ID":_self.servId, "width":width};
        this._comment= new rh.vi.comment(opts);
        this._comment.show();
    } /*else {// 没找到则构造一个分组框
     var fieldSet = new rh.ui.FieldSet({"formContainerId":"commentFormConent","legendName":"评论"});
     this._cardCommentObj = fieldSet.obj.appendTo(_self.formCon);
     commentContainer = fieldSet.formContent;
     }*/
};

/*
 * 隐藏指定ID的分组
 * @param id 分组框ITEM_CODE
 */
rh.vi.cardView.prototype.hideGroup = function(id) {
    jQuery("#" + this.servId + "-mainTab").find("#" + id).hide();
    this._resetHeiWid();
};
/*
 * 显示指定ID的分组
 * @param id 分组框ITEM_CODE
 */
rh.vi.cardView.prototype.showGroup = function(id) {
    jQuery("#" + this.servId + "-mainTab").find("#" + id).show();
    this._resetHeiWid();
};
/*
 * 展开指定ID的分组框
 * @param id 分组框ITEM_CODE
 */
rh.vi.cardView.prototype.expandGroup = function(id){
    var obj = jQuery("#" + this.servId + "-mainTab").find("#" + id);
    if (obj.find(".legend").find(".icon-card-open").length > 0) {
        obj.find(".legend").click();
        this._resetHeiWid();
    }
};

/*
 * 收缩指定ID的分组框
 * @param id 分组框ITEM_CODE
 */
rh.vi.cardView.prototype.collapseGroup = function(id){
    var obj = jQuery("#" + this.servId + "-mainTab").find("#" + id);
    if (obj.find(".legend").find(".icon-card-close").length > 0) {
        obj.find(".legend").click();
        this._resetHeiWid();
    }
};
/*
 * 供外部调用，自动设置jsp的高度
 */
rh.vi.cardView.prototype.autoIncludeFrame = function() {
    var _self = this;
    var iframeObj = document.getElementById(this.opts.sId + "-includeJSP");
    var docHei = iframeObj.Document.body.scrollHeight;
    document.getElementById(this.opts.sId + "-includeJSP").style.height = docHei + "px";
    this._resetHeiWid();
};
/*
 * 构造自定义JSP
 */
rh.vi.cardView.prototype._bldIncludeJSP = function() {
    var _self = this;
    var url = FireFly.getContextPath() + Tools.itemVarReplace(this._jsp,_self.byIdData);
    this._jspObj = jQuery("<iframe border='0' frameborder='0'></iframe>").attr("id",this.opts.sId + "-includeJSP").attr("width","100%")
        .attr("height",500).attr("src",url).appendTo(this.formCon);
    frames[this.opts.sId + "-includeJSP"]._parentViewer = this;
};
/*
 * 重置当前页面的高度(对外方法)
 */
rh.vi.cardView.prototype.resetSize = function() {
    this._resetHeiWid();
};
/*
 * 重置当前卡片页面的高度，初始化时
 * @bottomHei：列表高度-系统默认列表高度。（当主单下列表的tab切换时调用）
 */
rh.vi.cardView.prototype._resetHeiWid = function(bottomHei) {
    var _self = this;
    if (this.miniCard) {//有替换的宽高度
        return true;
    }
    if ((this.opts.reset == false) || (this.opts.reset == "false")) { //参数设定不重置外层高度
        return false;
    }
    jQuery(document).ready(function() {
        var tempH = _self.tabs.height();//tabs+form主数据区
        var display = _self.tabs.css("display");
        if (tempH > 0) {//正常显示时预存高度，解决从另外tab刷新当前卡片时取不到高度问题
            _self.tabs.data("visibleHeight",tempH);
        } else {//取不到高度时用预设高度
            tempH = _self.tabs.data("visibleHeight")?_self.tabs.data("visibleHeight"):0;
        }
        if (bottomHei) {//有高度差时
            tempH = _self.formCon.height() + bottomHei + 85 + _self.headMsgBar.prop("offsetHeight"); //form+按钮条+标签条+提示信息栏
        }
        if ((_self._cardIn == true) && (_self.opts.bottomTabFlag == true)) {
            _self._height = _self.tabs.height() + 65;//单条记录进卡片时预存到tab点击时缓存高度
            _self.opts.parHandler._resetHeiWid();
            return false;
        }
      //关联card在右侧显示
    	if (_self._cardIn == true){
    		tempH = tempH + 35;
    		_self._height = _self.tabs.height() + 35;
    	}
        _self._MainHeight = tempH;
        var _default = GLOBAL.getDefaultFrameHei();
        if (tempH < _default) {//当前高度小于默认值
            _self.winDialog.height(_default - 20);
            Tab.setFrameHei(_default);
        } else {
            _self.winDialog.height(tempH);
            Tab.setFrameHei(tempH+20);
        }
    });
};
/*
 * 主单标签切换tab页时高度的自动变化控制
 */
rh.vi.cardView.prototype._changeTabHeiWid = function(hei) {
    if (this.miniCard) {//有替换的宽高度
        return;
    }
    var _self = this;
    var allHei = hei;//内容高度+tab条
    var _default = GLOBAL.getDefaultFrameHei();
    if (allHei < _default) {//当前高度小于默认值
        _self.winDialog.height(_default - 20);
        Tab.setFrameHei(_default);
    } else {
        _self.winDialog.height(allHei);
        Tab.setFrameHei(allHei+20);
    }
};
/*
 * 主单下列表标签才调用
 */
rh.vi.cardView.prototype._changeBottomTabHeiWid = function(hei) {
    var _self = this;
    this._resetHeiWid(hei);
};
/*
 * 提示信息的临时存储
 */
rh.vi.cardView.prototype._tipStore = function() {
    if (jQuery(".rh-barTip",this.winDialog).size() == 1) {//有窗口的情况
        this.tempTip = jQuery(".rh-barTip",this.winDialog);
    } else if (jQuery(".rh-barTip",this._pCon).size() == 1) {//有外层容器情况
        this.tempTip = jQuery(".rh-barTip",this._pCon);
    } else {
        this.tempTip = null;
    }
};
/*
 * 把临时存储的提示信息的显示
 */
rh.vi.cardView.prototype._tipShow = function() {
    if (this.tempTip) {
        this.tempTip.appendTo(this.getNowDom());
    } else {
        Tip.clearLoad();
    }
};
/*
 * 刷新卡片页面
 */
rh.vi.cardView.prototype.refresh = function() {
    this.destroyUI();
    this._tipStore();
    if (this._cardIn == true) {//单条记录进卡片
        this._pCon.empty();
    } else {
        this.winDialog.empty();
        this.winDialog.remove();
    }
    this.show();
};
/*
 * 获取按钮对象
 */
rh.vi.cardView.prototype.getBtn = function(actCode) {
    var _self = this;
    if (this.btns[actCode]) {
        return this.btns[actCode];
    } else {
        return jQuery();
    }
};
/**
 * 修改指定按钮的名称
 * @param actCode 按钮的ID
 * @text text 按钮的新名称
 */
rh.vi.cardView.prototype.setBtnText = function(actCode,text){
    this.getBtn(actCode).find("span.rh-icon-inner").html(text);
};
/*
 * 获取字段 中 的 配置
 * @param itemCode 字段编码
 */
rh.vi.cardView.prototype.getItemConfig = function(itemCode) {
    var _self = this;
    var itemConfig = _self._data.ITEMS[itemCode].ITEM_INPUT_CONFIG;
    return itemConfig;
};
/*
 * 获取字段对象的方法
 * @param itemCode 字段编码
 */
rh.vi.cardView.prototype.getItem = function(itemCode) {
    var _self = this;
    var item = this.form.getItem(itemCode);
    return item;
};
/*
 * 获取卡片单个字段值的方法，返回当前值
 * @param codes 字段编号
 * @param values 编号对应的赋值的值，暂未实现
 */
rh.vi.cardView.prototype.itemValue = function(code, value) {
    var _self = this;
    if (this.form.getItem(code) == null) {
        return null;
    }
    var value = this.form.getItem(code).getValue();
    return value;
};
/*
 * 获取卡片字段值集合的方法，返回json对象
 * @param codes 字段编号，多个以逗号分隔
 * @param values 编号对应的赋值的值，暂未实现
 */
rh.vi.cardView.prototype.itemValues = function(codes, values) {
    var _self = this;
    var strs = codes ? codes.split(",") : [];
    var res = {};
    if (strs.length == 0) {
        res = _self.form.getItemsValues();
    } else {
        for (var i = 0; i < strs.length; i++) {
            var code = strs[i];
            res[code] = _self.form.getItem(code).getValue();
        }
    }
    return res;
};
/*
 * 卡片加载后执行工程级js方法
 */
rh.vi.cardView.prototype._excuteProjectJS = function() {
    var _self = this;
    var loadArray = this._data.SERV_CARD_LOAD_NAMES.split(",");
    for (var i = 0;i < loadArray.length;i++) {
        if (loadArray[i] == "") {
            return;
        }
        load(loadArray[i]);
    }
    function load(value) {
        var pathFolder = value.toString().split("_");
        var lowerFolder = pathFolder[0].toLowerCase();
        var jsFileUrl = FireFly.getContextPath() + "/" + lowerFolder + "/servjs/" + value + "_card.js";
        jQuery.ajax({
            url: jsFileUrl,
            type: "GET",
            dataType: "text",
            async: false,
            data: {},
            success: function(data){
                try {
                    var servExt = new Function(data);
                    servExt.apply(_self);
                } catch(e){
                    alert("卡片页面js加载错误");
                }
            },
            error: function(){;}
        });
    };
};
/*
 * 解析操作表达式
 */
rh.vi.cardView.prototype._excuteActExp = function(tmpExp) {
    var _self = this;
    tmpExp = Tools.itemVarReplace(tmpExp,_self.byIdData);//替换字段级变量
    tmpExp = Tools.systemVarReplace(tmpExp);//替换系统变量
    tmpExp = Tools.itemVarReplace(tmpExp,_self.links);//关联定义的变量替换
    tmpExp = tmpExp.replace(/undefined/g,'').replace(/\n/g,'');//替换无效字符
    //表达式是否为true
    var actExp = eval(tmpExp);
    return actExp;
};
/*
 * 系统变量和字段级变量的替换
 */
rh.vi.cardView.prototype._replaceVars = function(str) {
    var _self = this;
    str = Tools.itemVarReplace(str,_self.byIdData);//替换字段级变量
    str = Tools.systemVarReplace(str);//替换系统变量
    str = Tools.itemVarReplace(str,_self.links);//关联定义的变量替换
    return str;
};
/*
 * 给卡片增加红头文字,如：单据  或 单据,color:blue;font-size:20px;__NEW
 */
rh.vi.cardView.prototype.addRedHead = function(textAndStyle) {
    if ((textAndStyle.length > 0) && (this._data.SERV_CARD_TMPL == 2)) {
        var redHeadObj = jQuery.parseJSON(textAndStyle);
        var title = redHeadObj["title"] || "";
        var arr = title.split(",");
        var text = arr[0];
        var style = arr[1];
        jQuery(".redHeader", this.winDialog).remove();
        jQuery("<div class='redHeader-container'><div class='redHeader' style='" + (style ? style : "") + "'>" + text + "</div></div>")
//		.insertBefore(this.formCon);
            .prependTo(this.formCon.find(".item").first());
    }
};
/*
 * 让当前页面处于屏蔽状态
 */
rh.vi.cardView.prototype.shield = function() {
    this.loadBar = new rh.ui.loadbar();
    this.loadBar.show();
};
/*
 * 让当前页面取消屏蔽状态
 */
rh.vi.cardView.prototype.shieldHide = function() {
    this.loadBar.hide();
};
/*
 * 加载的提示信息
 * @param msg 消息
 */
rh.vi.cardView.prototype.cardBarTipLoad = function(msg) {
    Tip.showLoad(msg,true,null,null,this.getNowDom());
};
/*
 * 成功的提示信息
 * @param msg 提示内容
 */
rh.vi.cardView.prototype.cardBarTip = function(msg) {
    Tip.show(msg,true,this.getNowDom());
};
/*
 * 错误的提示信息
 * @param msg 提示内容
 */
rh.vi.cardView.prototype.cardBarTipError = function(msg) {
    Tip.showError(msg,true,this.getNowDom());
};
/*
 * 清除加载提示信息
 */
rh.vi.cardView.prototype.cardClearTipLoad = function() {
    Tip.clearLoad();
};
/*
 * 区分列表还是卡片
 */
rh.vi.cardView.prototype.getNowDom = function() {
    var _self = this;
    return this.btnBar;
};
/*
 * 获取当前主键值
 */
rh.vi.cardView.prototype.getPKCode = function() {
    return this._pkCode;
};
/*
 * 获取父句柄
 */
rh.vi.cardView.prototype.getParHandler = function() {
    return this._parHandler;
};
/*
 * 设置卡片只读
 */
rh.vi.cardView.prototype.readCard = function() {
    var _self = this;
    this._readOnly = true;
    //按钮的只读
    _self._readBtns();
    //设置form的只读
    _self.form.disabledAll();
    // 设置意见只读
    if (_self.mind) {
        _self.mind.setMindDisabed();
    }
};
/*
 * 设置只读变量
 */
rh.vi.cardView.prototype.setReadOnlyVar = function(value) {
    this._readOnly = value;
};
/*
 * 获取当前表单只读值
 */
rh.vi.cardView.prototype.getReadOnlyVar = function() {
    return this._readOnly;
};
/*
 * 设置子tab的隐藏
 */
rh.vi.cardView.prototype.tabHide = function(sid) {
    var _self = this;
    var topObj = jQuery("li.rhCard-tabs-topLi[sid='" + sid + "']",_self.tabs);
    var bottomObj = jQuery("li.rhCard-tabs-bottomLi[sid='" + sid + "']",_self._bottomTabs);
    if (topObj.length == 1) {//头部关联
        var index = jQuery(".rhCard-tabs-topLi",_self.tabs).index(topObj);
        index++;
        _self.tabs.tabs("remove", index);
    } else if (bottomObj.length == 1) {//底部关联，暂不处理底部只一个的关联
        var index = bottomObj.index();
        var bottomObjNext = bottomObj.next("li.rhCard-tabs-bottomLi");
        _self._bottomTabs.tabs("remove", index);
        bottomObjNext.find("a").click();
    }
};
/*
 * 设置子tab的只读与否。readOnlyFlag为true时，设置为只读；readOnlyFlag为false时，非只读
 * @param sid 要设置的子tab的服务id
 * @param readOnlyFlag 设置为只读与否
 */
rh.vi.cardView.prototype.tabReadOnly = function(sid, readOnlyFlag) {
	if(jQuery.isEmptyObject(sid))  return;
	if(!this.tabReadOnlyArray){
		this.tabReadOnlyArray = {};
	}
	this.tabReadOnlyArray[sid + "_READONLY"] = readOnlyFlag;
};
/*
 * 设置子tab的显示
 */
rh.vi.cardView.prototype.tabFocus = function(sid) {
    var _self = this;
    setTimeout(function() {
        var topObj = jQuery("li.rhCard-tabs-topLi[sid='" + sid + "']",_self.tabs);
        var bottomObj = jQuery();
        var bottomObj = jQuery("li.rhCard-tabs-bottomLi[sid='" + sid + "']",_self._bottomTabs);
        if (topObj.length == 1) {//头部关联
            topObj.find("a").click();
        } else if (bottomObj.length == 1) {//底部关联，暂不处理底部只一个的关联
            bottomObj.find("a").click();
        }
    },500);
};
/*
 * 增加卡片页面的和工作流相关提示信息
 */
rh.vi.cardView.prototype.headMsg = function(msg) {
    this.headMsgBar.show().html(msg);
    return this.headMsgBar;
};
/*
 * 重置replaceUrl方法
 */
rh.vi.cardView.prototype.resetReplaceUrl = function(url) {
    if (this._replaceUrl.length > 0) {
        this._replaceUrl = url;
    }
};
/*
 * 获取参数对象，过滤掉含有句柄对象的结果
 */
rh.vi.cardView.prototype.slimParams = function() {
    var params = {};
    if (!jQuery.isEmptyObject(this.params)) {
        jQuery.each(this.params,function(i,n) {
            if (i == "handler" || i == "viewer" || i == "callBackHandler" || i == "closeCallBackFunc"
                || i == "handlerRefresh" || i.indexOf("Handler") > 0) {
            } else {
                params[i] = n;
            }
        });
    }
    return params;
};
/*
 * 获取外层参数对象
 */
rh.vi.cardView.prototype.getParams = function() {
    return this.params;
};
/*
 * 设置点击返回时刷新父列表页面
 */
rh.vi.cardView.prototype.setParentRefresh = function() {
    return this._parentRefreshFlag = true;
};
/**
 * 取得意见(自定义)字段
 */
rh.vi.cardView.prototype.getMindItem = function(){
    return this.form.getMindItem();
};
/**
 * 取得SERV_SRC_ID的值
 */
rh.vi.cardView.prototype.getServSrcId = function(){
    var result = this._data.SERV_SRC_ID;
    return result || "";
};
/**
 * 获取当前卡片的编辑状态
 */
rh.vi.cardView.prototype.getStatus = function(){
    var result = this.byIdData._ADD_;
    if (result === "true") {
        result = UIConst.ACT_CARD_ADD;
    } else {
        result = UIConst.ACT_CARD_MODIFY;
    }
    return result;
};
/*
 * 销毁所有UI组件
 */
rh.vi.cardView.prototype.destroyUI = function() {
    var _self = this;
    // 释放组件的资源
    if (_self.form) {
        _self.form.destroy();
        _self.form = null;
    }
    // 释放意见组件
    if (_self.wfCard && _self.wfCard.mind) {
        _self.wfCard.mind.destroy();
        _self.wfCard = null;
    }
    // 销毁评论UEditor
    if (_self._comment) {
        _self._comment.destroy();
    }
	// 清除关联功能的iframe内容
	jQuery(".rhCard-tabsIframe").each(function(i,n) {
		var id = jQuery(n).attr("id");
		_self.destroyIframe(id);
	});
    //清除相关引用、清除页面dom
    if (document.getElementById(_self.dialogId)) {
        if (this.extendDestroy() != false) {
			jQuery("#" + _self.dialogId).empty();
		}
    }
};

/*
 * 销毁iframe的方法
 */
rh.vi.cardView.prototype.destroyIframe = function(id) {
    var el = document.getElementById(id);
    var iframe = el.contentWindow;
    if(el){
        el.src = 'about:blank';
        try{
            iframe.document.write('');
            iframe.document.clear();
        }catch(e){};
        //以上可以清除大部分的内存和文档节点记录数了
        //最后删除掉这个 iframe 就哦咧。
        //document.body.removeChild(el);
    }
};
/**
 * 可扩展销毁方法
 */
rh.vi.cardView.prototype.extendDestroy = function() {
};
/**
 * 清除相关引用、清除页面dom,暂测试使用
 */
rh.vi.cardView.prototype.destroyObject = function() {
    var _self = this;
    this.form.destroyObject();
    this.form = null;
    this.wfCard = null;
//	this.winDialog.find("iframe").empty();
//	this.winDialog.find("iframe").remove();
//	jQuery(".rhGrid-btnBar-a").unbind();
//	jQuery(".rhCard-tabs-li").unbind();
    document.getElementById(_self.dialogId).innerHTML = "";
};

/**
 * 隐藏iframe中所有的Object对象
 */
rh.vi.cardView.prototype._hideIframeObject = function(iframeObj){
    var _self = this;
    var result = false;
    iframeObj.contents().find("object").each(function(){
        jQuery(this).css({"visibility":"hidden"}).addClass("_sys_auto_hide");
        result = true;
    });

    iframeObj.contents().find("iframe").each(function(){
        result = result?result:_self._hideIframeObject(jQuery(this));
    });

    return result;
};
/**
 * 查找被选中的TabPanel
 */
rh.vi.cardView.prototype._getSelectedTabPanel = function(){
    var _self = this;
    var tabIndex = jQuery("#" + _self.tabsId).tabs('option', 'selected');
    var tabPanel = jQuery(jQuery("#" + _self.tabsId).tabs().data("tabs").panels[tabIndex]);
    return tabPanel;
};
/**
 * 隐藏页面中所有的Object对象
 */
rh.vi.cardView.prototype.hideControlObj = function(){
    var _self = this;
    var result = false;

    var hideTabPanel = _self._getSelectedTabPanel(); //需要隐藏控件的TabPanel
    jQuery(hideTabPanel).find("object").each(function(){
        jQuery(this).css("visibility","hidden").addClass("_sys_auto_hide");
        result = true;
    });

    jQuery(hideTabPanel).find("iframe").each(function(){
        result = result? result : _self._hideIframeObject(jQuery(this));
    });

    return result;
};
/**
 * 显示指定tab中被隐藏的控件对象
 */
rh.vi.cardView.prototype.displayControlObj = function(tabObj){
    var _self = this;
    tabObj = tabObj? tabObj : _self._getSelectedTabPanel(); //需要隐藏控件的TabPanel

    tabObj.find("object").each(function(){
        var jqueryObj = jQuery(this);
        if(jqueryObj.hasClass("_sys_auto_hide")){
            jqueryObj.css("visibility","visible").removeClass("_sys_auto_hide");
        }
    });

    tabObj.find("iframe").each(function(){
        _self._displayIframeObject(jQuery(this));
    });
};
/**
 * 显示指定Iframe中被隐藏的Object对象
 */
rh.vi.cardView.prototype._displayIframeObject = function(iframeObj){
    var _self = this;
    iframeObj.contents().find("object").each(function(){
        var jqueryObj = jQuery(this);
        if(jqueryObj.hasClass("_sys_auto_hide")){
            jqueryObj.css({"visibility":"visible"}).removeClass("_sys_auto_hide");
        }
    });

    iframeObj.contents().find("iframe").each(function(){
        _self._displayIframeObject(jQuery(this));
    });
};
/**
 * 单独打开卡片页面时按钮条的固定问题
 */
rh.vi.cardView.prototype._btnBarFixed = function(iframeObj){
    var _self = this;
    if ((this._cardIn != true) && (this.miniCard == false)) {//非单条记录进卡片，非小卡片
        if (window.self == window.top) {//顶层页面自动关闭
            //tabs的fixed处理
            jQuery(window).scroll(function() {
                var top = document.documentElement.scrollTop + document.body.scrollTop;
                if (top < 45) {
                    Tab.btnBarRevert(true);
                } else {
                    Tab.btnBarFixed(null,null,true);
                }
            });
        }
    }
};
/**
 * 关联服务打开卡片后返回设置主卡片的按钮固定
 */
rh.vi.cardView.prototype._preBtnBarFixed = function(){
    var _self = this;
    var visibleCard = jQuery(".cardDialog");
    visibleCard.find(".rhCard-btnBar--instead").hide();
    visibleCard.find(".rhCard-btnBar").css({
        "position" : "relative",
        "top" : "auto",
        "z-index" : "1"
    });
};
/**
 * 关联服务打开卡片后返回按钮设定
 */
rh.vi.cardView.prototype._btnBarBackBtn = function(){
    if (System.getVar("@C_SY_PJ_BACKBTN@") == "true") {//顶层页面自动关闭
        var actCode = "back";
        var temp = jQuery("<a></a>").addClass("rh-icon").addClass("rhGrid-btnBar-a");
        temp.attr("id",GLOBAL.getUnId(actCode,this.servId));
        temp.attr("actcode","back");
        temp.attr("title","返回");
        this._act(actCode,temp);
        var labelName = jQuery("<span></span>").addClass("rh-icon-inner").text("返回");
        temp.append(labelName);
        var icon = jQuery("<span></span>").addClass("rh-icon-img").addClass("btn-back");
        temp.append(icon);
        this.btnBar.append(temp);
    } else {
        if (this.backA) {
            this.backA.parent().show();
        }
    }
};
/**
 * 设置点击是否刷新主卡片
 * @param servId 服务ID
 * @param bool 布尔值
 */
rh.vi.cardView.prototype.setRefreshFlag = function(servId, bool) {
    this._tabRefreshFlag[servId] = bool;
};
/**
 * 	获取点击是否刷新主卡片
 * @param servId 服务ID
 */
rh.vi.cardView.prototype.getRefreshFlag = function(servId) {
    return this._tabRefreshFlag[servId];
};

/**
 * 获取卡片title
 * @return 返回title信息
 */
rh.vi.cardView.prototype.getTitle = function() {
    return this._title;
};

/**
 * 重置卡片title
 * @param title 重置卡片显示
 */
rh.vi.cardView.prototype.setTitle = function(title) {
    this.titleObj.html(title);
};

/**
 * 计算两个对象中数值的乘积，返回计算结果。比如单价和数量，返回结果为总价。保留两位小数
 * @param {Object} firstObj 第一个jQuery对象
 * @param {Object} lastObj 第二个jQuery对象
 * @param {Object} retObj 获取最终结果的jQuery对象，比如总价
 */
rh.vi.cardView.prototype.count4TwoObj = function(firstObj, lastObj, retObj){
    firstObj.unbind("blur").bind("blur", function () {
        var firstVal = firstObj.val() || 0;
        var lastVal = lastObj.val() || 0;
        retObj.val(parseFloat(firstVal * lastVal).toFixed(2));
    });
    lastObj.unbind("blur").bind("blur", function () {
        var first_Val = firstObj.val() || 0;
        var last_Val = lastObj.val() || 0;
        retObj.val(parseFloat(first_Val * last_Val).toFixed(2));
    });
}