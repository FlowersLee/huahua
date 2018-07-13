<style type="text/css">
	.portal-box-con td {
	  white-space:normal;
	  word-break:break-all;
	  color:black;
	}
	td a.title {
		color: #006699;
		text-decoration: none;
		font-weight:bold;
		font-size:1.2em;
	}
	td a.title:hover{
		color: #bc2a4d;
		text-decoration: underline;
	}
</style>
<script type="text/javascript">
	function newsView(id,name){
		var url = "/cms/SY_COMM_NEWS/" + id + ".html";			
		var opts={'scrollFlag':true , 'url':url,'tTitle':name,'menuFlag':3};
		Tab.open(opts);
	}
</script>
<!-- 最新新闻_begin -->
<div class='portal-box ${boxTheme!""}' style='min-height:200px;'>
	<div class='portal-box-title'>
		<span class="portal-box-title-icon ${icon}"></span>
		<span class="portal-box-title-label">${title}</span>
	</div>
	<div class='portal-box-con' style='height:${height};'>
		<table width="100%" border="0" cellpadding="0" cellspacing="0">
			<#list _DATA_ as news>
			<tr>
				<td style="border:none;">
					<a href="javascript:newsView('${news.NEWS_ID}', '${news.NEWS_SUBJECT}');" class="title" title="${news.NEWS_SUBJECT}">
						<#if news.NEWS_SUBJECT?length gt 30>
							${news.NEWS_SUBJECT[0..29]}...
							<#else>${news.NEWS_SUBJECT}
						</#if>
					</a>
				</td>
			</tr>
			<tr>
				<td style="height:60px">
					<#if news.NEWS_SUMMARY?length gt 80>
						${news.NEWS_SUMMARY[0..79]}......
						<#else>${news.NEWS_SUMMARY}
					</#if>
					<a href="javascript:newsView('${news.NEWS_ID}', '${news.NEWS_SUBJECT}');">[详情]</a>
				</td>
			</tr>
			</#list>
		</table>
	</div>
</div>
<!-- 最新新闻_begin -->
