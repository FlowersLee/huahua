<script type="text/javascript">
	function newsView(id,name){
		var url = "/cms/SY_COMM_NEWS/" + id + ".html?group=true";			
		var opts={'scrollFlag':true , 'url':url,'tTitle':name,'menuFlag':1};
		Tab.open(opts);
	}
	function getTimeAgo(time){
		var timeago = "";
		if (time) {
			timeago = time;
			timeago = timeago.substring(0, 19);
			timeago = jQuery.timeago(timeago); 
		}
		return timeago;
	}
</script>
<style type="text/css">
	.portal-box .portal-box-title .more {
		float:right;
		line-height:31px;
		cursor:pointer;
	}
</style>
<div class='portal-box ${boxTheme!""}' style='min-height:200px;'>
	<div class='portal-box-title'>
		<span class="portal-box-title-icon ${icon}"></span>
		<span class="portal-box-title-label">${title}</span>
		<span class="more" onclick="window.location='/sy/comm/page/SY_COMM_TEMPL.show.do?model=view&pkCode=1bRguovI51MoLpHXXLdrg5&$SITE_ID$=${SITE_ID!}';">查看更多&gt;&gt;</span>
	</div>
	<div class='portal-box-con' style='height:${height};'>
		<table width="100%" border="0" cellpadding="0" cellspacing="0">
			<#list _DATA_ as news>
			<tr>
				<td style="border-bottom: 1px #ccc dashed;">
					<a href="javascript:newsView('${news.NEWS_ID}', '${news.NEWS_SUBJECT}');">
						${news.NEWS_SUBJECT!""}
					</a>
				</td>
				<td style="border-bottom: 1px #ccc dashed;" id="news${news_index}">
					<script type="text/javascript">
						jQuery(document).ready(function(){
							<#list _DATA_ as news>
							jQuery("#news${news_index}").html("<div title='${news.NEWS_TIME}'>"+getTimeAgo("${news.NEWS_TIME}")+"</div>");
							</#list>
						});
					</script>
				</td>
				<td style="border-bottom: 1px #ccc dashed;">${news.S_UNAME!news.S_USER!""}</td>
			</tr>
			</#list>
		</table>
	</div>
</div>

		