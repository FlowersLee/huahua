<#include "BBS_CONSTANT.ftl"/>
<script type="text/javascript">
	function doChannel(id,name){
		var url = "/cms/CM_CMS_CHNL/" + id + "/index_1.html";	
		var opts={'scrollFlag':true , 'url':url,'tTitle':name,'menuFlag':4};
		top.Tab.open(opts);
	}
	function doView(id,name){
		var url = "/cms/SY_COMM_BBS_TOPIC/" + id + ".html";	
		var opts={'scrollFlag':true , 'url':url,'tTitle':name,'menuFlag':4};
		top.Tab.open(opts);
	}
</script>
<div class="portal-box ${boxTheme!''}" style='min-height:140px;'>
    <div class='portal-box-title'>
    	<span class="portal-box-title-icon ${icon}"></span>
		<span class="portal-box-title-label">${title}</span>
		<span class="amount" style="font-size:12px; font-weight:normal;float:right;">
		${topicTotal}主题，${commentTotal}回帖</span>
	</div>
	</h2>
    <div class='con portal-box-con' style='height:${height};'>
		<#list _DATA_ as channel>
        <dl class="bbs_son">
            <dt>
                <img alt="${channel.CHNL_NAME}" src="<@setPic channel '/sy/comm/bbs/img/bbs_ico_default.png'/>" />
            </dt>
			<dd>
				<strong>
					<a href="javascript:doChannel('${channel.CHNL_ID}','${channel.CHNL_NAME}');">${channel.CHNL_NAME}</a>
				</strong>
				<span class="amount">${channel.topicTotal!0}主题 / ${channel.commentTotal!0}回帖</span>
			</dd>
        </dl>
		</#list>
     </div>
  </div>
