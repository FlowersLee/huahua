<#-- tab标签切换-->
<style type="text/css">
.tabs-portal .portal-box-title {}
.tabs-portal .portal-box-title ul{padding-left:5px;}
.tabs-portal .portal-box-title li {
	line-height:29px;padding:0px 20px;text-align: center;float: left; 
}
.tabs-portal .tab-ul {padding:8px;}
.tabs-portal .tab-ul li {
    color:black;
    line-height:29px;
}
.tabs-portal .tab-ul li a {color:black;}
.tabs-portal .tab-ul-none {display:none;}
.tabs-portal .tab-portal-box-a {text-decoration: none;font-size:14px;}
.tabs-portal .tab-portal-box-a:hover {text-decoration: underline;color:red;}
</style>
<div id='CM_NEWS_TABS' class='portal-box tabs-portal ${boxTheme}' style='height:${height};min-height:200px'>
<div id="tabs-portal-tab-id" class="portal-box-title">
  <ul>
    <li class="new_tab tabSelected" conul="con_ul1"><a href="javascript:void(0);" target="_blank">焦点新闻</a></li>
    <li class="new_tab" conul="con_ul2"><a href="javascript:void(0);" target="_blank">头条新闻</a></li>
  </ul>
</div>
<div class='portal-box-con'>
<ul id="con_ul1" class="tab-ul">
<#list _DATA_0._DATA_ as hotNews>
	<li class="tab-li" style="border-bottom: 1px dashed #CCC;">
	    &#8226;&nbsp;
		<a href="javascript:void(0);" target="_blank" onclick="doTabsView('${hotNews._PK_}','${hotNews.NEWS_SUBJECT}');" class="tab-portal-box-a">
		<#if (hotNews.NEWS_SUBJECT!"")?length lte 10>
			${hotNews.NEWS_SUBJECT!""}
		</#if>
		<#if (hotNews.NEWS_SUBJECT!"")?length gt 10>
			${(hotNews.NEWS_SUBJECT)[0..10]}...
		</#if>
		</a>
	</li>
</#list>
</ul>
<ul id="con_ul2" class="tab-ul tab-ul-none">
<#list _DATA_1._DATA_ as topNews>
	<li class="tab-li" style="border-bottom: 1px dashed #CCC;">
	    &#8226;&nbsp;
		<a href="javascript:void(0);" target="_blank" onclick="doTabsView('${topNews._PK_}','${topNews.NEWS_SUBJECT}');" class="tab-portal-box-a">
		<#if (topNews.NEWS_SUBJECT!"")?length lte 10>
			${topNews.NEWS_SUBJECT!""}
		</#if>
		<#if (topNews.NEWS_SUBJECT!"")?length gt 10>
			${(topNews.NEWS_SUBJECT)[0..10]}...
		</#if>
		</a>
	</li>
</#list>
</ul>
</div>
</div>
<script type="text/javascript">
(function() {
    jQuery(document).ready(function(){
	    setTimeout(function() {
	      jQuery(".new_tab").bind("mouseover",function() {
	          if (jQuery(this).hasClass("tabSelected")) {
	              return;
	          }
	          jQuery("#tabs-portal-tab-id .tabSelected").removeClass("tabSelected");
	          jQuery(this).addClass("tabSelected");
	          var id = jQuery(this).attr("conul");
	          jQuery(".tab-ul").hide();
	          jQuery("#" + id).show();
	      });
	    },0);
    });
})();
function doTabsView(id,name){
	var url = "/cms/CM_NEWS/" + id + ".html";			
	var opts={'scrollFlag':true , 'url':url,'tTitle':name,'menuFlag':3};
	top.Tab.open(opts);
}
</script>