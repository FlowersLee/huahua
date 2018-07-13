<style type="text/css">
.pictureScroll #banner {}
#banner {position:relative; height:300px;border:1px solid #666; overflow:hidden; font-size:12px} 
#banner_list img {border:0px;} 
#banner_bg {position:absolute; bottom:0;background-color:#000;height:30px;filter: Alpha(Opacity=30);opacity:0.3;z-index:1000;cursor:pointer; width:478px; } 
#banner_info{position:absolute; bottom:4px; left:5px;height:22px;color:#fff;z-index:1001;cursor:pointer} 
#banner_text {position:absolute;width:120px;z-index:1002; right:3px; bottom:3px;} 
#banner ul {position:absolute;list-style-type:none;filter: Alpha(Opacity=80);opacity:0.8; z-index:1002; 
margin:0; padding:0; bottom:3px; right:5px; height:20px} 
#banner ul li { padding:0 8px; line-height:18px;float:left;display:block;color:#FFF;border:#e5eaff 1px solid;background-color:#6f4f67;cursor:pointer; margin:0; font-size:16px;} 
#banner_list a{position:absolute;} 

</style> 
<div id='PICTURE_SCROLL' class='portal-box pictureScroll' style="width:100%;height:263px;">
<div class='portal-box-title ${titleBar}'><span class="portal-box-title-label">图片新闻</span></div>
<div class='portal-box-con'>
<div id="banner" style="height:230px;"> 
<div id="banner_bg" ></div> 
<div id="banner_info"></div> 
<ul> 
<li>1</li> 
<li>2</li> 
<li>3</li> 
<li>4</li> 
</ul> 
<div id="banner_list"> 
<#list _DATA_ as news>
<a href="javascript:newsView('${news.NEWS_ID}', '${news.NEWS_SUBJECT}');">
<#if (news.picture.FILE_ID?length >0)>
	<img  width="${imgWidth!376}" height="${imgHeight!251}" src="/file/${news.picture.FILE_ID}" title="${news.NEWS_SUBJECT}" alt="${news.NEWS_SUBJECT}"/>
</#if>
</a>
</#list>
</div> 
</div> 
</div>
</div>
<script type="text/javascript">
var t = n = 0, count; 
jQuery(document).ready(function(){ 
	count=jQuery("#banner_list a").length; 
	jQuery("#banner_list a:not(:first-child)").hide(); 
	jQuery("#banner_info").html(jQuery("#banner_list a:first-child").find("img").attr('alt')); 
	jQuery("#banner_info").click(function(){window.open(jQuery("#banner_list a:first-child").attr('href'), "_blank")}); 
	jQuery("#banner li").click(function() { 
		var i = jQuery(this).text() - 1;
		n = i; 
		if (i >= count) return; 
		jQuery("#banner_info").html(jQuery("#banner_list a").eq(i).find("img").attr('alt')); 
		jQuery("#banner_info").unbind().click(function(){window.open(jQuery("#banner_list a").eq(i).attr('href'), "_blank")});
		jQuery("#banner_list a").filter(":visible").fadeOut(500).parent().children().eq(i).fadeIn(1000); 
		jQuery(this).css({"background":"#be2424",'color':'#000'}).siblings().css({"background":"#6f4f67",'color':'#fff'}); 
	}); 
	t = setInterval("showAuto()", 4000); 
	jQuery("#banner").hover(function(){clearInterval(t)}, function(){t = setInterval("showAuto()", 4000);}); 
	
});
function showAuto() { 
	n = n >=(count - 1) ? 0 : ++n; 
	jQuery("#banner li").eq(n).trigger('click'); 
} 
</script> 
