<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@ page import="java.util.*" %>
<%@ page import="com.rh.core.util.*" %>
<%@ page import="com.rh.core.base.*" %>
<%@ page import="com.rh.core.plug.search.*" %>
<%@ page import="com.rh.core.comm.*" %>
<%@ page import="com.rh.core.serv.dict.*" %>
<%@ page import="com.rh.core.serv.*" %>
<%@ page import="com.rh.core.serv.bean.PageBean" %>
<%@ page import="com.rh.core.serv.util.ServConstant" %>
<%@ page import="java.text.*" %>
<%@ page import="java.net.*" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
    <title>Ruaho Search</title>

    <%@ include file="/sy/base/view/inHeader.jsp" %>

    <script src="<%=urlPath%>/sy/plug/search/suggest.js" type=text/javascript></script>
    <script src="<%=urlPath%>/sy/plug/search/search.js" type=text/javascript></script>

    <link rel="stylesheet" type="text/css" href="<%=urlPath%>/sy/plug/search/rhSearchResult.css"/>
    <link rel="stylesheet" type="text/css" href="<%=urlPath%>/sy/plug/search/preview.css"/>
    <link rel="stylesheet" type="text/css" href="<%=urlPath%>/sy/theme/default/icon.css"/>
    <style type="text/css">
        .blank {
            margin-right: 0px;
            padding-left: 20px;
        }
    </style>
    <%
        String allDevUsers = Context.getSyConf("SY_DEV_USERS", "");//开发用户
        boolean manager = false;
        String currentUser = "";
        UserBean currentUserBean = Context.getUserBean(request);
        if (currentUserBean != null) {
            currentUser = currentUserBean.getLoginName();
        }
        if (-1 < ("," + allDevUsers + ",").indexOf(currentUser)) {
            manager = true;
        }

        String suggestServer = SearchServ.getSuggestionUri();
        String spellcheckServer = SearchServ.getSpellcheckUri();
        OutBean outBean = (OutBean) request.getAttribute(Constant.RTN_DISP_DATA);
        PageBean pageBean = outBean.getPage();
        List<Bean> dataList = outBean.getDataList();
        String queryStr = outBean.getStr("SEARCH_QUERY");
        String lastQuery = outBean.getStr("SEARCH_LAST_QUERY");
        String keywords = outBean.getStr("SEARCH_KEYWORDS");
        String sort = outBean.getStr("SEARCH_SORT");
        String startTime = outBean.getStr("SEARCH_STARTTIME");
        String endTime = outBean.getStr("SEARCH_ENDTIME");
        List<Bean> selectedCatList = outBean.getList("SELECTED_CATS");
        List<Bean> filterList = outBean.getList("SEARCH_FILTER");
        //cache已选服务类型，公司.用于左侧默认选中
        String selectedServId = "";
        String selectedServVal = "";
        String selectedCmpyId = "";
        String selectedCmpyVal = "";

        //加载左侧已选过滤条件
        for (Bean filterBean : filterList) {
            if (filterBean.getStr("id").equals("company")) {
                selectedCmpyId += filterBean.getStr("id") + ",";
                selectedCmpyVal += filterBean.getStr("data") + ",";
            } else if (filterBean.getStr("id").equals("service")) {
                selectedServId += filterBean.getStr("id") + ",";
                selectedServVal += filterBean.getStr("data") + ",";
            }
        }


        //默认分组
        List<Bean> allCategory = new ArrayList<Bean>();
        allCategory.add(new Bean().set("id", "service").set("name", "按类别").set("level", "1"));
        allCategory.add(new Bean().set("id", "company").set("name", "按公司").set("level", "1"));
        allCategory.add(new Bean().set("id", "owner").set("name", "按创建人").set("level", "1"));

        //如果已选择服务，我们显示2级分组导航
        for (Bean selectedCat : selectedCatList) {
            if (selectedCat.getStr("type").equals("service")) {
                allCategory.clear();

                String servId = selectedCat.getStr("id");
                ServDefBean servDef = ServUtils.getServDef(servId);
                if (servId.equals(ServMgr.SY_PLUG_SEARCH_WEB)) {
                    Bean host = new Bean().set("name", "站点").set("level", "2").set("id", "host_strfield");
                    allCategory.add(host);
                    Bean cat = new Bean().set("name", "栏目").set("level", "2").set("id", "category_strfield");
                    allCategory.add(cat);
                    continue;
                }
                //查询2级分类字段
                String groups = ServUtils.getIndexGroupItmes(servDef);
                String[] items = groups.split(Constant.SEPARATOR);
                for (String itemCode : items) {
                    Bean item = servDef.getItem(itemCode);
                    if (null == item) {
                        continue;
                    }
                    String itemTag = item.getStr("ITEM_CODE");
                    String display = item.getStr("ITEM_NAME");
                    Bean cat = new Bean().set("name", display).set("level", "2");
                    if (item.getStr("ITEM_FIELD_TYPE").equals(ServConstant.ITEM_FIELD_TYPE_NUM)) {
                        cat.set("id", itemTag + "_numfield");
                    } else if (item.getStr("ITEM_FIELD_TYPE").equals(ServConstant.ITEM_FIELD_TYPE_DATE)) {
                        cat.set("id", itemTag + "_datefield");
                    } else {
                        cat.set("id", itemTag + "_strfield");
                    }
                    allCategory.add(cat);
                }
                break;
            }
        }
    %>
    <script>
        function startSuggest() {
            var server = "<%=suggestServer%>";
            var list = [""];
            new Suggest.Local("putKeyWords", // input element id.
                    "suggest", // suggestion area id.
                    server + "?rtn=js&w=",
                    "querySearch()",
                    list, {
                        dispMax: 10,
                        interval: 10
                    }); // options
        }

        window.addEventListener ? window.addEventListener('load', startSuggest, false) : window.attachEvent('onload', startSuggest);

        //进入页面加载数据
        function loadData() {
            var sServer = "<%=suggestServer%>";
            var scServer = "<%=spellcheckServer%>";
            var keyWords = '<%=keywords%>';
            //加载相关搜索
            Search.startSimilarSearch(sServer, keyWords);
            //加载拼写检查
            Search.spellCheck(scServer, keyWords);

            //加载相关数据
            Search.loadrelevantSearch();

            <%
            //动态加载分类导航
            for (Bean cat: allCategory) {
                boolean isDisplay = true;
                //过滤掉已选分类
                for (Bean selCat : selectedCatList) {
                    if (selCat.getStr("type") .equals(cat.getStr("id"))) {
                        isDisplay = false;
                    }
                }
                if (isDisplay) {
                out.println("Search.groupBy('" + lastQuery + "', '" + cat.getStr("name") + "', '"  + cat.getStr("id") + "','" + cat.get("level", 1) +"');");
                }
            }
            %>
            Search.loadSelectedCache();
            Search.loadFilterCache();

            Search.setOrg("<%=selectedCmpyVal%>", "");
            Search.setServ("<%=selectedServVal%>", "");
        }


        /**
         * 打开搜索结果
         */
        function openNewTab(url, title) {
            var opts = {'scrollFlag': true, 'url': url, 'tTitle': title, 'menuFlag': 3};
            Tab.open(opts);
        }
        ;


    </script>
