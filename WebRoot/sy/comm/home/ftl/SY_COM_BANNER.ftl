<style type="text/css">
.com_banner {width:100%;background-color:#64a6c9;float:left;}
.com_banner li {height:45px;line-height:45px;float:left;margin:0px 20px;font-weight:bold;}
.com_banner li a {text-decoration: none;color:white;}
.com_banner li a:hover {text-decoration: underline;} 
</style>
<div class='portal-box' style='min-height:45px;width:100%;margin-top:0px;margin-bottom:0px;'>
<div class='portal-box-title portal-title-none'></div>
<div class='portal-box-con' style='min-height:45px;'>
<ul class="com_banner">
<#list _DATA_ as content>
<li><a href="/cms/CM_CMS_CHNL/${content.CHNL_ID}.html">${content.CHNL_NAME}</a></li>
</#list>
</ul>
</div>
</div>
