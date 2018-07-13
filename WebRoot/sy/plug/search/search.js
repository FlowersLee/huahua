/*
--------------------------------------------------------
searcj.js - Input Suggest


--------------------------------------------------------
 */

if (!Search) {
	var Search = {};
}

// cache category data
var catCache = [];
// cache filter data
var filterCache = [];
// cache group data
var groupMap = {};
// the default data size in one group
var groupMemberLimit = 5;
// the max data size in one group
var groupMemberMaxLimit = 100;

var currentKeywordIndex = 1;
// server url
// var serverURL ="http://staff.zotn.com:8888/solr";

// search
Search.search = function(keywordIndex) {
	// set current keywords input item
	if ("" != keywordIndex) {
		currentKeywordIndex = keywordIndex;
	}

	catCache = [];
	Search.query("", 1);
};

// search by keywords
Search.searchByKeyword = function(keywords) {
	document.getElementById("data").value = '{"KEYWORDS":"' + keywords + '"}';
	document.getElementById("searchForm").submit();
	parent.window.scrollTo(0, 0); // 外层页面滚动到顶部
}

// page turning
Search.page = function(page) {
	var lastQuery = document.getElementById("lastQuery").value;
	Search.query(lastQuery, page);
};

// order by
Search.orderBy = function(sort) {
	var lastQuery = document.getElementById("lastQuery").value;
	Search.query(lastQuery, 1, sort);
};

// ajax结果分组
Search.groupBy = function(query, display, catId, level, type) {
	var groupList = document.getElementById("group-list");
	var groupId = "group_" + catId;
	var group = jQuery("<ul id='" + groupId + "' class='tbt tbpd'></ul>")
			.appendTo(groupList);
	var param = {};
	param["SELECTED_CATS"] = catCache;
	param["QUERY"] = query;
	param["GROUP_BY"] = catId;
	param["GROUP_TYPE"] = type;

	$.ajax({
		url : '/SY_PLUG_SEARCH.groupBy.do',
		type : 'POST',
		data : param,
		success : function(dataStr) {
			var groupData = StrToJson(dataStr)._DATA_;
			groupMap[catId] = groupData;
			Search.groupRendering(groupId, display, catId, groupMemberLimit,
					level);
		}
	});
};

Search.groupRendering = function(groupId, display, type, limit, level) {
	document.getElementById(groupId).innerHTML = "";
	var groupData = groupMap[type];
	if (groupData == null || groupData.length == 0) {
		return;
	}
	var html = "<li class='tbos'>" + display + "</li>";
	// for each data
	var maxShow = 0;
	jQuery.each(groupData, function(index, n) {
		if (limit <= index) {
			// show the part of result
			return false;
		}
		var groupName = n.NAME;
		// 如果是服务，将替换服务显示名称
		if ("service" == type) {
			var temp = getServiceName(groupName);
			if (temp != "") {
				groupName = getServiceName(groupName);
			}
		} else if ("company" == type) {
			groupName = FireFly.getCmpyName(groupName);
		}

		if (groupName == "") {
			groupName = "未知";
		}
		if (groupName == "SY_PLUG_SEARCH_WEB") {
			groupName = "互联网";
		}
		var displayTitle = groupName + "(" + n.COUNT + ")";
		if (groupName.length > 8) {
			groupName = groupName.substr(0, 6) + "...";
		}
		var displayName = groupName + "(" + n.COUNT + ")";

		var queryValue = n.NAME;
		if (null != n.QUERY && "" != n.QUERY) {
			queryValue = n.QUERY;
		}
		// alert("----debug---n.NAME:" + n.NAME);
		html += "<li class='tbou'><a href=\"javascript:Search.searchByCat('"
				+ type + "','" + queryValue + "','" + groupName + "'," + level
				+ ")\"  title='" + displayTitle + "' class='q qs'>"
				+ displayName + "</a></li>";
		maxShow++;
	});

	// show group data policy
	// 如果该分组数据全部显示，并且数据项目大于5，那么我们应该提供【显示部分项】按钮
	// 如果该分组数据全部显示，并且数据项目小于等于5 我们不需要任何筛选按钮
	// 如果该分组数据只显示了一部分，那么我们应该给出[全部显示]按钮
	if (groupData.length == maxShow) {
		if (groupMemberLimit < groupData.length) {
			html += "<li class='tbou'><a href=javascript:Search.groupRendering('"
					+ groupId
					+ "','"
					+ display
					+ "','"
					+ type
					+ "','"
					+ groupMemberLimit
					+ "',"
					+ level
					+ ") class='q qs'>只显示部分项</a></li>";
		}
	} else {
		html += "<li class='tbou'><a href=javascript:Search.groupRendering('"
				+ groupId + "','" + display + "','" + type + "','"
				+ groupMemberMaxLimit + "'," + level
				+ ") class='q qs'>全部显示</a></li>";
	}
	document.getElementById(groupId).innerHTML = html;
};

