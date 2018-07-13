<div id='CM_INFOS_VIEW' class='portal-box ${boxTheme}'>
<script type="text/javascript">
	function newsView(id){
		var url = "/cms/CM_INFOS/" + id + ".html";			
		window.open(url);
	}
function openKMListMore(CHNL_ID,title) {
		var opts = {"tTitle":title,"url":"CM_INFOS.getMoreInfos.do?CHNL_ID="+CHNL_ID,"menuFlag":3};
		Tab.open(opts);
}
</script>
<style type="text/css">
.portal-box-con tr td a {
color: #000000;
}
.pageBody__default .portal-box-title {
color: #000000;
}
.uul{width:700px;list-style:none; border:red 1px solid; overflow:hidden;} 
.lli{width:340px;float:left; margin-right:10px;line-height:20px; display:inline;} 
.tdd{float:left;width:700px; text-align:left;} 
.elipd{
 overflow:hidden;
white-space:nowrap;
text-overflow:ellipsis;
-o-text-overflow:ellipsis;
-moz-text-overflow:ellipsis;
-webkit-text-overflow:ellipsis;
-icab-text-overflow: ellipsis;
-khtml-text-overflow: ellipsis;
}
</style>
<div class='portal-box-title ${titleBar}'><span class='portal-box-title-icon ${icon}'></span><span class="portal-box-title-label">${title}</span><span class="portal-box-hideBtn  conHeanderTitle-expand"></span><span class="portal-box-more"><a href="#" onclick="openKMListMore('${CHNL_ID}','${CHNL_NAME}')"></a></span></div>
<div class='portal-box-con'>
<table width="100%" style="table-layout:fixed;">
<#if (_DATA_?size == 0)>
<tr><td align=center id='haha'>该栏目下没有信息！</td></tr>
</#if>
<#list _DATA_ as content>
<tr style="width:100%">
<td class="elipd" style="width:75%;"><img src="/sy/comm/home/img/d.png"/><a href="javascript:void(0);" onclick="newsView('${content.NEWS_ID}')" title="${content.NEWS_SUBJECT}" style="margin-left:3px;">
${content.NEWS_SUBJECT}
</a></li></td>
<td class="elipd" style="width:25%;"><span style="float:right;margin-right:6px;color:#999999;"><#if (content.NEWS_TIME?length >10)>${content.NEWS_TIME?substring(0,10)}<#else>${content.NEWS_TIME}</#if></span></td>
</tr>
</#list>
</table>
</div>
</div>