</head>
<%
    String titleKeyWordsContent = "";
    String allKeyWords = "";
    List<String> keyWordsList = new ArrayList();
    String keyWords = "";
    String noKeyWords = "";

    if (keyWords != null) {
        titleKeyWordsContent = titleKeyWordsContent + keyWords;
        String[] arrKeyWords = keyWords.split(" ");
        for (String str : arrKeyWords) keyWordsList.add(str.trim());
    }
    if (allKeyWords != null) {
        titleKeyWordsContent = titleKeyWordsContent + " '" + allKeyWords + "'";
        String[] arrKeyWords = allKeyWords.split(" ");
        for (String str : arrKeyWords) keyWordsList.add(str.trim());
    }

    if (noKeyWords != null) {
        titleKeyWordsContent = titleKeyWordsContent + " -" + noKeyWords;
    }


%>
<body dir="ltr" id="gsr" class="" topmargin="3" lang="zh-Hans" marginheight="3">
<div id="main">
<div>
<!--rh-头部--搜索和用时开始-->
<div id="cnt">
    <div class="clearfix rh-search-first-line">
        <div class="rh-search-icon"></div>
        <div id="sfcnt" class="rh-search-first-line-right">
            <form id="searchForm" action="/SY_PLUG_SEARCH.query.do" method="post" onsubmit="Search.search()"
                  role="search">
                <div class="tsf-p" style="padding-bottom: 2px;">
                    <div class="rh-search-input">
                        <div class="rh-search-input-pre"></div>
                        <div class="rh-search-input-bk">
                            <input type="text" id="putKeyWords" value='<%out.println(keywords);%>' title="Ruaho 搜索"
                                   autocomplete="off" class="lst"
                                   name="titleKeyWordsContent" maxlength="2048"/>
                            <input type="hidden" id="data" name="data" value=""/>
                            <input type="hidden" id="lastQuery" name="lastQuery" value="<%=queryStr%>"/>
                            <input type="hidden" id="startTime" name="lastQuery" value="<%=startTime%>"/>
                            <input type="hidden" id="endTime" name="lastQuery" value="<%=endTime%>"/>
                            <input type="hidden" id="categoryCache" name="categoryCache"
                                   value='<%
                                  			 	String selectedCatListStr= JsonUtils.toJson(selectedCatList);
                                  			  	out.println(selectedCatListStr);
                                  			  %>'/>
                            <input type="hidden" id="filterCache" name="filterCache"
                                   value='<%String filterCacheStr= JsonUtils.toJson(filterList);
                                  			  		out.println(filterCacheStr);
                                  			  		%>'/>
                            <span style="display: none;" id="tsf-oq"><%=request.getAttribute("keyWords")%> </span>
                        </div>
                        <div class="rh-search-sea" onclick="javascript:Search.search()"></div>
                    </div>
                    <div style="position: relative; z-index: 2;">
                        <div class="lsd"></div>
                    </div>
                    <div id="suggest" style="display: none; left: 18%; top: 57px; width: 609px; z-index: 10"></div>
                    </td>
                </div>
            </form>
        </div>
    </div>
    <!-- 搜索头第一行结束-->
    <!-- 搜索头第二行开始-->
    <div class="clearfix rh-search-second-line">
        <div class="rh-yongshi-img">
            <span class="rh-yongshi-span">智能搜索</span>
        </div>
        <%
            long allResult = pageBean.getAllNum();
            String alResultStr = NumberFormat.getInstance().format(allResult);
        %>
        <!-- rh -用时开始-->
        <div id="subform_ctrl" class="rh-yongshi">
            <div class="rh-yongshi-con">
                <div id="resultStats" style="position: relative">
                    找到相关结果约<%=allResult%>个
                    <nobr> （用时 <%=outBean.getInt("SEARCH_QT_TIME") / 1000.0%> 秒）</nobr>
                    <div id="order" style="position: absolute; right: 0; top: 0px;">
                        排序: <a class='l' href=javascript:Search.orderBy('')>相关性</a>
                        <%
                            if (sort.startsWith("last_modified") && sort.endsWith("asc")) {
                                out.println("<a class='l' href=javascript:Search.orderBy('last_modified+desc')>更新时间 </a> <span class='rhGrid-thead-orderSpan'>↑</span>");
                            } else if (sort.startsWith("last_modified") && sort.endsWith("desc")) {
                                out.println("<a class='l' href=javascript:Search.orderBy('last_modified+asc')>更新时间 </a><span class='rhGrid-thead-orderSpan'>↓</span>");
                            } else {
                                out.println("<a class='l' href=javascript:Search.orderBy('last_modified+desc')>更新时间 </a><span class='rhGrid-thead-orderSpan'></span>");
                            }
                        %>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 搜索头第二行结束-->

