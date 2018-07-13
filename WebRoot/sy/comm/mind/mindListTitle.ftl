<!--本机构  意见列表表头  如果本机构列表中有意见  --> 
<#if existCurOdeptMind=true>
	<div class="mindODeptTable" id='mind${userBean.ODEPT_CODE}' deptCode='${userBean.ODEPT_CODE}' border="0">
		<#if odeptList?size gt 1> 
		    <span class='left mindOdpt' deptCode='${userBean.ODEPT_CODE}' style='cursor:pointer'>本机构</span><span class='left'>&nbsp;&nbsp;</span>
		</#if> 
		<span class='mindSortClick <#if sortType="TYPE" >mindTypeSelected</#if>' deptCode='${userBean.ODEPT_CODE}' sortType="TYPE" style='cursor:pointer'>按类别排序</span>
        <span class='left'>&nbsp;&nbsp;</span>
		<span class='mindSortClick <#if sortType="TIME" >mindTypeSelected</#if>' deptCode='${userBean.ODEPT_CODE}' sortType="TIME" style='cursor:pointer'>按时间排序</span>
	</div>
	<div id="mindContent${userBean.ODEPT_CODE}">
		<#include "mindList.ftl">
	</div>
</#if>

<#assign odeptList = userMind.getOdeptList() > 
<!--机构数大于1的时候，显示机构名称-->
<#list odeptList as odept>
	<#if odept.DEPT_CODE != userBean.ODEPT_CODE >
		<div class="mindODeptTable fl" id='mind${odept.DEPT_CODE}' deptCode='${odept.DEPT_CODE}' border="0">
			<#if odeptList?size gt 0> 
			    <span class='left mindOdpt' deptCode='${odept.DEPT_CODE}' style='cursor:pointer'>${odept.DEPT_NAME}</span><span class='left'>&nbsp;&nbsp;</span>
			</#if> 
			<span class='mindSortClick' sortType="TYPE" deptCode='${odept.DEPT_CODE}' style='cursor:pointer'>按类别排序</span>
	        <span class='left'>&nbsp;&nbsp;</span>
			<span class='mindSortClick' sortType="TIME" deptCode='${odept.DEPT_CODE}' style='cursor:pointer'>按时间排序</span>
		</div>
		<div id="mindContent${odept.ODEPT_CODE}"></div>
	</#if>
</#list>
