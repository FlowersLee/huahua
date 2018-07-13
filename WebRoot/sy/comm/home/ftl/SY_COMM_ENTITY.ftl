<script type="text/javascript" >
function openMoreZhubanListPage() {
	var strWhere = " and (OWNER_CODE='@USER_CODE@' and OWNER_TYPE=1)  or (OWNER_CODE in (@ROLE_CODES@) and OWNER_TYPE=2)";
	var params = {"extWhere":strWhere};
	var opts = {"url":"SY_COMM_ENTITY.list.do", "tTitle":"个人主办", "menuFlag":4, "params":params};
	Tab.open(opts);
}


function openTitle(SERV_ID,DATA_ID){
 var options = {
 "url":SERV_ID+".card.do?pkCode="+DATA_ID,
 "tTitle":"个人主办"
 };
 Tab.open(options);
 
}
</script>
<div id='SY_COMM_ENTITY' class='portal-box'>
<div class='portal-box-title'><span class='portal-box-title-icon icon_portal_todo'></span><span class="portal-box-title-label">个人主办</span><span class="portal-box-hideBtn  conHeanderTitle-expand"></span><span class="portal-box-more"><a href="#" onclick="openMoreZhubanListPage()"></a></span></div>
<div class='portal-box-con'>

<table width="100%">
<#if (_DATA_?size == 0)>
<tr><td align=center id='haha'>没有事务需要处理！</td></tr>
</#if>
<#list _DATA_ as content>
<tr>
<td width='2%'>
	<#if (content.S_EMERGENCY == 2)>
		<img src='/sy/theme/default/images/icons/ok.png'>
	</#if>
	<#if (content.S_EMERGENCY == 3)>
		<img src='/sy/theme/default/images/icons/exclamation.png'>
	</#if>

</td>
<td  width="60%"><a href="javascript:void(0);"  onclick="openTitle('${content.SERV_ID!}','${content.DATA_ID!}');" >
<#if (content.TITLE?length > 25)>${content.TITLE?substring(0,25)}...<#else>${content.TITLE}</#if>
</a>
</td>
<td width="20%" align="center">${content.SERV_NAME}</td>
<td width="20%" align="center">${content.S_ATIME}</td>
</tr>
</#list>
</table>
</div>
</div>
