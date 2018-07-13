/**
 * 左右布局。分别是Tree、Form
 */
$(document).ready(function () {

    // init instance var
    var myLayout = $('body').layout({applyDemoStyles: true, spacing_closed: 30});

    //左区域 树

    var setting = {
        rhexpand: false,
        showcheck: false,
        url: "SY_COMM_INFO.dict.do",
        theme: "bbit-tree-no-lines"
    };
    setting.data = rh_processData("sy/base/frame/plugs/layout/sample/layout/data/entity_structure_data.json");
    var tree = new rh.ui.Tree(setting);
    tree.obj.appendTo(".ui-layout-west");

    //中间区域 form
    var servInfo = FireFly.getCache("SY_SERV", FireFly.servMainData);
    /*
     * 说明*为必须参数
     * pId:*唯一ID,将和字段的编码合并构成每个字段的唯一ID
     * data:*form的定义数据
     */
    var opts = {
        "pId": "formView",
        "data": servInfo
    };

    var form = new rh.ui.Form(opts);
    form.obj.appendTo(".ui-layout-center");
    //组件的渲染
    form.render();
    //如果需要填充业务数据，请执行下面代码。注意字典项需要__NAME的值
    var idData = FireFly.byId("SY_SERV", "SY_ORG_DEPT");
    form.fillData(idData);

});