<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.rh.core.base.Context" %>

<%@ page import="com.rh.core.comm.workday.WorkDay"%>
<%@ page import="com.rh.core.util.DateUtils"%>
<%@ page import="com.rh.core.serv.util.ServUtils"%>
<%@ include file= "/sy/base/view/inHeader.jsp" %>

<style type="text/css">
<!--
.weekend {
	background-color: #F0F0E8;
}

.weekend_border {
	background-color: #F0F0E8;
	border: 1px solid #999999;
}

.workday {
	background-color: #bbFF99;
}

.workday_border {
	background-color: #bbFF99;
	border: 1px solid #99cc66;
}
.biaotizi {
    font-size: 16px; font-weight: bold; color: #ff0000
}
.biaotizi1 {
    font-size: 24px; font-family: 方正小标宋简体; color: #ff0000
}
.tr_bai_shenlan {
    height: 25;
	background-color: #008E56; 
	FONT-SIZE: 12px; 
	FONT-WEIGHT: normal; 
	COLOR: #ffffff;
	font-weight: bold
}
.border_lanhui {
    background-color: #04B46E;
}
-->
</style>

<%
    Bean paramBean = Context.getParamBean();
    
	String strThisMonth = paramBean.getStr("MONTH");
	String strThisYear = paramBean.getStr("YEAR");
	int thisMonth = DateUtils.getMonth();

	if(strThisMonth!=null && strThisMonth.length() > 0){
		thisMonth = Integer.parseInt(strThisMonth);
	}
	
	int thisYear = DateUtils.getYear();

	if(strThisYear!=null && strThisYear.length()>0){
		thisYear = Integer.parseInt(strThisYear);
	}
    
	Bean servDef = ServUtils.getServDef("SY_COMM_WORK_DAY");
    String pageTitle = servDef.getStr("SERV_NAME");
%>

<script language="JavaScript">
	function changeType(aDay,flag){
		var strDate = jQuery("#selYear").val() + "-" + convertFormat(jQuery("#selMonth").val()) + "-" + convertFormat(aDay); 
		var strInfo = "是否确认将“" + strDate + "”改成";
		if(flag==2){
			strInfo += "工作日？";
		}else{
			strInfo += "非工作日？";
		}

		if(confirm(strInfo)){
		    var chgObj = {};
			chgObj.DATE = strDate;
		    chgObj.DAY_FLAG = flag;
		
			var resultData = FireFly.doAct("SY_COMM_WORK_DAY", "changeDateFlag", chgObj);
			if (resultData[UIConst.RTN_MSG]
				&& resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
			    alert("已经成功改变 " + strDate + "的类型");
				changeOccur();
			} else {
				Tip.show("返回错误，请检查！" + JsonToStr(resultData), true);
			}
		}
		return;
	}

	function convertFormat(arg){
		if(arg < 10){
			return "0" + arg;
		}else{
			return arg;
		}
	}
	
	function initWorkDay() {
	    var reqObj = {};
		reqObj.YEAR = jQuery("#selYear").val();
		
        var resultData = FireFly.doAct("SY_COMM_WORK_DAY", "initWorkDay", reqObj);
		if (resultData[UIConst.RTN_MSG]
				&& resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
			alert("已经成功初始化 " + reqObj.YEAR + "年度工作日");
		} else {
			Tip.show("返回错误，请检查！" + JsonToStr(resultData), true);
		}
	}
	
	function changeOccur() {
		var urlStr = "SY_COMM_WORK_DAY.show.do?YEAR=" + jQuery("#selYear").val() + "&MONTH=" + jQuery("#selMonth").val();
		
		window.location.href = urlStr;
	}
</script>

