/*平台级方法定义(FireFly Platform javascript methods defined)*/
/**
 * 命名空间管理器,定义全局变量，防止命名冲突
 * 如：GLOBAL.namespace("fire.ui");
 * fire.ui = function(){};
 */
var GLOBAL = new Object();
GLOBAL.namespace = function(fullNameSpaceName) {
    var nsArray = fullNameSpaceName.split('.');
    var sEval = "";
    var sNS = ""; 
    var len = nsArray.length;
    for (var i = 0; i < len; i++) {
        if (i != 0) sNS += ".";
        sNS += nsArray[i];
        sEval += "if (typeof(" + sNS + ") == 'undefined') " + sNS + " = new Object();";
    };
    if (sEval != "") eval(sEval);
};
GLOBAL.getUnId = function(id,sId) {//获取sid和id的组合值
    return sId + "-" + id;
};
GLOBAL.setFrameId = function(frameId) {
	GLOBAL.frameId = frameId;
};
GLOBAL.getFrameId = function() {
	return GLOBAL.frameId;
}; 
GLOBAL.defaultFrameHei = document.documentElement.clientHeight - 82;
try {
	GLOBAL.defaultFrameHei = parent.document.documentElement.clientHeight - 82;
} catch(e) {
};
GLOBAL.getDefaultFrameHei = function() {//页面高度-头-tab条高度-容差3px
	if (parent.Cookie.get(GLOBAL.cookieBanner) == "hide") {
		return parent.GLOBAL.defaultFrameHei + 45;
	} else {
		return parent.GLOBAL.defaultFrameHei;
	}
};
GLOBAL.defaultLeftMenuWid = 60;
GLOBAL.defaultRightHomeTabsWid = function() {
    var res = 0;
    var diff = GLOBAL.defaultLeftMenuWid;
	res = jQuery("#pageBody-container").width() - diff;
	return res;
};
GLOBAL.style = {}; //风格样式
GLOBAL.servStyle = {};//服务定义的嵌入html,包括<script>和<link>标签
GLOBAL.cardView = []; //卡片页面对象
/**
 * 首页模板区块对象
 */
var Portal  = {
	temp:{},
	getBlock:function(id) {//获取首页区块对象
		return this.temp[id];
    },
    setBlock:function(id,obj) {//设置首页区块对象
    	this.temp[id] = obj;
    }
};   
/**
 * 系统级变量，包括用户信息和时间信息
 */
var System  = {
	temp:{},
	user:{},
	conf:{},
	parParams:{},
	mb:{},
	tempParams:{},
	style:{},
	getVar:function(data,def) {//
		if (data.indexOf("@") == 0) {
			if (this.temp[data]) {
				return this.temp[data];
			} else if (def) {
				return def;
			} else {
				return this.temp[data];
			}
		} 
		return data;
    },
    getVars:function() {//
		return this.temp;
    },
    setVars:function(data) {//进入列表时获取的系统变量
    	this.temp = data;
    },
    setUser: function(key,value) {    //用户信息，根据userBean获取
    	this.user[key] = value;
    },
    getUser:function(key) {
    	return System.getVar("@" + key + "@");//获取系统变量
    },
    getUserBean:function(){
    	var temp = {};
    	temp.USER_CODE = this.getUser("USER_CODE");
    	temp.TDEPT_CODE = this.getUser("TDEPT_CODE");
    	return temp;
    },
    setConf: function(key,value) {    //用户信息，根据userBean获取
    	this.conf[key] = value;
    },
    getConf:function(key) {
    	return this.conf[key];
    },
    setMB: function(key,value) {    //手机版本信息
    	this.mb[key] = value;
    },
    getMB:function(key) {
    	return this.mb[key];
    },
    setTempParams: function(servId,params) {//作为中间存储临时对象
    	this.tempParams[servId] = params;
    },
    getTempParams:function(servId) {//获取临时对象
    	return this.tempParams[servId];
    },
    setParParams: function(params) {//作为中间存储临时对象
    	this.parParams = params;
    },
    getParParams:function() {//获取临时对象
    	return this.parParams;
    },
    setStyle:function(key,value){
    	this.style[key] = value;
    },
    getStyle:function(key){
    	return this.style[key];
    }
};
/**
 * UI组件工厂类，组件需通过工厂创建，便于维护和设定规范
 */
