/**
 * 嵌入式布局，共分3层。每一层都使用的是默认样式。
 */
$(document).ready(function () {

    // OUTER-LAYOUT
    $('body').layout({
        applyDemoStyles: true,
        maxSize: 120,

        // MIDDLE-LAYOUT (child of outer-center-pane)
        center__childOptions: {
            applyDemoStyles: true,
            maxSize: 120,

            // INNER-LAYOUT (child of middle-center-pane)
            center__childOptions: {
                applyDemoStyles: true,
                maxSize: 120
            }
        }
    });


    //中间区域card
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
    form.obj.appendTo("#innerCenter");
    //组件的渲染
    form.render();
    //如果需要填充业务数据，请执行下面代码。注意字典项需要__NAME的值
    var idData = FireFly.byId("SY_SERV", "SY_ORG_DEPT");
    form.fillData(idData);

});

