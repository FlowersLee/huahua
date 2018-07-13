/**
 *  分页获取某新闻评论内容
 */
GLOBAL.namespace("rh.vi");

rh.vi.comment = function(options) {
	var defaults={
		id:options.sId+"-rhCommentView",
		sId:"SY_SERV_COMMENT_ACL",
		aId:"getCommentList",
		"SERV_ID":"",
		"NOWPAGE":0,
		"SHOWNUM":10,
		"DATA_ID":"",
		"cardObj":null,
		pCon:"",
		width:null
	}
	
	this.opts = jQuery.extend(defaults,options);
	this.sId = this.opts.sId;
	this.aId = this.opts.aId;
	this._id = this.opts.id;
	this._pCon = this.opts.pCon;
	this._data = 0;
	this.servId = this.opts.SERV_ID;
	this.dataId = this.opts.DATA_ID;
	this.nowPage = this.opts.NOWPAGE;
	this.showNum = this.opts.SHOWNUM;
	this.cardObj = this.opts.cardObj;
	
	// 先取得主键
	this.data = parent.FireFly.byId(this.sId);
	
	// 布局宽度设置，可没有
	this.width = this.opts.width;
	
	this.pages = 0;
	//回复评论ID
	this._replyId = "";
	
	//初始化当前数据页数
	if (this.nowPage > 0) {
		this.nowPage = 0;
	}
	
	//布局初始化
	this._layout();
}

rh.vi.comment.prototype.show = function() {
	var _self = this;
	
	//获取数据
	this._loadComment();	
}

/** 
 * 加载评论数据
 */
