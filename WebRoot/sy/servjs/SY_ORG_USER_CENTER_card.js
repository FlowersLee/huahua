_viewer = this;

//隐藏上下按钮条
var mainTopBtnBar = jQuery("#" + _viewer.servId + "-mainTab").children(".rhCard-btnBar").height(12).find("*").hide();
var mainBottomBtnBar;
//setTimeout(function(){
//	mainBottomBtnBar = jQuery("#" + _viewer.servId + "-mainTab").children(".rhCard-btnBar-bottom").hide();
//},0);
//主服务高度变窄
jQuery("#" + _viewer.servId + "-mainTab").children(".form-container").children(".ui-form-default").children().css({"margin":"0px","padding":"0px"});

//替换资料完整度字段
var ziliaoCon = jQuery("#SY_ORG_USER_CENTER-INFO_PERCENT_S").parent();
jQuery("#SY_ORG_USER_CENTER-INFO_PERCENT_S").hide();
jQuery(ziliaoCon).css({"position":"relative","top":"10px","height":"10px"});
_viewer.numDiv = jQuery("<div id='num_deg' style='position:relative;margin-top:-20px;width:100%;height:20px;'></div>").appendTo(ziliaoCon);
_viewer.numSpan = jQuery("<span style='position:relative;left:0%;'></span>").appendTo(_viewer.numDiv);
_viewer.degDiv = jQuery("<div id='div_deg' style='width:0%;height:10px;background-color:red;'></div>").appendTo(ziliaoCon);
//setZiliaoDeg("USERINFO", _viewer.getPKCode(), _viewer.degDiv, _viewer.numSpan);


