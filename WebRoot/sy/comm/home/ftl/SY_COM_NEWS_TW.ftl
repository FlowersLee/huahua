<!-- 标题图文新闻  news  picture and text-->
<style>
.line-div{overflow: auto;_height: 1%;padding: 10px 0px 5px 0px;border-bottom: 1px dashed #CCC;}
.left-img{width:75px;height:80px;padding:3px 3px 3px 3px;border: 1px solid #CCC;}
.tw-a {text-decoration: none;color:#024775;font-size:12px;display:block;}
.tw-a:hover {text-decoration: underline;color:red;}
</style>
<script type="text/javascript">
	function twDoView(id,name){
		var url = "/cms/CM_NEWS/" + id + ".html";			
		var opts={'scrollFlag':true , 'url':url,'tTitle':name,'menuFlag':3};
		top.Tab.open(opts);
	}
</script>
<div class='portal-box ${boxTheme}' style='min-height:260px;'>
	<div class='portal-box-title'>
		<span class="portal-box-title-icon ${icon}"></span>
		<span class="portal-box-title-label">${title}</span>
	</div>
<div class='portal-box-con' style='height:${height};padding:3px 5px 5px 5px;'>
		<ul class="line-div">
		<#list _DATA_ as news>
				<#if news_index lt 4>
					<#if news_index == 0>
						<li style="float:left;width:15%;min-width:75px;">
					</#if>
					<#if news_index gt 0>
						<li style="float:left;width:15%;">
					</#if>
						<#if news_index == 0>
							<a href="javascript:void(0);" onclick="twDoView('${news._PK_}', '${news.NEWS_SUBJECT}');">
								<img src="${urlPath}/file/${news.NEWS_TITLE_IMAGE?substring(0,news.NEWS_TITLE_IMAGE?index_of(','))}?size=${small!''}" class="left-img"/>
							</a>
						</#if>
				</li>			
				<li style="float:left;width:72%;padding: 3px 0px 5px 10px;">
					<span style="float:left;display:block;">&#8226;&nbsp;</span>
					<a href="javascript:void(0);" onclick="twDoView('${news._PK_}', '${news.NEWS_SUBJECT}');" class="tw-a">
						<#if (news.NEWS_SUBJECT!"")?length gt 10>
							${news.NEWS_SUBJECT[0..10]}...</a>
						</#if>
						<#if (news.NEWS_SUBJECT!"")?length lte 10>
							${news.NEWS_SUBJECT!""}</a>
						</#if>
				</li>
			</#if>
		</#list>
		</ul>
		<#if _DATA_?size gt 4 >
			<ul class="line-div">
			<#list _DATA_ as news>
				<#if _DATA_?size gt 4 && news_index gt 3>
					<#if news_index % 2 == 0>
						<li><span style="float:left;">&#8226;&nbsp;</span>
					</#if>
						<a href="javascript:void(0);" onclick="twDoView('${news._PK_}', '${news.NEWS_SUBJECT}');" class="tw-a" style="float:left;margin:0px 20px 0px 0px;">
							<#if (news.NEWS_SUBJECT!"")?length gt 10>
								${news.NEWS_SUBJECT[0..10]}...</a>
							</#if>
							<#if (news.NEWS_SUBJECT!"")?length lte 10>
								${news.NEWS_SUBJECT!""}</a>
							</#if>
					<#if news_index % 2 == 0>
						</li>
					</#if>
				</#if>
			</#list>
		</ul>
		</#if>
  </div>
</div>