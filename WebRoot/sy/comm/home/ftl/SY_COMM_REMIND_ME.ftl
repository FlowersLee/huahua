<script type="text/javascript" >

function openMore() {
	
	var	tTitle = "提醒我的";
	var opts = {"url":"SY_COMM_REMIND_ME.list.do", "tTitle":tTitle, "menuFlag":"4", "params":"{}"};
	Tab.open(opts);
}


function openTitle(REM_ID){
 var options = {
 "url":"SY_COMM_REMIND_ME.card.do?pkData="+REM_ID,
 "tTitle":"提醒我的"
 };
 Tab.open(options);
}




</script>




<div id='SY_COMM_REMIND_ME' class='portal-box'>
<div class='portal-box-title'><span class='portal-box-title-icon icon_portal_todo'></span><span class="portal-box-title-label">提醒我的</span><span class="portal-box-hideBtn  conHeanderTitle-expand"></span><span class="portal-box-more"><a href="#" onclick="openMore()"></a></span></div>
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
<td width="35%" align="left"> <a href="javascript:void(0);" onclick="openTitle('${content.REM_ID}');">
<#if (content.REM_TITLE?length > 25)>${content.REM_TITLE?substring(0,25)}...<#else>${content.REM_TITLE}</#if>
</a></td>

<td width="40%" align="center">${content.REM_CONTENT}</td>
<td width="10%" align="center">${content.S_USER}</td>
<td width="20%" align="center">${content.EXECUTE_TIME}</td>
</tr>
</#list>
</table>
</div>
</div>
