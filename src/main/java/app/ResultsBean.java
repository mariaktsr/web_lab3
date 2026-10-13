package app;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ResultsBean implements Serializable {

    private List<PointCheckResult> results = new ArrayList<>();

    public ResultsBean() {
    }

    public List<PointCheckResult> getResults() {
        return Collections.unmodifiableList(results);
    }

    public void setResults(List<PointCheckResult> results) {
        this.results = results;
    }

    public void addResult(PointCheckResult result) {
        this.results.add(result);
    }

    public void clear() {
        this.results.clear();
    }
}
