<style type="text/css">
.friendly_link {color: #000000;margin: 15px auto 0;overflow: hidden;width: 98%;}
.friendly_con1 {overflow: hidden;padding: 1px 0 1px 1px;}
.f_link_tit1 {background: none repeat scroll 0 0 #F6F6F6;float: left;font-weight: bold;height: 20px;padding-top: 9px;text-align: center;width: 80px;padding-bottom: 0;}
.friendly_con1 p {color: #3B3B3B;float: left;line-height: 20px;padding-top: 5px;padding-left: 20px;}
.friendly_con1 p a {color: #3B3B3B;margin: 0 10px;}
</style>

<div class='portal-box ${boxTheme!""}' style='min-height:0px;'>
	<div class='portal-box-title ${titleBar}'>
		<span class="portal-box-title-icon ${icon}"></span>
		<span class="portal-box-title-label">${title}</span>
	</div>
	<div class='portal-box-con' style='height:${height};'>
		<div class="friendly_link">
			<div class="friendly_con1">
		        <div class="f_link_tit1">友情链接：</div>
		        <p>
		        	<#list _DATA_ as linker>
						<a href="javascript:parent.Tab.open({'scrollFlag':true , 'url':'${linker.LINKER_URL}','tTitle':'${linker.LINKER_NAME}','menuFlag':3});">
							${linker.LINKER_NAME!""}
						</a>
					</#list>
				</p>
			</div>
		</div>
	</div>
</div>
