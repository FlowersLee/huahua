<!-- 最新评论  news comment-->
<style>
.comment-li {padding:8px 0px 0px 6px ;font-size:12px;line-height:26px;overflow:auto;border-bottom: 1px dashed #CCC;}
.comment-a {text-decoration: none;color:#024775;}
.comment-a:hover {text-decoration: underline;color:red;}
.inlineBlock {display:inline-block;}
</style>
<script type="text/javascript">
	function commentDoView(id,name){
		var url = "/cms/SY_COMM_NEWS/" + id + ".html";			
		var opts={'scrollFlag':true , 'url':url,'tTitle':name,'menuFlag':3};
		top.Tab.open(opts);
	}
</script>
<div class='portal-box ${boxTheme}' style='min-height:120px;'>
	<div class='portal-box-title'>
		<span class="portal-box-title-icon ${icon}"></span>
		<span class="portal-box-title-label">${title}</span>
	</div>
	<div class='portal-box-con' style='height:${height};'>
		<ul>
			<#list _DATA_ as comment>
				<#if (comment.news??)>
					<li class="comment-li">
						<span style="color:#666">&#8226;&nbsp;${comment.S_USER__NAME}</span>
						<span style="color:black;">对</span>
						<a href="javascript:void(0);" onclick="commentDoView('${comment.news.NEWS_ID}','${comment.news.NEWS_SUBJECT}');" class="comment-a">
						<#if (comment.news.NEWS_SUBJECT!"")?length lte 10>
							${comment.news.NEWS_SUBJECT!""}
						</#if>
						<#if (comment.news.NEWS_SUBJECT!"")?length gt 10>
							${(comment.news.NEWS_SUBJECT)[0..10]}...
						</#if>
						</a>
						<a class="comment-a" href="javascript:void(0);" onclick="commentDoView('${comment.news.NEWS_ID}','${comment.news.NEWS_SUBJECT}');"><font color="red">评论</font><span style="float:right;padding:0px 5px 0px 0px;color:black;">${comment.S_CTIME?string("yyyy-MM-dd HH:mm")}</span></a>
							<p style="padding-left:12px;color:#333;" name="c-content-p">
						<#if (comment.C_CONTENT!"")?length lte 40>
							${comment.C_CONTENT!""}
						</#if>
						<#if (comment.C_CONTENT!"")?length gt 40>
							${(comment.C_CONTENT)[0..40]}...
							<span>[</span><a href="javascript:void(0);" onclick="commentDoView('${comment.news.NEWS_ID}','${comment.news.NEWS_SUBJECT}');"  
							class="comment-a">详情</a><span>]</span>
						</#if>
						</p>
					</li>
				</#if>
			</#list>
		</ul>
  	</div>
</div>