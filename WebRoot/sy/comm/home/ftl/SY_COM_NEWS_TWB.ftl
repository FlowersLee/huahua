<!-- 标题图文新闻B  news  picture and text-->
<style>
	.twb-div li{display: inline;float: left;margin: 0px 10px 10px 0;padding: 1px;border: 1px solid #D4DBD3;position: relative;overflow: hidden;}
	.twb-div li p{
	<#if (imgWid!"")?length ==0 || (imgHei!"")?length ==0>
		width: 121px;top:79px;
		<#else>
			width:${imgWid?number - 9}px;top:${imgHei?number - 19}px;
	</#if>
	padding: 3px 4px 3px;background: black;color: white;text-align: center;position: absolute;left: 1px;filter: Alpha(Opacity = 60);opacity: 0.6;}-->
	.twb-a {text-decoration: none;color:#FFF;font-size:12px;}
	.twb-a:hover {text-decoration: underline;}
</style>
<script type="text/javascript">
	<#--链接跳转 -->
	function twbDoView(id,name){
		var url = "/cms/CM_NEWS/" + id + ".html";	
		var opts={'scrollFlag':true , 'url':url,'tTitle':name,'menuFlag':3};
		top.Tab.open(opts);
	}
</script>
<div class='portal-box ${boxTheme}' style='min-height:110px;'>
	<div class='portal-box-title'>
		<span class="portal-box-title-icon ${icon}"></span>
		<span class="portal-box-title-label">${title}</span>
	</div>
	<div class='portal-box-con' style='height:${height};padding:10px 0px 5px 10px;overflow:hidden;'>
		<div class="twb-div">
			<ul>
				<#list _DATA_ as news>
				<li>
					<a target="_blank" href="javascript:void(0);" onclick="twbDoView('${news._PK_}', '${news.NEWS_SUBJECT}');">
						<img src="${urlPath}/file/${news.NEWS_TITLE_IMAGE?substring(0,news.NEWS_TITLE_IMAGE?index_of(','))}?size=${small!''}" 
						<#if (imgWid!"")?length ==0 || (imgHei!"")?length ==0>
							width="130px" height="98px">
							<#else>
								width="${imgWid?number}px" height="${imgHei?number}px">
						</#if>
					</a>
					<p>
						<a target="_blank" href="javascript:void(0);" onclick="twbDoView('${news._PK_}', '${news.NEWS_SUBJECT}');" class="twb-a" style="color:#FFF;">
							<#if (news.NEWS_SUBJECT!"")?length gt 8>
								${news.NEWS_SUBJECT[0..7]}...
							</#if>
							<#if (news.NEWS_SUBJECT!"")?length lte 8>
								${news.NEWS_SUBJECT!""}
						</#if>
						</a>
					</p>
				</li>
				</#list>
			</ul>
		</div>
  </div>
</div>