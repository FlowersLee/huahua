<div id='CM_INFOS_VIEW' class='portal-box ${boxTheme}'>
<script type="text/javascript">
	function newsView(id,name){
		var url = "/cms/CM_INFOS/" + id + ".html";			
		window.open(url);
	}
function openKMCard(id,name) {
		var opts = {"tTitle":name,"url":"CM_INFOS_VIEW.card.do?pkCode=" + id,"menuFlag":3};
		Tab.open(opts);
}
function openKMList(CHNL_ID,title) {
        var strwhere =" AND CHNL_ID ='"+CHNL_ID+"' ";
        var params = {"_extWhere":strwhere};
       
		var opts = {"tTitle":title,"url":"CM_INFOS_VIEWMORE.list.do","params":params,"menuFlag":3};
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

<div class='portal-box-con'>
<table width="100%" border="0" cellpadding="0" cellspacing="0">
      <tr>
        <td width="77" height="30" valign="top"><img src="/sy/comm/home/img/content_img_01.jpg" width="77" height="30"></td>
        <td width="427" valign="middle">&nbsp;</td>
          <td width="67" valign="middle">&nbsp;</td>
      </tr>
  </table>
 <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td>
	<table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#F7F0E6">
      <tr>
        <td width="7" height="28" valign="top"><img src="/sy/comm/home/img/content_list_top_left.jpg" width="7" height="28"></td>
		<td width="54" valign="top"><img src="/sy/comm/home/img/content_list_top_img_01.jpg" width="54" height="28"></td>
		<td valign="top">&nbsp;</td>
		<td width="75" valign="top"><img src="/sy/comm/home/img/content_list_top_img_02.jpg" width="26" height="28"></td>
		<td width="7" height="28" valign="top"><img src="/sy/comm/home/img/content_list_top_right.jpg" width="7" height="28"></td>
      </tr>
    </table> 
<table width="100%" style="table-layout:fixed;">
<#if (_DATA_?size == 0)>
<tr><td align=center id='haha'>该栏目下没有信息！</td></tr>
</#if>

<#list _DATA_ as content>

<tr style="width:100%">
<td class="elipd" style="width:75%;"><img src="/sy/comm/home/img/d.png"/><a href="javascript:void(0);" onclick="newsView('${content.NEWS_ID}','${title}')" title="${content.NEWS_SUBJECT}" style="margin-left:3px;">
${content.NEWS_SUBJECT}
</a></li></td>

<td class="elipd" style="width:25%;"><span style="float:right;margin-right:6px;color:#999999;"><#if (content.S_ATIME?length >10)>${content.S_ATIME?substring(0,10)}<#else>${content.S_ATIME}</#if></span></td>
</tr>
</#list>
</table>
</div>
</div>