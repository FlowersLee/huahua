<#list mindList as mind>
    <ul>
        <li>${mind.MIND_CONTENT}</li>
        <li>
			<#if mind.IS_BD?? && mind.IS_BD = 1 && mind.BD_UNAME?length gt 0>
		    	${mind.S_UNAME}(${mind.BD_UNAME}补登)
		    <#elseif mind.BD_UNAME?length gt 0>
		    	${mind.BD_UNAME}(${mind.S_UNAME}授权)
		    <#else>
		    	${mind.S_UNAME}
		    </#if>
		</li>
        <li><#if (mind.S_MTIME)?length gt 19> ${mind.S_MTIME?substring(0,19)}</#if></li>
    </ul>
</#list>