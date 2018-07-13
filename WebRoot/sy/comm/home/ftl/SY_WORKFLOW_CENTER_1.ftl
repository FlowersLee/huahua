<style type="text/css">
#${id} .firstLevelMenuBox{clear:both;margin-left:10px;margin-top:10px;margin-bottom:10px;border-bottom:1px dashed #DDD;overflow:auto;}
#${id} .firstLevelMenuName{width:90px;height:90px;float:left;vertical-align:middle; text-align:center; font-weight:bolder}
#${id} .firstLevelMenuName div {margin-top:40px;font-size:14px;}
#${id} .secoundLevelBox{width:100px;height:90px;float:left;text-align:center}
#${id} .secoundLevelList{float:left;}
#${id} .menuItemText{text-align:center;font-size:12px;margin-top:5px}
</style>

<div id='${id}' class='portal-box ${boxTheme}'> 
<div class='portal-box-title ${titleBar}'>
	<span class='portal-box-title-icon ${icon}'></span>
	<span class="portal-box-title-label">${title}</span>
</div>
<div class='portal-box-con' style="height:${height}">
	<#list TOPMENU as menu>	
		<div class="firstLevelMenuBox">
			<div class="firstLevelMenuName">
				<div><label>${menu.NAME!""}</label></div>
			</div>
			<#if (menu.CHILD)??>
				<div class="secoundLevelList">
				<#list menu.CHILD as menu2>
					<#-- 判断如果有子节点则遍历不展示没有则直接展示菜单-->
					<div class="secoundLevelBox cp" onclick="javascript:MenuAccess.open('${menu2.INFO!""}','${menu2.TYPE!""}','${menu2.NAME!""}','${defaultMenuId!""}')">
					<#if menu2.DSICON?? && (menu2.DSICON)?length !=0>
						<div class="firstLevelMenuImg"><img src="/sy/comm/desk/css/images/app_rh-icons/${menu2.DSICON!""}.png" class="block-backImg"></div>
					<#else>
						<div class="firstLevelMenuImg"><img src="/sy/comm/desk/css/images/app_rh-icons/xiezuo.png" class="block-backImg"></div>
					</#if>
						<div class="menuItemText">
							<label ><span class="cp" title="${menu2.TIP!""}">${menu2.NAME!""}</span></label>
						</div>
					</div>
				</#list>
				</div>
			</#if>
		</div>			
	</#list>
</div>
</div>