// search by modified time
Search.searchByDate = function(type) {
	// clear filter history
	catCache = [];
	// current time
	var endTimeStr = GetTimeStr(1);
	var startTimeStr = "";

	if ("d" == type) {
		var startTime = Date.prototype.DateSub("d", 1);
		startTimeStr = GetTimeStr(1, startTime);

	} else if ("w" == type) {
		var startTime = Date.prototype.DateSub("w", 1);
		startTimeStr = GetTimeStr(1, startTime);

	} else if ("m" == type) {
		var startTime = Date.prototype.DateSub("m", 1);
		startTimeStr = GetTimeStr(1, startTime);

	} else if ("y" == type) {
		var startTime = Date.prototype.DateSub("y", 1);
		startTimeStr = GetTimeStr(1, startTime);
	} else {
		document.getElementById("startTime").value = '';
		document.getElementById("endTime").value = '';
	}

	var lastQuery = document.getElementById("lastQuery").value;

	Search.updateFilter("date");
	if ("all" != type) {
		var filter = {};
		filter["id"] = "date";
		filter["data"] = "date_" + type;
		filterCache.push(filter);
	}

	Search.query(lastQuery, 1, "", filterCache, startTimeStr, endTimeStr);
};

// search by Custom Time
Search.searchByCustomTime = function() {
	var startTime = document.getElementById("cdr_min").value;
	var endTime = document.getElementById("cdr_max").value;
	var lastQuery = document.getElementById("lastQuery").value;

	Search.updateFilter("date");
	var filter = {};
	filter["id"] = "date";
	filter["data"] = "date_c";
	filterCache.push(filter);
	Search.query(lastQuery, 1, "", filterCache, startTime, endTime);
};

// search by serv
Search.searchByMultiServ = function(servIds) {
	Search.updateFilter("service");
	jQuery.each(servIds, function(i, n) {
		var filter = {};
		filter["id"] = "service";
		filter["data"] = n;
		filterCache.push(filter);
	});
	var lastQuery = document.getElementById("lastQuery").value;
	Search.query(lastQuery, 1, "", filterCache);
};

// search by serv
Search.searchByServ = function() {
	Search.updateFilter("service");
	var selected = document.getElementById("selectedServ").value;
	if ("all" == selected) {
		// Search.search();
	} else {
		var filter = {};
		filter["id"] = "service";
		filter["data"] = selected;
		filterCache.push(filter);
	}
	var lastQuery = document.getElementById("lastQuery").value;
	Search.query(lastQuery, 1, "", filterCache);
};

// search by cmpy
Search.searchByMultiCmpy = function(cmpys) {
	Search.updateFilter("company");
	jQuery.each(cmpys, function(i, n) {
		var filter = {};
		filter["id"] = "company";
		filter["data"] = n;
		filterCache.push(filter);
	});
	var lastQuery = document.getElementById("lastQuery").value;
	Search.query(lastQuery, 1, "", filterCache);
};

// search by cmpy
Search.searchByCmpy = function(cmpy) {
	Search.updateFilter("company");
	if ("all" == cmpy) {
		// Search.search();
	} else {
		var filter = {};
		filter["id"] = "company";
		filter["data"] = cmpy;
		filterCache.push(filter);
	}
	var lastQuery = document.getElementById("lastQuery").value;
	Search.query(lastQuery, 1, "", filterCache);
};

// clear and search
Search.reSearch = function(cmpy) {
	filterCache = [];
	catCache = [];
	document.getElementById("startTime").value = '';
	document.getElementById("endTime").value = '';
	var lastQuery = document.getElementById("lastQuery").value;
	Search.query(lastQuery, 1, "");
};
// update filter
// 删除已存在的filter
Search.updateFilter = function(filter) {
	var newFilter = [];
	jQuery.each(filterCache, function(index, n) {
		if (n["id"] != filter) {
			newFilter.push(n);
		}
	});
	filterCache = newFilter;
};

// search by category
Search.searchByCat = function(catId, catValue, display, level, filter) {
	// set category cache
	var catQuery = catId + ":" + catValue;
	var selectedCat = {};
	selectedCat["query"] = catId + ":" + catValue;
	selectedCat["id"] = catValue;
	selectedCat["name"] = catValue;
	selectedCat["type"] = catId;
	selectedCat["level"] = level;
	if ("service" == catId) {
		selectedCat["name"] = getServiceName(catValue);
	} else if ("company" == catId) {
		selectedCat["name"] = FireFly.getCmpyName(catValue);
	}

	if (null != display && "" != display) {
		selectedCat["name"] = display;
	}

	// add new category
	catCache.push(selectedCat);

	var lastQuery = document.getElementById("lastQuery").value;
	Search.query(lastQuery, 1, "", filter);
};

