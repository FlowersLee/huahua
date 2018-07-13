<#include "inHeader.ftl"/>
<div id='SY_COMM_MEMO_PAD' style='float: left;width: 100%;background: url(/sy/comm/desk/css/images/rh-back/desk_42.jpg)'>
	<style type="text/css">
		.portal-box-add {color: rgb(255, 255, 255);font-size: 12px;top: 8px;position: relative;cursor: pointer;font-family: SimHei;}
        .portal-box-add:hover {color:rgb(60, 60, 60);}
		.memoli{height: 14px;padding: 10px 10px 10px 20px;background-color: white;border-bottom: dotted rgb(199, 199, 199) 1px;font-size: 12px;cursor: pointer;}
		.clickli{background-color: #f3f3f3;}
		.memoText{font-size: 12px;}
		.search{height: 20px;line-height:1.5}
		.padLine{border-bottom: dashed rgb(230, 230, 230) 1px;}
		.btn-search {background: url(/sy/theme/default/images/icons/rh-icons.png) no-repeat scroll 0px -14px transparent;color: rgb(179, 179, 179);}
		.pad-top{background:url(/sy/comm/pad/top.png);height:7%;text-align: center;}
		.pad-top-text{display: inline;max-width: 80%;text-align: center;font-family: SimHei;height:60%;margin-top: 0.5%;margin-left: 5%;display: inline-block;color: white;font-size: 14px;}
		.pad-textarea-top-time{width: 10%;height: 100%;float: right;}
		.pad-textarea-top-range-time{width: 15%;height: 100%;float: left;margin-left: 2%;}
		.pad-textarea{height: 75.5%;}
		.pad-btn{background: #EEE7B0;text-align: center;height: 9%;}
		.pad-bottom{height: 0.5%;background: url(/sy/comm/pad/bottom.png);}
		.pad-new-font-left{left: 6px;font-size: 12px;}
		.pad-save-font-left{left: 6px;font-size: 12px;}
		.pad-new-btn{background: url(/sy/comm/pad/button.png) no-repeat -90px 3px;float: right;height: 28px;width: 85px;display: inline-block;margin-right: 20px;}
		.pad-save-btn{background: url(/sy/comm/pad/button.png) no-repeat 0px 3px;float: right;height: 28px;width: 85px;display: inline-block;margin-right: 20px;}	
	</style>
	<div id="pad_List" style="height: 93%; width: 25%; float:left;margin-left: 1.3%;margin-top: 1.5%;background-color: white;box-shadow: 4px 2px 4px rgb(32, 32, 32);">
		<div style="float: left;width: 90%;margin-left: 5%;margin-right: 5%;margin-top: 2%;margin-bottom: 2%;text-align: center;">		
			<div style="float: left;width: 100%;margin-top: 2%;">
				<a id="linum" style="font-size: 20px;"></a>
			</div>
			<div style="float: right;width: 100%;margin-top: 2%;">
				<input type="text" id="SY_ALL_SEARCH_INPUT" value="   ：备忘录" style="width: 99%;border-radius: 10px;" class="search btn-search"/>				
			</div>
		</div>
		<div id="memo_pad" style="background: url(/sy/comm/pad/left.png);border: solid #cccccc 1px;margin-left: 5%;margin-right: 5%;height: 384px;width: 90%;float: right;OVERFLOW-Y: auto; OVERFLOW-X:hidden;">
			<ul id='memoUL'>
				
			</ul>
		</div>
	</div>
	<div id="pad_info" style="height: 93%;float: right; margin-right: 1.3%; width: 71%;margin-top: 1.5%;box-shadow: 2px 2px 15px rgb(0, 0, 0);">
		<div class="pad-top">
			<span class="pad-top-text"></span>
			<span id="newPadBtn" class="pad-new-btn">
				<span id="newPad" class="portal-box-add pad-new-font-left">新建备忘</span>
			</span>
		</div>
		<div style="width: 100%;height: 8%;background: #eee7b0;border-bottom: solid #D3D0A1 1px;">
			<div style="width: 5%;height: 100%;margin-top: -1px;float: left;">
			
			</div>
			<div class="pad-textarea-top-range-time" style="border-left: double #A57C62;margin-left: -3px;">
				<label style="color:red;margin-left: 10%;margin-top: 5%;display: block;"></label>
			</div>
			<div class="pad-textarea-top-time">
				<label style="color:red;margin-top: 5%;display: block;"></label>
			</div>
		</div>
		<div class="pad-textarea">
			<div style="width:5%;height:100%;background: url(/sy/comm/pad/list.png);float: left;margin-bottom: -1px;">
				
			</div>
			<div style="width:95%;height:100%;float: left;border-left: double #A57C62;margin-left: -3px;">
				<div id="pad_text" style="width: 100%;height: 100%;border: none;font-size: 12px;">
				</div>
			</div>
		</div>
		<div class="pad-btn">
			<div style="width: 5%;height: 100%;float: left;border-right: double #A57C62;margin-left: -3px;"></div>
			<div id="preMemo" style="display: inline-block;margin-top: 1%;">			
			  <a class="rh-icon rhGrid-btnBar-a" title=""><span class="rh-icon-inner">上一条</span><span class="rh-icon-img btn-prePage"></span></a>	
			</div>
			<div id="memoDel" style="display: inline-block;">
				<a class="rh-icon rhGrid-btnBar-a" title=""><span class="rh-icon-inner">删除</span><span class="rh-icon-img btn-garbage"></span></a>
			</div>
			<div id="nextMemo" style="display: inline-block;">				
				<a class="rh-icon rhGrid-btnBar-a" title=""><span class="rh-icon-inner">下一条</span><span class="rh-icon-img btn-send"></span></a>
			</div>
		</div>
		<div class="pad-bottom">
			
		</div>
	</div>
</div>
<script type="text/javascript">
	var textHeight = GLOBAL.getDefaultFrameHei()*0.71;
	function createEditor(id,textHeight){
        var _self = this;
        toolbars = [];   
        var config = {
            initialFrameWidth: "100%",
			initialFrameHeight: textHeight,
            minFrameHeight: "0",
            autoHeightEnabled:false,
            zIndex: 1050,
            toolbars: toolbars,
            initialContent: '',
			wordCount:false,
			elementPathEnabled:false,
			initialStyle:'p{margin:0px}'
        };
        UE.getEditor(id, config).ready(function(){
			var iframeBody = jQuery("#baidu_editor_0").get(0).contentWindow.document.body;
			jQuery("#edui1").removeClass();
			jQuery("#edui1").css({
				"position": "relative",
				"overflow": "visible"
			});
			jQuery(iframeBody).css({
				"background": "url(/sy/comm/pad/list.png)",
				"line-height": "30px",
				"margin":"3px 8px 8px 8px"
			});
			if(padList && padList.length == 0){
				editor.ready(function(){
					editor.setContent("");
				});
				editor.disable();
			}
			jQuery(iframeBody).unbind("keyup").bind("keyup",function(){
				var editorCount = editor.getContentTxt();
				if(editorCount.length>50){
					editorCount= editorCount.substring(0,50);
					editorCount+=" ...";
				}		
				jQuery(".pad-top-text").text(editorCount);
				jQuery("#newPadBtn").removeClass("pad-new-btn");
				jQuery("#newPad").removeClass();
				jQuery("#newPad").text("保存");
				jQuery("#newPadBtn").addClass("pad-save-btn");
				jQuery("#newPad").addClass("portal-box-add pad-save-font-left");								
			});
         
        });
		return UE.getEditor(id);
	}
	
	var editor = createEditor("pad_text",textHeight);
	<#--编辑器添加改变事件-->
	var ul = jQuery("#memoUL");
	var padData = {};
	padData["_NOPAGE_"] = true;
	var padList = FireFly.getListData("SY_COMM_MEMO_PAD",padData)._DATA_;
	for(var i=0;i<padList.length ;i++){
		var MEMO_TITLE ="";		
		if(padList[i].MEMO_TITLE.length>15){
			MEMO_TITLE= padList[i].MEMO_TITLE.substring(0,15);
			MEMO_TITLE+=" ...";
		}else{
			MEMO_TITLE= padList[i].MEMO_TITLE;
		}
		var  parseDate= new Date(Date.parse(padList[i].MEMO_WRITE_TIME.replace(/-/g,   "/")));
		var MEMO_TIME = (parseDate.getMonth() + 1)+"月"+parseDate.getDate()+"日";
		jQuery("<li class='memoli' id='"+padList[i].MEMO_ID+"'>"+
						"<input class='memoTextHid' type='hidden' value='"+padList[i].MEMO_TEXT+"'>"+
						"<a class='memoText'>"+MEMO_TITLE+"</a>"+
						"<input class='memoTitleHid' type='hidden' value='"+padList[i].MEMO_TITLE+"'>"+
						"<a class='memoTime' style='float:right;'>"+MEMO_TIME+"</a>"+
						"<input class='memoTimeHid' type='hidden' value='"+padList[i].MEMO_WRITE_TIME+"'>"+
						"</li>").appendTo(ul);
	}
	jQuery("#linum").text("共"+padList.length+"个备忘录");


	<#--对ul里面的所有li绑定事件并且封装为一个方法-->
	allLi();
	function  allLi(){
		jQuery("#memoUL li").unbind("click").bind("click",function(){
			var memoID = true;
			jQuery.each(jQuery("#memoUL li"),function(i,n) {
				if(!jQuery(this).attr("id")){
					memoID = false;
					var r=confirm("您的内容为空将删除！");
					if (r) {
						jQuery(this).remove();
						jQuery("#newPadBtn").removeClass("pad-save-btn");
						jQuery("#newPad").removeClass();
						jQuery("#newPad").text("新建备忘");
						jQuery("#newPad").addClass("portal-box-add pad-new-font-left");
						jQuery("#newPadBtn").addClass("pad-new-btn");
					}
				}
			});
			var newPadTextBool =true;
			var newPadText = jQuery("#newPad").text();
			if (memoID) {
				if (newPadText == "保存") {
					var r = confirm("您修改的内容还没有保存！");
					if (r) {
						jQuery("#newPadBtn").removeClass("pad-save-btn");
						jQuery("#newPad").removeClass();
						jQuery("#newPad").text("新建备忘");
						jQuery("#newPad").addClass("portal-box-add pad-new-font-left");
						jQuery("#newPadBtn").addClass("pad-new-btn");
					}
					else {
					
						newPadTextBool = false;
					}
				}
			}
			if(memoID){
				if(newPadTextBool){
					
				jQuery("#memoUL li").removeClass("clickli");
				jQuery(this).addClass("clickli");
				<#--给编辑器赋初值-->
				var edictValue = jQuery(this).find(".memoTextHid").val();
				editor.ready(function(){
					editor.setContent(edictValue);
				});
				var dateDiff = rhDate.doDateDiff("D",jQuery(this).find(".memoTimeHid").val().substring(0,10),rhDate.getCurentTime().substring(0,10));
				if(dateDiff == 0){
					jQuery(".pad-textarea-top-range-time").find("label").text("今天");
				}else{
					jQuery(".pad-textarea-top-range-time").find("label").text(dateDiff+" 天前");
				}
				var  parseTime= new Date(Date.parse(jQuery(this).find(".memoTimeHid").val().replace(/-/g,   "/")));
				
				var parseTimeHours = parseTime.getHours();
				if(parseTimeHours<10){
					parseTimeHours = "0"+parseTimeHours;
				}
				var parseTimeMinutes = parseTime.getMinutes();
				if(parseTimeMinutes<10){
					parseTimeMinutes = "0"+parseTimeMinutes;
				}
				
				var memoTimeData = (parseTime.getMonth() + 1)+"月"+parseTime.getDate()+"日 "+parseTimeHours+":"+parseTimeMinutes;
				
				jQuery(".pad-textarea-top-time").find("label").text(memoTimeData);
				
				jQuery(".pad-top-text").text(jQuery(this).find(".memoTitleHid").val());
				}
			}
		});
	};
	
	<#--对上一条绑定事件-->
	jQuery("#preMemo").unbind("click").bind("click",function(){
		var class_clickli = jQuery("#memoUL").children(".clickli");
		var prevVal = class_clickli.prev().children("input").val();
		if(prevVal){
			class_clickli.removeClass("clickli");
			class_clickli.prev().addClass("clickli");
			<#--给编辑器赋初值-->
			editor.ready(function(){
				editor.setContent(prevVal);
			});
			var dateDiff = rhDate.doDateDiff("D",class_clickli.prev().find(".memoTimeHid").val().substring(0,10),rhDate.getCurentTime().substring(0,10));
			if(dateDiff == 0){
				jQuery(".pad-textarea-top-range-time").find("label").text("今天");
			}else{
				jQuery(".pad-textarea-top-range-time").find("label").text(dateDiff+" 天前");
			}
			var  parseTime= new Date(Date.parse(class_clickli.prev().find(".memoTimeHid").val().replace(/-/g,   "/")));
			
			var parseTimeHours = parseTime.getHours();
			if(parseTimeHours<10){
				parseTimeHours = "0"+parseTimeHours;
			}
			var parseTimeMinutes = parseTime.getMinutes();
			if(parseTimeMinutes<10){
				parseTimeMinutes = "0"+parseTimeMinutes;
			}
			
			var memoTimeData = (parseTime.getMonth() + 1)+"月"+parseTime.getDate()+"日 "+parseTimeHours+":"+parseTimeMinutes;
			jQuery(".pad-textarea-top-time").find("label").text(memoTimeData);

			jQuery(".pad-top-text").text(class_clickli.prev().find(".memoTitleHid").val());			
		}
	});
	<#--对下一条绑定事件-->
	jQuery("#nextMemo").unbind("click").bind("click",function(){
		var class_clickli = jQuery("#memoUL").children(".clickli");
		var nextVal = class_clickli.next().children("input").val();
		if(nextVal){
			class_clickli.removeClass("clickli");
			class_clickli.next().addClass("clickli");
			<#--给编辑器赋初值-->
			editor.ready(function(){
				editor.setContent(nextVal);
			});	
			var dateDiff = rhDate.doDateDiff("D",class_clickli.next().find(".memoTimeHid").val().substring(0,10),rhDate.getCurentTime().substring(0,10));
			if(dateDiff == 0){
				jQuery(".pad-textarea-top-range-time").find("label").text("今天");
			}else{
				jQuery(".pad-textarea-top-range-time").find("label").text(dateDiff+" 天前");
			}
			var  parseTime= new Date(Date.parse(class_clickli.next().find(".memoTimeHid").val().replace(/-/g,   "/")));
			var parseTimeHours = parseTime.getHours();
			if(parseTimeHours<10){
				parseTimeHours = "0"+parseTimeHours;
			}
			var parseTimeMinutes = parseTime.getMinutes();
			if(parseTimeMinutes<10){
				parseTimeMinutes = "0"+parseTimeMinutes;
			}
			var memoTimeData = (parseTime.getMonth() + 1)+"月"+parseTime.getDate()+"日 "+parseTimeHours+":"+parseTimeMinutes;
			jQuery(".pad-textarea-top-time").find("label").text(memoTimeData);

			jQuery(".pad-top-text").text(class_clickli.next().find(".memoTitleHid").val());		
		}
	});

	<#--对删除按钮进行绑定事件-->
	jQuery("#memoDel").unbind("click").bind("click",function(){
		var r=confirm("您确定要删除么？");
		if(r){
			var class_clickli = jQuery("#memoUL").children(".clickli");
			var nextLi = class_clickli.next("li");
			if(nextLi.size()){
				nextLi.click();
			}else{
				jQuery("#memoUL").children("li").first().click();
			}
			var delId = class_clickli.attr("id");
			class_clickli.remove();
			var linum = jQuery("#memoUL li").size();
			if (linum == 0) {
				editor.ready(function(){
					editor.setContent("您还没有备忘请新建备忘。。。。。。");
				});
				editor.disable();
			}
			jQuery("#linum").text("共"+linum+"个备忘录");
			FireFly.listDelete("SY_COMM_MEMO_PAD",{"_PK_":delId});
		}
	});

	<#--对搜索框绑定事件-->
	jQuery("#SY_ALL_SEARCH_INPUT").unbind("keyup").bind("keyup",function(){
		jQuery("#memoUL").children().remove();
		var userCode = System.getVar("@USER_CODE@");
		var searchVal = jQuery(this).val();
		var data = {};
		data["_searchWhere"] = " and USER_CODE='"+userCode+"' and MEMO_TEXT like '%"+searchVal+"%'";
		var returnSerach = FireFly.getListData("SY_COMM_MEMO_PAD",data);
		for (var i=0; i<returnSerach._DATA_.length;i++){
			var searchUl = jQuery("#memoUL");
			var searchText = returnSerach._DATA_[i].MEMO_TITLE;
			var searchTitle = searchText.substring(0,15);
			if(searchText.length>15){
				searchTitle+=" ...";
			}
			
			var  pasTime= new Date(Date.parse(returnSerach._DATA_[i].MEMO_WRITE_TIME.replace(/-/g,   "/")));
			var memoDateData = (pasTime.getMonth() + 1)+"月"+pasTime.getDate()+"日";
			
			var searchLi = jQuery("<li class='memoli' id='"+returnSerach._DATA_[i].MEMO_ID+"'></li>").appendTo(searchUl);
			jQuery("<input class='memoTextHid' type='hidden' value='"+searchText+"'>").appendTo(searchLi);
			jQuery("<a class='memoText'>"+searchTitle+"</a>").appendTo(searchLi);
			jQuery("<input class='memoTitleHid' type='hidden' value='"+returnSerach._DATA_[i].MEMO_TITLE+"'>").appendTo(searchLi);
			jQuery("<a class='memoTime' style='float:right;'>"+memoDateData+"</a>").appendTo(searchLi);
			jQuery("<input class='memoTimeHid' type='hidden' value='"+returnSerach._DATA_[i].MEMO_WRITE_TIME+"'></a>").appendTo(searchLi);		
		}
		<#--对所有的li再次绑定事件-->
		allLi();
		jQuery("#memoUL li").first().click();
	});
	<#--对搜索框样式绑定事件-->
	jQuery("#SY_ALL_SEARCH_INPUT").unbind("focusout").bind("focusout",function(){
		jQuery(this).val("    ：备忘录");
		jQuery(this).addClass("btn-search");
	});
	jQuery("#SY_ALL_SEARCH_INPUT").unbind("focusin").bind("focusin",function(){
		jQuery(this).val("");
		jQuery(this).removeClass("btn-search");
	});

	<#--新建备忘-->
	jQuery("#newPadBtn").unbind("click").bind("click",function(){
		<#--设置当前编辑区域可以编辑-->
		editor.enable();
		if (jQuery("#newPad").text() == "新建备忘") {
			jQuery(".pad-top-text").text("");
			jQuery(this).removeClass("pad-new-btn");
			jQuery("#newPad").removeClass();
			jQuery("#newPad").text("保存");
			jQuery(this).addClass("pad-save-btn");
			jQuery("#newPad").addClass("portal-box-add pad-save-font-left");
			<#--让编辑器获得焦点-->
			editor.focus();
			<#--重置编辑器-->
			editor.ready(function(){
				editor.setContent("");
			});
			var data = FireFly.byId("SY_COMM_MEMO_PAD", null);
			
			var  pasTime = new Date(Date.parse(data.MEMO_WRITE_TIME.replace(/-/g,   "/")));
			var pasTimeHours = pasTime.getHours();
			if(pasTimeHours<10){
				pasTimeHours = "0"+pasTimeHours;
			}
			var pasTimeMinutes = pasTime.getMinutes();
			if(pasTimeMinutes<10){
				pasTimeMinutes = "0"+pasTimeMinutes;
			}
			
			var memoDateData = (pasTime.getMonth() + 1)+"月"+pasTime.getDate()+"日";
			var memoTimeData = (pasTime.getMonth() + 1)+"月"+pasTime.getDate()+"日 "+pasTimeHours+":"+pasTimeMinutes;
			
			jQuery(".pad-textarea-top-time").find("label").text(memoTimeData);
			jQuery(".pad-textarea-top-range-time").find("label").text("今天");
			
			var newLi = jQuery("<li class='memoli'><input class='memoTextHid' type='hidden'>" +
			"<a class='memoText'>新建备忘录</a>" +
			"<input class='memoTitleHid' type='hidden' value=''>"+
			"<a class='memoTime' style='float:right;'>" +memoDateData +"</a>"+
			"<input class='memoTimeHid' type='hidden' value='"+data.MEMO_WRITE_TIME+"'></li>");
			if (jQuery("#memoUL").children().size()) {
				jQuery("#memoUL li:first-child").before(newLi);
			}else{
				newLi.appendTo(jQuery("#memoUL"));
			}
			newLi.unbind("click").bind("click", function(){
				jQuery("#memoUL li").removeClass("clickli");
				jQuery(this).addClass("clickli");
				<#--给编辑器赋初值-->
				var edictValue = jQuery(this).find(".memoTextHid").val();
				editor.ready(function(){
					editor.setContent(edictValue);
				});
				var  newpasTime= new Date(Date.parse(jQuery(this).find(".memoTimeHid").val().replace(/-/g,   "/")));
				
				var newpasTimeHours = newpasTime.getHours();
				if(newpasTimeHours<10){
					newpasTimeHours = "0"+newpasTimeHours;
				}
				var newpasTimeMinutes = newpasTime.getMinutes();
				if(newpasTimeMinutes<10){
					newpasTimeMinutes = "0"+newpasTimeMinutes;
				}
				
				var newmemoTimeData = (newpasTime.getMonth() + 1)+"月"+newpasTime.getDate()+"日 "+newpasTimeHours+":"+newpasTimeMinutes;

				jQuery(".pad-textarea-top-time").find("label").text(newmemoTimeData);
				var dateDiff = rhDate.doDateDiff("D",jQuery(this).find(".memoTimeHid").val().substring(0,10),rhDate.getCurentTime().substring(0,10));
				if(dateDiff == 0){
					jQuery(".pad-textarea-top-range-time").find("label").text("今天");
				}else{
					jQuery(".pad-textarea-top-range-time").find("label").text(dateDiff+" 天前");
				}
				jQuery(".pad-top-text").text(jQuery(this).find(".memoTitleHid").val());
			});
			jQuery("#memoUL li").removeClass("clickli");
			newLi.addClass("clickli");
			var linum = jQuery("#memoUL li").size();
			jQuery("#linum").text("共"+linum+"个备忘录");
		}else{
			<#--获取编辑器内容-->
			var editorCount = editor.getContent();
			var memoVal = jQuery("#memoUL").children(".clickli").find(".memoTextHid").val();
			if(editorCount != memoVal && editorCount != ""){
				var id = jQuery("#memoUL").children(".clickli").attr("id");
				
				jQuery(this).removeClass("pad-save-btn");
				jQuery("#newPad").removeClass();
				jQuery("#newPad").text("新建备忘");
				jQuery(this).addClass("pad-new-btn");
				jQuery("#newPad").addClass("portal-box-add pad-new-font-left");
				<#--大标题-->
				var memoTitle = editor.getContentTxt();
				<#--小标题-->
				var  memoeText = memoTitle;
				if(memoeText.length>15){
					memoeText= memoTitle.substring(0,15);
					memoeText+=" ...";
				}
				jQuery(".clickli").find(".memoText").text(memoeText);
				if(memoTitle.length>50){
					memoTitle= memoTitle.substring(0,50);
					memoTitle+=" ...";
				}
				jQuery(".clickli").find(".memoTitleHid").val(memoTitle);
				jQuery(".clickli").find(".memoTextHid").val(editorCount);
				var memoTime = jQuery(".clickli").find(".memoTimeHid").val();
				<#--判断是否修改-->		
				if(id){
					var clickLi = jQuery("#memoUL").children(".clickli");
					var memoData = FireFly.byId("SY_COMM_MEMO_PAD", null);
					var  DateData= new Date(Date.parse(memoData.MEMO_WRITE_TIME.val().replace(/-/g,   "/")));
					var memoDateData = (DateData.getMonth() + 1)+"月"+DateData.getDate()+"日 ";

					clickLi.children().remove();
					jQuery("<input class='memoTextHid' type='hidden'>").val(editorCount).appendTo(clickLi);
					jQuery("<a class='memoText'></a>").text(memoeText).appendTo(clickLi);
					jQuery("<input class='memoTitleHid' type='hidden'>").val(memoTitle).appendTo(clickLi);
					jQuery("<a class='memoTime' style='float:right;'>"+memoDateData+"</a>").appendTo(clickLi);
					jQuery("<input class='memoTimeHid' type='hidden' value='"+memoData.MEMO_WRITE_TIME+"'>").appendTo(clickLi);
					FireFly.cardModify("SY_COMM_MEMO_PAD",{"_PK_":id,"MEMO_TEXT":editorCount,"MEMO_TITLE":memoTitle,"MEMO_WRITE_TIME":memoData.MEMO_WRITE_TIME});
				}else{
					var newID = FireFly.cardAdd("SY_COMM_MEMO_PAD",{"MEMO_TEXT":editorCount,"MEMO_TITLE":memoTitle,"MEMO_WRITE_TIME":memoTime});					
					jQuery("#memoUL").children(".clickli").attr("id",newID.MEMO_ID);
				}
				var linum = jQuery("#memoUL li").size();
				jQuery("#linum").text("共"+linum+"个备忘录");
				jQuery("#newPadBtn").removeClass("pad-save-btn");
				jQuery("#newPad").removeClass();
				jQuery("#newPad").text("新建备忘");
				jQuery("#newPad").addClass("portal-box-add pad-new-font-left");
				jQuery("#newPadBtn").addClass("pad-new-btn");
			}else{
				 if (editorCount == memoVal && editorCount == "") {
					var r=confirm("您的内容为空将删除！");
					if(r){
					 	jQuery("#memoUL").children(".clickli").remove();
					 	jQuery("#memoUL").children().first().click();
					 	var linum = jQuery("#memoUL li").size();
					 	jQuery("#linum").text("共" + linum + "个备忘录");
					 	if (linum == 0) {
					 		jQuery("textarea").val("您还没有备忘请新建备忘。。。。。。");
					 		editor.disable();
					 	}
					 	jQuery("#newPadBtn").removeClass("pad-save-btn");
						jQuery("#newPad").removeClass();
						jQuery("#newPad").text("新建备忘");
						jQuery("#newPad").addClass("portal-box-add pad-new-font-left");
						jQuery("#newPadBtn").addClass("pad-new-btn");
					}
				 }
			}
		}
	});
	jQuery("#newPadBtn").unbind("mouseout").bind("mouseout",function(){
		jQuery("#newPad").css("color","white");
	});
	jQuery("#newPadBtn").unbind("mouseover").bind("mouseover",function(){
		jQuery("#newPad").css("color","black");
	});
	<#--模拟单击第一个li-->
	jQuery("#memoUL li").first().click();

	jQuery(document).ready(function(){
		jQuery("#SY_COMM_MEMO_PAD").height(GLOBAL.getDefaultFrameHei());
	});
</script>