<!--按照机构显示意见的列表-->
<table class="mindTable wp" style="float:left;table-layout:fixed;word-wrap: break-word;word-break: break-all;margin-bottom:15px;" id="mindTable${odeptCode}" sortType="${sortType}" border="1" cellspacing="0" cellpadding="0" width="100%">
<#if mindTypeList?size != 0>
    <#if sortType = 'TIME'> <!--按照时间排序-->
		<#include "mindListByTime.ftl">
    <#else> <!--按照类型分组  再排序-->
        <#include "mindListByType.ftl">
	</#if>
</#if>
</table>