// unsearch
Search.unSearch = function() {
	// 删除所有已选分类
	catCache = [];
	// 重新查询数据
	var lastQuery = document.getElementById("lastQuery").value;
	Search.query(lastQuery, 1);
};

// unsearch by category
Search.unSearchByCat = function(catId) {

	// 删除选中分类
	var targetIndex = -1;
	jQuery.each(catCache, function(index, n) {
		if (n["type"] == catId) {
			targetIndex = index;
		}
	});

	if (-1 < targetIndex) {
		catCache.splice(targetIndex, 1);
	}
	// 重新查询数据
	var lastQuery = document.getElementById("lastQuery").value;
	Search.query(lastQuery, 1);
};

// load selected category cache
Search.loadSelectedCache = function() {
	if (catCache.length > 0) {
		return;
	}
	// add current cache to category cache list
	var currentCache = StrToJson(document.getElementById("categoryCache").value);
	jQuery.each(currentCache, function(index, n) {
		catCache.push(n);
	});

};

// load filterCache cache
Search.loadFilterCache = function() {
	if (filterCache.length > 0) {
		return;
	}
	// add current cache to category cache list
	var currentCache = StrToJson(document.getElementById("filterCache").value);
	jQuery.each(currentCache, function(index, n) {
		filterCache.push(n);
	});
};

// query
// +---------------------------------------------------
// | @param queryStr 请求表达式
// | @param targetPage 分页
// | @param sort 排序字段
// | @param filter 左侧过滤条件
// | @param startTime 开始时间（过滤条件）
// | @param endTime 结束时间 (过滤条件)
// |
// +---------------------------------------------------
Search.query = function(queryStr, targetPage, sort, filter, startTime, endTime) {

	// get keywords
	var keywords = Search.getInputKeyowrds();
	// keywords = rhEncodeContent(keywords);
	var param = {};
	var page = {};
	var pageData = [];
	page["SHOWNUM"] = "10";
	page["NOWPAGE"] = targetPage;
	pageData.push(page);
	param["SELECTED_CATS"] = catCache;
	param["QUERY"] = queryStr;
	if (null != sort && "" != sort) {
		param["SORT"] = sort;
	}
	if (null != filter) {
		param["FILTER"] = filter;
	} else {
		param["FILTER"] = filterCache;
	}
	if (null != startTime && "" != startTime) {
		param["STARTTIME"] = startTime;
	} else {
		param["STARTTIME"] = document.getElementById("startTime").value;
	}
	if (null != endTime && "" != endTime) {
		param["ENDTIME"] = endTime;
	} else {
		param["ENDTIME"] = document.getElementById("endTime").value;
	}
//	param["_PAGE_"] = pageData;
	param["_PAGE_"] = page;
	param["KEYWORDS"] = keywords;

	document.getElementById("data").value = jQuery.toJSON(param);
	document.getElementById("searchForm").submit();
	parent.window.scrollTo(0, 0); // 外层页面滚动到顶部
}

// 关键词的相关搜索列表
Search.startSimilarSearch = function(serverURL, keyWords) {
	var similarStr1 = "";
	var similarStr2 = "";
	// var text = keyWords;
	var url = serverURL + "?rtn=js&w=";
	document.getElementById("similar1").innerHTML = "";
	document.getElementById("similar2").innerHTML = "";
	jQuery
			.getScript(
					url + encodeURIComponent(keyWords),
					function() {
						var list = response.wlist;
						var listHalfSize = list.length / 2;
						var top3Html = "";
						// for(var i = 0; i <list.length; i++){
						// if(i < listHalfSize){
						// similarStr1 = similarStr1 + "<a
						// href=javascript:Search.searchByKeyword('"+list[i]+"')>"+list[i]+"</a>
						// "
						// }else{
						// similarStr2 = similarStr2 + "<a
						// href=javascript:Search.searchByKeyword('"+list[i]+"')>"+list[i]+"</a>
						// "
						// }
						// if (i < 3) {
						// top3Html += "<a
						// href=javascript:Search.searchByKeyword('"+list[i]+"')>"+list[i]+"</a>&nbsp;&nbsp;";
						// }
						// }

						similarStr1 = "<table style='line-height:25px;' cellspacing='0' cellpadding='0'><tr>";
						for ( var i = 0; i < list.length; i++) {
							if (i != 0 && i % 5 == 0) {
								similarStr1 += "</tr><tr>";
							}
							similarStr1 += "<td style='padding-right: 25px;' valign='top'>"
									+ "<a href=javascript:Search.searchByKeyword('"
									+ list[i] + "')>" + list[i] + "</a></td>";
							if (i < 3) {
								top3Html += "<a href=javascript:Search.searchByKeyword('"
										+ list[i]
										+ "')>"
										+ list[i]
										+ "</a>&nbsp;&nbsp;";
							}
						}
						similarStr1 += "</tr> </table>"

						// set top3 dependence keyword
						// document.getElementById("dependence").innerHTML=
						// top3Html;
						document.getElementById("similar").innerHTML = "相关搜索";
						document.getElementById("similar1").innerHTML = similarStr1;
						document.getElementById("similar2").innerHTML = similarStr2;
						// response.wlist = "";
					});

};

