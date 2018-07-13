<div id='SY_COMM_TODO' class='portal-box portal-box-border'>
<script type="text/javascript">
function openKMCard(id,name) {
		var opts = {"tTitle":name,"url":"SY_COMM_KM.card.do?pkCode=" + id,"menuFlag":3};
		Tab.open(opts);
}
function openKMList() {
		var opts = {"tTitle":"知识库","url":"SY_COMM_KM.list.do","menuFlag":3};
		Tab.open(opts);
}
</script>
<div class='portal-box-title'><span class='portal-box-title-icon ${icon}'></span><span class="portal-box-title-label">${title}</span><span class="portal-box-hideBtn  conHeanderTitle-expand"></span><span class="portal-box-more"><a href="#" onclick="openKMList()"></a></span></div>
<div class='portal-box-con' style='height:${height};'>
<table width="100%">
<#if (_DATA_?size == 0)>
<tr><td align=center id='haha'>没有新知识！</td></tr>
</#if>
<#list _DATA_ as content>
<tr>
<td>&#8226;&nbsp;&nbsp;<a href="javascript:void(0);" onclick="openKMCard('${content.KM_ID}','<#if (content.KM_TITLE?length > 6)>${content.KM_TITLE?substring(0,6)}..<#else>${content.KM_TITLE}</#if>')" title="${content.KM_TITLE}">
<#if (content.KM_TITLE?length > 25)>${content.KM_TITLE?substring(0,25)}...<#else>${content.KM_TITLE}</#if>
</a></td>
<td>${content.S_USER__NAME}</td>
<td>${content.S_MTIME?substring(0,10)}</td>
</tr>
</#list>
</table>
</div>
</div>