var UIFactory = new Object();
UIFactory.DEF_PAGE_ID = "__defaultPage";
/**组件仓库 ，存储格式为：
 * uistore = {
 *     "page1":{"id1":obj1,"id2":obj2}
 *     ,"page2":{"id1":obj1,"id2":obj2,"id3":obj3}
 * }
 */
UIFactory.uistore = {};
/**创建组件
 * @param id 必须参数
 * @param pageId 所属页面 非必须参数，为空则系统提供默认值
*/
UIFactory.create = function(elementClass, options) {
        var uicomponent;
        var msgInfo = "";
        //判断要创建的组件参数中是否有id属性。
        if (!options || !options.id) {
            msgInfo = "请为要创建的组件【" + elementClass.CLASS_NAME + "】的id属性设置值。";
            alert("错误信息"+ msgInfo+"error");
            throw new Error(msgInfo);
        }
        //如果组件参数中没有设置pageId属性，使用默认的值。
        if (options) {
            if (!options["pageId"]) {
                options["pageId"] = this.DEF_PAGE_ID;
            }
        }
        //创建组件实例
        //重新设置组件id
        var compUId = options["id"];
        if (options["pid"]) {
            compUId = options["pid"] + "-" + options["id"];
        }
        options["id"] = compUId;
        
        uicomponent = new elementClass(options);
        uicomponent.id = compUId;
        //将组建放到组件仓库中
        UIFactory.storeUI(uicomponent);
        return uicomponent;
};

//销毁组件
UIFactory.destroy = function(uid) {
        jQuery(uid).remove();
};
//从组件仓库中得到组件对象
UIFactory.getUI = function(uid, pageId) {
        var resultObj;
        var page = UIFactory.DEF_PAGE_ID;
        if (pageId && pageId != undefined && pageId != null) {
            page = pageId;
        }
        if (UIFactory.uistore && UIFactory.uistore[page]) {
            resultObj = (UIFactory.uistore[page])[uid];
        }
        return resultObj;
};
//将组建对象放入组件仓库中
UIFactory.storeUI = function(obj) {
        //组件对象页面id
        var pageId = obj.pageId;
        var page = UIFactory.DEF_PAGE_ID;
        if (pageId && pageId != undefined && pageId != null) {
            page = pageId;
        }
        //组件对象id
        var uid = obj.id;
        //组件对象json数据对象
        var uiObj = {};
        if (UIFactory.uistore[pageId]) {
            uiObj = UIFactory.uistore[pageId];
        }
        uiObj[uid] = obj;
        //保存到组件仓库
        UIFactory.uistore[page] = uiObj;
};
UIFactory.removeUI = function(obj) {
        //组件对象页面id
        var pageId = obj.pageId;
        //组件对象id
        var uid = obj.id;
        //从组件仓库中删除组件
        delete UIFactory.uistore[pageId][uid];
};
UIFactory.removeAll = function(pageId) {
        if (pageId) {
            delete UIFactory.uistore[pageId];
        } else {
            delete UIFactory.uistore[UIFactory.DEF_PAGE_ID];
        }
};
function toJumpPage() {
    var loginUrl = FireFly.getContextPath();
    if (loginUrl.length == 0) {
        loginUrl = "/";
    }
    Tools.redirect(loginUrl);
}
function loginJuge(resultData) {
	if(typeof(resultData) == "string"){
		_checkSessionTimeoutMsg(resultData);
	}else if (resultData.msg) {
		var msg = resultData.msg;
		_checkSessionTimeoutMsg(msg);
	}
}