// ajax请求拼写检查
Search.spellCheck = function(serverURL, keyWords) {
	var url = serverURL + "?rtn=js&w=";
	document.getElementById("spellcheck").innerHTML = "";
	jQuery
			.getScript(
					url + encodeURIComponent(keyWords),
					function() {
						var list = response.wlist;
						if (list != '') {
							if (list.length > 1) {
								document.getElementById("spellcheck").innerHTML = "您要找的是不是<a href=javascript:Search.searchByKeyword('"
										+ list[0]
										+ "')><em>"
										+ list[0]
										+ "</em></a>";
							} else {
								document.getElementById("spellcheck").innerHTML = "您要找的是不是<a href=javascript:Search.searchByKeyword('"
										+ list + "')><em>" + list + "</em></a>";
							}
						}
					});
};

/**
 * 预览功能
 * @param flag    :
 * @param doc_id  ：文档id
 * @param content :
 * @param obj	  : a.rh-res-file-prev
 */ 
Search.preview = function(flag, doc_id, content, obj) {
//	var frameHei = GLOBAL.getDefaultFrameHei();
	var prevSpan=jQuery(obj).parent();
	//获取索引
//	var index=jQuery(obj).parent().attr("id").split("_")[1];
	 
	var offset = $(obj).offset();
	var x = offset.left;
	var y = offset.top;
	var selfw=$(obj).width();
	var w = $("body").width() - offset.left - selfw-2;// 确定宽度
	// 设置弹出位置
	var cls={
			left:x+selfw-2,
			width:w,
			height:"100%" 
	};
	
	var winScrollY=$(window).scrollTop(),
	    scrollBegin = 105;
	
	if(winScrollY < scrollBegin){
		cls.top= scrollBegin-winScrollY;
	}
	else{
		cls.top= 8;
	}
	
	prevSpan.find(".rh-res-preview").css(cls);
  
	var keywords = this.getInputKeyowrds();
	
	$.ajax({
		url : '/SY_PLUG_SEARCH.preview.do',
		type : 'POST',
		data : {
			_PK_ : doc_id,
			preview_field : content,
			KEYWORDS : keywords
		},
		success : function(outBeanStr) {
			var outBean = StrToJson(outBeanStr)._DATA_;
			if (null != outBean && 0 < outBean.length) {
				var title = outBean[0].title;

				var tags = doc_id.split(",");
				var servId = "unknow";
				var dataId = "unknow";
				if (tags.length > 1) {
					servId = tags[0];
					dataId = tags[1];
				}

				// set serv image
				var img = "";
				if (content == "content" && servId == "TBL_MSV_FAWEN") {
					img = "<img src='/sy/plug/search/serv/img/TBL_MSV_FAWEN.jpg'>";
				}
				
				var url = "";
		 		if (servId == "SY_COMM_ZHIDAO_QUESTION") {
		 			url = "/cms/SY_COMM_ZHIDAO_QUESTION/" + dataId + ".html";	
		  		} else if(servId == "SY_COMM_WENKU_DOCUMENT") {
		  		    url = "/cms/SY_COMM_WENKU_DOCUMENT/" + dataId + ".html";
		  		}
		  		if (null == url || "" == url) {
		  			url = servId + ".card.do?pkCode=" + dataId ;
		  		}
			  	var tHtml="<a class='rh-open-ahovr' href=\"javascript:var opts={'url':'"
					+ url
					+ "','tTitle':'"
					+ title
					+ "','menuFlag':3,'scrollFlag':true};Tab.open(opts);\">"
					+ title
					+ "</a>" + "<br><br>" + img;	
			  	if(content=="content"){
			  		prevSpan.find(".preview-title").html(tHtml); 
			  		prevSpan.find(".preview-content").html(outBean[0].content);
				}else{
					prevSpan.find(".preview-title").html("测试附件预览"); 
			  		prevSpan.find(".preview-content").html("这是附件预览");
				}
			}
		}
	});
};

