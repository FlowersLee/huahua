<%@ page import="java.util.Locale"%>
<%@ page import="java.util.Calendar"%>
<%@ page import="java.util.Properties"%>
<%@ page import="java.util.Enumeration"%>
<%

		Properties prop = System.getProperties();
		Enumeration _enum = prop.propertyNames()  ;

		while(_enum.hasMoreElements() ){
			String temp = (String) _enum.nextElement() ;
			out.println(temp + " = " + prop.getProperty(temp) + "<br>");
		}

		//prop.setProperty("file.encoding","GBK");
%>

