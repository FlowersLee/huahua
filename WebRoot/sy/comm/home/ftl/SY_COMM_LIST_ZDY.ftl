<!--平台通用-列表模板-->
<!-- 参数-开始 -->
<!--使用方法及说明详见DOC目录下自定义列表使用说明-->
<!-- 参数-结束 -->

<#assign titleName = titleT!"测试">
<#assign servId = servId!"">
<#assign fields = fieldCode?split(",")>
<#assign fieldNames = fieldName?split(",")>
<#assign percent = fieldPercent?split(",")>
<#assign emergField = emergField!"false">
<#assign linkField = linkField!"false">
<#assign servType = servType!"false">
<!-- 自定义参数-->
<style type='text/css'>
	.linkfield-a{text-decoration: none;}
</style>
<!-- 自定义参数结束-->
<div class='portal-box padding:0' style='min-height:250px;max-height:250px'>
    <div class='portal-box-title'>
        <span class="portal-box-title-label">${title}(</span><span id='count' style='color:#FF0000'>${_OKCOUNT_}</span><span>)</span>
        <span class="portal-box-more"><a href="#" onclick="openUrlPage('${titleName}','${servId}','list')"></a></span>
    </div>
	<table width="100%">
	<thead style='line-height:30px;border-bottom: 1px #cccccc solid;'>
		<#if _DATA_?size != 0>
		<tr>
			<td align="center" style="width:20px"></td>
			<td align="center" width="3%">#</td>
			<#list fieldNames as field>	
				<td width="${percent[field_index]}%">${field}</td>
			</#list>
		</tr>
		</#if>
	</thead>
	<tbody style='line-height:20px'>
		<#if (_DATA_?size == 0)>
			<tr>
				<td align=center>没有${titleName}处理！</td>
			</tr>
		</#if>
		<#list _DATA_ as content>
			<tr style="line-height:30px;">
				<#if emergField!="false">
					<#assign emerg = content[emergField]>
					<#if emerg lte 10 >
						<td align=center>&nbsp;</td>
					<#elseif emerg lte 20>
						<td align=center><div class="comm_emergency__normal ml5" style="height:16px"></div></td>
					<#else>
						<td align=center ><div class="comm_emergency__very ml5" style="height:16px"></div></td>
					</#if>
				<#else>
					<td>&nbsp;</td>
				</#if>
				<td>${content_index+1}</td>
				<#list fields as fieldCode>
					<#if fieldCode==linkField>
                    <td>
                    	<#if servType=="todo">
	                        <a class = 'linkfield-a' href="javascript:void(0);" 
							onclick="Todo.open('${content.SERV_ID}','${content.TODO_TITLE}','${content.TODO_URL}', '${content.TODO_CONTENT}', '${content.TODO_ID}', '${content.TODO_OBJECT_ID1}')">
								${content[fieldCode]}
							</a>
						<#else>
							<a class = 'linkfield-a' href="javascript:void(0);" 
							onclick="openUrlPage('${titleName}','${servId}','card','${content._PK_}')">
								${content[fieldCode]}
							</a>
						</#if>
                    </td>
					<#else>
						<td>${content[fieldCode]}</td>
					</#if>					
				</#list>
			</tr>
		</#list>
	</tbody>
	</table>
</div>

<script type='text/javascript'>
	function openUrlPage(title,servId,type,pk){
		if(servId==""){
			alert("请配置打开服务的ID");
			return;
		}
		var opts ={};
		if(type=="card"){
			opts["url"]=servId+".card.do?pkCode="+pk;
			opts["tTitle"]=title;

		}else{
			opts["url"]=servId+".list.do";
			opts["tTitle"]=title;
		}

        Tab.open(opts);
    }
</script>