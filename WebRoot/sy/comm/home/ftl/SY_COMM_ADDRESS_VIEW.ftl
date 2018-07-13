<link rel="stylesheet" type="text/css" href="/sy/comm/txl/slidernav.css" media="screen, projection" />
<script type="text/javascript" src="/sy/comm/txl/slidernav.js"></script>
<style>
     * {
        margin: 0;
        padding: 0;
    }
    
    body {
        padding: 5px;
        background: #eee;
        font-family: Verdana, Arial;
        font-size: 12px;
        line-height: 18px;
    }
    
    a {
        text-decoration: none;
    }
    
    h2, h3 {
        margin: 0 0 20px;
        text-shadow: 2px 2px #fff;
    }
    
    h2 {
        font-size: 28px;
    }
    
    h3 {
        font-size: 22px;
    }
    
    pre {
        background: #fff;
        width: 98%;
        padding: 10px 20px;
        border-left: 5px solid #ccc;
        margin: 0 0 20px;
    }
    
    p {
        width: 100%;
        font-size: 18px;
        line-height: 24px;
        margin: 0 0 30px;
    }
</style>
<div id='USER_TXL' class='portal-box padding:0' style='height:600px'>
    <div id='USER_SERCH_TAB' class='portal-box ${boxTheme}' style='height:98%;width:30%;float:left'>
        <div id="USER_SERCH_TAB_CON" class='portal-box-con portal-box-tab'>
            <ul class='portal-box-title'>
                <li>
                    <a href="#USER_SERCH_TAB_PINYIN">拼音结构 </a>
                </li>
                <li>
                    <a href="#USER_SERCH_TAB_ORG_TREE">机 构 树</a>
                </li>
            </ul>
            <div id="USER_SERCH_TAB_PINYIN">
                <div id="user-search" style="width: 100%;height:30px;margin-left: 10%">
                    <input type="text" id="SY_ALL_SEARCH_INPUT" style="width:60%;float:left; margin-left:10px;margin-top:5px;margin-bottom:5px" onkeyup="getSearchDatas(this.value)">
                    <div id="SY_ALL_SEARCH_BTN" class="btn-search" href="#" style="width:16px;height:16px;float:left;margin-top: 10px;">
                    </div>
                </div>
				<#--构建拼音查询部分-->
                <div id="slider">
                    <div id="slider-content" class="slider-content">
                        <ul id="slider-datas">
                            <script type="text/javascript">
                                for (var va = 0; va < 26; va++) {
                                    var tt = String.fromCharCode(97 + va);
                                    jQuery("<li></li>").attr("id", tt).appendTo(jQuery("#slider-datas"));
                                    jQuery("<a class='title'></a>").attr("name", tt).text(tt.toUpperCase()).appendTo(jQuery("#" + tt));
                                    jQuery("<ul></ul>").attr("id", tt + "_data").appendTo(jQuery("#" + tt));
                                    jQuery("<li></li>").attr("id", tt + "_datas").appendTo(jQuery("#" + tt + "_data"));
                                }
                            </script>
                            <#list _DATA_ as content>
                            <script type="text/javascript">
                                var login_name = "${content.USER_LOGIN_NAME}";
                                var pre_login_name = login_name.substring(0, 1).toLowerCase();
                                for (var va = 0; va < 26; va++) {
                                    var tt = String.fromCharCode(97 + va);
                                    if (pre_login_name == tt) {
                                        jQuery("<a onmouseover=showUserInfo('${content.USER_CODE}') ></a>").text("${content.USER_NAME}").appendTo(jQuery("#" + tt + "_datas"));
                                    }
                                }
                            </script>
                            </#list>
                        </ul>
                    </div>
                </div>
            </div>
			<#--构建组织机构树-->
            <div id="USER_SERCH_TAB_ORG_TREE">
            </div>
        </div>
    </div>
    <div id='USER_SELF' class='portal-box' style='height:98%;width:65%;float:left'>
        <div class='portal-box-title'>
            <span class='portal-box-title-icon icon_portal_links'></span>
            <span class="portal-box-title-label">个人名片</span>
        </div>
        <div id='user_all_info'>
        </div>
    </div>
</div>
</div>

