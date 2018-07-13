<style type="text/css">
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
<script type="text/javascript">
jQuery(document).ready(function() {
	/* 取得站点ID_begin */
	var index = (window.location+"").indexOf("&$SITE_ID$");
	var SITE_ID = (window.location+"").substring(index);
	function doTmpl(id,name){
		var url = "/sy/comm/page/SY_COMM_TEMPL.show.do?model=view&pkCode="+id+SITE_ID;	
		window.location = url;
	}
	
	jQuery("a[title='首页']").attr("href",jQuery("a[title='首页']").attr("href")+SITE_ID);
	jQuery("a[title]").unbind("click").click(function(){
		if(jQuery(this).attr('title')=="新闻"){
			doTmpl("069mx3_0F0FqdWAW2Xm0S_","新闻");
		}
		else if(jQuery(this).attr('title')=="文库"){
			doTmpl("3L_dBQvHteTa-YVpfWQxG-","文库");
		}
		else if(jQuery(this).attr('title')=="论坛"){
			doTmpl("2755OG6FlbdFRWdjd8VACB","论坛");
		}
	});
	/* 取得站点ID_end */
});
</script>


<div class='portal-box ${boxTheme!""}' style='min-height:0px;'>
	<div class='portal-box-title ${titleBar}'>
		<span class="portal-box-title-icon ${icon}"></span>
		<span class="portal-box-title-label">${title}</span>
	</div>
	<div class='portal-box-con' style='height:${height};'>
		<div id="menu1" class="menu">
			<ul>
				<li>
					<a title="首页" href="/sy/comm/page/SY_COMM_TEMPL.show.do?model=view&pkCode=1PL1etY999C8jjte_iE68G">机构首页</a>
				</li>
				<li>
					 <a title="新闻">新闻</a>
				</li>
				<li>
					 <a title="文库">文库</a>
				</li>
				<li>
					 <a title="论坛">论坛</a>
				</li>
			</ul>
			<div class="cls"></div>
		</div>
	</div>
</div>