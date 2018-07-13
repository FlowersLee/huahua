<table width="100%">
<#if (_DATA_?size == 0)>
<tr><td align=center>没有已办需要处理！</td></tr>
</#if>
<#list _DATA_ as content>
<tr>
<td><a href="javascript:void(0);" onclick="openTODOCard('${content.TODO_CODE}','${content.TODO_CODE_NAME}','${content.TODO_OBJECT_ID1}','已办-${content.TODO_TITLE}','${content.TODO_URL!}','${content.TODO_CONTENT!}','${content.TODO_ID!}')">${content.TODO_TITLE}</a></td>
<td>${content.SEND_USER_CODE__NAME}</td>
<td>${content.TODO_SEND_TIME}</td>
<td>${content.TODO_CODE_NAME!}</td>
</tr>
</#list>
</table>