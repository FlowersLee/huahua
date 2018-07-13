<#-- tab标签切换-->
<style type="text/css">
.tabs-portal .portal-box-title {}
.tabs-portal .portal-box-title ul{padding-left:5px;}
.tabs-portal .portal-box-title li {
	line-height:29px;padding:0px 10px;text-align: left;float: left; 
}
.tabs-portal .tab-ul {padding:8px;}
.tabs-portal .tab-ul li {
    color:black;
    line-height:29px;
}
.tabs-portal .tab-ul li a {color:black;}
.tabs-portal .tab-ul-none {display:none;}
.tabs-portal .tab-portal-box-a {text-decoration: none;font-size:8px;}
.tabs-portal .tab-portal-box-a:hover {text-decoration: underline;color:red;}
</style>
<div id='CM_INFOS_REPORT' class='portal-box tabs-portal ${boxTheme}' style='height:${height};min-height:200px'>
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
<ul id="con_ul1" class="tab-ul">
<iframe  src="SY_COMM_INFO.chart.do?_PK_=CM_INFOS_COUNT" border='solid red ' frameborder='0' width='100%' height='600px' scrolling="auto" ></iframe>
</ul>
<ul id="con_ul2" class="tab-ul tab-ul-none">
<iframe  src='#' border='solid red ' frameborder='0' width='100%' height='600px' scrolling="auto" ></iframe>
</ul>
<ul id="con_ul3" class="tab-ul tab-ul-none">
测试2
</ul>
<ul id="con_ul4" class="tab-ul tab-ul-none">
测试3
</ul>
<ul id="con_ul5" class="tab-ul tab-ul-none">
测试5
</ul>
</div>
</div>
<script type="text/javascript">
       var myDate= new Date();
       var month = myDate.getMonth(); 
       var year  = rhDate.getCurentTime().substring(0,4);
	   var str=(month/3).toString().substr(0,1); 
	   var curent=rhDate.getCurentTime().substring(0,11);
	   var first=year+'-01-01';
	   var second=year+'-03-01';
	   var three=year+'-06-01';
	   var four=year+'-09-01';
	   var extwhere="between '"+first+"' and '"+curent+"'";
	  function quarter(str){ 
	    var src="SY_COMM_INFO.chart.do?_PK_=CM_INFOS_COUNT";
	    switch (str/3){
	    case 0:
	    {
	     alert(extwhere); 
	     jQuery('#con_ul2 iframe').attr("src",src);
	     break;
	     }
	    case 1:
	    {
	     alert("第二季度");
	     break;
	     }
	    case 2:
	    {
	    alert("第三季度");
	    break;
	    }
	    case 3:
	    { 
	    alert("第四季度");
	    break;
	    } 
	    }  
	   }
(function() {
    jQuery(document).ready(function(){
	    setTimeout(function() {
	      jQuery(".new_tab").bind("mouseover",function() {
	          if (jQuery(this).hasClass("tabSelected")) {
	              return;
	          }
	          jQuery("#tabs-portal-tab-id .tabSelected").removeClass("tabSelected");
	          jQuery(this).addClass("tabSelected");
	          var id = jQuery(this).attr("conul");
	          jQuery(".tab-ul").hide();
	          jQuery("#" + id).show();
	            if(id=='con_ul2'){    
	              quarter(str);
	          }
	      });
	    },0);
 
    });
})();
</script>
<script type="text/javascript">
</script>