<div id='SY_COMM_TODO_DEMO' class='portal-box ${boxTheme}'>
<div class='portal-box-title ${titleBar}'><span class='portal-box-title-icon ${icon}'></span><span class="portal-box-title-label">${title}</span><span class="portal-box-hideBtn  conHeanderTitle-expand"></span><span class="portal-box-more"><a href="#" onclick="openMoreTodoListPage('1')"></a></span></div>
<div class='portal-box-con'>
<table width="100%">
<#if (_DATA_?size == 0)>
<tr><td align=center id='haha'>没有事务需要处理！</td></tr>
</#if>
<#list _DATA_ as content>
<tr>
<td width='10px'>
	<#if (content.S_EMERGENCY == 20)>
		<img src='/sy/theme/default/images/icons/ok.png'>
	</#if>
	<#if (content.S_EMERGENCY == 30)>
		<img src='/sy/theme/default/images/icons/exclamation.png'>
	</#if>

</td>
<td><a href="javascript:void(0);" class='TODO_DEMO' id='${content.TODO_ID}' title="${content.TODO_TITLE}">
<#if (content.TODO_TITLE?length > 25)>${content.TODO_TITLE?substring(0,25)}...<#else>${content.TODO_TITLE}</#if>
</a></td>
<td>${content.SEND_USER_CODE__NAME}</td>
<td>${content.TODO_SEND_TIME}</td>
<td>${content.TODO_CODE_NAME!}</td>
</tr>
</#list>
</table>
</div>
</div>
<script type="text/javascript">
function openMoreTodoListPage() {
    var url = "http://localhost:8086/ff/sy/comm/page/page.jsp?openTab={'tTitle':'模版添加','url':'SY_COMM_TEMPL.card.do','menuId':'ruahoSY_PORTAL'}";
	window.open(url,'newwindow');
}
jQuery(document).ready(function(){ 
   jQuery(".TODO_DEMO").bind("click",function(event) {
      var id = jQuery(this).attr("id");
      var url = "http://localhost:8086/ff/sy/comm/page/page.jsp?openTab={'tTitle':'待办事物','url':'SY_COMM_TODO.card.do?pkCode=" + id + "','menuId':'ruahoCM_TODO'}";
	  window.open(encodeURI(url),'newwindow',"alwaysRaised=yes");
   })
});
</script> 