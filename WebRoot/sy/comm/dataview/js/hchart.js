//设置HighCharts的语言为中文
Highcharts.setOptions({
	lang: {
		loading: '正在加载...',
		months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月','八月', '九月', '十月', '十一月', '十二月'],
		shortMonths: ['一月', '二月', '三月', '四月', '五月', '六月', '七月','八月', '九月', '十月', '十一月', '十二月'],
		weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
		decimalPoint: '.',
		numericSymbols: ['k', 'M', 'G', 'T', 'P', 'E'], // SI prefixes used in axis labels
		resetZoom: '恢复原始图表',
		resetZoomTitle: '恢复原始图表',
		thousandsSep: ','
	},
	global: {
		//设定按当前时区转换时间,不使用国际标准时
		useUTC: false
	}
});
/**
 * 图表
 */
var HChart = {};
/**
 * 渲染图表
 * @param tarid 图表渲染容器Id
 * @param data 数据
 * @param width 宽 默认400
 * @param height 高 默认300
 */
HChart.render = function(tarid, data, width, height) {
	var chartType = data.VIEW_TYPE;
	//表格显示特殊处理
	if(chartType == 'table'){
		HChart.renderTable(data,tarid);
	} else{
		//margin-right设定为20px，防止出现滚动条遮挡部分图表
		jQuery("#"+tarid).css({"margin":"0px 20px 0px 5px"})
		//获取highCharts默认配置
		var defaultOptions = HChart.getDefaultOptions(data);
		//根据数据拼装highcharts配置
		var options = HChart.createOptions(defaultOptions,data);
		//设定渲染位置
		options["chart"]["renderTo"]=tarid;
		//判断主题风格如果不是默认，加载对应的主题
		if(data.THEME){
			loadJS("/sy/comm/dataview/js/themes/"+data.THEME+".js");
		}
		var chart = new Highcharts.Chart(options);
		//判断是否显示表格
		if(data.SHOW_TABLE == UIConst.STR_YES){
			HChart.renderTable(data,tarid);
		}
		return chart;
	}
};
/**
 * 获取HighCharts的默认配置
 * @param data 数据
 * @returns
 */
HChart.getDefaultOptions = function(data) {
    return {
    	//图形配置，渲染信息等
    	chart: {
    		height:300
    	},
        //名片
        credits: {
        	enabled: false
        },
        //标题
        title: {
    		"text": ""
    	},
    	//X轴配置
        //TODO 此处默认给定label一个0.1的转角，暂时解决tab之间切换时引起的图表变形的问题，后面需解决此问题
        xAxis: {
        	   'labels':{'rotation':0.1}
        },
        //Y轴配置
        yAxis: [],
        //图例配置
        legend: {
        	enabled: true
        },
        //系列或point(point针对饼图)的鼠标悬停提示
        tooltip: {
        	enabled : true,
        	xDateFormat : "%Y-%m-%d %A"
        },
        /*  
            [数据点]配置信息
            The plotOptions is a wrapper object for config objects for each series type. 
	        The config objects for each series can also be overridden for each series item as given in the series array.
	        Configuration options for the series are given in three levels. 
	        #Options for all series in a chart are given in the plotOptions.series object. 
	        #Then options for all series of a specific type are given in the plotOptions of that type, for example plotOptions.line. 
	        #Next, options for one single series are given in the series array.
        */
        plotOptions: {
        	//所有系列的默认
            series:{
            	//数据标签
                dataLabels: {
                    enabled: true
                }
            },
        	//线图
        	line: {
                dataLabels: {
                    enabled: true
                },
                //是否允许鼠标tooltips和单击事件
                enableMouseTracking: true
            },
            //栅图
            bar: {
                dataLabels: {
                    enabled: true
                }
            },
        	//饼图
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                //数据标签
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
                    formatter: function() {
                        return '<b>'+ this.point.name +'</b>: '+ this.percentage.toFixed(2) +' %';
                    }
                },
                showInLegend: true,
                tooltip:{
                	headerFormat:'',
                	pointFormat:'<span style="color:{series.color}">{point.name}</span>: <b>{point.y}</b>'
                }
            }
        },
        //数据系列
        series: []
    }
};
/**
 * 根据数据拼装highcharts配置
 * @param defaultOptions 默认配置
 * @param data 数据
 * @returns
 */
