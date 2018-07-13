/** 服务卡片使用的js方法定义：开始 */
var _viewer = this;
_viewer._parentRefreshFlag = true;

if (this.opts.act == UIConst.ACT_CARD_MODIFY) {
	_viewer.getItem("JOB_CODE").disabled();

} else if (this.opts.act == UIConst.ACT_CARD_ADD) {
	_viewer.getItem("JOB_STATE").hide();
}

var cmpyStatus = _viewer.getItem('JOB_CMPYS_STATUS').getValue();
if (3 == cmpyStatus) {
	_viewer.getItem("JOB_CMPYS").enabled();
} else {
	_viewer.getItem("JOB_CMPYS").disabled();
}

_viewer.getItem('JOB_CMPYS_STATUS').obj.unbind("click").bind("click", function() {
	cmpyStatus = _viewer.getItem('JOB_CMPYS_STATUS').getValue();
	if (3 == cmpyStatus) {
		_viewer.getItem("JOB_CMPYS").enabled();
	} else {
		_viewer.getItem("JOB_CMPYS").disabled();
	}
});

// span.unbind("click").bind("click", function() {
// selectDept(n.id,deptCode.text());
// });

if (_viewer.params) {
	var JOB_CODE = _viewer.params.JOB_CODE;
	var JOB_CLASS_NAME = _viewer.params.JOB_CLASS_NAME;
	var JOB_DATA = _viewer.params.JOB_DATA;

	if (JOB_CODE) {
		var jobCode = _viewer.getItem("JOB_CODE");
		jobCode.setValue(JOB_CODE);
		// jobCode.disabled();
	}

	if (JOB_CLASS_NAME) {
		var jobClassName = _viewer.getItem("JOB_CLASS_NAME");
		jobClassName.setValue(JOB_CLASS_NAME);
		// jobClassName.disabled();
	}

	if (JOB_DATA) {
		var jobData = _viewer.getItem("JOB_DATA");
		jobData.setValue(JOB_DATA);
		// jobData.disabled();
	}
}