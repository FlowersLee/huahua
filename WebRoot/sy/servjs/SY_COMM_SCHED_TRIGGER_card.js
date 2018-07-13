/** 服务卡片使用的js方法定义：开始 */
var _viewer = this;
_viewer._parentRefreshFlag = true;

if( this.opts.act == UIConst.ACT_CARD_MODIFY) {
_viewer.getItem("TRIGGER_CODE").disabled();
//  _viewer.getItem("JOB_NAME").disabled();

  _viewer.getItem("PREV_FIRE_TIME").show();
    _viewer.getItem("NEXT_FIRE_TIME").show();

} else if ( this.opts.act == UIConst.ACT_CARD_ADD) {
  _viewer.getItem("TRIGGER_STATE").hide();
  _viewer.getItem("S_MTIME").hide();
  
   
    _viewer.getItem("PREV_FIRE_TIME").hide();
    _viewer.getItem("NEXT_FIRE_TIME").hide();
  
 
}
 //alert(_viewer.getItem("TRIGGER_TYPE").obj.parent().html());

	var type = jQuery("input",_viewer.getItem("TRIGGER_TYPE").obj);
	type.bind("click", function(event) {
		var tar = jQuery(event.target);
		if (tar.attr("value") == 1) {
		 showSimple();
		} else {
			  showCrontab();
		}

	});
  if (_viewer.getItem("TRIGGER_TYPE").getValue() == "1"){
 showSimple();
  } else {
  _viewer.getItem("CRONTAB_EXPRESSTION").hide();  
  showCrontab();
  }
  
function showCrontab() {
    _viewer.getItem("SIMPLE_TRIGGER_REPEAT_COUNT").hide();
    _viewer.getItem("SIMPLE_TRIGGER_INTERVAL").hide();  
    _viewer.getItem("CRONTAB_EXPRESSTION").show();  
}  
function showSimple(){
	_viewer.getItem("CRONTAB_EXPRESSTION").hide();  
	  _viewer.getItem("SIMPLE_TRIGGER_REPEAT_COUNT").show();
    _viewer.getItem("SIMPLE_TRIGGER_INTERVAL").show();  
}


//test code
//_viewer.getItem("TRIGGER_TYPE").obj.parent().parent().parent().css("display","none");
