<!--意见输入框的显示-->
<style type="text/css">
.MIND_INPUT_DIV_BORDER div{border:0px !important;}
</style>
<table id="mindInput" class="mindInput" width="100%">
    <!-- 固定意见， 如果有，显示 选择框和输入框 --> 
	<#if canRegularMind=true>
	<tr>
		<td rowspan='3' class="tc wp15" align="right"><!--意见类型--> ${regularMind.CODE_NAME}</td>
		<td class="wp85">
			<span class="ui-form-default" style="position: relative;display:inline-block;width:100%">
				    <input style="cursor: pointer;" id="REGULAR_MIND" value="" class="ui-query-default" type="text">
				    <span id="chooseRegularMind" style="cursor: pointer;" class="iconChoose icon-input-select"></span>
				    <span id="cancelRegularMind" style="cursor: pointer;" class="iconCancel icon-input-clear"></span>		
				    <input id="USUAL_MIND_ID" value="" type="hidden">
				    <input id="USUAL_MIND_VALUE" value="" type="hidden">
			</span>
		</td>
	</tr>
	<tr>
	    <td>
	        <span class="ui-form-default" style="position: relative;display:inline-block;width:100%">
			    <!-- 如果当前节点有签，还没送出，在这显示意见内容 --> 
		        <textarea style="height: 100%;" id="REGULAR_MIND_CONTENT" class="ui-textarea-default" rows="10"></textarea>	  
			</span>
	    </td>
	</tr>
	<tr>
	    <td> <!--如果只读，不显示-->
	        <#if regularMind.READ_ONLY?? && regularMind.READ_ONLY != 'true' >
			    <span id="upload_REGULAR_MIND" class="MIND_INPUT_DIV_BORDER"></span>
			<#else>
			    <span id="upload_REGULAR_MIND" class="MIND_INPUT_DIV_BORDER"></span>
			</#if>
	    </td>
	</tr>	
	</#if>
	
	<!-- 最终意见， 如果有，显示输入框 --> 
	<#if canTerminalMind=true>
	<tr>
		<td rowspan='2' class="tc wp15" align="right"><!--意见类型-->${terminalMind.CODE_NAME}</td>
		<td class="wp85">
		<div class="mindTerminalInput">
		    <!-- 如果当前节点有签，还没送出，在这显示意见内容 --> 
	        <textarea style="height: 100%;" class="ui-textarea-default" id="TERMINAL_MIND" rows="10"></textarea>	
		</div>
		</td>	
	</tr>
	<tr>
	    <td>
	        <#if terminalMind.READ_ONLY?? && regularMind.READ_ONLY != true >
			    <span id="upload_TERMINAL_MIND" class="MIND_INPUT_DIV_BORDER"></span>  
			<#else>
			    <span id="upload_TERMINAL_MIND" class="MIND_INPUT_DIV_BORDER"></span>
			</#if>
	    </td>
	</tr>			
	</#if>
	
	<!-- 普通意见， 如果有，显示输入框 --> 
	<#if canGeneralMind=true>
	<tr>
		<td rowspan='2' class="tc wp15" align="right"><!--意见类型-->${generalMind.CODE_NAME}</td>
		<td class="wp85">
		<div class="mindGeneralInput">
		    <!-- 如果当前节点有签，还没送出，在这显示意见内容 -->
	        <textarea style="height: 100%;" id="GENERAL_MIND" class="ui-textarea-default" rows="10"></textarea>
		</div>
		</td>
	</tr>	
	<tr>
	    <td>
	        <#if terminalMind.READ_ONLY?? && regularMind.READ_ONLY != true >
			    <span id="upload_GENERAL_MIND" class="MIND_INPUT_DIV_BORDER"></span>    
			<#else>
			    <span id="upload_GENERAL_MIND" class="MIND_INPUT_DIV_BORDER"></span>
			</#if>  
	    </td>
	</tr>	
	</#if>
	

</table>
<table class="mindSaveBar" width="100%">
	<#if canGeneralMind=true || canTerminalMind=true || canRegularMind=true>
	<tr>
	    <td class="saveBarLeft"></td>
	    <td align="center" class="mt20 mb10 saveBarRight">
	        <span style="display:inline-block;margin:5px 0 5px 0;"><a id="saveMindBtn" class="rh-icon rhGrid-btnBar-a fr"><span class="rh-icon-inner">保存意见</span><span class="rh-icon-img btn-save"/></a></span>
	    </td>
	</tr>
	<#else>
	<tr>
	    <td colspan='2' align="center" class="mt20 mb10">
	        节点上未设置可填写意见
	    </td>
	</tr>	
	</#if>
</table>


