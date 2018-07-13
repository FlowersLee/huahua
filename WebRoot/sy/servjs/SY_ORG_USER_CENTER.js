function setZiliaoDeg(srcServ,dataId,degDiv,numSpan){
	var param = {
		"SRC_SERV_CODE":srcServ,
		"DATA_ID":dataId
	}
	FireFly.doAct("SY_COMM_COMPLETE_DATA","getDeg",param,false,true,callBack);
	function callBack(res){
		degDiv.css({'width':res.deg + '%'}).attr("title",'你的资料完整度' + res.deg + '%');
		numSpan.html(res.deg + '%').css({'left':res.deg + '%'});
		if(parseInt(res.deg) >= 33 && parseInt(res.deg) < 66){
			degDiv.css({'background-color':'orange'});
		} else if(parseInt(res.deg) >= 66){
			degDiv.css({'background-color':'green'});
		}else{
			degDiv.css({'background-color':'red'});
		}
	}
}