HChart.createOptions = function(defaultOptions,data) {
	var config = data.SY_COMM_DATA_VIEW_ITEM;
	//X轴配置
	var configX = [];
	//Y轴配置
	var configY = [];
	for(var i=0;i<config.length;i++){
		if(config[i].ITEM_TYPE == 'X'){
			configX.push(config[i]);
		}else if(config[i].ITEM_TYPE == 'Y' && config[i].ITEM_VIEW_TYPE != 'hide'){
			//判断是Y轴，并且显示类型不是“不显示”
			configY.push(config[i]);
		}
	}
	//对X和Y配置进行简单判断
	if(configX.length == 0 || configY.length == 0){
		alert('未配置X轴或Y轴信息，图表不能正常显示，请确认！');
		return;
	}
	//图形
	jQuery.extend(true,defaultOptions, {"chart":HChart.createChart(data)});
	//标题
	jQuery.extend(true,defaultOptions, {"title":HChart.createTitle(data)});
	//分类
	var categories = HChart.createCategories(data,configX);
	//X轴
	jQuery.extend(true,defaultOptions, {"xAxis":HChart.createXAxis(data,configX,categories)});
	//Y轴
	jQuery.extend(true,defaultOptions, {"yAxis":HChart.createYAxis(data,configY)});
	//数据系列
	jQuery.extend(true,defaultOptions, {"series":HChart.createSeries(data,categories,configX,configY)});
	//附加highCharts的额外配置,通过DataView的DV_CONFIG配置
	HChart.createExtendConfig(defaultOptions,data.DV_CONFIG);
    return defaultOptions;
};
/**
 * 组装chart属性
 */
HChart.createChart = function(data) {
	var chart = {
		"type": data.VIEW_TYPE
	};
    return chart;
};
/**
 * 组装标题属性
 */
HChart.createTitle = function(data) {
	var title = {
		"text": data.DV_NAME
	};
    return title;
};
/**
 * 
 */
HChart.createCategories = function(data,configX) {
	var categories = [];
	var dataList = data.data;
	//category SY_COMM_DATA_VIEW_ITEM[0]
	var categoryKey = configX[0].ITEM_CODE;
	var category = null;
    for (var i = 0; i < dataList.length; i++) {
    	category = dataList[i][categoryKey];
    	//如果未在类别数组中找到，则添加
    	if(jQuery.inArray(category,categories)==-1){
    		categories.push(dataList[i][categoryKey]);
    	}
    }
    return categories;
};
/**
 * 组装X轴属性
 */
HChart.createXAxis = function(data,configX,categories){
	var xAxis = {};
	var chartType = data.VIEW_TYPE;
	if(chartType=='datetime'){
		xAxis["type"]="datetime";
		//xAxis["dateTimeLabelFormats"]="datetime";
	}else{
		xAxis["categories"]=categories;
	}
	//附加X轴的额外配置
	HChart.createExtendConfig(xAxis,configX[0].ITEM_CONFIG);
	return xAxis;
};
/**
 * 组装Y轴属性
 */
HChart.createYAxis = function(data,configY){
	var yAxis = [];
	var yAxisItem = null;
	for(var i=0;i<configY.length;i++){
		yAxisItem = {
	        allowDecimals: true,
	        title: {
	            text: configY[i].ITEM_NAME
	        },
	        labels: {
                formatter: function() {
                    return this.value;
                }
            },
	        opposite:(i==0 ? false : true)
	    };
		//附加Y轴的额外配置
		HChart.createExtendConfig(yAxisItem,configY[i].ITEM_CONFIG);
		yAxis.push(yAxisItem);
	}
	return yAxis;
};
/**
 * 组装系列
 * @param data 数据
 * @param categories 分类
 */