// 预览关闭功能
Search.close = function(event) {
	var e=event||window.event;
	if(document.all){//ie8-
		e.returnValue = false;
	}else{
		e.preventDefault();
	}
	var target=e.srcElement ? e.srcElement : e.target;
	$(target).parent().parent().hide();
};
Search.constants={
		enterFirstTimeout:400,
		enterSecondTimeout:100,
		leaveTimeout:2000,
		previewHtml:"<div class='rh-res-preview previewCover'><div style='margin-top: 5px;'><div class='preview-title'></div><a href='#' onclick='javascript:Search.close(event);' class='btnClose'></a></div><div class='preview-content'></div></div>",
		oldPrevSpan:null,
		oldPrev:null 
};
Search._getPrevSpan=function(){
	return this.constants.oldPrevSpan;
};
Search._setPrevSpan=function(o){
	this.constants.oldPrevSpan=o;
};
Search._getPrev=function(){
	return this.constants.oldPrev;
};
Search._setPrev=function(o){
	this.constants.oldPrev=o;
}
Search._showPreviewContent=function(newPrevSpan){
	var o=this._getPrevSpan();
	if(o && o!=newPrevSpan){
		//隐藏old 预览
		this._hidePreviewContent();
	}
	this._setPrevSpan(newPrevSpan);
	var iprev=$(newPrevSpan).find(".rh-res-file-prev");
	//显示span.rh-res-file-arr
	this._showPrev(iprev);
	// 如果不存在.rh-res-preview则插入，否则显示
	var t=$(newPrevSpan).find(".rh-res-preview");
	if(t.length==0){
		//插入预览页面，并触发a.rh-res-file-prev的click事件加载数据
		$(this.constants.previewHtml).appendTo($(newPrevSpan));
		$(newPrevSpan).find("a.rh-res-file-prev").trigger("click");
	}else{
		// 设置弹出位置,重置top
		var top=8;
		var winScrollY=$(window).scrollTop(),
		    scrollBegin = 105;
		
		if(winScrollY < scrollBegin){
			top= scrollBegin-winScrollY;
		}
		t.css("top",top).show();
	}
};
Search._hidePreviewContent=function(){
	var o=this._getPrevSpan();
	if(o){
		$(o).removeClass("rh-res-file-prevActive");
		$(o).find(".rh-res-file-arr").addClass("hide");
		//隐藏.rh-res-preview
		$(o).find(".rh-res-preview").hide();
		this._setPrevSpan(null);
	}
};
/**
 * 显示span.rh-res-file-arr
 * @param a.rh-res-file-prev
 */
Search._showPrev=function(iprev){
	var o=this._getPrev();
	if(o && o!=iprev){
		$(o).find(".rh-res-file-arr").addClass("hide");
	}
	this._setPrev(iprev);
	//获取span.rh-res-file-prevSpan添加rh-res-file-prevActive
	var spanPrev=iprev.parent();
	spanPrev.addClass("rh-res-file-prevActive");
	//获取div.rh-contentPreview
	var result=spanPrev.parent();
	//获取div.rh-contentPreview高度
	var h=result.height();
	//设置span.rh-res-file-arr显示 高度为h-3 px
	//.rh-res-file-img 高度为18  
	if(h-3>20){
		$(iprev).find(".rh-res-file-arr").height(h-3)
				.find(".rh-res-file-img").css("margin-top",(h-23)/2);
	} 
	$(iprev).find(".rh-res-file-arr").removeClass("hide")
}
/**
 * 隐藏span.rh-res-file-arr
 * @param a.rh-res-file-prev
 */