rh.vi.comment.prototype._loadComment = function() {
	var _self = this;
	//获取数据
	var param = {};
	param["SERV_ID"] = this.servId;
	param["DATA_ID"] = this.dataId;
	param["NOWPAGE"] = this.nowPage + 1;
	param["SHOWNUM"] = this.showNum;
	param["_extWhere"] = " and C_STATUS=1";
	param["ORDER"] = "S_CTIME DESC";

	var data = top.FireFly.doAct(this.sId,this.aId,param);
	
	var pageBean = data['_PAGE_'];
	if (!pageBean) {
		this.nowPage = 1;
		this.pages = 1;
	} else {
		this.nowPage = Number(pageBean.NOWPAGE);
		this.pages = Number(pageBean.PAGES);
	}
	
	if (this.nowPage >= this.pages) {
		jQuery("#more").unbind().text("已加载全部评论.").removeClass().parent().removeClass();
	}
	
	var items = jQuery('<div></div>').addClass("reply_items").appendTo(_self.listContainer);
	
	jQuery.each(data['_DATA_'],function(index,comment){
		//显示顺序：评论人、时间   支持、反对、回复
		var item = jQuery('<div></div>').addClass("reply").appendTo(items);
		var div1 = jQuery('<div></div>').addClass("pull-left face").appendTo(item);
		//用户头像
		var perImg = FireFly.getContextPath() + comment.S_USER__IMG;
		var userIcon = jQuery('<img width="50" height="50" src="'+perImg+'">').bind("mouseover", function(event){
			 new rh.vi.userInfo(event, comment.S_USER);
		}).addClass("rh-user-info-circular-bead").appendTo(div1);
		
		var div2 = jQuery('<div></div>').addClass("infos").appendTo(item);
		var infoDiv = jQuery('<div></div>').addClass("infoDiv").appendTo(div2);
		
		//评论人
		jQuery('<span></span>').addClass("name").text(comment.S_USER__NAME).appendTo(infoDiv);
		
		//N楼
		//var replyIndex = (_self.nowPage -1) *  _self.showNum  + (index + 1) ;
		var replyIndex =comment.C_NUMBER;
		jQuery('<span></span>').addClass("opts").text(replyIndex + "楼").appendTo(infoDiv);
		
		//评论时间
		var timeago = "";
		if (comment.S_CTIME) {
			timeago = comment.S_CTIME;
			timeago = timeago.substring(0, 19);
			timeago = jQuery.timeago(timeago); 
		}
		
		var time = jQuery('<abbr title="'+comment.S_CTIME+'" style="color:#F26C4F;"></abbr>').addClass("time").text(timeago).appendTo(infoDiv);
		time.attr("title", comment.S_CTIME);
		
		var bottom = jQuery('<div></div>').addClass("bottom");
		//支持
		var likeVoteCount = 0;
		if (comment.LIKE_VOTE) {
			likeVoteCount = comment.LIKE_VOTE;
		}
		var likeVote = jQuery("<span><i class='like' title='支持'>&nbsp;&nbsp;</i><a href='javascript:;'> "+likeVoteCount+" </a></span>").addClass("zhichi").appendTo(bottom);
		likeVote.bind("click", function() {
			var data = {};
			data["_PK_"] = comment.C_ID;
			var resultData = parent.FireFly.doAct(_self.sId, "increaseLikevote", data);
			if (resultData[UIConst.RTN_MSG] && resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
				var afterVote = Number(likeVoteCount) + 1;
				likeVote.text(afterVote + "人支持");
				likeVote.unbind();
		  		Tip.show("操作成功!");
			} else {
				Tip.showError(resultData[UIConst.RTN_MSG], true);
			}
			return false;
	    });
		
		jQuery("<span> </span>").appendTo(infoDiv);
		
		//反对
		var dislikeVoteCount = 0;
		if (comment.DISLIKE_VOTE) {
			dislikeVoteCount = comment.DISLIKE_VOTE;
		}
		var dislikeVote = jQuery("<span><i class='unlike' title='反对'>&nbsp;&nbsp;</i><a href='javascript:;'> "+dislikeVoteCount+" </a></span>").addClass("fandui").appendTo(bottom);
		dislikeVote.bind("click", function() {
			var data = {};
			data["_PK_"] = comment.C_ID;
			var resultData = parent.FireFly.doAct(_self.sId, "increaseDislikevote", data);
			if (resultData[UIConst.RTN_MSG] && resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
				var afterVote = Number(dislikeVoteCount) + 1;
				dislikeVote.text(afterVote + "人反对");
				dislikeVote.unbind();
		  		Tip.show("操作成功!");
			} else {
				Tip.showError(resultData[UIConst.RTN_MSG], true);
			}
			return false;
	    });				
		
		var top = jQuery('<div></div>').addClass("top");
		
		//是否当前用户
		if(comment.S_USER==parent.System.getVar("@USER_CODE@")){
			top.appendTo(infoDiv);
		}	
		
		//修改
		var modifyBtn = jQuery("<span><i class='icon'>&nbsp;&nbsp;</i><a href='javascript:;'>修改</a></span>").addClass("modify").appendTo(top);
		modifyBtn.bind("click", function(event) {
			
			if (_self.modifyEditor) {
				_self.modifyEditor.destroy();
				_self.modifyEditor = null;
			}
			
			var wid = 600;
			var hei = 328;
			
			var modifyArea = "modify_" + comment.C_ID;
			//修改意见弹出框
			var form = jQuery("<div class='ui-form-default'></div>");
			var dialog = jQuery("<div></div>").addClass("dictDialog").attr("title","修改评论");
			dialog.append("<div><textarea id='" + modifyArea + "'></textarea></div>");
			dialog.append(form);
			dialog.appendTo(jQuery("body"));
			
			var scroll = RHWindow.getScroll(parent.parent.window);
		    var viewport = RHWindow.getViewPort(parent.parent.window);
		    var top = scroll.top + viewport.height / 2 - hei / 2 - 120;
			
		    var posArray = [];
		    
		    posArray[0] = "";
		    posArray[1] = top;

//		    if (event) {
//			    var cy = event.clientY;
//			    posArray[0] = "";
//			    posArray[1] = cy-280;
//		    }
		    
		    // 选择公开范围
			var select= new rh.ui.Select({
				id : "",
				name : "",
				_default : "",
				data : [{"ID":"0","NAME":"全部"},{"ID":"1","NAME":"仅自己"},{"ID":"2","NAME":"指定人员"}],
				style : "",
				regular : "",
				hint : "",
				isHidden : false,
				tip : "",
				cardObj : _self.cardObj
			});
		    
			dialog.dialog({
				autoOpen: true,
				height: hei,
				width: wid,
				show: "bounce", 
		        hide: "puff",
				modal: true,
				resizable: false,
				position: posArray,
				buttons: {
					"保存": function() {
						var ret = _self.setAcl(comment.C_ID, select.getValue());
						if (!ret) {
							return;
						}
						
				    	var data = {};
				    	data["_PK_"] = comment.C_ID;
				    	data["C_CONTENT"] = _self.modifyEditor.getContent();
				    	data["ACL_TYPE"] = select.getValue();
				    	var resultData = parent.FireFly.doAct(_self.sId, "updateReply", data);
				    	if (resultData[UIConst.RTN_MSG] && resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
				      		Tip.show("保存成功!");
				      		_self.modifyEditor.destroy();
				      		_self.modifyEditor = null;
				      		dialog.remove();
				      		//刷新页面
				      		_self.refresh();
				    	} else {
				    		Tip.showError(resultData[UIConst.RTN_MSG], true);
				    	}
					},
					"关闭": function() {
						_self.modifyEditor.destroy();
						_self.modifyEditor = null;
						dialog.remove();
					}
				}
			});
			// 注释掉头部关闭按钮
			dialog.parent().find(".ui-dialog-titlebar-close").hide();
			var btns = jQuery(".ui-dialog-buttonpane button",dialog.parent()).attr("onfocus","this.blur()");
			btns.first().addClass("rh-small-dialog-ok");
			btns.last().addClass("rh-small-dialog-close");
			dialog.parent().addClass("rh-small-dialog").addClass("rh-bottom-right-radius");
		    jQuery(".ui-dialog-titlebar").last().css("display","block");//设置标题显示
		
			_self.createEditor(modifyArea);
			_self.modifyEditor = UE.getEditor(modifyArea);
			
			// 获取该评论的授权数据
			if (!comment.ACL_TYPE) {
				select.setValue("0");
			} else {
				select.setValue(comment.ACL_TYPE);
			}
			
			// 创建授权按钮
			var width = {"ITEM_WIDTH":50,"LEFT_WIDTH":30,"RIGHT_WIDTH":70,"MAX_WIDTH":700}
			if ( _self.cardObj) {
				width = _self.cardObj.form.getItemWidth(1, 2);
			}
			width = {"itemWidth":width.ITEM_WIDTH, "leftWidth":width.LEFT_WIDTH, "rightWidth":width.RIGHT_WIDTH, "maxWidth":width.MAX_WIDTH};
			
			var item1 = new rh.ui.Item(width);
			var label1 = new rh.ui.Label({
				text : "公开范围",
				isNotNull : true
			});
			item1.getObj().css({"margin-top":"4px"});
			item1.addLabel(label1);
			item1.addContent(select.getBlank());
			
			var delegate = new rh.ui.Item(width);
			var label2 = new rh.ui.Label({
				text : "对谁可见？",
				isNotNull : true
			});
			var delegateBtn = jQuery("<a class='rh-icon rhGrid-btnBar-a' style='margin-left:0;' id='comment-delegate' actcode='right'>" +
			"<span class='rh-icon-inner'>选择可查看人</span><span class='rh-icon-img btn-right'/></a>").click(function(){
				var deleteTree = {"DEPT_USER":{"id":"SY_ORG_DEPT_USER","showcheck":true}};
				new rh.ui.Delegate({"servId":"SY_SERV_COMMENT_ACL","dataId":comment.C_ID,"aclType":"SY_SERV_COMMENT_VIEW","title":"授权","deleteTree":deleteTree}).open();
			});
			delegate.getObj().css({"margin-top":"4px"});
			delegate.addLabel(label2);
			delegate.addContent(delegateBtn);
			
			if (select.getValue() != "2") {
				delegate.getObj().hide();
			}
			select.obj.change(function(){
				if (select.getValue() != "2") {
					delegate.getObj().hide();
				} else {
					delegate.getObj().show();
				}
			});
			dialog.find(".ui-form-default").first().append(item1.getObj()).append(delegate.getObj());
			// 获取引用数据
			var modifyContent = "";
			if (comment.REPLY_TO) {
				var data = {};
				data["C_ID"] =  comment.C_ID;
				data["_PK_"] =  comment.C_ID;
				var replyComment = parent.FireFly.doAct(_self.sId, "byid", data);
				var replyNumber = replyComment.C_NUMBER;
				modifyContent = "#回复 " + replyNumber +"楼# ";
			}
			
			// 截取原始评论内容
			var content = comment.C_CONTENT;
			var subIndex = content.lastIndexOf("[/quote]");
			if (0 < subIndex) {
				content = content.substring(subIndex + "[/quote]".length);
			}
			
			modifyContent += content;
			_self.modifyEditor.setContent(modifyContent);
			_self.modifyEditor.focus(true);

			return false;
	    });
		
		//删除
		var deleteBtn = jQuery("<span><i class='icon'>&nbsp;&nbsp;</i><a href='javascript:;'>删除</a></span>").addClass("delete").appendTo(top);
		deleteBtn.bind("click", function() {
			if (confirm("确认删除？")) {
				var data = {};
				data["_PK_"] =  comment.C_ID;
				var resultData = parent.FireFly.doAct(_self.sId, "delete", data);
				if (resultData[UIConst.RTN_MSG] && resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
			  		Tip.show("删除成功!");
			  		//刷新页面
			  		_self.refresh();
				} else {
					Tip.showError(resultData[UIConst.RTN_MSG], true);
				}
			}
			return false;
	    });
		
		
		
		jQuery("<span></span>").appendTo(infoDiv);
		//回复
		var reply = jQuery("<span><a href='javascript:;'>回复</a></span>").addClass("huifu").appendTo(bottom);
		reply.bind("click", function() {
			 _self.editor.setContent("#回复" + replyIndex + "楼#");
			 _self.editor.focus(true);
			 _self._replyId = comment.C_ID;
	    });
	 	
		//评论内容
	 	var bodyDiv = jQuery('<div></div>').addClass("comment").appendTo(div2);
		var current = bodyDiv;
		function do_quote(str) {
			var result = _self._get_quot(str);
			if (result.quote) {
				current = jQuery("<div class='quote_content'></div>").html(result.quote).appendTo(current);
			} else {
				current = jQuery("<div class='quote'></div>").appendTo(current);
				var start = result.start_content;
				start["time"] = start["time"].substring(0, 19);
				var time = jQuery.timeago(start["time"]);
				var quote = start["quote"];
				var user = start["user"] || "";
				var username = start["username"] || user;				
				
				current.append(
						jQuery("<div></div>").html(quote+" "+username+" 在 <span title='"+start['time']+"' style='color:#F26C4F;'>"+time+"</span> 说：")
				)
				
				current.parent().append(
					jQuery("<div class='end'></div>").html(result.end_content)
				)
				do_quote(result.str);
			}
		}
		do_quote(comment.C_QUOTE_CONTENT+comment.C_CONTENT);
		bodyDiv.append(bottom);
	});
	
	if (_self.cardObj) {
		//调整评论框大小
		_self.cardObj.resetSize();
	} else {
		Tab.setCardTabFrameHei();
	}

};

