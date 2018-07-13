/**
 * 尝试将rh.ui.card.js中的组件直接放在Layout中使用，效果不好。
 * 因为这些组件脱离了Form后，样式都丢失了。因此，不推荐这样使用。
 * 使用时将组件放在Form中使用。
 */
jQuery(document).ready(function () {

    $('body').layout({applyDemoStyles: true});

    //文本框
    var textCt = new rh.ui.Text({
        id: "textCtPk",
        name: "textCtPk",
        width: "200px",
        _default: "",
        isNotNull: false,
        isReadOnly: false,
        //regular : regular,
        //hint : hint,
        fieldType: "STR",
        length: "10",
        itemName:'文本框',
        isHidden: 2
    });

    //下拉框
    var comboxCt = new rh.ui.Select({
        id: "comboxCtPk",
        name: "comboxCtPk",
        _default: "",
        //data : this.dicts[data.DICT_ID],
        item_input_config: "SY_YESNO",
        width: "200px",
        isNotNull: false,
        isReadOnly: false,
        style: "",
        //regular : regular,
        //hint : hint,
        itemName:'下拉框',
        isHidden: 2
    });
    //添加下拉项 TODO:是否能通过item_input_config去自动填充
    comboxCt.addOptionsByDict("SY_YESNO");

    //日期选择
    var dateCt = new rh.ui.Date({
        id: "dateCtPk",
        name: "dateCtPk",
        _default: "",
        width: "200px",
        isNotNull: false,
        isReadOnly: false,
        item_input_config: "",
        isHidden: 2,
        itemName:'日期选择',
        tip: "日期组件"
    });

    var radioCtData = FireFly.getDict("SY_YESNO")[0].CHILD;
    //单选框TODO必须配置tip，否则js脚本错误，代码可以调整
    var radioCt = new rh.ui.Radio({
        id: "radioCtPk",
        name: "radioCtPk",
        _default: "1",
        data: radioCtData,
        width: "200px",
        isNotNull: false,
        isReadOnly: false,
        isHidden: 2,
        itemName:'单选框',
        tip: ""
        //itemCols : data.ITEM_CARD_COLS,
        //cols : cols
    });

    //多选框
    var checkboxCt = new rh.ui.Checkbox({
        id: "checkboxCtPk",
        name: "checkboxCtPk",
        _default: 1,
        data: radioCtData,
        width: "200px",
        isNotNull: false,
        isReadOnly: false,
        itemName:'多选框',
        isHidden: 2
    });

    //字典选择
    var dictChooseCt = new rh.ui.DictChoose({
        id: "dictChooseCtPk",
        name: "dictChooseCtPk",
        _default: "",
        _defaultName: "",
        width: "200px",
        isNotNull: false,
        isReadOnly: false,
        textType: "text",
        //dict : this.dicts[data.DICT_ID],
        item_input_config: "SY_ORG_DEPT",
        item_code: "unit",
        isEdit: 1,
        itemName:'字典选择',
        isHidden: 2
    });

    //查询选择，必须依赖form或编写callback函数，callback函数目前存在问题
    var queryChooseCt = new rh.ui.QueryChoose({
        id: "queryChooseCtPk",
        name: "queryChooseCtPk",
        //_default : data.ITEM_INPUT_DEFAULT,
        width: "200px",
        isNotNull: false,
        isReadOnly: false,
        textType: "text",
        item_input_config: "SY_SERV,{'TARGET':'SERV_PID~~','SOURCE':'SERV_ID~SERV_NAME~SERV_TYPE','EXTWHERE':' and SERV_TYPE=2','TYPE':'multi','SUGGEST':'true'}",
        //formHandler : _self,
        isEdit: 2,
        temName:'查询选择',
        isHidden: 2,
        //
        callback: function (arr) {
            alert(2);
        }
    });

    //选择各组件到页面容器中
    textCt._container.appendTo(".ui-layout-center");

    comboxCt._container.appendTo(".ui-layout-center");
    dateCt._container.appendTo(".ui-layout-center");
    radioCt._container.appendTo(".ui-layout-center");
    checkboxCt._container.appendTo(".ui-layout-center");
    dictChooseCt._container.appendTo(".ui-layout-center");
    queryChooseCt._container.appendTo(".ui-layout-center");
});