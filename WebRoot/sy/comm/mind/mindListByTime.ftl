<#assign mindList = userMind.getMindList(odeptCode) > 
	<#if mindList?size != 0>
		<tr style="height:35px;">
			<td class="pb5 pt5" align="center" style="background-color:#c7d9ef;font-weight:bold;width:10%;">部门</td>
			<td class="pb5 pt5" align="center" style="background-color:#c7d9ef;font-weight:bold;width:10%;">签意见人</td>
			<td class="pb5 pt5" align="center" style="background-color:#c7d9ef;font-weight:bold;width:15%;">办理环节</td>
			<td class="pb5 pt5" align="center" style="background-color:#c7d9ef;font-weight:bold;width:45%;">意见内容</td>
			<td class="pb5 pt5" align="center" style="background-color:#c7d9ef;font-weight:bold;width:120px;">签意见时间</td>
			<td class="pb5 pt5" align="center" style="background-color:#c7d9ef;font-weight:bold;width:10%;">意见类型</td>
		</tr>
		<#list mindList as mind>
			<tr class="h25">
				<td class="pb5 pt5" align="center" style="padding-left:5px;padding-right:5px;">
					<table class='mindShowList' width="100%;" cellPadding='0' cellSpacing='0' border='0'>
						<tr>
							<td class='p5 lh150' style='word-wrap: break-word; word-break: break-all;'>
								<span>${mind.S_TNAME}</span>
							</td>
						</tr>
					</table>
				</td>
				<td class="pb5 pt5" style="padding-left:5px;padding-right:5px;">
					<table class='mindShowList' width="100%;" cellPadding='0' cellSpacing='0' border='0'>
						<tr>
							<td class='p5 lh150' style='word-wrap: break-word; word-break: break-all;'>
								<#if mind.IS_BD?? && mind.IS_BD = 1 && mind.BD_UNAME?length gt 0>
							    	<span>${mind.S_UNAME}(${mind.BD_UNAME}补登)</span>
							    <#elseif mind.BD_UNAME?length gt 0>
							    	<span>${mind.BD_UNAME}(${mind.S_UNAME}授权)</span>
							    <#else>
							    	<span>${mind.S_UNAME}<span>
							    </#if>
							</td>
						</tr>
					</table>
				</td>
						
				<td class="pb5 pt5" style="padding-left:5px;padding-right:5px;">
					<#if mind.WF_NI_NAME??>
						<table class='mindShowList' width="100%;" cellPadding='0' cellSpacing='0' border='0'>
							<tr>
								<td class='p5 lh150' style='word-wrap: break-word; word-break: break-all;'>
									<span>${mind.WF_NI_NAME}</span>
								</td>
							</tr>
						</table>
					</#if>	
				</td>
				<td  class="pb5 pt5" align="left">
					<#if mind.MIND_CONTENT??>
					<table class='mindShowList' width="100%;" cellPadding='0' cellSpacing='0' border='0'>
						<tr>
							<td class='p5 lh150' style='word-wrap: break-word; word-break: break-all;'>
								<span class="MIND_CONTENT">${mind.MIND_CONTENT}</span>
					</#if>
					<#if mind._MIND_FILE_LIST?? && mind._MIND_FILE_LIST?size gt 0>
					&nbsp;&nbsp;&nbsp;&nbsp;（
					<#list mind._MIND_FILE_LIST as fileBean>
					${fileBean_index + 1}.&nbsp;<a href="javascript:void(0);" onclick="RHFile.read('${fileBean.FILE_ID}','${fileBean.FILE_NAME}')" class="MIND_FILE"><span class="icon-image iconC" style="border:0"></span>${fileBean.FILE_NAME}</a>；&nbsp;
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
					</td>
				</tr>
				</table>
				</td>	
				<td class="pb5 pt5" style="padding-left:5px;padding-right:5px;">
				     <span>
			     		<#if mind.MIND_TIME??> <!--从别处导过来的数据，有的没取到时间值，或者时间格式是只到日期的-->
					        <#if mind.MIND_TIME?length gt 16>
					        <table class='mindShowList' width="100%;" cellPadding='0' cellSpacing='0' border='0'>
								<tr>
									<td class='p5 lh150' style='word-wrap: break-word; word-break: break-all;'>
										<span>${mind.MIND_TIME?substring(0,16)}</span>
									</td>
								</tr>
							</table>    
					        <#else>
						        <table class='mindShowList' width="100%;" cellPadding='0' cellSpacing='0' border='0'>
									<tr>
										<td class='p5 lh150' style='word-wrap: break-word; word-break: break-all;'>
											<span> ${mind.MIND_TIME}</span>
										</td>
									</tr>
								</table>
					        </#if>
					    </#if>    
				     </span>
				</td>
				<td class="pb5 pt5" style="padding-left:5px;padding-right:5px;">
				    <#if mind.MIND_CODE_NAME??>
					    <table class='mindShowList' width="100%;" cellPadding='0' cellSpacing='0' border='0'>
							<tr>
								<td class='p5 lh150' style='word-wrap: break-word; word-break: break-all;'>
									<span>${mind.MIND_CODE_NAME}</span>
								</td>
							</tr>
						</table>
					</#if>
				</td>																																												
			</tr>
		</#list>
	</#if>