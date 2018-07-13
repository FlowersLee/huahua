<#--热点排行 news ranking list-->
<style type="text/css">
.portal-box-a {display:block;text-decoration: none;float:left;color:#000;font-size:14px;}
.portal-box-a:hover {text-decoration: underline;color:red;}
.portal-box-li{padding:5px 5px 5px 5px;overflow:auto;}
.portal-box-span{
	display:block;margin:0px 15px 0px 5px;float:left;color:#0c3694;
	font-size:14px;font-weight:bold;font-variant:normal;font-style:italic;font-family:Arial, Helvetica;}
</style>
<script type="text/javascript">
	function listOrderDoView(id,name){
		var url = "/cms/CM_NEWS/" + id + ".html";			
		var opts={'scrollFlag':true , 'url':url,'tTitle':name,'menuFlag':3};
		top.Tab.open(opts);
	}
</script>
<div id='SY_COM_LISTORDER' class='portal-box' style='min-height:200px'>
	<div class='portal-box-title'>
		<span class='portal-box-title-icon ${icon}'></span>
		<span class="portal-box-title-label">${title}</span>
		<span class="portal-box-hideBtn conHeanderTitle-expand"></span>
	</div>
	<div class='portal-box-con' style="height:${height}">
		<ul width="100%">
			<#list _DATA_ as news>
				<li class="portal-box-li">
					<span class="portal-box-span">${news_index + 1}</span>
					<a href="javascript:void(0)"; onclick="listOrderDoView('${news._PK_}','${news.NEWS_SUBJECT}')" class="portal-box-a">
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