HChart.createSeries = function(data,categories,configX,configY) {
	var series = [];
	var chartType = data.VIEW_TYPE;
	var config = data.SY_COMM_DATA_VIEW_ITEM;
	var dataList = data.data;
	var seriesItem = null;
	//饼图数据结构特殊，所以此处单独处理
	if(chartType == 'pie'){
		seriesItem = {type: 'pie',data:[]};
		var categoryKey = configX[0].ITEM_CODE;
    	var valueKey = configY[0].ITEM_CODE;
    	var dataItem = null;
    	for (var i = 0; i < dataList.length; i++) {
    		dataItem = {};
    		dataItem["name"] = dataList[i][categoryKey];
    		dataItem["y"] = HChart.parseToFloat(dataList[i][valueKey]);
        	//seriesItem["sliced"] = true;
            //seriesItem["selected"] = true;
        	seriesItem["data"].push(dataItem);
        }
    	series.push(seriesItem);
    //时间图，特殊处理
	}else if(chartType == 'datetime'){
		//时间轴key值
		var timeKey = configX[0].ITEM_CODE;
		for(var i=0;i<configY.length;i++){
			seriesItem = {"data":[],"yAxis":i};
	    	var valueKey = configY[i].ITEM_CODE;
	    	seriesItem["name"] = configY[i].ITEM_NAME;
	    	//系列的展示类型(柱状图或线图)
			var viewType = configY[i].ITEM_VIEW_TYPE;
	    	if(viewType){
    			seriesItem["type"]=viewType;
    		}
	    	var dataObj = null;
	    	for (var j = 0; j < dataList.length; j++) {
	    		dataObj = {};
	    		dataObj["x"] = HChart.parseToFloat(dataList[j][timeKey]);
				dataObj["y"] = HChart.parseToFloat(dataList[j][valueKey]);
	    		seriesItem.data.push(dataObj);
	        }
	    	series.push(seriesItem);
		}
	}else {
		var seriesNames = [];
		var categoryKey = configX[0].ITEM_CODE;
		//多X轴处理，目前仅支持到双X轴
		if(configX.length >= 2){
			var seriesNameKey = configX[1].ITEM_CODE;
	    	seriesNames = HChart.getSeriesNames(data,seriesNameKey);
	    	//获取所有系列对应的各分类值
	    	for(var k=0;k<configY.length;k++){
				var valueKey = configY[k].ITEM_CODE;
				var yAxisName = configY[k].ITEM_NAME;
				//系列的展示类型(柱状图或线图)
				var viewType = configY[k].ITEM_VIEW_TYPE;
		    	for (var i = 0; i < seriesNames.length; i++) {
		    		seriesItem = {"data":[],"yAxis":k};
		    		var seriesName = seriesNames[i];
		    		seriesItem["name"]=seriesName+"-"+yAxisName;
		    		if(viewType){
		    			seriesItem["type"]=viewType;
		    		}
		    		//遍历分类，获取系列在每个分类下的值
		    		for(var j=0;j<categories.length;j++){
		    			var categoryValue = categories[j];
		    			var dataObj = null;
			    		for (var m = 0; m < dataList.length; m++) {
			    			if(dataList[m][categoryKey]==categoryValue && dataList[m][seriesNameKey] == seriesName){
			    				dataObj = {};
			    				dataObj["y"] = HChart.parseToFloat(dataList[m][valueKey]);
			    				break;
			    			}
				        }
			    		//将系列对应的分类数据放入data数组
			    		seriesItem.data.push(dataObj);
		    		}
		    		//将各个系列放入数组
		    		series.push(seriesItem);
		    	}
	        }
		}else{
			//处理单X轴
			for(var i=0;i<configY.length;i++){
				seriesItem = {"data":[],"yAxis":i};
		    	var valueKey = configY[i].ITEM_CODE;
		    	seriesItem["name"] = configY[i].ITEM_NAME;
		    	//系列的展示类型(柱状图或线图)
				var viewType = configY[i].ITEM_VIEW_TYPE;
		    	if(viewType){
	    			seriesItem["type"]=viewType;
	    		}
		    	for (var j = 0; j < dataList.length; j++) {
		    		seriesItem.data.push(HChart.parseToFloat(dataList[j][valueKey]));
		        }
		    	series.push(seriesItem);
			}
		}
	}
	return series;
};
/**
 * 获取所有的系列名称
 */
HChart.getSeriesNames = function(data,seriesNameKey){
	var dataList = data.data;
	var seriesNames = [];
	for (var i = 0; i < dataList.length; i++) {
		seriesItem = {"data":[]};
		var seriesName = dataList[i][seriesNameKey];
		if(jQuery.inArray(seriesName,seriesNames) == -1){
			seriesItem["name"] = seriesName;
			seriesNames.push(seriesName);
		}else{
			continue;
		}
	}
	return seriesNames;
}
/**
 * 附加highCharts的额外配置
 * 通过DataView的DV_CONFIG配置
 */
