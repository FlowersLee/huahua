<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>子流程节点定义</title>
<%@ include file="../../sy/base/view/inHeader.jsp"%>
<link rel="stylesheet" type="text/css" href="<%=urlPath%>/sy/theme/default/wfe.css" />
<script type="text/javascript" src="<%=urlPath%>/sy/wfe/procnode.js"></script>
</head>
<body>
<div>
	<div id="tabs" class="rhCard-tabs ui-tabs ui-widget ui-widget-content ui-corner-all">
		<ul class="tabUL ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-corner-all">
			<li style="float: left"><a href="#tabs-1">基本信息</a></li>
			<li style="float: left"><a href="#tabs-2">组织/资源</a></li>
			<li style="float: left"><a href="#tabs-3">扩展</a></li>
		</ul>
		<div id="tabs-1" class="ui-form-default">
			<fieldset>
				<legend>基础信息：</legend>
				<table style="border:0;width:100%">
					<tr>
						<td class="tr wp15">节点编码</td>
						<td class="wp35"><input type="text" id="NODE_CODE" name="NODE_CODE" class="wp50" value="" disabled></td>
						<td width="15%" class="tr wp15">节点类型</td>
						<td class="wp35">
							<select id="NODE_TYPE" name="NODE_TYPE"	disabled>
								<option value="1">起草</option>
								<option value="2">活动</option>
								<option value="3">结束</option>
								<option value="4">子流程</option>
							</select>
						</td>
					</tr>
					<tr>
						<td class="tr">节点名称</td>
						<td>
							<input type="text" id="NODE_NAME" name="NODE_NAME" class="wp50" value=""/>
						</td>
						
					</tr>
					<tr>
						<td class="tr">结束流程</td>
						<td><input type="checkbox" id="PROC_END_FLAG" name="PROC_END_FLAG" value=""/></td>
						<td class="tr">结束按钮名</td>
						<td>
							<input type="text" id="PROC_END_NAME" name="PROC_END_NAME"  value=""/>
						</td>
					</tr>
					<tr>
						<td class="tr">节点描述</td>
						<td colspan="3">
							<textarea id="NODE_MEMO" name="NODE_MEMO" class="wp75" rows="3"></textarea>
						</td>	
					</tr>
					<tr></tr>
					<tr>
						<td class="tr">子流程服务编码</td>
						<td colspan="3">
							<input type="text" id="SUB_SERVICE_ID" name="SUB_SERVICE_ID" class="wp75"/>
							<a href="#" onclick="openServiceSelectDialog('SUB_SERVICE_ID')">选择</a>
						</td>	
					</tr>
					<tr>
						<td class="tr">是否创建数据</td>
						<td><input type="checkbox" id="CREATE_DATA_FLAG" name="CREATE_DATA_FLAG" value=""/></td>
						<td class="tr">是否异步运行</td>
						<td><input type="checkbox" id="ASYNC" name="ASYNC" value=""/></td>
					</tr>	
				</table>
			</fieldset>
		</div>
		
		<div id="tabs-2" class="ui-form-default">
			<fieldset>
				<legend>部门信息：</legend>
				<table style="border:0;width:100%">
					<tr>
						<td class="tr wp15">指定</td>
						<td>
							<input type="radio" name="NODE_DEPT_MODE" id="NODE_DEPT_MODE_1" value="1"/>
							<input class="wp75" type="text" id="NODE_DEPT_CODES__NAME" readonly size=30 value="" ondblclick="openTreeDialogDept('NODE_DEPT_CODES','NODE_DEPT_MODE_1')"/>
							<a href="#" onclick="openTreeDialogDept('NODE_DEPT_CODES','NODE_DEPT_MODE_1')">选择</a>
							<input type="hidden" id="NODE_DEPT_CODES" name="NODE_DEPT_CODES" size=30 value=""/>
						</td>
					</tr>
					<tr>
						<td class="tr">预定义</td>
						<td>
				    		<input type="radio" name="NODE_DEPT_MODE" id="NODE_DEPT_MODE_3" value="3"/>
							<select id="nodeDeptYuding">
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
						<td><input type="radio" name="NODE_DEPT_MODE" value="2"/></td>
					</tr>
				</table>
			</fieldset>
			<fieldset>
				<legend>角色信息：</legend>
				<table style="border:0;width:100%">		
					<tr>
						<td class="tr wp15">指定</td>
						<td>
							<input type="radio" name="NODE_ROLE_MODE" id="NODE_ROLE_MODE_1" value="1"/>
							<input class="wp75" type="text" id="NODE_ROLE_CODES__NAME" size=30 readonly value="" ondblclick="openTreeDialog('NODE_ROLE_CODES','SY_ORG_ROLE','NODE_ROLE_MODE_1')"/> <a href="#" onclick="openTreeDialog('NODE_ROLE_CODES','SY_ORG_ROLE','NODE_ROLE_MODE_1')">选择</a>
							<input type="hidden" id="NODE_ROLE_CODES" name="NODE_ROLE_CODES" size=30 value=""/>
						</td>
					</tr>
					<tr>
						<td class="tr">全部</td>
						<td><input type="radio" name="NODE_ROLE_MODE" id="NODE_ROLE_MODE_2" value="2"/></td>
					</tr>
					<tr>
						<td class="tr">送角色</td>
						<td>
						    <input type="hidden" id="NODE_BIND_MODE" name="NODE_BIND_MODE" value="USER"/>
						    <input type="checkbox" id="NODE_BIND_MODE_ROLE" value=""/>（办理人为角色）
						</td>
					</tr>
				</table>
			</fieldset>
			<fieldset>
				<legend>用户信息：</legend>
				<table style="border:0;width:100%">		
					<tr>
						<td class="tr wp15">指定</td>
						<td>
							<input type="radio" name="NODE_USER_MODE" id="NODE_USER_MODE_1" value="1">
							<input class="wp75" type="text" id="NODE_USER_CODES__NAME" readonly size=30 value="" ondblclick="openTreeDialog('NODE_USER_CODES','SY_ORG_DEPT_USER','NODE_USER_MODE_1')"> <a href="#" onclick="openTreeDialog('NODE_USER_CODES','SY_ORG_DEPT_USER','NODE_USER_MODE_1')">选择</a>
							<input type="hidden" id="NODE_USER_CODES" name="NODE_USER_CODES" size=30 value="">
						</td>
					</tr>
					<tr>
						<td class="tr">预定义</td>
						<td>
							<input type="radio" name="NODE_USER_MODE" id="NODE_USER_MODE_3" value="3"/>
							<select id="nodeUserYuding">
								<option value="draftUser">拟稿人</option>
								<option value="currentUser">当前用户</option>
							</select>
						</td>
					</tr>	
					<tr>
						<td class="tr">全部</td>
						<td><input type="radio" name="NODE_USER_MODE" value="2"/></td>
					</tr>
				</table>
			</fieldset>		
			<fieldset>
				<legend>处理人扩展：</legend>
				<table style='border:0;width:100%'>			
					<tr>
						<td class="tr wp15">处理人扩展</td>
						<td>
							&nbsp;&nbsp;&nbsp;&nbsp;
							<input class="wp75" type="text" id="NODE_EXTEND_CLASS" name="NODE_EXTEND_CLASS" size=30 value=""/>
						</td>
					</tr>
				</table>
			</fieldset>		
		</div>
		<div id="tabs-3" class="ui-form-default">
			<fieldset>
				<legend>扩展</legend>
				<table style="border:0;width:100%">
					<tr>
						<td class="tr">启动扩展类</td>
						<td colspan="3">
							<input type="text" id="START_CLASS" name="START_CLASS" class="wp75" value=""/>
						</td>	
					</tr>	
					<tr>
						<td class="tr">结束扩展类</td>
						<td colspan="3">
							<input type="text" id="FINISH_CLASS" name="FINISH_CLASS" class="wp75" value=""/>
						</td>	
					</tr>
					<tr></tr>
					<tr>
						<td class="tr wp15">流转百分比%</td>
						<td colspan="3"><input type="input" id="TRANSITION_CONDITION_PERCENT" name="TRANSITION_CONDITION_PERCENT" value=""/></td>
					</tr>	
					<tr>
						<td class="tr">流转条件扩展类</td>
						<td colspan="3">
							<input type="text" id="TRANSITION_CONDITION_CLASS" name="TRANSITION_CONDITION_CLASS" class="wp75" value=""/>
						</td>	
					</tr>	
				</table>
			</fieldset>
		</div>
	</div>
	
	<div class="tc">
		<input type="button" class="wf-def-btn" name="confirm1" value="确定" onclick="confirmAll(true)"/>&nbsp;&nbsp;
		<input type="button" class="wf-def-btn" name="cancel1" value="取消" onclick="cancelAll()"/>
	</div>
</div>
</body>
</html>