function _checkSessionTimeoutMsg(msg){
	if (msg.indexOf("var login = \"LOGIN\";") > 0) {
		Tip.showError("系统超时，需要重新登录！",true);
		var servName = "";
		var pos = msg.indexOf("//####") ;
		if(pos > 0){
			servName = msg.substring(pos + 6);
			pos = servName.indexOf("####");
			servName = servName.substring(0,pos);
		}
		alert("系统超时，需要重新登录(" + servName + ")");
		var temp = msg.replace(/<script>/g,"").replace(/<\/script>/g,"");
		eval(temp);	
		throw new Error("系统超时，需要重新登录！");
	}	
}


/**
 * ajax返回结果的提示信息处理
 * @param ajaxUrl
 */
function rh_processMsg(resultData,tipFlag) {
   loginJuge(resultData);
   if (resultData[UIConst.RTN_MSG]) {
    	var tip = resultData[UIConst.RTN_MSG];
    	var time = resultData[UIConst.RTN_TIME] + "秒";
        if (tip.indexOf(UIConst.RTN_OK) == 0) {
	    	if (tip == UIConst.RTN_OK) {
	            tip = "操作成功！";
	    	} else {
	    		tip = tip.substring(3);
	    	}
		   	Tip.show(tip + time,tipFlag);
	    } else if (tip.indexOf(UIConst.RTN_ERR) == 0) {
	    	if (tip == UIConst.RTN_ERR) {
	            tip = "操作错误！";
	    	} else {
	    		tip = tip.substring(6);
	    	}
	   	    Tip.showError(tip,tipFlag);
	    } else if (tip.indexOf(UIConst.RTN_WARN) == 0) {
	    	if (tip == UIConst.RTN_ERR) {
	            tip = "警告提示！";
	    	} else {
	    		tip = tip.substring(5);
	    	}
	    	Tip.showAttention(tip,tipFlag);
	    } else {
	    	Tip.showError("操作失败！",tipFlag);
	    	Debug.add(tipFlag);
	    	return false;
	    } 
    }
};
/**
 * 通过ajax方式取得后台数据
 * @param ajaxUrl
 * 参数：请求url地址
 * @param params
 * 参数：请求参数数据
 * @param func 异步执行的方法
 * @return
 * 返回值：JSON数据对象
 */
function rh_processData(ajaxUrl,queryParams,tipFlag,async,func) {
    var resultData = new Object();
    var params = jQuery.extend({}, queryParams, {expando:jQuery.expando});
    var tempasync = false;
    if (async) {
    	tempasync = async;
    }
    ajaxUrl = FireFly.getContextPath() + "/" + ajaxUrl;
    jQuery.ajax({
        type:"post",
        url:encodeURI(ajaxUrl),
        dataType:"json",
        data:params,
        cache:false,
        async:tempasync,
        timeout:60000,
        success:function(data) {
            resultData = {};
            resultData = data;
            if (typeof data === "string") {//判断返回数据类型
                resultData = jQuery.parseJSON(data);
            }
            if (tipFlag == false) {
            } else {
	            rh_processMsg(resultData,tipFlag);
            }
            
            if(func) {
            	func.call(this, resultData);
            }
        },
        error:function(err) {
            resultData = {};
            resultData.exception = err;
            resultData.msg = err.responseText || "error";
            if (window.plugins) {//如果app状态
            	appAjaxTip();
            	return false;
            }
            if(loginJuge(resultData) == true) {
            	return false;
            } else {
            	Debug.add(resultData.msg);
            	throw new Error(resultData.msg);
            }
        }
    });
    return resultData;
};
/**
* 卡片保存调用，替换格式
*/
function rh_saveData(ajaxUrl,dataParams) {
    var resultData = {};
    var params = jQuery.extend({}, dataParams);
    jQuery.ajax({
        type:"post",
        url:ajaxUrl,
        dataType:"json",
        data:params,
        cache:false,
        async:false,
        timeout:60000,
        success:function(data) {
            resultData = {};
            resultData = data;
            if (typeof data === "string") {//判断返回数据类型
                resultData = jQuery.parseJSON(data);
            }
            rh_processMsg(resultData); 
        },
        error:function(err) {
            resultData = {};
            resultData.exception = err;
            resultData.msg = err.responseText || "error";
            //showQQTip("【" + ajaxUrl + "】" + err.responseText,"取得后台数据出错",{width:600,height:200});
            throw new Error(resultData.msg);
        }
    });
    return resultData;
};
/**
 * json的内容中特殊转义
 */
