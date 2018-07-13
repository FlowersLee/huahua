function RedHead(){

	this.myDocApp = null;
	this.targetDoc = null;
	this.tempDoc = null;
	this.downLoadFileName = null;
	this.DownloadURL = null;

	
	this.createWord=function(downUrl,TempDownloadURL,tempFileName){
		this.downLoadFileName = tempFileName;
		this.DownloadURL =  downUrl;
		try {
			myDocApp = new ActiveXObject("Word.Application");
			myDocApp.Application.Visible = false; //设置word打开后可见;
			myDocApp.DisplayAlerts = 0;
			tempDoc  = myDocApp.Documents.Open(TempDownloadURL,false,false,false);//打开word模板
			
		} catch(exception) {
			alert("createWord:" + exception.message);
			return false;
		}
		
		return true;
	};
	
	
	//替换正文
	this.replaceText=function(){
		//downLoadFileName需要取值
		if(this.downLoadFileName.length > 0 ){
			this.replaceContent();
		}
    };
	
	this.replaceContent = function(){
		try{
			myDocApp.DisplayAlerts = 0;
			targetDoc = myDocApp.Documents.Open(this.DownloadURL,false,false,false);
			targetDoc.acceptAllRevisions()
			targetDoc.Content.Select();
			tempDoc.Activate();
			var j;
			var sharpName;
			tempDoc.Content.Select();
			myDocApp.selection.Find.ClearFormatting();
			myDocApp.selection.Find.Replacement.ClearFormatting();
			myDocApp.selection.Find.Text = "#text#";
			myDocApp.selection.Find.Execute();
			var templateFont;
			if(myDocApp.selection.Find.Found){
				this.copyContent(targetDoc,tempDoc);
			}else{
				
				//var shapeCount = tempDoc.Shapes.count;
			//	for(j = 0; j < shapeCount; j++){
				//	sharpName = tempDoc.Shapes(j).Name().substring(0,8);
				//	if(sharpName == "Text Box"){
						tempDoc.Shapes.SelectAll();
						myDocApp.selection.Find.ClearFormatting();
						myDocApp.selection.Find.Replacement.ClearFormatting();
						myDocApp.selection.Find.Text = "#text#";
						myDocApp.selection.Find.Execute();
						if(myDocApp.selection.Find.Found){
							this.copyContent(targetDoc,tempDoc);
						}
				//	}
			//	}
			}
			
			myDocApp.NormalTemplate.Saved = true;
			//targetDoc.Close(); 
			//wdDoNotSaveChanges;			
			//targetDoc = null;
		}catch(exception){
			myDocApp.NormalTemplate.Saved = true;
			alert("replaceContent:" + exception.message);
		}
	};
	
	this.copyContent = function(srcWordDoc,dstWordDoc){
		var templateFont;
		if(this.ifChangeFont){
			templateFont = dstWordDoc.Application.selection.Font;
		}
		srcWordDoc.Activate();
		if(this.ifChangeFont){
			srcWordDoc.Application.selection.Font = templateFont;
		}
		srcWordDoc.Application.selection.Copy();
		dstWordDoc.Activate();
		dstWordDoc.Application.selection.Paste();
	};
	
	//替换marker
	this.repleaceMarker = function(source,dest){
		try{
			tempDoc.Content.Select();
			this.replaceSelect(source,dest);
			tempDoc.Shapes.SelectAll();
			this.replaceSelect(source,dest);
			var shapeCount = tempDoc.Shapes.count;
			for(var j = 1; j <= shapeCount; j++){
				var sharpName = tempDoc.Shapes.item(j).Name.substring(0,8);
				if(sharpName == "Text Box"){
					tempDoc.Shapes(j).Select();
					this.replaceSelect(source,dest);
				}
			}
		}catch(exception){
			alert("repleaceMarker:" + exception.message);
		}
	};
	
	this.repleaceBigValMarker = function(source, dest){
		var maxSize = 100;
		var count = Math.floor(dest.length/maxSize);
		if(count > 1){
			for(var i=0;i<=count;i++){
				var strDst = "";
				if(i==count){
					strDst = dest.substring(i * maxSize) ;
				}else{
					strDst = dest.substring(i * maxSize,(i+1) * maxSize) + source;
				}
				this.replaceSelect(source,strDst);				
			}
		}else{
			this.replaceSelect(source,dest);
		}
	}
	
	this.replaceSelect = function(source,dest){
		myDocApp.selection.Find.ClearFormatting();
		myDocApp.selection.Find.Replacement.ClearFormatting();
		myDocApp.selection.Find.Execute(source, false, false, false, false, false, true, 1, true, dest, 2);
	};
	
	this.clearResource = function(){
		if(targetDoc != null) {
			targetDoc.Close();
			targetDoc = null;
			
		}	
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


 

