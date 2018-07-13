/* 用户浮出卡片渲染引擎 */
GLOBAL.namespace("rh.vi");

/*
 * 用户个人信息弹出框实例
 */
rh.vi.userInfo = function(event,usercode,options){
	var _self = this;
  	this.userObj;	//用户个人信息对象
  	this.imgSrc; //用户头像链接地址
  	this.x;
  	this.y;
  	this.userId = usercode; //div弹出位置和用户编码
  	this.setTimeoutVal; //定时器变量声明
  	this._onDialog = false; //鼠标在div上
  	this.setTimeout;//定时器变量声明
	clearTimeout(this.setTimeout);
	this.setTimeout = setTimeout(function(){
		var userCode = usercode;
  		_self._userload(event,userCode,options);
	},500);
	jQuery(event.target).unbind("mouseleave").bind("mouseleave",function(event){
		clearTimeout(_self.setTimeout);
  		_self.setTimeoutVal = setTimeout(function(){
  			if(_self._onDialog != true){
  				var userDia = jQuery("div[name = 'user-info-dialog-names']");
  				userDia.empty();
  				userDia.remove();
  			}
  		}, 500);
  	});
};
/*
 * 初始化方法
 */
rh.vi.userInfo.prototype._userload = function(e, id, options){
	var _self = this; //获取当前对象
	//获得实例化出来的div个数
	var divObjs = jQuery("div[name = 'user-info-dialog-names']");
	//清除弹出div
	divObjs.remove();
	//指定弹出div方法
	//如果存在html内容，则初始化一个空的div层
	if ("" != (id || "")) {
		_self._userloadData(id);
	}
	_self._getUserInfoDialog(e,options);
};
/*
 *获得user对象
 */
rh.vi.userInfo.prototype._userloadData = function(userCode){
	this.userObj = top.FireFly.byId("SY_ORG_USER_INFO",userCode);
};
/*
 * 构建弹出框页面布局
 */
