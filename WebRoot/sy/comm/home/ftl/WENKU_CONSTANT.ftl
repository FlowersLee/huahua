<!-- 页面图片三种尺寸 -->
<#assign big="200x250"/>
<#assign small="42x57"/>
<#assign middle="150x200"/>
<!-- 页面图片三种尺寸 -->

<!-- 宏定义：设置默认图片_begin -->
<#macro setPic doc size>
	<#if (doc.DOCUMENT_FILE_SUFFIX!"")="mp3">
		/sy/comm/wenku/format/mp3.png
		<#elseif (doc.DOCUMENT_FILE_SUFFIX!"")="flv">
			/sy/comm/wenku/format/video2.png
		<#elseif doc.DOCUMENT_FILE_SNAPSHOT?? && doc.DOCUMENT_FILE_SNAPSHOT?length gt 0>
			/file/${doc.DOCUMENT_FILE_SNAPSHOT}?size=${size!''}
		<#else>
			/sy/comm/wenku/format/unknown2.png
	</#if>
</#macro>
<!-- 宏定义：设置默认图片_end -->

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
<#assign root_channel_id="WENKU_3hWpJcmkZcNHarHMgIvMm2"/>
<!-- 站点id 和 根栏目id -->

<!-- 文档上传模板ID_begin -->
<#assign upload_tmpl_id="1W2A6nSlp0noco4zLfYUuw"/>
<!-- 文档上传模板ID_end -->
