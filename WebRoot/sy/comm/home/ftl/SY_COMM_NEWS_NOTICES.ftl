<#-- 信息管理列表查看-->
<#-- 自定义样式-->
<style>
 .rh-bottom-right-radius {
 -webkit-box-shadow: 0px 0px 0px #000;
 box-shadow: 0px 0px 0px #000;
}
 .rhGrid .rhGrid-thead-th  {
 
  border: 0px #C5C5C5 solid;
  text-align: left;
  
 }
 .rhGrid-thead-num {
  border: 0px #C5C5C5 solid;
 }
</style>
<#-- 表头信息-->
<div id='SY_COMM_NEWS_NOTICES' class='portal-box ${boxTheme}'>
<div id="SY_COMM_NEWS_NOTICES_CON" class='portal-box-con portal-box-tab' style="float:hidden;">
<#-- 标签-->
<ul class='portal-box-title'>
<li><a href="#SY_COMM_NEWS_NOTICES_TODAY" id="SY_COMM_NEWS_NOTICES_TODAY_A">最新通知公告</a></li>
<li><a href="#SY_COMM_NEWS_NOTICES_WEEK" id="SY_COMM_NEWS_NOTICES_WEEK_A">最新信息</a></li>
<li><a href="#SY_COMM_NEWS_NOTICES_MONTH" id="SY_COMM_NEWS_NOTICES_MONTH_A">最新期刊</a></li>
<#-- [更多]按钮-->
<span class="portal-box-more"><a href="javascript:void(0);" onclick="openMoreList()"></a></span>
</ul>
<#-- 标签div-->
<div id="SY_COMM_NEWS_NOTICES_TODAY" style='width:100%;height:260px;float:left;'></div>
<div id="SY_COMM_NEWS_NOTICES_WEEK" style='width:100%;height:260px;float:left;'></div>
<div id="SY_COMM_NEWS_NOTICES_MONTH" style='width:100%;height:260px;float:left;'></div>
</div>
</div>
<script type="text/javascript">
<#-- 引用[我填报信息]服务-->
function initShowList(thisObj,date){
  var temp = {"sId":"SY_COMM_INFOS","pCon":thisObj,"reset":"false","showPageFlag":false,"sortGridFlag":"false",
  "showSearchFlag":"false","showTitleBarFlag":"false","showButtonFlag":false,"links":date};
  var listView = new rh.vi.listView(temp);
  listView.show();
  
}

<#-- 点击[更多]按钮连接跳转-->
function openMoreList(){
	Tab.open({
		"url" : "SY_COMM_INFOS.list.do",
		"tTitle" : "我填报的信息",
		"menuFlag" : 4
	});
}

jQuery(document).ready(function(){
	<#-- 加载模板样式，并初始化默认标签页-->
    setTimeout(function() {
		  initShowList(jQuery("#SY_COMM_NEWS_NOTICES_TODAY"),{"TODAY":"TODAY",'_PAGE_':{'SHOWNUM':5}});
		  
	      jQuery("#SY_COMM_NEWS_NOTICES_CON").tabs({});
	},0);
    
	<#-- 最新通知公告[最新通知公告]标签绑定事件-->
    jQuery("#SY_COMM_NEWS_NOTICES_TODAY_A").unbind("click").bind("click",function(){
    	jQuery("#SY_COMM_NEWS_NOTICES_TODAY").html("");
		initShowList(jQuery("#SY_COMM_NEWS_NOTICES_TODAY"),{"TODAY":"TODAY",'_PAGE_':{'SHOWNUM':5}});
	});
    <#-- 最新信息[最新信息]标签绑定事件-->
	jQuery("#SY_COMM_NEWS_NOTICES_WEEK_A").unbind("click").bind("click",function(){
		jQuery("#SY_COMM_NEWS_NOTICES_WEEK").html("");
		initShowList(jQuery("#SY_COMM_NEWS_NOTICES_WEEK"),{"WEEK":"WEEK",'_PAGE_':{'SHOWNUM':5}});
	});
	<#-- 最新期刊[最新期刊]标签绑定事件-->
	jQuery("#SY_COMM_NEWS_NOTICES_MONTH_A").unbind("click").bind("click",function(){
		jQuery("#SY_COMM_NEWS_NOTICES_MONTH").html("");
		initShowList(jQuery("#SY_COMM_NEWS_NOTICES_MONTH"),{"MONTH":"MONTH",'_PAGE_':{'SHOWNUM':5}});
	});
});

</script>
