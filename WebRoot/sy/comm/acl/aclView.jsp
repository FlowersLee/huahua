<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ page import="com.rh.core.base.Bean"%>
<%@ page import="com.rh.core.util.Constant"%>
<%@ page import="com.rh.core.util.JsonUtils"%>
<%@ include file="/sy/base/view/inHeader.jsp"%>
<%
	Bean outBean = (Bean)request.getAttribute(Constant.RTN_DISP_DATA);
	Bean[] beans = (Bean[]) outBean.get("BEANS");
	Bean roles = null;// 角色
	Bean depts = null;// 部门 (dept & user)
	Bean menus = null;// 菜单 (menu & act)
	if(beans != null && beans.length >= 3 ) {
		roles = beans[0];
		depts = beans[1];
		menus = beans[2];
	}
	
	String rolesJson = JsonUtils.toJson(roles);
	
	String deptsJson = JsonUtils.toJson(depts);
	
	String menusJson = JsonUtils.toJson(menus);
	String cmpyCode = outBean.getStr("CMPY_CODE");
%>
<title>权限管理</title>
<style type="text/css">
	#acl_container {height:600px;}
	#acl_bottom{width:100%;}
	#acl_left{float:left;overflow:scroll;background-color:white;margin-left:10px;height:530px;border:1px solid #ccc;}
	#acl_right {float:left;overflow:scroll;background-color:white;margin-left:10px;height:530px;border:1px solid #ccc;}
