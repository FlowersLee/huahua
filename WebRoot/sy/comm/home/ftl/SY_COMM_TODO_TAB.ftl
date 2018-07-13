<script type="text/javascript">
    function openMoreTab(){
        var tab = $("li[class*='ui-tabs-selected'] > a");
        if(tab.length > 0){
            var href = tab.attr('href');
            if(href == '#CM_TODO_TAB_DOTO'){
                Tab.open({"tTitle": "待办事务", "url": "SY_COMM_TODO.list.do", "menuFlag": 3});
            }else if(href == '#CM_TODO_TAB_READ'){
                Tab.open({"tTitle": "待阅事务", "url": "SY_COMM_TODO_READ.list.do", "menuFlag": 3});
            }else{
                alert('未知的类型');
            }
        }
    }
</script>

<div id='CM_TODO_TAB' class='portal-box ${boxTheme}'>
    <div id="CM_TODO_TAB_CON" class='portal-box-con portal-box-tab'>
        <ul class='portal-box-title'>
            <li><a href="#CM_TODO_TAB_DOTO">待办</a></li>
            <li><a href="#CM_TODO_TAB_READ">待阅</a></li>
        </ul>
        <div id="CM_TODO_TAB_DOTO">
            <table width="100%">
            <#if (_DATA_0._DATA_?size == 0)>
                <tr>
                    <td align=center>没有事务需要处理！</td>
                </tr>
            </#if>
            <#list _DATA_0._DATA_ as content>
                <tr>
                    <td width='10px' style='font-size:8px;'>&nbsp;&#8226;</td>
                    <td><a href="javascript:void(0);"
                           onclick="openTODOCard('${content.TODO_CODE}','${content.TODO_CODE_NAME}','${content.TODO_OBJECT_ID1}','待办-${content.TODO_TITLE}','${content.TODO_URL!}','${content.TODO_CONTENT!}','${content.TODO_ID!}','${content.OWNER_CODE!}','${content.TODO_CATALOG!}','${id}')"
                           title="${content.TODO_TITLE}">
                        <#if (content.TODO_TITLE?length > 25)>${content.TODO_TITLE?substring(0,25)}
                            ...<#else>${content.TODO_TITLE}</#if>
                    </a></td>
                    <td>${content.SEND_USER_CODE__NAME}</td>
                    <td>${content.TODO_SEND_TIME}</td>
                    <td>${content.TODO_CODE_NAME!}</td>
                </tr>
            </#list>
            </table>
            <div style="float:right;"><a onclick="openMoreTab()">更多...</a></div>
        </div>
        <div id="CM_TODO_TAB_READ">
            <table width="100%">
            <#if (_DATA_1._DATA_?size == 0)>
                <tr>
                    <td align=center>没有主办需要处理！</td>
                </tr>
            </#if>
            <#list _DATA_1._DATA_ as content>
                <tr>
                    <td width='10px' style='font-size:8px;'>&nbsp;&#8226;</td>
                    <td><a href="javascript:void(0);"
                           onclick="openTODOCard('${content.SERV_ID}','${content.TODO_CODE_NAME}','${content.TODO_OBJECT_ID1}','主办-${content.TODO_TITLE}','${content.TODO_URL!}','${content.TODO_CONTENT!}','${content.TODO_ID!}','${content.OWNER_CODE!}','${content.TODO_CATALOG!}','${id}')"
                           title="${content.TODO_TITLE}">
                        <#if (content.TODO_TITLE?length > 25)>${content.TODO_TITLE?substring(0,25)}
                            ...<#else>${content.TODO_TITLE}</#if>
                    </a></td>
                    <td>${content.SEND_USER_CODE__NAME}</td>
                    <td>${content.TODO_SEND_TIME}</td>
                    <td>${content.TODO_CODE_NAME!}</td>
                </tr>
            </#list>
            </table>
        </div>
    </div>
</div>
<script type="text/javascript">
    (function () {
        jQuery(document).ready(function () {
            setTimeout(function () {
                jQuery("#CM_TODO_TAB_CON").tabs({});
            }, 0);
        });
    })();
</script>