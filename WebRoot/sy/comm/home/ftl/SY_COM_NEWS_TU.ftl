<style type="text/css">
.list_14 {
	font-family: "微软雅黑","宋体";
	font-size: 14px;
	padding: 5px 0px 5px 15px;
}
.topli14Blod {font-weight:bold;}
.list_14 li {
    padding-left:13px;
    line-height:24px;
    background:url("http://i2.sinaimg.cn/dy/deco/2012/0724/news_m_04.png") no-repeat -475px -615px;
}
.list_14 a {color:#1f3b7b;text-decoration:none;}
.list_14 a:hover {color:#8d0000;text-decoration:underline;}
</style>
<div id='CM_NEWS' class='portal-box' style='min-height:200px'>
<div class='portal-box-con'>
<div class='portal-box-title'>
	<span class="portal-box-title-icon ${icon}"></span>
	<span class="portal-box-title-label">${title}</span>
	<span class="portal-box-hideBtn conHeanderTitle-expand"></span>
</div>
<ul class="list_14">
<#list _DATA_ as content><!--<a target='_blank' href="ns/html/${content.NEWS_ID}.html">-->
	<li class="topli14Blod"><a href="" target="_blank">${content.NEWS_SUBJECT}</a></li>
</#list>
</ul>
</div>
</div>