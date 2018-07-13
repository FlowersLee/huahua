var TANGER_OCX_bDocOpen = true;
var TANGER_OCX_filename;
var TANGER_OCX_actionURL; //For auto generate form fiields
var TANGER_OCX_OBJ; //The Control

//2011-02-19 ty 记录当前文档只读属性
var readOnlyFlag;


//以下为V1.7新增函数示例

//从本地增加图片到文档指定位置
function AddPictureFromLocal()
{
	if(TANGER_OCX_bDocOpen)
	{	
    TANGER_OCX_OBJ.AddPicFromLocal(
	"", //路径
	true,//是否提示选择文件
	true,//是否浮动图片
	100,//如果是浮动图片，相对于左边的Left 单位磅
	100); //如果是浮动图片，相对于当前段落Top
	};	
}

//从URL增加图片到文档指定位置
function AddPictureFromURL(URL, left, top, relative)
{
	if(TANGER_OCX_bDocOpen)
	{
	    TANGER_OCX_OBJ.AddPicFromURL(
			URL,//URL 注意；URL必须返回Word支持的图片类型。
			true,//是否浮动图片
			(left?left:0),//如果是浮动图片，相对于左边的Left 单位磅
			(top?top:0),//如果是浮动图片，相对于当前段落Top
			(relative?relative:1)//光标位置
		)
	};
}

//设置用户名
function TANGER_OCX_SetDocUser(cuser) {
	try{
		if(TANGER_OCX_OBJ.ActiveDocument.Application){
			TANGER_OCX_OBJ.ActiveDocument.Application.UserName = cuser;
		}
	}catch(e){
		alert(e.message);
	}
}

function strtrim(value)
{
	return value.replace(/^\s+/,'').replace(/\s+$/,'');
}

//允许或禁止显示修订工具栏和工具菜单（保护修订）
function TANGER_OCX_EnableReviewBar(boolvalue)
{
	TANGER_OCX_OBJ.ActiveDocument.CommandBars("Reviewing").Enabled = boolvalue;
	TANGER_OCX_OBJ.ActiveDocument.CommandBars("Track Changes").Enabled = boolvalue;
	TANGER_OCX_OBJ.IsShowToolMenu = boolvalue;	//关闭或打开工具菜单
}

//打开或者关闭修订模式
function TANGER_OCX_SetReviewMode(boolvalue)
{
	TANGER_OCX_OBJ.ActiveDocument.TrackRevisions = boolvalue;
}

//进入或退出痕迹保留状态，调用上面的两个函数
function TANGER_OCX_SetMarkModify(boolvalue)
{
	try {
		TANGER_OCX_SetReviewMode(boolvalue);
		TANGER_OCX_EnableReviewBar(!boolvalue);
	} catch (E) {
	}
}

//显示/不显示修订文字
function TANGER_OCX_ShowRevisions(boolvalue)
{
	var initReadOnlyFlg = readOnlyFlag;
	try {
		if (initReadOnlyFlg){
			TANGER_OCX_SetReadOnly(false);
		}
		TANGER_OCX_OBJ.ActiveDocument.ShowRevisions = boolvalue;
		//TANGER_OCX_SetReviewMode(boolvalue);
		if (initReadOnlyFlg){
			TANGER_OCX_SetReadOnly(true);
		}
	} catch (E) {
	}
}

//打印/不打印修订文字
function TANGER_OCX_PrintRevisions(boolvalue)
{
	try {
		TANGER_OCX_OBJ.ActiveDocument.PrintRevisions = boolvalue;
		//TANGER_OCX_SetReviewMode(boolvalue);
	} catch (E) {
	}
}

function TANGER_OCX_SaveToServer()
{
	if(!TANGER_OCX_bDocOpen)
	{
		alert(title_office_no_file);
		return;
	}
	
	TANGER_OCX_filename = prompt(title_office_attachment_save_as, title_office_new_doc);
	if ( (!TANGER_OCX_filename))
	{
		TANGER_OCX_filename ="";
		return;
	}
	else if (strtrim(TANGER_OCX_filename)=="")
	{
		alert(title_office_must_file_name);
		return;
	}
	//alert(TANGER_OCX_filename);
	TANGER_OCX_SaveDoc();
}


//设置页面布局
function TANGER_OCX_ChgLayout()
{
 	try
	{
		TANGER_OCX_OBJ.showdialog(5); //设置页面布局
	}
	catch(err){
//		alert(title_error_msg + err.number + ":" + err.description);
	}
	finally{
	}
}

//打印文档
function TANGER_OCX_PrintDoc()
{
	try
	{
		TANGER_OCX_OBJ.printout(true);
	}
	catch(err){
//		alert(title_error_msg + err.number + ":" + err.description);
	}
	finally{
	}
}

function TANGER_OCX_SaveEditToServer()
{
	if(!TANGER_OCX_bDocOpen)
	{
		alert(title_office_no_file);
		return;
	}
	TANGER_OCX_filename = document.all.item("filename").value;
	if ( (!TANGER_OCX_filename))
	{
		TANGER_OCX_filename ="";
		return;
	}
	else if (strtrim(TANGER_OCX_filename)=="")
	{
		alert(title_office_must_file_name);
		return;
	}
	TANGER_OCX_SaveDoc();
}

