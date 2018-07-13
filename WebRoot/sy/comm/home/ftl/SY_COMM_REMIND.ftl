<div id='SY_COMM_REMIND' style='overflow:hidden; float: left;width: 100%;background: url(/sy/comm/desk/css/images/rh-back/desk_42.jpg)'>
	<link rel="stylesheet" type="text/css" href="/sy/base/frame/coms/dhtmlxcalendar/dhtmlxcalendar.css"></link>
	<link rel="stylesheet" type="text/css" href="/sy/base/frame/coms/dhtmlxcalendar/skins/dhtmlxcalendar_dhx_terrace.css"></link>
	<script src="/sy/base/frame/coms/dhtmlxcalendar/dhtmlxcalendar.js"></script>
	<style type="text/css">
		.remindLi{height: 34px;background-color: white;border-bottom: dotted rgb(230, 230, 230) 1px;}
		.remindCheckboxSpan{float:left;border-right: solid red 1px;padding: 0.7% 1% 0.7% 1.8%;}
		.remindSpan{float: left;padding-top: 9px;padding-bottom: 9px;width: 95%;cursor: pointer;}
		.remindGroup{margin-bottom: 1px;height: 27px;background-color: rgb(70, 70, 70);}
		.remindDay{float: left;display: inline-block;}
		.remindType{float: left;margin-left: 4px;margin-top: -2px;margin-right: 2px;}
		.btn-search {background: url(/sy/theme/default/images/icons/rh-icons.png) no-repeat scroll -15px -14px transparent;color: white;}
		.groupEdictClass{line-height:2;background: transparent;float: left;height: 30px; width: 86%;height: 100%;border: none;color: white;}
		.groupEdictDelClass{width: 85%;}
		.remindTextEdictDiv{font-size: 15px;float: right;margin-right: 2%;background-color: rgb(223, 223, 223);cursor: pointer;}
		.groupLiClick{background-color: rgb(114, 71, 71);}
		.remindClick{background-color: #f3f3f3;}
		.remindDel{display:none; float:left;border-right: solid red 1px;padding: 1% 1% 1% 1%;cursor: pointer;}
		#remindUl a:hover{color:red;}
		.remindOneDiv{float:left; width: 20%; height: 97%;margin: 0.5% 1% 0.5% 1%;}
		.remindTwoDiv{width: 230px;height: 57%;float: left;}
		.remindOverFlowDiv{OVERFLOW-Y: auto; OVERFLOW-X:hidden;height: 80%;width: 100%;float: left;box-shadow: 0px 0px 8px 0px rgb(155, 155, 155);border-radius: 10px;}
		.remindOverFlowDiv li{cursor: pointer;}
		.remindOverFlowDiv input{cursor: pointer;}
		.remindInfoDiv{margin: 0.5% 1% 0.5% 1%;background-color: white;float: right; width: 75%; height: 97%;}
		.remindThreeDiv{width: 96%;float: left;margin: 2% 2% 2% 2%;height: 96%;}
		.groupDelSpan{display:none;line-height: 2;cursor: pointer;color: white;}
		.remindInfoLi{margin-bottom: 5px;margin-top: 5px;float: left;width: 100%;}

		.dhtmlxcalendar_container{
			position: relative;
			display: block;
			width: 188px;
			background-repeat: no-repeat;
			background-position: 0px 0px;
			z-index: 0;
			color: black;
			font-size: 11px;
			font-family: Tahoma;
		}
		.dhtmlxcalendar_container.dhtmlxcalendar_skin_dhx_terrace.dhtmlxcalendar_time_hidden{
			font-family: Arial;
			width: 230px;
			height: 209px;
			background-position: 0px 0px;
			background-image: none;
		}
		.dhtmlxcalendar_container.dhtmlxcalendar_skin_dhx_terrace {
			font-family: Arial;
			width: 230px;
			height: 233px;
			background-position: 0px 0px;
			background-image: none;
			box-shadow: 1px 1px 6px #909090;
		}
		
	
		.rhCard-tabs .ui-tabs-nav {width: 100%;background: none;}
		.ui-tabs .ui-tabs-nav {margin: 0;font-size: 14px;border-bottom: none;}
		.rhCard-tabs{background-color:white;}
	</style>
	<div style="width: 98%;height: 96%;margin-left: 1%;margin-top: 1%;background: url(/sy/comm/remind/bg.gif)">	
		<div id="remind" class="remindOneDiv">
			<div class="remindTwoDiv">
				<div class="remindThreeDiv">
					<div style="float: left;height: 25%;">
						<div style="float: left;width: 100%;">
							<div id="groupEdict" style="float: left;">
								<a class="rh-icon rhGrid-btnBar-a">
									<span class="rh-icon-inner"> 编 辑 </span>
									<span class="rh-icon-img btn-edit"></span>
								</a>	
							</div>
							<div id="groupEdictFinish" style="float: left;display: none;">
								<a class="rh-icon rhGrid-btnBar-a">
									<span class="rh-icon-inner"> 完成 </span>
									<span class="rh-icon-img btn-finish"></span>
								</a>
							</div>
							<div id="groupADD" style="float: left;">
								<a class="rh-icon rhGrid-btnBar-a">
									<span class="rh-icon-inner"> 添加 </span>
									<span class="rh-icon-img btn-add"></span>
								</a>
							</div>

						</div>
						<div style="float: left;margin-top: 5px;width: 100%;">
							<input type="text" id="SY_ALL_SEARCH_INPUT" value="    :提醒事项" style="background-color: transparent;color: white;float:left;width: 98%;border-radius: 10px;" class="btn-search"/>			
						</div>
					</div>
					<div class="remindOverFlowDiv" style="height: 75%;">
						<div style="width: 100%;float: left;height: 30%;">
							<ul style="color: white;">
								<li id="finish" class="remindGroup" style="line-height: 2;">已完成</li>
								<li id="toDay" class="remindGroup" style="line-height: 2;">今天</li>
							</ul>
						</div>
						<div id="groupDiv" style="width: 100%;float: left;height: 70%;">
							<ul id="group">
								
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div id="dateDiv" style="float: left;">
				<div id="calendarHere" style="position:relative"></div>
			</div>
		</div>
		<div id="remindInfo" class="remindInfoDiv">
			<div style="width: 98%; height: 97%;margin-left: 1%;float: left;">
				<div id="remindHead" style="height: 10%;width: 100%;">
					<div class="rhCard-tabs ui-tabs ui-widget ui-widget-content" style="float: left;min-height: 0px;width: 33%;">
						<ul class="tabUL tabUL-top ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header">
							<li id="remindSendBtn" class="rhCard-tabs-li rhCard-tabs-li-left ui-state-default"><a href="#">我发出的</a></li>
							<li id="remindMeBtn" class="rhCard-tabs-topLi rhCard-tabs-li rhCard-tabs-li-right ui-state-default"><a href="#">提醒我的</a></li>
						</ul>
					</div>
					<div id="remindDate" style="font-family: SimHei;color: red;width: 33%;float:left;font-size: 16px;margin-top: 1%;">
						
					</div>
					<div id="remindEdict"style=" float:right; text-align: right;margin-top: 1%;">
						<a id="remindTextEdict" class="rh-icon rhGrid-btnBar-a">
							<span class="rh-icon-inner"> 编 辑 </span>
							<span class="rh-icon-img btn-edit"></span>
						</a>
						<a id="remindTextEdictFinish" class="rh-icon rhGrid-btnBar-a" style="display: none;">
							<span class="rh-icon-inner"> 完成 </span>
							<span class="rh-icon-img btn-finish"></span>
						</a>											
						<a id="remindTextADD" class="rh-icon rhGrid-btnBar-a" name="rh-icon-a">	
							<span class="rh-icon-inner"> 添加 </span>
							<span class="rh-icon-img btn-add"></span>
						</a>
					</div>
				</div>
				<div id="memo_pad" style="background: url(/sy/comm/pad/left.png);height: 87.8%;OVERFLOW-Y: auto; OVERFLOW-X:hidden;width: 100%;float: left;border: solid #cccccc 1px;">
					<ul id="remindUl">
						
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>
<script type="text/javascript">
	var USER_CODE = System.getVar("@USER_CODE@");
	var Time = FireFly.byId("SY_COMM_REMIND",null);
	var ul = jQuery("#remindUl");
	<#--分组列表-->
	var groupData = {};
	groupData["_searchWhere"] = " and S_USER='"+USER_CODE+"'";
	var groupList = FireFly.getListData("SY_COMM_REMIND_GROUP",groupData);
	var groups="";
	for(var i=0;i<groupList._DATA_.length;i++){
		var groupLi = jQuery("<li class='remindGroup'><span class='groupDelSpan'>删除</span></li>").appendTo(jQuery("#group"));
		var groupInput = jQuery("<input readOnly='true' class='groupEdictClass' type='text' value='"+ groupList._DATA_[i].REM_GROUP+"'>").appendTo(groupLi);
		var hideGroupInput =jQuery("<input type='hidden' class='groupIdHid' value='"+ groupList._DATA_[i].GROUP_ID+"'>").appendTo(groupLi);
		var hideGroupInput2 =jQuery("<input type='hidden' class='groupContentHid' value='"+ groupList._DATA_[i].REM_GROUP+"'>").appendTo(groupLi);
		var GROUP_ID = groupList._DATA_[i].GROUP_ID;
	}
	<#--对分组查询绑定事件-->
	groupQuery();
	function groupQuery(){
		jQuery("#group").find("input[type='text']").unbind("click").bind("click",function(){
			jQuery("#remindUl").children().remove();
			var groupRemindData = {};
			groupRemindData["_searchWhere"] = " and S_USER='"+USER_CODE+"' and REM_GROUP='"+jQuery(this).parent().find(".groupIdHid").val()+"'";
			var groupRemindDataList = FireFly.getListData("SY_COMM_REMIND",groupRemindData);
			var groupRemindDataListLen = groupRemindDataList._DATA_.length;
			<#--创建Li-->
			createLiFun(groupRemindDataList,groupRemindDataListLen,"");
			<#--绑定复选框事件-->
			checkBoxBindFun();
			<#--在鼠标单击的坐标处弹出详细信息的div-->
			bindMouseFun();
			<#--绑定直接删除提醒的事件-->
			remindDelFun();
			<#--如果单击当前分组添加样式-->
			jQuery("#remind").find(".groupLiClick").removeClass("groupLiClick");
			jQuery(this).parent().addClass("groupLiClick");
		});		
	}
	groupModifyFun();
	<#--对分组的修改绑定事件-->
	function groupModifyFun(){
		jQuery("#group").find("input[type='text']").unbind("blur").bind("blur",function(){
			var groupIdVal = jQuery(this).parent().find(".groupIdHid").val();
			var groupContentVal = jQuery(this).parent().find(".groupContentHid").val();
			if(groupIdVal){
				if(jQuery(this).attr("readOnly") != "readonly"){
					<#--判断是否修改-->
					if (groupContentVal != jQuery(this).val()) {
						if (jQuery(this).val() != "") {
							
							FireFly.doAct("SY_COMM_REMIND_GROUP","save",{
								"_PK_": groupIdVal,
								"REM_GROUP": jQuery(this).val()
							},false);
						}
						else {
							var r=confirm("该分组为空将被删除");
							if(r){
								FireFly.listDelete("SY_COMM_REMIND_GROUP", {
									"_PK_": groupIdVal
								},false);
								var data = {};
								data["_searchWhere"] = " and REM_GROUP='" + groupIdVal + "'";
								var del = FireFly.getListData("SY_COMM_REMIND", data);
								for (var i = 0; i < del._DATA_.length; i++) {
									FireFly.listDelete("SY_COMM_REMIND", {
										"_PK_": del._DATA_[i].REM_GROUP
									},false);
									ul.find("#" + del._DATA_[i].REM_GROUP).remove();
								}
							}
						}
					}
				}
			}else{
				var newGroupVal = jQuery(this).val();
				var newReturn = FireFly.doAct("SY_COMM_REMIND_GROUP","save",{"REM_GROUP":newGroupVal},false);
				jQuery(this).parent().find(".groupIdHid").val(newReturn.GROUP_ID);
				jQuery(this).parent().find(".groupContentHid").val(newGroupVal);
				jQuery(this).attr("readOnly","true");
			}
		});
	}
	
	var myCalendar;
	<#--日历控件代码-->
	function doOnLoad() {
		myCalendar = new dhtmlXCalendarObject("calendarHere","dhx_terrace");
		
		dhtmlXCalendarObject.prototype.langData["ru"] = {
			monthesFNames: ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
			monthesSNames: ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
			daysFNames: ["周日","周一","周二","周三","周四","周五","周六"],
			daysSNames: ["日","一","二","三","四","五","六"],
			weekstart: 1
		};
		myCalendar.loadUserLanguage("ru");
		myCalendar.hideTime();
		myCalendar.show();
		<#--重置提醒信息上面的时间日期-->
		myCalendar.attachEvent("onClick",function(date){
			var remindDateDiv = jQuery("#remindDate");
			remindDateDiv.children().remove();
			var newDate=new Date(date);
			jQuery("<div class='remindDay'>"+newDate.getDate()+"日</div>").appendTo(remindDateDiv);
			jQuery("<div style='float: left;display: inline-block;margin-left: 4%;margin-right: 4%;'>"+getWeek(newDate.getDay())+"</div>").appendTo(remindDateDiv);
			jQuery("<div style='float: left;display: inline-block;'>"+newDate.getFullYear()+"年"+(newDate.getMonth()+ 1)+"月</div>").appendTo(remindDateDiv);
			<#--根据提醒的添加日期查询当前提醒-->
			<#--对开始时间结束时间的拼串-->
			var startDay = "";
			var endDay = "";
			if((newDate.getMonth()+ 1)<10){
				startDay += newDate.getFullYear()+"-0"+(newDate.getMonth()+ 1);
				endDay += newDate.getFullYear()+"-0"+(newDate.getMonth()+ 1);
			}else{
				startDay += newDate.getFullYear()+"-"+(newDate.getMonth()+ 1);
				endDay += newDate.getFullYear()+"-"+(newDate.getMonth()+ 1);
			}
			
			if(newDate.getDate()<10){
				startDay += "-0"+newDate.getDate()+" 00:00:00";
			}else{
				startDay += "-"+newDate.getDate()+" 00:00:00";
			}
			
			if((newDate.getDate()+1)<10){
				endDay += "-0"+(newDate.getDate()+1)+" 00:00:00";
			}else{
				endDay += "-"+(newDate.getDate()+1)+" 00:00:00";
			}
			
			jQuery("#remindUl").children().remove();
			var meRemindData = {};
			meRemindData["_searchWhere"] = " and S_USER='"+USER_CODE+"' and S_ATIME>'"+startDay+"' and S_ATIME<'"+endDay+"'";
			var meRemindDataList = FireFly.getListData("SY_COMM_REMIND",meRemindData);
			var meRemindDataListLen = meRemindDataList._DATA_.length;
			<#--创建Li-->
			createLiFun(meRemindDataList,meRemindDataListLen);
			<#--绑定复选框事件-->
			checkBoxBindFun();
			<#--在鼠标单击的坐标处弹出详细信息的div-->
			bindMouseFun();
			<#--绑定直接删除提醒的事件-->
			remindDelFun();
		});
	}
	<#--获取星期-->
	function getWeek(day){
		var week = new Array("星期日", "星期一", "星期二","星期三","星期四", "星期五","星期六");
		return week[day];
	}

	<#--页面加载的时候加载提醒信息上面的时间-->
	jQuery(document).ready(function(){
		doOnLoad();
		var remindDateDiv = jQuery("#remindDate");
		remindDateDiv.children().remove();	
		var newDate=new Date(myCalendar.getDate());
		jQuery("<div style='float: left;display: inline-block;'>"+newDate.getDate()+"日</div>").appendTo(remindDateDiv);
		jQuery("<div style='float: left;display: inline-block;margin-left: 4%;margin-right: 4%;'>"+getWeek(newDate.getDay())+"</div>").appendTo(remindDateDiv);
		jQuery("<div style='float: left;display: inline-block;'>"+newDate.getFullYear()+"年"+(newDate.getMonth()+ 1)+"月</div>").appendTo(remindDateDiv);
		jQuery("#SY_COMM_REMIND").height(GLOBAL.getDefaultFrameHei());
	});

	<#--查看我发出的按钮绑定事件-->
	jQuery("#remindSendBtn").unbind("click").bind("click",function(){
		jQuery("#remindMeBtn").removeClass("ui-tabs-selected ui-state-active");
		jQuery(this).addClass("ui-tabs-selected ui-state-active");
		jQuery("#remindUl").children().remove();
		var meRemindData = {};
		meRemindData["_searchWhere"] = " and S_USER='"+USER_CODE+"'";
		var meRemindDataList = FireFly.getListData("SY_COMM_REMIND",meRemindData);
		jQuery("#remindUl").children().remove();
		var meRemindDataListLen = meRemindDataList._DATA_.length;
		if(!meRemindDataListLen){
			jQuery("<li class='remindLi' style='text-align: center;line-height: 2.5;'>"+
					"<a>暂时没有提醒事项<a></li>").appendTo(jQuery("#remindUl"));
		}else{
			<#--创建Li-->
			createLiFun(meRemindDataList,meRemindDataListLen);
			<#--绑定复选框事件-->
			checkBoxBindFun();
			<#--在鼠标单击的坐标处弹出详细信息的div-->
			bindMouseFun();
			<#--绑定直接删除提醒的事件-->
			remindDelFun();
		}
	});
	<#--提醒我的绑定事件-->
	jQuery("#remindMeBtn").unbind("click").bind("click",function(){
		jQuery("#remindSendBtn").removeClass("ui-tabs-selected ui-state-active");
		jQuery(this).addClass("ui-tabs-selected ui-state-active");
		jQuery("#remindUl").children().remove();
		var remindMedata={};
		var remindMedataList = FireFly.getListData("SY_COMM_REMIND_ME",remindMedata);
		var remindMedataListLen =remindMedataList._DATA_.length;
		jQuery("#remindUl").children().remove();
		if(!remindMedataListLen){
			jQuery("<li class='remindLi' style='text-align: center;line-height: 2.5;'>"+
					"<a>暂时没有提醒<a></li>").appendTo(jQuery("#remindUl"));
		}else{
			<#--创建Li-->
			createLiFun(remindMedataList,remindMedataListLen);
			<#--绑定复选框事件-->
			checkBoxBindFun();
			<#--在鼠标单击的坐标处弹出详细信息的div-->
			bindMouseFun();
			<#--绑定直接删除提醒的事件-->
			remindDelFun();
		}	
	});
		
	<#--对已完成按钮绑定事件-->
	jQuery("#finish").unbind("click").bind("click",function(){
		jQuery("#remind").find(".groupLiClick").removeClass("groupLiClick");
		jQuery(this).addClass("groupLiClick");
		var finishedData = {};
		finishedData["_searchWhere"] = " and STATUS='FINISHED' and S_USER='"+USER_CODE+"'";
		var finishedDataList = FireFly.getListData("SY_COMM_REMIND",finishedData);
		if(!finishedDataList._DATA_.length){
			jQuery("#remindUl").children().remove();
			jQuery("<li class='remindLi' style='text-align: center;line-height: 2.5;'>"+
					"<a>暂时没有完成事项<a></li>").appendTo(ul);
		}else{
			jQuery("#remindUl").children().remove();
			var finishedDataLen = finishedDataList._DATA_.length;
			<#--创建Li-->
			createLiFun(finishedDataList,finishedDataLen,"checked");
			<#--绑定复选框事件-->
			checkBoxBindFun();
			<#--在鼠标单击的坐标处弹出详细信息的div-->
			bindMouseFun();
			<#--绑定直接删除提醒的事件-->
			remindDelFun();
		}
	});
	
	<#--今天按钮绑定事件(个人理解所有未完成的提醒都属于今天的)-->
	jQuery("#toDay").unbind("click").bind("click",function(){
		var startDay = System.getVar("@DATE@");
		var endDay = rhDate.nextDate(startDay,-1);
		startDay += " 00:00:00";
		endDay += " 00:00:00";
		jQuery("#remind").find(".groupLiClick").removeClass("groupLiClick");
		jQuery(this).addClass("groupLiClick");
		var toDayData = {};
		toDayData["_searchWhere"] = " and STATUS!='FINISHED' and S_USER='"+USER_CODE+"' and S_ATIME>'"+startDay+"' and S_ATIME<'"+endDay+"'";
		var toDayDataList = FireFly.getListData("SY_COMM_REMIND",toDayData);
		if(!toDayDataList._DATA_.length){
			jQuery("#remindUl").children().remove();
			jQuery("<li class='remindLi' style='text-align: center;line-height: 2.5;'>"+
					"<a>暂时没有事项<a></li>").appendTo(ul);
		}else{
			jQuery("#remindUl").children().remove();
			var toDayDataListLen = toDayDataList._DATA_.length;
			<#--创建Li-->
			createLiFun(toDayDataList,toDayDataListLen,"");
			<#--绑定复选框事件-->
			checkBoxBindFun();
			<#--在鼠标单击的坐标处弹出详细信息的div-->
			bindMouseFun();
			<#--绑定直接删除提醒的事件-->
			remindDelFun();
		}		
	});
	
	jQuery("#toDay").click();
	<#--根据当前提醒人搜索输入框绑定事件-->
	jQuery("#SY_ALL_SEARCH_INPUT").unbind("keyup").bind("keyup",function(){
		var searchVal = jQuery(this).val();
		jQuery("#remindUl").children().remove();
		if(jQuery("#remindMeBtn").hasClass("ui-state-active")){
			<#--搜索提醒我的-->
			var soRemindMedata = {};
			soRemindMedata["_searchWhere"] = " and REM_CONTENT like '%"+searchVal+"%'";
			var soRemindMedataList = FireFly.getListData("SY_COMM_REMIND_ME",soRemindMedata);
			var soRemindMedataListLen = soRemindMedataList._DATA_.length;
			<#--创建Li-->
			createLiFun(soRemindMedataList,soRemindMedataListLen,"");
			<#--在鼠标单击的坐标处弹出详细信息的div-->
			bindMouseFun();
			<#--绑定复选框事件-->
			checkBoxBindFun();	
			<#--绑定直接删除提醒的事件-->
			remindDelFun();
		}else{
			<#--默认搜索我发出的提醒-->
			var soMeRemindData = {};
			soMeRemindData["_searchWhere"] = " and S_USER='"+USER_CODE+"' and REM_CONTENT like '%"+searchVal+"%'";
			var soMeRemindDataList = FireFly.getListData("SY_COMM_REMIND",soMeRemindData);
			var soMeRemindDataListLen = soMeRemindDataList._DATA_.length;
			<#--创建Li-->
			createLiFun(soMeRemindDataList,soMeRemindDataListLen,"");
			<#--在鼠标单击的坐标处弹出详细信息的div-->
			bindMouseFun();
			<#--绑定复选框事件-->
			checkBoxBindFun();
			<#--绑定直接删除提醒的事件-->
			remindDelFun();

		}
	});

	<#--添加分组按钮绑定事件-->
	jQuery("#groupADD").unbind("click").bind("click",function(){
		var newgroupLi = jQuery("<li class='remindGroup'></li>").appendTo(jQuery("#group"));
		var newgroupDelSpan = jQuery("<span class='groupDelSpan'>删除</span>").appendTo(newgroupLi);
		var newgroupInput = jQuery("<input class='groupEdictClass' type='text' value='新分组'>").appendTo(newgroupLi);
		jQuery("<input type='hidden' class='groupIdHid'>").appendTo(newgroupLi);
		jQuery("<input type='hidden' class='groupContentHid'>").appendTo(newgroupLi);
		newgroupInput.unbind("click").bind("click",function(){
			jQuery("#remind").find(".groupLiClick").removeClass("groupLiClick");
			jQuery(this).parent().addClass("groupLiClick");			
		});
		<#--删除分组按钮绑定事件-->
		groupDelFun();
		newgroupInput.focus();
		groupModifyFun();
		groupQuery();
	});
	
	<#--编辑分组按钮绑定事件-->
	jQuery("#groupEdict").unbind("click").bind("click",function(){
		jQuery(".groupEdictClass").removeAttr("readOnly");
		jQuery(this).hide();
		jQuery("#groupEdictFinish").show();
		if (jQuery("#group").children().size() > 1) {
			jQuery(".remindGroup").find(".groupDelSpan").show();
			jQuery(".remindGroup").find("input[type='text']").addClass("groupEdictDelClass");
		}		
		jQuery("#group").find(".groupLiClick").find("input[type='text']").focus();
	});
	
	<#--删除分组按钮绑定事件-->
	groupDelFun();
	function groupDelFun(){
		jQuery(".remindGroup").find("span").unbind("click").bind("click",function(){
			var r=confirm("将删除该分组内的所有提醒消息");
			if(r){
				if (jQuery("#group").children().size() > 1) {
					var groupDelID = jQuery(this).parent().find("input:hidden").val();
					<#--删除分组的时候删除所有该分组内的所有提醒-->
					var delWhere = {};
					delWhere["_searchWhere"] = " and REM_GROUP='"+groupDelID+"'";
					var del = FireFly.getListData("SY_COMM_REMIND",delWhere);
					for(var i=0;i<del._DATA_.length;i++){
						var aa = FireFly.listDelete("SY_COMM_REMIND",{"_PK_":del._DATA_[i].REM_ID},false);
						ul.find("#"+del._DATA_[i].REM_ID).remove();
					}
					FireFly.listDelete("SY_COMM_REMIND_GROUP",{"_PK_":groupDelID},false);
					jQuery(this).parent().remove();
					if(jQuery("#group").children().size()==1){
						jQuery(".remindGroup").find("span").hide();
					}
				}
			}
		});
	}
	<#--完成编辑分组按钮绑定事件-->
	jQuery("#groupEdictFinish").unbind("click").bind("click",function(){
		jQuery(".remindGroup").find(".groupDelSpan").hide();
		jQuery(this).hide();
		jQuery("#groupEdict").show();
		jQuery(".groupEdictClass").attr("readOnly","true");
		jQuery(".remindGroup").find("input[type='text']").removeClass("groupEdictDelClass");
	});
	
	<#--页面加载时对复选框按钮绑定事件-->
	checkBoxBindFun();


	<#--消息的编辑按钮绑定事件-->
	jQuery("#remindTextEdict").unbind("click").bind("click",function(){
		jQuery("#remindUl").find("input:checkbox").parent().hide();
		jQuery("#remindUl").find(".remindDel").show();
		jQuery(this).hide();
		jQuery("#remindTextEdictFinish").show();
	});
	<#--消息的完成按钮绑定事件-->
	jQuery("#remindTextEdictFinish").unbind("click").bind("click",function(){
		jQuery("#remindUl").find("input:checkbox").parent().show();
		jQuery("#remindUl").find(".remindDel").hide();
		jQuery(this).hide();
		jQuery("#remindTextEdict").show();
	});
		
	jQuery("#SY_ALL_SEARCH_INPUT").unbind("click").bind("click",function(){
		jQuery(this).removeClass("btn-search");
		jQuery(this).val("");
	});
	jQuery("#SY_ALL_SEARCH_INPUT").unbind("blur").bind("blur",function(){
		jQuery(this).val("    :提醒事项");
		jQuery(this).addClass("btn-search");
	});

	<#--在鼠标单击的坐标处弹出详细信息的-->
	bindMouseFun();
	function bindMouseFun(){
		jQuery("#remindUl").find(".remindSpan").unbind("click").bind("click",function(event){			
			jQuery("#remindUl").children().removeClass("remindClick");
			jQuery(this).parent().addClass("remindClick");
			var remindID = jQuery(this).parent().attr("id");
			var remindContent = jQuery(this).find("#hiddenContent").val();
			var remindTime = jQuery(this).find("#hiddenTime").val();
			var remindEmergency = jQuery(this).find("#hiddenEmergency").val();
			var remindType = jQuery(this).find("#hiddenType").val();
			var remindUserWhereDatas = {};
			remindUserWhereDatas["_searchWhere"] = " and REMIND_ID='" + remindID + "'";
			var remindUsers = FireFly.getListData("SY_COMM_REMIND_USERS", remindUserWhereDatas);
			var userNames = "";
			var userIDs = "";
			if(remindUsers._DATA_.length){
				for (var i = 0; i < remindUsers._DATA_.length; i++) {
					if(i == remindUsers._DATA_.length-1){
						userNames += remindUsers._DATA_[i].USER_ID__NAME;
						userIDs += remindUsers._DATA_[i].USER_ID;						
					}else{
						userNames += remindUsers._DATA_[i].USER_ID__NAME+",";
						userIDs += remindUsers._DATA_[i].USER_ID+",";					
					}
				}
			}
			var showData ={"remindID":remindID,
							"remindContent":remindContent,
							"remindTime":remindTime,
							"remindEmergency":remindEmergency,
							"remindType":remindType,
							"remindUserNames":userNames,
							"remindUserIds":userIDs};
			getRemindDialog(event);
			showRemindItems(showData);
		});
	}
	<#--封装提醒复选框的绑定事件-->
	function checkBoxBindFun(){
		jQuery("#remindUl").find("input:checkbox").unbind("click").bind("click", function(event){
			var finishID = jQuery(this).parent().parent().attr("id");
			if (jQuery(this).attr("checked") == "checked") {
				FireFly.doAct("SY_COMM_REMIND","save",{
					"_PK_": finishID,
					"STATUS": "FINISHED"
				},false);
			}else {
				FireFly.doAct("SY_COMM_REMIND","save",{
					"_PK_": finishID,
					"STATUS": "WAITING"
				},false);
			}
		});
	}
	
	<#--对提醒消息的直接删除按钮绑定事件-->
	function remindDelFun(){
		jQuery("#remindUl").find(".remindDel").unbind("cilck").bind("click", function(){
			var r=confirm("将删除该分组内的所有提醒消息");
			if (r) {
				var remindDel = jQuery(this).parent().attr("id");
				FireFly.listDelete("SY_COMM_REMIND", {
					"_PK_": remindDel
				}, false);
				jQuery(this).parent().remove();
			}
		});
	}
	<#--提醒消息的添加按钮绑定事件-->
    jQuery("#remindTextADD").unbind("click").bind("click", function(event){
		var returnDateTime = FireFly.byId("SY_COMM_REMIND",null);
		getRemindDialog(event);
		<#--添加默认值-->
		var showData ={"remindID":"",
				"remindContent":"",
				"remindTime":returnDateTime.EXECUTE_TIME,
				"remindEmergency":"10",
				"remindType":"TODO",
				"remindUserNames":System.getVar("@USER_NAME@"),
				"remindUserIds":System.getVar("@USER_CODE@")};
		showRemindItems(showData);
	});	
	function getRemindDialog(event){
		var dialogId = "addRemindDia";
		var winDialog = jQuery("<div style='background-color:#F5FAFD;'></div>").addClass("selectDialog").attr("id",dialogId).attr("title","详细信息");
		winDialog.appendTo(jQuery("body"));
		var hei = 328;
	    var wid = 432;
	    var posArray = [30,30];
	    if (event) {
		    var cy = event.clientY;
		    posArray[0] = 680;
		    posArray[1] = 60;
	    }	    
		jQuery("#" + dialogId).dialog({
			autoOpen: false,
			height: hei,
			width: wid,
			modal: true,
			resizable:false,
			position:posArray,
			open: function() {
	
			},
			close: function() {
				jQuery("#" + dialogId).remove();
			}
		});
		var dialogObj = jQuery("#" + dialogId);
		dialogObj.dialog("open");
		dialogObj.focus();
	    jQuery(".ui-dialog-titlebar").last().css("display", "block");
		dialogObj.parent().addClass("rh-bottom-right-radius rhSelectWidget-content");
		Tip.showLoad("努力加载中...", null, jQuery(".ui-dialog-title", winDialog).last());
	}
	<#--弹出的对话框-->
	function showRemindItems(showData){
		var remindInfoDiv = jQuery("<div style='margin-left: 6%;width: 90%;height: 100%;'></div>").appendTo(jQuery("#addRemindDia"));
		jQuery("<input id='hiddenID' type=hidden value="+showData.remindID+">").appendTo(remindInfoDiv);
		var remindInfoUL = jQuery("<ul></ul>").appendTo(remindInfoDiv);		
		var Li_0 = jQuery("<li id='remindCount' class='remindInfoLi'></li>").appendTo(remindInfoUL);
		var textareaVal = jQuery("<textarea wrap='soft' id='pad_text' style = 'overflow-y:hidden;height: 130px;width: 380px;'></textarea>").appendTo(Li_0);
		textareaVal.val(showData.remindContent);
		var Li_1 = jQuery("<li id='remindTime' style='' class='remindInfoLi'></li>").appendTo(remindInfoUL);
		jQuery("<span style='padding: 4px 2px 4px 2px;width: 130px;display: inline-block;'>提醒时间：</span>").appendTo(Li_1);
		var remindTimeVal = jQuery("<input id='d11' style='width: 200px;' type='text' class='Wdate' onFocus='WPicker()' />").appendTo(Li_1);
		remindTimeVal.val(showData.remindTime);
		var Li_2 = jQuery("<li id='remindEmergency' style='' class='remindInfoLi'></li>").appendTo(remindInfoUL);
		jQuery("<span style='padding: 4px 2px 4px 2px;width: 130px;display: inline-block;'>紧急程度：</span>").appendTo(Li_2);
		var selectTag = jQuery("<select style='width: 203px;'></select>").appendTo(Li_2);
		jQuery("<option value='10'>一般</option><option value='20'>紧急</option><option value='30'>特急</option>").appendTo(selectTag);
		selectTag.val(showData.remindEmergency);		
		var Li_3 = jQuery("<li id='remindType' style='' class='remindInfoLi'></li>").appendTo(remindInfoUL);
		jQuery("<span style='padding: 4px 2px 4px 2px;width: 130px;display: inline-block;float: left;'>提醒方式:</span>").appendTo(Li_3);
		var typeTag = jQuery("<span style='float: left;'></span>").appendTo(Li_3);
		jQuery("<input class='remindType' type='checkbox' name='TODO' value='TODO'><span style='float: left;'>待办</span>").appendTo(typeTag);
		jQuery("<input class='remindType' type='checkbox' name='EMAIL' value='EMAIL'><span style='float: left;'>邮件</span>").appendTo(typeTag);
		jQuery("<input class='remindType' type='checkbox' name='MESSAGE' value='MESSAGE'><span style='float: left;'>短消息</span>").appendTo(typeTag);
		jQuery("<input class='remindType' type='checkbox' name='INTIME' value='INTIME'><span style='float: left;'>即时通讯</span>").appendTo(typeTag);
		
		var remindTypeArr =  showData.remindType;
		<#--如果是修改则回显提醒方式-->
		if (remindTypeArr) {
			remindTypeArr = remindTypeArr.split(",");
			for (var i = 0; i < remindTypeArr.length; i++) {
				typeTag.find("input[name='" + remindTypeArr[i] + "']").attr("checked", true);
			}
		}
		var Li_4 = jQuery("<li style='' class='remindInfoLi'></li>").appendTo(remindInfoUL);		
		var remindUserTag = jQuery("<span style='padding: 4px 2px 4px 2px;width: 130px;display: inline-block;'>被提醒人：</span>").appendTo(Li_4);
		var remindUserVal = jQuery("<input style='width: 200px;' id='remindUsers' type='text'>").appendTo(Li_4);
		var remindUserhidVal = jQuery("<input type='hidden'>").appendTo(Li_4);
		remindUserVal.val(showData.remindUserNames);
		remindUserhidVal.val(showData.remindUserIds);
		var Li_5 = jQuery("<li id='remindDel' style='margin-top: 10px;' class='remindInfoLi'></li>").appendTo(remindInfoUL);
		
		var delTag = jQuery("<a class='rh-icon rhGrid-btnBar-a' style='margin-right: 10px;margin-left: 33%;'></a>").appendTo(Li_5);
		jQuery("<span class='rh-icon-inner'> 删除 </span>").appendTo(delTag);
		jQuery("<span class='rh-icon-img btn-delete'></span>").appendTo(delTag);
		
		var finishTag = jQuery("<a class='rh-icon rhGrid-btnBar-a'></a>").appendTo(Li_5);
		jQuery("<span class='rh-icon-inner'> 完成 </span>").appendTo(finishTag);
		jQuery("<span class='rh-icon-img btn-finish'></span>").appendTo(finishTag);
		
		var okTag = jQuery("<a class='rh-icon rhGrid-btnBar-a' style='display:none;margin-left: 130px;'></a>").appendTo(Li_5);
		jQuery("<span class='rh-icon-inner'> 确定 </span>").appendTo(okTag);
		jQuery("<span class='rh-icon-img btn-ok'></span>").appendTo(okTag);
		
		<#--对删除按钮绑定事件-->
		delTag.unbind("click").bind("click",function(){
			var r=confirm("将删除该分组内的所有提醒消息");
			if (r) {
				jQuery("#" + showData.remindID).remove();
				FireFly.listDelete("SY_COMM_REMIND", {
					"_PK_": showData.remindID
				}, false);
				jQuery("#addRemindDia").remove();
			}
		});

		<#--对提醒人文本框绑定事件-->
		jQuery("#remindUsers").unbind("click").bind("click",function(event){
			<#--构造树形选择参数-->
			var configStr = "SY_ORG_DEPT_USER,{'TYPE':'multi'}";
			var options = {
				"config" :configStr,
				"replaceCallBack":function(idArray,nameArray){<#--回调，idArray为选中记录的相应字段的数组集合-->
					jQuery("#remindUsers").val(nameArray);
					jQuery("#remindUsers").next().val(idArray);
				}
			};
			<#--显示树形-->
			var dictView = new rh.vi.rhDictTreeView(options);
			dictView.show(event);	
		});

		<#--判断是否添加-->
		if(!showData.remindID){
			delTag.hide();
			finishTag.hide();
			okTag.show();
			<#--对确定按钮绑定事件-->
			okTag.unbind("click").bind("click",function(){
				var remindCount = jQuery("#pad_text").val();
				var remindTime = jQuery("#remindTime").find("input").val();
				var remindEmergency = jQuery("#remindEmergency").find("select").val();
				var remindType = "";
				jQuery.each(jQuery("#remindType").find("input:checked"), function(i,val){
					remindType += val.value+",";
				});
				<#--判断是否有选中分组没有选中则默认是第一个-->
				var REM_GROUP = jQuery("#group").find(".groupLiClick").find(".groupIdHid").val();
				if(!REM_GROUP){
					REM_GROUP =  jQuery("#group").first().find("input[type='hidden']").val();
				}
				var remindUsers = jQuery("#remindUsers").next().val();
			 	var returnRemindData = FireFly.doAct("SY_COMM_REMIND","save",
												{"REM_CONTENT":remindCount,
													"EXECUTE_TIME":remindTime,
													"S_EMERGENCY":remindEmergency,
													"TYPE":remindType,
													"REM_GROUP":REM_GROUP},false);	
				jQuery("#addRemindDia").remove();
				var usersArr = remindUsers.split(",");
				var REMIND_ID = returnRemindData.REM_ID;
				for(var i=0;i<usersArr.length;i++){
					if(usersArr[i]){
						var returnUsersData = FireFly.doAct("SY_COMM_REMIND_USERS","save",{"REMIND_ID":REMIND_ID,"USER_ID":usersArr[i]},false);					
					}
				}
				if(!ul.children().first().attr("id")){
					ul.children().remove();
				}
				var newLi = jQuery("<li class='remindLi' id='"+returnRemindData.REM_ID+"'>"+
					"<a class='remindDel'>删除</a>"+
					"<span class='remindCheckboxSpan'><input style='float: left;' type='checkbox'></span>"+
					"<span class='remindSpan'>"+
					"<input id='hiddenContent' type='hidden' value='"+returnRemindData.REM_CONTENT+"'>"+
					"<input id='hiddenTime' type='hidden' value='"+returnRemindData.EXECUTE_TIME+"'>"+
					"<input id='hiddenEmergency' type='hidden' value='"+returnRemindData.S_EMERGENCY+"'>"+
					"<input id='hiddenType' type='hidden' value='"+returnRemindData.TYPE+"'>"+
					"<input id='hiddenUsers' type='hidden' value='"+remindUsers+"'>"+
					"<span style='float: left;margin-left: 3%;width: 50%;'>"+returnRemindData.REM_CONTENT.substring(0,50)+"</span>"+
					"</span></li>").appendTo(ul);				

				<#--在鼠标单击的坐标处弹出详细信息的div-->
				bindMouseFun();
				<#--绑定复选框事件-->
				checkBoxBindFun();	
				<#--绑定直接删除提醒的事件-->
				remindDelFun();							
			});
		}else{
			<#--对完成按钮绑定事件-->
			finishTag.unbind("click").bind("click",function(){
				var remindCount = jQuery("#pad_text").val();
				jQuery("#"+showData.remindID).find("#hiddenContent").val(remindCount);
				jQuery("#"+showData.remindID).find(".remindSpan span").text(remindCount.substring(0,65));
				var remindTime = jQuery("#remindTime").find("input").val();
				jQuery("#"+showData.remindID).find("#hiddenTime").val(remindTime);
				var remindEmergency = jQuery("#remindEmergency").find("select").val();
				jQuery("#"+showData.remindID).find("#hiddenEmergency").val(remindEmergency);
				var remindType = "";
				jQuery.each(jQuery("#remindType").find("input:checked"), function(i,val){
					remindType += val.value+",";
				 });
				jQuery("#"+showData.remindID).find("#hiddenType").val(remindType);
				var remindUsers = jQuery("#remindUsers").val();
				<#--div中文本框的被提醒人的值-->
				FireFly.doAct("SY_COMM_REMIND","save",
									{"REM_CONTENT":remindCount,
									"EXECUTE_TIME":remindTime,
									"S_EMERGENCY":remindEmergency,
									"USER_ID":remindUsers,
									"TYPE":remindType,
									"_PK_":showData.remindID},false);
				
				if(jQuery("#remindUsers").next().val() != jQuery("#" + showData.remindID).find("#hiddenUsers").val()){
					<#--修改提醒人-->
					var userDel = {};
					userDel["_searchWhere"] = " and REMIND_ID='"+showData.remindID+"'";
					var returnDelUser = FireFly.getListData("SY_COMM_REMIND_USERS",userDel);
					for(var j=0;j<returnDelUser._DATA_.length;j++){
						FireFly.listDelete("SY_COMM_REMIND_USERS",{"_PK_":returnDelUser._DATA_[j].REMIND_USER_ID},false);
					}
					<#--div文本框隐藏域的用户code值-->
					var usersAdd = jQuery("#remindUsers").next().val();
					var usersArr = usersAdd.split(",");
					for(var i=0;i<usersArr.length;i++){
						if(usersArr[i]){
							FireFly.doAct("SY_COMM_REMIND_USERS","save",{"REMIND_ID":showData.remindID,"USER_ID":usersArr[i]},false);					
						}
					}
					jQuery("#" +showData.remindID).find("#hiddenUsers").val(usersAdd);
				}
				jQuery("#addRemindDia").remove();
			});		
		}
	}
	function WPicker(){
		WdatePicker({'dateFmt':'yyyy-MM-dd HH:mm:ss',});
	}
	<#--创建Li-->
	function createLiFun(dataObj,dataLen,ch){
		for(var i=0;i<dataLen;i++){
			var remID = {};
			remID["_searchWhere"] = " and REMIND_ID='"+dataObj._DATA_[i].REM_ID+"'";
			var usersData  = FireFly.getListData("SY_COMM_REMIND_USERS",remID);
			var users = "";
			for(var j=0;j<usersData._DATA_.length;j++){
				if(j==usersData._DATA_.length-1){
					users += usersData._DATA_[j].USER_ID;
				}else{
					users += usersData._DATA_[j].USER_ID+",";
				}
			}
			<#--判断完成状态-->
			var finishState ="";
			if(dataObj._DATA_[i].STATUS == "FINISHED"){
				finishState = "checked";
			}
			var REM_CONTENT = dataObj._DATA_[i].REM_CONTENT;
			if(REM_CONTENT.length>65){
				REM_CONTENT = REM_CONTENT.substring(0,65);
			}
			jQuery("<li class='remindLi' id='"+dataObj._DATA_[i].REM_ID+"'>"+
				"<a class='remindDel'>删除</a>"+
				"<span class='remindCheckboxSpan'><input style='float: left;' type='checkbox' "+finishState+"></span>"+
				"<span class='remindSpan'>"+
				"<input id='hiddenContent' type='hidden' value='"+dataObj._DATA_[i].REM_CONTENT+"'>"+
				"<input id='hiddenTime' type='hidden' value='"+dataObj._DATA_[i].EXECUTE_TIME+"'>"+
				"<input id='hiddenEmergency' type='hidden' value='"+dataObj._DATA_[i].S_EMERGENCY+"'>"+
				"<input id='hiddenType' type='hidden' value='"+dataObj._DATA_[i].TYPE+"'>"+
				"<input id='hiddenUsers' type='hidden' value='"+users+"'>"+
				"<span style='float: left;margin-left: 3%;width: 88%;'>"+REM_CONTENT+"</span>"+
				"</span></li>").appendTo(ul);
		}
	}
</script>