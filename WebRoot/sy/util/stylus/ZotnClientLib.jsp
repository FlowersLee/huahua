<OBJECT ID="ZotnClient" width="1" height="1" name="ZotnClient" CLASSID="clsid:1109D74E-5427-465E-BDC3-261BC5ED3C55" codebase="/sy/util/stylus/ZotnClientLib2.CAB#version=2,0,0,17">
</OBJECT>
<SCRIPT LANGUAGE="JavaScript">
    var ZotnClient  = document.all("ZotnClient");
    ZotnClient.showRevisionForEdit = 1;
    ZotnClient.protectedTypeForRead = 1;
	ZotnClient.EditorWordTypes = "doc,docx";
</SCRIPT>

<SCRIPT LANGUAGE="JavaScript">
/**取得WEB服务器的URL，如：http://172.16.0.1:80**/
function getHostURL(){
 /* var jct=Cookie.get("IV_JCT");
  if (!jct==null||!jct==""){
   jct="/"+jct.substring(3);
   strRtn = window.location.protocol + "//" + window.location.host+jct;
  } else {
*/
   strRtn = window.location.protocol + "//" + window.location.host;
/*  }
*/
  return strRtn;
}
</SCRIPT>

