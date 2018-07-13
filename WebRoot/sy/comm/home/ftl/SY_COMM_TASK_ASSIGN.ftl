
<div id='SY_COMM_TASK_ASSIGN' class='portal-box ${boxTheme}'>
<div class='portal-box-title ${titleBar}'><span class='portal-box-title-icon ${icon}'>
</span><span class="portal-box-title-label">${title}
</span><span class="portal-box-hideBtn  conHeanderTitle-expand"></span>
<span class="portal-box-more"><a href="javascript:void(0);" onclick="openTaskMore()"></a></span></div>
<div class='portal-box-con'>
<table width="100%">
<#if (_DATA_?size == 0)>
<tr><td align=center id='haha'>您未分配过任务！</td></tr>
</#if>
<#list _DATA_ as content>

<tr>
<td style="width:2%;">&nbsp;&nbsp;●</td>
<td>
<a href="javascript:void(0);" onclick="openTaskTitle('${content.CAL_ID}');">
<#if (content.CAL_TITLE?length > 25)>${content.CAL_TITLE?substring(0,25)}...<#else>${content.CAL_TITLE}</#if></a></br>
 ${content.START_TIME}  --${content.END_TIME}
</td>
</tr>
</#list>
</table>
</div>
</div>
<script type="text/javascript" >
var servId = "${servId}";
var tTitle =  "${title}";
function openTaskMore() {

	var options = {"url": servId + ".list.do", "tTitle":tTitle, "menuFlag":"4"};
	Tab.open(options);
}

function openTaskTitle(CAL_ID){
 var options = {"url":servId + ".card.do?pkCode="+CAL_ID,"tTitle":tTitle,"menuFlag":"4"};
 Tab.open(options);
}
</script>
