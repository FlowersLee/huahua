jQuery.fn.extend({
    jsRightMenu: function(options) {
        options = $.extend({
            menuList: []
        }, options);
        return this.each(function() {
            if ($("#div_RightMenu", $(this)).size() == 0) {
                var menuCount = options.menuList.length;
                if (menuCount > 0) {
                    var divMenuList = "<div id=\"div_RightMenu\" class=\"div_RightMenu\">";
                    for (var i = 0; i < menuCount; i++) {
                        divMenuList += "<div class=\"divMenuItem\"  onclick=\"" + options.menuList[i].clickEvent + "\"  onmouseover=\"" + options.menuList[i].mouseoverEvent + "\" onmouseout=\"" + options.menuList[i].mouseoutEvent + "\">" + options.menuList[i].menuName + "</div>";
                    }
                    divMenuList += "</div>";
                    $(this).append(divMenuList);
                    var objM = $(".divMenuItem");
                    $("#div_RightMenu").hide();
                    objM.bind("mouseover", function() {
                        this.style.backgroundColor = "#316ac5";
                        this.style.paddingLeft = "30px";
                    });
                    objM.bind("mouseout", function() {
                        this.style.backgroundColor = '#EAEAEA';
                    });
                }
            }
            this.oncontextmenu = function() {
                var objMenu = $("#div_RightMenu");
                if (objMenu.size() > 0) {
                    objMenu.hide();
                    var event = arguments[0] || window.event;
                    var clientX = event.clientX;
                    var clientY = event.clientY;
                    var redge = document.body.clientWidth - clientX;
                    var bedge = document.body.clientHeight - clientY;
                    var menu = objMenu.get(0);
                    var menuLeft = 0;
                    var menuTop = 0;
                    if (redge < menu.offsetWidth)
                        menuLeft = document.body.scrollLeft + clientX - menu.offsetWidth;
                    else
                        menuLeft = document.body.scrollLeft + clientX;
                    if (bedge < menu.offsetHeight)
                        menuTop = document.body.scrollTop + clientY - menu.offsetHeight;
                    else
                        menuTop = document.body.scrollTop + clientY;
                    objMenu.css({ top: menuTop + "px", left: menuLeft + "px" });
                    objMenu.show();
                    return false;
                }
            }
            document.onclick = function() {
                var objMenu = $("#div_RightMenu");
                if (objMenu.size() > 0) objMenu.hide();
            }
        });
    }
});

