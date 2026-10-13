<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="app.PointCheckResult" %>
<%
    String error = (String) request.getAttribute("error");
    PointCheckResult result = (PointCheckResult) request.getAttribute("result");
%>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Результат проверки | ЛР №3</title>
    <link rel="stylesheet" href="<%= request.getContextPath() %>/css/style.css">
</head>
<body>
    <div class="header">
        <h1>Результат проверки</h1>
        <p>ФИО: Коцур Мария Дмитриевна | Группа: P3213 | Вариант: 1707</p>
    </div>

    <div class="result-container">
        <% if (error != null) { %>
            <p class="error-msg"><%= error %></p>
        <% } else { %>
            <table class="result-table">
                <thead>
                    <tr><th>X</th><th>Y</th><th>R</th><th>Попала в область?</th></tr>
                </thead>
                <tbody>
                    <tr>
                        <td><%= result.getX() %></td>
                        <td><%= result.getY() %></td>
                        <td><%= result.getR() %></td>
                        <td class="<%= result.isHit() ? "hit-yes-big" : "hit-no-big" %>">
                            <%= result.isHit() ? "Да" : "Нет" %>
                        </td>
                    </tr>
                </tbody>
            </table>
        <% } %>
        <a class="back-link" href="<%= request.getContextPath() %>/area">Назад к форме</a>
    </div>
</body>
</html>
