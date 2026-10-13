<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="app.ResultsBean" %>
<%@ page import="app.PointCheckResult" %>
<%@ page import="java.util.List" %>
<%
    ResultsBean resultsBean = (ResultsBean) session.getAttribute("resultsBean");
    List<PointCheckResult> history = (resultsBean != null) ? resultsBean.getResults() : java.util.Collections.emptyList();
    PointCheckResult lastResult = (PointCheckResult) session.getAttribute("lastResult");
%>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Лабораторная работа №3 | Коцур М.Д.</title>
    <link rel="stylesheet" href="<%= request.getContextPath() %>/css/style.css">
</head>
<body>
    <div class="header">
        <h1>Лабораторная работа №3</h1>
        <p>ФИО: Коцур Мария Дмитриевна | Группа: P3213 | Вариант: 1707</p>
    </div>

    <div class="container">
        <div class="canvas-section">
            <h2 style="margin-bottom: 15px; color: #2c3e50;">График области</h2>
            <canvas id="areaCanvas" width="500" height="500"></canvas>
            <p class="hint">Если R задан — клик по картинке сразу отправляет точку на проверку</p>
        </div>

        <div class="form-section">
            <h2 style="margin-bottom: 15px; color: #2c3e50;">Ввод координат</h2>
            <form id="pointForm" method="get" action="<%= request.getContextPath() %>/area">
                <div class="form-group">
                    <label for="xInput">X (от -5 до 5):</label>
                    <input type="text" id="xInput" name="x" placeholder="Введите число">
                    <div class="error-msg" id="xError"></div>
                </div>

                <div class="form-group">
                    <label>Y:</label>
                    <div class="y-buttons" id="yButtons">
                        <button type="button" data-y="-5">-5</button>
                        <button type="button" data-y="-4">-4</button>
                        <button type="button" data-y="-3">-3</button>
                        <button type="button" data-y="-2">-2</button>
                        <button type="button" data-y="-1">-1</button>
                        <button type="button" data-y="0" class="active">0</button>
                        <button type="button" data-y="1">1</button>
                        <button type="button" data-y="2">2</button>
                        <button type="button" data-y="3">3</button>
                    </div>
                    <input type="hidden" id="yInput" name="y" value="0">
                </div>

                <div class="form-group">
                    <label for="rInput">R (от 1 до 4):</label>
                    <input type="text" id="rInput" name="r" placeholder="Введите число">
                    <div class="error-msg" id="rError"></div>
                </div>

                <button type="submit" class="submit-btn" id="submitBtn">Проверить</button>
            </form>
        </div>
    </div>

    <div class="results-section">
        <h2 style="margin-bottom: 15px; color: #2c3e50;">Результаты проверок</h2>
        <table class="results-table">
            <thead>
                <tr><th>X</th><th>Y</th><th>R</th><th>Попала?</th><th>Дата и время</th></tr>
            </thead>
            <tbody>
                <% for (PointCheckResult item : history) { %>
                <tr>
                    <td><%= item.getX() %></td>
                    <td><%= item.getY() %></td>
                    <td><%= item.getR() %></td>
                    <td class="<%= item.isHit() ? "hit-yes" : "hit-no" %>"><%= item.isHit() ? "Да" : "Нет" %></td>
                    <td><%= item.getFormattedTimestamp() %></td>
                </tr>
                <% } %>
            </tbody>
        </table>
    </div>

    <script>
        const contextPath = "<%= request.getContextPath() %>";
        const lastPoint = <%
            if (lastResult != null) {
        %>{ x: <%= lastResult.getX() %>, y: <%= lastResult.getY() %>, r: <%= lastResult.getR() %>, hit: <%= lastResult.isHit() %> }<%
            } else {
        %>null<% } %>;
    </script>
    <script src="<%= request.getContextPath() %>/js/form.js"></script>
</body>
</html>
