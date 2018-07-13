<style type="text/css" >
    .WORK-CENTER-TODO-title-li {
        border-bottom: 1px #cccccc solid;
        float: left;
    } 
	.WORK-CENTER-TODO-title-span {
        font-family: 微软雅黑;
        font-size: 13px;
        font-weight: normal;
        font-style: normal;
        text-decoration: none;
        color: #990000;
    }
	.WORK-CENTER-TODO-CONTENT-li{
		float: left;
		margin-top:5px;
	}
    .WORK-CENTER-TODO-CONTENT-span {
        font-family: 宋体;
        font-size: 13px;
        font-weight: normal;
        font-style: normal;
        text-decoration: none;
        color: #333333;
    }
</style>
<div style='margin-left:5px'>
	<div id='WORK-CENTER-TODO' class='portal-box padding:0' style='min-height:250px;max-height:250px'>
	    <div class='portal-box-title'>
	        <span class="portal-box-title-label">待处理流程(</span><span id='todo-count' style='color:#FF0000'>1</span><span>)</span>
	        <span class="portal-box-more"><a href="#" onclick="openUrlPage()"></a></span>
	    </div>
	    <div id='TODO-CONTENER'>
	        <div style="width:100%">
	        	
	            <ul style='margin-top:15px'>
	                <li style='width:5%' class="WORK-CENTER-TODO-title-li"><span class="WORK-CENTER-TODO-title-span" style='margin-left:15%;'>#</span></li>
	                <li style='width:30%' class="WORK-CENTER-TODO-title-li"><span class="WORK-CENTER-TODO-title-span">流程名称<span></li>
	                <li style='width:13%' class="WORK-CENTER-TODO-title-li"><span class="WORK-CENTER-TODO-title-span">流程类型<span></li>
	                <li style='width:10%' class="WORK-CENTER-TODO-title-li"><span class="WORK-CENTER-TODO-title-span">处理环节<span></li>
	                <li style='width:20%' class="WORK-CENTER-TODO-title-li"><span class="WORK-CENTER-TODO-title-span">发送人<span></li>
	                <li style='width:22%' class="WORK-CENTER-TODO-title-li"><span class="WORK-CENTER-TODO-title-span">发送时间<span></li>
	            </ul>
				<div id = 'todo-content-datas'></div>
	        </div>
	    </div>
	</div>
	<div id='WORK-CENTER-MY_RELEVANT' class='portal-box padding:0' style='min-height:250px;max-height:250px'>
	    <div class='portal-box-title'>
	        <span class="portal-box-title-label">被提醒的流程(</span><span id='my-reminded-count' style='color:#FF0000'>1</span><span>)</span>
	        <span class="portal-box-more"><a href="#" onclick="openUrlPage()"></a></span>
	    </div>
	    <div id='MY_REMINDED-CONTENER'>
	        <div style="width:100%">
	            <ul style='margin-top:15px'>
	                <li style='width:5%' class="WORK-CENTER-TODO-title-li"><span class="WORK-CENTER-TODO-title-span" style='margin-left:15%;'>#</span></li>
	                <li style='width:30%' class="WORK-CENTER-TODO-title-li"><span class="WORK-CENTER-TODO-title-span">流程名称<span></li>
	                <li style='width:15%' class="WORK-CENTER-TODO-title-li"><span class="WORK-CENTER-TODO-title-span">处理环节<span></li>
	                <li style='width:15%' class="WORK-CENTER-TODO-title-li"><span class="WORK-CENTER-TODO-title-span">节点状态<span></li>
	                <li style='width:20%' class="WORK-CENTER-TODO-title-li"><span class="WORK-CENTER-TODO-title-span">办理时限<span></li>
	                <li style='width:15%' class="WORK-CENTER-TODO-title-li"><span class="WORK-CENTER-TODO-title-span">超时时间<span></li>
	            </ul>
				<div id = 'my-reminded-datas'></div>
	        </div>
	    </div>
	</div>
	<div id='WORK-CENTER-TODO-MINE' class='portal-box padding:0' style='min-height:280px;max-height:280px'>
	    <div class='portal-box-title'>
	        <span class="portal-box-title-label">我的流程(</span><span id='mywork-datas-count' style='color:#FF0000'>6</span><span>)</span>
	        <span class="portal-box-more"><a href="#" onclick="alert(1)"></a></span>
	    </div>
	    <div id='TODO-CONTENER-MY-REMINED' style="width:100%">
	    	<div style='margin-top:15px;margin-left:15px'>
			    <ul style='float:left;width:20%'>
	    			<li><input type='radio' id='my-create-work'  name='my_work_radio' style='float:left' checked></input></li>
					<li><span class='WORK-CENTER-TODO-CONTENT-span' style='padding:5px'>我发起的流程</span></li>
	    		</ul>
				<ul style='float:left;width:20%'>
	    			<li><input type='radio' id='my-handle-work'  name='my_work_radio' style='float:left'></input></li>
					<li><span class='WORK-CENTER-TODO-CONTENT-span' style='padding:5px'>我经办的流程</span></li>
	    		</ul>
				<ul>
	    			<li><input type='radio' id='my-track-work'  name='my_work_radio' style='float:left'></input></li>
					<li><span class='WORK-CENTER-TODO-CONTENT-span' style='padding:5px'>我关注的流程</span></li>
	    		</ul>
	    	</div>
	        <div >
	            <ul style='margin-top:15px'>
	                <li style='width:5%' class="WORK-CENTER-TODO-title-li"><span class="WORK-CENTER-TODO-title-span" style='margin-left:15%;'>#</span></li>
	                <li style='width:30%' class="WORK-CENTER-TODO-title-li"><span class="WORK-CENTER-TODO-title-span">流程名称<span></li>
	                <li style='width:15%' class="WORK-CENTER-TODO-title-li"><span class="WORK-CENTER-TODO-title-span">流程类型<span></li>
	                <li style='width:15%' class="WORK-CENTER-TODO-title-li"><span class="WORK-CENTER-TODO-title-span">流程状态<span></li>
	                <li style='width:15%' class="WORK-CENTER-TODO-title-li"><span class="WORK-CENTER-TODO-title-span">处理环节<span></li>
	                <li style='width:20%' class="WORK-CENTER-TODO-title-li"><span class="WORK-CENTER-TODO-title-span">节点状态<span></li>
	            </ul>
				<div id = 'my-create-work-datas'></div>
				<div id = 'my-handle-work-datas'>我经办的流程</div>
				<div id = 'my-track-work-datas'>我关注的流程</div>
	        </div>
	    </div>
	</div>
