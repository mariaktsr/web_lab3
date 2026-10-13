package app;

public final class AreaChecker {

    private AreaChecker() {
    }

    public static boolean checkHit(double x, double y, double r) {
        if (x >= 0 && x <= r / 2 && y >= 0 && y <= r) {
            return true;
        }
        if (x >= -r / 2 && x <= 0 && y >= 0 && y <= (r / 2 + x)) {
            return true;
        }
        if (x >= 0 && y <= 0 && (x * x + y * y) <= (r / 2) * (r / 2)) {
            return true;
        }
        return false;
    }
}