Search._HidePrev=function(iprev){
	var prevSpan=iprev.parent();
	prevSpan.removeClass("rh-res-file-prevActive");
	var x=iprev.find(".rh-res-file-arr");
	if(x){
		x.addClass("hide");
	}
}
Search.init=function(){
	var g,b,n;
	$(".rh-contentPreview").on({
		mouseenter:function(){
			var self=this;
			var newPrevSpan=$(this).find(".rh-res-file-prevSpan");
			//获取a
			var iprev=newPrevSpan.find("a"); 
			//是否存在
			var old=Search._getPrevSpan();
			if(old){
				if (old == newPrevSpan) {
					clearTimeout(g);
					return
				}
			 	clearTimeout(g);
                g = setTimeout(function() {
                	//显示a.rh-res-file-prev
                    Search._showPrev(iprev);
                }, 600);
			}else{
				clearTimeout(g);
                g = setTimeout(function() {
                	 Search._showPrev(iprev);
                }, 0)
			}
		},
		mouseleave:function(){
			 var iprev=$(this).find(".rh-res-file-prev");
			 var o=Search._getPrevSpan();
			 if(!o){
				 Search._HidePrev(iprev);
			 }
		}
	});
	$(".rh-res-file-prevSpan").on({
		mouseenter:function(){
			clearTimeout(n);
			clearTimeout(b);
			var self=this;
			var o=Search._getPrevSpan();
			var time=o?Search.constants.enterSecondTimeout:Search.constants.enterFirstTimeout;
			n = setTimeout(function() {
				if (o != self) {
					Search._showPreviewContent(self)
				} else {
					return;
				}
			},time)
		},
		mouseleave:function(){
			clearTimeout(n);
			clearTimeout(b);
			b = setTimeout(function() {
				Search._hidePreviewContent();
			}, 2000);
		},
		click:function(){
			var self=this;
			$(this).find(".rh-res-file-arr").click(function(event){
				//兼容ie和firefox
				var e=event||window.event;
				if(document.all){//ie8-
					e.returnValue = false;
				}else{
					e.preventDefault();
				}
				$(self).find(".rh-res-preview").toggle();
			});
		}
	});
	$(".btnClose").on("click",function(event){
		
	});
}//end init
// 预览自动关闭
Search.autoHide=function(){
	// TODO 点击关闭
	$(document).on("click",function(event){
		var winOffset=jQuery(window).scrollTop();
		//区分ie和FF
		 var e=event||window.event;
		 var target=e.srcElement ? e.srcElement : e.target;
		 while(target){
			 if($(target).hasClass("rh-res-file-prevSpan")){
				break;
			 }
			 target=target.parentElement ? target.parentElement : target.parentNode;
		 }
		 if(!target){//close
			Search._hidePreviewContent();
		 }
	});
	$(window).on("scroll",function(event){
	 		var winOffset=jQuery(this).scrollTop();
	 		if(winOffset-105<0){
				$(".rh-res-preview:visible").css("top", 105-winOffset);
			}
			else{
				$(".rh-res-preview:visible").css("top", 0);
			}
		});
};
Search.deleteIndex = function(doc_id) {
	var frameHei = GLOBAL.getDefaultFrameHei();
	$.ajax({
		url : '/SY_PLUG_SEARCH.delete.do',
		type : 'POST',
		data : {
			_PK_ : doc_id
		},
		success : function(outBeanStr) {
			var outBean = StrToJson(outBeanStr)._DATA_;
		}
	});
};

// 选择单位触发方法
Search.getOrg = function(event) {
	jQuery("#rh-select-cmpy").empty()
	var options = {
		"itemCode" : "rh-select-cmpy",
		"config" : "SY_ORG_CMPY,{'extendDicSetting':{'rhexpand':false,'cascadecheck':true},'TYPE':'multi','rtnNullFlag':true}",
		"parHandler" : null,
		"hide" : "explode",
		"show" : "blind",
		replaceCallBack : function(id, value) {
			jQuery("#rh-select-cmpy-id").val(id);
			jQuery("#rh-select-cmpy").val(value);
			// search...
			Search.searchByMultiCmpy(id);
		}
	};
	var dictView = new rh.vi.rhDictTreeView(options);
	dictView.show(event, [ 170, 150 ]);
	var id = jQuery("#rh-select-cmpy-id").val();
	jQuery(".ui-dialog-title").text("请选择单位");

	var array = id.split(",");
	jQuery.each(array, function(index, n) {
		dictView.tree.checkNode(n);
		dictView.tree.expandParent(n);
	});

	return false;
};

// 选择服务(类别)触发方法
Search.getServ = function(event) {
	jQuery("#rh-select-serv").empty()
	var options = {
		"itemCode" : "rh-select-serv",
		"config" : "SY_SERV_SEARCH,{'extendDicSetting':{'rhexpand':true},'TYPE':'multi','extendWhere':' AND SERV_SEARCH_FLAG=1','rtnNullFlag':true}",
		"parHandler" : null,
		"hide" : "explode",
		"show" : "blind",
		replaceCallBack : function(id, value) {
			jQuery("#rh-select-serv-id").val(id);
			jQuery("#rh-select-serv").val(value);
			// search...
			Search.searchByMultiServ(id);
		}
	};
	var dictView = new rh.vi.rhDictTreeView(options);
	dictView.show(event, [ 170, 150 ]);
	var id = jQuery("#rh-select-serv-id").val();
	jQuery(".ui-dialog-title").text("请选择类别");

	var array = id.split(",");
	jQuery.each(array, function(index, n) {
		dictView.tree.checkNode(n);
		dictView.tree.expandParent(n);
	});

	return false;
};
Search.setServ = function(id, value) {
	if (null == value || "" == value) {
		var list = id.split(",");
		jQuery.each(list, function(index, n) {
			var name = getServiceName(n);
			if (name != "") {
				value += name + ",";
			}
		});
	}
	if (endsWith(value, ",")) {
		value = value.substring(0, value.length - 1);
	}
	jQuery("#rh-select-serv-id").val(id);
	jQuery("#rh-select-serv").val(value);
};