</div>

<script type="text/javascript">
    (function(){
        $(document).ready(function(){
			
			readMyTodoDatas("SY_COMM_TODO","todo-content-datas");
			$("#my-track-work-datas").hide();
			$("#my-handle-work-datas").hide();
			readyMyRemindedWF("SY_COMM_TODO","my-reminded-datas");	
			var myData = readyMyWorkDatas("SY_COMM_ENTITY","my-create-work-datas");
			$("#mywork-datas-count").empty();
			$("#mywork-datas-count").text(myData._OKCOUNT_);
			readyMyWorkDatas("SY_COMM_TODO_HIS","my-handle-work-datas");
			readyMyWorkDatas("SY_COMM_ENTITY_TAG","my-track-work-datas");
    	})
	})();
	
	function radioOnClick(id,count){
		$("#mywork-datas-count").empty();
		$("#mywork-datas-count").text(count);
		if("my-create-work"==id){
			$("#my-handle-work-datas").hide();
			$("#my-track-work-datas").hide();
			$("#my-create-work-datas").show();
		}else if("my-handle-work"==id){
			$("#my-handle-work-datas").show();
			$("#my-track-work-datas").hide();
			$("#my-create-work-datas").hide();
		}else if("my-track-work"==id){
			$("#my-handle-work-datas").hide();
			$("#my-track-work-datas").show();
			$("#my-create-work-datas").hide();
		}
		
	};
	
    function openUrlPage(){
        var tTitle = "待处理流程";
        var opts = {
            "url": "SY_COMM_TODO.list.do", "tTitle":tTitle
        };
        Tab.open(opts);
    }
