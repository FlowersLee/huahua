<style type="text/css">
.TMenu_04 {
	background: rgb(238, 238, 238); height: 37px; border-top-color: rgb(0, 0, 0); border-bottom-color: rgb(204, 204, 204); border-top-width: 2px; border-bottom-width: 1px; border-top-style: solid; border-bottom-style: solid;
}
.TMenu_04 ul {
	height: 36px; margin-bottom: -1px; border-top-color: rgb(255, 255, 255); border-top-width: 1px; border-top-style: solid; position: relative;
}
.TMenu_04 li {
	font: bold 15px/36px "微软雅黑", "宋体"; width: 86px; height: 36px; text-align: center; color: rgb(102, 102, 102); border-right-color: rgb(204, 204, 204); border-right-width: 1px; border-right-style: solid; float: left; font-size-adjust: none; font-stretch: normal;
}
.TMenu_04 li.selected {
	height: 37px; color: rgb(51, 51, 51); position: relative; background-color: rgb(246, 246, 246);
}
.TMenu_04 a:link {
	color: rgb(102, 102, 102); text-decoration: none;
}
.TMenu_04 a:visited {
	color: rgb(102, 102, 102); text-decoration: none;
}
.TMenu_04 a:hover {
	color: rgb(141, 0, 0); text-decoration: none;
}
.TMenu_04 .selected a:link {
	color: rgb(51, 51, 51); text-decoration: none;
}
.TMenu_04 .selected a:visited {
	color: rgb(51, 51, 51); text-decoration: none;
}
.TMenu_04 .selected a:hover {
	color: rgb(141, 0, 0); text-decoration: none;
}
.list_12 li {
    padding-left:10px;
    line-height:24px;
    background:url("http://i2.sinaimg.cn/dy/deco/2012/0724/news_m_04.png") no-repeat -475px -615px;
}
.list_12 li a {color:#1f3b7b;}
.list_12_none {display:none;}
</style>
<div id='CM_NEWS' class='portal-box' style='min-height:200px'>
<div class=''></div>
<div class='portal-box-con'>
<!--构造区块：TAB-开始-->
<div id="blk_gjdlup_01" class="TMenu_04">
  <ul>
    <li id="tab_gjdl_01" conul="con_ul1" class="new_tab selected"><a href="http://green.sina.com.cn/" target="_blank">环保</a></li>
    <li id="tab_gjdl_02" conul="con_ul2" class="new_tab"><a href="http://geo.sina.com.cn/" target="_blank">国家地理</a></li>
  </ul>
</div>
<!--构造区块：内容-开始-->
<ul id="con_ul1" class="list_12 link_c666">
	<li><a href="http://green.sina.com.cn/" target="_blank">北京此次重污染根本原因为污染物排放大</a></li>
	<li><a href="http://green.sina.com.cn/news/roll/2013-01-14/170726031455.shtml" target="_blank">往年数据表明北京汽车尾气污染超出燃煤</a></li>
	<li><a href="http://green.sina.com.cn/news/roll/2013-01-13/233826024703.shtml" target="_blank">广东湛江至茂名输油管道泄漏10余吨原油</a></li>
	<li><a href="http://green.sina.com.cn/news/roll/2013-01-14/105526029565.shtml" target="_blank">湖南岳阳洞庭湖20只天鹅中毒死亡</a></li>
	<li><a class="videoNewsLeft" href="http://video.sina.com.cn/p/news/green/v/2012-12-27/162461959069.html" target="_blank">澳柯玛每件产品都体现对环境的热爱</a></li>
</ul>
<ul id="con_ul2" class="list_12 link_c666 list_12_none">
	<li><a class="linkRed01" href="http://tech.sina.com.cn/d/photo/" target="_blank">科学探索高清图新版上线</a></li>
	<li><a href="http://slide.tech.sina.com.cn/d/slide_5_453_26450.html" target="_blank">12大未来派城市交通工具:伸缩杆汽车</a></li>
	<li><a href="http://slide.tech.sina.com.cn/d/slide_5_453_26449.html" target="_blank">极光映衬下北欧罕见冰雪森林美景(图)</a></li>
	<li><a href="http://slide.geo.sina.com.cn/slide_29_16805_20191.html" target="_blank">美发现150年前炮舰沉船残骸(组图)</a></li>
	<li><a href="http://tech.sina.com.cn/d/2012NGCbest/" target="_blank">国家地理2012最佳纪录片有奖评选</a></li>
</ul>

</div>
</div>
<script type="text/javascript">
(function() {
    jQuery(document).ready(function(){
	    setTimeout(function() {
	      jQuery(".new_tab").bind("mouseover",function() {
	          if (jQuery(this).hasClass("selected")) {
	              return;
	          }
	          jQuery("#blk_gjdlup_01 .selected").removeClass("selected");
	          jQuery(this).addClass("selected");
	          var id = jQuery(this).attr("conul");
	          jQuery(".list_12").hide();
	          jQuery("#" + id).show();
	      });
	    },0);
    });
})();
</script>