Search.clearServ = function() {
	jQuery("#rh-select-serv-id").val("");
	jQuery("#rh-select-serv").val("");
	Search.updateFilter("service");
};

Search.setOrg = function(id, value) {
	if (null == value || "" == value) {
		var list = id.split(",");
		jQuery.each(list, function(index, n) {
			var name = FireFly.getCmpyName(n);
			if (name != "" && name !="unknow") {
				value += name + ",";
			}
		});
	}
	if (endsWith(value, ",")) {
		value = value.substring(0, value.length - 1);
	}
	jQuery("#rh-select-cmpy-id").val(id);
	jQuery("#rh-select-cmpy").val(value);
};

Search.clearOrg = function() {
	jQuery("#rh-select-cmpy-id").val("");
	jQuery("#rh-select-cmpy").val("");
	Search.updateFilter("company");
};

// relevant search
Search.loadrelevantSearch = function() {
	var source = document.getElementById("relevantSearchData").value;
	// decode
	source = source.replace(/__@1_/g, "'");
	var relevantSearch = StrToJson(source);
	jQuery
			.each(
					relevantSearch,
					function(index, n) {
						var queryTitle = n.title;
						var dataServ = n.service;
						var query = n.query;
						var type = n.type;
						var output = n.output;
						var testhtml = "<p style='margin-left:1em'><font size='-1'><a onmousedown=\"return c({'fm':'alwk','title':this.innerHTML,'url':this.href,'p1':al_c(this),'p2':1});\" target='_blank' href='http://wenku.baidu.com/view/f0504e134431b90d6c85c748.html'><em>相关搜索</em>1.<span class='doc_class'>txt</span></a> <font color='#666666'>3页 浏览:44次</font><br><a onmousedown=\"return c({'fm':'alwk','title':this.innerHTML,'url':this.href,'p1':al_c(this),'p2':2});\" target='_blank' href='http://wenku.baidu.com/view/6d8c2d7b168884868762d692.html'><em>相关搜索</em>示范教程:.<span class='doc_class'>doc</span></a> <font color='#666666'>4页 浏览:1214次</font><br><a onmousedown=\"return c({'fm':'alwk','title':this.innerHTML,'url':this.href,'p1':al_c(this),'p2':3});\" target='_blank' href='http://wenku.baidu.com/view/ca2d1f8f6529647d27285229.html'>戏说<em>搜索</em>引擎<em>相关搜索</em>.<span class='doc_class'>doc</span></a> <font color='#666666'>4页 浏览:7次</font><br><a onmousedown=\"return c({'fm':'alwk','title':this.innerHTML,'url':this.href,'p1':al_c(this),'p2':4})\" class='c' target='_blank' href='http://wenku.baidu.com/search?word=%E7%9B%B8%E5%85%B3%E6%90%9C%E7%B4%A2&amp;ie=utf-8&amp;lm=0&amp;od=0'>更多文库相关文档&gt;&gt;</a></font></p>";
						document.getElementById(output).innerHTML = "";
						$
								.ajax({
									url : '/SY_PLUG_SEARCH.relevantSearch.do',
									type : 'POST',
									data : {
										QUERY : query,
										SERVICE : dataServ,
										preview_field : output,
										KEYWORDS : queryTitle
									},
									success : function(outBeanStr) {
										var outBean = StrToJson(outBeanStr)._DATA_;
										if (null != outBean
												&& 0 < outBean.length) {
											var result = "<p style='margin-left:1em'><font size='-1'>";
											jQuery
													.each(
															outBean,
															function(index,
																	bean) {
																var url = bean.url;
																var title = bean.title;
																var showType = bean.type;
																if (showType != "more") {
																	var tags = url
																			.split(":");
																	var servId = "unknow";
																	var dataId = "unknow";

																	if (tags.length > 2) {
																		servId = tags[1];
																		dataId = tags[2];
																	}
																	var servName = getServiceName(servId);

																	result += "<a href=\"javascript:var opts={'url':'"
																			+ servId
																			+ ".card.do?pkCode="
																			+ dataId
																			+ "','tTitle':'"
																			+ title
																			+ "','menuFlag':3};Tab.open(opts);\">"
																			+ title
																			+ "</a><font color='#666666'> "
																			+ servName
																			+ "</font><br> ";
																} else {
																	// result +=
																	// "<a
																	// href=\"javascript:var
																	// opts={'url':\""
																	// + url +
																	// "\",'tTitle':'"
																	// + title +
																	// "&gt;&gt;','menuFlag':3};Tab.open(opts);\">"
																	// + title +
																	// "</a><br>";
																	result += "<a style='color: #7777CC;' href=\""
																			+ url
																			+ "\">"
																			+ title
																			+ "&gt;&gt;</a><br>";
																}

															});
											// if (outBean.length > 2) {
											// result += "<a style='color:
											// #7777CC;'
											// href=\"/SY_PLUG_SEARCH.query.do?data={'KEYWORDS':'"
											// + queryTitle +
											// "'}\">更多相关数据&gt;&gt;</a>";
											// }
											result += "</font></p>";

											document.getElementById(output).innerHTML = result;
											Tab.setFrameHei();
										}
									}
								});

					});
};

