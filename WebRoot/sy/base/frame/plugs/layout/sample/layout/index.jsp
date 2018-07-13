<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@ include file="/sy/base/view/inHeader.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>布局例子</title>
</head>
<body style="font-size: 1.5em; background-color: white;">
<div align="left">
    <br/>
    <div><a href="page/treeFormGrid.jsp">左侧Tree、右侧Form和Grid</a></div>
    <div><a href="page/treeForm.jsp">左侧Tree、右侧Form</a></div>
    <div><a href="page/treeGrid.jsp">左侧Tree、右侧Grid</a></div>
    <div><a href="page/cardList.jsp">左侧CardView、右侧ListView</a></div>
    <br/>
    <div><a href="page/embed-simple.jsp">嵌套式布局(简单)</a></div>
    <div><a href="page/embed-complex.jsp">嵌套式布局(复杂)</a></div>
    <br/>
    <div><a href="page/item.jsp">独立组件布局（有问题、不推荐使用）</a></div>
    <br/>
    <div><a href="page/tab-treeFormGrid.jsp">tab布局（分别放Tree、Form、Grid）</a></div>
    <div><a href="page/tab-cardList.jsp">tab布局（分别放CardView、ListView）</a></div>
    <br/>
    <div><a href="page/formButton.jsp">左侧Tree、右侧Form和Grid,为Form添加按钮操作</a></div>
</div>
</body>
<script type="text/javascript">
    $("div>a").on("click", function (event) {
        //新tab打开
        Tab.open({url: event.currentTarget.href, tTitle: event.currentTarget.innerText, scrollFlag: true});
        event.preventDefault();
    })
</script>
</html>