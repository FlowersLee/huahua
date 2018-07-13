<#include "WENKU_CONSTANT.ftl">
<style type="text/css">
.doc-upload{width:100%;}.doc-upload p{color:#818181;margin-top:6px;}
.doc-upload .btn-upload{background-position: 0 -40px; height: 40px; vertical-align: top; width: 223px;margin-top:20px;}
.doc-upload .btn-upload a{text-align:center;margin:0 auto;}
.doc-upload .btn-upload:hover{background-position:0 0 ;}
.view-sps{background: url("/sy/comm/wenku/img/upload/up_load.png") no-repeat scroll 0 0 transparent;}
.ic{display: inline-block; font-size: 0; height: 16px; line-height: 9999em; overflow: hidden; padding: 0; position: relative; vertical-align: -2px; width: 16px;}
a{color: #2D64B3; text-decoration: none;}
#number{color: #E87301; font-family: verdana,arial,sans-serif; font-size: 16px; font-weight: bold; margin: 0 5px; word-spacing: 15px;}
</style>
<script type="text/javascript">
	function upload(){
		var url = "/wenku/tmpl/${upload_tmpl_id}.html?SITE_ID=${SITE_ID}";			
		var opts={'scrollFlag':true , 'url':url,'tTitle':"上传文档",'menuFlag':3};
		Tab.open(opts);
	}
</script>
<div class="doc-upload">
    <a class="ic view-sps btn-upload logSend" href="javascript:upload();" id="uploadDoc-0">上传文档</a>
	<p>当前已有<b id="number">${_DATA_!0}</b>份文档</p>
</div>