<#--获取选中用户的个人名片信息并构建-->
<script type="text/javascript">
    function showUserInfo(uid){
        jQuery("#user_all_info").empty();
        var userObj = FireFly.byId("SY_COMM_ADDRESS_LIST", uid);
        jQuery("<div style='height:150px'></div>").attr("id", "id1").appendTo(jQuery("#user_all_info"));
        jQuery("<div id='user-info-img-div' style='margin:20px;width:20% ;float:left'></div>").appendTo(jQuery("#id1"));
        var imgSub = userObj.USER_IMG_SRC;
        if (imgSub.length <= 0) {
            if (userObj.USER_SEX == "0") {
                imgSrc = FireFly.getContextPath() + "/sy/theme/default/images/common/rh-male-icon.png";
            } else if (userObj.USER_SEX == "1") {
                imgSrc = FireFly.getContextPath() + "/sy/theme/default/images/common/rh-lady-icon.png";
            }
        }else {
            imgSrc = FireFly.getContextPath() + "/file/" + imgSub.substring(0, imgSub.indexOf(","));
        }

        jQuery("<img class = 'rh-user-info-circular-bead'/>").attr("src", imgSrc).attr("width", "100").attr("height", "120").appendTo(jQuery("#user-info-img-div"));
        jQuery("<div style='margin-top:30px;width:65%;float:left'>").attr("id", "jbxx1").appendTo(jQuery("#id1"));
        jQuery("<div style='margin-left: 5px;'></div>").attr("id", "jbxx2").appendTo(jQuery("#jbxx1"));
        jQuery("<div style='font-size:18px;width:50%;float:left'></div>").attr("id", "user-info-name").text("姓名：").appendTo(jQuery("#jbxx2"));
        jQuery("<span style='font-size:18px'>" + userObj.USER_NAME + "</span>").appendTo(jQuery("#user-info-name"));
        jQuery("<div style='font-size:18px;width:45%;float:left'></div>").attr("id", "user-info-sex").text("性别：").appendTo(jQuery("#jbxx2"));
        if (userObj.USER_SEX == "0") {
            jQuery("<span>男&nbsp;</span>").css({
                "color": "#3777be"
            }).appendTo(jQuery("#user-info-sex"));
        }else if (userObj.USER_SEX == "1") {
            jQuery("<span>女&nbsp;</span>").css({
                "color": "#ba2c27"
            }).appendTo(jQuery("#user-info-sex"));
        } else {
            jQuery("<span><暂无></span>").css({
                "color": "#CCC"
            }).appendTo(jQuery("#user-info-sex"));
        }
        jQuery("<div style='margin-left: 5px;margin-top:30px'></div>").attr("id", "jbxx3").appendTo(jQuery("#jbxx1"));
        jQuery("<div style='font-size:18px;width:50%;float:left'></div>").attr("id", "user-info-workPhone").text("办公电话：").appendTo(jQuery("#jbxx3"));
        var telephone = userObj.USER_OFFICE_PHONE || "<暂无>";
        jQuery("<span style='font-size:18px'>" + telephone + "</span>").appendTo(jQuery("#user-info-workPhone"));
        jQuery("<div style='font-size:18px;width:45%;float:left'></div>").attr("id", "user-info-mobile").text("个人电话：").appendTo(jQuery("#jbxx3"));
        var mobile = userObj.USER_MOBILE || "<暂无>";
        jQuery("<span style='font-size:18px'>" + mobile + "</span>").appendTo(jQuery("#user-info-mobile"));
        
        jQuery("<div style='margin-left: 5px;margin-top:60px'></div>").attr("id", "jbxx4").appendTo(jQuery("#jbxx1"));
        jQuery("<div style='font-size:18px;width:90%;'></div>").attr("id", "user-info-cmpy").text("公司/企业：").appendTo(jQuery("#jbxx4"));
        var user_org = userObj.DEPT_CODE__NAME || "<暂无>";
        jQuery("<span style='font-size:18px'>" + user_org + "</span>").appendTo(jQuery("#user-info-cmpy"));
        
        jQuery("<div style='margin-left: 5px;margin-top:15px'></div>").attr("id", "jbxx5").appendTo(jQuery("#jbxx1"));
        jQuery("<div style='font-size:18px;width:50%;float:left'></div>").attr("id", "user-info-dept").text("部门：").appendTo(jQuery("#jbxx5"));
        var user_dept = userObj.DEPT_CODE__NAME || "<暂无>";
        jQuery("<span style='font-size:18px;'>" + user_dept + "</span>").appendTo(jQuery("#user-info-dept"));
        jQuery("<div style='font-size:18px;width:45%;float:left'></div>").attr("id", "user-info-post").text("职务：").appendTo(jQuery("#jbxx5"));
        var user_post = userObj.USER_POST || "<暂无>";
        jQuery("<span style='font-size:18px'>" + user_post + "</span>").appendTo(jQuery("#user-info-post"));
        
        jQuery("<div style='margin-left:18px;margin-top:20px;font-size:20px'></div>").text("备注：").appendTo(jQuery("#user_all_info"));
        jQuery("<div id='user_info_mark' class='portal-box'  style='height:40%;width:90%;font-size:16px;margin-left:20px;margin-top:5px;word-wrap: break-word;'></div>").text("暂无备注").appendTo(jQuery("#user_all_info"));
        
        jQuery("<div  style='margin-top: 30px;margin-right:0px;margin-left:0px;'></div>").attr("id", "id2").appendTo(jQuery("#user_all_info"));
        jQuery("<div class = 'icon-user-mail' style='margin-left:30px;float:left;width:45%'></div>").attr("id", "user-info-apply").attr("title", "申请").appendTo(jQuery("#id2"));
        jQuery("<span><a style='margin-left:30px;font-size:15px;' href = 'javascript:viod(0) return false;' id = 'user-info-to-apply'>申请开通权限</a></span>").appendTo(jQuery("#user-info-apply"));
        jQuery("#user-info-to-apply").bind("click", function(event){
			var _self = this;
			jQuery("#user-info-to-apply-dialog").remove();
			var dialogId = "user-info-to-apply-dialog"; 
			var winDialog = jQuery("<div style='padding: 5px 5px 5px 5px;'></div>").attr("id", dialogId).attr("title","通讯录信息查看申请");
			winDialog.appendTo(jQuery("body"));
			var bodyWid = jQuery("body").width();
			var hei = 250;
			var wid = 300;
			var posArray = [ 400, 30 ];
			jQuery("#" + dialogId).dialog({
				autoOpen : false,height : hei,width : wid,modal : true,show:"blud",hide:"blue",draggable:true,
				resizable : false,position : posArray,
				buttons: {
					"发送请求": function() {
						var data = {};
						data['USER_CODE']=jQuery("#dialog-user-code").val();
						data['APPLY_USER']=jQuery("#dialog-apply-user-code").val();
						var temp = "";
						jQuery("[name='ctr-item']").each(function() {
							if ($(this).attr("checked")) {
								temp = temp+$(this).attr("item")+'=1='+$(this).attr("itemName")+",";
							}else{
								temp = temp+$(this).attr("item")+'=0='+$(this).attr("itemName")+",";
							}
						});
						if(""!=temp){
							temp = temp.substr(0,temp.length-1);
						}
						data["APPLY_CONTENT"] = temp;
						data["APPLY_MARK"] = jQuery("#apply_mark_content").val();
						FireFly.doAct('SY_COMM_ADDRESS_APPLY','applyAdd',data);
						jQuery("#" + dialogId).remove();
					},
					"取消": function() {
						jQuery("#" + dialogId).remove();
					}
				},
				open : function() {},
				close : function() {jQuery("#" + dialogId).remove();}
			});

			var dialogObj = jQuery("#" + dialogId);
			dialogObj.dialog("open");
			dialogObj.focus();
			jQuery(".ui-dialog-titlebar").last().css("display", "block");
			dialogObj.parent().addClass("rh-bottom-right-radius rhSelectWidget-content");
			Tip.showLoad("努力加载中...", null, jQuery(".ui-dialog-title", winDialog).last());
			var btns = jQuery(".ui-dialog-buttonpane button",dialogObj.parent()).attr("onfocus","this.blur()");
			btns.first().addClass("rh-small-dialog-ok");
			btns.last().addClass("rh-small-dialog-close");
			dialogObj.parent().addClass("rh-small-dialog").addClass("rh-bottom-right-radius");
		    jQuery(".ui-dialog-titlebar").last().css("display","block");
			
			jQuery("<div id='dialog-user' style='margin-left:20%'></div>").appendTo(dialogObj);
			jQuery("<hidden id = dialog-user-code></hidden>").val(uid).appendTo(dialogObj);
			jQuery("<hidden id = dialog-apply-user-code></hidden>").val(System.getVar("@USER_CODE@")).appendTo(dialogObj);
			jQuery("<div id='dialog-user-lable' style='float:left'></div>").text("用户名：").appendTo(jQuery("#dialog-user"));
			jQuery("<input id = 'dialog-user-name' style='float:lef'></<input>").val(userObj.USER_NAME).appendTo(jQuery("#dialog-user"));
			
			jQuery("<div id='dialog-apply-user' style='margin-left:20%' ></div>").appendTo(dialogObj);
			jQuery("<div id='dialog-apply-user-lable' style='float:left'></div>").text("申请人：").appendTo(jQuery("#dialog-apply-user"));
			jQuery("<input id = 'dialog-apply-user-code' style='float:lef'></<input>").val(System.getVar("@USER_NAME@")).appendTo(jQuery("#dialog-apply-user"));
			
			jQuery("<div' style='margin-left:20%;margin-top:10px'></div>").text("申请查看通讯内容").appendTo(dialogObj);
			
			jQuery("<div id='dialog-apply-conten'></div>").appendTo(dialogObj);
			
			jQuery("<div id='checkBox-item' style='margin-left:20%'></div>").appendTo(dialogObj);
			var datas = {};
	        datas["_NOPAGE_"] = true;
	        datas["_searchWhere"] = " and (USER_CODE = '" + uid + "' or SHARE_TO ='" + System.getVar("@USER_CODE@") + "')";
	        var userRols = FireFly.getListData("SY_COMM_ADDRESS_ASSIST", datas);
			
			var confData = {};
			confData["_SELECT_"]="CONF_VALUE";
			confData["_searchWhere"]=" and CONF_KEY='SY_COMM_ADDRESS_CTR_INFO'";
			var confObj = FireFly.getListData("SY_COMM_CONFIG",confData);
			var confValues = confObj._DATA_;
			var confValue = confValues[0].CONF_VALUE;
			
			var valueArray = confValue.split(",");
			var keyCodes = "";
			for(var t=0 ;t<valueArray.length;t++){
				keyCodes = keyCodes+"'"+valueArray[t].split(":")[0]+"',";
			}
			var nameData = {};
			if(""!=keyCodes){
				keyCodes = keyCodes.substr(0,keyCodes.length-1);
				nameData["_SELECT_"] ="ITEM_CODE,ITEM_NAME";
				nameData["_searchWhere"]=" and SERV_ID = 'SY_ORG_USER' and ITEM_CODE in("+keyCodes+")"; 
				var valueNameObj = FireFly.getListData("SY_SERV_ITEM",nameData);
				var valueNames = valueNameObj._DATA_;
				for(var i = 0;i<valueNames.length;i++){
					jQuery("<div id='checkBox-item-"+i+"'></div>").appendTo(jQuery("#checkBox-item"));
					
					jQuery("<input type='checkbox' name='ctr-item' checked='checked' style='float:left'></input>").attr("item",valueNames[i].ITEM_CODE).attr("itemName",valueNames[i].ITEM_NAME).appendTo(jQuery("#checkBox-item-"+i+""));
					jQuery("<div style='float:left'></div>").text(valueNames[i].ITEM_NAME).appendTo(jQuery("#checkBox-item-"+i+""));
				}
				jQuery("<div id='apply_mark' style='margin-left:20%;float:right'></div>").text("备注：").appendTo(dialogObj);
				jQuery("<textarea id = 'apply_mark_content' cols='30' rows='5'></textarea>").appendTo(jQuery("#apply_mark"));

			}
        });
		
        jQuery("<div class = 'icon-user-friend' style='margin-left:30px;float:left;width:45%'></div>").attr("id", "user-info-friend").attr("title", "聊天").appendTo(jQuery("#id2"));
        jQuery("<span><a style='margin-left:30px;font-size:15px' href = 'javascript:void(0) return false;'  id = 'user-info-chat'>聊天</a></span>").appendTo(jQuery("#user-info-friend"));
        jQuery("#user-info-chat").bind("click", function(event){
            var user_id = userObj.USER_CODE + "-rhim-server";
            var chat_id = userObj.USER_CODE + "@rhim.server";
            var user_name1 = userObj.USER_NAME;
            parent.rhImFunc.showChatArea({
                "id": user_id,
                "jid": chat_id,
                "name": user_name1,
                "status": "online"
            });
            
        }); 
        jQuery("<div class = 'icon-user-mail' style='margin-left:30px;margin-top:20px;float:left;width:45%'></div>").attr("id", "user-info-mes").attr("title", "短信").appendTo(jQuery("#id2"));
        jQuery("<span><a style='margin-left:30px;font-size:15px' href = 'javascript:void(0) return false;'  id = 'user-info-chat'>发送手机短信</a></span>").appendTo(jQuery("#user-info-mes"));
		jQuery("<div class = 'icon-user-mail' style='margin-left:30px;margin-top:20px;float:left;width:45%'></div>").attr("id", "user-info-email").attr("title", "邮件").appendTo(jQuery("#id2"));
		jQuery("<span><a style='margin-left:30px;font-size:15px' href = 'javascript:void(0) return false;'  id = 'user-info-e-mail'>发送邮件</a></span>").appendTo(jQuery("#user-info-email"));
		var editor;
		jQuery("#user-info-e-mail").bind("click", function(event){		

			jQuery("#user-info-to-apply-dialog").remove();
			var dialogId = "user-info-to-apply-dialog"; 
			var winDialog = jQuery("<div style='padding: 5px 5px 5px 5px;'></div>").attr("id", dialogId).attr("title","邮件发送");
			winDialog.appendTo(jQuery("body"));
			var bodyWid = jQuery("body").width();
			var hei = $("#USER_SELF").height()*0.9;
			var wid = $(window).width()*0.8;
			var leftPos = $(window).width()*0.1;
			var posArray = [ leftPos, hei*0.05 ];
			jQuery("#" + dialogId).dialog({
				autoOpen : false,height : hei,width : wid,modal : true,show:"blud",hide:"blue",draggable:true,
				resizable : false,position : posArray,
				buttons: {
					"发  送": function() {
						
						var content =  editor.getContent();
						var mailAddress = $("#e-mail-receivrs").val();
						var s_users = $("#e-mail-receivr-codes").val();
						if(""==s_users){
							alert("收件人不能为空");
							return;
						}
						var s_user_array = s_users.split();
						var remData = {};
						remData["REM_TITLE"]=$("#e-mail-theme").val();
						remData["REM_CONTENT"] = content;
						remData["TYPE"] = "EMAIL";
						for(var i = 0 ; i<s_user_array.length; i++){
							remData["S_USER"] = s_user_array[i];
							remData = FireFly.cardAdd("SY_COMM_REMIND",remData);
							var remUserData = {};
							remUserData["USER_ID"]=System.getVar("@USER_CODE@");
							remUserData["REMIND_ID"] = remData.REM_ID;
							remUserData["STATUS"] = "WAITING";
							FireFly.cardAdd("SY_COMM_REMIND_USERS",remUserData);
						}
						jQuery("#" + dialogId).remove();
					}
				},
				open : function() {},
				close : function() {jQuery("#" + dialogId).remove();}
			});

			var dialogObj = jQuery("#" + dialogId);
			dialogObj.dialog("open");
			dialogObj.focus();
			jQuery(".ui-dialog-titlebar").last().css("display", "block");
			dialogObj.parent().addClass("rh-bottom-right-radius rhSelectWidget-content");
			Tip.showLoad("努力加载中...", null, jQuery(".ui-dialog-title", winDialog).last());
			var btns = jQuery(".ui-dialog-buttonpane button",dialogObj.parent()).attr("onfocus","this.blur()");
			btns.first().addClass("rh-small-dialog-ok");
			btns.last().addClass("rh-small-dialog-close");
			dialogObj.parent().addClass("rh-small-dialog").addClass("rh-bottom-right-radius");
		    jQuery(".ui-dialog-titlebar").last().css("display","block");
			
			$("<div id = 'e-mail-receive-box' class='portal-box padding:0' style='width:95%;max-height:15%;min-height:10%'></div>").appendTo(dialogObj);
			var receiveHei = $("#e-mail-receive-box").height();
			$("<div name = 'receive-lab' style = 'float:left;width:5%;margin-top:"+receiveHei*0.35+"px'></div>").text("收件人：").appendTo($("#e-mail-receive-box"));
			$("<input readonly='readonly' id = 'e-mail-receivr-names' style='float:left;width: 85%;min-height:"+receiveHei*0.60+"px;margin-top:"+receiveHei*0.18+"px'></input>").appendTo($("#e-mail-receive-box"));
            $("<hidden id ='e-mail-receivr-codes'></hidden>").appendTo($("#e-mail-receive-box"));
			$("<button id = 'receive-btn' type = 'button' style = 'width:60px;height:30px;float:left;margin-top:"+receiveHei*0.35+"px'></button>").text(" 添  加  ").appendTo($("#e-mail-receive-box"));
			jQuery("#receive-btn").unbind("click").bind("click", function(event){
				var configStr = "SY_ORG_DEPT_USER_ALL,{'rtnLeaf':true,'extendDicSetting':{'rhexpand':false,'childOnly':true},'TYPE':'multi','rtnNullFlag':true}";				
				var extendTreeSetting = "{'rhexpand':false,'expandLevel':2,'cascadecheck':false,'checkParent':false,'childOnly':true}";
				var options = {
					"config" :configStr,
					"replaceCallBack":function(idArray,nameArray){
						$("#e-mail-receivr-codes").val(idArray.join(","));
						$("#e-mail-receivr-names").val(nameArray.join(","));
					}
				};
				var dictView = new rh.vi.rhDictTreeView(options);
				dictView.show(event);	
			});
			$("<div id = 'e-mail-theme-box' class='portal-box padding:0' style='width:95%;max-height:10%;min-height:10%'></div>").appendTo(dialogObj);
			var themeHei = $("#e-mail-theme-box").height();
			$("<div name = 'theme-lab' style = 'float:left;width:5%;margin-top:"+themeHei*0.35+"px'></div>").text("主  题：").appendTo($("#e-mail-theme-box"));
			$("<input id = 'e-mail-theme' style='float:left;width: 85%;min-height:"+themeHei*0.60+"px;margin-top:"+themeHei*0.18+"px'></input>").appendTo($("#e-mail-theme-box"));
            var contentHei =receiveHei*100/25*0.9;
			$("<div id = 'e-mail-receive-content' class='portal-box padding:0' style='width:95%;max-height:"+contentHei*0.95+"px;min-height:"+contentHei*0.8+"px;'></div>").appendTo(dialogObj);
			$("<div name = 'content-lab' style = 'float:left;width:5%;margin-top:"+contentHei*0.45+"px'></div>").text("内  容：").appendTo($("#e-mail-receive-content"));
			$("<div id = 'content-edit' style = 'float:left;width:95%'></div>").appendTo(jQuery("#e-mail-receive-content"));
			
			editor = createEditor("content-edit",$("#e-mail-receive-content").height()*0.85);			
			return false;
        }); 

    };
