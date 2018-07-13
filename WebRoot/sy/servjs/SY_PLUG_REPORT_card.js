var _viewer = this;

//预览按钮事件绑定
_viewer.getBtn('preView').unbind("click").bind("click", function(event) {
    var pk = _viewer.getItem('SERV_ID').obj.val();
    Tab.open({
                'url' : pk + '.show.do',
                'sId' : pk,
                'tTitle' : _viewer.getItem('SERV_NAME').obj.val(),
                //该值用来与按钮的规则配合使用，从而确定按钮是否显示
                'params' : {'links':{'BUTTON_DISPLAY_FLAG':'1'}},
                'menuFlag' : 3
            });
    event.stopPropagation();
    return false;
});