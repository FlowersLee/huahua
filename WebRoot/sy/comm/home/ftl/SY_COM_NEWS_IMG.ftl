<style type="text/css">
.ct_pt_02 {
	overflow: hidden; zoom: 1; background-color: rgb(242, 242, 242);
}
.ct_pt_02 h4 {
	font: bold 14px/38px "微软雅黑"; font-size-adjust: none; font-stretch: normal; background-color: rgb(255, 255, 255);
}
.ct_pt_02 .ct_pic {
	width: 156px; float: left;
}
.ct_pt_02 .ct_txt {
	color: rgb(102, 102, 102); padding-top: 5px; padding-left: 3px; margin-left: 156px; _padding-left: 0;
}
.blk_08 .b_cons {
	padding: 9px 0px 0px; text-align: center; clear: both;
}
a.scrArrLeft {
	background: url("http://i2.sinaimg.cn/dy/deco/2012/0724/news_m_04.png") no-repeat -50px -100px; width: 22px; height: 22px; vertical-align: top; display: inline-block;
}
a.scrArrLeft:hover {
	background-position: -150px -100px;
}
a.scrArrRight {
	background: url("http://i2.sinaimg.cn/dy/deco/2012/0724/news_m_04.png") no-repeat -100px -100px; width: 22px; height: 22px; vertical-align: top; display: inline-block;
}
a.scrArrRight:hover {
	background-position: -200px -100px;
}
.scrDotList {
	padding: 0px 10px; zoom: 1;
}
.scrDotList span {
	background: url("http://i2.sinaimg.cn/dy/deco/2012/0724/news_m_04.png") no-repeat -296px 8px; width: 15px; height: 22px; line-height: 0; font-size: 0px; vertical-align: top; display: inline-block; cursor: pointer;
}
.scrDotList span.on {
	background: url("http://i2.sinaimg.cn/dy/deco/2012/0724/news_m_04.png") no-repeat -246px 8px;
}
a.scrArrAbsLeft {
	background: url("http://i1.sinaimg.cn/dy/deco/2012/0613/yocc20120613img01/news_arr_l.png") no-repeat 0px 0px; left: 0px; top: 50%; width: 31px; height: 41px; position: absolute; cursor: pointer; _background: none;
}
a.scrArrAbsLeft:hover {
	background: url("http://i0.sinaimg.cn/dy/deco/2012/0613/yocc20120613img01/news_arr_l_h.png") no-repeat 0px 0px; _background: none;
}
a.scrArrAbsRight {
	background: url("http://i3.sinaimg.cn/dy/deco/2012/0613/yocc20120613img01/news_arr_r.png") no-repeat 0px 0px; top: 50%; width: 31px; height: 41px; right: 0px; position: absolute; cursor: pointer; _background: none;
}
a.scrArrAbsRight:hover {
	background: url("http://i2.sinaimg.cn/dy/deco/2012/0613/yocc20120613img01/news_arr_r_h.png") no-repeat 0px 0px; _background: none;
}
</style>
<div id='SY_COMM_NEWS' class='portal-box' style='min-height:200px'>
<div class=''></div>
<div class='portal-box-con'>
<!--构造区块：标题+图片+二级标题-开始-->
<div style="overflow: hidden; float: left; zoom: 1;height:150px;width:100%">
<#list _DATA_ as content>
  <div class="ct_pt_02 num${content_index}">
    <h4 class="link_c000"><a href="http://slide.mil.news.sina.com.cn/slide_8_199_20193.html" target="_blank">${content.NEWS_SUBJECT}</a></h4>
    <div class="ct_pic"><a href="http://slide.mil.news.sina.com.cn/slide_8_199_20193.html" target="_blank"><img alt="中缅边境惊现解放军“猎人”战斗部队" src="http://i0.sinaimg.cn/dy/2013/0115/U6917P1DT20130115110500.jpg" width="150" height="100"></a></div>
    <div class="ct_txt">
      ${content.NEWS_SUBJECT}
    </div>
  </div>
</#list>
</div>
<!--构造区块：标题+图片+二级标题-结束-->
<!--翻页按钮-开始-->
<div class="b_cons">
  <a id="scrArrLeft_01" class="scrArrLeft" href="javascript:void(0)"></a>
  <span id="scrDotList_01" class="scrDotList">
  <#list _DATA_ as content>
   <span class="<#if (content_index == 0)>on<#else></#if>" title="第${content_index}页" num="${content_index}"></span>
  </#list>
  </span>
  <a id="scrArrRight_01" class="scrArrRight" href="javascript:void(0)"></a>
</div>
<!--翻页按钮-结束-->

</div>
</div>
<script type="text/javascript">
(function() {
    jQuery(document).ready(function(){
	    setTimeout(function() {
	      jQuery(".scrDotList span").bind("click",function() {
	          jQuery(".scrDotList .on").removeClass("on");
	          var num = jQuery(this).addClass("on").attr("num");
	          jQuery(".ct_pt_02").hide();
	          jQuery(".num" + num).show();
	      });
	    },0);
    });
})();
</script>