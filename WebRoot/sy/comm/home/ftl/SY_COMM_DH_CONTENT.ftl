<div class="menuBox">
<#list list.TOPMENU as menu2>
	<#-- 判断如果有子节点则遍历不展示没有则直接展示菜单-->
	<div class='img-css' onclick="javascript:menuClick('${menu2.INFO!""}','${menu2.TYPE!""}','${menu2.NAME!""}','${menu2.TIP!""}','${menu2.DSICON!""}')">
	<#if menu2.DSICON?? && (menu2.DSICON)?length !=0>
		<div><img src="/sy/comm/desk/css/images/app_rh-icons/${menu2.DSICON!""}.png"></div>
	<#else>
		<div><img src="/sy/comm/desk/css/images/app_rh-icons/xiezuo.png"></div>
	</#if>
		<div style='float:right;width:94px;'>
			<span  title="${menu2.TIP!""}">${menu2.NAME!""}</span>
		</div>
	</div>
</#list>
</div>
