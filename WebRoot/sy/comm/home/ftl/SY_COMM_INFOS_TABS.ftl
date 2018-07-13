<div id='COMM_INFOS' class='portal-box ${boxTheme}'>
<div id="COMM_INFOS_TABS" class='portal-box-con portal-box-tab'>
<ul class='portal-box-title'>
<li><a href="#COMM_INFOS_TABS_NOTICE">最新通知公告</a></li>
<li><a href="#COMM_INFOS_TABS_NIN">最新信息</a></li>
<li><a href="#COMM_INFOS_TABS_QK">最新期刊</a></li>
</ul>
<div id="COMM_INFOS_TABS_NOTICE">
<table width="100%">
<#if (_DATA_0._DATA_?size == 0)>
<tr><td align=center>没有事务需要处理！</td></tr>
</#if>
<#list _DATA_0._DATA_ as content>
<tr>
<td width='10px' style='font-size:8px;'>&nbsp;&#8226;</td>
<td><a href="javascript:void(0);" onclick="openTODOCard('${content.TODO_CODE}','${content.TODO_CODE_NAME}','${content.TODO_OBJECT_ID1}','待办-${content.TODO_TITLE}','${content.TODO_URL!}','${content.TODO_CONTENT!}','${content.TODO_ID!}','${content.OWNER_CODE!}','${content.TODO_CATALOG!}','${id}')" title="${content.TODO_TITLE}">
<#if (content.TODO_TITLE?length > 25)>${content.TODO_TITLE?substring(0,25)}...<#else>${content.TODO_TITLE}</#if>
</a></td>
<td>${content.SEND_USER_CODE__NAME}</td>
<td>${content.TODO_SEND_TIME}</td>
<td>${content.TODO_CODE_NAME!}</td>
</tr>
</#list>
</table>
</div>
<div id="COMM_INFOS_TABS_NIN">
<table width="100%">
<#if (_DATA_0._DATA_?size == 0)>
<tr><td align=center>没有主办需要处理！</td></tr>
</#if>
<#list _DATA_1._DATA_ as content>
<tr>
<td width='10px' style='font-size:8px;'>&nbsp;&#8226;</td>
<td><a href="javascript:void(0);" onclick="openTODOCard('${content.TODO_CODE}','${content.TODO_CODE_NAME}','${content.TODO_OBJECT_ID1}','主办-${content.TODO_TITLE}','${content.TODO_URL!}','${content.TODO_CONTENT!}','${content.TODO_ID!}','${content.OWNER_CODE!}','${content.TODO_CATALOG!}','${id}')" title="${content.TODO_TITLE}">
<#if (content.TODO_TITLE?length > 25)>${content.TODO_TITLE?substring(0,25)}...<#else>${content.TODO_TITLE}</#if>
</a></td>
<td>${content.SEND_USER_CODE__NAME}</td>
<td>${content.TODO_SEND_TIME}</td>
<td>${content.TODO_CODE_NAME!}</td>
</tr>
</#list>
</table>
</div>
<div id="COMM_INFOS_TABS_QK">
<table width="100%">
<#if (_DATA_0._DATA_?size == 0)>
<tr><td align=center>没有主办需要处理！</td></tr>
</#if>
<#list _DATA_1._DATA_ as content>
<tr>
<td width='10px' style='font-size:8px;'>&nbsp;&#8226;</td>
<td><a href="javascript:void(0);" onclick="openTODOCard('${content.TODO_CODE}','${content.TODO_CODE_NAME}','${content.TODO_OBJECT_ID1}','主办-${content.TODO_TITLE}','${content.TODO_URL!}','${content.TODO_CONTENT!}','${content.TODO_ID!}','${content.OWNER_CODE!}','${content.TODO_CATALOG!}','${id}')" title="${content.TODO_TITLE}">
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
</div>

<script type="text/javascript">
(function() {
    jQuery(document).ready(function(){
	    setTimeout(function() {
	      jQuery("#COMM_INFOS_TABS").tabs({});
	    },0);
    });
})();
</script>
