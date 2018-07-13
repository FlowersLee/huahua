<#include "WENKU_CONSTANT.ftl">
<script type="text/javascript">
	/* 热门文档排行榜 */
  	jQuery(document).ready(function(){
      jQuery(".new_tab").bind("mouseover",function() {
         var _this = jQuery(this);
		 jQuery("ul[id^='con_ul']").css("display","none");
		 jQuery("#"+_this.attr("conul")).css("display","block");
		 jQuery(".new_tab").removeClass("tabSelected");
		 _this.addClass("tabSelected");
      });
    });
	/* 热门文档排行榜 */
	function docView(id,name){
		var url = "/wenku/content/" + id + ".html";	
		var opts={'scrollFlag':true , 'url':url,'tTitle':name,'menuFlag':4};
		Tab.open(opts);
	}
</script>
<!-- 热门文档排行榜 -->
<div class='portal-box tabs-portal ${boxTheme}' style='height:${height};min-height:200px'>
	<div id="tabs-portal-tab-id" class="portal-box-title">
	  <ul>
	    <li class="new_tab tabSelected" conul="con_ul1">阅读榜</a></li>
	    <li class="new_tab" conul="con_ul2">下载榜</li>
	  </ul>
	</div>
	<div class='portal-box-con' style='height:${height};margin-top:10px;'>
		<ul id="con_ul1" class="list3" style="display: block;">
		<#list _DATA_0._DATA_ as doc>
	    	<li class="unknown ${doc.DOCUMENT_FILE_SUFFIX!'txt'}">
	    		<a title="${doc.DOCUMENT_TITLE}"  href="javascript:docView('${doc.DOCUMENT_ID}', '${doc.DOCUMENT_TITLE}');">${doc.DOCUMENT_TITLE}</a><br>
				阅读：${doc.DOCUMENT_READ_COUNTER!0}次</li>
		</#list>
		</ul>
		<ul style="display:none" id="con_ul2" class="list3">
		<#list _DATA_1._DATA_ as doc>
			<li class="unknown ${doc.DOCUMENT_FILE_SUFFIX!'txt'}">
				<a title="${doc.DOCUMENT_TITLE}"  href="javascript:docView('${doc.DOCUMENT_ID}', '${doc.DOCUMENT_TITLE}');">${doc.DOCUMENT_TITLE} </a><br>
				下载：${doc.DOCUMENT_DOWNLOAD_COUNTER!0}次</li>
		</#list>
		</ul> 
		<script type="text/javascript">
		  
		</script>
	</div>
</div>
<!-- 热门文档排行榜 -->