rh.vi.userInfo.prototype._getUserInfoDialog = function(e, options) {
	var _self = this;
	var dialogId = "user-info-dialog"; // 设置Dialog的id
	var xVal = Mouse.getMousePoint(e).x;
	var yVal = Mouse.getMousePoint(e).y;
	//计算弹出div的位置，不能出现在body之外的位置
	var bodyWidth = parent.jQuery("body").width();
	var scrollVal = parent.jQuery("body").scrollTop();
	if (scrollVal == 0) {
		scrollVal = Mouse.getScrollTop();
	}
	//获取当前可视化窗体高度
	var bodyHeight = top.GLOBAL.getDefaultFrameHei();
	//弹出框所在区域返回值
	var rtnVal = 0;
	var width = 355;
	var height = 200;
	//获得区域返回值
	if ("" != (options|| "")) {
		//如果存在自定义宽度，则取自定义宽度
		if ("" != (options["width"] || "")) {
			width = options["width"];
		}
		//如果存在自定义高度，则取自定义高度
		if ("" != (options["height"] || "")) {
			height = options["height"];
		}
	}
	rtnVal = Mouse.dialogCoordinate(xVal, Math.abs(yVal - scrollVal), width, height);
	//判断在哪个位置显示
	if ((rtnVal == 0) || (rtnVal == 1)) {
		this.x = xVal + 15;
		this.y = yVal + 15; 
	} else if (rtnVal == 2) {
		this.x = xVal - width - 15;
		this.y = yVal + 15; 
	} else if (rtnVal == 3) {
		this.x = xVal - width - 15;
		this.y = yVal - height - 15; 
	} else if (rtnVal == 4) {
		this.x = xVal + 15;
		this.y = yVal - height - 15; 
	}
	
	//最外层div
	var hideDiv = jQuery("<div class = 'icon-user-info-div-back' name = 'user-info-dialog-names' ></div>")
		.css({
			"display":"none",
			"position":"absolute",
			"top":this.y,"left":this.x,
			"width":width+"px","height":height+"px",
			"z-index":"10000"
		}).appendTo(jQuery("body"));
	
	//添加圆角，阴影。内层div
	var winDialog = jQuery("<div></div>").attr("id", dialogId)
		.attr("class", "icon-user-info-div-back")
		.css({
			"width":width+"px","height":height+"px",
			"overflow-y":"no",
			"background":"white",
			"box-shadow":"0px 0px 12px 0px #666"
		});
	
	winDialog.appendTo(hideDiv);
	hideDiv.show("slow");
	//给内层div添加鼠标事件
	hideDiv.bind("mouseenter",function(e){
		jQuery("#user-info-close-div").attr("class", "icon-user-close-mouseleave-div icon-user-close-mouseover-div rh-user-info-close-div");
		jQuery("#user-info-close-div").show();
		_self._onDialog = true;
		clearTimeout(_self.setTimeoutVal);
	}).bind("mouseleave", function(e){
		_self._onDialog = true;
		jQuery("#user-info-close-div").hide();
		jQuery("div[name = 'user-info-dialog-names']").fadeOut(1000);
	});
	//添加左边div
	jQuery("<div></div>").attr("id", "user-info-div").css({"padding" : "5px 5px 5px 5px"}).appendTo(winDialog);
	//如果没有自定义html元素，则用用户信息弹出框
	if ("" != (_self.userId || "")) {
		//添加图片div
		jQuery("<div></div>").attr("id", "user-info-img-div").css({
					"float":"left","margin-right":"5px"
				}).appendTo(jQuery("#user-info-div"));
		//拿到图片路径
		//设置img圆角显示
		jQuery("<img class = 'rh-user-info-circular-bead' style='margin-top:15px;margin-left:15px;'/>").attr("src", this.userObj.USER_IMG).attr("width","77").attr("height","77")
			.appendTo(jQuery("#user-info-img-div"));
		//添加在线状态图标
		jQuery("<div>&nbsp;</div>").attr("id", "user-info-on-line").appendTo(jQuery("#user-info-img-div"));
		//添加关闭div按钮
		jQuery("<div class = 'rh-user-info-close-div' style='margin-left:82px;'>&nbsp;</div>").attr("id","user-info-close-div").attr("title","关闭")
			.appendTo(jQuery("#user-info-div"));
		//根据在线状态显示不同的状态图标
		if (this.userObj.USER_CODE__STATUS== "1") {
			jQuery("#user-info-on-line").attr("class","rh-user-info-list-online rh-user-info-on-line").attr("title", "在线");
		} else if (this.userObj.USER_CODE__STATUS== "2") {
			jQuery("#user-info-on-line").attr("class","rh-user-info-list-offline rh-user-info-on-line").attr("title", "离线");
		}
		//添加基本信息div
		jQuery("<div class = 'rh-user-info-local-div rh-user-info-field' style='background:white;height:190px;'></div>")
			.attr("id","user-info-local-div").appendTo(jQuery("#user-info-div"));
		if("" != (options || "")){
			if(options.btns.length > 0){
				var btns = options.btns;
				var topSpace = 10;
				if(btns.length == 1){
					var btn = jQuery("<div></div>");
					btn.attr("id",btns[0].id).attr("title",btns[0].name).css({"left":"250px","top":"10px"})
						.appendTo(jQuery("#user-info-local-div"));
					jQuery("<a href = 'javascript:void(0) return false;' id='user-info-msg' class='rh-icon rhGrid-btnBar-a'><span class='rh-icon-inner'><font color='black' size='2'>" + btns[0].name + "</font></span><span class='" + btns[0].icon  + "' style='width:0px;'></span></a>").appendTo(btn);
					jQuery("#" + btns[0].id).click(btns[0].func);
				}else if(btns.length == 2){
					for(i=0;i < btns.length;i++) {
						var btn = jQuery("<div></div>");
						btn.attr("id",btns[i].id).attr("title",btns[i].name).css({"left":"250px","top":topSpace+"px"})
							.appendTo(jQuery("#user-info-local-div"));
						jQuery("<a href = 'javascript:void(0) return false;' id='user-info-msg' class='rh-icon rhGrid-btnBar-a'><span class='rh-icon-inner'><font color='black' size='2'>" + btns[i].name + "</font></span><span class='" + btns[i].icon  + "' style='width:0px;'></span></a>").appendTo(btn);
						topSpace += 40;
						jQuery("#" + btns[i].id).click(btns[i].func);
					}
				
				}else if(btns.length == 3){
					for(i=0;i < btns.length;i++) {
						if(i == 0){
							var btn = jQuery("<div></div>");
							btn.attr("id",btns[0].id).attr("title",btns[0].name).css({"left":"150px","top":"10px"})
								.appendTo(jQuery("#user-info-local-div"));
							jQuery("<a href = 'javascript:void(0) return false;' id='user-info-msg' class='rh-icon rhGrid-btnBar-a'><span class='rh-icon-inner'><font color='black' size='2'>" + btns[0].name + "</font></span><span class='" + btns[0].icon  + "' style='width:0px;'></span></a>").appendTo(btn);
							jQuery("#" + btns[0].id).click(btns[0].func);
						}else {
							var btn = jQuery("<div></div>");
							btn.attr("id",btns[i].id).attr("title",btns[i].name).css({"left":"250px","top":topSpace+"px"})
								.appendTo(jQuery("#user-info-local-div"));
							jQuery("<a href = 'javascript:void(0) return false;' id='user-info-msg' class='rh-icon rhGrid-btnBar-a'><span class='rh-icon-inner'><font color='black' size='2'>" + btns[i].name + "</font></span><span class='" + btns[i].icon  + "' style='width:0px;'></span></a>").appendTo(btn);
							topSpace += 40;
							jQuery("#" + btns[i].id).click(btns[i].func);
						}
					}
				}else if(btns.length == 4){
					var topSpace2 = 10
					for(i=0;i < btns.length;i++) {
						if(i <= 1){
							var btn = jQuery("<div></div>");
							btn.attr("id",btns[i].id).attr("title",btns[i].name).css({"left":"150px","top":topSpace2+"px"})
								.appendTo(jQuery("#user-info-local-div"));
							jQuery("<a href = 'javascript:void(0) return false;' id='user-info-msg' class='rh-icon rhGrid-btnBar-a'><span class='rh-icon-inner'><font color='black' size='2'>" + btns[i].name + "</font></span><span class='" + btns[i].icon  + "' style='width:0px;'></span></a>").appendTo(btn);
							topSpace2 += 30;
							jQuery("#" + btns[i].id).click(btns[i].func);
						}else {
							var btn = jQuery("<div></div>");
							btn.attr("id",btns[i].id).attr("title",btns[i].name).css({"left":"250px","top":topSpace+"px"})
								.appendTo(jQuery("#user-info-local-div"));
							jQuery("<a href = 'javascript:void(0) return false;' id='user-info-msg' class='rh-icon rhGrid-btnBar-a'><span class='rh-icon-inner'><font color='black' size='2'>" + btns[i].name + "</font></span><span class='" + btns[i].icon  + "' style='width:0px;'></span></a>").appendTo(btn);
							topSpace += 30;
							jQuery("#" + btns[i].id).click(btns[i].func);
						}
					}
				}
			}
		}
		//添加公司、部门标签
		if("" != (options||"")){
			if("" != (options.btns ||"")){
				jQuery("<div style='top:85px;width:180px;height:41px;'></div>").attr("id","user-info-dept")
				.appendTo(jQuery("#user-info-local-div"));
			}else {
				jQuery("<div style='top:70px;width:180px;height:41px;'></div>").attr("id","user-info-dept")
				.appendTo(jQuery("#user-info-local-div"));
			}
		}else {
			jQuery("<div style='top:70px;width:180px;height:41px;'></div>").attr("id","user-info-dept")
			.appendTo(jQuery("#user-info-local-div"));
		}
		var comp_name = System.getVar("@CMPY_FULLNAME@");
		var user_dept = this.userObj.DEPT_NAME || "";
		if(comp_name.length < 11){
			jQuery("<p style='height:23px;'><span>" + comp_name + "</span></p>").appendTo(jQuery("#user-info-dept"));
		}else{
			jQuery("<p style='height:23px;'><span title='" + comp_name + "'>" + Format.substr(0,9,comp_name) + "..</span></p>").appendTo(jQuery("#user-info-dept"));
		}
		jQuery("<p><span>" + user_dept + "</span></p>").appendTo(jQuery("#user-info-dept"));
		jQuery("<hr color='rgb(52,52,52)' size='0.5px' style='margin-left:18px;width:190px;margin-top:2px;'/>").appendTo(jQuery("#user-info-dept"));
		//添加姓名标签
		jQuery("<div style='float:left'></div>").attr("id","user-info-name").css({"left":"0px","top":"117px","width":"106px","text-align":"center"})
			.appendTo(jQuery("#user-info-local-div"));
		var fullname = this.userObj.USER_NAME || "<暂无>";
		var name = fullname;
		if(fullname.length < 6){
			jQuery("<span>" + fullname + "</span>").appendTo(jQuery("#user-info-name"));
		}else{
			name = Format.substr(0,4,fullname);
			jQuery("<span title='" + fullname + "'>" + name + "..</span>").appendTo(jQuery("#user-info-name"));
		}
		
		//添加电话标签
		if("" != (options||"")){
			if("" != (options.btns ||"")){
				jQuery("<div style='float:left;'></div>").attr("id","user-info-telephone").css({"left":"120px","top":"135px"})
				.appendTo(jQuery("#user-info-local-div"));
			}else {
				jQuery("<div style='float:left;'></div>").attr("id","user-info-telephone").css({"left":"120px","top":"122px"})
				.appendTo(jQuery("#user-info-local-div"));
			}
		}else {
			jQuery("<div style='float:left;'></div>").attr("id","user-info-telephone").css({"left":"120px","top":"122px"})
			.appendTo(jQuery("#user-info-local-div"));
		}
		var telephone = this.userObj.USER_OFFICE_PHONE.trim() || "";
		var mobile = this.userObj.USER_MOBILE.trim() || "";
		var tm = "<span style='color:rgb(92,92,92);font-size:13px;'>电话:";
		if(telephone == "" && mobile == ""){
			jQuery(tm + " 无</span>").appendTo(jQuery("#user-info-telephone"));
		}else {
			if(telephone != ""){
					if(mobile !=""){
						jQuery(tm + " " + telephone + ",</span>").appendTo(jQuery("#user-info-telephone"));
						jQuery("<span style='color:rgb(92,92,92);font-size:13px;padding-left:2px;'>" + mobile + "</span>").appendTo(jQuery("#user-info-telephone"));
					}else{
						jQuery(tm + " " + telephone + "</span>").appendTo(jQuery("#user-info-telephone"));
					}
				}else {
				jQuery(tm + " " + mobile + "</span>").appendTo(jQuery("#user-info-telephone"));
			}
			
		}
		//添加职位标签
		jQuery("<div></div>").attr("id","user-info-post").css({"left":"0px","top":"138px","width":"106px","text-align":"center"})
			.appendTo(jQuery("#user-info-local-div"));
		var user_post = this.userObj.USER_POST || "";
		jQuery("<span style='color:#000;font-size:13px;'>" + user_post + "</span>").appendTo(jQuery("#user-info-post"));
		//添加即时通信
		var webIMConfig = System.getVar("@C_SY_WBIM_FLAG@");
		var thisCharDivObj = jQuery("<div></div>");
		//如果没有邮件，则移动聊天在弹出框的位置
		if ("" == (jQuery("div[class='icon-user-mail']").html() || "")) {
			thisCharDivObj.css({"left":"5px"});
		}
		thisCharDivObj.attr("id","user-info-friend").attr("title", "聊天").css({"left":"14px","top":"160px"})
			.appendTo(jQuery("#user-info-local-div"));
		jQuery("<a href = 'javascript:void(0) return false;'  id = 'user-info-chat' class='rh-icon rhGrid-btnBar-a'><span class='rh-icon-inner'><font color='black' size='2'>即时通讯</font></span><span class='rh-icon-img btn-chat' style='width:0px;'></span></a>").appendTo(thisCharDivObj);
		//打开聊天对话框单击事件
		jQuery("#user-info-chat").bind("click", function(event){
			var user_id = _self.userObj.USER_CODE + "-rhim-server";
			var chat_id = _self.userObj.USER_CODE + "@rhim.server";
			var user_name = _self.userObj.USER_NAME;
			parent.rhImFunc.showChatArea({"id":user_id,"jid":chat_id,"name":user_name,"status":"online"});
			hideDiv.remove();
		});
		//发送短信
		var sendMsg = jQuery("<div></div>");
		sendMsg.attr("id","send-phone-msg").attr("title", "发送短信").css({"left":"125px","top":"160px"})
			.appendTo(jQuery("#user-info-local-div"));
		jQuery("<a href = 'javascript:void(0) return false;'  id = 'user-info-msg' class='rh-icon rhGrid-btnBar-a'><span class='rh-icon-inner'><font color='black' size='2'>发送短信</font></span><span class='rh-icon-img btn-phone' style='width:0px;'></span></a>").appendTo(sendMsg);
		/**绑定发送信息按钮*/
		$("#send-phone-msg").unbind("click").bind("click", function(e){
			alert("发送手机短信！");
		});
		//添加邮箱标签
		var emailAddr = System.getVar("@C_SY_EMAIL_ADDR@") || "";
		var sendEmail = emailAddr.replace("#USER_CODE#",_self.userObj.USER_LOGIN_NAME);
		jQuery("<div></div>").attr("id","user-info-mail").css({"left":"236px","top":"160px"}).attr("title", "邮件")
			.appendTo(jQuery("#user-info-local-div"));
		jQuery("<a href = 'javascript:void(0) return false;'  id = 'send-email' class='rh-icon rhGrid-btnBar-a'><span class='rh-icon-inner'><font color='black' size='2'>发送邮件</font></span><span class='rh-icon-img btn-msg' style='width:0px;'></span></a>").appendTo(jQuery("#user-info-mail"));
		/**绑定发送邮件按钮*/
		$("#send-email").unbind("click").bind("click", function(e){
			window.open("http://staff.zotn.com/");
		});
	} else {
		//添加自定义html元素
		if ("" != (options["html"] || "")) {
			options["html"].appendTo(jQuery("#user-info-div"));
		}
		//添加关闭div按钮
		jQuery("<div class = 'rh-user-info-close-div'>&nbsp;</div>").attr("id","user-info-close-div").attr("title","关闭")
			.css({"left":(width - 15)+"px"}).appendTo(jQuery("#user-info-div"));
	}
	jQuery("<div></div>").attr("id", "user-info-bottom-div").appendTo(winDialog);
	//给关闭按钮添加鼠标事件
	jQuery("#user-info-close-div").bind("click", function(e){
		hideDiv.remove();
	}).bind("mouseover", function(e){
		jQuery(this).attr("class", "icon-user-close-mouseover-div rh-user-info-close-div");
	});
	/*
	if (e.type != "click") {
		//给父元素绑定单击事件
		jQuery("body").bind("click",function(e){
			jQuery("div[name = 'user-info-dialog-names']").remove();
		});
	}
	*/
	hideDiv.show("slow");
};

