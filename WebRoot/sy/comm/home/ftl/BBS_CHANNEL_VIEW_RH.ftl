<#include "BBS_CONSTANT.ftl"/>
<style type="text/css">
.bbs_view_rh .portal-box-con tr td{border-bottom:1px #e4e4e4 solid;padding:8px 0px;}
.bbs_view_rh .portal-box-con tr:last-child td {border-bottom:0px #e4e4e4 solid;}
</style>
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

	jQuery.each(jQuery("td[name='newtoptic']"),function(){
		var topicID = jQuery(this).attr("id");
		var datas = {};
		datas["CHNL_ID"] = topicID;
		datas["_ORDER_"] = "S_MTIME DESC";
		datas["_NOPAGE_"] = "S_MTIME";
		datas["_ROWNUM_"] = "1";
		var time = FireFly.doAct("SY_COMM_BBS_TOPIC","finds",datas)._DATA_;
		if(!time.length){
			jQuery("#"+topicID).find(".a1").text("暂时没有任何帖子");
		}else{
			var dateDiff = rhDate.doDateDiff("H",time[0].S_UNAME,rhDate.getCurentTime());
			
			jQuery("#"+topicID).find(".a1").text(time[0].TOPIC_TITLE);
			jQuery("#"+topicID).find(".span1").text(time[0].S_UNAME);

			jQuery("#"+topicID).find(".span2").text(jQuery.timeago((time[0].S_MTIME).substring(0,19)));
		}

	});	

</script>
<div class="bbs_view_rh portal-box ${boxTheme!''}" style='min-height:140px;overflow-y:hidden;'>
    <div class='portal-box-title'>
    	<span class="portal-box-title-icon ${icon}"></span>
		<span class="portal-box-title-label">${title}</span>
	</div>
    <div class='con portal-box-con' style='height:${height};overflow-:hidden ;'>
        <table style='width:96%;margin:0px 2%;'>
		<#list _DATA_ as channel>
		<tr>
			<td style='text-align:center;'><!-- 图片 -->
			    <img width="36" height="36" alt="${channel.CHNL_NAME}" src="<@setPic channel '/sy/comm/bbs/img/bbs_ico_default.png'/>" />
			</td>
			<td style='text-align:left;'><!-- 标题 -->
				<a style='color:#3767af;font-weight:bold;' href="javascript:doChannel('${channel.CHNL_ID}','${channel.CHNL_NAME}');">${channel.CHNL_NAME}</a>
				<#--<p style='color:gray;'>茶，上茶，上好茶！</p>-->
			</td>
			<td style='text-align:center;'><!-- 发帖数 -->
			    <span class="amount">${channel.topicTotal!0}主题 / ${channel.commentTotal!0}回帖</span>
			</td>
			<td style='text-align:center;' id='${channel.CHNL_ID}' name='newtoptic'><!-- 最新贴 -->
			     <a class='a1'><a>
			     <p><span class='span1' style='font-weight:bold;'></span><span class='span2' style='color:gray;margin-left: 8px;'></span></p>
			</td>
        </tr>
		</#list>
		</table>
     </div>
  </div>
