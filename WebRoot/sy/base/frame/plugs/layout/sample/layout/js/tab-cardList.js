/**
 * tabLayout，包含2个tab，其中一个tab内放CardView，另一个tab内放ListView
 */
$(document).ready(function () {
    $( "#tabs" ).tabs();

    //cardView
    var cardOpts = {"act":UIConst.ACT_CARD_ADD,"sId":"SY_COMM_CONFIG","pCon":jQuery("#tabs-1"),"reset":"false","backBtn":"false"};
    var cardView = new rh.vi.cardView(cardOpts);
    cardView.show();
    RHFile.bldDestroyBase(cardView);

    //ListView
    var listOpts = {"sId":"SY_SERV", "pCon": jQuery("#tabs-2"),
        "cardCon":jQuery(".ui-layout-center"),"reset":"false","cardReset":"false","cardBackBtn":"false"};
    var listView = new rh.vi.listView(listOpts);
    listView.show();

});
