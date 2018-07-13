<#--热点新闻列表形式 -->
<style type="text/css">
.hotList {}
.hotList {margin:8px 0px 8px 8px;}
.hotListLi {line-height:26px;}
.hotListLi a {text-decoration:none;color:black;font-size:14px;}
.hotListLi a:hover {text-decoration:underline}
.hotListLiSpan {color:#F00005;}
#NE_HOT_LIST .portal-box-title {border-bottom:2px #FF6600 solid;}
#NE_HOT_LIST .portal-box-title-label {background-color:#FF6600;color:white;padding:10px;}
</style>
<div id='NE_HOT_LIST' class='portal-box ${boxTheme}' style='min-height:220px;'>
<div class='portal-box-title'><span class='portal-box-title-icon ${icon}'></span><span class="portal-box-title-label">${title}</span></div>
<div class='portal-box-con' style="overflow: auto;height:${height};">
<div  style='float:left;'>
<ul class="hotList" >
<#list _DATA_ as content>
	<li class="hotListLi">
	<#if (content.NEWS_SUBJECT!"")?length lte 20>
	    <span class="hotListLiSpan">&#187;</span>
		<a href="javascript:void(0);" onclick="doView('${content._PK_}','${content.NEWS_SUBJECT!""}');" target="_blank" >${content.NEWS_SUBJECT!""}</a>
	</#if>
	<#if (content.NEWS_SUBJECT!"")?length gt 20>
	    <span class="hotListLiSpan">&#187;</span>
		<a href="javascript:void(0);" onclick="doView('${content._PK_}','${content.NEWS_SUBJECT}');" target="_blank" >${(content.NEWS_SUBJECT)[0..20]}...</a>
	</#if>	
	</li>
</#list>
</ul>
</div>
<!--新闻结束-->
</div>
</div>
<script type="text/javascript">
(function() {
    jQuery(document).ready(function(){
    });
})();
function hotListView(id,name){
		var url = "/cms/SY_COMM_NEWS/" + id + ".html";			
		var opts={'scrollFlag':true , 'url':url,'tTitle':name,'menuFlag':4};
		top.Tab.open(opts);
	}
</script>