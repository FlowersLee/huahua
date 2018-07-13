/*
	是否指定的文件的大小大于参数filesize的值。filesize的单位是字节。
*/
	function compareFileSize(fileName,filesize){
		if(getFileSize(fileName) > filesize){
			return true;
		}
		return false;
	}

/*
	取得文件的尺寸
*/
	function getFileSize(filespec){
		var fileObject = new ActiveXObject("Scripting.FileSystemObject");
		var file = fileObject.getFile(filespec);
		return file.size;
	}

	/*
    取得文件扩展名
*/
    function getFileExtName(fileName){
        var name = "";
		fileName = getFileName(fileName);
		if(fileName.length > 0){
			if(fileName.indexOf(".")<0){
				fileName = "."+fileName;
			}
			name = fileName.substr(fileName.lastIndexOf(".")).toLowerCase();
		}
		return name;
    }
	
/*
    取得不带扩展名的文件名
*/
    function getFileNameWithoutExt(fileName){
        var name = "";
		fileName = getFileName(fileName);
		if(fileName.length > 0 && fileName.indexOf(".")>0){
			name = fileName.substring(0,fileName.indexOf("."));
		}else{
			name = fileName;
		}

        return name;
    }
	
	/*
	取得文件的名称，去掉了文件所属的路径
	*/
	function getFileName(fileName){
		var name = "";
		if(fileName.lastIndexOf("\\")>0){
			name = fileName.substring(fileName.lastIndexOf("\\")+1,fileName.length);
		}else{
			name = fileName;
		}

		return name;
	}

/*
	取得文件的路径
*/
    function getFilePath(fileName){
        var name = "";
        if(fileName.lastIndexOf("\\")>0){
            name = fileName.substring(0,fileName.lastIndexOf("\\"));
        }else{
            name = "";
        }
        return name;
    }

/**
*	去掉文件名中不能包含的特殊字符。如：\/:*?"<>|
**/		
	function escapeSpecCharInFileName(fileName){
		var rtnVal = fileName.replace("\\","");
		rtnVal = fileName.replace("/","");
		rtnVal = fileName.replace(":","：");
		rtnVal = fileName.replace("*","、");
		rtnVal = fileName.replace("?","？");
		rtnVal = fileName.replace("<","《");
		rtnVal = fileName.replace(">","》");
		rtnVal = fileName.replace("|","，");
		rtnVal = fileName.replace("\"","’");
		
		return rtnVal;
	}
	
	/**
		复制文件
	**/
	function copyFile(srcFile,destFile){
	  var fso = new ActiveXObject("Scripting.FileSystemObject");
	  fso.CopyFile(srcFile,destFile);
	}
	
	/**
	*	删除文件
	**/
	function delFile(file){
	  var fso = new ActiveXObject("Scripting.FileSystemObject");
	  fso.DeleteFile(file);	
	}
	
	/**
	*	移动文件的位置
	*/	
	function moveFile(srcFile,destFile){
	  var fso = new ActiveXObject("Scripting.FileSystemObject");
	  fso.MoveFile(srcFile,destFile);	
	}