var _viewer = this;
//列表行预览按钮事件绑定
_viewer.grid.getBtn("listPreview").unbind("click").bind("click", function(event) {
	var sId = "SY_COMM_INFO";
    var pk = jQuery(this).attr("rowpk");
    var options = {
        	"id":Tools.rhReplaceId(sId+"-"+pk),
        	"sId":Tools.rhReplaceId(sId),
        	"url":sId+'.chart.do?_PK_='+pk+'&scrollFlag=true',
        	"tTitle":_viewer.grid.getRowItemValue(pk, 'DV_NAME'),
        	"menuFlag" : 3
        };
	Tab.open(options);
    event.stopPropagation();
    return false;
});