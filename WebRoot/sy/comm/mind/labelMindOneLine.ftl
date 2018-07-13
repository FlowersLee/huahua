<#-- <table style="table-layout:fixed;word-wrap: break-word;word-break: break-all;">
<#list mindList as mind>
	<#if mindList?size lte 1>
		<tr>
	        <td width="50%" style="border:0px;">${mind.MIND_CONTENT}</td>
	        <td width="24%" style="border:0px;" align="center">${mind.S_UNAME}</td>
	        <td style="border:0px;">${mind.S_MTIME[0..18]}</td>
    	</tr>
    <#else>
    	<tr style="border-bottom:1px #CCC dashed;">
	        <td width="50%" style="border:0px;">${mind.MIND_CONTENT}</td>
	        <td width="24%" style="border:0px;" align="center">${mind.S_UNAME}</td>
	        <td width="26%" style="border:0px;">${mind.S_MTIME[0..18]}</td>
    	</tr>
	</#if>
</#list>
</table>-->
<div>
	<#list mindList as mind>
			<p style="line-height:18px;">
			    ${mind.MIND_CONTENT}&nbsp;&nbsp;
				<#if mind._MIND_FILE_LIST?? && mind._MIND_FILE_LIST?size gt 0>
					<#list mind._MIND_FILE_LIST as mindFile>
                        [<a href="javascript:void(0);" href="javascript:void(0);" onclick="RHFile.read('${mindFile.FILE_ID}','${mindFile.FILE_NAME}')" fileID="${mindFile.FILE_ID}" class="MIND_FILE" title="${mindFile.FILE_NAME}"><span class="icon-image iconC" style="border:0"></span>附件</a>]						
					</#list>
				</#if>
				<#if mind.IS_BD?? && mind.IS_BD = 1 && mind.BD_UNAME?length gt 0>
			    	${mind.S_UNAME}(${mind.BD_UNAME}补登)
			    <#elseif mind.BD_UNAME?length gt 0>
			    	${mind.BD_UNAME}(${mind.S_UNAME}授权)
			    <#else>
			    	${mind.S_UNAME}
			    </#if>
		        <#if mind.MIND_TIME?length gt 18>    
		            (${mind.S_MTIME[0..18]})
		        <#else>
		            (${mind.MIND_TIME})
		        </#if>
			    &nbsp;&nbsp;${mind.S_TNAME}
			</p>	
		<#if (mindList?size gt 1) && (mind_index+1) != (mindList?size)>
            <br/>
		</#if>
	    
	</#list>
</div>