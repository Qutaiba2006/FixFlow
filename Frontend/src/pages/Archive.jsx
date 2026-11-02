import { useState, useEffect } from "react";
import axios from "axios";
import ReportCard from "../components/ReportCard";
function Archive() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const archivedReports = reports.filter(
    (report) => report.status === "resolved",
  );

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          "https://fixflow-backend-4hrf.onrender.com/api/reports",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("JWT")}`,
            },
          },
        );
        setReports(response.data);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="container py-3">
      <div className="mb-3">
        <h2 className="fw-bold text-dark mb-2">Archive</h2>
        <p className="text-secondary mb-0">
          View resolved maintenance reports and their details.
        </p>
      </div>
      {loading ? (
        <p className="text-secondary" role="status">
          Loading archived reports...
        </p>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : archivedReports.length === 0 ? (
        <div className="alert alert-info" role="status">
          No resolved reports yet.
        </div>
      ) : (
        <div className="row g-3">
          {archivedReports.map((elem) => {
            return (
              <div key={elem._id} className="col-12 col-md-6 col-xl-4">
                <ReportCard report={elem} showActions={false} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default Archive;
