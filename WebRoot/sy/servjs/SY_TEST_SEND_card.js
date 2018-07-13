var _viewer = this;

var send = _viewer.getBtn("FENFA");

send.unbind("click").bind("click",function(event) {
			var servDataId = _viewer._pkCode;

			var fenfaObj = {};

			fenfaObj.SERV_ID = _viewer.servId;
			fenfaObj.DATA_ID = servDataId;
			fenfaObj.DATA_TITLE = _viewer.getItem("SEND_NAME").getValue(); + "(分发)";

			var fenFaUrl = encodeURI("SY_COMM_SEND_SHOW_CARD.showSend.do?data="
					+ JsonToStr(fenfaObj));
			var options = {
				"id" : "SY_COMM_SEND_SHOW_CARD-" + servDataId,
				"url" : fenFaUrl,
				"tTitle" : "分发",
				"menuFlag" : 4
			};
			Tab.open(options);
		});