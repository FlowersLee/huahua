<#-- 各单位发稿情况统计-->
<style type="text/css">
	.tabs-portal .portal-box-title {}
	.tabs-portal .portal-box-title ul{padding-left:5px;}
	.tabs-portal .portal-box-title li {line-height:29px;padding:0px 10px;text-align: left;float: left; }
	.tabs-portal .tab-ul {padding:8px;}
	.tabs-portal .tab-ul li {color:black;line-height:29px;}
	.tabs-portal .tab-ul li a {color:black;}
	.tabs-portal .tab-ul-none {display:none;}
	.tabs-portal .tab-portal-box-a {text-decoration: none;font-size:8px;}
	.tabs-portal .tab-portal-box-a:hover {text-decoration: underline;color:red;}
</style>
<div id='SY_COMM_NEWS_REPORT' class='portal-box tabs-portal ${boxTheme}' style='height:${height};min-height:200px'>
	<div id="tabs-portal-tab-id" class="portal-box-title">
	  <ul>
		  <li class="new_tab tabSelected" conul="con_ul1"><a href="javascript:void(0);" target="_blank">本月</a></li>
		  <li class="new_tab" conul="con_ul2"><a href="javascript:void(0);" target="_blank">本季度</a></li>
		  <li class="new_tab" conul="con_ul3"><a href="javascript:void(0);" target="_blank">上半年</a></li>
		  <li class="new_tab" conul="con_ul4"><a href="javascript:void(0);" target="_blank">下半年</a></li>
		  <li class="new_tab" conul="con_ul5"><a href="javascript:void(0);" target="_blank">全年</a></li>  
	  </ul>
	</div>
	<div class='portal-box-con'>
		<ul id="con_ul1" class="tab-ul" code="MONTH">
			<iframe src='' border='0' frameborder='0' width='100%' height='500px' scrolling=no></iframe>
		</ul>
		<ul id="con_ul2" class="tab-ul tab-ul-none" code="SEASON">
			<iframe src='' border='0' frameborder='0' width='100%' height='500px' scrolling=no></iframe>
		</ul>
		<ul id="con_ul3" class="tab-ul tab-ul-none" code="FIRSTPART">
			<iframe src='' border='0' frameborder='0' width='100%' height='500px' scrolling=no></iframe>
		</ul>
		<ul id="con_ul4" class="tab-ul tab-ul-none" code="SECONDPART">
			<iframe src='' border='0' frameborder='0' width='100%' height='500px' scrolling=no></iframe>
		</ul>
		<ul id="con_ul5" class="tab-ul tab-ul-none" code="FULLYEAR">
			<iframe src='' border='0' frameborder='0' width='100%' height='500px' scrolling=no></iframe>
		</ul>
	</div>
</div>
<script type="text/javascript">
<#-- 格式化日期-->
function getFormatDate(format){
	<#-- 本月-->
	if (format == "MONTH") {
		return {"BEGIN_DATE":rhDate.pattern("yyyy-MM"),"END_DATE":rhDate.pattern("yyyy-MM")};
	<#-- 本季度-->
	} else if (format == "SEASON") {
		var season = parseInt(rhDate.pattern("MM"));
		<#-- 第一季度-->
		if (parseInt((season - 1) / 3) == 0) {
			return {"BEGIN_DATE":rhDate.pattern("yyyy-") + "01","END_DATE":rhDate.pattern("yyyy-") + "03"};
		<#-- 第二季度-->
		} else if (parseInt((season - 1) / 3) == 1) {
			return {"BEGIN_DATE":rhDate.pattern("yyyy-") + "04","END_DATE":rhDate.pattern("yyyy-") + "06"};
		<#-- 第三季度-->	
		} else if (parseInt((season - 1) / 3) == 2) {
			return {"BEGIN_DATE":rhDate.pattern("yyyy-") + "07","END_DATE":rhDate.pattern("yyyy-") + "09"};
		<#-- 第四季度-->
		} else if (parseInt((season - 1) / 3) == 3) {
			return {"BEGIN_DATE":rhDate.pattern("yyyy-") + "10","END_DATE":rhDate.pattern("yyyy-") + "12"};
		}
	<#-- 上半年-->
	} else if (format == "FIRSTPART") {
		return {"BEGIN_DATE":rhDate.pattern("yyyy-") + "01","END_DATE":rhDate.pattern("yyyy-") + "06"};
	<#-- 下半年-->
	} else if (format == "SECONDPART") {
		return {"BEGIN_DATE":rhDate.pattern("yyyy-") + "07","END_DATE":rhDate.pattern("yyyy-") + "12"};
	<#-- 全年-->
	} else if (format == "FULLYEAR") {
		return {"BEGIN_DATE":rhDate.pattern("yyyy-") + "01","END_DATE":rhDate.pattern("yyyy-") + "12"};
	}
}

<#--初始化 -->
jQuery(document).ready(function(){
    setTimeout(function() {
      jQuery("#con_ul1").find("iframe").attr("src","SY_COMM_INFO.chart.do?_PK_=SY_COMM_INFOS_COUNT&BEGIN_DATE="+rhDate.pattern("yyyy-MM")+"&END_DATE="+rhDate.pattern("yyyy-MM"));
      jQuery(".new_tab").bind("mouseover",function() {
	      if (jQuery(this).hasClass("tabSelected")) {
	          return;
	      }
	      jQuery("#tabs-portal-tab-id .tabSelected").removeClass("tabSelected");
	      jQuery(this).addClass("tabSelected");
	      var id = jQuery(this).attr("conul");
	      jQuery(".tab-ul").hide();
	      var thisObj = jQuery("#" + id);
	      thisObj.show();
	      var dateObj = getFormatDate(thisObj.attr("code"));
	      thisObj.find("iframe").attr("src","SY_COMM_INFO.chart.do?_PK_=SY_COMM_INFOS_COUNT&BEGIN_DATE="+dateObj["BEGIN_DATE"]+"&END_DATE="+dateObj["END_DATE"]);
	  });
    },0);
});
</script>
<script type="text/javascript">
</script>