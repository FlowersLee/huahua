<div id='SY_ALL_SEARCH' class='portal-box' style="min-height:100px;">
<div class='portal-box-title'><span class='portal-box-title-icon ${icon}'></span><span class="portal-box-title-label">${title}</span><span class="portal-box-hideBtn  conHeanderTitle-expand"></span></div>
<div class='portal-box-con' style="height:${height}">
<div style="padding:25px 20px 0px 60px;">
<input type="text" id="SY_ALL_SEARCH_INPUT" style="width:80%;float:left;"/><div id="SY_ALL_SEARCH_BTN" class="btn-search" href="#" style="width:16px;height:16px;float:left;margin:2px 0px 0px 15px;cursor:pointer;"></div>
</div>
</div>
</div>
<script type="text/javascript">
(function() {
    function qSearch() {
    	    var keywords = jQuery("#SY_ALL_SEARCH_INPUT").val();
			keywords = encodeURIComponent(keywords);
			var opts = {"sId":"SEARCH-RES","tTitle":"搜索","url":"/SY_SEARCH.query.do?data={'KEYWORDS':'" + keywords + "'}","menuFlag":3};
			Tab.open(opts);
    }
    jQuery(document).ready(function(){
        jQuery("#SY_ALL_SEARCH_BTN").bind("click",function() {
			qSearch();
        });
        jQuery("#SY_ALL_SEARCH_INPUT").bind('keydown', function (e) {
	        var key = e.which;
	        if (key == 13) {
	        	qSearch();
	        }
	    });
    });
})();
</script>
