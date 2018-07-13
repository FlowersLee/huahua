var _viewer = this;
//预览按钮事件绑定
_viewer.getBtn('preView').unbind("click").bind("click", function(event) {
	var sId = "SY_COMM_INFO";
    var pk = _viewer.getItem('DV_ID').getValue();
    var options = {
    	"id":Tools.rhReplaceId(sId+"-"+pk),
    	"sId":sId,
    	"url":sId+'.chart.do?_PK_='+pk+'&scrollFlag=true',
    	"tTitle":_viewer.getItem('DV_NAME').getValue(),
    	"menuFlag" : 3
    };
    Tab.open(options);
    event.stopPropagation();
    return false;
});