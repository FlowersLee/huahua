<!-- 宏定义：设置栏目默认图片_begin -->
<#macro setPic channel default>
	<#if (channel.CHNL_IMAGE)?? && channel.CHNL_IMAGE?length gt 0>
		<#if channel.CHNL_IMAGE?index_of(",") != -1 >
			/file/${channel.CHNL_IMAGE?substring(0,channel.CHNL_IMAGE?index_of(","))}
			<#else>/file/${channel.CHNL_IMAGE}
		</#if>
		<#else>${default}
	</#if>
</#macro>
<!-- 宏定义：设置栏目默认图片_end -->

<!-- 宏定义：字符串截串_begin -->
<#macro text_cut s length>
	<#if s?length gt length>
		${s[0..(length-1)]}...
		<#else>${s}
	</#if>
</#macro>
<!-- 宏定义：字符串截串_end -->

<!-- 站点id 和 根栏目id -->
<#assign site_id="CM_CMS"/>
<#assign root_channel_id="BBS_3hWpJcmkZcNHarHMgIvMm2"/>
<!-- 站点id 和 根栏目id -->
