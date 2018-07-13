<#include "WENKU_CONSTANT.ftl">
<script type="text/javascript">
	function docView(id,name){
		var url = "/wenku/content/" + id + ".html";	
		var opts={'scrollFlag':true , 'url':url,'tTitle':name,'menuFlag':4};
		Tab.open(opts);
	}
	jQuery(document).ready(function(){
		/* 浮动提示 */
		jQuery(".cont3 .c #ul1 .h113").mouseover(function(){
			jQuery(this).addClass("h114");
			jQuery(this).find("div.title").css("display","block");
			var _this = jQuery(this);
			_this.mouseout(function(){
				_this.find("div.title").css("display","none");
				_this.removeClass().addClass("h113");
			});
			_this.click(function(){
				_this.find("div.title").css("display","none");
				_this.removeClass().addClass("h113");
			});
		});
		/* 浮动提示 */
		
		/* 栏目：10条 左右轮转*/
		jQuery(".right").hide();
		jQuery(".cont3 .r").click(function(){
			var _this = jQuery(this);
			if(!_this.find("a").attr("href"))return false;
			jQuery(".left",_this.prev(".c")).hide();
			jQuery(".right",_this.prev(".c")).show();
			_this.empty().html('<span class="none"></span>');
			jQuery(".l",_this.parent(".cont3")).html('<a href="javascript:;"></a>');
		});
		jQuery(".cont3 .l").click(function(){
			var _this = jQuery(this);
			jQuery(".right",_this.next(".c")).hide();
			jQuery(".left",_this.next(".c")).show();
			_this.html('<span class="none"></span>');
			jQuery(".r",_this.parent(".cont3")).html('<a href="javascript:;"></a>');
		});
		/* 栏目：10条 左右轮转*/
	});
</script>
<div class='portal-box ${boxTheme!""} bor1' style='min-height:240px;'>
	<div class='portal-box-title'>
		<span class="portal-box-title-icon ${icon}"></span>
		<span class="portal-box-title-label">${title}</span>
	</div>
	<div class='portal-box-con' style='height:${height};margin-top:10px;'>
		<div class="cont3">
		<div class="di"></div>	
	    <div id="l1" class="l"><span class="none"></span></div>
		<div class="c">
			<ul id="ul1">
			<#list _DATA_ as doc>
			<#if doc_index lte 4>
				<#if doc_index=4>
					<li class="li0 left" style="float:left;">
					<#else><li class="left" style="float:left;">
				</#if>
				<#else>
				<#if doc_index=9>
					<li class="li0 right" style="float:left;">
					<#else><li class="right" style="float:left;">
				</#if>
			</#if>
				<div class="h113">
					<div style="display:none" class="title">
						<#if doc.DOCUMENT_TITLE?length gt 30>
							${doc.DOCUMENT_TITLE[0..29]}...
							<#else>${doc.DOCUMENT_TITLE}
						</#if>
					</div>
					<div class="b1"><a href="javascript:docView('${doc.DOCUMENT_ID}', '${doc.DOCUMENT_TITLE}');">
						<img width="81" height="111" name="a" alt="${doc.DOCUMENT_TITLE!''}" 
						src="<@setPic doc middle/>">
						<b class="unknown ${doc.DOCUMENT_FILE_SUFFIX!'unknown'}"></b>
						</a></div>								
				</div>
				<p align="center"><a href="javascript:docView('${doc.DOCUMENT_ID}', '${doc.DOCUMENT_TITLE}');">
					<#if doc.DOCUMENT_TITLE?length gt 10>
						${doc.DOCUMENT_TITLE[0..9]}...
						<#else>${doc.DOCUMENT_TITLE}
					</#if>
				</a></p>
			</li>
			</#list>
	        </ul>
		</div>	
	    <div id="r1" class="r">
			<#if _DATA_?size lt 5>
				<span class="none"></span>
				<#else><a href="javascript:;"></a>
			</#if>
		</div>
	</div>
	</div>
</div>