<%
	WorkDay workDay = new WorkDay(thisYear,thisMonth,0);
	//构造这个月第一天的日期对象
	String tempDate = thisYear + "-" + convert(thisMonth) + "-01";

	//这个月的第一天是星期几，表示日期的开始位置
	int beginPostion = workDay.getDayOfWeek(tempDate) -1;
	
	//这个月共有多少天
	int dayCount  = DateUtils.getDayOfMonth(thisMonth,thisYear);
	dayCount = dayCount + beginPostion;

	//计算本月有几个星期
	int rowSize =0 ;
	rowSize = dayCount/7;
	
	if(dayCount%7!=0){
		rowSize++;
	}
%>
<table width="100%" border=0 >
<tr>
    <td align="center" class="biaotizi1"><%=pageTitle%>&nbsp;&nbsp;（<%=thisYear%>年<%=thisMonth%>月）</td>
</tr>
<form name="workdayForm" method="post">
<tr>
    <td align="right">&nbsp;
		<select name="selYear" id="selYear" onchange="javascript:changeOccur();">
			<option value="<%=DateUtils.getYear() -1%>" <%if((DateUtils.getYear() -1) == thisYear){out.print("selected");}%>><%=DateUtils.getYear() -1%>年</option>
			<option value="<%=DateUtils.getYear()%>" <%if((DateUtils.getYear()) == thisYear){out.print("selected");}%>><%=DateUtils.getYear()%>年</option>
			<option value="<%=DateUtils.getYear() + 1%>" <%if((DateUtils.getYear() +1) == thisYear){out.print("selected");}%>><%=DateUtils.getYear() + 1%>年</option>
		</select>&nbsp;

		<select name="selMonth" id="selMonth" onchange="javascript:changeOccur()">
        <%                
			for(int i=1;i<=12;i++){
                                            
				String strTemp = "<option value=\""+ i +"\"";

				if(i==thisMonth){
					strTemp = strTemp + " selected ";
				}
									
				strTemp = strTemp + ">" + i + "月 </option>";

				out.println(strTemp);
			}
		%>
		</select>
		<input name="btn_ok" type="button" class="button" value="初始化此年度工作日信息" onclick="initWorkDay()">
	</td>
</tr>
</form>
</table>

<table id=mainTable width=100% border=0 cellspacing=1 cellpadding=0 class="border_lanhui" onmouseover="this.style.cursor='hand'">
	<tr class='tr_bai_shenlan' align=center height=40><td>周日</td><td>周一</td>
	<td>周二</td><td>周三</td><td>周四</td><td>周五</td><td>周六</td></tr>

<%
	int num = 1;
	for(int i=0;i<rowSize;i++){
%>
		<tr align="right"  height="60" >
<%
		for(int j=0;j<7;j++){
			String temp ="";
			//只有在日期的输入范围内才进来
			if(num > beginPostion && num <= dayCount){
				int flag = 1;
				String aDate = thisYear + "-" + convert(thisMonth) + "-" + convert(num-beginPostion);
				if(!workDay.isAvailableWorkDay(aDate)){
					temp += " class=weekend ";
					flag = 2;
				}else{
					temp += " class=workday ";
					flag = 1;
				}
				temp += " onClick=\"javaScript:changeType(" + (num-beginPostion)+ "," + flag + ")\"" ;
				temp += " >" + (num-beginPostion);
			}else{
				//if(j==0 || j==6){
					temp += " class=weekend ";
				//}
				temp += ">&nbsp;";
			}

			out.println("<td  align='center' " + temp + "</td>");

			num++;
		}
%>
		</tr>
<%
	}
%>

</table>
<br>
<table width=300 height="30" border=0 cellspacing=1 cellpadding=0>
	<tr>
		<td class="biaotizi" width="60">图例:</td>
		<td class="workday_border" width="100" align="right" >&nbsp;&nbsp;上班&nbsp;</td>
		<td class="weekend_border" width="100" align="right">&nbsp;&nbsp;休息&nbsp;</td>
		<td >&nbsp;</td>
	</tr>
</table>
<br>
<%!	
    private String convert(int i) {
        if (i < 10) {
            return "0" + String.valueOf(i);
        } else {
            return String.valueOf(i);
        }
    }
%>