/**
 * @param dataId 数据ID
 * @param openScope 公开范围
 */
rh.vi.comment.prototype.setAcl = function(dataId, openScope) {
	
	if (openScope == "2") {
		var data = {};
		data["SERV_ID"] = "SY_SERV_COMMENT_ACL";
		data["DATA_ID"] = dataId;
		data["ACL_TYPE"] = "SY_SERV_COMMENT_VIEW";
		var retData = FireFly.doAct("SY_SERV_DACL_ITEM", "finds", data)._DATA_;
		if (retData.length == 0) {
			alert("请选择可查看人！");
			return false;
		}
	} else {
		// 删除已经存在的权限
		var data = {};
		data["SERV_ID"] = "SY_SERV_COMMENT_ACL";
		data["DATA_ID"] = dataId;
		data["ACL_TYPE"] = "SY_SERV_COMMENT_VIEW";
		var retData = FireFly.doAct("SY_SERV_DACL_ITEM", "finds", data)._DATA_;
		var ids = [];
		var len = retData.length;
		for (var index = 0; index < len; index++) {
			ids.push(retData[index].ACL_ID);
		}
		
		if (ids.length > 0) {
			var deleteData = {};
			deleteData[UIConst.PK_KEY] = ids.join(",");
			FireFly.listDelete("SY_SERV_DACL_ITEM", deleteData);
		}
		
	}
	
	if (openScope == "0") {// 全部
		var param = {};
		param.SERV_ID = "SY_SERV_COMMENT_ACL";
		param.DATA_ID = dataId;
		param.ACL_TYPE = "SY_SERV_COMMENT_VIEW";
		param.ACL_OWNER = "R_RPUB";
		FireFly.cardAdd("SY_SERV_DACL_ITEM",  param);
	} else if (openScope == "1" || openScope == "2") {// 只有自己能看或者指定人员
		var param = {};
		param.SERV_ID = "SY_SERV_COMMENT_ACL";
		param.DATA_ID = dataId;
		param.ACL_TYPE = "SY_SERV_COMMENT_VIEW";
		param.ACL_OWNER = "U_" + System.getUser("USER_CODE");
		
		var retData = FireFly.doAct("SY_SERV_DACL_ITEM", "finds", param)._DATA_;
		if (retData.length == 0) {
			FireFly.cardAdd("SY_SERV_DACL_ITEM",  param);
		}
		
	} 
	return true;
};

