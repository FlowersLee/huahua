var _viewer = this;

//重新获取资料完整度并渲染
if(setZiliaoDeg){
	setZiliaoDeg("USERINFO", _viewer.getParHandler().getPKCode(), _viewer.getParHandler().degDiv, _viewer.getParHandler().numSpan);
}
//隐藏上方的保存按钮
//jQuery(".rhCard-btnBar").css({"position":"absolute","margin-left":"-1000px","margin-top":"-1000px"});
jQuery("#" + _viewer.servId).find("fieldset").css({"padding-left":"200px"});