</div>
<!--rh-头部--搜索和用时结束-->
<!--拼写检查-->
<div>
    <div id="spellcheck" style="margin-left: 20%"></div>
</div>
<!--拼写检查结束-->
<div class="rh-container" id="nr_container">
<div id="center_col" class="rh-container-con">
<!--
    <div class="rh-xg-top">
        <span class="rh-xg-topLabel">相关搜索：</span>
        <div id="dependence" class="rh-xg-topCon"></div>
    </div>
-->
<div id="res" role="main" class="rh-container-main">
<div id="search" class="rh-res">
<div id="ires">
<ol id="rso">
<li class="rh-res-li">
    <div class="vsc" sig="Owt">
        <!--内容列表-->
        <%
            List<Bean> relevantSearch = new ArrayList<Bean>();
            int docIndex = 0;
            for (Bean bean : dataList) {
                docIndex++;
                String service = bean.getStr(ARhIndex.SERVICE);
                String abstractText = bean.getStr(ARhIndex.DISPLAY_ABSTRACT);
                String serviceName = DictMgr.getName("SY_SERV_SEARCH", service);
                if (null == serviceName || 0 == serviceName.length()) {
                    serviceName = DictMgr.getName("SY_SERV", service);
                }
                if (service.equals(ServMgr.SY_PLUG_SEARCH_WEB)) {
                    serviceName = "互联网";
                }
                serviceName = "[" + serviceName + "]";
                String title = bean.getStr(ARhIndex.DISPLAY_TITLE);
                String displayTitle = title;
                String content = bean.getStr(ARhIndex.CONTENT);
                String url = bean.getStr(ARhIndex.URL);
                String id = bean.getStr(ARhIndex.INDEX_ID);
                String contFile = bean.getStr("file_path_strfield");
                List<Bean> attList = bean.getList(ARhIndex.ATTACHMENT);
                int flag = 1;
                String[] tags = id.split(",");
                String servId = "unknow";
                String dataId = "unknow";
                if (tags.length > 1) {
                    servId = tags[0];
                    dataId = tags[1];
                }
                if (servId.equals("SY_COMM_ZHIDAO_QUESTION")) {
                    url = "/cms/SY_COMM_ZHIDAO_QUESTION/" + dataId + ".html";
                } else if (servId.equals("SY_COMM_WENKU_DOCUMENT")) {
                    url = "/cms/SY_COMM_WENKU_DOCUMENT/" + dataId + ".html";
                }
                if (null == url || 0 == url.length()) {
                    url = service + ".card.do?pkCode=" + dataId;
                }
        %>
											<span class="tl"> <a
                                                    href="javascript:Search.searchByCat('service','<%=servId%>','',1)"
                                                    class="" onmousedown=""><%=serviceName%>
                                            </a> &nbsp; <%
                                                //标题
                                                if (id.startsWith("http://")) {
                                                    out.println(" <a target='_blank' href='" + id + "'  class='rh-res-title' >" + displayTitle + "</a> ");
                                                } else {
                                                    out.println(" <a  onClick=\"javascript:openNewTab('" + url + "','" + title + "');\"  class='rh-res-title' >" + displayTitle + "</a> ");
                                                }

                                                //正文-在线预览
                                                if (contFile.startsWith("/file/")) {
                                                    contFile = contFile.substring("/file/".length());
                                                }
                                                if (contFile.startsWith("internal://")) {
                                                    contFile = contFile.substring("internal://".length());
                                                }
                                                if (0 < contFile.length()) {
                                                    out.println(" <a style='color: #666666;'   href=\"javascript:openOnlinePreviewTab('" + service + "','" + displayTitle + "','" + contFile + "');\" > 在线预览 </a> ");
                                                }

                                                //删除
                                                if (manager) {
                                                    out.println("<a class='rhSearch-load-a' href=\"javascript:Search.deleteIndex('" + id + "')\"'>删除</a>");
                                                }

                                            %>

												 
												<button class="rh-res-btn-prev"></button>
											</span>

        <div style="color: block" class="s">
            <div class="rh-contentPreview">
                <%
                    //摘要
                    out.println(abstractText);
                    //相关搜索
                    String relevantOutput = "relevantsearch_" + docIndex;
                    List<String> relativeList = bean.getList(ARhIndex.RELATIVE);
                    if (relativeList != null && 0 < relativeList.size()) {
                        String relativesStr = "";
                        for (String relative : relativeList) {
                            //not contain self
                            if (relative.startsWith(ARhIndex.RELATIVE_TYPE.SY_PLUG_SEARCH_SERV.toString())) {
                                relative = relative.replace("://", "://(");
                                relative = relative + ") AND  !id:" + id + "";
                            }
                            relativesStr += relative + "_@_&_";
                        }
                        Bean relevant = new Bean();
                        relevant.set("title", title);
                        relevant.set("query", relativesStr);
                        relevant.set("service", service);
                        relevant.set("output", relevantOutput);
                        relevantSearch.add(relevant);
                    }
                    out.println("<div id='" + relevantOutput + "'></div>");
                    //content-预览
                    out.println("<span class=\"rh-res-file-prevSpan\">");
                    out.println("<a class=\"rh-res-file-prev\"  href='#' onclick=\"Search.preview(" + flag + ",'" + id + "','content',this);return false;\"><span class=\"rh-res-file-arr hide\"><em class=\"rh-res-file-img\"></em></span></a>");
                    out.println("</span>");
                %>
            </div>
            <%

                for (Bean attBean : attList) {
                    String attId = attBean.getStr(SearchServ.ATTACHMENT_ID);
                    String attTitle = attBean.getStr(SearchServ.ATTACHMENT_TITLE);
                    String attPath = attBean.getStr(SearchServ.ATTACHMENT_PATH);
                    String attMtype = attBean.getStr(SearchServ.ATTACHMENT_MTYPE);
                    String attIndex = attBean.getStr(SearchServ.ATTACHMENT_INDEX);
                    String attContent = attBean.getStr("att_content");
                    out.println("<div class=\"rh-contentPreview\">");

                    //附件-图标
                    if (attMtype.length() > 0) {
                        // out.println("[" + attMtype + "]");
                        String icon = "";
                        if (attMtype.equals("xls") || attMtype.equals("xlsx")) {
                            icon = "icon-excel";
                        } else if (attMtype.endsWith("swf") || attMtype.endsWith("flv")) {
                            icon = "icon-flash";
                        } else if (attMtype.endsWith("pdf")) {
                            icon = "icon-pdf";
                        } else if (attMtype.endsWith("ppt")) {
                            icon = "icon-ppt";
                        } else if (attMtype.endsWith("doc") || attMtype.endsWith("docx") || attMtype.endsWith("xdoc")) {
                            icon = "icon-word";
                        } else if (attMtype.endsWith("txt") || attMtype.endsWith("asc")) {
                            icon = "icon-txt";
                        } else if (attMtype.endsWith("gif") || attMtype.endsWith("png") || attMtype.endsWith("jpg") || attMtype.endsWith("jpeg")) {
                            icon = "icon-image";
                        } else if (attMtype.endsWith("zip") || attMtype.endsWith("rar") || attMtype.endsWith("7z") || attMtype.endsWith("gzip") || attMtype.endsWith("tar") || attMtype.endsWith("gz")) {
                            icon = "icon-zip";
                        } else {
                            icon = "icon-unknown";
                        }
                        out.println("<span class='blank " + icon + "'></span>");
                    }
                    //附件-标题
                    //  out.println("<font  color=\"#008000\">" + attTitle +"</font>");
                    out.println("<a target='_blank' class='rhSearch-load-a' href='" + attPath + "'>" + attTitle + "</a>");
                    //附件-下载
                    String download = "";
                    if (-1 < attPath.indexOf("?")) {
                        download = attPath + "&act=download";
                    } else {
                        download = attPath + "?act=download";
                    }
                    out.println("<a target='_blank' class='rhSearch-load-a' href='" + download + "'>下载</a>");
                    out.println("&nbsp;");
                    //附件-打开
                    // out.println("<a target='_blank' style='color: #666666;' href='" + attPath + "'>打开</a>");

                    //附件-在线预览
                    String fileUrl = "";
                    if (attPath.startsWith("http://")) {
                        fileUrl = attPath;
                    } else {
                        fileUrl = attPath;
                        if (fileUrl.startsWith("/file/")) {
                            fileUrl = fileUrl.substring("/file/".length());
                        }
                    }
                    out.println(" <a style='color: #666666;'   href=\"javascript:openOnlinePreviewTab('" + service + "','" + attTitle + "','" + fileUrl + "');\" > 在线预览 </a> ");

                    out.println("<br>");
                    out.println("<span class=\"rh-res-file\">");
                    out.println(attContent);
                    //附件-预览
                    out.println("</span>");
                    String previewField = "attachment" + attIndex;
                    out.println("<span class=\"rh-res-file-prevSpan\">");
                    out.println("<a class=\"rh-res-file-prev\" href='#' onclick=\"Search.preview(" + flag + ",'" + id + "','" + previewField + "',this)\"><span class=\"rh-res-file-arr hide\"><em class=\"rh-res-file-img\"></em></span></a>");
                    out.println("</span>");
                    out.println("</div>");
                }
            %>
        </div>
    </div>
</li>
<li class="rh-res-li">
    <div class="vsc" sig="mVp">
            <%
										  	flag++;
										  	}
									   		
										  %>
        <!-- 相关搜索数据缓存 -->
        <input type="hidden" id="relevantSearchData"
               name="relevantSearchData"
               value='<% String relevantSearchStr= JsonUtils.toJson(relevantSearch);
													   relevantSearchStr = relevantSearchStr.replace("'", "__@1_");
				                                       out.println(relevantSearchStr); %>'/>

        <!--内容列表-->