/**
 * submit
 */
rh.vi.comment.prototype.submit = function() {
	var _self = this;
	if (_self.select.getValue().length == 0) {
		alert("请选择公开范围！");
		return;
	} else {
		var ret = this.setAcl(_self.data.C_ID, _self.select.getValue());
		if (!ret) {
			return;
		}
	}
	
	var content =  this.editor.getContent();
	if (content.length == 0) {
		alert("请输入评论内容!");
		return;
	}
	
	_self.data["SERV_ID"] = _self.servId;
	_self.data["DATA_ID"] = _self.dataId;
	_self.data["C_CONTENT"] = content;
	_self.data["REPLY_TO"] = _self._replyId;
	_self.data["ACL_TYPE"] = _self.select.getValue();
	var resultData = parent.FireFly.doAct("SY_SERV_COMMENT_ACL", "reply", _self.data);
	if (resultData[UIConst.RTN_MSG] && resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) == 0) {
  		Tip.show("保存成功!");
  		//刷新页面
  		_self.refresh();
  		_self.editor.setContent("");
  		// 重新取得主键
  		_self.select.setValue("0");
  		_self.delegate.getObj().hide();
  		_self.data = parent.FireFly.byId("SY_SERV_COMMENT_ACL");
	} else {
		Tip.showError(resultData[UIConst.RTN_MSG], true);
	}
	
};

