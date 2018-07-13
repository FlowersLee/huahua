<table width="100%">
	<#if (_DATA_?size == 0)>
	<tr>
		<td align=center>没有委办需要处理！</td>
	</tr>
	</#if>
	<#list _DATA_ as content>
	<tr>
		<td width='10px' style='font-size: 8px;'>&nbsp;&#8226;</td>
		<td>
			<a href="javascript:void(0);"
				onclick="openTODOCard('${content.TODO_CODE}','${content.TODO_CODE_NAME}','${content.TODO_OBJECT_ID1}','委办-${content.TODO_TITLE}','${content.TODO_URL!}','${content.TODO_CONTENT!}','${content.TODO_ID!}','${content.OWNER_CODE!}','${content.TODO_CATALOG!}','CM_TODO,CM_TODO_YUE')"
				title="${content.TODO_TITLE}"> 
				${content.TODO_TITLE}
			</a>
		</td>
		<td>${content.SEND_USER_CODE__NAME}</td>
		<td>${content.TODO_SEND_TIME}</td>
		<td>${content.TODO_CODE_NAME!}</td>
	</tr>
	</#list>
</table>

<#if (_DATA_?size != 0)>
<div class="TAB_SHOW_MORE">
	<a href="#" onclick="openMoreAgent('')">更多...</a>
</div>
<div style="clear:both;"></div>
</#if>