<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--activeTest.jsp 浏览器、flash、系统插件测试页面-->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>平台应用所需提示页面</title>
    <%@ include file="/sy/base/view/inHeader.jsp" %>
</head>
<style type="text/css">
    body {
        background-color: #f5fafd;
        line-height: 28px;
        font-size: 14px;
    }

    .rh_test_container {
        margin: 20px 20px;
        padding: 5px;
        background-color: #ffffff;
        border: 1px #d5e1ed solid;
        min-height: 100px;
    }

    .redTip {
        color: red;
    }

    .yellowTip {
        color: red;
    }

    .yellowCon {
        padding: 5px 0px 5px 0px;
        width: 600px;
        border: 1px blue solid;
        background-color: yellow;
    }

    .greenCon {
        padding: 5px 0px 5px 0px;
        width: 600px;
        border: 1px blue solid;
        background-color: green;
        color: white;
    }

    .rh_test_title {
        font-weight: bold;
    }

    .rh_test_a {
        text-decoration: underline;
        color: red;
        font-size: 16px;
    }

    #rh_test_back {
        font-size: 16px;
    }
</style>
<body>
<div>
    <div id="rh_test_container_add" class="rh_test_container">
        <div class="rh_test_title">1. 可信任站点添加</div>
        <div id="rh_test_bat"></div>
    </div>
    <div class="rh_test_container">
        <div class="rh_test_title">2. 浏览器测试</div>
        <div id="rh_test_browser"></div>
    </div>
    <div id="rh_test_container_flash" class="rh_test_container">
        <div class="rh_test_title">3. Flash测试</div>
        <div id="rh_test_flash"></div>
    </div>
    <div id="rh_test_container_ntko" class="rh_test_container">
        <div class="rh_test_title">4. NTKO测试和ZotnClient测试</div>
        <div id="rh_test_ntko" style="width:100%;text-align:center;">
            <iframe id="rh_test_ntko_iframe" src="ntkoTest.jsp" width="600px" height="40px" border='0' frameborder='0'
                    style="border:1px blue solid;padding:0px;background-color:yellow;" allowtransparency=true
                    scrolling=no></iframe>
        </div>
        <div class="rh_test_title">&nbsp;</div>
        <div id="rh_test_word" style="width:100%;text-align:center;">
            <iframe id="rh_test_word_iframe" src="wordTest.jsp" width="600px" height="40px" border='0' frameborder='0'
                    scrolling=no style="border:1px blue solid;background-color:yellow;" allowtransparency=true></iframe>
        </div>
        <div class="rh_test_title">&nbsp;</div>
        <div id="rh_test_zotnClient" style="width:100%;text-align:center;">
            <iframe id="rh_test_zotnClient_iframe" src="zotnClientTest.jsp" width="600px" height="40px" border='0'
                    frameborder='0' scrolling=no style="border:1px blue solid;background-color:yellow;"
                    allowtransparency=true></iframe>
        </div>
        <div style="width:100%;text-align:center;">
            <div>如果系统没有自动下载安装文件，可以点此链接手动下载安装
                <a href='<%=urlPath%>/sy/comm/index/file/ruahoClient.exe'>系统插件</a>(打包NTKO和ZotnClient的安装文件)
            </div>
        </div>
    </div>
    <div class="rh_test_container" style="min-height:30px;">
        <div id="rh_test_back">
            <div align=center><p><a href="javascript:history.go(-1);">返回登录页</a></p></div>
        </div>
    </div>
</div>
</body>

