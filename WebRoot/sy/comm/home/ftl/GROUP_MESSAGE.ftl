<style type="text/css">
	.portal-box-con .group_widget{width:250px; border-bottom: 1px solid #E0E0E0;color: #4D4D4D;line-height: 160%;padding-left:20px;margin:20px 0;font-family: "Microsoft Yahei",Tahoma;padding-bottom:20px;}
	.group_widget .group_widget_title{color: #4D4D4D;font-size: 12px;line-height: 120%;font-weight:bolder;}
</style>
<div class='portal-box ${boxTheme!""}' style='min-height:200px;'>
	<div class='portal-box-title group-title'>
		<span class="portal-box-title-icon ${icon}"></span>
		<span class="portal-box-title-label">群组信息</span>
	</div>
	<div class='portal-box-con' style='height:${height};'>
	    <div id="group_notice_container" class="group_widget group_widget_notice">
	        <h3 class="group_widget_title">群公告</h3>
	        <div class="notice_content">
	            <div>
	                ${notice.NOTICE_CONTENT!""}	
	            </div>
	        </div>
	    </div>
	    <div class="group_widget group_widget_id">
	        <h3 class="group_widget_title">群信息</h3>
	        <div class="id_content">
	            <p>
	               	 群成员：${users._DATA_?size}
	            </p>
	            <p>
	              	  创建于：
					  <#if group.S_MTIME?length gt 19>
					  	${group.S_MTIME[0..18]}
						<#else>${group.S_MTIME!""}
					  </#if>
	            </p>
	            <p>
	                                                         群描述：${group.GROUP_MEMO!""}
	            </p>
	        </div>
	    </div>
		<#macro setPic img size>
			<#if img?contains("?")>
				${img?substring(0,img?index_of("?"))}?size=${size}
				<#else>${img}?size=${size}
			</#if>
		</#macro>
	    <div class="group_widget group_widget_members ">
	        <h3 class="group_widget_title">群成员</h3>
            <div class="member_content">
            	<#list users._DATA_ as user>
                <a title="${user.USER_CODE__NAME}">
                	<#if user.USER_IMG?length gt 0>
                	<img id="group-message-img-${user_index}" src="<@setPic user.USER_IMG '30x30'/>" width="30" height="30">
					<#else><img id="group-message-img-${user_index}" src="/sy/theme/default/images/common/male-icon-32px.png" width="30" height="30">
					</#if>
					<#if user.GU_ADMIN?string="1">
					<i class="i_group i_builder"></i>
					</#if>
				</a>
				</#list>
            </div>
	    </div>
	</div>
</div>
<!-- 群组人员，悬浮信息提示 -->
<script type="text/javascript">
	jQuery(document).ready(function(){
		<#list users._DATA_ as user>
		jQuery("#group-message-img-${user_index}").unbind("mouseover")
			.bind("mouseover",function(event){
				new rh.vi.userInfo(event,"${user.USER_CODE}")
			}).addClass("rh-user-info-circular-bead");
		</#list>
	});
</script>
