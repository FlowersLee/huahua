<#include "WENKU_CONSTANT.ftl">
<script type="text/javascript">
	/* 焦点 */
	jQuery(".r #tab01 li").mouseover(function(){
		jQuery(".r #tab01 li span").attr("class","");
		jQuery(this).find("span").attr("class","here");
		jQuery("#tab01_Content0,#tab01_Content1,#tab01_Content2").css("display","none");
		jQuery("#tab01_Content"+jQuery(".r #tab01 li").index(this)).css("display","block");
	});
	/* 焦点 */
	
	function docView(id,name){
		var url = "/wenku/content/" + id + ".html";	
		var opts={'scrollFlag':true , 'url':url,'tTitle':name,'menuFlag':4};
		top.Tab.open(opts);
	}
</script>
<!-- 焦点图 -->	
<div class="jdt portal-box">
	<div class='portal-box-title ${titleBar}'>
		<span class="portal-box-title-icon ${icon}"></span>
		<span class="portal-box-title-label">${title}</span>
	</div>
	<div class='portal-box-con' style='height:${height};'>
	<#list _DATA_ as doc>
	<#if doc_index = 0>
	<div id="tab01_Content0" class="l" style="display:block;">
	<#elseif doc_index = 1><div id="tab01_Content1" class="l ll" style="display:none;">
	<#else><div id="tab01_Content2" class="l lll" style="display:none;">
	</#if>
		<div class="tj"></div>
		<div class="imgl"><a href="javascript:docView('${doc.DOCUMENT_ID}', '${doc.DOCUMENT_TITLE}');">
			<img width="138" height="187" alt="${doc.DOCUMENT_TITLE!''}" 
			src="<@setPic doc big/>">
		</div>
		<div class="textr">
			<div class="t"><a href="javascript:docView('${doc.DOCUMENT_ID}', '${doc.DOCUMENT_TITLE}');">${doc.DOCUMENT_TITLE!''}</a></div>
			<div class="t1"><a href="javascript:void(0)"></a></div>
			<p>${doc.DOCUMENT_DESCRIPTION!''}</p>
		</div>
	</div>
	</#list>
	
	<div class="r">
	<ul id="tab01">
	<#list _DATA_ as doc>
	 <li>
	 	<span>
	 		<div class="imgl1"><a href="javascript:docView('${doc.DOCUMENT_ID}', '${doc.DOCUMENT_TITLE}');">
	 			<img width="42" height="57" alt="${doc.DOCUMENT_TITLE!''}" 
				src="<@setPic doc small/>">
			</div>
			<div class="textr1"><a title="${doc.DOCUMENT_TITLE!''}" href="javascript:docView('${doc.DOCUMENT_ID}', '${doc.DOCUMENT_TITLE}');">${doc.DOCUMENT_TITLE!''}</a></div>
		</span>
	</li>
	</#list>
	</ul>
</div>
</div>
</div>