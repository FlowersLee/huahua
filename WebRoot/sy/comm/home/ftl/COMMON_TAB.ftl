<!--平台通用-标签模板-->

<!-- 参数-开始 -->
<#assign tabSize = (tabs?size)>
<#--
JSON配置说明
[
	{
		"id":"json",
		"value":{
			"titleCode":"gongwen",
			"titleName":"公文",
			"scriptPath":"",
			"conMinWid":"500px",
			"conMinHei":"300px",
			"tabs":[
				{
					"code":"todo1",
					"name":"待办公文",
					"subFile":"COMMON_LIST",
					"showThead":"true",
					"emergField":"S_EMERGENCY",
					"colorField":{"code":"TODO_OVERTIME_S","exp":"overTimeFlag == 'true'","color":"red"},
					"moreServ":"OA_GW_COMM_TODO",
					"moreWhere":" and TODO_CATALOG = 2 and  OWNER_CODE='@USER_CODE@' and  TODO_CONTENT is null",
					"dataServFlag":"",
					"dataIdFlag":"TODO_OBJECT_ID1",
					"col":[
						{"code":"TODO_TITLE","name":"公文标题","style":"width:30%;min-width:60px","ellipFlag":"true","link":"TODO_URL","todoFlag":"true"},
						{"code":"SEND_USER_CODE__NAME","name":"送交人","style":"width:15%;min-width:40px;text-align:center;"},
						{"code":"TODO_SEND_TIME","name":"送交时间","style":"width:25%;min-width:50px;text-align:center;"},
						{"code":"TODO_CODE_NAME","name":"公文类型","style":"width:20%;min-width:40px;text-align:center;"}
					],
					"imgEmerg":"false"
				}
			]
		},
		"name":"传递到ftl的JSON字符串"
	}
]
	
	titleCode标题编码
	titleName标题名
	conMinHei容器最小高度
	tabs
	
	补充说明（金伟）：
	titleCode 为正个tab窗口容器的ID tabsCode 为单个tab的ID tabsName为对应的显示名称 subFiles为tab对应的引用的ftl文件的文件名
	showThead 为是否显示设定的t1_head标题 true 为显示 fase为不显示 conMinHei 设定最小高度
	emergFields value值为逗号分隔的字符串 若为判断值模板在前行数前加标志信息 目前所加标志为红色的感叹号，个数对应tab个数
	0-10为一般  11-20为紧急 21以上为特急 已在模板中写死
	例子请看：core服务模板组织中 COMMON_TAB组件
-->
<!-- 参数-结束 -->

