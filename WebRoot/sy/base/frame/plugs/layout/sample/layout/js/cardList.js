/**
 * 左右布局，左侧CardView 右侧ListView
 * 其中CardView设置了最小宽度40%
 */
$(document).ready(function () {

    var servId = "SY_COMM_CONFIG";

    //minSize 设置west、east的最小宽度；north、south最小高度 。形式：数字或百分比 如 400或40%
    //minWidth and minHeight.设定中间区域的最小宽高
    $('body').layout({applyDemoStyles: true, spacing_closed: 30, minSize:"40%"});

    //左侧cardView
    var cardOpts = {"act":UIConst.ACT_CARD_ADD,"sId": servId,"pCon":jQuery(".ui-layout-west"),"reset":"false","backBtn":"false"};
    var cardView = new rh.vi.cardView(cardOpts);
    cardView.show();
    RHFile.bldDestroyBase(cardView);

    //右侧ListView
    var listOpts = {"sId": servId, "pCon": jQuery(".ui-layout-center"),
        "reset":"false","cardReset":"false","cardBackBtn":"false"};
    var listView = new rh.vi.listView(listOpts);
    listView.show();

    /**
     * 去掉默认的_openCardView方法，自己进行实现，因为这里是要将数据显示在左侧的CardView中，而不是新构建CardView.
     */
    listView._openCardView = function(act, pkCode) {
        cardView._actVar = act;
        cardView._pkCode = pkCode;
        var cardData = null;
        if (act == UIConst.ACT_CARD_ADD) {
            cardData = FireFly.byId(servId, null);
        } else {
            cardData = FireFly.byId(servId, pkCode, false, false);
        }
        cardView.form.fillData(cardData);
    };


    //card添加后刷新grid
    cardView.afterSave = function(){
        listView.refresh();
    }

});
