<style type="text/css">
.app_group_header{background: url("/sy/comm/group/img/bg_header_h117.png") repeat scroll left top transparent; color: #FFFFFF; font-size: 36px; height: 120px; font-family: "Microsoft Yahei",Tahoma;}
.app_group_header .app_group_inner{height: 117px; position: relative;}
.app_group_inner{margin: 0 auto; min-width: 960px; max-width: 70%; width: 70%;}
.app_group_header .group_name{float: left; margin-top: 35px; padding: 0; position: relative; width: 425px;}
.app_group_header .nav{position: absolute; right: 0; top: 39px;}
.app_group_header .nav a{cursor: pointer; float: left; font-size: 0; margin-left: 1px; padding: 8px 20px; position: relative; vertical-align: middle;}
.app_group_header .nav .i_menu_photo{width: 35px;}
.app_group_header .nav .i_group{height: 33px; margin-right: 10px; overflow: hidden; vertical-align: middle;}
.i_menu_photo{background: url("/sy/comm/group/img/app_group.png") -420px -126px;}
.icon, .img, .i_group{background-repeat: no-repeat; display: inline-block;}
.app_group_header .nav .counts{color: #E0F0FF; display: inline-block; font-family: Arial; font-size: 22px; text-shadow: 0 1px rgba(0, 0, 0, 0.3); vertical-align: middle;}
.app_group_header .nav .ui_trig{border-color: #2B547E; border-width: 11px; bottom: -11px; display: none; left: 50%; margin-left: -11px; position: absolute;}
a.ui_trig, b.ui_trig, i.ui_trig, span.ui_trig, strong.ui_trig, div.ui_trig, .ui_trig{border-style: solid; border-width: 5px; display: inline-block; font-size: 0; height: 0; line-height: 0; overflow: hidden; width: 0;}
.ui_trig_b, .ui_trigbox_b .ui_trig{border-bottom-width: 0 !important; border-left-color: transparent !important; border-right-color: transparent !important; border-style: solid outset;}
.app_group_header .nav .i_menu_share{width: 42px;}
.i_menu_share{background-image: url("/sy/comm/group/img/app_group.png"); background-position: -456px -126px;}
.app_group_header .nav .i_menu_qunbbs, .app_group_header .nav .nav_qunbbs:hover .i_menu_qunbbs{background-image: url("/sy/comm/group/img/app_group.png"); background-position: -460px -86px; width: 32px;}
.app_group_header .nav .i_menu_member{width: 39px;}
.i_menu_member{background-image: url("/sy/comm/group/img/app_group.png"); background-position: -292px -132px;}
.app_group_header .nav .i_menu_qunbbs,.app_group_header .nav .nav_qunbbs:hover .i_menu_qunbbs{width: 32px;background-image:url(/sy/comm/group/img/app_group.png);background-position: -460px -86px}
.app_group_header .nav a:hover,.app_group_header .current{border-radius: 5px;background-color: #2B547E;z-index: 0}
.app_group_header .nav a:hover .ui_trig{display: block;_display: inherit}.i_group_logo{background-image: url("/sy/comm/group/img/app_group.png"); background-position: -81px -86px; height: 51px;width: 62px;margin-right: 18px;vertical-align: middle;}
</style>
<div class='portal-box ${boxTheme!""}' style="min-height:0;">
	<div class='portal-box-title ${titleBar}'>
		<span class="portal-box-title-icon ${icon}"></span>
		<span class="portal-box-title-label">${title}</span>
	</div>
	<div class='portal-box-con' style='height:${height};'>
		<div id="group_header_container" class="app_group_header">
		    <div class="app_group_inner">
		        <h2 class="group_name">
		        	<i class="i_group i_group_logo"></i>
					<span id="group_name">${group.GROUP_NAME}</span>
				</h2>
		        <div class="nav">
		            <a title="新闻" class="nav_photo" href="/sy/comm/page/SY_COMM_TEMPL.show.do?model=view&pkCode=1bRguovI51MoLpHXXLdrg5&$SITE_ID$=${SITE_ID!''}">
		            	<i class="i_group i_menu_photo"></i>
						<span class="visual_none">新闻</span>
						<span class="counts">${news_num!0}</span>
						<b class="ui_trig ui_trig_b c_tx"></b>
					</a>
		            <a title="文库" class="nav_share" href="/sy/comm/page/SY_COMM_TEMPL.show.do?model=view&pkCode=1-QuWdguJ0L8f8tG8YbHMy&$SITE_ID$=${SITE_ID!''}">
		            	<i class="i_group i_menu_share"></i>
						<span class="visual_none">文库</span>
						<span class="counts">${doc_num!0}</span>
						<b class="ui_trig ui_trig_b c_tx"></b>
					</a>
		            <a title="论坛" class="nav_qunbbs" href="/sy/comm/page/SY_COMM_TEMPL.show.do?model=view&pkCode=1ADdtUoOJayqZG2qKpyoUC&$SITE_ID$=${SITE_ID!''}">
		            	<i class="i_group i_menu_qunbbs"></i>
						<span class="visual_none">论坛</span>
						<span class="counts">${topic_num!0}</span>
						<b class="ui_trig ui_trig_b c_tx"></b>
					</a>
					<!--
		            <a title="群成员" class="nav_member" href="javascript:;">
		            	<i class="i_group i_menu_member"></i>
						<span class="visual_none">群成员</span>
						<span class="counts">60</span>
						<b class="ui_trig ui_trig_b c_tx"></b>
					</a>
					-->
		        </div>
		    </div>
		</div>
	</div>
</div>
