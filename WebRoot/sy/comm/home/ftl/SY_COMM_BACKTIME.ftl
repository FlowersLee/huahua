<style type="text/css">
.time {
	MARGIN: 1px auto; WIDTH: 100%; HEIGHT: 234px; COLOR: #fff
}
.time .tit {
	PADDING-BOTTOM: 0px; LINE-HEIGHT: 38px; PADDING-LEFT: 10px; PADDING-RIGHT: 10px; ZOOM: 1; HEIGHT: 38px; OVERFLOW: hidden; PADDING-TOP: 0px
}
.time .tit SPAN.j B {
	TEXT-ALIGN: right; WIDTH: 40px; FLOAT: left; COLOR: #d8d8d8
}
.time .tit SPAN.c B {
	TEXT-ALIGN: center; WIDTH: 180px; FLOAT: left
}
.time .tit SPAN.h B {
	TEXT-ALIGN: left; WIDTH: 40px; FLOAT: right; COLOR: #d8d8d8
}
.time .tit SPAN B {
	FONT-FAMILY: 微软雅黑; FONT-SIZE: 17px
}
.time .tit SPAN.b {
	WIDTH: 246px
}
.time .con {
	TEXT-ALIGN: center; HEIGHT: 173px; OVERFLOW: hidden
}
.time .con .backTime_day {
	LINE-HEIGHT: 113px; FONT-FAMILY: Arial; HEIGHT: 113px; FONT-SIZE: 115px; OVERFLOW: hidden; FONT-WEIGHT: 500
}
.time .con H3 SPAN {
	FONT-SIZE: 44px; FONT-WEIGHT: 400
}

.time .con SPAN.hanzi {
	POSITION: relative; LINE-HEIGHT: 113px; PADDING-LEFT: 0px; FONT-FAMILY: 微软雅黑; HEIGHT: 113px; FONT-SIZE: 44px; FONT-WEIGHT: 100; TOP: -6px
}
.time .con .tit {
	MARGIN: 8px auto; WIDTH: 269px; FONT-SIZE: 20px
}
.time .con .tit {
	MARGIN: 8px auto; WIDTH: 269px; FONT-SIZE: 20px
}
.time .bott {
	LINE-HEIGHT: 27px; HEIGHT: 27px
}
.time .bott SPAN.b {
	WIDTH: 100%;
	text-align:center;
}
.time .bott SPAN.end_time {
	WIDTH: 100% FONT-SIZE: 13px; text_align: right
}


.han {
	FONT-FAMILY: 微软雅黑; FONT-SIZE: 20px
}
.num {
	FONT-FAMILY: Arial; FONT-SIZE: 20px
}
.han2 {
	FONT-FAMILY: 微软雅黑; FONT-SIZE: 13px
}
.num2 {
	FONT-FAMILY: Arial; FONT-SIZE: 13px
}

.time .tit {
	BACKGROUND: url(/sy/comm/home/img/5.png) left 50%
}
.time .tit1 {
	BACKGROUND: url(/sy/comm/home/img/5.png) left 50%
}
.time .bott {
	BACKGROUND: url(/sy/comm/home/img/5.png) left 50%
}


.time2 {
	BACKGROUND: #008ae7
}
</style>
<div id='WEATHER' class='portal-box'  style='min-height:170px'>
<div class='portal-box-title ${titleBar}'><span class='portal-box-title-icon icon_portal_links'></span><span class="portal-box-title-label">倒计时开始</span><span class="portal-box-hideBtn conHeanderTitle-expand"></span></div>
<div class='portal-box-con'>
<DIV class="item itemred_2">
<DIV class=subject1>
<DIV class=text>
<DIV class="time time2">
<DIV class=tit><SPAN class=j><B>距离</B></SPAN> <SPAN class=c title=${endTitle}><B>${endTitle}</B></SPAN> <SPAN class=h><B>还有</B></SPAN> </DIV>
<DIV class='con '>
<H3><SPAN class=backTime_day>0</SPAN><SPAN class=hanzi>天</SPAN></H3>
<DIV class=tit1><SPAN class=hour><SPAN class=num>0</SPAN><SPAN class=han>小时</SPAN></SPAN> </DIV></DIV>
<DIV class="tit bott"><SPAN class=end_time><SPAN class=han2>结束日：</SPAN><span class='end_time_orig'>${endTime}</span>&nbsp;<SPAN class=han2></SPAN></SPAN></SPAN> </DIV></DIV></DIV></DIV></DIV>

</div>
</div>
<script type=text/javascript>
jQuery(document).ready(function(){ 
   var curTime = rhDate.getCurentTime();
   var timeOrig = jQuery(".end_time_orig").text();
   var difDay = rhDate.doDateDiff("D",curTime,timeOrig);
   var difDayTime = rhDate.doDateDiff("H",curTime,timeOrig);
   jQuery(".backTime_day").text(difDay);
   jQuery(".hour .num").text(difDayTime);
});
</script>