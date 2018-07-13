/** 自定义的弹出框组件 */
GLOBAL.namespace("rh.ui");
rh.ui.pop = function(options) {
	var defaults = {
		"id":"",
		"pCon":null,
		"pHandler":null,
		"title":""
	};
	this._opts = jQuery.extend(defaults,options);	
	this._pHandler = this._opts.pHandler;
};
/*
 * 渲染主方法
 */
rh.ui.pop.prototype.render = function() {
   this._rhExtDialog();
   this._initDialog();

};
rh.ui.pop.prototype.display = function (html) {
	var _self = this;
    var d = new jQuery.tExtDialog({
       height: 480,
       width: 900,
       id: _self._opts.id,
       title: _self._opts.title,
       content: html
    });
    d.display();	
    return d;
	
};
/*
 * 构造对话框的布局
 */
rh.ui.pop.prototype._createDialog = function (id, title, parent) {
	  var html = '<div id="dialog_' + id + '" index="' + id + '" class="dialogContainer dialogContainerShadow">';
	  html += '         <div id="dialog_title' + id + '" class="dialog-title">';
	  html += '         	  <span class="dialog-title-icon"></span><span class="dialog-title-text">' + title + '</span>';
	  html += '         	  <a class="dialog-title-text-right" id="dialog-title-text-right">关闭</a></div>';
	  html += '         <div id="dialog_content_' + id + '" class="msg-content"></div>';

	  html += '</div>';
	  $(parent).append(html);
	  $("#dialog_"+id).draggable({handle: 'tr.head',containment: 'window' , scroll: false});	
};
/*
 * 初始化对话框
 */
rh.ui.pop.prototype._initDialog = function () {
	var _self = this;

  
  //对话框关闭按钮
  var dialogClose = jQuery("#dialog-title-text-right");
  dialogClose.live('mousedown', function(){
     var dialog = jQuery('div.dialogContainer:visible', document.body).first();
     dialog.trigger('_hide');
     if (_self._pHandler._refixminScreenbtn) {
	     _self._pHandler._refixminScreenbtn();
     	
     }
     $('#overlay').hide();
     $("body").focus();
     dialog.hide();
  });
};

/*
 * 扩展对话框
 */
rh.ui.pop.prototype._rhExtDialog = function () {
	var _self = this;
    jQuery.extend({
      tExtDialog: function (options) {
         var defaults = {
            width:1200,
            height: 400,
            parent: $("body"),
            title: ''
         };
         
         var options = $.extend(true, defaults, options);
         var width = options.width;
         var height = options.height;
         var id = options.id;
         var title = options.title;
         var parent = options.parent;
         var src = options.src;
         var icon = options.icon;
         var content = options.content;
        
         if(!$('#dialog_' + id).length) {         
            _self._createDialog(id, title, parent);
            $('#dialog_' + id).draggable("destroy");
            $('#dialog_' + id).addClass('extDialog');
            $('#dialog_' + id + ' .dialog tr.head').css("cursor","");
            $('#dialog_' + id).css({"width" : width +"px","height" : height +"px"});
            $('#dialog_' + id + ' > .dialog').css({"width":"100%"});
            $("div.msg-content", $('#dialog_' + id)).css({"height":(height - 48) + "px"})
            if(icon){
               $('#dialog_' + id + ' .dialog .head .center .title').prepend("<img src = '"+icon+"' style='margin-right:5px' width='16' height='16' />");
            }
            if(src){
               $("#dialog_content_"+id).html("<iframe name='iframe' src='" + src +"' width='100%' height='100%' border='0' frameborder='0' marginwidth='0' marginheight='0'></iframe>");
            }else{
               $("#dialog_content_"+id).html(content);   
            }
         }
         
         function display() {
            var wWidth = (window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth));
            var hHeight = (window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight));
            
            var top = left = 0;
            var bst = document.body.scrollTop || document.documentElement.scrollTop;
            top = Math.round((hHeight - height)/2 + bst) + "px";
            mleft = "-" + Math.round(width/2) + "px";
            top = top < 0 ? top = 0 : top;

            $('#dialog_' + id).css({"top":top,"left":"50%","margin-left":mleft});
            $('#dialog_' + id).show();
            $('#overlay').height(window.document.documentElement.scrollHeight);
            $('#overlay').show();
            if (jQuery(".rhDesk-btnActive").length == 0) {//设置选中tab样式，第一次打开时执行
	            jQuery("#btnAppSet").addClass("rhDesk-btnActive");
            }
         }
         return {
            display: display   
         }
      }
    });
};


















