function RedHead(){
	this.myDocApp = null;
	this.tempDoc = null;
	this.downLoadFileName = null;
	this.DownloadURL = null;

	this.createWord=function(downUrl,TempDownloadURL,tempFileName){
		this.downLoadFileName = tempFileName;
		this.DownloadURL =  downUrl;
		try {
			myDocApp = new ActiveXObject("Word.Application");
			myDocApp.Application.Visible = false; //设置word打开后可见;
			tempDoc  = myDocApp.Documents.Open(TempDownloadURL);//打开word模板
		} catch(exception) {
			alert("createWord:" + exception.message);
		}	
	};
	
	
	//替换正文
	this.replaceText=function(sContent){
	  //downLoadFileName需要取值
		if(this.downLoadFileName.length > 0 ){
			this.replaceContent(sContent);
		}
    };
	
	//插入 书签 二维码 图片
	this.replaceBookmarkWithImg = function(markCode, imgFileName, width, height) {
	    tempDoc.Activate();
	    if (tempDoc.Bookmarks.Exists(markCode)) {
		    var bookMarkSelect = tempDoc.BookMarks(markCode).Range.Select();
			var objSelection = myDocApp.selection;
            var objShape = objSelection.InlineShapes.AddPicture(imgFileName);
			
			objShape.width = width;
			objShape.height = height;			
		}
	}
	
	this.replaceContent = function(sContent){
		try{
			tempDoc.Activate();
			tempDoc.Content.Select();

			myDocApp.selection.Find.ClearFormatting();
			myDocApp.selection.Find.Replacement.ClearFormatting();
			myDocApp.selection.Find.Text = "#DETAILLIST#";
			myDocApp.selection.Find.Execute();
			/**
			if(myDocApp.selection.Find.Found){
			    myDocApp.selection.InsertFile(this.DownloadURL, "",false, false, false);
			}
			*/

			if(myDocApp.selection.Find.Found){
			    myDocApp.selection.Range.InsertBefore(sContent);
			}
			
			/**加粗一级标题
			for (var k=1;k<myDocApp.Activedocument.Paragraphs.Count;k++) {
			    var findFlag = myDocApp.ActiveDocument.Paragraphs(k).Range.Find.Execute("#DETAILLIST#");
				
				if (findFlag) {
					myDocApp.ActiveDocument.Paragraphs(k).Range.Bold = true;
					
					myDocApp.ActiveDocument.Paragraphs(k).Range.InsertBefore(sContent);
				}
			}
			*/
			
			//去掉标签
			//this.repleaceMarker("#Heading2#","");
			this.repleaceMarker("#DETAILLIST#","");
			
			myDocApp.NormalTemplate.Saved = true;
		}catch(exception){
			myDocApp.NormalTemplate.Saved = false;
			alert("replaceContent:" + exception.message);
		}
	};
	
	//替换marker
	this.repleaceMarker = function(source,dest){
		try{
			tempDoc.Content.Select();
			this.replaceSelect(source,dest);
			tempDoc.Shapes.SelectAll();
			this.replaceSelect(source,dest);
		}catch(exception){
			//this.clearResource();
			alert("repleaceMarker:" + exception.message);
		}
	};
	
	this.replaceSelect = function(source,dest){
		myDocApp.selection.Find.ClearFormatting();
		myDocApp.selection.Find.Replacement.ClearFormatting();
		myDocApp.selection.Find.Execute(source, false, false, false, false, false, true, 1, true, dest, 2);
	};
	
	this.clearResource = function(){
		if(tempDoc != null) {
			tempDoc.Close();
			tempDoc = null;
		}

		if(myDocApp != null){
			myDocApp.Quit();
			myDocApp = null;
		}

		this.downLoadFileName = null;
		this.DownloadURL = null;
	}
}


 

