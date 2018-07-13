<#--焦点和头条新闻 -->
<style type="text/css">
.com_topnew_img {overflow: hidden; zoom: 1;}
.com_topnew_img .ct_pic {min-width: 175px; margin-bottom:5px;}
.com_topnew_img .ct_txt {padding-top: 5px; padding-left: 3px; margin-left: 156px; _padding-left: 0;}
a.scrArrLeft {
    background: url("/sy/comm/home/css/images/portal_page.png") no-repeat ; width: 22px; height: 22px; vertical-align: top; display: inline-block;
}
a.scrArrLeft:hover {background-position: -100px 0px;}
a.scrArrRight {
	background: url("/sy/comm/home/css/images/portal_page.png") no-repeat -50px 0px; width: 22px; height: 22px; vertical-align: top; display: inline-block;
}
a.scrArrRight:hover {background-position: -150px 0px;}
.scrDotList {padding: 0px 10px; zoom: 1;}
.scrDotList span {
	background: url("/sy/comm/home/css/images/portal_scroll.png") no-repeat -48px 8px; width: 15px; height: 22px; line-height: 0; font-size: 0px; vertical-align: top; display: inline-block; cursor: pointer;
}
.scrDotList span.on {
	background: url("/sy/comm/home/css/images/portal_scroll.png") no-repeat 0px 8px;
}

.topNew_list {}
.topNew_list .topTitle {color:gray;font-size:11px;line-height:20px;}
.topTitle a.topTitleA {font-size:16px;font-weight:bold;text-decoration:none;}
.topTitle a.topTitleA:hover {color:#8d0000;text-decoration:underline;}
.topNew_list a.topTitleListA {font-size:14px;color:black;text-decoration:none;}
.topNew_list a.topTitleListA:hover {color:#8d0000;text-decoration:underline;}
.topNew_list li {padding-left:13px;line-height:26px;}
</style>
<div class='portal-box  ${boxTheme}' style='min-height:236px;'>
	<div class='portal-box-title'>
		<span class="portal-box-title-icon ${icon}"></span>
		<span class="portal-box-title-label">${title}</span>
	</div>
<div class="portal-box-con" style="height:${height};">
<div style='float:left;width:210px;margin:8px 0px 8px 0px;padding:5px 0px;border:1px #cccccc solid;'>
<!--构造区块：标题+图片+二级标题-开始-->
<div style="overflow: hidden; float: left; zoom: 1;width:100%;text-align:center;">
<#list _DATA_0._DATA_ as content>
  <div class="com_topnew_img num${content_index}"
		<#if content_index == 0>
  			>
   		</#if> 
   		<#if content_index gt 0>
  			style="display:none;">
		</#if> 
    <div class="ct_pic">
	    <a href="javascript:void(0);" onclick="topDoView('${content._PK_!""}','${content.NEWS_SUBJECT!""}');">
	    	<#-- 此处是为了重用字段，故在后台将图文路径放入NEWS_ID中-->
	    	<#if (content.NEWS_SUBJECT!"")?length lte 10>
	    		<img alt="${content.NEWS_SUBJECT!""}" src="${urlPath}/file/${content.NEWS_ID!""}" width="200px" height="150">
	    	</#if>
	    	<#if (content.NEWS_SUBJECT!"")?length gt 10>
	    		<img alt="${(content.NEWS_SUBJECT)[0..10]}..." src="${urlPath}/file/${content.NEWS_ID!""}" width="200px" height="150">
	    	</#if>
	    </a>
	</div>
  </div>
</#list>
</div>
<!--构造区块：标题+图片+二级标题-结束-->
<!--翻页按钮-开始-->
<div class="b_cons" style="text-align:center;">
  <a id="scrArrLeft_01" class="scrArrLeft" href="javascript:void(0)"></a>
  <span id="scrDotList_01" class="scrDotList">
  <#list _DATA_0._DATA_ as content>
   	<span class="<#if (content_index == 0)>on<#else></#if>" title="第${content_index}页" num="${content_index}"></span>
  </#list>
  </span>
  <a id="scrArrRight_01" class="scrArrRight" href="javascript:void(0)"></a>
</div>
<!--翻页按钮-结束-->
</div>
<!--新闻开始-->
<div style='float:left;margin:8px 0px 0px 0px;width:65%;'>
<ul class="topNew_list" style="padding: 0px 0px 0px 15px;">
<#list _DATA_1._DATA_ as content>
<#if (content_index == 0)>
<li class="topTitle" style="background:none;text-align:center;border-bottom: 1px dashed #CCC;margin-bottom:5px;">
	<#if (content.NEWS_SUBJECT!"")?length lte 20>
		<a class="topTitleA" href="javascript:void(0);" onclick="topDoView('${content._PK_}','${content.NEWS_SUBJECT!""}');" >${content.NEWS_SUBJECT!""}</a>
	</#if>
	<#if (content.NEWS_SUBJECT!"")?length gt 20>
		<a class="topTitleA" href="javascript:void(0);" onclick="topDoView('${content._PK_}','${content.NEWS_SUBJECT}');" >${(content.NEWS_SUBJECT)[0..20]}...</a>
	</#if>
	<#if (content.NEWS_SUMMARY!"")?length lte 30>
		<p>${content.NEWS_SUMMARY!""}</p>
	</#if>
	<#if (content.NEWS_SUMMARY!"")?length gt 30>
		<p>${(content.NEWS_SUMMARY)[0..30]}...</p>
	</#if>
</li>
<#else>
	<li>
	&#8226;&nbsp;
		<a class="topTitleListA" href="javascript:void(0);"  onclick="topDoView('${content._PK_!""}','${content.NEWS_SUBJECT!""}');">${content.NEWS_SUBJECT!""}</a>
	</li>
</#if>
</#list>
</ul>
</div>
<!--新闻结束-->
</div>
</div>
<script type="text/javascript">
(function() {
    jQuery(document).ready(function(){
	    setTimeout(function() {
	      jQuery(".scrDotList span").bind("click",function() {
	          jQuery(".scrDotList .on").removeClass("on");
	          var num = jQuery(this).addClass("on").attr("num");
	          jQuery(".com_topnew_img").hide();
	          jQuery(".num" + num).show();
	      });
	    },0);
    });
})();

function topDoView(id,name){
		var url = "/cms/SY_COMM_NEWS/" + id + ".html";			
		var opts={'scrollFlag':true , 'url':url,'tTitle':name,'menuFlag':3};
		top.Tab.open(opts);
	}
</script>