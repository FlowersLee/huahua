<#include "BBS_CONSTANT.ftl"/>
<script type="text/javascript">
	function topicView(id,name){
		var url = "/cms/SY_COMM_BBS_TOPIC/" + id + ".html";	
		var opts={'scrollFlag':true , 'url':url,'tTitle':name,'menuFlag':1};
		Tab.open(opts);
	}
	function getTimeAgo(time){
		var timeago = "";
		if (time) {
			timeago = time;
			timeago = timeago.substring(0, 19);
			timeago = jQuery.timeago(timeago); 
		}
		return timeago;
	}
</script>
<style type="text/css">
	table.noline td {
		border-bottom:none;
	}
</style>
<div class='portal-box ${boxTheme!""}' style='min-height:200px;background:white;'>
	<div class='portal-box-title'>
		<span class="portal-box-title-icon ${icon}"></span>
		<span class="portal-box-title-label">${title}</span>
	</div>
	<div class='portal-box-con' style='height:${height};'>
	<table width="100%" cellspacing="0" cellpadding="0" class="noline">
    <tr class="tr3">
        <td bgcolor="#FFFFFF">
            <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                    <td width="35%" height="30" align="center">
                        <span style="color:#4284ce; font-weight:bold;">最新主题</span>
                    </td>
                    <td width="35%" align="center">
                        <span style="color:#4284ce; font-weight:bold;">最新回复</span>
                    </td>
                    <td align="center">
                        <span style="color:#4284ce; font-weight:bold;">热门话题</span>
                    </td>
                </tr>
                <tr>
                    <td valign="top">
                        <table class="line" align="center"  width="94%"  cellspacing="1" cellpadding="2" border="0" style="border-right:1px solid #d4eff7;">
							<#list new as topic>
							<tr>
                                <td style="line-height:24px;" align="left">
                                    ${topic_index+1}. <a title="${topic.TOPIC_TITLE}" style="color:#4284ce;" href="javascript:topicView('${topic.TOPIC_ID}','${topic.TOPIC_TITLE}');">
										${topic.TOPIC_TITLE}
									</a>
                                </td>
								<td style="line-height:24px;color:#666;" id="new${topic_index}">
									<script type="text/javascript">
										jQuery(document).ready(function(){
											<#list new as topic>
											jQuery("#new${topic_index}").html("<div title='${topic.S_CTIME}'>"+getTimeAgo("${topic.S_CTIME}")+"</div>");
											</#list>
										});
									</script>
								</td>
								<td style="line-height:24px;color:#666;">
									[${topic.S_UNAME!topic.S_USER}]
								</td>
                            </tr>
							</#list>
                        </table>
                    </td>
                    <td valign="top">
                        <table class="line" align="center" width="94%" cellspacing="0" cellpadding="2" border="0" style="border-right:1px solid #d4eff7;">
							<#list reply as topic>
							<tr>
                                <td style="line-height:24px;" align="left">
                                    ${topic_index+1}. <a title="${topic.TOPIC_TITLE}" style="color:#4284ce;" href="javascript:topicView('${topic.TOPIC_ID}','${topic.TOPIC_TITLE}');">
										${topic.TOPIC_TITLE}
									</a>
                                </td>
								<td style="line-height:24px;color:#666;" id="reply${topic_index}">
									<script type="text/javascript">
										jQuery(document).ready(function(){
											<#list reply as topic>
											jQuery("#reply${topic_index}").html("<div title='${topic.S_MTIME}'>"+getTimeAgo("${topic.S_MTIME}")+"</div>");
											</#list>
										});
									</script>
								</td>
								<td style="line-height:24px;color:#666;">
									[${topic.S_UNAME!topic.S_USER}]
								</td>
                            </tr>
							</#list>
                        </table>
                    </td>
                    <td valign="top">
                        <table class="line" align="center" width="94%" cellspacing="0" cellpadding="2" border="0">
                            <#list hot as topic>
							<tr>
                                <td style="line-height:24px;" align="left">
                                    ${topic_index+1}. <a title="${topic.TOPIC_TITLE}" style="color:#4284ce;" href="javascript:topicView('${topic.TOPIC_ID}','${topic.TOPIC_TITLE}');">
										${topic.TOPIC_TITLE}
									</a>
                                </td>
								<td style="line-height:24px;color:#666;">
									${topic.TOPIC_READ_COUNTER!0}查看 / ${topic.COMMENT_COUNTER!0}回帖
								</td>
                            </tr>
							</#list>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</div>
</div>