//允许或禁止文件－>新建菜单
function TANGER_OCX_EnableFileNewMenu(boolvalue)
{
	TANGER_OCX_OBJ.FileNew = boolvalue;
}
//允许或禁止文件－>打开菜单
function TANGER_OCX_EnableFileOpenMenu(boolvalue)
{
	TANGER_OCX_OBJ.FileOpen = boolvalue;
}
//允许或禁止文件－>关闭菜单
function TANGER_OCX_EnableFileCloseMenu(boolvalue)
{
	TANGER_OCX_OBJ.FileClose = boolvalue;
}
//允许或禁止文件－>保存菜单
function TANGER_OCX_EnableFileSaveMenu(boolvalue)
{
	TANGER_OCX_OBJ.FileSave = boolvalue;
}
//允许或禁止文件－>另存为菜单
function TANGER_OCX_EnableFileSaveAsMenu(boolvalue)
{
	TANGER_OCX_OBJ.FileSaveAs = boolvalue;
}
//允许或禁止文件－>打印菜单
function TANGER_OCX_EnableFilePrintMenu(boolvalue)
{
	TANGER_OCX_OBJ.FilePrint = boolvalue;
}
//允许或禁止文件－>打印预览菜单
function TANGER_OCX_EnableFilePrintPreviewMenu(boolvalue)
{
	TANGER_OCX_OBJ.FilePrintPreview = boolvalue;
}

//设置只读
function TANGER_OCX_SetReadOnly(boolvalue)
{
	readOnlyFlag = boolvalue
	var i;
	try
	{
		if (boolvalue) TANGER_OCX_OBJ.IsShowToolMenu = false;
		with(TANGER_OCX_OBJ.ActiveDocument)
		{
			if (TANGER_OCX_OBJ.DocType == 1) //word
			{
				if ( (ProtectionType != -1) &&  !boolvalue)
				{
					Unprotect();
				}
				if ( (ProtectionType == -1) &&  boolvalue)
				{
					Protect(2,true,"");
				}
			}
			else if(TANGER_OCX_OBJ.DocType == 2)//excel
			{
				for(i=1;i<=Application.Sheets.Count;i++)
				{
					if(boolvalue)
					{
						Application.Sheets(i).Protect("",true,true,true);
					}
					else
					{
						Application.Sheets(i).Unprotect("");
					}
				}
				if(boolvalue)
				{
					Application.ActiveWorkbook.Protect("",true);					
				}
				else
				{
					Application.ActiveWorkbook.Unprotect("");
				}
			}
		}
	}
	catch(err){
		//alert(title_error_msg + err.number + ":" + err.description);
	}
	finally{}
}

function TANGER_OCX_OpenDoc(docid)
{
	TANGER_OCX_OBJ = document.all.item("TANGER_OCX");
	if(docid != "")
	{	
		TANGER_OCX_OBJ.OpenFromURL("readdoc.jsp?docid=" + docid);
	}
	else
	{
		TANGER_OCX_OBJ.CreateNew("Word.Document");
	}
}

function TANGER_OCX_OnDocumentOpened(str, obj)
{
	TANGER_OCX_bDocOpen = true;		
}

function TANGER_OCX_OnDocumentClosed()
{
   TANGER_OCX_bDocOpen = false;
}

function TANGER_OCX_SaveDoc()
{
	var newwin,newdoc;

	if(!TANGER_OCX_bDocOpen)
	{
		alert(title_office_no_file);
		return;
	}

	try
	{
	 	//调用控件的SaveToURL函数
		var retHTML = TANGER_OCX_OBJ.SaveToURL
		(
			"uploadFile.jsp",  //此处为uploadedit.jsp
			"EDITFILE",	//文件输入域名称,可任选,不与其他<input type=file name=..>的name部分重复即可
			"", //可选的其他自定义数据－值对，以&分隔。如：myname=tanger&hisname=tom,一般为空
			document.all.newFileName.value, //文件名,此处从表单输入获取，也可自定义
			"actForm" //控件的智能提交功能可以允许同时提交选定的表单的所有数据.此处可使用id或者序号
		); //此函数会读取从服务器上返回的信息并保存到返回值中。
	}
	catch(err){
		alert(title_office_no_save_to_url + err.number + ":" + err.description);
	}
	finally{
	}
}

function addBookMarkByName(bookMarkName) {
	try {
        var Range = TANGER_OCX_OBJ.ActiveDocument.Application.Selection.Range;
	} catch(ex) {
		alert(ex.message);
	}
	try {
		TANGER_OCX_OBJ.ActiveDocument.Bookmarks.Name = "bookMarkName";
	} catch(ex) {
		alert(ex.message);
	}
	try {
		alert(3);
        TANGER_OCX_OBJ.ActiveDocument.Bookmarks.ShowHidden = false;
	} catch(ex) {
		alert(ex.message);
	}
}

function CopyTextToBookMark(inputValue, BookMarkName) {
	try	{	
		alert(inputValue+"="+inputValue+" Bookmarkname="+BookMarkName);
		var bkmkObj = TANGER_OCX_OBJ.ActiveDocument.BookMarks(BookMarkName);	
		if(!bkmkObj)
		{
			alert(title_office_no_exit_mark_name + "\"" + BookMarkName + "\"");
		}
		var saverange = bkmkObj.Range;
		saverange.Text = inputValue;
		TANGER_OCX_OBJ.ActiveDocument.Bookmarks.Add(BookMarkName,saverange);
	}
	catch(ex){
		alert(ex.message);
	}
}

