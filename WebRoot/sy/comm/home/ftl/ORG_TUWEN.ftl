<#--精品滚动图文-->
<style type="text/css">
	<#--为滚动图片添加样式 -->
	.product-image img {
		border-right-width: 0px; border-top-width: 0px; border-bottom-width: 0px; vertical-align: top; border-left-width: 0px;
	}
	<#--展示图片最外层显示div -->
	.cms-home .main {
		padding:5px 5px 5px 5px;
	}
	<#-- 放置隐藏图片-->
	.cms-home .std {
		display: none
	}
	<#--可视化div中ul的样式 -->
	.cms-home .products-grid {
		position: relative; border-bottom-style: none
	}
	<#--可视化div中ul最后一个图片样式 -->
	.cms-home .last.products-grid {
		border-bottom-width: 0px
	}
	<#--中间li的样式 -->
	<#-- 若初始值为空，则从新赋值，便于后面使用-->
	<#if imgWid?length == 0>
		<#assign imgWid = "180"/>
	</#if>
	<#if imgHei?length == 0>
		<#assign imgHei = "120"/>
	</#if>
	<#if showCount?length == 0>
		<#assign showCount = "2"/>
	</#if>
	<#if speed?length == 0>
		<#assign speed = "3"/>
	</#if>
	.cms-home .products-grid li.item {
		position: relative; border-bottom-style: none; text-align: center; padding-bottom: 0px !important; border-right-style: none;
		margin: 0px; padding-left: 0px !important; width: ${imgWid}px; padding-right: 0px !important; border-top-style: none; float: left; height: ${imgHei}px; 
		border-left-style: none; padding-top: 0px !important;margin:5px 5px 5px 5px;
	}
	<#--第一个li的样式 -->
	.cms-home .products-grid li.first {
		width: ${imgWid}px
	}
	<#-- 最后一个li的样式-->
	.cms-home .products-grid li.last {
		border-right-style: none; width: ${imgWid}px
	}
	<#--移动图片的位置 -->
	.cms-home .product-image-block {
		position: relative; margin: 0px auto; width: ${imgWid}px
	}
	.cms-home .products-grid .product-image {
		margin: 0px auto 10px; width: ${imgWid}px; display: block; height: ${imgHei}px
	}
	<#--鼠标放在图片上悬浮出来的的title -->
	.cms-home .products-grid .product-name {
		position: absolute; text-align: center;width: ${(imgWid)?number - 8}px; 
		padding-right: 0px; display: none; background: url(/sy/comm/home/img/bg_col_main.png) 0px 0px; left: 4px;bottom: 10px; 
	}
	<#--鼠标放在图片上悬浮出来的的title里面的a标签 -->
	.cms-home .products-grid .product-name a {
		text-decoration: none;color:#FFF;
	}
	<#--鼠标放在图片上悬浮出来的的title里面的a标签的hover样式 -->
	.cms-home .products-grid .product-name a:hover {
		text-decoration: underline
	}
	<#--可视化div的区域宽度 -->
	.cms-home .indent-col-main {
		position: relative; padding: 0px 8px 5px 0px;width:
		<#if (modeWid!"")?length == 0>
			${(imgWid)?number * (showCount)?number + 8 * (showCount)?number}px;
		</#if>
		<#if (modeWid!"")?length gt 0>
			${modeWid};
		</#if>
	}
	<#-- 左右按钮div-->
	.cms-home .products-grid button.button {
		padding-bottom: 0px; border-right-width: 0px; margin: 0px; padding-left: 0px; width: auto; padding-right: 0px; background: none transparent scroll repeat 0% 0%; border-top-width: 0px; border-bottom-width: 0px; overflow: visible; border-left-width: 0px; cursor: pointer; padding-top: 0px
	}
	<#-- 左右按钮div内部span-->
	.cms-home .products-grid button.button span {
		text-align: center; padding-bottom: 0px; text-transform: none; padding-left: 0px; padding-right: 0px; font: 11px/16px arial, helvetica, sans-serif; white-space: nowrap; background: none transparent scroll repeat 0% 0%; float: left; height: 16px; color: #020202; padding-top: 0px
	}
	.cms-home .products-grid button.button span span {
		padding-bottom: 0px; padding-left: 0px; padding-right: 0px; background: none transparent scroll repeat 0% 0%; padding-top: 0px
	}
	.std .subtitle {
		padding-bottom: 0px; padding-left: 0px; padding-right: 0px; padding-top: 0px
	}
	.std ol.ol {
		list-style-position: outside; list-style-type: decimal; padding-left: 1.5em
	}
	.std ul.disc {
		list-style-position: outside; list-style-type: disc; margin: 0px 0px 10px; padding-left: 18px
	}
	.std dl dt {
		font-weight: bold
	}
	.std dl dd {
		margin: 0px 0px 10px
	}
	.block-slider {
		position: relative; padding-bottom: 0px; margin: 0px 0px 0px 1px; padding-left: 0px; width: 
		<#if (modeWid!"")?length == 0>
			${(imgWid)?number * (showCount)?number + 8 * (showCount)?number}px;
		</#if>
		<#if (modeWid!"")?length gt 0>
			${modeWid};
		</#if>
		padding-right: 0px; overflow: hidden; padding-top: 8px
	}
	.block-slider .box-top {
		position: relative; margin: 0px 35px 0px 0px; width: 700px; float: left; height: 483px; color: #616161; font-size: 1.2em; overflow: hidden; left: 9px
	}
	.block-slider ul {
		padding-bottom: 0px; list-style-type: none; margin: 0px; padding-left: 0px; padding-right: 0px; height: ${imgHei}px; overflow: hidden; padding-top: 0px
	}
	.block-slider ul li {
		position: relative; padding-bottom: 0px; padding-left: 0px; width: ${imgWid}px; padding-right: 0px; display: block; float: left; height: 483px; padding-top: 0px
	}
	.block-slider ul li a {
		display: block; text-decoration: none
	}
	.block-slider ul li a:hover {
		text-decoration: none
	}
	.products-grid {
		border-bottom: #cecece 1px solid; position: relative
	}
	.last.products-grid {
		border-bottom-width: 0px
	}
	.products-grid li.item {
		text-align: center; padding-bottom: 0px; padding-left: 20px; width: 195px; padding-right: 20px; float: left; border-right: #cecece 1px solid; padding-top: 12px
	}
	.products-grid li.first {
		width: 182px
	}
	.products-grid li.last {
		border-right-style: none; width: 180px
	}
	.product-image-block {
		position: relative; margin: 0px auto; width: ${imgWid}px
	}
	.products-grid .product-image {
		margin: 0px auto 10px; width: ${imgWid}px; display: block; height: ${imgHei}px
	}
	.products-grid .product-name {
		position: absolute; text-align: center; padding-bottom: 4px;width: ${(imgWid)?number - 8}px;  padding-top:5px;padding-right: 0px; 
		background: url(/sy/comm/home/img/bg_col_main.png) 0px 0px; left: 4px;bottom: 10px;
	}
	.products-grid:after {
		line-height: 0; display: block; height: 0px; clear: both; font-size: 0px; overflow: hidden; content: "."
	}
	<#-- 左边按钮样式-->
	#left_but {
		z-index: 999; position: absolute; margin: 0px; width: 20px; background: url("/sy/comm/home/css/images/portal_page.png") no-repeat left top; 
		height: 29px; top: ${(imgHei)?number / 2 - 5}px; cursor: pointer; left: 3px;display:none;
	}
	<#-- 鼠标放在左边按钮样式-->
	.over#left_but {
		background-position: -100px 0px;
	}
	<#-- 右边按钮样式-->
	#right_but {
		position: absolute; margin: 0px; width: 20px; background: url("/sy/comm/home/css/images/portal_page.png") no-repeat -50px 0px;
		height: 29px; top: ${(imgHei)?number / 2 - 5}px; cursor: pointer; right: 8px;display:none;
	}
	<#-- 鼠标放在右边按钮样式-->
	.over#right_but {
		background-position: -150px 0px;
	}
	<#-- 模版基本样式-->
	.inlineBlock {display:inline-block;}
