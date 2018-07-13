<#--新闻资讯排行 news ranking list-->
<style type="text/css">
.listOrder ul {margin:8px 0px;}
.listOrder .portal-box-li {line-height:26px;overflow:auto;border-bottom:1px #F6F4F4 dashed;}
.listOrder .portal-box-li a {font-size:12px;}
.listOrder .portal-box-span{
	display:block;margin:0px 15px 0px 5px;float:left;color:#0c3694;
	font-size:14px;font-weight:bold;font-variant:normal;font-style:italic;font-family:Arial, Helvetica;width:15px;}
.ranking-a {text-decoration: none;color:#000;}
.ranking-a:hover {text-decoration: underline;color:red;}
</style>
<script type="text/javascript">
	function randingListDoView(id,name){
		var url = "/cms/SY_COMM_NEWS/" + id + ".html";			
		var opts={'scrollFlag':true , 'url':url,'tTitle':name,'menuFlag':3};
		top.Tab.open(opts);
	}
</script>
<div id='SY_COM_LISTORDER' class='portal-box ${boxTheme} listOrder' style='min-height:200px;'>
	<div class='portal-box-title'>
		<span class='portal-box-title-icon ${icon}'></span>
		<span class="portal-box-title-label">${title}</span>
	</div>
	<div class='portal-box-con' style="height:${height}">
		<ul width="100%">
			<#list _DATA_ as news>
				<li class="portal-box-li">
					<#if news_index == 0>
						<span class="portal-box-span" style="color:#fe0000;">${news_index + 1}</span>
					</#if>
					<#if news_index == 1>
						<span class="portal-box-span" style="color:#ffac37;">${news_index + 1}</span>
					</#if>
					<#if news_index == 2>
						<span class="portal-box-span" style="color:#00adfc;">${news_index + 1}</span>
					</#if>
					<#if news_index gt 2>
						<span class="portal-box-span">${news_index + 1}</span>
					</#if>
					<a href="javascript:void(0)"; onclick="randingListDoView('${news._PK_}','${news.NEWS_SUBJECT}')" class="ranking-a">
					<#if (news.NEWS_SUBJECT!"")?length lte 10> 
						${news.NEWS_SUBJECT!""}
					</#if>
					<#if (news.NEWS_SUBJECT!"")?length gt 10> 
						${(news.NEWS_SUBJECT)[0..10]}...
					</#if>
					</a>
				</li>
			</#list>
		</ul>
	</div>
</div>