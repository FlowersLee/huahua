<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--StdListCardView.jsp列表页面-->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="/sy/base/view/inHeader.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>嵌套式布局-复杂</title>
    <script type="text/javascript" src="../../../jquery.layout.js"></script>
    <script type="text/javascript" src="../js/embed-complex.js"></script>
    <link rel="stylesheet" type="text/css" href="../../../layout-default.css">
    <link rel="stylesheet" type="text/css" href="../css/embed.css">
</head>

<body>

<div class="outer-center">

    <div class="middle-center">

        <div class="inner-center">Inner Center</div>
        <div class="inner-west">Inner West</div>
        <div class="inner-east">Inner East</div>
        <div class="ui-layout-north">Inner North</div>
        <div class="ui-layout-south">Inner South</div>

    </div>
    <div class="middle-west">Middle West</div>
    <div class="middle-east">Middle East</div>

</div>

<div class="outer-west">Outer West</div>
<div class="outer-east">Outer East</div>

<div class="ui-layout-north">Outer North</div>
<div class="ui-layout-south">Outer South</div>


</body>
</html>