</li>
</td>
</tr>
</tbody>
</table>
</li>
</ol>
</div>
</div>
</div>
</div>
<div id="rcnt">
    <div id="leftnavc">
        <div id="leftnav">
            <div id="rh-left-top" class="rh-left-top">
                <li
                        class="<%=!SearchServ.contains(filterList, "service")&&!SearchServ.contains(filterList, "company")? "rh-left-allRes":"rh-left-allRes-black" %>"><%=!SearchServ.contains(filterList, "service") && !SearchServ.contains(filterList, "company") ? "<span class='rh-left-active'></span>" : "" %><a
                        class="rh-all-result" href="javascript:Search.reSearch()">所有结果</a></li>
                <!--     类别--单选
			    			<h2 ><%//SearchServ.contains(filterList, "service")? "<span class='rh-left-active'></span>":"" %> 请选择类别：</h2>
			    			<select class="" id="selectedServ" onchange="Search.searchByServ()">
			    			<option value="all">----全部----</option>
			    			<% 
			    			/*
			    			 //加载所有服务
			    			 List<Bean> serviceList = ServUtils.getSearchableServ();
			     			for (Bean serv: serviceList) {
			    				if (selectedServId.equals(serv.getStr("ID"))) {
			    					out.println("<option selected='selected' value='" + serv.getStr("ID") + "'>"+ serv.getStr("NAME") + "</option>");
			    				} else {
			    					out.println("<option value='" + serv.getStr("ID") + "'>"+ serv.getStr("NAME") + "</option>");
			    				}
			    			 
			    			} */
			    			%>
			    			</select>
 -->

                <!-- 类别--多选 -->
                <h2><%=SearchServ.contains(filterList, "service") ? "<span class='rh-left-active'></span>" : "" %>
                    请选择类别：<a href="javascript:Search.clearServ();">清空</a>
                </h2>
                <input type="hidden" id="rh-select-serv-id"/> <input
                    type="text" class="rh-select-serv"
                    style="-moz-box-shadow: 1px 1px 1px #BDBEBB inset; -webkit-box-shadow: 1px 1px 1px #BDBEBB inset; box-shadow: 1px 1px 1px #BDBEBB inset;"
                    id="rh-select-serv" value='----类别选择----'
                    onclick="Search.getServ()"/>


                <h2><%=SearchServ.contains(filterList, "company") ? "<span class='rh-left-active'></span>" : "" %>请选择单位：<a
                        href="javascript:Search.clearOrg();">清空</a>
                </h2>
                <input type="hidden" id="rh-select-cmpy-id"/> <input
                    type="text" class=""
                    style="-moz-box-shadow: 1px 1px 1px #BDBEBB inset; -webkit-box-shadow: 1px 1px 1px #BDBEBB inset; box-shadow: 1px 1px 1px #BDBEBB inset;"
                    id="rh-select-cmpy" value='----单位选择----'
                    onclick="Search.getOrg()"/>
            </div>
            <div class="rh-left-nav-time"
                 style="clear: both; overflow: hidden;">
                <!-- 分类查找 按时间范围 -->
                <li>
                    <ul class="tbt tbpd">
                        <li class="tbou" id="rltm_1"><a
                                href="javascript:Search.searchByDate('all')"
                                class="rh-all-result<%=SearchServ.contains(filterList,"date")?"":" timeActive" %>">时间不限</a>
                        </li>
                        <li class="tbou" id="qdr_d"><a
                                href="javascript:Search.searchByDate('d')"
                                class="q qs<%=SearchServ.containsDateFilter(filterList, "date_d")?" timeActive":"" %>">
                            过去24小时内</a></li>
                        <li class="tbou" id="qdr_w"><a
                                href="javascript:Search.searchByDate('w')"
                                class="q qs<%=SearchServ.containsDateFilter(filterList, "date_w")?" timeActive":"" %>">
                            过去1周内</a></li>
                        <li class="tbou" id="qdr_m"><a
                                href="javascript:Search.searchByDate('m')"
                                class="q qs<%=SearchServ.containsDateFilter(filterList, "date_m")?" timeActive":"" %>">
                            过去1 个月内</a></li>
                        <li class="tbou" id="qdr_y"><a
                                href="javascript:Search.searchByDate('y')"
                                class="q qs<%=SearchServ.containsDateFilter(filterList, "date_y")?" timeActive":"" %>">
                            过去1 年内 </a></li>
                        <li
                                class="q qs<%=SearchServ.containsDateFilter(filterList, "date_c")?" timeActive":"" %>"
                                id="cdr_opt">自定日期范围...
                            <table style="width: 130px; border-collapse: collapse;">
                                <tbody>
                                <tr>
                                    <td><label for="cdr_min">从</label></td>
                                    <td width="100%"><input id="cdr_min" name="beginTime"
                                                            style="width: 100px; height: 16px; margin: 5px 0px;"
                                                            type="text" onClick="WdatePicker({dateFmt:'yyyy-MM-dd'})">
                                    </td>
                                </tr>
                                <tr>
                                    <td><label for="cdr_max">到</label></td>
                                    <td><input id="cdr_max" type="text" name="endTime"
                                               style="width: 100px; height: 16px;"
                                               onClick="WdatePicker({dateFmt:'yyyy-MM-dd'})"></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td class="hint"
                                        style="color: rgb(102, 102, 102); font-size: 84%; padding-bottom: 2px; font-weight: normal;">
                                        例如:2012-09-08
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><input value="&nbsp;搜索&nbsp;" type="submit"
                                               onClick="javascript:Search.searchByCustomTime()"
                                               class="rh-left-btn"/></td>
                                </tr>
                                </tbody>
                            </table>

                        </li>
                    </ul>
                </li>
                <li>
                    <ul class="tbt">
                        <li class="tbos" id="whv_"></li>
                        <li class="tbou" id="img_1"><a href="#" class="q qs"></a>
                        </li>
                    </ul>
                </li>
                </ul>
            </div>
        </div>
    </div>
