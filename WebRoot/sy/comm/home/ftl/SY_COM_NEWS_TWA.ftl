<!-- 标题图文新闻A  news  picture and text-->
<style>
	.twa-a {text-decoration: none;font-size:14px;float:left;color:black;}
	.twa-a:hover {text-decoration: underline;color:red;}
	.twa-first-div{border-bottom: 1px dashed #CCC;}
	.twa-div{border-top:1px dashed #FFF;padding:8px 0px 0px 0px;margin:5px;}
	.twa-div:hover{background-color:#f5f9fc;border-top: 1px dashed #CCC;}
	.twa-img{width:75px;height:80px;padding:3px 3px 3px 3px;margin:0px 0px 8px;border: 1px solid #CCC;}
</style>
<script type="text/javascript">
	<#--链接跳转 -->
	function twaDoView(id,name){
		var url = "/cms/CM_NEWS/" + id + ".html";			
		var opts={'scrollFlag':true , 'url':url,'tTitle':name,'menuFlag':3};
		top.Tab.open(opts);
	}
	
	<#--隐藏图片 -->
	function imgHide(id){
		jQuery("div[name='img-hide-div']").hide();
		jQuery("#" + id).show();
	}
	
	<#--div鼠标事件 -->
	function onMouseDiv(obj){
		jQuery(obj).find("a").css({"color":"blue"});
	}
	
	function outMouseDiv(obj){
		jQuery(obj).find("a").css({"color":"black"});
	}
</script>
<div class='portal-box ${boxTheme}' style='min-height:260px;'>
	<div class='portal-box-title'>
		<span class="portal-box-title-icon ${icon}"></span>
		<span class="portal-box-title-label">${title}</span>
	</div>
	<div class='portal-box-con' style='height:${height};padding:0px 0px 5px 0px;overflow:hidden;'>
	<#list _DATA_ as news>
		<div class="twa-div" onmouseover="onMouseDiv(this);" onmouseout="outMouseDiv(this);">
			<div style="">
			<a class="twa-a" style="display:block;width:100%;margin:0px 0px 0px 18px;height:25px;" href="javascript:void(0);" onmouseover="imgHide('${news._PK_}');" 
				target="_blank" onclick="twaDoView('${news._PK_}','${news.NEWS_SUBJECT!""}');">
			<#if (news.NEWS_SUBJECT!"")?length lte 10>
				${news.NEWS_SUBJECT!""}
			</#if>
			<#if (news.NEWS_SUBJECT!"")?length gt 10>
				${(news.NEWS_SUBJECT!"")[0..10]}...
			</#if>
			</a></br>
			<div style="overflow:hidden;width:100%;
				<#if news_index gt 0>
					display:none;
				</#if>
				" name="img-hide-div" id="${news._PK_}"  class="twa-first-div">
				<div style="float:left;margin:0px 5px 0px 18px;">
					<a target="_blank" class="twa-a" href="javascript:void(0);" onclick="twaDoView('${news._PK_}','${news.NEWS_SUBJECT!""}');">
						<img src="${urlPath}/file/${news.NEWS_TITLE_IMAGE?substring(0,news.NEWS_TITLE_IMAGE?index_of(','))}?size=${small!''}" class="twa-img">
					</a>
				</div>
				<div style="float:left;width:50%;padding:10px 0px 10px 5px;">
					<p style="color:black;">
					<#if (news.NEWS_SUMMARY!"")?length gt 50>
							${news.NEWS_SUMMARY[0..50]}...
						</#if>
						<#if (news.NEWS_SUMMARY!"")?length lte 40>
							${news.NEWS_SUMMARY!""}
						</#if>
					</p>
				</div>
			</div>
			</div>
		</div>
	</#list>
	<div style="padding:8px 0px 0px 0px;margin:5px;"></div><#-- 解决鼠标放到最后一个会出现抖动现象-->
  </div>
</div>