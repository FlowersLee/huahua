var _viewer = this;

// 给新建任务按钮绑定事件
_viewer.getBtn("create").unbind("click").bind("click", function() {
			Tab.open({
						"url" : "SY_COMM_TASK_ASSIGN.card.do",
						"tTitle" : "新建任务",
						"menuFlag" : 2,
						"params" : {
							"callBackHandler" : _viewer,
							"closeCallBackFunc" : function() {
								_viewer.refresh();
							}
						}
					});
		});
/**
 * 为列表批量完成任务绑定事件
 */
_viewer.getBtn("batchFinish").unbind("click").bind("click", function(event) {
	var pkAarry = _viewer.grid.getSelectPKCodes();
	if (jQuery.isEmptyObject(pkAarry)) {
		_viewer.listBarTipError("请选择相应记录！");
	} else {
		var res = confirm("您确定要完成所选定的任务？");
		if (res) {
			_viewer.listBarTipLoad("提交中...");
			setTimeout(function() {

						var len = pkAarry.length;
						if (len > 0) {
							for (var i = 0; i < len; i++) {
								var pk = pkAarry[i];
								// 获取当期时间
								var dateTime = System.getVar("@DATETIME@");
								FireFly.cardModify(_viewer.servId, {
											"_PK_" : pk,
											"STATE" : 1,
											"FINISH_TIME" : dateTime
										});
								// 获取CAL_ID
								var calID = _viewer.grid.getRowItemValue(
										pkCode, "CAL_ID");
								var datas = {};
								datas["_NOPAGE_"] = true;
								datas["_searchWhere"] = " and CAL_ID='" + calID
										+ "'";
								// 查询所有人完成该任务的状态
								var taskList = FireFly.getListData(
										"SY_COMM_CAL_USERS", datas);
								var taskLen = taskList._DATA_;
								var calState = "";
								for (var i = 0; i < taskLen.length; i++) {
									if (taskLen[i].STATE == 2) {
										calState = 2;
									}
								}
								// 如果有一个没有完成任务的就整个任务没有完成否则修改整个任务的状态为已经完成
								if (calState != 2) {
									FireFly.cardModify("SY_COMM_TASK", {
												"_PK_" : calID,
												"CAL_STATE" : 1,
												"FINISH_TIME" : dateTime
											});
								}
							}
						}

						_viewer.refreshGrid();
					}, 0)
		} else {
			return false;
		}
	}

});