</script>
<script type='text/javascript'>
	function readMyTodoDatas(servId,divId){
		var datas = {};
		datas["_PAGE_"]={"SHOWNUM":8};
		datas["_searchWhere"]=" and TODO_FROM='wf'";
        var myDataList = FireFly.getListData(servId, datas);
        var myData = myDataList._DATA_;
		var divObj = $("#"+divId);
		divObj.empty();
		$("#todo-count").empty();
		$("#todo-count").text(myDataList._OKCOUNT_);
		
		for(var i = 0 ; i < myData.length; i++){
			var dataId = myData[i].DATA_ID;
			var toDoData = getLimitedTime(dataId);
			var ulId = divId+"-"+i;
			var user=FireFly.byId("SY_ORG_USER",myData[i].SEND_USER_CODE);
			$("<ul></ul>").attr("id",ulId).appendTo(divObj);
			var s_emergency = myData[i].S_EMERGENCY;
			if("20"==s_emergency){
				$("<li style='width:5%' class='WORK-CENTER-TODO-CONTENT-li'></li>").attr("id",divId+"-num-"+i).appendTo($("#"+ulId));
				$("<span class='WORK-CENTER-TODO-CONTENT-span' style='margin-left:9%;'>"+"<a style='color:#faa105'>"+"!"+"</a>"+(i+1)+"</span>").appendTo($("#"+divId+"-num-"+i));
			}else if("30"==s_emergency){
				$("<li style='width:5%' class='WORK-CENTER-TODO-CONTENT-li'></li>").attr("id","mystar-data-num-"+i).appendTo($("#" + ulId));
				$("<span class='WORK-CENTER-TODO-CONTENT-span' style='margin-left:9%;'>"+"<a style='color:#FF0000'>"+"!"+"</a>"+(i+1)+"</span>").appendTo($("#"+divId+"-num-"+i));
			}else{
				$("<li style='width:5%' class='WORK-CENTER-TODO-CONTENT-li'><span class='WORK-CENTER-TODO-CONTENT-span' style='margin-left:15%;'>"+(i+1)+"</span></li>").appendTo($("#" + ulId));
			}
			$("<li style='width:30%' class='WORK-CENTER-TODO-CONTENT-li'><span class='WORK-CENTER-TODO-CONTENT-span'>"+myData[i].TODO_TITLE+"<span></li>").appendTo($("#" + ulId));
			$("<li style='width:13%' class='WORK-CENTER-TODO-CONTENT-li'><span class='WORK-CENTER-TODO-CONTENT-span'>"+myData[i].TODO_CODE_NAME+"<span></li>").appendTo($("#" + ulId));
			$("<li style='width:10%' class='WORK-CENTER-TODO-CONTENT-li'><span class='WORK-CENTER-TODO-CONTENT-span'>"+myData[i].TODO_OPERATION+"<span></li>").appendTo($("#" + ulId));
			$("<li style='width:20%' class='WORK-CENTER-TODO-CONTENT-li'><span class='WORK-CENTER-TODO-CONTENT-span'>[<a style='color:#0000ff'>"+user.DEPT_NAME+"</a>]"+user.USER_NAME+"<span></li>").appendTo($("#" + ulId));
			$("<li style='width:22%' class='WORK-CENTER-TODO-CONTENT-li'><span class='WORK-CENTER-TODO-CONTENT-span'>"+myData[i].TODO_SEND_TIME+"<span></li>").appendTo($("#" + ulId));
		}
	};
	
	function readyMyRemindedWF(servId,divId){
		var datas = {};
		datas["_PAGE_"]={"SHOWNUM":4};
		datas["_searchWhere"]=" and TODO_FROM='wf'";
        var myRemindedDataList = FireFly.getListData(servId, datas);
        var myRemindedData = myRemindedDataList._DATA_;
		var divObj = $("#"+divId);
		var countId = divId.substr(0,divId.indexOf("-datas"))+"-count";
		$("#"+countId).empty();
		$("#"+countId).text(myRemindedDataList._OKCOUNT_);
		divObj.empty();		
		var wfState=FireFly.getDict("SY_WFE_STATE");
		
		for(var i = 0 ; i < myRemindedData.length; i++){
			var dataId = myRemindedData[i].DATA_ID;
			var toDoData = getLimitedTime(dataId);
			var ulId = divId+"-"+i;
			$("<ul></ul>").attr("id",ulId).appendTo(divObj);
			var s_emergency = myRemindedData[i].S_EMERGENCY;
			if("20"==s_emergency){
				$("<li style='width:5%' class='WORK-CENTER-TODO-CONTENT-li'></li>").attr("id",divId+"-num-"+i).appendTo($("#"+ulId));
				$("<span class='WORK-CENTER-TODO-CONTENT-span' style='margin-left:9%;'>"+"<a style='color:#faa105'>"+"!"+"</a>"+(i+1)+"</span>").appendTo($("#"+divId+"-num-"+i));
			}else if("30"==s_emergency){
				$("<li style='width:5%' class='WORK-CENTER-TODO-CONTENT-li'></li>").attr("id","mystar-data-num-"+i).appendTo($("#" + ulId));
				$("<span class='WORK-CENTER-TODO-CONTENT-span' style='margin-left:9%;'>"+"<a style='color:#FF0000'>"+"!"+"</a>"+(i+1)+"</span>").appendTo($("#"+divId+"-num-"+i));
			}else{
				$("<li style='width:5%' class='WORK-CENTER-TODO-CONTENT-li'><span class='WORK-CENTER-TODO-CONTENT-span' style='margin-left:15%;'>"+(i+1)+"</span></li>").appendTo($("#" + ulId));
			}
			var dicName = FireFly.getDictNames(wfState, myRemindedData[i].S_WF_STATE);
			$("<li style='width:30%' class='WORK-CENTER-TODO-CONTENT-li'><span class='WORK-CENTER-TODO-CONTENT-span'>"+myRemindedData[i].TODO_TITLE+"<span></li>").appendTo($("#" + ulId));
			$("<li style='width:15%' class='WORK-CENTER-TODO-CONTENT-li'><span class='WORK-CENTER-TODO-CONTENT-span'>"+myRemindedData[i].TODO_OPERATION+"<span></li>").appendTo($("#" + ulId));
			$("<li style='width:15%' class='WORK-CENTER-TODO-CONTENT-li'><span class='WORK-CENTER-TODO-CONTENT-span'>"+dicName+"<span></li>").appendTo($("#" + ulId));
			$("<li style='width:20%' class='WORK-CENTER-TODO-CONTENT-li'><span class='WORK-CENTER-TODO-CONTENT-span'>"+myRemindedData[i].TODO_DEADLINE1+"<span></li>").appendTo($("#" + ulId));
			$("<li style='width:15%' class='WORK-CENTER-TODO-CONTENT-li'><span class='WORK-CENTER-TODO-CONTENT-span'>"+"超时"+"<span></li>").appendTo($("#" + ulId));
		}
	}
		
	function readyMyWorkDatas(servId,divId){
	    var datas = {};
		datas["_PAGE_"]={"SHOWNUM":8};
        var myWorkDataList = FireFly.getListData(servId, datas);
        var myWorkData = myWorkDataList._DATA_;
		var divObj = $("#"+divId);
		divObj.empty();
		var radioId = divId.substr(0,divId.indexOf("-datas"));
		var da={"id":radioId,"count":myWorkDataList._OKCOUNT_};
		$("#"+radioId).unbind("click").bind("click",da,function(event){
			radioOnClick(event.data.id,event.data.count);
		});
		
		var wfState=FireFly.getDict("SY_WFE_STATE");
		
		for(var i = 0 ; i < myWorkData.length; i++){
			var dataId = myWorkData[i].DATA_ID;
			var ulId = divId+"-"+i;
			$("<ul></ul>").attr("id",ulId).appendTo(divObj);
			var s_emergency = myWorkData[i].S_EMERGENCY;
			if("20"==s_emergency){
				$("<li style='width:5%' class='WORK-CENTER-TODO-CONTENT-li'></li>").attr("id",divId+"-num-"+i).appendTo($("#"+ulId));
				$("<span class='WORK-CENTER-TODO-CONTENT-span' style='margin-left:9%;'>"+"<a style='color:#faa105'>"+"!"+"</a>"+(i+1)+"</span>").appendTo($("#"+divId+"-num-"+i));
			}else if("30"==s_emergency){
				$("<li style='width:5%' class='WORK-CENTER-TODO-CONTENT-li'></li>").attr("id","mystar-data-num-"+i).appendTo($("#" + ulId));
				$("<span class='WORK-CENTER-TODO-CONTENT-span' style='margin-left:9%;'>"+"<a style='color:#FF0000'>"+"!"+"</a>"+(i+1)+"</span>").appendTo($("#"+divId+"-num-"+i));
			}else{
				$("<li style='width:5%' class='WORK-CENTER-TODO-CONTENT-li'><span class='WORK-CENTER-TODO-CONTENT-span' style='margin-left:15%;'>"+(i+1)+"</span></li>").appendTo($("#" + ulId));
			}
			var dicName = FireFly.getDictNames(wfState, myWorkData[i].S_WF_STATE);
			
			$("<li style='width:30%' class='WORK-CENTER-TODO-CONTENT-li'><span class='WORK-CENTER-TODO-CONTENT-span'>"+myWorkData[i].TITLE+"<span></li>").appendTo($("#" + ulId));
			$("<li style='width:15%' class='WORK-CENTER-TODO-CONTENT-li'><span class='WORK-CENTER-TODO-CONTENT-span'>"+myWorkData[i].SERV_NAME+"<span></li>").appendTo($("#" + ulId));
			$("<li style='width:15%' class='WORK-CENTER-TODO-CONTENT-li'><span class='WORK-CENTER-TODO-CONTENT-span'>"+dicName+"<span></li>").appendTo($("#" + ulId));
			$("<li style='width:15%' class='WORK-CENTER-TODO-CONTENT-li'><span class='WORK-CENTER-TODO-CONTENT-span'>"+myWorkData[i].S_WF_NODE+"<span></li>").appendTo($("#" + ulId));
			$("<li style='width:20%' class='WORK-CENTER-TODO-CONTENT-li'><span class='WORK-CENTER-TODO-CONTENT-span'>"+dicName+"<span></li>").appendTo($("#" + ulId));
		}
		return myWorkDataList;
	};
	
	function getLimitedTime(id){
		return FireFly.byId("SY_COMM_TODO",id);		
	}
</script>

