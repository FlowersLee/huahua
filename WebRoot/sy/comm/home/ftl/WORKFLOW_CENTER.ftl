<#-- tab标签切换-->
<style type="text/css">
.tabs-portal .portal-box-title li {
	line-height:29px;padding:0px 15px;text-align: center;float: left; 
}
.tabs-portal .tab-ul-none {display:none;}
 a.cp:hover { text-decoration:underline;color: red}
.menu_item {margin: 20px 20px 0px 20px;display: inline-block; width:140px;}
.ui-state-default, .ui-widget-content .ui-state-default, .ui-widget-header .ui-state-default{
	font-weight:normal;
}
.ui-state-default{
	background:none;
	border:none;
	font-weight: bold;
	font-size: 14px;
}
.menulilabel{
	padding: 0 8px 0px;margin-right: 2px;
}
</style>
<DIV class='mt20 ml10' style="font-size:16px;">新建流程审批单</DIV>
<div id='CM_NEWS_TABS' class='portal-box tabs-portal '>
	<div id="tabs-portal-tab-id" class="portal-box-title">
	  <ul>
	  	<#--如果菜单有图标则加载图标没有则不加载-->
		<#list TOPMENU as menu>
			<#if (menu.ICON)?length !=0>
				<li class="new_tab" name="${menu.ID!""}"><div class="ui-state-default "><span class="leftMenu-${menu.ICON!""} menulilabel"></span><label style="color:#3675B8;">${menu.NAME!""}</label></div></li>
			<#else>
				<li class="new_tab" name="${menu.ID!""}"><div class="ui-state-default "><span class="leftMenu-${menu.ICON!""}"></span><label style="color:#3675B8;">${menu.NAME!""}</label></div></li>
			</#if>
		</#list>
	  </ul>
	</div>
	<div id="menutab">
		<#list TOPMENU as menu>			
			<div id="${menu.ID!""}">
				<#if (menu.CHILD)??>
					<#list menu.CHILD as menu2>
						<#-- 判断如果有子节点则遍历不展示没有则直接展示菜单-->
						<#if (menu2.CHILD)??>
							<#list menu2.CHILD as menu3>
								<label class="menu_item leftMenu-title-label" onclick=toMenu("${menu3.INFO!""}","${menu3.TYPE!""}","${menu3.NAME!""}")><a class="cp" title="${menu3.TIP!""}">${menu3.NAME!""}</a></label>
							</#list>
						<#else>
							<label class="menu_item leftMenu-title-label" onclick=toMenu("${menu2.INFO!""}","${menu2.TYPE!""}","${menu2.NAME!""}")><a class="cp" title="${menu2.TIP!""}">${menu2.NAME!""}</a></label>
						</#if>
					</#list>
				</#if>
			</div>			
		</#list>
	</div>
</div>
<script type="text/javascript">
function  toMenu(info,type,name){
	if(type == 1){
		Tab.open({"url":info+".list.do","tTitle":name,"menuFlag":2});
	}else if(type == 2){
		Tab.open({"url":info,"tTitle":name,"menuFlag":2});
	}else if(type == 3){
		eval(info);
	}
}
(function() {
    jQuery(document).ready(function(){
	    setTimeout(function() {
	      jQuery(".new_tab").bind("mouseover",function() {
	          if (jQuery(this).hasClass("tabSelected")) {
	              return;
	          }
	          jQuery("#tabs-portal-tab-id .tabSelected").removeClass("tabSelected");			  
	          jQuery(this).addClass("tabSelected");
			  jQuery("ul").find("label").css({"color":"#3675B8"});
			  jQuery("ul").find("label").css({"color":"#3675B8"});
			  jQuery("ul").find("div").removeClass("ui-state-active");
			  jQuery(this).find("div").addClass("ui-state-active");
			  jQuery(this).find("label").css({"color":"white"});
			  var id = jQuery(this).attr("name");
			  jQuery("#menutab").find("div").hide();
	          jQuery("#" + id).show();
	      });
	    },0);
    });
})();
jQuery(document).ready(function(){
	/**
	 * 当页面加载完毕后默认选中第一个
	 */
	var firstLi = jQuery(".new_tab").first();
	firstLi.addClass("tabSelected");
	firstLi.find("label").css({"color":"white"});
	firstLi.find("div").addClass("ui-state-active");
	var firstID = firstLi.attr("name");
	jQuery("#menutab").find("div").hide();
	jQuery("#" + firstID).show();
	jQuery("#menutab div").first().addClass("tabSelected").show();
	/**
	 * 为菜单链接后的事件
	 */
	jQuery("a.cp").bind("click",function(){
		jQuery(this).css({color:"#B12F2F"});
	})
})


</script>