/*
 * 用户连接
 * @param userName 用户名称
 * @param userCode 用户id
 */
rh.vi.userInfo.prototype._inTouserCard = function (userName,userCode){
	Tab.open({
		"tTitle":userName,
		"url":"SY_ORG_USER_INFO.card.do?pkCode=" + userCode
	});
};

/*
 * 图片悬浮查看
 */
rh.vi.suspendImg = function(e,imgPath){
	this.x;
	this.y;
	this._loadImg(e,imgPath);
};

/*
 * 初始化悬浮图片
 */
rh.vi.suspendImg.prototype._loadImg = function(e,imgPath){
	jQuery("div[name = 'user-info-suspend-img']").remove();
	var xVal = Mouse.getMousePoint(e).x;
	var yVal = Mouse.getMousePoint(e).y;
	
	//计算弹出div的位置，不能出现在body之外的位置
	var bodyWidth = parent.jQuery("body").width();
	var scrollVal = parent.jQuery("body").scrollTop();
	if (scrollVal == 0) {
		scrollVal = Mouse.getScrollTop();
	}
	
	//获取当前可视化窗体高度
	var bodyHeight = top.GLOBAL.getDefaultFrameHei();
	
	//弹出框所在区域返回值
	var rtnVal = 0;
	
	//获得区域返回值
	rtnVal = Mouse.dialogCoordinate(xVal, Math.abs(yVal - scrollVal), 200, 200);
	
	//判断在哪个位置显示
	if ((rtnVal == 0) || (rtnVal == 1)) {
		this.x = xVal + 15;
		this.y = yVal + 15; 
	} else if (rtnVal == 2) {
		this.x = xVal - 200 - 15;
		this.y = yVal + 15; 
	} else if (rtnVal == 3) {
		this.x = xVal - 200 - 15;
		this.y = yVal - 200 - 15; 
	} else if (rtnVal == 4) {
		this.x = xVal - 15;
		this.y = yVal - 200 - 15; 
	}
	
	var imgDiv = jQuery("<div style='display:none;' class='rh-user-info-shadow' name='user-info-suspend-img'></div>")
		.appendTo(jQuery("body"));
	var imgVal = jQuery("<img class = 'rh-user-info-circular-bead'/>")
		.attr("src",imgPath).appendTo(imgDiv);
	imgVal.attr("width","200").attr("height","200");
	imgDiv.css({
		"position":"absolute",
		"top":this.y,"left":this.x,
		"width":"200px","height":"200px",
		"z-index":"10000"
	}).bind("mouseleave",function(event){
		imgDiv.fadeOut("slow");
	}).bind("click",function(event){
		imgDiv.fadeOut("slow");
	});
	
	//给父元素绑定单击事件
	jQuery("body").bind("click",function(e){
		jQuery("div[name = 'user-info-suspend-img']").fadeOut("slow");
	});
	
	imgDiv.fadeIn("slow");
	if (rtnVal == 0 || rtnVal == 1) {
		imgDiv.animate({
			left:this.x + 50,
			top:this.y - 30
		  }, 1000 );
	} else if (rtnVal == 2) {
		imgDiv.animate({
			left:this.x - 50,
			top:this.y - 30
		  }, 1000 );
	} else if (rtnVal == 3) {
		imgDiv.animate({
			left:this.x - 50,
			top:this.y - 30
		  }, 1000 );
	} else if (rtnVal == 4) {
		imgDiv.animate({
			left:this.x - 50,
			top:this.y + 30
		  }, 1000 );
	}
};