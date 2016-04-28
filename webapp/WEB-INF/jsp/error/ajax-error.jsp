<%@ page contentType="application/json;charset=UTF-8" language="java"%>
<%Exception e = (Exception) request.getAttribute("ex");%>
{"error":"<%=e.getClass().getSimpleName()%>","detail":"<%=e.getMessage()%>"}