</style>
<script type="text/javascript">
	jQuery(function(){
		caclWidth();
		// 计算宽度
		function caclWidth() {
			var left = 300;
			var other = 30;
			var width = jQuery("#acl_container").outerWidth();
			jQuery("#acl_left").css({"min-width":left + "px"});
			if (jQuery.browser.msie) {
				jQuery("#acl_right").width(width - left - other - 40 + "px");
			} else {
				jQuery("#acl_right").width(width - left - other - 40 + "px");
			}
		}
		
		var orgNode;
		var orgAclList = [];
		// 获取需要删除的节点的ID数组
		function getDeleteNodes() {
			var nodes = menusTree.getCheckedNodes();
			// 过滤出被删除的
			return jQuery.grep(orgAclList, function(item) {
				var bool = true;
				jQuery.each(nodes, function(index, node){
					if(item.SERV_ID == node.ID) {// 过滤掉
						bool = false;
						return;
					}
				});
				return bool;
			});
		}
		// 获取需要添加的节点的ID数组
		function getAddedNodes() {
			var nodes = menusTree.getCheckedNodes();
			// 过滤出被删除的
			return jQuery.grep(nodes, function(node) {
				if(node.ID == "root") {
					return false;
				}
				var bool = true;
				jQuery.each(orgAclList, function(index, item){
					if(node.ID == item.SERV_ID) {
						bool = false;
						return;
					}
				});
				return bool;
			});
		}
		/*
		*	注册按钮点击事件
		*/
		jQuery("#acl_save").click(function() {// 保存修改
			if(!orgNode) {
				Tip.showError("请选择要授权的对象！", true);
				return;
			} else if(orgNode == "ROOT") {
				Tip.showError("不能对根节点授权！", true);
				return;
			}
			var ids = "";// 删除节点ID构成的字符串
			var _deleteNodes = getDeleteNodes();
			if(_deleteNodes.length > 0) {// 需要删除
				var deleteIDs = [];// 删除节点ID数组
				jQuery.each(_deleteNodes, function(index, node){
					deleteIDs.push(node.ACL_ID);
				});
				if(deleteIDs.length > 0) {
					ids = deleteIDs.join(",");
				}
			}
			var addedNodes = [];// 添加节点数组
			var _addedNodes = getAddedNodes();
			var ACL_OWNER = orgNode.ID;
			var ORU_NAME = orgNode.NAME;
			var ACL_OTYPE = orgNode.OTYPE ? orgNode.OTYPE : 1;
			if(_addedNodes.length > 0) {// 需要添加
				jQuery.each(_addedNodes, function(index, node){
					var SERV_ID = node.ID.split("-_-")[0];
					var ACT_CODE = node.ID.split("-_-")[1] ? node.ID.split("-_-")[1] : "";
					var ACL_TYPE = node.ATYPE;
					addedNodes.push({"SERV_ID":SERV_ID,"ACT_CODE":ACT_CODE,"ACL_TYPE":ACL_TYPE,"ACL_OWNER":ACL_OWNER,"ORU_NAME":ORU_NAME,<%if (cmpyCode.length() > 0) {%>"S_CMPY":"<%=cmpyCode%>",<%}%>"ACL_OTYPE":ACL_OTYPE});
				});
			}
			var resultData;
			if(ids.length > 0 || addedNodes.length > 0) {
				var params = {};
				params["ACL_OTYPE"] = "" + ACL_OTYPE;
				params["ACL_OWNER"] = ACL_OWNER;
				if (ids.length > 0) {
					params["BATCHDELS"] = ids;
				}
				if (addedNodes.length > 0) {
					params["BATCHDATAS"] = addedNodes;
				}
				resultData = FireFly.batchSave("SY_ORG_ACL", params, callback);
			} else {// 没有变化
				Tip.showError("权限没有任何改变！", true);
			}
			// 提示
			if (resultData) {
				if (resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK) >= 0) {
					Tip.show(resultData[UIConst.RTN_MSG].substr(resultData[UIConst.RTN_MSG].indexOf(UIConst.RTN_OK)), true);
				} else {
					Tip.showError(resultData[UIConst.RTN_MSG], true);
				}
			}
		});
		
		function callback(){
			// 更新orgAclList
			if(orgNode.__TYPE__ == "DEPT") {// 部门
				jQuery("#" + deptsTree.getId() + "_" + orgNode.ID.replace(/[^\w]/gi, "_")).click();
			} else {
				jQuery("#" + rolesTree.getId() + "_" + orgNode.ID.replace(/[^\w]/gi, "_")).click();
			}
		}
		
		var rolesSetting = {// 角色树的配置
            theme: "bbit-tree-no-lines", //bbit-tree-lines ,bbit-tree-no-lines,bbit-tree-arrows
            rhexpand: false,
            onnodeclick: function(item) {
            	deptsTree.collapsedTree();
            	if(item.ID == "root") {
            		orgNode = "ROOT";
            	} else {
            		orgNode = item;
                	orgNode.__TYPE__ = "ROLE";// 保存住类型
            		$.ajax({
                        type: "POST",
                        url: "SY_ORG_ACL.showAcl.do",
                        data: {ocode:item.ID,otype:1,"CMPY_CODE":"<%=cmpyCode%>"},
                        async: true,
                        success: function(data){
                        	// 保存一开始的ACL
                        	orgAclList = StrToJson(data).aclList;
                        	// 清除选中,收起整棵树
                        	menusTree.clean();
                        	// 选中所有具有的ACL
                        	jQuery.each(orgAclList, function(index, item){
                        		menusTree.checkNode(item.SERV_ID);
                        	});
                        	// 展开有子节点被选中的节点
                        	menusTree.expandParent();
                        },
                        error: function(e) {alert("error occur!");}
                    });
            	}
			}
        };
		rolesSetting.data = [{"NAME":"角色列表","isexpand":true,"PID":"","ID":"root","CHILD":[]}];// 设置树的初始化数据
		rolesSetting.data[0]["CHILD"] = <%out.print(rolesJson);%>["CHILD"];
		var rolesTree = new rh.ui.Tree(rolesSetting);
        $("#acl_roles").append(rolesTree.obj); 
		
        var deptsSetting = {// 组织机构树的配置 
            theme: "bbit-tree-no-lines", //bbit-tree-lines ,bbit-tree-no-lines,bbit-tree-arrows
            rhexpand: false,
            url: "SY_COMM_INFO.dict.do",
            dictId : "SY_ORG_DEPT_USER",
            onnodeclick: function(item) {
            	rolesTree.collapsedTree();
            	if(item.ID == "root") {
            		orgNode = "ROOT";
            	} else {
            		orgNode = item;
                	orgNode.__TYPE__ = "DEPT";// 保存住类型
            		$.ajax({
                        type: "POST",
                        url: "SY_ORG_ACL.showAcl.do",
                        data: {ocode:item.ID,otype:item.OTYPE,"CMPY_CODE":"<%=cmpyCode%>"},
                        async: true,
                        success: function(data){
                        	// 保存一开始的ACL
                        	orgAclList = StrToJson(data).aclList;
                        	// 清除选中,收起整棵树
                        	menusTree.clean();
                        	// 选中所有具有的ACL
                        	jQuery.each(orgAclList, function(index, item){
                        		menusTree.checkNode(item.SERV_ID);
                        	});
                        	// 展开有子节点被选中的节点
                        	menusTree.expandParent();
                        },
                        error: function(e) {alert("error occur!");}
                    });
            	}
   			}
        };
        deptsSetting.data = [{"NAME":"部门列表","isexpand":true,"PID":"","ID":"root","CHILD":[]}]
        deptsSetting.data[0]["CHILD"] = <%out.print(deptsJson);%>["CHILD"];// 设置树的初始化数据
        var deptsTree = new rh.ui.Tree(deptsSetting);
        $("#acl_depts").append(deptsTree.obj);
        
        var menusSetting = {// 菜单树的配置
           	showcheck: true,  
            theme: "bbit-tree-no-lines", //bbit-tree-lines ,bbit-tree-no-lines,bbit-tree-arrows
            rhexpand: false,
            cascadecheck: true,
            checkParent: true,
            onnodeclick: false
        };
        menusSetting.data = [{"NAME":"菜单列表","isexpand":true,"PID":"","ID":"root","showcheck":false,"CHILD":[]}]
        menusSetting.data[0]["CHILD"] = <%out.print(menusJson);%>["CHILD"];// 设置树的初始化数据
        var menusTree = new rh.ui.Tree(menusSetting);
        $("#acl_menus").append(menusTree.obj);
        
        jQuery("#closeAclPage").click(function(){ // 关闭权限管理页面
        	Tab.close();
        });
        // 设置父iframe的高度
        Tab.setFrameHei(680);
	});
</script>
<body class="bodyBack bodyBackPad bodyBack-27">
	<div class="conHeader">
		<div class="conHeaderTitle rh-right-radius-head">
			<span class="conHeaderTitle-span">权限管理</span>
			<span class="conHeanderTitle-refresh" id="closeAclPage">返回</span>
		</div>
	</div>
	<div class="content rh-bottom-right-radius" id="acl_container">
		<div class="rhGrid-btnBar">
			<a class="rh-icon rhGrid-btnBar-a" id="acl_save">
				<span class="rh-icon-inner">保存</span>
				<span class="rh-icon-img btn-save"></span>
			</a>
		</div>
		<div class="acl">
			<div id="acl_left">
				<div id="acl_roles"></div>
				<div id="acl_depts"></div>
			</div>
			<div id="acl_right">
				<div id="acl_menus"></div>
			</div>
		</div>
	</div>
	
</body>