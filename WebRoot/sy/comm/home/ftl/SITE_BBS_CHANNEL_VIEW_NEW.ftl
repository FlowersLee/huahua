<#include "BBS_CONSTANT.ftl"/>
<script type="text/javascript">
	function doChannel(id,name){
		var url = "/cms/CM_CMS_CHNL/" + id + "/index_1.html";	
		var opts={'scrollFlag':true , 'url':url,'tTitle':name,'menuFlag':3};
		top.Tab.open(opts);
	}
	function doView(id,name){
		var url = "/cms/SY_COMM_BBS_TOPIC/" + id + ".html";	
		var opts={'scrollFlag':true , 'url':url,'tTitle':name,'menuFlag':3};
		top.Tab.open(opts);
	}
</script>
<style type="text/css">
	 .con{display:block; *display:inline-block; padding:10px 0 10px 18px; _padding:10px 0 10px 0px;background-color:#fff;width:88%;}
	 .con:after{content:"."; display:block; height:0; clear:both; visibility:hidden;}
	 .bbs_son{float:left; width:100%; height:25px; overflow:hidden;background:#fff;margin-bottom:10px;}
	 .bbs_son:hover a {color: #BC2A4D;}
	 .bbs_son a{text-decoration:none;color:blue;}
	 .bbs_son dt{float:left; width:32px; height:32px; overflow:hidden; margin:0; padding:10px;}
	 .bbs_son dt img{width:32px; height:32px;}
	 .bbs_son dd{float:left; width:150px; overflow:hidden; margin:0; padding:4px 10px 8px 0; color:black; line-height:20px;}
	 .bbs_son dd strong{display:block; font-size:14px;}
	 .portal-box-title {cursor:pointer;margin-top:0px;height:29px;text-align:left;width:96%;overflow:hidden;padding-left:3%;padding-right:1%;border-bottom:1px #3875B8 solid;
                   color:black;font-size:12px;background:#efefef;font-weight:normal;}
     .chnl-box-title {margin-top:0px;height:29px;text-align:left;width:98%;overflow:hidden;padding-left:1%;padding-right:1%;border-bottom:2px #3875B8 solid;
               color:black;font-size:14px;background:#efefef;}
     .con{display:none;}
     .chnl_img{
     	width:20px;
     	height:20px;
     	background:url(/sy/theme/default/images/menu/menu-close.png) no-repeat 0px -17px ;
     	margin-top:5px;
     	float:right;
     }
</style>
	<div class='chnl-box-title'>
		<span class="portal-box-title-label">版块导航</span>
	</div>
	<#list _DATA_ as chnl>
    <div class='portal-box-title'>
		<span class="portal-box-title-label">${chnl.CHNL_NAME}</span>
		<span class="chnl_img"></span>
	</div>
    <div class='con' style='height:${height};'>
		<#list chnl._DATA_ as channel>
        <dl class="bbs_son">
			<dd>
					<a href="javascript:doChannel('${channel.CHNL_ID}','${channel.CHNL_NAME}');">${channel.CHNL_NAME}</a>
			</dd>
        </dl>
		</#list>
     </div>
 	</#list>
