<#include "BBS_CONSTANT.ftl"/>
<script type="text/javascript">
	function topicView(id,name){
		var url = "/cms/SY_COMM_BBS_TOPIC/" + id + ".html";	
		var opts={'scrollFlag':true , 'url':url,'tTitle':name,'menuFlag':3};
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
	<div class='portal-box-title' style='border-bottom:0px gray solid;padding-left:8px;'>
		<span class="portal-box-title-icon ${icon}"></span>
		<span class="portal-box-title-label">${title}</span>
	</div>
	<div class='portal-box-con' style='height:${height};padding-bottom:15px;'>
	<table width="100%" cellspacing="0" cellpadding="0" class="noline">
    <tr class="tr3">
        <td bgcolor="#FFFFFF">
            <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                    <td valign="top">
                        <table class="line" width="100%" cellspacing="0" cellpadding="0" border="0" >
							<#list reply as topic>
							<tr>
                                <td style="line-height:24px;text-align:left;">
                                    &bull;<a title="${topic.TOPIC_TITLE}" style="color:black;" href="javascript:topicView('${topic.TOPIC_ID}','${topic.TOPIC_TITLE}');">
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
									${topic.S_UNAME!topic.S_USER}
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