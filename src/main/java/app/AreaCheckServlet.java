package app;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

@WebServlet(name = "AreaCheckServlet")
public class AreaCheckServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        Double x = parseDouble(request.getParameter("x"));
        Double y = parseDouble(request.getParameter("y"));
        Double r = parseDouble(request.getParameter("r"));

        String error = validate(x, y, r);

        HttpSession session = request.getSession();
        ResultsBean resultsBean = (ResultsBean) session.getAttribute("resultsBean");
        if (resultsBean == null) {
            resultsBean = new ResultsBean();
            session.setAttribute("resultsBean", resultsBean);
        }

        if (error == null) {
            boolean hit = AreaChecker.checkHit(x, y, r);
            PointCheckResult result = new PointCheckResult(x, y, r, hit);
            resultsBean.addResult(result);
            session.setAttribute("lastResult", result);
            request.setAttribute("result", result);
        }

        request.setAttribute("error", error);
        request.getRequestDispatcher("/WEB-INF/views/result.jsp").forward(request, response);
    }

    private String validate(Double x, Double y, Double r) {
        if (x == null || x < -5 || x > 5) {
            return "X должен быть числом от -5 до 5";
        }
        if (y == null || y < -5 || y > 3) {
            return "Y должен быть числом от -5 до 3";
        }
        if (r == null || r < 1 || r > 4) {
            return "R должен быть числом от 1 до 4";
        }
        return null;
    }

    private Double parseDouble(String s) {
        if (s == null || s.trim().isEmpty()) {
            return null;
        }
        try {
            return Double.parseDouble(s.trim().replace(',', '.'));
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
