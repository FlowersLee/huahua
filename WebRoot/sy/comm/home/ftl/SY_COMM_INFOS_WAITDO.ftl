<div id='CM_INFOS_DEAL' class='portal-box ${boxTheme}'>
<script type="text/javascript">
function openKMCard(id,name) {
		var opts = {"tTitle":name,"url":"CM_INFOS_DEAL.card.do?pkCode=" + id,"menuFlag":3};
		Tab.open(opts);
}
function openKMList() {
		var opts = {"tTitle":"需要我处理的信息","url":"CM_INFOS_DEAL.list.do","menuFlag":3};
		Tab.open(opts);
}
</script>
<div class='portal-box-title ${titleBar}'><span class='portal-box-title-icon ${icon}'></span><span class="portal-box-title-label">${title}</span><span class="portal-box-hideBtn  conHeanderTitle-expand"></span><span class="portal-box-more"><a href="#" onclick="openKMList()"></a></span></div>
<div class='portal-box-con'>
<table width="100%">
<#if (_DATA_?size == 0)>
<tr><td align=center id='haha'>没有事务需要处理！</td></tr>
</#if>
<#list _DATA_ as content>
<tr>
<td width='10px'>
	<#if (content.NEWS_CHECKED == 20)>
		<img src='/sy/theme/default/images/icons/ok.png'>
	</#if>
	<#if (content.NEWS_CHECKED == 30)>
		<img src='/sy/theme/default/images/icons/exclamation.png'>
	</#if>

</td>
<td><a href="javascript:void(0);" onclick="openKMCard('${content.NEWS_ID}','待我处理的信息')" title="${content.NEWS_SUBJECT}">
<#if (content.NEWS_SUBJECT?length > 25)>${content.NEWS_SUBJECT?substring(0,25)}...<#else>${content.NEWS_SUBJECT}</#if>
</a></td>
<td>${content.NEWS_USER__NAME}</td>
<td>${content.NEWS_CHECK__NAME}</td>
<td>${content.NEWS_TIME}</td>
</tr>
</#list>
</table>
</div>
</div>