<!-- 自定义样式-开始 -->
<style>
	.portal-box-title {
		border-bottom: 2px #3875B8 solid !important;
	}
	<#if conMinHei??>
		#${titleCode}_con {
			min-height: ${conMinHei}
		}
	</#if>
	.TAB_SHOW_MORE {position:relative;float:right;right:20px;line-height:28px;}
	.ellip {
		overflow:hidden;
		white-space:nowrap;
		text-overflow:ellipsis;
		-o-text-overflow:ellipsis;
		-moz-text-overflow:ellipsis;
		-webkit-text-overflow:ellipsis;
		-icab-text-overflow: ellipsis;
		-khtml-text-overflow: ellipsis;
	}
	.red_warn {
		color:red;
	}
	.link:hover {
		cursor:pointer;
	}
	.body_tr:hover {
		background-color:#F0FFFF;
	}
	.tabA {font-weight:bolder;}
	.list_table {width:100%;table-layout:fixed;white-space:nowrap;}
	.head_td_order {width:5%;min-width:20px;}
	.imgspan {display:inline-block;width:16px;height:16px;}
	.normal-img {background:url(/sy/theme/default/images/slidemsg/blue.png) no-repeat  0px 0px transparent;}
	.emergency-img {background:url(/sy/theme/default/images/slidemsg/yellow.png) no-repeat  0px 0px transparent; }
	.hurry-img {background:url(/sy/theme/default/images/slidemsg/red.png) no-repeat  0px 0px transparent;}
	.${titleCode!boxTheme}_count {#color:white;}
	.tab-ul-con {padding-right:120px;height:30px;}
	.single-more {position:absolute;right:0px;top:0px;}
	.tab-arrow-right {position:absolute;right:65px;top:6px;}
	.tab-arrow-left {position:absolute;right:80px;top:6px;}
	.testImg {background: url(/sy/theme/default/images/icons/rh-leftMenu-iconsAll.png) no-repeat 0px -368px;}
</style>
<!-- 自定义样式-结束 -->
<div id="${titleCode!boxTheme}_box" class="portal-box ${boxTheme}">
	<div id="${titleCode!boxTheme}_con" class="portal-box-con portal-box-tab">
		<#-- 标题条-开始 -->
		<div class="tab-ul-con">
			<#-- 构造jQueryUI组件tab -->
			<ul class="portal-box-title" id="tab_ul" style="overflow:hidden;border-bottom:0px #f7ccab solid !important;background:none;">
				<#-- 构造静态tab -->			
				<#list tabs as o>
					<#if (tabSize == 1 && !asynTab??)>
						<#assign count = _OKCOUNT_>
					<#else>
						<#assign count = ("_DATA_" + o_index + "._OKCOUNT_")?eval>
					</#if>
					<li class="tabLi">
						<a class="tabA" asyn="false" tabCode="${o.code}" href="#${o.code}_div">
							<#if o.icon??>
								<span class="vm" style="display:inline-block;height:16px;width:16px;background:${o.icon};"></span>
							</#if>
							<label class="vm">
								${o.name}
								<#if count gte 0>
									(<span class="${titleCode!boxTheme}_count">${count}</span>)
								</#if>
							</label>
						</a>
					</li>
				</#list>
				<#-- 构造动态tab -->	
				<#if asynTab??>
					<#list ("_DATA_" + tabs?size + "._DATA_")?eval as asynO>
						<li class="tabLi" style="display: list-item;">
							<a class="tabA" asyn="true" tabCode="${asynO.aCode}" aCode="${asynO.aCode}" aName="${asynO.aName}" href="#${asynO.aCode}_div" >
								${asynO.aName}
							</a>
						</li>
					</#list>
				</#if>
			</ul>
		</div>
		<#--注释掉<#if tabSize == 1 && !asynTab??>-->
		<span class="cp portal-box-more single-more"><a></a></span>
		<#--注释掉</#if>-->
		<span class="cp fr tab-arrow-right ui-icon ui-icon-circle-triangle-e" onclick="tabShift('right','${titleCode!boxTheme}')" style="display:none;"></span>
		<span class="cp fr tab-arrow-left ui-icon ui-icon-circle-triangle-w" onclick="tabShift('left','${titleCode!boxTheme}')" style="display:none;"></span>	
		<#-- 标题条-结束 -->
		
		<#list tabs as t>
			<#if (tabSize == 1 && !asynTab??)>
				<#assign list = _DATA_>
				<#assign count = _OKCOUNT_>
			<#else>
				<#assign list = ("_DATA_" + t_index + "._DATA_")?eval>
				<#assign count = ("_DATA_" + t_index + "._OKCOUNT_")?eval>
			</#if>
			<#assign tab = t>
			<#assign filePath = "*/" + t.subFile + ".ftl">
			<div id="${t.code}_div">
				<#include "${filePath}">
			</div>
		</#list>
		<#if asynTab??>
			<#list _DATA_1._DATA_ as asynO>
				<div id="${asynO.aCode}_div">
				</div>
			</#list>
		</#if>
	</div>
</div>

<!-- 前端脚本 -->
<script type="text/javascript">
(function() {
	var thisBox;
    jQuery(document).ready(function(){
	    setTimeout(function() {
	    	<#-- jQueryUI组件渲染tab -->
	    		var clickFeel = "click";
			  	jQuery("#${titleCode!boxTheme}_con").tabs({
			  		"event": clickFeel
			  	});
		  	<#-- 初始化thisBox -->
		        thisBox = jQuery("#${titleCode!boxTheme}_box");
		        thisBox.openMore = function(serv, title, where, agentS){
				    var opts = {"url":serv + ".list.do", "tTitle":title, "menuFlag":4, "params":{"_extWhere":where}};
				    if(agentS){		    
				  	    opts.params["agentFlag"] = agentS.agentFlag;
				  		opts.params["AGT_USER_CODE"] = agentS["AGT_USER_CODE"];
				  	}
				  	Tab.open(opts);
			  	};
			  	thisBox.bindUrlEvent = function(){
				  	this.find(".link").bind("click",function(){
					  	if(jQuery(this).attr("todoid")){
						  	var url = jQuery(this).attr("link");
						  	var srcId = "";
						  	if(url.indexOf(".byid.do") > 0){
							  	srcId = url.slice(0,url.indexOf(".byid.do"));
						  	}
							  var title = "待办-" + jQuery(this).attr("todotitle");
							  var con = jQuery(this).attr("todocon");
							  var todoId = jQuery(this).attr("todoid");
							  var pkCode = jQuery(this).parent().attr("dataid");
							  
							  var todoOwner = jQuery(this).attr("todoOwner");
							  var todoOpts = {"sId":srcId,
											"title":title,
											"url":url,
											"con":con,
											"todoId":todoId,
											"objectID1":pkCode,
											"areaId":"${id}",
											"portalHandler":portalView,
											"ownerCode":todoOwner};
							  Todo.openByParams (todoOpts);
					  	}else{
						  	var options = {
								"url":jQuery(this).parent().attr("dataserv") + ".card.do?pkCode=" + jQuery(this).parent().attr("dataid"),
								"tTitle":jQuery(this).attr("title"),
								"menuFlag":4
						  	};
						  	Tab.open(options);
					  	}
			      	});
		      	};
		      	<#if asynTab??>
					thisBox.showSingleAgentList = function(userCode,userName){
						var resultData = FireFly.doAct("SY_COMM_TEMPL", "getPortalArea", {"PC_ID":"${asynTab.comsCode}", "AGT_USER_CODE":userCode, "userCode":userCode, "userName":userName, "asynTabFlag":"true"}, true, false);
						jQuery("#" + userCode + "_div").html(resultData.AREA);
						setTimeout(function() {
							var thisTempBox = jQuery("#${titleCode!boxTheme}_box");
							thisTempBox.bindUrlEvent = thisBox.bindUrlEvent;
							thisTempBox.bindUrlEvent();
							
						},0);
					};
				</#if>  	
		  	<#-- 系统默认 -->
			  	thisBox.bindUrlEvent();
			  	<#-- 处理tab标签 -->
				  	<#if 1==2><#-- 事件触发模式 -->
					  	thisBox.find(".tabA").bind(clickFeel,function(){
					  	  	var thisObj = jQuery(this);
					  	  	if(thisObj.attr("asyn") == "true"){
					  	  	  	thisBox.showSingleAgentList(thisObj.attr("aCode"), thisObj.attr("aName"));
					  	  	}
					  	  	thisBox.currTabCode = thisObj.attr("tabCode");
					  	});
				  	<#else><#-- 加载触发模式 -->
				  		thisBox.find(".tabA").each(function(i,e){
					  		var thisObj = jQuery(this);
					  		if(thisObj.attr("asyn") == "true"){
					  			thisBox.showSingleAgentList(thisObj.attr("aCode"), thisObj.attr("aName"));
					  				var tabCode = thisObj.attr("tabcode");
					  				var tabNum = jQuery("#" + tabCode + "_div").find("input[name='count']").val();
					  				var txt = thisObj.text();
					  				thisObj.html(txt + "(<span class='${titleCode!boxTheme}_count'>" + tabNum + "</span>)");
					  		}
					  		thisObj.bind(clickFeel,function(){
					  			thisBox.currTabCode = thisObj.attr("tabCode");
					  		});
					  	});
				  	</#if>
				  	thisBox.currTabCode = "${tabs[0].code}";
				  	this.tabs = jQuery(".tabLi", thisBox);
				  	thisBox.tabSize = this.tabs.length;
				  	<#-- 处理tab滚动按钮 -->
				  	var lastTab = jQuery("#tab_ul li:visible:last", thisBox);
				  	if (lastTab.length > 0 && lastTab.position && lastTab.position().top > 10) {
				  		jQuery(".tab-arrow-right", thisBox).show();
				  	}
			  	<#-- 处理更多按钮 -->
				  	thisBox.find(".single-more").unbind("click").bind("click",function(){
				  	  	<#--注释掉thisBox.openMore("${tabs[0].moreServ}","${tabs[0].name}","${tabs[0].moreWhere}");-->
				  	  	var currTabDiv = thisBox.find("#" + thisBox.currTabCode + "_div");
				  	  	var moreServ = currTabDiv.find("input[name='moreServ']").val();
				  	  	var tabName = currTabDiv.find("input[name='tabName']").val();
				  	  	var moreWhere = currTabDiv.find("input[name='moreWhere']").val();
				  	  	var userCode = currTabDiv.find("input[name='userCode']").val();
				  	  	if(userCode){
				  	  		thisBox.openMore(moreServ,tabName,moreWhere,{'agentFlag':true, 'AGT_USER_CODE':userCode});
				  	  	}else{
				  	  		thisBox.openMore(moreServ,tabName,moreWhere);
				  	  	}
				  	});
		  	<#-- 加载执行用户自定义脚本 -->
			  	<#if scriptPath?? && scriptPath != "">
				  	excuteExtJs("${scriptPath}",thisBox);
			  	</#if>
	    },0);
    });
})();

/**
*	执行组件的扩展js
*/
function excuteExtJs(path,thisBox){
	var jsFileUrl = FireFly.getContextPath() + path;
    jQuery.ajax({
        url: jsFileUrl,
        type: "GET",
        dataType: "text",
        async: false,
        data: {},
        success: function(data){
            try {
                var servExt = new Function(data);
                servExt.apply(thisBox);
            } catch(e){
            	throw e;
            }
        },
        error: function(){;}
    });
}

/**
*	tab标签切换程序
*/
function tabShift(oritation, boxCode){
	var boxObj = jQuery("#" + boxCode + "_box");
    if(oritation == "right"){ /*向右*/
        if(jQuery("#tab_ul li:visible:last", boxObj).position().top > 10){
            jQuery("#tab_ul li:visible:eq(0)", boxObj).hide("normal",function(){
	            if(jQuery("#tab_ul li:visible:last", boxObj).position().top <= 10){ /*到边就隐藏*/
	            	jQuery(".tab-arrow-right", boxObj).hide();
	            }
            });
            jQuery(".tab-arrow-left", boxObj).show(); /*显示左箭头*/
        }       	
    }else{ /*向左*/
		jQuery("#tab_ul li:hidden:last", boxObj).show("normal",function(){
			if(jQuery("#tab_ul li:hidden:last", boxObj).length == 0){ /*到边就隐藏*/
				jQuery(".tab-arrow-left", boxObj).hide();
			}
		});
		jQuery(".tab-arrow-right", boxObj).show(); /*显示右箭头*/
    }
}
</script>