function rhJsonEncode(data){   
    return data.replace(/\\/g,'\\\\').replace(/(\r)|(\n)/g, "\\n").replace(/"/g,'\\"'); 
}
/**
 * html的内容中特殊转义
 */
function rhHtmlEncode(data){   
    return data.replace(/"/g, "&quot;");
}
/**
 * 列表查询调用
 */
function listQueryData(postUrl,dataParams) {
    var resultData = {};
    var str = encodeURIComponent(jQuery.toJSON(dataParams));//json格式转字符串
//    jQuery.ajaxSetup({async: false});
//    jQuery.post(postUrl + "?data=" + str, "",function(data){
//        resultData = data;
//        if (typeof data === "string") {
//            resultData = jQuery.parseJSON(data);
//        }
//    }, "json");
//    if (resultData[UIConst.RTN_MSG]) {
//    	Tip.showError(resultData["_MSG_"],true);
//    }
    
    jQuery.ajax({
  	   type: "POST",
  	   url: postUrl,
  	   async: false,
  	   data: "data=" + str,
  	   success: function(data){
  	        resultData = data;
  	        rh_processMsg(resultData,true);
  	        
  	        if (typeof data === "string") {
  	            resultData = jQuery.parseJSON(data);
  	        }
  	   },error:function(err) {
  	
  		   throw new Error(err.responseText || "系统错误");
  	   }
      });
    
    return resultData;
};
/**
 * 拼串方式的提交数据，可嵌套两层
 * 如data={'ADDFILE':[{'123':'qwe'},{'345':'tyu'}},'CODE':'uiop']}
 */
function fixSaveData(postUrl,dataParams,callback,tipFlag,async) {
    var resultData = {};
    var str = [];
    var paStr = "data=" + encodeURIComponent(jQuery.toJSON(dataParams));
    var defAsync = false;
    if (async) {
    	defAsync = async;
    }
    jQuery.ajax({
	   type: "POST",
	   url: postUrl,
	   async: defAsync,
	   data: paStr,
	   success: function(data){
	        resultData = data;
	        if (typeof data === "string") {
	            resultData = jQuery.parseJSON(data);
	        }
	        if (tipFlag != false) {
	        	tipFlag = true;
		        rh_processMsg(resultData,tipFlag);	
	        }
	        if (callback) {
	        	callback.call(this);	
	        }
	   }
    });
    return resultData;
};
/* 打印模版 post请求 打印支持IE浏览器
 * @param  servid 服务id
 * @param servSrcId 引用自服务id
 * @param dataId 打印表单主键id
 * @param content 打印表单内容
 */
function openPostWindow(servid, servSrcId,dataId,content) {
	var tempForm = document.createElement("form");
	tempForm.id = "tempForm1";
	tempForm.method = "post";
	tempForm.target = "newPage";
	tempForm.action = "/sy/comm/print/doPrint2.jsp"; // 在此处设置你要跳转的url

	var hiddInput_id = document.createElement("input");
	hiddInput_id.type = "hidden";
	hiddInput_id.name = "servId";
	hiddInput_id.value = servid;
	tempForm.appendChild(hiddInput_id);

	var hiddInput_servSrcId = document.createElement("input");
	hiddInput_servSrcId.type = "hidden";
	hiddInput_servSrcId.name = "servSrcId";
	hiddInput_servSrcId.value = servSrcId;
	tempForm.appendChild(hiddInput_servSrcId);

	var hiddInput_dataId = document.createElement("input");
	hiddInput_dataId.type = "hidden";
	hiddInput_dataId.name = "dataId";
	hiddInput_dataId.value = dataId;
	tempForm.appendChild(hiddInput_dataId);

	var hiddInput_content = document.createElement("input");
	hiddInput_content.type = "hidden";
	hiddInput_content.name = "Content";
	hiddInput_content.value = content;
	tempForm.appendChild(hiddInput_content);
	tempForm.attachEvent("onsubmit", function() {
			});
	document.body.appendChild(tempForm);
	tempForm.fireEvent("onsubmit");
	// 将form的target设置成和windows.open()的name参数一样的值，通过浏览器自动识别实现了将内容post到新窗口中
	tempForm.submit();
	document.body.removeChild(tempForm);
};
/**
 * firefly对象,平台级缓存和与后台交互方法
 */
var FireFly = {
	jsessionid:"",
	servMainData:"SERV_MAIN_DATA",
	servListData:"SERV_LIST_DATA",
	dictData:"DICT_DATA",
	contextPath:FireFlyContextPath,//inHearder.jsp里定义的系统变量
	/**
     * firefly级缓存变量，获取缓存和设置缓存的方法
     * serv:方法名
     * key：键
     * value：值
     */
    cache : {},
    setCache:function(serv,key,value) {
    	FireFly.cache[serv + "-" + key] = value;
    },
    getCache:function(serv,key) {
    	if (FireFly.cache[serv + "-" + key]) {
    		
    	} else {
    		if (key == FireFly.servMainData) {
    			return FireFly.getServMainData(serv);
    		} else if (key == FireFly.dictData) {
    			return FireFly.getDict(serv);
    		}
    	}
    	return FireFly.cache[serv + "-" + key] || null;
    },    
    /**
     * 根据id取得功能单条记录
     * @param sId 参数：功能编码
     * @param id 参数：主键
     * @param param 参数：扩展参数
     */
    byId: function(sId,id,param){
        var ajaxUrl = sId + ".byid.do";
        if (id) {
        	ajaxUrl += "?" + UIConst.PK_KEY + "=" + id;
        }
        return rh_processData(ajaxUrl,param);
    },
    byIdParam: function(urlParam){
        return rh_processData(urlParam);
    },
    cardModify: function(sId,data) {
    	var url = sId + ".save.do";
    	return fixSaveData(url,data);
    },
    cardAdd: function(sId,data) {
    	var url = sId + ".save.do";
    	return fixSaveData(url,data);
    },
    batchSave: function(sId,data,callback,tipFlag,async) {
    	var url = sId + ".batchSave.do";
    	return fixSaveData(url,data,callback,tipFlag,async);
    },
    listDelete: function(sId,data,tipFlag) {
    	var url = sId + ".delete.do";
    	return rh_processData(url,data,tipFlag);	
    },
    listExp: function(sId,data) {
    	var url = sId + ".exp.do";
    	return rh_processData(url,data,false,true);	
    },
    getServMainData: function(sId) {
    	var url = sId + ".serv.do";
    	var data = {};
    	var result = rh_processData(url,data);
    	FireFly.setCache(sId,this.servMainData,result);
    	//System.setVars(result.VARS);
    	return result;
    },
    getListData: function(sId,datas) {
    	var url = sId + ".query.do";
    	var data = {};//{"_PAGE_":{"SHOWNUM":"30","PAGES":"2","ALLNUM":"60","NOWPAGE":"1"}};
		data = datas;	
    	var result = listQueryData(url,data);
    	//FireFly.setCache(sId,this.servListData,result);
    	return result;
    },
    getPageData: function(sId,datas) {
    	var url = sId + ".query.do";
    	var result = listQueryData(url,datas);
    	//FireFly.setCache(sId,this.servListData,result);
    	return result;
    },
    getMenu: function() {
        var ajaxUrl = "SY_COMM_INFO.menu.do";
        var data = {}
        return rh_processData(ajaxUrl,data);
    },
    getDeskIcons: function() {
        var ajaxUrl = "SY_COMM_DESK.query.do";
        var data = {"_SELECT_":"*"}
        return rh_processData(ajaxUrl,data);
    },
    getCardFile: function(sId,dataId,itemCode) {
        var ajaxUrl = "SY_COMM_FILE.finds.do";
        var data = {}
        data["SERV_ID"] = sId;
        data["DATA_ID"] = dataId;
        if (itemCode && itemCode.length > 0) {
        	data["FILE_CAT"] = itemCode;
        }
        
        return rh_processData(ajaxUrl,data)._DATA_;
    },
    getDict: function(dictCode,pid,extWhere,level,showPid,params) {
        var ajaxUrl = "SY_COMM_INFO.dict.do";
        var data = {'DICT_ID':dictCode};
        if (pid) {
        	data["PID"] = pid;
        	dictCode = dictCode + "-" + pid;
        }
        if (extWhere) {
        	data["_extWhere"] = extWhere;
        }
        if (level) {
        	data["LEVEL"] = level;
        	dictCode = dictCode + "-" + level;
        }
        if (showPid) {
        	data["SHOWPID"] = true;
        	dictCode = dictCode + "-" + showPid;
        }
        if (params) {
        	data["PARAMS"] = params;
        	ajaxUrl += "?" + jQuery.param(params);
        }
        var res = rh_processData(ajaxUrl,data);
        var temp = [];
        var tempJ = {};
        
        tempJ["ID"] = res.DICT_ID;
        tempJ["NAME"] = res.DICT_NAME;
        tempJ["CHILD"] = res.CHILD;
        
        temp[0] = tempJ;
        FireFly.setCache(dictCode,FireFly.dictData,temp);
        return temp;
    },
    doActObject: function(sId,aId,data,callback,tipFlag,async) {
        var url = sId + "." + aId + ".do";
        return fixSaveData(url,data,callback,tipFlag,async);
    },
    doAct: function(sId,aId,data,tipFlag,async,func) {
        var ajaxUrl = sId + "." + aId + ".do";
        var datas = data || {}
        return rh_processData(ajaxUrl,datas,tipFlag,async,func);
    },
    doFormAct: function(serv, act, data, target) {
    	var formId = "__submitform";
    	var form = document.getElementById(formId);
    	if (form == null) {
    		form = document.createElement("form");
    		form.id = formId;
    		form.style.display = "none";
    		document.body.appendChild(form);
    		form.method = 'post';
    		//使用utf-8
    		form.acceptCharset = "UTF-8";
    		if (!+[1,]) {
    			//让IE支持acceptCharset
    			var el = document.createElement("input");
    			el.setAttribute("name", "_charset_");
    			el.setAttribute("value", "?");
    			form.appendChild(el);
    		}
    	} else {
    		form.innerHTML = "";
    	}
    	form.action = serv + "." + act + ".do";
    	if (target == undefined) {
    		target = "_blank";
    	}
    	form.target = target;
    	var el = document.createElement("input");
    	el.setAttribute("id", formId + "data");
    	el.setAttribute("name", "data");
    	el.setAttribute("type", "hidden");
    	form.appendChild(el);
    	document.getElementById(formId + "data").value = jQuery.toJSON(data);
    	form.submit();
    	//jQuery("#"+formId).remove();
    },
    getPortal: function(sId,data) {//待删
        var ajaxUrl = sId + ".portalList.do";
        var datas = data || {}
        return rh_processData(ajaxUrl,datas,false);
    },
    login: function(userCode, pwd, cmpyCode) {
    	var params = {
    		loginName: userCode,
    		password: pwd,
    		cmpyCode: cmpyCode
    	};
    	return FireFly.doAct("SY_ORG_LOGIN","login",params,false); 
    },
    logout: function() {
    	var ajaxUrl = "SY_ORG_LOGIN.logout.do"
    	var data = {};
        return rh_processData(ajaxUrl,data,false);
    },   
    getContextPath: function() {
        return FireFly.contextPath;
    },
    getHttpHost: function() {
        return window.location.protocol + "//" + window.location.host;
    },
    /**
	 * 根据code匹配字典数据
	 * @param dict 字典数组 对象
	 * @param code 以逗号分隔的编码串，如:A,B
	 * 返回:逗号分隔的名称串，如：部门1,部门2
	 */
	getDictNames : function(dict, code) {
		var names = "";
		var len = dict.length;
		for(var i = 0; i < len; i++) {
			if(code == dict[i]["ID"]) {// 找到了
				if(names == "") {
					names += dict[i]["NAME"];
				} else {
					names += "," + dict[i]["NAME"];
				}
				return names;
			}
			
			if(dict[i]["CHILD"]) {// 字典数组
				names += this.getDictNames(dict[i]["CHILD"], code);	
			}
		}
		return names;
	},
	/**
	 * 获取服务的名称
	 * @param sId 服务ID
	 */
	getServName : function (sId) {
		var res = FireFly.getCache("SY_SERV", FireFly.dictData)[0];
		var returnValue = "";
		var len = res.CHILD.length;
		var i = 0;
		for (i; i < len; i++) {
			if (res.CHILD[i].ID == sId) {
				returnValue = res.CHILD[i].NAME;
				break;
			}
		}
		return returnValue;
	},
	/**
	 * 获取公司的名称
	 * @param cmpyCode  公司编码
	 */
	getCmpyName :function (cmpyCode) {
		if (!cmpyCode) {
			return "unknow";
		}
		var res = FireFly.getCache("SY_ORG_CMPY_LIST", FireFly.dictData)[0];
		var returnValue = "";
		var len = res.CHILD.length;
		var i = 0;
		for (i; i < len; i++) {
			if (res.CHILD[i].ID == cmpyCode) {
				returnValue = res.CHILD[i].NAME;
				break;
			}
		}
		return returnValue;
	},
	getCurUser: function() {
		return {"limitAmDateLine":""};
	},
	createZotnClient : function() { // 生成zotn控件用于上传下载文件
		var zotnClient = "<OBJECT ID=\"ZotnClient\" " +
			"width=\"1\" height=\"1\" name=\"ZotnClient\" " +
			"CLASSID=\"clsid:1109D74E-5427-465E-BDC3-261BC5ED3C55\" " +
			"codebase=\"" + FireFly.getContextPath() + "/sy/util/stylus/ZotnClientLib2.CAB#version=2,0,0,17\">" +
			"</OBJECT>";
		jQuery("body").append(zotnClient);
	},
	getZotnClient : function() {
		if (document.all) {
			var ZotnClient  = document.all("ZotnClient");
			if (ZotnClient && ZotnClient.IpAddress) {
				ZotnClient.showRevisionForEdit = 1;
				ZotnClient.protectedTypeForRead = 1;
				ZotnClient.EditorWordTypes = "doc,docx";
				return ZotnClient;
			} 
		}
		return null;
	},
	getHostURL : function() {
		return window.location.protocol + '//' + window.location.host;
	},
	getConfig : function(key) {
		var ajaxUrl = "SY_COMM_CONFIG.finds.do";
		var data = {"CONF_KEY":key};
		var result = rh_processData(ajaxUrl,data,false)._DATA_;
		if (result && result.length > 0) {
			return result[0];
		}
        return undefined;
	},
	/**
	 * 调用打印JSP
	 * @param servId  服务ID         
	 * @param servSrcId 引用自服务ID，用于获取附件       
	 * @param dataId  需要打印的表单的数据ID       
	 */
	doPrint : function(servId, servSrcId, dataId) {
		if(dataId){
		var data = {};
		data["_WHERE_"] = " and SERV_ID ='" + servId + "'";
		var out = FireFly.doAct("SY_COMM_PRINT_TMPL", "finds", data);
		var ftlcontent = out["_DATA_"];
		var content = "";
		for (var i = 0; i < ftlcontent.length; i++) {
			var ser = ftlcontent[i]
			content = ser["PT_CONTENT"];
		}
		openPostWindow(servId, servSrcId, dataId,content);
		}
	},
	/**
	 * 跳转到登录页面的前端方法
	 */
	jumpToIndex : function() {
//		function getRootPath(){
//			var strFullPath=window.document.location.href;
//			var strPath=window.document.location.pathname;
//			var pos=strFullPath.indexOf(strPath);
//			var prePath=strFullPath.substring(0,pos);
//			var postPath=strPath.substring(0,strPath.substr(1).indexOf('/')+1);
//			return(prePath+postPath);
//		}
//		var url = "";
//		if (url.length == 0) {
//		    url = getRootPath() + "/";
//		}
		self.parent.window.location.href = FireFlyContextPath + "/"; 
	}
}