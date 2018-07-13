<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>节点定义</title>
<%@ include file= "../../sy/base/view/inHeader.jsp" %>
<link rel="stylesheet" type="text/css" href="<%=urlPath %>/sy/theme/default/wfe.css"/>
<script type="text/javascript" src="<%=urlPath %>/sy/base/frame/tools.js"></script>
<script type="text/javascript" src="<%=urlPath %>/sy/wfe/nodeJs.js"></script>
</head>
<body>
<div>
<div id="tabs" class="rhCard-tabs ui-tabs ui-widget ui-widget-content ui-corner-all">
	<ul class="tabUL ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-corner-all">
		<li style="float:left"><a href="#tabs-1">基本信息</a></li>
		<li style="float:left"><a href="#tabs-2">组织/资源</a></li>
		<!--<li style="float:left"><a href="#tabs-3">完成提醒</a></li>-->
		<li class="fl"><a href="#tabs-6">操作权限</a></li>
		<li class="fl"><a href="#tabs-4">数据权限</a></li>
		<li class="fl"><a href="#tabs-8">数据更新</a></li>
		<li class="fl"><a href="#tabs-5">文件权限</a></li>
		<li class="fl"><a href="#tabs-7">自定义变量</a></li>
		<li class="fl"><a href="#tabs-9">超时设置</a></li>
	</ul>
	<div id="tabs-1" class="ui-form-default">
		<fieldset>
		<legend>基础信息：</legend>	
		<table border=0 width="100%">
		<tr>
			<td class="tr wp15">节点编码</td>
			<td class="wp35"><input type="text" id="NODE_CODE" name="NODE_CODE" class="wp50" value="" disabled></td>		
			<td width="15%" class="tr wp15">节点类型</td>
			<td class="wp35">
				<select id="NODE_TYPE" name="NODE_TYPE" disabled>
					<option value="1">起草</option>
					<option value="2">活动</option>
					<option value="3">结束</option>
				</select>
			</td>	
		</tr>
		<tr>
			<td class="tr">节点名称</td>
			<td><input type="text" id="NODE_NAME" name="NODE_NAME" class="wp50" value=""><input type="hidden" id="NODE_SORT" name="NODE_SORT" size=1 value=""><input type="hidden" id="NODE_CAPTION" name="NODE_CAPTION" size=1 value=""></td>
			<td class="tr">自动结束</td>
			<td><input type="checkbox" id="NODE_IF_AUTOEND" name="NODE_IF_AUTOEND" value=""></td>
		</tr>		

		<tr>
			<!--td class="tr">并发节点</td>
			<td><input type="checkbox" id="NODE_IF_PARALLEL" name="NODE_IF_PARALLEL" value="" disabled></td-->	
			<td class="tr">合并节点</td>
			<td><div><input type="checkbox" id="NODE_IF_CONVERGE" name="NODE_IF_CONVERGE" value=""></div></td>				
		</tr>

		<tr>
			<td class="tr">结束流程</td>
			<td><input type="checkbox" id="PROC_END_FLAG" name="PROC_END_FLAG" value=""></td>	
			<td class="tr">结束按钮名</td>
			<td><input type="text" id="PROC_END_NAME" name="PROC_END_NAME" class="wp50" value=""><input type="hidden" id="NODE_SUB_PROC" name="NODE_SUB_PROC" size=1 value=""></td>	
		</tr>	
		
		<tr>
			<td class="tr">节点描述</td>
			<td colspan="3"><textarea type="text" id="NODE_MEMO" name="NODE_MEMO" class="wp75" rows="3" value=""></textarea></td>	
		</tr>		
		
		</table>
		</fieldset>
		
		<fieldset>
		<legend>意见信息：</legend>			
		<table border=0 cellSpacing=1 width="96%" cellPadding=0 class='list_table ml15'>
		<thead>
			<tr>
				<td width="10%">意见类型</td>
				<td width="30%">意见名称</td>
				<td width="10%">必填</td>
				<td width="50%">过滤条件</td>
			</tr>
		</thead>
		<tr>
			<td class="tl">普通意见</td>
			<td align="left">
			<input type="text" id="MIND_CODE__NAME" class="wp73" readonly value="" >
			<input type="hidden" id="MIND_CODE" value="" >
			<a href="#" onclick="openMindTypeCode('MIND_CODE')">选择</a>&nbsp;<a href="#" onclick="cancelSelect('MIND_CODE')">取消</a>
			</td>	
			<td><input type="checkbox" id="MIND_NEED_FLAG" name="MIND_NEED_FLAG" value=""></td>
			<td align="left"><input type="text" id="MIND_SCRIPT" value="" class="wp"></td>
		</tr>
		<tr>
			<td class="tl">固定意见</td>
			<td align="left">
			<input type="text" class="wp73" id="MIND_REGULAR__NAME" name="MIND_REGULAR__NAME"  value="">
			<input type="hidden" id="MIND_REGULAR" name="MIND_REGULAR" value="">
			<a href="#" onclick="openMindTypeCode('MIND_REGULAR',' and REGULAR_TYPE = 1 ')">选择</a>&nbsp;<a href="#" onclick="cancelRegular('MIND_REGULAR')">取消</a></td>
			<td><input type="checkbox" id="MIND_REGULAR_MUST" name="MIND_REGULAR_MUST" value=""></td>
			<td align="left"><input type="text" id="MIND_REGULAR_SCRIPT" value="" class="wp"></td>			
		</tr>
		<tr>
			<td class="tl">部门最终意见</td>
			<td align="left">
				<input type="text" class="wp73" id="MIND_TERMINAL__NAME" value="">
				<input type="hidden" id="MIND_TERMINAL" value="" >
				<a href="#" onclick="openMindTypeCode('MIND_TERMINAL')">选择</a> <a href="#" onclick="cancelSelect('MIND_TERMINAL')">取消</a></td>
			<td><input type="checkbox" id="MIND_TERMINAL_MUST" name="MIND_TERMINAL_MUST" value=""></td>
			<td align="left"><input type="text" id="MIND_TERMINAL_SCRIPT" value="" class="wp"></td>
		</tr>
		</table>
		</fieldset>

	</div>

	<div id="tabs-2" class="ui-form-default">
		<fieldset>
		<legend>部门信息：</legend>
		<table border=0 width="100%">
		<tr>
			<td class="tr wp15">指定</td>
			<td>
			<input type="radio" name="NODE_DEPT_MODE" id="NODE_DEPT_MODE_1" value="1">
			<input class="wp75" type="text" id="NODE_DEPT_CODES__NAME" name="NODE_DEPT_CODES__NAME" readonly size=30 value="" ondblclick="openTreeDialogDept('NODE_DEPT_CODES','NODE_DEPT_MODE_1')"> <a href="#" onclick="openTreeDialogDept('NODE_DEPT_CODES','NODE_DEPT_MODE_1')">选择</a>
			<input type="hidden" id="NODE_DEPT_CODES" name="NODE_DEPT_CODES" size=30 value="">
			</td>
		</tr>
		
		<tr>
			<td class="tr">预定义</td>
			<td>
			    <input type="radio" name="NODE_DEPT_MODE" id="NODE_DEPT_MODE_3" value="3">
				<select id="nodeDeptYuding" name="nodeDeptYuding">
					<option value="s">本处室</option>
					<option value="s0">本部门内所有处室</option>
					<option value="higher">上级机构</option>
					<option value="SUB_ORG">下级机构</option>
					<option value="INIT_ORG">拟稿机构</option>
					<option value="INIT_TOP_DEPT">拟稿部门</option>
					<option value="INIT_DEPT">拟稿处室</option>
				</select>
			</td>
		</tr>
		<tr>
			<td class="tr">全部</td>
			<td>
			<input type="radio" name="NODE_DEPT_MODE" value="2"></td>
		</tr>
		</table>
		</fieldset>
		
		<fieldset>
		<legend>角色信息：</legend>
		<table border=0 width="100%">		
		<tr>
			<td class="tr wp15">指定</td>
			<td>
			<input type="radio" name="NODE_ROLE_MODE" id="NODE_ROLE_MODE_1" value="1">
			<input class="wp75" type="text" id="NODE_ROLE_CODES__NAME" name="NODE_ROLE_CODES__NAME" size=30 readonly value="" ondblclick="openTreeDialog('NODE_ROLE_CODES','SY_ORG_ROLE','NODE_ROLE_MODE_1')"> <a href="#" onclick="openTreeDialog('NODE_ROLE_CODES','SY_ORG_ROLE','NODE_ROLE_MODE_1')">选择</a>
			<input type="hidden" id="NODE_ROLE_CODES" name="NODE_ROLE_CODES" size=30 value="">
			</td>
		</tr>
		<tr>
			<td class="tr">全部</td>
			<td>
			    <input type="radio" name="NODE_ROLE_MODE" id="NODE_ROLE_MODE_2" value="2">
			</td>
		</tr>
		<tr>
			<td class="tr">送角色</td>
			<td>
			    <input type="hidden" id="NODE_BIND_MODE" value="USER">
			    <input type="checkbox" id="NODE_BIND_MODE_ROLE" value="">（办理人为角色）
			</td>
		</tr>
		<!--tr>
			<td class="tr">过滤条件</td>
			<td><input type="text" id="NODE_ROLE_WHERE" name="NODE_ROLE_WHERE" size=30 value=""></td>
		</tr-->			
		
		</table>
		</fieldset>
		
		<fieldset>
		<legend>用户信息：</legend>
		<table border=0 width="100%">		
		<tr>
			<td class="tr wp15">指定</td>
			<td>
			<input type="radio" name="NODE_USER_MODE" id="NODE_USER_MODE_1" value="1">
			<input class="wp75" type="text" id="NODE_USER_CODES__NAME" name="NODE_USER_CODES__NAME" readonly size=30 value="" ondblclick="openTreeDialog('NODE_USER_CODES','SY_ORG_DEPT_USER','NODE_USER_MODE_1')"> <a href="#" onclick="openTreeDialog('NODE_USER_CODES','SY_ORG_DEPT_USER','NODE_USER_MODE_1')">选择</a>
			<input type="hidden" id="NODE_USER_CODES" name="NODE_USER_CODES" size=30 value="">
			</td>
		</tr>
		<tr>
			<td class="tr">预定义</td>
			<td>
				<input type="radio" name="NODE_USER_MODE" id="NODE_USER_MODE_3" value="3">
				<select id="nodeUserYuding" name="nodeUserYuding">
					<option value="draftUser">拟稿人</option>
					<option value="currentUser">当前用户</option>
				</select>
			</td>
		</tr>	
		<tr>
			<td class="tr">全部</td>
			<td>
			    <input type="radio" name="NODE_USER_MODE" value="2">	
			</td>
		</tr>
		<!--tr>
			<td class="tr">过滤条件</td>
			<td><input type="text" id="NODE_USER_WHERE" name="NODE_USER_WHERE" size=30 value=""></td>
		</tr-->		
		</table>
		</fieldset>		
		
		<fieldset>
		<legend>处理人扩展：</legend>
		<table border=0 width="100%">			
		<tr>
			<td class="tr wp15">处理人扩展</td>
			<td>&nbsp;&nbsp;&nbsp;&nbsp;<input class="wp75" type="text" id="NODE_EXTEND_CLASS" name="NODE_EXTEND_CLASS" size=30 value=""> <input id="NODE_SELF_SEND" name="NODE_SELF_SEND" type="hidden" value=""></td>
		</tr>
		</table>
		</fieldset>			
	</div>
	<div id="tabs-6" class="ui-form-default">
		<fieldset>
		<legend>操作权限</legend>
		<div class="p10">
			<a href="#" onclick="openWfeButtonDialog('WF_BUTTONS')">选择流程按钮</a>
			<a href="#" onclick="openButtonDialog('FORM_BUTTONS')">选择审批单按钮</a>
		</div>

		<table cellSpacing="1" cellPadding="0" id='actBtnTable' class="list_table">
			<thead>
			<tr>
				<td width="16%">名称</td>
				<td width="16%">新名称</td>
				<td width="18%">编码</td>
				<td width="40%">参数</td>
				<td width="10%">操作</td>
			</tr>
			</thead>
		</table>
		</fieldset>
	</div>
	<!--
	<div id="tabs-3" class="ui-form-default">
		<fieldset>
		<legend>完成提醒用户：</legend>
		<textarea type="text" id="NODE_REMIND_USER" name="NODE_REMIND_USER" class="wp75" rows="7" value=""></textarea>
		</fieldset>
	</div>-->
	
	<div id="tabs-4" class="ui-form-default">
		<fieldset>
		<legend>输入框控制</legend>	
		<table border="0" width="100%">
		<tr>
			<td class="tr wp15">输入框</td>
			<td>
			<select id="FIELD_CONTROL" name="FIELD_CONTROL">
			    <option value="1">完全控制</option>
				<option value="2">只读控制</option>
			</select>
			</td>
		</tr>
		<tr>
			<td class="tr">可编辑字段</td>
			<td><input  type="hidden" id="FIELD_EXCEPTION" name="FIELD_EXCEPTION" value="">
			<textarea class="wp75" rows="2" id="FIELD_EXCEPTION__NAME"  name="FIELD_EXCEPTION__NAME" readonly></textarea>
			<a href="#" onclick="openFieldControlDialog('FIELD_EXCEPTION',{'ITEM_TYPE':'1'})">选择</a> <a href="#" onclick="cancelSelect('FIELD_EXCEPTION')">取消</a></td>
		</tr>	
		<tr>
			<td class="tr">隐藏字段</td>
			<td><input type="hidden" id="FIELD_HIDDEN" name="FIELD_HIDDEN" readonly value="">
			<textarea class="wp75" rows="2" id="FIELD_HIDDEN__NAME" name="FIELD_HIDDEN__NAME" readonly></textarea>
			<a href="#" onclick="openFieldControlDialog('FIELD_HIDDEN')">选择</a> <a href="#" onclick="cancelSelect('FIELD_HIDDEN')">取消</a></td>
		</tr>
		<tr>
			<td class="tr">显示字段</td>
			<td><input type="hidden" id="FIELD_DISPLAY" name="FIELD_DISPLAY" readonly value="">
			<textarea title="显示审批单中隐藏的字段" class="wp75" rows="2" id="FIELD_DISPLAY__NAME" name="FIELD_DISPLAY__NAME" readonly></textarea>
			<a href="#" onclick="openFieldControlDialog('FIELD_DISPLAY')">选择</a> <a href="#" onclick="cancelSelect('FIELD_DISPLAY')">取消</a></td>
		</tr>
		<tr>
			<td class="tr">必填字段</td>
			<td><input type="hidden" id="FIELD_MUST" name="FIELD_MUST"  value="">
			<textarea rows="2" class="wp75" id="FIELD_MUST__NAME" name="FIELD_MUST__NAME" readonly></textarea>
			<a href="#" onclick="openFieldControlDialog('FIELD_MUST',{})">选择</a> <a href="#" onclick="cancelSelect('FIELD_MUST')">取消</a></td>
		</tr>
		<!-- 
		<tr>
			<td class="tr">更新字段</td>
			<td>
				<textarea class="wp75" rows="2" type="text" id="FIELD_UPDATE" name="FIELD_UPDATE"></textarea>
			</td>
		</tr>
		-->
		<input type="hidden" id="SERV_ID" name="SERV_ID" value="">
		<input type="hidden" id="SERV_PID" name="SERV_PID" value="">
		</table>
		</fieldset>
		
		<fieldset>
		<legend>分组框控制</legend>	
		<table border=0 width="100%">
		<tr>
			<td class="tr wp15">显示</td>
			<td><input type="hidden" id="GROUP_DISPLAY" name="GROUP_DISPLAY"  value="">
			<textarea rows="2" class="wp75" id="GROUP_DISPLAY__NAME" name="GROUP_DISPLAY__NAME" readonly></textarea>
			<a href="#" onclick="openFieldControlDialog('GROUP_DISPLAY',{'ITEM_INPUT_TYPE':'10'})">选择</a>
			<a href="#" onclick="cancelSelect('GROUP_DISPLAY')">取消</a></td>
		</tr>
		<tr>
			<td class="tr">隐藏</td>
			<td><input type="hidden" id="GROUP_HIDE" name="GROUP_HIDE"  value="">
			<textarea rows="2" class="wp75" id="GROUP_HIDE__NAME" name="GROUP_HIDE__NAME" readonly></textarea>
			<a href="#" onclick="openFieldControlDialog('GROUP_HIDE',{'ITEM_INPUT_TYPE':'10'})">选择</a>
			<a href="#" onclick="cancelSelect('GROUP_HIDE')">取消</a></td>
		</tr>
		<tr>
			<td class="tr">展开</td>
			<td><input type="hidden" id="GROUP_EXPAND" name="GROUP_EXPAND"  value="">
			<textarea rows="2" class="wp75" id="GROUP_EXPAND__NAME" name="GROUP_EXPAND__NAME" readonly></textarea>
			<a href="#" onclick="openFieldControlDialog('GROUP_EXPAND',{'ITEM_INPUT_TYPE':'10'})">选择</a> 
			<a href="#" onclick="cancelSelect('GROUP_EXPAND')">取消</a></td>
		</tr>
		<tr>
			<td class="tr">收缩</td>
			<td><input type="hidden" id="GROUP_COLLAPSE" name="GROUP_COLLAPSE"  value="">
			<textarea rows="2" class="wp75" id="GROUP_COLLAPSE__NAME" name="GROUP_COLLAPSE__NAME" readonly></textarea>
			<a href="#" onclick="openFieldControlDialog('GROUP_COLLAPSE',{'ITEM_INPUT_TYPE':'10'})">选择</a>
			<a href="#" onclick="cancelSelect('GROUP_COLLAPSE')">取消</a></td>
		</tr>
		</table>
		</fieldset>
	</div>
	
	<div id="tabs-8" class="ui-form-default">
		<fieldset>
			<legend>数据更新</legend>	
			<div class="m10 wp"><div id="btnDataUpdate" class="ul cp" style="">增加</div></div>
			<table id="dataUpdateTable" class='list_table' cellSpacing="1" cellPadding="0">
			    <thead><tr class="topTr">
			    	<td width="10%">触发事件</td>
					<td width="35%">启用条件</td>
					<td width="15%">字段名称</td>
					<td width="30%">更新内容</td>
					<td width="10%">操作</td>
				</tr></thead>
			</table>
		</fieldset>	
	</div>

	<div id="tabs-5" class="ui-form-default">
		<!--<fieldset>
		<legend>文件类型：</legend>-->
		
		<div id="fileTypeControl">
		    <table cellSpacing=1 cellPadding=0 id='fileTypeSelect' class='list_table'>
		    	<thead><tr class='topTr'><td>文件类型</td><td>查看</td><td>编辑</td><td>上传</td><td >删除</td><td>修改</td><td >下载</td></tr></thead>
		    </table>
		</div>
		
		<!--</fieldset>-->
	</div>

	<div id="tabs-7" class="ui-form-default">
		<fieldset>
		<legend>自定义变量</legend>
		<div class="m10 wp"><div id="btnCustomVarAdd" class="ul cp" style="">增加</div></div>
		<table cellSpacing=1 cellPadding=0 id='tblCustomVarAdd' class='list_table wp m10'>
			<thead>
				<tr>
					<td width="20%">变量名称</td>
					<td width="50%">变量值</td>
					<td width="20%">说明</td>
					<td width="10%">操作</td>
				</tr>
			</thead>
		</table>
		</fieldset>
	</div>
	
	<div id="tabs-9" class="ui-form-default">
		<fieldset>
		<legend>超时设置</legend>
		<table cellSpacing=1 cellPadding=0 id='tblCustomVarAdd' class='list_table wp m10'>
			<thead>
				<tr>
					<td>紧急程度</td>
					<td>超时时间(小时)</td>
					<td>提醒方式</td>
					<td>操作</td>
				</tr>
			</thead>
				<tr>
					<td>一般</td>
					<td><input type="text" id="NODE_TIMEOUT_YIBAN" name="NODE_TIMEOUT_YIBAN" class="wp40" value=""></td>
					<td><div id="NODE_TIMEOUT_YIBAN_REMIND"></div></td>
					<td><div id="NODE_TIMEOUT_YIBAN_OPER"></div></td>
				</tr>	
				<tr>
					<td>紧急</td>
					<td><input type="text" id="NODE_TIMEOUT_JINJI" name="NODE_TIMEOUT_JINJI" class="wp40" value=""></td>
					<td><div id="NODE_TIMEOUT_JINJI_REMIND"></div></td>
					<td><div id="NODE_TIMEOUT_JINJI_OPER"></div></td>
				</tr>	
				<tr>
					<td>特急</td>
					<td><input type="text" id="NODE_TIMEOUT_TEJI" name="NODE_TIMEOUT_TEJI" class="wp40" value=""></td>
					<td><div id="NODE_TIMEOUT_TEJI_REMIND"></div></td>
					<td><div id="NODE_TIMEOUT_TEJI_OPER"></div></td>
				</tr>					
		</table>
		</fieldset>
	</div>	
	
</div>

<div class="tc">
	<input type="button" class="wf-def-btn" name="confirm1" value="确定" onclick="confirmall(true)">&nbsp;&nbsp;
	<input type="button" class="wf-def-btn" name="cancel1" value="取消" onclick="cancelall()">
</div>

</div>
</body>
</html>