Search.getInputKeyowrds = function() {
	// get keywords
	var keywords = document.getElementById("putKeyWords").value;
	var keywords2 = document.getElementById("putKeyWords2").value;
	if (2 == currentKeywordIndex) {
		return keywords2;
	} else {
		return keywords
	}
};

// +---------------------------------------------------
// | 获取当前日期
// +---------------------------------------------------
function GetTimeStr(flag, myDate) {
	var currentTime = "";
	if (null == myDate) {
		myDate = new Date();
	}
	var year = myDate.getFullYear();
	var month = parseInt(myDate.getMonth().toString()) + 1; // month是从0开始计数的，因此要
	// + 1
	if (month < 10) {
		month = "0" + month.toString();
	}
	var date = myDate.getDate();
	if (date < 10) {
		date = "0" + date.toString();
	}
	var hour = myDate.getHours();
	if (hour < 10) {
		hour = "0" + hour.toString();
	}
	var minute = myDate.getMinutes();
	if (minute < 10) {
		minute = "0" + minute.toString();
	}
	var second = myDate.getSeconds();
	if (second < 10) {
		second = "0" + second.toString();
	}
	if (flag == "0") {
		currentTime = year.toString() + month.toString() + date.toString()
				+ hour.toString() + minute.toString() + second.toString(); // 返回时间的数字组合
	} else if (flag == "1") {
		currentTime = year.toString() + "-" + month.toString() + "-"
				+ date.toString() + " " + hour.toString() + ":"
				+ minute.toString() + ":" + second.toString(); // 以时间格式返回
	}
	return currentTime;
}

// +---------------------------------------------------
// | 日期计算 date subtraction
// +---------------------------------------------------
Date.prototype.DateSub = function(strInterval, Number) {
	var dtTmp = new Date();
	switch (strInterval) {
	case 's':
		return new Date(Date.parse(dtTmp) - (1000 * Number));
	case 'n':
		return new Date(Date.parse(dtTmp) - (60000 * Number));
	case 'h':
		return new Date(Date.parse(dtTmp) - (3600000 * Number));
	case 'd':
		return new Date(Date.parse(dtTmp) - (86400000 * Number));
	case 'w':
		return new Date(Date.parse(dtTmp) - ((86400000 * 7) * Number));
	case 'q':
		return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) - Number * 3,
				dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp
						.getSeconds());
	case 'm':
		return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) - Number, dtTmp
				.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp
				.getSeconds());
	case 'y':
		return new Date((dtTmp.getFullYear() - Number), dtTmp.getMonth(), dtTmp
				.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp
				.getSeconds());
	}
}

/**
 * 获取服务的名称
 * 
 * @param sId
 *            服务ID
 */
function getServiceName(sId) {
	var name = getSearchableServName(sId);
	if (name == "") {
		name = FireFly.getServName(sId);
	}
	return name;
}

/**
 * 获取可搜索服务的名称
 * 
 * @param sId
 *            服务ID
 */
function getSearchableServName(sId) {
	var returnValue = "";
	// var res = FireFly.getCache("SY_SERV_SEARCH", FireFly.dictData)[0];
	// var res = FireFly.getDict("SY_SERV_SEARCH")[0].CHILD;

	var res = FireFly.getDict("SY_SERV_SEARCH");
	jQuery.each(res, function(i, n) {
		var id = n.ID;
		var name = n.NAME;
		if (id == sId) {
			returnValue = name;
		}
	});

	// var len = res.CHILD.length;
	// var i = 0;
	// for (i = 0; i < len; i++) {
	// if (res.CHILD[i].ID == sId) {
	// returnValue = res.CHILD[i].NAME;
	// break;
	// }
	// }
	return returnValue;
}

// +---------------------------------------------------
// | is ends with ?
// +---------------------------------------------------
function endsWith(s1, s2) {
	if (s1.length < s2.length)
		return false;
	if (s1 == s2)
		return true;
	if (s1.substring(s1.length - s2.length) == s2)
		return true;
	return false;
}

function startsWith(s1, s2) {
	if (s1.length < s2.length)
		return false;
	if (s1 == s2)
		return true;
	if (s1.substring(0, s2.length) == s2)
		return true;
	return false;
}