</script>
<script type='text/javascript'>
	function dictCallBack(idArray,nameArray) {
		var param = {};
		param["TO_USER_CODE"] = idArray.join(",");
		param["USER_CODE"] = nameArray.join(",");
		FireFly.doAct(_viewer.servId, "testGetParam", param, true);
	};
</script>
<#--组织机构树选择函数构建-->
<script type="text/javascript">
    (function(){
        var options = {
            "itemCode": "rh-select-serv",
            "config": "SY_ORG_DEPT_USER_ALL,{'rtnLeaf':true,'extendDicSetting':{'rhexpand':false,'childOnly':true},'TYPE':'single','rtnNullFlag':true}",
            "parHandler": this,
            "hide": "explode",
            "show": "blind",
            "pCon": jQuery("#USER_SERCH_TAB_ORG_TREE"),
            "replaceNodeClick": function(item){
                var leaf = item.LEAF;
                if (leaf == '1') {
                    showUserInfo(item.ID);
                }
                return false;
            }
        };
        var dictView = new rh.vi.rhDictTreeView(options);
        dictView.show(event);
    })();
</script>
<#--拼音查询面板构建-->
<script type="text/javascript">
    $(document).ready(function(){
        $('#slider').sliderNav();
        $('#transformers').sliderNav({
            items: ['autobots', 'decepticons'],
            debug: true,
            height: '500',
            arrows: false
        });
        for (var va = 0; va < 26; va++) {
            var tt = String.fromCharCode(97 + va);
            if ($("#" + tt + "_datas").children().length == 0) {
                $("#" + tt).remove();
            }
        }
    });
