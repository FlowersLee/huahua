var _viewer = this;

_viewer.grid.getBtn("listPreview").unbind("click").bind("click", function(event) {
    var pk = jQuery(this).attr("rowpk");
    Tab.open({
                'url' : pk + '.show.do',
                'sId' : pk,
                'tTitle' : _viewer.grid.getRowItemValue(pk, 'SERV_NAME'),
                'menuFlag' : 3
            });
    event.stopPropagation();
    return false;
});