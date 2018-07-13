<#assign mindTypeList = userMind.getMindTypeList(odeptCode) >
	<#list mindTypeList as mindType>
	<#assign mindList = userMind.getMindListByType(mindType.ID, odeptCode) > 
		<#if mindList?size != 0>	
		<tr>
			<td width="15%" class="tc pb5">${mindType.NAME}</td>
			<td width="85%">
				<table class='mindShowList' width="100%" border="0" cellspacing="0" cellpadding="0">
				<#list mindList as mind>
					<tr><td style="word-wrap:break-word;word-break:break-all;" class="p5 lh150">
						<#if mind.MIND_CONTENT??>
						<span class="MIND_CONTENT">${mind.MIND_CONTENT}</span>
						</#if>
						<#if mind._MIND_FILE_LIST?? && mind._MIND_FILE_LIST?size gt 0>
						&nbsp;&nbsp;&nbsp;&nbsp;（
						<#list mind._MIND_FILE_LIST as fileBean>
						${fileBean_index + 1}.&nbsp;<a href="javascript:void(0)" onclick="RHFile.read('${fileBean.FILE_ID}','${fileBean.FILE_NAME}')" fileID="${fileBean.FILE_ID}" target="_blank" class="MIND_FILE"><span class="icon-image iconC" style="border:0"></span>${fileBean.FILE_NAME}</a>；&nbsp;
						</#list>
						）
						</#if>
						<#if userDoInWf?? && userDoInWf=true>
							<#if canCopy?? && canCopy=true>
							&nbsp;[<a href="#" class="COPY_MIND">复制</a>]
							</#if>
							<#if NI_ID?? && NI_ID= mind.WF_NI_ID && mind.S_USER = userBean.USER_CODE>
								&nbsp;[<a href="#" MIND_ID="${mind.MIND_ID}" class="DELETE_MIND">删除</a>]
							<#elseif NI_ID?? && DEL_MIND?? && DEL_MIND = "true" && mind.S_USER = userBean.USER_CODE>
								&nbsp;[<a href="#" MIND_ID="${mind.MIND_ID}" class="DELETE_MIND">删除</a>]
							<#elseif NI_ID?? && DEL_SELF_MIND?? && DEL_SELF_MIND && mind.S_USER = userBean.USER_CODE>
							    &nbsp;[<a href="#" MIND_ID="${mind.MIND_ID}" class="DELETE_MIND">删除</a>]		
							</#if>
						</#if>
					</td></tr>
					<tr><td class="tr p5 pr30">
						<span>${mind.S_TNAME}&nbsp;&nbsp;&nbsp;&nbsp; </span>
						<#if mind.IS_BD?? && mind.IS_BD = 1 && mind.BD_UNAME?length gt 0>
					    	<span>${mind.S_UNAME}(${mind.BD_UNAME}补登)</span>
					    <#elseif mind.BD_UNAME?length gt 0>
					    	<span>${mind.BD_UNAME}(${mind.S_UNAME}授权)</span>
					    <#else>
					    	<span>${mind.S_UNAME}<span>
					    </#if>
					    
					    <span class='pl50 mindList_time'>
						    <#if mind.MIND_TIME??> <!--从别处导过来的数据，有的没取到时间值，或者时间格式是只到日期的-->
						        <#if mind.MIND_TIME?length gt 16>    
						            ${mind.MIND_TIME?substring(0,16)}
						        <#else>
						            ${mind.MIND_TIME}
						        </#if>
						    </#if>    
					    </span>
					
					</td></tr>
				</#list>
				</table>
			</td>
		</tr>
		</#if>
	</#list>