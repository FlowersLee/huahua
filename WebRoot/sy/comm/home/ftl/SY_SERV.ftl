<table width="100%">
<#list _DATA_ as content>
<tr style="height:22px">
<td>${content.SERV_ID!}</td>
<td>${content.S_FLAG!}</td>
<td>${content.SERV_NAME!"无"}</td>
</tr>
</#list>
</table>