</style>
<#-- 模版最外层-->
<div class='portal-box ${boxTheme}' style='min-height:45px;'>
<#-- 模版标题-->
	<div class='portal-box-title'>
		<span class="portal-box-title-icon ${icon}"></span>
		<span class="portal-box-title-label">${title}</span>
	</div>
<#-- 模版内容区域-->
<div class='portal-box-con style='height:${height};padding:10px 5px 5px 10px;'>
<#-- 滚动图片框最外层-->
<div class="cms-home">
	<div class="indent-col-main">
		<div class="std"><br></div>
		<div class="block-slider">
		<div style="left: -5px;position: relative;">
		<ul id="slider_list" class="products-grid">
			<#list _DATA_ as news>
				<#if news_index == 0>
					<li class="item first">
				</#if>
				<#if news_index gt 0 && news_has_next>
					<li class="item" >
				</#if>
				<#if !news_has_next  && _DATA_?size gt 1>
					<li class="item lase">
				</#if>
				<a class=product-image href="javascript:void(0);" onclick="ptDoView('${news._PK_}', '${news.NEWS_SUBJECT}');">
				 <#-- 图片中title-->
				<#--<#if (news.NEWS_SUBJECT!"")?length lte 10>
					 <a class=product-image title="${news.NEWS_SUBJECT!""}" href="javascript:void(0);" 
					 	onclick="ptDoView('${news._PK_}', '${news.NEWS_SUBJECT!""}');">
				</#if>
				<#if (news.NEWS_SUBJECT!"")?length gt 10>
					 <a class=product-image title="${(news.NEWS_SUBJECT!"")[0..10]}..." href="javascript:void(0);" 
					 	onclick="ptDoView('${news._PK_}', '${news.NEWS_SUBJECT!""}');">
				</#if>-->
					 <!--此处是为了节省资源，故将作为图片路径-->
					 	<img  src="/file/${news.picture.FILE_ID}" width="${(imgWid)?number - 8}" height="${(imgHei)?number - 15}"
					 		style="padding:3px 3px 3px 3px;border: 1px solid #CCC;"/>
					 </a>
					 <#-- 去除悬浮链接-->
					<h3 class=product-name>
				<#if (news.NEWS_SUBJECT!"")?length lte 10>
					<a  href="javascript:void(0);" onclick="ptDoView('${news._PK_}', '${news.NEWS_SUBJECT}');">
						${news.NEWS_SUBJECT!""}</a>
				</#if>
				<#if (news.NEWS_SUBJECT!"")?length gt 10>
					<a  href="javascript:void(0);" onclick="ptDoView('${news._PK_}', '${news.NEWS_SUBJECT}');">
						${(news.NEWS_SUBJECT!"")[0..10]}...</a>
				</#if>
				 	</h3>
			  </li>
			</#list>
			<#list _DATA_ as news>
				<#if _DATA_?size == 1>
					<li class="item lase"></li>
				</#if>
			</#list>
		 </ul>
		 </div>
	</div>
	<div id="left_but" class="box-left"></div>
	<div id="right_but" class="box-right"></div>
	</div>
