<style type='text/css'>
	.WORK-CENTER-RIGHT-u291_normal {
		background: url('/sy/comm/home/img/u291_normal.png') no-repeat;
	}
    .WORK-CENTER-RIGHT-handle-span {
    	font-family:宋体;
		font-size:14px;
		font-weight:bold;
		font-style:normal;
		text-decoration:none;
		color:#333333;
		line-height:45px;
		margin-left:8%;
    }
</style>
<div id='WORK-CENTER-RIGHT' class='portal-box' style='min-height:50px;'>
	
    <div id='WORK-YEAR-HANDLE' class="WORK-CENTER-RIGHT-u291_normal detectCanvas " style='min-height:49px;width=100%'>
		<span class='WORK-CENTER-RIGHT-handle-span'>本年度系统处理流程总数:<span id='mywork-datas-count' style='color:#FF0000'>111</span></span>
	</div>
	<div id='WORK-YEAR-HANDLING' class="WORK-CENTER-RIGHT-u291_normal detectCanvas " style='min-height:49px;'>
	
		<span class='WORK-CENTER-RIGHT-handle-span'>本年度正在处理中的流程:<span id='mywork-datas-count' style='color:#FF0000'>23</span></span>
	</div>
</div>

<div>
	<iframe src="SY_COMM_INFO.chart.do?_PK_=SY_COMM_WORK_FINISH_TIME_RATE" border='0' frameborder='0' width='100%' height='300px' scrolling=no ></iframe>
</div>

<div>
	<iframe src="SY_COMM_INFO.chart.do?_PK_=SY_COMM_WORK_TIME_RATE_LIST" border='0' frameborder='0' width='100%' height='500px' scrolling=no ></iframe>
</div>

<script type='text/javascript'>
	(function(){
	    $(document).ready(function(){
			var myData = FireFly.getListData("SY_COMM_TODO_HIS",{});
			
		})
	})();

</script>