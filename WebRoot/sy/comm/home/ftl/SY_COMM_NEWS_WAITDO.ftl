<div id='CM_NEWS_CHECK' class='portal-box'>
	<div class='portal-box-title'>
		<span class='portal-box-title-icon icon_portal_todo'></span>
		<span class="portal-box-title-label">待办事宜</span>
		<span class="portal-box-hideBtn  conHeanderTitle-expand"></span>
		<span class="portal-box-more"><a href="#" onclick="openMoreMeetingListPage()"></a></span>
	</div>
	<div class='portal-box-con'>
		<table width="100%">
			<#if (_DATA_?size == 0)>
				<tr><td align=center id='haha'>没有相关待办事宜！</td></tr>
			</#if>
			<#list _DATA_ as content>
				<tr>
					<td width='10px'>
						<#if (content.warnFlag == "2")>
							<img src='/sy/theme/default/images/icons/ok.png'>
						</#if>
						<#if (content.warnFlag == "1")>
							<img src='/sy/theme/default/images/icons/exclamation.png'>
						</#if>

					</td>
					<td>
						<a href="javascript:void(0);" onclick="openMeetingCard('${content.NEWS_ID}')" title="${content.MEETING_TITLE_V}">
						<#if (content.MEETING_TITLE_V?length > 25)>${content.MEETING_TITLE_V?substring(0,25)}...<#else>${content.MEETING_TITLE_V}</#if>
						</a>
					</td>
					<td>${content.MEETING_PLACE_V}</td>
					<td>${content.MEETING_START_TIME_V}</td>
					<td>${content.MEETING_END_TIME_V}</td>
				</tr>
			</#list>
		</table>
	</div>
</div>
<script>
function openMoreMeetingListPage() {
	var strWhere = "";
	var tTitle = "我的会议";
    strWhere = "";	
	var params = {"extWhere":strWhere};	
	var opts = {"url":"OA_MT_CONFEREE.list.do", "tTitle":tTitle, "menuFlag":4, "params":params};
	openNewTab(opts);
}

function openMeetingCard(meetingId){
	var tTitle = "会议通知";	
	var params = {};
	var opts = {"url":"OA_MT_MEETING.card.do?pkCode=" + meetingId + "&readOnly=true", "tTitle":tTitle, "menuFlag":4, "params":params};
	Tab.open(opts);
}
</script>