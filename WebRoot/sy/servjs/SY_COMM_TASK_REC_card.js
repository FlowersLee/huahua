_viewer = this;

// 对完成任务按钮绑定事件
_viewer.getBtn("completeTask").unbind("click").bind("click", function() {
			var state = _viewer.getItem("STATE").getValue();
			// 判断当前状态如果已经完成则提示用户
			if (state == 2) {
				if (confirm("您确定完成任务吗")) {
					var pk = _viewer.getPKCode();
					// 修改当前人的当前任务的状态为完成任务状态
					_viewer.getItem("STATE").setValue(1);
					// 获取当期时间
					var dateTime = System.getVar("@DATETIME@");
					_viewer.getItem("FINISH_TIME").setValue(dateTime);
					FireFly.cardModify(_viewer.servId, {
								"_PK_" : pk,
								"STATE" : 1,
								"FINISH_TIME" : dateTime
							});
					// 获取CAL_ID
					var calID = _viewer.getItem("CAL_ID").getValue();
					var datas = {};
					datas["_NOPAGE_"] = true;
					datas["_searchWhere"] = " and CAL_ID='" + calID + "'";
					// 查询所有人完成该任务的状态
					var taskList = FireFly.getListData("SY_COMM_CAL_USERS",
							datas);
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
			} else {
				_viewer.cardBarTipError("您的任务已经完成！")
			}
		});
