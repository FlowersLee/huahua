var _viewer = this;
jQuery(jQuery("a[href='#SY_COMM_ENTITY_GL-mainTab']").parent()).hide();
jQuery("div#SY_COMM_ENTITY_GL-mainTab").hide();//remove();
jQuery("a[href='#SY_COMM_FILE_DATA']").trigger("click");
//_viewer.getParams().handler;
_viewer.getParHandler();