/*
 * 刷新
 */
rh.vi.comment.prototype.refresh = function() {
	var _self = this;
	_self.listContainer.empty();
	_self._replyId = "";
	_self.nowPage = 0;
	_self.show();
};
/**
 * 创建Editor
 */
rh.vi.comment.prototype.createEditor = function(id) {
	var _self = this;
	// 初始化editor
	var fileUrl = "/file/";
	var params = "?SERV_ID=" + this.SERV_ID + "&DATA_ID=" + this.DATA_ID + "&FILE_CAT=";

	// 简单模式
	toolbars = [
                ['undo', 'redo', 'bold', 'italic', 'underline', 'strikethrough', 'link', 'unlink', 'insertimage', 'emotion', '|','attachment', 'map']
          ];
	
	var config = {
		// 比容器宽两像素
		initialFrameWidth:"100%"			// 初始化编辑器宽度
		,initialFrameHeight:191 			// 初始化编辑器高度
		,minFrameHeight:0					// 最小高度
		,autoHeightEnabled:false			// 关闭默认长高，使用滚动条
		,zIndex:1000						// 编辑器层级的基数
		,imageUrl:RHFile.uploadUrl.imageUrl + params + "IMAGE_CAT"            			// 图片上传提交地址
	    ,scrawlUrl:RHFile.uploadUrl.scrawlUrl + params + "SCRAWL_IMG_CAT"           	// 涂鸦上传地址
	    ,fileUrl:RHFile.uploadUrl.fileUrl + params +  "ATTACHMENT_CAT"            		// 附件上传提交地址
	    ,catcherUrl:RHFile.uploadUrl.catcherUrl + params + "REMOTE_IMG_CAT"   			// 处理远程图片抓取的地址
	    ,imageManagerUrl:RHFile.uploadUrl.imageManagerUrl + params						// 图片在线管理的处理地址
	    ,snapscreenHost: '127.0.0.1'                    						// 屏幕截图的server端文件所在的网站地址或者ip，请不要加http://
	    ,snapscreenServerUrl:RHFile.uploadUrl.snapscreenServerUrl + "SNAP_IMG_CAT" 	// 屏幕截图的server端保存程序，UEditor的范例代码为“URL +"server/upload/jsp/snapImgUp.jsp"”
	    ,wordImageUrl:RHFile.uploadUrl.wordImageUrl + params + "WORD_IMG_CAT"         	// word转存提交地址
	    ,getMovieUrl:RHFile.uploadUrl.getMovieUrl + params + "MOVIE_CAT"             	// 视频数据获取地址
	    ,imagePath:fileUrl                // 图片修正地址，引用了fixedImagePath,如有特殊需求，可自行配置
	    ,scrawlPath:fileUrl               // 图片修正地址，同imagePath
	    ,filePath:fileUrl                 // 附件修正地址，同imagePath
	    ,catcherPath:fileUrl              // 图片修正地址，同imagePath
	    ,imageManagerPath:fileUrl         // 图片修正地址，同imagePath
	    ,snapscreenPath:fileUrl			  // 图片修正地址，同imagePath
	    ,wordImagePath:fileUrl            // 图片修正地址，同imagePath
	    ,toolbars:toolbars
	    ,initialContent:''
	    ,maximumWords:2000 
	};
	
	UE.getEditor(id, config).ready(function(){
		// 渲染完了之后重置页面高度
		if (_self.cardObj) {
			_self.cardObj.resetSize();
		} else {
			Tab.setCardTabFrameHei();
		}
	});
};
/*
 * 销毁
 */
