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
	<div class='portal-box-title portal-title-none' style='border-bottom:0px gray solid;padding-left:8px;'>
		<span class="portal-box-title-icon ${icon}"></span>
		<span class="portal-box-title-label">${title}</span>
	</div>
	<div class='portal-box-con' style='height:${height};padding-bottom:15px;'>
	<table width="98%" cellspacing="0" cellpadding="0" class="noline">
    <tr class="tr3">
        <td bgcolor="#FFFFFF">
            <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                    <td align="center" style='border-bottom:1px #aaa dotted;'>
                        <#list hot as topic>
                        	<#if topic_index == 0>
                                    <a title="${topic.TOPIC_TITLE}" style="color:black;font-size:14px;font-weight:bold;" href="javascript:topicView('${topic.TOPIC_ID}','${topic.TOPIC_TITLE}');">
										${topic.TOPIC_TITLE}</a>
									<p style="color:#666666;">最热门的热门话题讨论中...</p>
							</#if>
                        </#list>
                    </td>
                </tr>
                <tr>
                    <td valign="top" style='padding-top:6px;'>
                        <table class="line" align="center" width="100%" cellspacing="0" cellpadding="0" border="0">
                            <#list hot as topic>
                            <#if topic_index != 0>
							<tr>
                                <td style="line-height:24px;font-size:14px;" align="left">
                                    <span style='color:#666666;'>[产品区]&nbsp;</span><a title="${topic.TOPIC_TITLE}" style="color:black;" href="javascript:topicView('${topic.TOPIC_ID}','${topic.TOPIC_TITLE}');">
										${topic.TOPIC_TITLE}
									</a>
                                </td>
								<td style="line-height:24px;color:#666;">
									${topic.TOPIC_READ_COUNTER!0}查看 / ${topic.COMMENT_COUNTER!0}回帖
								</td>
                            </tr>
                            </#if>
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