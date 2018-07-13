/**
 * 左右布局 左侧为Tree，右侧为Grid。
 * Grid必须实现getPageData方法进行数据刷新。
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

    //中间区域 grid
    var servInfo = FireFly.getCache("SY_SERV", FireFly.servMainData);

    var data = FireFly.doAct("SY_SERV", "query", false, false);
    var temp = {"id": "SY_SERV", "mainData": servInfo, "byIdFlag": "true", "pCon": $(".ui-layout-center"), "listData": data};
    var grid = new rh.ui.grid(temp);
    grid.render();

    //必须
    grid.getPageData = function () {
        return FireFly.getPageData("SY_SERV", {"_PAGE_": grid._lPage});
    }

});