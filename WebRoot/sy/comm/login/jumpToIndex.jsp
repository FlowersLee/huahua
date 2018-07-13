<%
    final String CONTEXT_PATH = request.getContextPath();
%>	
<script>
	//####<%=System.getProperty("servName")%>####
	var login = "LOGIN";
	var url = "<%=CONTEXT_PATH%>/";
	self.parent.window.location.href = url; 
</script>