<script type="text/javascript">
    //浏览器测试
    function testBrower() {
        var res = true;
        if (jQuery.browser.msie) {//ie系列
            if (parseInt(jqbrowser.version) <= 6) {
                res = false;
            }
        }
        return res;
    }
    //<iframe src="/sy/util/stylus/ZotnClientLib.jsp"></iframe>
    function browserCheck() {
        if (jQuery.browser.msie && (jQuery("#rh_test_browser").length == 1)) {//ie系列
            var version = parseInt(jqbrowser.version);
            if (version <= 6) {
                jQuery("#rh_test_browser").append("<div align=center><p class='yellowCon'>系统不支持IE6（或以下）版本的浏览器。请下载并安装 <a href='" + FireFly.getContextPath() + "/sy/comm/index/file/IE8-WindowsXP-x86-CHS.exe' class='rh_test_a'>IE8版本</a></p></div>");
            } else if (version == 7) {
                jQuery("#rh_test_browser").append("<div align=center><p class='yellowCon'>您现在使用的是IE7内核版本，将导致系统缓慢，强烈建议您使用较高版本,请下载<a href='" + FireFly.getContextPath() + "/sy/comm/index/file/IE8-WindowsXP-x86-CHS.exe' style='color:red;text-decoration:underline;'>IE8版本</a></p></div>");
            } else {
                jQuery("#rh_test_browser").append("<div align=center><p class='greenCon'>您现在使用的是IE" + version + "版本,可以正常使用系统</p></div>");
            }
        } else if (jQuery.browser.mozilla) {//火狐系列
            jQuery("#rh_test_browser").append("<div align=center><p class='greenCon'>您现在使用的是mozilla系列" + jqbrowser.version + "版本,可以正常使用系统</p></div>");
        } else if (jQuery.browser.safari) {//safari系列
            jQuery("#rh_test_browser").append("<div align=center><p class='greenCon'>您现在使用的是safari系列" + jqbrowser.version + "版本,可以正常使用系统</p></div>");
        } else if (jQuery.browser.webkit) {//safari系列
            jQuery("#rh_test_browser").append("<div align=center><p class='greenCon'>您现在使用的是webkit系列" + jqbrowser.version + "版本,可以正常使用系统</p></div>");
        }
    }
    browserCheck();
    //flash测试
    function flashChecker() {
        var hasFlash = 0; //是否安装了flash
        var flashVersion = 0; //flash版本
        if (document.all) {
            try {
                var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                if (swf) {
                    hasFlash = 1;
                    VSwf = swf.GetVariable("$version");
                    flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
                }
            } catch (e) {
            }
        } else {
            if (navigator.plugins && navigator.plugins.length > 0) {
                var swf = navigator.plugins["Shockwave Flash"];
                if (swf) {
                    hasFlash = 1;
                    var words = swf.description.split(" ");
                    for (var i = 0; i < words.length; ++i) {
                        if (isNaN(parseInt(words[i]))) continue;
                        flashVersion = parseInt(words[i]);
                    }
                }
            }
        }
        return {f: hasFlash, v: flashVersion};
    }
    if (testBrower()) {
        var fls = flashChecker();
        if (fls.f && parseInt(fls.v) >= 9) {
            jQuery("#rh_test_flash").append("<div align=center><p class='greenCon'>您已安装了Flash，当前Flash版本为: " + fls.v + ".x</p></div>");
        } else {
            var flashObj = '<object id="testObj" width="1" height="1" type="application/x-shockwave-flash" codebase="' + FireFly.getContextPath() + '/sy/comm/index/file/flash.exe#version=9,0,0,0">' +
                    '<param name="movie" value="' + FireFly.getContextPath() + '/sy/base/frame/coms/file/swfupload.swf?preventswfcaching=1372215021895" /></object>';
            jQuery("#rh_test_flash").append("<div align=center><p class='yellowCon'>未安装Flash或者版本为9.0以下，正在给您安装flash,请稍候... <a href='" + FireFly.getContextPath() + "/sy/comm/index/file/flash.exe' class='rh_test_a'>手动下载安装</a><div style='width:1px;height:1px;display:inline-block;' id='flashObj'>" + flashObj + "</div></p></div>");
        }

    }
    //系统插件测试
    function batCheck() {
        jQuery("#rh_test_bat").append("<div align=center><p class='yellowCon'>系统需要添加可信任站点，请先下载此文件并解压后双击执行。<br>请下载并安装 <a href='" + FireFly.getContextPath() + "/sy/comm/index/file/addTrust.zip' class='rh_test_a'>添加可信任站点文件</a>。如已经执行，请忽略。</p></div>");
    }
    if (testBrower()) {
        batCheck();
    }
    //系统插件问题
    if (testBrower() == false) {
        jQuery("#rh_test_container_add").empty().remove();
        jQuery("#rh_test_container_flash").empty().remove();
        jQuery("#rh_test_container_ntko").empty().remove();
        jQuery("#rh_test_container_zotn").empty().remove();
    }
</script>
</html>



