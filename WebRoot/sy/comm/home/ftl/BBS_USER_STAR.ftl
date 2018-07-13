<#include "BBS_CONSTANT.ftl"/>
<script type="text/javascript">
	var datas = {};
	var result = FireFly.doAct("SY_COMM_BBS_TOPIC","getTopicNumByUser",datas)._DATA_;
	for(var i=0;i<result.length;i++){
		var DIV = jQuery("<div style='width:75px;float:left;text-align:center;'></div>").appendTo(jQuery("#tdstar"));
		if (result[i].USER.USER_IMG) {
			jQuery("<img width='60px' height='60px' style='border:1px #dddddd solid;' src='" + result[i].USER.USER_IMG + "?size=62x62'></img>").appendTo(DIV);
		}else {
			if(result[i].USER.USER_SEX == 1){
				jQuery("<img width='60px' height='60px' style='border:1px #dddddd solid;' src='/sy/theme/default/images/common/rh-lady-icon.png'></img>").appendTo(DIV);
			}else{
				jQuery("<img width='60px' height='60px' style='border:1px #dddddd solid;' src='/sy/theme/default/images/common/rh-male-icon.png'></img>").appendTo(DIV);
			}
		}
		var A = jQuery("<a title='"+result[i].TOPIC.TOPIC_TITLE+"' style='color:black;width:100%;text-align:center;display:block;'>"+result[i].USER.USER_NAME+"</a>").appendTo(DIV);
		var TOPIC_ID = result[i].TOPIC.TOPIC_ID;
		var TOPIC_TITLE = result[i].TOPIC.TOPIC_TITLE;
		A.unbind("click").bind("click",function(){
			var url = "/cms/SY_COMM_BBS_TOPIC/" + TOPIC_ID + ".html";
			var opts={'scrollFlag':true , 'url':url,'tTitle':TOPIC_TITLE,'menuFlag':3};
			Tab.open(opts);
		});
	}
</script>
<div class='portal-box ${boxTheme!""}' style='min-height:200px;background:white;'>
	<div class='portal-box-title' style='border-bottom:0px gray solid;padding-left:8px;'>
		<span class="portal-box-title-icon ${icon}"></span>
		<span class="portal-box-title-label">${title}</span>
	</div>
	<div class='portal-box-con' style='height:${height};padding-bottom:15px;'>
	<table width="100%" cellspacing="0" cellpadding="0" class="noline">
    <tr class="tr3">
        <td style="line-height:24px;text-align:left;" id='tdstar'>	
			
        </td>
    </tr>
</table>
</div>
</div>