HChart.createExtendConfig = function(options,config) {
	if(config){
		try {
			var extendConfig = eval('('+config+')');
			jQuery.extend(true,options, extendConfig);
	    }catch ( ex ) {
	    	//捕获异常，防止输入非法json字符串导致的错误
	    }
	}
	return options;
}
/**
 * 将value转化为浮点数
 */
HChart.parseToFloat = function(value){
	return value ? parseFloat(value) : 0;
}
/**
 * 渲染表格
 */
HChart.renderTable = function(data,tarid){
	var tableCon = jQuery("<div></div>").css({"margin":"5px"});
	tableCon.insertAfter(jQuery("#"+tarid));
	var listData = HChart.assembleGridListData(data);
	var mainData = {};
	//设定mainData.ITEMS和listData._COLS_相同，只需要他们共同的ITEM_CODE
	mainData["ITEMS"] = listData._COLS_;
	var temp = {"id":"chartGrid","mainData":mainData,"parHandler":null,"pCon":jQuery(tableCon),
			"batchFlag":false,"pkHide":true,"sortGridFlag":false,"buildPageFlag":false,"byIdFlag":false};
	temp["listData"] = listData;
	var grid = UIFactory.create(rh.ui.grid,temp);
	grid.render();
	//隐藏复选框
	grid.hideCheckBoxColum();
}
/**
 * 根据Grid需要的数组格式组装listData
 */
HChart.assembleGridListData = function(data){
	//初始化listData
	var listData = {"_COLS_":[],"_DATA_":[]};
	var itemconfig = data.SY_COMM_DATA_VIEW_ITEM;
	//合计行值
	var sumDataObj = {};
	//组装_COLS_
	jQuery.each(itemconfig,function(i,n) {
		//判断是否需要在表格中显示，并且是Y轴，只对Y轴生效
		if(n.ITEM_TYPE == 'Y' && n.TABLE_SHOW == UIConst.STR_NO){
			return true;
		}
		var columnObj = {};
		columnObj["ITEM_NAME"] = n.ITEM_NAME;
		columnObj["ITEM_CODE"] = n.ITEM_CODE;
		//显示位置
		columnObj["ITEM_LIST_ALIGN"] = n.ITEM_ALIGN;
		//判断是否需要合计，并且是Y轴，只有Y轴才能合计
		if(n.ITEM_TYPE == 'Y' && n.SHOW_SUM == UIConst.STR_YES){
			//设置合计值为null
			sumDataObj[n.ITEM_CODE] = null;
		}
		listData._COLS_.push(columnObj);
	});
	//组装_DATA_
	var dataList = data.data;
	var timeItemCode = null;
	if(data.VIEW_TYPE == 'datetime'){
		timeItemCode = itemconfig[0].ITEM_CODE;
	}
	jQuery.each(dataList,function(i,n) {
		var dataObj = {};
		jQuery.extend(true,dataObj,n);
		//如果存在时间轴，将时间轴对应的毫秒转换为日期字符串
		if(timeItemCode){
			dataObj[timeItemCode] = HChart.parseDateStr(parseInt(dataObj[timeItemCode]));
		}
		listData._DATA_.push(dataObj);
		
		//循环需要合计的列，累加合计值
		jQuery.each(sumDataObj,function(key,value) {
			sumDataObj[key] = parseFloat((value ? value : 0)) + parseFloat(dataObj[key]) ;
		});
	});
	//如果存在需要合计的列，则增加合计行
	if(!jQuery.isEmptyObject(sumDataObj)){
		sumDataObj[itemconfig[0].ITEM_CODE] = "合计";
		listData._DATA_.push(sumDataObj);
		//合计行样式处理，全部字体加粗
		jQuery.each(sumDataObj,function(key,value) {
			sumDataObj[key] = "<span style='font-weight: bold;'>"+value+"</span>" ;
		});
	}
	//grid需要_PAGE_的SHOWNUM和NOWPAGE计算行号，此处给定一个默认值
	listData["_PAGE_"] = {"SHOWNUM":1000,"NOWPAGE":1};
	return listData;
}
/**
 * 根据UTC毫秒数转换成日期字符串，格式“yyyy-MM-dd”
 */
HChart.parseDateStr = function(utcMs){
	var date = new Date(utcMs);
	var month = date.getMonth()+1;
	month = month < 10 ? "0"+month : month;
	var day = date.getDate();
	day = day < 10 ? "0"+day : day;
	return date.getFullYear()+'-'+month+'-'+day;
}