</div>
<div id="rh-right-nav" class="rh-right-nav">
    <div id="ms">
        <ul id="allResult">
            <!--ajax分类查找， 按服务-->
        </ul>
    </div>
    <div class="rh-all-result">在结果中搜索</div>
    <li id="group-search-history">
        <%
            for (Bean selectedGroup : selectedCatList) {
                String name = selectedGroup.getStr("name");
                if (name.length() > 8) {
                    name = name.substring(0, 6) + "...";
                }
                out.println("<li class='tbou'>" + name + "&nbsp;&nbsp;&nbsp;<a href='javascript:Search.unSearchByCat(\"" + selectedGroup.getStr("type") + "\")'>返回</a>" + "</li>");
            }
            if (1 < selectedCatList.size()) {
                out.println("<li class='tbou'><a href='javascript:Search.unSearch()'>全部取消</a></li>");
            }

        %>
    </li>
    <li id="group-list">
        <ul id="resultCompany" class="tbt tbpd">
            <!--动态显示-->
        </ul>
    </li>

</div>


<!--rh-底部--分页和帮助-->
<div class="tsf-p" id="foot" role="contentinfo">
    <div id="navcnt" class="rh-page">
        <table
                style="border-collapse: collapse; text-align: left; direction: ltr; margin: 17px auto 0pt;"
                id="nav">
            <tbody>
            <tr valign="top">
                <!--分页-->
                <%
                    int pageCurrentPage = pageBean.getNowPage();
                    if (pageCurrentPage != 1) {
                %>
                <td><a id="pnnext" class="pn"
                       style="text-decoration: none; text-align: left;"
                       href="javascript:Search.page(<%=pageCurrentPage-1%>)"> <span
                        class="csb ch"
                        style="background-position: -96px 0pt; width: 71px;">
										</span> <span class="rh-page-pre">上一页</span>
                </a></td>

                <%
                    }
                    long pagePageTotal = pageBean.getPages();
                    long totalResult = pageBean.getAllNum();
                    int startPage = 0;
                    int maxPage = 0;
                    if (pageCurrentPage > 10) {
                        startPage = pageCurrentPage > 10 ? pageCurrentPage - 9 : 1;
                        maxPage = (pageCurrentPage - startPage) < 10 ? startPage + 20 : pageCurrentPage + 5;
                    } else {
                        startPage = 1;
                        maxPage = 9 + pageCurrentPage;
                    }
                    if (pagePageTotal > 20 + pageCurrentPage) {
                        for (int i = startPage; i <= (maxPage < pagePageTotal ? maxPage : pagePageTotal); i++) {
                            if (i == pageCurrentPage) {

                %>
                <td class="cur"><a class="rh-page-cur"> <span
                        class="csb"
                        style="background-position: -53px 0pt; width: 20px;">
										</span> <%=i%>
                </a></td>
                <%
                } else {
                %>
                <td><a class="f1" href="javascript:Search.page(<%=i%>)">
											<span class="csb ch"
                                                  style="background-position: -74px 0pt; width: 20px;"></span>
                    <%=i%>
                </a></td>
                <%
                        }
                    }
                } else {
                    for (int i = startPage; i <= (maxPage < pagePageTotal ? maxPage : pagePageTotal); i++) {
                        if (i == pageCurrentPage) {
                %>
                <td class="cur"><a class="rh-page-cur"> <span
                        class="csb"
                        style="background-position: -53px 0pt; width: 20px;">
										</span> <%=i%>
                </a></td>
                <%
                } else {
                %>
                <td><a class="f1" href="javascript:Search.page(<%=i%>)">
											<span class="csb ch"
                                                  style="background-position: -74px 0pt; width: 20px;"></span>
                    <%=i%>
                </a></td>
                <%
                            }
                        }
                    }
                    if (pagePageTotal > pageCurrentPage && 0 != totalResult) {
                %>
                <!--下一页-->
                <td><a id="pnnext" class="pn"
                       style="text-decoration: none; text-align: left;"
                       href="javascript:Search.page(<%=pageCurrentPage+1%>)"> <span
                        class="csb ch"
                        style="background-position: -96px 0pt; width: 71px;">
										</span> <span class="rh-page-next">下一页</span>
                </a></td>
                <%}%>
                <!--下一页-->
            </tr>
            </tbody>
        </table>
    </div>
