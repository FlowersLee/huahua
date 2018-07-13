var form = null;
var grid = null;

/**
 *  Tree + Form + Grid。
 *  在Form上添加按钮，点击按钮后，Form的某些元素隐藏。
 */
$(document).ready(function () {

    // init instance var
    var myLayout = $('body').layout({applyDemoStyles: true});

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

    //中间区域 form grid
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
    form = new rh.ui.Form(opts);
    form.obj.appendTo(".ui-layout-center");
    //组件的渲染
    form.render();
    //如果需要填充业务数据，请执行下面代码。注意字典项需要__NAME的值
    var idData = FireFly.byId("SY_SERV", "SY_ORG_DEPT");
    form.fillData(idData);

    //按钮
    var btnBar = jQuery("<div></div>").addClass("rhGrid-btnBar");
    //隐藏/显示元素
    var toggleBtn = createBtn(GLOBAL.getUnId("delete", "SY_SERV"), "delete", "提示信息", "隐藏元素");
    btnBar.append(toggleBtn);
    toggleBtn.bind("click", toggleItem);
    //保存Form数据
    var saveBtn = createBtn(GLOBAL.getUnId("save", "SY_SERV"), "save", "点击保存数据", "保存");
    btnBar.append(saveBtn);
    saveBtn.bind("click", saveForm);

    btnBar.prependTo(".ui-layout-center");

    var data = FireFly.doAct("SY_SERV", "query", false, false);
    var temp = {"id": "SY_SERV", "mainData": servInfo, "byIdFlag": "true", "pCon": $(".ui-layout-center"), "listData": data};
    grid = new rh.ui.grid(temp);
    grid.render();
});


/**
 * 添加按钮
 * @param id 按钮Id
 * @param actcode 方法的ACT_CODE 为了显示图标用的
 * @param title 提示信息
 * @param text 按钮上的文本
 */
function createBtn(id, actcode, title, text){
    var btn = jQuery("<a></a>").addClass("rh-icon").addClass("rhGrid-btnBar-a");
    btn.attr("id", id);
    btn.attr("actcode", actcode);
    btn.attr("title", title);
    var labelName = jQuery("<span></span>").addClass("rh-icon-inner").text(text);
    btn.append(labelName);
    var icon = jQuery("<span></span>").addClass("rh-icon-img").addClass("btn-" + actcode);
    btn.append(icon);

    return btn;
}


/**
 * 隐藏Form中的元素 仅作演示，用来测试布局是否自适应
 */
function toggleItem(event){
    var button = $("#" + event.currentTarget.id);
    if(button.text() == '隐藏元素') {
        form.getItem("SERV_MEMO").hide();
        form.getGroup("SUB_OTHER").hide();
        form.getGroup("SERV_LIST_INFO").hide();

        button.attr("id", GLOBAL.getUnId("add", "SY_SERV"));
        button.attr("actcode", "add");
        button.find("span:first").text("显示元素");
        button.find("span:last").removeClass("btn-delete").addClass("btn-add");

    } else {
        form.getItem("SERV_MEMO").show();
        form.getGroup("SUB_OTHER").show();
        form.getGroup("SERV_LIST_INFO").show();

        button.attr("id", GLOBAL.getUnId("delete", "SY_SERV"));
        button.attr("actcode", "delete");
        button.find("span:first").text("隐藏元素");
        button.find("span:last").removeClass("btn-add").addClass("btn-delete");
    }
}

/**
 * 具体逻辑请参考CardView及Form的方法
 */
function saveForm(){
    alert("请自行实现");
}