<!--平台通用-列表模板-->

<!-- 参数-开始 -->
<#--
	tab.showThead是否显示标题
	tab
	list
-->
<!-- 参数-结束 -->

<!-- 自定义样式-开始 -->

<!-- 自定义样式-结束 -->
<#if asynTabFlag??>
	<#assign tab = asynTab>
	<#assign tab = tab + {"code":userCode, "name":userName + "的委办"}>
	<#assign list = _DATA_>
	<#assign tabSize = 0>
	<#assign countNum = _OKCOUNT_>
<#else>
	<#assign countNum = count>
</#if>

<table class="list_table" id="table_${tab.code}">
<thead class="head_table" id="head_${tab.code}">
	<#if tab.showThead == "true" && (list?size != 0)>
		<tr class="head_tr" id="head_tr_${tab.code}">
			<td class="head_td_order" id="head_td_order_${tab.code}"></td>
			<#list tab.col as c>
				<td id="head_td_${c.code}" style="${c.style};font-weight:bolder;color:#AAAAAA;">${c.name}</td>
			</#list>
		</tr>
	</#if>
</thead>
<tbody class="body_table" id="body_${tab.code}">
	<#if (list?size == 0)>
		<tr class="body_EMPTY" id="body_empty_${tab.code}">
			<td align="center">没有${tab.name}需要处理！</td>
		</tr>
	</#if>
	
	<#list list as o>
		<#if tab.dataServFlag != "">
			<#assign serv = o[tab.dataServFlag]>
		<#else>
			<#assign serv = tab.moreServ>
		</#if>
		<tr class="body_tr" id="body_tr_${o[tab.dataIdFlag]}" dataserv="${serv}" dataid="${o[tab.dataIdFlag]}" row="${o_index + 1}">
			<#assign emDeg = o[tab.emergField]!0>
			<td class="body_td_order" id=body_td_order_${tab.code}">
				<#if tab.imgEmerg == "true">
					<#if emDeg lte 10 >				
						<span class='span_emergency'></span>
					<#elseif emDeg lte 20>
						<span class='span_emergency comm_emergency__normal'></span>
					<#else>
						<span class='span_emergency comm_emergency__very'></span>
					</#if>
				<#else>
					<span name="order_span"
					<#if emDeg lte 10>
						class=''>		
						
					<#elseif emDeg lte 20>
						class='red_warn'>
						！
					<#else>
						class='red_warn'>
						！！
					</#if>
					</span>
				</#if>
			</td>
			<#list tab.col as c>
				<#-- 变量定义 开始-->
				<#if c.link??>
					<#assign linkCls = "link">
					<#if o[c.link]??>
						<#assign linkVal = o[c.link]>
					<#else>
						<#assign linkVal = c.link>
					</#if>
				<#else>
					<#assign linkCls = "">
					<#assign linkVal = "">
				</#if>
				<#--css省略号判断-->
				<#if c.ellipFlag??>
					<#assign ellipCls = "ellip">
				<#else>
					<#assign ellipCls = "">
				</#if>				
				<#--待办特需变量-->				
				<#if c.todoFlag??>					
					<#assign todotitle = o["TODO_TITLE"]>
					<#assign todocon = o["TODO_CONTENT"]>
					<#assign todoid = o["TODO_ID"]>
					<#assign todoOwner = o["OWNER_CODE"]>
					<#assign todoAttrs = "todotitle=\"" + todotitle + "\"" + "todocon=\"" + todocon + "\"" + "todoid=\"" + todoid + "\"" + "todoOwner=\"" + todoOwner + "\"">
				</#if>
				<#--格式化变量-->			
				<#if c.subString??>
					<#assign startIndex = c.subString["from"]>
					<#assign endIndex = c.subString["to"]>
				</#if>
				<#-- 变量定义 结束-->
				<td class="body_td_${c.code} ${linkCls} ${ellipCls}" link="${linkVal}" id="body_td_${o[tab.dataIdFlag]}" style="${c.style}" itemcode="${serv}-${c.code}" title="${o[c.code]}" <#if todoAttrs??>${todoAttrs}</#if>>
					<#if o[c.code] != "">
						<#if c.subString??>
							${o[c.code]?substring(startIndex,endIndex)}
						<#else>
							${o[c.code]}
						</#if>
					</#if>
				</td>
			</#list>
		</tr>
	</#list>
</tbody>
</table>
<input type="hidden" name="moreServ" value="${tab.moreServ}">
<input type="hidden" name="tabName" value="${tab.name}">
<input type="hidden" name="moreWhere" value="${tab.moreWhere}">
<input type="hidden" name="userCode" value="${userCode!""}">
<input type="hidden" name="count" value="${countNum}">
<#--注释掉	
	<#if (tabSize != 1 && list?size != 0 || asynTab??)>
		<div class="TAB_SHOW_MORE">
			<a href="#" onclick="thisBox.openMore('${tab.moreServ}','${tab.name}','${tab.moreWhere}'<#if asynTabFlag??>, {'agentFlag':true, 'AGT_USER_CODE':'${userCode}'}</#if>)">更多...</a>
		</div>
		<div style="clear:both;"></div>
	</#if>
-->