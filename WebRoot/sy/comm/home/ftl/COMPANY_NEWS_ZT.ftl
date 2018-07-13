<div id='CM_CMS_CHNL' class='portal-box ${boxTheme}'>
<script type="text/javascript">
function openZTmoreList(CHNL_PID,title) {
		var opts = {"tTitle":title,"url":"CM_INFOS.getMoreZT.do?CHNL_PID="+CHNL_PID,"menuFlag":3};
		Tab.open(opts);
}

function openKMListMoreZT(CHNL_ID,title) {
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

</style>
<div class='portal-box-title ${titleBar}'><span class='portal-box-title-icon ${icon}'></span><span class="portal-box-title-label">${title}</span><span class="portal-box-hideBtn  conHeanderTitle-expand"></span><span class="portal-box-more"><a href="#" onclick="openZTmoreList('${CHNL_PID}','专题回顾')"></a></span></div>
<div class='portal-box-con'>
<table width="100%">
<#if (_DATA_?size == 0)>
<tr><td align=center id='haha'>该栏目下没有信息！</td></tr>
</#if>
<#list _DATA_ as content>
<tr>
<td><img src="/sy/comm/home/img/d.png"/><a href="javascript:void(0);" onclick="openKMListMoreZT('${content.CHNL_ID}','${content.CHNL_NAME}')" title="${content.CHNL_NAME}" style="margin-left:3px;">
<#if (content.CHNL_NAME?length > 22)>${content.CHNL_NAME?substring(0,22)}...<#else>${content.CHNL_NAME}</#if>
</a></li></td>

<td><span style="float:right;margin-right:6px;color:#999999;"><#if (content.CHNL_TIME?length >10)>${content.CHNL_TIME?substring(0,10)}<#else>${content.CHNL_TIME}</#if></span></td>
</tr>
</#list>
</table>
</div>
</div>