rh.vi.comment.prototype.destroy = function() {
	if (this.editor) {
		this.editor.destroy();
		this.editor = null;
	}
};
/*
 * 构建列表页面布局
 */
rh.vi.comment.prototype._layout = function() {
	var _self = this;
	
	//添加我的评论
	_self.myComment = jQuery("<div></div>").addClass("myComment");
	
	
//	var aclDiv = jQuery("<div style='width:50%;max-width:700px;' class='inner' id=''></div>");
//	var left = jQuery("<span style='width:30%;' class='left'><div class='ui-label-default' id='SY_COMM_INFOS_BASE-NEWS_SCOPE_label'><div class='container'><span style='cursor:pointer;' class='name'>公开范围</span><span class='star'></span></div></div></span>").appendTo(aclDiv)
//	var right = jQuery("<span style='width:70%;' class='right'></span>").appendTo(aclDiv);
//	var selectWarp = jQuery("<div style='padding-left:0;' class='blank fl wp ' tip=''></div>").appendTo(right);
//	var select = jQuery("<select class='ui-select-default' name='SY_COMM_INFOS_BASE-NEWS_SCOPE' id='SY_COMM_INFOS_BASE-NEWS_SCOPE'></select>").appendTo(selectWarp);
//	select.append("<option value='0'>全部</option>");
//	select.append("<option value='1'>仅自己</option>");
//	select.append("<option value='2'>指定人员</option>");
	
	// 创建editor对象
	jQuery("<textarea id='comment_content'></textarea>").appendTo(_self.myComment);
	
	commitBtn = jQuery("<a><span class='rh-icon-inner'>评论</span></a>").addClass("rh-icon rhGrid-btnBar-a").css({"margin-top":"1px"}).appendTo(_self.myComment);
 	commitBtn.bind("click", function() {
 		_self.submit();
    });
	
	//评论列表
	_self.listContainer = jQuery("<div></div>").addClass("listComment");
	
	
	//更多评论加载
	var moreBtn = jQuery("<span class='moreComment'><span class='rh-icon-inner' id='more'>更多评论</span></span>").addClass("rh-icon rhGrid-btnBar-a");
	 moreBtn.bind("click", function() {
		 _self._loadComment();
     });
	
	if (this.width) {
		var $strArr = [];
		$strArr.push("<div class='inner' style='width:");
		$strArr.push(this.width.ITEM_WIDTH);
		$strArr.push("%;max-width:");
		$strArr.push(this.width.MAX_WIDTH);
		$strArr.push("px;'>");
		$strArr.push("<span class='left' style='width:");
		$strArr.push(this.width.LEFT_WIDTH);
		$strArr.push("%;'><div class='ui-label-default'><div class='container'></div></div></span>");
		$strArr.push("<span class='right' style='width:");
		$strArr.push(this.width.RIGHT_WIDTH);
		$strArr.push("%;'></span>");
		$strArr.push("</div>");
		container = jQuery($strArr.join("")).appendTo(this._pCon);
		container.find(".right").first().append(_self.myComment).append(_self.listContainer).append(moreBtn);
	} else {
		this._pCon.append(_self.myComment).append(_self.listContainer).append(moreBtn);
	}
	
	// 选择公开范围
	this.select= new rh.ui.Select({
		id : "",
		name : "",
		_default : "",
		data : [{"ID":"0","NAME":"全部"},{"ID":"1","NAME":"仅自己"},{"ID":"2","NAME":"指定人员"}],
		style : "",
		regular : "",
		hint : "",
		isHidden : false,
		tip : "",
		cardObj : _self.cardObj
	});
	
	this.select.setValue("0");
	var width = {"ITEM_WIDTH":50,"LEFT_WIDTH":30,"RIGHT_WIDTH":70,"MAX_WIDTH":700}
	if ( _self.cardObj) {
		width = _self.cardObj.form.getItemWidth(1, 2);
	}
	width = {"itemWidth":width.ITEM_WIDTH, "leftWidth":width.LEFT_WIDTH, "rightWidth":width.RIGHT_WIDTH, "maxWidth":width.MAX_WIDTH};
	var item1 = new rh.ui.Item(width);
	var label1 = new rh.ui.Label({
		text : "公开范围",
		isNotNull : true
	});
	
	item1.addLabel(label1);
	item1.addContent(this.select.getBlank());
	
	_self.delegate = new rh.ui.Item(width);
	var label2 = new rh.ui.Label({
		text : "对谁可见？",
		isNotNull : true
	});
	var delegateBtn = jQuery("<a class='rh-icon rhGrid-btnBar-a' style='margin-left:0;' id='comment-delegate' actcode='right'>" +
	"<span class='rh-icon-inner'>选择可查看人</span><span class='rh-icon-img btn-right'/></a>").click(function(){
		var deleteTree = {"DEPT_USER":{"id":"SY_ORG_DEPT_USER","showcheck":true}};
		new rh.ui.Delegate({"servId":"SY_SERV_COMMENT_ACL","dataId":_self.data.C_ID,"aclType":"SY_SERV_COMMENT_VIEW","title":"授权","deleteTree":deleteTree}).open();
	});
	_self.delegate.addLabel(label2);
	_self.delegate.addContent(delegateBtn);
	
	if (this.select.getValue() != "2") {
		_self.delegate.getObj().hide();
	}
	this.select.obj.change(function(){
		if (_self.select.getValue() != "2") {
			_self.delegate.getObj().hide();
		} else {
			_self.delegate.getObj().show();
		}
	});
	
	_self.myComment.parent().parent().before(item1.getObj()).before(_self.delegate.getObj());
	
	this.createEditor("comment_content");
	this.editor = UE.getEditor("comment_content");
};

//对引用内容进行解析
rh.vi.comment.prototype._get_quot = function(str) {
	if(!str){
		return {
			"quote" : ""
		};
	}
	var start1 = str.indexOf("[");
	var start2 = str.indexOf("]");
	var end = str.lastIndexOf("[/quote]");

	if (start1<0 || start2<0 || end<0 ) {
		return {
			"quote" : str
		};
	}

	else {
		return {
			"start_content" : getObject(str.substring(start1 + 1, start2)),
			"end_content" : str.substring(end + 8),
			"str" : str.substring(start2 + 1, end)
		}
	}
	
	function getObject(content) {
		var returnObject = {};
		var jsons = content.split(",");
		for(var i=0; i<jsons.length; i++){
			var json = jsons[i].split("=");
			returnObject[json[0]] = json[1];
		}
		return returnObject;
	}
};
