<style type="text/css">
html,body{overflow-x:hidden;}
.cls{clear: both;}a:focus{outline: none;}
.menu{height: 40px;display: block;padding: 0px 40px;margin-top: 0 auto;font-family: "微软雅黑", "宋体";font-size: 12px;color: #CCCCCC;}
.menu ul{list-style: none;padding: 0;margin: 0;}
.menu ul li{float: left;overflow: hidden;position: relative;line-height: 40px;text-align: center;}
.menu ul li a{position: relative;display: block;width: 90px;height: 40px;font-family: "微软雅黑", "宋体";font-size: 12px;text-decoration: none;cursor: pointer;}
.menu ul li a:hover{background: url(/sy/comm/news/nav/images/bg_over.gif) no-repeat center center;}
#menu1{background-color: #E8E8E8;background: url(/sy/comm/news/nav/images/menu_bg.gif) repeat-x;border: 1px #ccc solid;}
#menu1 ul li a{color: #000;}
#menu1 ul li a:hover{color: #FFF;}
</style>
<div class='portal-box ${boxTheme!""}' style='min-height:0px;'>
	<div class='portal-box-title ${titleBar}'>
		<span class="portal-box-title-icon ${icon}"></span>
		<span class="portal-box-title-label">${title}</span>
	</div>
	<div class='portal-box-con' style='height:${height};'>
		<div id="menu1" class="menu">
			<ul>
				<li>
					<a href="/sy/comm/page/SY_COMM_TEMPL.show.do?model=view&pkCode=069mx3_0F0FqdWAW2Xm0S_&$SITE_ID$=${SITE_ID}">新闻首页</a>
				</li>
				<#list _DATA_ as channel>
				<li>
					 <a href="/cms/CM_CMS_CHNL/${channel.CHNL_ID}/index.html">
						${channel.CHNL_NAME}
					 </a>
				</li>
				</#list>
			</ul>
			<div class="cls"></div>
		</div>
	</div>
</div>