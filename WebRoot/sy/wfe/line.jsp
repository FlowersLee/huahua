<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>线属性</title>
<%@ include file= "../../sy/base/view/inHeader.jsp" %>
<link rel="stylesheet" type="text/css" href="<%=urlPath %>/sy/theme/default/wfe.css"/>
<script type="text/javascript" src="<%=urlPath %>/sy/wfe/swfObject.js"></script>
<script type="text/javascript" src="<%=urlPath %>/sy/base/frame/base64.js"></script>
<script type="text/javascript" src="<%=urlPath %>/sy/base/frame/tools.js"></script>
<script type="text/javascript" src="<%=urlPath %>/sy/wfe/lineJs.js"></script>
<link rel="stylesheet" type="text/css" href="../../sy/base/frame/coms/all/style.css"></link>
</head>
<body>
<div class="demo">

<div id="tabs" class="rhCard-tabs ui-tabs ui-widget ui-widget-content ui-corner-all">
	<ul class="tabUL ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-corner-all">
		<li style="float:left"><a href="#tabs-1">基本信息</a></li>
		<li style="float:left"><a href="#tabs-2">条件表达式</a></li>
		<li style="float:left"><a href="#tabs-3">数据更新</a></li>
		<li style="float:left"><a href="#tabs-5">组织资源定义</a></li>
		<li style="float:left"><a href="#tabs-4">事件</a></li>
	</ul>
	<div id="tabs-1"  class="ui-form-default">
		<fieldset>
		<legend>基本信息：</legend>	
		<table width="100%">
		<tr class="h25">
			<td class="tr" width="15%">连线编码</td>
			<td width="35%"><input class="wp80" type="text" id="LINE_CODE" name="LINE_CODE" size=15 value="" disabled></td>		
			<td class="tr" width="15%" >允许退回</td>
			<td width="35%">
				<input type="checkbox" id="LINE_IF_RETURN" name="LINE_IF_RETURN" value="1">
			</td>
		</tr>
		<tr class="h25">
			<td class="tr">前&nbsp;节&nbsp;点</td>
			<td><input class="wp80" type="text" id="SRC_NODE_CODE" name="SRC_NODE_CODE" size=15 value="" disabled></td>	
			<td class="tr">后&nbsp;节&nbsp;点</td>
			<td><input class="wp80" type="text" id="TAR_NODE_CODE" name="TAR_NODE_CODE" size=15 value="" disabled></td>	
		</tr>		
		<tr class="h25">
			<td class="tr">连线排序</td>
			<td><input class="wp80" type="text" id="LINE_SORT" name="LINE_SORT" size=15 value=""></td>				
			<td class="tr">条件名称</td>
			<td><input class="wp80" type="text" id="LINE_COND_NAME" name="LINE_COND_NAME" size=15 value=""></td>
		</tr>
		<tr class="h25">
			<td class="tr">送交名称</td>
			<td><input class="wp80" type="text" id="SEND_TEXT" name="SEND_TEXT" size=15 value=""></td>				
			<td class="tr">返回名称</td>
			<td><input class="wp80" type="text" id="RETURN_TEXT" name="RETURN_TEXT" size=15 value=""></td>
		</tr>
		<tr class="h25">
			<td class="tr">是否并发</td>
			<td><input type="checkbox" id="IF_PARALLEL" value=""></td>
			<td class="tr">是否出部门</td>
			<td><input type="checkbox" id="IF_OUT_DEPT" value=""></td>			
		</tr>
		<tr class="h25">
			<td class="tr">扩&nbsp;展&nbsp;类</td>
			<td colspan="3" ><input class="wp90" type="text" id="LINE_EXTEND_CLASS" name="LINE_EXTEND_CLASS" size=30 value=""></td>
		</tr>
		<tr class="h25">
			<td class="tr">提示信息</td>
			<td colspan="3">
				<textarea class="wp90" rows="5" id="CONFIRM_MSG"></textarea>
			</td>
		</tr>
		<tr class="h25">
			<td>&nbsp;</td>
			<td class="tl" colspan="3">
				<span style="color:#DDD">点击节点按钮前弹出此提示信息，如果确定则继续送下一节点，否则不送。</span>
			</td>
		</tr>		
		<tr class="h25">
			<td class="tr">未满足条<br/>件&nbsp;提&nbsp;示</td>
			<td colspan="3">
				<textarea class="wp90" rows="5" id="COND_MSG"></textarea>
			</td>
		</tr>
		<tr class="h25">
			<td>&nbsp;</td>
			<td colspan="3">
				<span style="color:#DDD">如果条件表达式的执行结果为false，则按钮变灰，点击按钮或鼠标放上显示此消息。</span>
			</td>
		</tr>
		</table>
		</fieldset>
		
	
	</div>
	
	<div id="tabs-2" style="align:center" class="ui-form-default">
		<div class="p5 wp90">
			<input type="radio" name="modeExpress" onClick="changeMode()" value="simpleExpress">简单表达式
			<input type="radio" name="modeExpress" onClick="changeMode()" value="complexExpress">复杂表达式
		</div>
		<fieldset class="p5">
		<legend>简单表达式：</legend>
		<table border=0 width="100%">
		<tr>
			<td class="p5"><input type="text" name="selectExpress" id="selectExpress" value="双击选择已定义变量" ondblclick="openSysParams()" readonly><input type="hidden" id="optParamCode" name="optParamCode" value=""></td>
			<td>
			    <select name="expression" id="expression" style="width:80px">
				    <option value=""></option>
				</select>
			</td>
			<td><input type="text" name="expressValue" id="expressValue" value=""></td>
			<td><input type="button" name="addVar" id="addVar" value="添加" onclick="clickAddBtn()"></td>
		</tr>
		<tr>
			<td colspan="4" class="vt h100">
			    <table id="varListTable" width="100%" class='list_table wp100' cellSpacing=1 cellPadding=0>
				    <thead><tr class="topTr">
						<td width="30%">变量名</td><td width="10%">操作符</td><td width="30%">值</td><td width="20%">逻辑操作符</td><td width="10%">&nbsp;</td>
					</tr></thead>
				</table>
			</td>
		</tr>
		</table>
		</fieldset>

		<fieldset class="p5">
		<legend>复杂表达式：</legend>	
		<table border=0 width="100%">
		<tr>
			<td id="editDivId" class="p5">
				<div id="flashContent" style="display:none">This text is replaced by the Flash.</div>
				<textarea type="text" id="LINE_CONDS_SCRIPT" name="LINE_CONDS_SCRIPT" class="wp100" rows="6" value=""></textarea>
			</td>
		</tr>
		</table>
		</fieldset>	
	</div>
	<div id="tabs-3" style="align:center" class="ui-form-default">
		<fieldset class="p5">
			<legend>数据更新</legend>
			<div class="m10 wp"><div id="btnDataUpdate" class="ul cp" style="">增加</div></div>
			<table id="dataUpdateTable" class='list_table' cellSpacing=1 cellPadding=0>
			    <thead><tr class="topTr">
					<td width="40%">启用条件</td><td width="10%">字段名称</td><td width="40%">更新字段</td><td width="10%">操作</td>
				</tr></thead>
			</table>
		</fieldset>	
	</div>
	<div id="tabs-5" style="align:center" class="ui-form-default">
		<fieldset>
		<legend>常用信息：</legend>
		<table border=0 width="100%">		
			<tr>
				<td class="tr wp15">是否启用</td>
				<td><input type="checkbox" name="ENABLE_ORG_DEF" id="ENABLE_ORG_DEF" value="1" class='mt5'></td>
				<td>&nbsp;（勾选此配置后，当前界面配置的组织资源定义会覆盖目标点的组织资源定义）</span></td>
			</tr>
			<tr>
				<td class="tr wp15">扩展类</td>
				<td colspan='2'><input class="wp75" type="text" id="NODE_EXTEND_CLASS" name="NODE_EXTEND_CLASS" size=30 value=""> <input id="NODE_SELF_SEND" name="NODE_SELF_SEND" type="hidden" value=""></td>
			</tr>
		</table>
		</fieldset>
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
			<td colspan="2">
			<input type="radio" name="NODE_ROLE_MODE" id="NODE_ROLE_MODE_1" value="1">
			<input class="wp75" type="text" id="NODE_ROLE_CODES__NAME" name="NODE_ROLE_CODES__NAME" size=30 readonly value="" ondblclick="openTreeDialog('NODE_ROLE_CODES','SY_ORG_ROLE','NODE_ROLE_MODE_1')"> <a href="#" onclick="openTreeDialog('NODE_ROLE_CODES','SY_ORG_ROLE','NODE_ROLE_MODE_1')">选择</a>
			<input type="hidden" id="NODE_ROLE_CODES" name="NODE_ROLE_CODES" size=30 value="">
			</td>
		</tr>
		<tr>
			<td class="tr">全部</td>
			<td colspan="2">
			    <input type="radio" name="NODE_ROLE_MODE" id="NODE_ROLE_MODE_2" value="2">
			</td>
		</tr>
		<tr>
			<td class="tr">送角色</td>
			<td width="2%"><input type="hidden" id="NODE_BIND_MODE" value="USER"><input type="checkbox" id="NODE_BIND_MODE_ROLE" value=""></td>
			<td>（办理人为角色）</td>
		</tr>
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
					<option value="targetNodeLastUser">目标节点最后一个办理用户</option>
				</select>
			</td>
		</tr>	
		<tr>
			<td class="tr">全部</td>
			<td>
			    <input type="radio" name="NODE_USER_MODE" value="2">	
			</td>
		</tr>
		</table>
		</fieldset>
	</div>
	<div id="tabs-4" style="align:center" class="ui-form-default">
		<fieldset class="p5">
			<legend>事件</legend>
			<table cellSpacing=1 cellPadding=0>
			    <tr>
			    	<td width="15%" style="text-align:center">流转事件</td>
			    	<td width="85%" style="text-align:left"><input type="text" class="wp" id="LINE_EVENT" name="LINE_EVENT" value=""></td>
			    </tr>
			</table>
		</fieldset>	
	</div>
</div>

<div class="tc">
	<input type="button" class="wf-def-btn" name="confirm1" value="确定" onclick="confirmall(true)">&nbsp;&nbsp;
	<input type="button" class="wf-def-btn" name="cancel1" value="取消" onclick="cancelall()">&nbsp;&nbsp;
	<input type="hidden" id="SERV_ID" name="SERV_ID" value="">
</div>

</div>
</body>
</html>
