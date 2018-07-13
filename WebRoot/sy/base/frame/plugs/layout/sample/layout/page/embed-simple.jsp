<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--StdListCardView.jsp列表页面-->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="/sy/base/view/inHeader.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>嵌套式布局-简单的</title>
    <script type="text/javascript" src="../../../jquery.layout.js"></script>
    <script type="text/javascript" src="../js/embed-simple.js"></script>

    <style type="text/css">
        /** 主要是为了消除外层layout和内层layout间的padding */
        .ui-layout-center {
            padding: 0 !important;
            overflow: hidden;
            border-collapse:collapse !important;
        }

    </style>
</head>

<body>

<div class="ui-layout-center">

    <div class="ui-layout-center">

        <div class="ui-layout-center" id="innerCenter">Inner Center</div>
        <div class="ui-layout-west">Inner West</div>
        <div class="ui-layout-east">Inner East</div>
        <div class="ui-layout-north">Inner North</div>
        <div class="ui-layout-south">Inner South</div>

    </div>
    <div class="ui-layout-west">Middle West</div>
    <div class="ui-layout-east">Middle East</div>

</div>

<div class="ui-layout-west">Outer West</div>
<div class="ui-layout-east">Outer East</div>

<div class="ui-layout-north">Outer North</div>
<div class="ui-layout-south">Outer South</div>


</body>
</html>