<script type="text/javascript">
	function doChannel(id,name){
		window.location = "/cms/CM_CMS_CHNL/" + id + "/index_1.html?group=true";	
	}
	function doTopic(id,name){
		var url = "/cms/SY_COMM_BBS_TOPIC/" + id + ".html?group=true";	
		var opts={'scrollFlag':true , 'url':url,'tTitle':name,'menuFlag':1};
		top.Tab.open(opts);
	}
</script>
<style type="text/css">
	.portal-box .portal-box-title .more {
		float:right;
		line-height:31px;
		cursor:pointer;
	}
</style>
<#list _DATA_ as channel>
<div class='portal-box ${boxTheme!""}' style='min-height:200px;'>
	<div class='portal-box-title'>
		<span class="portal-box-title-icon ${icon}"></span>
		<span class="portal-box-title-label">${channel.CHNL_NAME}</span>
		<span class="more" onclick="window.location = '/cms/CM_CMS_CHNL/${channel.CHNL_ID}/index_1.html?group=true'">查看更多&gt;&gt;</span>
	</div>
	<div class='portal-box-con' style='height:${height};'>
		<table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:3px;">
			<#list channel.topicList as topic>
			<tr>
				<td style="border-bottom: 1px #ccc dashed;width:40%;">
					<a href="javascript:doTopic('${topic.TOPIC_ID}','${topic.TOPIC_TITLE}');">
						${topic.TOPIC_TITLE!""}
					</a>
				</td>
				<td style="border-bottom: 1px #ccc dashed;">
					${topic.S_UNAME!topic.S_USER}
				</td>
				<td style="border-bottom: 1px #ccc dashed;">
					${topic.S_CTIME!""}
				</td>
				<td style="border-bottom: 1px #ccc dashed;">
					回复${topic.COMMENT_COUNTER!0}，查看${topic.TOPIC_READ_COUNTER!0}
				</td>
			</tr>
			</#list>
		</table>
	</div>
</div>
</#list>
		