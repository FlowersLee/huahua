<!-- 标题新闻  news   title-->
<style>
.ht-line-div{overflow: hidden;_height: 1%;padding: 10px 5px 5px 10px;border-bottom: 1px dashed #CCC;}
.left-img{width:75px;height:80px;padding:3px 3px 3px 3px;border: 1px solid #CCC;}
.ht-a {text-decoration: none;color:#024775;font-size:12px;font-weight:bold;}
.ht-a:hover {text-decoration: underline;color:red;}
</style>
<script type="text/javascript">
	function htDoView(id,name){
		var url = "/cms/SY_COMM_NEWS/" + id + ".html";			
		var opts={'scrollFlag':true , 'url':url,'tTitle':name,'menuFlag':3};
		top.Tab.open(opts);
	}
</script>
<div class='portal-box ${boxTheme}' style='min-height:200px;'>
	<div class='portal-box-title'>
		<span class="portal-box-title-icon ${icon}"></span>
		<span class="portal-box-title-label">${title}</span>
	</div>
<div class='portal-box-con' style='height:${height};padding:3px 0px 5px 0px;'>
		<#list _DATA_ as news>
			<div class="ht-line-div">
				<div style="float:left;width:15%;min-width:75px;">
					<a href="javascript:void(0);" onclick="htDoView('${news._PK_}', '${news.NEWS_SUBJECT}');">
						<img src="${urlPath}/file/${news.NEWS_TITLE_IMAGE?substring(0,news.NEWS_TITLE_IMAGE?index_of(','))}?size=${small!''}" class="left-img"/>
					</a>
				</div>
				<div style="float:left;width:70%;padding: 5px 0px 0px 15px;">
					<a href="javascript:void(0);" onclick="htDoView('${news._PK_}', '${news.NEWS_SUBJECT}');" class="ht-a">
						<#if (news.NEWS_SUBJECT!"")?length gt 10>
							${news.NEWS_SUBJECT[0..10]}...</a>
						</#if>
						<#if (news.NEWS_SUBJECT!"")?length lte 10>
							${news.NEWS_SUBJECT!""}</a>
						</#if>
						<br/>
					<p style="padding:10px 0px 0px 0px;line-height:180%;color:black;">
						<#if (news.NEWS_SUMMARY!"")?length gt 50>
							${news.NEWS_SUMMARY[0..50]}...</p>
						</#if>
						<#if (news.NEWS_SUMMARY!"")?length lte 40>
							${news.NEWS_SUMMARY!""}</p>
						</#if>
				</div>
				</div>
		</#list>
  </div>
</div>