</script>
<#--构建Tab面板-->
<script type="text/javascript">
    (function(){
        jQuery(document).ready(function(){
            setTimeout(function(){
                jQuery("#USER_SERCH_TAB_CON").tabs({});
				
				getDoApplyPanel();
            }, 0);
        });
    })();
</script>
<#--构建处理请求面板-->
<script type="text/javascript">
	function getDoApplyPanel(){
		var txurl = window.location.href;				
		if(txurl.indexOf('typeNum=2')!=-1){
			var data_id = txurl.substr((txurl.indexOf('DATA_ID')));
			var dataArray = data_id.split("=");
			var applyData = FireFly.byId("SY_COMM_ADDRESS_APPLY", dataArray[1]);

			var _self = this;
			jQuery("#user-info-to-apply-dialog").remove();
			var dialogId = "user-info-to-apply-dialog"; 
			var winDialog = jQuery("<div style='padding: 5px 5px 5px 5px;'></div>").attr("id", dialogId).attr("title","通讯录信息申请处理");
			winDialog.appendTo(jQuery("body"));
			var bodyWid = jQuery("body").width();
			var hei = 250;
			var wid = 300;
			var posArray = [ 400, 30 ];
			jQuery("#" + dialogId).dialog({
				autoOpen : false,height : hei,width : wid,modal : true,show:"blud",hide:"blue",draggable:true,
				resizable : false,position : posArray,
				buttons: {
					"处理完成": function() {
						var data = {};
						data["APPLY_ID"]=dataArray[1];

						var temp = "";
						jQuery("[name='ctr-item']").each(function() {
							if ($(this).attr("checked")) {
								temp = temp+$(this).attr("item")+'=1='+$(this).attr("itemName")+",";
							}else{
								temp = temp+$(this).attr("item")+'=0='+$(this).attr("itemName")+",";
							}
						});
						if(""!=temp){
							temp = temp.substr(0,temp.length-1);
						}
						data["APPLY_CONTENT"] = temp;

						FireFly.doAct('SY_COMM_ADDRESS_APPLY','doApply',data);
						jQuery("#" + dialogId).remove();
					},
					"不同意": function() {
						jQuery("#" + dialogId).remove();
					}
			},
				open : function() {},
				close : function() {jQuery("#" + dialogId).remove();}
			});

			var dialogObj = jQuery("#" + dialogId);
			dialogObj.dialog("open");
			dialogObj.focus();
			jQuery(".ui-dialog-titlebar").last().css("display", "block");
			dialogObj.parent().addClass("rh-bottom-right-radius rhSelectWidget-content");
			Tip.showLoad("努力加载中...", null, jQuery(".ui-dialog-title", winDialog).last());
			var btns = jQuery(".ui-dialog-buttonpane button",dialogObj.parent()).attr("onfocus","this.blur()");
			btns.first().addClass("rh-small-dialog-ok");
			btns.last().addClass("rh-small-dialog-close");
			dialogObj.parent().addClass("rh-small-dialog").addClass("rh-bottom-right-radius");
		    jQuery(".ui-dialog-titlebar").last().css("display","block");
			
			jQuery("<div id='dialog-user' style='margin-left:20%'></div>").appendTo(dialogObj);
			jQuery("<hidden id = dialog-user-code></hidden>").val(applyData.USER_CODE).appendTo(dialogObj);

			var usDetail = FireFly.byId("SY_ORG_USER",applyData.USER_CODE);
			var applyusDetail=FireFly.byId("SY_ORG_USER",applyData.APPLY_USER);
			jQuery("<hidden id = dialog-user-code></hidden>").val(System.getVar("@USER_CODE@")).appendTo(dialogObj);
			jQuery("<hidden id = dialog-apply-user-code></hidden>").val(applyusDetail.USER_CODE).appendTo(dialogObj);
			jQuery("<div id='dialog-user-lable' style='float:left'></div>").text("用户名：").appendTo(jQuery("#dialog-user"));
			jQuery("<input id = 'dialog-user-name' style='float:lef'></<input>").val(usDetail.USER_NAME).appendTo(jQuery("#dialog-user"));
			
			jQuery("<div id='dialog-apply-user' style='margin-left:20%' ></div>").appendTo(dialogObj);
			jQuery("<div id='dialog-apply-user-lable' style='float:left'></div>").text("申请人：").appendTo(jQuery("#dialog-apply-user"));
			jQuery("<input id = 'dialog-apply-user-name' style='float:lef'></<input>").val(applyusDetail.USER_NAME).appendTo(jQuery("#dialog-apply-user"));
			
			jQuery("<div' style='margin-left:20%;margin-top:10px'></div>").text("申请查看通讯内容").appendTo(dialogObj);
			
			jQuery("<div id='dialog-apply-conten'></div>").appendTo(dialogObj);
			
			jQuery("<div id='checkBox-item' style='margin-left:20%'></div>").appendTo(dialogObj);

			var contents = applyData.APPLY_CONTENT;
			var contentArray = contents.split(",");
			for (var i = 0 ;i<contentArray.length;i++){
				jQuery("<div id='checkBox-item-"+i+"'></div>").appendTo(jQuery("#checkBox-item"));
				var keyValue = contentArray[i].split('=');
				if('1'==keyValue[1]){
					jQuery("<input type='checkbox' name='ctr-item' checked='checked' style='float:left'></input>").attr("item",keyValue[0]).attr("itemName",keyValue[2]).appendTo(jQuery('#checkBox-item-'+i));
					jQuery("<div style='float:left'></div>").text(keyValue[2]).appendTo(jQuery('#checkBox-item-'+i));
				}
			}
			jQuery("<div id='apply_mark' style='margin-left:20%;float:right'></div>").text("备注：").appendTo(dialogObj);
			jQuery("<textarea id = 'apply_mark_content' cols='30' rows='5'></textarea>").text(applyData.APPLY_MARK).appendTo(jQuery("#apply_mark"));			
		}
	}

