/**
 * 图表
 */
var FChart = {};
FChart.swfPath = "/sy/util/chart/";
/**
 * 渲染图表
 * @param tarid 图表渲染容器Id
 * @param data 数据
 * @param width 宽 默认400
 * @param height 高 默认300
 */
FChart.render = function(tarid, data, width, height) {
	var chartWidth = width ? width : 400;
	var chartHeight = height ? height : 300;
	var chart = new FusionCharts(this.swfPath + this.getChartFile(data.VIEW_TYPE, this.isMultiSerial(data)), "ChartId", chartWidth, chartHeight);
	chart.addParam("wmode", "opaque");
	chart.setDataXML(FChart.toDataXML(data));		
	chart.render(tarid);
}

/**
 * 是否为多序列
 */
FChart.isMultiSerial = function(data) {
	if (data.SY_DATA_VIEW_ITEM.length == 2) {
		return false;
	} else if (data.SY_DATA_VIEW_ITEM.length > 2) {
		return true;
	}
}


/**
 * 获取图表flash文件 多序列的文件前缀为MS
 * @param chartType 图表类型
 * @param isMultiSerial 是否为多序列
 */
FChart.getChartFile = function(chartType, isMultiSerial) {
	var chartFile = "";
	var multiSerialFilePrefix = isMultiSerial === true ? "MS" : "";
	if(chartType == "bar") {
		chartFile = multiSerialFilePrefix + "Bar2D.swf";
	} else if (chartType == "line") {
		chartFile = multiSerialFilePrefix + "Line.swf";
	} else if (chartType == "column") {
		chartFile = multiSerialFilePrefix + "Column2D.swf";
	} else if (chartType == "pie") {
		chartFile = multiSerialFilePrefix + "Pie2D.swf";
	}
	
	return chartFile;
}

/**
 * 转换为FusionChartXML
 * 通过data.SY_DATA_VIEW_ITEM的长度判断是单序列还是多序列图表
 * @param data
 * @returns
 */
FChart.toDataXML = function(data) {
	var xml = new FChart.XMLWriter();
	xml.beginNode("chart");
	xml.att("baseFontSize", "12");
	xml.att("caption", data.DV_NAME);
	if (data.SY_DATA_VIEW_ITEM.length == 2) {
		FChart.toSSDataXML(xml, data);
	} else if (data.SY_DATA_VIEW_ITEM.length > 2) {
		FChart.toMSDataXML(xml, data);
	}
	
	return xml.toString();
}


/**
 * 转换为单序列的FusionChartXML
 * @param xml xml构造器
 * @param data 数据
 * @returns
 */
FChart.toSSDataXML = function(xml, data) {
    var config = data.SY_DATA_VIEW_ITEM;
	//x轴
	xml.att("xAxisName", config[0].ITEM_NAME);
	//y轴
	xml.att("yAxisName", config[1].ITEM_NAME);
	//填充数据集
	var valueKey = config[1].ITEM_CODE;
	var labelKey = config[0].ITEM_CODE;
	for (var i = 0; i < data.data.length; i++) {
		xml.beginNode("set");
		xml.att("label", eval("data.data[i]." + labelKey));
		xml.att("value", eval("data.data[i]." + valueKey));
		xml.endNode();
	}
	xml.endNode();
}


/**
 * 转换为多序列的FusionChartXML
 * @param xml xml构造器
 * @param data 数据
 * @returns
 */
FChart.toMSDataXML = function(xml, data) {
	var config = data.SY_DATA_VIEW_ITEM;
	var dataList = data.data;
	//category SY_DATA_VIEW_ITEM[0]
	var categoryKey = config[0].ITEM_CODE;
    xml.beginNode("categories");
    for (var i = 0; i < dataList.length; i++) {
	    xml.beginNode("category");
	    xml.att("label", dataList[i][categoryKey]);
	    xml.endNode();
    }
    xml.endNode();
    //dataset 从SY_DATA_VIEW_ITEM[1]开始
    for (var j = 1; j < config.length; j++) {
    	var valueKey = config[j].ITEM_CODE;
    	xml.beginNode("dataset");
    	xml.att("seriesname", config[j].ITEM_NAME);
    	for (var i = 0; i < dataList.length; i++) {
    	    xml.beginNode("set");
    	    xml.att("value", dataList[i][valueKey]);
    	    xml.endNode();
        }
    	xml.endNode();
    }
	xml.endNode();
}


/**
 * XML书写器
 */
FChart.XMLWriter = function() {
    this.XML=[];
    this.nodes=[];
    this.state="";
    this.formatXML = function(str) {
        if (str)
            return str.replace(/&/g, "&amp;").replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return ""
    }
    this.beginNode = function(name) {
        if (!name) return;
        if (this.state=="begin") this.XML.push(">");
        this.state="begin";
        this.nodes.push(name);
        this.XML.push("<"+name);
    }
    this.endNode = function() {
        if (this.state=="begin")
        {
            this.XML.push("/>");
            this.nodes.pop();
        }
        else if (this.nodes.length>0)
            this.XML.push("</"+this.nodes.pop()+">");
        this.state="";
    }
    this.att = function(name, value) {
        if (this.state!="begin" || !name) return;
        this.XML.push(" "+name+"=\""+this.formatXML(value)+"\"");
    }
    this.writeString = function(value)
    {
        if (this.state=="begin") this.XML.push(">");
        this.XML.push(this.formatXML(value));
        this.state="";
    }
    this.node = function(name, value)
    {
        if (!name) return;
        if (this.state=="begin") this.XML.push(">");
        this.XML.push((value=="" || !value)?"<"+name+"/>":"<"+name+">"+this.formatXML(value)+"</"+name+">");
        this.state="";
    }
    this.close = function() {
        while (this.nodes.length>0)
            this.endNode();
        this.state="closed";
    }
    this.toString = function(){return this.XML.join("");}
}