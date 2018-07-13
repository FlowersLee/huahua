<style>
	.USER_TXL_back_img{ margin:auto;background:url('/sy/comm/txl/bg.png')}
	#USER_SERCH_TAB_CON .ui-tabs-nav li {background:url('/sy/comm/txl/norTab.png') repeat-x ;margin:6px 1px 0px 6px;line-height:20px;}
	#USER_SERCH_TAB_CON .ui-tabs-nav li a{background:none;color:black;font-weight:normal;cursor: pointer;font-family: 微软雅黑;font-size: 13px;}
	#USER_SERCH_TAB_CON .ui-tabs-nav li.ui-tabs-selected {background:url('/sy/comm/txl/norTab.png') repeat-x left -26px;}
	#USER_SERCH_TAB_CON .ui-tabs-nav li.ui-tabs-selected a{background:none;color:white;font-weight:normal;cursor: pointer;}
	#self-resume-tabs .ui-tabs-nav li {background:url('/sy/comm/txl/norTab.png') repeat-x;margin:6px 1px 0px 6px;line-height:20px;}
	#self-resume-tabs .ui-tabs-nav li a{background:none;color:black;font-weight:normal;cursor: pointer;font-family: 微软雅黑;font-size: 13px;}
	#self-resume-tabs .ui-tabs-nav li.ui-tabs-selected {background:url('/sy/comm/txl/norTab.png') repeat-x left -26px;}
	#self-resume-tabs .ui-tabs-nav li.ui-tabs-selected a {background:none;color:white;}
	.USER_SERCH_TAB_PINYIN_ZB_li { background:url('/sy/comm/txl/vv.png') no-repeat left -15px; height:16px; margin-left:2px; margin-top:2px;}
	.USER_SERCH_TAB_PINYIN_ZB_li_a{text-decoration: none;}
	.USER_SERCH_TAB_PINYIN_ZB_li_a:hover{font-weight:bold;}
	.PY_ZM_LAB-name-li { border-top:1px #cccccc solid; height:25px; line-height:25px; background:#ffffff }
	.PY_ZM_LAB-name-li:hover{background:#7557f7;font-weight:bold;}
	.PY_ZM_LAB-li { line-height:25px; background:#CCCCCC; }
	.PY_ZM_LAB-li-selected { line-height:25px; background:#414040; color:#FFFFFF}
	.user-all-info-lab-li{line-height:25px;font-family: 微软雅黑;font-size: 13px;font-weight: normal;font-style: normal;text-decoration: none;color: #333333;}
	.user-all-info-result-li{line-height:25px;font-family: 宋体;font-size: 13px;font-weight: normal;font-style: normal;text-decoration: none;color: #333333;}
	.user-base-info-lab-li{line-height:23px;font-family: 微软雅黑;font-size: 13px;font-weight: normal;font-style: normal;text-decoration: none;color: #333333;}
	.user-base-info-result-li{line-height:23px;font-family: 宋体;font-size: 13px;font-weight: normal;font-style: normal;text-decoration: none;color: #333333;}
	.user-education-info-title-li{border-bottom: 1px #cccccc solid;float: left;} 
	.user-education-info-title-span{ font-family: 微软雅黑;font-size: 13px;font-weight: normal;font-style: normal;text-decoration: none;color: #990000;}    
	.user-info-data-li{margin-top:5px;float: left;list-style-type:none;border-left:1px #cccccc solid;} 
	.user-info-data-span{ font-family: 宋体;font-size: 13px;font-weight: normal;font-style: normal;text-decoration: none;color: #333333;}    
	.list-data-grid{box-shadow:none;height:210px}
	.search-input{ width:90%;height:25px;line-height:25px;float:left;margin-top:8px;margin-bottom:8px;border-radius:8px;}
	#SY_ALL_SEARCH_INPUT{
	-moz-box-shadow:3px 3px 3px #ccc inset;      
	-webkit-box-shadow:3px 3px 3px #ccc inset;            
	box-shadow:3px 3px 3px #ccc inset;                  
	}
</style>

<div style="width:100%;height:580px;background:url('/sy/comm/desk/css/images/rh-back/desk_43.jpg')">
	<div id='USER_TXL' class='USER_TXL_back_img' style = 'width:910px;min-height:560px;border:none;'>
	    <div id='USER_SERCH_TAB'  style='height:100%;width:43%;float:left;margin-left:30px;margin-top:7px'>
	        <div id="USER_SERCH_TAB_CON" style='min-height:100%;'>
	            <ul class='portal-box-title' style = 'margin-top:30px'>
	                <li style='margin-left:30px;border-top-left-radius:5px;border-right:0.5px #9ea0a9 solid'>
	                    <a href="#USER_SERCH_TAB_PINYIN">拼音结构 </a>
	                </li>
	                <li style='margin-left:-1.5px;border-top-right-radius:5px'>
	                    <a href="#USER_SERCH_TAB_ORG_TREE">机 构 树</a>
	                </li>
					<#--
					<li style='margin-left:-1.5px;border-top-right-radius:5px'>
	                    <a href="#SERCH_TAB_ORG_TREE">机构号码</a>
	                </li>-->
	            </ul>
	            <div id="USER_SERCH_TAB_PINYIN">
	            	<div id='PY_ZM' style='width:8%;float:left'>
	            		<ul id ='PY_ZM_LI'></ul>
	            	</div>
					<div style='width: 92%;float:left'>
						<div id="user-search" style="height:35px;">
			            	<input type="text" id="SY_ALL_SEARCH_INPUT" class='search-input' onkeyup="getSearchDatas(this.value)"></input>
			            	<div id="SY_ALL_SEARCH_BTN" class="btn-search" href="#" style="width:16px;height:16px;float:left;margin-top: 13px;"></div>
			        	</div>
						<div style='height:425px;width:100%;border:1px #cccccc solid;OVERFLOW: auto;' >
							<div id='user-contener'>
								<ul id = 'PY_ZM_LAB'></ul>
							</div>
						</div>
					</div>
	            </div>
				<#--构建组织机构树-->
	            <div id="USER_SERCH_TAB_ORG_TREE" style='height:450px;width:100%;OVERFLOW: auto;'></div>
				<#--
				<div id="SERCH_TAB_ORG_TREE"></div>-->
	        </div>
	    </div>
	
		<div id='USER_SELF' style='height:480px;width:43%;float:left;margin-left:8%'>
	        <div id='user_all_info' style='width:93%;height:100%;margin-top: 50px;'>
				<div style="height:35%">
					<div id='user_img' style="width:30%;float:left;margin-top:8px;">
						<img id='user_img_view' width='100' height='100' style='border-radius:5px'></img>
					</div>
					<div style="width:70%;float:left">
						<ul>
							<li class='user-all-info-lab-li'><span>姓名:</span></li>
							<li class='user-all-info-lab-li'><span>职务:</span></li>
							<li class='user-all-info-lab-li'><span>单位:</span></li>
							<li class='user-all-info-lab-li'><span>部门:</span></li>
							<li class='user-all-info-lab-li'><span>办公电话:</span></li>
							<li class='user-all-info-lab-li'><span>移动电话:</span></li>
						</ul>
					</div>

					<div style='position:absolute;margin-left:22%;margin-top:9.8%'>
						<a class="rh-icon rhGrid-btnBar-a" id="send-mobile-apply">
							<span class="rh-icon-inner">申请</span>
							<span class="rh-icon-img btn-right"></span>
						</a>
					</div>
				</div>
				<div style='position:absolute;width:200px;margin-top: -167px;margin-left: 144px;'>
					<ul style='margin-left:3px'>
						<li class='user-all-info-result-li'><span id='user_name' >&nbsp</span></li>
						<li class='user-all-info-result-li'><span id='user_post' >&nbsp</span></li>
						<li class='user-all-info-result-li'><span id='user_cmpy' >&nbsp</span></li>
						<li class='user-all-info-result-li'><span id='user_dept' >&nbsp</span></li>
						<li class='user-all-info-result-li'><span id='user_offer_tel' style='margin-left:20px'>&nbsp</span></li>
						<li class='user-all-info-result-li'><span id='user_mobile' style='margin-left:20px'>&nbsp</span></li>
					</ul>
				</div>
				<div style="height:8%;background:#f6f6f6">
					<ul>
						<li style="float:left;width:33%;margin-top:5px;margin-left:5px">
							<a class="rh-icon rhGrid-btnBar-a" id="instant-messaging">
								<span class="rh-icon-inner"> 即时通讯 </span>
								<span class="rh-icon-img btn-chat"></span>
							</a>
						</li>
						<li style="float:left;width:33%;margin-top:5px">
							<a class="rh-icon rhGrid-btnBar-a" id="send-phone-msg">
								<span class="rh-icon-inner">发送短信</span>
								<span class="rh-icon-img btn-phone"></span>
							</a>
						</li>
						<li style="float:left;width:30%;margin-top:5px">
							<a class="rh-icon rhGrid-btnBar-a" id="send-email">
								<span class="rh-icon-inner">发送邮件</span>
								<span class="rh-icon-img btn-msg"></span>
							</a>
						</li>
					</ul>
				</div>
				<div style="height:60%;">
					<div style="height:10%;margin-top:4px">
						<div style='float:left;width:82%'>
							<span class='user-all-info-lab-li'>简历:</span>
						</div>
						<div style='float:left;width:17%;'>
							<a class="rh-icon rhGrid-btnBar-a" id="resume-apply">
								<span class="rh-icon-inner">申请</span>
								<span class="rh-icon-img btn-right"></span>
							</a>
						</div>
					</div>
					<div id='self-resume-tabs' style='min-height:245px;max-height:245px;border:1px #cccccc solid;'>
						 <ul class='portal-box-title' style='background:none '>
			                <li style='border-top-left-radius:5px;border-right:o.5px #9ea0a9 solid;'>
			                    <a href="#base-info">基本信息 </a>
			                </li>
			                <li style='margin-left:-1px;border-right:0.5px #9ea0a9 solid'>
			                    <a href="#work-info">工作经历</a>
			                </li>
							<li style='margin-left:-1px;border-right:0.5px #9ea0a9 solid'>
			                    <a href="#education-info">教育经历</a>
			                </li>
							<li style='margin-left:-1px;border-top-right-radius:5px;'>
			                    <a href="#jc-info">奖惩情况</a>
			                </li>
			            </ul>
						<div id='base-info' style='width:100%;height:100%' >
							<div style='height:70%'>
								<ul style='width:17%;float:left'>
									<li class='user-base-info-lab-li' style='text-align:right'>姓名:</li>
									<li class='user-base-info-lab-li' style='text-align:right'>民族:</li>
									<li class='user-base-info-lab-li' style='text-align:right'>籍贯:</li>
									<li class='user-base-info-lab-li' style='text-align:right'>身高:</li>
									<li class='user-base-info-lab-li' style='text-align:right'>学历:</li>
									<li class='user-base-info-lab-li' style='text-align:right'>职称:</li>
								</ul>
								<ul style='width:25%;float:left'>
									<li id='base-info-user-name' class='user-base-info-result-li' style='margin-left:3px'>&nbsp</li>
									<li id='base-info-user-nation' class='user-base-info-result-li' style='margin-left:3px'>&nbsp</li>
									<li id='base-info-user-home-land' class='user-base-info-result-li' style='margin-left:3px'>&nbsp</li>
									<li id='base-info-user-height' class='user-base-info-result-li' style='margin-left:3px'>&nbsp</li>
									<li id='base-info-user-edu-level' class='user-base-info-result-li' style='margin-left:3px'>&nbsp</li>
									<li id='base-info-user-title' class='user-base-info-result-li' style='margin-left:3px'>&nbsp</li>	
								</ul>
								<ul style='width:25%;float:left'>
									<li class='user-base-info-lab-li' style='text-align:right'>出生日期:</li>
									<li class='user-base-info-lab-li' style='text-align:right'>婚姻状况:</li>
									<li class='user-base-info-lab-li' style='text-align:right'>政治面貌:</li>
									<li class='user-base-info-lab-li' style='text-align:right'>参加工作日期:</li>
									<li class='user-base-info-lab-li' style='text-align:right'>入职日期:</li>
									<li class='user-base-info-lab-li' style='text-align:right'>工号:</li>
								</ul>
								<ul style='width:25%;float:left'>
									<li id='base-info-user-birthday'class='user-base-info-result-li' style='margin-left:3px'>&nbsp</li>
									<li id='base-info-user-marriage' class='user-base-info-result-li' style='margin-left:3px'>&nbsp</li>
									<li id='base-info-user-politics' class='user-base-info-result-li' style='margin-left:3px'>&nbsp</li>
									<li id='base-info-user-work-date' class='user-base-info-result-li' style='margin-left:3px'>&nbsp</li>
									<li id='base-info-user-cmpy-date' class='user-base-info-result-li' style='margin-left:3px'>&nbsp</li>
									<li id='base-info-user-work-loc' class='user-base-info-result-li' style='margin-left:3px'>&nbsp</li>
								</ul>
							</div>
							<div style='height:30%'>
									<ul style='width:17%;float:left'>
									<li class='user-base-info-lab-li' >身份证号:</li>
									<li class='user-base-info-lab-li' style='text-align:right'>学校:</li>
									<li class='user-base-info-lab-li' style='text-align:right'>专业:</li>
	
								</ul>
								<ul style='width:75%;float:left'>
									<li id='base-info-user-idcard' class='user-base-info-result-li' style='margin-left:3px'>&nbsp</li>
									<li id='base-info-user-edu-school' class='user-base-info-result-li' style='margin-left:3px'>&nbsp</li>
									<li id='base-info-user-edu-major' class='user-base-info-result-li' style='margin-left:3px'>&nbsp</li>
								</ul>
							</div>
						</div>
						<div id='work-info' ></div>
						<div id='education-info'></div>
						<div id='jc-info' ></div>
					</div>
				</div>
			</div>
	    </div>
	</div>
</div>

<#--构建Tab面板-->
<script type="text/javascript">
    (function(){
        $(document).ready(function(){
            setTimeout(function(){
                $("#USER_SERCH_TAB_CON").tabs({});	
				$("#self-resume-tabs").tabs({});				
            }, 0);
        });
    })();
</script>
<#--构建拼音查询面板-->
<script type="text/javascript">
	/**
	 * 页面加载执行的方法
	 * @param {Object} 
	 */
    $(document).ready(function(){
		/**
		 * 获得人员姓名信息
		 */
		var users = getSearchDatas("");
		/**
		 * 组织机构面板
		 */
		var options = {
            "itemCode": "rh-select-serv",
            "config": "SY_ORG_DEPT_USER,{'rtnLeaf':true,'extendDicSetting':{'rhexpand':false,'childOnly':true},'TYPE':'single','rtnNullFlag':true}",
            "parHandler": this,
            "hide": "explode",
            "show": "blind",
            "pCon": jQuery("#USER_SERCH_TAB_ORG_TREE"),
            "replaceNodeClick": function(item){
                var leaf = item.LEAF;
                if (leaf == '1') {
                    showUserInfor(item.ID);
                }
                return false;
            }
        };
        var dictView = new rh.vi.rhDictTreeView(options);
        dictView.show();
		showUserInfor(System.getVar("@USER_CODE@"));
		getDoApplyPanel();
		
		/**
		 * 绑定按钮事件
		 */        
	});

	
	/**
	 * 获得用户列表数据
	 * @param {Object} inputValue
	 */
	function getSearchDatas(inputValue){
		var datas = {};
        datas["_NOPAGE_"] = true;
		datas["_SELECT_"]="USER_CODE,USER_LOGIN_NAME,USER_NAME";
        datas["_searchWhere"] = " and ODEPT_CODE='"+System.getVar("@ODEPT_CODE@")+"' and (USER_CODE like '%" + inputValue + "%' or USER_NAME like '%" + inputValue + "%')";
        var users = FireFly.getListData("SY_COMM_ADDRESS_LIST", datas);	
		createSearchUserView(users);	
	}
	/**
	 * 获得得查询后的用户列表
	 */
	function createSearchUserView(users){
		$("#PY_ZM_LI").empty();
		/**
		 * 构建字母列
		 */
		var pyzmAry = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
		$(pyzmAry).each(function(){
			var pyzmLi = $("#PY_ZM_LI");
			$("<li class='USER_SERCH_TAB_PINYIN_ZB_li'><a href='#' class='USER_SERCH_TAB_PINYIN_ZB_li_a'>"+this+"</a></li>").appendTo(pyzmLi);
		});			
		/**
		 * 构建姓名面板区
		 */
		$("#PY_ZM_LAB").empty();
		$(pyzmAry).each(function(){
			var pyzmLi = $("#PY_ZM_LAB");
			$("<li class='PY_ZM_LAB-li'></li>").attr("id",this).text(this).appendTo(pyzmLi);
			$("<ul style='color:black'></ul>").attr("id",this+"-DATAS").appendTo($("#"+this));
		});
		$(users._DATA_).each(function(){
			var login_name = this.USER_LOGIN_NAME;
			var userName = this.USER_NAME;
			var userId = this.USER_CODE;
	        var pre_login_name = login_name.substring(0, 1).toUpperCase();
			$(pyzmAry).each(function(){
				if(pre_login_name==this){
					$("<li class='PY_ZM_LAB-name-li' onmouseover=showUserInfor('"+userId+"')>"+userName+"</li>").appendTo($("#"+pre_login_name+"-DATAS"));
					return false;
				}			
			});	
		});
		/**
		 * 去除空节标签
		 */
		$(pyzmAry).each(function(){
			if($("#"+this+"-DATAS").children().length==0){
				$("#"+this).remove();
			}
		});
		
		$(".USER_SERCH_TAB_PINYIN_ZB_li_a").bind("mouseover",function(){
			var zm = this.innerHTML;
			var cswz = $("#user-contener").offset().top;
			var zmlab = $("#"+zm);
			var hei=0;
			if(zmlab.size()>0){
				hei = $("#"+zm).offset().top-cswz;
				$("#user-contener").parent().scrollTop(hei);
				$(".PY_ZM_LAB-li-selected").removeClass().addClass("PY_ZM_LAB-li");
				zmlab.addClass("PY_ZM_LAB-li-selected");
			}		
		});
	}
	
	/**
	 * 显示用户
	 * @param {Object} Uid 用户Id
	 */
	function showUserInfor(uid){
		cleareUserInfo();
        var userObj = FireFly.byId("SY_COMM_ADDRESS_LIST", uid);
		if(userObj.USER_NAME&&userObj.USER_NAME.length>0){
			$("#user_name").text(userObj.USER_NAME);
		}else{
			$("#user_name").text("").append("<span>&nbsp</span>");
		}
		if(userObj.USER_POST&&userObj.USER_POST.length>0){
			$("#user_post").text(userObj.USER_POST);
		}else{
			$("#user_post").text("").append("<span>&nbsp</span>");
		}
		
		if(userObj.ODEPT_CODE&&userObj.ODEPT_CODE.length>0){
			var odept = FireFly.byId("SY_ORG_DEPT",userObj.ODEPT_CODE);
			$("#user_cmpy").text(odept.DEPT_NAME);
			if(userObj.DEPT_CODE__NAME&&userObj.DEPT_CODE__NAME.length>0){
				var pos = (userObj.DEPT_CODE__NAME).indexOf(odept.DEPT_NAME);
				if(pos>=0){
					$("#user_dept").text((userObj.DEPT_CODE__NAME).substr((odept.DEPT_NAME).length+1+pos));
				}else{
					$("#user_dept").text(userObj.DEPT_CODE__NAME);
				}
				
			}else{
				$("#user_dept").text("").append("<span>&nbsp</span>");
			}
		}else{
			$("#user_cmpy").text("").append("<span>&nbsp</span>");
		}

		if(userObj.USER_OFFICE_PHONE&&userObj.USER_OFFICE_PHONE.length>0){
			$("#user_offer_tel").text(userObj.USER_OFFICE_PHONE);
		}else{
			$("#user_offer_tel").text("").append("<span>&nbsp</span>");
		}
		if(userObj.USER_MOBILE&&userObj.USER_MOBILE.length>0){
			$("#user_mobile").text(userObj.USER_MOBILE);
		}else{
			$("#user_mobile").text("").append("<span>&nbsp</span>");
		}
		
		$("#user_sex").text(userObj.USER_SEX__NAME||"男");
		
		var imgSub = userObj.USER_IMG;
		
		if (userObj.USER_IMG_SRC.length <= 0) {
            if (userObj.USER_SEX == "0") {
                imgSrc = FireFly.getContextPath() + "/sy/theme/default/images/common/rh-male-icon.png";
            } else if (userObj.USER_SEX == "1") {
                imgSrc = FireFly.getContextPath() + "/sy/theme/default/images/common/rh-lady-icon.png";
            }
        }else {
            imgSrc = FireFly.getContextPath() + imgSub+"&size=100x100";
        }
		$("#user_img_view").attr("src",imgSrc);
		getUserBaseInfo(uid);
		getUserWorkInfo(uid);
		getUserEducationInfo(uid);
		getUserJcInfo(uid);
		if("1"==userObj.USER_RESUME){
			$("#resume-apply").hide();
			$("#base-info").show();
			$("#work-info").show();
			$("#education-info").show();
			$("#jc-info").show();
		}else{
			$("#resume-apply").show();
			$("#base-info").hide();
			$("#work-info").hide();
			$("#education-info").hide();
			$("#jc-info").hide();
		}
		if("OK"==userObj.USER_PHONE_OK){
			$("#send-mobile-apply").hide();
			
		}else{
			$("#send-mobile-apply").show();
		}
		
		btnBindEvent(uid,userObj.USER_NAME);
	}
	/**
	 * 清空用户信息
	 * @param {Object} Uid
	 */
	function cleareUserInfo(){
		$("#user_img_view").attr("src","");
		var infoAry = ["user_name","user_post","user_cmpy","user_dept","user_offer_tel","user_mobile","user_sex"];
		$(infoAry).each(function(){
			$("#"+this).empty().append("<span>&nbsp</span>");
		});
		$("#work-info").empty();
		$("#education-info").empty();
		$("#jc-info").empty();
	}
	/**
	 * 获得用户基本信息
	 */
	function getUserBaseInfo(uid){

		var userObj= FireFly.byId("SY_ORG_USER_INFO_SELF_ALL", uid);
		if(userObj.USER_NAME&&userObj.USER_NAME.length>0){
			
			$("#base-info-user-name").text(userObj.USER_NAME);
		}else{
			$("#base-info-user-name").text("").append("<span>&nbsp</span>")
		}
		if(userObj.USER_NATION&&userObj.USER_NATION.length>0){
			$("#base-info-user-nation").text(userObj.USER_NATION);
		}else{
			$("#base-info-user-nation").text("").append("<span>&nbsp</span>");
		}
		if(userObj.USER_HOME_LAND__NAME&&userObj.USER_HOME_LAND__NAME.length>0){
			$("#base-info-user-home-land").text(userObj.USER_HOME_LAND__NAME);
		}else{
			$("#base-info-user-home-land").text("").append("<span>&nbsp</span>");
		}
		if(userObj.USER_HEIGHT&&userObj.USER_HEIGHT!='0'){
			$("#base-info-user-height").text(userObj.USER_HEIGHT);
		}else{
			$("#base-info-user-height").text("").append("<span>&nbsp</span>");
		}
		if(userObj.USER_EDU_LEVLE__NAME&&userObj.USER_EDU_LEVLE__NAME.length>0){
			$("#base-info-user-edu-level").text(userObj.USER_EDU_LEVLE__NAME);
		}else{
			$("#base-info-user-edu-level").text("").append("<span>&nbsp</span>");
		}
		if(userObj.USER_TITLE&&userObj.USER_TITLE.length>0){
			$("#base-info-user-title").text(userObj.USER_TITLE);
		}else{
			$("#base-info-user-title").text("").append("<span>&nbsp</span>");
		}
		if(userObj.USER_BIRTHDAY&&userObj.USER_BIRTHDAY.length>0){
			$("#base-info-user-birthday").text(userObj.USER_BIRTHDAY);
		}else{
			$("#base-info-user-birthday").text("").append("<span>&nbsp</span>");
		}
		if(userObj.USER_MARRIAGE__NAME&&userObj.USER_MARRIAGE__NAME.length>0){
			$("#base-info-user-marriage").text(userObj.USER_MARRIAGE__NAME);
		}else{
			$("#base-info-user-marriage").text("").append("<span>&nbsp</span>");
		}
		if(userObj.USER_POLITICS&&userObj.USER_POLITICS.length>0){
			$("#base-info-user-politics").text(userObj.USER_POLITICS);
		}else{
			$("#base-info-user-politics").text("").append("<span>&nbsp</span>");
		}	
		if(userObj.USER_WORK_DATE&&userObj.USER_WORK_DATE.length>0){
			$("#base-info-user-work-date").text(userObj.USER_WORK_DATE);
		}else{
			$("#base-info-user-work-date").text("").append("<span>&nbsp</span>");
		}
		if(userObj.USER_CMPY_DATE&&userObj.USER_CMPY_DATE.length>0){
			$("#base-info-user-cmpy-date").text(userObj.USER_CMPY_DATE);
		}else{
			$("#base-info-user-cmpy-date").text("").append("<span>&nbsp</span>");
		}
		if(userObj.USER_WORK_LOC&&userObj.USER_WORK_LOC.length>0){
			$("#base-info-user-work-loc").text(userObj.USER_WORK_LOC);
		}else{
			$("#base-info-user-work-loc").text("").append("<span>&nbsp</span>");
		}
		if(userObj.USER_IDCARD&&userObj.USER_IDCARD.length>0){
			$("#base-info-user-idcard").text(userObj.USER_IDCARD);
		}else{
			$("#base-info-user-idcard").text("").append("<span>&nbsp</span>");
		}	
		if(userObj.USER_EDU_SCHOOL&&userObj.USER_EDU_SCHOOL.length>0){
			$("#base-info-user-edu-school").text(userObj.USER_EDU_SCHOOL);
		}else{
			$("#base-info-user-edu-school").text("").append("<span>&nbsp</span>");
		}		
		if(userObj.USER_EDU_MAJOR&&userObj.USER_EDU_MAJOR.length>0){
			$("#base-info-user-edu-major").text(userObj.USER_EDU_MAJOR);
		}else{
			$("#base-info-user-edu-major").text("").append("<span>&nbsp</span>");
		}		
	}
	/**
	 * 获得用户工作经历
	 */
	function getUserWorkInfo(Uid){
		var data = {};
		data["_PAGE_"]={"SHOWNUM":'3'};

		var temp = {"sId":"SY_ORG_USER_RESUME_FORWORK","pCon":$('#work-info'),"reset":"false","showPageFlag":true,
			"showSearchFlag":"false","showTitleBarFlag":"false","showButtonFlag":false,"links":data,"extWhere":" and user_code='"+Uid+"'","_SELECT_":"substr(RSM_BEGIN_DATE,0,7) ||'~'|| substr(RSM_END_DATE,0,7) JZ_DATE,RSM_COMPANY,RSM_TITLE"};
		var listView = new rh.vi.listView(temp);
		listView.show();
		$("#SY_ORG_USER_RESUME_FORWORK").addClass("list-data-grid");
	}
	/**
	 * 获得用户教育经历
	 */
	function getUserEducationInfo(Uid){
		var data = {};
		data["_PAGE_"]={"SHOWNUM":'3'};
		data["SELECT"]="RSM_BEGIN_DATE";
		var temp = {"sId":"SY_ORG_USER_RESUME_FOREDU","pCon":$('#education-info'),"reset":"false","showPageFlag":true,
			"showSearchFlag":"false","showTitleBarFlag":"false","showButtonFlag":false,"links":data,"extWhere":" and user_code='"+Uid+"'","_SELECT_":"substr(RSM_BEGIN_DATE,0,7) ||'~'|| substr(RSM_END_DATE,0,7) JZ_DATE,RSM_COMPANY,RSM_TITLE"};
		var listView = new rh.vi.listView(temp);
		listView.show();
		$("#SY_ORG_USER_RESUME_FOREDU").addClass("list-data-grid");
	}
	/**
	 * 获得用户奖惩情况
	 */
	function getUserJcInfo(Uid){
		var data = {};
		data["_PAGE_"]={"SHOWNUM":'3'};
		var temp = {"sId":"SY_ORG_USER_REWARD_ALL","pCon":$('#jc-info'),"reset":"false","showPageFlag":true,
			"showSearchFlag":"false","showTitleBarFlag":"false","showButtonFlag":false,"links":data,"extWhere":" and user_code='"+Uid+"'"};
		var listView = new rh.vi.listView(temp);
		listView.show();
		$("#SY_ORG_USER_REWARD_ALL").addClass("list-data-grid");
	}
	
	/**
	 * 绑定个人名片按钮事件
	 * @param {Object} userId 被查看用户ID
	 * @param {Object} userName 被查看用户名
	 */
	function btnBindEvent(userId, userName){
		/**
	 * 绑定即时通讯按钮
	 * @param {Object} event
	 */
		$("#instant-messaging").unbind('click').bind("click", function(event){
			var user_id = userId + "-rhim-server";
			var chat_id = userId + "@rhim.server";
			var user_name1 = userName;
			parent.rhImFunc.showChatArea({
				"id": user_id,
				"jid": chat_id,
				"name": user_name1,
				"status": "online"
			});
		});
		/**绑定发送邮件按钮*/
		$("#send-email").unbind("click").bind("click", function(e){
			window.open("http://staff.zotn.com/");
		});
		/**绑定发送信息按钮*/
		$("#send-phone-msg").unbind("click").bind("click", function(e){
			alert("发送手机短信！");
		});
		/**绑定手机号码“申请”按钮*/
		$("#send-mobile-apply").unbind("click").bind("click", function(e){
			createApply(userId,userName,'phone');
		});
		/**绑定简历“申请”按钮*/
		$("#resume-apply").unbind("click").bind("click", function(e){
			createApply(userId,userName,'sume');
		});

	}
	
	function getDoApplyPanel(){
		var txurl = window.location.href;				
		if(txurl.indexOf('typeNum=2')!=-1){
			var title = "手机号码查看申请处理";
			var applyContent = "USER_MOBILE=1";
			if(txurl.indexOf('USER_RESUME=1')!=-1){
				title = "简历查看申请处理";
				applyContent="USER_RESUME=1"
			}
			var data_id = txurl.substr((txurl.indexOf('DATA_ID')));
			var dataArray = data_id.split("=");
			var applyData = FireFly.byId("SY_COMM_ADDRESS_APPLY", dataArray[1]);
			jQuery("#user-info-to-apply-dialog").remove();
			var dialogId = "user-info-to-apply-dialog"; 
			var winDialog = jQuery("<div style='padding: 5px 5px 5px 5px;'></div>").attr("id", dialogId).attr("title",title);
			winDialog.appendTo(jQuery("body"));
			var bodyWid = jQuery("body").width();
			var hei = 200;
			var wid = 300;
			var posArray = [ 700, 100 ];
			jQuery("#" + dialogId).dialog({
				autoOpen : false,height : hei,width : wid,modal : true,show:"blud",hide:"blue",draggable:true,
				resizable : false,position : posArray,
				buttons: {
					"处理完成": function() {
						var data = {};
						data["APPLY_ID"]=dataArray[1];
						data["APPLY_CONTENT"] = applyContent;

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
			
			jQuery("<div id='dialog-user' style='margin-left:5%'></div>").appendTo(dialogObj);
			jQuery("<hidden id = dialog-user-code></hidden>").val(applyData.USER_CODE).appendTo(dialogObj);

			var usDetail = FireFly.byId("SY_ORG_USER",applyData.USER_CODE);
			var applyusDetail=FireFly.byId("SY_ORG_USER",applyData.APPLY_USER);
			
			jQuery("<div id='dialog-user' style='margin-left:5%'></div>").appendTo(dialogObj);
			jQuery("<hidden id = dialog-user-code></hidden>").val(System.getVar("@USER_CODE@")).appendTo(dialogObj);
			jQuery("<hidden id = dialog-apply-user-code></hidden>").val(applyusDetail.USER_CODE).appendTo(dialogObj);
			$("<ul><li class='user-all-info-lab-li'>申请人："+applyusDetail.USER_NAME+"</li><li class='user-all-info-lab-li'>备注：</li><li><textarea id = 'apply_mark_content' cols='38' rows='6'>"+applyData.APPLY_MARK+"</textarea></li><ul>").appendTo(jQuery("#dialog-user"));
				
		}
	};
	
	function createApply(uid,userName,type){
		var title = "简历查看申请";
		var applyContent = "USER_RESUME=1";
		if(type=='phone'){
			title='手机号码查看申请';
			applyContent = "USER_MOBILE=1";
		}
		jQuery("#user-info-to-apply-dialog").remove();
		var dialogId = "user-info-to-apply-dialog"; 
		var winDialog = jQuery("<div style='padding: 5px 5px 5px 5px;'></div>").attr("id", dialogId).attr("title",title);
		winDialog.appendTo(jQuery("body"));
		var bodyWid = jQuery("body").width();
		var hei = 200;
		var wid = 300;
		var posArray = [ 700, 100 ];
		jQuery("#" + dialogId).dialog({
			autoOpen : false,height : hei,width : wid,modal : true,show:"blud",hide:"blue",draggable:true,
			resizable : false,position : posArray,
			buttons: {
				"发送请求": function() {
					var data = {};
					data['USER_CODE']=jQuery("#dialog-user-code").val();
					data['APPLY_USER']=jQuery("#dialog-apply-user-code").val();
					data["APPLY_CONTENT"] = applyContent;
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
		
		jQuery("<div id='dialog-user' style='margin-left:5%'></div>").appendTo(dialogObj);
		jQuery("<hidden id = dialog-user-code></hidden>").val(uid).appendTo(dialogObj);
		jQuery("<hidden id = dialog-apply-user-code></hidden>").val(System.getVar("@USER_CODE@")).appendTo(dialogObj);
		$("<ul><li class='user-all-info-lab-li'>申请人："+System.getVar("@USER_NAME@")+"</li><li class='user-all-info-lab-li'>备注：</li><li><textarea id = 'apply_mark_content' cols='38' rows='6'></textarea></li><ul>").appendTo(jQuery("#dialog-user"));	
	}

</script>
