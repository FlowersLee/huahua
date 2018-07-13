_viewer = this;
/**
 * 对时间进行判断
 */
_viewer.beforeSave = function(){
	comDatetime();
}
//日期字段的变更时给于提示
_viewer.getItem("CAL_START_DATE").change(function(){
	comDatetime();
});
_viewer.getItem("CAL_START_TIME").change(function(){
	comDatetime();
});
_viewer.getItem("CAL_END_DATE").change(function(){
	comDatetime();
});
_viewer.getItem("CAL_END_TIME").change(function(){
	comDatetime();
});

  function comDatetime(){
  	var startDateTime = _viewer.getItem("CAL_START_DATE").getValue()+" "
	+ _viewer.getItem("CAL_START_TIME").getValue();
	var endDateTime = _viewer.getItem("CAL_END_DATE").getValue()+" "
	+ _viewer.getItem("CAL_END_TIME").getValue();
	var diff = rhDate.doDateDiff('S',startDateTime,endDateTime,'1');
	if (diff < 0) {
	alert("任务开始时间不能大于结束时间！");
	return false;
	}
  }