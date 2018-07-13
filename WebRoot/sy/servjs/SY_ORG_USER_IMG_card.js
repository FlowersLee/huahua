var _viewer = this;
var con = _viewer.getItem("USER_IMG_SRC").getContainer().find(".right");
var orImg;
var srcImgObj, text100, obj100, text50, obj50;

var setImg = function() {
	var rand = Math.random();//增加随机数，用于跳过浏览器缓存图片
	if(text100 && obj100 && text50 && obj50){
		text100.remove();
		obj100.remove();
		text50.remove();
		obj50.remove();
	}
	orImg = con.find("img").attr("src") || "";
	var arrayFile = orImg.split("/");
	arrayFile[arrayFile.length - 1] = "ICON_" + arrayFile[arrayFile.length - 1];
	srcImgObj = con.children().first();
	srcImgObj.css({"float":"left"});
	text100 = jQuery("<span style='display:inline-block;margin:5px auto auto 20px;float:left;'>大尺寸</span>");
	text100.insertAfter(srcImgObj);
	obj100 = jQuery("<div class='frame' style='margin:10px;margin-top:5px;margin-left:20px;width:100px;height:100px;float:left;border:1px #91BDEA solid;'>" + 
	    "<div style='width:100px; height: 100px; overflow: hidden;'>"+
	    "<img id='imgObj100' class='img100' src='" + arrayFile.join("/") + "?size=100x100&" + rand + "' style='width:100px;height:100px;' />"+
	    "</div><div style='margin-top:5px;width:100px;text-align:center;'>100 x 100</div></div>");
	obj100.insertAfter(text100);
	text50 = jQuery("<span style='display:inline-block;margin:5px auto auto 20px;float:left;'>小尺寸</span>");
	text50.insertAfter(obj100);
	obj50 = jQuery("<div class='frame' style='margin:10px;margin-top:5px;margin-left:20px;width:40px;height:60px;float:left;'>" + 
			"<div style='width: 40px; height: 40px; overflow: hidden;border:1px #91BDEA solid;'>"+
			"<img id='imgObj50' class='img40' src='" + arrayFile.join("/") + "?size=40x40&" + rand + "' style='width: 40px; height: 40px;' />"+
	"</div><div style='margin-top:5px;width:100%;text-align:center;'>40x40</div></div>");
	obj50.insertAfter(text50);
};

jQuery("#SY_ORG_USER_IMG-USER_IMG_SRC_cancel").bind("click",function(){
	if(text100 && obj100 && text50 && obj50){
		text100.remove();
		obj100.remove();
		text50.remove();
		obj50.remove();
	}
	_viewer.getItem("USER_IMG_SRC").setValue("");
});

var zoomWid = 300;
var zoomHei = 300;
var zoomRate = 1;//缩放比例，小于300的话为默认值1，大于300的话取最大值和300的比
//缩略图根据原始图的选择状态来展示其对应的图片
function preview(img, selection) {
    if (!selection.width || !selection.height) {
    	return;
    }
    if (jQuery('.img100').attr("src") != orImg || jQuery('.img40').attr("src") != orImg) {
    	jQuery('.img100').attr("src",orImg);
    	jQuery('.img40').attr("src",orImg);
    }
    var scaleX = 100 / selection.width;
    var scaleY = 100 / selection.height;
    jQuery('.img100').css({
        width: Math.round(scaleX * zoomWid),
        height: Math.round(scaleY * zoomHei),
        marginLeft: -Math.round(scaleX * selection.x1),
        marginTop: -Math.round(scaleY * selection.y1)
    });
    var scaleX = 40 / selection.width;
    var scaleY = 40 / selection.height;
    jQuery('.img40').css({
        width: Math.round(scaleX * zoomWid),
        height: Math.round(scaleY * zoomHei),
        marginLeft: -Math.round(scaleX * selection.x1),
        marginTop: -Math.round(scaleY * selection.y1)
    });
    var rate = 1/zoomRate;
    var x1 = selection.x1*rate;
    var y1 = selection.y1*rate;
    var x2 = selection.x2*rate;
    var y2 = selection.y2*rate;
    var w = selection.width*rate;
    var h = selection.height*rate;
    var param = {"x1":"" + x1,"y1":"" + y1,
    		     "x2":"" + x2,"y2":"" + y2,
    		     "w":"" + w,"h":"" + h};
    _viewer.extendSubmitData = param;
};

jQuery(document).ready(function () {
	jQuery(".imgareaselect-outer").remove();
	jQuery(".imgareaselect-selection").parent().remove();
	preProcess();
});
//根据原始图片的宽高和默认的300进行等比例的缩放，并确定缩放的比例
function preProcess(def) {
	con.find(".ui-image-default").hide();
	window.setTimeout(function() {
		var orWid = con.find(".ui-image-default").width();
		var orHei = con.find(".ui-image-default").height();
		//900*900
		if (orWid > 300 || orHei > 300) {
			if (orWid >= orHei) {//如果宽度大于等于高度
				zoomRate = 300/orWid;
				zoomWid = 300;
				zoomHei = orHei*zoomRate;
			} else {
				zoomRate = 300/orHei;
				zoomWid = orWid*zoomRate;
				zoomHei = 300;
			}
			con.find(".ui-image-default").css("width",zoomWid);
			con.find(".ui-image-default").css("height",zoomHei);
		} else {
			zoomWid = orWid;
			zoomHei = orHei;
			con.find(".ui-image-default").css("width",orWid);
			con.find(".ui-image-default").css("height",orHei);
		}
		con.find(".ui-image-default").show();
		if(con.find(".ui-image-default").attr("src")){
			setImg();
		}
		if ((def == "defaultSelect") && (zoomWid > 150) && (zoomHei > 150)) {//大于区域大小才处理
			var fixSize = 150;
			var intX1 = Math.floor((zoomWid - fixSize)/2);
			var intY1 = Math.floor((zoomHei - fixSize)/2);
			var intX2 = intX1 + fixSize;
			var intY2 = intY1 + fixSize;
			con.find(".ui-image-default").imgAreaSelect({
				handles: true,
				aspectRatio: '1:1',
				fadeSpeed: 200,
				x1: intX1, y1: intY1, x2: intX2, y2: intY2,
				onSelectChange: preview
			});
		} else {
			con.find(".ui-image-default").imgAreaSelect({
				handles: true,
				aspectRatio: '1:1',
				fadeSpeed: 200,
				onSelectChange: preview
			});
		}
	},500);
};
_viewer.getItem("USER_IMG_SRC").afterFillData = function(href) {//上传后的清理遮罩区域
	var href = FireFly.getContextPath() + "/file/" + href.split(",")[0];
	jQuery(".imgareaselect-outer").remove();
	jQuery(".imgareaselect-selection").parent().remove();
	jQuery('.img100').attr("src",href);
	jQuery('.img40').attr("src",href);
	preProcess("defaultSelect");//设置默认选中区域
};
_viewer.afterSave = function() {
	var res = confirm("系统将会重新加载页面，取消则在下次登录时生效！");
	if (res === true) {
		parent.window.location.href = parent.window.location.href;
	}
};

//重新获取资料完整度并渲染
if(setZiliaoDeg){
	setZiliaoDeg("USERINFO", _viewer.getParHandler().getPKCode(), _viewer.getParHandler().degDiv, _viewer.getParHandler().numSpan);
}
//隐藏上方的保存按钮
//jQuery(".rhCard-btnBar").css({"position":"absolute","margin-left":"-1000px","margin-top":"-1000px"});
//jQuery("#" + _viewer.servId).find("fieldset").css({"padding-left":"100px"});