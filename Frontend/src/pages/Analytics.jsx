import { useState, useEffect } from "react";
import axios from "axios";
function Analytics() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const statistics = [
    { label: "Total Reports", value: summary?.totalReports, color: "primary" },
    { label: "Open Reports", value: summary?.openReports, color: "warning" },
    { label: "In Progress", value: summary?.inProgressReports, color: "primary" },
    { label: "Resolved Reports", value: summary?.resolvedReports, color: "success" },
  ];

  useEffect(() => {
    if (!isAdmin) return;
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/analytics/summary",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("JWT")}`,
            },
          },
        );
        setSummary(response.data || null);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [isAdmin]);

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-2">Analytics Dashboard</h2>
        <p className="text-secondary mb-0">
          See the current status of maintenance reports across campus.
        </p>
      </div>
      {!isAdmin ? (
        <div className="alert alert-danger" role="alert">
          This page is only available to admins.
        </div>
      ) : loading ? (
        <p className="text-secondary" role="status">
          Loading analytics...
        </p>
      ) : error ? (
        <div className="alert alert-danger text-break" role="alert">
          {error}
        </div>
      ) : !summary || typeof summary.totalReports !== "number" ? (
        <div className="alert alert-info" role="status">
          No analytics data is available.
        </div>
      ) : (
        <div>
          {summary.totalReports === 0 && (
            <div className="alert alert-info" role="status">
              No maintenance reports have been submitted yet.
            </div>
          )}
          <div className="row g-3">
            {statistics.map((statistic) => {
              return (
                <div key={statistic.label} className="col-12 col-sm-6 col-xl-3">
                  <div className="card bg-white shadow-sm h-100">
                    <div className="card-body p-4">
                      <h5 className="card-title text-secondary mb-3">
                        {statistic.label}
                      </h5>
                      <p className={`display-6 fw-bold mb-0 text-${statistic.color}`}>
                        {statistic.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="card bg-white shadow-sm mt-4">
            <div className="card-body p-4">
              <h4 className="fw-bold text-dark mb-4">Report Status Comparison</h4>
              {statistics.map((statistic, index) => {
                if (index === 0) return null;
                const percentage = summary.totalReports > 0
                  ? Math.round((statistic.value / summary.totalReports) * 100)
                  : 0;
                return (
                  <div key={statistic.label} className="mb-3">
                    <div className="d-flex flex-wrap justify-content-between gap-2 mb-2">
                      <span className="fw-semibold">{statistic.label}</span>
                      <span className="text-secondary">
                        {statistic.value} ({percentage}%)
                      </span>
                    </div>
                    <div
                      className="progress"
                      role="progressbar"
                      aria-label={statistic.label}
                      aria-valuenow={percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className={`progress-bar bg-${statistic.color}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Analytics;
