<style>
	.TAB_SHOW_MORE {
		position:relative;
		float:right;
		right:20px;
		line-height:28px;
	}
</style>

<div id='CM_TODO_TAB' class='portal-box ${boxTheme}'>
	<div id="CM_TODO_TAB_CON" class='portal-box-con portal-box-tab' style='min-height: 290px'>
		<!-- BAR -->
		<ul class='portal-box-title'>
			<li><a href="#CM_TODO_TAB_TODO">待办</a></li>
			<#if (_DATA_1._DATA_?size != 0)>
			<#list _DATA_1._DATA_ as agents>
				<li><a class="AGENT_TAB" href="#CM_TODO_TAB_AGENT_${agents.aCode}" aCode="${agents.aCode}" aName="${agents.aName}">代${agents.aName}办</a></li>
			</#list>
			</#if>
		</ul>
		<!-- TODO -->
		<div id="CM_TODO_TAB_TODO">
			<table width="100%">
				<#if (_DATA_0._DATA_?size == 0)>
				<tr>
					<td align=center>没有待办需要处理！</td>
				</tr>
				</#if>
				<#list _DATA_0._DATA_ as content>
				<tr>
					<td width='10px' style='font-size: 8px;'>&nbsp;&#8226;</td>
					<td>
						<a href="javascript:void(0);"
							onclick="openTODOCard('${content.TODO_CODE}','${content.TODO_CODE_NAME}','${content.TODO_OBJECT_ID1}','待办-${content.TODO_TITLE}','${content.TODO_URL!}','${content.TODO_CONTENT!}','${content.TODO_ID!}','${content.OWNER_CODE!}','${content.TODO_CATALOG!}','CM_TODO,CM_TODO_YUE')"
							title="${content.TODO_TITLE}"> 
							<#if (content.TODO_TITLE?length > 25)>
							${content.TODO_TITLE?substring(0,25)}...
							<#else>
							${content.TODO_TITLE}
							</#if>
						</a>
					</td>
					<td>${content.SEND_USER_CODE__NAME}</td>
					<td>${content.TODO_SEND_TIME}</td>
					<td>${content.TODO_CODE_NAME!}</td>
				</tr>
				</#list>
			</table>
			<#if (_DATA_0._DATA_?size != 0)>
			<div class="TAB_SHOW_MORE">
				<a href="#" onclick="openMoreTodoListPage('1')">更多...</a>
			</div>
			<div style="clear:both;"></div>
			</#if>
		</div>
		<!-- AGENT -->
		<#if (_DATA_1._DATA_?size != 0)>
		<#list _DATA_1._DATA_ as agents>
			<div id="CM_TODO_TAB_AGENT_${agents.aCode}">
			</div>
		</#list>
		</#if>
	</div>
</div>

<script type="text/javascript">
(function() {
    jQuery(document).ready(function(){
	    setTimeout(function() {
	      jQuery("#CM_TODO_TAB_CON").tabs({});
	    },0);
	    jQuery(".AGENT_TAB").each(function(i,n) {
			jQuery(n).bind("click",function(event){
				showSingleAgentList($(this).attr("aCode"));
			})
		});
    });
})();

function showSingleAgentList(userCode){
	var resultData = FireFly.doAct("SY_COMM_TEMPL", "getPortalArea", {"PC_ID":"${childComsCode}", "AGT_USER_CODE":userCode}, true, false);
	jQuery("#CM_TODO_TAB_AGENT_" + userCode).html(resultData.AREA);
	
}

function openMoreAgent(){
	var opts = {"url":"SY_COMM_TODO_AGENT.list.do", "tTitle":"我的委托", "menuFlag":4, "params":{}};
	Tab.open(opts);
}
</script>
