/**
 * tabLayout，包含3个tab，分别放的是Tree、Form、Grid。
 * Grid必须实现getPageData方法进行数据刷新。
 */
$(document).ready(function () {

    $( "#tabs" ).tabs();

    //Tree
    var setting = {
        rhexpand: false,
        showcheck: false,
        url: "SY_COMM_INFO.dict.do",
        theme: "bbit-tree-no-lines"
    };
    setting.data = rh_processData("sy/base/frame/plugs/layout/sample/layout/data/entity_structure_data.json");
    var tree = new rh.ui.Tree(setting);
    tree.obj.appendTo("#tabs-1");

    //form
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
    form.obj.appendTo("#tabs-2");
    //组件的渲染
    form.render();
    //如果需要填充业务数据，请执行下面代码。注意字典项需要__NAME的值
    var idData = FireFly.byId("SY_SERV", "SY_ORG_DEPT");
    form.fillData(idData);

     //grid
    var data = FireFly.doAct("SY_SERV", "query", false, false);
    var temp = {"id": "SY_SERV", "mainData": servInfo, "byIdFlag": "true", "pCon": $("#tabs-3"), "listData": data};
    var grid = new rh.ui.grid(temp);
    grid.render();

    //必须
    grid.getPageData = function () {
        return FireFly.getPageData("SY_SERV", {"_PAGE_": grid._lPage});
    }
});
