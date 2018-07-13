<#include "WENKU_CONSTANT.ftl">
<script type="text/javascript">
	function docView(id,name){
		var url = "/wenku/content/" + id + ".html";	
		var opts={'scrollFlag':true , 'url':url,'tTitle':name,'menuFlag':4};
		Tab.open(opts);
	}
</script>
<!-- 最新上传 -->
<div class="wenku-upload">
<div class='portal-box ${boxTheme!""}' style='min-height:200px;'>
	<div class='portal-box-title'>
		<span class="portal-box-title-icon ${icon}"></span>
		<span class="portal-box-title-label">${title}</span>
	</div>
	<div class='portal-box-con' style='height:${height};margin-top:10px;'>
		<ul id="tab_Content" class="list3" style="display: block;">
		<#list _DATA_ as doc>
	    	<li class="unknown ${doc.DOCUMENT_FILE_SUFFIX!'txt'}">
	    		<a title="${doc.DOCUMENT_TITLE}"  href="javascript:docView('${doc.DOCUMENT_ID}', '${doc.DOCUMENT_TITLE}');">${doc.DOCUMENT_TITLE}</a>
				<br/>
				<#if (doc.S_UNAME)??>
					${doc.S_UNAME!''}
					<#else>${doc.S_USER!''}
				</#if>
				&nbsp;上传于：${doc.S_CTIME!''}
			</li>
		</#list>
		</ul>
	</div>
</div>
</div>	
<!-- 最新上传 -->