</div>
<!--rh-底部--分页和帮助结束-->
</div>
</div>
</div>

<!--rh-相关搜索开始-->
<div id="botstuff" class="rh-xg-bot">
    <div id="brs" class="rh-xg-bottom">
        <div id="similar" style="font-size:14px; line-height: 19px;font-weight: bold;"></div>
        <div id="similar1" class="rh-xg-big">
            <!--动态显示-->
        </div>
        <div id="similar2" class="rh-xg-big">
            <!--动态显示-->
        </div>
    </div>
</div>
<!--rh-相关搜索结束-->
</div>


<!-- 底部搜索框  -->
<% if (null != dataList && dataList.size() > 0) { %>
<div class="rh-search-input rh-footerSearch">
    <div class="rh-search-input-pre"></div>
    <div class="rh-search-input-bk">
        <input id="putKeyWords2"
               value='<%
						out.println(keywords);
				%>'
               title="Ruaho 搜索" autocomplete="off" class="lst"
               name="titleKeyWordsContent" maxlength="2048" type="text"/> <input
            type="hidden" id="data" name="data" value=""/> <input
            type="hidden" id="lastQuery" name="lastQuery" value="<%=queryStr%>"/>
    </div>
    <div class="rh-search-sea" onclick="javascript:Search.search(2)"></div>
</div>
<%} else { %>
<input id="putKeyWords2" type="hidden"/>
<% }%>
<div class="rh-xg-foot">Copyright ©2012 Ruaho. All Rights Reserved.</div>


<input id="tempScrollTop" value=0 type="hidden"></input>
<!--rh-外部监听变量-->
</body>
<script type="text/javascript">
    jQuery(document).ready(function () {
        loadData();
        top.RHWindow.searchScrollBegin();//启用外部滚动监听
        jQuery("#" + GLOBAL.getFrameId()).parent().css("position", "fixed");
        jQuery("#" + GLOBAL.getFrameId()).css("height", "100%");
        Search.init();
        // Tab.setFrameHei();
        //Search.filePreview();
        // Search.contentPreview();
        Search.autoHide();
        //监听输入框event
        jQuery("#suggest").bind('click', function () {
            querySearch();
        });
    });

    querySearch = function () {
        var keywords = jQuery("#putKeyWords").val();
        Search.searchByKeyword(keywords);
    };

    openOnlinePreviewTab = function (service, title, srcUrl) {
        srcUrl = encodeURIComponent(srcUrl);
        var previewUrl = '/file/' + srcUrl + "?act=preview&name=" + title;
        window.open(previewUrl);
//	 var opts={'scrollFlag':true , 'sId':service ,'tTitle':title ,'url':previewUrl,'menuFlag':3};
//	   Tab.open(opts);
    };

</script>
</html>
