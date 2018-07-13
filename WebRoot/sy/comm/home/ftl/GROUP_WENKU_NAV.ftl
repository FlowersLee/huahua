<#include "WENKU_CONSTANT.ftl">
<style type="text/css">
.nav_contain2, .tit4{background-image: url("/sy/comm/wenku/img/bg_line.png");background-repeat: repeat-x;}
.nav_contain2{background-position: 0 -36px;height: 34px;}
.nav_contain2_1{height: 34px;margin: 0 auto;text-align: left;width: 980px;}
.nav_contain2_1 a{color: #FFFFFF;float: left;font-size: 14px;font-weight: bold;height: 30px;line-height: 30px;margin: 4px 36px 0 0;text-align: center;width: 57px;}
.nav_contain2_1 a: hover{text-decoration: none;}
.nav_contain2_1 a.here1, .nav_contain2_1 a.a1here1{background-position: -290px -166px;color: #1458B0;height: 30px;width: 57px;}
.nav_contain2_1 a.a1here1{background-position: -290px -135px;width: 78px;}
.nav_contain2_1 a.a1{width: 78px;}
.nav_contain2_1 h1{font-size: 14px;font-weight: bold;}
</style>
<div class='portal-box ${boxTheme!""}' style='min-height:0px;'>
	<div class='portal-box-title ${titleBar}'>
		<span class="portal-box-title-icon ${icon}"></span>
		<span class="portal-box-title-label">${title}</span>
	</div>
	<div class='portal-box-con' style='height:${height};'>
		<div class="nav_contain2">
			<div class="nav_contain2_1">
			    <a target="_self" class="a1" href="/sy/comm/page/SY_COMM_TEMPL.show.do?model=view&pkCode=1-QuWdguJ0L8f8tG8YbHMy&$SITE_ID$=${SITE_ID}"><h1>文库首页</h1></a>
				<#list _DATA_ as channel>
				<a target="_self" class="a1" href="/wenku/channel/${channel.CHNL_ID}/index.html?group=true&SITE_ID=${SITE_ID}">
					<h1>${channel.CHNL_NAME}</h1>
				</a>
				</#list>
			</div>
		</div>
	</div>
</div>