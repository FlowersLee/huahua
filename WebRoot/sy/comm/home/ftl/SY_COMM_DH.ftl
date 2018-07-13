<style>
	#dh-tabs .ui-tabs-nav li {background:url('/sy/comm/txl/y.png') repeat-x left -26px;margin:7px -5px 0px 6px;line-height:20px;}
	#dh-tabs .ui-tabs-nav li a{background:none;color:black;font-weight:normal;cursor: pointer;}
	#dh-tabs .ui-tabs-nav li.ui-tabs-selected {background:url('/sy/comm/txl/y.png') repeat-x;}
	#dh-tabs .ui-tabs-nav li.ui-tabs-selected a{background:none;color:white;font-weight:normal;cursor: pointer;}
	.img-css{
		float:left;
		margin:15px;
		width:100px;
	}
</style>
<#assign tabCount = tabCount!1>
<#assign tabNames = tabNames!"">
<#assign tabnames = tabNames?split(",")>
<div id='dh-tabs'>
	<ul class='portal-box-title' style="margin-left:-20px;">
        <li>
            <a href="#tab0">最近使用</a>
        </li>
		<#list 1..tabCount?number as i>
			<li>
				<a href="#tab${i}">${tabnames[i_index]}</a>
			</li>
		</#list>
    </ul>
	<div id='tab0'>
		<#list _DATA_0._DATA_ as recent>
		<div id = '${recent.RECENTLY_ID}' class='img-css' onclick="javascript:menuClick('${recent.RECENTLY_MENU_URL!""}','${recent.RECENTLY_MENU_TYPE!""}','${recent.RECENTLY_MENU_NAME!""}','${recent.RECENTLY_PIC_TIP!""}','${recent.RECENTLY_MENU_PIC!""}')">
		<#if recent.RECENTLY_MENU_PIC?? && (recent.RECENTLY_MENU_PIC)?length !=0>
			<div><img src="/sy/comm/desk/css/images/app_rh-icons/${recent.RECENTLY_MENU_PIC!""}.png"></div>
		<#else>
			<div><img src="/sy/comm/desk/css/images/app_rh-icons/xiezuo.png"></div>
		</#if>
			<div style='float:right;width:94px;'>
				<span  title="${recent.RECENTLY_PIC_TIP!""}">${recent.RECENTLY_MENU_NAME!""}</span>
			</div>
		</div>
		</#list>
	</div>
	<#list 1..tabCount?number as x>
	<#assign list = ("_DATA_" + (x_index+1))?eval>
		<div id='tab${x}'>
			<#include "SY_COMM_DH_CONTENT.ftl">
		</div>
	</#list>
</div>


<script type='text/javascript'>
    (function(){
		$(document).ready(function(){
            setTimeout(function(){
                $("#dh-tabs").tabs({});					
            }, 0);
        });
	})();
	
	function menuClick(url,type,name,tip,pic){
		var recentlyData = {};
		recentlyData["_SELECT_"]="*";
		recentlyData["_searchWhere"]=" and RECENTLY_MENU_URL='"+url+"' and RECENTLY_MENU_TYPE='"+type+"' and RECENTLY_MENU_NAME='"+name+"'";
		var recentlyList = FireFly.getListData("SY_COMM_RECENTLY_USE",recentlyData);
		var recentData={};
		if(recentlyList._OKCOUNT_>0){
			var recentlyTemp = recentlyList._DATA_[0];
			recentlyTemp["RECENTLY_TIME"]=rhDate.getCurentTime();
			recentlyTemp["_PK_"]=recentlyTemp["RECENTLY_ID"];
			recentlyTemp["RECENTLY_PIC_TIP"]=tip;
			recentlyTemp["RECENTLY_MENU_PIC"]=pic;
			recentData=FireFly.cardModify("SY_COMM_RECENTLY_USE",recentlyTemp);
		}else{
			recentlyData["RECENTLY_USER"]=System.getVar("@USER_CODE@");
			recentlyData["RECENTLY_MENU_URL"] = url;
			recentlyData["RECENTLY_MENU_TYPE"] = type;
			recentlyData["RECENTLY_MENU_NAME"] = name;
			recentlyData["RECENTLY_PIC_TIP"]=tip;
			recentlyData["RECENTLY_MENU_PIC"]=pic;
			recentlyData["RECENTLY_TIME"]=rhDate.getCurentTime();
			recentData = FireFly.cardAdd("SY_COMM_RECENTLY_USE",recentlyData);
		}
		var menuPic = $("#"+recentData.RECENTLY_ID);
		if(menuPic.size()==0){
			var tab0 = $("#tab0");
			var box= $("<div class='img-css' id='"+recentData.RECENTLY_ID+"'></div>");
			var pic = recentData.RECENTLY_MENU_PIC;
			if(recentData.RECENTLY_MENU_PIC.length!=0){
				$("<div><img src='/sy/comm/desk/css/images/app_rh-icons/"+pic+".png'"+"></div>").appendTo(box);
			}else{
				$("<div><img src='/sy/comm/desk/css/images/app_rh-icons/xiezuo.png'></div>").appendTo(box);
			}
			$("<div style='float:right;width:94px;'><span  title='"+recentData.RECENTLY_PIC_TIP+"'>"+recentData.RECENTLY_MENU_NAME+"</span></div>").appendTo(box);
			box.appendTo(tab0);
			box.unbind("click").bind('click',function(){
				menuClick(url,type,name,tip,pic);
			});
		}
		MenuAccess.open(url,type,name);
	}
</script> 
