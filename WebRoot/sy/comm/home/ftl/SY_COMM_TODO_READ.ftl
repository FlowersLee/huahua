<div id='SY_COMM_TODO_READ' class='portal-box'>
<div class='portal-box-title'><span class='portal-box-title-icon icon_portal_todo'></span>
<span class="portal-box-title-label">待阅事务</span><span class="portal-box-hideBtn  conHeanderTitle-expand"></span>
<span class="portal-box-more"><a href="#" onclick="openMoreTodoListPage('2')"></a></span></div>
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
<td width="40%" align="left"><a href="javascript:void(0);" onclick="Todo.open('${content.TODO_CODE}','${content.TODO_TITLE}','${content.TODO_URL!}','${content.TODO_CONTENT!}','${content.TODO_ID!}','${content.TODO_OBJECT_ID1}');" title="${content.TODO_TITLE}">
<#if (content.TODO_TITLE?length > 25)>${content.TODO_TITLE?substring(0,25)}...<#else>${content.TODO_TITLE}</#if>
</a></td>
<td width="20%" align="center">${content.SEND_USER_CODE__NAME}</td>
<td width="20%" align="center">${content.TODO_SEND_TIME}</td>
<td  width="17" align="center">${content.TODO_CODE_NAME!}</td>
</tr>
</#list>
</table>
</div>
</div>