</script>
<script type="text/javascript">
    function getSearchDatas(inputValue){
        var datas = {};
        datas["_NOPAGE_"] = true;
		datas["_SELECT_"]="USER_CODE,USER_LOGIN_NAME,USER_NAME";
        datas["_searchWhere"] = " and (USER_CODE like '%" + inputValue + "%' or USER_NAME like '%" + inputValue + "%')";
        var userList = FireFly.getListData("SY_COMM_ADDRESS_LIST", datas);
        var userDatas = userList._DATA_;
        jQuery("#slider").empty();
        jQuery("<div id='slider-content' class='slider-content' ></div>").appendTo(jQuery("#slider"));
        jQuery("<ul id='slider-datas'></ul>").appendTo(jQuery("#slider-content"));
        for (var va = 0; va < 26; va++) {
            var tt = String.fromCharCode(97 + va);
            jQuery("<li></li>").attr("id", tt).appendTo(jQuery("#slider-datas"));
            jQuery("<a class='title'></a>").attr("name", tt).text(tt.toUpperCase()).appendTo(jQuery("#" + tt));
            jQuery("<ul></ul>").attr("id", tt + "_data").appendTo(jQuery("#" + tt));
            jQuery("<li></li>").attr("id", tt + "_datas").appendTo(jQuery("#" + tt + "_data"));
        }
        for (var i = 0; i < userDatas.length; i++) {
            var user = userDatas[i];
            var login_name = user.USER_LOGIN_NAME;
            var pre_login_name = login_name.substr(0, 1).toLowerCase();
            for (var va = 0; va < 26; va++) {
                var tt = String.fromCharCode(97 + va);
                if (pre_login_name == tt) {
                    jQuery("<a></a>").unbind("mouseover").bind("mouseover", {
                        "usercode": user.USER_CODE
                    }, function(event){
                        showUserInfo(event.data.usercode);
                    }).text(user.USER_NAME).appendTo(jQuery("#" + tt + "_datas"));
                    break;
                }
            }
        }
        $('#slider').sliderNav();
        $('#transformers').sliderNav({
            items: ['autobots', 'decepticons'],
            debug: true,
            height: '500',
            arrows: false
        });
        var count = 1;
        for (var va = 0; va < 26; va++) {
            var tt = String.fromCharCode(97 + va);
            if ($("#" + tt + "_datas").children().length == 0) {
                $("#" + tt).remove();
                count++;
            }
        }
    }
</script>
<script type="text/javascript">
	function createEditor(id,hei){
     
        toolbars = [['undo', 'redo', 'bold', 'italic', 'underline', 'strikethrough', 'link', 'unlink', 'insertimage', 'emotion', '|', 'attachment', 'map']];   
        var config = {
            initialFrameWidth: "100%",
            initialFrameHeight: hei*0.9,
            minFrameHeight: 0,
            autoHeightEnabled: false,
            zIndex: 1050,
            toolbars: toolbars,
            initialContent: '',
            maximumWords: 2000
        };
        UE.getEditor(id, config).ready(function(){
            if (_self.cardObj) {
                _self.cardObj.resetSize();
            }
        });
		return UE.getEditor(id)
	}

</script>