</div>
</div>
</div>
<script type=text/javascript>
	jQuery.fn.prepare_slider = function(){
		var x_pos = 0;
		var li_items_n = 0;	
		var right_clicks = 0;
		var left_clicks = 0;
		var li_col = jQuery("#slider_list > li");
		var li_width = li_col.outerWidth(true);
		var viewWindow = Math.round(jQuery('.block-slider').width()/li_width);
		li_col.each(function(index){
			x_pos += jQuery(this).outerWidth(true);
			li_items_n++;
		});
		right_clicks = li_items_n - viewWindow;
		total_clicks = li_items_n - viewWindow;
		jQuery('#slider_list').css({"position":"relative","left":"0px","width":x_pos + "px"});
		var is_playing = false;
		var completed = function() { is_playing = false;};
		jQuery('#left_but').click( function(){
			cur_offset = jQuery('#slider_list').position().left;
			if (!is_playing){
				if (left_clicks > 0) {
						is_playing = true; 
						jQuery('#slider_list').animate({'left': cur_offset + li_width + 'px'}, 700, "linear", completed); 
						right_clicks++; 
						left_clicks--;
					}
					else {
						is_playing = true;
						jQuery('#slider_list').animate({'left':    -li_width*total_clicks	+ 'px'}, 700, "linear", completed);
						right_clicks = 0;
						left_clicks = total_clicks;
					}
			}
		});
		jQuery('#right_but').click(function(){
			if (!is_playing){
				cur_offset = jQuery('#slider_list').position().left;
			 	if (right_clicks > 0) {
						is_playing = true;
						jQuery('#slider_list').animate({'left':cur_offset - li_width + 'px'},700, "linear", completed );
						right_clicks--; left_clicks++;
				}
				else {
						is_playing = true; jQuery('#slider_list').animate({'left':0	+ 'px'},700, "linear", completed );
						left_clicks = 0;
						right_clicks = total_clicks;
					}
			}
		});
	};
	jQuery.fn.over = function(){
	jQuery(this).hover(
	   function () {
	 	 jQuery(this).addClass("over");
	   },
	   function () {
	 	 jQuery(this).removeClass("over");
	   });
   };
   jQuery(document).ready(function(){
	jQuery().prepare_slider(); 
	jQuery('#slider_list > li').over();
	
	var slider_link = jQuery('#right_but');
	var slider_link_index = 1;
	var slider_count = jQuery('#slider_list > li').size();
	function slider_intro(){
		if(slider_link_index <= slider_count){
			slider_link.trigger('click');
			slider_link_index += 0;
			setTimeout(function(){slider_intro()}, "${speed?number}" * 1000);
		}
	}
	setInterval(function(){slider_intro()}, "${speed?number}" *1000);
	
	jQuery(".indent-col-main").bind("mouseleave",function(){
		slider_link_index = 1;
		jQuery("#right_but").hide();
		jQuery("#left_but").hide();
	}).bind("mouseover",function(){
		slider_link_index = slider_count + 1;
		jQuery("#right_but").show();
		jQuery("#left_but").show();
	});
	
	jQuery('#left_but').hover(
	   function () {
		 jQuery(this).addClass("over");
	   },
	   function () {
		 jQuery(this).removeClass("over");
	   });
	
	jQuery('#right_but').hover(
	   function () {
		 jQuery(this).addClass("over");
	   },
	   function () {
		 jQuery(this).removeClass("over");
	   });
	jQuery('.cms-home .products-grid li').hover(
	   function () {
		 jQuery(this).find('.product-name').stop(true, true).slideDown("slow");
	   },
	   function () {
		 jQuery(this).find('.product-name').hide("slow");
	   });
	});
	
	function ptDoView(id,name){
		var url = "/cms/SY_COMM_NEWS/" + id + ".html";			
		var opts={'scrollFlag':true , 'url':url,'tTitle':name,'menuFlag':3};
		top.Tab.open(opts);
	}
</script>