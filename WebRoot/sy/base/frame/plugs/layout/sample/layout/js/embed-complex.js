/**
 * 嵌入式布局，共分3层。其中每一层的样式都不同。
 */
$(document).ready(function () {

    // OUTER-LAYOUT
    $('body').layout({
        center__paneSelector: ".outer-center", west__paneSelector: ".outer-west", east__paneSelector: ".outer-east",
        west__size: 125, east__size: 125, spacing_open: 8  // ALL panes
        , spacing_closed: 12 // ALL panes
        //,	north__spacing_open:	0
        //,	south__spacing_open:	0
        , north__maxSize: 200, south__maxSize: 200

        // MIDDLE-LAYOUT (child of outer-center-pane)
        , center__childOptions: {
            center__paneSelector: ".middle-center", west__paneSelector: ".middle-west", east__paneSelector: ".middle-east",
            west__size: 100, east__size: 100, spacing_open: 8  // ALL panes
            , spacing_closed: 12 // ALL panes

            // INNER-LAYOUT (child of middle-center-pane)
            , center__childOptions: {
                center__paneSelector: ".inner-center", west__paneSelector: ".inner-west", east__paneSelector: ".inner-east", west__size: 75, east__size: 75, spacing_open: 8  // ALL panes
                , spacing_closed: 8  // ALL panes
                , west__spacing_closed: 12, east__spacing_closed: 12
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
    form.obj.appendTo(".inner-center");
    //组件的渲染
    form.render();

    //如果需要填充业务数据，请执行下面代码。注意字典项需要__NAME的值
    var idData = FireFly.byId("SY_SERV", "SY_ORG_DEPT");
    form.fillData(idData);

});

