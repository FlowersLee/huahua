    /**
     * 计算本周的第一天日期
     */
	function showWeekFirstDay(){
        var Nowdate = new Date();
        var day = Nowdate.getDay();
        if(day==0){
        	day=7;
        }
        var WeekFirstDay = new Date(Nowdate - (day - 1) * 86400000);
        var M = Number(WeekFirstDay.getMonth()) + 1;
        if(M<10){
        	M="0"+M;
        }
        var d = WeekFirstDay.getDate();
        if(d<10){
        	d = "0"+d;
        }
        return WeekFirstDay.getFullYear() + "-" + M + "-" + d;
    }
	
	/**
	 * 计算本周的第七天日期
	 */
    function showWeekLastDay(){
        var Nowdate = new Date();
        var day = Nowdate.getDay();
        if(day==0){
        	day=7;
        }
        var WeekFirstDay = new Date(Nowdate.valueOf() - (day - 1) * 86400000);
        var WeekLastDay = new Date((WeekFirstDay.valueOf() / 1000 + 6 * 86400) * 1000);
        var M = Number(WeekLastDay.getMonth()) + 1;
        if(M<10){
        	M="0"+M;
        }
        var d = WeekLastDay.getDate();
        if(d<10){
        	d = "0"+d;
        }
        return WeekLastDay.getFullYear() + "-" + M + "-" + d;
    }

    /**
     * 计算下一周期的日期
     * preDay 当前天
     * days 周期（天）
     */
	function getNextDate(preDay,days){
		var nextDateCal = new Date(Date.parse(preDay.replace(/-/gi,'/')));
		nextDateCal.setDate(nextDateCal.getDate()+days);
		var M = Number(nextDateCal.getMonth()) + 1;
		if(M<10){
        	M="0"+M;
        }
        var d = nextDateCal.getDate();
        if(d<10){
        	d = "0"+d;
        }
		return nextDateCal.getFullYear()+"-"+M+"-"+d;
	}
	
	/**
	 * 
	 */
	function getMyDate(date){
		date = date.substr(0,10);
		var theDate = new Date(Date.parse(date.replace(/-/gi,'/')));
		var M = Number(theDate.getMonth())+1;
		if(M<10){
        	M="0"+M;
        }
        var dt = theDate.getDate();
        if(dt<10){
        	dt = "0"+dt;
        }
		return theDate.getFullYear()+"-"+M+"-"+dt;
	}
	
	/**
	 * 
	 */
	function getWeekCN(number){
		switch(number){
		case 0: return '星期一';
		case 1: return '星期二';
		case 2: return '星期三';
		case 3: return '星期四';
		case 4: return '星期五';
		case 5: return '星期六';
		case 6: return '星期日';
		}
	}
