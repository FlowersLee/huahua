<%@page import="com.am.qrcode.QrcodeMgr"%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String duanstr = "";
	String uri = request.getRequestURI();
	uri = uri.substring(uri.lastIndexOf("/") + 1,uri.length()-4);
	QrcodeMgr qrcodeMgr = new QrcodeMgr();
	duanstr = qrcodeMgr.getContent(uri);
%>
<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport"
	content="width=device-width; height=device-height; maximum-scale=1.4;  user-scalable=yes" />

<meta name="description" content="爱着你的小仙女==大美女==冰雪聪明的大美女">

<title>❤</title>

<script src="/base/js/jquery-3.3.1.min.js"></script>
<style>
body pre {
	color: #555;
	font-family: 'Quicksand', sans-serif;
	font-weight: 900;
	font-size: 4em;
}

.wz {
	text-align: center;
}

html, body {
	height: 100%;
}

body {
	margin: 0;
	padding: 0;
	background: #ffa5a5;
}

.chest {
	width: 500px;
	height: 500px;
	margin: 0 auto;
	position: relative;
}

.heart {
	position: absolute;
	z-index: 2;
	background: linear-gradient(-90deg, #F50A45 0%, #d5093c 40%);
	animation: beat 0.7s ease 0s infinite normal;
}

.heart.center {
	background: linear-gradient(-45deg, #B80734 0%, #d5093c 40%);
}

.heart.top {
	z-index: 3;
}

.sided {
	top: 100px;
	width: 220px;
	height: 220px;
	border-radius: 110px;
}

.center {
	width: 210px;
	height: 210px;
	bottom: 100px;
	left: 145px;
	transform: rotateZ(225deg);
}

.left {
	left: 62px;
}

.right {
	right: 62px;
}

@
keyframes beat { 0% {
	transform: scale(1) rotate(225deg);
	box-shadow: 0 0 40px #d5093c;
}
50%
{
transform




:scale




(1
.1




)
rotate




(225
deg


);
box-shadow




:




0
0
70
px


 


#d5093c




;
}
100%
{
transform




:scale(1)


 


rotate




(225
deg


);
box-shadow




:




0
0
40
px


 


#d5093c




;
}
}
</style>
</head>
<body>
	<div class="chest">
		<div class="heart left sided top"></div>
		<div class="heart center"></div>
		<div class="heart right sided"></div>
	</div>

	<div class="wz">
		<pre id="aa"></pre>
	</div>
</body>
</html>
<script>
 var index = 0;
 var word = '<%=duanstr%>';

 function type() {
     document.getElementById("aa").innerText = word.substring(0, index++);
 }
 setInterval(type, 500);
	</script>
