<!-- 宏定义：字符串截串_begin -->
<#macro text_cut s length>
	<#if s?length gt length>
		${s[0..(length-1)]}...
		<#else>${s}
	</#if>
</#macro>
<!-- 宏定义：字符串截串_end -->