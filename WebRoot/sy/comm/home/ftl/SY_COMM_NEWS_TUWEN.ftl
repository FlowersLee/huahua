<div id='SY_COMM_NEWS' class='portal-box' style='min-height:200px'>
<div class='portal-box-title'><span class='portal-box-title-icon icon_portal_news'></span><span class="portal-box-title-label">图文</span><span class="portal-box-hideBtn conHeanderTitle-expand"></span><span class="portal-box-more"><a href="javascript:var opts={'sId':'allNews','tTitle':'所有栏目','url':'/SY_COMM_NEWS.allNews.do','menuFlag':4};Tab.open(opts);"></a></span></div>
<div class='portal-box-con'>
<table width="100%">
<#if (_DATA_?size == 0)>
<tr><td align=center>没有通知需要查看！</td></tr>
</#if>
<#list _DATA_ as content><!--<a target='_blank' href="ns/html/${content.NEWS_ID}.html">-->
<tr><td style='padding-left:10px;'><a title="${content.NEWS_SUBJECT}" href="javascript:var sId = new Date().getTime();Tab.open({'url':'/ns/news.jsp?id=${content.NEWS_ID}','id':'SY_COMM_NEWS_' + sId,'tTitle':'${content.NEWS_SUBJECT}','menuFlag':3,'scrollFlag':true});"><#if (content.NEWS_SUBJECT?length > 13)>${content.NEWS_SUBJECT?substring(0,12)}...<#else>${content.NEWS_SUBJECT}</#if></a></td>
<td>${content.NEWS_TIME}</td></tr>
</#list>
</table>
</div>
</div>