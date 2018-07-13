<style>
.li-bottom-odd{border-bottom: 1px dashed #CCC;overflow: auto;_height: 1%;margin:8px 5px 0px 0px;}
.li-bottom-even{border-bottom: 1px dashed #CCC;overflow: auto;_height: 1%;margin:8px 0px 0px 5px;}
.img_image{display:inline-block;width:20px;height:20px;background: url("/sy/comm/news/img/img_flag.jpg") no-repeat;float:right;}
.img_attach{display:inline-block;width:20px;height:20px;float:right;
	background: url("/sy/theme/default/images/icons/rh-btns.png") no-repeat scroll -3px -282px transparent;}
.cl-a {text-decoration: none;font-size:14px;float:left;}
.cl-a:hover {text-decoration: underline;color:red;}
.inlineBlock {display:inline-block;}
</style>
<script type="text/javascript">
	function clDoView(id,name){
		var url = "/cms/SY_COMM_NEWS/" + id + ".html";			
		var opts={'scrollFlag':true , 'url':url,'tTitle':name,'menuFlag':3};
		top.Tab.open(opts);
	}
</script>
<!-- 新闻栏目[系统资料]------------news consultative lib------>
<div class='portal-box ${boxTheme!""}' style='min-height:200px;'>
	<div class='portal-box-title'>
		<span class="portal-box-title-icon ${icon}"></span>
		<span class="portal-box-title-label">${title}</span>
	</div>
<div class='portal-box-con' style='height:${height};'>
	<table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:3px;">
		<#list _DATA_ as news>
			<#--展示两列，默认为两列 -->
			<#if col == "2">
			<#if news_index % 2 == 0>
				<tr>
			</#if>
			<td style="border: 0px;padding-left:0px;">
				<#if news_index % 2 == 0>
					<div class="li-bottom-odd"> 
				</#if>
				<#if news_index % 2 == 1>
					<div class="li-bottom-even">
				</#if>
				<div style="overfloat:hidden;">
					<span style="float:left;">&#8226;&nbsp;</span><a class="cl-a" href="javascript:void(0);" onclick="clDoView('${news._PK_}', '${news.NEWS_SUBJECT}');">
					<#if (news.NEWS_SUBJECT!"")?length gt 25>
						${news.NEWS_SUBJECT[0..25]}...</a>
					</#if>
					<#if (news.NEWS_SUBJECT!"")?length lte 25>
						${news.NEWS_SUBJECT!""}</a>
					</#if>
				</div>
			    <div style="float:right;overflow: auto;_height: 1%;margin: 5px 0px 0px 0px;">
					<#if news.HAS_IMAGE??>
						<#if (news.HAS_IMAGE)?number == 1>
							<div class="img_image"></div>
						</#if>
					</#if>
					<#if news.HAS_ATTACH??>
						<#if (news.HAS_ATTACH)?number == 1>
							<div class="img_attach"></div>
						</#if>
					</#if>
				 </div>
			</div>
			</td>
			<#if news_index % 2 == 1>
				</tr>
			</#if>
			<#if news?size % 2 == 1 && !news_has_next>
				<td style="border: 0px;"></td></tr>
			</#if>
		</#if>
		<#--展示一列-->
		<#if (col?length == 0) || (col == "1")>
			<tr>
				<td style="border: 0px;padding-left:0px;">
						<div class="li-bottom-odd"> 
					<div style="overfloat:hidden;">
						<span style="float:left;">&#8226;&nbsp;</span><a class="cl-a" href="javascript:void(0);" onclick="clDoView('${news._PK_}', '${news.NEWS_SUBJECT}');">
						<#if (news.NEWS_SUBJECT!"")?length gt 25>
							${news.NEWS_SUBJECT[0..25]}...</a>
						</#if>
						<#if (news.NEWS_SUBJECT!"")?length lte 25>
							${news.NEWS_SUBJECT!""}</a>
						</#if>
					</div>
				    <div style="float:right;overflow: auto;_height: 1%;margin: 5px 0px 0px 0px;">
						<#if news.HAS_IMAGE??>
							<#if (news.HAS_IMAGE)?number == 1>
								<div class="img_image"></div>
							</#if>
						</#if>
						<#if news.HAS_ATTACH??>
							<#if (news.HAS_ATTACH)?number == 1>
								<div class="img_attach"></div>
							</#if>
						</#if>
					 </div>
				</div>
			</td>
		</tr>
		</#if>
		</#list>
    </table>
   </div>
</div>